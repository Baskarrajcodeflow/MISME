  import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModuleAccessAuthority } from '../entity.types';

@Injectable({
  providedIn: 'root'
})
export class AuthorityService {

  private apiUrl = 'http://localhost:8072/rmsbo/api/bo/group'; // Set your API URL

  constructor(private http: HttpClient) {}

  getAllAuthorities(): Observable<ModuleAccessAuthority[]> {
    return this.http.get<ModuleAccessAuthority[]>(`${this.apiUrl}`);
  }

  assignAuthorityToModule(authorityId: number, moduleId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/assign/${authorityId}`, { moduleId });
  }

  removeAuthorityFromModule(authorityId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/remove/${authorityId}`, {});
  }
}
