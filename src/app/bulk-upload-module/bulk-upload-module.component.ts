import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../product/api-service/api-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalaryProcessDialogComponent } from './salary-process-dialog/salary-process-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-bulk-upload-module',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './bulk-upload-module.component.html',
  styleUrl: './bulk-upload-module.component.css'
})
export class BulkUploadModuleComponent implements OnInit {
corporateData: any;
selectedFile!: File | any;
value:any
  serviceName: any;
  uploadedBy: any;
  bulkSalaryData: any;
  userPrivileges: any;
  userPrevilages1: any;
  privilege: any;
constructor(private apiService:ApiServiceService,
  private dialog: MatDialog,
 ){}

ngOnInit(): void {
  const privilegesData = sessionStorage.getItem('privileges');
  if (privilegesData) {
    this.userPrivileges = JSON.parse(privilegesData);
    this.userPrevilages1 = this.userPrivileges[0];
    for (let item of this.userPrevilages1?.uiComponentPrivileges) {
      if (item?.component?.componentName == "Bulk Upload") {
        if (item.subComponent?.subComponentName == "Bulk Salary Upload")
          this.privilege = item;
      }
    }
  }
  this.serviceName = 'SALARY_PROCES';
  this.uploadedBy =  sessionStorage.getItem('loginUserId');
    this.apiService.getAllCorporateData().subscribe({
      next:(res)=>{
        console.log(res);
        this.corporateData = res
      }
    })
    this.getSalaryProcessData(this.uploadedBy,this.serviceName)
}

getSalaryProcessData(uploadedBy:any,serviceName:any){
  
  this.apiService.getAllUploadData(uploadedBy,serviceName).subscribe({
    next:(res)=>{
      console.log(res);
      if(res?.responseCode == 200){
        this.bulkSalaryData = res?.data;
      }
    },error:()=>{
      alert('Error Try Again!!!')
    }
  })
}

uploadFile(){
  let serviceName = 'SALARY_PROCES';
  let uploadedBy: any = this.value?.id
  let walletId: any = this.value?.walletAccount?.id
  console.log(this.value);
  this.apiService
  .uploadBulkSalaryFile(
    serviceName,
    286,
    walletId,
    this.selectedFile
  )
  .subscribe({
    next: (res) => {
      console.log(res);
      if (res?.responseCode == 200) {
        // this.spinner.hide();
        alert('File Upload Success');
        this.getSalaryProcessData(this.uploadedBy,this.serviceName)
        this.value = null
        // this.getDataValues(this.uploadedBy, this.serviceName);
      } else {
        alert('Error Try Again');
      }
    },
    error: () => {
      // this.spinner.hide();
      alert('Error Try Again');
    },
  });
}
viewData(row: any) {
  let dialogRef = this.dialog
    .open(SalaryProcessDialogComponent, {
      width: '1000px',
      height: '600px',
      panelClass: 'custom-dialog-container',
      data: row,
    })
    .afterClosed()
    .subscribe((res) => {
      this.getSalaryProcessData(this.uploadedBy, this.serviceName);
    });
}
onFileChange(event: any) {
  this.selectedFile = event.target.files[0];
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  console.log(file);
}
}
