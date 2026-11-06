import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.apiUrl;
  private getHeaders(): HttpHeaders {
    let token;
    if (sessionStorage) {
      token = sessionStorage.getItem(
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MTkyOTQ4NzgsImV4cCI6MTc1MDgzMDg3OCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.8FGhnd3Lgjg7Im46PjQS4WrMlreH2MGu2O-f_gxfCCk"
      );
      if (token == null || token == undefined) {
        token = "Dummy Value";
      }
    }
    return new HttpHeaders().set("Authorization", "Bearer " + token);
  }
  // public getCountries() {
  //   let url = environment.apiUrl+ "kyc/locations/countries";
  //   let h: HttpHeaders =
  //     this.getHeaders().set("Content-Type", "application/json");
  //     return this.httpClient.get<any>(url,{headers:h})
  // }
  public addCustomerSign(file1: File, fieldname: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    // file.append('customerKycId', photoId)
    // file.append('type', customerData)
    let url = `${environment.apiUrl}/kyc/customer/uploadImage?mapping=` + fieldname;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public getCustomerProfile(wallet: any) {
    let h: HttpHeaders = this.getHeaders();  
    let url = `${environment.apiUrl}/ts/api/transaction-services/findUser?phoneOrWalletNo=`+ wallet +`&meta=WALLET`;
    return this.httpClient.get<any>(url, { headers: h })
  }
  public editProfilePhoneEmail(req: any) {
    let url = `${environment.apiUrl}/um/profile/update/createRequest`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public getAllPhoneEmailEditRequests(page: number, status: string = 'PENDING', sort: string = 'ASC', pageSize: number = 10) {
    let h: HttpHeaders = this.getHeaders().set(
      'Content-Type',
      'application/json'
    );
    let url = `${environment.apiUrl}/um/profile/update/filter`;
    const body = {
      filterType: 'STATUS',
      filterValues: [status],
      page,
      pageSize,
      sort
    };
    return this.httpClient.post<any>(url, body, { headers: h });
  }

  public approvePhoneEmailEditRequest(req: any) {
    let h: HttpHeaders = this.getHeaders();
    let url = `${environment.apiUrl}/um/profile/update/approve`;
    return this.httpClient.post<any>(url, req, { headers: h });
  }

  public rejectPhoneEmailEditRequest(req: any) {
    let h: HttpHeaders = this.getHeaders();
    let url = `${environment.apiUrl}/um/profile/update/reject`;
    return this.httpClient.post<any>(url, req, { headers: h });
  }

  public uploadPhoneEmailEditSignature(file: File, reqId: number) {
    if (!file) {
      throw new Error('File is required for uploadPhoneEmailEditSignature');
    }
    if (reqId === null || reqId === undefined) {
      throw new Error('reqId is required for uploadPhoneEmailEditSignature');
    }

    let h: HttpHeaders = this.getHeaders();
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('reqId', String(reqId));

    let url = `${environment.apiUrl}/um/profile/update/sign?reqId=` + reqId;
    console.log('Uploading file to URL:', url);
    console.log('File details - Name:', file.name, 'Size:', file.size, 'Type:', file.type);

    return this.httpClient.post<any>(url, formData, { headers: h });
  }
    public getUserKYC(uid: string) {
    let h: HttpHeaders = this.getHeaders();
    let url = `${environment.apiUrl}/kyc/compliance/findKycByUser/` + uid;
    return this.httpClient.get<any>(url, { headers: h })
  }

  public getUserSignatureDocument(path: string) {
    let h: HttpHeaders = this.getHeaders();
    let url = `${environment.apiUrl}/um/static/userRegUpdates/${path}`;
    return this.httpClient.get(url, { headers: h, responseType: 'blob' });
  }

  public getCountries() {
    let url =`${environment.apiUrl}/kyc/locations/countries`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    
    return this.httpClient.get<any>(url, { headers: h });
  }
  public resetPassword(req: any) {
    let url = `${environment.apiUrl}/um/api/pwd/update`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public getprovinces() {
    let url =`${environment.apiUrl}/kyc/locations/provinces`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getdistricts(provinceId: any) {
    let url =`${environment.apiUrl}/kyc/locations/provinces/`+ provinceId +`/districts`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h })
  }
}
