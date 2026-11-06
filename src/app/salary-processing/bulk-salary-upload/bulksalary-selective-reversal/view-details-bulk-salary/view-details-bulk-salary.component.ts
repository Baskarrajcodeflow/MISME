import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiServiceService } from '../../../../product/api-service/api-service.service';
import { LoaderComponent } from '../../../../loader/loader.component';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-details-bulk-salary',
  standalone: true,
  imports: [CommonModule,LoaderComponent,MatIconModule,FormsModule],
  templateUrl: './view-details-bulk-salary.component.html',
  styleUrl: './view-details-bulk-salary.component.css'
})
export class ViewDetailsBulkSalaryComponent {
expandResults: any;
isLoading:boolean = false
  totalAmount: any;
  showRemarksModal: boolean = false;
  remarks:any;
constructor(
   @Inject(MAT_DIALOG_DATA) public data: any,
      private dialog: MatDialog,
      private apiService:ApiServiceService,
          private dialogRef: MatDialogRef<ViewDetailsBulkSalaryComponent>,
){
  console.log(data,'data');
  this.expandResults = data?.item?.reversals;
  if(this.expandResults.length > 0){
    this.totalAmount = this.expandResults?.reduce(
    (sum:any, x:any) => sum + Number(x.amount || 0),
    0
  );
  }

}
 closeDialog() {
    this.dialogRef.close(true);
  }

    authorize(event: any) {
    console.log(event);

    this.isLoading = true;

    this.apiService
      .approveSelectiveReversal(event)
      .pipe(
        finalize(() => {
          this.isLoading = false; 
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res?.responseCode === 200) {
            alert(res?.data);
           this.dialog.closeAll()
          } else {
            alert(res?.error);
          }
        },
        error: () => {
          alert("Something Went Wrong");
        },
      });
  }

  batchId:any;
  reject(){
    this.showRemarksModal = true;
  }

  cancel(){
    this.showRemarksModal = false;
    this.remarks = '';
  }

  authorizeModel(batchId:any, remarks:any){
    if(!remarks){
      alert('Please Enter Remarks')
      return
    }
    const payload = {
      batchId: batchId,
      remarks: remarks
    }

    console.log(payload,'payload');
   this.isLoading = true;
    this.apiService.rejectSelectiveReversal(payload).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res: any) => {
        if (res?.responseCode === 200) {
          alert(res?.data);
          this.showRemarksModal = false;
          this.dialog.closeAll()
        } else {
          alert(res?.error);
        }
      },
      error: () => {
        alert("Something Went Wrong");
      },
    });
  }
}
