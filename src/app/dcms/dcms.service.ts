import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class DcmsService {
  private getHeaders(): HttpHeaders {
    let token = sessionStorage.getItem("token");
    if (token == null || token == undefined) {
      token = "Dummy Value";
    }
    return new HttpHeaders().set("Authorization", "Bearer " + token);
  }
  constructor(private httpClient: HttpClient) { }
  public getProjectList() {
    let url = `${environment.apiUrl}/`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.get<any>(url, { headers: h });
  }
  public getDistributions() {
    let url = `${environment.apiUrl}/`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.get<any>(url, { headers: h });
  }
  public getFileDataByID(id: string) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/summaries/${id}/rows`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log("Fetching rows by ID:", url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getFileDataByRef(ref: any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/summaries/by-ref/${ref}/rows`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log("Fetching uploaded rows by ref:", url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public generateToken(fileDetailsId: string) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/summaries/${fileDetailsId}/generate-tokens`;
    let h: HttpHeaders = this.getHeaders().set("Content-Type", "application/json");
    console.log("Generating token for file:", fileDetailsId, "URL:", url);
    return this.httpClient.post<any>(url, {}, { headers: h });
  }
  public editBenData(id: any, ph: any, amount: any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/rows/edit?id=` + id + "&phone=" + ph + "&amount=" + amount;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log("Fetching uploaded rows by ref:", url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public approveFile(id: any, status: any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/rows/delete?id=` + id + "&rejectOrApprove=" + "true";
    let h: HttpHeaders = this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url);
  }
  public rejectFile(id: any, status: any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/rows/delete?id=` + id + "&rejectOrApprove=" + "false";
    let h: HttpHeaders = this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url);
  }
  public getFileDataByStatus() {
    let url = `${environment.apiUrl}/ts/api/transaction-services/summaries/status-wise`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log("Fetching status-wise data:", url);
    return this.httpClient.get<any>(url, { headers: h });
  }

  public getSubprojectList() {
    let url = `${environment.apiUrl}/`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.get<any>(url, { headers: h });
  }
  public getFundingPartyList() {
    let url = `${environment.apiUrl}/um/api/bo/getAllFundingParty`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.get<any>(url, { headers: h });
  }
  public getFileData() {
    let url = `${environment.apiUrl}/ts/api/transaction-services/summaries`;
    // let url = `${environment.apiUrl}/ts/api/transaction-services/summaries/status-wise`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.get<any>(url, { headers: h });
  }
  public addBenFile(req: any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/benUpload`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public addFundingParty(id: any) {
    let url = `${environment.apiUrl}/um/api/corps/markAsFundingParty?corpId=` + id;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.get<any>(url, { headers: h });
  }
  public addProject() {
    let url = `${environment.apiUrl}/`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.post<any>(url, { headers: h });
  }
  public addSubproject() {
    let url = `${environment.apiUrl}/`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.post<any>(url, { headers: h });
  }
  public getBeneficiariesList() {
    let url = `${environment.apiUrl}/`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.post<any>(url, { headers: h });
  }
  public getReports() {
    let url = `${environment.apiUrl}/`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.post<any>(url, { headers: h });
  }
}
