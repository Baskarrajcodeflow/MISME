import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { customerRegistration } from '../../../interface/interface-list';


@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(private httpClient:HttpClient) { }
  private apiUrl = environment.apiUrl;
  endpoint : string = '';
  private getHeaders(): HttpHeaders {
    let token ;
    if(sessionStorage){
       token = sessionStorage.getItem('token');
    if (token == null || token == undefined) {
      token = "Dummy Value";
    }
  } 
    return new HttpHeaders()
      .set("Authorization", "Bearer " + token);
  }

  public createUser(req: any) {
    let url = environment.apiUrl+ "um/api/bo/createBOUser";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public getAllUsers() {
    let url = environment.apiUrl+ "um/api/bo/getAll";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
      return this.httpClient.get<any>(url,{headers:h})
  }
  public activateAdminUser(req: any) {
    let url = environment.apiUrl+"um/api/bo/reactivate";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public deleteUser(req: any) {
    let url = environment.apiUrl+"um/admin/delete";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public deActivateAdminUser(req: any) {
    let url = environment.apiUrl+"um/api/bo/deactivate";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public registerCustomer(req: customerRegistration) {
    let url = environment.apiUrl+ "um/api/bo/registerCustomer";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<boolean>(url, req, { headers: h })
  }
  // createRole(role: Partial<Role>): Observable<Role> {
  //   return this.http.post<Role>(this.apiUrl, role);
  // }
  public getRole() {
    let url = environment.apiUrl+ "/rmsbo/api/bo/RoleMgntScreen/role";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
      return this.httpClient.get<any>(url,{headers:h})
  }
  public updateUser(userId:any,req: any) {
    let url = environment.apiUrl+ "um/admin/createUser";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public editCustomer(req: any) {
    let url = environment.apiUrl+ "um/api/bo/registerCustomer";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public getCountries() {
    let url = environment.apiUrl+ "/kyc/locations/countries";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
      return this.httpClient.get<any>(url,{headers:h})
  }
}
