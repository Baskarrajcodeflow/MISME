import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserManagementServiceService {

  constructor() { }
  private apiUrl = environment.apiUrl + 'pm';
  endpoint : string = '';

  // createUser(req:any): Observable <any>{
  //   this.endpoint = this.apiUrl +'/um/admin/createUser';
  //   return this.apiService.post<any>(this.endpoint,req);
  // }

}
