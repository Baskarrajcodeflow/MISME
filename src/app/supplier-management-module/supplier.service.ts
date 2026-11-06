import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SupplierService{
  private getHeaders():HttpHeaders
  {
    let token =  sessionStorage.getItem('token');
    if(token==null||token==undefined){
      token="Dummy Value";}
    return new HttpHeaders()
    .set("Authorization","Bearer "+token);
  }
  public getCountries()
  {
    let url = `${environment.apiUrl}/app/countries`;
    let h:HttpHeaders = 
        this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.get<any>(url,{headers:h})
  }
  public addSupplier(req:any)
  {
    let url = `${environment.apiUrl}/sm/api/agent/add-supplier`;
    let h:HttpHeaders = 
        this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.post<any>(url,req,{headers:h})
  }
  public getSupplier()
  {
    let url = `${environment.apiUrl}/sm/api/agent/getAllSupplier`;
    console.log(url,"sup url");
    
    let h:HttpHeaders = 
    this.getHeaders().set("Content-Type","application/json");
    console.log(h,"header");

   return this.httpClient.get<any>(url,{headers:h})
  }
  public getCorporateWallet()
  {
    let url = `${environment.apiUrl}/sm/api/agent/getWallet`;
    let h:HttpHeaders = 
        this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.get<any>(url,{headers:h})
  }
  public SupplierTopUpPurchase(req:any)
  {
    let url = `${environment.apiUrl}/tms/api/tms/router/basic`;
    let h:HttpHeaders = 
        this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.post<any>(url,req,{headers:h})
  }
  public getInventory()
  {
    let url = `${environment.apiUrl}/sm/api/agent/get-inventory`;
    let h:HttpHeaders = 
        this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.get<any>(url,{headers:h})
  }
  public update(req:any,id: any) {
    let url = `${environment.apiUrl}/sm/api/agent/update/`+id;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.put<any>(url, req, { headers: h })
  }
  public getSupplierById(SupplierId:any)
  {
    let url = `${environment.apiUrl}/sm/api/agent/get/`+SupplierId;
    let h:HttpHeaders = 
        this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.get<any>(url,{headers:h})
  }
  public supplierAccountFreeze(SupplierId: any) {
    let url = `${environment.apiUrl}/supplier/supplierAccountFreeze?SupplierId=`+SupplierId;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url,{ headers: h })
  }
  public supplierFreeze() {
    let url = `${environment.apiUrl}supplier/editSupplier`
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, { headers: h })
  }
  public getGlAccount()
  {
    let url = `${environment.apiUrl}gl/getGlAccount`
    let h:HttpHeaders = 
        this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.get<any>(url,{headers:h})
  }
  constructor(private httpClient:HttpClient) { }
}
