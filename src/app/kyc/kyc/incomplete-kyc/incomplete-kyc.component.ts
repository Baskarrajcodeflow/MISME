import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KycModuleService } from '../kyc-module.service';
import { Router } from '@angular/router';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { NgFooterTemplateDirective } from '@ng-select/ng-select';
import { GenericPaginationComponent } from '../../../generic-services/generic-pagination/generic-pagination.component';
import { DataSharingService } from '../../../product/dataSharing/data-sharing.service';
import { SessionService } from '../../../session.service';
import { OtpModalComponent } from '../../../ui/otp-Modal/otp-modal/otp-modal.component';

@Component({
  selector: 'app-incomplete-kyc',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule, ReactiveFormsModule, CommonModule, GenericPaginationComponent, OtpModalComponent],
  templateUrl: './incomplete-kyc.component.html',
  styleUrl: './incomplete-kyc.component.css'
})
export class IncompleteKycComponent {
  @ViewChild('selectedDrop') selectedDrop!: ElementRef;
  @ViewChild('selectedText') selectedText!: ElementRef;
  @ViewChild('commonSearchDropdown') commonSearchDropdown!: ElementRef<HTMLSelectElement>;
  searchForm: FormGroup = new FormGroup({});
  // searchText: FormControl = new FormControl('');
  // SearchBy: FormControl = new FormControl('');
  selectedFilterType = new FormControl();
  kycId: any[] = [];
  userPrivileges: any;
  kycPrivelege: any;
  isLoading: boolean = false;
  currentPage: number = 0;
  searchValue: string = '';
  data: any[] = [];
  allData: any[] = [];
  countryTraget: any;
  countryTarget: any;
  countryCodes = {
    'USA': '+1',
    'Afghanistan': '+93',
    'India': '+91',
    // Add more country codes as needed
  };
  dataResponse: any[] = [];
  noResults: boolean = false;
  searchResult: any;
  currentPageSearch: number = 0;
  selectedSearchBy: boolean = false;
  selectedKycType: boolean = true;

