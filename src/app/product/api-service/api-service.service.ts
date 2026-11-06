import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { AccountClosureRequest } from "../models/model";

@Injectable({
  providedIn: "root",
})
export class ApiServiceService {
  constructor(private http: HttpClient) { }
  token: any;
  private getHeaders(): HttpHeaders {
    let token;
    if (localStorage) {
      token = localStorage.getItem("JWT_TOKEN");
      this.token = localStorage.getItem("JWT_TOKEN");
      if (token == null || token == undefined) {
        token = "Dummy Value";
      }
    }
    return new HttpHeaders().set("Authorization", "Bearer " + token);
  }

  //--------------------------------------Amount Limit--------------------------//
  // public createAmountLimit(body: any) {
  //   let url = environment.apiUrl + "/pm/api/amountLimit/create-amount-limit";
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.post<any>(url, body, { headers: h });
  // }

  // public getAmountLimit() {
  //   let url = environment.apiUrl + `/pm/api/amountLimit/get-all?page=1`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.get<any>(url, { headers: h });
  // }

  // public authoriseAmountLimit(id: any) {
  //   let url =
  //     environment.apiUrl + `/pm/api/amountLimit/authorise-amount-limit/${id}`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.put<any>(url, { headers: h });
  // }

  // public unauthoriseAmountLimit(id: any) {
  //   let url =
  //     environment.apiUrl +
  //     `/pm/api/amountLimit/un-authorise-amount-limit/${id}`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.put<any>(url, { headers: h });
  // }

  // public updateAmountLimit(id: any, body: any) {
  //   let url = environment.apiUrl + `/pm/api/amountLimit/update/${id}`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.put<any>(url, body, { headers: h });
  // }

  // public deleteAmountLimit(id: any) {
  //   let url = environment.apiUrl + `/pm/api/amountLimit/delete/${id}`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.delete<any>(url, { headers: h });
  // }
  // //--------------------------------------Transaction Limit--------------------------//
  // public createTransactionLimit(body: any) {
  //   let url =
  //     environment.apiUrl + "/pm/transactionlimit/create-transaction-limit";
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.post<any>(url, body, { headers: h });
  // }

  // public getAllTransactionLimit() {
  //   let url = environment.apiUrl + `/pm/transactionlimit/get-all?page=2`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.get<any>(url, { headers: h });
  // }

  // public authoriseTransactionLimit(id: any) {
  //   let url =
  //     environment.apiUrl +
  //     `/pm/transactionlimit/authorise-transaction-limit/${id}`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.put<any>(url, { headers: h });
  // }

  // public unAuthoriseTransactionLimit(id: any) {
  //   let url =
  //     environment.apiUrl +
  //     `/pm/transactionlimit/un-authorise-transaction-limit/${id}`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.put<any>(url, { headers: h });
  // }

  // public updateTransactionLimit(id: any, body: any) {
  //   let url = environment.apiUrl + `/pm/transactionlimit/update/${id}`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.put<any>(url, body, { headers: h });
  // }

  // public deleteTransactionLimit(id: any) {
  //   let url = environment.apiUrl + `/pm/transactionlimit/delete/${id}`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.delete<any>(url, { headers: h });
  // }
  //--------------------------------------Service APi--------------------------//
  // public getAllService() {
  //   let url = environment.apiUrl + `/pm/service/get-all?page=1`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.get<any>(url, { headers: h });
  // }

  // public createService(body: any) {
  //   let url = environment.apiUrl + "/pm/service/create-service";
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.post<any>(url, body, { headers: h });
  // }

  // public updateService(id: any, body: any) {
  //   let url = environment.apiUrl + `/pm/service/update/${id}`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.put<any>(url, body, { headers: h });
  // }

  // public authoriseService(id: any) {
  //   let url =
  //     environment.apiUrl + `/pm/service/authorise-service/${id}`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.put<any>(url, { headers: h });
  // }

