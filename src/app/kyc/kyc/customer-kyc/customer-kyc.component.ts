import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormRecord, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { KycModuleService } from '../kyc-module.service';
import { Pipe, PipeTransform } from '@angular/core';

import saveAs from 'file-saver';
import { CustomerEditComponent } from '../../../user-management/user-management/user-management/bo/customer/customer-edit/customer-edit.component';
import { DataSharingService } from '../../../product/dataSharing/data-sharing.service';
import { SessionService } from '../../../session.service';
import { OtpModalComponent } from '../../../ui/otp-Modal/otp-modal/otp-modal.component';
import { CorporateService } from '../../../corporate/corporate.service';
// import { MerchantEditComponent } from '../../../user-management/user-management/user-management/bo/agents/merchant-edit/merchant-edit.component';
@Component({
  selector: 'app-customer-kyc',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, FormsModule, NgClass, CommonModule, CustomerEditComponent, OtpModalComponent],
  templateUrl: './customer-kyc.component.html',
  styleUrl: './customer-kyc.component.css'
})
export class CustomerKycComponent implements OnInit {
  // @ViewChild('kycTypeDropdown') kycTypeDropdown!: ElementRef<HTMLSelectElement>;
  // @ViewChild('filterDropdown') filterDropdown!: ElementRef<HTMLSelectElement>;
  // @ViewChild('commonSearchDropdown') commonSearchDropdown!: ElementRef<HTMLSelectElement>;
  @ViewChild('kycTypeDropdown') kycTypeDropdown!: ElementRef;
  @ViewChild('filterDropdown') filterDropdown!: ElementRef;
  @ViewChild('commonSearchDropdown') commonSearchDropdown!: ElementRef;


  showBackToTop = false;
  @HostListener('window:scroll', [])
  data: any;
  kycId: any;
  filterTarget: any;
  allData: any[] = [];
  searchForm: FormGroup = new FormGroup({});
  selectedFilterType = new FormControl();
  from = new FormControl();
  to = new FormControl();
  accountNO = new FormControl();
  accountType = new FormControl();
  searchText = new FormControl('');
  searchTexEmail = new FormControl();
  status = new FormControl();
  branch = new FormControl();
  province = new FormControl();
  district = new FormControl();
  user = new FormControl();
  showDate: boolean = false;
  showProvinceAndDistrict: boolean = false;
  showProvince: boolean = false;
  typeTarget: any;
  selectedKycType: boolean = true;
  selectedSearchBy: boolean = false;
  selectedCustomer: boolean = false;
  selectedAgent: boolean = false;
  allCustomer: any;
  allAgent: any;
  showAccNo: boolean = false
  showAccType: boolean = false;
  showStatus: boolean = false;
  showBranch: boolean = false;
  showUser: boolean = false;
  showEmail: boolean = false;
  allUsers: any[] = [];
  allBranch: any;
  startDate!: string;
  endDate!: string;
  accTypeTarget: number = 0;
  statusTarget: any;
  branchTarget: any;
  userTarget: any;
  allSuper: any;
  sortAscending: boolean = true;

  showMainDownload: boolean = true
  showFilterDownload: boolean = false
  allDateData: any;
  DateData: any;
  allAccNoData: any;
  AccNoData: any;
  allAccTypeData: any
  AccTypeData: any;
  AllStatusData: any;
  StatusData: any
  allBranchData: any
  BranchData: any
  allUserData: any;
  UserData: any
  formattedToDate: any;
  formattedFromDate: any;
  userPrivileges: any;
  kycPrivilege: any;
  isLoading: boolean = false;
  heading: string = 'All Registrations'; // Default heading
  currentPage: number = 0;
  currentPageSearch: number = 0;
  currentPageCustomer: number = 0;
  currentPageAgent: number = 0;
  currentPageDate: number = 0;
  currentPageProvince: number = 0;
  currentPageDistrict: number = 0;
  showPrevButtonProvince: boolean = false
  showNextButtonProvince: boolean = false
  showPrevButtonDistrict: boolean = false
  showNextButtonDistrict: boolean = false

  prevSearch: boolean = false
  searchTarget: any;
  searchValue: any;
  allEmailData: any;
  EmailData: any;
  userStatus: any;
  itemsPerPage: number = 10; // Items per page
  totalItems: number = 0;    // Total number of items
  totalPages: number = 0;
  noResults: boolean = false;
  searchResult: any;
  showSearchInput: boolean = false;
  showNextButtonSearch: boolean = false;
  showPrevButtonsearch: boolean = false;
  showPaginationButtons: boolean = true;
  showNextButtonCustomer: boolean = false;
  showPrevButtonCustomer: boolean = false;
  showPrevButtonAgent: boolean = false;
  showNextButtonAgent: boolean = false;
  showPrevButtonDate: boolean = false;
  showNextButtonDate: boolean = false;
  selectedDate: boolean = false;

