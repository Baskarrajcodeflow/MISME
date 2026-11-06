import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private getHeaders(): HttpHeaders {
    let token;
    if (sessionStorage) {
      token = sessionStorage.getItem(
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MTkyOTQ4NzgsImV4cCI6MTc1MDgzMDg3OCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.8FGhnd3Lgjg7Im46PjQS4WrMlreH2MGu2O-f_gxfCCk"
      );
      if (token == null || token == undefined) {
        token = "Dummy Value";
      }
    }
    return new HttpHeaders().set("Authorization", "Bearer " + token);
  }

  public authorizeBoUser(req: any,reason:any) {
    const headers: HttpHeaders = this.getHeaders(); // Get the headers with the authorization token
    const url = environment.apiUrl + "/um/api/bo/activate?reason="+reason;
    return this.httpClient.post<any>(url, req, { headers });
  }
  public unlock(req: any,reason:any) {
    const headers: HttpHeaders = this.getHeaders(); // Get the headers with the authorization token
    const url = environment.apiUrl + `/um/api/bo/unlock?reason=${reason}`;

    return this.httpClient.post<any>(url, req, { headers });
  }
  public rejectUnlockReq(req: any,reason:any) {
    const headers: HttpHeaders = this.getHeaders(); // Get the headers with the authorization token
    const url = environment.apiUrl + `/um/api/bo/rejectActivate?reason=${reason}`;
    return this.httpClient.post<any>(url, req, { headers });
  }
  public authorizePending(req: any,reason:any) {
    const headers: HttpHeaders = this.getHeaders(); // Get the headers with the authorization token
    const url = environment.apiUrl + `/um/api/bo/activatePending?reason=${reason}`;

    return this.httpClient.post<any>(url, req, { headers });
  }
  public getAuthProducts(id: any) {
    let url = `${environment.apiUrl}/um/api/bo/getAllChangeProductRequest?baseUserId=` + id;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public finalAuthorizeProduct(id: any) {
    let url = `${environment.apiUrl}/um/api/bo/changeProduct?id=` + id;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.post<any>(url, { headers: h });
  }

  public passwordUnlock(req:any) {
    let url = `${environment.apiUrl}/um/api/bo/initiatePwdLockoutRevoke`
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.post<any>(url, req,{ headers: h });
  }
  public passwordUnlockRevoke(id: any) {
    let url = `${environment.apiUrl}/um/api/bo/authorizePwdLockoutRevoke?userId=`+id;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.post<any>(url, { headers: h });
  }
  //Active user list
  public downloadActiveUserList() {
    let h: HttpHeaders = this.getHeaders();
    let url = `${environment.apiUrl}/crm/api/downloadActiveUserList`;

    return this.httpClient.post(url, {}, {
      headers: h,
      responseType: 'blob'
    });
  }
  //deactive user list
  public downloadDeactiveUserList() {
    let h: HttpHeaders = this.getHeaders();
    let url = `${environment.apiUrl}/crm/api/downloadDeactiveUserList`;

    return this.httpClient.post(url, {}, {
      headers: h,
      responseType: 'blob'
    });
  }
    //Dormant user list
  public downloadDormantUserList() {
    let h: HttpHeaders = this.getHeaders();
    let url = `${environment.apiUrl}/crm/api/downloadDormantUserList`;

    return this.httpClient.post(url, {}, {
      headers: h,
      responseType: 'blob'
    });
  }
  //suspended user list
  public downloadSuspendUserList() {
    let h: HttpHeaders = this.getHeaders();
    let url = `${environment.apiUrl}/crm/api/downloadSuspendUserList`;

    return this.httpClient.post(url, {}, {
      headers: h,
      responseType: 'blob'
    });
  }
  //PasswordLockoutUserList list
  public downloadPasswordLockoutUserList() {
    let h: HttpHeaders = this.getHeaders();
    let url = `${environment.apiUrl}/crm/api/downloadPasswordLockoutUserList`;

    return this.httpClient.post(url, {}, {
      headers: h,
      responseType: 'blob'
    });
  }
    //downloadFirstDeactiveUserList 
  public downloadFirstDeactiveUserList() {
    let h: HttpHeaders = this.getHeaders();
    let url = `${environment.apiUrl}/crm/api/downloadFirstDeactiveUserList`;

    return this.httpClient.post(url, {}, {
      headers: h,
      responseType: 'blob'
    });
  }
  public downloadUserLog(userId:number) {
    let h: HttpHeaders = this.getHeaders();
    let url = `${environment.apiUrl}/crm/api/downloadUserLog?userId=`+userId;
    return this.httpClient.post(url, {}, {
      headers: h,
      responseType: 'blob'
    });
  }

 public downloadChangeLogs(kycId: any) {
  const headers = this.getHeaders();
  const url = `${environment.apiUrl}/crm/api/kyc/downloadChangeLogs?kycId=${kycId}`;

  return this.httpClient.get(url, {
    headers,
    responseType: 'blob'
  });
}
  constructor(private httpClient: HttpClient) { }
}
