import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ApiServiceService } from "../../../product/api-service/api-service.service";
import { DataSharingService } from "../../../product/dataSharing/data-sharing.service";
import { LoaderComponent } from "../../../loader/loader.component";
import { OtpModalComponent } from "../../../ui/otp-Modal/otp-modal/otp-modal.component";

@Component({
  selector: "app-final-salary-approval",
  standalone: true,
  imports: [CommonModule, LoaderComponent, OtpModalComponent],
  templateUrl: "./final-salary-approval.component.html",
  styleUrl: "./final-salary-approval.component.css",
})
export class FinalSalaryApprovalComponent {
  bulkSalaryData: any;
  isLoading: boolean = false;
  userPrivileges: any;
  SalaryPrivelege: any;
  showOTP: boolean = false;
  selectedItemId :any;

  constructor(
    private apiService: ApiServiceService,
    private data: DataSharingService,
    private dialog: MatDialog
  ) {
    this.data.reuploadFileData(false);
  }
  ngOnInit(): void {
    this.getApprovedByCheckerData();
    const privilegesData = sessionStorage.getItem("privileges");
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrivileges = this.userPrivileges[0];
      console.log(this.userPrivileges[0], "this.userPrevilages");
      console.log(this.userPrivileges, "this.userPrevilages1");

      for (let item of this.userPrivileges?.uiComponentPrivileges) {
        if (item?.component?.componentName == "Bulk Salary Process") {
          if (item.subComponent?.subComponentName == "Bulk Salary Process")
            this.SalaryPrivelege = item;
        }
      }
    }
    //this.getApprovedByCheckerData();
  }

  getApprovedByCheckerData() {
    this.isLoading = true;
    this.apiService.getAllUploadedFiles().subscribe({
      next: (res: any) => {
        if (res?.responseCode == 200) {
          const sortedData = res?.data.sort((a: any, b: any) => {
            return (
              new Date(b.uploadedTime).getTime() -
              new Date(a.uploadedTime).getTime()
            );
          });
          this.bulkSalaryData = sortedData;
          this.isLoading = false;
        } else {
          alert(res?.error);
          this.isLoading = false;
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Error While Fetching Data");
      },
    });
  }

  onOtpSubmit(otp: string) {
    console.log("OTP:", otp);
    this.data.setOTP(otp);
    this.showOTP = false;
    this.isLoading = true;
    this.apiService.fileApprove(this.selectedItemId,true,otp).subscribe({
      next:(response : any )=>{
        if(response?.responseCode == 200){
          console.log("Bulk", response);
          this.isLoading = false;
          alert("Authorized Successfully");
          this.getApprovedByCheckerData();

        }
        else{
          alert(response?.error);
          this.isLoading = false;

        }
      }
    })
  }

  sendOtp(itemId : any) {
    this.showOTP = true;
    this.selectedItemId = itemId;
    console.log("selected item id",this.selectedItemId)

  }
}
