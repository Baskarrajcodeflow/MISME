import { Component, Inject } from "@angular/core";
import { LoaderComponent } from "../../loader/loader.component";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { ApiServiceService } from "../../product/api-service/api-service.service";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { ApproveRejectDialogComponent } from "../approve-reject-dialog/approve-reject-dialog.component";

@Component({
  selector: "app-view-topup-details",
  standalone: true,
  imports: [LoaderComponent, CommonModule, MatIconModule],
  templateUrl: "./view-topup-details.component.html",
  styleUrl: "./view-topup-details.component.css",
})
export class ViewTopupDetailsComponent {
  completedStatus: any;
  isLoading: boolean = false;
  loginId: any;
  userPrivileges: any;
  SalaryPrivelege: any;
  constructor(
    private apiService: ApiServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ViewTopupDetailsComponent>
  ) {}

  ngOnInit(): void {
    const privilegesData = sessionStorage.getItem("privileges");
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrivileges = this.userPrivileges[0];
      console.log(this.userPrivileges[0], "this.userPrevilages");
      console.log(this.userPrivileges, "this.userPrevilages1");

      for (let item of this.userPrivileges?.uiComponentPrivileges) {
        if (item?.component?.componentName == "Bulk Topup Process") {
          if (item.subComponent?.subComponentName == "Bulk Topup Process")
            this.SalaryPrivelege = item;
        }
      }
    }
    this.loginId = sessionStorage.getItem("loginUserId");
    console.log(this.loginId);

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.data, "new");
    this.getUploadedData();
  }

  getUploadedData() {
    console.log(this.data?.message?.id, "json");

    this.isLoading = true;
    this.apiService
      .getAllDetailsForUploadData(
        this.loginId,
        this.data?.message?.serviceName,
        this.data?.message?.id
      )
      .subscribe({
        next: (res: any) => {
          if (res?.responseCode == 200) {
            this.isLoading = false;
            this.completedStatus = res?.data;
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

  closeDialog() {
    this.dialogRef.close();
  }

  confirmDialog(bool: any) {
    let dialogRef = this.dialog
      .open(ApproveRejectDialogComponent, {
        width: "500px",
        height: "190px",
        panelClass: "custom-dialog-container",
        data: { message: this.data, bool: bool },
        disableClose: true,
      })
      .afterClosed()
      .subscribe((res) => {
        if (res == undefined) {
          this.dialogRef.close();
        }
      });
  }

  // authorize() {
  //   this.isLoading = true;
  //   this.apiService.authorizeForBulkTopUp(this.loginId,this.data?.serviceName,this.data?.id,true,this.data?.walletId).subscribe({
  //     next: (res: any) => {
  //       console.log(res);
  //       if (res?.responseCode == 200) {
  //         this.isLoading = false;
  //         alert("Approved Successfully");
  //         this.dialogRef.close()
  //       } else {
  //         this.isLoading = false;
  //         alert(res?.error);
  //       }
  //     },
  //     error: () => {
  //       this.isLoading = false;
  //       alert("Something Went Wrong");
  //     },
  //   });
  // }

  // reject() {
  //   this.isLoading = true;
  //   this.apiService.cancelForWrongData(this.loginId,this.data?.serviceName,this.data?.id,false).subscribe({
  //     next: (res: any) => {
  //       console.log(res);
  //       if (res?.responseCode == 200) {
  //         this.isLoading = false;
  //         alert("Rejected Successfully");
  //         this.dialogRef.close()
  //       } else {
  //         this.isLoading = false;
  //         alert(res?.error);
  //       }
  //     },
  //     error: () => {
  //       this.isLoading = false;
  //       alert("Something Went Wrong");
  //     },
  //   });
  // }
}
