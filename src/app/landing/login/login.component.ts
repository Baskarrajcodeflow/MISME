import { Component, EventEmitter, Output, inject } from "@angular/core";
import { AuthService } from "../../core/services/auth/auth.service";
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import {
  UserDomains,
  UserType,
  contextSwitch,
} from "../../interface/interface-list";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { ToastService } from "../../toast.service";
import { DataSharingService } from "../../product/dataSharing/data-sharing.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { ApiServiceService } from "../../product/api-service/api-service.service";
import { UserManagementService } from "../../user-management/user-management/user-management/openapi";
import { LoaderComponent } from "../../loader/loader.component";
import { DashboardService } from "../../dashboard/dashboard.service";
import { SessionService } from "../../session.service";
import { PLATFORM_BRAND, PLATFORM_LOGIN } from "../../../environments/platform";

@Component({
  standalone: true,
  selector: "app-login",
  imports: [FormsModule, CommonModule, LoaderComponent, ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})



export class LoginComponent {
  readonly brand = PLATFORM_BRAND;
  readonly loginConfig = PLATFORM_LOGIN;
  otpForm: FormGroup = new FormGroup({});
  ForgotPassOtpForm: FormGroup = new FormGroup({});
  timeLeft: number = 300; // 5 minutes in seconds
  timer: any;
  formattedTime: string = '05:00';
  otpSent: boolean = true;
  @Output() switchToContext = new EventEmitter<string>();
  userDomains = Object.values(UserDomains);
  // private http = inject(this.toastService);

  userDomain: string = "";

  credentials = {
    username: "",
    password: "",
  };
  contextS = contextSwitch;
  contexts = Object.values(contextSwitch);
  username: any = null;
  otpLogin: any = null;
  password: any = null;
  oldpassword: any = null;
  newpassword: any = null;
  phone: any;
  userTypeConst = UserType;
  userType: UserType = this.userTypeConst.backoffice ;//this.loginConfig.userType;
  changePassword: boolean = false;
  isLoading: boolean = false;
  email: any;
  otp: any;
  changePasswordNew: boolean = false;
  changePasswordotp: boolean = false;
  newpasswordfield: any;
  confirmpassword: any;
  showPassword: boolean = false;
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  showOTP: boolean = false;
  formattedTimeForgotPass: string = '';
  countdownForgotPass: number = 77;
  intervalId: any;
  otpForgotPass: any;
  fullOtp: string = '';
  constructor(
    private authService: AuthService,
    private route: Router,
    private location: Location,
    private toastService: ToastService,
    private dashboardService: DashboardService,
    private data: DataSharingService,
    private apiService: ApiServiceService,
    private sessionService: SessionService,
    private router: Router
  ) {
    this.otpForm = new FormGroup({
      otp1: new FormControl('', [Validators.required, Validators.pattern('[0-9]')]),
      otp2: new FormControl('', [Validators.required, Validators.pattern('[0-9]')]),
      otp3: new FormControl('', [Validators.required, Validators.pattern('[0-9]')]),
      otp4: new FormControl('', [Validators.required, Validators.pattern('[0-9]')]),
      otp5: new FormControl('', [Validators.required, Validators.pattern('[0-9]')]),
      otp6: new FormControl('', [Validators.required, Validators.pattern('[0-9]')]),

    });
    this.ForgotPassOtpForm = new FormGroup({
      otp1Forgot: new FormControl('', [Validators.required, Validators.pattern('[0-9]')]),
      otp2Forgot: new FormControl('', [Validators.required, Validators.pattern('[0-9]')]),
      otp3Forgot: new FormControl('', [Validators.required, Validators.pattern('[0-9]')]),
      otp4Forgot: new FormControl('', [Validators.required, Validators.pattern('[0-9]')]),
      otp5Forgot: new FormControl('', [Validators.required, Validators.pattern('[0-9]')]),
      otp6Forgot: new FormControl('', [Validators.required, Validators.pattern('[0-9]')]),

    });
  }

  ngOnInit() {
    //code to extract user type from the URL
    let urlSegments = this.location.path().split("/");
    // this.userType1 = urlSegments[1];
    // userType depends on the platform this build is for (PLATFORM_LOGIN in src/environments/platform*.ts)
    this.userType = this.loginConfig.userType;
    // console.log("User type1 = ", this.userType1);


    this.resetForgotPassTimer();
  }
  resetForgotPassTimer() {
    this.countdownForgotPass = 77; // Reset time
    this.formattedTimeForgotPass = '';
    if (this.intervalId) {
      clearInterval(this.intervalId); // Prevent duplicate intervals
    }
    this.startForgotPassTimer();
  }
  startForgotPassTimer() {
    this.updateFormattedTimeForgotPass(this.countdownForgotPass);

    this.intervalId = setInterval(() => {
      if (this.countdownForgotPass > 0) {
        this.countdownForgotPass--;
        this.updateFormattedTimeForgotPass(this.countdownForgotPass);
      } else {
        clearInterval(this.intervalId);
        this.formattedTimeForgotPass = '00:00'; // Optional: make it clear it expired
      }
    }, 1000);
  }
  updateFormattedTimeForgotPass(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    this.formattedTimeForgotPass =
      `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  changePass(res: any) {
    this.changePasswordotp = res;
    this.login = false;
  }
  v: any;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Toggle the visibility
  }
  onSubmit() {
    this.credentials.username = this.username;
    this.credentials.password = this.password;
    // this.authService.currentUser.set("DAEFA")

    // this.authService.doLoginUser("FRE","Bie")
    // console.log("AXDad", this.authService.currentUser())
    this.toastService.showMessage("success", "fghjhjj");
    sessionStorage.setItem("loginUserName", this.username);
    this.isLoading = true;
    this.authService
      .generateLoginOTP(this.username, this.password, 'BO'/*this.userType*/)
      .subscribe({
        next: (v: any) => {
          // console.log("response from generate",v);
          if (v?.responseCode == 200) {

            this.isLoading = false;
            this.showOTP = true;
            this.otpSent = true;
            this.startTimer();
            //alert("Logged In Successfully");
            // this.authService.doLoginUser(this.username, v.token, v);
            let token = v?.token;
            const helper = new JwtHelperService();
            let decodedToken = helper.decodeToken(JSON.stringify(token));
            sessionStorage.setItem("loginUserId", decodedToken?.userId);
            sessionStorage.setItem("JWT_TOKEN", v.token);
          } else if (v?.responseCode == 2) {
            this.isLoading = false;
            alert(v?.message);
            this.changePassword = true;
            sessionStorage.setItem("JWT_TOKEN", v.token);
          } else if (v?.responseCode == 0) {
            this.isLoading = false;
            alert(v?.error);
          } else {
            this.isLoading = false;
            alert(v?.data)
          }
        },
        error: () => {
          this.isLoading = false;
          alert("Error Please Try Again");
        },
      });
  }
  startTimer() {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateFormattedTime();
      } else {
        clearInterval(this.timer);
        this.otpSent = false; // Enable "Resend OTP" link
      }
    }, 1000);
  }
  updateFormattedTime() {
    const minutes = Math.floor(this.timeLeft / 60); // Get minutes
    const seconds = this.timeLeft % 60; // Get seconds

    // Format to ensure 2 digits (e.g., '05' instead of '5')
    this.formattedTime = `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  // Helper function to pad single digits with a leading zero
  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  resendOtp() {
    this.timeLeft = 300; // Reset timer to 5 minutes
    this.onSubmit();
    this.startTimer();
    // Call API to resend OTP here...

    console.log('OTP Resent');
  }

  onOtpInput(event: any, nextInput: any, prevInput: any) {
    if (event.target.value.length === 1 && nextInput) {
      nextInput.focus();
    } else if (event.target.value.length === 0 && prevInput) {
      prevInput.focus();
    }
    else {
      this.verifyOtp();
    }
  }
  verifyOtp() {
    if (this.otpForm.valid) {
      const otp = Object.values(this.otpForm.value).join('');
      this.sessionService.setOTP(otp);
      this.authService.login(this.username, this.password, otp)
        .subscribe({
          next: (v: any) => {
            console.log("Login response", v);
            if (v?.responseCode == 200) {
              let token = v?.token;
              const helper = new JwtHelperService();
              let decodedToken = helper.decodeToken(JSON.stringify(token));

              if (decodedToken?.iat) {
                const decodedTime = decodedToken.iat * 1000; // Convert from seconds to milliseconds
                const currentTime = Date.now(); // Current time in milliseconds

                console.log(new Date(decodedTime), 'Decoded Time');
                console.log(new Date(currentTime), 'Current Time');

                const timeDifference = (currentTime - decodedTime) / 1000; // Convert to seconds

                if (timeDifference <= 60) {
                  alert("Login Successfull");
                  this.isLoading = false;
                  this.showOTP = true;
                  this.sessionService.startTimer();
                  //alert("Logged In Successfully");
                  // this.authService.doLoginUser(this.username, v.token, v);
                  sessionStorage.setItem("JWT_TOKEN", v?.token);
                  sessionStorage.setItem("loginUserId", decodedToken?.userId);
                  console.log("Decoded Token", decodedToken);
                  this.getRoleData(decodedToken?.userId);
                } else {
                  // alert('Invalid Token!!!');
                  sessionStorage.clear();
                  this.router.navigate(["/web/"]);
                  setTimeout(() => {
                    window.location.reload()
                  }, 50);                // console.log('❌ Token is older than 30 seconds.');
                }
              } else {
                console.log("⚠️ Invalid token or missing 'iat' field.");
              }
            } else if (v?.responseCode == 2) {
              this.isLoading = false;
              alert(v?.message);
              this.changePassword = true;
              sessionStorage.setItem("JWT_TOKEN", v.token);
            } else if (v?.responseCode == 0) {
              this.isLoading = false;
              alert(v?.message);
              this.otpForm.reset('');

            }
          },
          error: () => {
            this.isLoading = false;
            alert("Error Please Try Again");
          },
        });
      // Call API to verify OTP here...
    } else {
      console.log('Invalid OTP');
    }
  }
  getRoleData(UserID: any) {
    // this.isLoading = true
    this.dashboardService.getRoleById(UserID).subscribe({
      next: (res: any) => {
        if (res) {
          // this.isLoading = true
          this.data.setSubjectData(res);
        }
      },
      error: () => {
        // this.isLoading = false
        alert("Error While Fetching Roles Data");
      },
    });
  }
  resetPwdData: any = false;
  resetPwd: boolean = true;
  otpVerify: boolean = false;
  login: boolean = true;
  sendOtp() {
    let body = {
      email: this.email,
      userType: 'BO'//this.loginConfig.userType,
    };
    // this.dataSharing.show();
    this.isLoading = true;
    this.apiService.generateOtp(body).subscribe({
      next: (res) => {
        if (res?.responseCode == 200) {
          this.isLoading = false;
          alert("OTP has sent to your mail");
          this.otpVerify = true;
          this.changePassword = false;
          this.login = false;
          this.changePasswordotp = false;
        }
        else if (res?.responseCode == 100) {
          alert(res?.data);
        }
        //return to screen reg email
        else if (res?.error == "Invalid OTP!") {
          // else if (res?.responseCode == 0) {
          this.changePasswordotp = true;
        }
        //return to screen reg email
        else {
          this.isLoading = false;
          // this.dataSharing.hide();
          alert(res?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Error Try Again!!!");
      },
    });
  }
  onOtpInputForgotPass(event: any, nextInput: any, prevInput: any) {
    if (event.target.value.length === 1 && nextInput) {
      nextInput.focus();
    } else if (event.target.value.length === 0 && prevInput) {
      prevInput.focus();
    }
    // else {
    //   this.verifyOtp();
    // }
  }
  onOtpKeyUp() {
    const formValues = this.ForgotPassOtpForm.value;
    this.fullOtp =
      (formValues.otp1Forgot || '') +
      (formValues.otp2Forgot || '') +
      (formValues.otp3Forgot || '') +
      (formValues.otp4Forgot || '') +
      (formValues.otp5Forgot || '') +
      (formValues.otp6Forgot || '');
    console.log('Full OTP:', this.fullOtp);
  }
  onSaveOtp() {
    let email = this.email;
    console.log("fullOtp 1:", this.fullOtp);
    let body = {
      email: email,
      otp: this.fullOtp,
    };
    console.log("Submitting OTP body:", body);
    this.isLoading = true;
    this.apiService.verifyOtp(body).subscribe({
      next: (res) => {
        if (res?.responseCode == 200) {
          this.isLoading = false;
          this.resetPwdData = true;
          this.otpVerify = false;
          this.resetPwdData = true;
          this.changePasswordNew = true;
          this.changePassword = false;
          this.changePasswordotp = false;
          this.login = false;
          alert("OTP Verified Successfully");
        } else {
          this.isLoading = false;
          alert(res?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Error Try Again!!!");
      },
    });
  }

  pwdReset() {
    let body = {
      email: this.email,
      password: this.newpasswordfield,
      userType: this.loginConfig.userType,
      // otp: this.otp,
      otp: this.fullOtp
    };
    console.log(body);
    this.isLoading = true;
    // this.dataSharing.show()
    this.apiService.forgotPwd(body).subscribe({
      next: (res) => {
        if (res?.responseCode == 200) {
          this.isLoading = false;
          alert("Password Reset Successful");
          this.changePasswordNew = false;
          this.changePassword = false;
          this.login = true;
          // this.dataSharing.hide()
          this.otpVerify = false;
          this.resetPwdData = false;
        } else {
          this.isLoading = false;
          // this.dataSharing.hide()
          alert("Error Try Again");
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Error Try Again");
      },
    });
  }

  changePasswordApi() {
    let body = {
      oldPassword: this.oldpassword,
      newPassword: this.newpassword,
    };
    console.log(body);

    this.isLoading = true;
    this.apiService.changePassword(body).subscribe({
      next: (res) => {
        console.log(res);
        if (res?.responseCode == 200) {
          this.isLoading = false;
          alert(res?.data);
          this.changePassword = false;
        } else {
          this.isLoading = false;
          alert(res?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Error Try Again");
      },
    });
  }

  invokeSwitchTo(context: contextSwitch) {
    console.log("(((((((((((((");
    this.switchToContext.emit(context);
  }

  onKeyPress_onlyNumber(event: KeyboardEvent): void {
    const charCode = event.key;
    if (isNaN(Number(charCode))) {
      event.preventDefault();
    }
  }
}
