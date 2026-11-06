import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Branch } from '../entity.types';

@Injectable(
    {
         providedIn: 'any'
    }
)
export class BranchService {
  private apiUrl = 'http://localhost:8072/rmsbo/api/bo/branch';

  constructor(private http: HttpClient) { }

  getAllBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(this.apiUrl);
  }

  getBranchByName(name: string|null): Observable<Branch> {
    
    return this.http.get<Branch>(`${this.apiUrl}/${name}`);
  }

  addBranch(branch: Partial<Branch>): Observable<Branch> {
    return this.http.post<Branch>(this.apiUrl, branch);
  }

  updateBranch(branch: Branch): Observable<Branch> {
    return this.http.put<Branch>(`${this.apiUrl}/${branch.id}`, branch);
  }

  deleteBranch(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
