import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KycModuleService } from '../kyc-module.service';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../user-management/user-management/user-management/user.service';

@Component({
  selector: 'app-kyc-edit-requests',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule,
    NgFor, NgIf, NgClass, CommonModule, MatIconModule],
  templateUrl: './kyc-edit-requests.component.html',
  styleUrl: './kyc-edit-requests.component.css'
})
export class KycEditRequestsComponent {
  searchForm: FormGroup = new FormGroup({});
  searchText: FormControl = new FormControl('');
  userPrivileges: any;
  kycPrivelege: any;
  currentPage: number = 0;
  pageSize: number = 10;
  filterStatus: string = 'APPROVED';
  sortDirection: 'ASC' | 'DESC' = 'ASC';
  currentPageSearch: number = 0;
  isLoading: boolean = false;
  data: any;
  allData: any[] = [];
  id: any;
  loginUser!: string;
  profileDetails: any;
  kycId: any;
  isEmailPhoneView: boolean = false;
  showModal: boolean = false;
  selectedItem: any = null;
  checkerRemarks: string = '';
  pendingRequestId: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private KycService: KycModuleService,
    private userService: UserService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      searchText: ['']
    });

    this.KycService.getProfileDetails().subscribe((data: any) => {
      this.profileDetails = data?.data;
      this.loginUser = this.profileDetails?.firstName + ' ' + this.profileDetails?.lastName;
    });

    this.route.queryParamMap.subscribe(params => {
      this.isEmailPhoneView = params.get('type') === 'emailPhone';
      this.pendingRequestId = params.get('requestId');
      this.currentPage = 0;
      this.filterStatus = this.isEmailPhoneView ? 'PENDING' : 'APPROVED';
      this.sortDirection = 'ASC';
      this.loadPrivileges();
      this.getAllEditKycRequests();
    });
  }

  private loadPrivileges() {
    const targetSubComp = this.isEmailPhoneView ? 'Email/Phone Edit Requests' : 'KYC Edit Requests';
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrivileges = this.userPrivileges[0];
      for (let item of this.userPrivileges?.uiComponentPrivileges) {
        if (item?.component?.componentName == 'KYC') {
          if (item.subComponent?.subComponentName == targetSubComp) {
            this.kycPrivelege = item;
          }
        }
      }
    }
  }

  onPreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getAllEditKycRequests();
    }
  }

  onNextPage() {
    this.currentPage++;
    this.getAllEditKycRequests();
  }

  getAllEditKycRequests() {
    this.isLoading = true;
    const request$ = this.isEmailPhoneView
      ? this.userService.getAllPhoneEmailEditRequests(this.currentPage, this.filterStatus, this.sortDirection, this.pageSize)
      : this.KycService.filterEditKycRequests({
          filterType: 'STATUS',
          filterValues: [this.filterStatus],
          page: this.currentPage,
          pageSize: this.pageSize,
          sort: this.sortDirection
        });

    request$.subscribe({
      next: (data: any) => {
        this.data = data?.data;
        this.allData = Array.isArray(this.data) ? [...this.data] : [];
        if (this.isEmailPhoneView && this.pendingRequestId) {
          const match = this.allData.find(item => String(item?.id) === String(this.pendingRequestId));
          if (match) {
            this.openModal(match);
            this.pendingRequestId = null;
          }
        }
      },
      error: (error) => {
        console.error('Error fetching request data', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onFilterStatusChange(status: string) {
    this.filterStatus = status;
    this.currentPage = 0;
    this.getAllEditKycRequests();
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    this.currentPage = 0;
    this.getAllEditKycRequests();
  }

  navigateToKyc(item: any) {
    this.kycId = item?.id;
    this.KycService.setItem(item);
    if (item.kycType === 'CUSTOMER') {
      this.router.navigate(['kyc/view-customer-kyc'], { queryParams: { from: this.router.url } });
    }
    else if (item.kycType === 'AGENT' || item.kycType === 'MERCHANT') {
      this.router.navigate(['kyc/view-agent-kyc'], { queryParams: { from: this.router.url } });
    }
    else if (item.kycType === 'CORPORATE' || item.kycType === 'GOVT_AGENCY' || item.kycType === 'UN_AGENCY' || item.kycType === 'NGO') {
      this.router.navigate(['kyc/view-superagent-kyc'], { queryParams: { from: this.router.url } });
    }
    else if (item.kycType === 'MASTER AGENT' || item.kycType === 'SUPER_AGENT') {
      this.router.navigate(['kyc/view-masteragent-kyc'], { queryParams: { from: this.router.url } });
    }
    else {
      console.error('Unknown kycType:', item);
    }
  }

  navigateToRequestUserKyc(request: any) {
    const user = request?.user;
    if (!user) {
      alert('Unable to find user KYC information for this request.');
      return;
    }

    const kycType = (user?.kycType || user?.userType || '').toString().toUpperCase();
    const uid = user?.id;
    
    if (!uid) {
      alert('Unable to find user ID for this request.');
      return;
    }

    let returnUrl = this.router.url;
    if (request?.id) {
      returnUrl = returnUrl.includes('?') ? `${returnUrl}&requestId=${request.id}` : `${returnUrl}?requestId=${request.id}`;
    }
    const queryParams: any = { from: returnUrl };

    const performNavigation = (kycDataToSet: any) => {
      this.KycService.setItem(kycDataToSet);
      
      if (kycType === 'CUSTOMER') {
        this.router.navigate(['kyc/view-customer-kyc'], { queryParams });
      }
      else if (kycType === 'AGENT' || kycType === 'MERCHANT') {
        this.router.navigate(['kyc/view-agent-kyc'], { queryParams });
      }
      else if (kycType === 'CORPORATE' || kycType === 'GOVT_AGENCY' || kycType === 'UN_AGENCY' || kycType === 'NGO') {
        this.router.navigate(['kyc/view-superagent-kyc'], { queryParams });
      }
      else if (kycType === 'MASTER AGENT' || kycType === 'SUPER_AGENT') {
        this.router.navigate(['kyc/view-masteragent-kyc'], { queryParams });
      }
      else {
        console.error('Unknown kycType for user request:', request);
        alert('Unable to determine user KYC type for navigation.');
      }
    };

    // Fetch KYC data using the new API
    this.userService.getUserKYC(uid).subscribe({
      next: (res: any) => {
        const kycData = res?.data || { ...user, kycType };
        performNavigation(kycData);
      },
      error: () => {
        // fallback: set minimal user object and navigate
        performNavigation({ ...user, kycType });
      }
    });
  }

  openModal(item: any) {
    this.selectedItem = item;
    this.showModal = true;
    console.log('Modal opened with item:', item);
    console.log('Available fields:', Object.keys(item));
  }

  closeModal() {
    this.selectedItem = null;
    this.showModal = false;
    this.checkerRemarks = '';
  }

  approvePhoneEmailRequest() {
    if (!this.selectedItem) {
      return;
    }
    if (!this.checkerRemarks?.trim()) {
      alert('Please provide remarks before approving the request.');
      return;
    }
    const requestBody = {
      id: this.selectedItem?.id,
      remarks: this.checkerRemarks.trim()
    };
    this.isLoading = true;
    this.userService.approvePhoneEmailEditRequest(requestBody).subscribe({
      next: () => {
        alert('Phone/Email edit request approved successfully.');
        this.closeModal();
        this.getAllEditKycRequests();
      },
      error: (error) => {
        console.error('Error approving request', error);
        alert('Unable to approve request. Please try again.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  rejectPhoneEmailRequest() {
    if (!this.selectedItem) {
      return;
    }
    if (!this.checkerRemarks?.trim()) {
      alert('Please provide remarks before rejecting the request.');
      return;
    }
    const requestBody = {
      id: this.selectedItem?.id,
      remarks: this.checkerRemarks.trim()
    };
    this.isLoading = true;
    this.userService.rejectPhoneEmailEditRequest(requestBody).subscribe({
      next: () => {
        alert('Phone/Email edit request rejected successfully.');
        this.closeModal();
        this.getAllEditKycRequests();
      },
      error: (error) => {
        console.error('Error rejecting request', error);
        alert('Unable to reject request. Please try again.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  getSignatureFileName(): string {
    if (!this.selectedItem?.userSignature) {
      return '';
    }
    // Extract file name from the path
    const parts = this.selectedItem.userSignature.split('/');
    return parts[parts.length - 1] || 'signature_document';
  }

  viewSignatureDocument(): void {
    if (!this.selectedItem?.userSignature) {
      alert('No signature document available.');
      return;
    }

    this.userService.getUserSignatureDocument(this.selectedItem.userSignature).subscribe({
      next: (blob: Blob) => {
        const objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl, '_blank');
      },
      error: (error) => {
        console.error('Error fetching signature document', error);
        alert('Unable to load the document. Please try again.');
      }
    });
  }
}
