import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiServiceService } from '../../product/api-service/api-service.service';
import {  BulkService } from '../bulk.service';

@Component({
  selector: 'app-salary-process-dialog',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './salary-process-dialog.component.html',
  styleUrl: './salary-process-dialog.component.css'
})
export class SalaryProcessDialogComponent {
bulkSalaryData: any;
  bulkSalaryDataid: any;
  userPrivileges: any;
  userPrevilages1: any;
  privilege: any;
constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,
  private apiService: ApiServiceService,
  private bulkService:BulkService,
  // private spinner: DatasharingService,
  private dialogRef: MatDialogRef<SalaryProcessDialogComponent>
){
  this.bulkSalaryDataid = data;
  let serviceName = 'SALARY_PROCES';
  let uploadedBy: any = sessionStorage.getItem('loginUserId');
  // this.spinner.show();
  this.apiService
    .getUploadBulkSalaryViewData(uploadedBy, serviceName, data?.id)
    .subscribe({
      next: (res) => {
        if (res?.responseCode == 200) {
          // this.spinner.hide();
          this.bulkSalaryData = res?.data;
        } else {
          // this.spinner.hide();
        }
      },
      error: () => {
        // this.spinner.hide();
        alert('Error Try Again!!!');
      },
    });
}

ngOnInit() {
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
}

authorizeCustomeronboarding(value: any) {
  let serviceName = 'SALARY_PROCES';
  let uploadedBy: any = sessionStorage.getItem('loginUserId');
  // this.spinner.show();
  this.apiService
    .authorizeSalaryUpload(
      uploadedBy,
      serviceName,
      this.bulkSalaryDataid?.id,
      value
    )
    .subscribe({
      next: (res) => {
        if (res?.responseCode == 200) {
          // this.spinner.hide();
          alert('Data Updated Successfully');
          this.dialogRef.close();
        } else {
          // this.spinner.hide();
          alert('Error Try Again');
        }
      },
      error: () => {
        // this.spinner.hide();
        alert('Error Try Again');
      },
    });
}
authorizeSalaryProcess(value: any) {
  let serviceName = 'SALARY_PROCES';
  let uploadedBy: any = sessionStorage.getItem('loginUserId');
  // this.spinner.show();
  this.bulkService
    .authorizeSalaryUpload(
      uploadedBy,
      serviceName,
      this.bulkSalaryDataid?.id,
      value
    )
    .subscribe({
      next: (res) => {
        if (res?.responseCode == 200) {
          // this.spinner.hide();
          alert('Authorized Successfully');
          this.dialogRef.close();
        } else {
          // this.spinner.hide();
          alert('Error Try Again');
        }
      },
      error: () => {
        // this.spinner.hide();
        alert('Error Try Again');
      },
    });
}
}
