import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../loader/loader.component';
import { ApiServiceService } from '../../product/api-service/api-service.service';
import { AccountClosureRequest } from '../../product/models/model';

@Component({
  selector: 'app-account-closing-authorization',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './account-closing-authorization.component.html',
  styleUrl: './account-closing-authorization.component.css'
})
export class AccountClosingAuthorizationComponent {

  activeTab: 'request' | 'pending' | 'completed' | 'rejected' = 'request';
  mobileNumber: any = '';
  isLoading = false;
  searchResults: any[] = [];
  pendingRequests: any[] = [];
  completedClosures: any[] = [];
  rejectedRequests: any[] = [];
  pageSize: number = 20;
  pendingCurrentPage: number = 0;
  pendingIsLastPage: boolean = false;
  rejectedCurrentPage: number = 0;
  rejectedIsLastPage: boolean = false;
  walletNo: any;
  searchByPhoneList: any;
  reqID: any;
  showViewModal: boolean = false;
  viewDetails: any;
  walletNumber: any;
  firstName: any;
  lastName: any;
  showClosureModal: boolean = false;
  selectedFile: any;
  // TODO: hardcoded placeholder until the accClosure get-document API is available
  placeholderDocUrl: string = 'assets/images/dummy.jpg';
  showActionModal: boolean = false;
  actionType: 'approve' | 'reject' | null = null;
  actionItem: any;
  actionRemarks: string = '';
  constructor(private apiService: ApiServiceService) { }
  ngOnInit(): void {
    // this.loadDummyData();
  }
  changeTab(tab: 'request' | 'pending' | 'completed' | 'rejected'): void {
    this.activeTab = tab;
    if (tab == 'pending') {
      this.pendingCurrentPage = 0;
      this.getPendingRequestList();
    }
   /*  if (tab == 'completed') {
      this.getCompletedRequestList();
    } */
    if (tab == 'rejected') {
      this.rejectedCurrentPage = 0;
      this.getRejectedRequestList();
    }
  }
  searchUser(): void {
    if (!this.mobileNumber?.trim()) {
      alert('Please enter mobile number');
      return;
    }
    this.apiService.searchUser(this.mobileNumber).subscribe((data: any) => {
      this.searchResults = data?.data;
    })
  }
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }

  }
  requestClosure(user: any) {
    if (!user.closureReason?.trim()) {
      alert('Please enter a reason for closure');
      return;
    }
    this.showClosureModal = true;
    this.walletNumber = user?.walletNumber
    this.firstName = user?.firstName
    this.lastName = user?.lastName
    let req: AccountClosureRequest = {
      walletNo: this.walletNumber,
      reasonForClosure: user.closureReason,
    }
    this.apiService.requestClosure(req).subscribe((data: any) => {
      if (data?.responseCode == 200) {
        this.reqID = data?.data?.id;
        /*   alert(
            `Closure request initiated for ${this.firstName
            } ${this.lastName}, Please upload document for verification.`
          ); */
      }
      else {
        alert(data?.error)
      }
    })
  }
  submitClosureRequest() {
    console.log("Inside");
    this.apiService.uploadAccClosureDoc(this.selectedFile, this.reqID).subscribe((data: any) => {
      if (data?.responseCode == 200) {
        alert('Document uploaded successfully');
        this.showClosureModal = false;
      }
      else if (data?.responseCode == 0) {
        alert(data?.error)
      }

      else {
        alert("Error Occured")
      }
    })

  }
  getPendingRequestList() {
    this.apiService.getPendingRequestList(this.pendingCurrentPage, this.pageSize).subscribe((data: any) => {
      let pendingArray = []
      for (let item of data?.data) {
        if (item?.status == "PENDING") {
          pendingArray.push(item)
        }
      }
      this.pendingRequests = pendingArray;
      this.pendingIsLastPage = (data?.data?.length || 0) < this.pageSize;
    })
  }
  pendingNextPage(): void {
    if (!this.pendingIsLastPage) {
      this.pendingCurrentPage++;
      this.getPendingRequestList();
    }
  }
  pendingPrevPage(): void {
    if (this.pendingCurrentPage > 0) {
      this.pendingCurrentPage--;
      this.getPendingRequestList();
    }
  }
 /*  getCompletedRequestList() {
    this.apiService.getCompletedRequestList().subscribe((data: any) => {
      let completedArray = []
      for (let item of data?.data) {
        if (item?.status == "APPROVED") {
          completedArray.push(item)
        }
      }
      this.completedClosures = completedArray;
    })
  } */
  getRejectedRequestList() {
    this.apiService.getRejectedClosureRequests(this.rejectedCurrentPage, this.pageSize).subscribe((data: any) => {
      this.rejectedRequests = data?.data;
      this.rejectedIsLastPage = (data?.data?.length || 0) < this.pageSize;
    })
  }
  rejectedNextPage(): void {
    if (!this.rejectedIsLastPage) {
      this.rejectedCurrentPage++;
      this.getRejectedRequestList();
    }
  }
  rejectedPrevPage(): void {
    if (this.rejectedCurrentPage > 0) {
      this.rejectedCurrentPage--;
      this.getRejectedRequestList();
    }
  }
  viewPending(item: any) {
    console.log('View Pending', item);
    this.showViewModal = true
    this.viewDetails = item;
  }
  viewCompleted(item: any) {
    this.showViewModal = true
    this.viewDetails = item;
  }
  viewDocument(closureDoc: any): void {
    if (!closureDoc) {
      alert('No document available.');
      return;
    }

    this.apiService.getClosureDocument(closureDoc).subscribe({
      next: (blob: Blob) => {
        const objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl, '_blank');
      },
      error: (error) => {
        console.error('Error fetching closure document', error);
        alert('Unable to load the document. Please try again.');
      }
    });
  }
  approveRequest(item: any) {
    this.openActionModal(item, 'approve');
  }
  rejectRequest(item: any) {
    this.openActionModal(item, 'reject');
  }
  openActionModal(item: any, type: 'approve' | 'reject') {
    this.actionItem = item;
    this.actionType = type;
    this.actionRemarks = '';
    this.showActionModal = true;
  }
  closeActionModal() {
    this.showActionModal = false;
    this.actionType = null;
    this.actionItem = null;
    this.actionRemarks = '';
  }
  confirmAction() {
    if (!this.actionRemarks?.trim()) {
      alert('Please enter remarks');
      return;
    }
    let req = {
      reqId: this.actionItem?.id,
      remarks: this.actionRemarks
    }
    let apiCall = this.actionType === 'approve'
      ? this.apiService.approveClosedAccountRequest(req)
      : this.apiService.rejectClosedAccountRequest(req);
    apiCall.subscribe((data: any) => {
      if (data?.responseCode == 200) {
        alert(this.actionType === 'approve' ? 'Request Approved' : 'Request Rejected');
        this.pendingRequests = this.pendingRequests.filter(
          x => x.id !== this.actionItem?.id
        );
        this.closeActionModal();
      }
      else if(data?.responseCode == 0) {
        alert(data?.data)
      }
      else{
        alert("Error Occured")
      }
    })
  }
  resetSearch(): void {
    this.mobileNumber = '';
    this.searchResults = [];
  }
}