  // public unAuthoriseService(id: any) {
  //   let url =
  //     environment.apiUrl +
  //     `/pm/service/un-authorise-service/${id}`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.put<any>(url, { headers: h });
  // }

  // public deleteService(id: any) {
  //   let url = environment.apiUrl + `/pm/service/delete/${id}`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.delete<any>(url, { headers: h });
  // }
  //--------------------------------------Fees Or Commission APi--------------------------//
  // public getAllFeesAndCommissionById() {
  //   let url = environment.apiUrl + `/pm/api/fees-commissions/listFeesOrCommission`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.get<any>(url, { headers: h });
  // }

  // public createFeesOrCommission(body: any) {
  //   let url = environment.apiUrl + "/pm/api/fees-commissions/createFeesOrCommission";
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.post<any>(url, body, { headers: h });
  // }

  // public updateFeesAndCommission(id: any, body: any) {
  //   let url = environment.apiUrl + `/pm/api/fees-commissions/update-fees-commission/${id}`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.put<any>(url, body, { headers: h });
  // }

  // public authoriseFeesOrCommission(id: any) {
  //   let url =
  //     environment.apiUrl + `/pm/api/fees-commissions/authorise-fees/${id}`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.put<any>(url, { headers: h });
  // }

  // public unAuthoriseFeesOrCommission(id: any) {
  //   let url =
  //     environment.apiUrl +
  //     `/pm/api/fees-commissions/un-authorise-fees/${id}`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.put<any>(url, { headers: h });
  // }

  //--------------------------------------Tax Or Commission APi--------------------------//
  // public createTaxFeesOrCommission(body: any) {
  //   let url = environment.apiUrl + "/pm/api/fees-commissions/createTaxFeesOrCommission";
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.post<any>(url, body, { headers: h });
  // }

  // public listTaxFeesOrCommission() {
  //   let url = environment.apiUrl + `/pm/api/fees-commissions/listTaxFeesOrCommission`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.get<any>(url, { headers: h });
  // }

  // public authoriseTaxOrCommission(id: any) {
  //   let url =
  //     environment.apiUrl + `/pm/api/fees-commissions/authorise-tax/${id}`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.put<any>(url, { headers: h });
  // }

  // public unAuthoriseTaxOrCommission(id: any) {
  //   let url =
  //     environment.apiUrl +
  //     `/pm/api/fees-commissions/un-authorise-tax/${id}`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.put<any>(url, { headers: h });
  // }
  //--------------------------------------Cashback Or Commission APi--------------------------//
  // public createCashBackFeesOrCommission(body: any) {
  //   let url = environment.apiUrl + "/pm/api/fees-commissions/createCashBackFeesOrCommission";
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.post<any>(url, body, { headers: h });
  // }

  // public listCashBackFeesOrCommission() {
  //   let url = environment.apiUrl + `/pm/api/fees-commissions/listCashBackFeesOrCommission`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.get<any>(url, { headers: h });
  // }

  // public authoriseCashbackOrCommission(id: any) {
  //   let url =
  //     environment.apiUrl + `/pm/api/fees-commissions/authorise-cashback/${id}`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.put<any>(url, { headers: h });
  // }

  // public unAuthoriseCashbackOrCommission(id: any) {
  //   let url =
  //     environment.apiUrl +
  //     `/pm/api/fees-commissions/un-authorise-cashback/${id}`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.put<any>(url, { headers: h });
  // }
  //--------------------------------------Charge Or Commission APi--------------------------//
  // public createChargeFeesOrCommission(body: any) {
  //   let url = environment.apiUrl + "/pm/api/fees-commissions/createChargeFeesOrCommission";
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.post<any>(url, body, { headers: h });
  // }

  // public listChargeFeesOrCommission() {
  //   let url = environment.apiUrl + `/pm/api/fees-commissions/listChargeFeesOrCommission`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.get<any>(url, { headers: h });
  // }

