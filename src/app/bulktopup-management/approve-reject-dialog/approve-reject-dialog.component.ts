import { Component, Inject } from '@angular/core';
import { LoaderComponent } from "../../loader/loader.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiServiceService } from '../../product/api-service/api-service.service';

@Component({
  selector: 'app-approve-reject-dialog',
  standalone: true,
  imports: [MatButton,MatButtonModule,FormsModule,LoaderComponent,CommonModule],
  templateUrl: './approve-reject-dialog.component.html',
  styleUrl: './approve-reject-dialog.component.css'
})
export class ApproveRejectDialogComponent {
loginId: any;
constructor(private dialog:MatDialogRef<ApproveRejectDialogComponent>,
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

ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  this.loginId = sessionStorage.getItem("loginUserId");
  
}

authorize() {
  if(this.data?.bool == true){
    this.isLoading = true;
    this.apiService.authorizeForBulkTopUp(this.loginId,this.data?.message?.message?.serviceName,this.data?.message?.message?.id,this.data?.bool,this.data?.message?.message?.walletId,this.reason).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res?.responseCode == 200) {
          this.isLoading = false;
          alert("Approved Successfully");
          this.dialog.close()
        } else {
          this.isLoading = false;
          alert(res?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something Went Wrong");
      },
    });
  }else if(this.data?.bool == false){
    this.isLoading = true;
    this.apiService.cancelForWrongData(this.loginId,this.data?.message?.message?.serviceName,this.data?.message?.message?.id,this.data?.bool,this.reason).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res?.responseCode == 200) {
          this.isLoading = false;
          alert("Rejected Successfully");
          this.dialog.close()
        } else {
          this.isLoading = false;
          alert(res?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something Went Wrong");
      },
    });
  }
}
}
