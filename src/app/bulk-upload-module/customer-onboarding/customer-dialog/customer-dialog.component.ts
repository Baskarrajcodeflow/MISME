import { Component, Inject, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../product/api-service/api-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { BulkService } from '../../bulk.service';

@Component({
  selector: 'app-customer-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-dialog.component.html',
  styleUrl: './customer-dialog.component.css'
})
export class CustomerDialogComponent implements OnInit {
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

    private dialogRef:MatDialogRef<CustomerDialogComponent>
  ) {
    console.log(data);
    this.bulkSalaryDataid = data;
    let serviceName = 'CUSTOMER_UPLOAD';
    let uploadedBy: any = sessionStorage.getItem('loginUserId');
    // this.spinner.show()
    this.apiService
      .getUploadBulkSalaryViewData(uploadedBy, serviceName, data?.id)
      .subscribe({
        next: (res) => {
          if(res?.responseCode == 200){
            // this.spinner.hide()        
            this.bulkSalaryData = res?.data;
          }
        },error:()=>{
          // this.spinner.hide() 
          alert('Error Try Again!!!')       
        }
      });
  }
  ngOnInit() {
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "Bulk Upload") {
          if (item.subComponent?.subComponentName == "Bulk Customer Onboarding")
            this.privilege = item;
        }
      }
    }
  }

  authorizeCustomeronboarding(value: any) {
    let serviceName = 'CUSTOMER_UPLOAD';
    let uploadedBy: any = sessionStorage.getItem('loginUserId');
    // this.spinner.show()
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
          // this.spinner.hide() 
            alert('Data Updated Successfully');
            this.dialogRef.close()
          } else {
            alert('Error Try Again');
            // this.spinner.hide() 

          }
        },
        error: () => {
          // this.spinner.hide() 
          alert('Error Try Again');
        },
      });
  }
  authorizeCustomer(value: any) {
    let serviceName = 'CUSTOMER_UPLOAD';
    let uploadedBy: any = sessionStorage.getItem('loginUserId');
    // this.spinner.show()
    this.bulkService.authorizeCustomeronboarding(
        uploadedBy,
        serviceName,
        this.bulkSalaryDataid?.id,
        value
      )
      .subscribe({
        next: (res:any) => {
          if (res?.responseCode == 200) {
          // this.spinner.hide() 
            alert('Authorized Successfully');
            this.dialogRef.close()
          } else {
            alert('Error Try Again');
            // this.spinner.hide() 

          }
        },
        error: () => {
          // this.spinner.hide() 
          alert('Error Try Again');
        },
      });
  }
}
