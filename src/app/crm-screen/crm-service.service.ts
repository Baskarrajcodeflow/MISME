import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { AccessChannelReq, searchReq, SearchResult, UserKycData } from './models';

@Injectable({
  providedIn: 'root'
})
export class CrmServiceService {
  getSearchResult(): SearchResult[] {
    return this.searchResults;

  }
  setSearchResult(searchResult: SearchResult[]) {
    this.searchResults = searchResult;
  }
  setUserDetails(userDetails: UserKycData) {
    this.customerUserDetails = userDetails;
  }
  getUserDetails(): UserKycData {
    return this.customerUserDetails;
  }

  constructor(private http: HttpClient) { }
  token: any;
  customerUserDetails!: UserKycData;
  searchResults: SearchResult[] = [];

  private getHeaders(): HttpHeaders {
    let token;
    if (localStorage) {
      token = localStorage.getItem("JWT_TOKEN");
      this.token = localStorage.getItem("JWT_TOKEN");
      if (token == null || token == undefined) {
        token = "Dummy Value";
      }
    }
    return new HttpHeaders().set("Authorization", "Bearer " + token);
  }
  public searchUsers(req: searchReq) {
    let url = `${environment.apiUrl}/crm/api/searchUsers`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url, req, { headers: h });


  }

  public viewUser(userId: number) {
    let url = `${environment.apiUrl}/crm/api/user/${userId}/details`;

    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }
  public addAccessChannel(req: AccessChannelReq) {
    let url = `${environment.apiUrl}/crm/api/accessChannel/add`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url, req, { headers: h });


  }
  public removeAccessChannel(req: AccessChannelReq) {
    let url = `${environment.apiUrl}/crm/api/accessChannel/remove`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url, req, { headers: h });


  }
  public getAllDormantUsers(page: number) {
    let url = `${environment.apiUrl}/crm/api/dormant/users?page=0`;

    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }
  public activateDormantUser(userId: number) {
    let url = `${environment.apiUrl}/crm/api/dormant/${userId}/activate`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public changeLogs(kycId: any, page: number, size: number) {
    let url = `${environment.apiUrl}/crm/api/kyc/changeLogs?kycId=` + kycId + `&page=` + page + `&size=` + size;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public getWalletBalance(accNo: string) {
    let url = `${environment.apiUrl}/crm/api/wallet/balance?accNo=${accNo}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }
  public getTransactionHistory(walletNo: string, txnType?: string, fromDate?: string, toDate?: string, page?: number) {
    let url = `${environment.apiUrl}/crm/api/${walletNo}/miniStatement?txnType=${txnType || 'ALL'}&fromDate=${fromDate || ''}&toDate=${toDate || ''}&page=${page || 0}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }
  public getTransactionGraph(walletNo: string) {
    let url = `${environment.apiUrl}/crm/api/${walletNo}/txnGraph`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }
  public getDeActivateUsers(page: number) {
    let url = `${environment.apiUrl}/crm/api/getDeActiveUser?page=${page}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }
  public getActiveUser(page: number) {
    let url = `${environment.apiUrl}/crm/api/getActiveUser?page=${page}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }
  public getActivatingUser(page: number) {
    let url = `${environment.apiUrl}/crm/api/getActivatingUser?page=${page}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }
  public getFirstDeActiveUser(page: number) {
    let url = `${environment.apiUrl}/crm/api/getFirstDeActiveUser?page=${page}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }
  public getSuspendUserList(page: number) {
    let url = `${environment.apiUrl}/crm/api/getSuspendUserList?page=${page}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }
  public getPasswordLockutUserList(page: number) {
    let url = `${environment.apiUrl}/crm/api/getPasswordLockutUserList?page=${page}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }
  public initiateEditDepositLimit(userId: number, newLimit: number) {
    let url = `${environment.apiUrl}/crm/api/initiateEditDepositLimit?userId=${userId}&deLimit=${newLimit}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url, { headers: h });

  }
  public authorizeEditDepositLimit(userId: number) {
    let url = `${environment.apiUrl}/crm/api/authorizeEditDepositLimit?userId=${userId}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url, { headers: h });
  }
  public notification(req: any) {
    let url = `${environment.apiUrl}/crm/notification/search`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url, req, { headers: h });
  }
  public manualNotification(req: any) {
    let url = `${environment.apiUrl}/crm/notification/manual`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url, req, { headers: h });
  }
  public sendNotification(req: FormData) {
    let url = `${environment.apiUrl}/crm/notification/upload`;
    return this.http.post<any>(url, req, {
      headers: this.getHeaders()
    });
  }
}
