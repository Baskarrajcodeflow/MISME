import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AmlService {

  constructor(private httpClient: HttpClient) { }
  private getHeaders(): HttpHeaders {
    let token = sessionStorage.getItem('token');
    if (token == null || token == undefined) {
      token = "Dummy Value";
    }
    return new HttpHeaders()
      .set("Authorization", "Bearer " + token);
  }
  public listRiskParameter() {
    let url = `${environment.apiUrl}/risk/param`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.get<any>(url, { headers: h });
  }
  public listRiskTier() {
    let url = `${environment.apiUrl}/risk/tier`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.get<any>(url, { headers: h });
  }
  public deleteRiskParameter(req:any) {
    let url = `${environment.apiUrl}/risk/param`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.post<any>(url,req, { headers: h });
  }
  public deleteRiskTier(req:any) {
    let url = `${environment.apiUrl}/risk/tier`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.post<any>(url,req,{ headers: h });
  }

  public addRiskParamABMMC(req:any) {
    let url = `${environment.apiUrl}/risk/param`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.post<any>(url, req,{ headers: h });
  }
  public addRiskTierABMMC(req:any) {
    let url = `${environment.apiUrl}/risk/tier`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.post<any>(url, req,{ headers: h });
  }
  public uploadFile(file1: File,source:any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    file.append('source', source)
    // file.append('type', customerData)
    let url = `${environment.apiUrl}/sdn/upload`
    return this.httpClient.post<any>(url, file, { headers: h })
  }
   
  public searchSdn(req:any) {
    let url = `${environment.apiUrl}/sdn/search`;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.post<any>(url,req, { headers: h })
  } 
}
