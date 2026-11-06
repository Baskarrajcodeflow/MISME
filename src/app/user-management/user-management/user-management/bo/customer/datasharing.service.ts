import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerDatasharingService {


  private operatorSubject = new BehaviorSubject<any>(null);
  operator$ = this.operatorSubject.asObservable();

  setOperatorData(operator: string) {
    this.operatorSubject.next(operator);
  }
//--------------------------------------------------------------------------------//
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  
  show() {
    this.loadingSubject.next(true);
    // console.log(this.loadingSubject);
  }

  hide() {
    this.loadingSubject.next(false);
  }


  private setCondition = new BehaviorSubject<boolean>(false);
  setCondition$ = this.setCondition.asObservable();

  setConditionSignUp(event: boolean) {
    console.log('Setting condition to:', event);
    this.setCondition.next(event);
  }

  private currencySubject = new BehaviorSubject<any>(null);
  currency$ = this.currencySubject.asObservable();

  setcurrencyData(currency: any) {
    this.currencySubject.next(currency);
  }

  public loginSubject = new BehaviorSubject<any>(null);
  login$ = this.loginSubject.asObservable();

  setloginData(login: any) {
    this.loginSubject.next(login);
  }

  private corpKyc = new BehaviorSubject<boolean>(false); // Default value
  corpKyc$ = this.corpKyc.asObservable();

  corpKycData(status: boolean) {
    this.corpKyc.next(status);
  }

  private profilepic = new BehaviorSubject<any>(null);
  profilepic$ = this.profilepic.asObservable();

  setprofilepicData(currency: any) {
    this.profilepic.next(currency);
  }

    
  private kyclevel = new BehaviorSubject<any>(null);
  kyclevel$ = this.kyclevel.asObservable();

  setkyclevelData(currency: any) {
    this.kyclevel.next(currency);
  }

  private walletNo = new BehaviorSubject<any>(null);
  walletNo$ = this.walletNo.asObservable();

  setwalletNoData(currency: any) {
    this.walletNo.next(currency);
  }

  private loginFlag = new BehaviorSubject<any>(false);
  loginFlag$ = this.loginFlag.asObservable();

  setloginFlagData(currency: any) {
    this.loginFlag.next(currency);
  }

    private loyalty = new BehaviorSubject<any>(null);
  loyalty$ = this.loyalty.asObservable();

  setloyaltyData(currency: any) {
    this.loyalty.next(currency);
  }

  public loginNew = new BehaviorSubject<boolean>(false);
  loginnew$ = this.loginNew.asObservable();
  private isBrowser!: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      const savedState = sessionStorage.getItem('isLoggedIn');
      if (savedState) {
        this.loginNew.next(JSON.parse(savedState));
      }
    }
  }

  loginSignUp(isLoggedIn: boolean) {
    if (this.isBrowser) {
      this.loginNew.next(isLoggedIn);
      sessionStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    }
  }
}
