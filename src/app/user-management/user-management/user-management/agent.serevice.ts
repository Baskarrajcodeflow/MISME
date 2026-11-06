import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MiPayAgent } from './user.typs';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private apiUrl = '/um/api/agent';

  constructor(private http: HttpClient) {}

  private getHeaders(userId: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
//add jwt token
    });
  }

  registerSubAgent(me: string, subAgent: MiPayAgent): Observable<boolean> {
    const headers = this.getHeaders(me);
    return this.http.post<boolean>(`${this.apiUrl}/registerSubAgent`, subAgent, { headers });
  }

  registerAgent(agent: MiPayAgent): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/signUpForAgent`, agent);
  }

  registerMerchant(me: string, merchant: MiPayAgent): Observable<boolean> {
    const headers = this.getHeaders(me);
    return this.http.post<boolean>(`${this.apiUrl}/registerMerchant`, merchant, { headers });
  }

  registerSubMerchant(me: string, subMerchant: MiPayAgent): Observable<boolean> {
    const headers = this.getHeaders(me);
    return this.http.post<boolean>(`${this.apiUrl}/registerSubMerchant`, subMerchant, { headers });
  }

  registerHandSeller(me: string, handSeller: MiPayAgent): Observable<boolean> {
    const headers = this.getHeaders(me);
    return this.http.post<boolean>(`${this.apiUrl}/registerHandSeller`, handSeller, { headers });
  }

  uploadImage(me: string, extension: string, proofType: number, file: File): Observable<boolean> {
    const headers = this.getHeaders(me);
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('extension', extension);
    formData.append('proofType', proofType.toString());

    return this.http.post<boolean>(`${this.apiUrl}/uploadImage`, formData, {
      headers: headers.set('Content-Type', 'multipart/form-data'),
    });
  }
}
