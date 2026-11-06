import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor (private  httpClient: HttpClient) { }
      private getHeaders(): HttpHeaders {
        let token = sessionStorage.getItem('token');
        if (token == null || token == undefined) {
          token = "Dummy Value";
        }
        return new HttpHeaders()
          .set("Authorization", "Bearer " + token);
      }

  public uploadBanner(id: Number,  file1: File) {
      let url = `${environment.apiUrl}/rmsbo/api/bo/banner/uploadImage?bannerId=${id}`;
      let h: HttpHeaders = this.getHeaders();     
      const file = new FormData();
      file.append("file", file1);
      return this.httpClient.post<any>(url, file, { headers: h })
    }

  public createBanner(createPayload: any) {
      let url = `${environment.apiUrl}/rmsbo/api/bo/banner/create`;

      let h: HttpHeaders = this.getHeaders().set(
        "Content-Type",
        "application/json"
      );
      return this.httpClient.post<any>(url, createPayload, { headers: h });
    }

  public editBanner(editPayload: any) {
      let url = `${environment.apiUrl}/rmsbo/api/bo/banner/edit`;

      let h: HttpHeaders = this.getHeaders().set(
        "Content-Type",
        "application/json"
      );
      return this.httpClient.post<any>(url, editPayload, { headers: h });
    }
  public getBanners() {
      let url = `${environment.apiUrl}/rmsbo/api/bo/banner`;
      let h: HttpHeaders = this.getHeaders().set(
        "Content-Type",
        "application/json"
      );
      return this.httpClient.get<any>(url, { headers: h });
    }
  public deleteBanner(id: number) {
      let url = `${environment.apiUrl}/rmsbo/api/bo/banner/delete?id=${id}`;
      let h: HttpHeaders = this.getHeaders().set(
        "Content-Type",
        "application/json"
      );
      return this.httpClient.get<any>(url, { headers: h });
    }
  public viewBanner(fileName: string) {
      let url = `${environment.apiUrl}/um/static/banner/${fileName}`;
      const headers = this.getHeaders();    
        this.httpClient.get(url, { headers, responseType: 'blob' }).subscribe(blob => {
          const objectUrl = URL.createObjectURL(blob);
          window.open(objectUrl, '_blank');
        }, error => {
          console.error('Error fetching the image:', error);
        });
    }
  }

