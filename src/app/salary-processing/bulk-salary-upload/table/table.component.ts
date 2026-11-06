
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { ApiServiceService } from '../../../product/api-service/api-service.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingService } from '../../../loading.service';
import { LoaderComponent } from "../../../loader/loader.component";
import { RejectReasonDialogComponent } from './Dialog-components/reject-reason-dialog/reject-reason-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SalaryUploadedDetailsComponent } from './Dialog-components/salary-uploaded-details/salary-uploaded-details.component';
import { DataSharingService } from '../../../product/dataSharing/data-sharing.service';
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltip, MatButtonModule, MatFormField,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,

LoaderComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  
  
})
export class TableComponent {
  bulkSalaryData:any
  isLoading: boolean = false;


  formGroup = new FormGroup({
    from_date_time: new FormControl('', Validators.required),
    
  });
  selectedDate: any;
  restrictAccess!: boolean
  loginUserId: any;
  userPrivileges: any;
  SalaryPrivelege: any;
  constructor(private apiService:ApiServiceService,private loadingService:LoadingService,
    private dialog:MatDialog,
    private data:DataSharingService
  ){
    data.reuploadFileData(false)
  }
  ngOnInit(): void {

    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrivileges = this.userPrivileges[0];
      console.log(this.userPrivileges[0], "this.userPrevilages");
      console.log(this.userPrivileges, "this.userPrevilages1");

      for (let item of this.userPrivileges?.uiComponentPrivileges) {
        if (item?.component?.componentName == 'Bulk Salary Process') {
          if (item.subComponent?.subComponentName == 'Bulk Salary Process')
            this.SalaryPrivelege = item;
        }
      }
    
  }
    this.expression()

  }
  expression() {
    this.loginUserId = sessionStorage.getItem('loginUserId')
    this.isLoading = true
   this.apiService.getAllUploadedFiles().subscribe({
    next:(res:any)=>{
    if(res?.responseCode == 200){
    this.isLoading = false
    
      const sortedData = res?.data.sort((a:any, b:any) => {
        return new Date(b.uploadedTime).getTime() - new Date(a.uploadedTime).getTime();
      });
      this.bulkSalaryData = sortedData
      
    }else{
    this.isLoading = false
      alert(res?.error)
    }
    },error:()=>{
    this.isLoading = false
      alert('Error While Fetching Data')
    }
   })
    
  }

  schedule(item:any,){
    const date: any = this.formGroup.controls['from_date_time'].value;
  console.log(date);
  if (date) {
    const dateObj = date._d || new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    // const hours = String(dateObj.getHours()).padStart(2, '0');
    // const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    // const seconds = String(dateObj.getSeconds()).padStart(2, '0');
  
    const formattedDate = `${year}-${month}-${day}`;
    this.selectedDate = formattedDate;
    // console.log(formattedDate);
  }
   
    if(date){
    this.isLoading = true
      this.apiService.scheduleUploadedFiles(item?.id,this.selectedDate).subscribe({
        next:(res:any)=>{
          console.log(res);
          if(res?.responseCode == 200){
          this.isLoading = false
            this.expression()
            alert('File Scheduled')
          }else{
          this.isLoading = false
            alert('Unable to Schedule the File')
          }
        },error:()=>{
          this.isLoading = false
          alert('Unable to Schedule the File')
        }
      })

    }
  }

  approveUploadedFiles(item:any){
    this.apiService.approveUploadedFiles(item?.id).subscribe({
      next:(res)=>{

      }
    })
  }


 


  nextpage(item:any,id:any){
    let dialogRef = this.dialog
    .open(SalaryUploadedDetailsComponent, {
      width: '900px',
      height: '500px',
      data:{item,id},
      panelClass: 'custom-dialog-container',
      disableClose:true
    })
    .afterClosed()
    .subscribe((res) => {
      console.log(res);
    if(res == undefined){
      this.expression()
    }  
    
    });
  }
}