  // public authoriseChargesOrCommission(id: any) {
  //   let url =
  //     environment.apiUrl + `/pm/api/fees-commissions/authorise-charge/${id}`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.put<any>(url, { headers: h });
  // }

  // public unAuthoriseChargesOrCommission(id: any) {
  //   let url =
  //     environment.apiUrl +
  //     `/pm/api/fees-commissions/un-authorise-charge/${id}`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.put<any>(url, { headers: h });
  // }

  public getPtService() {
    let url = `${environment.apiUrl}/pm/subproduct/getByPt?page=1`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public getFwService() {
    let url = `${environment.apiUrl}/pm/subproduct/getByFpw?page=1`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public getSubProductById(id: number) {
    let url = `${environment.apiUrl}/pm/subproduct/get/${id}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }
  public searchUser(mobNO: number) {
    let url = `${environment.apiUrl}/ts/accClosure/findAccount?phone=` + mobNO;

    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }
  public getPendingRequestList(page: any = 0, size: any = 20) {
    let url = `${environment.apiUrl}/ts/accClosure/getAllPending?page=${page}&size=${size}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }
  public getRejectedClosureRequests(page: any = 0, size: any = 20) {
    let url = `${environment.apiUrl}/ts/accClosure/getAllRejected?page=${page}&size=${size}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }
  public getCompletedRequestList() {
    let url = `${environment.apiUrl}/ts/api/transaction-services/getClosedAccountRequest`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public approveClosedAccountRequest(req: any) {
    let url = `${environment.apiUrl}/ts/accClosure/approve`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url, req, { headers: h });
  }
  public rejectClosedAccountRequest(req: any) {
    let url = `${environment.apiUrl}/ts/accClosure/reject`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url, req, { headers: h });
  }
  public requestClosure(req: AccountClosureRequest) {
    let url = `${environment.apiUrl}/ts/accClosure/initiate`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url, req, { headers: h });
  }
  public uploadAccClosureDoc(file: File, reqId: any) {
    let h: HttpHeaders = this.getHeaders();
    const formData = new FormData();
    formData.append("file", file);
    let url = `${environment.apiUrl}/ts/accClosure/uploadDoc?reqId=${reqId}`;
    return this.http.post<any>(url, formData, { headers: h });
  }
  public getClosureDocument(closureDoc: string) {
    const url = `${environment.apiUrl}/ts/static/closure/${closureDoc}`;
    const headers: HttpHeaders = this.getHeaders();
    return this.http.get(url, { headers, responseType: 'blob' });
  }
  // public requestClosure(walletno: any) {
  //   let url = `${environment.apiUrl}/ts/api/transaction-services/initiateForClose?WalletNo=` + walletno;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.get<any>(url, { headers: h });
  // }
  public changePassword(data: any) {
    let url = `${environment.apiUrl}/um/api/bo/changePassword`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url, data, { headers: h });
  }

  public getLeafAccounts() {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getByType?type=INCOME`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public getAllCorporateData() {
    let url = `${environment.apiUrl}/um/api/bo/getAllCorps`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public getAuthorizedCorporate() {
    let url = `${environment.apiUrl}/um/api/bo/getAllAuthorizedCorps`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public getAllUploadData(authorizedBy: any, serviceName: any) {
    let url = `${environment.apiUrl}/ts/api/bulkUpload/getAllUploadData?authorizedBy=${authorizedBy}&serviceName=${serviceName}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public uploadBulkSalaryFile(
    serviceName: any,
    uploadedBy: any,
    walletId: any,
    file1: File
  ) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    let url = `${environment.apiUrl}/ts/api/bulkUpload/upload?serviceName=${serviceName}&uploadedBy=${uploadedBy}&walletId=${walletId}`;
    return this.http.post<any>(url, file, { headers: h });
  }

  public getUploadBulkSalaryViewData(
    authorizedBy: any,
    serviceName: any,
    metaId: any
  ) {
    let url = `${environment.apiUrl}/ts/api/bulkUpload/getAllDetailsForUploadData?authorizedBy=${authorizedBy}&serviceName=${serviceName}&metaId=${metaId}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public authorizeSalaryUpload(
    authorizedBy: any,
    serviceName: any,
    metaId: any,
    value: boolean
  ) {
    let url = `${environment.apiUrl}/ts/api/bulkUpload/cancelForWrongData?authorizedBy=${authorizedBy}&serviceName=${serviceName}&metaId=${metaId}&value=${value}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public generateOtp(body: any) {
    let url = `${environment.apiUrl}/um/api/otp/forgotPassword`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(h);
    return this.http.post<any>(url, body, { headers: h });
  }

  public verifyOtp(body: any) {
    let url = `${environment.apiUrl}/um/api/otp/verify`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(h);

    return this.http.post<any>(url, body, { headers: h });
  }

  public forgotPwd(body: any) {
    let url = `${environment.apiUrl}/um/api/pwd/forgot`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(h);
    return this.http.post<any>(url, body, { headers: h });
  }
  public EmoneyTransReport(fromDate: any, toDate: any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/getDabEmoneyTrxnReport?fromDate=${fromDate}&toDate=${toDate}`;
    // let url = `${environment.apiUrl}/ts/api/transaction-services/getDabEmoneyTrxnReport?fromDate=${fromDate}&toDate=${toDate}&fmt=.pdf`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }
  public transactionReport(reportType: any, data: any) {
    let url = `${environment.apiUrl}/report/api/report?reportType=${reportType}&fmt=.pdf`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post(url, data, {
      headers: h,
    });
  }
  public getprovinces() {
    let url = `${environment.apiUrl}/kyc/locations/provinces`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }
  public aggregateReport(fromDate: any, endDate: any) {
    let url = `${environment.apiUrl}/rmsbo/api/bo/aggregateBalance?startDate=` + fromDate + "&endDate=" + endDate;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }
  public getRemittanceReportByStatus(status: any) {
    let url = `${environment.apiUrl}/tms/moneyTransfer/status/` + status;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }
  public getRemittanceReportByReceiverName(name: any) {
    let url = `${environment.apiUrl}/tms/moneyTransfer/receiver-name?name=` + name;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }
  public getRemittanceReportByMobno(mobNO: any) {
    let url = `${environment.apiUrl}/tms/moneyTransfer/receiver-mobile?mobile=` + mobNO;
    // let url = `${environment.apiUrl}/tms/moneyTransfer/receiver-mobile/` + mobNO;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }
  public getReportData(reportType: any, data: any) {
    let url = `${environment.apiUrl}/report/api/report?reportType=${reportType}&fmt=.pdf`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post(url, data, {
      headers: h,
    });
  }
  public downloadJasperPDF(reportType: any, data: any): Observable<Blob> {
    const url = `${environment.apiUrl}/report/api/reportV2?reportType=${reportType}&fmt=.pdf`;
    const headers: HttpHeaders = this.getHeaders();
    return this.http.post(url, data, {     // BODY = null
      headers: headers,
      responseType: 'blob'
    });
  }
  public downloadJasperEXCEL(reportType: any, data: any): Observable<Blob> {
    const url = `${environment.apiUrl}/report/api/reportV2?reportType=${reportType}&fmt=.xlsx`;
    const headers: HttpHeaders = this.getHeaders();
    return this.http.post(url, data, {
      headers: headers,
      responseType: 'blob'
    });
  }
  public downloadJasperCSV(reportType: any, data: any): Observable<Blob> {
    const url = `${environment.apiUrl}/report/api/reportV2?reportType=${reportType}&fmt=.csv`;
    const headers: HttpHeaders = this.getHeaders();
    return this.http.post(url, data, {
      headers: headers,
      responseType: 'blob'
    });
  }
  public reportV2(reportType: any) {
    let url = `${environment.apiUrl}/report/api/reportV2?reportType=${reportType}&fmt=.pdf`;
    return this.http.post(url, {}, {
      responseType: 'blob'
    });
  }
  public reportV2WithParams(reportType: any, data: any) {
    let url = `${environment.apiUrl}/report/api/reportV2?reportType=${reportType}&fmt=.pdf`;
    return this.http.post(url, data, { responseType: 'blob' });
  }
   public reportV2WithParamsXlxs(reportType: any, data: any) {
    let url = `${environment.apiUrl}/report/api/reportV2?reportType=${reportType}&fmt=.xlsx`;
    return this.http.post(url, data, { responseType: 'blob' });
  }
   public reportV2WithParamsCsv(reportType: any, data: any) {
    let url = `${environment.apiUrl}/report/api/reportV2?reportType=${reportType}&fmt=.csv`;
    return this.http.post(url, data, { responseType: 'blob' });
  }
  public reportAccountHoldersWithHistoryOfFinancialCrime(reportType: any, data: any) {
    let url = `${environment.apiUrl}/report/api/reportV2?reportType=${reportType}&fmt=.pdf`;
    return this.http.post(url, data, { responseType: 'blob' });
  }

  //  public getWalletToWalletReport(reportType: any) {
  //   let url = `${environment.apiUrl}/report/api/report?reportType=${reportType}=&fmt=.pdf`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.http.post(url, {
  //     headers: h,
  //   });
  // }
  public getLowBalDataReport() {
    let url = `${environment.apiUrl}/ts/api/transaction-services/all-low-balance-data`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }
  public getLctrView(fromDate: any, toDate: any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/getLctrView?fromDate=${fromDate}&toDate=${toDate}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }
  public getLctrReloaded(fromDate: any, toDate: any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/getLctrReloaded?fromDate=${fromDate}&toDate=${toDate}`;
    let headers: HttpHeaders = this.getHeaders();
    return this.http.get(url, { headers: headers, responseType: 'blob' });
  }
  public getIncomeAcc(data: any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/${data}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public getServicesBasedData(reportType: any,) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/${reportType}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public getCumulativeLctrReportByDate(from: any, to: any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/getCumulativeLctrReportByDate/${from}/${to}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public getAccStatement(wallet: any, fromDate: any, toDate: any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/accStmt?wallet=${wallet}&fromDate=${fromDate}&toDate=${toDate}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public getReversalStatement(wallet: any, fromDate: any, toDate: any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/accStmtWithReversal?wallet=${wallet}&fromDate=${fromDate}&toDate=${toDate}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public getProfitAndLossStatement(type: any, value: any, year: any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/profitAndLoss?type=${type}&value=${value}&year=${year}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public getBalanceSheetStatement(year: any, month: any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/balanceSheet?year=${year}&month=${month}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public getKYCReport(data: any) {
    let url = `${environment.apiUrl}/kyc/compliance/filterApprovedKyc`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post(url, data, {
      headers: h,
    });
  }

  public getService() {
    let url = `${environment.apiUrl}/pm/service/get-all?page=100`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public kycProofUpload(file1: FormData, corpId: any) {
    let h: HttpHeaders = this.getHeaders();
    let url = `${environment.apiUrl}/salary/api/upload?corpId=${corpId}`;
    return this.http.post<any>(url, file1, { headers: h });
  }

  public reUploadFile(file1: FormData, corpId: any) {
    let h: HttpHeaders = this.getHeaders();
    let url = `${environment.apiUrl}/salary/api/files/${corpId}/reupload`;
    return this.http.put<any>(url, file1, { headers: h });
  }

  public getAllUploadedFiles() {
    let url = `${environment.apiUrl}/salary/api/files`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public scheduleUploadedFiles(id: any, date: any) {
    let url = `${environment.apiUrl}/salary/api/files/${id}/processSchedule?scheduleDate=${date}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public rejectUploadedFiles(id: any, reason: any) {
    let url = `${environment.apiUrl}/salary/api/files/reject?id=${id}&reason=${reason}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public approveUploadedFiles(id: any) {
    let url = `${environment.apiUrl}/salary/api/files/approve?id=${id}&value=true`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public registerCorporateUser(data: any, corpId: any) {
    let url = `${environment.apiUrl}/um/api/corps/registerUserForCorps?corpId=${corpId}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post(url, data, {
      headers: h,
    });
  }

  public selectiveReversal(data: any,) {
    let url = `${environment.apiUrl}/salary/api/create/selectiveReversal`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post(url, data, {
      headers: h,
    });
  }
  public searchSalaryData(data: any,) {
    let url = `${environment.apiUrl}/salary/api/search`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post(url, data, {
      headers: h,
    });
  }
  public pendingSelectiveReversal(page: any) {
    let url = `${environment.apiUrl}/salary/api/selectiveReversals?page=${page}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public approveSelectiveReversal(id: any) {
    let url = `${environment.apiUrl}/salary/api/authorize/selectiveReversal?batchId=${id}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post(url, {
      headers: h,
    });
  }

  public rejectSelectiveReversal(body: any) {
    let url = `${environment.apiUrl}/salary/api/reject/selectiveReversal`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post(url, body, {
      headers: h,
    });
  }

  public getCorpUsers(corpId: any) {
    let url = environment.apiUrl + `/um/api/bo/getCorpUsers?corpId=${corpId}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }
  public getprovinceList() {
    let url = environment.apiUrl + `/kyc/locations/provinces`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public uploadedFileReport(id: any, fileType: any) {
    let url = `${environment.apiUrl}/salary/api/files/report?id=${id}&fileType=${fileType}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public completedSalaryTransactionReport(id: any) {
    let url = `${environment.apiUrl}/salary/api/getFinalStatus/v2?id=${id}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  // Bulk Topup
  public bulkTopupFileUpload(file1: any, serviceName: any, uploadedBy: any, walletId: any) {
    let h: HttpHeaders = this.getHeaders();
    let url = `${environment.apiUrl}/ts/api/bulkUpload/upload?serviceName=${serviceName}&uploadedBy=${uploadedBy}&walletId=${walletId}`;
    return this.http.post<any>(url, file1, { headers: h });
  }

  public getAllTopupUploadedData(authorizedBy: any, serviceName: any) {
    let url = `${environment.apiUrl}/ts/api/bulkUpload/getAllUploadData?authorizedBy=${authorizedBy}&serviceName=${serviceName}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public getAllDetailsForUploadData(authorizedBy: any, serviceName: any, metaId: any) {
    let url = `${environment.apiUrl}/ts/api/bulkUpload/getAllDetailsForUploadData?authorizedBy=${authorizedBy}&serviceName=${serviceName}&metaId=${metaId}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public authorizeForBulkTopUp(authorizedBy: any, serviceName: any, metaId: any, value: any, corpId: any, pin: any) {
    let url = `${environment.apiUrl}/ts/api/bulkUpload/authorizeForBulkTopUp?authorizedBy=${authorizedBy}&serviceName=${serviceName}&metaId=${metaId}&value=${value}&walletId=${corpId}&pin=${pin}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public cancelForWrongData(authorizedBy: any, serviceName: any, metaId: any, value: any, reason: any) {
    let url = `${environment.apiUrl}/ts/api/bulkUpload/cancelForWrongData?authorizedBy=${authorizedBy}&serviceName=${serviceName}&metaId=${metaId}&value=${value}&reason=${reason}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public getAllMasterProduct(page: any) {
    let url = `${environment.apiUrl}/pm/masterproduct/get-all?page=${page}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public getAllAmountLimit(page: any) {
    let url = `${environment.apiUrl}/pm/api/amountLimit/get-all?page=${page}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public getAllSubProduct(page: any) {
    let url = `${environment.apiUrl}/pm/subproduct/get-all?page=${page}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public getAllService(page: any) {
    let url = `${environment.apiUrl}/pm/service/get-all?page=${page}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }
  public fileApprove(id: number, value: boolean, otp: string) {
    let url = `${environment.apiUrl}/salary/api/files/finalApprove?id=${id}&value=${value}&otp=${otp}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public listLoyalty() {
    let url = `${environment.apiUrl}/lms/config`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public createLoyalty(body: any) {
    let url = environment.apiUrl + "/lms/config";
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url, body, { headers: h });
  }

  public updateLoyalty(body: any, id: any) {
    let url = environment.apiUrl + `/lms/config/${id}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.put<any>(url, body, { headers: h });
  }

  public getLoyalty(subProdType: any) {
    let url = environment.apiUrl + `/lms/config/${subProdType}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public getTransactionLimit(page: any) {
    let url = `${environment.apiUrl}/pm/transactionlimit/get-all?page=${page}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public listFeesOrCommission() {
    let url = `${environment.apiUrl}/pm/api/fees-commissions/listFeesOrCommission`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public listCashBackFeesOrCommission() {
    let url = `${environment.apiUrl}/pm/api/fees-commissions/listCashBackFeesOrCommission`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public listTaxFeesOrCommission() {
    let url = `${environment.apiUrl}/pm/api/fees-commissions/listTaxFeesOrCommission`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public listChargeFeesOrCommission() {
    let url = `${environment.apiUrl}/pm/api/fees-commissions/listChargeFeesOrCommission`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public editSubproduct(id: any, data: any) {
    let url = `${environment.apiUrl}/pm/subproduct/update/${id}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.put(url, data, {
      headers: h,
    });
  }

  public loyatyConfig(data: any) {
    let h: HttpHeaders = this.getHeaders();
    let url = `${environment.apiUrl}/lms/api/config`;
    return this.http.post<any>(url, data, { headers: h });
  }

  public getLoyatyConfig() {
    let url = `${environment.apiUrl}/pm/api/fees-commissions/listLoyalty`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public approveLoyatyConfig(data: any) {
    let h: HttpHeaders = this.getHeaders();
    let url = `${environment.apiUrl}/lms/api/config/approve`;
    return this.http.post<any>(url, data, { headers: h });
  }

  public getCommissionStructure(page: number) {
    let url = `${environment.apiUrl}/pm/api/fees-commissions/get-all?page=${page}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public getCurrentBalance(accNo: any) {
    let url = environment.apiUrl + `/crm/api/wallet/balance?accNo=${accNo}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public getJournalEntriesData(page: number, size: number) {
    let url = `${environment.apiUrl}/ts/journalVoucher/fetchAll?page=${page}&size=${size}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public getSystemAccounts() {
    let url = `${environment.apiUrl}/ts/journalVoucher/systemAccounts`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public createJournalEntry(body: any) {
    let url = environment.apiUrl + "/ts/journalVoucher/create";
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url, body, { headers: h });
  }

  public JEDecisionMaking(body: any, event: string) {
    let url = environment.apiUrl + `/ts/journalVoucher/${event}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url, body, { headers: h });
  }

  public getOperationalAccounts() {
    let url = `${environment.apiUrl}/ts/paymentJournalVoucher/operationalAccounts`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }
  public getPaymentJournalEntriesData(page: number, size: number) {
    let url = `${environment.apiUrl}/ts/paymentJournalVoucher/fetchAll?page=${page}&size=${size}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

  public createPaymentJournalEntry(body: any) {
    let url = environment.apiUrl + "/ts/paymentJournalVoucher/create";
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url, body, { headers: h });
  }

  public JEPaymentDecisionMaking(body: any, event: string) {
    let url = environment.apiUrl + `/ts/paymentJournalVoucher/${event}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url, body, { headers: h });
  }

  public searchUserToPay(meta: any, phoneOrWalletNo: any) {
    let url = environment.apiUrl + `/ts/api/transaction-services/findUser?phoneOrWalletNo=${phoneOrWalletNo}&meta=${meta}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }
  public searchSourceAccounts(type: any, nameOrNumber: any) {
    let url = environment.apiUrl + `/ts/journalVoucher/sourceAccounts?type=${type}&search=${nameOrNumber}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public searchDestinationAccounts(type: any, nameOrNumber: any) {
    let url = environment.apiUrl + `/ts/journalVoucher/destinationAccounts?type=${type}&search=${nameOrNumber}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public getClosedAccounts(page: any, size: any) {
    let url = environment.apiUrl + `/kyc/abandoned/users?page=${page}&limit=${size}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public searchClosedAccounts(body: any) {
    let url = environment.apiUrl + `/kyc/abandoned/search`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url, body, { headers: h });
  }

  public getPointConversionConfig() {
    let url = environment.apiUrl + `/lms/getPointConversionConfig`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public pointConversionConfig(body: any) {
    let url = environment.apiUrl + "/lms/pointConversionConfig";
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url, body, { headers: h });
  }

  public bulkLockUsers(file: File) {
    let h: HttpHeaders = this.getHeaders();
    const formData = new FormData();
    formData.append("file", file);
    let url = `${environment.apiUrl}/um/api/bo/bulkLock`;
    return this.http.post<any>(url, formData, { headers: h });
  }

  public bulkRegisterCustomers(file: File) {
    let h: HttpHeaders = this.getHeaders();
    const formData = new FormData();
    formData.append("file", file);
    let url = `${environment.apiUrl}/um/bulkReg/customers/upload`;
    return this.http.post<any>(url, formData, { headers: h });
  }

  public getBulkRegPendingBatches(page: number, size: number) {
    let url = `${environment.apiUrl}/um/bulkReg/getAllPending?page=${page}&size=${size}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public getBulkRegApprovedBatches(page: number, size: number) {
    let url = `${environment.apiUrl}/um/bulkReg/getAllApproved?page=${page}&size=${size}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public getBulkRegRejectedBatches(page: number, size: number) {
    let url = `${environment.apiUrl}/um/bulkReg/getAllRejected?page=${page}&size=${size}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public getBulkRegBatchDetails(batchId: number) {
    let url = `${environment.apiUrl}/um/bulkReg/batchDetails?batchId=${batchId}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public approveBulkRegBatch(body: { id: number, remarks: string }) {
    let url = `${environment.apiUrl}/um/bulkReg/approve`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url, body, { headers: h });
  }

  public rejectBulkRegBatch(body: { id: number, remarks: string }) {
    let url = `${environment.apiUrl}/um/bulkReg/reject`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url, body, { headers: h });
  }

  public viewClosedAccountKyc(userId: number) {
    let url = `${environment.apiUrl}/kyc/abandoned/fetchKyc?userId=${userId}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get(url, {
      headers: h,
    });
  }

     public getReferralConfig() {
    let url = environment.apiUrl + `/lms/referral/config`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

     public referralConfig(body: any) {
    let url = environment.apiUrl + "/lms/referral/config";
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url, body, { headers: h });
  }

    public updateReferralConfig(body: any, id: any) {
    let url = environment.apiUrl + `/lms/referral/config/${id}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.put<any>(url, body, { headers: h });
  }

   public getReferralBonusConfig() {
    let url = environment.apiUrl + `/lms/welcome-bonus/config`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

     public referralBonusPost(body: any) {
    let url = environment.apiUrl + "/lms/welcome-bonus/config";
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url, body, { headers: h });
  }

    public updateReferralBonusConfig(body: any, id: any) {
    let url = environment.apiUrl + `/lms/welcome-bonus/config/${id}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.put<any>(url, body, { headers: h });
  }
}
