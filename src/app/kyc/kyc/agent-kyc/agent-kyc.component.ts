import { CommonModule, NgClass, NgFor, NgIf } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { KycModuleService } from "../kyc-module.service";
import { FocusMonitor } from "@angular/cdk/a11y";
import { CustomerViewComponent } from "../../../user-management/user-management/user-management/bo/customer/customer-view/customer-view.component";
import { CustomerEditComponent } from "../../../user-management/user-management/user-management/bo/customer/customer-edit/customer-edit.component";
@Component({
  selector: "app-agent-kyc",
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, FormsModule, NgIf, CommonModule, NgClass, CustomerViewComponent, CustomerEditComponent],
  templateUrl: "./agent-kyc.component.html",
  styleUrl: "./agent-kyc.component.css",
})
export class AgentKycComponent implements OnInit {
  @ViewChild('commonSearchDropdown') commonSearchDropdown!: ElementRef<HTMLSelectElement>;
  // data = [
  //   { name: 'John Doe', seq: '001', date: '2024-07-01', status: 'Pending', kycType: 'Individual' },
  //   { name: 'Jane Smith', seq: '002', date: '2024-07-02', status: 'Approved', kycType: 'Business' },
  //   // Add more sample data as needed
  // ];
  searchForm: FormGroup = new FormGroup({});
  searchText: FormControl = new FormControl('');
  selectedFilterType = new FormControl();
  // searchText = new FormControl();

