import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../entity.types';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://localhost:8072/rmsbo/api/bo/departments';  // Your API endpoint

  constructor(private http: HttpClient) { }

  getDepartmentsByBranchId(branchId: number): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/by-branch/${branchId}`);
  }

  addDepartment(department: Partial<Department>): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, department);
  }

  updateDepartment(department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/${department.id}`, department);
  }

  deleteDepartment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
