// csv-upload.component.ts
import {
  Component,
  effect,
  EventEmitter,
  Output,
  Signal,
  signal,
  ViewChild,
  WritableSignal,
} from "@angular/core";
import { CdkDragDrop, DragDropModule } from "@angular/cdk/drag-drop";
import { UploadService } from "./upload.service";
import { FormsModule } from "@angular/forms";
import { CommonModule, NgFor, NgIf } from "@angular/common";
import { ApiServiceService } from "../../../product/api-service/api-service.service";
import Papa from "papaparse";
import { ValidateFileComponent } from "../validate-file/validate-file.component";
import { HttpClient } from "@angular/common/http";
import { MatIconModule } from "@angular/material/icon";
import { DataSharingService } from "../../../product/dataSharing/data-sharing.service";
import { LoaderComponent } from "../../../loader/loader.component";
interface CsvLine {
  lineNumber: number;
  content: string[];
  isValid: boolean;
  errors: string[];
}

@Component({
  standalone: true,
  selector: "app-csv-upload",
  templateUrl: "./csv-upload.component.html",
  styleUrls: ["./csv-upload.component.css"],
  imports: [
    FormsModule,
    DragDropModule,
    NgIf,
    NgFor,
    CommonModule,
    ValidateFileComponent,
    MatIconModule,
    LoaderComponent,
  ],
})
export class CsvUploadComponent {
  // UI State
  totalLines: number = 0;
  processedLines: number = 0;
  errorCount: number = 0;
  errors: CsvLine[] = [];
  isProcessing: boolean = false;
  isUploadComplete: boolean = false;
  isLoading: boolean = false;
  // Valid Data to send
  validData: any[] = [];

  // Expected header
  expectedHeader: string[] = ["name", "account", "amount", "email", "phone#"];
  selectedFile!: File | any;
  @Output() fileUploaded = new EventEmitter<boolean>();
  // Signals for state management
  selectedFormat: WritableSignal<string> = signal("");
  isUploading: WritableSignal<boolean> = signal(false);

  // Notification signal
  notification: WritableSignal<{ message: string; type: "success" | "error" }> =
    signal({ message: "", type: "success" });

  // Drag-over state
  isDragOver: WritableSignal<boolean> = signal(false);

  // Upload progress signal from the service
  uploadProgress: Signal<number> = signal(0);

  // Available file formats
  fileFormats: string[] = ["CSV", "XLSX", "JSON"];
  corpId: any;
  refresh!: boolean;
  uploadView!: boolean;
  fileUploadrespData: any;
  activeTab: number = 1;
  reuploadId: any;

  constructor(
    private uploadService: UploadService,
    private apiService: ApiServiceService,
    private http: HttpClient,
    private dataSharing: DataSharingService
  ) {
    this.dataSharing.salaryProcessingIdData$.subscribe((res) => {
      // console.log(res,'SalaryRes');
      this.corpId = res?.id;
    });
    dataSharing.setFlagData$.subscribe((res) => {
      // console.log(res);

      if (res == true) {
        this.selectedFile = null;
        this.fileInput.nativeElement.value = "";
        this.errors = [];
        this.isUploadComplete = false;
        this.fileUploadrespData = false;
      }
      if (this.selectedFile) {
        this.selectedFile = File;
      }
      this.refresh = res;
    });
    // Initialize uploadProgress after uploadService is injected
    this.uploadProgress = this.uploadService.getProgress();

    // Effect to monitor upload progress and handle completion
    effect(() => {
      const progress = this.uploadProgress();
      if (progress === 100) {
        this.showNotification("Upload successful!", "success");
        this.isUploading.set(false);
        // this.selectedFile.set(null);
        this.selectedFormat.set("");
        // Reset progress after a short delay
        setTimeout(() => {
          this.uploadService.cancelUpload();
        }, 1000);
      }
    });
  }

