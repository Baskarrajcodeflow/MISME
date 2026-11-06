import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { any } from '../entity.types';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'http://localhost:8072/rmsbo/api/bo/RoleMgntScreen/any  ';

  constructor(private http: HttpClient) { }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createRole(any: Partial<any>): Observable<any> {
    return this.http.post<any>(this.apiUrl, any);
  }

  updateRole(any: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${any.id}`, any);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
