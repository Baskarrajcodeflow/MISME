import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permission } from '../entity.types';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private apiUrl = 'http://localhost:8072/rmsbo/api/bo/RoleMgntScreen/permissions';

  constructor(private http: HttpClient) { }

  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.apiUrl);
  }
}
