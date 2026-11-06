import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { SessionService } from "../../session.service";

@Injectable({
  providedIn: "root",
})
export class KycModuleService {
  private getHeaders(): HttpHeaders {
    let token = sessionStorage.getItem("token");
    if (token == null || token == undefined) {
      token = "Dummy Value";
    }
    return new HttpHeaders().set("Authorization", "Bearer " + token);
  }
  constructor(private httpClient: HttpClient, private sessionService: SessionService) { }
  private agentIdSubject = new BehaviorSubject<string | null>(null);
  private shareHolderArray: any[] = [];
  private authorizedSignArray: any[] = [];

  agentId$ = this.agentIdSubject.asObservable();
  private selectedItem: any;

  setAgentId(id: string) {
    this.agentIdSubject.next(id);
  }

  getAgentId() {
    return this.agentIdSubject.value;
  }

  setItem(item: any): void {
    this.selectedItem = item;
    console.log("Item Selected", this.selectedItem)
  }
  getItem(): any {
    console.log("Item Selected Get", this.selectedItem)
    return this.selectedItem;
  }
  setIncompleteItem(item: any): void {
    this.selectedItem = item;
  }
  getIncompleteItem(): any {
    return this.selectedItem;
  }

  setShareHolderArray(data: any[]) {
    this.shareHolderArray = data;
  }

  getShareHolderArray(): any[] {
    return this.shareHolderArray;
  }
  setAuthorizedSignArray(data: any[]) {
    this.authorizedSignArray = data;
  }

  getAuthorizedSignArray(): any[] {
    return this.authorizedSignArray;
  }
  // public getCustomerProducts() {
  //   let url = environment.apiUrl+"pm/masterproduct/get-all-by-customer?page=0";
  //   let h: HttpHeaders =
  //     this.getHeaders().set("Content-Type", "application/json");
  //   return this.httpClient.get<any>(url, { headers: h })
  // }
  public getCustomerProducts() {
    let url = `${environment.apiUrl}/pm/masterproduct/get-all-by-customer?page=0`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.get<any>(url, { headers: h });
  }
  public customerSearchBy(req: any) {
    let url = `${environment.apiUrl}/um/api/bo/searchUsers`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public checkIDexists(req: any) {
    let url = `${environment.apiUrl}/um/api/app/idProofCheck`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public deleteAgentMultipleDoc(req: any, id: any) {
    let h: HttpHeaders = this.getHeaders();
    // let url = `${environment.apiUrl}/kyc/corporate/deleteOtherDocs?deletedFor=${id}`;
    let url = `${environment.apiUrl}/kyc/agent/deleteOtherDocs?deletedFor=` + id;
    return this.httpClient.delete<any>(url, {
      headers: h,
      body: req // Pass the request body here
    });
  }
  public deleteAgentMultipleDocByMaker(req: any, id: any) {
    let h: HttpHeaders = this.getHeaders();
    let url = `${environment.apiUrl}/kyc/agent/editProcess/deleteOtherDocs?deletedFor=` + id;
    return this.httpClient.delete<any>(url, {
      headers: h,
      body: req // Pass the request body here
    });
  }
  public customerKYCSubmit(req: any) {
    let url = `${environment.apiUrl}/kyc/customer/basic`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );

    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public customerKYCRegister(req: any) {
    let url = `${environment.apiUrl}/um/api/bo/registerCustomer`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );

    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public customerKYCUpdate(req: any) {
    let url = `${environment.apiUrl}/kyc/customer/update`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );

    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public customerKYCUpdateByAgent(req: any) {
    let url = `${environment.apiUrl}/kyc/customer/updateByAgent`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );

    return this.httpClient.post<any>(url, req, { headers: h });
  }

  public agentComplete(id: any) {
    let url = `${environment.apiUrl}/kyc/agent/complete?agentId=` + id;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );

    return this.httpClient.post<any>(url, { headers: h });
  }

