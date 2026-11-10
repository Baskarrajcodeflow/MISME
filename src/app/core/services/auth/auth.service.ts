import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { UserType } from "../../../interface/interface-list";
import { Observable, map, tap } from "rxjs";
import { ApiService } from "../api/api.service";
import { environment } from "../../../../environments/environment";
import { Router } from "@angular/router";
import { DataSharingService } from "../../../product/dataSharing/data-sharing.service";
import { SessionService } from "../../../session.service";
import { PLATFORM_LOGIN } from "../../../../environments/platform";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly JWT_TOKEN = "JWT_TOKEN";
  currentUser = signal<string>("");
  private http = inject(HttpClient);
  private token: string | null = null;
  private apiUrl = environment.apiUrl;
  userTypeConst = UserType;
  endpoint: string = "";
  private permissions: string[] = [];

  constructor(private apiService: ApiService, private router: Router,private data:DataSharingService,private sessionService:SessionService) {
    //Temp
    // this.doLoginUser("Admin", "someJWTshit")
  }

  login(username: string, password: string, otp: string,v?:any): Observable<any> {
    /* if (userType == this.userTypeConst.backoffice) {
      this.endpoint = "/aaa/web/backoffice/login";
    } else if (userType == this.userTypeConst.agent) {
      this.endpoint = "/aaa/web/agent/login";
    } else {
      this.endpoint = "/aaa/web/customer/login";
    } */
      this.endpoint = "/aaa/web/backoffice/login";
    return this.apiService.post(this.endpoint, { username, password,otp }).pipe(
      tap((response: any) => {
        // let tokens = JSON.stringify(response);
        this.doLoginUser(username, response.token,response);
      })
    );
  }

  generateLoginOTP(emailOrPhone : string, password : string, userType : string){
    const endURL = "/aaa/web/generate";
    return this.apiService.post(endURL, { emailOrPhone, password,userType }).pipe(
      tap((response: any) => {
        if(response.responseCode == 200) {
          alert("OTP has sent to your email/phone");
        }
        // let tokens = JSON.stringify(response);
      })
    );
  }
  
  doLoginUser(userName: string, tokens: any,v:any) {
    if(v?.responseCode == 200 ){
      this.currentUser.set(userName)
      this.storeToken(tokens)
      // Each platform has its own landing page (PLATFORM_LOGIN.homePath)
      this.router.navigate(['/' + PLATFORM_LOGIN.homePath]);
      
    }
  }
  storeToken(jwt: string) {
    sessionStorage.setItem(this.JWT_TOKEN, jwt);
    this.token = jwt;
  }
  getToken(): string | null {
    return this.token;
  }

  logout() {
    this.currentUser.set("");
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.clear();
    this.router.navigate(["/web/"]);
    this.data.emptyArray(true);
    sessionStorage.clear()
    this.sessionService.stopTimer(); // Stop auto-logout timer
    setTimeout(() => {
      window.location.reload()
    }, 50);
  }

  isLoggedIn(): boolean {
    console.log("is logged in", this.currentUser() != "");
    return this.currentUser() != "";
  }

  hasPermission(requiredPerm: string): boolean {
    return this.permissions.includes(requiredPerm);
  }
  getAllowedModules(): string[] {
    // console.log("TODO in AuthService extract all modules for the current user");
    return ["*"];
  }
}