  kycId: any[] = [];
  userPrivileges: any;
  kycPrivelege: any;
  isLoading: boolean = false;
  currentPage: number = 0;
  searchTarget: any;
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
  constructor(private router: Router, private KycService: KycModuleService,
    private fb: FormBuilder
  ) { }
  ngOnInit() {
    this.searchForm = this.fb.group({
      searchText: [''] // FormControl for the search input
    });
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrivileges = this.userPrivileges[0];
      console.log(this.userPrivileges[0], "this.userPrevilages");
      console.log(this.userPrivileges, "this.userPrevilages1");

      for (let item of this.userPrivileges?.uiComponentPrivileges) {
        if (item?.component?.componentName == 'KYC') {
          if (item.subComponent?.subComponentName == 'Pending KYC')
            this.kycPrivelege = item;
        }
      }
    }
    this.getAllKyc();
  }
  onNextPage() {
    this.currentPage++;
    this.getAllKyc();
  }
  onPreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;  // Decrease the currentPage by 1
      this.getAllKyc();    // Fetch the data for the previous page
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
  getAllKyc() {
    // this.KycService.getAllKyc().subscribe((data: any) => {
    //   this.data = data?.data;
    //   console.log("Fetched products:", data);
    // });
    this.isLoading = true; // Set loading state to true when starting API call
    this.KycService.getAllPendingKyc(this.currentPage).subscribe(
      (data: any) => {
        this.data = data?.data;
        this.allData = [...this.data]
        this.dataResponse = this.data
        //console.log("Fetched products:", data);
        // for (let item of this.allData) {
        //   if (this.kycId == item?.id) {
        //     this.countryTarget = item?.kycInputs?.currCountry
        //   }
        // }
        //new
        const selectedItem = this.allData.find(item => this.kycId === item?.id);
        if (selectedItem) {
          const country = selectedItem.kycInputs?.currCountry;
          const countryCode = this.countryCodes[country as keyof typeof this.countryCodes] || '';
          const phoneNumber = selectedItem.submittedFor?.phone;
          this.countryTarget = `${countryCode} ${phoneNumber}`;
        } else {
          this.countryTarget = ''; // Handle case where no item is found
        }
      },
      (error) => {
        console.error("Error fetching KYC data", error);
      },
      () => {
        this.isLoading = false; // Set loading state to false when API call completes
      }
    );
  }
  onChangeSearchBy($event: any) {
    this.searchTarget = $event.target.value;
    this.searchText.reset();
    this.getAllKyc();
  }
  // onClickSearch() {
  //   this.searchValue = this.searchText?.value?.trim() || ""; // Ensure searchValue is trimmed and not null
  //   console.log("Search Target:", this.searchTarget);
  //   console.log("Search Value:", this.searchValue);
  //   // Handle "ALL" option
  //   if (this.searchTarget === "ALL") {
  //     this.data = [...this.allData]; // Display all data
  //     console.log("All data displayed:", this.data);
  //     this.noResults = false; // Reset 'No Results' flag
  //     return;
  //   }

  //   if (!this.searchValue) {
  //     console.log("Empty search value");
  //     this.data = [...this.allData]; // Reset to original data if no search value
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
  //       this.data = this.allData.filter(item => {
  //         const phoneWithCountryCode = `+93${item?.submittedFor?.phone?.slice(-9)}`;
  //         return phoneWithCountryCode === this.searchValue;
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
  //       break;
  //   }

  //   // Log the results for debugging
  //   if (this.data.length === 0) {
  //     console.log("No results found");
  //     this.noResults = true;
  //   } else {
  //     this.noResults = false;
  //   } console.log("Filtered Data:", this.data);
  //   // this.searchText.reset(); // Reset the input field
  // }
  onResetSearch() {
    this.commonSearchDropdown.nativeElement.selectedIndex = 0;
    this.searchText.setValue(''); // Optionally reset the individual search text control
    this.getAllKyc();
  }
  onKeydownSearch(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onClickSearch(); // Trigger search on Enter key
    }
  }
  onClickSearch() {
    let req = {
      "filterType": this.searchTarget,
      "filterValues": [
        this.searchText.value
      ],
      "page": this.currentPageSearch
    }
    this.KycService.getResultByFilter(req).subscribe((data: any) => {
      this.searchResult = data?.data;
      this.data = this.searchResult;
      this.updatePaginationButtons();
      this.resetSelectionFlags();
      this.selectedSearchBy = true
      this.selectedKycType = false;
    })
  }
  resetSelectionFlags(): void {
    this.selectedSearchBy = true;
    this.selectedKycType = false;
    this.selectedCustomer = false;
  }
  updatePaginationButtons() {
    console.log("this.searchResult.length", this.searchResult.length)
    if (this.searchResult && this.searchResult.length == 10) {
      // Enable the Next/Previous buttons
      this.showNextButtonSearch = true;
      this.showPrevButtonsearch = true
      this.showPaginationButtons = false

    }
    else if (this.searchResult.length < 10) {
      this.showNextButtonSearch = false;
      // this.showPrevButtonsearch = false
    }
    else {
      // this.showNextButtonSearch = false;
      // this.showPrevButtonsearch = false
      this.showPaginationButtons = false

    }
  }
  onClickView(item: any) {
    this.isLoading = true;
    console.log("itemitem", item)
    this.kycId = item?.id;
    console.log("kycId", this.kycId)
    this.KycService.setItem(item);

    this.KycService.lockKYCforMultipleAccess(this.kycId).subscribe(response => {
      if (response.responseCode == 200) {

        if (item.kycType === "CUSTOMER") {
          this.router.navigate(['kyc/view-customer-kyc'], { queryParams: { from: this.router.url } });
          // this.router.navigate(["kyc/view-customer-kyc"], { queryParams: { data: JSON.stringify(item) } });
        }
        else if (item.kycType === "AGENT" || item.kycType === "MERCHANT") {
          this.router.navigate(['kyc/view-agent-kyc'], { queryParams: { from: this.router.url } });
          // this.router.navigate(["kyc/view-agent-kyc"], { queryParams: { data: JSON.stringify(item) } });
        }
        else if (item.kycType === "CORPORATE" ||item.kycType === "GOVT_AGENCY" || item.kycType === "UN_AGENCY" || item.kycType === "NGO") {
          this.router.navigate(['kyc/view-superagent-kyc'], { queryParams: { from: this.router.url } });
          // this.router.navigate(["kyc/view-superagent-kyc"], { queryParams: { data: JSON.stringify(item) } });
        }
        else if (item.kycType === "MASTER AGENT") {
          this.router.navigate(['kyc/view-masteragent-kyc'], { queryParams: { from: this.router.url } });
          // this.router.navigate(["kyc/view-masteragent-kyc"], { queryParams: { data: JSON.stringify(item) } });
        }      
       
        else {
          //this.isLoading = false;
          console.error("Unknown kycType:", item);
        }


      }


      else {
        this.isLoading = false;
        alert(response?.error);
      }
    })
  }
  // onClickView(item: any) {
  //   this.kycId = item?.id
  //   if (item?.kycType == 'customer') {
  //     this.router.navigate(['kyc/view-customer-kyc', this.kycId]);
  //   }
  //   else if (item?.kycType == 'agent') {
  //     this.router.navigate(['kyc/view-agent-kyc', this.kycId]);
  //   }
  // }
  // onClickUpdate(item:any){
  //   this.selectedCustomer = item;
  //   this.isEnableRoute = true;
  // }
  onClickUpdate(item: any) {
    this.isLoading = true; // Set loading state to true when starting API call
    this.selectedCustomer = item;
    this.KycService.setItem(item);

    this.KycService.lockKYCforMultipleAccess(this.kycId).subscribe(response => {
      if (response.responseCode == 200) {
        this.isLoading = false; // Set loading state to true when starting API call
        if (item.kycType === 'CUSTOMER') {
          this.isEnableRoute = true; // For <app-customer-edit>
          // this.isMerchantRoute = false; // Ensure <app-merchant-edit> is hidden
        }
        else if (item.kycType === 'MERCHANT') {
          this.isEnableRoute = false; // Ensure <app-customer-edit> is hidden
          // this.isMerchantRoute = true; // For <app-merchant-edit>
          this.router.navigateByUrl("corporate/merchant-edit")
        }
        else if (item.kycType === 'AGENT') {
          this.isEnableRoute = false;
          this.router.navigateByUrl("corporate/agent-edit")
        }
      }
      else {
        alert(response?.error);
      }
    })
  }
}