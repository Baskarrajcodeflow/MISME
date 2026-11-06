import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import * as Papa from 'papaparse';
import { ApiServiceService } from '../../../product/api-service/api-service.service';
interface CsvLine {
  lineNumber: number;
  content: string[];
  isValid: boolean;
  errors: string[];
}

@Component({
  selector: 'app-validate-file',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validate-file.component.html',
  styleUrl: './validate-file.component.css'
})
export class ValidateFileComponent {
   // UI State
   totalLines: number = 0;
   processedLines: number = 0;
   errorCount: number = 0;
   errors: CsvLine[] = [];
   isProcessing: boolean = false;
   isUploadComplete: boolean = false;
 
   // Valid Data to send
   validData: any[] = [];
 
   // Expected header
   expectedHeader: string[] = ['name', 'account', 'amount', 'email', 'phone#'];
  selectedFile!: File;
 
   constructor(private http: HttpClient,private apiService:ApiServiceService) {}
 
   onFileSelected(event: any): void {
     const file: File = event.target.files[0];
     this.selectedFile = event.target.files[0];
     const reader = new FileReader();
     reader.readAsDataURL(file);
     console.log(file);
 
     if (file) {
       this.resetState();
       this.isProcessing = true;
 
       Papa.parse(file, {
         header: true,  // Expect header row in the CSV file
         skipEmptyLines: true,
         step: (results:any, parser) => {
           if (this.processedLines === 0) {
             // Validate header
             const header = results.meta.fields;
             if (!this.isHeaderValid(header)) {
               parser.abort(); // Stop processing if header is invalid
               this.errors.push({
                 lineNumber: 1,
                 content: header || [],
                 isValid: false,
                 errors: ['Invalid header. Expected: ' + this.expectedHeader.join(', ')]
               });
               this.errorCount++;
               this.isProcessing = false;
               this.isUploadComplete = true;
               return;
             }
           } else {
            console.log(results)
             // Process subsequent lines as data
             const lineNumber = this.processedLines + 1;
             const lineContent: string[] = results.data;
             const csvLine: CsvLine = {
               lineNumber: lineNumber,
               content: lineContent,
               isValid: true,
               errors: []
             };

             console.log(lineContent,'length');
             
             if (lineContent.length !== 5) {
               csvLine.isValid = false;
               csvLine.errors.push('Invalid number of columns. Expected 5 columns.');
             } else {
               // Validate 'name' (non-empty string)
               if (!lineContent[0] || typeof lineContent[0] !== 'string' || lineContent[0].trim() === '') {
                 csvLine.isValid = false;
                 csvLine.errors.push('Invalid name. Name cannot be empty.');
               }
 
               // Validate 'account' (non-empty string)
               if (!lineContent[1] || typeof lineContent[1] !== 'string' || lineContent[1].trim() === '') {
                 csvLine.isValid = false;
                 csvLine.errors.push('Invalid account. Account cannot be empty.');
               }
 
               // Validate 'amount' (must be a number)
               const amountRegex = /^\d+(\.\d{1,2})?$/;
               if (!amountRegex.test(lineContent[2])) {
                 csvLine.isValid = false;
                 csvLine.errors.push('Invalid amount. Amount must be a valid number.');
               }
 
               // Validate 'email'
              //  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              //  if (!emailRegex.test(lineContent[3])) {
              //    csvLine.isValid = false;
              //    csvLine.errors.push('Invalid email format.');
              //  }
 
               // Validate 'phone#' (basic phone number format)
               const phoneRegex = /^\d{3}-\d{4}$/;
               if (!phoneRegex.test(lineContent[4])) {
                 csvLine.isValid = false;
                 csvLine.errors.push('Invalid phone number format. Expected format: 555-1234.');
               }
             }
 
             if (csvLine.isValid) {
               this.validData.push(lineContent);
             } else {
               this.errors.push(csvLine);
               this.errorCount++;
             }
           }
 
           this.processedLines++;
         },
         complete: () => {
           this.isProcessing = false;
           this.isUploadComplete = true;
         },
         error: (error) => {
           console.error('Error parsing CSV:', error);
           this.isProcessing = false;
         }
       });
     }
   }
 
   isHeaderValid(header: string[] | undefined): boolean {
     if (!header) {
       return false;
     }
     return JSON.stringify(header) === JSON.stringify(this.expectedHeader);
   }
 
   resetState(): void {
     this.totalLines = 0;
     this.processedLines = 0;
     this.errorCount = 0;
     this.errors = [];
     this.validData = [];
     this.isUploadComplete = false;
   }
 
   sendDataToBackend(): void {
     // Replace with your backend API endpoint
     const apiUrl = 'https://your-backend-api.com/upload';
 
     this.http.post(apiUrl, { data: this.validData }).subscribe(
       (response) => {
         console.log('Data successfully sent to backend:', response);
       },
       (error) => {
         console.error('Error sending data to backend:', error);
       }
     );
   }


   uploadFile(){

    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      // Make the POST request with the form data
      this.apiService.kycProofUpload(formData,204).subscribe((res)=>{
        
      })
  }
  }
}
