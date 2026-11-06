import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
    constructor(private httpClient: HttpClient) { }
    private getHeaders(): HttpHeaders {
      let token = sessionStorage.getItem('token');
      if (token == null || token == undefined) {
        token = "Dummy Value";
      }
      return new HttpHeaders()
        .set("Authorization", "Bearer " + token);
    }

    public getSystemWallets(){
      let url =`${environment.apiUrl}/um/api/bo/corpByType?type=SYSTEM`;
      let h: HttpHeaders = this.getHeaders().set(
        "Content-Type",
        "application/json"
      );
      console.log(url);
      
      return this.httpClient.get<any>(url, { headers: h });
  
    }

    public getBanks(){
      let url =`${environment.apiUrl}/um/bank`;
      let h: HttpHeaders = this.getHeaders().set(
        "Content-Type",
        "application/json"
      );
      console.log(url);
      
      return this.httpClient.get<any>(url, { headers: h });
  
    }

    public addSystemWallet(userId: any, req: any) {
      let url =`${environment.apiUrl}/um/bank/account/add/systemWallet?baseUserId=`+userId;
        let h: HttpHeaders = this.getHeaders().set(
          "Content-Type",
          "application/json"
        );
      const headers: HttpHeaders = this.getHeaders(); // Get the headers with the authorization token
  
      return this.httpClient.post<any>(url,req, {headers});
  }

  public getLinkedAccountsSystemWallet(userId: any) {
    let url =`${environment.apiUrl}/um/bank/account/get/systemWalletBank?baseUserId=`+userId;
      let h: HttpHeaders = this.getHeaders().set(
        "Content-Type",
        "application/json"
      );
    const headers: HttpHeaders = this.getHeaders(); // Get the headers with the authorization token

    return this.httpClient.post<any>(url, {headers});
}
    
    public authorizeWallet(id: number, req: any) {
      const headers: HttpHeaders = this.getHeaders(); // Get the headers with the authorization token
      const url = environment.apiUrl + "/um/api/bo/authorizeWallet?id="+id;

      return this.httpClient.post<any>(url,req, {headers});
  }

  public authorizeSystemWalletAccount(accountId: any, userId: any, pin: any) {
    let url =`${environment.apiUrl}/um/bank/account/authorize/systemWallet?pin=`+pin +`baseUserId=`+userId+`bankAccountId=`+accountId;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
  const headers: HttpHeaders = this.getHeaders(); // Get the headers with the authorization token

  return this.httpClient.post<any>(url, {headers});
}

public addPushPull(req : any) {
  let url =`${environment.apiUrl}/ts/api/transaction-services/addPushPullReq`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
const headers: HttpHeaders = this.getHeaders(); // Get the headers with the authorization token

return this.httpClient.post<any>(url,req, {headers});
}

public getPullPush(userId: any) {
  let url =`${environment.apiUrl}/ts/api/transaction-services/getPushPullReq?baseUserId=`+userId;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
  const headers: HttpHeaders = this.getHeaders(); // Get the headers with the authorization token

  return this.httpClient.get<any>(url, {headers});
}

public authorizePushPull(req : any) {
  let url =`${environment.apiUrl}/ts/api/transaction-services/authorizePushPullReq`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
const headers: HttpHeaders = this.getHeaders(); // Get the headers with the authorization token

return this.httpClient.post<any>(url, req, {headers});
}

public getWalletBalance(phoneOrWalletNo: any) {
  let url =`${environment.apiUrl}/ts/api/transaction-services/CurrentBalance?phoneOrWalletNo=${phoneOrWalletNo}&meta=WALLET`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
  const headers: HttpHeaders = this.getHeaders(); // Get the headers with the authorization token

  return this.httpClient.get<any>(url, {headers});
}


public getTranasctionHistory(walletNo: any,trxnType:any,fromDate:any,toDate:any) {
  let url = environment.apiUrl + `/ts/api/transaction-services/getFilteredHistory?walletNo=${walletNo}&trxnType=${trxnType}&fromDate=${fromDate}&toDate=${toDate}`;
  let h: HttpHeaders =
    this.getHeaders().set("Content-Type", "application/json");
  return this.httpClient.get<any>(url, { headers: h })
}

  
}