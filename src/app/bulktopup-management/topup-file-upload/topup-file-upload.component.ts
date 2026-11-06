import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiServiceService } from '../../product/api-service/api-service.service';
import { DataSharingService } from '../../product/dataSharing/data-sharing.service';
import { UploadService } from '../../salary-processing/bulk-salary-upload/csv-upload/upload.service';
import { LoaderComponent } from "../../loader/loader.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { MatIconModule } from '@angular/material/icon';
import * as XLSX from 'xlsx';
interface CsvLine {
  lineNumber: number;
  content: string[];
  isValid: boolean;
  errors: string[];
}
@Component({
  selector: 'app-topup-file-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent,NgSelectModule,MatIconModule],
  templateUrl: './topup-file-upload.component.html',
  styleUrl: './topup-file-upload.component.css'
})
export class TopupFileUploadComponent {
  selectedFormat: WritableSignal<string> = signal("");
  isUploading: WritableSignal<boolean> = signal(false);
  isDragOver: WritableSignal<boolean> = signal(false);
  fileFormats: string[] = ["CSV", "XLSX", "JSON"];
  selectedFile: any;
  corpData: any;
  uploadView!: boolean;
  isLoading: boolean = false;
array: any[]=[]
  // Valid Data to send
  validData: any[] = [];

