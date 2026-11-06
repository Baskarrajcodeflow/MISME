import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BackOffice, MiPayUser, BaseUser, MiPayAgent } from './user.typs';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private apiUrl = '/um/api/bo';

  constructor(private http: HttpClient) {}

  private getHeaders(userId: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-MLS-USER': userId,
      //ToDo add token
    });
  }

  createBOUser(user: BackOffice): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/registerBOUser`, user);
  }

  registerCustomer(me: string, miPayUser: MiPayUser): Observable<boolean> {
    const headers = this.getHeaders(me);
    return this.http.post<boolean>(`${this.apiUrl}/registerCustomer`, miPayUser, { headers });
  }

  deactivate(me: string, users: BaseUser[]): Observable<boolean> {
    const headers = this.getHeaders(me);
    return this.http.post<boolean>(`${this.apiUrl}/deactivate`, users, { headers });
  }

  reActivate(me: string, users: BaseUser[]): Observable<boolean> {
    const headers = this.getHeaders(me);
    return this.http.post<boolean>(`${this.apiUrl}/reactivate`, users, { headers });
  }

  registerSubAgent(me: string, subAgent: MiPayAgent, parentId: number): Observable<boolean> {
    const headers = this.getHeaders(me);
    return this.http.post<boolean>(`${this.apiUrl}/registerSubAgent`, subAgent, {
      headers,
      params: { parentId: parentId.toString() },
    });
  }

  registerAgent(agent: MiPayAgent): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/registerAgent`, agent);
  }

  registerMerchant(me: string, merchant: MiPayAgent, parentId: number): Observable<boolean> {
    const headers = this.getHeaders(me);
    return this.http.post<boolean>(`${this.apiUrl}/registerMerchant`, merchant, {
      headers,
      params: { parentId: parentId.toString() },
    });
  }

  registerSubMerchant(me: string, subMerchant: MiPayAgent, parentId: number): Observable<boolean> {
    const headers = this.getHeaders(me);
    return this.http.post<boolean>(`${this.apiUrl}/registerSubMerchant`, subMerchant, {
      headers,
      params: { parentId: parentId.toString() },
    });
  }

  registerHandSeller(me: string, handSeller: MiPayAgent, parentId: number): Observable<boolean> {
    const headers = this.getHeaders(me);
    return this.http.post<boolean>(`${this.apiUrl}/registerHandSeller`, handSeller, {
      headers,
      params: { parentId: parentId.toString() },
    });
  }

  editSubMerchant(me: string, user: MiPayAgent, parentId: number): Observable<boolean> {
    const headers = this.getHeaders(me);
    return this.http.put<boolean>(`${this.apiUrl}/editSubMerchant`, user, {
      headers,
      params: { parentId: parentId.toString() },
    });
  }

  editAgent(me: string, user: MiPayAgent, parentId: number): Observable<boolean> {
    const headers = this.getHeaders(me);
    return this.http.put<boolean>(`${this.apiUrl}/editAgent`, user, {
      headers,
      params: { parentId: parentId.toString() },
    });
  }

  editMerchant(me: string, user: MiPayAgent, parentId: number): Observable<boolean> {
    const headers = this.getHeaders(me);
    return this.http.put<boolean>(`${this.apiUrl}/editMerchant`, user, {
      headers,
      params: { parentId: parentId.toString() },
    });
  }

  editSubAgent(me: string, user: MiPayAgent, parentId: number): Observable<boolean> {
    const headers = this.getHeaders(me);
    return this.http.put<boolean>(`${this.apiUrl}/editSubAgent`, user, {
      headers,
      params: { parentId: parentId.toString() },
    });
  }
}
