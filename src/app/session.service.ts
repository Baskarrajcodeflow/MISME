import { Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription, timer } from "rxjs";
import { AuthService } from "./core/services/auth/auth.service";
import { InactivityService } from "./service-config/inactivity-service.service";
import { CorporateService } from "./corporate/corporate.service";
import { MatDialog } from "@angular/material/dialog";
import { SessionDialogComponent } from "./session-dialog/session-dialog.component";
import { SessionInactiveDialogComponent } from "./session-dialog/session-inactive-dialog/session-inactive-dialog.component";
import { environment } from "../environments/environment.prod";

@Injectable({
  providedIn: "root",
})
export class SessionService {
  otp: string = "";
  private sessionTimeout = environment.sessiontimout;
  private timerSubscription: Subscription | null = null;
  private authService!: AuthService;
  private inactivitySubscription!: Subscription;
  private lastApiCallTime: number = Date.now();
  constructor(
    private router: Router,
    private injector: Injector,
    private inactivityService: InactivityService,
    private apiService: CorporateService,
    private dialog: MatDialog
  ) {}

  private getAuthService(): AuthService {
    if (!this.authService) {
      this.authService = this.injector.get(AuthService);
    }
    return this.authService;
  }

  startTimer(): void {
    this.stopTimer(); // Properly clears previous timer before starting a new one
    this.inactivitySubscription =
      this.inactivityService.inactivityAlert.subscribe(() => {
        // console.log(true);
        this.inactivityService.stopTracking();
        let dialogRef = this.dialog
          .open(SessionInactiveDialogComponent, {
            //  width: "150px",
            //  height: "200px",
            panelClass: "custom-dialog-container",
            disableClose: true,
          })
          .afterClosed()
          .subscribe((res: any) => {
            console.log(res);
            if (res == true) {
              this.inactivitySubscription.unsubscribe();
              let token = sessionStorage.getItem("JWT_TOKEN");
              let body = {
                accessToken: token,
              };
              this.refreshToken();
              this.inactivityService.startTracking();
            } else {
              this.getAuthService().logout();
            }
          });
      });
    this.apiCalled = false; // Reset API call flag

    // Reset API call tracking every 45 minutes
    timer(45 * 60 * 1000).subscribe(() => {
      this.apiCalled = false;
    });

    this.timerSubscription = timer(this.sessionTimeout).subscribe(() => {
      // if (!this.apiCalled) {
      this.logoutUser();
      // }
    });
  }

  resetTimer(): void {
    this.stopTimer(); // Stops any existing timer before restarting
    this.startTimer();
    this.inactivityService.startTracking();
  }

  logoutUser(): void {
    let dialogRef = this.dialog
      .open(SessionDialogComponent, {
        //  width: "150px",
        //  height: "200px",
        panelClass: "custom-dialog-container",
        disableClose: true,
      })
      .afterClosed()
      .subscribe((res: any) => {
        console.log(res);
        if (res == true) {
          let token = sessionStorage.getItem("JWT_TOKEN");
          this.refreshToken();
        } else {
          this.getAuthService().logout();
        }
      });
  }

  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }
  private apiCalled = false;
  apiCallDetected(): void {
    const now = Date.now();
    const elapsedMinutes = (now - this.lastApiCallTime) / (1000 * 60); // Convert ms to minutes

    this.lastApiCallTime = now; // Update last API call time
    this.apiCalled = true; // Mark API as called

    console.log(`API called. Elapsed time: ${elapsedMinutes} minutes`);

    if (elapsedMinutes >= 45) {
      console.log("Refreshing token...");
      this.startTimer();
      setTimeout(() => {
        this.refreshToken();
      }, 2000);
    }
  }
  setOTP(otp: string) {
    console.log("setOTP called", otp);
    this.otp = otp;
  }
  getOTP(): string {
    console.log("getOTP called", this.otp);
    return this.otp;
  }

  refreshToken() {
    let token = sessionStorage.getItem("JWT_TOKEN");
    this.apiService.refreshToken().subscribe({
      next: (res) => {
        console.log(res);
        if (res?.responseCode == 200) {
          sessionStorage.setItem("JWT_TOKEN", res?.data);
          this.startTimer();
        }
      },
    });
  }
}
