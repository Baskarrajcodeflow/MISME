import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class roleService {
    private getHeaders(): HttpHeaders {
        let token = sessionStorage.getItem("token");
        if (token == null || token == undefined) {
            token = "Dummy Value";
        }
        return new HttpHeaders().set("Authorization", "Bearer " + token);
    }
    constructor(private httpClient: HttpClient) { }

    public getRoleById(boUserId: number) {
        let url = `${environment.apiUrl}/um/api/bo/getRoleById?boUserId=` + boUserId;
        let h: HttpHeaders = this.getHeaders().set(
            "Content-Type",
            "application/json"
        );
        console.log(url);
        return this.httpClient.get<any>(url, { headers: h });
    }
    public boUserEdit(req: any) {
        let url = `${environment.apiUrl}/um/api/bo/editBOUser`;
        let h: HttpHeaders = this.getHeaders().set(
            "Content-Type",
            "application/json"
        );
        console.log(url);
        return this.httpClient.put<any>(url, req, { headers: h });
    }
    public getDepartmentByBranch(branchId: number) {
        let url = `${environment.apiUrl}/rmsbo/api/bo/departmentmanagement/getDepartmentByBranch?branchId=` + branchId;
        let h: HttpHeaders = this.getHeaders().set(
            "Content-Type",
            "application/json"
        );
        console.log(url);
        return this.httpClient.get<any>(url, { headers: h });
    }
    public getRolesByDepartment(department: number) {
        let url = `${environment.apiUrl}/rmsbo/api/role/rolemanagement/getRolesByDepartment?department=` + department;
        let h: HttpHeaders = this.getHeaders().set(
            "Content-Type",
            "application/json"
        );
        console.log(url);
        return this.httpClient.get<any>(url, { headers: h });
    }
    public getBranch() {
        let url = `${environment.apiUrl}/rmsbo/api/bo/branchmanagement/getBranch`;
        let h: HttpHeaders = this.getHeaders().set(
            "Content-Type",
            "application/json"
        );
        console.log(url);
        return this.httpClient.get<any>(url, { headers: h });
    }
    public getAllBranches() {
        let url = `${environment.apiUrl}/rmsbo/api/bo/branch`;
        let h: HttpHeaders = this.getHeaders().set(
            "Content-Type",
            "application/json"
        );
        console.log(url);
        return this.httpClient.get<any>(url, { headers: h });
    }
    public getRoles(page: number, size: number) {
        let url = `${environment.apiUrl}/rmsbo/api/role/rolemanagement/getRoles?page=${page}&size=${size}`;

        let h: HttpHeaders = this.getHeaders().set(
            "Content-Type",
            "application/json"
        );

        return this.httpClient.get<any>(url, { headers:h });
    }
    public getComponent(): Observable<any> {
        const url = `${environment.apiUrl}/rmsbo/api/bo/component/getComponent`;

        let h: HttpHeaders = this.getHeaders().set(
            "Content-Type",
            "application/json"
        );

        return this.httpClient.get<any>(url, { headers:h });
    }
    public addComponent(componentName: any): Observable<any> {
        const url = `${environment.apiUrl}/rmsbo/api/bo/component/addComponent?componentName=`+componentName;
        let h: HttpHeaders = this.getHeaders().set(
            "Content-Type",
            "application/json"
        );
        return this.httpClient.post<any>(url,componentName, { headers: h });
    }
    public addRole(req: any): Observable<any> {
        const url = `${environment.apiUrl}/rmsbo/api/role/rolemanagement/addRole`;
        let h: HttpHeaders = this.getHeaders().set(
            "Content-Type",
            "application/json"
        );
        return this.httpClient.post<any>(url,req,{ headers: h });
    }
    public getSubComponentByComponent(componentId:any) {
        let url = `${environment.apiUrl}/rmsbo/api/role/subcomponent/getSubComponentByComponent?componentId=`+componentId;
        let h: HttpHeaders = this.getHeaders().set(
            "Content-Type",
            "application/json"
        );
        console.log(url);
        return this.httpClient.get<any>(url, { headers: h });
    }
    public addSubComponent(req: any): Observable<any> {
        const url = `${environment.apiUrl}/rmsbo/api/role/subcomponent/addSubComponent`;
        let h: HttpHeaders = this.getHeaders().set(
            "Content-Type",
            "application/json"
        );
        return this.httpClient.post<any>(url,req,{ headers: h });
    }
    public createDepartment(req: any): Observable<any> {
        const url = `${environment.apiUrl}/rmsbo/api/bo/departmentmanagement/createDepartment`;
        let h: HttpHeaders = this.getHeaders().set(
            "Content-Type",
            "application/json"
        );
        return this.httpClient.post<any>(url,req,{ headers: h });
    }
    // public createDepartment(req: any): Observable<any> {
    //     const url = `${environment.apiUrl}/rmsbo/api/bo/departmentmanagement/createDepartment`;
    //     let h: HttpHeaders = this.getHeaders().set(
    //         "Content-Type",
    //         "application/json"
    //     );
    //     return this.httpClient.post<any>(url,req,{ headers: h });
    // }
    
    public editRole(req: any): Observable<any> {
        const url = `${environment.apiUrl}/rmsbo/api/role/rolemanagement/editRole`;
        let h: HttpHeaders = this.getHeaders().set(
            "Content-Type",
            "application/json"
        );
        return this.httpClient.post<any>(url,req,{ headers: h });
    }


}
