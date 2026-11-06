import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IndividualKYCService {
  env1 = 'http://192.168.0.141:8080'
  reset() {
    throw new Error('Method not implemented.');
  }
  private getHeaders(): HttpHeaders {
    let token = sessionStorage.getItem('token');
    if (token == null || token == undefined) {
      token = "Dummy Value";
    }
    return new HttpHeaders()
      .set("Authorization", "Bearer " + token);
  }

  public addIndividualCustomerProof(id: Number, extension: string, proofType: Number, file1: File) {
    let url = environment.apiUrl + "app/addCustomerProof?customerId=" + id + "&extension=" + extension + "&proofType=" + proofType;
    // let h:HttpHeaders = 
    //     this.getHeaders()
    // let formData:FormData = new FormData();
    // formData.append("file", file)
    const file = new FormData();
    // file.append('name', file1.name);
    file.append("file", file1);

    return this.httpClient.post<any>(url, file)
  }
  public addCorporateCustomerProof(id: Number, extension: string, proofType: Number, file1: File) {
    let url = environment.apiUrl + "app/addCorporateCustomerProof?customerId=" + id + "&extension=" + extension + "&proofType=" + proofType;
    // let h:HttpHeaders = 
    //     this.getHeaders()
    const file = new FormData();

    file.append("file", file1)

    return this.httpClient.post<any>(url, file)
  }
  public addMerchantCustomerProof(id: Number, extension: string, proofType: Number, file1: File) {
    let url = environment.apiUrl + "app/addMerchantProof?merchantId=" + id + "&extension=" + extension + "&proofType=" + proofType;
    // let h:HttpHeaders = 
    //     this.getHeaders()
    const file = new FormData();

    file.append("file", file1)

    return this.httpClient.post<any>(url, file)
  }
  public addAgentCustomerProof(id: Number, extension: string, proofType: Number, file1: File) {
    let url = environment.apiUrl + "app/addAgentProof?agentId=" + id + "&extension=" + extension + "&proofType=" + proofType;
    // let h:HttpHeaders = 
    // this.getHeaders()
    const file = new FormData();

    file.append("file", file1)

    return this.httpClient.post<any>(url, file)
  }
  public addIndividualKyc(req: any) {
    let url = environment.apiUrl + "app/addCustomer";
    // let h:HttpHeaders = 
    //     this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.post<any>(url, req)
  }
  public addCorporateKyc(req: any) {
    console.log(req)
    let url = environment.apiUrl + "app/addCorporateCustomer";
    // let h:HttpHeaders = 
    //     this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.post<any>(url, req)
  }
  public addMerchantKyc(req: any) {
    console.log(req)
    let url = environment.apiUrl + "app/addMerchant";
    // let h:HttpHeaders = 
    //     this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.post<any>(url, req)
  }
  public addAgentKyc(req: any) {
    console.log(req)
    let url = environment.apiUrl + "app/addAgent";
    // let h:HttpHeaders = 
    //     this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.post<any>(url, req)
  }

  //getSUBAGENT
  public getSubagents() {
    let url = environment.apiUrl + "app/getAllSubAgent";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url)
  }
  public confirmPass(req: any) {
    let url = environment.apiUrl + "user/update-password";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public checkTazkiraOrPosCust(req: any) {
    let url = `${environment.apiUrl}/kyc/customer/checkIfKycExist`;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public checkTazkiraOrPosAgent(req: any) {
    let url = environment.apiUrl + "kyc/agent/checkIfKycExist";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public checkTazkiraOrPosSuper(req: any) {
    let url = environment.apiUrl + "kyc/super/checkIfKycExist";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public bulkUploadCustKYC(file1: File) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = environment.apiUrl + "bulkUpload/customerKYC";
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public bulkUploadAgentKYC(file1: File) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = environment.apiUrl + "bulkUpload/agentKYC";
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public bulkUploadSuperKYC(file1: File) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = environment.apiUrl + "bulkUpload/superAgentKYC";
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public bulkUploadUssdKYC(file1: File) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = environment.apiUrl + "bulkUpload/ussdKYC";
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public bulkUploadMMkyc(file1: File) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = environment.apiUrl + "bulkUpload/mmStaffKYC";
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public bulkUploadMicroKyc(file1: File) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = environment.apiUrl + "bulkUpload/microMerchantKYC";
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public bulkUploadMerchantKyc(file1: File) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    let url = environment.apiUrl + "bulkUpload/merchantKYC";
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public getCustomerKYC() {
    let url = environment.apiUrl + "";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url)
  }
  public getSubmerchants() {
    let url = environment.apiUrl + "app/getSubMerchant";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url)
  }
  public getRoles() {
    let url = environment.apiUrl + "app/getUsers";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url)
  }

  public deleteSubagent(user_ID: any) {
    let url = environment.apiUrl + "profile/deleteSubAgent?userId=" + user_ID;
    let h: HttpHeaders =
      this.getHeaders()
    return this.httpClient.get<any>(url, { headers: h })
  }
  public FinalEditUser(req: any) {
    let url = environment.apiUrl + "editAgentUser";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public deleteRoleUser(user_ID: any) {
    let url = environment.apiUrl + "profile/deleteRole?userId=" + user_ID;
    let h: HttpHeaders =
      this.getHeaders()
    return this.httpClient.get<any>(url, { headers: h })
  }
  public deleteSubmerchant(user_ID: any) {
    let url = environment.apiUrl + "profile/deleteSubMerchant?userId=" + user_ID;
    let h: HttpHeaders =
      this.getHeaders()
    return this.httpClient.get<any>(url, { headers: h })
  }
  public ConfirmStockSubagent(subAgentId: any, status: any) {
    let url = environment.apiUrl + "app/changeStockOnlyStatusBySubAgent?subAgentId=" + subAgentId + "&value=" + status;
    let h: HttpHeaders =
      this.getHeaders()
    return this.httpClient.get<any>(url, { headers: h })
  }
  public ConfirmStockMerchant(merchantId: any, status: any) {
    let url = environment.apiUrl + "app/changeStockOnlyStatusByMerchant?merchantId=" + merchantId + "&value=" + status;
    let h: HttpHeaders =
      this.getHeaders()
    return this.httpClient.get<any>(url, { headers: h })
  }
  public deleteMerchant(user_ID: any) {
    let url = environment.apiUrl + "profile/deleteMerchant?userId=" + user_ID;
    let h: HttpHeaders =
      this.getHeaders()
    return this.httpClient.get<any>(url, { headers: h })
  }
  // public viewAgentKYC() {
  //   let url = environment.apiUrl + "";
  //   let h: HttpHeaders =
  //     this.getHeaders()
  //   return this.httpClient.get<any>(url, { headers: h })
  // }

  public getBalance(walletNo: any, userType: any) {
    let url = environment.apiUrl + "transaction/getBalance?accountNo=" + walletNo + "&userType=" + userType;
    let h: HttpHeaders =
      this.getHeaders()
    return this.httpClient.get<any>(url, { headers: h })
  }
  public confirmRefundShahy(req: any) {
    let url = environment.apiUrl + "agent/refundingUsersByBackOffice";
    let h: HttpHeaders =
      this.getHeaders()
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public FinalRefundConfirm(req: any) {
    let url = environment.apiUrl + "agent/refundingAgentByBackOffice";
    let h: HttpHeaders =
      this.getHeaders()
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public activeUser(ActiveID: any, ActiveType: any, value: any) {
    let url = environment.apiUrl + "deactivateAccount?userId=" + ActiveID + "&userType=" + ActiveType + "&value=" + value;
    let h: HttpHeaders =
      this.getHeaders()
    return this.httpClient.get<any>(url, { headers: h })
  }
  public deactivateUser(ActiveID: any, ActiveType: any, value: any) {
    let url = environment.apiUrl + "deactivateAccount?userId=" + ActiveID + "&userType=" + ActiveType + "&value=" + value;
    let h: HttpHeaders =
      this.getHeaders()
    return this.httpClient.get<any>(url, { headers: h })
  }
  public deleteAgent(USER_ID: any, user_type: any) {
    let url = environment.apiUrl + "profile/deleteUsers?userId=" + USER_ID + "&userType=" + user_type;
    let h: HttpHeaders =
      this.getHeaders()
    return this.httpClient.get<any>(url, { headers: h })
  }
  public StockTransferOnly(AGENT_ID: any, status: any) {
    let url = environment.apiUrl + "app/changeStockOnlyStatus?agentId=" + AGENT_ID + "&value=" + status;
    let h: HttpHeaders =
      this.getHeaders()
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getPinblock(pin: any, pan: any) {

    let url = environment.apiUrl + "app/getPinBlock/" + pin + "/" + pan;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url)
  }


  public addSubAgentKyc(req: any) {
    let url = environment.apiUrl + "app/addSubAgent";
    // let h:HttpHeaders = 
    //     this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.post<any>(url, req)
  }
  public SubmerchantRegister(req: any) {
    let url = environment.apiUrl + "app/addSubMerchant";
    let h: HttpHeaders =
      this.getHeaders()
    return this.httpClient.post<any>(url, req)
  }
  public getAllAgents() {
    let url = environment.apiUrl + "app/getAllAgent";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getFilterByDateAgent(startDate: any, endDate: any, walletNo: any) {
    let url = environment.apiUrl + "users/getTopUpByAgentByDate?fromDate=" + startDate + "&toDate=" + endDate + "&wallet=" + walletNo;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getFilterByDateSubagent(startDate: any, endDate: any, walletNo: any) {
    let url = environment.apiUrl + "users/getTopUpBySubAgentByDate?fromDate=" + startDate + "&toDate=" + endDate + "&wallet=" + walletNo;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getFilterByDateMerchant(startDate: any, endDate: any, walletNo: any) {
    let url = environment.apiUrl + "users/getTopUpByMerchantByDate?fromDate=" + startDate + "&toDate=" + endDate + "&wallet=" + walletNo;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public SearchByTxn(TxnValue: any) {
    let url = environment.apiUrl + "topup/getTopUpByTxnNumber?txnNumber=" + TxnValue;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getSubagentByAgent(id: number) {
    let url = environment.apiUrl + "app/getSubAgentByAgent?agentId=" + id;
    // let h:HttpHeaders = 
    //     this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.get<any>(url)
  }
  public addCustomerKYC(req: any) {
    let url = `${environment.apiUrl}/kyc/customer/submit`;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
    // const file = new FormData();
    // file.append("photo", photo)
    // file.append("signature", signature)
  }
  public addCustomerPhoto(file1: File, photoId: any, type: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    file.append('customerKycId', photoId)
    file.append('type', type)
    let url = `${environment.apiUrl}/kyc/customer/uploadAttachment`;
    return this.httpClient.post<any>(url, file, { headers: h })

  }
  public uploadImage(file1: File,fieldname: any,customerId:any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    // file.append('customerKycId', photoId)
    // file.append('type', customerData)
    let url = `${environment.apiUrl}/kyc/customer/uploadImage?mapping=`+fieldname+`&customerId=`+customerId;
    return this.httpClient.post<any>(url, file, { headers: h })

  }
  public agentImageUpload(file1: File,fieldname: any,customerId:any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    // file.append('customerKycId', photoId)
    // file.append('type', customerData)
    let url = `${environment.apiUrl}/kyc/agent/uploadAttachment?mapping=`+fieldname+`&submittedFor=`+customerId;
    return this.httpClient.post<any>(url, file, { headers: h })

  }
  public addCustomerDoc(file1: File, photoId: any, type: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    file.append('customerKycId', photoId)
    file.append('type', type)
    let url = `${environment.apiUrl}/kyc/customer/uploadAttachment`;
    return this.httpClient.post<any>(url, file, { headers: h })

  }
  public addCustomerSign(file1: File, photoId: any, type1: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('customerKycId', photoId)
    file.append('type', type1)
    let url = `${environment.apiUrl}/kyc/customer/uploadAttachment`;
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addComplianceSignCustomer(file1: File, photoId: any, type1: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('customerKycId', photoId)
    file.append('type', type1)
    let url = environment.apiUrl + "kyc/customer/uploadAttachment";
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addComplianceAgentSignCustomer(file1: File, photoId: any, type1: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('customerKycId', photoId)
    file.append('type', type1)
    let url = environment.apiUrl + "kyc/customer/uploadAttachment";
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addComplianceSuperAgentSignCustomer(file1: File, photoId: any, type1: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('customerKycId', photoId)
    file.append('type', type1)
    let url = environment.apiUrl + "kyc/customer/uploadAttachment";
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addComplianceOPS_SIGNCustomer(file1: File, photoId: any, type1: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('customerKycId', photoId)
    file.append('type', type1)
    let url = environment.apiUrl + "kyc/customer/uploadAttachment";
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addComplianceCOMPLIANCE_SIGNCustomer(file1: File, photoId: any, type1: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('customerKycId', photoId)
    file.append('type', type1)
    let url = environment.apiUrl + "kyc/customer/uploadAttachment";
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addCustomerPhotoUpdate(file1: File, photoId: any, type: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('customerKycId', photoId)
    file.append('type', type)
    let url = environment.apiUrl + "kyc/customer/update-upload";

    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addCustomerSignUpdate(file1: File, photoId: any, type1: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('customerKycId', photoId)
    file.append('type', type1)
    let url = environment.apiUrl + "kyc/customer/update-upload";

    return this.httpClient.post<any>(url, file, { headers: h })
  }

  public addAgentPhoto(file1: File, photoId: any, type: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    file.append('agentKycId', photoId)
    file.append('type', type)
    let url = environment.apiUrl + "kyc/agent/uploadAttachment";
    return this.httpClient.post<any>(url, file, { headers: h })

  }
  public addAgentSign(file1: File, photoId: any, type1: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('agentKycId', photoId)
    file.append('type', type1)
    let url = environment.apiUrl + "kyc/agent/uploadAttachment";
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addCustomerDocAgent(file1: File, photoId: any, type1: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('agentKycId', photoId)
    file.append('type', type1)
    let url = environment.apiUrl + "kyc/agent/uploadAttachment";
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addComplianceSignAgent(file1: File, photoId: any, type1: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('agentKycId', photoId)
    file.append('type', type1)
    let url = environment.apiUrl + "compliance/upload";
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addComplianceSUPERAGENT_SIGNAgent(file1: File, photoId: any, type1: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('agentKycId', photoId)
    file.append('type', type1)
    let url = environment.apiUrl + "compliance/upload";
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addComplianceOPS_SIGNAgent(file1: File, photoId: any, type1: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('agentKycId', photoId)
    file.append('type', type1)
    let url = environment.apiUrl + "compliance/upload";
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addComplianceCOMPLIANCE_SIGNAgent(file1: File, photoId: any, type1: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('agentKycId', photoId)
    file.append('type', type1)
    let url = environment.apiUrl + "compliance/upload";
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addAgentPhotoUpdate(file1: File, photoId: any, type: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('agentKycId', photoId)
    file.append('type', type)
    let url = environment.apiUrl + "kyc/agent/update-upload";
    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addAgentSignUpdate(file1: File, photoId: any, type1: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('agentKycId', photoId)
    file.append('type', type1)
    let url = environment.apiUrl + "kyc/agent/update-upload";
    return this.httpClient.post<any>(url, file, { headers: h })
  }

  public addSuperAgentPhoto(file1: File, photoId: any, type: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    file.append('superAgentKycId', photoId)
    file.append('type', type)
    let url = environment.apiUrl + "kyc/super/uploadAttachment";
    return this.httpClient.post<any>(url, file, { headers: h })

  }
  public addSuperAgentSign(file1: File, photoId: any, type1: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('superAgentKycId', photoId)
    file.append('type', type1)
    let url = environment.apiUrl + "kyc/super/uploadAttachment";

    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addComplianceSuperAgentSign(file1: File, photoId: any, type1: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('agentKycId', photoId)
    file.append('type', type1)
    let url = environment.apiUrl + "compliance/upload";

    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addSUPERAGENT_SIGNSuperAgentSign(file1: File, photoId: any, type1: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('agentKycId', photoId)
    file.append('type', type1)
    let url = environment.apiUrl + "compliance/upload";

    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addOPS_SIGNSuperAgentSign(file1: File, photoId: any, type1: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('agentKycId', photoId)
    file.append('type', type1)
    let url = environment.apiUrl + "compliance/upload";

    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addCOMPLIANCE_SIGNSuperAgentSign(file1: File, photoId: any, type1: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('agentKycId', photoId)
    file.append('type', type1)
    let url = environment.apiUrl + "compliance/upload";

    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addPresidentSign(file1: File, photoId: any, type2: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('superAgentKycId', photoId)
    file.append('type', type2)
    let url = environment.apiUrl + "kyc/super/uploadAttachment";

    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addVicePresidentSign(file1: File, photoId: any, type3: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('superAgentKycId', photoId)
    file.append('type', type3)
    let url = environment.apiUrl + "kyc/super/uploadAttachment";

    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addSuperDoc(file1: File, photoId: any, type3: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('superAgentKycId', photoId)
    file.append('type', type3)
    let url = environment.apiUrl + "kyc/super/uploadAttachment";

    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addSuperAgentPhotoUpdate(file1: File, photoId: any, type: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    file.append('superAgentKycId', photoId)
    file.append('type', type)
    let url = environment.apiUrl + "kyc/super/update-upload";
    return this.httpClient.post<any>(url, file, { headers: h })

  }
  public addSuperAgentSignUpdate(file1: File, photoId: any, type: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append('file', file1);
    file.append('superAgentKycId', photoId)
    file.append('type', type)
    let url = environment.apiUrl + "kyc/super/update-upload";
    return this.httpClient.post<any>(url, file, { headers: h })

  }
  public addSuperAgentPresSignUpdate(file1: File, photoId: any, type1: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('superAgentKycId', photoId)
    file.append('type', type1)
    let url = environment.apiUrl + "kyc/super/update-upload";

    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addSuperAgentViceSignUpdate(file1: File, photoId: any, type2: any) {
    let h: HttpHeaders = this.getHeaders();
    const file = new FormData();
    file.append("file", file1);
    file.append('superAgentKycId', photoId)
    file.append('type', type2)
    let url = environment.apiUrl + "kyc/super/update-upload";

    return this.httpClient.post<any>(url, file, { headers: h })
  }
  public addAgentKYC(req: any) {
    let url = environment.apiUrl + "kyc/agent/submit";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public addSuperAgentKYC(req: any) {
    let url = environment.apiUrl + "kyc/super/submit";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public addSuperAgentKYC1(req: any) {
    let url = environment.apiUrl + "kyc/super/submit";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public updateSuperAgentKYC(req: any) {
    let url = environment.apiUrl + "kyc/super/updateSuperAgentKyc";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public updateCustomerKYC(req: any) {
    let url = environment.apiUrl + "kyc/customer/update";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public updateAgentKYC(req: any) {
    let url = environment.apiUrl + "kyc/agent/updateAgentKyc";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public getValues(kycID: any) {
    let url = environment.apiUrl + "kyc/customer/getKycById?id="+kycID;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getCountryList() {
    let url = environment.apiUrl + "locations/getAllCountries";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  // public getCountries() {
  //   let url =`${environment.apiUrl}/kyc/locations/countries`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   console.log(url);
    
  //   return this.httpClient.get<any>(url, { headers: h });
  // }
  public getDistrictList(provinceValue: any) {
    let url =`${environment.apiUrl}locations/getDistrictsByProvince?provinceId=`+provinceValue;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getDistrictListPeraddress(provinceValue1: any) {
    let url = `${environment.apiUrl}/locations/getDistrictsByProvince?provinceId=`+provinceValue1;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public acceptCustomerPhoto() {
    let url = environment.apiUrl + "kyc/customer/uploadAttachment";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, { headers: h })
  }
  public getDistrictListViceAdd(provinceValue2: any) {
    let url = `${environment.apiUrl}/locations/getDistrictsByProvince?provinceId=`+provinceValue2;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getDistrictListVicePer(provinceValue3: any) {
    let url = `${environment.apiUrl}/locations/getDistrictsByProvince?provinceId=`+provinceValue3;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getDistrictListOrg(provinceValue5: any) {
    let url = `${environment.apiUrl}/locations/getDistrictsByProvince?provinceId=`+provinceValue5;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getProvinceList(countryId: any) {
    let url = `${environment.apiUrl}/locations/getProvincesByCountry?countryId=` + countryId;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getValueAgent(AgentkycID: any) {
    let url = environment.apiUrl + "kyc/agent/getKycById?id="+AgentkycID;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getValueSuperAgent(superkycID: any) {
    let url = environment.apiUrl + "kyc/super/getKycById?id="+superkycID;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getRejectedFields(kycID: any) {
    let url = environment.apiUrl + "kyc/customer/getRejectedDetailsById?id=" + kycID;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getDateSearchCustomer(req: any) {
    let url = environment.apiUrl + "kyc/filter/getAllCustomerKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public getViewAgent(page1: any) {
    let url = environment.apiUrl + "kyc/agent/getAllKyc?page="+page1;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getViewAgentNext(pageValue: any) {
    let url = environment.apiUrl + "kyc/agent/getAllKyc?page="+pageValue;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  
  public getDateSearchAgent(req:any) {
    let url = environment.apiUrl + "kyc/filter/getAllAgentKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url,req, { headers: h })
  } 
  public getAccNOSearchAgent(req:any) {
    let url = environment.apiUrl + "kyc/filter/getAllAgentKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url,req, { headers: h })
  }
  public getDateSearchSuper(req:any) {
    let url = environment.apiUrl + "kyc/filter/getAllSuperAgentKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req,{ headers: h })
  }
  public getMMaccountSearchCustomer(req:any) {
    let url = environment.apiUrl + "kyc/filter/getAllCustomerKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url,req, { headers: h })
  }
  public getAccNOSearchCustomer(req:any) {
    let url = environment.apiUrl + "kyc/filter/getAllCustomerKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url,req, { headers: h })
  }
  public getAccNOSearchSuper(req:any) {
    let url = environment.apiUrl + "kyc/filter/getAllSuperAgentKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url,req, { headers: h })
  }
  public getMMaccountSearchAgent(req:any) {
    let url = environment.apiUrl + "kyc/filter/getAllAgentKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url,req, { headers: h })
  }
  public getMMaccountSearchSuper(req:any) {
    let url = environment.apiUrl + "kyc/filter/getAllSuperAgentKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url,req, { headers: h })
  }
  public getStatusSearchCustomer(req:any) {
    let url = environment.apiUrl + "kyc/filter/getAllCustomerKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url,req, { headers: h })
  }
  public getStatusSearchSuper(req:any) {
    let url = environment.apiUrl + "kyc/filter/getAllSuperAgentKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url,req, { headers: h })
  }
  public getStatusSearchAgent(req:any) {
    let url = environment.apiUrl + "kyc/filter/getAllAgentKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url,req, { headers: h })
  }
  public getBranchSearchCustomer(req:any) {
    let url = environment.apiUrl + "kyc/filter/getAllCustomerKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url,req, { headers: h })
  }
  public getBranchSearchAgent(req:any) {
    let url = environment.apiUrl + "kyc/filter/getAllAgentKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url,req, { headers: h })
  }
  public getBranchSearchSuper(req:any) {
    let url = environment.apiUrl + "kyc/filter/getAllSuperAgentKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url,req, { headers: h })
  }
  public getUserSearchCustomer(req:any) {
    let url = environment.apiUrl + "kyc/filter/getAllCustomerKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url,req, { headers: h })
  }
  public getSubmittedCustomers(req:any) {
    let url = environment.apiUrl + "kyc/report/getAllCustomerKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url,req, { headers: h })
  }
  public getUserSearchAgent(req:any) {
    let url = environment.apiUrl + "kyc/filter/getAllAgentKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url,req, { headers: h })
  }
  public getAgentKYC(req:any) {
    let url = environment.apiUrl + "kyc/filter/getAllAgentKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url,req, { headers: h })
  }
  public getUserSearchSuper(req:any) {
    let url = environment.apiUrl + "kyc/filter/getAllSuperAgentKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url,req, { headers: h })
  }
  public getSuperAgentKYC(req:any) {
    let url = environment.apiUrl + "kyc/filter/getAllSuperAgentKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req,{ headers: h })
  }
  public rejectCompliance(req: any) {
    let url = environment.apiUrl + "compliance/verifyKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public verifyCompliance(req: any) {
    let url = environment.apiUrl + "compliance/verifyKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public undertakenSubmit(req1: any) {
    console.log(req1)
    let url = environment.apiUrl + "compliance/save-undertaken";
    let h:HttpHeaders = 
        this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.post<any>(url, req1,{headers:h})
  }
  public agentVerify(req2: any) {
    console.log(req2)
    let url = environment.apiUrl + "compliance/save-agent-verification";
    let h:HttpHeaders = 
        this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.post<any>(url, req2,{headers:h})
  }
  public ABMMCVerify(req3: any) {
    console.log(req3)
    let url = environment.apiUrl + "";
    let h:HttpHeaders = 
        this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.post<any>(url, req3,{headers:h})
  }
  public superAgentVerify1(req2: any) {
    console.log(req2)
    let url = environment.apiUrl + "compliance/save-agent-verification";
    let h:HttpHeaders = 
        this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.post<any>(url, req2,{headers:h})
  }
  public superAgentVerify2(req3: any) {
    console.log(req3)
    let url = environment.apiUrl + "";
    let h:HttpHeaders = 
        this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.post<any>(url, req3,{headers:h})
  }
  public abmmcverifySuperAgent(req2: any) {
    console.log(req2)
    let url = environment.apiUrl + "compliance/uploadForSuperAgent";
    let h:HttpHeaders = 
        this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.post<any>(url, req2,{headers:h})
  }
  public verifyComplianceAgent(req: any) {
    let url = environment.apiUrl + "compliance/verifyKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public rejectComplianceAgent(req: any) {
    let url = environment.apiUrl + "compliance/verifyKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public verifyComplianceSuperagent(req: any) {
    let url = environment.apiUrl + "compliance/verifyKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public rejectComplianceSuperagent(req: any) {
    let url = environment.apiUrl + "compliance/verifyKYC";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public CheckOldPassword(req: any) {
    let url = environment.apiUrl + "agent/checkOldPassword";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })

  }
  public registerSubAgent(parentId:any,req: any) {
    let url = environment.apiUrl + "/um/api/bo/bo/registerSubAgent?parentId="+parentId;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })

  }
  public ChangeAgentPassword(req: any) {
    let url = environment.apiUrl + "agent/changePassword";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })

  }
  public getCountries() {
    let url = environment.apiUrl + "app/countries";
    // let h:HttpHeaders = 
    //     this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.get<any>(url)
  }
  public getFirmtypes() {
    let url = environment.apiUrl + "app/firmtypes";
    // let h:HttpHeaders = 
    //     this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.get<any>(url)
  }
  public getLanguages() {
    let url = environment.apiUrl + "app/languages";
    // let h:HttpHeaders = 
    //     this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.get<any>(url)
  }
  public getNationalities() {
    let url = environment.apiUrl + "app/nationalities"
    // let h:HttpHeaders = 
    //     this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.get<any>(url)
  }
  public getCustomers() {
    let url = environment.apiUrl + "app/getCustomer";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getMasterProduct() {
    let url = environment.apiUrl + "product/get/masterProduct";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getMerchants() {
    let url = environment.apiUrl + "app/getMerchant";
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url)
  }
  public getCorporateCustomers() {
    let url = environment.apiUrl + "app/getCorporateCustomer";
    // let h:HttpHeaders = 
    //     this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.get<any>(url)
  }
  public authorizeCustomer(id: number, productId: Number) {
    let url = environment.apiUrl + "app/authorizeCustomer/" + id + "/" + productId;
    // let h:HttpHeaders = 
    //     this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.get<any>(url)
  }
  public authorizeCorporateCustomer(id: number, productId: Number) {
    let url = environment.apiUrl + "app/authorizeCorporateCustomer/" + id + "/" + productId;
    // let h:HttpHeaders = 
    //     this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.get<any>(url)
  }
  public authorizeMerchant(id: number, productId: Number) {
    let url = environment.apiUrl + "app/authorizeMerchant/" + id + "/" + productId;
    // let h:HttpHeaders = 
    //     this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.get<any>(url)
  }

  public getCustomerDetails(id: number) {

    let url = environment.apiUrl + "profile/getCustomerProfileDetails?customerId=" + id;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getCorporateDetails(id: number) {

    let url = environment.apiUrl + "profile/getCorporateCustomerProfileDetails?corporateCustomerId=" + id;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getMerchantDetails(id: number) {

    let url = environment.apiUrl + "profile/getMerchantProfileDetails?merchantId=" + id;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public findCustomerbyAccno(req: any) {
    let url = environment.apiUrl + "app/findCustomerByAccountNo";
    // let h:HttpHeaders = 
    //     this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.post<any>(url, req)
  }
  public checkPhone(phone: any) {

    let url = environment.apiUrl + "merchant/get/checkExistWallet?walletNo=" + phone;
    // let h:HttpHeaders = 
    //     this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.get<any>(url)
  }
  public getUsersFilterList() {

    let url = environment.apiUrl+"kyc/filter/getUsersFilterList";
    let h:HttpHeaders = 
        this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  public getBranchesFilterList() {

    let url = environment.apiUrl+"kyc/filter/getBranchesFilterList";
    let h:HttpHeaders = 
        this.getHeaders().set("Content-Type","application/json");
    return this.httpClient.get<any>(url, { headers: h })
  }
  // /kyc/report/getUsersFilterList

  constructor(private httpClient: HttpClient) { }
}
