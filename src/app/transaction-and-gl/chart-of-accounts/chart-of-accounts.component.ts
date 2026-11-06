import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { HeadAccountControllerService, LeafAccountControllerService, SubAccountControllerService } from '../openapi';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { GlService } from '../gl.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import autoTable from 'jspdf-autotable';
import { forkJoin } from 'rxjs';
import { of } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
// import jsPDF from "jspdf";
import * as XLSX from 'xlsx-js-style';
import saveAs from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-chart-of-accounts',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgClass, NgFor, MatIconModule, MatMenuModule],
  templateUrl: './chart-of-accounts.component.html',
  styleUrl: './chart-of-accounts.component.css'
})
export class ChartOfAccountsComponent {
  @ViewChild('transactionTable', { static: false }) transactionTable: ElementRef | any;
  ListForm: FormGroup = new FormGroup({});
  // filterType: FormControl = new FormControl('');
  category = new FormControl();
  searchCategoryText = new FormControl();
  allHead: any;
  allSubhead: any;
  allLeaf: any;
  categoryValue: any;
  showLiabilityTable: boolean = true;
  showExpenseTable: boolean = true;
  showIncomeTable: boolean = true;
  showAssetTable: boolean = true;
  showFilters: boolean = false;
  showExpenseHeader: boolean = false;
  showIncomeHeader: boolean = false;
  showAssetHeader: boolean = false;
  usertype = new FormControl('');

  privilege: any;
  allData: any[] = [];
  chartAccData: any[] = [];
  allAsset: any[] = [];
  allLiability: any[] = [];
  allExpense: any[] = [];
  allIncome: any[] = [];
  backOfficeUser: any;
  searchResult: any;
  searchForm: FormGroup = new FormGroup({});
  searchText = new FormControl();

  searchValue: any;
  filterValue: string = '';
  showTypeInput = false;
  showTypeDrop = false;
  showTypeAccNo = false;
  showTypeHeadAccNo = false;
  showTypeSubAccNo = false;
  accNo: any;
  accNoValue: any;
  headAccNoValue: any;
  headAccNo: any;
  SubAccNoValue: any;
  subAccNo: any;
  result: any[] = [];
  accNoResult: any;
  HeadAccNoResult: any;
  subAccNoResult: any;
  isLoading = false;
  accNoResultLength: any;

  accNamePage: number = 0
  accNoPage: number = 0
  headAccNoPage: number = 0
  subAccNoPage: number = 0
  liabilityPage: number = 0
  expensePage: number = 0
  incomePage: number = 0
  assetPage: number = 0

  searchResultLength: any;
  searchaccNameLength: any;
  HeadAccNoResultLength: any;
  subAccNoResultLength: any;
  searchLiabilityLength: any;
  searchExpenseLength: any;
  searchIncomeLength: any;
  searchAssetLength: any;
  AssetTotalPage: any;
  liabilityTotalPage: any;
  expenseTotalPage: any;
  incomeTotalPage: any;
  accNameTotalPage: any;
  subAccNoTotalpages: any;
  HeadAccNoTotalPages: any;
  showCategoryText: boolean = false
  searchCategoryValue: any;
  searchCategoryResult: any;
  CategoryTextTotalPage: any;
  searchCategoryTextLength: any;
  CategoryTextPage: number = 0;
  showMainFilter: boolean = false;
  page: number = 0;
  accDataResult: any;
  showModal: boolean = false;
  detailResult: any;
  transResult: any;
  showTransResult: boolean = false;
  walletNo: any;
  headDataDef: any;
  AccNoTarget: any;
  // showLeafTable: boolean = false;
  showTable = false;
  // pageSize: number = 10;
  fromDate: string = '';
  toDate: string = '';
  filteredTransResult: any[] = [];
  accNoToAPI: any;
  dateFilterResult: any;
  allTransResult: any;
  headAccNoTarget: any;
  subAccNoTarget: any;
  selectedId: any;
  LeafData: any;
  allLeafData: any[] = [];

