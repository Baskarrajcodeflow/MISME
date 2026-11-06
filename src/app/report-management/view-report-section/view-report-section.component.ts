import { CommonModule, DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Pipe, ViewChild } from "@angular/core";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import { ApiServiceService } from "../../product/api-service/api-service.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { DataSharingService } from "../../product/dataSharing/data-sharing.service";
import html2canvas from "html2canvas";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { LoaderComponent } from "../../loader/loader.component";
// import jsPDF from "jspdf";
import { KycReportComponent } from "../kyc-report/kyc-report.component";
import { Router } from "@angular/router";
import { KycModuleService } from "../../kyc/kyc/kyc-module.service";
import { MatIconModule } from "@angular/material/icon";
import jsPDF from "jspdf";
import { MatMenuModule } from '@angular/material/menu';
// import * as XLSX from 'xlsx';
import * as XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';
import { distinctUntilChanged, first, map } from 'rxjs/operators';
import autoTable from 'jspdf-autotable';
import { CashInOutReportComponent } from "../all-cutomerized-report/cash-in-out-report/cash-in-out-report.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, ThemePalette } from '@angular/material/core';
import * as _moment from 'moment';
import moment from "moment";
import { from } from 'rxjs';
import { concatMap, finalize } from 'rxjs/operators';
import { CorporateListComponent } from "../../corporate/corporate-list/corporate-list.component";
import { DomSanitizer } from "@angular/platform-browser";
import { log } from "console";
import { channel } from "diagnostics_channel";
import Papa from 'papaparse';
type ReportRow = {
  date: string;
  daily_count: number;
  total_fee_amount: number;
  fees_earned: number;
  fees_paid: number;
};
type ReportRowAwcc = {
  date: string;
  daily_count: number;
  total_fee_amount: number;
  fees_earned: number;
  fees_paid: number;
  netTotal: number;
  value: number;
};
@Component({
  selector: "app-view-report-section",
  standalone: true,
  imports: [
    NgxExtendedPdfViewerModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LoaderComponent,
    KycReportComponent,
    MatIconModule,
    MatIconModule, MatMenuModule,
    CashInOutReportComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CorporateListComponent
  ],
  providers: [DatePipe],
  templateUrl: "./view-report-section.component.html",
  styleUrl: "./view-report-section.component.css",
})

export class ViewReportSectionComponent implements OnInit {
  pdfSrc: any;
  selectedTime: any;
  dateForm!: FormGroup;
  routeName: any;
  showDate: boolean = false;
  isLoading: boolean = false;
  batchId: any;
  accountStatementDetails: any;
  batchReport: any
  totalCredit: number = 0;
  totalDebit: number = 0;
  totalCreditCount: number = 0;
  totalDebitCount: number = 0;
  slectType: any;
  selectedValue: any;
  accountStatementDetail: any = {};
  groupedData: any[] = [];
  objectKeys = Object.keys;
  year: any;
  selectedQuaterValue: any;
  resData: boolean = false;
  allData: any[] = [];
  kycId: any;
  userPrivileges: any;
  userPrevilages1: any;
  subagentPrivilege: any;
  backOfficeUser: any;
  trasactionSummaryReport: any;
  cashINReport: any;
  agentLiquidityReport: any;
  agentSummaryReport: any;
  financialConsolidatedReport: any;
  beginningBalanceReport: any;
  salesVolumeByChannel: any;
  salesVolumeByAgents: any;
  profitabilityReport: any;
  provinceList: any;
  provinceTarget: any;
  salesTrendReport: any;
  lctrReport: any;
  eMoneyReport: any;
  airtimeReconciliationReport: any;
  currentPageNo: number = 1; // Start with page 1
  pageSize: number = 20; // Number of records per page
  totalPages: number = 0; // Total number of pages
  refundReport: any;
  stockBatchReport: any;
  quarterlyProfitAndLoss: any;
  aubData: any;
  openingBalanceNew: any;
  closingBalNew: any;
  incomeProdAccount: any;
  fromDateMin!: string;
  fromDateMax!: string;
  toDateMin!: string | null;
  toDateMax!: string | null;
  lctrMonth: string = '';
  fromDate: string = '';
  toDate: string = '';
  dataSource: any;
  AggregateBalanceReport: any;
  BankTransactionReport: any;
  SuspenseAccountTransactionReport: any;
  TopUpDetailsTransactionReportByChannel: any;
  ApprovedKycReport: any;
  MostActiveUsersReport: any;
  ActiveCustomerReport: any;
  groupedDataNew: { [key: string]: ReportRow[] } = {};
  groupedDataNewAwcc: { [key: string]: ReportRowAwcc[] } = {};
  UserwithminimumsingletransactionReport: any
  Object = Object;
  // activeUserMonth: string = "";
  activeUserMonthTarget: any
  provinces: any;
  selectedIncomeProdAccount: any;
  floatAccounts: any;
  totalFloatCredit: any;
  totalWalletCredit: any;
  totalFloatDebit: any;
  walletAccounts: any;
  totalWalletDebit: any;
  selectedTab: any;
  changeRecency: any;
  provinceVal: any;
  totalFloatBalance: any;
  totalWalletBalance: any
  currentBalance: any;
  currentDateTime!: Date;
  netSettlementDifference: any;
  maxMonth: string = '';
  constructor(
    private apiService: ApiServiceService,
    private dataSharing: DataSharingService,
    private fb: FormBuilder,
    private router: Router,
    private KycModuleService: KycModuleService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private http: HttpClient
  ) {

  }
  @ViewChild('picker') picker: any;

  public date!: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate!: moment.Moment;
  public maxDate!: moment.Moment;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';

  public formGroup = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    date2: new FormControl(null, [Validators.required]),
    dateControl: new FormControl(null, [Validators.required])
  })
  public dateControlMinMax = new FormControl(new Date());

  public options = [
    { value: true, label: 'True' },
    { value: false, label: 'False' }
  ];
  reportDisplayNames: { [key: string]: string } = {
    IncomeBreshnaCustomerReport: 'Bill Payment- Customer Report',
    IncomeBreshnaDirectAgentReport: 'Bill Payment- Direct Agent Report',
    IncomeBreshnaInDirectAgentReport: 'Bill Payment- Indirect Agent Report',
    IncomeBreshnaMerchantReport: 'Bill Payment- Merchant Report'
  };
  reportDisplayNamesAwcc: { [key: string]: string } = {
    IncomeAwccCustomerReport: 'Airtime Top Up (AWCC)- Customer Report',
    IncomeAwccDirectAgentReport: 'Airtime Top Up (AWCC)- Direct Agent Report',
    IncomeAwccInDirectAgentReport: 'Airtime Top Up (AWCC)- Indirect Agent Report',
    IncomeAwccMerchantReport: 'Airtime Top Up (AWCC)- Merchant Report'
  };
  reportDisplayNamesNonAwcc: { [key: string]: string } = {
    IncomeNonAwccCustomerReport: 'Airtime Top Up (Non-AWCC)- Customer Report',
    IncomeNonAwccDirectAgentReport: 'Airtime Top Up (Non-AWCC)- Direct Agent Report',
    IncomeNonAwccInDirectAgentReport: 'Airtime Top Up (Non-AWCC)- Indirect Agent Report',
    IncomeNonAwccMerchantReport: 'Airtime Top Up (Non-AWCC)- Merchant Report'
  };
  public listColors = ['primary', 'accent', 'warn'];
  loyaltyArray: any[] = [
    { value: 'ALL', type: 'ALL' },
    { value: 'ABMMC_TO_HESAB_PAY', type: 'ABMMC To Hesab Pay' },
    { value: 'AGENT_TO_AGENT', type: 'Agent To Agent' },
    { value: 'AGENT_TO_CORPORATE', type: 'Agent To Corporate' },
    { value: 'AGENT_TO_CUSTOMER', type: 'Agent To Customer' },
    { value: 'AGENT_TO_MERCHANT', type: 'Agent To Merchant' },
    { value: 'AWCC_BUNDLE', type: 'AWCC Bundle' },
    { value: 'AWCC_STOCK_PURCHASE', type: 'AWCC Stock Purchase' },
    { value: 'AWCC_STOCK_TRANSFER', type: 'AWCC Stock Transfer' },
    { value: 'AWCC_TOPUP', type: 'AWCC Topup' },
    { value: 'BRESHNA_SERVICE', type: 'Breshna Service' },
    { value: 'CORPORATE_TO_AGENT', type: 'Corporate To Agent' },
    { value: 'CORPORATE_TO_CORPORATE', type: 'Corporate To Corporate' },
    { value: 'CORPORATE_TO_CUSTOMER', type: 'Corporate To Customer' },
    { value: 'CORPORATE_TO_MERCHANT', type: 'Corporate To Merchant' },
    { value: 'CUSTOMER_TO_AGENT', type: 'Customer To Agent' },
    { value: 'CUSTOMER_TO_CORPORATE', type: 'Customer To Corporate' },
    { value: 'CUSTOMER_TO_CUSTOMER', type: 'Customer To Customer' },
    { value: 'CUSTOMER_TO_MERCHANT', type: 'Customer To Merchant' },
    { value: 'DEPOSIT', type: 'Deposit' },
    { value: 'ETISALAT_TOPUP', type: 'Etisalat Topup' },
    { value: 'GB_PUSH', type: 'GB Push' },
    { value: 'HESAB_PAY_TO_ABMMC', type: 'Hesab Pay To ABMMC' },
    { value: 'MERCHANT_TO_AGENT', type: 'Merchant To Agent' },
    { value: 'MERCHANT_TO_CORPORATE', type: 'Merchant To Corporate' },
    { value: 'MERCHANT_TO_CUSTOMER', type: 'Merchant To Customer' },
    { value: 'MERCHANT_TO_MERCHANT', type: 'Merchant To Merchant' },
    { value: 'MTN_TOPUP', type: 'MTN Topup' },
    { value: 'PAY_ROLL', type: 'Pay Roll' },
    { value: 'ROSHAN_TOPUP', type: 'Roshan Topup' },
    { value: 'SALAAM_TOPUP', type: 'Salaam Topup' },
    { value: 'SCAN_QR', type: 'Scan QR' },
    { value: 'STOCK_PURCHASE', type: 'Stock Purchase' },
    { value: 'STOCK_TRANSFER', type: 'Stock Transfer' },
    { value: 'SUPPLIER_TOPUP', type: 'Supplier Topup' },
    { value: 'WALLET_TO_WALLET', type: 'Wallet To Wallet' },
    { value: 'WITHDRAWAL', type: 'Withdrawal' },
    { value: 'GB_PULL', type: 'GB Pull' },
    { value: 'AUB_PULL', type: 'AUB Pull' },
    { value: 'AUB_PUSH', type: 'AUB Push' }
  ];
  public stepHours = [1, 2, 3, 4, 5];
  public stepMinutes = [1, 5, 10, 15, 20, 25];
  public stepSeconds = [1, 5, 10, 15, 20, 25];
  ngOnInit(): void {
    //this.backOfficeUser = sessionStorage.getItem('loginUserName')
    this.KycModuleService.getProfileDetails().subscribe(response => {
      if (response?.responseCode == 200) {
        this.backOfficeUser = response?.data?.firstName + ' ' + response?.data?.lastName;
      }
    })
    this.dateForm = this.fb.group({
      walletNO: [""],
      AccNO: [""],
      BalanceReportYear: [""],
      BalanceReportMonth: [''],
      BalanceReportAccNo: [""],
      singleDate: [""],
      fromDate: [""],
      userTypeCrime: [''],
      userTypeMinOne: [''],
      activeUserMonth: [''],
      detailedTransService: [''],
      risk: [''],
      profile: [''],
      accKYC: [''],
      Service_Name: [''],
      unusualChannel: [''],
      CreatedDate: [''],
      province: [''],
      toDate: [""],
      accNo: [""],
      userType: [""],
      serviceName: [""],

      atomaStatus: [""],
      p_date: [""],
      bankServiceName: [""],
      status: [""],
      batchId: [""],
      service: [""],
      type: [""],
      txntype: [""],
      txnId: [""],
      channel: [""],
      fromTime: [""],
      toTime: [""],
      channelUsage: [""],
      loyaltyReportType: [""],
      loyaltyType: [""],
    });
    this.getprovinceList();
    const todayLctr = new Date();

    // Go to previous month
    todayLctr.setMonth(todayLctr.getMonth() - 1);

    const year = todayLctr.getFullYear();
    const month = (todayLctr.getMonth() + 1).toString().padStart(2, '0');  // Correct month indexing

    this.maxMonth = `${year}-${month}`;


    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    const lastMonth = oneMonthAgo;
    const formatDate = (date: Date): string => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    };
    this.dateForm.patchValue({
      fromDate: formatDate(lastMonth),
      toDate: formatDate(today),
    });
    this.dataSharing.setComponentNameData$
      .pipe(
        distinctUntilChanged(),
        first((res) => res)
      )
      .subscribe((res) => {
        this.routeName = res
        console.log(res); ``
        if (res == "TransactionSummaryReport") {
          this.showDate = true
          console.log(res);
        } else if (res == "AgentLiquidityReport") {
          let data = {};
          this.isLoading = true;
          this.apiService
            .transactionReport("AgentLiquidityReport", data)
            .subscribe({
              next: (res: any) => {
                this.showDate = true
                this.isLoading = false;
                this.agentLiquidityReport = res
                this.agentSummaryReport = res
                this.calculatePagination();
                this.totalCredit = this.agentLiquidityReport.reduce((acc: number, item: any) => {
                  return acc + parseFloat(item?.total_deposited || '0');
                }, 0);

                this.totalDebit = this.agentLiquidityReport.reduce((acc: number, item: any) => {
                  return acc + parseFloat(item?.total_withdrawn || '0');
                }, 0);
                this.totalCreditCount = this.agentLiquidityReport.reduce((acc: number, item: any) => {
                  // Only count if debit is 0 and credit is non-zero
                  return acc + (parseFloat(item?.total_withdrawn) === 0 && parseFloat(item?.total_deposited) !== 0 ? 1 : 0);
                }, 0);

                this.totalDebitCount = this.agentLiquidityReport.reduce((acc: number, item: any) => {
                  // Only count if credit is 0 and debit is non-zero
                  return acc + (parseFloat(item?.total_deposited) === 0 && parseFloat(item?.total_withdrawn) !== 0 ? 1 : 0);
                }, 0);
              },
              error: () => {
                this.isLoading = false;
                alert("Error Try Again");
              },
            });
        }
        //new
        else if (res == "MerchantToAgentReport") {
          this.showDate = true;
          this.apiService.getReportData("MercahntAgentTransactionReport", {}).subscribe({
            next: (data: any) => {
              this.showDate = true;
              this.isLoading = false;
              this.routeName = 'MerchantToAgentReport';
              // this.walletToWalletReportData = data || [];
              this.agentSummaryReport = data
              this.paginatedData = this.agentSummaryReport
              this.currentPage = 1;
              this.calculatePagination();
              this.cdr.detectChanges();
              this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + parseFloat(item?.credit_amount || '0');
              }, 0);

              this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + parseFloat(item?.debit_amount || '0');
              }, 0);

              this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
              }, 0);

              this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
              }, 0);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "WalletToWalletReport") {
          this.apiService.getReportData("WalletToWalletTransactionReport", {}).subscribe({
            next: (data: any) => {
              this.showDate = true;
              this.isLoading = false;
              this.routeName = 'WalletToWalletReport';
              // this.walletToWalletReportData = data || [];
              this.agentSummaryReport = data || [];
              this.paginatedData = this.agentSummaryReport
              this.currentPage = 1;
              this.calculatePagination();
              this.cdr.detectChanges();
              this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + parseFloat(item?.credit_amount || '0');
              }, 0);

              this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + parseFloat(item?.debit_amount || '0');
              }, 0);

              this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
              }, 0);

              this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
              }, 0);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "ActiveUserReport") {
          this.showDate = true;
          this.apiService.getReportData("ActiveUserReport", {}).subscribe({
            next: (data: any) => {
              this.isLoading = false;
              this.routeName = 'ActiveUserReport';
              console.log("routeName1", this.routeName)
              this.agentSummaryReport = data || [];
              this.paginatedData = this.agentSummaryReport
              this.currentPage = 1;
              this.calculatePagination();
              this.cdr.detectChanges();
              this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + parseFloat(item?.credit_amount || '0');
              }, 0);

              this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + parseFloat(item?.debit_amount || '0');
              }, 0);

              this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
              }, 0);

              this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
              }, 0);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "FailedTransactionReport") {
          this.showDate = true;
        }
        else if (res == "PullTransactionReport") {
          this.showDate = true;
        }
        else if (res == "PushTransactionReport") {
          this.showDate = true;
        }
        else if (res == "AggregateBalanceReport") {
          this.showDate = true;
        }
        else if (res == "BankTransactionReport") {
          this.showDate = true;
        }
        else if (res == "SuspenseAccountTransactionReport") {
          this.showDate = true;
        }
        else if (res == "TopUpDetailsTransactionReportByChannel") {
          this.showDate = true;
        }
        else if (res == "ApprovedKycReport") {
          this.apiService.getReportData("ApprovedKycReport", {}).subscribe({
            next: (data: any) => {
              this.showDate = true;
              this.isLoading = false;
              this.routeName = 'ApprovedKycReport';
              // this.walletToWalletReportData = data || [];
              this.agentSummaryReport = data || [];
              this.paginatedData = this.agentSummaryReport
              this.currentPage = 1;
              this.calculatePagination();
              this.cdr.detectChanges();
              this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + parseFloat(item?.credit_amount || '0');
              }, 0);

              this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + parseFloat(item?.debit_amount || '0');
              }, 0);

              this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
              }, 0);

              this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
              }, 0);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        //      else if (res == "AuthorizedAgentQuartelyReport") {
        //   this.apiService.reportV2('RejectedAccounts').subscribe({
        //     next: (data: Blob) => {
        //       this.isLoading = false;
        //         console.log(data,'+_+_+_+_+_+_+_+_+_+_+_+')
        //         const blob = data;
        //         this.pdfSrc = blob;            
        //     },
        //     error: () => {
        //       this.isLoading = false;
        //       alert("Error Try Again");
        //     },
        //   });
        // }
        //new jasper
        else if (res == "AccountHoldersWithHistoryOfFinancialCrime") {
          this.showDate = true;
        }
        else if (res == "DetailedTransactionProvinceWise") {
          this.showDate = true;
        }
        else if (res == "WrongAttemptUsersReport") {
          this.apiService.reportV2('WrongAttemptUsersReport').subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log('Blob type:', data.type);
              console.log('Blob size:', data.size);
              // Sanitize Blob URL
              this.pdfSrc = data;
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "LargeDepositMoreAFNFollowedByRapidWithdrawals") {
          this.apiService.reportV2('LargeDepositMoreAFNFollowedByRapidWithdrawals').subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+')
              const blob = data;
              this.pdfSrc = URL.createObjectURL(data);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "MultipleWithdrawalsAfterLargeDepositReport") {
          this.apiService.reportV2('MultipleWithdrawalsAfterLargeDepositReport').subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+')
              const blob = data;
              this.pdfSrc = data
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "RejectedAccounts") {
          this.apiService.reportV2('RejectedAccounts').subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+')
              const blob = data;
              this.pdfSrc = URL.createObjectURL(data);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "AuthorizedMerchantReport") {
          this.apiService.reportV2('AuthorizedMerchantReport').subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+')
              const blob = data;
              console.log('Blob type:', data.type);
              console.log('Blob size:', data.size);
              this.pdfSrc = data;
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "ActiveUserWithMinimumOneTrxnMonthlyReport") {
          this.showDate = true;
          this.apiService.reportV2WithParams('ActiveUserWithMinimumOneTrxnMonthlyReport', {}).subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
              this.pdfSrc = URL.createObjectURL(data);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "AllLoyaltyReports") {
          let data = {
            fromDate: this.dateForm.controls["fromDate"].value,
            toDate: this.dateForm.controls["toDate"].value,
            account: null,
            type: null,
            serviceName: null,
          };
          this.showDate = true;
          this.apiService.reportV2WithParams('AllLoyaltyReport', data).subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
              this.pdfSrc = URL.createObjectURL(data);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "TransactionsUnusualTiming") {
          this.showDate = true;
        }
        else if (res == "AllLoyaltyReports") {
          this.showDate = true;
        }
        else if (res == "RejectedTransactions") {
          this.showDate = true;
        }
        else if (res == "ActiveUserByProvinceBasedReportByProvince") {
          this.showDate = true;
        }

        else if (res == "AccountOpenAndActiveWithNoDepositReport") {
          this.apiService.reportV2('AccountOpenAndActiveWithNoDepositReport').subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+')
              const blob = data;
              this.pdfSrc = URL.createObjectURL(data);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "AccountsOpenedWithMinimalInformationReport") {
          this.apiService.reportV2('AccountsOpenedWithMinimalInformationReport').subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+')
              const blob = data;
              this.pdfSrc = URL.createObjectURL(data);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "CashTransactionsExceedingAFNReport") {
          this.apiService.reportV2('CashTransactionsExceedingAFNReport').subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+')
              const blob = data;
              this.pdfSrc = URL.createObjectURL(data);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "IncreaseInCustomerTransactionsReport") {
          this.apiService.reportV2('IncreaseInCustomerTransactionsReport').subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+')
              const blob = data;
              this.pdfSrc = URL.createObjectURL(data);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "FrequentSmallDepositTransactions") {
          this.apiService.reportV2('FrequentSmallDepositTransactions').subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+')
              const blob = data;
              this.pdfSrc = URL.createObjectURL(data);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "MultipleSmallWithdrawalsReport") {
          this.apiService.reportV2('MultipleSmallWithdrawalsReport').subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+')
              const blob = data;
              this.pdfSrc = URL.createObjectURL(data);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "OverTheLimitTransactionReport") {
          this.apiService.reportV2('OverTheLimitTransactionReport').subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+')
              const blob = data;
              this.pdfSrc = URL.createObjectURL(data);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "ChangesInCustomerContactInformationReport") {
          this.showDate = true;
        }
        else if (res == "AuthorizedPartnerQuarterlyReport") {
          this.showDate = true;
          this.apiService.reportV2WithParams('AuthorizedPartnerQuarterlyReport', {}).subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
              this.pdfSrc = URL.createObjectURL(data);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "BalanceMovementReport") {
          this.showDate = true
        }
        else if (res == "BalanceBreakupReport") {
          this.showDate = true;
          this.apiService.reportV2WithParams('BalanceBreakupReport', {}).subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
              this.pdfSrc = URL.createObjectURL(data);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "BankAccountLinkageReport") {
          this.showDate = true;
        }
        else if (res == "CustomerRiskClassificationReportPeriodically") {
          this.showDate = true;
        }
        else if (res == "SuspiciousTransactionsReport") {
          this.showDate = true;
        }
        else if (res == "RegisteredReportBasedOnProfileAndProvince") {
          this.showDate = true;
        }
        else if (res == "AccountOpenedByIndividualWithHistoryOfFinancialCrimeReport") {
          this.apiService.reportV2('AccountOpenedByIndividualWithHistoryOfFinancialCrimeReport').subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
              this.pdfSrc = URL.createObjectURL(data);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "AuditTrailsReport") {
          this.apiService.reportV2('AuditTrailsReport').subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
              this.pdfSrc = URL.createObjectURL(data);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "SystemAccessControlsReport") {
          this.apiService.reportV2('SystemAccessControlsReport').subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
              this.pdfSrc = URL.createObjectURL(data);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "SystemDormentAccountsReport") {
          this.apiService.reportV2('SystemDormentAccountsReport').subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
              this.pdfSrc = URL.createObjectURL(data);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "InternationalandNationalRemittanceTransactionReport") {
          this.apiService.reportV2('InternationalandNationalRemittanceTransactionReport').subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
              this.pdfSrc = URL.createObjectURL(data);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "DataIntegrityandSecurity") {
          this.showDate = true;
        }
        else if (res == "OperationalReport") {
          this.apiService.reportV2('OperationalReport').subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
              this.pdfSrc = URL.createObjectURL(data);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "ComplianceReport") {
          this.apiService.reportV2('ComplianceReport').subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
              this.pdfSrc = URL.createObjectURL(data);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "TransactionWithAtomaPay") {
          this.showDate = true;
          // this.apiService.reportV2('TransactionWithAtomaPay').subscribe({
          // })
        }
        else if (res == "AdhocReport") {
          this.showDate = true
        }
        else if (res == "AutomatedAlertsandNotificationsReport") {
          this.apiService.reportV2('AutomatedAlertsandNotificationsReport').subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
              this.pdfSrc = URL.createObjectURL(data);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "AccessToTransactionDataReport") {
          this.showDate = true
        }
        else if (res == "TransactionSentToOrReceivedFromPoliticalExposedPersonReport") {
          this.apiService.reportV2('TransactionSentToOrReceivedFromPoliticalExposedPersonReport').subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
              this.pdfSrc = URL.createObjectURL(data);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        //new jasper
        else if (res == "AuthorizedAgentQuartelyReport") {
          let body = {
            user: 'CUSTOMER'
          }
          this.apiService.reportAccountHoldersWithHistoryOfFinancialCrime('AuthorizedAgentQuartelyReport', body).subscribe({
            // this.apiService.reportAccountHoldersWithHistoryOfFinancialCrime('AccountHoldersWithHistoryOfFinancialCrime', body).subscribe({
            next: (data: Blob) => {
              this.isLoading = false;
              console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+')
              const blob = data;
              this.pdfSrc = blob;
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "MostActiveUsersReport") {
          this.apiService.getReportData("MostActiveUserReport", {}).subscribe({
            next: (data: any) => {
              this.showDate = true;
              this.isLoading = false;
              this.routeName = 'MostActiveUsersReport';
              // this.walletToWalletReportData = data || [];
              this.agentSummaryReport = data || [];
              this.paginatedData = this.agentSummaryReport
              this.currentPage = 1;
              this.calculatePagination();
              this.cdr.detectChanges();
              this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + parseFloat(item?.credit_amount || '0');
              }, 0);

              this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + parseFloat(item?.debit_amount || '0');
              }, 0);

              this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
              }, 0);

              this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
              }, 0);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "UserwithMinimumSingleMonthlyTransactionReport") {
          this.showDate = true;
        }
        else if (res == "TransactionReportOnChannelUsage") {
          this.showDate = true;
        }
        else if (res == "BulkReversalReport") {
          this.showDate = true;
        }
        else if (res == "AllAccountActivityReport") {
          this.showDate = true;
        }
        else if (res == "ActiveUserBasedOnProvince") {
          this.apiService.getReportData("ActiveUserByProvinceBasedReport", {}).subscribe({
            next: (data: any) => {
              this.showDate = true;
              this.isLoading = false;
              this.routeName = 'ActiveUserBasedOnProvince';
              // this.walletToWalletReportData = data || [];
              this.agentSummaryReport = data || [];
              this.paginatedData = this.agentSummaryReport
              this.currentPage = 1;
              this.calculatePagination();
              this.cdr.detectChanges();
              this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + parseFloat(item?.credit_amount || '0');
              }, 0);

              this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + parseFloat(item?.debit_amount || '0');
              }, 0);

              this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
              }, 0);

              this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
              }, 0);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "RegisteredReportsBasedOnProfileAndProvince") {
          this.apiService.getReportData("RegisteredReportOnProfileProvince", {}).subscribe({
            next: (data: any) => {
              this.showDate = true;
              this.isLoading = false;
              this.routeName = 'RegisteredReportsBasedOnProfileAndProvince';
              // this.walletToWalletReportData = data || [];
              this.agentSummaryReport = data || [];
              this.paginatedData = this.agentSummaryReport
              this.currentPage = 1;
              this.calculatePagination();
              this.cdr.detectChanges();
              this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + parseFloat(item?.credit_amount || '0');
              }, 0);

              this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + parseFloat(item?.debit_amount || '0');
              }, 0);

              this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
              }, 0);

              this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
                return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
              }, 0);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        //new
        else if (res == "AgentSummaryReport") {
          this.showDate = true
          let data = {};
          this.isLoading = true;

          this.apiService
            .transactionReport("AgentSummaryReport", data)
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.agentSummaryReport = res
                this.calculatePagination();

              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        } else if (res == "CashInReport") {
          this.showDate = true;
        } else if (res == "CashOutReport") {
          this.showDate = true;
        }
        else if (res == "StockAccStatementReport") {
          this.showDate = true;
          let fromDate = this.dateForm.controls["fromDate"].value;
          let toDate = this.dateForm.controls["toDate"].value;
          let data = {
            FromDate: fromDate,
            ToDate: toDate,
            AccNo: this.dateForm.controls["accNo"].value
          };
          this.isLoading = true;

          this.apiService.transactionReport("StockAccStatementReport", data).subscribe({
            next: (res: any) => {
              this.isLoading = false;
              this.stockBatchReport = res
              this.agentSummaryReport = res
              this.calculatePagination();
              this.totalCredit = this.stockBatchReport.reduce((acc: number, item: any) => {
                return acc + parseFloat(item?.credit_amount || '0');
              }, 0);

              this.totalDebit = this.stockBatchReport.reduce((acc: number, item: any) => {
                return acc + parseFloat(item?.debit_amount || '0');
              }, 0);
              this.totalCreditCount = this.stockBatchReport.reduce((acc: number, item: any) => {
                // Only count if debit is 0 and credit is non-zero
                return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
              }, 0);

              this.totalDebitCount = this.stockBatchReport.reduce((acc: number, item: any) => {
                // Only count if credit is 0 and debit is non-zero
                return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
              }, 0);
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "EMoneyTransferReport") {
          this.showDate = true;
        } else if (res == "LCTR") {
          this.showDate = true

        } else if (res == "SalesTrendReport") {
          this.showDate = true
          let data = {};
          this.isLoading = true;

          this.apiService.transactionReport("SalesTrendReport", data).subscribe({
            next: (res: any) => {
              this.isLoading = false;
              this.salesTrendReport = res
              this.agentSummaryReport = res
              this.calculatePagination();
              this.totalCredit = this.salesTrendReport.reduce((acc: number, item: any) => {
                return acc + parseFloat(item?.credit_amount || '0');
              }, 0);

              this.totalDebit = this.salesTrendReport.reduce((acc: number, item: any) => {
                return acc + parseFloat(item?.debit_amount || '0');
              }, 0);
              this.totalCreditCount = this.salesTrendReport.reduce((acc: number, item: any) => {
                // Only count if debit is 0 and credit is non-zero
                return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
              }, 0);

              this.totalDebitCount = this.salesTrendReport.reduce((acc: number, item: any) => {
                // Only count if credit is 0 and debit is non-zero
                return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
              }, 0);
            },
            error: () => {
              this.isLoading = false;

              alert("Error Try Again");
            },
          });
        } else if (res == "BeginningBalanceReport") {
          this.showDate = true
          let data = {};
          this.isLoading = true;

          this.apiService
            .transactionReport("BeginningBalanceReport", data)
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.beginningBalanceReport = res
                this.agentSummaryReport = res
                this.calculatePagination();
                this.totalCredit = this.beginningBalanceReport.reduce((acc: number, item: any) => {
                  return acc + parseFloat(item?.total_deposited || '0');
                }, 0);

                this.totalDebit = this.beginningBalanceReport.reduce((acc: number, item: any) => {
                  return acc + parseFloat(item?.total_withdrawn || '0');
                }, 0);
                this.totalCreditCount = this.beginningBalanceReport.reduce((acc: number, item: any) => {
                  // Only count if debit is 0 and credit is non-zero
                  return acc + (parseFloat(item?.total_withdrawn) === 0 && parseFloat(item?.total_deposited) !== 0 ? 1 : 0);
                }, 0);

                this.totalDebitCount = this.beginningBalanceReport.reduce((acc: number, item: any) => {
                  // Only count if credit is 0 and debit is non-zero
                  return acc + (parseFloat(item?.total_deposited) === 0 && parseFloat(item?.total_withdrawn) !== 0 ? 1 : 0);
                }, 0);
              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        } else if (res == "DirectBankingCashFlowReport") {
          let data = {};
          this.isLoading = true;

          this.apiService
            .transactionReport("DirectBankingCashFlowReport", data)
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;

                const blob = res;
                this.pdfSrc = blob;
              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        } else if (res == "ProfitabilityReport") {
          let data = {};
          this.isLoading = true;

          this.apiService
            .transactionReport("ProfitabilityReport", data)
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.profitabilityReport = res
                this.agentSummaryReport = res
                this.calculatePagination();
                this.totalCredit = this.profitabilityReport.reduce((acc: number, item: any) => {
                  return acc + parseFloat(item?.credit_amount || '0');
                }, 0);

                this.totalDebit = this.profitabilityReport.reduce((acc: number, item: any) => {
                  return acc + parseFloat(item?.debit_amount || '0');
                }, 0);
                this.totalCreditCount = this.profitabilityReport.reduce((acc: number, item: any) => {
                  // Only count if debit is 0 and credit is non-zero
                  return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
                }, 0);

                this.totalDebitCount = this.profitabilityReport.reduce((acc: number, item: any) => {
                  // Only count if credit is 0 and debit is non-zero
                  return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
                }, 0);
              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        } else if (res == "ActiveBasedReport") {
          let data = {};
          this.isLoading = true;

          this.apiService
            .transactionReport("ActiveBasedReport", data)
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.profitabilityReport = res
                this.agentSummaryReport = res
                this.calculatePagination();

              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        } else if (res == "InActiveBasedReport") {
          let data = {};
          this.isLoading = true;

          this.apiService
            .transactionReport("InActiveBasedReport", data)
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.profitabilityReport = res
                this.agentSummaryReport = res
                this.calculatePagination();

              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        } else if (res == "SuspendAccountReport") {
          let data = {};
          this.isLoading = true;

          this.apiService
            .transactionReport("SuspendAccountReport", data)
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.profitabilityReport = res
                this.agentSummaryReport = res
                this.calculatePagination();

              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        } else if (res == "LockAccountReport") {
          let data = {};
          this.isLoading = true;

          this.apiService
            .transactionReport("LockAccountReport", data)
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.profitabilityReport = res
                this.agentSummaryReport = res
                this.calculatePagination();

              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        } else if (res == "LowBalDataReport") {
          let data = {};
          this.isLoading = true;

          this.apiService
            .getLowBalDataReport()
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.profitabilityReport = res
                this.agentSummaryReport = res
                this.calculatePagination();

              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        }
        else if (res == "StatementOfCashFlow") {
          this.showDate = true;
          // let fromDate = this.dateForm.controls["fromDate"].value;
          // let toDate = this.dateForm.controls["toDate"].value;
          //  let data = {
          //   fromDate: fromDate,
          //   toDate: toDate,
          // };
          // this.isLoading = true;
          // console.log(data,"StatementOfCashFlow data");
          // this.apiService
          //   .transactionReport("StatementOfCashFlow", data)
          //   .subscribe({
          //     next: (res: any) => {
          //       this.isLoading = false;
          //       this.batchReport = res
          //       this.agentSummaryReport = res
          //       this.calculatePagination();
          //       this.totalCredit = this.batchReport.reduce((acc: number, item: any) => {
          //         return acc + parseFloat(item?.credit || '0');
          //       }, 0);

          //       this.totalDebit = this.batchReport.reduce((acc: number, item: any) => {
          //         return acc + parseFloat(item?.debit || '0');
          //       }, 0);
          //       this.totalCreditCount = this.batchReport.reduce((acc: number, item: any) => {
          //         // Only count if debit is 0 and credit is non-zero
          //         return acc + (parseFloat(item?.debit) === 0 && parseFloat(item?.credit) !== 0 ? 1 : 0);
          //       }, 0);

          //       this.totalDebitCount = this.batchReport.reduce((acc: number, item: any) => {
          //         // Only count if credit is 0 and debit is non-zero
          //         return acc + (parseFloat(item?.credit) === 0 && parseFloat(item?.debit) !== 0 ? 1 : 0);
          //       }, 0);
          //     },
          //     error: () => {
          //       this.isLoading = false;
          //       alert("Error Try Again");
          //     },
          //   });
        }
        else if (res == "CorporateCustomerReport") {
          this.showDate = true

          let data = {};
          this.isLoading = true;

          this.apiService
            .transactionReport("CorporateCustomerReport", data)
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.agentSummaryReport = res
                this.calculatePagination();
              },
              error: () => {
                this.isLoading = false;
                alert("Error Try Again");
              },
            });
        } else if (res == "BreshnaReconcilitationReport") {
          let data = {};
          this.isLoading = true;

          this.apiService
            .transactionReport("BreshnaReconcilitationReport", data)
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;

                const blob = res;
                this.pdfSrc = blob;
              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        } else if (res == "CustomerSummaryReport") {
          this.showDate = true

          let data = {};
          this.isLoading = true;

          this.apiService
            .transactionReport("CustomerSummaryReport", data)
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.agentSummaryReport = res
                this.calculatePagination();
              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        } else if (res == "SalesVolumeByAgents") {
          let data = {};
          this.isLoading = true;

          this.apiService
            .transactionReport("SalesVolumeByAgents", data)
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.salesVolumeByAgents = res
                this.agentSummaryReport = res
                this.calculatePagination();
              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        } else if (res == "BankReconcilitationReport") {
          this.showDate = true
          let data = {};
          this.isLoading = true;

          this.apiService
            .transactionReport("BankReconcilitationReport", data)
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.cashINReport = res
                this.agentSummaryReport = res
                this.calculatePagination();
              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        } else if (res == "SalesVolumeByChannel") {
          this.showDate = true
          let data = {};
          this.isLoading = true;

          this.apiService
            .transactionReport("SalesVolumeByChannel", data)
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.salesVolumeByChannel = res
                this.agentSummaryReport = res
                this.calculatePagination();
              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        } else if (res == "AccStatementReport") {
          this.showDate = true;
        } else if (res == "ReversalReoport") {
          this.showDate = true;
        }

        else if (res == "BankReport") {
          this.showDate = true;
          let fromDate = this.dateForm.controls["fromDate"].value;
          let toDate = this.dateForm.controls["toDate"].value;
          let data = {
            FromDate: fromDate,
            ToDate: toDate,
          };
          this.isLoading = true;

          this.apiService.transactionReport("BankReport", data).subscribe({
            next: (res: any) => {
              this.isLoading = false;
              const blob = res;
              this.pdfSrc = blob;
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        } else if (res == "KYCReport") {
          this.showDate = true;
          let fromDate = this.dateForm.controls["fromDate"].value;
          let toDate = this.dateForm.controls["toDate"].value;
          let data = {
            fromDate: `${fromDate}T00:00:00`,
            toDate: `${toDate}T14:31:56`,
            page: 0,
          };
          this.isLoading = true;

          this.apiService.getKYCReport(data).subscribe({
            next: (res: any) => {
              this.isLoading = false;
              if (res?.responseCode == 200) {
                this.allData = res?.data
              } else {
                this.isLoading = false;
              }
            },
            error: () => {
              this.isLoading = false;
              alert("Error Try Again");
            },
          });
        }
        else if (res == "AirtimeReconciliationReport") {
          this.showDate = true;
        }

        else if (res == "FinancialConsolidatedReport") {
          let data = {};
          this.isLoading = true;

          this.apiService
            .transactionReport("FinancialConsolidatedReport", data)
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.financialConsolidatedReport = res
                this.agentSummaryReport = res
                this.calculatePagination();
              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        }

        else if (res == "RefundReport") {
          this.showDate = true;
          let fromDate = this.dateForm.controls["fromDate"].value;
          let toDate = this.dateForm.controls["toDate"].value;
          let data = {
            FromDate: fromDate,
            ToDate: toDate,
          };
          this.isLoading = true;

          this.apiService
            .transactionReport("RefundReport", data)
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.refundReport = res
                this.agentSummaryReport = res
                this.calculatePagination();
              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        }
        else if (res == "BillPaymentReport") {
          this.showDate = true;
          let fromDate = this.dateForm.controls["fromDate"].value;
          let toDate = this.dateForm.controls["toDate"].value;
          let data = {
            FromDate: fromDate,
            ToDate: toDate,
          };
          this.isLoading = true;

          this.apiService
            .transactionReport("BillPaymentReport", data)
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.cashINReport = res
                this.agentSummaryReport = res
                this.calculatePagination();
              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        }
        else if (res == "MyMoneyStatement") {
          this.showDate = true;
          let fromDate = this.dateForm.controls["fromDate"].value;
          let toDate = this.dateForm.controls["toDate"].value;
          let data = {
            FromDate: fromDate,
            ToDate: toDate,
          };
          this.isLoading = true;

          this.apiService
            .transactionReport("MyMoneyStatement", data)
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.cashINReport = res
                this.agentSummaryReport = res
                this.calculatePagination();
                this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                  return acc + parseFloat(item?.credit || '0');
                }, 0);

                this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                  return acc + parseFloat(item?.debit || '0');
                }, 0);
                this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
                  // Only count if debit is 0 and credit is non-zero
                  return acc + (parseFloat(item?.debit) === 0 && parseFloat(item?.credit) !== 0 ? 1 : 0);
                }, 0);

                this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
                  // Only count if credit is 0 and debit is non-zero
                  return acc + (parseFloat(item?.credit) === 0 && parseFloat(item?.debit) !== 0 ? 1 : 0);
                }, 0);
              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        } else if (res == "AggregateVolAndValTransaction") {
          this.showDate = true;
          let fromDate = this.dateForm.controls["fromDate"].value;
          let toDate = this.dateForm.controls["toDate"].value;
          let data = {
            FromDate: fromDate,
            ToDate: toDate,
          };
          this.isLoading = true;

          this.apiService
            .transactionReport("AggregateVolAndValTransaction", data)
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.cashINReport = res
                this.agentSummaryReport = res
                this.calculatePagination();
                this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                  return acc + Number(item?.total_credit || 0);
                }, 0);

                this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                  return acc + Number(item?.total_debit || 0);
                }, 0);

              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        }

        else if (res == "TokenPaymentReport") {
          this.showDate = true;
        }
        else if (res == "TokenTransactionReport") {
          this.showDate = true;
        }
        else if (res == "TokenUnredeemedReport") {
          this.showDate = true;
        }
        else if (res == "TokenWithdrawalReport") {
          this.showDate = true;
        }
        else if (res == "FloatVsWalletReconciliation") {
          console.log('+_+_+_+_+_++_+_+_+_+')
          this.showDate = true;
          let toDateValue = this.dateForm.controls["toDate"].value;
          let toDate: any;
          if (toDateValue) {
            const date = new Date(toDateValue);
            date.setDate(date.getDate() + 1);

            toDate = date.toISOString().split('T')[0];
            console.log(toDate);
          }

          let dateData = {
            ToDate: `${toDate} 00:00:00`,
          };
          this.isLoading = true;
          this.apiService.transactionReport("FloatAccountReport", dateData).subscribe({
            next: (floatRes: any) => {
              if (floatRes) {
                this.isLoading = false;
                this.floatAccounts = floatRes; // ✅ separate array
                this.totalFloatCredit = this.floatAccounts.reduce((acc: number, item: any) => acc + Number(item?.total_credit || 0), 0);
                this.totalFloatDebit = this.floatAccounts.reduce((acc: number, item: any) => acc + Number(item?.total_debit || 0), 0);
                this.totalFloatBalance = Number(this.totalFloatCredit) - Number(this.totalFloatDebit);
              }
              this.isLoading = true;
              this.apiService.transactionReport("WalletBalanceReport", dateData).subscribe({
                next: (walletRes: any) => {
                  if (walletRes) {
                    this.isLoading = false;
                    this.walletAccounts = walletRes; // ✅ separate array
                    this.totalWalletCredit = this.walletAccounts.reduce((acc: number, item: any) => acc + Number(item?.total_credit || 0), 0);
                    this.totalWalletDebit = this.walletAccounts.reduce((acc: number, item: any) => acc + Number(item?.total_debit || 0), 0);
                    this.totalWalletBalance = Number(this.totalWalletCredit) - Number(this.totalWalletDebit);
                    this.isLoading = false;
                    this.netSettlementDifference = Math.abs(Number(this.totalFloatBalance)) - Math.abs(Number(this.totalWalletBalance));
                  }
                },
                error: () => {
                  this.isLoading = false;
                  alert("Error fetching WalletBalanceReport");
                },
              });
            },
            error: () => {
              this.isLoading = false;
              alert("Error fetching FloatAccountReport");
            },
          });

        }
        else if (res == "EMoneyTransactionReport") {
          // EMoneyTransactionReport
          this.showDate = true;
          // this.isLoading = true;
          let fromDate = this.dateForm.controls["fromDate"].value;
          let toDate = this.dateForm.controls["toDate"].value;
          this.apiService.EmoneyTransReport(fromDate, toDate).subscribe({
            next: (res: any) => {
              this.agentSummaryReport = res?.data || [];
              console.log('EMoneyTransactionReport data:', this.agentSummaryReport);
            },
            error: () => {
              this.isLoading = false;
              alert("Error fetching EMoneyTransactionReport");
            },
          });
        }

        else if (res == "IncomeProductReport") {

        } else if (res == "FloatAccMovement") {
          this.showDate = true;
          this.apiService
            .getIncomeAcc('getFloatAcc').subscribe({
              next: (res: any) => {
                if (res?.responseCode == 200) {
                  this.incomeProdAccount = res?.data
                } else {
                  alert(res?.error)
                }
              }, error: () => {
                alert("Error Try Again");
              },
            })
        } else if (res == "IncomeReport") {
          this.showDate = true;
          let fromDate = this.dateForm.controls["fromDate"].value;
          let toDate = this.dateForm.controls["toDate"].value;
          let data = {
            FromDate: fromDate,
            ToDate: toDate,
          };
          this.isLoading = true;

          this.apiService
            .transactionReport("IncomeReport", data)
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.cashINReport = res
                this.agentSummaryReport = res
                this.calculatePagination();
                this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                  return acc + parseFloat(item?.credit_amount || '0');
                }, 0);

                this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                  return acc + parseFloat(item?.debit_amount || '0');
                }, 0);
                this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
                  // Only count if debit is 0 and credit is non-zero
                  return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
                }, 0);

                this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
                  // Only count if credit is 0 and debit is non-zero
                  return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
                }, 0);
              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        } else if (res == "TopupInventoryReport") {
          this.showDate = true;
          let fromDate = this.dateForm.controls["fromDate"].value;
          let toDate = this.dateForm.controls["toDate"].value;
          let data = {
            FromDate: fromDate,
            ToDate: toDate,
          };
          this.isLoading = true;

          this.apiService
            .transactionReport("TopupInventoryReport", data)
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.cashINReport = res
                this.agentSummaryReport = res
                this.calculatePagination();
                this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                  return acc + parseFloat(item?.credit || '0');
                }, 0);

                this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                  return acc + parseFloat(item?.debit || '0');
                }, 0);
                this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
                  // Only count if debit is 0 and credit is non-zero
                  return acc + (parseFloat(item?.debit) === 0 && parseFloat(item?.credit) !== 0 ? 1 : 0);
                }, 0);

                this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
                  // Only count if credit is 0 and debit is non-zero
                  return acc + (parseFloat(item?.credit) === 0 && parseFloat(item?.debit) !== 0 ? 1 : 0);
                }, 0);
              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        } else if (res == "VoiceDtaBundleActivationReport") {
          this.showDate = true;
          let fromDate = this.dateForm.controls["fromDate"].value;
          let toDate = this.dateForm.controls["toDate"].value;
          let data = {
            FromDate: fromDate,
            ToDate: toDate,
          };
          this.isLoading = true;

          this.apiService
            .transactionReport("VoiceDtaBundleActivationReport", data)
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.cashINReport = res
                this.agentSummaryReport = res
                this.calculatePagination();
                this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                  return acc + parseFloat(item?.credit || '0');
                }, 0);

                this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
                  return acc + parseFloat(item?.debit || '0');
                }, 0);
                this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
                  // Only count if debit is 0 and credit is non-zero
                  return acc + (parseFloat(item?.debit) === 0 && parseFloat(item?.credit) !== 0 ? 1 : 0);
                }, 0);

                this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
                  // Only count if credit is 0 and debit is non-zero
                  return acc + (parseFloat(item?.credit) === 0 && parseFloat(item?.debit) !== 0 ? 1 : 0);
                }, 0);
              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        }
        else if (res == "AubBalance") {
          this.isLoading = true;
          this.apiService
            .getServicesBasedData("getAubBalance")
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.aubData = [res?.data]
                this.agentSummaryReport = [res?.data]
                this.calculatePagination();
              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        } else if (res == "GBBalance") {
          this.isLoading = true;
          this.apiService
            .getServicesBasedData("getGBBalance")
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.aubData = [res?.data]
                this.agentSummaryReport = [res?.data]
                this.calculatePagination();
              },
              error: () => {
                this.isLoading = false;

                alert("Error Try Again");
              },
            });
        } else if (res == "AwccReconcileReport") {
          this.isLoading = true;
          this.apiService
            .getServicesBasedData("getAwccReconcileReport")
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.aubData = [res?.data]
                this.agentSummaryReport = [res?.data]
                this.calculatePagination();
              },
              error: () => {
                this.isLoading = false;
                alert("Error Try Again");
              },
            });
        } else if (res == "ActiveServiceReconcileReport") {
          this.isLoading = true;
          this.apiService
            .getServicesBasedData("getActiveServiceReconcileReport")
            .subscribe({
              next: (res: any) => {
                this.isLoading = false;
                this.aubData = [res?.data]
                this.agentSummaryReport = [res?.data]
                this.calculatePagination();
              },
              error: () => {
                this.isLoading = false;
                alert("Error Try Again");
              },
            });
        } else if (res == "rolePermissionAudit") {
          this.readCsvFile('/assets/audit-trail/role_management_audit_log.csv');
        } else if (res == "transactionStatusChangeAudit") {
          this.readCsvFile('/assets/audit-trail/transaction_audit_log.csv');
        } else if (res == "customerProfileAuditTrail") {
          this.readCsvFile('/assets/audit-trail/user_profile_audit_log.csv');
        } else if (res == "userLoginAuditTrail") {
          this.readExcelFile('/assets/audit-trail/login_audit_log.xlsx');
        }
      });



    // LCTR Report Date Config:
    if (this.routeName === 'LctrView') {

    }






    //---------------------------------------------------------------------------------------//
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "Report Management") {
          if (this.routeName == 'BalanceSheet') {
            if (item.subComponent?.subComponentName == "Balance Sheet"
            ) {
              this.subagentPrivilege = item;
              console.log(this.subagentPrivilege, 'AccStatement');

            }
          } else if (this.routeName == 'AccStatementReport') {
            if (item.subComponent?.subComponentName == "AccStatement Report"
            ) {
              this.subagentPrivilege = item;

            }
          }
          else if (this.routeName == 'ReversalReoport') {
            if (item.subComponent?.subComponentName == "AccStatement With Reversal Report"
            ) {
              this.subagentPrivilege = item;

            }
          }
          else if (this.routeName == 'TransactionSummaryReport') {
            if (item.subComponent?.subComponentName == "TransactionSummary Report"
            ) {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'StockAccStatementReport') {
            if (item.subComponent?.subComponentName == "AccStatement Report"
            ) {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'BatchReport') {
            if (item.subComponent?.subComponentName == "Batch Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'RefundReport') {
            if (item.subComponent?.subComponentName == "Refund Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'ProfitAndLossReport') {
            if (item.subComponent?.subComponentName == "ProfitAndLoss Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'BreshnaReconcilitationReport') {
            if (item.subComponent?.subComponentName == "BreshnaReconcilitation Report"
            ) {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'KYCReport') {
            if (item.subComponent?.subComponentName == "KYC Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'AgentLiquidityReport') {
            if (item.subComponent?.subComponentName == "AgentLiquidity Report"
            ) {
              this.subagentPrivilege = item;
            }
          }
          //new
          else if (this.routeName == 'MerchantToAgentReport') {
            if (item.subComponent?.subComponentName == "Merchant to Agent Transaction Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'WalletToWalletReport') {
            if (item.subComponent?.subComponentName == "Wallet to Wallet Transaction Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'FailedTransactionReport') {
            if (item.subComponent?.subComponentName == "Failed Transaction Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'AuthorizedAgentQuartelyReport') {
            if (item.subComponent?.subComponentName == "Authorized AgentQuartely Report") {
              this.subagentPrivilege = item;
            }
          }
          //new
          else if (this.routeName == 'AccountHoldersWithHistoryOfFinancialCrime') {
            if (item.subComponent?.subComponentName == "AccountHolders With History Of Financial Crime Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'DetailedTransactionProvinceWise') {
            if (item.subComponent?.subComponentName == "Detailed Transaction Province Wise Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'WrongAttemptUsersReport') {
            if (item.subComponent?.subComponentName == "Wrong Attempt Users Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'LargeDepositMoreAFNFollowedByRapidWithdrawals') {
            if (item.subComponent?.subComponentName == "Large Deposit More AFN Followed By Rapid Withdrawals Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'MultipleWithdrawalsAfterLargeDepositReport') {
            if (item.subComponent?.subComponentName == "Multiple Withdrawals After Large Deposit Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'RejectedAccounts') {
            if (item.subComponent?.subComponentName == "Rejected Accounts Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'AuthorizedMerchantReport') {
            if (item.subComponent?.subComponentName == "Authorized Merchant Quarterly Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'ActiveUserWithMinimumOneTrxnMonthlyReport') {
            if (item.subComponent?.subComponentName == "Active User With Minimum One Trxn Monthly Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'TransactionsUnusualTiming') {
            if (item.subComponent?.subComponentName == "Transactions Unusual Timing Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'AllLoyaltyReports') {
            if (item.subComponent?.subComponentName == "All Loyalty Reports") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'RejectedTransactions') {
            if (item.subComponent?.subComponentName == "Rejected Transactions Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'ActiveUserByProvinceBasedReportByProvince') {
            if (item.subComponent?.subComponentName == "Active User Based Report By Province") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'AccountOpenAndActiveWithNoDepositReport') {
            if (item.subComponent?.subComponentName == "Account Open And Active With No Deposit Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'AccountsOpenedWithMinimalInformationReport') {
            if (item.subComponent?.subComponentName == "Accounts Opened With Minimal Information Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'CashTransactionsExceedingAFNReport') {
            if (item.subComponent?.subComponentName == "Cash Transactions Exceeding AFN Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'IncreaseInCustomerTransactionsReport') {
            if (item.subComponent?.subComponentName == "Increase In Customer Transactions Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'FrequentSmallDepositTransactions') {
            if (item.subComponent?.subComponentName == "Frequent Small Deposit Transactions Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'MultipleSmallWithdrawalsReport') {
            if (item.subComponent?.subComponentName == "Multiple Small Withdrawals Between AFN Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'OverTheLimitTransactionReport') {
            if (item.subComponent?.subComponentName == "Over The Limit Transactions Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'ChangesInCustomerContactInformationReport') {
            if (item.subComponent?.subComponentName == "Changes In Customer Contact Information Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'AuthorizedPartnerQuarterlyReport') {
            if (item.subComponent?.subComponentName == "Authorized Partner Quarterly Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'BalanceMovementReport') {
            if (item.subComponent?.subComponentName == "Balance Movement Report") {
              this.subagentPrivilege = item;
            }
          }

          else if (this.routeName == 'BalanceBreakupReport') {
            if (item.subComponent?.subComponentName == "Balance Breakup Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'BankAccountLinkageReport') {
            if (item.subComponent?.subComponentName == "Bank Account Linkage Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'CustomerRiskClassificationReportPeriodically') {
            if (item.subComponent?.subComponentName == "Customer Risk Classificiation Report Periodically") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'ActiveUserReport') {
            if (item.subComponent?.subComponentName == "Active User Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'SuspiciousTransactionsReport') {
            if (item.subComponent?.subComponentName == "Suspicious Transactions Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'RegisteredReportBasedOnProfileAndProvince') {
            if (item.subComponent?.subComponentName == "Registered Report Based On Profile And Province") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'AccountOpenedByIndividualWithHistoryOfFinancialCrimeReport') {
            if (item.subComponent?.subComponentName == "Account Opened By Individual With History Of Financial Crime Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'AuditTrailsReport') {
            if (item.subComponent?.subComponentName == "Audit Trails Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'SystemAccessControlsReport') {
            if (item.subComponent?.subComponentName == "System Access Controls Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'SystemDormentAccountsReport') {
            if (item.subComponent?.subComponentName == "System Dorment Accounts Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'InternationalandNationalRemittanceTransactionReport') {
            if (item.subComponent?.subComponentName == "International And National Remittance Transaction Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'DataIntegrityandSecurity') {
            if (item.subComponent?.subComponentName == "Data Integrity and Security Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'OperationalReport') {
            if (item.subComponent?.subComponentName == "Operational Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'ComplianceReport') {
            if (item.subComponent?.subComponentName == "Compliance Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'TransactionWithAtomaPay') {
            if (item.subComponent?.subComponentName == "Transaction With Atoma Pay"
            ) {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'AdhocReport') {
            if (item.subComponent?.subComponentName == "Adhoc Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'AutomatedAlertsandNotificationsReport') {
            if (item.subComponent?.subComponentName == "Automated Alerts and Notifications Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'AccessToTransactionDataReport') {
            if (item.subComponent?.subComponentName == "Access To Transaction Data Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'TransactionSentToOrReceivedFromPoliticalExposedPersonReport') {
            if (item.subComponent?.subComponentName == "Transaction Sent To Or Received From Political Exposed Person Report") {
              this.subagentPrivilege = item;
            }
          }

          else if (this.routeName == 'PullTransactionReport') {
            if (item.subComponent?.subComponentName == "Pull Transaction Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'PushTransactionReport') {
            if (item.subComponent?.subComponentName == "Push Transaction Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'AggregateBalanceReport') {
            if (item.subComponent?.subComponentName == "Aggregate Balance Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'BankTransactionReport') {
            if (item.subComponent?.subComponentName == "Bank Transaction Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'SuspenseAccountTransactionReport') {
            if (item.subComponent?.subComponentName == "Suspense Account Transaction Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'TopUpDetailsTransactionReportByChannel') {
            if (item.subComponent?.subComponentName == "TopUp Details Transaction Report By Channel") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'ApprovedKycReport') {
            if (item.subComponent?.subComponentName == "Approved KYC Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'MostActiveUsersReport') {
            if (item.subComponent?.subComponentName == "Most Active Users Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'UserwithMinimumSingleMonthlyTransactionReport') {
            if (item.subComponent?.subComponentName == "User with Minimum Single Monthly Transaction Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'TransactionReportOnChannelUsage') {
            if (item.subComponent?.subComponentName == "Transaction Report On Channel Usage") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'BulkReversalReport') {
            if (item.subComponent?.subComponentName == "Bulk Reversal Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'AllAccountActivityReport') {
            if (item.subComponent?.subComponentName == "All Account Activity Report") {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'ActiveUserBasedOnProvince') {
            if (item.subComponent?.subComponentName == "Active User Based On Province") {
              this.subagentPrivilege = item;
              console.log(this.subagentPrivilege, 'subagentPrivilege ActiveUserBasedOnProvince');
            }
          }
          else if (this.routeName == 'RegisteredReportsBasedOnProfileAndProvince') {
            if (item.subComponent?.subComponentName == "Registered Reports Based On Profile And Province") {
              this.subagentPrivilege = item;
              console.log(this.subagentPrivilege, 'subagentPrivilege RegisteredReportsBasedOnProfileAndProvince');
            }
          }
          //new
          else if (this.routeName == 'AgentSummaryReport') {
            if (item.subComponent?.subComponentName == "AgentSummary Report"
            ) {
              this.subagentPrivilege = item;
              console.log(this.subagentPrivilege, 'AccStatement');

            }
          } else if (this.routeName == 'CashInReport') {
            if (item.subComponent?.subComponentName == "CashIn Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'CashOutReport') {
            if (item.subComponent?.subComponentName == "CashOut Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'EMoneyTransferReport') {
            if (item.subComponent?.subComponentName == "EMoneyTransfer Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'LCTR') {
            if (item.subComponent?.subComponentName == "LCTR Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'SalesTrendReport') {
            if (item.subComponent?.subComponentName == "SalesTrend Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'StockBatchReport') {
            if (item.subComponent?.subComponentName == "StockBatch Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'ProfitabilityReport') {
            if (item.subComponent?.subComponentName == "Profitability Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'CorporateCustomerReport') {
            if (item.subComponent?.subComponentName == "CorporateSummary Report"
            ) {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'StatementOfCashFlow') {
            if (item.subComponent?.subComponentName == "CorporateSummary Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'CustomerSummaryReport') {
            if (item.subComponent?.subComponentName == "CustomerSummary Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'SalesVolumeByAgents') {
            if (item.subComponent?.subComponentName == "SalesVolumeByAgents Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'SalesVolumeByChannel') {
            if (item.subComponent?.subComponentName == "SalesVolumeByChannel Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'BankReconcilitationReport') {
            if (item.subComponent?.subComponentName == "BankReconcilitation Report"
            ) {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'BankReport') {
            if (item.subComponent?.subComponentName == "Bank Report"
            ) {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'ActiveServiceReconcileReport') {
            if (item.subComponent?.subComponentName == "ActiveService Reconciliation Report"
            ) {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'AirtimeReconciliationReport') {
            if (item.subComponent?.subComponentName == "AirtimeReconciliation Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'BeginningBalanceReport') {
            if (item.subComponent?.subComponentName == "BeginningBalance Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'BillPaymentReport') {
            if (item.subComponent?.subComponentName == "BillPayment Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'QuarterlyProfitAndLoss') {
            if (item.subComponent?.subComponentName == "QuarterlyProfitAndLoss Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'MonthlyBalanceReport') {
            if (item.subComponent?.subComponentName == "MonthlyBalance Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'MonthlyProfitAndLoss') {
            if (item.subComponent?.subComponentName == "MonthlyProfitAndLoss Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'FinancialConsolidatedReport') {
            if (item.subComponent?.subComponentName == "FinancialConsolidated Report"
            ) {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'DirectBankingCashFlowReport') {
            if (item.subComponent?.subComponentName == "DirectBankingCashFlow Report"
            ) {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'AgentReconcilationReport') {
            if (item.subComponent?.subComponentName == "AgentReconcilation Report"
            ) {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'AubBalance') {
            if (item.subComponent?.subComponentName == "AubBalance Report"
            ) {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'GBBalance') {
            if (item.subComponent?.subComponentName == "GBBalance Report"
            ) {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'AwccReconcileReport') {
            if (item.subComponent?.subComponentName == "Awcc Reconciliation Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'MyMoneyStatement') {
            if (item.subComponent?.subComponentName == "MyMoney Statement Report"
            ) {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'AggregateVolAndValTransaction') {
            if (item.subComponent?.subComponentName == "Aggregate Volume And Value Transaction Report"
            ) {
              this.subagentPrivilege = item;
            }

          }

          else if (this.routeName == 'TokenPaymentReport') {
            if (item.subComponent?.subComponentName == "Token Payment Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'TokenTransactionReport') {
            if (item.subComponent?.subComponentName == "Token Transaction Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'TokenUnredeemedReport') {
            if (item.subComponent?.subComponentName == "Token Unredeemed Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'TokenWithdrawalReport') {
            if (item.subComponent?.subComponentName == "Token Withdrawal Report"
            ) {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'FloatVsWalletReconciliation') {
            if (item.subComponent?.subComponentName == "Float Vs Wallet Reconciliation Report"
            ) {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'EMoneyTransactionReport') {
            if (item.subComponent?.subComponentName == "E Money Transaction Report"
            ) {
              this.subagentPrivilege = item;
            }
          }

          else if (this.routeName == 'IncomeProductReport') {
            if (item.subComponent?.subComponentName == "Income Product Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'IncomeReport') {
            if (item.subComponent?.subComponentName == "Aggregate Volume And Value Transaction Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'TopupInventoryReport') {
            if (item.subComponent?.subComponentName == "Aggregate Volume And Value Transaction Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'VoiceDtaBundleActivationReport') {
            if (item.subComponent?.subComponentName == "Voice Data Bundle Activation Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'FloatAccMovement') {
            if (item.subComponent?.subComponentName == "Aggregate Volume And Value Transaction Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'ActiveBasedReport') {
            if (item.subComponent?.subComponentName == "ActiveBased Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'InActiveBasedReport') {
            if (item.subComponent?.subComponentName == "InActive Based Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'SuspendAccountReport') {
            if (item.subComponent?.subComponentName == "Suspended Account Report"
            ) {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'LockAccountReport') {
            if (item.subComponent?.subComponentName == "Lock Account Report"
            ) {
              this.subagentPrivilege = item;
            }
          } else if (this.routeName == 'LowBalDataReport') {
            if (item.subComponent?.subComponentName == "Low Balance Alert Report"
            ) {
              this.subagentPrivilege = item;
            }
          }
          else if (this.routeName == 'LctrView') {
            if (item.subComponent?.subComponentName == "LCTR Report"
            ) {
              this.subagentPrivilege = item;
            }
          }
        } else if (item?.component?.componentName == "Audit Logs") {
          if (this.routeName == 'userLoginAuditTrail') {
            if (item.subComponent?.subComponentName == "User Login Audit Trail"
            ) {
              this.subagentPrivilege = item;
            }
          }
          if (this.routeName == 'customerProfileAuditTrail') {
            if (item.subComponent?.subComponentName == "Customer Profile Audit Trail"
            ) {
              this.subagentPrivilege = item;
            }
          }
          if (this.routeName == 'walletTransactionAuditTrail') {
            if (item.subComponent?.subComponentName == "Wallet Transaction Audit Trail"
            ) {
              this.subagentPrivilege = item;
            }
          }
          if (this.routeName == 'transactionStatusChangeAudit') {
            if (item.subComponent?.subComponentName == "Transaction Status Change Audit"
            ) {
              this.subagentPrivilege = item;
            }
          }
          if (this.routeName == 'rolePermissionAudit') {
            if (item.subComponent?.subComponentName == "Role & Permission Audit"
            ) {
              this.subagentPrivilege = item;
            }
          }
          if (this.routeName == 'limitChangeAudit') {
            if (item.subComponent?.subComponentName == "Limit Change Audit"
            ) {
              this.subagentPrivilege = item;
            }
          } if (this.routeName == 'kycAuditReport') {
            if (item.subComponent?.subComponentName == "KYC Audit Report"
            ) {
              this.subagentPrivilege = item;
            }
          } if (this.routeName == 'amlScreeningAudit') {
            if (item.subComponent?.subComponentName == "AML Screening Audit"
            ) {
              this.subagentPrivilege = item;
            }
          } if (this.routeName == 'adminConfigurationAudit') {
            if (item.subComponent?.subComponentName == "Admin Configuration Audit"
            ) {
              this.subagentPrivilege = item;
            }
          } if (this.routeName == 'apiAuditReport') {
            if (item.subComponent?.subComponentName == "API Audit Report"
            ) {
              this.subagentPrivilege = item;
            }
          } if (this.routeName == 'failedTransactionAudit') {
            if (item.subComponent?.subComponentName == "Failed Transaction Audit"
            ) {
              this.subagentPrivilege = item;
            }
          } if (this.routeName == 'reversalAuditReport') {
            if (item.subComponent?.subComponentName == "Reversal Audit Report"
            ) {
              this.subagentPrivilege = item;
            }
          }

        }
      }
    }
  }
  getprovinceList() {
    this.apiService.getprovinceList().subscribe((data: any) => {
      this.provinceList = data?.data;
    })
  }
  getRowSpan(headAccounts: any[]): number {
    return headAccounts.reduce((sum, headAcc) => sum + headAcc.items.length, 0);
  }
  paginatedData: any;
  // old
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.agentSummaryReport.length / this.pageSize);
    this.updatePagination(); // Update the displayed data for the first page
    console.log("agentSummaryReport", this.agentSummaryReport.length);
    console.log("paginatedData", this.paginatedData);
    console.log("paginated length", this.paginatedData?.length);
  }
  // calculatePagination(): void {
  //   let dataSource = [];
  //   if (this.routeName === 'AgentLiquidityReport') {
  //     dataSource = this.agentSummaryReport;
  //   }
  //   else if (this.routeName === 'MerchantToAgentReport') {
  //     dataSource = this.merchantAgentTransactionData;
  //   }
  //   else if (this.routeName === 'WalletToWalletReport') {
  //     dataSource = this.walletToWalletReportData;
  //   }
  //   else if (this.routeName === 'FailedTransactionReport') {
  //     dataSource = this.failedTransactionData;
  //   }
  //   console.log('📦 dataSource length :', dataSource.length);
  //   this.totalPages = Math.ceil(dataSource.length / this.pageSize);
  //   this.updatePagination(dataSource);
  // }
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.agentSummaryReport.slice(startIndex, endIndex);
  }
  // updatePagination(data: any[] = []): void {
  //   const startIndex = (this.currentPage - 1) * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;
  //   this.paginatedData = data.slice(startIndex, endIndex);
  //   console.log('🧾 Paginated data from', startIndex, 'to', endIndex, ':', this.paginatedData);
  // }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination(); // Update the table data for the new page
    }
  }

  formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  onMonthChange() {
    if (this.lctrMonth) {
      const [year, month] = this.lctrMonth.split('-').map(Number);

      const from = new Date(year, month - 1, 1);
      const to = new Date(year, month, 0);

      this.fromDate = this.formatDateLocal(from);
      this.toDate = this.formatDateLocal(to);

      console.log('From Date:', this.fromDate);
      console.log('To Date:', this.toDate);
    }
  }

  //  onMonthChangeActiveUserMonth() {
  //   const value = this.dateForm.controls['activeUserMonth'].value;
  //   console.log("Raw value:", value); // e.g "2025-10"

  //   if (value) {
  //     const [year, month] = value.split("-");
  //     this.activeUserMonthTarget = `${month}-${year}`;
  //     console.log("Formatted:", this.activeUserMonthTarget);
  //   } else {
  //     this.activeUserMonthTarget = null;
  //   }
  //   const body = {
  //     yearMonth: this.dateForm.controls['activeUserMonth'].value
  //   };
  //   console.log("Payload:", body);
  //   this.apiService
  //     .reportV2WithParams('ActiveUserWithMinimumOneTrxnMonthlyReport', body)
  //     .subscribe({
  //       next: (data: Blob) => {
  //         this.isLoading = false;
  //         console.log(data, '+_+_+_+_+_+_+_+');
  //         this.pdfSrc = URL.createObjectURL(data);
  //       },
  //       error: () => {
  //         this.isLoading = false;
  //         alert("Error Try Again");
  //       },
  //     });
  // }

  onAccChange($event: any) {
    this.selectedIncomeProdAccount = $event.target.value;
  }
  onChangeProvinceActiveReport($event: any) {
    this.provinceTarget = $event.target.value
  }
  onChangeUserCrime($event: any) {
    console.log("routename new report", this.routeName)
    console.log("$event new report", $event.target.value)
    if (this.routeName == 'AccountHoldersWithHistoryOfFinancialCrime') {
      const body = {
        user: this.dateForm.controls['userTypeCrime'].value
      };
      this.apiService.reportV2WithParams('AccountHoldersWithHistoryOfFinancialCrime', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
          this.pdfSrc = URL.createObjectURL(data);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
  }
  onChangeRisk($event: any) {
    const body = {
      risk: this.dateForm.controls['risk'].value
    };
    this.apiService.reportV2WithParams('CustomerRiskClassificationReportPeriodically', body).subscribe({
      next: (data: Blob) => {
        this.isLoading = false;
        console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
        this.pdfSrc = URL.createObjectURL(data);
      },
      error: () => {
        this.isLoading = false;
        alert("Error Try Again");
      },
    });
  }
  onChangeDetailedTrans($event: any) {
    console.log("routename new report 11", this.routeName)
    console.log("$event new report 11", $event.target.value)
    if (this.routeName == 'SuspiciousTransactionsReport') {
      const body = {
        service: this.dateForm.controls['detailedTransService'].value
      };
      this.apiService.reportV2WithParams('SuspiciousTransactionsReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
          this.pdfSrc = URL.createObjectURL(data);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
  }
  onChangeRecency($event: any) {
    this.changeRecency = $event.target.value;
    const body = {
      changeRecency: $event.target.value
    };
    this.apiService.reportV2WithParams('ChangesInCustomerContactInformationReport', body).subscribe({
      next: (data: Blob) => {
        this.isLoading = false;
        console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
        this.pdfSrc = URL.createObjectURL(data);
      },
      error: () => {
        this.isLoading = false;
        alert("Error Try Again");
      },
    });
  }
  onChangeProvince($event: any) {
    this.showDate = true;
    //  ActiveUserByProvinceBasedReportByProvince
    const body = {
      province: this.dateForm.controls['province'].value,
    };
    this.apiService.reportV2WithParams('ActiveUserByProvinceBasedReportByProvince', body).subscribe({
      next: (data: Blob) => {
        this.isLoading = false;
        console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
        this.pdfSrc = URL.createObjectURL(data);
      },
      error: () => {
        this.isLoading = false;
        alert("Error Try Again");
      },
    });
  }
  onChangeKycStatus($event: any) {
    this.provinceVal = $event.target.value;
    const body = {
      province: this.provinceVal
    };
    console.log("kyc status", $event.target.value)
    this.apiService.reportV2WithParams('DataIntegrityandSecurity', body).subscribe({
      next: (data: Blob) => {
        this.isLoading = false;
        console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
        this.pdfSrc = URL.createObjectURL(data);
      },
      error: () => {
        this.isLoading = false;
        alert("Error Try Again");
      },
    });
  }
  search() {
    this.currentPage = 1
    if (this.routeName == "BalanceSheet") {
      let yearSplit = this.year.split("-");
      let year = yearSplit[0];
      let monthSplit: any = yearSplit[1];
      let month;
      if (monthSplit.startsWith("0")) {
        let monthSplitData = monthSplit.split("");
        month = monthSplitData[1];
      } else {
        month = monthSplit;
      }

      this.isLoading = true;
      this.apiService.getBalanceSheetStatement(year, 0).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res?.responseCode == 200) {
            this.resData = res;
            console.log(res.data);
            this.groupedData = this.groupData(res?.data);
            console.log(this.groupedData);
          }
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    } else if (this.routeName == "ProfitAndLossReport") {
      let yearSplit = this.year.split("-");
      let year = yearSplit[0];
      let monthSplit: any = yearSplit[1];
      let month;
      if (monthSplit.startsWith("0")) {
        let monthSplitData = monthSplit.split("");
        month = monthSplitData[1];
      } else {
        month = monthSplit;
      }
      let value;
      if (this.selectedValue == "PL") {
        value = 0;
      } else if (this.selectedValue == "QUARTER") {
        value = this.selectedQuaterValue;
      } else if ((this.selectedValue = "MONTH")) {
        value = month;
      }
      this.isLoading = true;
      this.apiService
        .getProfitAndLossStatement(this.selectedValue, value, year)
        .pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            if (res?.responseCode == 200) {
              this.resData = res;
              console.log(res.data);
              this.groupedData = this.groupData(res?.data);
              console.log(this.groupedData);
            }
          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    }
    else if (this.routeName === "StatementOfCashFlow") {
      const data = {
        fromDate: this.dateForm.get('fromDate')?.value,
        toDate: this.dateForm.get('toDate')?.value
      };

      this.isLoading = true;
      console.log(data, "StatementOfCashFlow data");

      this.apiService
        .reportV2WithParams("StatementOfCashFlow", data)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
            this.pdfSrc = URL.createObjectURL(data);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });
    }
    else if (this.routeName == "BankReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let data = {
        FromDate: fromDate,
        ToDate: toDate,
      };
      this.isLoading = true;

      this.apiService.transactionReport("BankReport", data).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: (res: any) => {
          this.isLoading = false;

          const blob = res;
          this.pdfSrc = blob;
        },
        error: () => {
          this.isLoading = false;

          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "TransactionWithAtomaPay") {
      let data = {
        pDate: this.dateForm.controls["p_date"].value,
        status: this.dateForm.controls["atomaStatus"].value
      };
      this.apiService.reportV2WithParams('TransactionViaAtomaPayReport', data).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
          this.pdfSrc = URL.createObjectURL(data);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "AirtimeReconciliationReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let status = this.dateForm.controls["status"].value;
      let service = this.dateForm.controls["service"].value;
      let wallet = this.dateForm.controls["accNo"].value;
      let type = this.dateForm.controls["type"].value;


      if (type == 'STATUS') {
        let data = {
          FromDate: `${fromDate} 00:00:00`,
          ToDate: `${toDate} 23:59:59`,
          status: status
        };
        this.isLoading = true;
        this.apiService.transactionReport("AirtimeReconciliationReportByStatus", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.airtimeReconciliationReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });
      }
      else if (type == 'SERVICE') {
        let data = {
          FromDate: fromDate,
          ToDate: toDate,
          service: service
        };
        this.isLoading = true;
        this.apiService.transactionReport("AirtimeReconciliationReportByService", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.airtimeReconciliationReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });
      } else if (type == 'WALLET') {
        let data = {
          FromDate: fromDate,
          ToDate: toDate,
          wallet: wallet
        };
        this.isLoading = true;
        this.apiService.transactionReport("AirtimeReconciliationReportByWallet", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.airtimeReconciliationReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });
      }
    }
    else if (this.routeName == "EMoneyTransferReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let wallet = this.dateForm.controls["accNo"].value;
      let trxnId = this.dateForm.controls["accNo"].value;
      let type = this.dateForm.controls["txntype"].value;


      if (type == 'TXNID') {
        let data = {
          FromDate: `${fromDate} 00:00:00`,
          ToDate: `${toDate} 23:59:59`,
          trxnId: trxnId
        };
        this.isLoading = true;
        this.apiService.transactionReport("EMoneyTransferReportTrxNo", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.eMoneyReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.eMoneyReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.total_credit || '0');
            }, 0);

            this.totalDebit = this.eMoneyReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.total_debit || '0');
            }, 0);
            this.totalCreditCount = this.eMoneyReport.reduce((acc: number, item: any) => {
              // Only count if debit is 0 and credit is non-zero
              return acc + (parseFloat(item?.total_debit) === 0 && parseFloat(item?.total_credit) !== 0 ? 1 : 0);
            }, 0);

            this.totalDebitCount = this.eMoneyReport.reduce((acc: number, item: any) => {
              // Only count if credit is 0 and debit is non-zero
              return acc + (parseFloat(item?.total_credit) === 0 && parseFloat(item?.total_debit) !== 0 ? 1 : 0);
            }, 0);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });
      }
      else if (type == 'ACCNO') {
        let data = {
          FromDate: fromDate,
          ToDate: toDate,
          account: wallet
        };
        this.isLoading = true;
        this.apiService.transactionReport("EMoneyTransferReportByAccount", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.eMoneyReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.eMoneyReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.total_credit || '0');
            }, 0);

            this.totalDebit = this.eMoneyReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.total_debit || '0');
            }, 0);
            this.totalCreditCount = this.eMoneyReport.reduce((acc: number, item: any) => {
              // Only count if debit is 0 and credit is non-zero
              return acc + (parseFloat(item?.total_debit) === 0 && parseFloat(item?.total_credit) !== 0 ? 1 : 0);
            }, 0);

            this.totalDebitCount = this.eMoneyReport.reduce((acc: number, item: any) => {
              // Only count if credit is 0 and debit is non-zero
              return acc + (parseFloat(item?.total_credit) === 0 && parseFloat(item?.total_debit) !== 0 ? 1 : 0);
            }, 0);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });
      } else {
        let data = {
          FromDate: fromDate,
          ToDate: toDate,
        };
        this.isLoading = true;
        this.apiService.transactionReport("EmoneyTransferReport", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.eMoneyReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.eMoneyReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.total_credit || '0');
            }, 0);

            this.totalDebit = this.eMoneyReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.total_debit || '0');
            }, 0);
            this.totalCreditCount = this.eMoneyReport.reduce((acc: number, item: any) => {
              // Only count if debit is 0 and credit is non-zero
              return acc + (parseFloat(item?.total_debit) === 0 && parseFloat(item?.total_credit) !== 0 ? 1 : 0);
            }, 0);

            this.totalDebitCount = this.eMoneyReport.reduce((acc: number, item: any) => {
              // Only count if credit is 0 and debit is non-zero
              return acc + (parseFloat(item?.total_credit) === 0 && parseFloat(item?.total_debit) !== 0 ? 1 : 0);
            }, 0);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });
      }
    }
    else if (this.routeName == "TransactionSummaryReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let TXNID = this.dateForm.controls["txnId"].value;
      let service = this.dateForm.controls["service"].value;
      let wallet = this.dateForm.controls["accNo"].value;
      let type = this.dateForm.controls["txntype"].value;


      if (type == 'TXNID') {
        let data = {
          FromDate: `${fromDate} 00:00:00`,
          ToDate: `${toDate} 23:59:59`,
          trxnId: TXNID
        };
        this.isLoading = true;
        this.apiService.transactionReport("TransactionSummaryReportByDateTrxnId", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.trasactionSummaryReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.credit_amount || '0');
            }, 0);

            this.totalDebit = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.debit_amount || '0');
            }, 0);
            this.totalCreditCount = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              // Only count if debit is 0 and credit is non-zero
              return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
            }, 0);

            this.totalDebitCount = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              // Only count if credit is 0 and debit is non-zero
              return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
            }, 0);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });
      }
      else if (type == 'SERVICE') {
        let data = {
          FromDate: `${fromDate} 00:00:00`,
          ToDate: `${toDate} 23:59:59`,
          service: service
        };
        this.isLoading = true;
        this.apiService.transactionReport("TransactionSummaryReportByDateService", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.trasactionSummaryReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.credit_amount || '0');
            }, 0);

            this.totalDebit = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.debit_amount || '0');
            }, 0);
            this.totalCreditCount = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              // Only count if debit is 0 and credit is non-zero
              return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
            }, 0);

            this.totalDebitCount = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              // Only count if credit is 0 and debit is non-zero
              return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
            }, 0);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });
      } else if (type == 'ACCNO') {
        let data = {
          FromDate: `${fromDate} 00:00:00`,
          ToDate: `${toDate} 23:59:59`,
          account: wallet
        };
        this.isLoading = true;
        this.apiService.transactionReport("TransactionSummaryReportByDateAccount", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.trasactionSummaryReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.credit_amount || '0');
            }, 0);

            this.totalDebit = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.debit_amount || '0');
            }, 0);
            this.totalCreditCount = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              // Only count if debit is 0 and credit is non-zero
              return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
            }, 0);

            this.totalDebitCount = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              // Only count if credit is 0 and debit is non-zero
              return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
            }, 0);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });
      } else {
        let data = {
          FromDate: `${fromDate} 00:00:00`,
          ToDate: `${toDate} 23:59:59`,
        };
        this.isLoading = true;
        this.apiService.transactionReport("TransactionSummaryReport", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.trasactionSummaryReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.credit_amount || '0');
            }, 0);

            this.totalDebit = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.debit_amount || '0');
            }, 0);
            this.totalCreditCount = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              // Only count if debit is 0 and credit is non-zero
              return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
            }, 0);

            this.totalDebitCount = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              // Only count if credit is 0 and debit is non-zero
              return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
            }, 0);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });
      }
    }
    // new
    else if (this.routeName == "ActiveUserReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let status = this.dateForm.controls["status"].value;
      if (fromDate && toDate && !this.provinceTarget && !status) {
        let data = {
          fromDate: fromDate,
          toDate: toDate,
        };
        this.apiService.transactionReport("ActiveUserReportByDate", data).pipe(finalize(() => {
          console.log("routeName2", this.routeName)
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.trasactionSummaryReport = res
            this.agentSummaryReport = res
            // this.paginatedData = this.agentSummaryReport;
            console.log("agentSummaryReport", this.agentSummaryReport)
            console.log("paginatedData", this.paginatedData)
            this.calculatePagination();
            this.totalCredit = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.credit_amount || '0');
            }, 0);

            this.totalDebit = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.debit_amount || '0');
            }, 0);
            this.totalCreditCount = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              // Only count if debit is 0 and credit is non-zero
              return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
            }, 0);

            this.totalDebitCount = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              // Only count if credit is 0 and debit is non-zero
              return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
            }, 0);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });
      }
      else if (fromDate && toDate && this.provinceTarget && !status) {
        let data = {
          fromDate: fromDate,
          toDate: toDate,
          province: this.provinceTarget || "",
        }
        this.apiService.transactionReport("ActiveUserReportByDateAndProvince", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.trasactionSummaryReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.credit_amount || '0');
            }, 0);

            this.totalDebit = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.debit_amount || '0');
            }, 0);
            this.totalCreditCount = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              // Only count if debit is 0 and credit is non-zero
              return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
            }, 0);

            this.totalDebitCount = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              // Only count if credit is 0 and debit is non-zero
              return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
            }, 0);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });
      }
      else if (fromDate && toDate && status && !this.provinceTarget) {
        let data = {
          fromDate: fromDate,
          toDate: toDate,
          status: status || "",
        };
        this.apiService.transactionReport("ActiveUserReportByDateAndStatus", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.trasactionSummaryReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.credit_amount || '0');
            }, 0);

            this.totalDebit = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.debit_amount || '0');
            }, 0);
            this.totalCreditCount = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              // Only count if debit is 0 and credit is non-zero
              return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
            }, 0);

            this.totalDebitCount = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              // Only count if credit is 0 and debit is non-zero
              return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
            }, 0);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });
      }
      else if (fromDate && toDate && status && this.provinceTarget) {
        let data = {
          fromDate: fromDate,
          toDate: toDate,
          status: status || "",
          province: this.provinceTarget,
        };
        this.apiService.transactionReport("ActiveUserReportByDateAndStatusAndProvince", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.trasactionSummaryReport = res || []
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.credit_amount || '0');
            }, 0);

            this.totalDebit = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.debit_amount || '0');
            }, 0);
            this.totalCreditCount = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              // Only count if debit is 0 and credit is non-zero
              return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
            }, 0);

            this.totalDebitCount = this.trasactionSummaryReport.reduce((acc: number, item: any) => {
              // Only count if credit is 0 and debit is non-zero
              return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
            }, 0);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });
      }
    }

    else if (this.routeName == "KYCReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let data = {
        fromDate: `${fromDate}T00:00:00`,
        toDate: `${toDate}T14:31:56`,
        page: 0,
      };
      this.isLoading = true;
      this.apiService.getKYCReport(data).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res?.responseCode == 200) {
            console.log(res);
            this.allData = res?.data
            console.log(this.allData);
          }
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "RefundReport") {
      let type = this.dateForm.controls["txntype"].value;
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let service = this.dateForm.controls["service"].value;
      let wallet = this.dateForm.controls["accNo"].value;
      if (type == 'SERVICE') {
        let data = {
          FromDate: `${fromDate} 00:00:00`,
          ToDate: `${toDate} 23:59:59`,
          service: service
        };
        this.isLoading = true;
        this.apiService
          .transactionReport("RefundReportByService", data)
          .pipe(finalize(() => {
            this.isLoading = false;
          })).subscribe({
            next: (res: any) => {
              this.isLoading = false;
              this.refundReport = res
              this.agentSummaryReport = res
              this.calculatePagination();
            },
            error: () => {
              this.isLoading = false;

              alert("Error Try Again");
            },
          });
      } else if (type == 'ACCNO') {
        let data = {
          FromDate: `${fromDate} 00:00:00`,
          ToDate: `${toDate} 23:59:59`,
          wallet: wallet
        };
        this.isLoading = true;
        this.apiService
          .transactionReport("RefundReportByWallet", data)
          .subscribe({
            next: (res: any) => {
              this.isLoading = false;
              this.refundReport = res
              this.agentSummaryReport = res
              this.calculatePagination();
            },
            error: () => {
              this.isLoading = false;

              alert("Error Try Again");
            },
          });
      }
    }
    else if (this.routeName == "CorporateCustomerReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let wallet = this.dateForm.controls["accNo"].value;

      let data = {
        wallet: wallet
      };
      this.isLoading = true;
      this.apiService
        .transactionReport("CorporateCustomerReportByWallet", data)
        .pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.agentSummaryReport = res
            this.calculatePagination();
            console.log(this.cashINReport);


          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    }
    else if (this.routeName == "AgentSummaryReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let wallet = this.dateForm.controls["accNo"].value;

      let data = {
        acount: wallet
      };
      this.isLoading = true;
      this.apiService
        .transactionReport("AgentSummaryReportByAccount", data)
        .pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.agentSummaryReport = res
            this.calculatePagination();
            console.log(this.cashINReport);


          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    }
    else if (this.routeName == "AgentLiquidityReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let wallet = this.dateForm.controls["accNo"].value;

      let data = {
        wallet: wallet
      };
      this.isLoading = true;
      this.apiService
        .transactionReport("AgentLiquidityReportByWallet", data)
        .subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.agentLiquidityReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.total_deposited || '0');
            }, 0);

            this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.total_withdrawn || '0');
            }, 0);
            this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
              // Only count if debit is 0 and credit is non-zero
              return acc + (parseFloat(item?.total_withdrawn) === 0 && parseFloat(item?.total_deposited) !== 0 ? 1 : 0);
            }, 0);

            this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
              // Only count if credit is 0 and debit is non-zero
              return acc + (parseFloat(item?.total_deposited) === 0 && parseFloat(item?.total_withdrawn) !== 0 ? 1 : 0);
            }, 0);


          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    }
    //new jasper
    //ActiveUserWithMinimumOneTrxnMonthlyReport
    // else if (this.routeName == "ActiveUserWithMinimumOneTrxnMonthlyReport") {
    //   console.log("activeUserMonthTarget 22", this.activeUserMonthTarget)
    //   let fromDate = this.dateForm.controls["fromDate"].value;
    //   let toDate = this.dateForm.controls["toDate"].value;
    //   const body = {
    //     start_date: fromDate,
    //     end_date: toDate,
    //     user_type: this.dateForm.controls['userTypeMinOne'].value,
    //     // yearMonth: this.activeUserMonthTarget
    //   };
    //   this.apiService.reportV2WithParams('ActiveUserWithMinimumOneTrxnMonthlyReport', body).subscribe({
    //     next: (data: Blob) => {
    //       this.isLoading = false;
    //       console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
    //       this.pdfSrc = URL.createObjectURL(data);
    //     },
    //     error: () => {
    //       this.isLoading = false;
    //       alert("Error Try Again");
    //     },
    //   });
    // }
    else if (this.routeName == 'DetailedTransactionProvinceWise') {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value; const body = {
        start_date: fromDate,
        end_date: toDate,
        lastCreatedOn: this.dateForm.controls['CreatedDate'].value,
        pageSize: 10
      };
      this.apiService.reportV2WithParams('DetailedTransactionProvinceWise', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
          this.pdfSrc = URL.createObjectURL(data);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    // else if (this.routeName == 'BalanceBreakupReport') {
    //   // let fromDate = this.dateForm.controls["fromDate"].value;
    //   // let toDate = this.dateForm.controls["toDate"].value;
    //   // const body = {
    //   //   start_date: fromDate,
    //   //   end_date: toDate,
    //   //   year: this.dateForm.controls["BalanceReportYear"].value,
    //   //   quarter: this.selectedQuaterValue,
    //   //   accountNo: this.dateForm.controls["BalanceReportAccNo"].value,
    //   // };
    //   this.apiService.reportV2WithParams('BalanceBreakupReport', {}).subscribe({
    //     next: (data: Blob) => {
    //       this.isLoading = false;
    //       console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
    //       this.pdfSrc = URL.createObjectURL(data);
    //     },
    //     error: () => {
    //       this.isLoading = false;
    //       alert("Error Try Again");
    //     },
    //   });
    // }
    else if (this.routeName == "TransactionsUnusualTiming") {
      const body = {
        created_on: this.dateForm.controls['CreatedDate'].value,
        service_name: this.dateForm.controls["Service_Name"].value,
      }
      this.apiService.reportV2WithParams('TransactionsUnusualTiming', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
          this.pdfSrc = URL.createObjectURL(data);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "AllLoyaltyReports") {
      let data = {
        fromDate: this.dateForm.controls["fromDate"].value,
        toDate: this.dateForm.controls["toDate"].value,
        account: this.dateForm.controls["accNo"].value || null,
        type: this.dateForm.controls["loyaltyType"].value || null,
        serviceName: this.dateForm.controls["serviceName"].value || null,
      };
      this.apiService.reportV2WithParams('AllLoyaltyReport', data).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
          this.pdfSrc = URL.createObjectURL(data);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "RejectedTransactions") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      const body = {
        service_name: this.dateForm.controls['Service_Name'].value,
        start_date: fromDate,
        end_date: toDate,
        batch_id: this.dateForm.controls["batchId"].value,
      };
      this.apiService.reportV2WithParams('RejectedTransactions', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
          this.pdfSrc = URL.createObjectURL(data);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == 'BankAccountLinkageReport') {
      const body = {
        user: this.dateForm.controls['userTypeCrime'].value,
        accountNo: this.dateForm.controls['AccNO'].value,
        walletNo: this.dateForm.controls['walletNO'].value,
      };
      this.apiService.reportV2WithParams('BankAccountLinkageReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
          this.pdfSrc = URL.createObjectURL(data);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "BalanceMovementReport") {
      const body = {
        year: this.dateForm.controls["BalanceReportYear"].value,
        month: this.dateForm.controls["BalanceReportMonth"].value
      };
      console.log("BalanceMovementReport body", body)
      this.apiService.reportV2WithParams('BalanceMovementReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
          this.pdfSrc = URL.createObjectURL(data);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    // else if (this.routeName == "AuthorizedPartnerQuarterlyReport") {
    //   this.showDate = true;
    //   const body = {
    //     year: this.dateForm.controls["BalanceReportYear"].value,
    //     quarter: this.selectedQuaterValue,
    //   };
    //   this.apiService.reportV2WithParams('AuthorizedPartnerQuarterlyReport', body).subscribe({
    //     next: (data: Blob) => {
    //       this.isLoading = false;
    //       console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
    //       this.pdfSrc = URL.createObjectURL(data);
    //     },
    //     error: () => {
    //       this.isLoading = false;
    //       alert("Error Try Again");
    //     },
    //   });
    // }
    else if (this.routeName == "RegisteredReportBasedOnProfileAndProvince") {
      const body = {
        profile: this.dateForm.controls["profile"].value,
        account_kyc: this.dateForm.controls["accKYC"].value
      };
      this.apiService.reportV2WithParams('RegisteredReportBasedOnProfileAndProvince', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
          this.pdfSrc = URL.createObjectURL(data);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "AdhocReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      const body = {
        start_date: fromDate,
        end_date: toDate,
        status: this.dateForm.controls["status"].value,
        service_name: this.dateForm.controls["Service_Name"].value,
        status_2: this.dateForm.controls["status"].value,
        service_name_2: this.dateForm.controls["Service_Name"].value,
        start_date_2: fromDate,
        end_date_2: toDate
      };
      this.apiService.reportV2WithParams('AdhocReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
          this.pdfSrc = URL.createObjectURL(data);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "AccessToTransactionDataReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      const body = {
        start_date: fromDate,
        end_date: toDate,
        status: this.dateForm.controls["status"].value,
        service_name: this.dateForm.controls["Service_Name"].value,
        status_2: this.dateForm.controls["status"].value,
        service_name_2: this.dateForm.controls["Service_Name"].value,
        start_date_2: fromDate,
        end_date_2: toDate
      };
      this.apiService.reportV2WithParams('AccessToTransactionDataReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log(data, '+_+_+_+_+_+_+_+_+_+_+_+');
          this.pdfSrc = URL.createObjectURL(data);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    //new jasper
    else if (this.routeName == "WalletToWalletReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      console.log("fromDate 123", fromDate)
      console.log("toDate 123", toDate)
      let data = {
        FromDate: fromDate,
        ToDate: toDate,
      };
      this.isLoading = true;
      this.apiService.transactionReport("WalletToWalletTransactionReportByDate", data).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          // this.walletToWalletReportData = res
          this.agentSummaryReport = res
          this.calculatePagination();
          // const blob = res;
          // this.pdfSrc = blob;
        },
        error: () => {
          this.isLoading = false;

          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "MerchantToAgentReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      console.log("fromDate 123", fromDate)
      console.log("toDate 123", toDate)
      let data = {
        FromDate: fromDate,
        ToDate: toDate,
      };
      this.isLoading = true;
      this.apiService.transactionReport("MercahntAgentTransactionReportByDate", data).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.agentSummaryReport = res
          this.calculatePagination();
          // const blob = res;
          // this.pdfSrc = blob;
        },
        error: () => {
          this.isLoading = false;

          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "FailedTransactionReport") {
      this.showDate = true
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      console.log("fromDate 123", fromDate)
      console.log("toDate 123", toDate)
      let data = {
        FromDate: fromDate,
        ToDate: toDate,
      };
      this.isLoading = true;
      this.apiService.transactionReport("FailedTransactionReport", data).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: (res: any) => {
          console.log(res, "FailedTransactionReport data");
          this.isLoading = false;
          this.routeName = 'FailedTransactionReport';
          this.agentSummaryReport = res;
          // this.paginatedData = this.agentSummaryReport
          this.currentPage = 1;
          this.calculatePagination();

          // const blob = res;
          // this.pdfSrc = blob;

          this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.credit_amount || '0');
          }, 0);

          this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.debit_amount || '0');
          }, 0);

          this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
          }, 0);

          this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
          }, 0);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "PullTransactionReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      console.log("fromDate 123", fromDate)
      console.log("toDate 123", toDate)
      let data = {
        FromDate: fromDate,
        ToDate: toDate,
        userType: this.dateForm.controls["userType"].value
      };
      this.isLoading = true;
      this.apiService.transactionReport("AgentMerchantMasterAgentPullTransactionReport", data).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: (data: any) => {
          console.log(data, "PullTransactionReport data");
          this.showDate = true;
          this.isLoading = false;
          this.routeName = 'PullTransactionReport';
          this.agentSummaryReport = data;
          this.paginatedData = this.agentSummaryReport
          this.currentPage = 1;
          this.calculatePagination();
          this.cdr.detectChanges();
          this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.credit_amount || '0');
          }, 0);

          this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.debit_amount || '0');
          }, 0);

          this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
          }, 0);

          this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
          }, 0);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "PushTransactionReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      console.log("fromDate 123", fromDate)
      console.log("toDate 123", toDate)
      let data = {
        FromDate: fromDate,
        ToDate: toDate,
        userType: this.dateForm.controls["userType"].value
      };
      this.isLoading = true;
      this.apiService.transactionReport("AgentMerchantMasterAgentPushTransactionReport", data).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: (data: any) => {
          console.log(data, "PushTransactionReport data");
          this.showDate = true;
          this.isLoading = false;
          this.routeName = 'PushTransactionReport';
          this.agentSummaryReport = data;
          // this.paginatedData = this.agentSummaryReport
          this.currentPage = 1;
          this.calculatePagination();
          this.cdr.detectChanges();
          this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.credit_amount || '0');
          }, 0);
          this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.debit_amount || '0');
          }, 0);
          this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
          }, 0);
          this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
          }, 0);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "AggregateBalanceReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      console.log("fromDate 123", fromDate)
      console.log("toDate 123", toDate)
      // let data = {
      //   FromDate: fromDate,
      //   ToDate: toDate
      // };
      this.isLoading = true;
      this.apiService.aggregateReport(fromDate, toDate).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: (data: any) => {
          console.log(data, "AggregateBalanceReport data");
          this.showDate = true;
          this.isLoading = false;
          this.routeName = 'AggregateBalanceReport';
          this.agentSummaryReport = data?.data;
          // this.paginatedData = this.agentSummaryReport
          this.currentPage = 1;
          this.calculatePagination();
          this.cdr.detectChanges();
          this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.credit_amount || '0');
          }, 0);
          this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.debit_amount || '0');
          }, 0);
          this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
          }, 0);
          this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
          }, 0);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "BankTransactionReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      console.log("fromDate 123", fromDate)
      console.log("toDate 123", toDate)
      let data = {
        FromDate: fromDate,
        ToDate: toDate,
        serviceName: this.dateForm.controls["bankServiceName"].value
      };
      this.isLoading = true;
      this.apiService.transactionReport("BankTransactionReport", data).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: (data: any) => {
          console.log(data, "BankTransactionReport data");
          this.showDate = true;
          this.isLoading = false;
          this.routeName = 'BankTransactionReport';
          this.agentSummaryReport = data;
          this.currentPage = 1;
          this.calculatePagination();
          this.cdr.detectChanges();
          this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.credit_amount || '0');
          }, 0);
          this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.debit_amount || '0');
          }, 0);
          this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
          }, 0);
          this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
          }, 0);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "SuspenseAccountTransactionReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      console.log("fromDate 123", fromDate)
      console.log("toDate 123", toDate)
      let data = {
        FromDate: fromDate,
        ToDate: toDate,
      };
      this.isLoading = true;
      this.apiService.transactionReport("SuspenseAccountTransactionReport", data).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: (data: any) => {
          console.log(data, "SuspenseAccountTransactionReport data");
          this.showDate = true;
          this.isLoading = false;
          this.routeName = 'SuspenseAccountTransactionReport';
          this.agentSummaryReport = data;
          // this.paginatedData = this.agentSummaryReport
          this.currentPage = 1;
          this.calculatePagination();
          this.cdr.detectChanges();
          this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.credit_amount || '0');
          }, 0);
          this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.debit_amount || '0');
          }, 0);
          this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
          }, 0);
          this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
          }, 0);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "TopUpDetailsTransactionReportByChannel") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      console.log("fromDate 123", fromDate)
      console.log("toDate 123", toDate)
      let data = {
        FromDate: fromDate,
        ToDate: toDate,
        serviceName: this.dateForm.controls["serviceName"].value
      };
      this.isLoading = true;
      this.apiService.transactionReport("TopUpDetailsTransactionReportByChannel", data).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: (data: any) => {
          console.log(data, "TopUpDetailsTransactionReportByChannel data");
          this.showDate = true;
          this.isLoading = false;
          this.routeName = 'TopUpDetailsTransactionReportByChannel';
          this.agentSummaryReport = data;
          // this.paginatedData = this.agentSummaryReport
          this.currentPage = 1;
          this.calculatePagination();
          this.cdr.detectChanges();
          this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.credit_amount || '0');
          }, 0);
          this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.debit_amount || '0');
          }, 0);
          this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
          }, 0);
          this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
          }, 0);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "UserwithMinimumSingleMonthlyTransactionReport") {
      let singleDate = this.dateForm.controls["singleDate"].value;
      let formattedSingleDate = new Date(singleDate).toISOString().slice(0, 7); // 'YYYY-MM'
      console.log("formattedSingleDate", formattedSingleDate)
      console.log("singleDate", this.dateForm.controls["singleDate"].value)
      // let data = {
      //   yearMonth: formattedSingleDate,
      // };
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      // let year = this.BalanceReportYear;
      const data = {
        start_date: fromDate,
        end_date: toDate,
        user_type: this.dateForm.controls['userTypeMinOne'].value,
      }
      this.apiService.transactionReport("ActiveUserWithMinimumOneTrxnMonthlyReport", data).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: (data: any) => {
          this.showDate = true;
          this.isLoading = false;
          this.routeName = 'UserwithMinimumSingleMonthlyTransactionReport';
          this.agentSummaryReport = data || [];
          this.paginatedData = this.agentSummaryReport
          this.currentPage = 1;
          this.calculatePagination();
          console.log('🔍 paginatedData11:', this.paginatedData);
          console.log('🔍 routeName11:', this.routeName);
          this.cdr.detectChanges();
          this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.credit_amount || '0');
          }, 0);

          this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.debit_amount || '0');
          }, 0);

          this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
          }, 0);

          this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
          }, 0);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "TransactionReportOnChannelUsage") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let data = {
        FromDate: fromDate,
        ToDate: toDate,
        channel: this.dateForm.controls["channelUsage"].value
      };
      this.isLoading = true;
      this.apiService.transactionReport("TransactionReportOnChannelUsage", data).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: (data: any) => {
          this.showDate = true;
          this.isLoading = false;
          this.routeName = 'TransactionReportOnChannelUsage';
          this.agentSummaryReport = data;
          // this.paginatedData = this.agentSummaryReport
          this.currentPage = 1;
          this.calculatePagination();
          this.cdr.detectChanges();
          this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.credit_amount || '0');
          }, 0);
          this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.debit_amount || '0');
          }, 0);
          this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
          }, 0);
          this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
          }, 0);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "BulkReversalReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let data = {
        FromDate: fromDate,
        ToDate: toDate,
        // channel: this.dateForm.controls["channelUsage"].value
      };
      this.isLoading = true;
      this.apiService.transactionReport("BulkReversalReport", data).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: (data: any) => {
          this.showDate = true;
          this.isLoading = false;
          this.routeName = 'BulkReversalReport';
          this.agentSummaryReport = data;
          // this.paginatedData = this.agentSummaryReport
          this.currentPage = 1;
          this.calculatePagination();
          this.cdr.detectChanges();
          this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.credit_amount || '0');
          }, 0);
          this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.debit_amount || '0');
          }, 0);
          this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
          }, 0);
          this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
          }, 0);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "AllAccountActivityReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let data = {
        FromDate: fromDate,
        ToDate: toDate,
        // channel: this.dateForm.controls["channelUsage"].value
      };
      this.isLoading = true;
      this.apiService.transactionReport("AllAccountActivityReport", data).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: (data: any) => {
          this.showDate = true;
          this.isLoading = false;
          this.routeName = 'AllAccountActivityReport';
          this.agentSummaryReport = data;
          // this.paginatedData = this.agentSummaryReport
          this.currentPage = 1;
          this.calculatePagination();
          this.cdr.detectChanges();
          this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.credit_amount || '0');
          }, 0);
          this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.debit_amount || '0');
          }, 0);
          this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
          }, 0);
          this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
          }, 0);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    //new

    else if (this.routeName == "SalesTrendReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let service = this.dateForm.controls["service"].value;

      let data = {
        service: service
      };
      this.isLoading = true;
      this.apiService
        .transactionReport("SalesTrendReportByService", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.salesTrendReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.salesTrendReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.credit_amount || '0');
            }, 0);

            this.totalDebit = this.salesTrendReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.debit_amount || '0');
            }, 0);
            this.totalCreditCount = this.salesTrendReport.reduce((acc: number, item: any) => {
              // Only count if debit is 0 and credit is non-zero
              return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
            }, 0);

            this.totalDebitCount = this.salesTrendReport.reduce((acc: number, item: any) => {
              // Only count if credit is 0 and debit is non-zero
              return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
            }, 0);


          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    }
    else if (this.routeName == "SalesVolumeByChannel") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let wallet = this.dateForm.controls["accNo"].value;
      let channel = this.dateForm.controls["channel"].value;
      let type = this.dateForm.controls["txntype"].value;
      console.log(type)

      if (type == 'ACCNO') {
        let data = {
          FromDate: `${fromDate} 00:00:00`,
          ToDate: `${toDate} 23:59:59`,
          wallet: wallet
        };
        this.isLoading = true;
        this.apiService
          .transactionReport("SalesVolumeByAgentsByWallet", data)
          .subscribe({
            next: (res: any) => {
              this.isLoading = false;
              this.salesVolumeByChannel = res
              this.agentSummaryReport = res
              this.calculatePagination();
            },
            error: () => {
              this.isLoading = false;

              alert("Error Try Again");
            },
          });
      } else if (type == 'CHANNEL') {
        let data = {
          FromDate: `${fromDate} 00:00:00`,
          ToDate: `${toDate} 23:59:59`,
          channel: channel
        };
        this.isLoading = true;
        this.apiService
          .transactionReport("SalesVolumeByChannelByChannel", data).pipe(finalize(() => {
            this.isLoading = false;
          })).subscribe({
            next: (res: any) => {
              this.isLoading = false;
              this.salesVolumeByChannel = res
              this.agentSummaryReport = res
              this.calculatePagination();
            },
            error: () => {
              this.isLoading = false;

              alert("Error Try Again");
            },
          });
      } else if (fromDate || toDate) {
        let data = {
          FromDate: `${fromDate} 00:00:00`,
          ToDate: `${toDate} 23:59:59`,
        };
        this.isLoading = true;
        this.apiService
          .transactionReport("SalesVolumeByChannelByDate", data).pipe(finalize(() => {
            this.isLoading = false;
          })).subscribe({
            next: (res: any) => {
              this.isLoading = false;
              this.salesVolumeByChannel = res
              this.agentSummaryReport = res
              this.calculatePagination();
            },
            error: () => {
              this.isLoading = false;

              alert("Error Try Again");
            },
          });
      }
    }
    else if (this.routeName == "LCTR") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let wallet = this.dateForm.controls["accNo"].value;

      let data = {
        FromDate: `${fromDate}`,
        ToDate: `${toDate}`,
      };
      this.isLoading = true;
      this.apiService
        .getCumulativeLctrReportByDate(fromDate, toDate).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.lctrReport = res?.data
            this.agentSummaryReport = res?.data
            this.calculatePagination();
          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    }
    else if (this.routeName == "CustomerSummaryReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let wallet = this.dateForm.controls["accNo"].value;

      let data = {
        wallet: wallet
      };
      this.isLoading = true;
      this.apiService
        .transactionReport("CustomerSummaryReportByWallet", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.agentSummaryReport = res
            this.calculatePagination();
            console.log(this.cashINReport);


          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    }
    else if (this.routeName == "CashInReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let TXNID = this.dateForm.controls["txnId"].value;
      let wallet = this.dateForm.controls["accNo"].value;
      let type = this.dateForm.controls["txntype"].value;
      let status = this.dateForm.controls["status"].value;

      if (type == 'STATUS') {
        let data = {
          FromDate: `${fromDate} 00:00:00`,
          ToDate: `${toDate} 23:59:59`,
          status: status
        };
        this.isLoading = true;
        this.apiService
          .transactionReport("CashInReportByStatus", data).pipe(finalize(() => {
            this.isLoading = false;
          })).subscribe({
            next: (res: any) => {
              this.isLoading = false;
              this.cashINReport = res
              this.agentSummaryReport = res
              this.calculatePagination();
              console.log(this.cashINReport);


            },
            error: () => {
              this.isLoading = false;

              alert("Error Try Again");
            },
          });
      } else if (type == 'TXNID') {
        let data = {
          FromDate: `${fromDate} 00:00:00`,
          ToDate: `${toDate} 23:59:59`,
          txnId: TXNID
        };
        this.isLoading = true;
        this.apiService
          .transactionReport("CashInReportByTxnId", data).pipe(finalize(() => {
            this.isLoading = false;
          })).subscribe({
            next: (res: any) => {
              this.isLoading = false;
              this.cashINReport = res
              this.agentSummaryReport = res
              this.calculatePagination();
              console.log(this.cashINReport);


            },
            error: () => {
              this.isLoading = false;

              alert("Error Try Again");
            },
          });
      } else if (type == 'ACCNO') {
        let data = {
          FromDate: `${fromDate} 00:00:00`,
          ToDate: `${toDate} 23:59:59`,
          account: wallet
        };
        this.isLoading = true;
        this.apiService
          .transactionReport("CashInReportByAccount", data).pipe(finalize(() => {
            this.isLoading = false;
          })).subscribe({
            next: (res: any) => {
              this.isLoading = false;
              this.cashINReport = res
              this.agentSummaryReport = res
              this.calculatePagination();
              console.log(this.cashINReport);


            },
            error: () => {
              this.isLoading = false;

              alert("Error Try Again");
            },
          });
      } else {
        let data = {
          FromDate: `${fromDate} 00:00:00`,
          ToDate: `${toDate} 23:59:59`,
        };
        this.isLoading = true;
        this.apiService
          .transactionReport("CashInReport", data).pipe(finalize(() => {
            this.isLoading = false;
          })).subscribe({
            next: (res: any) => {
              this.isLoading = false;
              this.cashINReport = res
              this.agentSummaryReport = res
              this.calculatePagination();
              console.log(this.cashINReport);


            },
            error: () => {
              this.isLoading = false;

              alert("Error Try Again");
            },
          });
      }
    }
    else if (this.routeName == "CashOutReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let TXNID = this.dateForm.controls["txnId"].value;
      let wallet = this.dateForm.controls["accNo"].value;
      let type = this.dateForm.controls["txntype"].value;
      let status = this.dateForm.controls["status"].value;

      if (type == 'STATUS') {
        let data = {
          FromDate: `${fromDate} 00:00:00`,
          ToDate: `${toDate} 23:59:59`,
          status: status
        };
        this.isLoading = true;
        this.apiService
          .transactionReport("CashOutReportByStatus", data).pipe(finalize(() => {
            this.isLoading = false;
          })).subscribe({
            next: (res: any) => {
              this.isLoading = false;
              this.cashINReport = res
              this.agentSummaryReport = res
              this.calculatePagination();
              console.log(this.cashINReport);


            },
            error: () => {
              this.isLoading = false;

              alert("Error Try Again");
            },
          });
      } else if (type == 'TXNID') {
        let data = {
          FromDate: `${fromDate} 00:00:00`,
          ToDate: `${toDate} 23:59:59`,
          txnId: TXNID
        };
        this.isLoading = true;
        this.apiService
          .transactionReport("CashOutReportByTxnId", data).pipe(finalize(() => {
            this.isLoading = false;
          })).subscribe({
            next: (res: any) => {
              this.isLoading = false;
              this.cashINReport = res
              this.agentSummaryReport = res
              this.calculatePagination();
              console.log(this.cashINReport);


            },
            error: () => {
              this.isLoading = false;

              alert("Error Try Again");
            },
          });
      } else if (type == 'ACCNO') {
        let data = {
          FromDate: `${fromDate} 00:00:00`,
          ToDate: `${toDate} 23:59:59`,
          account: wallet
        };
        this.isLoading = true;
        this.apiService
          .transactionReport("CashOutReportByAccount", data).pipe(finalize(() => {
            this.isLoading = false;
          })).subscribe({
            next: (res: any) => {
              this.isLoading = false;
              this.cashINReport = res
              this.agentSummaryReport = res
              this.calculatePagination();
              console.log(this.cashINReport);


            },
            error: () => {
              this.isLoading = false;

              alert("Error Try Again");
            },
          });
      } else {
        let data = {
          FromDate: `${fromDate} 00:00:00`,
          ToDate: `${toDate} 23:59:59`,
        };
        this.isLoading = true;
        this.apiService
          .transactionReport("CashOutReport", data).pipe(finalize(() => {
            this.isLoading = false;
          })).subscribe({
            next: (res: any) => {
              this.isLoading = false;
              this.cashINReport = res
              this.agentSummaryReport = res
              this.calculatePagination();
              console.log(this.cashINReport);


            },
            error: () => {
              this.isLoading = false;

              alert("Error Try Again");
            },
          });
      }
    }
    else if (this.routeName == "StockAccStatementReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let data = {
        FromDate: `${fromDate} 00:00:00`,
        ToDate: `${toDate} 23:59:59`,
        AccNo: this.dateForm.controls["accNo"].value
      };
      this.isLoading = true;

      this.apiService
        .transactionReport("StockAccStatementReport", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.stockBatchReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.stockBatchReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.credit_amount || '0');
            }, 0);

            this.totalDebit = this.stockBatchReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.debit_amount || '0');
            }, 0);
            this.totalCreditCount = this.stockBatchReport.reduce((acc: number, item: any) => {
              // Only count if debit is 0 and credit is non-zero
              return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
            }, 0);

            this.totalDebitCount = this.stockBatchReport.reduce((acc: number, item: any) => {
              // Only count if credit is 0 and debit is non-zero
              return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
            }, 0);
          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    }
    else if (this.routeName == "CashOutReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let data = {
        FromDate: `${fromDate} 00:00:00`,
        ToDate: `${toDate} 23:59:59`,
      };
      this.isLoading = true;

      this.apiService
        .transactionReport("CashOutReport", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;

            this.cashINReport = res
            this.agentSummaryReport = res
            this.calculatePagination();

          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    }
    else if (this.routeName == "BillPaymentReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let data = {
        FromDate: `${fromDate} 00:00:00`,
        ToDate: `${toDate} 23:59:59`,
      };
      this.isLoading = true;

      this.apiService
        .transactionReport("BillPaymentReport", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.cashINReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    }
    else if (this.routeName == "MyMoneyStatement") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let data = {
        FromDate: `${fromDate} 00:00:00`,
        ToDate: `${toDate} 23:59:59`,
      };
      this.isLoading = true;

      this.apiService
        .transactionReport("MyMoneyStatement", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.cashINReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.credit || '0');
            }, 0);

            this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.debit || '0');
            }, 0);
            this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
              // Only count if debit is 0 and credit is non-zero
              return acc + (parseFloat(item?.debit) === 0 && parseFloat(item?.credit) !== 0 ? 1 : 0);
            }, 0);

            this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
              // Only count if credit is 0 and debit is non-zero
              return acc + (parseFloat(item?.credit) === 0 && parseFloat(item?.debit) !== 0 ? 1 : 0);
            }, 0);
          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    } else if (this.routeName == "AggregateVolAndValTransaction") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let data = {
        FromDate: `${fromDate} 00:00:00`,
        ToDate: `${toDate} 23:59:59`,
      };
      this.isLoading = true;

      this.apiService
        .transactionReport("AggregateVolAndValTransaction", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.cashINReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.total_credit || '0');
            }, 0);

            this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.total_debit || '0');
            }, 0);
          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    }

    else if (this.routeName == "TokenPaymentReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let data = {
        FromDate: `${fromDate} 00:00:00`,
        ToDate: `${toDate} 23:59:59`,
      };
      this.isLoading = true;

      this.apiService
        .transactionReport("TokenPaymentReport", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.cashINReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.total_credit || '0');
            }, 0);

            this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.total_debit || '0');
            }, 0);
          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    }
    else if (this.routeName == "TokenTransactionReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let data = {
        FromDate: `${fromDate} 00:00:00`,
        ToDate: `${toDate} 23:59:59`,
      };
      this.isLoading = true;

      this.apiService
        .transactionReport("TokenTransactionReport", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.cashINReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.total_credit || '0');
            }, 0);

            this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.total_debit || '0');
            }, 0);
          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    }
    else if (this.routeName == "TokenUnredeemedReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let data = {
        FromDate: `${fromDate} 00:00:00`,
        ToDate: `${toDate} 23:59:59`,
      };
      this.isLoading = true;

      this.apiService
        .transactionReport("TokenUnredeemedReport", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.cashINReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.total_credit || '0');
            }, 0);

            this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.total_debit || '0');
            }, 0);
          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    }
    else if (this.routeName == "TokenWithdrawalReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let data = {
        FromDate: `${fromDate} 00:00:00`,
        ToDate: `${toDate} 23:59:59`,
      };
      this.isLoading = true;

      this.apiService
        .transactionReport("TokenWithdrawalReport", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.cashINReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.total_credit || '0');
            }, 0);

            this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.total_debit || '0');
            }, 0);
          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    }


    else if (this.routeName == "IncomeProductReport") {
      let array: any[] = []
      const reportResults: { [key: string]: any[] } = {};
      let body = {
        FromDate: this.fromDate,
        ToDate: this.toDate
      }
      if (this.selectedValue == 'DABS') {
        array = ['IncomeBreshnaCustomerReport', 'IncomeBreshnaDirectAgentReport',
          'IncomeBreshnaInDirectAgentReport', 'IncomeBreshnaMerchantReport']
      } else if (this.selectedValue == 'Awcc') {
        array = ['IncomeAwccCustomerReport', 'IncomeAwccDirectAgentReport',
          'IncomeAwccInDirectAgentReport', 'IncomeAwccMerchantReport']
      } else if (this.selectedValue == 'NonAwcc') {
        array = ['IncomeNonAwccCustomerReport', 'IncomeNonAwccDirectAgentReport',
          'IncomeNonAwccInDirectAgentReport', 'IncomeNonAwccMerchantReport']
      } else if (this.selectedValue == 'Awcc_Bundle') {
        array = ['IncomeAwccBundleCustomerReport', 'IncomeAwccBundleDirectAgentReport',
          'IncomeAwccBundleInDirectAgentReport', 'IncomeAwccBundleMerchantReport']
      }

      this.isLoading = true;
      from(array).pipe(
        concatMap(reportType =>
          this.apiService.transactionReport(reportType, body).pipe(
            map((response: any) => {
              return { reportType, response };
            })
          )
        ),
        finalize(() => {
          this.isLoading = false;
          if (this.selectedValue == 'DABS') {
            this.groupedDataNewAwcc = {}
            this.groupedDataNew = reportResults;
          } else if (this.selectedValue == 'Awcc' || this.selectedValue == 'NonAwcc') {
            this.groupedDataNew = {}
            this.groupedDataNewAwcc = reportResults;
          }

        })
      ).subscribe({
        next: ({ reportType, response }) => {
          reportResults[reportType] = response;

          console.log(this.groupedDataNew)
          console.log(reportResults, 'reportResults')
        },
        error: (err) => {
          this.isLoading = false;
          alert('Error Try Again');
        }
      });

    } else if (this.routeName == "FloatAccMovement") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let data = {
        FromDate: `${fromDate} 00:00:00`,
        ToDate: `${toDate} 23:59:59`,
        AccNo: this.dateForm.controls["type"].value,
      };
      this.isLoading = true;
      console.log(data)
      this.apiService
        .transactionReport("FloatAccMovement", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.cashINReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.credit || '0');
            }, 0);

            this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.debit || '0');
            }, 0);
            this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
              // Only count if debit is 0 and credit is non-zero
              return acc + (parseFloat(item?.debit) === 0 && parseFloat(item?.credit) !== 0 ? 1 : 0);
            }, 0);

            this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
              // Only count if credit is 0 and debit is non-zero
              return acc + (parseFloat(item?.credit) === 0 && parseFloat(item?.debit) !== 0 ? 1 : 0);
            }, 0);
          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    }
    else if (this.routeName == "IncomeReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let data = {
        FromDate: `${fromDate} 00:00:00`,
        ToDate: `${toDate} 23:59:59`,
      };
      this.isLoading = true;

      this.apiService
        .transactionReport("IncomeReport", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.cashINReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.credit || '0');
            }, 0);

            this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.debit || '0');
            }, 0);
            this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
              // Only count if debit is 0 and credit is non-zero
              return acc + (parseFloat(item?.debit) === 0 && parseFloat(item?.credit) !== 0 ? 1 : 0);
            }, 0);

            this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
              // Only count if credit is 0 and debit is non-zero
              return acc + (parseFloat(item?.credit) === 0 && parseFloat(item?.debit) !== 0 ? 1 : 0);
            }, 0);
          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    }
    else if (this.routeName == "TopupInventoryReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let data = {
        FromDate: `${fromDate} 00:00:00`,
        ToDate: `${toDate} 23:59:59`,
      };
      this.isLoading = true;

      this.apiService
        .transactionReport("TopupInventoryReport", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.cashINReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.credit || '0');
            }, 0);

            this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.debit || '0');
            }, 0);
            this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
              // Only count if debit is 0 and credit is non-zero
              return acc + (parseFloat(item?.debit) === 0 && parseFloat(item?.credit) !== 0 ? 1 : 0);
            }, 0);

            this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
              // Only count if credit is 0 and debit is non-zero
              return acc + (parseFloat(item?.credit) === 0 && parseFloat(item?.debit) !== 0 ? 1 : 0);
            }, 0);
          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    } else if (this.routeName == "VoiceDtaBundleActivationReport") {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      let data = {
        FromDate: `${fromDate} 00:00:00`,
        ToDate: `${toDate} 23:59:59`,
      };
      this.isLoading = true;

      this.apiService
        .transactionReport("VoiceDtaBundleActivationReport", data).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.cashINReport = res
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.credit || '0');
            }, 0);

            this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.debit || '0');
            }, 0);
            this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
              // Only count if debit is 0 and credit is non-zero
              return acc + (parseFloat(item?.debit) === 0 && parseFloat(item?.credit) !== 0 ? 1 : 0);
            }, 0);

            this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
              // Only count if credit is 0 and debit is non-zero
              return acc + (parseFloat(item?.credit) === 0 && parseFloat(item?.debit) !== 0 ? 1 : 0);
            }, 0);
          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    }
    else if (this.routeName == "BatchReport") {
      let data = {
        batchId: this.batchId,
      };
      this.isLoading = true;

      this.apiService.transactionReport("BatchReport", data).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          let data = res?.sort((a: any, b: any) => a?.id - b?.id)
          console.log(data, '++++++_________')
          this.batchReport = data
          this.agentSummaryReport = data
          this.calculatePagination();
          this.totalCredit = this.batchReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.credit || '0');
          }, 0);

          this.totalDebit = this.batchReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.debit || '0');
          }, 0);
          this.totalCreditCount = this.batchReport.reduce((acc: number, item: any) => {
            // Only count if debit is 0 and credit is non-zero
            return acc + (parseFloat(item?.debit) === 0 && parseFloat(item?.credit) !== 0 ? 1 : 0);
          }, 0);

          this.totalDebitCount = this.batchReport.reduce((acc: number, item: any) => {
            // Only count if credit is 0 and debit is non-zero
            return acc + (parseFloat(item?.credit) === 0 && parseFloat(item?.debit) !== 0 ? 1 : 0);
          }, 0);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    } else if (this.routeName == "StockBatchReport") {
      let data = {
        batchId: this.batchId,
      };
      this.isLoading = true;

      this.apiService.transactionReport("StockBatchReport", data).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.stockBatchReport = res
          this.agentSummaryReport = res
          this.calculatePagination();
          this.totalCredit = this.stockBatchReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.credit_amount || '0');
          }, 0);

          this.totalDebit = this.stockBatchReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.debit_amount || '0');
          }, 0);
          this.totalCreditCount = this.stockBatchReport.reduce((acc: number, item: any) => {
            // Only count if debit is 0 and credit is non-zero
            return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
          }, 0);

          this.totalDebitCount = this.stockBatchReport.reduce((acc: number, item: any) => {
            // Only count if credit is 0 and debit is non-zero
            return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
          }, 0);
        },
        error: () => {
          this.isLoading = false;

          alert("Error Try Again");
        },
      });
    } else if (this.routeName == "AgentReconcilationReport") {
      let data = {
        AccNo: this.batchId,
      };
      this.isLoading = true;

      this.apiService.transactionReport("AgentReconcilationReport", data).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.stockBatchReport = res
          this.agentSummaryReport = res
          this.calculatePagination();
          this.totalCredit = this.stockBatchReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.credit_amount || '0');
          }, 0);

          this.totalDebit = this.stockBatchReport.reduce((acc: number, item: any) => {
            return acc + parseFloat(item?.debit_amount || '0');
          }, 0);
          this.totalCreditCount = this.stockBatchReport.reduce((acc: number, item: any) => {
            // Only count if debit is 0 and credit is non-zero
            return acc + (parseFloat(item?.debit_amount) === 0 && parseFloat(item?.credit_amount) !== 0 ? 1 : 0);
          }, 0);

          this.totalDebitCount = this.stockBatchReport.reduce((acc: number, item: any) => {
            // Only count if credit is 0 and debit is non-zero
            return acc + (parseFloat(item?.credit_amount) === 0 && parseFloat(item?.debit_amount) !== 0 ? 1 : 0);
          }, 0);
        },
        error: () => {
          this.isLoading = false;

          alert("Error Try Again");
        },
      });
    } else if (this.routeName == "QuarterlyProfitAndLoss") {
      let data = {
        Quarter: this.batchId,
      };
      this.isLoading = true;

      this.apiService
        .transactionReport("QuarterlyProfitAndLoss", data)
        .pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.quarterlyProfitAndLoss = res
            this.agentSummaryReport = res
            this.calculatePagination();
          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    } else if (this.routeName == "MonthlyProfitAndLoss") {
      let data = {
        Month: this.batchId,
      };
      this.isLoading = true;

      this.apiService
        .transactionReport("MonthlyProfitAndLoss", data)
        .pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;

            const blob = res;
            this.pdfSrc = blob;
          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    } else if (this.routeName == "MonthlyBalanceReport") {
      let yearSplit = this.year.split("-");
      let year = yearSplit[0];
      let monthSplit: any = yearSplit[1];
      let month;
      if (monthSplit.startsWith("0")) {
        let monthSplitData = monthSplit.split("");
        month = monthSplitData[1];
      } else {
        month = monthSplit;
      }

      this.isLoading = true;
      this.apiService.getBalanceSheetStatement(year, month).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res?.responseCode == 200) {
            this.resData = res;
            console.log(res.data);
            this.groupedData = this.groupData(res?.data);
            console.log(this.groupedData);
          }
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    } else if (this.routeName == "AccStatementReport") {
      this.getAccountStatementReport()
      this.getAccountStatementCurrentBalance()
    } else if (this.routeName == "ReversalReoport") {
      this.showDate = true;
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      this.isLoading = true;
      this.apiService
        .getReversalStatement(
          this.dateForm.controls["accNo"].value,
          fromDate,
          toDate
        ).pipe(finalize(() => {
          this.isLoading = false;
        }))
        .subscribe({
          next: (res: any) => {
            this.isLoading = false;
            if (res?.responseCode == 200) {
              console.log(res);
              this.accountStatementDetails = res?.data;
              this.agentSummaryReport = res?.data?.
                accStatementPojo
              if (res?.data?.accStatementPojo?.length > 0) {
                const runningBal = parseFloat(res.data.accStatementPojo[0].runningBal) || 0;
                const debit = parseFloat(res.data.accStatementPojo[0].debit) || 0;
                const credit = parseFloat(res.data.accStatementPojo[0].credit) || 0;
                const add = runningBal - credit
                this.openingBalanceNew = add + debit;
              } else {
                this.openingBalanceNew = 0; // Default value
              }
              const lastObject = res?.data?.accStatementPojo?.[res.data.accStatementPojo.length - 1];
              console.log(lastObject);
              this.closingBalNew = lastObject?.runningBal
              this.calculatePagination();
              this.totalCredit = this.accountStatementDetails?.accStatementPojo.reduce((acc: number, item: any) => {
                return acc + parseFloat(item?.credit || '0');
              }, 0);

              this.totalDebit = this.accountStatementDetails?.accStatementPojo.reduce((acc: number, item: any) => {
                return acc + parseFloat(item?.debit || '0');
              }, 0);
              this.totalCreditCount = this.accountStatementDetails?.accStatementPojo.reduce((acc: number, item: any) => {
                // Only count if debit is 0 and credit is non-zero
                return acc + (parseFloat(item?.debit) === 0 && parseFloat(item?.credit) !== 0 ? 1 : 0);
              }, 0);

              this.totalDebitCount = this.accountStatementDetails?.accStatementPojo.reduce((acc: number, item: any) => {
                // Only count if credit is 0 and debit is non-zero
                return acc + (parseFloat(item?.credit) === 0 && parseFloat(item?.debit) !== 0 ? 1 : 0);
              }, 0);
            }
          },
          error: () => {
            this.isLoading = false;

            alert("Error Try Again");
          },
        });
    } else if (this.routeName == "LctrView") {
      this.isLoading = true;
      let fromDate = this.fromDate;
      let toDate = this.toDate;
      console.log(fromDate, toDate)
      this.apiService
        .getLctrView(fromDate, toDate).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.agentSummaryReport = res
            this.calculatePagination();
            this.totalCredit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.credit || '0');
            }, 0);

            this.totalDebit = this.agentSummaryReport.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.debit || '0');
            }, 0);
            this.totalCreditCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
              // Only count if debit is 0 and credit is non-zero
              return acc + (parseFloat(item?.debit) === 0 && parseFloat(item?.credit) !== 0 ? 1 : 0);
            }, 0);

            this.totalDebitCount = this.agentSummaryReport.reduce((acc: number, item: any) => {
              // Only count if credit is 0 and debit is non-zero
              return acc + (parseFloat(item?.credit) === 0 && parseFloat(item?.debit) !== 0 ? 1 : 0);
            }, 0);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });
    } else if (this.routeName == "EMoneyTransactionReport") {
      // EMoneyTransactionReport
      this.showDate = true;
      // this.isLoading = true;
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      this.apiService.EmoneyTransReport(fromDate, toDate).subscribe({
        next: (res: any) => {
          this.agentSummaryReport = res?.data || [];
          console.log('EMoneyTransactionReport data:', this.agentSummaryReport);
        },
        error: () => {
          this.isLoading = false;
          alert("Error fetching EMoneyTransactionReport");
        },
      });
    }
  }

  groupData(data: any[]) {
    const grouped = data.reduce((acc: any, item: any) => {
      if (!acc[item.glType]) acc[item.glType] = {};
      if (!acc[item.glType][item.headAccNo])
        acc[item.glType][item.headAccNo] = [];
      acc[item.glType][item.headAccNo].push(item);
      return acc;
    }, {});

    return Object.entries(grouped).map(([glType, headAccounts]: any) => {
      return {
        glType,
        headAccounts: Object.entries(headAccounts).map(
          ([headAccNo, items]: any) => ({
            headAccNo,
            items,
          })
        ),
      };
    });
  }
  selectType(event: any) {
    console.log(event.target.value);
    this.selectedValue = event?.target?.value;
  }

  selectQuarter(event: any) {
    console.log(event.target.value);
    this.selectedQuaterValue = event?.target?.value;
  }

  @ViewChild("content") content!: ElementRef;
  @ViewChild("profitandloss") profitandloss!: ElementRef;
  @ViewChild("balanceSheet") balanceSheet!: ElementRef;
  @ViewChild("kycReport") kycReport!: ElementRef;
  @ViewChild("captureArea", { static: false }) captureArea!: ElementRef;
  // const doc = new jsPDF("p", "pt", "a4");
  // doc.html(this.content.nativeElement, {
  //   callback: function (doc) {
  //     doc.save("account-statement.pdf");
  //   },
  //   x: 20,
  //   y: 20,
  //   margin: [7, 7, 7, 7],
  //   autoPaging: "text",
  //   width: 550,
  //   windowWidth: 800,
  // });
  formatDate(date: string) {
    const d = new Date(date);
    const formatteddate = d.toLocaleDateString('en-GB');
    return formatteddate;
  }
  //jasper download
  downloadJasperPDF() {
    if (this.routeName == "WrongAttemptUsersReport") {
      this.apiService.downloadJasperPDF('WrongAttemptUsersReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'WrongAttemptUsersReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "LargeDepositMoreAFNFollowedByRapidWithdrawals") {
      this.apiService.downloadJasperPDF('LargeDepositMoreAFNFollowedByRapidWithdrawals', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'LargeDepositMoreAFNFollowedByRapidWithdrawals.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "MultipleWithdrawalsAfterLargeDepositReport") {
      this.apiService.downloadJasperPDF('MultipleWithdrawalsAfterLargeDepositReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'MultipleWithdrawalsAfterLargeDepositReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "RejectedAccounts") {
      this.apiService.downloadJasperPDF('RejectedAccounts', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'RejectedAccounts.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "AuthorizedMerchantReport") {
      this.apiService.downloadJasperPDF('AuthorizedMerchantReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'AuthorizedMerchantReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "AccountOpenAndActiveWithNoDepositReport") {
      this.apiService.downloadJasperPDF('AccountOpenAndActiveWithNoDepositReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'AccountOpenAndActiveWithNoDepositReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "AccountsOpenedWithMinimalInformationReport") {
      this.apiService.downloadJasperPDF('AccountsOpenedWithMinimalInformationReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'AccountsOpenedWithMinimalInformationReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "CashTransactionsExceedingAFNReport") {
      this.apiService.downloadJasperPDF('CashTransactionsExceedingAFNReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'CashTransactionsExceedingAFNReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "IncreaseInCustomerTransactionsReport") {
      this.apiService.downloadJasperPDF('IncreaseInCustomerTransactionsReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'IncreaseInCustomerTransactionsReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "FrequentSmallDepositTransactions") {
      this.apiService.downloadJasperPDF('FrequentSmallDepositTransactions', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'FrequentSmallDepositTransactions.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "MultipleSmallWithdrawalsReport") {
      this.apiService.downloadJasperPDF('MultipleSmallWithdrawalsReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'MultipleSmallWithdrawalsReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "OverTheLimitTransactionReport") {
      this.apiService.downloadJasperPDF('OverTheLimitTransactionReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'OverTheLimitTransactionReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "AccountOpenedByIndividualWithHistoryOfFinancialCrimeReport") {
      this.apiService.downloadJasperPDF('AccountOpenedByIndividualWithHistoryOfFinancialCrimeReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'AccountOpenedByIndividualWithHistoryOfFinancialCrimeReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "AuditTrailsReport") {
      this.apiService.downloadJasperPDF('AuditTrailsReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'AuditTrailsReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "SystemAccessControlsReport") {
      this.apiService.downloadJasperPDF('SystemAccessControlsReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'SystemAccessControlsReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "SystemDormentAccountsReport") {
      this.apiService.downloadJasperPDF('SystemDormentAccountsReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'SystemDormentAccountsReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "InternationalandNationalRemittanceTransactionReport") {
      this.apiService.downloadJasperPDF('InternationalandNationalRemittanceTransactionReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'InternationalandNationalRemittanceTransactionReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "OperationalReport") {
      this.apiService.downloadJasperPDF('OperationalReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'OperationalReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "ComplianceReport") {
      this.apiService.downloadJasperPDF('ComplianceReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'ComplianceReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "TransactionWithAtomaPay") {
      let data = {
        pDate: this.dateForm.controls["p_date"].value,
        status: this.dateForm.controls["atomaStatus"].value
      };
      this.apiService.downloadJasperPDF('TransactionViaAtomaPayReport', data).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'TransactionWithAtomaPay.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "AutomatedAlertsandNotificationsReport") {
      this.apiService.downloadJasperPDF('AutomatedAlertsandNotificationsReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'AutomatedAlertsandNotificationsReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "TransactionSentToOrReceivedFromPoliticalExposedPersonReport") {
      this.apiService.downloadJasperPDF('TransactionSentToOrReceivedFromPoliticalExposedPersonReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'TransactionSentToOrReceivedFromPoliticalExposedPersonReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
  }
  downloadJasperExcel() {
    this.isLoading = true;
    if (this.routeName == "WrongAttemptUsersReport") {
      this.apiService.downloadJasperEXCEL('WrongAttemptUsersReport', {})
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'WrongAttemptUsersReport.xlsx';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });

    }
    else if (this.routeName == "LargeDepositMoreAFNFollowedByRapidWithdrawals") {
      this.apiService.downloadJasperEXCEL('LargeDepositMoreAFNFollowedByRapidWithdrawals', {})
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'LargeDepositMoreAFNFollowedByRapidWithdrawals.xlsx';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });

    }
    else if (this.routeName == "MultipleWithdrawalsAfterLargeDepositReport") {
      this.apiService.downloadJasperEXCEL('MultipleWithdrawalsAfterLargeDepositReport', {})
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'MultipleWithdrawalsAfterLargeDepositReport.xlsx';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });

    }
    else if (this.routeName == "RejectedAccounts") {
      this.apiService.downloadJasperEXCEL('RejectedAccounts', {})
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'RejectedAccounts.xlsx';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });

    }
    else if (this.routeName == "AuthorizedMerchantReport") {
      this.apiService.downloadJasperEXCEL('AuthorizedMerchantReport', {})
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'AuthorizedMerchantReport.xlsx';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });

    }
    else if (this.routeName == "AccountOpenAndActiveWithNoDepositReport") {
      this.apiService.downloadJasperEXCEL('AccountOpenAndActiveWithNoDepositReport', {})
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'AccountOpenAndActiveWithNoDepositReport.xlsx';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });

    }
    else if (this.routeName == "AccountsOpenedWithMinimalInformationReport") {
      this.apiService.downloadJasperEXCEL('AccountsOpenedWithMinimalInformationReport', {})
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'AccountsOpenedWithMinimalInformationReport.xlsx';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });

    }
    else if (this.routeName == "CashTransactionsExceedingAFNReport") {
      this.apiService.downloadJasperEXCEL('CashTransactionsExceedingAFNReport', {})
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'CashTransactionsExceedingAFNReport.xlsx';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });

    }
    else if (this.routeName == "IncreaseInCustomerTransactionsReport") {
      this.apiService.downloadJasperEXCEL('IncreaseInCustomerTransactionsReport', {})
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'IncreaseInCustomerTransactionsReport.xlsx';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });

    }
    else if (this.routeName == "FrequentSmallDepositTransactions") {
      this.apiService.downloadJasperEXCEL('FrequentSmallDepositTransactions', {})
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'FrequentSmallDepositTransactions.xlsx';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });

    }
    else if (this.routeName == "MultipleSmallWithdrawalsReport") {
      this.apiService.downloadJasperEXCEL('MultipleSmallWithdrawalsReport', {})
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'MultipleSmallWithdrawalsReport.xlsx';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });

    }
    else if (this.routeName == "OverTheLimitTransactionReport") {
      this.apiService.downloadJasperEXCEL('OverTheLimitTransactionReport', {})
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'OverTheLimitTransactionReport.xlsx';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });

    }
    else if (this.routeName == "AccountOpenedByIndividualWithHistoryOfFinancialCrimeReport") {
      this.apiService.downloadJasperEXCEL('AccountOpenedByIndividualWithHistoryOfFinancialCrimeReport', {})
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'AccountOpenedByIndividualWithHistoryOfFinancialCrimeReport.xlsx';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });

    }
    else if (this.routeName == "AuditTrailsReport") {
      this.apiService.downloadJasperEXCEL('AuditTrailsReport', {})
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'AuditTrailsReport.xlsx';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });

    }
    else if (this.routeName == "SystemAccessControlsReport") {
      this.apiService.downloadJasperEXCEL('SystemAccessControlsReport', {})
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'SystemAccessControlsReport.xlsx';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });

    }
    else if (this.routeName == "SystemDormentAccountsReport") {
      this.apiService.downloadJasperEXCEL('SystemDormentAccountsReport', {})
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'SystemDormentAccountsReport.xlsx';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });

    }
    else if (this.routeName == "InternationalandNationalRemittanceTransactionReport") {
      this.apiService.downloadJasperEXCEL('InternationalandNationalRemittanceTransactionReport', {})
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'InternationalandNationalRemittanceTransactionReport.xlsx';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });

    }
    else if (this.routeName == "OperationalReport") {
      this.apiService.downloadJasperEXCEL('OperationalReport', {})
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'OperationalReport.xlsx';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });

    }
    else if (this.routeName == "ComplianceReport") {
      this.apiService.downloadJasperEXCEL('ComplianceReport', {})
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'ComplianceReport.xlsx';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });

    }
    else if (this.routeName == "TransactionWithAtomaPay") {
      let data = {
        pDate: this.dateForm.controls["p_date"].value,
        status: this.dateForm.controls["atomaStatus"].value
      };
      this.apiService.downloadJasperEXCEL('TransactionViaAtomaPayReport', data)
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'TransactionWithAtomaPay.xlsx';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });

    }
    else if (this.routeName == "AutomatedAlertsandNotificationsReport") {
      this.apiService.downloadJasperEXCEL('AutomatedAlertsandNotificationsReport', {})
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'AutomatedAlertsandNotificationsReport.xlsx';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });

    }
    else if (this.routeName == "TransactionSentToOrReceivedFromPoliticalExposedPersonReport") {
      this.apiService.downloadJasperEXCEL('TransactionSentToOrReceivedFromPoliticalExposedPersonReport', {})
        .subscribe({
          next: (data: Blob) => {
            this.isLoading = false;
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'TransactionSentToOrReceivedFromPoliticalExposedPersonReport.xlsx';
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          },
          error: () => {
            this.isLoading = false;
            alert("Error Try Again");
          },
        });
    }
  }
  downloadJasperCSV() {
    if (this.routeName == "WrongAttemptUsersReport") {
      this.apiService.downloadJasperCSV('WrongAttemptUsersReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'WrongAttemptUsersReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "LargeDepositMoreAFNFollowedByRapidWithdrawals") {
      this.apiService.downloadJasperCSV('LargeDepositMoreAFNFollowedByRapidWithdrawals', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'LargeDepositMoreAFNFollowedByRapidWithdrawals.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "MultipleWithdrawalsAfterLargeDepositReport") {
      this.apiService.downloadJasperCSV('MultipleWithdrawalsAfterLargeDepositReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'MultipleWithdrawalsAfterLargeDepositReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "RejectedAccounts") {
      this.apiService.downloadJasperCSV('RejectedAccounts', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'RejectedAccounts.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "AuthorizedMerchantReport") {
      this.apiService.downloadJasperCSV('AuthorizedMerchantReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'AuthorizedMerchantReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "AccountOpenAndActiveWithNoDepositReport") {
      this.apiService.downloadJasperCSV('AccountOpenAndActiveWithNoDepositReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'AccountOpenAndActiveWithNoDepositReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "AccountsOpenedWithMinimalInformationReport") {
      this.apiService.downloadJasperCSV('AccountsOpenedWithMinimalInformationReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'AccountsOpenedWithMinimalInformationReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "CashTransactionsExceedingAFNReport") {
      this.apiService.downloadJasperCSV('CashTransactionsExceedingAFNReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'CashTransactionsExceedingAFNReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "IncreaseInCustomerTransactionsReport") {
      this.apiService.downloadJasperCSV('IncreaseInCustomerTransactionsReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'IncreaseInCustomerTransactionsReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "FrequentSmallDepositTransactions") {
      this.apiService.downloadJasperCSV('FrequentSmallDepositTransactions', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'FrequentSmallDepositTransactions.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "MultipleSmallWithdrawalsReport") {
      this.apiService.downloadJasperCSV('MultipleSmallWithdrawalsReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'MultipleSmallWithdrawalsReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "OverTheLimitTransactionReport") {
      this.apiService.downloadJasperCSV('OverTheLimitTransactionReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'OverTheLimitTransactionReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "AccountOpenedByIndividualWithHistoryOfFinancialCrimeReport") {
      this.apiService.downloadJasperCSV('AccountOpenedByIndividualWithHistoryOfFinancialCrimeReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'AccountOpenedByIndividualWithHistoryOfFinancialCrimeReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "AuditTrailsReport") {
      this.apiService.downloadJasperCSV('AuditTrailsReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'AuditTrailsReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "SystemAccessControlsReport") {
      this.apiService.downloadJasperCSV('SystemAccessControlsReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'SystemAccessControlsReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "SystemDormentAccountsReport") {
      this.apiService.downloadJasperCSV('SystemDormentAccountsReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'SystemDormentAccountsReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "InternationalandNationalRemittanceTransactionReport") {
      this.apiService.downloadJasperCSV('InternationalandNationalRemittanceTransactionReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'InternationalandNationalRemittanceTransactionReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "OperationalReport") {
      this.apiService.downloadJasperCSV('OperationalReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'OperationalReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "ComplianceReport") {
      this.apiService.downloadJasperCSV('ComplianceReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'ComplianceReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "TransactionWithAtomaPay") {
      let data = {
        pDate: this.dateForm.controls["p_date"].value,
        status: this.dateForm.controls["atomaStatus"].value
      };
      this.apiService.downloadJasperCSV('TransactionViaAtomaPayReport', data).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'TransactionWithAtomaPay.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "AutomatedAlertsandNotificationsReport") {
      this.apiService.downloadJasperCSV('AutomatedAlertsandNotificationsReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'AutomatedAlertsandNotificationsReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "TransactionSentToOrReceivedFromPoliticalExposedPersonReport") {
      this.apiService.downloadJasperCSV('TransactionSentToOrReceivedFromPoliticalExposedPersonReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'TransactionSentToOrReceivedFromPoliticalExposedPersonReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
  }
  //jasper download
  makePdf() {
    if (this.routeName == 'AccStatementReport' || this.routeName == 'ReversalReoport') {
      this.KycModuleService.getProfileDetails().subscribe(response => {
        if (response?.responseCode == 200) {
          this.backOfficeUser = response?.data?.firstName + ' ' + response?.data?.lastName;
        }
      })
      const doc = new jsPDF("p", "pt", "a4");
      let heading: any;
      if (this.routeName == 'AccStatementReport') {
        heading = 'Account Statement'
      } else if (this.routeName == 'ReversalReoport') {
        heading = 'Account Statement With Reversal'
      }
      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 42, 22, 70, 40);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 70);
        doc.text('Darulaman Road, Hajari Najari,', 40, 82);
        doc.text('KABUL, AFGHANISTAN', 40, 94);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text(`${heading}`, 380, 40);

        const startX = 380;
        const startY = 50;
        const lineSpacing = 12;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const userDetails = this.accountStatementDetails?.userDetailsPojo;
        const fromDate = this.formatDate(this.dateForm.controls["fromDate"].value);
        const toDate = this.formatDate(this.dateForm.controls["toDate"].value);
        //const backOfficeUser = this.backOfficeUser;
        doc.text(`Name: ${userDetails?.name}`, startX, startY);
        doc.text(`Phone: ${userDetails?.phone}`, startX, startY + lineSpacing);
        doc.text(`Account Number: ${userDetails?.accNo}`, startX, startY + 2 * lineSpacing);
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 3 * lineSpacing);
        doc.text(`Opening Balance: ${Number(this.openingBalanceNew).toFixed(2)}`, startX, startY + 4 * lineSpacing);
        doc.text(`Closing Balance: ${Number(this.closingBalNew).toFixed(2)}`, startX, startY + 5 * lineSpacing);
        doc.text(`Current Balance: ${Number(this.currentBalance).toFixed(2)} (As on ${this.datePipe.transform(this.currentDateTime, 'dd-MM-yyyy hh:mm a')})`, startX, startY + 6 * lineSpacing, { maxWidth: 500 });
        doc.text(`Printed By: ${this.backOfficeUser}`, startX, startY + 7 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data -        // { header: 'Contra_Acc', dataKey: 'contraAcc' },

      const columns = [
        { header: 'Txn_Date', dataKey: 'txnDate' },
        { header: 'Service_Name', dataKey: 'serviceName' },
        { header: 'Description', dataKey: 'description' },
        // { header: 'Sender', dataKey: 'senderName' },
        // { header: 'Receiver', dataKey: 'receiverName' },
        { header: 'Txn_ID', dataKey: 'batchId' },
        { header: 'External_Ref_No', dataKey: 'extRefNumber' },
        { header: 'Purpose', dataKey: 'narration' },
        { header: 'Debit', dataKey: 'debit' },
        { header: 'Credit', dataKey: 'credit' },
        { header: 'Balance', dataKey: 'runningBal' }
      ];

      const data = this.accountStatementDetails?.accStatementPojo.map((item: any) => ({
        ...item,
        debit: Number(item.debit || 0).toFixed(3),
        credit: Number(item.credit || 0).toFixed(3),
        runningBal: Number(item.runningBal || 0).toFixed(3),
      }));

      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 152, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 7,
        },
        bodyStyles: {
          fontSize: 6,
        },
        margin: { top: 152 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      //const pageHeight = doc.internal.pageSize.height;
      //const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom
      const footerY = (doc as any).lastAutoTable.finalY + 20; // 20px gap after the table
      // Add summary right after the table
      const finalY = (doc as any).lastAutoTable.finalY + 10; // small gap below table
      doc.setDrawColor(0, 0, 0); // black color
      doc.setLineWidth(0.5);     // thickness of the line
      doc.line(50, finalY - 5, 545, finalY - 5); // x1, y1, x2, y2 (left to right)

      autoTable(doc, {
        startY: finalY,
        head: [['', '', '']], // no header row
        body: [
          ['Total Debit', this.totalDebitCount, this.totalDebit.toFixed(2)],
          ['Total Credit', this.totalCreditCount, this.totalCredit.toFixed(2)],
          ['Closing Balance', '', this.closingBalNew]
        ],
        theme: 'plain',
        tableWidth: 400, // broader width for centered look
        margin: { left: (595.28 - 400) / 2 }, // center align for A4 (595.28pt wide)
        styles: {
          fontSize: 9,
          cellPadding: 4,
          lineColor: [0, 0, 0],
          lineWidth: 0,
        },
        columnStyles: {
          0: { halign: 'left', cellWidth: 150 },
          1: { halign: 'center', cellWidth: 80 },
          2: { halign: 'right', cellWidth: 100 },
        },
        didParseCell: (data) => {
          // Make Closing Balance bold
          if (data.row.index === 2) {
            data.cell.styles.fontStyle = 'bold';
          }
        },
      });

      doc.setFontSize(10);

      /*       doc.text('Total Credit Count:', 40, footerY + 40);
            doc.text(`${this.totalCreditCount}`, 130, footerY + 40);
             doc.text('Total Debit Count:', 440, footerY + 40);
            doc.text(`${this.totalDebitCount}`, 520, footerY + 40); 
      
             doc.text('Closing Balance:', 440, footerY + 60);
            doc.text(`${this.closingBalNew}`, 520, footerY + 60);  */



      /* doc.text('Total Credit:', 40, footerY);
     doc.text(`${this.totalCredit.toFixed(2)}`, 150, footerY); */

      /* doc.text('Total Debit:', 150, footerY + 20);
      doc.text(`${this.totalDebit.toFixed(2)}`, 155, footerY + 20); */





      // Save the PDF
      if (this.routeName == 'AccStatementReport') {
        doc.save('account-statement.pdf');
      } else if (this.routeName == 'ReversalReoport') {
        doc.save('account-statement-with-reversal.pdf');
      }
    } else if (this.routeName == 'MyMoneyStatement' || this.routeName == 'VoiceDtaBundleActivationReport'
      || this.routeName == 'IncomeProductReport' || this.routeName == 'FloatAccMovement') {
      const doc = new jsPDF("p", "pt", "a4");
      let heading: any;
      if (this.routeName == 'MyMoneyStatement') {
        heading = 'Your MyMoney Report Statement'
      } else if (this.routeName == 'VoiceDtaBundleActivationReport') {
        heading = 'Voice Data Bundle Activation Statement'
      } else if (this.routeName == 'IncomeProductReport') {
        heading = 'Income Product Report Statement'
      } else if (this.routeName == 'FloatAccMovement') {
        heading = 'Float Account Movement Statement'
      }
      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text(`${heading}`, 380, 30);

        const startX = 380;
        const startY = 40;
        const lineSpacing = 12;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 0.4 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 1.4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      const columns = [
        { header: 'Txn_Date', dataKey: 'txn_date' },
        { header: 'Service_Name', dataKey: 'service_name' },
        { header: 'AccNo', dataKey: 'acc_number' },
        { header: 'Description', dataKey: 'description' },
        { header: 'Txn_ID', dataKey: 'batch_id' },
        { header: 'Gl_Type', dataKey: 'gl_type' },
        { header: 'Contra_Acc', dataKey: 'contraAcc' },
        { header: 'Debit', dataKey: 'debit' },
        { header: 'Credit', dataKey: 'credit' },
        { header: 'Balance', dataKey: 'running_balance' },
      ];

      const data = this.agentSummaryReport

      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 8,
        },
        bodyStyles: {
          fontSize: 6,
        },
        margin: { top: 110 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom

      doc.setFontSize(10);
      doc.text('Total Credit:', 40, footerY);
      doc.text(`${this.totalCredit.toFixed(2)}`, 150, footerY);

      doc.text('Total Debit:', 40, footerY + 20);
      doc.text(`${this.totalDebit.toFixed(2)}`, 150, footerY + 20);

      doc.text('Total Credit Count:', 40, footerY + 40);
      doc.text(`${this.totalCreditCount}`, 150, footerY + 40);

      doc.text('Total Debit Count:', 40, footerY + 60);
      doc.text(`${this.totalDebitCount}`, 150, footerY + 60);

      // Save the PDF
      if (this.routeName == 'MyMoneyStatement') {
        doc.save('MyMoney-Statement.pdf');
      } else if (this.routeName == 'VoiceDtaBundleActivationReport') {
        doc.save('Voice-Data-Bundle-Activation-Report.pdf');
      } else if (this.routeName == 'IncomeProductReport') {
        doc.save('IncomeProductReport.pdf');
      } else if (this.routeName == 'FloatAccMovement') {
        doc.save('FloatAccMovementReport.pdf');
      }
    }
    else if (this.routeName == 'TransactionSummaryReport'
      || this.routeName == 'StockBatchReport'
      || this.routeName == 'StockAccStatementReport'
      || this.routeName == 'AgentReconcilationReport') {
      const doc = new jsPDF("p", "pt", "a4");

      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        if (this.routeName == 'TransactionSummaryReport') {
          doc.text('Transaction-Summary Report Statement', 380, 30);
        } else if (this.routeName == 'StockBatchReport') {
          doc.text('StockBatch Report Statement', 380, 30);
        } else if (this.routeName == 'AgentReconcilationReport') {
          doc.text('Agent-Reconcilation Report Statement', 380, 30);
        } else if (this.routeName == 'StockAccStatementReport') {
          doc.text('Stock Account-Statement Report Statement', 380, 30);
        }
        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      let columns: any[] = []
      if (this.routeName == 'TransactionSummaryReport') {
        columns = [
          { header: 'Txn_Date', dataKey: 'trxn_date' },
          { header: 'Service Name', dataKey: 'service_name' },
          { header: 'Description', dataKey: 'description' },
          { header: 'Account No', dataKey: 'account' },
          { header: 'Txn_ID', dataKey: 'batch_id' },
          { header: 'Credit', dataKey: 'credit_amount' },
          { header: 'Debit', dataKey: 'debit_amount' },
        ];
      } else if (this.routeName == 'StockBatchReport' || this.routeName == 'AgentReconcilationReport'
        || this.routeName == 'StockAccStatementReport'
      ) {
        columns = [
          { header: 'Txn_Date', dataKey: 'txn_date' },
          { header: 'Service Name', dataKey: 'service_name' },
          { header: 'Description', dataKey: 'description' },
          { header: 'Account No', dataKey: 'account_number' },
          { header: 'Txn_ID', dataKey: 'transaction_no' },
          { header: 'Head', dataKey: 'head' },
          { header: 'Credit', dataKey: 'credit_amount' },
          { header: 'Debit', dataKey: 'debit_amount' },
        ];
      }

      const data = this.agentSummaryReport

      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom

      doc.setFontSize(10);
      doc.text('Total Credit:', 40, footerY);
      doc.text(`${this.totalCredit.toFixed(2)}`, 150, footerY);

      doc.text('Total Debit:', 40, footerY + 20);
      doc.text(`${this.totalDebit.toFixed(2)}`, 150, footerY + 20);

      doc.text('Total Credit Count:', 40, footerY + 40);
      doc.text(`${this.totalCreditCount}`, 150, footerY + 40);

      doc.text('Total Debit Count:', 40, footerY + 60);
      doc.text(`${this.totalDebitCount}`, 150, footerY + 60);

      // Save the PDF
      if (this.routeName == 'TransactionSummaryReport') {
        doc.save('transaction-summary-report.pdf');
      } else if (this.routeName == 'StockBatchReport') {
        doc.save('StockBatchReport.pdf');
      } else if (this.routeName == 'AgentReconcilationReport') {
        doc.save('AgentReconcilationReport.pdf');
      } else if (this.routeName == 'StockAccStatementReport') {
        doc.save('StockAccStatementReport.pdf');
      }
    }
    else if (this.routeName == 'BalanceSheet' || this.routeName === 'MonthlyBalanceReport' || this.routeName === 'ProfitAndLossReport') {
      const doc = new jsPDF('p', 'pt', 'a4');

      // Header Function
      const addHeader = () => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        const reportType =
          this.routeName === 'BalanceSheet'
            ? 'Yearly Balance Sheet Report'
            : this.routeName === 'ProfitAndLossReport'
              ? 'Profit and Loss Report'
              : 'Monthly Balance Sheet Report';
        doc.text(reportType, 380, 30);

        const startX = 380;
        const startY = 45;
        const lineSpacing = 10;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls['fromDate'].value;
        const toDate = this.dateForm.controls['toDate'].value;
        const backOfficeUser = this.backOfficeUser;

        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + lineSpacing);
      };

      // Call Header
      addHeader();

      // Transform API Data into Grouped Data
      const groupedData = this.groupedData; // Already grouped in your app logic

      // Table Columns
      const columns = [
        { header: 'GL Type', dataKey: 'glType' },
        { header: 'Head Account No', dataKey: 'headAccNo' },
        { header: 'Sub Account No', dataKey: 'subHeadAccNo' },
        { header: 'Sub Account Balance', dataKey: 'subBalance' },
        { header: 'Head Account Balance', dataKey: 'headBalance' },
      ];

      // Prepare Table Data
      const tableBody: any[] = [];
      groupedData.forEach((glTypeGroup: any) => {
        glTypeGroup.headAccounts.forEach((headAcc: any, headIndex: number) => {
          headAcc.items.forEach((item: any, itemIndex: number) => {
            tableBody.push({
              glType: headIndex === 0 && itemIndex === 0 ? glTypeGroup.glType : '',
              headAccNo: itemIndex === 0 ? headAcc.headAccNo : '',
              subHeadAccNo: item.subHeadAccNo,
              subBalance: item.subBalance,
              headBalance: itemIndex === 0 ? item.headBalance : '',
            });
          });
        });
      });

      // Generate Table with AutoTable
      autoTable(doc, {
        columns: columns,
        body: tableBody,
        startY: 100,
        headStyles: {
          fillColor: [244, 122, 32], // Orange header
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        columnStyles: {
          glType: { cellWidth: 80 },
          headAccNo: { cellWidth: 120 },
          subHeadAccNo: { cellWidth: 120 },
          subBalance: { cellWidth: 100, halign: 'right' },
          headBalance: { cellWidth: 100, halign: 'right' },
        },
        didDrawPage: () => {
          // Add Header to each page
          addHeader();
        },
        margin: { top: 100 }, // Avoid overlapping with the header
      });


      // Save the PDF
      if (this.routeName === 'BalanceSheet') {
        doc.save('Yearly-balance-sheet-report.pdf');
      } else if (this.routeName === 'MonthlyBalanceReport') {
        doc.save('MonthlyBalance-report.pdf');
      } else if (this.routeName === 'ProfitAndLossReport') {
        doc.save('ProfitAndLoss-report.pdf');
      }
    }
    else if (this.routeName == 'CashInReport' ||
      this.routeName == 'CashOutReport' ||
      this.routeName == 'BillPaymentReport' ||
      this.routeName == 'RefundReport') {
      const doc = new jsPDF("p", "pt", "a4");
      console.log('hi');

      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        if (this.routeName == 'CashInReport') {
          doc.text('Cash-In Statement', 380, 30);
        } else if (this.routeName == 'CashOutReport') {
          doc.text('Cash-Out Statement', 380, 30);
        } else if (this.routeName == 'CashOutReport') {
          doc.text('Bill-PaymentReport Statement', 380, 30);
        } else if (this.routeName == 'RefundReport') {
          doc.text('Refund Report Statement', 380, 30);
        }
        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      let columns: any[] = []
      // Define table columns and data
      if (this.routeName == 'BillPaymentReport') {
        columns = [
          { header: 'createdOn', dataKey: 'created_date' },
          { header: 'Service Name', dataKey: 'service_name' },
          { header: 'Accont No', dataKey: 'account_number' },
          { header: 'Txn_ID', dataKey: 'batch_id' },
          { header: 'Sender Wallet No', dataKey: 'sender_wallet_no' },
          { header: 'Receiver Wallet No', dataKey: 'receiver_wallet_no' },
          { header: 'Status', dataKey: 'status' },
          { header: 'Amount', dataKey: 'amount' },
        ];
      } else if (this.routeName == 'RefundReport') {
        columns = [
          { header: 'createdOn', dataKey: 'created_on' },
          { header: 'Service Name', dataKey: 'service_name' },
          { header: 'Txn_ID', dataKey: 'batch_id' },
          { header: 'Sender Wallet No', dataKey: 'sender_wallet_no' },
          { header: 'Wallet Type', dataKey: 'wallet_type' },
          { header: 'Status', dataKey: 'status' },
          { header: 'Amount', dataKey: 'amount' },
        ];
      }
      else if (this.routeName == 'CashInReport' || this.routeName == 'CashOutReport') {
        columns = [
          { header: 'createdOn', dataKey: 'created_date' },
          { header: 'Service Name', dataKey: 'service_name' },
          { header: 'Txn_ID', dataKey: 'batch_id' },
          { header: 'Sender Wallet No', dataKey: 'sender_wallet_no' },
          { header: 'Receiver Wallet No', dataKey: 'receiver_wallet_no' },
          { header: 'Status', dataKey: 'status' },
          { header: 'Amount', dataKey: 'amount' },
        ];
      }


      const data = this.agentSummaryReport

      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });


      // Save the PDF
      if (this.routeName == 'CashInReport') {
        doc.save('cash-in-report.pdf');
      } else if (this.routeName == 'CashOutReport') {
        doc.save('cash-out-report.pdf');
      } else if (this.routeName == 'BillPaymentReport') {
        doc.save('BillPaymentReport.pdf');
      } else if (this.routeName == 'RefundReport') {
        doc.save('RefundReport.pdf');
      }
    }
    else if (this.routeName == 'AubBalance' ||
      this.routeName == 'GBBalance' ||
      this.routeName == 'ActiveServiceReconcileReport' ||
      this.routeName == 'AwccReconcileReport'
    ) {
      const doc = new jsPDF("p", "pt", "a4");
      console.log('hi');

      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        if (this.routeName == 'AubBalance') {
          doc.text('AubBalance Statement', 380, 30);
        } else if (this.routeName == 'GBBalance') {
          doc.text('GBBalance Statement', 380, 30);
        } else if (this.routeName == 'CashOutReport') {
          doc.text('CashOutReport Statement', 380, 30);
        } else if (this.routeName == 'AwccReconcileReport') {
          doc.text('AwccReconcile Report Statement', 380, 30);
        } else if (this.routeName == 'ActiveServiceReconcileReport') {
          doc.text('ActiveServiceReconcile Report Statement', 380, 30);
        }
        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      let columns: any[] = []
      // Define table columns and data
      if (this.routeName == 'AubBalance') {
        columns = [
          { header: 'AUB Balance', dataKey: 'aubBalance' },
          { header: 'Total Pull Money', dataKey: 'totalPullMoney' },
          { header: 'Total Push Money', dataKey: 'totalPushMoney' },
        ];
      } else if (this.routeName == 'GBBalance') {
        columns = [
          { header: 'GB Balance', dataKey: 'gbBalance' },
          { header: 'Total Pull Money', dataKey: 'totalPullMoney' },
          { header: 'Total Push Money', dataKey: 'totalPushMoney' },
        ];
      }
      else if (this.routeName == 'AwccReconcileReport') {
        columns = [
          { header: 'Inventory Balance', dataKey: 'inventoryBalance' },
          { header: 'AWCC Service Balance	', dataKey: 'activeServiceBalance' },
          { header: 'Agent Balance', dataKey: 'agentBalance' },
          { header: 'Recharge Topup Balance	', dataKey: 'rechargeTopupBalance' },
          { header: 'Total Stock Amount', dataKey: 'totalStockAmount' },
        ];
      }
      else if (this.routeName == 'ActiveServiceReconcileReport') {
        columns = [
          { header: 'Inventory Balance', dataKey: 'inventoryBalance' },
          { header: 'AWCC Service Balance	', dataKey: 'activeServiceBalance' },
          { header: 'Agent Balance', dataKey: 'agentBalance' },
          { header: 'Recharge Topup Balance	', dataKey: 'rechargeTopupBalance' },
          { header: 'Total Stock Amount', dataKey: 'totalStockAmount' },
        ];
      }

      const data = this.agentSummaryReport

      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });


      // Save the PDF
      if (this.routeName == 'AubBalance') {
        doc.save('AubBalance.pdf');
      } else if (this.routeName == 'GBBalance') {
        doc.save('GBBalance.pdf');
      } else if (this.routeName == 'AwccReconcileReport') {
        doc.save('AwccReconcileReport.pdf');
      } else if (this.routeName == 'ActiveServiceReconcileReport') {
        doc.save('ActiveServiceReconcileReport.pdf');
      }
    }
    else if (this.routeName == 'CorporateCustomerReport' ||
      this.routeName == 'CustomerSummaryReport' ||
      this.routeName == 'SalesVolumeByAgents' ||
      this.routeName == 'FinancialConsolidatedReport' ||
      this.routeName == 'AgentSummaryReport') {
      const doc = new jsPDF("p", "pt", "a4");

      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        if (this.routeName == 'CustomerSummaryReport') {
          doc.text('Customer Summary Report Statement', 380, 30);
        } else if (this.routeName == 'CorporateCustomerReport') {
          doc.text('Corporate Summary Report Statement', 380, 30);
        } else if (this.routeName == 'AgentSummaryReport') {
          doc.text('Agent Summary Report Statement', 380, 30);
        } else if (this.routeName == 'SalesVolumeByAgents') {
          doc.text('SalesVolume-ByAgents Report Statement', 380, 30);
        } else if (this.routeName == 'FinancialConsolidatedReport') {
          doc.text('FinancialConsolidated Report Statement', 380, 30);
        }
        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      let columns: any[] = []
      if (this.routeName == 'CorporateCustomerReport' ||
        this.routeName == 'CustomerSummaryReport' || this.routeName == 'AgentSummaryReport') {
        columns = [
          { header: 'Agent Name', dataKey: 'name' },
          { header: 'Wallet No', dataKey: 'wallet_number' },
          { header: 'Email', dataKey: 'email' },
          { header: 'Phone', dataKey: 'phone' },
          { header: 'Balance', dataKey: 'balance' },
        ];
      } else if (this.routeName == 'SalesVolumeByAgents') {
        columns = [
          { header: 'Date', dataKey: 'date' },
          { header: 'Agent Name', dataKey: 'agent_name' },
          { header: 'Wallet No', dataKey: 'wallet_number' },
          { header: 'No of Sales', dataKey: 'no_of_sales' },
          { header: 'Total Amount', dataKey: 'total_amount' },
        ];
      } else if (this.routeName == 'FinancialConsolidatedReport') {
        columns = [
          { header: 'Gl Type	', dataKey: 'gl_type' },
          { header: 'Sub-Head Account No', dataKey: 'sub_head_account_number' },
          { header: 'Head Account No	', dataKey: 'head_account_number' },
          { header: 'Sub Balance', dataKey: 'sub_balance' },
          { header: 'Head Balance	', dataKey: 'head_balance' },
        ];
      }

      const data = this.agentSummaryReport

      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });


      // Save the PDF
      if (this.routeName == 'CorporateCustomerReport') {
        doc.save('corporate-summary-report.pdf');
      } else if (this.routeName == 'CustomerSummaryReport') {
        doc.save('customer-summary-report.pdf');
      } else if (this.routeName == 'AgentSummaryReport') {
        doc.save('agent-summary-report.pdf');
      } else if (this.routeName == 'SalesVolumeByAgents') {
        doc.save('SalesVolumeByAgents.pdf');
      } else if (this.routeName == 'FinancialConsolidatedReport') {
        doc.save('FinancialConsolidatedReport.pdf');
      }
    }
    else if (this.routeName == 'EMoneyTransferReport') {
      const doc = new jsPDF("p", "pt", "a4");

      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('EMoney Transfer Report Statement', 380, 30);

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      const columns = [
        { header: 'Account Number', dataKey: 'account' },
        { header: 'Txn_No', dataKey: 'batch_id' },
        { header: 'Txn_Date', dataKey: 'transaction_date' },
        { header: 'Description', dataKey: 'description' },
        { header: 'Credit Amount', dataKey: 'total_credit' },
        { header: 'Debit Amount', dataKey: 'total_debit' },
      ];

      const data = this.agentSummaryReport

      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom

      doc.setFontSize(10);
      doc.text('Total Credit:', 40, footerY);
      doc.text(`${this.totalCredit.toFixed(2)}`, 150, footerY);

      doc.text('Total Debit:', 40, footerY + 20);
      doc.text(`${this.totalDebit.toFixed(2)}`, 150, footerY + 20);

      doc.text('Total Credit Count:', 40, footerY + 40);
      doc.text(`${this.totalCreditCount}`, 150, footerY + 40);

      doc.text('Total Debit Count:', 40, footerY + 60);
      doc.text(`${this.totalDebitCount}`, 150, footerY + 60);

      // Save the PDF
      doc.save('EMoney-transferreport-statement-report.pdf');
    }
    else if (this.routeName == 'AirtimeReconciliationReport') {
      const doc = new jsPDF("p", "pt", "a4");

      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('AirTime Topup Statement', 380, 30);
        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      const columns = [
        { header: 'Created On', dataKey: 'created_date' },
        { header: 'Service Name', dataKey: 'service_name' },
        { header: 'Customer Phone No	', dataKey: 'customer_mobile' },
        { header: 'Txn_Ref_Id', dataKey: 'transaction_id' },
        { header: 'Txn_ID', dataKey: 'batch_id' },
        { header: 'Sender Wallet No', dataKey: 'sender_wallet_no' },
        { header: 'Receiver Wallet No', dataKey: 'receiver_wallet_no' },
        { header: 'Status', dataKey: 'status' },
        { header: 'Amount', dataKey: 'amount' },
      ];

      const data = this.agentSummaryReport

      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });


      // Save the PDF
      doc.save('Airtime-topup-report.pdf');

    }
    else if (this.routeName == 'BatchReport') {
      const doc = new jsPDF("p", "pt", "a4");

      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        if (this.routeName == 'BatchReport') {
          doc.text('Batch Report Statement', 380, 30);
        }
        //  else if (this.routeName == 'StatementOfCashFlow') {
        //   doc.text('StatementOfCashFlow Statement', 380, 30);
        // }

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      const columns = [
        { header: 'Txn_Date', dataKey: 'txn_date' },
        { header: 'Service Name', dataKey: 'service_name' },
        { header: 'Type', dataKey: 'type' },
        { header: 'Description', dataKey: 'description' },
        { header: 'Account No', dataKey: 'acc_number' },
        { header: 'GL_Type', dataKey: 'gl_type' },
        { header: 'Txn_ID', dataKey: 'batch_id' },
        { header: 'Credit', dataKey: 'credit' },
        { header: 'Debit', dataKey: 'debit' },
      ];

      const data = this.agentSummaryReport

      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom

      doc.setFontSize(10);
      doc.text('Total Credit:', 40, footerY);
      doc.text(`${this.totalCredit.toFixed(2)}`, 150, footerY);

      doc.text('Total Debit:', 40, footerY + 20);
      doc.text(`${this.totalDebit.toFixed(2)}`, 150, footerY + 20);

      doc.text('Total Credit Count:', 40, footerY + 40);
      doc.text(`${this.totalCreditCount}`, 150, footerY + 40);

      doc.text('Total Debit Count:', 40, footerY + 60);
      doc.text(`${this.totalDebitCount}`, 150, footerY + 60);

      // Save the PDF
      if (this.routeName == 'BatchReport') {
        doc.save('Batch-Report-Statement.pdf');
      }
      // else if (this.routeName == 'StatementOfCashFlow') {
      //   doc.save('StatementOfCashFlow.pdf');
      // }
    }
    else if (this.routeName == 'SalesTrendReport' ||
      this.routeName == 'ProfitabilityReport' ||
      this.routeName == 'BeginningBalanceReport' ||
      this.routeName == 'IncomeReport' ||
      this.routeName == 'TopupInventoryReport' ||
      this.routeName == 'AggregateVolAndValTransaction' ||
      this.routeName == 'ActiveBasedReport' ||
      this.routeName == 'InActiveBasedReport' ||
      this.routeName == 'SuspendAccountReport' ||
      this.routeName == 'LockAccountReport' ||
      this.routeName == 'LCTR') {
      const doc = new jsPDF("p", "pt", "a4");

      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        if (this.routeName == 'SalesTrendReport') {
          doc.text('Sales Trend Report Statement', 380, 30);
        } else if (this.routeName == 'ProfitabilityReport') {
          doc.text('Profitability Report Statement', 380, 30);
        } else if (this.routeName == 'LCTR') {
          doc.text('LCTR Report Statement', 380, 30);
        } else if (this.routeName == 'BeginningBalanceReport') {
          doc.text('BeginningBalance Report Statement', 380, 30);
        } else if (this.routeName == 'IncomeReport') {
          doc.text('Income Report Statement', 380, 30);
        } else if (this.routeName == 'TopupInventoryReport') {
          doc.text('Topup Inventory Report Statement', 380, 30);
        } else if (this.routeName == 'AggregateVolAndValTransaction') {
          doc.text('Aggregate Volume And Value Transaction', 380, 30);
        } else if (this.routeName == 'ActiveBasedReport') {
          doc.text('ActiveBased Report Statement', 380, 30);
        } else if (this.routeName == 'InActiveBasedReport') {
          doc.text('In-ActiveBased Report Statement', 380, 30);
        } else if (this.routeName == 'SuspendAccountReport') {
          doc.text('Suspend Account Report Statement', 380, 30);
        } else if (this.routeName == 'LockAccountReport') {
          doc.text('Lock Account Report Statement', 380, 30);
        }
        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      let columns: any[] = []
      if (this.routeName == 'SalesTrendReport') {
        columns = [
          { header: 'Service Name', dataKey: 'service_name' },
          { header: 'Credit Amount', dataKey: 'credit_amount' },
          { header: 'Debit Amount', dataKey: 'debit_amount' }
        ];
      } else if (this.routeName == 'ProfitabilityReport') {
        columns = [
          { header: 'Account No', dataKey: 'account' },
          { header: 'Credit Amount', dataKey: 'credit_amount' },
          { header: 'Debit Amount', dataKey: 'debit_amount' }
        ];
      } else if (this.routeName == 'LCTR') {
        columns = [
          { header: 'Account No', dataKey: 'accountNo' },
          { header: 'Txn_No', dataKey: 'transactionNo' },
          { header: 'Txn_Date', dataKey: 'trnDate' },
          { header: 'Service Name', dataKey: 'serviceName' },
          { header: 'Amount', dataKey: 'amount' },
        ];
      } else if (this.routeName == 'BeginningBalanceReport') {
        columns = [
          { header: 'Report Date', dataKey: 'report_date' },
          { header: 'Account No', dataKey: 'account' },
          { header: 'GL_Type', dataKey: 'gl_type' },
          { header: 'Closing Balance', dataKey: 'closing_balance' },
          { header: 'No of Ledger', dataKey: 'number_of_ledger' },
          { header: 'Total Credit', dataKey: 'total_deposited' },
          { header: 'Total Debit', dataKey: 'total_withdrawn' },
        ];
      } else if (this.routeName == 'IncomeReport') {
        columns = [
          { header: 'Service Name', dataKey: 'service_name' },
          { header: 'Credit Amount', dataKey: 'credit' },
          { header: 'Debit Amount', dataKey: 'debit' }
        ];
      } else if (this.routeName == 'TopupInventoryReport') {
        columns = [
          { header: 'Service Name', dataKey: 'service_name' },
          { header: 'Credit Amount', dataKey: 'credit' },
          { header: 'Debit Amount', dataKey: 'debit' }
        ];
      } else if (this.routeName == 'AggregateVolAndValTransaction') {
        columns = [
          { header: 'Service Name', dataKey: 'service_name' },
          { header: 'Credit Amount', dataKey: 'total_credit' },
          { header: 'Debit Amount', dataKey: 'total_debit' },
          { header: 'Total Count', dataKey: 'total_count' },
        ];
      } else if (this.routeName == 'ActiveBasedReport'
        || this.routeName == 'InActiveBasedReport'
        || this.routeName == 'SuspendAccountReport'
        || this.routeName == 'LockAccountReport'
      ) {
        columns = [
          { header: 'Created On', dataKey: 'created_on' },
          { header: 'First Name', dataKey: 'first_name' },
          { header: 'Last Name', dataKey: 'last_name' },
          { header: 'Email', dataKey: 'email' },
          { header: 'Phone', dataKey: 'phone' },
          { header: 'Account No', dataKey: 'account_no' },
          { header: 'Proof No', dataKey: 'cust_info_proof_number' },
          { header: 'User Type', dataKey: 'user_type' },
          { header: 'Reason', dataKey: 'reason' },
        ];
      }

      const data = this.agentSummaryReport
      const formattedData = this.agentSummaryReport.map((row: any) => ({
        ...row,
        created_on: new Date(row.created_on).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        active: row.active ? 'Active' : 'Inactive',
      }));

      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: this.routeName == 'ActiveBasedReport'
          || this.routeName == 'InActiveBasedReport'
          || this.routeName == 'SuspendAccountReport'
          || this.routeName == 'LockAccountReport' ? formattedData : data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: this.routeName == 'ActiveBasedReport'
            || this.routeName == 'InActiveBasedReport'
            || this.routeName == 'SuspendAccountReport'
            || this.routeName == 'LockAccountReport' ? 7 : 10,
        },
        bodyStyles: {
          fontSize: this.routeName == 'ActiveBasedReport'
            || this.routeName == 'InActiveBasedReport'
            || this.routeName == 'SuspendAccountReport'
            || this.routeName == 'LockAccountReport' ? 5 : 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom

      if (this.routeName != 'ActiveBasedReport'
        && this.routeName != 'InActiveBasedReport'
        && this.routeName != 'SuspendAccountReport'
        && this.routeName != 'LockAccountReport') {
        doc.setFontSize(10);
        doc.text('Total Credit:', 40, footerY);
        doc.text(`${this.totalCredit.toFixed(2)}`, 150, footerY);

        doc.text('Total Debit:', 40, footerY + 20);
        doc.text(`${this.totalDebit.toFixed(2)}`, 150, footerY + 20);
      }

      if (this.routeName == 'ProfitabilityReport' || this.routeName == 'BeginningBalanceReport'
        || this.routeName == 'IncomeReport' || this.routeName == 'TopupInventoryReport'
      ) {
        doc.text('Total Credit Count:', 40, footerY + 40);
        doc.text(`${this.totalCreditCount}`, 150, footerY + 40);

        doc.text('Total Debit Count:', 40, footerY + 60);
        doc.text(`${this.totalDebitCount}`, 150, footerY + 60);
      }

      // Save the PDF
      if (this.routeName == 'SalesTrendReport') {
        doc.save('SalesTrend-Report-Statement.pdf');
      } else if (this.routeName == 'ProfitabilityReport') {
        doc.save('Profitability-Report-Statement.pdf');
      } else if (this.routeName == 'LCTR') {
        doc.save('LCTR-Report-Statement.pdf');
      } else if (this.routeName == 'BeginningBalanceReport') {
        doc.save('BeginningBalance-Report-Statement.pdf');
      } else if (this.routeName == 'IncomeReport') {
        doc.save('IncomeReport.pdf');
      } else if (this.routeName == 'TopupInventoryReport') {
        doc.save('TopupInventoryReport.pdf');
      } else if (this.routeName == 'AggregateVolAndValTransaction') {
        doc.save('AggregateVolAndValTransaction.pdf');
      } else if (this.routeName == 'ActiveBasedReport') {
        doc.save('ActiveBasedReport.pdf');
      } else if (this.routeName == 'InActiveBasedReport') {
        doc.save('InActiveBasedReport.pdf');
      } else if (this.routeName == 'SuspendAccountReport') {
        doc.save('SuspendAccountReport.pdf');
      } else if (this.routeName == 'LockAccountReport') {
        doc.save('LockAccountReport.pdf');
      }
    }
    else if (this.routeName == 'AgentLiquidityReport'
    ) {
      const doc = new jsPDF("p", "pt", "a4");

      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('AgentLiquidity Report Statement', 380, 30);

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      const columns = [
        { header: 'Txn_Date', dataKey: 'date' },
        { header: 'Agent Name', dataKey: 'agent_name' },
        { header: 'Wallet No', dataKey: 'wallet_number' },
        { header: 'Closing Balance', dataKey: 'closing_balance' },
        { header: 'Opening Balance	', dataKey: 'opening_balance' },
        { header: 'Total Credited', dataKey: 'total_deposited' },
        { header: 'Total Debited', dataKey: 'total_withdrawn' },
      ];

      const data = this.agentSummaryReport

      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom

      doc.setFontSize(10);
      doc.text('Total Credit:', 40, footerY);
      doc.text(`${this.totalCredit.toFixed(2)}`, 150, footerY);

      doc.text('Total Debit:', 40, footerY + 20);
      doc.text(`${this.totalDebit.toFixed(2)}`, 150, footerY + 20);


      // Save the PDF
      doc.save('AgentLiquidityReport.pdf');
    }
    //new
    //jasper download PDF
    else if (this.routeName == "AuthorizedAgentQuartelyReport") {
      let body = {
        user: 'CUSTOMER'
      }
      this.apiService.downloadJasperPDF('AuthorizedAgentQuartelyReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'AuthorizedAgentQuartelyReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == "AccountHoldersWithHistoryOfFinancialCrime") {
      const body = {
        user: this.dateForm.controls['userTypeCrime'].value
      };
      this.apiService.downloadJasperPDF('AccountHoldersWithHistoryOfFinancialCrime', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'AccountHoldersWithHistoryOfFinancialCrime.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == 'StatementOfCashFlow') {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      const body = {
        fromDate: fromDate,
        toDate: toDate,
      };
      console.log(body, "stc req pdf");
      this.apiService.downloadJasperPDF('StatementOfCashFlow', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'StatementOfCashFlow.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == 'DetailedTransactionProvinceWise') {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value; const body = {
        start_date: fromDate,
        end_date: toDate,
        lastCreatedOn: this.dateForm.controls['CreatedDate'].value,
        pageSize: 10
      };
      this.apiService.downloadJasperPDF('DetailedTransactionProvinceWise', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'DetailedTransactionProvinceWise.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == 'ActiveUserWithMinimumOneTrxnMonthlyReport') {
      // let fromDate = this.dateForm.controls["fromDate"].value;
      // let toDate = this.dateForm.controls["toDate"].value;
      // // let year = this.BalanceReportYear;
      // const body = {
      //   start_date: fromDate,
      //   end_date: toDate,
      //   user_type: this.dateForm.controls['userTypeMinOne'].value,
      // }
      this.apiService.downloadJasperPDF('ActiveUserWithMinimumOneTrxnMonthlyReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'ActiveUserWithMinimumOneTrxnMonthlyReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == 'TransactionsUnusualTiming') {
      const body = {
        created_on: this.dateForm.controls['CreatedDate'].value,
        service_name: this.dateForm.controls["Service_Name"].value,
      }
      this.apiService.downloadJasperPDF('TransactionsUnusualTiming', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'TransactionsUnusualTiming.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == 'RejectedTransactions') {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      const body = {
        service_name: this.dateForm.controls['Service_Name'].value,
        start_date: fromDate,
        end_date: toDate,
        batch_id: this.dateForm.controls["batchId"].value,
      };
      this.apiService.downloadJasperPDF('RejectedTransactions', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'RejectedTransactions.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == 'ActiveUserByProvinceBasedReportByProvince') {
      const body = {
        province: this.dateForm.controls['province'].value,
      };
      this.apiService.downloadJasperPDF('ActiveUserByProvinceBasedReportByProvince', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'ActiveUserByProvinceBasedReportByProvince.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == 'ChangesInCustomerContactInformationReport') {
      const body = {
        changeRecency: this.changeRecency
      };
      this.apiService.downloadJasperPDF('ChangesInCustomerContactInformationReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'ChangesInCustomerContactInformationReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == 'AuthorizedPartnerQuarterlyReport') {
      // const body = {
      //   year: this.dateForm.controls["BalanceReportYear"].value,
      //   quarter: this.selectedQuaterValue,
      // };
      this.apiService.downloadJasperPDF('AuthorizedPartnerQuarterlyReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'AuthorizedPartnerQuarterlyReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == 'BalanceMovementReport') {
      const body = {
        year: this.dateForm.controls["BalanceReportYear"].value,
        month: this.dateForm.controls["BalanceReportMonth"].value
      };
      this.apiService.downloadJasperPDF('BalanceMovementReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'BalanceMovementReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {

          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == 'BalanceBreakupReport') {
      // let fromDate = this.dateForm.controls["fromDate"].value;
      // let toDate = this.dateForm.controls["toDate"].value;
      // const body = {
      //   start_date: fromDate,
      //   end_date: toDate,
      //   year: this.dateForm.controls["BalanceReportYear"].value,
      //   quarter: this.selectedQuaterValue,
      //   accountNo: this.dateForm.controls["BalanceReportAccNo"].value,
      // };
      this.apiService.downloadJasperPDF('BalanceBreakupReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'BalanceBreakupReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == 'BankAccountLinkageReport') {
      const body = {
        user: this.dateForm.controls['userTypeCrime'].value,
        accountNo: this.dateForm.controls['AccNO'].value,
        walletNo: this.dateForm.controls['walletNO'].value,
      };
      this.apiService.downloadJasperPDF('BankAccountLinkageReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'BankAccountLinkageReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == 'CustomerRiskClassificationReportPeriodically') {
      const body = {
        risk: this.dateForm.controls['risk'].value
      };
      this.apiService.downloadJasperPDF('CustomerRiskClassificationReportPeriodically', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'CustomerRiskClassificationReportPeriodically.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }

    else if (this.routeName == 'SuspiciousTransactionsReport') {
      const body = {
        service: this.dateForm.controls['detailedTransService'].value
      };
      this.apiService.downloadJasperPDF('SuspiciousTransactionsReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'SuspiciousTransactionsReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == 'RegisteredReportBasedOnProfileAndProvince') {
      const body = {
        profile: this.dateForm.controls["profile"].value,
        account_kyc: this.dateForm.controls["accKYC"].value
      };
      this.apiService.downloadJasperPDF('RegisteredReportBasedOnProfileAndProvince', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'RegisteredReportBasedOnProfileAndProvince.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == 'DataIntegrityandSecurity') {
      const body = {
        province: this.provinceVal
      };
      this.apiService.downloadJasperPDF('DataIntegrityandSecurity', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'DataIntegrityandSecurity.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == 'AdhocReport') {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      const body = {
        start_date: fromDate,
        end_date: toDate,
        status: this.dateForm.controls["status"].value,
        service_name: this.dateForm.controls["Service_Name"].value,
        status_2: this.dateForm.controls["status"].value,
        service_name_2: this.dateForm.controls["Service_Name"].value,
        start_date_2: fromDate,
        end_date_2: toDate
      };
      this.apiService.downloadJasperPDF('AdhocReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'AdhocReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.routeName == 'AccessToTransactionDataReport') {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      const body = {
        start_date: fromDate,
        end_date: toDate,
        status: this.dateForm.controls["status"].value,
        service_name: this.dateForm.controls["Service_Name"].value,
        status_2: this.dateForm.controls["status"].value,
        service_name_2: this.dateForm.controls["Service_Name"].value,
        start_date_2: fromDate,
        end_date_2: toDate
      };
      this.apiService.downloadJasperPDF('AccessToTransactionDataReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'AccessToTransactionDataReport.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    //jasper download PDF
    else if (this.routeName == 'MerchantToAgentReport') {
      const doc = new jsPDF("p", "pt", "a4");
      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('Merchant To Agent Report Statement', 380, 30);

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      const columns = [
        { header: 'Service Name', dataKey: 'service_name' },
        { header: 'Account', dataKey: 'account' },
        { header: 'Batch ID', dataKey: 'batch_id' },
        { header: 'Description', dataKey: 'description' },
        { header: 'Transaction Date', dataKey: 'trxn_date' },
        { header: 'Total Credited', dataKey: 'total_deposited' },
        { header: 'Total Debited', dataKey: 'total_withdrawn' },
      ];

      const data = this.agentSummaryReport

      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom

      doc.setFontSize(10);
      doc.text('Total Credit:', 40, footerY);
      doc.text(`${this.totalCredit.toFixed(2)}`, 150, footerY);

      doc.text('Total Debit:', 40, footerY + 20);
      doc.text(`${this.totalDebit.toFixed(2)}`, 150, footerY + 20);


      // Save the PDF
      doc.save('MerchantToAgentReport.pdf');
    }
    else if (this.routeName == 'WalletToWalletReport') {
      const doc = new jsPDF("p", "pt", "a4");
      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('Wallet To Wallet Report Statement', 380, 30);

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      const columns = [
        { header: 'Txn_Date', dataKey: 'trxn_date' },
        { header: 'Account', dataKey: 'account' },
        { header: 'Service Name', dataKey: 'service_name' },
        { header: 'Description', dataKey: 'description' },
      ];

      const data = this.agentSummaryReport

      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom

      doc.setFontSize(10);
      doc.text('Total Credit:', 40, footerY);
      doc.text(`${this.totalCredit.toFixed(2)}`, 150, footerY);

      doc.text('Total Debit:', 40, footerY + 20);
      doc.text(`${this.totalDebit.toFixed(2)}`, 150, footerY + 20);


      // Save the PDF
      doc.save('WalletToWalletReport.pdf');
    }
    else if (this.routeName == 'FailedTransactionReport') {
      const doc = new jsPDF("p", "pt", "a4");
      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('Failed Transaction Report Statement', 380, 30);

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      const columns = [
        { header: 'Created Date', dataKey: 'created_on' },
        { header: 'Service Name', dataKey: 'service_name' },
        { header: 'Amount', dataKey: 'amount' },
        { header: 'Sender Wallet No', dataKey: 'sender_wallet_no' },
        { header: 'Receiver Wallet No', dataKey: 'receiver_wallet_no' },
        { header: 'Status', dataKey: 'status' },
        // { header: 'Total Credited', dataKey: 'total_deposited' },
        // { header: 'Total Debited', dataKey: 'total_withdrawn' },
      ];

      const data = this.agentSummaryReport

      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom

      doc.setFontSize(10);
      // doc.text('Total Credit:', 40, footerY);
      // doc.text(`${this.totalCredit.toFixed(2)}`, 150, footerY);
      // doc.text('Total Debit:', 40, footerY + 20);
      // doc.text(`${this.totalDebit.toFixed(2)}`, 150, footerY + 20);
      // Save the PDF
      doc.save('FailedTransactionReport.pdf');
    }
    else if (this.routeName == 'PullTransactionReport') {
      const doc = new jsPDF("p", "pt", "a4");
      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('Pull Transaction Report Statement', 380, 30);

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      const columns = [
        { header: 'Amount', dataKey: 'amount' },
        { header: 'Service Name', dataKey: 'service_name' },
        { header: 'Status', dataKey: 'status' },
        { header: 'Created On', dataKey: 'created_on' },
        { header: 'Batch ID', dataKey: 'batch_id' },
        { header: 'Sender Wallet No', dataKey: 'sender_wallet_no' },
        { header: 'Receiver Wallet No', dataKey: 'receiver_wallet_no' },
        // { header: 'Total Credited', dataKey: 'total_deposited' },
        // { header: 'Total Debited', dataKey: 'total_withdrawn' },
      ];
      const data = this.agentSummaryReport
      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom
      doc.setFontSize(10);
      // doc.text('Total Credit:', 40, footerY);
      // doc.text(`${this.totalCredit.toFixed(2)}`, 150, footerY);
      // doc.text('Total Debit:', 40, footerY + 20);
      // doc.text(`${this.totalDebit.toFixed(2)}`, 150, footerY + 20);
      // Save the PDF
      doc.save('PullTransactionReport.pdf');
    }
    else if (this.routeName == 'PushTransactionReport') {
      const doc = new jsPDF("p", "pt", "a4");
      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('Push Transaction Report Statement', 380, 30);

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      const columns = [
        { header: 'Amount', dataKey: 'amount' },
        { header: 'Service Name', dataKey: 'service_name' },
        { header: 'Status', dataKey: 'status' },
        { header: 'Created On', dataKey: 'created_on' },
        { header: 'Batch ID', dataKey: 'batch_id' },
        { header: 'Sender Wallet No', dataKey: 'sender_wallet_no' },
        { header: 'Receiver Wallet No', dataKey: 'receiver_wallet_no' },
        // { header: 'Total Credited', dataKey: 'total_deposited' },
        // { header: 'Total Debited', dataKey: 'total_withdrawn' },
      ];
      const data = this.agentSummaryReport
      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom
      doc.setFontSize(10);
      // doc.text('Total Credit:', 40, footerY);
      // doc.text(`${this.totalCredit.toFixed(2)}`, 150, footerY);
      // doc.text('Total Debit:', 40, footerY + 20);
      // doc.text(`${this.totalDebit.toFixed(2)}`, 150, footerY + 20);
      // Save the PDF
      doc.save('PushTransactionReport.pdf');
    }

    else if (this.routeName == 'ActiveUserReport') {
      const doc = new jsPDF("p", "pt", "a4");
      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('Active User Report', 380, 30);

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      const columns = [
        { header: 'Account Number', dataKey: 'account_no' },
        { header: 'Mobile Number', dataKey: 'phone' },
        { header: 'Email', dataKey: 'email' },
        { header: 'Account Description', dataKey: 'account_description' },
        { header: 'Province Name', dataKey: 'province_name' },
        { header: 'Usertype', dataKey: 'user_type' },
        { header: 'Current Balance', dataKey: 'current_balance' },
        { header: 'First Txn Date', dataKey: 'first_transaction_date' },
        { header: 'Last Txn Date', dataKey: 'last_transaction_date' },
      ];
      const data = this.agentSummaryReport
      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom
      doc.setFontSize(10);
      // doc.text('Total Credit:', 40, footerY);
      // doc.text(`${this.totalCredit.toFixed(2)}`, 150, footerY);
      // doc.text('Total Debit:', 40, footerY + 20);
      // doc.text(`${this.totalDebit.toFixed(2)}`, 150, footerY + 20);
      // Save the PDF
      doc.save('ActiveUserReport.pdf');
    }
    else if (this.routeName == 'AggregateBalanceReport') {
      const doc = new jsPDF("p", "pt", "a4");
      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('Aggregate Balance Report Statement', 380, 30);

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      const columns = [
        { header: 'Date', dataKey: 'date' },
        { header: 'Balance', dataKey: 'balance' },
        { header: 'Account Type', dataKey: 'accType' },
      ];
      const data = this.agentSummaryReport
      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom
      doc.setFontSize(10);
      // doc.text('Total Credit:', 40, footerY);
      // doc.text(`${this.totalCredit.toFixed(2)}`, 150, footerY);
      // doc.text('Total Debit:', 40, footerY + 20);
      // doc.text(`${this.totalDebit.toFixed(2)}`, 150, footerY + 20);
      // Save the PDF
      doc.save('AggregateBalanceReport.pdf');
    }
    else if (this.routeName == 'BankTransactionReport') {
      const doc = new jsPDF("p", "pt", "a4");
      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('Bank Transaction Report Statement', 380, 30);

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      const columns = [
        { header: 'Transaction Date', dataKey: 'txn_date' },
        { header: 'Batch ID', dataKey: 'batch_id' },
        { header: 'GL Type', dataKey: 'gl_type' },
        { header: 'Account Number', dataKey: 'acc_number' },
        { header: 'Description', dataKey: 'description' },
        { header: 'Contract Account', dataKey: 'contraAcc' }
      ];
      const data = this.agentSummaryReport
      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom
      doc.setFontSize(10);
      doc.text('Total Credit:', 40, footerY);
      doc.text(`${this.totalCredit.toFixed(2)}`, 150, footerY);
      doc.text('Total Debit:', 40, footerY + 20);
      doc.text(`${this.totalDebit.toFixed(2)}`, 150, footerY + 20);
      // Save the PDF
      doc.save('BankTransactionReport.pdf');
    }
    else if (this.routeName == 'SuspenseAccountTransactionReport') {
      const doc = new jsPDF("p", "pt", "a4");
      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('Suspense Account Transaction Report Statement', 380, 30);

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      const columns = [
        { header: 'Created Date', dataKey: 'created_on' },
        { header: 'Amount', dataKey: 'amount' },
        { header: 'Sender Wallet No', dataKey: 'sender_wallet_no' },
        { header: 'Receiver Wallet No', dataKey: 'receiver_wallet_no' },
        { header: 'Status', dataKey: 'status' },
        // { header: 'Total Credited', dataKey: 'total_deposited' },
        // { header: 'Total Debited', dataKey: 'total_withdrawn' },
      ];
      const data = this.agentSummaryReport
      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom
      doc.setFontSize(10);
      doc.text('Total Credit:', 40, footerY);
      doc.text(`${this.totalCredit.toFixed(2)}`, 150, footerY);
      doc.text('Total Debit:', 40, footerY + 20);
      doc.text(`${this.totalDebit.toFixed(2)}`, 150, footerY + 20);
      // Save the PDF
      doc.save('SuspenseAccountTransactionReport.pdf');
    }
    else if (this.routeName == 'TopUpDetailsTransactionReportByChannel') {
      const doc = new jsPDF("p", "pt", "a4");
      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('TopUp Details Transaction Report By Channel Statement', 380, 30);

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      const columns = [
        { header: 'Created Date', dataKey: 'created_on' },
        { header: 'Amount', dataKey: 'amount' },
        { header: 'Sender Wallet No', dataKey: 'sender_wallet_no' },
        { header: 'Receiver Wallet No', dataKey: 'receiver_wallet_no' },
        { header: 'Status', dataKey: 'status' },
        // { header: 'Total Credited', dataKey: 'total_deposited' },
        // { header: 'Total Debited', dataKey: 'total_withdrawn' },
      ];
      const data = this.agentSummaryReport
      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom
      doc.setFontSize(10);
      doc.text('Total Credit:', 40, footerY);
      doc.text(`${this.totalCredit.toFixed(2)}`, 150, footerY);
      doc.text('Total Debit:', 40, footerY + 20);
      doc.text(`${this.totalDebit.toFixed(2)}`, 150, footerY + 20);
      // Save the PDF
      doc.save('TopUpDetailsTransactionReportByChannel.pdf');
    }
    else if (this.routeName == 'ApprovedKycReport') {
      const doc = new jsPDF("p", "pt", "a4");
      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('Approved KYC Report', 380, 30);

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      const columns = [
        { header: 'First Name', dataKey: 'first_name' },
        { header: 'Last Name', dataKey: 'last_name' },
        { header: 'Email', dataKey: 'email' },
        { header: 'phone', dataKey: 'phone' },
        { header: 'User Type', dataKey: 'user_type' },
        { header: 'Created Date', dataKey: 'created_on' },
        { header: 'Modified Date', dataKey: 'modified_on' },
        { header: 'Status', dataKey: 'status' },
        { header: 'Sequence NO', dataKey: 'seq_no' },
        // { header: 'Total Credited', dataKey: 'total_deposited' },
        // { header: 'Total Debited', dataKey: 'total_withdrawn' },
      ];
      const data = this.agentSummaryReport
      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom
      doc.setFontSize(10);
      // doc.text('Total Credit:', 40, footerY);
      // doc.text(`${this.totalCredit.toFixed(2)}`, 150, footerY);
      // doc.text('Total Debit:', 40, footerY + 20);
      // doc.text(`${this.totalDebit.toFixed(2)}`, 150, footerY + 20);
      // Save the PDF
      doc.save('ApprovedKycReport.pdf');
    }
    else if (this.routeName == 'MostActiveUsersReport') {
      const doc = new jsPDF("p", "pt", "a4");
      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('Most Active Users Report', 380, 30);

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      const columns = [
        { header: 'Created Date', dataKey: 'created_on' },
        { header: 'Amount', dataKey: 'amount' },
        { header: 'Sender Wallet No', dataKey: 'sender_wallet_no' },
        { header: 'Receiver Wallet No', dataKey: 'receiver_wallet_no' },
        { header: 'Status', dataKey: 'status' },
        // { header: 'Total Credited', dataKey: 'total_deposited' },
        // { header: 'Total Debited', dataKey: 'total_withdrawn' },
      ];
      const data = this.agentSummaryReport
      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom
      doc.setFontSize(10);
      doc.text('Total Credit:', 40, footerY);
      doc.text(`${this.totalCredit.toFixed(2)}`, 150, footerY);
      doc.text('Total Debit:', 40, footerY + 20);
      doc.text(`${this.totalDebit.toFixed(2)}`, 150, footerY + 20);
      // Save the PDF
      doc.save('MostActiveUsersReport.pdf');
    }
    else if (this.routeName == 'UserwithMinimumSingleMonthlyTransactionReport') {
      const doc = new jsPDF("p", "pt", "a4");
      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('User with Minimum Single Monthly Transaction Report', 380, 30);

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      const columns = [
        { header: 'Created Date', dataKey: 'created_on' },
        { header: 'Email', dataKey: 'email' },
        { header: 'User Type', dataKey: 'user_type' },
        { header: 'Phone', dataKey: 'phone' },
        { header: 'First Name', dataKey: 'first_name' },
        { header: 'Last Name', dataKey: 'last_name' },
        { header: 'Transaction Count', dataKey: 'transaction_count' },
      ];
      const data = this.agentSummaryReport
      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom
      doc.setFontSize(10);
      // Save the PDF
      doc.save('UserwithMinimumSingleMonthlyTransactionReport.pdf');
    }
    else if (this.routeName == 'TransactionReportOnChannelUsage') {
      const doc = new jsPDF("p", "pt", "a4");
      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('Transaction Report On Channel Usage', 380, 30);

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      const columns = [
        { header: 'Created Date', dataKey: 'created_on' },
        { header: 'Batch ID', dataKey: 'batch_id' },
        { header: 'Service Name', dataKey: 'service_name' },
        { header: 'Receiver Wallet NO', dataKey: 'receiver_wallet_no' },
        { header: 'Sender Wallet NO', dataKey: 'sender_wallet_no' },
      ];
      const data = this.agentSummaryReport
      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom
      doc.setFontSize(10);
      // Save the PDF
      doc.save('TransactionReportOnChannelUsage.pdf');
    }
    else if (this.routeName == 'BulkReversalReport') {
      const doc = new jsPDF("p", "pt", "a4");
      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('Bulk Reversal Report', 380, 30);

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      const columns = [
        { header: 'Created Date', dataKey: 'created_on' },
        { header: 'Batch ID', dataKey: 'batch_id' },
        { header: 'Amount', dataKey: 'service_name' },
        { header: 'Receiver Wallet NO', dataKey: 'receiver_wallet_no' },
        { header: 'Sender Wallet NO', dataKey: 'sender_wallet_no' },
        { header: 'Message', dataKey: 'message' },
        { header: 'Status', dataKey: 'status' },
      ];
      const data = this.agentSummaryReport
      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom
      doc.setFontSize(10);
      // Save the PDF
      doc.save('BulkReversalReport.pdf');
    }
    else if (this.routeName == 'AllAccountActivityReport') {
      const doc = new jsPDF("p", "pt", "a4");
      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('All Account Activity Report', 380, 30);

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);
      // Define table columns and data
      const columns = [
        { header: 'Created Date', dataKey: 'created_on' },
        { header: 'Category', dataKey: 'category' },
        { header: 'Authorized On', dataKey: 'authorized_on' },
        { header: 'Checker Name', dataKey: 'checker_name' },
        { header: 'Checker Id', dataKey: 'checker_id' },
        { header: 'Maker Name', dataKey: 'maker_name' },
        { header: 'Maker Id', dataKey: 'maker_id' },
        { header: 'Reason', dataKey: 'reason' },
        { header: 'Status', dataKey: 'status' },
        { header: 'User Id', dataKey: 'user_id' },
        { header: 'User Name', dataKey: 'user_name' },
        { header: 'Auth Reason', dataKey: 'auth_reason' },
        { header: 'Reject Reason', dataKey: 'reject_reason' },
      ];
      const data = this.agentSummaryReport
      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom
      doc.setFontSize(10);
      // Save the PDF
      doc.save('AllAccountActivityReport.pdf');
    }
    else if (this.routeName == 'ActiveUserBasedOnProvince') {
      const doc = new jsPDF("p", "pt", "a4");
      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('Active User Based On Province', 380, 30);

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);
      // Define table columns and data
      const columns = [
        { header: 'Created Date', dataKey: 'created_on' },
        { header: 'Category', dataKey: 'category' },
        { header: 'Authorized On', dataKey: 'authorized_on' },
        { header: 'Checker Name', dataKey: 'checker_name' },
        { header: 'Checker Id', dataKey: 'checker_id' },
        { header: 'Maker Name', dataKey: 'maker_name' },
        { header: 'Maker Id', dataKey: 'maker_id' },
        { header: 'Reason', dataKey: 'reason' },
        { header: 'Status', dataKey: 'status' },
        { header: 'User Id', dataKey: 'user_id' },
        { header: 'User Name', dataKey: 'user_name' },
        { header: 'Auth Reason', dataKey: 'auth_reason' },
        { header: 'Reject Reason', dataKey: 'reject_reason' },
      ];
      const data = this.agentSummaryReport
      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom
      doc.setFontSize(10);
      // Save the PDF
      doc.save('ActiveUserBasedOnProvince.pdf');
    }
    else if (this.routeName == 'RegisteredReportsBasedOnProfileAndProvince') {
      const doc = new jsPDF("p", "pt", "a4");
      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('Registered Reports Based On Profile And Province', 380, 30);

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);
      // Define table columns and data
      const columns = [
        { header: 'Created Date', dataKey: 'created_on' },
        { header: 'Category', dataKey: 'category' },
        { header: 'Authorized On', dataKey: 'authorized_on' },
        { header: 'Checker Name', dataKey: 'checker_name' },
        { header: 'Checker Id', dataKey: 'checker_id' },
        { header: 'Maker Name', dataKey: 'maker_name' },
        { header: 'Maker Id', dataKey: 'maker_id' },
        { header: 'Reason', dataKey: 'reason' },
        { header: 'Status', dataKey: 'status' },
        { header: 'User Id', dataKey: 'user_id' },
        { header: 'User Name', dataKey: 'user_name' },
        { header: 'Auth Reason', dataKey: 'auth_reason' },
        { header: 'Reject Reason', dataKey: 'reject_reason' },
      ];
      const data = this.agentSummaryReport
      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });

      // Add summary at the bottom of the page
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom
      doc.setFontSize(10);
      // Save the PDF
      doc.save('RegisteredReportsBasedOnProfileAndProvince.pdf');
    }
    //new
    //dcms reports
    else if (this.routeName == 'TokenPaymentReport') {
      const doc = new jsPDF("p", "pt", "a4");
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);
        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('Token Payment Report', 380, 30);
        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;
        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };
      addHeader(null);
      const columns = [
        { header: 'Batch ID', dataKey: 'batch_id' },
        { header: 'Account', dataKey: 'account' },
        { header: 'Amount', dataKey: 'credit' },         // <-- use 'amount' if separate from credit
        { header: 'Head', dataKey: 'head' },
        { header: 'Sub Head', dataKey: 'sub' },
        { header: 'Description', dataKey: 'description' },
        { header: 'Contra Account', dataKey: 'contra_acc' },
        { header: 'Credit', dataKey: 'credit' },
        { header: 'Timestamp', dataKey: 'time_stamp' },
      ];
      const data = this.agentSummaryReport
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom
      doc.setFontSize(10);
      // Save the PDF
      doc.save('TokenPaymentReport.pdf');
    }
    else if (this.routeName == 'TokenTransactionReport') {
      const doc = new jsPDF("p", "pt", "a4");
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);
        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('Token Transaction Report', 380, 30);
        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;
        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };
      addHeader(null);
      const columns = [
        { header: 'Batch ID', dataKey: 'batch_id' },
        { header: 'Account', dataKey: 'account' },
        { header: 'Credit', dataKey: 'credit' },
        { header: 'Debit', dataKey: 'debit' },
        { header: 'Head', dataKey: 'head' },
        { header: 'Sub Head', dataKey: 'sub' },
        { header: 'Description', dataKey: 'description' },
        { header: 'Contra Account', dataKey: 'contra_acc' },
        { header: 'Timestamp', dataKey: 'time_stamp' },
      ];
      const data = this.agentSummaryReport
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom
      doc.setFontSize(10);
      // Save the PDF
      doc.save('TokenTransactionReport.pdf');
    }
    else if (this.routeName == 'TokenUnredeemedReport') {
      const doc = new jsPDF("p", "pt", "a4");
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);
        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('Token Unredeemed Report', 380, 30);
        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;
        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };
      addHeader(null);
      const columns = [
        { header: 'Token', dataKey: 'token' },
        { header: 'Token Generated At', dataKey: 'token_generated_at' },
        { header: 'Taskira', dataKey: 'taskira' },
        { header: 'Province', dataKey: 'province' },
        { header: 'Reference NO', dataKey: 'reference_no' },
        { header: 'Mobile Number', dataKey: 'mobile_number' },
        { header: 'Name', dataKey: 'name' },
        { header: 'Employee ID', dataKey: 'employee_id' },
        { header: 'Account Number', dataKey: 'account_number' },
        { header: 'Amount', dataKey: 'amount' },
      ];
      const data = this.agentSummaryReport
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom
      doc.setFontSize(10);
      // Save the PDF
      doc.save('TokenUnredeemedReport.pdf');
    }
    else if (this.routeName == 'TokenWithdrawalReport') {
      const doc = new jsPDF("p", "pt", "a4");
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);
        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('Token Withdrawal Report', 380, 30);
        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;
        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };
      addHeader(null);
      const columns = [
        { header: 'Token', dataKey: 'token' },
        { header: 'Token Generated At', dataKey: 'token_generated_at' },
        { header: 'Taskira', dataKey: 'taskira' },
        { header: 'Province', dataKey: 'province' },
        { header: 'Reference No', dataKey: 'reference_no' },
        { header: 'Mobile Number', dataKey: 'mobile_number' },
        { header: 'Name', dataKey: 'name' },
        { header: 'Employee ID', dataKey: 'employee_id' },
        { header: 'Account Number', dataKey: 'account_number' },
        { header: 'Amount', dataKey: 'amount' },
      ];
      const data = this.agentSummaryReport
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 100; // Adjust Y position to be close to the bottom
      doc.setFontSize(10);
      // Save the PDF
      doc.save('TokenWithdrawalReport.pdf');
    }
    else if (this.routeName == 'FloatVsWalletReconciliation') {
      const doc = new jsPDF("p", "pt", "a4");

      const addHeader = () => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('Float Vs Wallet Reconciliation Report', 380, 30);

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;
        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };
      addHeader();
      // Common columns
      const columns = [
        { header: 'Account', dataKey: 'account' },
        { header: 'Account Description', dataKey: 'account_description' },
        { header: 'Total Debit', dataKey: 'total_debit' },
        { header: 'Total Credit', dataKey: 'total_credit' },
        { header: 'Balance', dataKey: 'balance' },
      ];

      // Float table data
      const floatData = (this.floatAccounts || []).map((item: any) => ({
        account: item.account,
        account_description: item.account_description,
        total_debit: Number(item.total_debit || 0).toFixed(2),
        total_credit: Number(item.total_credit || 0).toFixed(2),
        balance: Number(item.balance || 0)
      }));
      // Wallet table data
      const walletData = (this.walletAccounts || []).map((item: any) => ({
        account: item.sub,
        account_description: item.account_description,
        total_debit: Number(item.total_debit || 0).toFixed(2),
        total_credit: Number(item.total_credit || 0).toFixed(2),
        balance: Number(item.balance || 0)
      }));

      let finalY = 100;

      // 🔸 Float Accounts Table
      doc.setFontSize(10);
      doc.setTextColor('#0a365a');
      doc.text('Float Accounts', 40, finalY);
      finalY += 10;

      autoTable(doc, {
        startY: finalY,
        columns: columns,
        body: floatData,
        headStyles: { fillColor: [244, 122, 32], textColor: 255, fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        margin: { left: 40, right: 40 },
      });

      finalY = (doc as any).lastAutoTable.finalY + 10;

      // 🔹 Totals for Float Accounts
      // 🔹 Totals for Float Accounts
      doc.setFontSize(9);
      doc.setTextColor(40);

      doc.text(`Total Credit: ${this.totalFloatCredit.toFixed(2)}`, 400, finalY);
      finalY += 12;

      doc.text(`Total Debit: ${this.totalFloatDebit.toFixed(2)}`, 400, finalY);
      finalY += 12;

      doc.text(`Total Balance: ${this.totalFloatBalance.toFixed(2)}`, 400, finalY);

      // ✅ ADD GAP HERE
      finalY += 25;   // <-- controls space between Float & Wallet sections

      // 🔸 Wallet Accounts Table
      // 🔸 Wallet Accounts Table
      doc.setFontSize(10);
      doc.setTextColor('#0a365a');
      doc.text('Wallet Accounts', 40, finalY);
      finalY += 10;

      autoTable(doc, {
        startY: finalY,
        columns: columns,
        body: walletData,
        headStyles: { fillColor: [244, 122, 32], textColor: 255, fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        margin: { left: 40, right: 40 },
      });

      finalY = (doc as any).lastAutoTable.finalY + 10;

      // 🔹 Totals for Wallet Accounts
      doc.setFontSize(9);
      doc.setTextColor(40);
      doc.text(`Total Credit: ${this.totalWalletCredit.toFixed(2)}`, 400, finalY);
      finalY += 12;
      doc.text(`Total Debit: ${this.totalWalletDebit.toFixed(2)}`, 400, finalY);
      finalY += 12;
      doc.text(`Total Balance: ${this.totalWalletBalance.toFixed(2)}`, 400, finalY);
      finalY += 20;
      doc.text(`Float Vs E-Money Difference: ${this.netSettlementDifference.toFixed(2)}`, 400, finalY);


      // ✅ Save PDF
      doc.save('FloatVsWalletReconciliation.pdf');
    }
    //dcms reports
    else if (this.routeName == 'SalesVolumeByChannel') {
      const doc = new jsPDF("p", "pt", "a4");

      // Function to add the header content
      const addHeader = (data: any) => {
        doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 40, 20, 50, 25);
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text('Afghan Besim Mobile Money Company,', 40, 60);
        doc.text('Darulaman Road, Hajari Najari,', 40, 72);
        doc.text('KABUL, AFGHANISTAN', 40, 84);

        doc.setFontSize(10);
        doc.setTextColor('#f47a20');
        doc.text('SalesVolume-By Channel Report Statement', 380, 30);

        const startX = 380;
        const startY = 35;
        const lineSpacing = 5;

        doc.setFontSize(8);
        doc.setTextColor(40);
        const fromDate = this.dateForm.controls["fromDate"].value;
        const toDate = this.dateForm.controls["toDate"].value;
        const backOfficeUser = this.backOfficeUser;
        doc.text(`Statement Period: ${fromDate} to ${toDate}`, startX, startY + 2 * lineSpacing);
        doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
      };

      // Call the header for the first page explicitly
      addHeader(null);

      // Define table columns and data
      const columns = [
        { header: 'Date', dataKey: 'date' },
        { header: 'Channel	', dataKey: 'channel' },
        { header: 'No of Sales', dataKey: 'no_of_sales' },
        { header: 'Total Amount', dataKey: 'total_amount' },
      ];

      const data = this.agentSummaryReport

      // Generate the table with autoTable
      autoTable(doc, {
        columns: columns,
        body: data,
        startY: 100, // Adjust this to start the table below the header
        didDrawPage: (data: any) => {
          // Call addHeader for each new page
          addHeader(data);
        },
        headStyles: {
          fillColor: [244, 122, 32],
          textColor: 255,
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 8,
        },
        margin: { top: 100 }, // Ensure the table doesn't overlap with the header
      });


      // Save the PDF
      doc.save('SalesVolumeByChannel.pdf');
    } else if (this.routeName == 'EMoneyTransactionReport') {

      const doc = new jsPDF('p', 'pt', 'a4');

      const pageWidth = doc.internal.pageSize.getWidth();

      const fromDate = this.datePipe.transform(
        this.dateForm.controls['fromDate'].value,
        'dd MMM yyyy'
      );

      const toDate = this.datePipe.transform(
        this.dateForm.controls['toDate'].value,
        'dd MMM yyyy'
      );

      const report = this.agentSummaryReport[0];

      //================ HEADER ====================

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Afghanistan Bank', pageWidth / 2, 30, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      doc.text(
        'Non-Banking Financial Institutions Supervision Directorate General',
        pageWidth / 2,
        43,
        { align: 'center' }
      );

      doc.text(
        'Follow-up and Offsite Supervision Section',
        pageWidth / 2,
        55,
        { align: 'center' }
      );

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);

      doc.text(
        'E-Money Transactions Report',
        pageWidth / 2,
        73,
        { align: 'center' }
      );

      // Logo
      doc.addImage('../../../assets/images/logo.jpg', 'JPEG', 35, 85, 55, 35);

      // Back office user

      doc.setFontSize(9);
      doc.text(
        `Back Office User: ${this.backOfficeUser}`,
        pageWidth - 40,
        95,
        { align: 'right' }
      );

      // Address

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      doc.text('Afghan Besim Mobile Money Company,', 35, 135);
      doc.text('Darulaman Road, Hajari Najari,', 35, 147);
      doc.text('KABUL, AFGHANISTAN', 35, 159);

      //================ COMPANY TABLE ====================

      autoTable(doc, {
        startY: 175,

        theme: 'grid',

        body: [
          ['EMI Name', 'Afghan Besim Mobile Money Company'],
          ['Date / Period', `Statement Period: ${fromDate} - ${toDate}`],
          ['Currency', 'Afghani'],
          ['Frequency', 'Monthly']
        ],

        styles: {
          fontSize: 9,
          cellPadding: 6,
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
          textColor: 0
        },

        columnStyles: {
          0: {
            cellWidth: 140,
            fontStyle: 'normal'
          },
          1: {
            cellWidth: 360,
            fontStyle: 'bold'
          }
        }
      });

      //================ TRANSACTION TABLE ====================

      const rows = [
        [
          '1',
          'Beginning Balance',
          Number(report.beginBalance).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        ],
        [
          '2',
          'Cash-in',
          Number(report.cashIn).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        ],
        [
          '3',
          'Payments',
          Number(report.payments).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        ],
        [
          '4',
          'Transfers',
          Number(report.transfers).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        ],
        [
          '5',
          'Cash-out',
          Number(report.cashOut).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        ]
      ];

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,

        theme: 'grid',

        head: [['Line Code', 'Items', 'Amounts']],

        body: rows,

        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
          halign: 'center'
        },

        styles: {
          fontSize: 9,
          cellPadding: 6,
          lineColor: [0, 0, 0],
          lineWidth: 0.5,
          textColor: 0
        },

        columnStyles: {
          0: {
            cellWidth: 60,
            halign: 'center'
          },

          1: {
            cellWidth: 300
          },

          2: {
            cellWidth: 140,
            halign: 'right'
          }
        }
      });

      //================ SAVE ====================

      doc.save('E-Money-Transactions-Report.pdf');

    } else if (this.routeName == "AllLoyaltyReports") {
      let data = {
        fromDate: this.dateForm.controls["fromDate"].value,
        toDate: this.dateForm.controls["toDate"].value,
        account: this.dateForm.controls["accNo"].value || null,
        type: this.dateForm.controls["loyaltyType"].value || null,
        serviceName: this.dateForm.controls["serviceName"].value || null,
      };
      this.apiService.reportV2WithParams('AllLoyaltyReport', data).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'AllLoyaltyReports.pdf';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
  }
  exportToExcel(): void {
    if (this.routeName == 'AccStatementReport' || this.routeName == 'ReversalReoport') {
      let heading: any;
      if (this.routeName == 'AccStatementReport') {
        heading = 'Your Statement'
      } else if (this.routeName == 'ReversalReoport') {
        heading = 'Account Statement With Reversal'
      }
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell(`${heading}`, { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Name: ${this.accountStatementDetails?.userDetailsPojo?.name}`],
        [`Account Number: ${this.accountStatementDetails?.userDetailsPojo?.accNo}`],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        [`Opening Balance: ${this.openingBalanceNew}`],
        [createStyledCell(`Closing Balance: ${this.closingBalNew}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        [createStyledCell(`Current Balance: ${this.currentBalance} (As on ${this.datePipe.transform(this.currentDateTime, 'dd-MM-yyyy hh:mm:ss a')})`, { font: { bold: true } })],
        [`BackOffice User: ${this.backOfficeUser}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Txn_Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Service Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Description', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          // createStyledCell('Sender ⟶ Receiver', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Txn_ID', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('External_Ref_No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Purpose', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Contra Acc', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Debit', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Credit', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } })
        ]
      ];

      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.accountStatementDetails?.accStatementPojo.map((tx: any) => [
        createStyledCell(tx.txnDate, { fill: { fgColor: { rgb: 'F8CBAD' } } }),
        tx.serviceName,
        tx.description,
        // `${tx.senderName || 'N/A'} ⟶ ${tx.receiverName || 'N/A'}`,
        tx.batchId,
        tx.extRefNumber,
        tx.narration,
        createStyledCell(tx.contraAcc, { fill: { fgColor: { rgb: 'F8CBAD' } } }),
        tx.debit,
        tx.credit,
        tx.runningBal
      ]);


      // Define summary rows with color styling
      const summaryRows = [
        [],
        [createStyledCell(`Total Credit: ${this.totalCredit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        [createStyledCell(`Total Debit: ${this.totalDebit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        [createStyledCell(`Total Credit Count: ${this.totalCreditCount}`, { fill: { fgColor: { rgb: 'FCE4D6' } } })],
        [createStyledCell(`Total Debit Count: ${this.totalDebitCount}`, { fill: { fgColor: { rgb: 'FCE4D6' } } })],
        [createStyledCell(`Closing Balance: ${this.closingBalNew}`, { font: { bold: true }, fill: { fgColor: { rgb: 'AFE1AF' } } })]
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };

      // Write the workbook and trigger download
      if (this.routeName == 'AccStatementReport') {
        XLSX.writeFile(workbook, `Account-Statement.xlsx`);
      } else if (this.routeName == 'ReversalReoport') {
        XLSX.writeFile(workbook, `Account-Statement-With-Reversal.xlsx`);
      }

    } else if (this.routeName == 'MyMoneyStatement' || this.routeName == 'VoiceDtaBundleActivationReport'
      || this.routeName == 'IncomeProductReport' || this.routeName == 'FloatAccMovement'
    ) {
      let heading: any;
      if (this.routeName == 'MyMoneyStatement') {
        heading = 'Your MyMoneyStatement Statement'
      } else if (this.routeName == 'VoiceDtaBundleActivationReport') {
        heading = 'Voice-Data-Bundle-Activation-Report'
      } else if (this.routeName == 'IncomeProductReport') {
        heading = 'Income Product Report Statement'
      } else if (this.routeName == 'FloatAccMovement') {
        heading = 'Float Account Movement Report'
      }
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell(`${heading}`, { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        [`BackOffice User: ${this.backOfficeUser}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Txn_Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Service Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Account Number', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Description', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Txn_ID', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Contra Acc', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Debit', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Credit', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } })
        ]
      ];

      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        createStyledCell(tx.txn_date, { fill: { fgColor: { rgb: 'F8CBAD' } } }),
        tx.service_name,
        tx.acc_number,
        tx.description,
        tx.batch_id,
        createStyledCell(tx.contraAcc, { fill: { fgColor: { rgb: 'F8CBAD' } } }),
        tx.debit,
        tx.credit,
        tx.running_balance
      ]);


      // Define summary rows with color styling
      const summaryRows = [
        [],
        [createStyledCell(`Total Credit: ${this.totalCredit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        [createStyledCell(`Total Debit: ${this.totalDebit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        [createStyledCell(`Total Credit Count: ${this.totalCreditCount}`, { fill: { fgColor: { rgb: 'FCE4D6' } } })],
        [createStyledCell(`Total Debit Count: ${this.totalDebitCount}`, { fill: { fgColor: { rgb: 'FCE4D6' } } })],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };

      // Write the workbook and trigger download
      if (this.routeName == 'MyMoneyStatement') {
        XLSX.writeFile(workbook, `MyMoneyStatement.xlsx`);
      } else if (this.routeName == 'VoiceDtaBundleActivationReport') {
        XLSX.writeFile(workbook, `VoiceDataBundleActivationReport.xlsx`);
      } else if (this.routeName == 'IncomeProductReport') {
        XLSX.writeFile(workbook, `IncomeProductReport.xlsx`);
      } else if (this.routeName == 'FloatAccMovement') {
        XLSX.writeFile(workbook, `FloatAccMovement.xlsx`);
      }

    }
    else if (this.routeName == 'TransactionSummaryReport'
      || this.routeName == 'StockBatchReport'
      || this.routeName == 'StockAccStatementReport'
      || this.routeName == 'AgentReconcilationReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });
      let varname;
      if (this.routeName == 'TransactionSummaryReport') {
        varname = 'TransactionSummary Report Statement';
      } else if (this.routeName == 'StockBatchReport') {
        varname = 'StockBatch Report Statement';
      } else if (this.routeName == 'AgentReconcilationReport') {
        varname = 'AgentReconcilation Report Statement';
      } else if (this.routeName == 'StockAccStatementReport') {
        varname = 'Stock-Account-Statement Report Statement';
      }
      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell(varname, { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      let tableHeaders: any[] = []
      if (this.routeName == 'TransactionSummaryReport') {
        tableHeaders = [
          [
            createStyledCell('Txn_Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Service Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Description', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Account No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Txn_ID', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Credit', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Debit', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          ]
        ];
      } else if (this.routeName == 'StockBatchReport' || this.routeName == 'AgentReconcilationReport' || this.routeName == 'StockAccStatementReport') {
        tableHeaders = [
          [
            createStyledCell('Txn_Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Service Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Description', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Account No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Txn_ID', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Head', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Credit', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Debit', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          ]
        ];
      }


      // Convert transactions to a basic format (without specific styling)
      let transactionRows: any[] = []
      if (this.routeName == 'TransactionSummaryReport') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.trxn_date,
          tx.service_name,
          tx.description,
          tx.account,
          tx.batch_id,
          tx.credit_amount,
          tx.debit_amount,
        ]);
      } else if (this.routeName == 'StockBatchReport' || this.routeName == 'AgentReconcilationReport' || this.routeName == 'StockAccStatementReport') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.txn_date,
          tx.service_name,
          tx.description,
          tx.account_number,
          tx.transaction_no,
          tx.head,
          tx.credit_amount,
          tx.debit_amount,
        ]);
      }


      // Define summary rows with color styling
      const summaryRows = [
        [],
        [createStyledCell(`Total Credit: ${this.totalCredit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        [createStyledCell(`Total Debit: ${this.totalDebit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        [createStyledCell(`Total Credit Count: ${this.totalCreditCount}`, { fill: { fgColor: { rgb: 'FCE4D6' } } })],
        [createStyledCell(`Total Debit Count: ${this.totalDebitCount}`, { fill: { fgColor: { rgb: 'FCE4D6' } } })],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };

      // Write the workbook and trigger download
      if (this.routeName == 'TransactionSummaryReport') {
        XLSX.writeFile(workbook, `Transaction-Summary-Report.xlsx`);
      } else if (this.routeName == 'StockBatchReport') {
        XLSX.writeFile(workbook, `StockBatchReport.xlsx`);
      } else if (this.routeName == 'AgentReconcilationReport') {
        XLSX.writeFile(workbook, `AgentReconcilationReport.xlsx`);
      } else if (this.routeName == 'StockAccStatementReport') {
        XLSX.writeFile(workbook, `StockAccStatementReport.xlsx`);
      }

    }
    else if (this.routeName === 'BalanceSheet'
      || this.routeName === 'MonthlyBalanceReport'
      || this.routeName === 'ProfitAndLossReport') {
      const createStyledCell = (value: any, styles: any, rowspan: number = 1, colspan: number = 1) => ({
        v: value,
        s: styles,
        // Include rowspan and colspan information for merging cells
        rowSpan: rowspan,
        colSpan: colspan,
      });

      // Define styled header rows
      const headerRows = [
        [
          createStyledCell('Afghan Besim Mobile Money Company,', {
            fill: { fgColor: { rgb: 'FFAE19' } },
            font: { color: { rgb: '000000' } },
          }),
        ],
        [
          createStyledCell('Darulaman Road, Hajari Najari,', {
            fill: { fgColor: { rgb: 'FFAE19' } },
            font: { color: { rgb: '000000' } },
          }),
        ],
        [
          createStyledCell('KABUL, AFGHANISTAN', {
            fill: { fgColor: { rgb: 'FFAE19' } },
            font: { color: { rgb: '000000' } },
          }),
        ],
        [],
        [
          createStyledCell('Yearly Balance Sheet Report', {
            font: { bold: true },
            fill: { fgColor: { rgb: 'BDD7EE' } },
          }),
        ],
        [
          `Statement Period: ${this.dateForm.controls['fromDate'].value} to ${this.dateForm.controls['toDate'].value}`,
        ],
        [`Back Office User: ${this.backOfficeUser}`],
        [],
      ];

      // Define table headers
      const tableHeaders = [
        [
          createStyledCell('GL Type', {
            font: { bold: true },
            fill: { fgColor: { rgb: 'A9D08E' } },
          }),
          createStyledCell('Head Account No', {
            font: { bold: true },
            fill: { fgColor: { rgb: 'A9D08E' } },
          }),
          createStyledCell('Sub Account No', {
            font: { bold: true },
            fill: { fgColor: { rgb: 'A9D08E' } },
          }),
          createStyledCell('Sub Account Balance', {
            font: { bold: true },
            fill: { fgColor: { rgb: 'A9D08E' } },
          }),
          createStyledCell('Head Account Balance', {
            font: { bold: true },
            fill: { fgColor: { rgb: 'A9D08E' } },
          }),
        ],
      ];

      // Transform grouped data into table rows
      const tableBody: any[] = [];
      this.groupedData.forEach((glTypeGroup: any) => {
        glTypeGroup.headAccounts.forEach((headAcc: any, headIndex: number) => {
          let isHeadBalanceAdded = false; // Track if Head Account Balance is already added
          headAcc.items.forEach((item: any, itemIndex: number) => {
            tableBody.push([
              headIndex === 0 && itemIndex === 0 ? glTypeGroup.glType : '', // GL Type
              itemIndex === 0 ? headAcc.headAccNo : '', // Head Account No
              item.subHeadAccNo, // Sub Account No
              item.subBalance, // Sub Account Balance
              !isHeadBalanceAdded ? headAcc.headBalance : '', // Add Head Account Balance once
            ]);
            isHeadBalanceAdded = true; // Ensure balance is only added once
          });
        });
      });

      // Combine all rows for the worksheet
      const worksheetData = [...headerRows, ...tableHeaders, ...tableBody];

      // Create the worksheet
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);

      // Set column widths
      worksheet['!cols'] = [
        { wch: 20 }, // GL Type
        { wch: 25 }, // Head Account No
        { wch: 25 }, // Sub Account No
        { wch: 20 }, // Sub Account Balance
        { wch: 20 }, // Head Account Balance
      ];

      // Create the workbook
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Balance Sheet': worksheet },
        SheetNames: ['Balance Sheet'],
      };


      // Write and save the file
      if (this.routeName === 'BalanceSheet') {
        XLSX.writeFile(workbook, 'YearlyBalance-Sheet-Report.xlsx');
      } else if (this.routeName === 'MonthlyBalanceReport') {
        XLSX.writeFile(workbook, 'MonthlyBalance-Report.xlsx');
      } else if (this.routeName === 'ProfitAndLossReport') {
        XLSX.writeFile(workbook, 'ProfitAndLoss-Report.xlsx');
      }

    }
    else if (this.routeName == 'BeginningBalanceReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('BeginningBalance Summary Statement', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Report Date	', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Account No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('GL_Type', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Closing Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('No of Ledger	', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Total Credit', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Total Debit', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];

      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.report_date,
        tx.account,
        tx.gl_type,
        tx.closing_balance,
        tx.number_of_ledger,
        tx.total_deposited,
        tx.total_withdrawn,
      ]);

      // Define summary rows with color styling
      const summaryRows = [
        [],
        [createStyledCell(`Total Credit: ${this.totalCredit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        [createStyledCell(`Total Debit: ${this.totalDebit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        [createStyledCell(`Total Credit Count: ${this.totalCreditCount}`, { fill: { fgColor: { rgb: 'FCE4D6' } } })],
        [createStyledCell(`Total Debit Count: ${this.totalDebitCount}`, { fill: { fgColor: { rgb: 'FCE4D6' } } })],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };

      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `BeginningBalance-Report.xlsx`);
    }
    else if (this.routeName == 'AgentLiquidityReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('AgentLiquidity Report Statement', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Txn_Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Agent Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Wallet No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Closing Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Opening Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Total Credited', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Total Debited', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];

      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.date,
        tx.agent_name,
        tx.wallet_number,
        tx.closing_balance,
        tx.opening_balance,
        tx.total_deposited,
        tx.total_withdrawn,
      ]);

      // Define summary rows with color styling
      const summaryRows = [
        [],
        [createStyledCell(`Total Credit: ${this.totalCredit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        [createStyledCell(`Total Debit: ${this.totalDebit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };

      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `AgentLiquidityReport.xlsx`);
    }
    //new
    //jasper downloads EXCEL
    if (this.routeName == "AuthorizedAgentQuartelyReport") {
      let body = { user: 'CUSTOMER' };
      this.apiService.downloadJasperEXCEL('AuthorizedAgentQuartelyReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'AuthorizedAgentQuartelyReport.xlsx';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "AccountHoldersWithHistoryOfFinancialCrime") {
      const body = { user: this.dateForm.controls['userTypeCrime'].value };
      this.apiService.downloadJasperEXCEL('AccountHoldersWithHistoryOfFinancialCrime', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'AccountHoldersWithHistoryOfFinancialCrime.xlsx';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'StatementOfCashFlow') {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      const body = {
        fromDate: fromDate,
        toDate: toDate,
      };
      console.log(body);

      this.apiService.downloadJasperEXCEL('StatementOfCashFlow', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'StatementOfCashFlow.xlsx';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'DetailedTransactionProvinceWise') {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value; const body = {
        start_date: fromDate,
        end_date: toDate,
        lastCreatedOn: this.dateForm.controls['CreatedDate'].value,
        pageSize: 10
      };
      this.apiService.downloadJasperEXCEL('DetailedTransactionProvinceWise', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'DetailedTransactionProvinceWise.xlsx';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'ActiveUserWithMinimumOneTrxnMonthlyReport') {
      // let fromDate = this.dateForm.controls["fromDate"].value;
      // let toDate = this.dateForm.controls["toDate"].value;
      // const body = {
      //   start_date: fromDate,
      //   end_date: toDate,
      //   user_type: this.dateForm.controls['userTypeMinOne'].value,
      // }
      this.apiService.downloadJasperEXCEL('ActiveUserWithMinimumOneTrxnMonthlyReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'ActiveUserWithMinimumOneTrxnMonthlyReport.xlsx';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'TransactionsUnusualTiming') {
      const body = {
        created_on: this.dateForm.controls['CreatedDate'].value,
        service_name: this.dateForm.controls["Service_Name"].value,
      }
      this.apiService.downloadJasperEXCEL('TransactionsUnusualTiming', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'TransactionsUnusualTiming.xlsx';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'RejectedTransactions') {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      const body = {
        service_name: this.dateForm.controls['Service_Name'].value,
        start_date: fromDate,
        end_date: toDate,
        batch_id: this.dateForm.controls["batchId"].value,
      };
      this.apiService.downloadJasperEXCEL('RejectedTransactions', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'RejectedTransactions.xlsx';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'ActiveUserByProvinceBasedReportByProvince') {
      const body = { province: this.dateForm.controls['province'].value };
      this.apiService.downloadJasperEXCEL('ActiveUserByProvinceBasedReportByProvince', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'ActiveUserByProvinceBasedReportByProvince.xlsx';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'ChangesInCustomerContactInformationReport') {
      const body = { changeRecency: this.changeRecency };
      this.apiService.downloadJasperEXCEL('ChangesInCustomerContactInformationReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'ChangesInCustomerContactInformationReport.xlsx';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'AuthorizedPartnerQuarterlyReport') {
      // const body = {
      //   year: this.dateForm.controls["BalanceReportYear"].value,
      //   quarter: this.selectedQuaterValue,
      // };
      this.apiService.downloadJasperEXCEL('AuthorizedPartnerQuarterlyReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'AuthorizedPartnerQuarterlyReport.xlsx';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'BalanceMovementReport') {
      const body = {
        year: this.dateForm.controls["BalanceReportYear"].value,
        month: this.dateForm.controls["BalanceReportMonth"].value
      };
      this.apiService.downloadJasperEXCEL('BalanceMovementReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'BalanceMovementReport.xlsx';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'BalanceBreakupReport') {
      // let fromDate = this.dateForm.controls["fromDate"].value;
      // let toDate = this.dateForm.controls["toDate"].value;
      // const body = {
      //   start_date: fromDate,
      //   end_date: toDate,
      //   year: this.dateForm.controls["BalanceReportYear"].value,
      //   quarter: this.selectedQuaterValue,
      //   accountNo: this.dateForm.controls["BalanceReportAccNo"].value,
      // };
      this.apiService.downloadJasperEXCEL('BalanceBreakupReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'BalanceBreakupReport.xlsx';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'BankAccountLinkageReport') {
      const body = {
        user: this.dateForm.controls['userTypeCrime'].value,
        accountNo: this.dateForm.controls['AccNO'].value,
        walletNo: this.dateForm.controls['walletNO'].value,
      };
      this.apiService.downloadJasperEXCEL('BankAccountLinkageReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'BankAccountLinkageReport.xlsx';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'CustomerRiskClassificationReportPeriodically') {
      const body = { risk: this.dateForm.controls['risk'].value };
      this.apiService.downloadJasperEXCEL('CustomerRiskClassificationReportPeriodically', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'CustomerRiskClassificationReportPeriodically.xlsx';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'SuspiciousTransactionsReport') {
      const body = { service: this.dateForm.controls['detailedTransService'].value };
      this.apiService.downloadJasperEXCEL('SuspiciousTransactionsReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'SuspiciousTransactionsReport.xlsx';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'RegisteredReportBasedOnProfileAndProvince') {
      const body = {
        profile: this.dateForm.controls["profile"].value,
        account_kyc: this.dateForm.controls["accKYC"].value
      };
      this.apiService.downloadJasperEXCEL('RegisteredReportBasedOnProfileAndProvince', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'RegisteredReportBasedOnProfileAndProvince.xlsx';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'DataIntegrityandSecurity') {
      const body = { province: this.provinceVal };
      this.apiService.downloadJasperEXCEL('DataIntegrityandSecurity', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'DataIntegrityandSecurity.xlsx';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'AdhocReport') {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      const body = {
        start_date: fromDate,
        end_date: toDate,
        status: this.dateForm.controls["status"].value,
        service_name: this.dateForm.controls["Service_Name"].value,
        status_2: this.dateForm.controls["status"].value,
        service_name_2: this.dateForm.controls["Service_Name"].value,
        start_date_2: fromDate,
        end_date_2: toDate
      };
      this.apiService.downloadJasperEXCEL('AdhocReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'AdhocReport.xlsx';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'AccessToTransactionDataReport') {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      const body = {
        start_date: fromDate,
        end_date: toDate,
        status: this.dateForm.controls["status"].value,
        service_name: this.dateForm.controls["Service_Name"].value,
        status_2: this.dateForm.controls["status"].value,
        service_name_2: this.dateForm.controls["Service_Name"].value,
        start_date_2: fromDate,
        end_date_2: toDate
      };
      this.apiService.downloadJasperEXCEL('AccessToTransactionDataReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'AccessToTransactionDataReport.xlsx';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    //jasper downloads EXCEL
    else if (this.routeName == 'MerchantToAgentReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('Merchant To Agent Report Statement', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Service Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Account', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Batch Id', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Description', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Transaction Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Total Credited', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Total Debited', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];

      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.service_name,
        tx.account,
        tx.batch_id,
        tx.description,
        tx.trxn_date,
        tx.total_deposited,
        tx.total_withdrawn,
      ]);

      // Define summary rows with color styling
      const summaryRows = [
        [],
        [createStyledCell(`Total Credit: ${this.totalCredit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        [createStyledCell(`Total Debit: ${this.totalDebit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `MerchantToAgentReport.xlsx`);
    }
    else if (this.routeName == 'WalletToWalletReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('Wallet To Wallet Report Statement', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Transaction Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Account', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Service Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Description', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];

      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.trxn_date,
        tx.account,
        tx.service_name,
        tx.description,
        // tx.total_deposited,
        // tx.total_withdrawn,
      ]);

      // Define summary rows with color styling
      const summaryRows = [
        [],
        [createStyledCell(`Total Credit: ${this.totalCredit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        [createStyledCell(`Total Debit: ${this.totalDebit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `WalletToWalletReport.xlsx`);
    }
    else if (this.routeName == 'FailedTransactionReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('Failed Transaction Report Statement', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Created Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Service Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Sender Wallet NO', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Reciever Wallet NO', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Status', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];
      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.created_on,
        tx.service_name,
        tx.amount,
        tx.sender_wallet_no,
        tx.receiver_wallet_no,
        tx.status,
      ]);

      // Define summary rows with color styling
      const summaryRows = [
        [],
        // [createStyledCell(`Total Credit: ${this.totalCredit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        // [createStyledCell(`Total Debit: ${this.totalDebit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `FailedTransactionReport.xlsx`);
    }
    else if (this.routeName == 'PullTransactionReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('Pull Transaction Report Statement', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Service Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Status', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Created Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Batch_Id', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Sender Wallet NO', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Reciever Wallet NO', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];
      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.amount,
        tx.service_name,
        tx.status,
        tx.created_on,
        tx.batch_id,
        tx.sender_wallet_no,
        tx.receiver_wallet_no,
      ]);

      // Define summary rows with color styling
      const summaryRows = [
        [],
        // [createStyledCell(`Total Credit: ${this.totalCredit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        // [createStyledCell(`Total Debit: ${this.totalDebit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `PullTransactionReport.xlsx`);
    }
    else if (this.routeName == 'PushTransactionReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('Push Transaction Report Statement', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Service Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Status', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Created Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Batch_Id', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Sender Wallet NO', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Reciever Wallet NO', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];
      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.amount,
        tx.service_name,
        tx.status,
        tx.created_on,
        tx.batch_id,
        tx.sender_wallet_no,
        tx.receiver_wallet_no,
      ]);

      // Define summary rows with color styling
      const summaryRows = [
        [],
        // [createStyledCell(`Total Credit: ${this.totalCredit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        // [createStyledCell(`Total Debit: ${this.totalDebit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `PushTransactionReport.xlsx`);
    }

    else if (this.routeName == 'ActiveUserReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('Active User Report Statement', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Account Number', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Mobile Number', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Email', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Account Description', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Province Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Usertype', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Current Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('First Txn Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Last Txn Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];
      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.account_no,
        tx.phone,
        tx.email,
        tx.account_description,
        tx.province_name,
        tx.user_type,
        tx.current_balance,
        tx.first_transaction_date,
        tx.last_transaction_date,
      ]);

      const summaryRows = [
        [],
        // [createStyledCell(`Total Credit: ${this.totalCredit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        // [createStyledCell(`Total Debit: ${this.totalDebit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `ActiveUserReport.xlsx`);
    }


    else if (this.routeName == 'AggregateBalanceReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('Aggregate Balance Report Statement', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Account Type', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];
      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.date,
        tx.balance,
        tx.accType,
      ]);

      // Define summary rows with color styling
      const summaryRows = [
        [],
        // [createStyledCell(`Total Credit: ${this.totalCredit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        // [createStyledCell(`Total Debit: ${this.totalDebit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `AggregateBalanceReport.xlsx`);
    }
    else if (this.routeName == 'BankTransactionReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('Bank Transaction Report Statement', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Transaction Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Batch ID', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('GL Type', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Account Number', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Description', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Contract Account', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];
      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.txn_date,
        tx.batch_id,
        tx.gl_type,
        tx.acc_number,
        tx.description,
        tx.contraAcc,
      ]);

      // Define summary rows with color styling
      const summaryRows = [
        [],
        [createStyledCell(`Total Credit: ${this.totalCredit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        [createStyledCell(`Total Debit: ${this.totalDebit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `BankTransactionReport.xlsx`);
    }
    else if (this.routeName == 'SuspenseAccountTransactionReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('Suspense Account Transaction Report Statement', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Created Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Sender Wallet NO', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Reciever Wallet NO', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Status', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];
      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.created_on,
        tx.amount,
        tx.sender_wallet_no,
        tx.receiver_wallet_no,
        tx.status,
      ]);

      // Define summary rows with color styling
      const summaryRows = [
        [],
        [createStyledCell(`Total Credit: ${this.totalCredit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        [createStyledCell(`Total Debit: ${this.totalDebit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `SuspenseAccountTransactionReport.xlsx`);
    }
    else if (this.routeName == 'TopUpDetailsTransactionReportByChannel') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('TopUp Details Transaction Report By Channel Statement', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Created Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Sender Wallet NO', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Reciever Wallet NO', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Status', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];
      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.created_on,
        tx.amount,
        tx.sender_wallet_no,
        tx.receiver_wallet_no,
        tx.status,
      ]);

      // Define summary rows with color styling
      const summaryRows = [
        [],
        [createStyledCell(`Total Credit: ${this.totalCredit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        [createStyledCell(`Total Debit: ${this.totalDebit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `TopUpDetailsTransactionReportByChannel.xlsx`);
    }
    else if (this.routeName == 'ApprovedKycReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('Approved KYC Report', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('First Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Last Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Email', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Phone', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('User Type', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Created Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Modified Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('status', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Sequence NO', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];
      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.first_name,
        tx.last_name,
        tx.email,
        tx.phone,
        tx.user_type,
        tx.created_on,
        tx.modified_on,
        tx.status,
        tx.seq_no,
      ]);

      // Define summary rows with color styling
      const summaryRows = [
        [],
        // [createStyledCell(`Total Credit: ${this.totalCredit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        // [createStyledCell(`Total Debit: ${this.totalDebit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `ApprovedKycReport.xlsx`);
    }
    else if (this.routeName == 'MostActiveUsersReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('Most Active Users Report', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Created Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Sender Wallet NO', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Reciever Wallet NO', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Status', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];
      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.created_on,
        tx.amount,
        tx.sender_wallet_no,
        tx.receiver_wallet_no,
        tx.status,
      ]);

      // Define summary rows with color styling
      const summaryRows = [
        [],
        [createStyledCell(`Total Credit: ${this.totalCredit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        [createStyledCell(`Total Debit: ${this.totalDebit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `MostActiveUsersReport.xlsx`);
    }
    else if (this.routeName == 'UserwithMinimumSingleMonthlyTransactionReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('User with Minimum Single Monthly Transaction Report', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Created Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Email', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('User Type', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('First Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Last Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Transaction Count', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];
      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.created_on,
        tx.email,
        tx.user_type,
        tx.phone,
        tx.first_name,
        tx.last_name,
        tx.transaction_count,
      ]);

      // Define summary rows with color styling
      const summaryRows = [
        [],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `UserwithMinimumSingleMonthlyTransactionReport.xlsx`);
    }
    else if (this.routeName == 'TransactionReportOnChannelUsage') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('Transaction Report On Channel Usage', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Created Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Batch ID', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Service Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Receiver Wallet NO', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Sender Wallet NO', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];
      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.created_on,
        tx.batch_id,
        tx.service_name,
        tx.receiver_wallet_no,
        tx.sender_wallet_no,
      ]);

      // Define summary rows with color styling
      const summaryRows = [
        [],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `TransactionReportOnChannelUsage.xlsx`);
    }
    else if (this.routeName == 'BulkReversalReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('Bulk Reversal Report', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Created Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Batch ID', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Receiver Wallet NO', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Sender Wallet NO', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Message', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Status', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];
      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.created_on,
        tx.batch_id,
        tx.amount,
        tx.receiver_wallet_no,
        tx.sender_wallet_no,
        tx.message,
        tx.status
      ]);

      // Define summary rows with color styling
      const summaryRows = [
        [],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `BulkReversalReport.xlsx`);
    }
    else if (this.routeName == 'AllAccountActivityReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('All Account Activity Report', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Created Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Category', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Authorized On', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Checker Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Checker Id', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Maker Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Maker Id', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Reason', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Status', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('User Id', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('User Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Auth Reason', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Reject Reason', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];
      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.created_on,
        tx.category,
        tx.authorized_on,
        tx.checker_name,
        tx.checker_id,
        tx.maker_name,
        tx.maker_id,
        tx.reason,
        tx.status,
        tx.user_id,
        tx.user_name,
        tx.auth_reason,
        tx.reject_reason,
      ]);

      // Define summary rows with color styling
      const summaryRows = [
        [],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `AllAccountActivityReport.xlsx`);
    }
    else if (this.routeName == 'ActiveUserBasedOnProvince') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('Active User Based On Province', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Created Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Category', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Authorized On', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Checker Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Checker Id', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Maker Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Maker Id', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Reason', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Status', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('User Id', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('User Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Auth Reason', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Reject Reason', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];
      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.created_on,
        tx.category,
        tx.authorized_on,
        tx.checker_name,
        tx.checker_id,
        tx.maker_name,
        tx.maker_id,
        tx.reason,
        tx.status,
        tx.user_id,
        tx.user_name,
        tx.auth_reason,
        tx.reject_reason,
      ]);

      // Define summary rows with color styling
      const summaryRows = [
        [],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `ActiveUserBasedOnProvince.xlsx`);
    }
    else if (this.routeName == 'RegisteredReportsBasedOnProfileAndProvince') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('Registered Reports Based On Profile And Province', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Created Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Category', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Authorized On', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Checker Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Checker Id', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Maker Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Maker Id', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Reason', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Status', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('User Id', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('User Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Auth Reason', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Reject Reason', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];
      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.created_on,
        tx.category,
        tx.authorized_on,
        tx.checker_name,
        tx.checker_id,
        tx.maker_name,
        tx.maker_id,
        tx.reason,
        tx.status,
        tx.user_id,
        tx.user_name,
        tx.auth_reason,
        tx.reject_reason,
      ]);

      // Define summary rows with color styling
      const summaryRows = [
        [],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `RegisteredReportsBasedOnProfileAndProvince.xlsx`);
    }
    //new
    //dcms reports
    else if (this.routeName == 'TokenPaymentReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('Token Payment Report', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Batch ID', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Account', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Head', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Sub Head', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Description', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Contra Account', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Credit', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Timestamp', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];
      // ✅ Convert your data into rows
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.batch_id,
        tx.account,
        tx.credit,
        tx.head,
        tx.sub,
        tx.description,
        tx.contra_acc,
        tx.credit,
        tx.time_stamp,
      ]);
      // Define summary rows with color styling
      const summaryRows = [
        [],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `TokenPaymentReport.xlsx`);
    }
    else if (this.routeName == 'TokenTransactionReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('Token Transaction Report', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];
      const tableHeaders = [
        [
          createStyledCell('Batch ID', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Account', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Credit', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Debit', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Head', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Sub Head', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Description', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Contra Account', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Timestamp', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.batch_id,
        tx.account,
        tx.credit,
        tx.debit,
        tx.head,
        tx.sub,
        tx.description,
        tx.contra_acc,
        tx.time_stamp,
      ]);
      // Define summary rows with color styling
      const summaryRows = [
        [],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `TokenTransactionReport.xlsx`);
    }
    else if (this.routeName == 'TokenUnredeemedReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('Token Unredeemed Report', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];
      const tableHeaders = [
        [
          createStyledCell('Token', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Token Generated At', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Taskira', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Province', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Reference No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Mobile Number', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Employee ID', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Account Number', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.token,
        tx.token_generated_at,
        tx.taskira,
        tx.province,
        tx.reference_no,
        tx.mobile_number,
        tx.name,
        tx.employee_id,
        tx.account_number,
        tx.amount,
      ]);
      // Define summary rows with color styling
      const summaryRows = [
        [],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `TokenUnredeemedReport.xlsx`);
    }
    else if (this.routeName == 'TokenWithdrawalReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('Token Withdrawal Report', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];
      const tableHeaders = [
        [
          createStyledCell('Token', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Token Generated At', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Taskira', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Province', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Reference No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Mobile Number', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Employee ID', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Account Number', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.token,
        tx.token_generated_at,
        tx.taskira,
        tx.province,
        tx.reference_no,
        tx.mobile_number,
        tx.name,
        tx.employee_id,
        tx.account_number,
        tx.amount,
      ]);
      const summaryRows = [
        [],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };
      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `TokenWithdrawalReport.xlsx`);
    }
    else if (this.routeName == 'FloatVsWalletReconciliation') {
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // 🔹 Header Info
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('Float Vs Wallet Reconciliation Report', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        [`Back Office User: ${this.backOfficeUser}`],
        []
      ];

      // 🔹 Float Accounts Table
      const floatHeader = [
        [createStyledCell('Float Accounts', { font: { bold: true, sz: 12 }, fill: { fgColor: { rgb: 'D9EAD3' } } })],
        [
          createStyledCell('Account', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Account Description', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Total Debit', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Total Credit', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } })
        ]
      ];

      const floatRows = this.floatAccounts.map((item: any) => [
        item.account,
        item.account_description,
        item.total_debit,
        item.total_credit,
        item.balance
      ]);

      const floatTotals = [
        [],
        [
          createStyledCell('Total Float Debit:', { font: { bold: true } }),
          '',
          '',
          createStyledCell(this.totalFloatDebit, { font: { bold: true } }),
        ],
        [
          createStyledCell('Total Float Credit:', { font: { bold: true } }),
          '',
          '',
          createStyledCell(this.totalFloatCredit, { font: { bold: true } })
        ],
        [
          createStyledCell('Total Float Balance:', { font: { bold: true } }),
          '',
          '',
          createStyledCell(this.totalFloatBalance, { font: { bold: true } })
        ],
        []
      ];

      // 🔹 Wallet Accounts Table
      const walletHeader = [
        [createStyledCell('Wallet Accounts', { font: { bold: true, sz: 12 }, fill: { fgColor: { rgb: 'D9EAD3' } } })],
        [
          createStyledCell('Account', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Account Description', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Total Debit', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Total Credit', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } })
        ]
      ];

      const walletRows = this.walletAccounts.map((item: any) => [
        item.sub,
        item.account_description,
        item.total_debit,
        item.total_credit,
        item.balance
      ]);


      const walletTotals = [
        [],
        [
          createStyledCell('Total Wallet Debit:', { font: { bold: true } }),
          '',
          '',
          createStyledCell(this.totalWalletDebit, { font: { bold: true } }),
        ],
        [
          createStyledCell('Total Wallet Credit:', { font: { bold: true } }),
          '',
          '',
          createStyledCell(this.totalWalletCredit, { font: { bold: true } })
        ],
        [
          createStyledCell('Total Wallet Balance:', { font: { bold: true } }),
          '',
          '',
          createStyledCell(this.totalWalletBalance, { font: { bold: true } })
        ],
        [],
        [
          createStyledCell('Float Vs E-Money Difference:', { font: { bold: true } }),
          '',
          '',
          createStyledCell(this.netSettlementDifference.toFixed(2), { font: { bold: true } })
        ]
      ];

      // 🔹 Combine all sections
      const worksheetData = [
        ...headerRows,
        ...floatHeader,
        ...floatRows,
        ...floatTotals,
        [],
        ...walletHeader,
        ...walletRows,
        ...walletTotals
      ];

      // 🔹 Create Sheet
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 20 }, { wch: 20 }
      ];

      // 🔹 Create Workbook
      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };

      XLSX.writeFile(workbook, 'FloatVsWalletReconciliation.xlsx');
    }
    //dcms reports
    else if (this.routeName == 'CustomerSummaryReport'
      || this.routeName == 'CorporateCustomerReport'
      || this.routeName == 'AgentSummaryReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });
      let varname;
      if (this.routeName == 'CustomerSummaryReport') {
        varname = 'Customer Summary Report Statement';
      } else if (this.routeName == 'CorporateCustomerReport') {
        varname = 'Corporate Summary Report Statement';
      } else if (this.routeName == 'AgentSummaryReport') {
        varname = 'Agent Summary Report Statement';
      }

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell(varname, { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Wallet No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Email', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Phone', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];

      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.name,
        tx.wallet_number,
        tx.email,
        tx.phone,
        tx.balance,
      ]);



      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };

      // Write the workbook and trigger download
      if (this.routeName == 'CustomerSummaryReport') {
        XLSX.writeFile(workbook, `CustomerSummaryReport.xlsx`);
      } else if (this.routeName == 'CorporateCustomerReport') {
        XLSX.writeFile(workbook, `CorporateCustomerReport.xlsx`);
      } else if (this.routeName == 'AgentSummaryReport') {
        XLSX.writeFile(workbook, `AgentSummaryReport.xlsx`);
      }
    }
    else if (this.routeName == 'CashInReport' ||
      this.routeName == 'CashOutReport' ||
      this.routeName == 'SalesVolumeByChannel' ||
      this.routeName == 'SalesVolumeByAgents' ||
      this.routeName == 'FinancialConsolidatedReport' ||
      this.routeName == 'BillPaymentReport'
      || this.routeName == 'RefundReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });
      let varname;
      if (this.routeName == 'CashInReport') {
        varname = 'Cash-In Statement';
      } else if (this.routeName == 'CashOutReport') {
        varname = 'Cash-out Statement';
      } else if (this.routeName == 'BillPaymentReport') {
        varname = 'Bill-PaymentReport Statement';
      } else if (this.routeName == 'RefundReport') {
        varname = 'Refund Report Statement';
      } else if (this.routeName == 'SalesVolumeByChannel') {
        varname = 'SalesVolume-By Channel Statement';
      } else if (this.routeName == 'SalesVolumeByAgents') {
        varname = 'SalesVolumeBy-Agents Statement';
      } else if (this.routeName == 'FinancialConsolidatedReport') {
        varname = 'FinancialConsolidated-Report Statement';
      }

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell(varname, { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      let tableHeaders: any[] = []
      if (this.routeName == 'CashInReport' || this.routeName == 'CashOutReport' || this.routeName === 'BillPaymentReport') {
        tableHeaders = [
          [
            createStyledCell('createdOn', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Service Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Txn_ID', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Sender Wallet No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Receiver Wallet No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Status', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          ]
        ];
      } else if (this.routeName == 'RefundReport') {
        tableHeaders = [
          [
            createStyledCell('createdOn', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Service Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Txn_ID', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Sender Wallet No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Wallet Type', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Status', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          ]
        ];
      } else if (this.routeName == 'SalesVolumeByChannel') {
        tableHeaders = [
          [
            createStyledCell('Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Channel', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('No of Sales', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Total Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          ]
        ];
      } else if (this.routeName == 'SalesVolumeByAgents') {
        tableHeaders = [
          [
            createStyledCell('Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Agent Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Wallet No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('No of Sales', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Total Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          ]
        ];
      } else if (this.routeName == 'FinancialConsolidatedReport') {
        tableHeaders = [
          [
            createStyledCell('Gl Type', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Sub-Head Account No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Head Account No	', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Sub Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Head Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          ]
        ];
      }

      // Convert transactions to a basic format (without specific styling)
      let transactionRows: any;
      if (this.routeName == 'CashInReport' || this.routeName == 'CashOutReport' || this.routeName === 'BillPaymentReport') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.created_date,
          tx.service_name,
          tx.batch_id,
          tx.sender_wallet_no,
          tx.receiver_wallet_no,
          tx.status,
          tx.amount,
        ]);
      } else if (this.routeName == 'RefundReport') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.created_on,
          tx.service_name,
          tx.batch_id,
          tx.sender_wallet_no,
          tx.wallet_type,
          tx.status,
          tx.amount,
        ]);
      } else if (this.routeName == 'SalesVolumeByChannel') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.date,
          tx.channel,
          tx.no_of_sales,
          tx.total_amount,
        ]);
      } else if (this.routeName == 'SalesVolumeByAgents') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.date,
          tx.agent_name,
          tx.wallet_number,
          tx.no_of_sales,
          tx.total_amount,
        ]);
      } else if (this.routeName == 'FinancialConsolidatedReport') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.gl_type,
          tx.sub_head_account_number,
          tx.head_account_number,
          tx.sub_balance,
          tx.head_balance,
        ]);
      }



      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };

      // Write the workbook and trigger download
      if (this.routeName == 'CashInReport') {
        XLSX.writeFile(workbook, `Cash-In-Report.xlsx`);
      } else if (this.routeName == 'CashOutReport') {
        XLSX.writeFile(workbook, `Cash-Out-Report.xlsx`);
      } else if (this.routeName == 'BillPaymentReport') {
        XLSX.writeFile(workbook, `BillPaymentReport.xlsx`);
      } else if (this.routeName == 'RefundReport') {
        XLSX.writeFile(workbook, `RefundReport.xlsx`);
      } else if (this.routeName == 'SalesVolumeByChannel') {
        XLSX.writeFile(workbook, `SalesVolumeByChannel.xlsx`);
      } else if (this.routeName == 'SalesVolumeByAgents') {
        XLSX.writeFile(workbook, `SalesVolumeByAgents.xlsx`);
      } else if (this.routeName == 'FinancialConsolidatedReport') {
        XLSX.writeFile(workbook, `FinancialConsolidatedReport.xlsx`);
      }
    }
    else if (this.routeName == 'AubBalance' ||
      this.routeName == 'GBBalance' ||
      this.routeName == 'ActiveServiceReconcileReport' ||
      this.routeName == 'AwccReconcileReport'
    ) {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });
      let varname;
      if (this.routeName == 'AubBalance') {
        varname = 'AubBalance Statement';
      } else if (this.routeName == 'GBBalance') {
        varname = 'GBBalance Statement';
      } else if (this.routeName == 'AwccReconcileReport') {
        varname = 'AwccReconcileReport Statement';
      } else if (this.routeName == 'ActiveServiceReconcileReport') {
        varname = 'ActiveServiceReconcileReport Statement';
      }

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell(varname, { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      let tableHeaders: any[] = []
      if (this.routeName == 'AubBalance') {
        tableHeaders = [
          [
            createStyledCell('AUB Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Total Pull Money', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Total Push Money', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          ]
        ];
      } else if (this.routeName == 'GBBalance') {
        tableHeaders = [
          [
            createStyledCell('GB Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Total Pull Money', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Total Push Money', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          ]
        ];
      } else if (this.routeName == 'AwccReconcileReport') {
        tableHeaders = [
          [
            createStyledCell('Inventory Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('AWCC Service Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Agent Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Recharge Topup Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Total Stock Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          ]
        ];
      }
      else if (this.routeName == 'ActiveServiceReconcileReport') {
        tableHeaders = [
          [
            createStyledCell('Inventory Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('AWCC Service Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Agent Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Recharge Topup Balance', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Total Stock Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          ]
        ];
      }

      // Convert transactions to a basic format (without specific styling)
      let transactionRows: any;
      if (this.routeName == 'AubBalance') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.aubBalance,
          tx.totalPullMoney,
          tx.totalPushMoney,
        ]);
      } else if (this.routeName == 'GBBalance') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.gbBalance,
          tx.totalPullMoney,
          tx.totalPushMoney,
        ]);
      } else if (this.routeName == 'AwccReconcileReport') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.inventoryBalance,
          tx.activeServiceBalance,
          tx.agentBalance,
          tx.rechargeTopupBalance,
          tx.totalStockAmount,
        ]);
      } else if (this.routeName == 'ActiveServiceReconcileReport') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.inventoryBalance,
          tx.activeServiceBalance,
          tx.agentBalance,
          tx.rechargeTopupBalance,
          tx.totalStockAmount,
        ]);
      }



      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };

      // Write the workbook and trigger download
      if (this.routeName == 'AubBalance') {
        XLSX.writeFile(workbook, `AubBalance.xlsx`);
      } else if (this.routeName == 'GBBalance') {
        XLSX.writeFile(workbook, `GBBalance.xlsx`);
      } else if (this.routeName == 'AwccReconcileReport') {
        XLSX.writeFile(workbook, `AwccReconcileReport.xlsx`);
      } else if (this.routeName == 'ActiveServiceReconcileReport') {
        XLSX.writeFile(workbook, `ActiveServiceReconcileReport.xlsx`);
      }
    }


    else if (this.routeName == 'EMoneyTransferReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('EMoney Transfer Report Statement', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Account Number', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Txn_No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Txn_Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Description', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Credit Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Debit Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];

      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.account,
        tx.batch_id,
        tx.transaction_date,
        tx.description,
        tx.total_credit,
        tx.total_debit,
      ]);

      // Define summary rows with color styling
      const summaryRows = [
        [],
        [createStyledCell(`Total Credit: ${this.totalCredit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        [createStyledCell(`Total Debit: ${this.totalDebit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        [createStyledCell(`Total Credit Count: ${this.totalCreditCount}`, { fill: { fgColor: { rgb: 'FCE4D6' } } })],
        [createStyledCell(`Total Debit Count: ${this.totalDebitCount}`, { fill: { fgColor: { rgb: 'FCE4D6' } } })],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };

      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `EMoney-transferreport-statement-report.xlsx`);
    }
    else if (this.routeName == 'AirtimeReconciliationReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });

      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell('Airtime Time-Topup Report', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Created On', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Service Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Customer Phone No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Txn_Ref_Id', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Txn_ID', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Sender Wallet No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Receiver Wallet No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Status', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];

      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.created_date,
        tx.service_name,
        tx.customer_mobile,
        tx.transaction_id,
        tx.batch_id,
        tx.sender_wallet_no,
        tx.receiver_wallet_no,
        tx.status,
        tx.amount,
      ]);



      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };

      // Write the workbook and trigger download
      XLSX.writeFile(workbook, `AirtimeTopUpReport.xlsx`);

    }
    else if (this.routeName == 'BatchReport') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });
      let varname: any
      if (this.routeName == 'BatchReport') {
        varname = 'Batch Report Statement'
      }
      // else if (this.routeName == 'StatementOfCashFlow') {
      //   varname = 'StatementOfCashFlow Statement'
      // }
      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell(varname, { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      const tableHeaders = [
        [
          createStyledCell('Txn_Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Service Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Type', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Description', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Account No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('GL_Type', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Txn_ID', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Credit', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          createStyledCell('Debit', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        ]
      ];

      // Convert transactions to a basic format (without specific styling)
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.txn_date,
        tx.service_name,
        tx.type,
        tx.description,
        tx.acc_number,
        tx.gl_type,
        tx.batch_id,
        tx.credit,
        tx.debit,
      ]);

      // Define summary rows with color styling
      const summaryRows = [
        [],
        [createStyledCell(`Total Credit: ${this.totalCredit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        [createStyledCell(`Total Debit: ${this.totalDebit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        [createStyledCell(`Total Credit Count: ${this.totalCreditCount}`, { fill: { fgColor: { rgb: 'FCE4D6' } } })],
        [createStyledCell(`Total Debit Count: ${this.totalDebitCount}`, { fill: { fgColor: { rgb: 'FCE4D6' } } })],
      ];

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };

      // Write the workbook and trigger download
      if (this.routeName == 'BatchReport') {
        XLSX.writeFile(workbook, `Batch-Report.xlsx`);
      }
      // else if (this.routeName == 'StatementOfCashFlow') {
      //   XLSX.writeFile(workbook, `StatementOfCashFlow.xlsx`);
      // }
    }
    else if (this.routeName == 'SalesTrendReport' || this.routeName == 'ProfitabilityReport'
      || this.routeName == 'LCTR' || this.routeName == 'IncomeReport'
      || this.routeName == 'TopupInventoryReport'
      || this.routeName == 'ActiveBasedReport'
      || this.routeName == 'InActiveBasedReport'
      || this.routeName == 'SuspendAccountReport'
      || this.routeName == 'LockAccountReport'
      || this.routeName == 'AggregateVolAndValTransaction') {
      // Helper function to create styled cell objects
      const createStyledCell = (value: any, styles: any) => ({
        v: value,
        s: styles
      });
      let varname;
      if (this.routeName == 'SalesTrendReport') {
        varname = 'SalesTrend-Report Statement';
      } else if (this.routeName == 'ProfitabilityReport') {
        varname = 'Profitability-Report Statement';
      } else if (this.routeName == 'LCTR') {
        varname = 'LCTR-Report Statement';
      } else if (this.routeName == 'TopupInventoryReport') {
        varname = 'Topup Inventory Report Statement';
      } else if (this.routeName == 'IncomeReport') {
        varname = 'Income Report Statement';
      } else if (this.routeName == 'AggregateVolAndValTransaction') {
        varname = 'Aggregate Volume And Value Transaction';
      } else if (this.routeName == 'ActiveBasedReport') {
        varname = 'ActiveBased Report Statement'
      } else if (this.routeName == 'InActiveBasedReport') {
        varname = 'In-ActiveBased Report Statement'
      } else if (this.routeName == 'SuspendAccountReport') {
        varname = 'Suspend Account Report Statement'
      } else if (this.routeName == 'LockAccountReport') {
        varname = 'Lock Account Report Statement'
      }


      // Define header rows with color styling
      const headerRows = [
        [createStyledCell('Afghan Besim Mobile Money Company,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('Darulaman Road, Hajiari Najari,', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [createStyledCell('KABUL, AFGHANISTAN', { fill: { fgColor: { rgb: 'FFAE19' } }, font: { color: { rgb: '000000' } } })],
        [],
        [createStyledCell(varname, { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define table headers with color styling
      let tableHeaders: any[] = []
      if (this.routeName == 'SalesTrendReport') {
        tableHeaders = [
          [
            createStyledCell('Service Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Credit Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Debit Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          ]
        ];
      } else if (this.routeName == 'ProfitabilityReport') {
        tableHeaders = [
          [
            createStyledCell('Account No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Credit Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Debit Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          ]
        ];
      } else if (this.routeName == 'LCTR') {
        tableHeaders = [
          [
            createStyledCell('Account No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Txn_No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Txn_Date', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Service Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          ]
        ];
      } else if (this.routeName == 'IncomeReport') {
        tableHeaders = [
          [
            createStyledCell('Service Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Credit Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Debit Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          ]
        ];
      } else if (this.routeName == 'TopupInventoryReport') {
        tableHeaders = [
          [
            createStyledCell('Service Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Credit Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Debit Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          ]
        ];
      } else if (this.routeName == 'AggregateVolAndValTransaction') {
        tableHeaders = [
          [
            createStyledCell('Service Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Credit Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Debit Amount', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Total Count', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          ]
        ];
      } else if (this.routeName == 'SuspendAccountReport') {
        tableHeaders = [
          [
            createStyledCell('Created On', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('First Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Last Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('User Name', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Email', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Phone', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Account No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Proof No', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('User Type	', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Active', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
            createStyledCell('Reason', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
          ]
        ];
      }


      // Convert transactions to a basic format (without specific styling)
      let transactionRows: any[] = []
      if (this.routeName == 'SalesTrendReport') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.service_name,
          tx.credit_amount,
          tx.debit_amount,
        ]);
      } else if (this.routeName == 'ProfitabilityReport') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.account,
          tx.credit_amount,
          tx.debit_amount,
        ]);
      } else if (this.routeName == 'LCTR') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.accountNo,
          tx.transactionNo,
          tx.trnDate,
          tx.serviceName,
          tx.amount,
        ]);
      } else if (this.routeName == 'IncomeReport') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.service_name,
          tx.credit,
          tx.debit,
        ]);
      } else if (this.routeName == 'TopupInventoryReport') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.service_name,
          tx.credit,
          tx.debit,
        ]);
      } else if (this.routeName == 'AggregateVolAndValTransaction') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.service_name,
          tx.total_credit,
          tx.total_debit,
          tx.total_count,
        ]);
      } else if (this.routeName == 'ActiveBasedReport') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          new Date(tx.created_on).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          tx.first_name,
          tx.last_name,
          tx.username,
          tx.email,
          tx.phone,
          tx.account_no,
          tx.cust_info_proof_number,
          tx.user_type,
          tx.active ? 'Active' : 'InActive',
          tx.reason,
        ]);
      }



      // Define summary rows with color styling
      let summaryRows: any;
      if (this.routeName != 'ActiveBasedReport'
        && this.routeName != 'InActiveBasedReport'
        && this.routeName != 'SuspendAccountReport'
        && this.routeName != 'LockAccountReport') {
        summaryRows = [
          [],
          [createStyledCell(`Total Credit: ${this.totalCredit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
          [createStyledCell(`Total Debit: ${this.totalDebit}`, { font: { bold: true }, fill: { fgColor: { rgb: 'F8CBAD' } } })],
        ];
      }

      // Combine all rows
      const worksheetData = [
        ...headerRows,
        ...tableHeaders,
        ...(transactionRows || []),
        ...summaryRows
      ];

      // Create worksheet and workbook
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
      ];

      const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };

      // Write the workbook and trigger download
      if (this.routeName == 'SalesTrendReport') {
        XLSX.writeFile(workbook, `SalesTrend-Report.xlsx`);
      } else if (this.routeName == 'ProfitabilityReport') {
        XLSX.writeFile(workbook, `Profitability-Report.xlsx`);
      } else if (this.routeName == 'LCTR') {
        XLSX.writeFile(workbook, `LCTR-Report.xlsx`);
      } else if (this.routeName == 'IncomeReport') {
        XLSX.writeFile(workbook, `IncomeReport.xlsx`);
      } else if (this.routeName == 'TopupInventoryReport') {
        XLSX.writeFile(workbook, `TopupInventoryReport.xlsx`);
      } else if (this.routeName == 'AggregateVolAndValTransaction') {
        XLSX.writeFile(workbook, `AggregateVolAndValTransaction.xlsx`);
      } else if (this.routeName == 'ActiveBasedReport') {
        XLSX.writeFile(workbook, 'ActiveBasedReport.xlsx');
      } else if (this.routeName == 'InActiveBasedReport') {
        XLSX.writeFile(workbook, 'InActiveBasedReport.xlsx');
      } else if (this.routeName == 'SuspendAccountReport') {
        XLSX.writeFile(workbook, 'SuspendAccountReport.xlsx');
      } else if (this.routeName == 'LockAccountReport') {
        XLSX.writeFile(workbook, 'LockAccountReport.xlsx');
      }

    } else if (this.routeName == 'EMoneyTransactionReport') {
      const createStyledCell = (value: any, styles: any = {}) => ({
        v: value,
        s: styles
      });

      const fromDate = this.datePipe.transform(
        this.dateForm.controls["fromDate"].value,
        "dd MMM yyyy"
      );

      const toDate = this.datePipe.transform(
        this.dateForm.controls["toDate"].value,
        "dd MMM yyyy"
      );

      const report = this.agentSummaryReport[0];

      const worksheetData = [

        // ================= HEADER =================

        [
          createStyledCell("Afghanistan Bank", {
            font: { bold: true, sz: 16 },
            alignment: { horizontal: "center" }
          })
        ],

        [
          createStyledCell(
            "Non-Banking Financial Institutions Supervision Directorate General",
            {
              alignment: { horizontal: "center" }
            }
          )
        ],

        [
          createStyledCell(
            "Follow-up and Offsite Supervision Section",
            {
              alignment: { horizontal: "center" }
            }
          )
        ],

        [
          createStyledCell("E-Money Transactions Report", {
            font: { bold: true, sz: 13 },
            alignment: { horizontal: "center" }
          })
        ],

        [],

        [
          createStyledCell("EMI Name", {
            font: { bold: true },
            fill: { fgColor: { rgb: "D9D9D9" } }
          }),
          "Afghan Besim Mobile Money Company"
        ],

        [
          createStyledCell("Date / Period", {
            font: { bold: true },
            fill: { fgColor: { rgb: "D9D9D9" } }
          }),
          `Statement Period: ${fromDate} - ${toDate}`
        ],

        [
          createStyledCell("Currency", {
            font: { bold: true },
            fill: { fgColor: { rgb: "D9D9D9" } }
          }),
          "Afghani"
        ],

        [
          createStyledCell("Frequency", {
            font: { bold: true },
            fill: { fgColor: { rgb: "D9D9D9" } }
          }),
          "Monthly"
        ],

        [],

        // ================= TABLE =================

        [
          createStyledCell("Line Code", {
            font: { bold: true },
            fill: { fgColor: { rgb: "A9D08E" } }
          }),

          createStyledCell("Items", {
            font: { bold: true },
            fill: { fgColor: { rgb: "A9D08E" } }
          }),

          createStyledCell("Amounts", {
            font: { bold: true },
            fill: { fgColor: { rgb: "A9D08E" } }
          })
        ],

        [
          1,
          "Beginning Balance",
          Number(report.beginBalance)
        ],

        [
          2,
          "Cash-in",
          Number(report.cashIn)
        ],

        [
          3,
          "Payments",
          Number(report.payments)
        ],

        [
          4,
          "Transfers",
          Number(report.transfers)
        ],

        [
          5,
          "Cash-out",
          Number(report.cashOut)
        ]
      ];

      const worksheet: XLSX.WorkSheet =
        XLSX.utils.aoa_to_sheet(worksheetData);

      // Merge title rows

      worksheet["!merges"] = [

        { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },

        { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } },

        { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } },

        { s: { r: 3, c: 0 }, e: { r: 3, c: 2 } }

      ];

      // Column widths

      worksheet["!cols"] = [
        { wch: 15 },
        { wch: 40 },
        { wch: 25 }
      ];

      // Format amount column

      for (let i = 11; i <= 15; i++) {

        const cell = XLSX.utils.encode_cell({ r: i, c: 2 });

        if (worksheet[cell]) {
          worksheet[cell].z = '#,##0.00';
        }

      }

      const workbook: XLSX.WorkBook = {

        Sheets: {
          Report: worksheet
        },

        SheetNames: ["Report"]

      };

      XLSX.writeFile(workbook, "E-Money-Transactions-Report.xlsx");
    } else if (this.routeName == "AllLoyaltyReports") {
      let data = {
        fromDate: this.dateForm.controls["fromDate"].value,
        toDate: this.dateForm.controls["toDate"].value,
        account: this.dateForm.controls["accNo"].value || null,
        type: this.dateForm.controls["loyaltyType"].value || null,
        serviceName: this.dateForm.controls["serviceName"].value || null,
      };
      this.apiService.reportV2WithParamsXlxs('AllLoyaltyReport', data).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'AllLoyaltyReports.xlsx';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
  }
  exportToCSV(): void {
    if (this.routeName == 'AccStatementReport' || this.routeName == 'ReversalReoport') {
      let heading: any;
      if (this.routeName == 'AccStatementReport') {
        heading = 'Your Statement'
      } else if (this.routeName == 'ReversalReoport') {
        heading = 'Account Statement With Reversal'
      }
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        [`${heading}`],
        [`Name: ${this.accountStatementDetails?.userDetailsPojo?.name}`],
        [`Account Number: ${this.accountStatementDetails?.userDetailsPojo?.accNo}`],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        [`Opening Balance: ${this.openingBalanceNew}`],
        [`Closing Balance: ${this.closingBalNew}`],
        [`Current Balance: ${this.currentBalance} (As on ${this.datePipe.transform(this.currentDateTime, 'dd-MM-yyyy hh:mm:ss a')})`],
        [`BackOffice User: ${this.backOfficeUser}`],
        []
      ];

      // Define column headers for the transaction table
      const tableHeaders = [['Txn_Date', 'Service Name', 'Description', 'Txn_ID', 'External_Ref_No', 'Purpose', 'Contra Acc', 'Debit', 'Credit', 'Balance']];

      // Convert transactions to an array format
      const transactionRows = this.accountStatementDetails?.accStatementPojo.map((tx: {
        txnDate: any; serviceName: any; description: any; batchId: any; extRefNumber: any; narration: any;
        credit: any; debit: any; contraAcc: any; runningBal: any; senderName: any; receiverName: any;
      }) => [
          tx.txnDate,
          tx.serviceName,
          tx.description,
          tx.batchId ? tx.batchId.toString() : '',
          tx.extRefNumber,
          tx.narration,
          tx.contraAcc,
          tx.debit,
          tx.credit,
          tx.runningBal
        ]);

      // Define summary rows
      const summaryRows = [
        [],
        [`Total Credit: ${this.totalCredit}`],
        [`Total Debit: ${this.totalDebit}`],
        [`Total Credit Count: ${this.totalCreditCount}`],
        [`Total Debit Count: ${this.totalDebitCount}`],
        [`Closing Balance: ${this.closingBalNew}`]
      ];

      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];

      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      if (this.routeName == 'AccStatementReport') {
        saveAs(csvBlob, `account-statement.csv`);
      } else if (this.routeName == 'ReversalReoport') {
        saveAs(csvBlob, `account-statement-with-reversal.csv`);
      }
    }
    else if (this.routeName == 'TransactionSummaryReport'
      || this.routeName == 'StockBatchReport'
      || this.routeName == 'StockAccStatementReport'
      || this.routeName == 'AgentReconcilationReport') {
      // Define header rows for the CSV file
      let varname;
      if (this.routeName == 'TransactionSummaryReport') {
        varname = 'TransactionSummary Report Statement';
      } else if (this.routeName == 'StockBatchReport') {
        varname = 'StockBatch Report Statement';
      } else if (this.routeName == 'AgentReconcilationReport') {
        varname = 'AgentReconcilation Report Statement';
      } else if (this.routeName == 'StockAccStatementReport') {
        varname = 'Stock-Account-Statement Report Statement';
      }
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        [varname],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define column headers for the transaction table
      let tableHeaders: any[] = []
      if (this.routeName == 'TransactionSummaryReport') {
        tableHeaders = [['Txn_Date', 'Service Name', 'Description', 'Account No', 'Txn_ID', 'Credit', 'Debit']];
      } else if (this.routeName == 'StockBatchReport') {
        tableHeaders = [['Txn_Date', 'Service Name', 'Description', 'Account No', 'Txn_ID', 'Head', 'Credit', 'Debit']];
      }

      let transactionRows: any[] = []
      if (this.routeName == 'TransactionSummaryReport') {
        transactionRows = this.trasactionSummaryReport.map((tx: any) => [
          tx.trxn_date,
          tx.service_name,
          tx.description,
          tx.account,
          tx.batch_id,
          tx.credit_amount,
          tx.debit_amount,
        ]);
      } else if (this.routeName == 'StockBatchReport'
        || this.routeName == 'AgentReconcilationReport'
        || this.routeName == 'StockAccStatementReport'
      ) {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.txn_date,
          tx.service_name,
          tx.description,
          tx.account_number,
          tx.transaction_no,
          tx.head,
          tx.credit_amount,
          tx.debit_amount,
        ]);
      }


      // Define summary rows
      const summaryRows = [
        [],
        [`Total Credit: ${this.totalCredit}`],
        [`Total Debit: ${this.totalDebit}`],
        [`Total Credit Count: ${this.totalCreditCount}`],
        [`Total Debit Count: ${this.totalDebitCount}`],
      ];

      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];

      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      if (this.routeName == 'TransactionSummaryReport') {
        saveAs(csvBlob, `transaction-summary-report.csv`);
      } else if (this.routeName == 'StockBatchReport') {
        saveAs(csvBlob, `StockBatchReport.csv`);
      } else if (this.routeName == 'AgentReconcilationReport') {
        saveAs(csvBlob, `AgentReconcilationReport.csv`);
      } else if (this.routeName == 'StockAccStatementReport') {
        saveAs(csvBlob, `StockAccStatementReport.csv`);
      }
    }
    else if (this.routeName == 'MonthlyBalanceReport' || this.routeName === 'BalanceSheet' || this.routeName == 'ProfitAndLossReport') {
      // Define header rows for the CSV file
      let varname;
      if (this.routeName == 'MonthlyBalanceReport') {
        varname = 'MonthlyBalance-Report Statement';
      } else if (this.routeName == 'BalanceSheet') {
        varname = 'YearlyBalanceSheet Statement';
      } else if (this.routeName == 'ProfitAndLossReport') {
        varname = 'ProfitAndLossReport Statement';
      }
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        [varname],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ]


      // Define table headers
      const tableHeaders = [
        ['GL Type', 'Head Account No', 'Sub Account No', 'Sub Account Balance', 'Head Account Balance'],
      ];

      // Transform grouped data into CSV rows
      const transactionRows: string[][] = [];
      this.groupedData.forEach((glTypeGroup: any) => {
        glTypeGroup.headAccounts.forEach((headAcc: any, headIndex: number) => {
          headAcc.items.forEach((item: any, itemIndex: number) => {
            transactionRows.push([
              headIndex === 0 && itemIndex === 0 ? glTypeGroup.glType : '',
              itemIndex === 0 ? headAcc.headAccNo : '',
              item.subHeadAccNo,
              item.subBalance,
              itemIndex === 0 ? item.headBalance : '',
            ]);
          });
        });
      });

      // Combine all rows
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];

      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      if (this.routeName == 'MonthlyBalanceReport') {
        saveAs(csvBlob, `MonthlyBalanceReport.csv`);
      } else if (this.routeName == 'BalanceSheet') {
        saveAs(csvBlob, `Yearly-MonthlyBalanceReport.csv`);
      } else if (this.routeName == 'ProfitAndLossReport') {
        saveAs(csvBlob, `ProfitAndLoss-Report.csv`);
      }
    }
    else if (this.routeName == 'AgentLiquidityReport') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['Transaction Summary Report Statement'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define column headers for the transaction table
      const tableHeaders = [['Txn_Date', 'Agent Name', 'Wallet No', 'Closing Balance', 'Opening Balance', 'Total Credited', 'Total Debited']];


      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.date,
        tx.agent_name,
        tx.wallet_number,
        tx.closing_balance,
        tx.opening_balance,
        tx.total_deposited,
        tx.total_withdrawn,
      ]);

      // Define summary rows
      const summaryRows = [
        [],
        [`Total Credit: ${this.totalCredit}`],
        [`Total Debit: ${this.totalDebit}`],
      ];

      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];

      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `AgentLiquidityReport.csv`);
    }
    //new
    else if (this.routeName == 'MerchantToAgentReport') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['Merchant To Agent Summary Report Statement'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define column headers for the transaction table
      const tableHeaders = [['Service Name', 'Account', 'Batch Id', 'Description', 'Transaction Date', 'Total Credited', 'Total Debited']];


      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.service_name,
        tx.account,
        tx.batch_id,
        tx.description,
        tx.trxn_date,
        tx.total_deposited,
        tx.total_withdrawn,
      ]);

      // Define summary rows
      const summaryRows = [
        [],
        [`Total Credit: ${this.totalCredit}`],
        [`Total Debit: ${this.totalDebit}`],
      ];

      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `MerchantToAgentReport.csv`);
    }
    else if (this.routeName == 'WalletToWalletReport') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['Wallet To Wallet Report Statement'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define column headers for the transaction table
      const tableHeaders = [['Transaction Date', 'Account', 'Service Name', 'Description']];
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.trxn_date,
        tx.account,
        tx.service_name,
        tx.description,
      ]);

      // Define summary rows
      const summaryRows = [
        [],
        [`Total Credit: ${this.totalCredit}`],
        [`Total Debit: ${this.totalDebit}`],
      ];

      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `WalletToWalletReport.csv`);
    }
    else if (this.routeName == 'FailedTransactionReport') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['Failed Transaction Report Statement'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define column headers for the transaction table
      const tableHeaders = [['Created Date', 'Account', 'Sender Wallet NO', 'Sender Wallet NO', 'Status']];


      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.created_on,
        tx.service_name,
        tx.account,
        tx.sender_wallet_no,
        tx.receiver_wallet_no,
        tx.status,
      ]);

      // Define summary rows
      const summaryRows = [
        [],
        // [`Total Credit: ${this.totalCredit}`],
        // [`Total Debit: ${this.totalDebit}`],
      ];

      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `FailedTransactionReport.csv`);
    }
    else if (this.routeName == 'PullTransactionReport') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['Pull Transaction Report Statement'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define column headers for the transaction table
      const tableHeaders = [['Amount', 'Service Name', 'Status', 'Created Date', 'Batch iD', 'Sender Wallet NO', 'Reciever Wallet NO']];
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.amount,
        tx.service_name,
        tx.status,
        tx.created_on,
        tx.batch_id,
        tx.sender_wallet_no,
        tx.receiver_wallet_no,
      ]);

      // Define summary rows
      const summaryRows = [
        [],
        // [`Total Credit: ${this.totalCredit}`],
        // [`Total Debit: ${this.totalDebit}`],
      ];

      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `PullTransactionReport.csv`);
    }
    else if (this.routeName == 'PushTransactionReport') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['Push Transaction Report Statement'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define column headers for the transaction table
      const tableHeaders = [['Amount', 'Service Name', 'Status', 'Created Date', 'Batch iD', 'Sender Wallet NO', 'Reciever Wallet NO']];


      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.amount,
        tx.service_name,
        tx.status,
        tx.created_on,
        tx.batch_id,
        tx.sender_wallet_no,
        tx.receiver_wallet_no,
      ]);

      // Define summary rows
      const summaryRows = [
        [],
        // [`Total Credit: ${this.totalCredit}`],
        // [`Total Debit: ${this.totalDebit}`],
      ];

      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `PushTransactionReport.csv`);
    }

    else if (this.routeName == 'ActiveUserReport') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['Active User Report'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define column headers for the transaction table
      const tableHeaders = [['Account Number', 'Mobile Number', 'Email', 'Account Description', 'Province Name', 'Usertype', 'Current Balance', 'First Txn Date', 'Last Txn Date']];


      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.account_no,
        tx.phone,
        tx.email,
        tx.account_description,
        tx.province_name,
        tx.user_type,
        tx.current_balance,
        tx.first_transaction_date,
        tx.last_transaction_date,
      ]);

      // Define summary rows
      const summaryRows = [
        [],
        // [`Total Credit: ${this.totalCredit}`],
        // [`Total Debit: ${this.totalDebit}`],
      ];

      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `ActiveUserReport.csv`);
    }

    else if (this.routeName == 'AggregateBalanceReport') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['Aggregate Balance Report Statement'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define column headers for the transaction table
      const tableHeaders = [['Date', 'Balance', 'Account Type']];


      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.date,
        tx.balance,
        tx.accType,
      ]);

      // Define summary rows
      const summaryRows = [
        [],
        // [`Total Credit: ${this.totalCredit}`],
        // [`Total Debit: ${this.totalDebit}`],
      ];

      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
      ];
      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `AggregateBalanceReport.csv`);
    }
    else if (this.routeName == 'BankTransactionReport') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['Bank Transaction Report Statement'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define column headers for the transaction table
      const tableHeaders = [['Transaction Date', 'Batch ID', 'GL Type', 'Account Number',
        'Description', 'Contract Account']];
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.txn_date,
        tx.batch_id,
        tx.gl_type,
        tx.acc_number,
        tx.description,
        tx.contraAcc,
      ]);

      // Define summary rows
      const summaryRows = [
        [],
        [`Total Credit: ${this.totalCredit}`],
        [`Total Debit: ${this.totalDebit}`],
      ];

      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `BankTransactionReport.csv`);
    }
    else if (this.routeName == 'SuspenseAccountTransactionReport') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['Suspense Account Transaction Report Statement'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define column headers for the transaction table
      const tableHeaders = [['Created Date', 'Account', 'Sender Wallet NO', 'Sender Wallet NO', 'Status']];


      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.created_on,
        tx.account,
        tx.sender_wallet_no,
        tx.receiver_wallet_no,
        tx.status,
      ]);

      // Define summary rows
      const summaryRows = [
        [],
        [`Total Credit: ${this.totalCredit}`],
        [`Total Debit: ${this.totalDebit}`],
      ];

      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `SuspenseAccountTransactionReport.csv`);
    }
    else if (this.routeName == 'TopUpDetailsTransactionReportByChannel') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['TopUp Details Transaction Report By Channel Statement'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define column headers for the transaction table
      const tableHeaders = [['Created Date', 'Account', 'Sender Wallet NO', 'Sender Wallet NO', 'Status']];
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.created_on,
        tx.account,
        tx.sender_wallet_no,
        tx.receiver_wallet_no,
        tx.status,
      ]);

      // Define summary rows
      const summaryRows = [
        [],
        [`Total Credit: ${this.totalCredit}`],
        [`Total Debit: ${this.totalDebit}`],
      ];

      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `TopUpDetailsTransactionReportByChannel.csv`);
    }
    else if (this.routeName == 'ApprovedKycReport') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['Approved KYC Report'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define column headers for the transaction table
      const tableHeaders = [['First Name', 'Last Name', 'Email', 'Phone', 'User Type',
        'Created Date', 'Modified Date', 'Status', 'Sequence NO']];
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.first_name,
        tx.last_name,
        tx.email,
        tx.phone,
        tx.user_type,
        tx.created_on,
        tx.modified_on,
        tx.status,
        tx.seq_no,
      ]);
      // Define summary rows
      const summaryRows = [
        [],
        [`Total Credit: ${this.totalCredit}`],
        [`Total Debit: ${this.totalDebit}`],
      ];

      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `ApprovedKycReport.csv`);
    }
    else if (this.routeName == 'MostActiveUsersReport') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['Most Active Users Report'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define column headers for the transaction table
      const tableHeaders = [['Created Date', 'Account', 'Sender Wallet NO', 'Sender Wallet NO', 'Status']];
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.created_on,
        tx.account,
        tx.sender_wallet_no,
        tx.receiver_wallet_no,
        tx.status,
      ]);

      // Define summary rows
      const summaryRows = [
        [],
        [`Total Credit: ${this.totalCredit}`],
        [`Total Debit: ${this.totalDebit}`],
      ];

      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `MostActiveUsersReport.csv`);
    }
    else if (this.routeName == 'UserwithMinimumSingleMonthlyTransactionReport') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['User with Minimum Single Monthly Transaction Report'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define column headers for the transaction table
      const tableHeaders = [['Created Date', 'Email', 'User Type', 'Phone', 'First Name', 'Last Name', 'Transaction Count']];
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.created_on,
        tx.email,
        tx.user_type,
        tx.phone,
        tx.first_name,
        tx.last_name,
        tx.transaction_count,
      ]);

      // Define summary rows
      const summaryRows = [
        [],
        [`Total Credit: ${this.totalCredit}`],
        [`Total Debit: ${this.totalDebit}`],
      ];

      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `UserwithMinimumSingleMonthlyTransactionReport.csv`);
    }
    else if (this.routeName == 'TransactionReportOnChannelUsage') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['Transaction Report On Channel Usage'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];
      // Define column headers for the transaction table
      const tableHeaders = [['Created Date', 'Batch ID', 'Service Name', 'Receiver Wallet NO', 'Sender Wallet NO']];
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.created_on,
        tx.batch_id,
        tx.service_name,
        tx.receiver_wallet_no,
        tx.sender_wallet_no
      ]);
      // Define summary rows
      const summaryRows = [
        [],
        [`Total Credit: ${this.totalCredit}`],
        [`Total Debit: ${this.totalDebit}`],
      ];
      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];
      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);
      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `TransactionReportOnChannelUsage.csv`);
    }
    //jasper downloads csv 
    if (this.routeName == "AuthorizedAgentQuartelyReport") {
      let body = { user: 'CUSTOMER' };
      this.apiService.downloadJasperCSV('AuthorizedAgentQuartelyReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'AuthorizedAgentQuartelyReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == "AccountHoldersWithHistoryOfFinancialCrime") {
      const body = { user: this.dateForm.controls['userTypeCrime'].value };
      this.apiService.downloadJasperCSV('AccountHoldersWithHistoryOfFinancialCrime', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'AccountHoldersWithHistoryOfFinancialCrime.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'StatementOfCashFlow') {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value; const body = {
        fromDate: fromDate,
        toDate: toDate,
      };
      this.apiService.downloadJasperCSV('StatementOfCashFlow', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'StatementOfCashFlow.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'DetailedTransactionProvinceWise') {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value; const body = {
        start_date: fromDate,
        end_date: toDate,
        lastCreatedOn: this.dateForm.controls['CreatedDate'].value,
        pageSize: 10
      };
      this.apiService.downloadJasperCSV('DetailedTransactionProvinceWise', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'DetailedTransactionProvinceWise.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'ActiveUserWithMinimumOneTrxnMonthlyReport') {
      // let fromDate = this.dateForm.controls["fromDate"].value;
      // let toDate = this.dateForm.controls["toDate"].value;
      // const body = {
      //   start_date: fromDate,
      //   end_date: toDate,
      //   user_type: this.dateForm.controls['userTypeMinOne'].value,
      // }
      this.apiService.downloadJasperCSV('ActiveUserWithMinimumOneTrxnMonthlyReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'ActiveUserWithMinimumOneTrxnMonthlyReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'TransactionsUnusualTiming') {
      const body = {
        created_on: this.dateForm.controls['CreatedDate'].value,
        service_name: this.dateForm.controls["Service_Name"].value,
      }
      this.apiService.downloadJasperCSV('TransactionsUnusualTiming', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'TransactionsUnusualTiming.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'RejectedTransactions') {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      const body = {
        service_name: this.dateForm.controls['Service_Name'].value,
        start_date: fromDate,
        end_date: toDate,
        batch_id: this.dateForm.controls["batchId"].value,
      };
      this.apiService.downloadJasperCSV('RejectedTransactions', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'RejectedTransactions.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'ActiveUserByProvinceBasedReportByProvince') {
      const body = { province: this.dateForm.controls['province'].value };
      this.apiService.downloadJasperCSV('ActiveUserByProvinceBasedReportByProvince', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'ActiveUserByProvinceBasedReportByProvince.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'ChangesInCustomerContactInformationReport') {
      const body = { changeRecency: this.changeRecency };
      this.apiService.downloadJasperCSV('ChangesInCustomerContactInformationReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'ChangesInCustomerContactInformationReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'AuthorizedPartnerQuarterlyReport') {
      // const body = {
      //   year: this.dateForm.controls["BalanceReportYear"].value,
      //   quarter: this.selectedQuaterValue,
      // };
      this.apiService.downloadJasperCSV('AuthorizedPartnerQuarterlyReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'AuthorizedPartnerQuarterlyReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'BalanceMovementReport') {
      const body = {
        year: this.dateForm.controls["BalanceReportYear"].value,
        month: this.dateForm.controls["BalanceReportMonth"].value
      };
      this.apiService.downloadJasperCSV('BalanceMovementReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'BalanceMovementReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'BalanceBreakupReport') {
      // let fromDate = this.dateForm.controls["fromDate"].value;
      // let toDate = this.dateForm.controls["toDate"].value;
      // const body = {
      //   start_date: fromDate,
      //   end_date: toDate,
      //   year: this.dateForm.controls["BalanceReportYear"].value,
      //   quarter: this.selectedQuaterValue,
      //   accountNo: this.dateForm.controls["BalanceReportAccNo"].value,
      // };
      this.apiService.downloadJasperCSV('BalanceBreakupReport', {}).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'BalanceBreakupReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'BankAccountLinkageReport') {
      const body = {
        user: this.dateForm.controls['userTypeCrime'].value,
        accountNo: this.dateForm.controls['AccNO'].value,
        walletNo: this.dateForm.controls['walletNO'].value,
      };
      this.apiService.downloadJasperCSV('BankAccountLinkageReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'BankAccountLinkageReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'CustomerRiskClassificationReportPeriodically') {
      const body = { risk: this.dateForm.controls['risk'].value };
      this.apiService.downloadJasperCSV('CustomerRiskClassificationReportPeriodically', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'CustomerRiskClassificationReportPeriodically.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'SuspiciousTransactionsReport') {
      const body = { service: this.dateForm.controls['detailedTransService'].value };
      this.apiService.downloadJasperCSV('SuspiciousTransactionsReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'SuspiciousTransactionsReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'RegisteredReportBasedOnProfileAndProvince') {
      const body = {
        profile: this.dateForm.controls["profile"].value,
        account_kyc: this.dateForm.controls["accKYC"].value
      };
      this.apiService.downloadJasperCSV('RegisteredReportBasedOnProfileAndProvince', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'RegisteredReportBasedOnProfileAndProvince.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'DataIntegrityandSecurity') {
      const body = { province: this.provinceVal };
      this.apiService.downloadJasperCSV('DataIntegrityandSecurity', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'DataIntegrityandSecurity.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'AdhocReport') {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      const body = {
        start_date: fromDate,
        end_date: toDate,
        status: this.dateForm.controls["status"].value,
        service_name: this.dateForm.controls["Service_Name"].value,
        status_2: this.dateForm.controls["status"].value,
        service_name_2: this.dateForm.controls["Service_Name"].value,
        start_date_2: fromDate,
        end_date_2: toDate
      };
      this.apiService.downloadJasperCSV('AdhocReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'AdhocReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    else if (this.routeName == 'AccessToTransactionDataReport') {
      let fromDate = this.dateForm.controls["fromDate"].value;
      let toDate = this.dateForm.controls["toDate"].value;
      const body = {
        start_date: fromDate,
        end_date: toDate,
        status: this.dateForm.controls["status"].value,
        service_name: this.dateForm.controls["Service_Name"].value,
        status_2: this.dateForm.controls["status"].value,
        service_name_2: this.dateForm.controls["Service_Name"].value,
        start_date_2: fromDate,
        end_date_2: toDate
      };
      this.apiService.downloadJasperCSV('AccessToTransactionDataReport', body).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(data);
          a.href = blobUrl;
          a.download = 'AccessToTransactionDataReport.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => { this.isLoading = false; alert("Error Try Again"); }
      });
    }
    //jasper downloads csv 
    else if (this.routeName == 'BulkReversalReport') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['Bulk Reversal Report'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];
      // Define column headers for the transaction table
      const tableHeaders = [['Created Date', 'Batch ID', 'Amount', 'Receiver Wallet NO', 'Sender Wallet NO'
        , 'Message', 'Status']];
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.created_on,
        tx.batch_id,
        tx.amount,
        tx.receiver_wallet_no,
        tx.sender_wallet_no,
        tx.message,
        tx.status
      ]);
      // Define summary rows
      const summaryRows = [
        [],
      ];
      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];
      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);
      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `BulkReversalReport.csv`);
    }
    else if (this.routeName == 'AllAccountActivityReport') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['All Account Activity Report'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];
      // Define column headers for the transaction table
      const tableHeaders = [['Created Date', 'Category', 'Authorized On', 'Checker Name', 'Checker Id'
        , 'Maker Name', 'Maker Id', 'Reason', 'Status', 'User Id', 'User Name', 'Auth Reason', 'Reject Reason'
      ]];
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.created_on,
        tx.category,
        tx.authorized_on,
        tx.checker_name,
        tx.checker_id,
        tx.maker_name,
        tx.maker_id,
        tx.reason,
        tx.status,
        tx.user_id,
        tx.user_name,
        tx.auth_reason,
        tx.reject_reason,
      ]);
      // Define summary rows
      const summaryRows = [
        [],
      ];
      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];
      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);
      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `AllAccountActivityReport.csv`);
    }
    else if (this.routeName == 'ActiveUserBasedOnProvince') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['Active User Based On Province'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];
      // Define column headers for the transaction table
      const tableHeaders = [['Created Date', 'Category', 'Authorized On', 'Checker Name', 'Checker Id'
        , 'Maker Name', 'Maker Id', 'Reason', 'Status', 'User Id', 'User Name', 'Auth Reason', 'Reject Reason'
      ]];
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.created_on,
        tx.category,
        tx.authorized_on,
        tx.checker_name,
        tx.checker_id,
        tx.maker_name,
        tx.maker_id,
        tx.reason,
        tx.status,
        tx.user_id,
        tx.user_name,
        tx.auth_reason,
        tx.reject_reason,
      ]);
      // Define summary rows
      const summaryRows = [
        [],
      ];
      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];
      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);
      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `ActiveUserBasedOnProvince.csv`);
    }
    else if (this.routeName == 'RegisteredReportsBasedOnProfileAndProvince') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['Registered Reports Based OnProfileAndProvince'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];
      // Define column headers for the transaction table
      const tableHeaders = [['Created Date', 'Category', 'Authorized On', 'Checker Name', 'Checker Id'
        , 'Maker Name', 'Maker Id', 'Reason', 'Status', 'User Id', 'User Name', 'Auth Reason', 'Reject Reason'
      ]];
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.created_on,
        tx.category,
        tx.authorized_on,
        tx.checker_name,
        tx.checker_id,
        tx.maker_name,
        tx.maker_id,
        tx.reason,
        tx.status,
        tx.user_id,
        tx.user_name,
        tx.auth_reason,
        tx.reject_reason,
      ]);
      // Define summary rows
      const summaryRows = [
        [],
      ];
      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];
      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);
      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `RegisteredReportsBasedOnProfileAndProvince.csv`);
    }
    //new
    //dcms reports
    else if (this.routeName == 'TokenPaymentReport') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['Token Payment Report'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];
      // Define column headers for the transaction table
      const tableHeaders = [[
        'Batch ID',
        'Account',
        'Amount',
        'Head',
        'Sub Head',
        'Description',
        'Contra Account',
        'Credit',
        'Timestamp'
      ]];
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.batch_id,
        tx.account,
        tx.credit,         // or tx.credit if 'amount' is not separate
        tx.head,
        tx.sub,
        tx.description,
        tx.contra_acc,
        tx.credit,
        tx.time_stamp
      ]);

      // Define summary rows
      const summaryRows = [
        [],
      ];
      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];
      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);
      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `TokenPaymentReport.csv`);
    }
    else if (this.routeName == 'TokenTransactionReport') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['Token Transaction Report'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];
      // Define column headers for the transaction table
      const tableHeaders = [[
        'Batch ID',
        'Account',
        'Credit',
        'Debit',
        'Head',
        'Sub Head',
        'Description',
        'Contra Account',
        'Timestamp'
      ]];
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.batch_id,
        tx.account,
        tx.credit,
        tx.debit,
        tx.head,
        tx.sub,
        tx.description,
        tx.contra_acc,
        tx.time_stamp
      ]);
      // Define summary rows
      const summaryRows = [
        [],
      ];
      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];
      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);
      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `TokenTransactionReport.csv`);
    }
    else if (this.routeName == 'TokenUnredeemedReport') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['Token Unredeemed Report'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];
      // Define column headers for the transaction table
      const tableHeaders = [[
        'Token',
        'Token Generated At',
        'Taskira',
        'Province',
        'Reference No',
        'Mobile Number',
        'Name',
        'Employee ID',
        'Account Number',
        'Amount'
      ]];
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.token,
        tx.token_generated_at,
        tx.taskira,
        tx.province,
        tx.reference_no,
        tx.mobile_number,
        tx.name,
        tx.employee_id,
        tx.account_number,
        tx.amount
      ]);

      // Define summary rows
      const summaryRows = [
        [],
      ];
      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];
      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);
      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `TokenUnredeemedReport.csv`);
    }
    else if (this.routeName == 'TokenWithdrawalReport') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['Token Withdrawal Report'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];
      const tableHeaders = [[
        'Token',
        'Token Generated At',
        'Taskira',
        'Province',
        'Reference No',
        'Mobile Number',
        'Name',
        'Employee ID',
        'Account Number',
        'Amount'
      ]];
      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.token,
        tx.token_generated_at,
        tx.taskira,
        tx.province,
        tx.reference_no,
        tx.mobile_number,
        tx.name,
        tx.employee_id,
        tx.account_number,
        tx.amount
      ]);
      const summaryRows = [
        [],
      ];
      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];
      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);
      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `TokenWithdrawalReport.csv`);
    }
    else if (this.routeName == 'FloatVsWalletReconciliation') {
      // 🔹 Header rows
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['Float Vs Wallet Reconciliation Report'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        [`Back Office User: ${this.backOfficeUser}`],
        []
      ];

      // 🔹 Float Accounts table
      const floatHeader = [['Float Accounts']];
      const floatTableHeaders = [['Account', 'Account Description', 'Total Debit', 'Total Credit', 'Balance']];
      const floatRows = this.floatAccounts.map((item: any) => [
        item.account,
        item.account_description,
        item.total_debit,
        item.total_credit,
        item.balance
      ]);
      const floatTotals = [
        [],
        ['Total Float Debit', '', '', this.totalFloatDebit],
        ['Total Float Credit', '', '', this.totalFloatCredit],
        ['Total Float Balance', '', '', this.totalWalletBalance],
        []
      ];

      // 🔹 Wallet Accounts table
      const walletHeader = [['Wallet Accounts']];
      const walletTableHeaders = [['Account', 'Account Description', 'Total Debit', 'Total Credit', 'Balance']];
      const walletRows = this.walletAccounts.map((item: any) => [
        item.sub,
        item.account_description,
        item.total_debit,
        item.total_credit,
        item.balance
      ]);
      const walletTotals = [
        [],
        ['Total Wallet Debit', '', '', this.totalWalletDebit],
        ['Total Wallet Credit', '', '', this.totalWalletCredit],
        ['Total Wallet Balance', '', '', this.totalWalletBalance],
        [],
        ['Float Vs E-Money Difference', '', '', this.netSettlementDifference.toFixed(2)]
      ];

      // 🔹 Combine everything for CSV
      const csvData = [
        ...headerRows,
        ...floatHeader,
        ...floatTableHeaders,
        ...floatRows,
        ...floatTotals,
        [],
        ...walletHeader,
        ...walletTableHeaders,
        ...walletRows,
        ...walletTotals
      ];

      // 🔹 Convert to worksheet
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);
      worksheet['!cols'] = [
        { wch: 35 }, { wch: 35 }, { wch: 20 }, { wch: 20 }
      ];

      // 🔹 Convert worksheet to CSV
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      // 🔹 Create CSV Blob and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, 'FloatVsWalletReconciliation.csv');
    }
    //dcms report
    else if (this.routeName == 'CashInReport' ||
      this.routeName == 'CashOutReport' || this.routeName == 'BillPaymentReport'
      || this.routeName == 'RefundReport' || this.routeName == 'SalesVolumeByChannel' ||
      this.routeName == 'FinancialConsolidatedReport' ||
      this.routeName == 'SalesVolumeByAgents') {
      let varname;
      if (this.routeName == 'CashInReport') {
        varname = 'Cash-In Statement';
      } else if (this.routeName == 'CashOutReport') {
        varname = 'Cash-out Statement';
      } else if (this.routeName == 'BillPaymentReport') {
        varname = 'BillPaymentReport Statement';
      } else if (this.routeName == 'RefundReport') {
        varname = 'Refund Report Statement';
      } else if (this.routeName == 'SalesVolumeByChannel') {
        varname = 'SalesVolume-By Channel Statement';
      } else if (this.routeName == 'SalesVolumeByAgents') {
        varname = 'SalesVolumeBy-Agents Channel Statement';
      } else if (this.routeName == 'FinancialConsolidatedReport') {
        varname = 'FinancialConsolidated Report Statement';
      }
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        [varname],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define column headers for the transaction table
      let tableHeaders: any[] = []
      if (this.routeName == 'CashInReport' || this.routeName == 'CashOutReport' || this.routeName === 'BillPaymentReport') {
        tableHeaders = [['createdOn', 'Service Name', 'Txn_ID', 'Sender Wallet No', 'Receiver Wallet No', 'Status', 'Amount']];
      } else if (this.routeName == 'RefundReport') {
        tableHeaders = [['createdOn', 'Service Name', 'Txn_ID', 'Sender Wallet No', 'Wallet Type', 'Status', 'Amount']];
      } else if (this.routeName == 'SalesVolumeByChannel') {
        tableHeaders = [['Date', 'Channel', 'Txn_ID', 'No of Sales', 'Total Amount',]];
      } else if (this.routeName == 'SalesVolumeByAgents') {
        tableHeaders = [['Date', 'Agent Name', 'Wallet No', 'No of Sales', 'Total Amount',]];
      } else if (this.routeName == 'FinancialConsolidatedReport') {
        tableHeaders = [['Gl Type', 'Sub-Head Account No', 'Head Account No	', 'Sub Balance', 'Head Balance',]];
      }

      let transactionRows: any
      if (this.routeName == 'CashInReport' || this.routeName == 'CashOutReport' || this.routeName === 'BillPaymentReport') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.created_date,
          tx.service_name,
          tx.batch_id,
          tx.sender_wallet_no,
          tx.receiver_wallet_no,
          tx.status,
          tx.amount,
        ]);

      } else if (this.routeName == 'RefundReport') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.created_on,
          tx.service_name,
          tx.batch_id,
          tx.sender_wallet_no,
          tx.wallet_type,
          tx.status,
          tx.amount,
        ]);
      } else if (this.routeName == 'SalesVolumeByChannel') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.date,
          tx.channel,
          tx.no_of_sales,
          tx.total_amount,
        ]);
      } else if (this.routeName == 'SalesVolumeByAgents') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.date,
          tx.agent_name,
          tx.wallet_number,
          tx.no_of_sales,
          tx.total_amount,
        ]);
      } else if (this.routeName == 'FinancialConsolidatedReport') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.gl_type,
          tx.sub_head_account_number,
          tx.head_account_number,
          tx.sub_balance,
          tx.head_balance,
        ]);
      }
      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];

      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      if (this.routeName == 'CashInReport') {
        saveAs(csvBlob, `cash-in-report.csv`);
      } else if (this.routeName == 'CashOutReport') {
        saveAs(csvBlob, `cash-out-report.csv`);
      } else if (this.routeName == 'BillPaymentReport') {
        saveAs(csvBlob, `BillPaymentReport.csv`);
      } else if (this.routeName == 'RefundReport') {
        saveAs(csvBlob, `RefundReport.csv`);
      } else if (this.routeName == 'SalesVolumeByChannel') {
        saveAs(csvBlob, `SalesVolumeByChannel.csv`);
      } else if (this.routeName == 'SalesVolumeByAgents') {
        saveAs(csvBlob, `SalesVolumeByAgents.csv`);
      } else if (this.routeName == 'FinancialConsolidatedReport') {
        saveAs(csvBlob, `FinancialConsolidatedReport.csv`);
      }
    }
    else if (this.routeName == 'AubBalance'
      || this.routeName == 'GBBalance'
      || this.routeName == 'ActiveServiceReconcileReport'
      || this.routeName == 'AwccReconcileReport') {
      let varname;
      if (this.routeName == 'AubBalance') {
        varname = 'AubBalance Statement';
      } else if (this.routeName == 'GBBalance') {
        varname = 'GBBalance Statement';
      } else if (this.routeName == 'AwccReconcileReport') {
        varname = 'AwccReconcileReport Statement';
      } else if (this.routeName == 'ActiveServiceReconcileReport') {
        varname = 'ActiveServiceReconcileReport Statement';
      }
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        [varname],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define column headers for the transaction table
      let tableHeaders: any[] = []
      if (this.routeName == 'AubBalance') {
        tableHeaders = [['AUB Balance', 'Total Pull Money', 'Total Push Money',]];
      } else if (this.routeName == 'GBBalance') {
        tableHeaders = [['GB Balance', 'Total Pull Money', 'Total Push Money',]];
      } else if (this.routeName == 'AwccReconcileReport' || this.routeName == 'ActiveServiceReconcileReport') {
        tableHeaders = [['Inventory Balance', 'AWCC Service Balance', ' Agent Balance', 'Recharge Topup Balance', 'Total Stock Amount',]];
      }

      let transactionRows: any
      if (this.routeName == 'AubBalance') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.aubBalance,
          tx.totalPullMoney,
          tx.totalPushMoney,
        ]);

      } else if (this.routeName == 'GBBalance') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.gbBalance,
          tx.totalPullMoney,
          tx.totalPushMoney,
        ]);
      }
      else if (this.routeName == 'AwccReconcileReport') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.inventoryBalance,
          tx.activeServiceBalance,
          tx.agentBalance,
          tx.rechargeTopupBalance,
          tx.totalStockAmount,
        ]);
      }
      else if (this.routeName == 'ActiveServiceReconcileReport') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.inventoryBalance,
          tx.activeServiceBalance,
          tx.agentBalance,
          tx.rechargeTopupBalance,
          tx.totalStockAmount,
        ]);
      }
      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];

      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      if (this.routeName == 'AubBalance') {
        saveAs(csvBlob, `AubBalance.csv`);
      } else if (this.routeName == 'GBBalance') {
        saveAs(csvBlob, `GBBalance.csv`);
      } else if (this.routeName == 'AwccReconcileReport') {
        saveAs(csvBlob, `AwccReconcileReport.csv`);
      } else if (this.routeName == 'ActiveServiceReconcileReport') {
        saveAs(csvBlob, `ActiveServiceReconcileReport.csv`);
      }
    }
    else if (this.routeName == 'CorporateCustomerReport'
      || this.routeName == 'CustomerSummaryReport'
      || this.routeName == 'AgentSummaryReport') {
      let varname;
      if (this.routeName == 'CorporateCustomerReport') {
        varname = 'Corporate Summary Report Statement';
      } else if (this.routeName == 'CustomerSummaryReport') {
        varname = 'Customer Summary Report Statement';
      } else if (this.routeName == 'AgentSummaryReport') {
        varname = 'Agent Summary Report Statement';
      }
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        [varname],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define column headers for the transaction table
      const tableHeaders = [['Name', 'Wallet No', 'Email', 'Phone', 'Balance']];


      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.name,
        tx.wallet_number,
        tx.email,
        tx.phone,
        tx.balance,
      ]);

      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];

      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      if (this.routeName == 'CorporateCustomerReport') {
        saveAs(csvBlob, `CorporateSummaryReport.csv`);
      } else if (this.routeName == 'CustomerSummaryReport') {
        saveAs(csvBlob, `CustomerSummaryReport.csv`);
      } else if (this.routeName == 'AgentSummaryReport') {
        saveAs(csvBlob, `AgentSummaryReport.csv`);
      }
    }
    else if (this.routeName == 'EMoneyTransferReport') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['EMoney Transfer Report Statement'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define column headers for the transaction table
      const tableHeaders = [['Account Number', 'Txn_No', 'Txn_Date', 'Description', 'Credit Amount', 'Debit Amount']];


      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.account,
        tx.batch_id,
        tx.transaction_date,
        tx.description,
        tx.total_credit,
        tx.total_debit,]);

      // Define summary rows
      const summaryRows = [
        [],
        [`Total Credit: ${this.totalCredit}`],
        [`Total Debit: ${this.totalDebit}`],
        [`Total Credit Count: ${this.totalCreditCount}`],
        [`Total Debit Count: ${this.totalDebitCount}`],
      ];

      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];

      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `EMoneyTransferReport.csv`);
    }
    else if (this.routeName == 'AirtimeReconciliationReport') {
      // Define header rows for the CSV file
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        ['Airtime Time-Topup Report'],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define column headers for the transaction table
      const tableHeaders = [['Created On', 'Service Name', 'Customer Phone No', 'Txn_Ref_Id', 'Txn_ID', 'Sender Wallet No', 'Receiver Wallet No', 'Status', 'Amount']];


      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.created_date,
        tx.service_name,
        tx.customer_mobile,
        tx.transaction_id,
        tx.batch_id,
        tx.sender_wallet_no,
        tx.receiver_wallet_no,
        tx.status,
        tx.amount,
      ]);

      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];

      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `AirtimeTopUpReport.csv`);

    }
    else if (this.routeName == 'BatchReport') {
      // Define header rows for the CSV file
      let varname;
      if (this.routeName == 'MonthlyBalanceReport') {
        varname = 'MonthlyBalance-Report Statement';
      } else if (this.routeName == 'BalanceSheet') {
        varname = 'YearlyBalanceSheet Statement';
      }
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        [varname],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define column headers for the transaction table
      const tableHeaders = [['Txn_Date', 'Service Name', 'Type', 'Description', 'Account No', 'GL_Type', 'Txn_ID', 'Credit', 'Debit']];


      const transactionRows = this.agentSummaryReport.map((tx: any) => [
        tx.txn_date,
        tx.service_name,
        tx.type,
        tx.description,
        tx.acc_number,
        tx.gl_type,
        tx.batch_id,
        tx.credit,
        tx.debit,
      ]);

      // Define summary rows
      const summaryRows = [
        [],
        [`Total Credit: ${this.totalCredit}`],
        [`Total Debit: ${this.totalDebit}`],
        [`Total Credit Count: ${this.totalCreditCount}`],
        [`Total Debit Count: ${this.totalDebitCount}`],
      ];

      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];

      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      if (this.routeName == 'BatchReport') {
        saveAs(csvBlob, `Batch-report.csv`);
      }
      //  else if (this.routeName == 'StatementOfCashFlow') {
      //   saveAs(csvBlob, `StatementOfCashFlow.csv`);
      // }
    }
    else if (this.routeName == 'SalesTrendReport' || this.routeName == 'ProfitabilityReport' || this.routeName == 'LCTR') {
      // Define header rows for the CSV file
      let varname;
      if (this.routeName == 'SalesTrendReport') {
        varname = 'SalesTrend Report Statement';
      } else if (this.routeName == 'ProfitabilityReport') {
        varname = 'Profitability Report Statement';
      } else if (this.routeName == 'LCTR') {
        varname = 'LCTR Report Statement';
      } else if (this.routeName == 'BeginningBalanceReport') {
        varname = 'BeginningBalance Report Statement';
      }
      const headerRows = [
        ['Afghan Besim Mobile Money Company,'],
        ['Darulaman Road, Hajiari Najari,'],
        ['KABUL, AFGHANISTAN'],
        [],
        [varname],
        [`Statement Period: ${this.dateForm.controls["fromDate"].value} to ${this.dateForm.controls["toDate"].value}`],
        []
      ];

      // Define column headers for the transaction table
      let tableHeaders: any[] = []
      if (this.routeName == 'SalesTrendReport') {
        tableHeaders = [['Service Name', 'Credit Amount Name', 'Debit Amount',]];

      } else if (this.routeName == 'ProfitabilityReport') {
        tableHeaders = [['Account No', 'Credit Amount Name', 'Debit Amount',]];

      } else if (this.routeName == 'LCTR') {
        tableHeaders = [['Account No', 'Txn_No', 'Txn_No', 'Service Name', 'Amount',]];
      } else if (this.routeName == 'BeginningBalanceReport') {
        tableHeaders = [['Report Date	', 'Account No', 'GL_Type', 'Closing Balance', 'No of Ledger	', 'Total Credit', 'Total Debit',]];

      }


      let transactionRows: any
      if (this.routeName == 'SalesTrendReport') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.service_name,
          tx.credit_amount,
          tx.debit_amount,
        ]);
      } else if (this.routeName == 'ProfitabilityReport') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.account,
          tx.credit_amount,
          tx.debit_amount,
        ]);
      } else if (this.routeName == 'LCTR') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.accountNo,
          tx.transactionNo,
          tx.trnDate,
          tx.serviceName,
          tx.amount,
        ]);

      } else if (this.routeName == 'BeginningBalanceReport') {
        transactionRows = this.agentSummaryReport.map((tx: any) => [
          tx.report_date,
          tx.account,
          tx.gl_type,
          tx.closing_balance,
          tx.number_of_ledger,
          tx.total_deposited,
          tx.total_withdrawn,
        ]);

      }


      // Define summary rows
      const summaryRows = [
        [],
        [`Total Credit: ${this.totalCredit}`],
        [`Total Debit: ${this.totalDebit}`],
        [`Total Credit Count: ${this.totalCreditCount}`],
        [`Total Debit Count: ${this.totalDebitCount}`],
      ];

      // Combine all rows for the CSV file
      const csvData = [
        ...headerRows,
        ...tableHeaders,
        ...transactionRows,
        ...summaryRows
      ];

      // Create a worksheet for CSV
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(csvData);

      // Apply the column width to create spacing if needed
      worksheet['!cols'] = [
        { wch: 30 }, // Adjust width as needed for alignment
        { wch: 30 },
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];

      // Write to CSV format
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      // Create a Blob from the CSV data and trigger download
      const csvBlob: Blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      if (this.routeName == 'SalesTrendReport') {
        saveAs(csvBlob, `SalesTrend-report.csv`);
      } else if (this.routeName == 'ProfitabilityReport') {
        saveAs(csvBlob, `ProfitabilityReport.csv`);
      } else if (this.routeName == 'LCTR') {
        saveAs(csvBlob, `LCTR.csv`);
      } else if (this.routeName == 'BeginningBalanceReport') {
        saveAs(csvBlob, `BeginningBalanceReport.csv`);
      }
    } else if (this.routeName == "AllLoyaltyReports") {
      let data = {
        fromDate: this.dateForm.controls["fromDate"].value,
        toDate: this.dateForm.controls["toDate"].value,
        account: this.dateForm.controls["accNo"].value || null,
        type: this.dateForm.controls["loyaltyType"].value || null,
        serviceName: this.dateForm.controls["serviceName"].value || null,
      };
      this.apiService.reportV2WithParamsCsv('AllLoyaltyReport', data).subscribe({
        next: (data: Blob) => {
          this.isLoading = false;
          console.log('Blob size:', data.size);
          this.pdfSrc = data;
          const blobUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'AllLoyaltyReports.csv';
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
  }

  kycReportsBtn(value: any) {
    this.dataSharing.kycData$.subscribe((res) => {
      if (res) {
        this.KycModuleService.downloadPDF(res?.id).subscribe(
          (data: Blob) => {
            console.log(data.type);  // Ensure it logs 'application/pdf'
            const filename = 'kyc-report.pdf';
            saveAs(data, filename);
          },
          (error) => {
            console.error('Download failed:', error);
            alert('Failed to download PDF');
          }
        );
      }
    })

  }

  // -------------------------------------------------------------------------------------------//
  currentPage: number = 1;
  onClickView(item: any) {
    this.currentPage++
    this.dataSharing.kycData(item)
  }
  goback() {
    this.currentPage--
  }

  selectedYear!: any; // Holds the selected year to display in the input field

  _inputCtrl: FormControl = new FormControl();
  /**
   * Triggered when a year is selected. Sets the value in the form field and closes the datepicker.
   */
  onYearSelected(event: Date, datepicker: MatDatepicker<Date>): void {
    // Set the year as a string to display in the input field
    const momentDate = moment(event);
    console.log(momentDate)
    if (momentDate.isValid()) {
      console.log(momentDate)
      this._inputCtrl.setValue(moment(event), { emitEvent: false });
    }

    // Force Angular to detect changes (if necessary, especially for complex cases)
    datepicker.close(); // Close the datepicker
    this.cdr.detectChanges();
  }
  // ---------------------------------------------------------------------------------//
  // LCTR Report Download
  downloadLctrReport() {
    this.isLoading = true;
    let fromDate = this.fromDate;
    let toDate = this.toDate;
    this.apiService
      .getLctrReloaded(fromDate, toDate)
      .subscribe(
        (data: any) => {
          this.isLoading = false
          console.log(data.type);  // Ensure it logs 'application/pdf'
          const filename = 'LCTR-Report.xml';
          saveAs(data, filename);
        },
        (error) => {
          this.isLoading = false
          console.error('Download failed:', error);
          alert('Failed to download LCTR Report');
        }
      );
  }

  getTotal(reportRows: any[], field: string): number {
    return reportRows.reduce((sum, row) => sum + (parseFloat(row[field]) || 0), 0);
  }

  validateAmount(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;

    // Allow only numbers (48-57 are ASCII codes for 0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onKeydownSearch(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.getAccountStatementReport()
    }
  }

  getAccountStatementReport() {
    this.showDate = true;
    let fromDate = this.dateForm.controls["fromDate"].value;
    let toDate = this.dateForm.controls["toDate"].value;
    let fromTime = this.dateForm.controls["fromTime"].value;
    let toTime = this.dateForm.controls["toTime"].value;
    let fromDateTime: any
    let toDateTime: any
    if (fromTime) {
      fromDateTime = `${fromDate} ${fromTime}`;
      toDateTime = `${toDate} 23:59:59`;
      console.log(toDateTime, 'from')
    }
    if (toTime) {
      fromDateTime = `${fromDate} 00:00:00`;
      toDateTime = `${toDate} ${toTime}`;
      console.log(fromDateTime, 'totime')
    }
    if (fromTime && toTime) {
      fromDateTime = `${fromDate} ${fromTime}`;
      toDateTime = `${toDate} ${toTime}`;
    }
    if (!fromTime && !toTime) {
      fromDateTime = `${fromDate} 00:00:00`;
      toDateTime = `${toDate} 23:59:59`;
    }
    // console.log(typeof(fromDateTime))
    // console.log(fromTime)
    this.isLoading = true;
    this.apiService
      .getReversalStatement(
        this.dateForm.controls["accNo"].value,
        fromDateTime,
        toDateTime
      ).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res?.responseCode == 200) {
            this.isLoading = false;
            console.log(res);
            this.accountStatementDetails = res?.data;
            this.agentSummaryReport = res?.data?.
              accStatementPojo
            if (res?.data?.accStatementPojo?.length > 0) {
              const list = res.data.accStatementPojo;
              const lastObj = list[list.length - 1]; // oldest transaction

              const runningBal = parseFloat(lastObj.runningBal) || 0;
              const debit = parseFloat(lastObj.debit) || 0;
              const credit = parseFloat(lastObj.credit) || 0;

              this.openingBalanceNew = runningBal - credit + debit;
            } else {
              this.openingBalanceNew = 0;
            }
            const firstObject = res?.data?.accStatementPojo?.[0];
            this.closingBalNew = firstObject?.runningBal;
            this.calculatePagination();
            this.totalCredit = this.accountStatementDetails?.accStatementPojo.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.credit || '0');
            }, 0);

            this.totalDebit = this.accountStatementDetails?.accStatementPojo.reduce((acc: number, item: any) => {
              return acc + parseFloat(item?.debit || '0');
            }, 0);
            this.totalCreditCount = this.accountStatementDetails?.accStatementPojo.reduce((acc: number, item: any) => {
              // Only count if debit is 0 and credit is non-zero
              return acc + (parseFloat(item?.debit) === 0 && parseFloat(item?.credit) !== 0 ? 1 : 0);
            }, 0);

            this.totalDebitCount = this.accountStatementDetails?.accStatementPojo.reduce((acc: number, item: any) => {
              // Only count if credit is 0 and debit is non-zero
              return acc + (parseFloat(item?.credit) === 0 && parseFloat(item?.debit) !== 0 ? 1 : 0);
            }, 0);
          } else {
            this.isLoading = false;
            alert(res?.error)
          }
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
  }

  getAccountStatementCurrentBalance() {
    this.currentDateTime = new Date();
    this.showDate = true;
    // this.isLoading = true;
    this.apiService
      .getCurrentBalance(
        this.dateForm.controls["accNo"].value
      ).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res?.responseCode == 200) {
            this.isLoading = false;
            this.currentBalance = res?.data;
            console.log(res);
          } else {
            this.isLoading = false;
            // alert(res?.error)
          }
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
  }

  applyDateFilter() {
    let toDateValue = this.dateForm.controls["toDate"].value;
    let toDate: any;
    if (toDateValue) {
      const date = new Date(toDateValue);
      date.setDate(date.getDate() + 1);

      toDate = date.toISOString().split('T')[0];
      console.log(toDate);
    }

    let dateData = {
      ToDate: `${toDate} 00:00:00`,
    };
    this.isLoading = true;
    this.apiService.transactionReport("FloatAccountReport", dateData).subscribe({
      next: (floatRes: any) => {
        if (floatRes) {
          this.isLoading = false;
          this.floatAccounts = floatRes; // ✅ separate array
          this.totalFloatCredit = this.floatAccounts.reduce((acc: number, item: any) => acc + Number(item?.total_credit || 0), 0);
          this.totalFloatDebit = this.floatAccounts.reduce((acc: number, item: any) => acc + Number(item?.total_debit || 0), 0);
          this.totalFloatBalance = Number(this.totalFloatCredit) - Number(this.totalFloatDebit);
        }
        this.isLoading = true;
        this.apiService.transactionReport("WalletBalanceReport", dateData).subscribe({
          next: (walletRes: any) => {
            if (walletRes) {
              this.isLoading = false;
              this.walletAccounts = walletRes; // ✅ separate array
              this.totalWalletCredit = this.walletAccounts.reduce((acc: number, item: any) => acc + Number(item?.total_credit || 0), 0);
              this.totalWalletDebit = this.walletAccounts.reduce((acc: number, item: any) => acc + Number(item?.total_debit || 0), 0);
              this.totalWalletBalance = Number(this.totalWalletCredit) - Number(this.totalWalletDebit);
              this.isLoading = false;
              this.netSettlementDifference = Math.abs(Number(this.totalFloatBalance)) - Math.abs(Number(this.totalWalletBalance));
            }
          },
          error: () => {
            this.isLoading = false;
            alert("Error fetching WalletBalanceReport");
          },
        });
      },
      error: () => {
        this.isLoading = false;
        alert("Error fetching FloatAccountReport");
      },
    });
  }

  csvData: any[] = [];
  excelData: any[] = [];

  readCsvFile(path: string) {

    console.log('Reading CSV from:', path);

    this.http.get(path, {
      responseType: 'text'
    }).subscribe({

      next: (csvText) => {

        console.log('Raw response:', csvText);

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,

          complete: (result) => {

            this.csvData = result.data;

            console.log(this.csvData, 'CSV Data');
          }
        });

      },

      error: (error) => {
        console.error('CSV reading error:', error);
      }
    });
  }


  readExcelFile(path: string) {

    this.http.get(path, {
      responseType: 'arraybuffer'
    }).subscribe({
      next: (data: ArrayBuffer) => {

        const workbook = XLSX.read(data, {
          type: 'array'
        });

        // Get first sheet
        const sheetName = workbook.SheetNames[0];

        // Get worksheet
        const worksheet = workbook.Sheets[sheetName];

        // Convert Excel sheet to JSON
        this.excelData = XLSX.utils.sheet_to_json(worksheet);

        console.log(this.excelData, 'Excel Data');
      },

      error: (error) => {
        console.error('Error reading Excel:', error);
      }
    });
  }
}