  public addCustomerProfilePhoto(file1: File) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/um/api/customer/profilePic`;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addCustomerProof(file1: File, type: any, customerId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/kyc/customer/uploadImage?mapping=` + type + `&submittedFor=` + customerId;;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addCustomerProofByAgent(file1: File, type: any, customerId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/kyc/customer/uploadImageByAgent?mapping=` + type + `&submittedFor=` + customerId + `&otp=` + this.sessionService.getOTP();
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  
  public generateOTPCustomerReg(req: any) {
    let url = `${environment.apiUrl}/um/api/otp/generate`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.post<any>(url,req,{ headers: h });
  }
  public verifyOTPCustomerReg(req: any) {
    let url = `${environment.apiUrl}/um/api/otp/verify`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.post<any>(url,req, { headers: h });
  }
  public completeCustomerKyc(id: any,) {
    let url = `${environment.apiUrl}/kyc/customer/complete?customerId=` + id;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, { headers: h });
  }
  public completeCustomerKycByAgent(id: any,) {
    let url = `${environment.apiUrl}/kyc/customer/completeByAgent?customerId=` + id + `&otp=` + this.sessionService.getOTP();
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.get<any>(url, { headers: h });
  }
  public deleteCustomerMultipleDoc(req: any, id: any) {
    let h: HttpHeaders = this.getHeaders();
    // let url = `${environment.apiUrl}/kyc/corporate/deleteOtherDocs?deletedFor=${id}`;
    let url = `${environment.apiUrl}/kyc/customer/deleteOtherDocs?deletedFor=` + id;
    return this.httpClient.delete<any>(url, {
      headers: h,
      body: req // Pass the request body here
    });
  }
  public deleteCustomerMultipleDocByMaker(req: any, id: any) {
    let h: HttpHeaders = this.getHeaders();
    let url = `${environment.apiUrl}/kyc/customer/editProcess/deleteOtherDocs?deletedFor=` + id;
    return this.httpClient.delete<any>(url, {
      headers: h,
      body: req
    });
  }
  public deleteCustomerMultipleDocByAgent(req: any, id: any) {
    let h: HttpHeaders = this.getHeaders();
    // let url = `${environment.apiUrl}/kyc/corporate/deleteOtherDocs?deletedFor=${id}`;
    let url = `${environment.apiUrl}/kyc/customer/deleteOtherDocsByAgent`;
    return this.httpClient.delete<any>(url, {
      headers: h,
      body: req // Pass the request body here
    });
  }
  public oTPforIncompleteCustomerKYC(customerId: string) {
    let url = `${environment.apiUrl}/kyc/customer/otpForUpdate?customerId=${customerId}`;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url)
  }
  public checkEmailExist(email: string) {
    let url = `${environment.apiUrl}/um/api/app/emailCheck?email=` + email;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.get<any>(url, { headers: h });
  }
  public checkPhoneExist(phone: string) {
    let url = `${environment.apiUrl}/um/api/app/phoneCheck?phone=` + phone;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getCountries() {
    let url = `${environment.apiUrl}/kyc/locations/countries`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getprovinces() {
    let url = `${environment.apiUrl}/kyc/locations/provinces`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );

    return this.httpClient.get<any>(url, { headers: h });
  }
  public getdistricts(provinceId: any) {
    let url = `${environment.apiUrl}/kyc/locations/provinces/` + provinceId + `/districts`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );

    return this.httpClient.get<any>(url, { headers: h })
  }
  public getAccPurpose() {
    let url = `${environment.apiUrl}/kyc/common/purposeOfAcc`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getIncomeSource() {
    let url = `${environment.apiUrl}/kyc/common/sourceOfIncome`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllFirmType() {
    let url = `${environment.apiUrl}/kyc/common/getAllFirmType`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.get<any>(url, { headers: h });
  }
  public deleteCorpMultipleDoc(req: any, id: any) {
    let h: HttpHeaders = this.getHeaders();
    let url = `${environment.apiUrl}/kyc/corporate/deleteOtherDocs?deletedFor=${id}`;
    return this.httpClient.delete<any>(url, {
      headers: h,
      body: req // Pass the request body here
    });
  }
  public deleteMasterAgentMultipleDoc(req: any, id: any) {
    let h: HttpHeaders = this.getHeaders();
    // let url = `${environment.apiUrl}/kyc/corporate/deleteOtherDocs?deletedFor=${id}`;
    let url = `${environment.apiUrl}/kyc/masterAgent/deleteOtherDocs?deletedFor=` + id;
    return this.httpClient.delete<any>(url, {
      headers: h,
      body: req // Pass the request body here
    });
  }
  public deleteMasterAgentMultipleDocByMaker(req: any, id: any) {
    let h: HttpHeaders = this.getHeaders();
    let url = `${environment.apiUrl}/kyc/masterAgent/editProcess/deleteOtherDocs?deletedFor=` + id;
    return this.httpClient.delete<any>(url, {
      headers: h,
      body: req
    });
  }
  public deleteMerchantMultipleDoc(req: any, id: any) {
    let h: HttpHeaders = this.getHeaders();
    // let url = `${environment.apiUrl}/kyc/corporaate/deleteOtherDocs?deletedFor=${id}`;
    let url = `${environment.apiUrl}/kyc/merchant/deleteOtherDocs?deletedFor=` + id;
    return this.httpClient.delete<any>(url, {
      headers: h,
      body: req // Pass the request body here
    });
  }

  public getProfileDetails() {
    let url = `${environment.apiUrl}/um/api/bo/profile`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.get<any>(url, { headers: h });
  }
  public getResultByFilter(req: any) {
    let url = `${environment.apiUrl}/kyc/admin/getAllKYC`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public getNoKycResults(req: any) {
    let url = `${environment.apiUrl}/kyc/admin/getNoKYCs`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public getResultByFilterIncompleteKYC(req: any) {
    let url = `${environment.apiUrl}/kyc/admin/getIncompleteKYC`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.post<any>(url, req, { headers: h });
  }
  // public getAgentProducts() {
  //   let url = environment.apiUrl + "pm/masterproduct/get-all-by-agent?page=0";
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.httpClient.get<any>(url, { headers: h });
  // }
  public getAgentProducts() {
    // let url = environment.apiUrl+"kyc/compliance/getAllPendingKyc?page=0";
    let url = `${environment.apiUrl}/pm/masterproduct/get-all-by-agent?page=0`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.get<any>(url, { headers: h });
  }
  // public downloadPDF(id: any) {
  //   let url = `${environment.apiUrl}/kyc/compliance/downloadPDF?id=`+id;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.httpClient.get<any>(url, { headers: h });
  // }
  public downloadPDF(id: any): Observable<Blob> {
    let url = `${environment.apiUrl}/kyc/compliance/downloadPDF/` + id;
    let headers: HttpHeaders = this.getHeaders();
    return this.httpClient.get(url, { headers: headers, responseType: 'blob' });
  }
    public downloadPDFForClosedAccounts(id: any): Observable<Blob> {
    let url = `${environment.apiUrl}/kyc/abandoned/downloadPDF/` + id;
    let headers: HttpHeaders = this.getHeaders();
    return this.httpClient.get(url, { headers: headers, responseType: 'blob' });
  }
  public downloadRiskPDF(id: any): Observable<Blob> {
    let url = `${environment.apiUrl}/kyc/compliance/downloadRiskReport/` + id;
    let headers: HttpHeaders = this.getHeaders();
    return this.httpClient.get(url, { headers: headers, responseType: 'blob' });
  }
  public downloadSdnPDF(id: any): Observable<Blob> {
    // let url = `${environment.apiUrl}/kyc/compliance/downloadSdnReport/` + id;
    let url = `${environment.apiUrl}/kyc/compliance/downloadSdnReportByUser/` + id;
    let headers: HttpHeaders = this.getHeaders();
    return this.httpClient.get(url, { headers: headers, responseType: 'blob' });
  }
  // public getAllKyc() {
  //   let url = environment.apiUrl+"kyc/compliance/getAllPendingKyc?page=0";
  //   // let url = `${environment.apiUrl}/kyc/compliance/getAllPendingKyc?page=` + page;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.httpClient.get<any>(url, { headers: h });
  // }
  public getAllKyc() {
    let url = `${environment.apiUrl}/kyc/compliance/getAllPendingKyc?page=0`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );

    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllIncompleteKyc(req: any) {
    let url = `${environment.apiUrl}/kyc/admin/getIncompleteKYC`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public getAllPendingKyc(page: any) {
    let url = `${environment.apiUrl}/kyc/compliance/getAllPendingKyc?page=` + page;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllEditKycRequests(page: any) {
    let url = `${environment.apiUrl}/kyc/compliance/editProcesses?page=` + page;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.get<any>(url, { headers: h });
  }
  public filterEditKycRequests(req: any) {
    let url = `${environment.apiUrl}/kyc/compliance/filter/editProcess`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public authorizeEditByChecker(id: any) {
    let url = `${environment.apiUrl}/kyc/compliance/editProcess/authorize?id=` + id;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getIncompleteCorporateKyc(page: any) {
    let url = `${environment.apiUrl}/kyc/admin/getIncompleteKYC?page=` + page;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );

    return this.httpClient.get<any>(url, { headers: h });
  }
  public addCustomerPhoto(file1: File, fieldname: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    // file.append('customerKycId', photoId)
    // file.append('type', customerData)
    let url = `${environment.apiUrl}/kyc/customer/uploadImage?mapping=` + fieldname;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addCustomerSign(file1: File, type: any, customerId: any) {
    console.log('Inside Service - Type:', type)
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/kyc/customer/uploadImage?mapping=` + type + `&submittedFor=` + customerId;;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public updateCustomerSignByMaker(file1: File, type: any, customerId: any) {
    console.log('Inside Service - Type:', type)
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/kyc/customer/editProcess/uploadImage?mapping=` + type + `&submittedFor=` + customerId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addCustomerKycSign(file1: File, type: any, customerId: any) {
    console.log('Inside Service - Type:', type)
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    // file.append('customerKycId', photoId)
    // file.append('type', customerData)
    let url = `${environment.apiUrl}/kyc/customer/uploadImage?mapping=` + "agentSign_img_0" + `&submittedFor=` + customerId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addCustomerCompHeadSign(file1: File, type: any, customerId: any) {
    console.log('Inside Service - Type:', type)
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    // file.append('customerKycId', photoId)
    // file.append('type', customerData)
    let url = `${environment.apiUrl}/kyc/customer/uploadImage?mapping=` + "complianceHeadSignaturePhoto" + `&submittedFor=` + customerId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addCustomerAgentSign(file1: File, typeOp: any, customerId: any) {
    console.log('Inside Service - Type:', typeOp)
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    // file.append('customerKycId', photoId)
    // file.append('type', customerData)
    let url = `${environment.apiUrl}/kyc/customer/uploadImage?mapping=` + "superAgentSign_img_0" + `&submittedFor=` + customerId;;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addCustomerCEOSign(file1: File, typeOp: any, customerId: any) {
    console.log('Inside Service - Type:', typeOp)
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    // file.append('customerKycId', photoId)
    // file.append('type', customerData)
    let url = `${environment.apiUrl}/kyc/customer/uploadImage?mapping=` + "ceoSignaturePhoto" + `&submittedFor=` + customerId;;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addCustomerOpSign(file1: File, fieldname: any, customerId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/kyc/customer/uploadImage?mapping=` + "opsSign_img_0" + `&submittedFor=` + customerId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addCustomerCompSign(file1: File, fieldname: any, customerId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/kyc/customer/uploadImage?mapping=` + "complianceSignaturePhoto" + `&submittedFor=` + customerId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  // public addCustomerAttachment(file: File, customerId: any): Observable<any> {
  //   let h: HttpHeaders = this.getHeaders(); 
  //   const formData = new FormData(); 
  //   formData.append('file', file); 
  //   const url = `${environment.apiUrl}/kyc/customer/uploadAttachment?customerId=${customerId}`;
  //   return this.httpClient.post<any>(url, formData, { headers: h });
  // }
  public addCustomerAttachment(formData: FormData, customerId: any): Observable<any> {
    let h: HttpHeaders = this.getHeaders(); // Set any required headers
    // Use the formData object directly in the POST request
    const url = `${environment.apiUrl}/kyc/customer/uploadAttachment?submittedFor=${customerId}`;
    return this.httpClient.post<any>(url, formData, { headers: h });
  }
  public addAgentAttachment(formData: FormData, submittedForId: any): Observable<any> {
    let h: HttpHeaders = this.getHeaders(); // Set any required headers
    // Use the formData object directly in the POST request
    const url = `${environment.apiUrl}/kyc/agent/uploadOtherDocs?agentId=${submittedForId}`;
    return this.httpClient.post<any>(url, formData, { headers: h });
  }
  public addSuperAgentAttachment(formData: FormData, superId: any): Observable<any> {
    let h: HttpHeaders = this.getHeaders(); // Set any required headers
    // Use the formData object directly in the POST request
    const url = `${environment.apiUrl}/kyc/super/uploadOtherDocs?agentId=${superId}`;
    return this.httpClient.post<any>(url, formData, { headers: h });
  }
  public agentUpdateImageByMaker(file1: File, fieldname: any, agentId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/kyc/agent/editProcess/uploadImage?mapping=` + fieldname + `&submittedFor=` + agentId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public masterAgentUpdateImageByMaker(file1: File, fieldname: any, id: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/kyc/masterAgent/editProcess/uploadImage?mapping=` + fieldname + `&submittedFor=` + id;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public masterAgentShareUpdateImageByMaker(file1: File, fieldname: any, id: any, extraId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/kyc/masterAgent/editProcess/uploadImage?mapping=` + fieldname + `&submittedFor=` + id + `&shareholderId=` + extraId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public masterAgentSignatoryUpdateImageByMaker(file1: File, fieldname: any, id: any, extraId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/kyc/masterAgent/editProcess/uploadImage?mapping=` + fieldname + `&submittedFor=` + id + `&signatoryId=` + extraId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public customerUpdateImageByMaker(file1: File, fieldname: any, id: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/kyc/customer/editProcess/uploadImage?mapping=` + fieldname + `&submittedFor=` + id;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addAgentphoto(file1: File, fieldname: any, agentId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    // file.append('customerKycId', photoId)
    // file.append('type', customerData)
    let url = `${environment.apiUrl}/kyc/agent/uploadImage?mapping=` + fieldname + `&submittedFor=` + agentId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addAgentSign(file1: File, fieldname: any, agentId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    // file.append('customerKycId', photoId)
    // file.append('type', customerData)
    let url = `${environment.apiUrl}/kyc/agent/uploadImage?mapping=` + fieldname + `&submittedFor=` + agentId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public allCustomerKyc() {
    let url = environment.apiUrl + "";
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.get<any>(url, { headers: h });
  }
  public allAgentKyc() {
    let url = environment.apiUrl + "";
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.get<any>(url, { headers: h });
  }
  // public getDataFilter(req: any) {
  //   let url = environment.apiUrl+"kyc/admin/getAllKYC";
  //   let h: HttpHeaders
  //     =
  //     this.getHeaders().set("Content-Type", "application/json");
  //   return this.httpClient.post<any>(url, req, { headers: h })
  // }
  public getDataFilter(req: any) {
    let url = `${environment.apiUrl}/kyc/admin/getAllKYC`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.post<any>(url, req, { headers: h });
  }
  // public getallUsers() {
  //   let url = environment.apiUrl+"kyc/admin/getAgentsFilterList";
  //   let h: HttpHeaders
  //     =
  //     this.getHeaders().set("Content-Type", "application/json");
  //   return this.httpClient.get<any>(url, { headers: h })
  // }
  public getallUsers() {
    let url = `${environment.apiUrl}/kyc/admin/getAgentsFilterList`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.get<any>(url, { headers: h });
  }
  // public getallBranch() {
  //   let url = environment.apiUrl + "kyc/admin/getBranchesFilterList";
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   return this.httpClient.get<any>(url, { headers: h });
  // }
  public getallBranch() {
    let url = `${environment.apiUrl}/kyc/admin/getBranchesFilterList`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.get<any>(url, { headers: h });
  }
  public downloadKycReport(req: any) {
    const url = `${environment.apiUrl}/kyc/admin/downloadExcelReport`;
    const headers = this.getHeaders().set("Content-Type", "application/json");
    console.log(url);

    return this.httpClient.post(url, req, {
      headers: headers,
      responseType: "blob",
    });
  }

  // public downloadKycReport(req: any) : Observable<Blob>{
  //   let url = environment.apiUrl+"kyc/admin/downloadExcelReport"

  //   let h: HttpHeaders =
  //     this.getHeaders().set('Content-Type','application/json')
  //       .set('Accept','application/octet-stream');
  //     ;
  //   return this.httpClient.post(url, req, {responseType:'blob', headers: h })
  // }
  public changeProduct(req: any, reason: any) {
    let url = `${environment.apiUrl}/um/api/bo/changeProductReq?reason=${reason}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public searchSdn(req: any) {
    let url = `${environment.apiUrl}/sdn/search`;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public checkRisk(kycId: any) {
    let url = `${environment.apiUrl}/risk/profile/score?kycId=` + kycId;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public viewRiskAndSdn(kycId: any) {
    // let url = `${environment.apiUrl}/sdn/search/history?kycId=` + kycId;
    let url = `${environment.apiUrl}/sdn/search/historyByUser?userId=` + kycId;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }

  public AuthorizeEditedForm(req: any) {
    let url = `${environment.apiUrl}/kyc/compliance/editProcess/v2/authorize`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public RejectEditedForm(req: any) {
    let url = `${environment.apiUrl}/kyc/compliance/editProcess/v2/reject`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.post<any>(url, req, { headers: h });
  }
  // public changeProduct(req: any) {
  //   let url = environment.apiUrl+"um/api/bo/changeProduct";
  //   let h: HttpHeaders =
  //     this.getHeaders().set("Content-Type", "application/json");
  //   return this.httpClient.post<any>(url, req, { headers: h })
  // }
  public CustomerFinalUpdate(req: any) {
    let url = `${environment.apiUrl}/kyc/customer/update`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.post<any>(url, req, { headers: h });
  }

  public getSuperProducts() {
    // let url = environment.apiUrl+"kyc/compliance/getAllPendingKyc?page=0";
    let url = `${environment.apiUrl}/pm/masterproduct/get-all-by-corporate?page=0`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.get<any>(url, { headers: h });
  }
  public addSuperPresSign(file1: File, fieldname: any, superId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    // file.append('customerKycId', photoId)
    // file.append('type', customerData)
    let url = `${environment.apiUrl}/kyc/corporate/uploadImage?mapping=` + fieldname + `&submittedFor=` + superId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addMasterPresSign(file1: File, fieldname: any, superId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    // file.append('customerKycId', photoId)
    // file.append('type', customerData)
    let url = `${environment.apiUrl}/kyc/masterAgent/uploadImage?mapping=` + fieldname + `&submittedFor=` + superId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public masterAgentFinalUpdate(req: any) {
    let url = `${environment.apiUrl}/kyc/masterAgent/update`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public masterAgentFinalUpdateBymaker(req: any) {
    let url = `${environment.apiUrl}/kyc/masterAgent/editProcess/update`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public superFinalUpdate(req: any) {
    let url = `${environment.apiUrl}/kyc/super/update`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.put<any>(url, req, { headers: h });
  }
  public agentFinalUpdate(req: any) {
    let url = `${environment.apiUrl}/kyc/agent/update`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public agentFinalUpdateByMaker(req: any) {
    let url = `${environment.apiUrl}/kyc/agent/editProcess/update`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public approveCustomerKyc1(req: any) {
    let url = `${environment.apiUrl}/kyc/verify/level1`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public approveCustomerKyc2(req: any) {
    let url = `${environment.apiUrl}/kyc/verify/level2`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public approveCustomerKyc(req: any) {
    let url = `${environment.apiUrl}/kyc/verify/approve`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.post<any>(url, req, { headers: h });
  }
  // public approveCustomerKyc(req: any) {
  //   let url = environment.apiUrl+"kyc/compliance/approve";
  //   let h: HttpHeaders =
  //     this.getHeaders().set("Content-Type", "application/json");
  //   return this.httpClient.post<any>(url, req, { headers: h })
  // }
  public rejectCustomerKyc(req: any) {
    let url = `${environment.apiUrl}/kyc/verify/reject`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.post<any>(url, req, { headers: h });
  }
  // public rejectCustomerKyc(req: any) {
  //   let url = environment.apiUrl+"kyc/compliance/reject";
  //   let h: HttpHeaders =
  //     this.getHeaders().set("Content-Type", "application/json");
  //   return this.httpClient.post<any>(url, req, { headers: h })
  // }
  public getKYCShareHoldresData(id: any) {
    let url = `${environment.apiUrl}/kyc/corporate?kycId=${id}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAuthorizedData(id: any) {
    let url = `${environment.apiUrl}/kyc/corporate?kycId=${id}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.get<any>(url, { headers: h });
  }

  public getImage(id: any) {
    const url = `${environment.apiUrl}/kyc/static/${id}`;
    const headers: HttpHeaders = this.getHeaders(); // Assuming this adds other necessary headers.

    return this.httpClient.get(url, {
      headers: headers,
      responseType: 'blob' // Specify that the response type is 'blob'
    });
  }

  public getImageAndOpen(id: any) {
    const url = `${environment.apiUrl}/kyc/static/${id}`;
    const headers = this.getHeaders();

    this.httpClient.get(url, { headers, responseType: 'blob' }).subscribe(blob => {
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, '_blank');
    }, error => {
      console.error('Error fetching the image:', error);
    });
  }

  public lockKYCforMultipleAccess(id: any) {
    let url = `${environment.apiUrl}/kyc/verify/lock?kycId=${id}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.get<any>(url, { headers: h });
  }

    public searchUserByReferralCode(referralCode: any) {
    let url = `${environment.apiUrl}/kyc/common/findUserByReferralCode?referralCode=${referralCode}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.httpClient.get<any>(url, { headers: h });
  }
}
