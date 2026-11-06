import { Component, Inject } from "@angular/core";
import { LoaderComponent } from "../../../loader/loader.component";
import { CommonModule } from "@angular/common";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";
import { WalletService } from "../../wallet-management/wallet-managemnt.service";

@Component({
  selector: "app-authorize-push-pull-dialog",
  standalone: true,
  imports: [LoaderComponent, CommonModule, MatIconModule, FormsModule],
  templateUrl: "./authorize-push-pull-dialog.component.html",
  styleUrl: "./authorize-push-pull-dialog.component.css",
})
export class AuthorizePushPullDialogComponent {
  isLoading: boolean = false;
  pin: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialofref: MatDialogRef<AuthorizePushPullDialogComponent>,
    private walletService: WalletService
  ) {
    console.log(data);
  }

  approve() {
    let data = {
      pin: this.pin,
      reqId: this.data?.id,
    };
    this.isLoading = true;
    this.walletService.authorizePushPull(data).subscribe({
      next: (res) => {
        if (res?.responseCode == 200) {
          this.isLoading = false;
          alert(res?.data);
          this.dialofref.close();
        } else {
          this.isLoading = false;
          alert(res?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something Went Wrong!!!");
      },
    });
  }
  closeDialog() {
    this.dialofref.close();
  }
  close() {
    this.dialofref.close();
  }
}