  showNextButtonSearch: boolean = false;
  showPrevButtonsearch: boolean = false;
  showPaginationButtons: boolean = true;
  isEnableRoute: boolean = false;
  selectedCustomer: any;
  searchTarget: string = '';
  typeTarget: any;
  kycType: string = '';
  showOTP: boolean = false;
  otpForm: FormGroup = new FormGroup({});
  otpSent :boolean = false;
  constructor(private router: Router, private KycService: KycModuleService,
    private fb: FormBuilder, private service: DataSharingService,    private sessionService: SessionService,
    
  ) { }
  ngOnInit() {
    this.searchForm = this.fb.group({
      searchText: [''],// FormControl for the search input,
      SearchBy: ['']
    });
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrivileges = this.userPrivileges[0];
      console.log(this.userPrivileges[0], "this.userPrevilages");
      console.log(this.userPrivileges, "this.userPrevilages1");

      for (let item of this.userPrivileges?.uiComponentPrivileges) {
        if (item?.component?.componentName == 'KYC') {
          if (item.subComponent?.subComponentName == 'Incomplete KYC')
            this.kycPrivelege = item;
        }
      }
    }
    this.getAllIncompleteKyc();
  }
  onNextPage() {
    this.currentPage++;
    this.getAllIncompleteKyc();
  }
  onPreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;  // Decrease the currentPage by 1
      this.getAllIncompleteKyc();    // Fetch the data for the previous page
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
  onChangeSearchBy($event: any): void {
    this.searchTarget = $event.target.value;
    console.log("searchTarget", this.searchTarget);
    if (this.searchTarget === 'PHONE') {
      this.kycType = 'ALL';  // ✅ Set to ALL when PHONE is selected
    } else {
      this.kycType = '';     // ✅ Reset when something else is selected
    }
    this.getAllIncompleteKyc();
  }

  onChangeKyctype($event: any) {
    this.typeTarget = $event.target.value
  }
  getAllIncompleteKyc() {
    this.isLoading = true; // Set loading state to true when starting API call
    let req ={
      "page": this.currentPage,
    }
    this.KycService.getAllIncompleteKyc(req).subscribe(
      (data: any) => {
        this.data = data?.data;
        this.allData = [...this.data]
        this.dataResponse = this.data
        //new
        const selectedItem = this.allData.find(item => this.kycId === item?.id);
        if (selectedItem) {
          const country = selectedItem.kycInputs?.currCountry;
          const countryCode = this.countryCodes[country as keyof typeof this.countryCodes] || '';
          const phoneNumber = selectedItem.submittedFor?.phone;
          this.countryTarget = `${countryCode} ${phoneNumber}`;
        } else {
          this.countryTarget = '';
        }
      },
      (error) => {
        console.error("Error fetching KYC data", error);
      },
      () => {
        this.isLoading = false;
      }
    );
  }
   
    onOtpSubmit(otp: any) {
    console.log('OTP:', otp);
   this.sessionService.setOTP(otp);
   this.showOTP = false;
   this.router.navigate(["userManagement/customer-kyc"], {
        queryParams: { isNewRegistration: false }
      }); 

}
 
  
  onClickSearch() {
    console.log("searchTarget2", this.searchForm.get('searchText')?.value)
    if (this.searchTarget == "PHONE") {
      let req = {
        "filterType": this.searchTarget,
        "filterValues": [
          this.searchForm.get('searchText')?.value
        ],
        "page":
          0,
      }
      this.KycService.getResultByFilterIncompleteKYC(req).subscribe((data: any) => {
        this.searchResult = data?.data;
        this.data = this.searchResult;
        this.updatePaginationButtons();
        // this.resetSelectionFlags();
      })
    }
    else if (this.searchTarget == "ID_PROOF") {
      if (this.typeTarget=="") {
        alert("Please select any KYC Type")
      }
      else {
        let req = {
          "filterType": this.searchTarget,
          "filterValues": [
            this.searchForm.get('searchText')?.value
          ],
          "page":
            0,
          "kycType": this.typeTarget
        }
        this.KycService.getResultByFilterIncompleteKYC(req).subscribe((data: any) => {
          this.searchResult = data?.data;
          this.data = this.searchResult;
          this.updatePaginationButtons();
          // this.resetSelectionFlags();
        })
      }
    }
     else if (this.searchTarget == "EMAIL") {
        let req = {
          "filterType": this.searchTarget,
          "filterValues": [
            this.searchForm.get('searchText')?.value
          ],
          "page":
            0,
          "kycType": this.typeTarget
        }
        this.KycService.getResultByFilterIncompleteKYC(req).subscribe((data: any) => {
          this.searchResult = data?.data;
          this.data = this.searchResult;
          this.updatePaginationButtons();
          // this.resetSelectionFlags();
        })
    }
  }
  // resetSelectionFlags(): void {
  //   this.selectedDrop = true;
  //   this.selectedText = false;
  // }
  updatePaginationButtons() {
    console.log("this.searchResult.length", this.searchResult.length)
    if (this.searchResult && this.searchResult.length == 10) {
      this.showNextButtonSearch = true;
      this.showPrevButtonsearch = true
      this.showPaginationButtons = false

    }
    else if (this.searchResult.length < 10) {
      this.showNextButtonSearch = false;
    }
    else {
      this.showPaginationButtons = false

    }
  }
  onClickUpdate(item: any, source: any) {
    // this.isLoading = true;
    
    this.selectedCustomer = item;
    this.KycService.setIncompleteItem(item);
    console.log("item", item)
    if (item.kycType === 'CUSTOMER') {
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
    else if (item.kycType === 'MERCHANT') {
      this.isEnableRoute = false; // Ensure <app-customer-edit> is hidden
      // this.router.navigateByUrl("corporate/create-merchant-onboarding")
      this.router.navigate(["corporate/create-merchant-onboarding"], {
        queryParams: { source: source }
      });
    }
    else if (item.kycType === 'AGENT') {
      this.isEnableRoute = false;
      // this.router.navigateByUrl("corporate/create-direct-agent");
      this.router.navigate(["corporate/create-direct-agent"], {
        queryParams: { source: source }
      });
    }
    else if (item.kycType === 'MASTER AGENT') {
      this.isEnableRoute = false;
      this.service.masteragentDataServiceDataCall(item);
      this.router.navigateByUrl("corporate/create-master-agent");
    }
    else if (item.kycType === 'CORPORATE' || item.kycType === 'GOVT_AGENCY' || item.kycType === 'UN_AGENCY' || item.kycType === 'NGO') {
      this.service.corporateDataServiceDataCall(item);
      this.router.navigateByUrl("corporate/corporate-registartion");
    }
  }
}

