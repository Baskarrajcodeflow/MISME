import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
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
    return this.httpClient.get<any>(url, { headers: h });
  }

  public getTotalAgentCount(){
    let url = `${environment.apiUrl}/ts/api/transaction-services/getTotalAgentCount`;
        let h: HttpHeaders = this.getHeaders().set(
          "Content-Type",
          "application/json"
        );
        return this.httpClient.get<any>(url, { headers: h });

  }
  public getTotalCorporateCount(){
    let url = `${environment.apiUrl}/ts/api/transaction-services/getTotalCorporateCount`;
        let h: HttpHeaders = this.getHeaders().set(
          "Content-Type",
          "application/json"
        );
        
        return this.httpClient.get<any>(url, { headers: h });

  }
  public getTotalSubAgentCount(){
    let url = `${environment.apiUrl}/ts/api/transaction-services/getTotalSubAgentCount`;
        let h: HttpHeaders = this.getHeaders().set(
          "Content-Type",
          "application/json"
        );
        
        return this.httpClient.get<any>(url, { headers: h });

  }
  public getTotalMerchantCount(){
    let url = `${environment.apiUrl}/ts/api/transaction-services/getTotalMerchantCount`;
        let h: HttpHeaders = this.getHeaders().set(
          "Content-Type",
          "application/json"
        );
        
        return this.httpClient.get<any>(url, { headers: h });

  }

  public largeTransactionCount(){
    let url = `${environment.apiUrl}/ts/api/transaction-services/largeTransactionCount`;
        let h: HttpHeaders = this.getHeaders().set(
          "Content-Type",
          "application/json"
        );
        
        return this.httpClient.get<any>(url, { headers: h });

  }

  public getTotalCustomerCount(){
    let url = `${environment.apiUrl}/ts/api/transaction-services/getTotalCustomerCount`;
        let h: HttpHeaders = this.getHeaders().set(
          "Content-Type",
          "application/json"
        );
        
        return this.httpClient.get<any>(url, { headers: h });

  }

  public getEmoneyBalance(){
    let url = `${environment.apiUrl}/ts/api/transaction-services/getEmoneyBalance`;
        let h: HttpHeaders = this.getHeaders().set(
          "Content-Type",
          "application/json"
        );
        
        return this.httpClient.get<any>(url, { headers: h });

  }

  public getSetaraganBalance(){
    let url = `${environment.apiUrl}/ts/api/transaction-services/getSetaraganBalance`;
        let h: HttpHeaders = this.getHeaders().set(
          "Content-Type",
          "application/json"
        );
        
        return this.httpClient.get<any>(url, { headers: h });

  }   

  public getActiveServiceBalance(){
    let url = `${environment.apiUrl}/ts/api/transaction-services/getActiveServiceBalance`;
        let h: HttpHeaders = this.getHeaders().set(
          "Content-Type",
          "application/json"
        );
        
        return this.httpClient.get<any>(url, { headers: h });

  }   

  public getAwccInventoryBalance(){
    let url = `${environment.apiUrl}/ts/api/transaction-services/getAwccInventoryBalance`;
        let h: HttpHeaders = this.getHeaders().set(
          "Content-Type",
          "application/json"
        );
        
        return this.httpClient.get<any>(url, { headers: h });

  }  
   public getTotalUsers(){
    let url = `${environment.apiUrl}/um/api/dashboard/userReg`;
        let h: HttpHeaders = this.getHeaders().set(
          "Content-Type",
          "application/json"
        );
        
        return this.httpClient.get<any>(url, { headers: h });

  } 
  public getTotalKYC(){
    let url = `${environment.apiUrl}/um/api/dashboard/kycStatus`;
        let h: HttpHeaders = this.getHeaders().set(
          "Content-Type",
          "application/json"
        );
        
        return this.httpClient.get<any>(url, { headers: h });

  } 
    public getTransactionSummary(year:string){
    let url = `${environment.apiUrl}/um/api/dashboard/txnStatus?year=${year}`;
        let h: HttpHeaders = this.getHeaders().set(
          "Content-Type",
          "application/json"
        );
        
        return this.httpClient.get<any>(url, { headers: h });

  } 
  public getTransactionSummaryAmount(year:string){
    let url = `${environment.apiUrl}/um/api/dashboard/txnAmounts?year=${year}`;
        let h: HttpHeaders = this.getHeaders().set(
          "Content-Type",
          "application/json"
        );
        
        return this.httpClient.get<any>(url, { headers: h });

  } 
}
