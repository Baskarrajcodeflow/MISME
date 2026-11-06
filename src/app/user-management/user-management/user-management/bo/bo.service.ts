import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
export interface GenerateOtpRequest {
  email: string | null;
  phone: string;
  userType: 'AGENT' | 'MERCHANT' | 'CUSTOMER';
}

export interface ForgotPasswordRequest {
  username: string;
  password: any;
  userType: 'AGENT' | 'MERCHANT' | 'CUSTOMER';
  otp: string;
}
@Injectable({
  providedIn: 'root'
})
export class boService {
  private getHeaders(): HttpHeaders {
    let token = sessionStorage.getItem("token");
    if (token == null || token == undefined) {
      token = "Dummy Value";
    }
    return new HttpHeaders().set("Authorization", "Bearer " + token);
  }
  constructor(private httpClient: HttpClient) { }

  public getRoleById(boUserId: number) {
    let url = `${environment.apiUrl}/um/api/bo/getRoleById?boUserId=`+boUserId; 
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }

  public boUserEdit(req: any) {
    let url = `${environment.apiUrl}/um/api/bo/editBOUser`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
  );
  return this.httpClient.put<any>(url,req,{ headers: h });
  }
  public createBOUser(req: any) {
    let url = `${environment.apiUrl}/um/api/bo/createBOUser`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
  );
  return this.httpClient.post<any>(url,req,{ headers: h });
  }

  public getDepartmentByBranch(branchId: number) {
    let url = `${environment.apiUrl}/rmsbo/api/bo/departmentmanagement/getDepartmentByBranch?branchId=`+branchId; 
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }

  public deactiveAcc(userId:any,reason:any) {
    let url = `${environment.apiUrl}/um/api/bo/deactivateAcc?userId=`+userId+`&reason=`+reason; 
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllBackOffice() {
    let url = `${environment.apiUrl}/um/api/bo/getAll`; 
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public deleteAcc(userId:any) {
    let url = `${environment.apiUrl}/um/api/bo/deleteAcc?userId=`+userId; 
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  

  public getRolesByDepartment(department: number) {
    let url = `${environment.apiUrl}/rmsbo/api/role/rolemanagement/getRolesByDepartment?department=`+department; 
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }

  public getBranch() {
    let url = `${environment.apiUrl}/rmsbo/api/bo/branchmanagement/getBranch`; 
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
   generateOtp(request: GenerateOtpRequest): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.apiUrl}/um/api/otp/generate`,
      request
    );
  }

  /**
   * Reset Password
   * POST /um/api/pwd/forgotPasswordSetByBo/v2
   */
  resetPassword(request: ForgotPasswordRequest): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.apiUrl}/um/api/pwd/forgotPasswordSetByBo/v2`,
      request
    );
  }
 
}
