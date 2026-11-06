import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ModuleMeta } from "../../interface/interface-list";

@Injectable({
  providedIn: "root",
})
export class DataSharingService {
  otp: string = "";
  constructor() {}

  private operatorSubject = new BehaviorSubject<any>(null);
  operator$ = this.operatorSubject.asObservable();

  setOperatorData(operator: any) {
    this.operatorSubject.next(operator);
  }

  private headerSubject = new BehaviorSubject<any>(null);
  headerOperator$ = this.headerSubject.asObservable();

  setHeaderSubjectData(operator: any) {
    this.headerSubject.next(operator);
  }

  private setIdSubject = new BehaviorSubject<any>(null);
  setIdOperator$ = this.setIdSubject.asObservable();

  setIdSubjectData(operator: any) {
    this.setIdSubject.next(operator);
  }

  private editMasterProd = new BehaviorSubject<any>(null);
  editMasterProd$ = this.editMasterProd.asObservable();

  editMasterProdData(operator: any) {
    this.editMasterProd.next(operator);
  }
  
  private setIdSubjectArray = new BehaviorSubject<any>(null);
  setOperator$ = this.setIdSubjectArray.asObservable();

  setSubjectData(modules: ModuleMeta[]) {
    console.log(modules);
    this.setIdSubjectArray.next(modules);
  }

  
  private setEmptyArray = new BehaviorSubject<any>(null);
  emptyArray$ = this.setEmptyArray.asObservable();

  emptyArray(modules:boolean) {
    console.log(modules);
    this.setEmptyArray.next(modules);
  }

  private setModuleName = new BehaviorSubject<any>(null);
  setModuleNameData$ = this.setModuleName.asObservable();

  setModuleNameData(modules:any) {
    console.log(modules);
    this.setModuleName.next(modules);
  }

  private setComponentName = new BehaviorSubject<any>(null);
  setComponentNameData$ = this.setComponentName.asObservable();

  setComponentNameData(Components:any) {
    console.log(Components);
    this.setComponentName.next(Components);
  }

  private kyc = new BehaviorSubject<any>(null);
  kycData$ = this.kyc.asObservable();

  kycData(Components:any) {
    this.kyc.next(Components);
  }

  private salaryProcessingId = new BehaviorSubject<any>(null);
  salaryProcessingIdData$ = this.salaryProcessingId.asObservable();

  salaryProcessingIdData(Components:any) {
    this.salaryProcessingId.next(Components);
  }

  private setFlag = new BehaviorSubject<boolean>(false);
  setFlagData$ = this.setFlag.asObservable();

  setFlagData(Components:any) {
    this.setFlag.next(Components);
  }

  private reuploadFile = new BehaviorSubject<boolean>(false);
  reuploadFileData$ = this.reuploadFile.asObservable();

  reuploadFileData(Components:any) {
    this.reuploadFile.next(Components);
  }

  private setFlagForNewUpload = new BehaviorSubject<boolean>(false);
  setFlagForNewUpload$ = this.setFlag.asObservable();

  setFlagForNewUploadData(Components:any) {
    this.setFlagForNewUpload.next(Components);
  }

  private apiCallSource = new BehaviorSubject<boolean>(false); // Default value
  setApiCall$ = this.apiCallSource.asObservable();

  setApiCallData(status: boolean) {
    this.apiCallSource.next(status);
  }

  private apiCallRefreshFeilds = new BehaviorSubject<boolean>(false); // Default value
  apiCallRefreshFeilds$ = this.apiCallRefreshFeilds.asObservable();

  apiCallRefreshFeild(status: boolean) {
    this.apiCallRefreshFeilds.next(status);
  }

  private masteragentDataService = new BehaviorSubject<any>(null); // Default value
  masteragentDataService$ = this.masteragentDataService.asObservable();

  masteragentDataServiceDataCall(status: any) {
    this.masteragentDataService.next(status);
  }

  private corporateDataService = new BehaviorSubject<any>(null); // Default value
  corporateDataService$ = this.corporateDataService.asObservable();

  corporateDataServiceDataCall(status: any) {
    this.corporateDataService.next(status);
  }
      setOTP(otp: string) {
    console.log("setOTP called", otp);
    this.otp = otp;
  }
  getOTP(): string {
    console.log("getOTP called", this.otp);
    return this.otp;
  }
}
