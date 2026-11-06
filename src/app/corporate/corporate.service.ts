import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CorporateService {
  private getHeaders(): HttpHeaders {
    let token = sessionStorage.getItem("token");
    if (token == null || token == undefined) {
      token = "Dummy Value";
    }
    return new HttpHeaders().set("Authorization", "Bearer " + token);
  }
  constructor(private httpClient: HttpClient) { }

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
  public getAccPurpose() {
    let url = `${environment.apiUrl}/kyc/common/purposeOfAcc`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllMasterAgents() {
    let url = `${environment.apiUrl}/um/api/bo/getAllByAgentType?agentType=` + "AGENT";
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getNatureOfBusiness() {
    let url = `${environment.apiUrl}/kyc/common/getAllFirmType`;
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
  public getAuthProducts(id: any) {
    let url = `${environment.apiUrl}/um/api/bo/getAllChangeProductRequest?baseUserId=` + id;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.get<any>(url, { headers: h });
  }
  public finalAuthorizeProduct(id: any, reason: any) {
    let url = `${environment.apiUrl}/um/api/bo/changeProduct?id=${id}&reason=${reason}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.post<any>(url, { headers: h });
  }
  public rejectProduct(id: any, reason: any) {
    let url = `${environment.apiUrl}/um/api/bo/changeProductReject?id=${id}&reason=${reason}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.post<any>(url, { headers: h });
  }
  public getprovinces() {
    let url = `${environment.apiUrl}/kyc/locations/provinces`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );

    return this.httpClient.get<any>(url, { headers: h });
  }
  public addAgentphoto(file1: File, fieldname: any, agentId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    // file.append('customerKycId', photoId)
    // file.append('type', customerData)
    let url = `${environment.apiUrl}/kyc/agent/uploadAttachment?mapping=` + fieldname + `&submittedFor=` + agentId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addAgentSign(file1: File, fieldname: any, agentId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    // file.append('customerKycId', photoId)
    // file.append('type', customerData)
    let url = `${environment.apiUrl}/kyc/agent/uploadAttachment?mapping=` + fieldname + `&submittedFor=` + agentId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public getdistricts(provinceId: any) {
    let url = `${environment.apiUrl}/kyc/locations/provinces/` + provinceId + `/districts`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );

    return this.httpClient.get<any>(url, { headers: h })
  }
  public getCorporateUsers() {
    let url = `${environment.apiUrl}/um/api/bo/getAllCorps`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.get<any>(url, { headers: h });
  }

  public suspendUser(data: any) {
    let url = `${environment.apiUrl}/um/api/bo/suspendUser?userId=${data?.userId}&reason=${data?.reason}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, data, { headers: h });
  }

  public unSuspendUser(data: any) {
    let url = `${environment.apiUrl}/um/api/bo/unSuspendUser?userId=${data?.userId}&reason=${data?.reason}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, data, { headers: h });
  }


  public authSuspendUser(data: any) {
    let url = `${environment.apiUrl}/um/api/bo/authorizeSuspendUser`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, data, { headers: h });
  }

  public getLogs(id: any) {
    let url = `${environment.apiUrl}/um/api/bo/getSuspendLog?id=${id}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, '', { headers: h });
  }
  public authorizeUnSuspendUser(data: any) {
    let url = `${environment.apiUrl}/um/api/bo/authorizeUnSuspendUser?userId=${data?.userId}&reason=${data?.reason}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, data, { headers: h });
  }
  public rejectUnSuspendUser(data: any) {
    let url = `${environment.apiUrl}/um/api/bo/rejectUnSuspendUser?userId=${data?.userId}&reason=${data?.reason}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, data, { headers: h });
  }
  public getTranasactionHistory(walletNo: any, trxnType: any, fromDate: any, toDate: any) {
    let url = environment.apiUrl + `/ts/api/transaction-services/getFilteredHistory?walletNo=${walletNo}&trxnType=${trxnType}&fromDate=${fromDate}&toDate=${toDate}`;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getMasterAgents() {
    let url = `${environment.apiUrl}/kyc/masterAgent`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAgents(agentType: any) {
    let url = `${environment.apiUrl}/um/api/bo/getAllByAgentType?agentType=` + agentType;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.get<any>(url, { headers: h });
  }
  public getMerchants(agentType: any) {
    let url = `${environment.apiUrl}/um/api/bo/getAllByUserType?agentType=` + agentType;
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

  public checkUserName(username: any) {
    let url = `${environment.apiUrl}/um/api/app/userNameCheck?userName=` + username;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.get<any>(url, { headers: h });
  }
  public checkIDexists(req: any) {
    let url = `${environment.apiUrl}/um/api/app/idProofCheck`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public submitCorporateRegister(req: any) {
    let url = `${environment.apiUrl}/um/api/bo/registerCorporate`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, req, { headers: h });
  }
  //new
  public submitFundingPartyRegister(req: any) {
    let url = `${environment.apiUrl}/um/api/bo/registerFundingParty`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public submitMasterAgentRegister(req: any) {
    let url = `${environment.apiUrl}/um/api/bo/registerMaster`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, req, { headers: h });
  }

  public submitCorporateProfilePic(fileToUpload: File) {
    let h: HttpHeaders = this.getHeaders();
    const formData = new FormData();
    formData.append('file', fileToUpload);
    let url = `${environment.apiUrl}/um/api/corps/profilePic`;
    return this.httpClient.post<any>(url, formData, { headers: h });
  }

  public submitMasterAgentProfilePic(fileToUpload: File) {
    let h: HttpHeaders = this.getHeaders();
    const formData = new FormData();
    formData.append('file', fileToUpload);
    let url = `${environment.apiUrl}/um/api/agent/profilePic`;
    return this.httpClient.post<any>(url, formData, { headers: h });
  }
  public submitCorporateRegisterKYC(req: any) {
    let url = `${environment.apiUrl}/kyc/corporate/basic`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public corporateKYCUpdate(req: any) {
    let url = `${environment.apiUrl}/kyc/corporate/update`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );

    return this.httpClient.post<any>(url, req, { headers: h });
  }
   public corporateKYCUpdateByMaker(req: any) {
    let url = `${environment.apiUrl}/kyc/corporate/editProcess/update`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.post<any>(url, req, { headers: h });
  }
   public deleteCorporateMultipleDoc(req: any, id: any) {
    let h: HttpHeaders = this.getHeaders();
     let url = `${environment.apiUrl}/kyc/corporate/deleteOtherDocs?deletedFor=${id}`;
    return this.httpClient.delete<any>(url, {
      headers: h,
      body: req // Pass the request body here
    });
  }
  public corporateNGOKYCUpdate(req: any) {
    let url = `${environment.apiUrl}/kyc/ngo/update`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );

    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public corporateNGOKYCUpdateByMaker(req: any) {
    let url = `${environment.apiUrl}/kyc/ngo/editProcess/update`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.post<any>(url, req, { headers: h });
  }
    public corporateAgencyKYCUpdate(req: any) {
    let url = `${environment.apiUrl}/kyc/govtAgency/update`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );

    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public corporateAgencyKYCUpdateByMaker(req: any) {
    let url = `${environment.apiUrl}/kyc/govtAgency/editProcess/update`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public submitCorporateNGORegisterKYC(req: any) {
    let url = `${environment.apiUrl}/kyc/ngo/basic`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public submitCorporateGOVTAgencyRegisterKYC(req: any) {
    let url = `${environment.apiUrl}/kyc/govtAgency/basic`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public submitMasterAgentRegisterKYC(req: any) {
    let url = `${environment.apiUrl}/kyc/masterAgent/basic`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public updateMasterAgentRegisterKYC(req: any) {
    let url = `${environment.apiUrl}/kyc/masterAgent/update`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, req, { headers: h });
  }
  //corpFile
  public submitCorporateKYCFiles(id: any, mapping: any, fileToUpload: File) {
    let h: HttpHeaders = this.getHeaders();
    const formData = new FormData();
    formData.append('file', fileToUpload);
    let url = `${environment.apiUrl}/kyc/corporate/uploadImage?submittedFor=${id}&mapping=${mapping}`;
    return this.httpClient.post<any>(url, formData, { headers: h });
  }
  public submitCorporateKYCFilesByMaker(id: any, mapping: any, fileToUpload: File) {
    let h: HttpHeaders = this.getHeaders();
    const formData = new FormData();
    formData.append('file', fileToUpload);
    let url = `${environment.apiUrl}/kyc/corporate/editProcess/uploadImage?mapping=${mapping}&submittedFor=${id}`;
    return this.httpClient.post<any>(url, formData, { headers: h });
  }
  public submitCorporateNGOKYCFiles(id: any, mapping: any, fileToUpload: any) {
    let h: HttpHeaders = this.getHeaders();
    const formData = new FormData();
    formData.append('file', fileToUpload);
    let url = `${environment.apiUrl}/kyc/ngo/uploadImage?mapping=${mapping}&submittedFor=${id}`;
    return this.httpClient.post<any>(url, formData, { headers: h });
  }
  public submitCorporateGOVTAgencyKYCFiles(id: any, mapping: any, fileToUpload: any) {
    let h: HttpHeaders = this.getHeaders();
    const formData = new FormData();
    formData.append('file', fileToUpload);
    let url = `${environment.apiUrl}/kyc/govtAgency/uploadImage?mapping=${mapping}&submittedFor=${id}`;
    return this.httpClient.post<any>(url, formData, { headers: h });
  }
   public submitCorporateNGOKYCFilesByMaker(id: any, mapping: any, fileToUpload: any) {
    let h: HttpHeaders = this.getHeaders();
    const formData = new FormData();
    formData.append('file', fileToUpload);
    let url = `${environment.apiUrl}/kyc/ngo/editProcess/uploadImage?mapping=${mapping}&submittedFor=${id}`;
    return this.httpClient.post<any>(url, formData, { headers: h });
  }
  public submitCorporateGOVTAgencyKYCFilesByMaker(id: any, mapping: any, fileToUpload: any) {
    let h: HttpHeaders = this.getHeaders();
    const formData = new FormData();
    formData.append('file', fileToUpload);
    let url = `${environment.apiUrl}/kyc/govtAgency/editProcess/uploadImage?mapping=${mapping}&submittedFor=${id}`;
    return this.httpClient.post<any>(url, formData, { headers: h });
  }
  public submitCorporateKYCShareholderFiles(mapping: any, submittedFor: any, shareholderId: any, fileToUpload: File) {
    let h: HttpHeaders = this.getHeaders();
    const formData = new FormData();
    formData.append('file', fileToUpload);
    let url = `${environment.apiUrl}/kyc/corporate/uploadImage?mapping=${mapping}&submittedFor=${submittedFor}&shareholderId=${shareholderId}`;
    return this.httpClient.post<any>(url, formData, { headers: h });
  }
    public submitCorporateKYCShareholderFilesByMaker(mapping: any, submittedFor: any, shareholderId: any, fileToUpload: File) {
    let h: HttpHeaders = this.getHeaders();
    const formData = new FormData();
    formData.append('file', fileToUpload);
    let url = `${environment.apiUrl}/kyc/corporate/editProcess/uploadImage?mapping=${mapping}&submittedFor=${submittedFor}&shareholderId=${shareholderId}`;
    return this.httpClient.post<any>(url, formData, { headers: h });
    }
  public submitMasterKYCShareholderFiles(mapping: any, submittedFor: any, shareholderId: any, fileToUpload: File) {
    let h: HttpHeaders = this.getHeaders();
    const formData = new FormData();
    formData.append('file', fileToUpload);
    let url = `${environment.apiUrl}/kyc/masterAgent/uploadImage?mapping=${mapping}&submittedFor=${submittedFor}&shareholderId=${shareholderId}`;
    return this.httpClient.post<any>(url, formData, { headers: h });
  }
  public submitCorporateKYCSignatoryFiles(mapping: any, submittedFor: any, signatoryId: any, fileToUpload: any) {
    let h: HttpHeaders = this.getHeaders();
    const formData = new FormData();
    formData.append('file', fileToUpload);
    let url = `${environment.apiUrl}/kyc/corporate/uploadImage?mapping=${mapping}&submittedFor=${submittedFor}&signatoryId=${signatoryId}`;
    return this.httpClient.post<any>(url, formData, { headers: h });
  }
   public submitCorporateKYCSignatoryFilesByMaker(mapping: any, submittedFor: any, signatoryId: any, fileToUpload: any) {
    let h: HttpHeaders = this.getHeaders();
    const formData = new FormData();
    formData.append('file', fileToUpload);
    let url = `${environment.apiUrl}/kyc/corporate/editProcess/uploadImage?mapping=${mapping}&submittedFor=${submittedFor}&signatoryId=${signatoryId}`;
    return this.httpClient.post<any>(url, formData, { headers: h });
  }

  public submitMasterKYCSignatoryFiles(mapping: any, submittedFor: any, signatoryId: any, fileToUpload: any) {
    let h: HttpHeaders = this.getHeaders();
    const formData = new FormData();
    formData.append('file', fileToUpload);
    let url = `${environment.apiUrl}/kyc/masterAgent/uploadImage?mapping=${mapping}&submittedFor=${submittedFor}&signatoryId=${signatoryId}`;
    return this.httpClient.post<any>(url, formData, { headers: h });
  }

  //masterAgent File
  public submitmasterAgentKYCFiles(id: any, mapping: any, fileToUpload: File) {
    let h: HttpHeaders = this.getHeaders();
    const formData = new FormData();
    formData.append('file', fileToUpload);
    let url = `${environment.apiUrl}/kyc/masterAgent/uploadImage?submittedFor=${id}&mapping=${mapping}`;
    return this.httpClient.post<any>(url, formData, { headers: h });
  }
  public submitmasterAgentKYCShareholderFiles(mapping: any, submittedFor: any, shareholderId: any, fileToUpload: File) {
    let h: HttpHeaders = this.getHeaders();
    const formData = new FormData();
    formData.append('file', fileToUpload);
    let url = `${environment.apiUrl}/kyc/masterAgent/uploadImage?mapping=${mapping}&submittedFor=${submittedFor}&shareholderId=${shareholderId}`;
    return this.httpClient.post<any>(url, formData, { headers: h });
  }
  public submitmasterAgentKYCSignatoryFiles(mapping: any, submittedFor: any, signatoryId: any, fileToUpload: File) {
    let h: HttpHeaders = this.getHeaders();
    const formData = new FormData();
    formData.append('file', fileToUpload);
    let url = `${environment.apiUrl}/kyc/masterAgent/uploadImage?mapping=${mapping}&submittedFor=${submittedFor}&signatoryId=${signatoryId}`;
    return this.httpClient.post<any>(url, formData, { headers: h });
  }
  public addMasterAgentMultipleDoc(file1: File, fieldname: any, photoId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/kyc/masterAgent/uploadImage?mapping=` + fieldname + `&submittedFor=` + photoId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }

  //----------------//
  public completeRegisterKYC(id: any,) {
    let url = `${environment.apiUrl}/kyc/corporate/complete?corpId=` + id;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, { headers: h });
  }
  public completeRegisterNGOKYC(id: any,) {
    let url = `${environment.apiUrl}/kyc/ngo/complete?corpId=` + id;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, { headers: h });
  }
   public completeRegisterAgencyKYC(id: any,) {
    let url = `${environment.apiUrl}/kyc/govtAgency/complete?corpId=` + id;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, { headers: h });
  }
  public completeCustomerKyc(id: any,) {
    let url = `${environment.apiUrl}/kyc/customer/complete?customerId=` + id;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.post<any>(url, { headers: h });
  }
    public completeAgentKyc(id: any,) {
    let url = `${environment.apiUrl}/kyc/agent/complete?agentId=` + id;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.post<any>(url, { headers: h });
  }
  public completeRegisterGOVTAgencyKYC(id: any,) {
    let url = `${environment.apiUrl}/kyc/ngo/complete?corpId=` + id;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, { headers: h });
  }


  public completeMasterAgentRegisterKYC(id: any,) {
    let url = `${environment.apiUrl}/kyc/masterAgent/complete?masterId=` + id;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.post<any>(url, { headers: h });
  }
  // public submitCorporateKYCFiles(id: any, mapping:any) {
  //   let h: HttpHeaders = this.getHeaders();
  //   const file = new FormData();
  //   let url = `${environment.apiUrl}/kyc/corporate/uploadImage?corpId=`+id`$mapping=`+mapping;
  //   return this.httpClient.post<any>(url, file, { headers: h })
  //   //old
  //   // let url = `${environment.apiUrl}/kyc/corporate/uploadImage?corpId=`+id`$mapping=`+mapping;
  //   // let h: HttpHeaders = this.getHeaders().set(
  //   //   "Content-Type",
  //   //   "application/json"
  //   // );
  //   // 
  //   // return this.httpClient.post<any>(url,  { headers: h });
  // }
  public submitMasterRegister(req: any) {
    let url = `${environment.apiUrl}/registerMaster`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public agentRegister(req: any) {
    let url = `${environment.apiUrl}/um/api/bo/registerAgent`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );

    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public merchantRegister(req: any) {
    let url = `${environment.apiUrl}/um/api/bo/registerMerchant`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );

    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public merchantSubmit(req: any) {
    let url = `${environment.apiUrl}/kyc/merchant/basic`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );

    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public agentSubmit(req: any) {
    let url = `${environment.apiUrl}/kyc/agent/basic`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );

    return this.httpClient.post<any>(url, req, { headers: h });
  }
   public merchantUpdate(req: any) {
    let url = `${environment.apiUrl}/kyc/merchant/update`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );

    return this.httpClient.post<any>(url, req, { headers: h });
  }
  public agentUpdate(req: any) {
    let url = `${environment.apiUrl}/kyc/agent/update`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );

    return this.httpClient.post<any>(url, req, { headers: h });
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
   public customerKYCUpdateByMaker(req: any) {
    let url = `${environment.apiUrl}/kyc/customer/editProcess/update`;
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
  public customerKYCComplete(id: any) {
    let url = `${environment.apiUrl}/kyc/customer/complete?customer=` + id;
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
  public authorizeCorporateUsers(id: any) {
    let url = `${environment.apiUrl}/um/api/bo/activateBackOffice?id=` + id;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.get<any>(url, { headers: h });
  }
  public rejectCorporateUsers(id: any) {
    let url = `${environment.apiUrl}/um/api/bo/deleteAcc?userId=` + id;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );

    return this.httpClient.get<any>(url, { headers: h });
  }
  public deactivateCorporateUsers(id: any) {
    let url = `${environment.apiUrl}/um/api/bo/deactivateAcc?userId=` + id;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.get<any>(url, { headers: h });
  }

  public lockCorporateUsers(data: any, reason: any) {
    let url = `${environment.apiUrl}/um/api/bo/deactivate?reason=${reason}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, data, { headers: h });
  }
  public addAgentPhoto(file1: File, fieldname: any, photoId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/kyc/agent/uploadImage?mapping=` + fieldname + `&submittedFor=` + photoId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addAgentProfilePhoto(file1: File) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/um/api/agent/profilePic`;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addOpsDigSign(file1: File, fieldname: any, photoId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/kyc/agent/uploadImage?mapping=` + fieldname + `&submittedFor=` + photoId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addAgentDigSign(file1: File, fieldname: any, photoId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/kyc/agent/uploadImage?mapping=` + fieldname + `&submittedFor=` + photoId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addAgentDocFront(file1: File, fieldname: any, photoId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/kyc/agent/uploadImage?mapping=` + fieldname + `&submittedFor=` + photoId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addAgentDocBack(file1: File, fieldname: any, photoId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/kyc/agent/uploadImage?mapping=` + fieldname + `&submittedFor=` + photoId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addAgentLicense(file1: File, fieldname: any, photoId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/kyc/agent/uploadImage?mapping=` + fieldname + `&submittedFor=` + photoId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addAgentAddressProof(file1: File, fieldname: any, photoId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/kyc/agent/uploadImage?mapping=` + fieldname + `&submittedFor=` + photoId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addAgentMultipleDoc(file1: File, fieldname: any, photoId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/kyc/agent/uploadImage?mapping=` + fieldname + `&submittedFor=` + photoId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }


  //   public addAgentMultipleDoc(formData: FormData) {
  //     let h: HttpHeaders = this.getHeaders();
  //     const url = `${environment.apiUrl}/kyc/agent/uploadImage`;

  //     return this.httpClient.post<any>(url, formData, { headers: h });
  // }
  // public addAgentMultipleDoc(formData: FormData, fieldname: any, photoId: any) {
  //   let h: HttpHeaders = this.getHeaders();
  //   // Construct the URL with query parameters 'mapping' and 'submittedFor'
  //   const url = `${environment.apiUrl}/kyc/agent/uploadImage?mapping=${fieldname}&submittedFor=${photoId}`;
  //   // Send the request to the server with the constructed URL and FormData
  //   return this.httpClient.post<any>(url, formData, { headers: h });
  // }
  public addAgentTin(file1: File, fieldname: any, photoId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/kyc/agent/uploadImage?mapping=` + fieldname + `&submittedFor=` + photoId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addSuperAgentPhoto(file1: File, fieldname: any, photoId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    // file.append('customerKycId', photoId)
    // file.append('type', customerData)
    let url = `${environment.apiUrl}/kyc/super/uploadAttachment?mapping=` + fieldname + `&submittedFor=` + photoId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addSuperAgentSign(file1: File, fieldname: any, photoId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    // file.append('customerKycId', photoId)
    // file.append('type', customerData)
    let url = `${environment.apiUrl}/kyc/super/uploadAttachment?mapping=` + fieldname + `&submittedFor=` + photoId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }

  // Refresh Token
  public refreshToken() {
    let url = `${environment.apiUrl}/aaa/web/refreshToken`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.get<any>(url, { headers: h });
  }


  public addCorpMultipleDoc(file1: File, fieldname: any, photoId: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = `${environment.apiUrl}/kyc/corporate/uploadImage?mapping=` + fieldname + `&submittedFor=` + photoId;
    return this.httpClient.post<any>(url, file, { headers: h })
  }

   public deleteMasterAgentMultipleDoc(req: any, id: any) {
    let h: HttpHeaders = this.getHeaders();
    // let url = `${environment.apiUrl}/kyc/corporate/deleteOtherDocs?deletedFor=${id}`;
    let url = `${environment.apiUrl}/kyc/corporate/deleteOtherDocs?deletedFor=` + id;
    return this.httpClient.delete<any>(url, {
      headers: h,
      body: req // Pass the request body here govtAgency
    });
  }
   public deleteUnGovtAgencyMultipleDoc(req: any, id: any) {
    let h: HttpHeaders = this.getHeaders();
    let url = `${environment.apiUrl}/kyc/govtAgency/deleteOtherDocs?deletedFor=` + id;
    return this.httpClient.delete<any>(url, {
      headers: h,
      body: req // Pass the request body here 
    });
  }
  public deleteNGOMultipleDoc(req: any, id: any) {
    let h: HttpHeaders = this.getHeaders();
    // let url = `${environment.apiUrl}/kyc/corporate/deleteOtherDocs?deletedFor=${id}`;
    let url = `${environment.apiUrl}/kyc/ngo/deleteOtherDocs?deletedFor=` + id;
    return this.httpClient.delete<any>(url, {
      headers: h,
      body: req // Pass the request body here
    });
  }

   public passwordRevoke(data: any) {
    let url = `${environment.apiUrl}/um/api/pwd/passwordRetryRevoke`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );


    return this.httpClient.post<any>(url, data, { headers: h });
  }

    public getAgentServices(baseUserId:number) {
    let url = `${environment.apiUrl}/um/api/bo/getAgentServices?baseUserId=` + baseUserId;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.get<any>(url, { headers: h });
  }

  public getSubAgentCommission(baseUserId:number) {
    let url = `${environment.apiUrl}/um/api/bo/getSubAgentCommission?baseUserId=` + baseUserId;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.httpClient.get<any>(url, { headers: h });
  }

   public updateSubAgentCommissionStructure(data:any) {
    let h: HttpHeaders = this.getHeaders();
    let url = `${environment.apiUrl}/um/api/bo/updateSubAgentCommission`;
    return this.httpClient.put<any>(url, data, { headers: h })
  }
}
