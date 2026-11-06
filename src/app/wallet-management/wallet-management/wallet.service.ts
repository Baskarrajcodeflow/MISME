import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class walletService {
    private getHeaders(): HttpHeaders {
        let token = sessionStorage.getItem("token");
        if (token == null || token == undefined) {
            token = "Dummy Value";
        }
        return new HttpHeaders().set("Authorization", "Bearer " + token);
    }
    constructor(private httpClient: HttpClient) { }

    public getAllWallet() {
        let url = `${environment.apiUrl}/um/api/bo/getAllWallet`;
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
    public changeWalletStatus(id: any,req:any) {
        let url = `${environment.apiUrl}/um/api/bo/changeWalletStatus?id=`+id;
        let h: HttpHeaders = this.getHeaders().set(
            "Content-Type",
            "application/json"
        );
        console.log(url);
        return this.httpClient.post<any>(url, req, { headers: h });
    }
    
}