  // Expected header
  expectedHeader: string[] = ["amount", "phone#"];
  fileUploadFlag: boolean = false
  userPrivileges: any;
  userPrevilages1: any;
  privilege: any;
 constructor(
    private uploadService: UploadService,
    private apiService: ApiServiceService,
    private http: HttpClient,
    private dataSharing: DataSharingService
  ) {}
  ngOnInit(): void {
    const privilegesData = sessionStorage.getItem("privileges");
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "User Management") {
          if (item.subComponent?.subComponentName == "Corporate")
            this.privilege = item;
        }
      }
    }
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAuthCorpData()
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
    resetState(): void {
      this.totalLines = 0;
      this.processedLines = 0;
      this.errorCount = 0;
      this.errors = [];
  
    }
    parsedData: any[] = []; // To store the formatted rows for display

    // This method processes the uploaded file and parses it
    onFileSelected(event: any): void {
      this.parsedData = []
      this.array = []
      const file: File = event.target.files[0];
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      // console.log(file);
  
      if (file) {
        this.resetState(); // Reset state, presumably to clear any previous data
        const reader = new FileReader();
  
        reader.onload = (e: any) => {
          const binaryData = e.target.result;
          const workbook = XLSX.read(binaryData, { type: 'binary' });
  
          // Assuming the first sheet is the one you want
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
  
          // Convert sheet to JSON (array of arrays)
          const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
          // Process the data
          jsonData.forEach((lineContent: any, index: number) => {
            if (index === 0) {
              // Skip the header row
              return;
            }
  
            const lineNumber = index + 1;
            const csvLine: CsvLine = {
              lineNumber,
              content: lineContent,
              isValid: true,
              errors: [],
            };
  
            // Log the line content for debugging
            console.log(`Processing line ${lineNumber}:`, lineContent);
  
            // Extract and validate Amount and Phone columns
            const amount = lineContent[0]?.toString().trim() || ''; // Assuming Amount is in column 0
            const phone = lineContent[1] ? (Array.isArray(lineContent[1]) ? lineContent[1].join('') : lineContent[1]) : ''; // Assuming Phone is in column 1
  
            // Validate Amount: Should be a valid number
            const amountRegex = /^\d+$/;
            if (!amountRegex.test(amount)) {
              csvLine.isValid = false;
              csvLine.errors.push("Invalid amount. Amount must be a valid number.");
            }
  
            // Validate Phone Number: Should be a valid number
            const phoneRegex = /^\d+$/;
            if (!phoneRegex.test(phone)) {
              csvLine.isValid = false;
              csvLine.errors.push("Invalid phone number format. Only numbers are allowed.");
            }
  
            // Collect valid data or log errors
            if (csvLine.isValid) {
              // Format the data and push it into parsedData
              this.parsedData.push({
                lineNumber,
                amount,
                phone
              });
              this.array.push({
              amount,
              phone
              })
            } else {
              this.errors.push(csvLine);
              this.errorCount++;
            }
  
            this.processedLines++;
          });
  
          console.log('Parsed Data:', this.parsedData); // Log the formatted data for debugging
          console.log('Errors:', this.errors); // Log any validation errors
        };
  
        reader.readAsBinaryString(file);
      }
    }
  

      uploadFile(): void {
        if (this.selectedFile) {
            // const formData = new FormData();
            // formData.append("file", this.selectedFile);
            // formData.append("serviceName", "BULK_TOPUP");
            // formData.append("uploadedBy", sessionStorage.getItem('senderId') || "");
            // formData.append("walletId", this.corpData?.walletId || "");
    
            // console.log('FormData content:');
            // formData.forEach((value, key) => console.log(`${key}: ${value}`));
            let  serviceName = 'BULK_TOPUP';
           let  uploadedBy =sessionStorage.getItem('loginUserId') || "";
           let  walletId = this.corpData?.walletId || "";
            let body=this.array
            
            this.isLoading = true;
            this.uploadView = true;
            this.apiService.bulkTopupFileUpload(body,serviceName,uploadedBy,walletId).subscribe({
              next: (res) => {
                this.isLoading = false;
                this.uploadView = false;
                
                if (res?.responseCode === 200) {
                  alert("File Upload Success");
                  this.fileUploadFlag = true
                        this.fileUploadFlag = true
                    } else if (res?.responseCode === 0) {
                        alert('File Already Uploaded.');
                    } else {
                        alert("Error in File Upload Response");
                    }
                },
                error: () => {
                    this.isLoading = false;
                    this.uploadView = false;
                    alert("Error While Uploading File");
                },
            });
        } else {
            alert("No file selected!");
        }
    }
    
      allcorpData: any;
      cities: any[] = [];

      getAuthCorpData(){
        this.isLoading = true
        this.apiService.getAuthorizedCorporate().subscribe({
          next: (res) => {
        this.isLoading = false
            this.allcorpData = res;
            this.cities = res.map((user: any) => ({
              id: user.id,
              name: `${user.firstName} ${user.lastName} / ${user?.walletAccount?.accountNo}`,
              accountNumber: user.walletAccount?.accountNo,
              email: user?.email,
              firstName: user?.firstName,
              lastName: user?.lastName,
              phone: user?.phone,
              walletStatus: user?.walletAccount?.walletStatus,
              walletId: user?.walletAccount?.id,
              createdOn:user?.createdOn,
              gender:user?.gender,
              corpType:user?.corpType
            }));
            console.log(this.cities, 'cities');
          },error:()=>{
        this.isLoading = false
          }
        });
      }

      selectedCity: any;
      onCityChange(selectedCityId: any) {
        console.log(selectedCityId);
        this.corpData = selectedCityId
    
    
      }

      selectedCorporate: any = null;
      customSearchFn(term: string, item: any) {
        console.log(term, item);
        item.name = item.name.replace(',', '');
        term = term.toLowerCase();
        return (
          item.name.toLowerCase().includes(term) || 
          item.accountNumber?.toLowerCase().includes(term) 
        );
      }
      activeTab: number = 1;
      totalLines: number = 0;
      processedLines: number = 0;
      errorCount: number = 0;
      errors: CsvLine[] = [];
      setActiveTab(tabNumber: number) {
        this.activeTab = tabNumber;
      }
   
  @ViewChild("fileInputNew") fileInputNew!: any;

      reload(){
        this.selectedFile = null;
        this.fileInputNew.nativeElement.value = "";
        this.errors = [];
      }

      refresh(){
        this.selectedFile = null;
        this.fileInputNew.nativeElement.value = "";
        this.errors = [];
        this.corpData = false
        this.selectedCity = null
      }
}
