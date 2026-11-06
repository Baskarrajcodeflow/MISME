import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiServiceService } from '../../../../product/api-service/api-service.service';
import { DataSharingService } from '../../../../product/dataSharing/data-sharing.service';
import { SalaryUploadedDetailsComponent } from '../Dialog-components/salary-uploaded-details/salary-uploaded-details.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { LoaderComponent } from '../../../../loader/loader.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-reconciliation-files',
  standalone: true,
  imports: [CommonModule,MatIconModule,MatTooltip,MatButtonModule,LoaderComponent],
  templateUrl: './reconciliation-files.component.html',
  styleUrl: './reconciliation-files.component.css'
})
export class ReconciliationFilesComponent {
 bulkSalaryData:any
  isLoading: boolean = false;
  loginUserId: any;

  constructor(private apiService:ApiServiceService,private data:DataSharingService,private dialog:MatDialog){
    this.data.reuploadFileData(false)
  }
  ngOnInit(): void {

    this.loginUserId = sessionStorage.getItem('loginUserId')

    this.isLoading = true
   this.apiService.getAllUploadedFiles() .pipe(
           finalize(() => {
             this.isLoading = false; 
           })
         ).subscribe({
    next:(res:any)=>{
    if(res?.responseCode == 200){
      const sortedData = res?.data.sort((a:any, b:any) => {
        return new Date(b.uploadedTime).getTime() - new Date(a.uploadedTime).getTime();
      });
      this.bulkSalaryData = sortedData
    this.isLoading = false
    }else{
      alert(res?.error)
    this.isLoading = false
    }
    },error:()=>{
    this.isLoading = false
      alert('Error While Fetching Data')
    }
   })
    
  }

  nextpage(item:any,id:any,message:any){
    let dialogRef = this.dialog
    .open(SalaryUploadedDetailsComponent, {
      width: '900px',
      height: '520px',
      data:{item,id,message},
      panelClass: 'custom-dialog-container',
      disableClose:true
    })
    .afterClosed()
    .subscribe((res:any) => {
      console.log(res);
    if(res == undefined){
    }  
    
    });
  }
}
