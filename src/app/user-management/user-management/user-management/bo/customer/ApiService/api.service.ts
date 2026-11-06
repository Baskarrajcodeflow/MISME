import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from "rxjs";
import { environment } from "../../../../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CustomerApiService {
  token:any
  constructor(private http: HttpClient) {}
  private getHeaders(): HttpHeaders {
    let token;
    if (sessionStorage) {
      token = sessionStorage.getItem("JWT_TOKEN");
      this.token = sessionStorage.getItem("JWT_TOKEN");
      if (token == null || token == undefined) {
        token = "Dummy Value";
        this.token = "Dummy Value";
      }
    }
    return new HttpHeaders().set("Authorization", "Bearer " + token);
  }

  post<T>(endpoint : string, reqPayload : any):Observable<T>{
    console.log(`URL:${environment.apiUrl}${endpoint}`)
     return this.http.post<T>(`${environment.apiUrl}${endpoint}`, reqPayload).pipe(
       catchError(this.handleError<T>(`post ${endpoint}`))
     );
    }
    
  private handleError<T>(operation = 'operation', result?: T) {
    return (error : any) : Observable<T> => {
      console.error(`${operation} failed : ${error.message}`);
      return of(result as T);
    }
  }

  public getUserProfile() {
    let url = environment.apiUrl + "/um/api/customer/profile";
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

    public getPayFromAccountDetails(phoneOrWalletNo:any) {
    let url = environment.apiUrl + `/ts/api/transaction-services/CurrentBalance?phoneOrWalletNo=${phoneOrWalletNo}&meta=WALLET`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public searchUserToPay(type:any,phoneOrWalletNo:any) {
    let url = environment.apiUrl + `/ts/api/transaction-services/findUser?phoneOrWalletNo=${phoneOrWalletNo}&meta=${type}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public checkFeesAndCommission(phoneOrWalletNo:any,amount:any) {
    let url = environment.apiUrl + `/ts/api/transaction-services/getFinalAmount?serviceName=WALLET_TO_WALLET&channel=WALLET&amount=${amount}&walletNo=${phoneOrWalletNo}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public transferMoney(data:any) {
    let url = environment.apiUrl + `/tms/api/tms/router/basic`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url,data, { headers: h });
  }

  public fetchBreshnaBill(accountNo:any) {
    let url = environment.apiUrl + `/ts/api/transaction-services/fetchBill?accountNo=${accountNo}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  //CashOut Api
  public findWithdrawal(customerId:any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/findWithdrawalReq?id=${customerId}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public payrollRequests(customerId:any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/findPayRollReq?id=${customerId}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }


  public payBreshnaBill(data:any) {
    let url = environment.apiUrl + `/tms/api/tms/router/basic`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post<any>(url,data, { headers: h });
  }



  public payRequstedBillForAgent(cashOutId:any,value:any,pin:any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/authorizeByApp?cashOutId=${cashOutId}&value=${value}&pin=${pin}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public payRequstedPayrollBillForAgent(cashOutId:any,value:any,pin:any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/authorizeByAppForPayRoll?cashOutId=${cashOutId}&value=${value}&pin=${pin}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

  public CustomerkycProofUpload(formData: FormData, mapping: string, id: any) {
    const params = new HttpParams()
      .set('mapping', mapping)
      .set('customerId', id.toString());
    const url = `${environment.apiUrl}/kyc/customer/uploadImage`;
    const headers = new HttpHeaders()
      .set("Authorization", "Bearer " + this.token); 
    return this.http.post<any>(url, formData, { headers, params });
  }
    // Transaction History
public getTranasctionHistory(walletNo: any,trxnType:any,fromDate:any,toDate:any,page:any) {
  let url = environment.apiUrl + `/ts/api/transaction-services/${walletNo}/miniStatement?trxnType=${trxnType}&fromDate=${fromDate}&toDate=${toDate}&page=${page}
`;
  let h: HttpHeaders =
    this.getHeaders().set("Content-Type", "application/json");
  return this.http.get<any>(url, { headers: h })
}
public getBundles() {
  let url = environment.apiUrl + `/tms/serviceDetail/awcc/bundlePacks`;
  let h: HttpHeaders =
    this.getHeaders().set("Content-Type", "application/json");
    console.log(url);
  return this.http.get<any>(url, { headers: h })
}


public verifyOtp(body: any) {
  let url = `${environment.apiUrl}/um/api/otp/verify`;
  let h: HttpHeaders = this.getHeaders().set(
    'Content-Type',
    'application/json'
  );
  console.log(h);

  return this.http.post<any>(url, body, { headers: h });
}

public generateOtp(body: any) {
  let url = `${environment.apiUrl}/um/api/otp/generate`;
  let h: HttpHeaders = this.getHeaders().set(
    'Content-Type',
    'application/json'
  );
  console.log(h);
  return this.http.post<any>(url, body, { headers: h });
}

public getCountries() {
  let url = `${environment.apiUrl}/kyc/locations/countries`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  console.log(url);
  return this.http.get<any>(url, { headers: h });
}

public getprovinces() {
  let url = `${environment.apiUrl}/kyc/locations/provinces`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  console.log(url);

  return this.http.get<any>(url, { headers: h });
}
public getdistricts(provinceId: any) {
  let url = `${environment.apiUrl}/kyc/locations/provinces/` + provinceId + `/districts`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  console.log(url);
  return this.http.get<any>(url, { headers: h })
}

public customerKYCRegister(req: any) {
  let url = `${environment.apiUrl}/um/api/customer/mobile/signUp`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  console.log(url);
  return this.http.post<any>(url, req, { headers: h });
}

public getAllFirmType() {
  let url = `${environment.apiUrl}/kyc/common/getAllFirmType`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  console.log(url);

  return this.http.get<any>(url, { headers: h });
}
public customerKYCSubmit(req: any) {
  let url = `${environment.apiUrl}/kyc/customer/basic`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  console.log(url);
  return this.http.post<any>(url, req, { headers: h });
}

public completeRegisterKYC(id: any, ) {
  let url = `${environment.apiUrl}/kyc/corporate/complete?corpId=`+id;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  console.log(url);

  return this.http.post<any>(url,{}, { headers: h });
}
public customerKYCUpdate(req: any) {
  let url = `${environment.apiUrl}/kyc/customer/update`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  console.log(url);
  return this.http.post<any>(url, req, { headers: h });
}
public addCustomerProof(file1: File, type: any,customerId:any) {
  let h: HttpHeaders = this.getHeaders();
  const file = new FormData();
  file.append('file', file1);
  let url = `${environment.apiUrl}/kyc/customer/uploadImage?mapping=` + type+ `&submittedFor=` + customerId;;
  return this.http.post<any>(url, file, { headers: h })
} 
public addCustomerProfilePhoto(file1: File) {
  let h: HttpHeaders = this.getHeaders();
  const file = new FormData();
  file.append('file', file1);
  let url = `${environment.apiUrl}/um/api/customer/profilePic`;
  return this.http.post<any>(url, file, { headers: h })
}
public submitCorporateProfilePic(fileToUpload: File) {
  let h: HttpHeaders = this.getHeaders(); 
  const formData = new FormData(); 
  formData.append('file', fileToUpload); 
  let url = `${environment.apiUrl}/um/api/customer/profilePic`;
  return this.http.post<any>(url, formData, { headers: h });
}
public generate(body: any) {
  let url = `${environment.apiUrl}/aaa/generate`;
  let h: HttpHeaders = this.getHeaders().set(
    'Content-Type',
    'application/json'
  );
  console.log(h);
  return this.http.post<any>(url, body, { headers: h });
}
public checkEmailExist(email:string) {
  let url = `${environment.apiUrl}/um/api/app/emailCheck?email=`+email;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  return this.http.get<any>(url, { headers: h });
}
public checkPhoneExist(phone:string) {
  let url = `${environment.apiUrl}/um/api/app/phoneCheck?phone=`+phone;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  return this.http.get<any>(url, { headers: h });
}

  public checkFeesAndCommissionNew(phoneOrWalletNo:any,amount:any,SERVICE_NAME:any) {
    let url = environment.apiUrl + `/ts/api/transaction-services/getFinalAmount?serviceName=${SERVICE_NAME}&channel=WALLET&amount=${amount}&walletNo=${phoneOrWalletNo}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }
  public topUpRecharge(data: any) {
  let url = `${environment.apiUrl}/tms/api/tms/router/basic`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  return this.http.post(url, data, {
    headers: h,
  });
}

public getLoyaltyPoints(walletNo:string) {
  let url = `${environment.apiUrl}/lms/points/summary/${walletNo}`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  return this.http.get<any>(url, { headers: h });
}
  public getLoyaltySummary(walletNo:string) {
  let url = `${environment.apiUrl}/lms/ledger/${walletNo}`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  return this.http.get<any>(url, { headers: h });
}

 public platformApi() {
  let url = `${environment.apiUrl}/xpp/out/platforms`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  return this.http.get<any>(url, { headers: h });
}
  public atomaPay(data: any) {
  let url = `${environment.apiUrl}/xpp/out/pay`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  return this.http.post(url, data, {
    headers: h,
  });
}

   public getPointConversionConfig() {
    let url = environment.apiUrl + `/lms/getPointConversionConfig`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

   public pointConversion(data: any) {
  let url = `${environment.apiUrl}/tms/point/conversion`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  return this.http.post(url, data, {
    headers: h,
  });
}

 public getReferralCode() {
    let url = environment.apiUrl + `/lms/referral/referralCode`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.get<any>(url, { headers: h });
  }

      public searchUserByReferralCode(referralCode: any) {
    let url = `${environment.apiUrl}/kyc/common/findUserByReferralCode?referralCode=${referralCode}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.http.get<any>(url, { headers: h });
  }
  
  initiateRemittance(data: any): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/tms/moneyTransfer/initiate`,
      data,
      {
        headers: this.getHeaders()
      }
    );
  }

  createOrganization(data: any): Observable<any> {
   let url = `${environment.apiUrl}/kyc/merchant/create`;
  let h: HttpHeaders = this.getHeaders().set(
    "Content-Type",
    "application/json"
  );
  return this.http.post(url, data, {
    headers: h,
  });
  }

       public getOrganizationDetails() {
    let url = `${environment.apiUrl}/kyc/merchant/list`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);

    return this.http.get<any>(url, { headers: h });
  }
}
