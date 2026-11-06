import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BulkService {
    constructor(private httpClient: HttpClient) { }
    private getHeaders(): HttpHeaders {
      let token = sessionStorage.getItem('token');
      if (token == null || token == undefined) {
        token = "Dummy Value";
      }
      return new HttpHeaders()
        .set("Authorization", "Bearer " + token);
    }
    public authorizeCustomeronboarding(authorizedBy:any,serviceName:any,metaId:any,value:boolean) {
        let url = `${environment.apiUrl}/ts/api/bulkUpload/authorizeForCustomerOnboarding?authorizedBy=${authorizedBy}&serviceName=${serviceName}&metaId=${metaId}&value=${value}`;
        let h: HttpHeaders = this.getHeaders().set(
          "Content-Type",
          "application/json"
        );
        return this.httpClient.get<any>(url, { headers: h });
      }
      public authorizeSalaryUpload(authorizedBy:any,serviceName:any,metaId:any,value:boolean) {
        let url = `${environment.apiUrl}/ts/api/bulkUpload/authorizeForSalaryUpload?authorizedBy=${authorizedBy}&serviceName=${serviceName}&metaId=${metaId}&value=${value}`;
        let h: HttpHeaders = this.getHeaders().set(
          "Content-Type",
          "application/json"
        );
        return this.httpClient.get<any>(url, { headers: h });
      }
  
}  