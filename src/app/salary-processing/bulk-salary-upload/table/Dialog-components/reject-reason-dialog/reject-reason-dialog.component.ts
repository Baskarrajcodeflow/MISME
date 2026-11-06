import { Component, Inject } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiServiceService } from '../../../../../product/api-service/api-service.service';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../../../loader/loader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reject-reason-dialog',
  standalone: true,
  imports: [MatButton,MatButtonModule,FormsModule,LoaderComponent,CommonModule],
  templateUrl: './reject-reason-dialog.component.html',
  styleUrl: './reject-reason-dialog.component.css'
})
export class RejectReasonDialogComponent {
constructor(private dialog:MatDialogRef<RejectReasonDialogComponent>,
  private apiService:ApiServiceService,
  @Inject(MAT_DIALOG_DATA) public data: any,

){
  console.log(data);
  
}
isLoading: boolean = false;
reason:any
close(){
this.dialog.close(true)
}

rejectUploadedFiles(){
  this.isLoading = true
  this.apiService.rejectUploadedFiles(this.data,this.reason).subscribe({
    next:(res:any)=>{
      if(res?.responseCode == 200){
  this.isLoading = false
        alert('File Rejected')
this.dialog.close()
      }else{
  this.isLoading = false
        alert('Unable to Reject the File')
      }
    },error:()=>{
  this.isLoading = false
      alert('Unable to Reject the File')
    }
  })
}
}
