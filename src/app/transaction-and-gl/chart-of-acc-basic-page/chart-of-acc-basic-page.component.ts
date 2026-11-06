import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { GlService } from '../gl.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
@Component({
  selector: 'app-chart-of-acc-basic-page',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule, ReactiveFormsModule, CommonModule, MatIcon,
    MatIconModule, MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './chart-of-acc-basic-page.component.html',
  styleUrl: './chart-of-acc-basic-page.component.css'
})
export class ChartOfAccBasicPageComponent {
  @ViewChild('transactionTable', { static: false }) transactionTable: ElementRef | any;
  coaForm!: FormGroup;
  showMenu: boolean = false;
  agentUsers: any
  userPrivileges: any;
  privilege: any;
  userPrevilages1: any;
  result: any;
  finalResult: any[] = [];
  currentPage: any = 0;
  totalElements: any;
  pageSize: any;
  totalPage: any;
  allowedHeadAccounts = ["200000000000"];
  allowedSubAccounts = [
    "200000001000",
    "200000006000",
    "200000007000",
    "200000002000",
    "200110031000",
    "200000000000"
  ];
  expandedIndex: number | null = null;
  selectedDetails: any[] = [];
  accTypeValue: any;
  filterArray: any[] = [];
  allResults: any[] = [];
  filterValue: any;
  showTypeAccNo: boolean = false;
  showTypeHeadAccNo: boolean = false;
  showTypeSubAccNo: boolean = false;
  showAccName: boolean = false;
  subAccNo: any;
  headAccNo: any;
  accNo: any;
  searchValue: any;
  searchResult: any;
  coaform: FormGroup = new FormGroup({})
  coaform2: FormGroup = new FormGroup({})
  searchText = new FormControl();
  searchTextSub = new FormControl();
  page: any;
  pagecoa!: number;
  accTypeValueSub: any;
  filterValueSub: any;
  showTypeAccNoSub: boolean = false;
  showTypeHeadAccNoSub: boolean = false;
  showTypeSubAccNoSub: boolean = false;
  showAccNameSub: boolean = false;
  searchValueSub: any;
  showTransResult: boolean = false;
  transResult: any;
  allTransResult: any;
  showModal: boolean = false;
  walletNo: any;
  accNoToAPI: any;
  detailResult: any;
  fromDate: string = '';
  toDate: string = '';
  filteredTransResult: any[] = [];
  dateFilterResult: any;
  size!: number;
  subAccountNoOfmainTable: any;
  currentPageSub: any = 0;
  totalElementSub: any;
  pageSizeSub: any;
  totalPageSub: any;
  currentMode: 'ALL' | 'ACC_TYPE' | 'ACC_NO' | 'HEAD_ACC_NO' | 'SUB_ACC_NO' = 'ALL';
  currentFilterValue: any = null;
  isFilterActive = false;
  isSubFilterActive: boolean = false;
  constructor(private router: Router, private cdr: ChangeDetectorRef,
    private glService: GlService,
    private fb: FormBuilder) {
    this.coaForm = this.fb.group({
      selectedDate: ['']
    });
  }
  ngOnInit() {
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "Transaction and GL") {
          if (item.subComponent?.subComponentName == "Chart of Accounts")
            this.privilege = item;
        }
      }
    }
    this.loadAllDataInOrder();
  }
  sortFinalResult(data: any[]): any[] {
    if (!data?.length) return [];

    const order: Record<string, number> = {
      ASSET: 1,
      LIABILITY: 2,
      INCOME: 3,
      EXPENSE: 4
    };

    return data.sort((a: any, b: any) => {
      const orderA = order[a.type] ?? 99;
      const orderB = order[b.type] ?? 99;

      if (orderA !== orderB) return orderA - orderB;

      const accA = a.accountNo || a.headAccountNo || '';
      const accB = b.accountNo || b.headAccountNo || '';

      return accA.localeCompare(accB, undefined, { numeric: true });
    });
  }
  callDate() {

  }
  loadAllDataInOrder() {
    this.finalResult = [];
    this.glService.getAllChartOfAccBasic(this.currentPage).subscribe((data1: any) => {
      let data = data1?.data || [];
      this.totalElements = data1?.totalElements;
      this.pageSize = data1?.pageSize;
      this.totalPage = Math.ceil(this.totalElements / this.pageSize);

      if (this.currentPage > 0 && this.finalResult.length) {
        data = [...this.finalResult, ...data];
      }
      const order: Record<string, number> = {
        ASSET: 1,
        LIABILITY: 2,
        INCOME: 3,
        EXPENSE: 4
      };
      // ✅ Sort only by type, remove ascending accountNo sorting
      data.sort((a: any, b: any) => {
        const orderA = order[a.type] ?? 99;
        const orderB = order[b.type] ?? 99;
        return orderA - orderB;
      });
      this.finalResult = data;
    });
  }
  onClickNext() {
    if (this.isFilterActive) {
      return; // pagination disabled during filters
    }
    this.currentPage = this.currentPage + 1
    this.glService.getAllChartOfAccBasic(this.currentPage).subscribe((data1: any) => {
      this.finalResult = data1?.data || [];
      // this.finalResult = this.sortFinalResult(data1?.data || []);
    })
  }
  onClickPrev() {
    if (this.isFilterActive) {
      return; // pagination disabled during filters
    }
    this.currentPage = this.currentPage - 1
    this.glService.getAllChartOfAccBasic(this.currentPage).subscribe((data1: any) => {
      // this.finalResult = this.sortFinalResult(data1?.data || []);
      this.finalResult = data1?.data || [];
    })
  }
  onChangeFilterType($event: any) {
    if (!this.accTypeValue) {
      this.loadAllDataInOrder();
    }
    this.filterValue = $event.target.value;
    this.showTypeAccNo = this.filterValue === 'ACC_NO';
    this.showTypeHeadAccNo = this.filterValue === 'HEAD_ACC_NO';
    this.showTypeSubAccNo = this.filterValue === 'SUB_HEAD_ACC_NO';
    this.showAccName = this.filterValue === 'ACC_NAME';
    if (this.showTypeAccNo) this.getAllAccNo();
    if (this.showTypeHeadAccNo) this.getAllHeadAccNo();
    if (this.showTypeSubAccNo) this.getAllSubAccNo();
  }
  // onChangeFilterTypeSub($event: any) {
  //   this.filterValueSub = $event.target.value;
  //   this.showTypeAccNoSub = this.filterValueSub === 'ACC_NO';
  //   this.showAccNameSub = this.filterValueSub === 'ACC_NAME';
  //   if (this.showTypeAccNoSub) this.getAllAccNo();
  // }
  onChangeFilterTypeSub($event: any) {
    // this.isSubFilterActive = true;
    this.filterValueSub = $event.target.value;
    this.showTypeAccNoSub = this.filterValueSub === 'ACC_NO';
    this.showAccNameSub = this.filterValueSub === 'ACC_NAME';

    if (this.showTypeAccNoSub) this.getAllAccNo();

    // ✅ Always call API when dropdown value changes
    this.glService.coaSingleData(this.selectedDetails?.[0]?.subAccountNo, this.pagecoa = 0).subscribe({
      next: (data1: any) => {
        this.selectedDetails = data1?.data || [];
        console.log('API called because dropdown changed:', this.filterValueSub);
      },
      error: (err) => {
        console.error('API error:', err);
        this.selectedDetails = [];
      }
    });
  }

  onChangeAccType($event: any) {
    this.isFilterActive = true;
    this.currentMode = 'ACC_TYPE';
    this.accTypeValue = $event.target.value;
    this.glService.CoaBasicFilterByAccType(this.accTypeValue).subscribe((data: any) => {
      // this.finalResult = this.sortFinalResult(data?.data)
      this.finalResult = data?.data
    })
  }
  // onChangeAccTypeSub($event: any) {
  //   this.accTypeValueSub = $event.target.value;
  //   this.glService.CoaBasicFilterByAccTypeSub(this.accTypeValueSub).subscribe((data: any) => {
  //     this.selectedDetails = data?.data
  //   })
  // }
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
  //old
  // async loadAllPagesForDownload(): Promise<any[]> {
  //   return new Promise((resolve) => {
  //     let allData: any[] = [];
  //     let page = 0;
  //     const fetchPage = () => {
  //       this.glService.getAllChartOfAccBasic(page).subscribe((res: any) => {
  //         const data = res?.data || [];
  //         const pageSize = res?.pageSize;
  //         const totalElements = res?.totalElements;
  //         allData = [...allData, ...data];
  //         const totalPages = Math.ceil(totalElements / pageSize);
  //         if (page + 1 < totalPages) {
  //           page++;
  //           fetchPage();
  //         } else {
  //           resolve(allData);
  //         }
  //       });
  //     };
  //     fetchPage();
  //   });
  // }
  makePdf() {
    const table: any = document.querySelector('#tableContainer table');
    if (!table) {
      alert('No table found!');
      return;
    }

    const doc = new jsPDF('l', 'mm', 'a4');
    doc.text('Account Summary', 14, 10);

    // Convert table to PDF
    autoTable(doc, {
      html: table,
      startY: 20,
      headStyles: { fillColor: [10, 54, 90] },
      theme: 'grid',
      styles: { fontSize: 8 },
    });

    doc.save('Account_Summary.pdf');
  }
  exportToExcel() {
    const table: any = document.querySelector('#tableContainer table');
    if (!table) {
      alert('No table found!');
      return;
    }

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Accounts');

    XLSX.writeFile(wb, 'Account_Summary.xlsx');
  }
  viewTransactionHistory() {
    this.showTransResult = !this.showTransResult;
    this.glService.getTransactionHistory(this.accNoToAPI).subscribe((data: any) => {
      this.transResult = data?.data
      this.allTransResult = this.transResult
    })
  }
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
  getAllAccNo() {
    const hasSelectedDetails = Array.isArray(this.selectedDetails) && this.selectedDetails.length > 0;
    if (this.accTypeValue && !hasSelectedDetails) {
      this.glService.getAllAccNo(this.accTypeValue).subscribe((data: any) => {
        this.accNo = data;
      });
    }
    else if (!this.accTypeValue && !hasSelectedDetails) {
      this.glService.getAllAccNoWithoutType().subscribe((data: any) => {
        this.accNo = data;
      });
    }
    else if (hasSelectedDetails) {
      this.glService.getAllAccNoCoaSubTable(this.subAccountNoOfmainTable).subscribe((data: any) => {
        this.accNo = data;
      });
    }
    // else if (!this.accTypeValueSub && hasSelectedDetails) {
    //   this.glService.getAllAccNoWithoutTypeCoaSubTable().subscribe((data: any) => {
    //     this.accNo = data;
    //   });
    // }
  }
  getAllHeadAccNo() {
    if (this.accTypeValue) {
      // Case 1: accTypeValue is present
      this.glService.getAllHeadAccNo(this.accTypeValue).subscribe((data: any) => {
        this.headAccNo = data?.data;
      });
    }
    else if (this.accTypeValueSub) {
      // Case 2: accTypeValueSub is present
      this.glService.getAllHeadAccNo(this.accTypeValueSub).subscribe((data: any) => {
        this.headAccNo = data?.data;
      });
    }
    else {
      // Case 3: both are empty or undefined
      this.glService.getAllHeadAccNoWithoutType().subscribe((data: any) => {
        this.headAccNo = data?.data;
      });
    }
  }
  getAllSubAccNo() {
    if (this.accTypeValue) {
      this.glService.getAllSubAccNo(this.accTypeValue).subscribe((data: any) => {
        this.subAccNo = data?.data;
      });
    }
    else if (this.accTypeValueSub) {
      this.glService.getAllSubAccNo(this.accTypeValueSub).subscribe((data: any) => {
        this.subAccNo = data?.data;
      });
    }
    else {
      this.glService.getAllSubAccNoWithoutType().subscribe((data: any) => {
        this.subAccNo = data?.data;
      });
    }
  }
  onchangeAccNo($event: any) {
    this.isFilterActive = true;
    this.glService.CoaBasicFilterByAccNo($event.target.value).subscribe((data: any) => {
      // this.finalResult = this.sortFinalResult(data?.data)
      this.finalResult = data?.data
    })
  }
  onchangeAccNoSub(subAccountNo: any, $event: any) {
    this.isSubFilterActive = true;
    this.glService.CoaBasicFilterByAccNoSub(subAccountNo, $event.target.value,).subscribe((data: any) => {
      this.selectedDetails = data?.data
    })
  }
  onchangeHeadAccNo($event: any) {
    this.isFilterActive = true;
    this.glService.CoaBasicFilterByHeadAccNo($event.target.value).subscribe((data: any) => {
      // this.finalResult = this.sortFinalResult(data?.data)
      this.finalResult = data?.data
    })
  }
  //   clearDropdowns() {
  //   this.searchTextSub.setValue('');
  //   this.coaform2.get('filterType')?.setValue('');
  // }
  
  // onchangeHeadAccNoSub($event: any, subAccountNo: any) {
  //   this.glService.CoaBasicFilterByHeadAccNoSub($event.target.value).subscribe((data: any) => {
  //     this.selectedDetails = data?.data
  //   })
  // }
  onchangeSubAccNo($event: any) {
    this.isFilterActive = true;
    this.glService.CoaBasicFilterBySubAccNo($event.target.value).subscribe((data: any) => {
      // this.finalResult = this.sortFinalResult(data?.data)
      this.finalResult = data?.data
    })
  }
  // onchangeSubAccNoSub(subAccountNo: any, $event: any) {
  //   this.glService.CoaBasicFilterBySubAccNoSub(subAccountNo, $event.target.value).subscribe((data: any) => {
  //     this.selectedDetails = data?.data
  //   })
  // }
  onSearchAccName() {
    this.isFilterActive = true;
    this.searchValue = this.searchText.value;
    console.log("searchText", this.searchValue);
    if (this.accTypeValue) {
      this.glService.searchByNameCoa(this.searchValue, this.accTypeValue, this.page = 0).subscribe((data: any) => {
        this.searchResult = data?.data;
        this.finalResult = this.searchResult
      });
    }
    else {
      this.glService.searchByNameCoaWithoutType(this.searchValue, this.page = 0, this.size = 200).subscribe((data: any) => {
        this.searchResult = data?.data;
        this.finalResult = this.searchResult
      });
    }
  }
  onSearchAccNameSub(subAccountNo: any) {
    this.isSubFilterActive = true;
    this.searchValueSub = this.searchTextSub.value;
    console.log("searchText sub", this.searchValueSub);
    this.glService.searchByNameCoaSub(subAccountNo, this.searchValueSub, this.page = 0, this.size = 500).subscribe((data: any) => {
      this.searchResult = data?.data;
      this.selectedDetails = this.searchResult;
    });
  }
  isClickable(c: any): boolean {
    return (
      this.allowedHeadAccounts.includes(c?.headAccountNo) ||
      this.allowedSubAccounts.includes(c?.subAccountNo)
    );
  }

  onClickView(c: any, index: number) {
    // If the same row is clicked again, toggle it closed
    this.subAccountNoOfmainTable = c?.subAccountNo
    if (this.expandedIndex === index) {
      this.expandedIndex = null;
      this.selectedDetails = [];
      return;
    }
    // Otherwise, open new details
    this.expandedIndex = index;
    if (!this.isClickable(c)) {
      return;
    }
    this.glService.coaSingleData(c?.subAccountNo, this.pagecoa = 0).subscribe({
      next: (data1: any) => {
        this.selectedDetails = data1?.data || [];
        this.totalElementSub = data1?.totalElements;
        this.pageSizeSub = data1?.pageSize;
        this.totalPageSub = Math.ceil(this.totalElementSub / this.pageSizeSub);
      },
      error: (err) => {
        console.error('API error:', err);
        this.selectedDetails = [];
      }
    });
  }
  onExpandedNext() {
    if (this.isSubFilterActive) {
      return; // pagination disabled during filters
    }
    this.currentPageSub = this.currentPageSub + 1
    this.glService.coaSingleData(this.subAccountNoOfmainTable, this.currentPageSub).subscribe((data1: any) => {
      this.selectedDetails = data1?.data || [];
    })
  }
  onExpandedPrev() {
    if (this.isSubFilterActive) {
      return; // pagination disabled during filters
    }
    this.currentPageSub = this.currentPageSub - 1
    this.glService.coaSingleData(this.subAccountNoOfmainTable, this.currentPageSub).subscribe((data1: any) => {
      this.selectedDetails = data1?.data || [];
    })
  }
}