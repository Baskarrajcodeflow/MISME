import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiServiceService } from '../../product/api-service/api-service.service';
import { CorporateService } from '../corporate.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { LoaderComponent } from '../../loader/loader.component';
import { UserService } from '../../user-management/user-management/user-management/bo/user.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-suspend-user-dialog',
  standalone: true,
  imports: [MatButton,MatButtonModule,FormsModule,LoaderComponent,CommonModule],
  templateUrl: './suspend-user-dialog.component.html',
  styleUrl: './suspend-user-dialog.component.css'
})
export class SuspendUserDialogComponent {

constructor(private dialog:MatDialogRef<SuspendUserDialogComponent>,
  private apiService:ApiServiceService,
  @Inject(MAT_DIALOG_DATA) public data: any,
    private corporate: CorporateService,
        private userService: UserService

){
  console.log(data);
  
}
isLoading: boolean = false;
reason:any

authorize() {

  console.log('Authorize Called → flag2:', this.data?.flag2, 'flag:', this.data?.flag);

  let body = {
    userId: this.data?.message?.id,
    reason: this.reason
  };

  /* -------------------- SUSPEND -------------------- */
  if (this.data?.flag2 == 'suspend') {

    if (this.data?.flag == 0) {
      this.isLoading = true;

      this.corporate.suspendUser(body)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (res) => {
            if (res) {
              alert("User Suspended");
              this.dialog.close();
            } else alert(res?.error);
          },
          error: () => alert("Something Went Wrong")
        });

    } else if (this.data?.flag == 1) {
      this.isLoading = true;

      this.corporate.unSuspendUser(body)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (res) => {
            if (res) {
              alert("Request Sent For UnSuspend");
              this.dialog.close();
            } else alert(res?.error);
          },
          error: () => alert("Something Went Wrong")
        });

    } else if (this.data?.flag == 2) {
      this.isLoading = true;

      this.corporate.authorizeUnSuspendUser(body)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (res) => {
            if (res) {
              alert("UnSuspended");
              this.dialog.close();
            } else alert(res);
          },
          error: (error) => alert(error.error?.message || "Maker cannot be checker")
        });

    } else if (this.data?.flag == 3) {
      this.isLoading = true;

      this.corporate.rejectUnSuspendUser(body)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (res) => {
            if (res) {
              alert("Request Rejected");
              this.dialog.close();
            } else alert(res);
          },
          error: (error) => alert(error.error?.message || "Maker cannot be checker")
        });
    }
  }

  /* -------------------- LOCK -------------------- */
  if (this.data?.flag2 == 'lock') {

    const request = Array.isArray(this.data?.message)
      ? this.data?.message.map((u: any) => ({ id: u.id }))
      : [{ id: this.data?.message?.id }];

    if (this.data?.flag == 4) {
      this.isLoading = true;

      this.corporate.lockCorporateUsers(request, this.reason)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (res) => res ? (alert("User Locked"), this.dialog.close()) : alert(res?.error),
          error: () => alert("Something Went Wrong")
        });

    } else if (this.data?.flag == 5) {
      this.isLoading = true;

      this.userService.authorizePending(request, this.reason)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (data) => data ? (alert("Requested To Unlock."), this.dialog.close()) : alert("Failed"),
          error: (error) => alert(error.error?.message || "Locked User Can't be checker")
        });

    } else if (this.data?.flag == 6) {
      this.isLoading = true;

      this.userService.unlock(request, this.reason)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (data) => data ? (alert("User Unlocked."), this.dialog.close()) : alert("Failed"),
          error: (error) => alert(error.error?.message || "Locked User Can't be checker")
        });

    } else if (this.data?.flag == 7) {
      this.isLoading = true;

      this.userService.rejectUnlockReq(request, this.reason)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (data) => data ? (alert("Request Rejected."), this.dialog.close()) : alert("Failed"),
          error: (error) => alert(error.error?.message || "Locked User Can't be checker")
        });
    }
  }

  /* -------------------- PASSWORD -------------------- */
  if (this.data?.flag2 == 'passwordUnlock') {

    if (this.data?.flag == 1) {
      this.isLoading = true;

      this.userService.passwordUnlock(body)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (res) => res ? (alert("Unlock Request Sent"), this.dialog.close()) : alert(res?.error),
          error: () => alert("Something Went Wrong")
        });

    } else if (this.data?.flag == 2) {
      this.isLoading = true;

      this.userService.passwordUnlockRevoke(body.userId)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (res) => res ? (alert("Unlock Approved"), this.dialog.close()) : alert(res?.error),
          error: () => alert("Something Went Wrong")
        });
    }
  }

  /* -------------------- PRODUCT -------------------- */
  if (this.data?.flag2 == 'changeProd') {

    if (this.data?.flag == 8) {
      this.isLoading = true;

      this.corporate.finalAuthorizeProduct(this.data?.message, this.reason)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (data) => data ? (alert("Authorized."), this.dialog.close()) : alert("Failed"),
          error: (error) => alert(error.error?.message || error.message)
        });

    } else if (this.data?.flag == 9) {
      this.isLoading = true;

      this.corporate.rejectProduct(this.data?.message, this.reason)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (data) => data ? (alert("Rejected."), this.dialog.close()) : alert("Failed"),
          error: (error) => alert(error.error?.message || error.message)
        });
    }
  }
}

  close(){
    this.dialog.close()
  }
}