  /**
   * Handles file selection via the file input.
   * @param event The file input change event.
   */
  fileToUpload!: File;
  array: any[] = [];
  resetState(): void {
    this.totalLines = 0;
    this.processedLines = 0;
    this.errorCount = 0;
    this.errors = [];
    this.validData = [];
    this.isUploadComplete = false;
  }
  isHeaderValid(header: string[] | undefined): boolean {
    if (!header) {
      return false;
    }
    return JSON.stringify(header) === JSON.stringify(this.expectedHeader);
  }
  setActiveTab(tabNumber: number) {
    this.activeTab = tabNumber;
  }
  getValue(row: any, possibleKeys: string[]): string {
    for (const key of Object.keys(row)) {
      if (possibleKeys.includes(this.normalizeKey(key))) {
        return row[key];
      }
    }
    return '';
  }
  normalizeKey(key: string): string {
    return key.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  onFileSelected(event: any): void {
    this.array = [];
    const file: File = event.target.files[0];
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    if (file) {
      this.resetState();
      this.isProcessing = true;
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
  
        step: (results: any) => {
          const lineNumber = this.processedLines + 2;
          const row = results.data;
  
          this.array.push(row);
          console.log(this.array, '_+');
          const name = this.getValue(row, ['name']);
          const account = this.getValue(row, ['account']);
          const amount = this.getValue(row, ['amount']);
          const email = this.getValue(row, ['email']);
          const phone = this.getValue(row, ['phone#']);
  
          const csvLine: CsvLine = {
            lineNumber,
            content: row,
            isValid: true,
            errors: [],
          };
  
          /** -------- VALIDATIONS -------- */
  
          // Name
          if (!name || !/^[A-Za-z\s]+$/.test(name)) {
            csvLine.isValid = false;
            csvLine.errors.push('Invalid name');
          }
  
          // Account
          if (!account || !/^\d+$/.test(account)) {
            csvLine.isValid = false;
            csvLine.errors.push('Invalid account number');
          }
  
          // Amount
          if (!amount || !/^\d+(\.\d{1,10})?$/.test(amount)) {
            csvLine.isValid = false;
            csvLine.errors.push('Invalid amount');
          }
  
          // Email (optional)
          // if (email) {
          //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          //   if (!emailRegex.test(email)) {
          //     csvLine.isValid = false;
          //     csvLine.errors.push('Invalid email');
          //   }
          // }
  
          // Phone (optional)
          if (phone && !/^\d+$/.test(phone)) {
            csvLine.isValid = false;
            csvLine.errors.push('Invalid phone number');
          }
  
          /** -------- RESULT -------- */
  
          if (csvLine.isValid) {
            this.validData.push(row); // keep OBJECT
          } else {
            this.errors.push(csvLine);
            this.errorCount++;
          }
  
          this.processedLines++;
        },
  
        complete: () => {
          this.complete();
          this.isProcessing = false;
          this.isUploadComplete = true;
        },
  
        error: (error) => {
          console.error('Error parsing CSV:', error);
          this.isProcessing = false;
        },
      });
    }
  }
  tableHeaders: string[] = [];

  complete() {
    if (this.array.length) {
      console.log(this.array, '+++');

      this.tableHeaders = Object.keys(this.array[0]);
    }
    this.isProcessing = false;
    this.isUploadComplete = true;
  }

  /**
   * Handles files dropped via drag-and-drop.
   * @param event The drop event.
   */
  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file: File = event.dataTransfer.files[0];
      this.validateFile(file);
      event.dataTransfer.clearData();
    }
  }

  /**
   * Handles drag over event to allow drop.
   * @param event The drag over event.
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  /**
   * Handles drag leave event to reset drag-over state.
   * @param event The drag leave event.
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
  }

  /**
   * Validates the selected file's type and size.
   * @param file The file to validate.
   */
  validateFile(file: File): void {
    const validTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/json",
    ];
    const maxSize = 140 * 1024; // 140KB

    if (!validTypes.includes(file.type)) {
      this.showNotification("Invalid file type.", "error");
      return;
    }

    if (file.size > maxSize) {
      this.showNotification("File size exceeds 140KB.", "error");
      return;
    }

    this.showNotification("File is ready for upload.", "success");
  }

  formattedDuplicateAccounts: any;
  formatDuplicateAccounts(): void {
    const accounts = this.fileUploadrespData.duplicateAccounts;
    if (accounts) {
      this.formattedDuplicateAccounts = Object.entries(accounts)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
      console.log(this.formattedDuplicateAccounts);
    } else {
      this.formattedDuplicateAccounts = null;
    }
  }
  agentPhoto_img_0: any;
  uploadFile(): void {
    if (this.selectedFile && !this.refresh) {
      const formData = new FormData();
      formData.append("file", this.selectedFile);
      this.isLoading = true;
      this.uploadView = true;
      this.apiService.kycProofUpload(formData, this.corpId).subscribe({
        next: (res) => {
          if (res?.responseCode == 200) {
            this.reuploadId = res?.error;
            this.uploadView = false;
            this.isLoading = false;
            alert("File Upload Success");
            this.fileUploadrespData = res?.data;
            this.formatDuplicateAccounts();
            // console.log(this.fileUploadrespData);
            this.dataSharing.reuploadFileData(true);
          } 
          else if(res?.responseCode == 0) {
            this.isLoading = false;
            this.uploadView = false;
            alert(res?.error);
          }else{
            this.isLoading = false;
            this.uploadView = false;
          }
        },
        error: () => {
          this.isLoading = false;
          this.uploadView = false;
          alert("Error While Uploading File");
        },
      });
    }

    if (this.selectedFile && this.refresh == true) {
      const formData = new FormData();
      formData.append("file", this.selectedFile);
      this.apiService.reUploadFile(formData, this.reuploadId).subscribe({
        next: (res) => {
          this.refresh = false;
          if (res?.responseCode == 200) {
            alert("File Upload Success");
          } else {
            alert(res?.error);
          }
        },
        error: () => {
          alert("Error While Uploading File");
        },
      });
    }
  }

  /**
   * Displays a notification message.
   * @param message The message to display.
   * @param type The type of notification ('success' | 'error').
   */
  showNotification(message: string, type: "success" | "error"): void {
    this.fileUploaded.emit(type == "success");
    // this.notification.set({ message, type });

    // Automatically clear notification after 3 seconds
    setTimeout(() => {
      this.clearNotification();
    }, 3000);
  }

  /**
   * Clears the notification message.
   */
  clearNotification(): void {
    this.notification.set({ message: "", type: "success" });
  }
  sendDataToBackend(): void {
    // Replace with your backend API endpoint
    const apiUrl = "https://your-backend-api.com/upload";

    this.http.post(apiUrl, { data: this.validData }).subscribe(
      (response) => {
        console.log("Data successfully sent to backend:", response);
      },
      (error) => {
        console.error("Error sending data to backend:", error);
      }
    );
  }

  @ViewChild("fileInput") fileInput!: any;
  reuploadFile() {
    this.selectedFile = null;
    this.fileInput.nativeElement.value = "";
    this.errors = [];
    this.isUploadComplete = false;
  }
}