  currentPageStatus: number = 0;
  showNextButtonStatus: boolean = false;
  showPrevButtonStatus: boolean = false;
  selectedStatus: boolean = false;
  showPrevButtonAcctype: boolean = false;
  showNextButtonAcctype: boolean = false;
  selectedAcctype: boolean = false;
  selectedDistrict: boolean = false;
  selectedProvince: boolean = false;
  currentPageAcctype: number = 0;
  isEnableRoute: boolean = false;
  isMerchantRoute: boolean = false;
  showDownload: boolean = false;
  downloadExcelPayload: any;
  kycType !: string;
  filterType !: string;
  isNoKycResult: boolean = false;
  showOTP: boolean = false;
  provinces: any;
  provinceTarget: any;
  provinceData: any;
  allprovinceData: any;
  districts: any;
  provinceId: any;
  selectedProvinceId: any;
  districtTarget: any;
  allDistrictData: any;
  DistrictData: any;
  // data = [
  //   { id: 1, firstName: 'SubProduct1', seqNo: 'Limit1', createdOn: 'Commission1', status: 'Charges1', kycType: 'TransLimit1'},
  //   { id: 1, firstName: 'SubProduct1', seqNo: 'Limit1', createdOn: 'Commission1', status: 'Charges1', kycType: 'TransLimit1'},
  //   { id: 1, firstName: 'SubProduct1', seqNo: 'Limit1', createdOn: 'Commission1', status: 'Charges1', kycType: 'TransLimit1'},
  // ];
  constructor(private router: Router, private corporate: CorporateService,
    private KycService: KycModuleService, private service: DataSharingService, private sessionService: SessionService) { }
  ngOnInit() {
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrivileges = this.userPrivileges[0];
      console.log(this.userPrivileges[0], "this.userPrevilages");
      console.log(this.userPrivileges, "this.userPrevilages1");

      for (let item of this.userPrivileges?.uiComponentPrivileges) {
        if (item?.component?.componentName == 'KYC') {
          if (item.subComponent?.subComponentName == 'All KYC')
            this.kycPrivilege = item;
        }
      }
    }
    // console.log( this.boPrvilege," this.boPrvilege");
    this.getAllKyc();
    this.getallUsers();
  }
  onWindowScroll() {
    this.showBackToTop = window.pageYOffset > 300;
  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  onNextPage() {
    this.currentPage++;
    this.getAllKyc();
  }
  onPreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getAllKyc();
    }
  }
  onNextPageSearch() {
    this.currentPageSearch++;
    this.onClickSearch();
  }
  onPreviousPageSearch() {
    if (this.currentPageSearch > 0) {
      this.currentPageSearch--;
    }
    this.onClickSearch();
    console.log("afdsf")
  }
  onOtpSubmit(otp: string) {
    console.log('OTP:', otp);
    this.sessionService.setOTP(otp);
    this.showOTP = false;
    this.router.navigate(["userManagement/customer-kyc"], {
      queryParams: { isNewRegistration: false }
    });

  }
  onNextPageCustomer() {
    this.currentPageCustomer++;
    if (this.typeTarget == 'ALL') {
      this.getAllKyc();
      this.showMainDownload = true
      this.showFilterDownload = false
    }
    if (this.typeTarget == 'CUSTOMER') {
      this.showMainDownload = true
      this.showFilterDownload = false
      //

      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPageCustomer,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allCustomer = data?.data
        this.data = this.allCustomer
        this.isLoading = false;

      })
    }
    if (this.typeTarget == 'AGENT') {
      this.showMainDownload = true
      this.showFilterDownload = false;
      //new
      // this.showNextButtonSearch = false;
      // this.showPrevButtonsearch = false
      // this.showPaginationButtons = false
      // this.showNextButtonCustomer = false
      // this.showPrevButtonCustomer = false
      // this.showPrevButtonAgent = true
      // this.showNextButtonAgent = true
      // this.showPrevButtonDate = false
      // this.showNextButtonDate = false
      // this.showPrevButtonStatus = false
      // this.showNextButtonStatus = false
      // this.showPrevButtonAcctype = false
      // this.showNextButtonAcctype = false

      // this.selectedSearchBy = false
      // this.selectedKycType = false;
      // this.selectedCustomer = false;
      // this.selectedAgent = true;
      // this.selectedDate = false;
      // this.selectedStatus = false
      // this.selectedAcctype = false

      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPageCustomer,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allAgent = data?.data
        this.data = this.allAgent
        this.isLoading = false;
      })
    }
    if (this.typeTarget == 'SUPER_AGENT') {
      this.showMainDownload = true
      this.showFilterDownload = false
      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPageCustomer,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allSuper = data?.data
        this.data = this.allSuper
        this.isLoading = false;
      })
    }
    //new
    if (this.typeTarget == 'MERCHANT') {
      this.showMainDownload = true
      this.showFilterDownload = false
      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPageCustomer,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allSuper = data?.data
        this.data = this.allSuper
        this.isLoading = false;
      })
    }
    if (this.typeTarget == 'CORPORATE') {
      this.showMainDownload = true
      this.showFilterDownload = false
      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPageCustomer,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allSuper = data?.data
        this.data = this.allSuper
        this.isLoading = false;
      })
    }
    if (this.typeTarget == 'NGO') {
      this.showMainDownload = true
      this.showFilterDownload = false
      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPageCustomer,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allSuper = data?.data
        this.data = this.allSuper
        this.isLoading = false;
      })
    }
    if (this.typeTarget == 'GOVT_AGENCY') {
      this.showMainDownload = true
      this.showFilterDownload = false
      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPageCustomer,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allSuper = data?.data
        this.data = this.allSuper
        this.isLoading = false;
      })
    }
    if (this.typeTarget == 'UN_AGENCY') {
      this.showMainDownload = true
      this.showFilterDownload = false
      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPageCustomer,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allSuper = data?.data
        this.data = this.allSuper
        this.isLoading = false;
      })
    }
  }
  onPreviousPageCustomer() {
    if (this.currentPageCustomer > 0) {
      this.currentPageCustomer--;
    }
    if (this.typeTarget == 'ALL') {
      this.getAllKyc();
      this.showMainDownload = true
      this.showFilterDownload = false
    }
    if (this.typeTarget == 'CUSTOMER') {
      this.showMainDownload = true
      this.showFilterDownload = false
      //

      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPageCustomer,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allCustomer = data?.data
        this.data = this.allCustomer
        this.isLoading = false;

      })
    }
    if (this.typeTarget == 'AGENT') {
      this.showMainDownload = true
      this.showFilterDownload = false;
      //new

      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPageCustomer,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allAgent = data?.data
        this.data = this.allAgent
        this.isLoading = false;
      })
    }
    if (this.typeTarget == 'SUPER_AGENT') {
      this.showMainDownload = true
      this.showFilterDownload = false
      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPageCustomer,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allSuper = data?.data
        this.data = this.allSuper
        this.isLoading = false;
      })
    }
    //new
    if (this.typeTarget == 'MERCHANT') {
      this.showMainDownload = true
      this.showFilterDownload = false
      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPageCustomer,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allSuper = data?.data
        this.data = this.allSuper
        this.isLoading = false;
      })
    }
    if (this.typeTarget == 'CORPORATE') {
      this.showMainDownload = true
      this.showFilterDownload = false
      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPageCustomer,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allSuper = data?.data
        this.data = this.allSuper
        this.isLoading = false;
      })
    }
    if (this.typeTarget == 'NGO') {
      this.showMainDownload = true
      this.showFilterDownload = false
      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPageCustomer,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allSuper = data?.data
        this.data = this.allSuper
        this.isLoading = false;
      })
    }
    if (this.typeTarget == 'GOVT_AGENCY') {
      this.showMainDownload = true
      this.showFilterDownload = false
      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPageCustomer,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allSuper = data?.data
        this.data = this.allSuper
        this.isLoading = false;
      })
    }
    if (this.typeTarget == 'UN_AGENCY') {
      this.showMainDownload = true
      this.showFilterDownload = false
      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPageCustomer,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allSuper = data?.data
        this.data = this.allSuper
        this.isLoading = false;
      })
    }
  }
  onNextPageAgent() {
    this.currentPageAgent++;
    let req = {
      "filterType": null,
      "filterValues": [
        null
      ],
      "page": this.currentPageAgent,
      "kycType": this.typeTarget
    }
    this.isLoading = true;
    this.KycService.getDataFilter(req).subscribe((data: any) => {
      this.allAgent = data?.data
      this.data = this.allAgent
      this.isLoading = false;
    })
  }
  onPreviousPageAgent() {
    if (this.currentPageAgent > 0) {
      this.currentPageAgent--;
    }
    let req = {
      "filterType": null,
      "filterValues": [
        null
      ],
      "page": this.currentPageAgent,
      "kycType": this.typeTarget
    }
    this.isLoading = true;
    this.KycService.getDataFilter(req).subscribe((data: any) => {
      this.allAgent = data?.data
      this.data = this.allAgent
      this.isLoading = false;
    })

  }

  onNextPageProvince() {
    this.currentPageProvince++;
    console.log("Current Page: next page", this.currentPageProvince);
    let req = {
      "filterType": this.filterTarget,
      "filterValues": [
        this.provinceTarget
      ],
      "page": this.currentPageProvince,
      "kycType": this.typeTarget,
      "sort": this.sortAscending ? 'ASC' : 'DESC'
    }
    this.isLoading = true;
    this.KycService.getDataFilter(req).subscribe((data: any) => {
      this.provinceData = data?.data
      this.data = this.provinceData
      if (this.data.length > 0)
        this.showDownload = true;
      this.isLoading = false;

    })
  }
  onPreviousPageProvince() {
    if (this.currentPageProvince > 0) {
      this.currentPageProvince--;
    }
    let req = {
      "filterType": this.filterTarget,
      "filterValues": [
        this.provinceTarget
      ],
      "page": this.currentPageProvince,
      "kycType": this.typeTarget,
      "sort": this.sortAscending ? 'ASC' : 'DESC'
    }
    this.isLoading = true;
    this.KycService.getDataFilter(req).subscribe((data: any) => {
      this.provinceData = data?.data
      this.data = this.provinceData
      if (this.data.length > 0)
        this.showDownload = true;
      this.isLoading = false;

    })
  }

  onNextPageDistrict() {
    this.currentPageDistrict++;
    console.log("Current Page: next page", this.currentPageDistrict);
    let req = {
      "filterType": this.filterTarget,
      "filterValues": [
        this.districtTarget
      ],
      "page": this.currentPageDistrict,
      "kycType": this.typeTarget,
      "sort": this.sortAscending ? 'ASC' : 'DESC'
    }
    this.isLoading = true;
    this.KycService.getDataFilter(req).subscribe((data: any) => {
      this.DistrictData = data?.data
      this.data = this.DistrictData
      if (this.data.length > 0)
        this.showDownload = true;
      this.isLoading = false;

    })
  }
  onPreviousPageDistrict() {
    if (this.currentPageDistrict > 0) {
      this.currentPageDistrict--;
    }
    let req = {
      "filterType": this.filterTarget,
      "filterValues": [
        this.districtTarget
      ],
      "page": this.currentPageDistrict,
      "kycType": this.typeTarget,
      "sort": this.sortAscending ? 'ASC' : 'DESC'
    }
    this.isLoading = true;
    this.KycService.getDataFilter(req).subscribe((data: any) => {
      this.DistrictData = data?.data
      this.data = this.DistrictData
      if (this.data.length > 0)
        this.showDownload = true;
      this.isLoading = false;

    })
  }

  onNextPageDate() {
    this.currentPageDate++;
    this.onDateSubmit();
  }
  onPreviousPageDate() {
    if (this.currentPageDate > 0) {
      this.currentPageDate--;
    }
    this.onDateSubmit();
  }
  //
  onNextPageStatus() {
    this.currentPageStatus++;
    if (!this.typeTarget || this.typeTarget == "ALL") {
      let req = {
        "filterType": this.filterTarget,
        "filterValues": [
          this.statusTarget
        ],
        "page": this.currentPageStatus,
        "kycType": null,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;

      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.AllStatusData = data?.data
        this.data = this.AllStatusData
        this.isLoading = false;

      })
    }
    else {
      let req = {
        "filterType": this.filterTarget,
        "filterValues": [
          this.statusTarget
        ],
        "page": this.currentPageStatus,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;

      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.StatusData = data?.data
        this.data = this.StatusData
        this.isLoading = false;

      })
    }
  }
  onPreviousPageStatus() {
    if (this.currentPageStatus > 0) {
      this.currentPageStatus--;
    }
    if (!this.typeTarget || this.typeTarget == "ALL") {
      let req = {
        "filterType": this.filterTarget,
        "filterValues": [
          this.statusTarget
        ],
        "page": this.currentPageStatus,
        "kycType": null,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;

      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.AllStatusData = data?.data
        this.data = this.AllStatusData
        this.isLoading = false;

      })
    }
    else {
      let req = {
        "filterType": this.filterTarget,
        "filterValues": [
          this.statusTarget
        ],
        "page": this.currentPageStatus,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;

      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.StatusData = data?.data
        this.data = this.StatusData
        this.isLoading = false;

      })
    }
  }
  onNextPageAcctype() {
    this.currentPageAcctype++;
    if (!this.typeTarget || this.typeTarget == "ALL") {
      let req = {
        "filterType": this.filterTarget,
        "filterValues": [
          this.accTypeTarget
        ],
        "page": this.currentPageAcctype,
        "kycType": null,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;

      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allAccTypeData = data?.data
        this.data = this.allAccTypeData
        this.isLoading = false;
      })
    }
    else {
      let req = {
        "filterType": this.filterTarget,
        "filterValues": [
          this.accTypeTarget
        ],
        "page": this.currentPageAcctype,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;

      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.AccTypeData = data?.data
        this.data = this.AccTypeData
        this.isLoading = false;
      })
    }
  }
  onPreviousPageAcctype() {
    if (this.currentPageAcctype > 0) {
      this.currentPageAcctype--;
    }
    if (!this.typeTarget || this.typeTarget == "ALL") {
      let req = {
        "filterType": this.filterTarget,
        "filterValues": [
          this.accTypeTarget
        ],
        "page": this.currentPageAcctype,
        "kycType": null,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;

      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allAccTypeData = data?.data
        this.data = this.allAccTypeData
        this.isLoading = false;
      })
    }
    else {
      let req = {
        "filterType": this.filterTarget,
        "filterValues": [
          this.accTypeTarget
        ],
        "page": this.currentPageAcctype,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;

      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.AccTypeData = data?.data
        this.data = this.AccTypeData
        this.isLoading = false;
      })
    }
  }
  //
  getAllKyc() {
    let req = {
      "filterType": null,
      "filterValues": [
        null
      ],
      // "page": 0,
      "page": this.currentPage,
      "kycType": null
    }
    this.isLoading = true; // Set loading state to true when starting API call
    // Set loading state to false when API call completes
    this.KycService.getDataFilter(req).subscribe((data: any) => {
      if (Array.isArray(data?.data)) {
        this.data = data?.data
        this.allData = [...this.data]
        //console.log('Fetched products:', this.data);
      }
      else {
        // If data?.data is not an array, handle the case here
        console.error('Expected an array but received:', data?.data);
        this.data = []; // Set empty array or handle appropriately
        this.allData = []; // Set empty array or handle appropriately
      }
      this.totalItems = data?.total;    // Assuming `total` gives the total number of items from the API response
      console.log('totalItems:', this.totalItems);
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // Calculate total pages
      console.log('totalPages:', this.totalPages);
      this.isLoading = false; // Set loading state to true when starting API call

    })
  }
  onChangeSearchBy($event: any) {
    //reset
    //jan
    // this.kycTypeDropdown.nativeElement.selectedIndex = 0;
    this.filterDropdown.nativeElement.selectedIndex = 0;
    // this.commonSearchDropdown.nativeElement.selectedIndex = 0;

    this.searchForm.reset(); // Reset all fields in the form
    this.searchText.setValue(''); // Optionally reset the individual search text control
    this.noResults = false; // Reset noResults flag if needed
    this.showDate = false; // Reset conditional fields visibility
    this.showAccNo = false;
    this.showAccType = false;
    this.showStatus = false;
    this.showBranch = false;
    this.showUser = false;
    this.showProvince = false;
    this.showProvinceAndDistrict = false;
    //reset
    this.searchTarget = $event.target.value;
    this.showSearchInput = true;
    this.searchText.reset();
    //new cmnted 
    // this.getAllKyc();

    if (this.searchTarget == "DATE") {
      this.showDate = true;
      this.showSearchInput = false;
    }
  }
  // onClickSearch() {
  //   this.searchValue = this.searchText?.value?.trim() || ""; // Ensure searchValue is trimmed and not null
  //   console.log("Search Target:", this.searchTarget);
  //   console.log("Search Value:", this.searchValue);

  //   if (!this.searchValue) {
  //     console.log("Empty search value");
  //     this.data = [...this.allData]; // Reset to original data if no search value
  //     this.noResults = false; // Reset 'No Results' flag
  //     return;
  //   }

  //   switch (this.searchTarget) {
  //     case "NAME":
  //       console.log("Searching by NAME...");
  //       this.data = this.allData.filter(item => {
  //         const firstNames = [
  //           item?.agentKyc?.custInfoFirstName,
  //           item?.customerKyc?.custInfoFirstName,
  //           item?.masterAgentKyc?.signatories?.[0]?.firstName,
  //           item?.corporateKyc?.signatories?.[0]?.firstName
  //         ];
  //         return firstNames.some(firstName =>
  //           firstName?.toLowerCase().includes(this.searchValue.toLowerCase())
  //         );
  //       });
  //       break;

  //     case "TAZKIRA":
  //       console.log("Searching by TAZKIRA...");
  //       this.data = this.allData.filter(item => {
  //         const tazkiraNumbers = [
  //           item?.agentKyc?.custProofNumber,
  //           item?.customerKyc?.custProofNumber,
  //           item?.masterAgentKyc?.signatories?.[0]?.idProofNumber,
  //           item?.corporateKyc?.signatories?.[0]?.idProofNumber
  //         ];
  //         return tazkiraNumbers.some(tazkira =>
  //           tazkira?.toLowerCase().includes(this.searchValue.toLowerCase())
  //         );
  //       });
  //       break;

  //     case "MOB":
  //       console.log("Searching by MOB...");
  //       this.data = this.allData.filter(item => {
  //         const phoneWithCountryCode = `+93${item?.submittedFor?.phone?.slice(-9)}`;
  //         return phoneWithCountryCode.includes(this.searchValue);
  //       });
  //       break;

  //     case "EMAIL":
  //       console.log("Searching by EMAIL...");
  //       this.data = this.allData.filter(item => {
  //         const emails = [
  //           item?.agentKyc?.custInfoEmail,
  //           item?.customerKyc?.custInfoEmail,
  //           item?.masterAgentKyc?.signatories?.[0]?.email,
  //           item?.corporateKyc?.signatories?.[0]?.email
  //         ];
  //         return emails.some(email =>
  //           email?.toLowerCase().includes(this.searchValue.toLowerCase())
  //         );
  //       });
  //       break;

  //     default:
  //       console.log("Invalid search target");
  //       this.data = [];
  //       break;
  //   }
  //   if (this.data.length === 0) {
  //     console.log("No results found");
  //     this.noResults = true;
  //   } else {
  //     this.noResults = false;
  //   }
  //   console.log("Filtered Data:", this.data);
  //   // this.searchText.reset(); // Optional: Reset the input field
  // }
  onKeydownSearch(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onClickSearch(); // Trigger search on Enter key
    }
  }
  //old jan 14
  // onClickSearch(): void {
  //   console.log("searchTarget 11", this.searchTarget)
  //   if (this.searchTarget === 'ID_PROOF') {
  //     if (!this.typeTarget || this.typeTarget === "ALL") {
  //       alert("Please select a specific kycType");
  //       return; // Exit the function if the condition is met
  //     }
  //     // Proceed with the request if typeTarget is valid
  //     const req = {
  //       filterType: this.searchTarget,
  //       filterValues: [this.searchText.value],
  //       page: this.currentPageSearch,
  //       kycType: this.typeTarget
  //     };

  //     this.KycService.getResultByFilter(req).subscribe((data: any) => {
  //       this.searchResult = data?.data;
  //       this.data = this.searchResult;
  //       this.updatePaginationButtons();
  //       this.selectedSearchBy = true
  //       this.selectedKycType = false;
  //       this.selectedCustomer = false;
  //       this.selectedAgent = false;
  //       this.selectedDate = false;
  //       this.selectedStatus = false
  //       this.selectedAcctype = false

  //     });
  //   } else if (['NAME', 'PHONE', 'EMAIL'].includes(this.searchTarget)) {
  //     // Handle other search types
  //     const req1 = {
  //       filterType: this.searchTarget,
  //       filterValues: [this.searchText.value],
  //       page: this.currentPageSearch

  //     };

  //     this.KycService.getResultByFilter(req1).subscribe((data: any) => {
  //       this.searchResult = data?.data;
  //       this.data = this.searchResult;
  //       this.updatePaginationButtons();
  //       this.selectedSearchBy = true
  //       this.selectedKycType = false;
  //       this.selectedCustomer = false;
  //       this.selectedAgent = false;
  //       this.selectedDate = false;
  //       this.selectedStatus = false
  //       this.selectedAcctype = false

  //     });
  //   } else {
  //     // Handle cases where searchTarget is not recognized
  //     alert("Please select a valid search type");
  //   }
  // }
  onClickSearch(): void {
    console.log("searchTarget", this.searchTarget);
    this.isNoKycResult = false; // Reset the flag before making the API call

    if (this.searchTarget === 'ID_PROOF') {
      if (!this.typeTarget || this.typeTarget === "ALL") {
        alert("Please select a specific kycType");
        return;
      }

      const req = {
        filterType: this.searchTarget,
        filterValues: [this.searchText.value],
        page: this.currentPageSearch,
        kycType: this.typeTarget,
        sort: this.sortAscending ? 'ASC' : 'DESC'
      };

      this.KycService.getResultByFilter(req).subscribe((data: any) => {
        this.searchResult = data?.data;
        this.data = this.searchResult;
        this.updatePaginationButtons();
        this.resetSelectionFlags();


      });
    } else if (['NAME', 'PHONE', 'EMAIL'].includes(this.searchTarget)) {
      const req1 = {
        filterType: this.searchTarget,
        filterValues: [this.searchText.value],
        page: this.currentPageSearch,
        sort: this.sortAscending ? 'ASC' : 'DESC'
      };

      this.KycService.getResultByFilter(req1).subscribe((data: any) => {
        this.searchResult = data?.data;
        if (!this.searchResult || this.searchResult.length === 0) {
          this.KycService.getNoKycResults(req1).subscribe((data: any) => {
            if (data?.data && data?.data.length > 0) {
              alert("No KYC found. However, we found some registrations without KYC. Displaying those results.");
              this.data = data?.data;
              this.isNoKycResult = true;
              console.log("No KYC Results:", this.data);
            }
          });
        }
        else {
          this.data = this.searchResult;
          this.isNoKycResult = false;
          this.updatePaginationButtons();
          this.resetSelectionFlags();
        }
      });
    } else {
      alert("Please select a valid search type");
    }
  }

  resetSelectionFlags(): void {
    this.selectedSearchBy = true;
    this.selectedKycType = false;
    this.selectedCustomer = false;
    this.selectedAgent = false;
    this.selectedDate = false;
    this.selectedStatus = false;
    this.selectedAcctype = false;
    this.selectedProvince = false;
    this.selectedDistrict = false;

  }
  updatePaginationButtons() {
    console.log("this.searchResult.length", this.searchResult.length)
    if (this.searchResult && this.searchResult.length == 10) {
      // Enable the Next/Previous buttons
      this.showNextButtonSearch = true;
      this.showPrevButtonsearch = true
      this.showPaginationButtons = false

      this.showNextButtonCustomer = false
      this.showPrevButtonCustomer = false
      this.showPrevButtonAgent = false
      this.showNextButtonAgent = false

      this.showPrevButtonDate = false
      this.showNextButtonDate = false

      this.showPrevButtonStatus = false
      this.showNextButtonStatus = false
      this.showPrevButtonAcctype = false
      this.showNextButtonAcctype = false

      this.showPrevButtonProvince = false
      this.showNextButtonProvince = false

      this.showPrevButtonDistrict = false
      this.showNextButtonDistrict = false

    } else {
      // Hide the Next/Previous buttons if there are less than or equal to 10 items
      this.showNextButtonSearch = false;
      // this.showPrevButtonsearch = false
      this.showPaginationButtons = false

      this.showNextButtonCustomer = false
      // this.showPrevButtonCustomer = false
      // this.showPrevButtonAgent = false
      this.showNextButtonAgent = false

      // this.showPrevButtonDate = false
      this.showNextButtonDate = false
      // this.showPrevButtonStatus = false
      this.showNextButtonStatus = false
      // this.showPrevButtonAcctype = false
      this.showNextButtonAcctype = false

      // this.showPrevButtonProvince = false
      this.showNextButtonProvince = false

      //  this.showPrevButtonDistrict = false
      this.showNextButtonDistrict = false
    }
  }
  onResetSearch(): void {
    /* this.kycTypeDropdown.nativeElement.selectedIndex = 0;
    this.filterDropdown.nativeElement.selectedIndex = 0; */
    this.kycType = this.filterTarget = '';
    this.commonSearchDropdown.nativeElement.selectedIndex = 0;

    this.searchForm.reset(); // Reset all fields in the form
    this.searchText.setValue(''); // Optionally reset the individual search text control
    this.noResults = false; // Reset noResults flag if needed
    this.showDate = false; // Reset conditional fields visibility
    this.showAccNo = false;
    this.showAccType = false;
    this.showStatus = false;
    this.showBranch = false;
    this.showUser = false;
    this.showProvince = false;
    this.showProvinceAndDistrict = false;
    this.showSearchInput = false
    this.getAllKyc();
  }
  onToggleSort(): void {
    this.sortAscending = !this.sortAscending;
    if (this.selectedSearchBy) {
      this.onClickSearch();
    } else if (this.selectedDate) {
      this.onDateSubmit();
    } else if (this.selectedStatus) {
      this.reFetchStatus();
    } else if (this.selectedAcctype) {
      this.reFetchAccType();
    }
    else if (this.selectedProvince) {
      this.reFetchProvince();
    }
    else if (this.selectedDistrict) {
      this.reFetchDistrict();
    }
    else {
      this.getAllKyc();
    }
  }
  private reFetchStatus(): void {
    if (!this.kycType || this.kycType === 'ALL') {
      const req = {
        "filterType": this.filterType,
        "filterValues": [this.status.value],
        "page": this.currentPageStatus,
        "kycType": null,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      };
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.AllStatusData = data?.data;
        this.data = this.AllStatusData;
        this.isLoading = false;
      });
    } else {
      const req = {
        "filterType": this.filterType,
        "filterValues": [this.status.value],
        "page": this.currentPageStatus,
        "kycType": this.kycType,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      };
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.StatusData = data?.data;
        this.data = this.StatusData;
        this.isLoading = false;
      });
    }
  }
  private reFetchAccType(): void {
    if (!this.kycType || this.kycType === 'ALL') {
      const req = {
        "filterType": this.filterType,
        "filterValues": [this.accountType.value],
        "page": this.currentPageAcctype,
        "kycType": null,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      };
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allAccTypeData = data?.data;
        this.data = this.allAccTypeData;
        this.isLoading = false;
      });
    } else {
      const req = {
        "filterType": this.filterType,
        "filterValues": [this.accountType.value],
        "page": this.currentPageAcctype,
        "kycType": this.kycType,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      };
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.AccTypeData = data?.data;
        this.data = this.AccTypeData;
        this.isLoading = false;
      });
    }
  }
  private reFetchProvince(): void {
    const req = {
      "filterType": this.filterType,
      "filterValues": [this.provinceTarget],
      "page": this.currentPageProvince,
      "kycType": this.kycType,
      "sort": this.sortAscending ? 'ASC' : 'DESC'
    };
    this.isLoading = true;
    this.KycService.getDataFilter(req).subscribe((data: any) => {
      this.provinceData = data?.data;
      this.data = this.provinceData;
      this.isLoading = false;
    });
  }
  private reFetchDistrict(): void {
    const req = {
      "filterType": this.filterType,
      "filterValues": [this.districtTarget],
      "page": this.currentPageDistrict,
      "kycType": this.kycType,
      "sort": this.sortAscending ? 'ASC' : 'DESC'
    };
    this.isLoading = true;
    this.KycService.getDataFilter(req).subscribe((data: any) => {
      this.DistrictData = data?.data;
      this.data = this.DistrictData;
      this.isLoading = false;
    });
  }
  onClickView(item: any) {
    this.isLoading = true
    this.kycId = item?.id;
    this.KycService.setItem(item);
    if (item?.status == 'IN_REVIEW') {
      this.KycService.lockKYCforMultipleAccess(this.kycId).subscribe(response => {
        this.isLoading = false
        if (response.responseCode == 200) {
          this.navigateToKyc(item);
        }
        else {
          alert(response?.error);
        }
      })

    }
    else {
      this.navigateToKyc(item);
    }



  }

  navigateToKyc(item: any) {
    if (item.kycType === "CUSTOMER") {
      // this.router.navigate(["kyc/view-customer-kyc", this.kycId]);
      this.router.navigate(['kyc/view-customer-kyc'], { queryParams: { from: this.router.url } });
      // this.router.navigate(["kyc/view-customer-kyc"], { queryParams: { data: JSON.stringify(item) } });
    }
    else if (item.kycType === "AGENT" || item.kycType === "MERCHANT") {
      this.router.navigate(['kyc/view-agent-kyc'], { queryParams: { from: this.router.url } });
      // this.router.navigate(["kyc/view-agent-kyc"], { queryParams: { data: JSON.stringify(item) } });
    }
    else if (item.kycType === "CORPORATE" || item.kycType === "GOVT_AGENCY" || item.kycType === "UN_AGENCY" || item.kycType === "NGO") {
      this.router.navigate(['kyc/view-superagent-kyc'], { queryParams: { from: this.router.url } });
      // this.router.navigate(["kyc/view-superagent-kyc"], { queryParams: { data: JSON.stringify(item) } });
    }
    else if (item.kycType === "MASTER AGENT") {
      this.router.navigate(['kyc/view-masteragent-kyc'], { queryParams: { from: this.router.url } });
      // this.router.navigate(["kyc/view-masteragent-kyc"], { queryParams: { data: JSON.stringify(item) } });
    }
    else {
      console.error("Unknown kycType:", item);
    }
  }
  onChangeKyctype($event: any) {
    //new 
    this.data.length = 0;
    this.showNextButtonSearch = false;
    this.showPrevButtonsearch = false
    this.showPaginationButtons = false
    this.showNextButtonCustomer = true
    this.showPrevButtonCustomer = true
    this.showPrevButtonAgent = false
    this.showNextButtonAgent = false
    this.showPrevButtonDate = false
    this.showNextButtonDate = false
    this.showPrevButtonStatus = false
    this.showNextButtonStatus = false
    this.showPrevButtonAcctype = false
    this.showNextButtonAcctype = false
    this.showPrevButtonProvince = false
    this.showNextButtonProvince = false
    this.showPrevButtonDistrict = false
    this.showNextButtonDistrict = false
    this.selectedSearchBy = false
    this.selectedKycType = false;
    this.selectedCustomer = true;
    this.selectedAgent = false;
    this.selectedDate = false;
    this.selectedStatus = false
    this.selectedAcctype = false
    this.selectedProvince = false
    this.selectedDistrict = false;

    this.typeTarget = $event.target.value;

    if (this.kycTypeDropdown?.nativeElement) {
      console.log('Kyc Type changed:', this.kycTypeDropdown.nativeElement.value);
    }
    if (this.filterDropdown?.nativeElement) {
      this.filterDropdown.nativeElement.selectedIndex = 0;
    }
    if (this.commonSearchDropdown?.nativeElement) {
      this.commonSearchDropdown.nativeElement.selectedIndex = 0;
    }


    this.searchForm.reset(); // Reset all fields in the form
    this.searchText.setValue(''); // Optionally reset the individual search text control
    this.noResults = false; // Reset noResults flag if needed
    this.showDate = false; // Reset conditional fields visibility
    this.showAccNo = false;
    this.showAccType = false;
    this.showStatus = false;
    this.showBranch = false;
    this.showUser = false;
    this.showProvince = false;
    this.showProvinceAndDistrict = false;
    //reset
    console.log(this.typeTarget, 'type');

    if (this.typeTarget == 'null') {
      this.getAllKyc();
      //this.showMainDownload = true
      this.showDownload = false;
    }
    if (this.typeTarget === 'CUSTOMER') {
      //this.showFilterDownload = false
      //

      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPage,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'

      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allCustomer = data?.data
        this.data = this.allCustomer
        if (this.data.length > 0) {
          this.showDownload = true;
          this.downloadExcelPayload = req;
          this.downloadExcelPayload.page = 0;
        }
        this.isLoading = false;


      })
    }
    if (this.typeTarget === 'AGENT') {

      this.showFilterDownload = false;
      //new
      this.showNextButtonSearch = false;
      this.showPrevButtonsearch = false

      this.showPaginationButtons = false

      this.showNextButtonCustomer = false
      this.showPrevButtonCustomer = false

      this.showPrevButtonAgent = true
      this.showNextButtonAgent = true

      this.showPrevButtonDate = false
      this.showNextButtonDate = false
      this.showPrevButtonStatus = false
      this.showNextButtonStatus = false

      this.showPrevButtonAcctype = false
      this.showNextButtonAcctype = false

      this.showPrevButtonProvince = false
      this.showNextButtonProvince = false
      this.showPrevButtonDistrict = false
      this.showNextButtonDistrict = false

      this.selectedSearchBy = false
      this.selectedKycType = false;
      this.selectedCustomer = false;
      this.selectedAgent = true;
      this.selectedDate = false;
      this.selectedStatus = false
      this.selectedAcctype = false
      this.selectedProvince = false
      this.selectedDistrict = false;

      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPage,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'

      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allAgent = data?.data
        this.data = this.allAgent
        if (this.data.length > 0) {
          this.showDownload = true;
          this.downloadExcelPayload = req;
          this.downloadExcelPayload.page = 0;
        }
        this.isLoading = false;

      })
    }
    if (this.typeTarget === 'SUPER_AGENT') {


      //this.showFilterDownload = false
      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPage,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'

      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allSuper = data?.data
        this.data = this.allSuper
        if (this.data.length > 0) {
          this.showDownload = true;
          this.downloadExcelPayload = req;
          this.downloadExcelPayload.page = 0;
        }
        this.isLoading = false;
      })
    }
    //new
    if (this.typeTarget === 'MERCHANT') {
      this.showMainDownload = true
      this.showFilterDownload = false
      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPageCustomer,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'

      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allSuper = data?.data
        this.data = this.allSuper
        if (this.data.length > 0) {
          this.showDownload = true;
          this.downloadExcelPayload = req;
          this.downloadExcelPayload.page = 0;
        }
        this.isLoading = false;
      })
    }
    if (this.typeTarget === 'CORPORATE') {
      this.showMainDownload = true
      this.showFilterDownload = false
      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPageCustomer,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'

      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allSuper = data?.data
        this.data = this.allSuper
        if (this.data.length > 0) {
          this.showDownload = true;
          this.downloadExcelPayload = req;
          this.downloadExcelPayload.page = 0;
        }
        this.isLoading = false;
      })
    }
    if (this.typeTarget === 'NGO') {
      this.showMainDownload = true
      this.showFilterDownload = false
      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPageCustomer,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'

      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allSuper = data?.data
        this.data = this.allSuper
        if (this.data.length > 0) {
          this.showDownload = true;
          this.downloadExcelPayload = req;
          this.downloadExcelPayload.page = 0;
        }
        this.isLoading = false;
      })
    }
    if (this.typeTarget === 'GOVT_AGENCY') {
      this.showMainDownload = true
      this.showFilterDownload = false
      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPageCustomer,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allSuper = data?.data
        this.data = this.allSuper
        if (this.data.length > 0) {
          this.showDownload = true;
          this.downloadExcelPayload = req;
          this.downloadExcelPayload.page = 0;
        }
        this.isLoading = false;
      })
    }
    if (this.typeTarget === 'UN_AGENCY') {
      this.showMainDownload = true
      this.showFilterDownload = false
      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPageCustomer,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allSuper = data?.data
        this.data = this.allSuper
        if (this.data.length > 0) {
          this.showDownload = true;
          this.downloadExcelPayload = req;
          this.downloadExcelPayload.page = 0;
        }
        this.isLoading = false;
      })
    }
    if (this.data?.length > 0) {
      this.showDownload = true;
    }
    else {
      this.showDownload = false;
    }
  }
  ngAfterViewInit() {
    if (this.kycTypeDropdown) {
      console.log('Kyc Type initialized:', this.kycTypeDropdown.nativeElement.value);
    }
  }

  // getallUsers() {
  //   this.isLoading = true;
  //   this.KycService.getallUsers().subscribe((data: any) => {
  //     // this.allUsers = data?.data || [];
  //     // console.log("allUsersallUsers", this.allUsers)
  //     this.allUsers = data;
  //     // this.allUsers = Object.values(data?.data || {});
  //     console.log('Extracted Users:', this.allUsers);
  //     this.isLoading = false;
  //   })
  // }
  getallUsers() {
    this.isLoading = true;
    this.KycService.getallUsers().subscribe(
      (data: any) => {
        this.allUsers = data?.data || []; // Adjust the property path based on API response
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.isLoading = false;
      }
    );
  }
  getallBranch() {
    this.KycService.getallBranch().subscribe((data: any) => {
      this.allBranch = data?.data
    })
  }
  onChangeFilter($event: any) {
    this.filterTarget = $event.target.value;

    //reset
    // this.filterDropdown.nativeElement.selectedIndex = 0;
    this.commonSearchDropdown.nativeElement.selectedIndex = 0;

    this.searchForm.reset(); // Reset all fields in the form
    this.searchText.setValue(''); // Optionally reset the individual search text control
    this.noResults = false; // Reset noResults flag if needed
    this.showDate = false; // Reset conditional fields visibility
    this.showAccNo = false;
    this.showAccType = false;
    this.showStatus = false;
    this.showBranch = false;
    this.showUser = false;
    this.showProvince = false;
    this.showProvinceAndDistrict = false;
    //reset
    if (this.filterType == 'DATE') {
      this.showDownload = true
      this.showMainDownload = false
      this.showFilterDownload = true
      this.showDate = true
      this.showAccType = false
      this.showAccNo = false
      this.showStatus = false
      this.showBranch = false
      this.showUser = false
      this.showEmail = false
      this.showProvince = false;
      this.showProvinceAndDistrict = false;
      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPage,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allCustomer = data?.data
        this.data = this.allCustomer
        if (this.data.length > 0) {
          this.showDownload = true;
          this.downloadExcelPayload = req;
          this.downloadExcelPayload.page = 0;
        }
        this.isLoading = false;


      })
    }
    else if (this.filterType == 'ALL') {
      this.heading = 'All Registrations';
      this.showDownload = false;
      this.showMainDownload = false
      this.showFilterDownload = true
      this.showDate = false
      this.showAccType = false
      this.showAccNo = false
      this.showStatus = false
      this.showBranch = false
      this.showUser = false
      this.showEmail = false
      this.showProvince = false;
      this.showProvinceAndDistrict = false;
      this.kycType = ""
      let req = {
        "filterType": null,
        "filterValues": [
          null
        ],
        "page": this.currentPage,
        "kycType": null,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;
      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allCustomer = data?.data
        this.data = this.allCustomer
        if (this.data.length > 0) {
          this.showDownload = false;
          this.downloadExcelPayload = req;
          this.downloadExcelPayload.page = 0;
        }
        this.isLoading = false;


      })
    }
    else if (this.filterType == 'MM_ACCOUNT_NO') {
      this.heading = 'MM Account Number Registrations';
      this.showDownload = false;
      this.showMainDownload = false
      this.showFilterDownload = true
      this.showDate = false
      this.showAccType = false
      this.showAccNo = true
      this.showStatus = false
      this.showBranch = false
      this.showUser = false
      this.showEmail = false
      this.showProvince = false;
      this.showProvinceAndDistrict = false;
    }
    else if (this.filterType == 'MY_MONEY_ACC_TYPE') {
      this.heading = 'MM Account Type Registrations';
      this.showDownload = false;
      this.showMainDownload = false
      this.showFilterDownload = true
      this.showDate = false
      this.showAccType = true
      this.showAccNo = false
      this.showStatus = false
      this.showBranch = false
      this.showUser = false
      this.showEmail = false
      this.kycType = 'AGENT';
      this.showProvince = false;
      this.showProvinceAndDistrict = false;
    }
    else if (this.filterType == 'STATUS') {
      this.heading = 'MM Account Registration Status';
      this.showDownload = false;
      this.showMainDownload = false
      this.showFilterDownload = true
      this.showDate = false
      this.showAccType = false
      this.showAccNo = false
      this.showStatus = true
      this.showBranch = false
      this.showUser = false
      this.showEmail = false
      this.showProvince = false;
      this.showProvinceAndDistrict = false;
    }
    else if (this.filterType == 'BRANCH_SHOPS') {
      this.heading = 'Branch Shop Registrations';
      this.showDownload = false;
      this.showMainDownload = false
      this.showFilterDownload = true
      this.showDate = false
      this.showAccType = false
      this.showAccNo = false
      this.showStatus = false
      this.showBranch = true
      this.showUser = false
      this.showEmail = false
      this.showProvince = false;
      this.showProvinceAndDistrict = false;
      this.getallBranch();

    }
    else if (this.filterType == 'AGENTS') {
      this.heading = 'Agent Registrations';
      this.showDownload = false;
      this.showMainDownload = false
      this.showFilterDownload = true
      this.showDate = false
      this.showAccType = false
      this.showAccNo = false
      this.showStatus = false
      this.showBranch = false
      this.showUser = true
      this.showEmail = false
      this.showProvince = false;
      this.showProvinceAndDistrict = false;
      this.getallUsers();

    }
    else if (this.filterType == 'EMAIL') {
      this.heading = 'Email Registrations';
      this.showDownload = false;
      this.showMainDownload = false
      this.showFilterDownload = true
      this.showDate = false
      this.showAccType = false
      this.showAccNo = false
      this.showStatus = false
      this.showBranch = false
      this.showUser = false
      this.showEmail = true
      this.showProvince = false;
      this.showProvinceAndDistrict = false;
    }
    else if (this.filterType == 'PROVINCE') {
      this.heading = 'Province wise KYC Details';
      this.showDownload = false;
      // this.showMainDownload = false
      // this.showFilterDownload = true
      this.showDate = false
      this.showAccType = false
      this.showAccNo = false
      this.showStatus = false
      this.showBranch = false
      this.showUser = false
      this.showEmail = false
      this.showProvince = true;
      this.showProvinceAndDistrict = false;
      this.getProvinces();
    }
    else if (this.filterType == 'DISTRICT') {
      this.heading = 'District wise KYC Details';
      this.showDownload = false;
      // this.showMainDownload = false
      // this.showFilterDownload = true
      this.showDate = false
      this.showAccType = false
      this.showAccNo = false
      this.showStatus = false
      this.showBranch = false
      this.showUser = false
      this.showEmail = false
      this.showProvince = false;
      this.showProvinceAndDistrict = true;
      this.getProvinces();
    }
  }
  getProvinces() {
    this.corporate.getprovinces().subscribe({
      next: (data: any) => {
        this.provinces = data?.data;
        console.log("provinces", this.provinces)
      }
    });
  }
  onDateSubmit() {
    // this.startDate = this.from.value + " 00:00:00";
    // this.endDate = this.to.value + " 23:59:59";
    //new
    this.isLoading = true
    this.showNextButtonSearch = false;
    this.showPrevButtonsearch = false

    this.showPaginationButtons = false

    this.showNextButtonCustomer = false
    this.showPrevButtonCustomer = false

    this.showPrevButtonAgent = false
    this.showNextButtonAgent = false

    this.showPrevButtonDate = true
    this.showNextButtonDate = true
    this.showPrevButtonStatus = false
    this.showNextButtonStatus = false
    this.showPrevButtonAcctype = false
    this.showNextButtonAcctype = false

    this.showPrevButtonProvince = false
    this.showNextButtonProvince = false
    this.showPrevButtonDistrict = false
    this.showNextButtonDistrict = false

    this.selectedSearchBy = false
    this.selectedKycType = false;
    this.selectedCustomer = false;
    this.selectedAgent = false;
    this.selectedDate = true;
    this.selectedStatus = false
    this.selectedAcctype = false
    this.selectedProvince = false
    this.selectedDistrict = false;

    let fromDate = new Date(this.from.value);
    this.formattedFromDate = this.formatDate(fromDate) + " 00:00:00";
    let toDate = new Date(this.to.value);
    this.formattedToDate = this.formatDate(toDate) + " 23:59:59";
    console.log(this.typeTarget, '_+_+_+_');

    let req = {
      "filterType": "DATE",
      "filterValues": [
        this.formattedFromDate,
        this.formattedToDate
      ],
      "page": this.currentPageDate,
      "kycType": this.typeTarget == 'null' ? null : this.typeTarget,
      "sort": this.sortAscending ? 'ASC' : 'DESC'
    }

    this.downloadExcelPayload = req
    console.log(req);

    this.isLoading = true;

    this.KycService.getDataFilter(req).subscribe((data: any) => {
      this.isLoading = false
      this.allDateData = data?.data
      this.data = this.allDateData
      this.isLoading = false;
      this.showDownload = true;


    })
    // if (!this.typeTarget || this.typeTarget == 'ALL') {
    // }
    // else {
    //   let req = {
    //     "filterType": this.filterType,
    //     "filterValues": [
    //       this.formattedFromDate,
    //       this.formattedToDate
    //     ],
    //     "page": 0,
    //     "kycType": this.typeTarget
    //   }
    //   this.isLoading = true;

    //   this.KycService.getDataFilter(req).subscribe((data: any) => {
    //     this.isLoading = false
    //     this.DateData = data?.data
    //     this.data = this.DateData
    //     if (this.data.length > 0)
    //       this.showDownload = true;
    //     this.isLoading = false;
    //   })
    // }
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  sortOrder: any
  onSelectSort(event: any) {
    console.log(event.target.value);

    this.sortOrder = event.target.value
  }

  // Helper function to pad single digits with zero
  private padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
  onKeydownAccountSearch(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onClickSearchAccNO(); // Trigger search on Enter key
    }
  }
  onClickSearchAccNO() {
    if (!this.kycType || this.kycType == "ALL") {
      alert("Please select a specific kycType")

    } else {
      let req = {
        filterType: this.filterType,
        filterValues: [
          this.accountNO.value
        ],
        page: 0,
        kycType: this.kycType,
        sort: this.sortAscending ? 'ASC' : 'DESC'
      };
      this.isLoading = true;

      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.AccNoData = data?.data
        this.data = this.AccNoData
        if (this.data.length > 0) {
          this.showDownload = true;
          this.downloadExcelPayload = req;
          this.isLoading = false;
        }


      });
    }
  }
  onClickSearchEmail() {
    if (!this.kycType || this.kycType == "ALL") {
      let req = {
        filterType: this.filterType,
        filterValues: [
          this.searchTexEmail.value
        ],
        page: 0,
        // kycType: null
      };
      this.isLoading = true;

      this.KycService.getDataFilter(req).subscribe((data: any) => {
        console.log(data);
        this.allEmailData = data?.data
        this.data = this.allEmailData
        this.isLoading = false;

      });
    } else {
      let req = {
        filterType: this.filterType,
        filterValues: [
          this.searchTexEmail.value
        ],
        page: 0,
        // kycType: this.typeTarget
      };
      this.isLoading = true;

      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.EmailData = data?.data
        this.data = this.EmailData
        this.isLoading = false;

      });
    }
  }
  onchangeAccType($event: any) {
    //new 
    this.showNextButtonSearch = false;
    this.showPrevButtonsearch = false

    this.showPaginationButtons = false

    this.showNextButtonCustomer = false
    this.showPrevButtonCustomer = false

    this.showPrevButtonAgent = false
    this.showNextButtonAgent = false

    this.showPrevButtonDate = false
    this.showNextButtonDate = false

    this.showPrevButtonStatus = false
    this.showNextButtonStatus = false

    this.showPrevButtonAcctype = true
    this.showNextButtonAcctype = true

    this.showPrevButtonProvince = false
    this.showNextButtonProvince = false
    this.showPrevButtonDistrict = false
    this.showNextButtonDistrict = false

    this.selectedSearchBy = false
    this.selectedKycType = false;
    this.selectedCustomer = false;
    this.selectedAgent = false;
    this.selectedDate = false;
    this.selectedStatus = false
    this.selectedAcctype = true
    this.selectedProvince = false
    this.selectedDistrict = false;

    this.accTypeTarget = $event.target.value
    console.log("this.accTypeTarget new", this.accTypeTarget)

    let req = {
      "filterType": this.filterType,
      "filterValues": [
        this.accountType.value
      ],
      "page": this.currentPageAcctype,
      "kycType": this.kycType,
      "sort": this.sortAscending ? 'ASC' : 'DESC'
    }
    this.isLoading = true;

    this.KycService.getDataFilter(req).subscribe((data: any) => {
      this.allAccTypeData = data?.data
      this.data = this.allAccTypeData
      if (this.data.length > 0) {
        this.showDownload = true;
        this.downloadExcelPayload = req;
        this.downloadExcelPayload.page = 0;
      }
      this.isLoading = false;
    })


  }
  onchangeStatus($event: any) {
    //new 
    this.showNextButtonSearch = false;
    this.showPrevButtonsearch = false

    this.showPaginationButtons = false

    this.showNextButtonCustomer = false
    this.showPrevButtonCustomer = false

    this.showPrevButtonAgent = false
    this.showNextButtonAgent = false

    this.showPrevButtonDate = false
    this.showNextButtonDate = false

    this.showPrevButtonStatus = true
    this.showNextButtonStatus = true
    this.showPrevButtonAcctype = false
    this.showNextButtonAcctype = false

    this.showPrevButtonProvince = false
    this.showNextButtonProvince = false
    this.showPrevButtonDistrict = false
    this.showNextButtonDistrict = false

    this.selectedSearchBy = false
    this.selectedKycType = false;
    this.selectedCustomer = false;
    this.selectedAgent = false;
    this.selectedDate = false;
    this.selectedStatus = true
    this.selectedAcctype = false
    this.selectedProvince = false
    this.selectedDistrict = false;

    this.statusTarget = $event.target.value
    if (!this.kycType || this.kycType == "ALL") {
      let req = {
        "filterType": this.filterType,
        "filterValues": [
          this.status.value
        ],
        "page": this.currentPageStatus,
        "kycType": null,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;

      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.AllStatusData = data?.data
        this.data = this.AllStatusData

        this.isLoading = false;

      })
    }
    else {
      let req = {
        "filterType": this.filterType,
        "filterValues": [
          this.status.value
        ],
        "page": this.currentPageStatus,
        "kycType": this.kycType,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;

      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.StatusData = data?.data
        this.data = this.StatusData
        if (this.data.length > 0) {
          this.showDownload = true;

          this.downloadExcelPayload = req;
          this.downloadExcelPayload.page = 0
        }
        this.isLoading = false;

      })
    }
  }
  onSelectProvince($event: any) {
    this.district.reset();
    this.currentPageDistrict = 0;
    this.showNextButtonDistrict = false
    this.showPrevButtonDistrict = false
    this.provinceId = $event.target.value;
    // const filteredProvinces = this.provinces.filter((province: any) => province.id === this.provinceId);
    // if (filteredProvinces && filteredProvinces.length > 0) {
    //   this.selectedProvinceId = filteredProvinces[0].id;
    // }
    this.getDistricts(this.provinceId);
    console.log("this.selectedProvinceId", this.selectedProvinceId)
  }
  getDistricts(provinceId: number) {
    this.corporate.getdistricts(provinceId).subscribe({
      next: (data: any) => {
        this.districts = data?.data;
      }
    });
  }
  onSelectDistrict($event: any) {
    this.showNextButtonSearch = false;
    this.showPrevButtonsearch = false

    this.showPaginationButtons = false

    this.showNextButtonCustomer = false
    this.showPrevButtonCustomer = false

    this.showPrevButtonAgent = false
    this.showNextButtonAgent = false

    this.showPrevButtonDate = false
    this.showNextButtonDate = false

    this.showPrevButtonStatus = false
    this.showNextButtonStatus = false
    this.showPrevButtonAcctype = false
    this.showNextButtonAcctype = false

    this.showPrevButtonProvince = false
    this.showNextButtonProvince = false
    this.showPrevButtonDistrict = true
    this.showNextButtonDistrict = true

    this.selectedSearchBy = false
    this.selectedKycType = false;
    this.selectedCustomer = false;
    this.selectedAgent = false;
    this.selectedDate = false;
    this.selectedStatus = false
    this.selectedAcctype = false
    this.selectedProvince = false
    this.selectedDistrict = true;

    this.districtTarget = $event.target.value
    if (!this.typeTarget) {
      alert("Please select a KYC type")
    }
    let req = {
      "filterType": this.filterTarget,
      "filterValues": [
        this.districtTarget
      ],
      "page": this.currentPageDistrict,
      "kycType": this.typeTarget,
      // "sort": this.sortAscending ? 'ASC' : 'DESC'
    }
    this.isLoading = true;
    this.downloadExcelPayload = req;
    this.downloadExcelPayload.page = 0
    this.KycService.getDataFilter(req).subscribe((data: any) => {
      this.DistrictData = data?.data
      this.data = this.DistrictData
      if (this.data.length > 0)
        this.showDownload = true;
      this.isLoading = false;

    })
  }
  onchangeProvince($event: any) {
    this.showNextButtonSearch = false;
    this.showPrevButtonsearch = false

    this.showPaginationButtons = false

    this.showNextButtonCustomer = false
    this.showPrevButtonCustomer = false

    this.showPrevButtonAgent = false
    this.showNextButtonAgent = false

    this.showPrevButtonDate = false
    this.showNextButtonDate = false

    this.showPrevButtonStatus = false
    this.showNextButtonStatus = false
    this.showPrevButtonAcctype = false
    this.showNextButtonAcctype = false

    this.showPrevButtonProvince = true
    this.showNextButtonProvince = true
    this.showPrevButtonDistrict = false
    this.showNextButtonDistrict = false

    this.selectedSearchBy = false
    this.selectedKycType = false;
    this.selectedCustomer = false;
    this.selectedAgent = false;
    this.selectedDate = false;
    this.selectedStatus = false
    this.selectedAcctype = false
    this.selectedProvince = true
    this.selectedDistrict = false;

    this.provinceTarget = $event.target.value
    if (!this.typeTarget) {
      alert("Please select a KYC type")
    }
    let req = {
      "filterType": this.filterTarget,
      "filterValues": [
        this.provinceTarget
      ],
      "page": this.currentPageProvince,
      "kycType": this.typeTarget,
      "sort": this.sortAscending ? 'ASC' : 'DESC'
    }
    this.isLoading = true;
    this.downloadExcelPayload = req;
    this.downloadExcelPayload.page = 0
    this.KycService.getDataFilter(req).subscribe((data: any) => {
      this.provinceData = data?.data
      this.data = this.provinceData
      if (this.data.length > 0)
        this.showDownload = true;
      this.isLoading = false;

    })
  }
  onchangeBranch($event: any) {
    this.branchTarget = $event.target.value
    if (!this.typeTarget || this.typeTarget == "ALL") {
      let req = {
        "filterType": this.filterTarget,
        "filterValues": [
          this.branchTarget
        ],
        "page": 0,
        "kycType": null,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;

      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allBranchData = data?.data
        this.data = this.allBranchData
        if (this.data.length > 0)
          this.showDownload = true;
        this.isLoading = false;

      })
    }
    else {
      let req = {
        "filterType": this.filterTarget,
        "filterValues": [
          this.branchTarget
        ],
        "page": 0,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;

      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.BranchData = data?.data
        this.data = this.BranchData
        if (this.data.length > 0)
          this.showDownload = true;
        this.isLoading = false;

      })
    }
  }
  onchangeUser($event: any) {
    this.userTarget = $event.target.value
    if (!this.typeTarget || this.typeTarget == "ALL") {
      let req = {
        "filterType": this.filterTarget,
        "filterValues": [
          this.userTarget
        ],
        "page": this.currentPage,
        "kycType": null,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;

      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.allUserData = data?.data
        this.data = this.allUserData
        this.isLoading = false;
      })
    }
    else {
      let req = {
        "filterType": this.filterTarget,
        "filterValues": [
          this.userTarget
        ],
        "page": this.currentPage,
        "kycType": this.typeTarget,
        "sort": this.sortAscending ? 'ASC' : 'DESC'
      }
      this.isLoading = true;

      this.KycService.getDataFilter(req).subscribe((data: any) => {
        this.UserData = data?.data
        this.data = this.UserData
        this.isLoading = false;

      })
    }
  }
  private generateRequest(filterType: any, filterValues: any[], kycType: any): any {
    return {
      filterType: this.filterTarget,
      filterValues: filterValues,
      page: 0,
      kycType: this.typeTarget
    };
  }
  onClickDownloadReport(filename?: string) {
    /*  if (!this.typeTarget) {
       alert("Please select a specific KYC type");
       return;
     } */
    let req;
    let fileName = '';

    if (!this.filterType || this.filterType == undefined || !this.downloadExcelPayload.filterType) {
      console.log("Filter type", this.filterType);
      if (this.kycType != 'SUPER_AGENT')
        fileName = `${this.kycType.toLowerCase()}.xlsx`;
      else
        fileName = `Master Agent.xlsx`;


    }


    else if (this.filterType === 'DATE') {
      const filterValues = [this.formattedFromDate, this.formattedToDate];
      const kycType = !this.typeTarget || this.typeTarget === 'ALL' ? null : this.typeTarget;
      //req = this.generateRequest('DATE', filterValues, kycType);
      fileName = `KYC_${this.kycType.toLowerCase()}_DATE.xlsx`;
      console.log(fileName);
    } else if (this.filterType === 'MM_ACCOUNT_NO') {
      const filterValues = [this.accountNO.value];
      const kycType = !this.typeTarget || this.typeTarget === 'ALL' ? null : this.typeTarget;
      //req = this.generateRequest('MM_ACCOUNT_NO', filterValues, kycType );
      fileName = `${this.kycType.toLowerCase()}_MM ACCOUNT NO_${filterValues}.xlsx`;

    } else if (this.filterType === 'MY_MONEY_ACC_TYPE') {
      const filterValues = [this.accTypeTarget];
      this.kycType = 'AGENT';
      //const kycType = !this.typeTarget || this.typeTarget === 'ALL' ? null : this.typeTarget;
      //req = this.generateRequest('MY_MONEY_ACC_TYPE', filterValues, kycType);
      fileName = `${this.kycType.toLowerCase()}_${filterValues}.xlsx`;

    } else if (this.filterType === 'STATUS') {
      const filterValues = [this.statusTarget];
      //const kycType = !this.typeTarget || this.typeTarget === 'ALL' ? null : this.typeTarget;
      // req = this.generateRequest('STATUS', filterValues, kycType);
      fileName = `${this.kycType.toLowerCase()}_${filterValues}.xlsx`;
    } else if (this.filterTarget === 'BRANCH_SHOPS') {
      const filterValues = [this.branchTarget];
      const kycType = !this.typeTarget || this.typeTarget === 'ALL' ? null : this.typeTarget;
      req = this.generateRequest('BRANCH_SHOPS', filterValues, kycType);
    } else if (this.filterTarget === 'AGENTS') {
      const filterValues = [this.userTarget];
      const kycType = !this.typeTarget || this.typeTarget === 'ALL' ? null : this.typeTarget;
      req = this.generateRequest('AGENTS', filterValues, kycType);
    }
    else if (this.filterTarget === 'PROVINCE') {
      const filterValues = [this.provinceTarget];
      const kycType = !this.typeTarget || this.typeTarget === 'ALL' ? null : this.typeTarget;
      // req = this.generateRequest('PROVINCE', filterValues, kycType);
      fileName = `${kycType.toLowerCase()}_${filterValues}.xlsx`;
    }
    else if (this.filterTarget === 'DISTRICT') {
      const filterValues = [this.districtTarget];
      const kycType = !this.typeTarget || this.typeTarget === 'ALL' ? null : this.typeTarget;
      // req = this.generateRequest('PROVINCE', filterValues, kycType);
      fileName = `${kycType.toLowerCase()}_${filterValues}.xlsx`;
    }
    else {
      // Handle cases where filterTarget does not match any expected values()
      //req = this.generateRequest(null, [null], null);
    }

    // Make the API call here
    this.isLoading = true; // Set loading state to true when starting API call

    this.KycService.downloadKycReport(this.downloadExcelPayload).subscribe({
      next: (data) => {
        console.log(fileName);
        this.isLoading = false; // Set loading state to true when starting API call

        saveAs(data, fileName);
        console.log(data);
      }, error: () => {
        this.isLoading = false
      }
    })
  }

  // onClickUpdate(item: any) {
  //   this.selectedCustomer = item;
  //   this.isEnableRoute = true;
  // }
  onClickUpdate(item: any) {
    this.isLoading = true;
    this.selectedCustomer = item;
    this.KycService.setItem(item);
    console.log("Selected Item - KYC Type:", item.kycType);

    this.service.masteragentDataServiceDataCall(item)
    this.KycService.lockKYCforMultipleAccess(item?.id).subscribe(response => {
      if (response.responseCode == 200) {

        if (item.kycType === 'CUSTOMER') {
          this.isEnableRoute = true; // For <app-customer-edit>
          this.isMerchantRoute = false; // Ensure <app-merchant-edit> is hidden
        } else if (item.kycType === 'MERCHANT') {
          this.isEnableRoute = false; // Ensure <app-customer-edit> is hidden
          // this.isMerchantRoute = true; // For <app-merchant-edit>
          this.router.navigateByUrl("corporate/merchant-edit")
        }
        else if (item.kycType === 'AGENT') {
          this.isEnableRoute = false;
          this.router.navigateByUrl("corporate/agent-edit")
        }
        else if (item.kycType === 'MASTER AGENT') {
          this.isEnableRoute = false;
          this.router.navigateByUrl("corporate/create-master-agent")
        }
        else if (item.kycType === 'CORPORATE') {
          this.router.navigateByUrl("corporate/corporate-registartion")
        }
        this.isLoading = false;
      }
      else {
        alert(response?.error);
        this.isLoading = false;
      }
    })

  }
  onClickUpdateNoKyc(item: any, source: any) {
    // this.isLoading = true;

    this.selectedCustomer = item;
    this.KycService.setIncompleteItem(item);
    console.log("item", item)
    if (item?.submittedFor?.userType === 'CUSTOMER') {
      this.KycService.oTPforIncompleteCustomerKYC(item.submittedFor.id).subscribe(
        (response) => {
          console.log('OTP sent successfully', response);
        },
        (error) => {
          console.error('Error sending OTP', error);
        }
      );
      this.showOTP = true;

      /*   this.router.navigate(["userManagement/customer-kyc"], {
          queryParams: { isNewRegistration: false }
        }); */
    }
    else if (item?.submittedFor?.userType === 'MERCHANT') {
      this.isEnableRoute = false; // Ensure <app-customer-edit> is hidden
      // this.router.navigateByUrl("corporate/create-merchant-onboarding")
      this.router.navigate(["corporate/create-merchant-onboarding"], {
        queryParams: { source: source }
      });
    }
    else if (item?.submittedFor?.userType === 'AGENT') {
      this.isEnableRoute = false;
      // this.router.navigateByUrl("corporate/create-direct-agent");
      this.router.navigate(["corporate/create-direct-agent"], {
        queryParams: { source: source }
      });
    }
    else if (item?.submittedFor?.userType === 'MASTER AGENT') {
      this.isEnableRoute = false;
      this.service.masteragentDataServiceDataCall(item);
      this.router.navigateByUrl("corporate/create-master-agent");
    }
    else if (item?.submittedFor?.userType === 'CORPORATE') {
      this.service.corporateDataServiceDataCall(item);
      this.router.navigateByUrl("corporate/corporate-registartion");
    }
  }


  onClickViewCustomer(item: any) {
    this.kycId = item?.id
    this.router.navigate(['kyc/view-customer-kyc', this.kycId]);
  }
}