  constructor(private headAccountService: HeadAccountControllerService,
    private LeafAccountService: LeafAccountControllerService,
    private SubAccountService: SubAccountControllerService,
    private router: Router, private cdr: ChangeDetectorRef,
    private glService: GlService,
    private fb: FormBuilder) { }
  ngOnInit() {
    this.chartAccData = [];
    this.loadAllData();
    //this.allKyc
    this.ListForm = this.fb.group({
      filterType: [''], // Ensure it's defined
    });
    // this.getAllHeadAccDefData();
    this.backOfficeUser = sessionStorage.getItem('loginUserName')
    this.loadPrivileges();
  }
  loadAllData() {
    this.showTable = true;
    this.chartAccData = []; // Clear previous data before starting

    this.glService.getAllChartAccountsAsset(this.categoryValue, 0).pipe(
      tap((data: any) => {
        this.allAsset = data?.data;
        if (Array.isArray(data?.data)) {
          this.chartAccData = [...this.chartAccData, ...data.data];
        }
      }),
      concatMap(() => this.glService.getAllChartAccountsLiability(this.categoryValue, 0)),
      tap((data: any) => {
        this.allLiability = data?.data;
        if (Array.isArray(data?.data)) {
          this.chartAccData = [...this.chartAccData, ...data.data];
        }
      }),
      concatMap(() => this.glService.getAllChartAccountsIncome(this.categoryValue, 0)),
      tap((data: any) => {
        this.allIncome = data?.data;
        if (Array.isArray(data?.data)) {
          this.chartAccData = [...this.chartAccData, ...data.data];
        }
      }),
      concatMap(() => this.glService.getAllChartAccountsExpense(this.categoryValue, 0)),
      tap((data: any) => {
        this.allExpense = data?.data;
        if (Array.isArray(data?.data)) {
          this.chartAccData = [...this.chartAccData, ...data.data];
        }
        // Final assignment to the table
        this.allData = [...this.chartAccData];
      })
    ).subscribe();
  }
  // loadAllData() {
  //   this.showTable = true;
  //   this.glService.getAllChartAccountsAsset(this.categoryValue, 0).subscribe((data: any) => {
  //     this.allAsset = data?.data;
  //     if (Array.isArray(data?.data)) {
  //       this.chartAccData = [...this.chartAccData, ...data?.data];
  //       this.allData = [...this.chartAccData];
  //     }
  //   });
  //   this.glService.getAllChartAccountsLiability(this.categoryValue, 0).subscribe((data: any) => {
  //     this.allLiability = data?.data;
  //     if (Array.isArray(data?.data)) {
  //       this.chartAccData = [...this.chartAccData, ...data?.data];
  //       this.allData = [...this.chartAccData]; // Assign data to the table
  //     }
  //   });
  //   this.glService.getAllChartAccountsIncome(this.categoryValue, 0).subscribe((data: any) => {
  //     this.allIncome = data?.data;
  //     if (Array.isArray(data?.data)) {
  //       this.chartAccData = [...this.chartAccData, ...data?.data];
  //       this.allData = [...this.chartAccData];
  //     }
  //   });
  //   this.glService.getAllChartAccountsExpense(this.categoryValue, 0).subscribe((data: any) => {
  //     this.allExpense = data?.data;
  //     if (Array.isArray(data?.data)) {
  //       this.chartAccData = [...this.chartAccData, ...data?.data];
  //       this.allData = [...this.chartAccData];
  //     }
  //   });
  // }
  loadPrivileges(): void {
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      const userPrivileges = JSON.parse(privilegesData);
      const userPrevilages1 = userPrivileges[0];
      for (const item of userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName === 'Transaction and GL') {
          if (item.subComponent?.subComponentName === 'Chart of Accounts') {
            this.privilege = item;
          }
        }
      }
    }
  }
  nextPage(type: string) {
    if (type === 'headAccNo') {
      this.headAccNoPage++;
      this.onchangeHeadAccNo();
    } else if (type === 'subAccNo') {
      this.subAccNoPage++;
      this.onchangeSubAccNo();
    }
    else if (type === 'accName') {
      this.accNamePage++;
      this.onSearchAccName();
      console.log("accNamePage", this.accNamePage)
    }
  }
  prevPage(type: string) {
    if (type === 'headAccNo' && this.headAccNoPage > 0) {
      this.headAccNoPage--;
      this.onchangeHeadAccNo();
    } else if (type === 'subAccNo' && this.subAccNoPage > 0) {
      this.subAccNoPage--;
      this.onchangeSubAccNo();
    }
    else if (type === 'accName' && this.accNamePage > 0) {
      this.accNamePage--;
      this.onSearchAccName();
    }
  }
  getAllHeadAccDefData() {
    this.glService.getAllHeadAccDefData().subscribe((data: any) => {
      this.headDataDef = data?.data
    })
  }
  // onHeadAccChange(event: any) {
  //   this.selectedId = event.target.value;
  //   this.showTable = true
  //   this.showLeafTable = false
  //   for (let item of this.headDataDef) {
  //     if (this.selectedId == item?.id) {
  //       this.headAccNoTarget = item?.accountNo
  //       console.log("headAccNoTarget 1", this.headAccNoTarget)
  //     }
  //   }
  //   console.log("headAccNoTarget 2", this.headAccNoTarget)
  //   if (this.selectedId) {
  //     this.showFilters = true;
  //   } else {
  //     this.showFilters = false;
  //   }
  //   console.log("selectedId user", this.selectedId)
  //   this.glService.filterByHeadAcc(this.selectedId).subscribe((data: any) => {
  //     this.accDataResult = data
  //     this.allData = [...this.accDataResult];
  //   })
  // }
  onClickGetLeafData(item: any) {
    this.AccNoTarget = item?.accountNo
    this.subAccNoTarget = item?.subAccountNo
    // console.log("subAccNoTarget 1", this.subAccNoTarget)
    console.log("AccNoTarget 1", this.AccNoTarget)
    this.glService.getLeafData(this.AccNoTarget, this.page).subscribe((data: any) => {
      this.showTable = false
      // this.showLeafTable = true
      this.LeafData = data?.data?.content
      this.allLeafData = [...this.LeafData];
    })
  }
  onClickViewDetails(item: any) {
    this.showModal = true;
    this.walletNo = item?.walletNo
    this.accNoToAPI = item?.accountNo
    console.log("item?.accountNo", item?.accountNo)
    console.log("item?.walletNo", item?.walletNo)
    this.glService.getDetails(item?.accountNo).subscribe((data: any) => {
      this.detailResult = data?.data
    })
  }
  viewTransactionHistory() {
    this.showTransResult = !this.showTransResult;
    this.glService.getTransactionHistory(this.accNoToAPI).subscribe((data: any) => {
      this.transResult = data?.data
      this.allTransResult = this.transResult
    })
  }
  //filter trans table
  filterTransactions() {
    const from = this.fromDate + " 00:00:00";
    const to = this.toDate + " 23:59:59";
    // this.startDate = this.fromDate + " 00:00:00";
    // this.endDate = this.toDate + " 23:59:59";
    this.glService.filterByDateTransData(this.accNoToAPI, from, to).subscribe((data: any) => {
      this.dateFilterResult = data?.data
      this.allTransResult = this.dateFilterResult
    })
  }
  closeModal() {
    this.showModal = false;
  }
  onChangeCategory($event?: any) {
    // this.showLeafTable = false
    this.showMainFilter = true
    this.isLoading = true;
    // this.categoryValue = $event.target.value
    this.categoryValue = $event ? $event.target.value : this.categoryValue;
    console.log("AccNoTarget 2", this.AccNoTarget)
    if (this.categoryValue == 'LIABILITY') {
      this.glService.getAllChartAccountsLiability(this.categoryValue, this.liabilityPage).subscribe((data: any) => {
        this.showTable = true
        // this.showLeafTable = false
        this.isLoading = false;
        this.allLiability = data?.data
        this.allData = data?.data
        this.searchLiabilityLength = data?.data?.totalElements
        this.liabilityTotalPage = data?.data?.totalPages
        console.log(" this.liabilityTotalPage ", this.liabilityTotalPage)
        console.log(" this.liabilityPage ", this.liabilityPage)
      })
    }
    else if (this.categoryValue == 'EXPENSE') {
      this.glService.getAllChartAccountsExpense(this.categoryValue, this.expensePage).subscribe((data: any) => {
        this.showTable = true
        // this.showLeafTable = false
        this.isLoading = false;
        this.allExpense = data?.data
        this.allData = data?.data
        this.searchExpenseLength = data?.data?.totalElements
        this.expenseTotalPage = data?.data?.totalPages
        console.log(" this.searchExpenseLength ", this.searchExpenseLength)
      })
    }
    else if (this.categoryValue == 'INCOME') {
      this.glService.getAllChartAccountsIncome(this.categoryValue, this.incomePage).subscribe((data: any) => {
        this.showTable = true
        // this.showLeafTable = false
        this.isLoading = false;
        this.allIncome = data?.data
        this.allData = data?.data
        this.searchIncomeLength = data?.data?.totalElements
        this.incomeTotalPage = data?.data?.totalPages
        console.log(" this.searchIncomeLength ", this.searchIncomeLength)
      })
    }
    else if (this.categoryValue == 'ASSET') {
      this.glService.getAllChartAccountsAsset(this.categoryValue, this.assetPage).subscribe((data: any) => {
        this.showTable = true
        // this.showLeafTable = false
        this.isLoading = false;
        this.allAsset = data?.data
        this.allData = data?.data
        // this.searchResultLength = this.allAsset.length
        this.searchAssetLength = data?.data?.totalElements
        this.AssetTotalPage = data?.data?.totalPages
        console.log(" this.searchAssetLength ", this.searchAssetLength)
      })
    }
  }
  onChangeFilterType($event: any) {
    this.filterValue = $event.target.value;
    this.showTypeInput = this.filterValue === 'ACC_NAME';
    this.showTypeAccNo = this.filterValue === 'ACC_NO';
    this.showTypeHeadAccNo = this.filterValue === 'HEAD_ACC_NO';
    this.showTypeSubAccNo = this.filterValue === 'SUB_HEAD_ACC_NO';

    if (this.showTypeAccNo) this.getAllAccNo();
    if (this.showTypeHeadAccNo) this.getAllHeadAccNo();
    if (this.showTypeSubAccNo) this.getAllSubAccNo();
  }
  onSearchAccName() {
    this.isLoading = true;
    this.showTable = true
    // this.showLeafTable = false
    this.searchValue = this.searchText.value;
    console.log("searchText", this.searchValue);
    if (!this.searchValue) {
      this.allData = [...this.chartAccData];
      return;
    }
    console.log("categoryValue accname", this.categoryValue)
    console.log("this.accNamePage", this.accNamePage)
    this.glService.searchByNameCoa(this.searchValue, this.categoryValue, this.accNamePage).subscribe((data: any) => {
      this.isLoading = false;
      this.searchResult = data?.data;
      this.allData = this.searchResult;
      if (Array.isArray(this.searchResult)) {
        console.log("Number of expenses:", this.searchResult.length);
        this.searchaccNameLength = data?.data?.totalElements
        this.accNameTotalPage = data?.data?.totalPages
      }
    });
  }
  onSearchCategoryText() {
    this.showTable = true
    // this.showLeafTable = false
    this.isLoading = true;
    this.searchCategoryValue = this.searchCategoryText.value;
    console.log("searchCategoryValue", this.searchCategoryValue);
    if (!this.searchCategoryValue) {
      this.allData = [...this.chartAccData];
      return;
    }
    this.glService.searchByCategoryText(this.searchCategoryValue, this.CategoryTextPage).subscribe((data: any) => {
      this.isLoading = false;
      this.searchCategoryResult = data?.data;
      this.allData = this.searchCategoryResult;
      if (Array.isArray(this.searchCategoryResult)) {
        console.log("Number of expenses:", this.searchCategoryResult.length);
        this.searchCategoryTextLength = data?.data?.totalElements
        this.CategoryTextTotalPage = data?.data?.totalPages
      }
    });
  }
  getAllAccNo() {
    this.isLoading = true;
    this.glService.getAllAccNo(this.categoryValue).subscribe((data: any) => {
      this.isLoading = false;
      this.accNo = data?.data
    })
  }
  onchangeAccNo($event?: any) {
    this.showTable = true
    // this.showLeafTable = false
    this.isLoading = true;
    // this.accNoValue = $event.target.value;
    this.accNoValue = $event ? $event.target.value : this.accNoValue;
    // this.accNoValue = $event ? $event.target.value : this.accNoValue; 
    console.log("categoryValue acc no", this.categoryValue)
    this.glService.searchByAccNo(this.accNoValue, this.categoryValue, this.accNoPage).subscribe((data: any) => {
      this.isLoading = false;
      this.accNoResult = data?.data
      // this.accNoResultLength = this.accNoResult.length
      if (Array.isArray(this.accNoResult)) {
        this.allData = this.accNoResult;  // ✅ Assign if it's already an array
        console.log("this.accNoResult", this.allData)
      } else if (this.accNoResult) {
        this.allData = [this.accNoResult]; // ✅ Convert object to an array
        console.log("this.accNoResult", this.allData)
      } else {
        this.allData = [];  // ✅ Default to an empty array if null/undefined
      }

      this.cdr.detectChanges();
    })
  }
  getAllHeadAccNo() {
    this.isLoading = true;
    this.glService.getAllHeadAccNo(this.categoryValue).subscribe((data: any) => {
      this.isLoading = false;
      this.headAccNo = data?.data
    })
  }
  onchangeHeadAccNo($event?: any) {
    this.showTable = true
    // this.showLeafTable = false
    this.isLoading = true;
    // this.headAccNoValue = $event.target.value;
    this.headAccNoValue = $event ? $event.target.value : this.headAccNoValue;
    console.log("this.categoryValue head", this.categoryValue)
    console.log("this.headAccNoValue", this.headAccNoValue)
    this.glService.searchByHeadAccNo(this.headAccNoValue, this.categoryValue, this.headAccNoPage).subscribe((data: any) => {
      this.isLoading = false;
      this.HeadAccNoResult = data?.data
      this.HeadAccNoResultLength = data?.data?.totalElements
      this.HeadAccNoTotalPages = data?.data?.totalPages
      if (Array.isArray(this.HeadAccNoResult)) {
        this.allData = this.HeadAccNoResult;
      } else if (this.HeadAccNoResult) {
        this.allData = [this.HeadAccNoResult];
        console.log("this.HeadAccNoResult", this.allData)
      } else {
        this.allData = [];
      }
      this.cdr.detectChanges();
    })
  }
  getAllSubAccNo() {
    this.isLoading = true;
    this.glService.getAllSubAccNo(this.categoryValue).subscribe((data: any) => {
      this.isLoading = false;
      this.subAccNo = data?.data
    })
  }
  onchangeSubAccNo($event?: any) {
    this.showTable = true
    // this.showLeafTable = false
    this.isLoading = true;
    // this.SubAccNoValue = $event.target.value;
    this.SubAccNoValue = $event ? $event.target.value : this.SubAccNoValue;
    console.log("this.categoryValue sub", this.categoryValue)
    this.glService.searchBySubAccNo(this.SubAccNoValue, this.categoryValue, this.subAccNoPage).subscribe((data: any) => {
      this.isLoading = false;
      this.subAccNoResult = data?.data?.content
      if (Array.isArray(this.subAccNoResult)) {
        this.allData = this.subAccNoResult;
        this.subAccNoResultLength = data?.data?.totalElements
        this.subAccNoTotalpages = data?.data?.totalPages
        console.log("this.subAccNoResult", this.allData)
      } else if (this.subAccNoResult) {
        this.allData = [this.subAccNoResult];
        console.log("this.subAccNoResult", this.allData)
      } else {
        this.allData = [];
      }
    })
  }
  // old
  // makePdf() {
  //   if (this.categoryValue == undefined) {
  //     this.categoryValue = 'ALL'
  //   } else {
  //     this.categoryValue
  //   }
  //   const doc = new jsPDF("p", "pt", "a4");

  //   // Function to add the header content
  //   const addHeader = (data: any) => {
  //     doc.addImage('../../../assets/images/logo.png', 'PNG', 40, 20, 50, 25);
  //     doc.setFontSize(8);
  //     doc.setTextColor(40);
  //     doc.text('Afghan Besim Mobile Money Company,', 40, 60);
  //     doc.text('Darulaman Road, Hajari Najari,', 40, 72);
  //     doc.text('KABUL, AFGHANISTAN', 40, 84);

  //     doc.setFontSize(10);
  //     doc.setTextColor('#f47a20');
  //     doc.text('Chart Of Accounts Statement', 380, 30);

  //     const startX = 380;
  //     const startY = 10;
  //     const lineSpacing = 12;

  //     doc.setFontSize(8);
  //     doc.setTextColor(40);
  //     const backOfficeUser = this.backOfficeUser;
  //     doc.text(`Account Type: ${this.categoryValue}`, startX, startY + 3 * lineSpacing);
  //     doc.text(`Back Office User: ${backOfficeUser}`, startX, startY + 4 * lineSpacing);
  //   };

  //   // Call the header for the first page explicitly
  //   addHeader(null);

  //   // Define table columns and data
  //   const columns = [
  //     { header: 'Account Number', dataKey: 'accountNo' },
  //     { header: 'Account Description', dataKey: 'accountDescription' },
  //     { header: 'HeadAccountNo', dataKey: 'headAccountNo' },
  //     { header: 'SubAccountNo', dataKey: 'subAccountNo' },
  //   ];

  //   const data = this.allData

  //   // Generate the table with autoTable
  //   autoTable(doc, {
  //     columns: columns,
  //     body: data,
  //     startY: 100, // Adjust this to start the table below the header
  //     didDrawPage: (data: any) => {
  //       // Call addHeader for each new page
  //       addHeader(data);
  //     },
  //     headStyles: {
  //       fillColor: [244, 122, 32],
  //       textColor: 255,
  //       fontSize: 8,
  //     },
  //     bodyStyles: {
  //       fontSize: 6,
  //     },
  //     margin: { top: 100 }, // Ensure the table doesn't overlap with the header
  //   });
  //   // Save the PDF
  //   doc.save('chart-of-account-statement.pdf');
  // }
  //new
  makePdf() {
    // Detect which table is visible
    const visibleTable = document.querySelector('.table-container:not([hidden])') as HTMLElement;

    if (!visibleTable) {
      console.error('Visible table not found');
      return;
    }

    // Hide all "Actions" columns temporarily
    const actionsColumns = visibleTable.querySelectorAll('th:nth-last-child(1), td:nth-last-child(1)');
    actionsColumns.forEach(el => (el as HTMLElement).style.display = 'none');

    html2canvas(visibleTable, {
      scale: 2,
      useCORS: true,
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.setFontSize(10);
      pdf.text('Chart of Accounts Statement', 40, 30);
      pdf.addImage(imgData, 'PNG', 20, 50, pdfWidth - 40, pdfHeight);
      pdf.save('account-table.pdf');
    }).finally(() => {
      // Re-show the hidden "Actions" column
      actionsColumns.forEach(el => (el as HTMLElement).style.display = '');
    });
  }
  exportToExcel() {
    if (this.categoryValue == undefined) {
      this.categoryValue = 'ALL'
    } else {
      this.categoryValue
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
      [createStyledCell('Chart Of Accounts Statement', { font: { bold: true }, fill: { fgColor: { rgb: 'BDD7EE' } } })],
      [`Account Type: ${this.categoryValue}`],
      [`BackOffice User: ${this.backOfficeUser}`],
      []
    ];

    // Define table headers with color styling
    const tableHeaders = [
      [
        createStyledCell('Account Number', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        createStyledCell('Account Description', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        createStyledCell('HeadAccountNo', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
        createStyledCell('SubAccountNo', { font: { bold: true }, fill: { fgColor: { rgb: 'A9D08E' } } }),
      ]
    ];

    // Convert transactions to a basic format (without specific styling)
    const transactionRows = this.allData.map((tx: any) => [
      tx.accountNo,
      tx.accountDescription,
      tx.headAccountNo,
      tx.subAccountNo,
    ]);

    // Define summary rows with color styling

    // Combine all rows
    const worksheetData = [
      ...headerRows,
      ...tableHeaders,
      ...(transactionRows || []),
    ];

    // Create worksheet and workbook
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
    worksheet['!cols'] = [
      { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
      { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
    ];

    const workbook: XLSX.WorkBook = { Sheets: { 'Statement': worksheet }, SheetNames: ['Statement'] };

    // Write the workbook and trigger download
    XLSX.writeFile(workbook, `chart-of-account-statement.xlsx`);

  }
  exportToCSV() {
    if (this.categoryValue == undefined) {
      this.categoryValue = 'ALL'
    } else {
      this.categoryValue
    }
    // Define header rows for the CSV file
    const headerRows = [
      ['Afghan Besim Mobile Money Company,'],
      ['Darulaman Road, Hajiari Najari,'],
      ['KABUL, AFGHANISTAN'],
      [],
      ['Chart Of Account Statement'],
      [`Account Type: ${this.categoryValue}`],
      [`BackOffice User: ${this.backOfficeUser}`],
      []
    ];

    // Define column headers for the transaction table
    const tableHeaders = [['Account Number', 'Account Description', 'HeadAccountNo', 'SubAccountNo',]];

    // Convert transactions to an array format
    const transactionRows = this.allData.map((tx: { accountNo: any; accountDescription: any; headAccountNo: any; subAccountNo: any; }) => [
      tx.accountNo,
      tx.accountDescription,
      tx.headAccountNo,
      tx.subAccountNo,
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
    saveAs(csvBlob, `chart-of-account-statement.csv`);
  }

  makePdfTrans() {
    const doc = new jsPDF('l', 'pt', 'a4');

    autoTable(doc, {
      html: this.transactionTable.nativeElement,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [0, 102, 204],
      }
    });

    doc.save('Transaction_Table.pdf');
  }
  exportToExcelTrans(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.allTransResult);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, 'Transaction_Table.xlsx');
  }
  exportToCSVTrans(): void {
    const replacer = (key: any, value: any) => value === null ? '' : value;
    const headers = ['creditAmount', 'debitAmount', 'date', 'payMethod', 'serviceName', 'transNo'];
    const csv = [
      headers.join(','), // header row
      ...this.allTransResult.map((row: any) => headers.map(field => JSON.stringify(row[field], replacer)).join(','))
    ].join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'Transaction_Table.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}



