import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../loader/loader.component';
import { ApiServiceService } from '../../product/api-service/api-service.service';
import * as XLSX from 'xlsx';

interface BulkRegistrationRecord {
  rowNumber: number;
  firstName: string;
  lastName: string;
  idProofType: string;
  idProofNumber: string;
  dob: string;
  fatherName: string;
  currentCountry: string;
  currentDistrict: string;
  currentProvince: string;
  currentLocation: string;
  phone: string;
  email: string;
  gender: string;
  birthCountry: string;
  birthDistrict: string;
  birthProvince: string;
  password: string;
  fieldErrors: { [key: string]: string };
  errors: string[];
  isValid: boolean;
}

interface BulkRegUserRef {
  id?: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}

interface BulkRegBatch {
  id: number;
  createdOn: string;
  createdBy: BulkRegUserRef | null;
  approvedOn: string | null;
  approvedBy: BulkRegUserRef | null;
  rejectedOn: string | null;
  rejectedBy: BulkRegUserRef | null;
  remarks: string | null;
  status: string;
  userType: string;
}

interface BulkRegBatchDetail {
  id: number;
  regBatchId: number;
  firstName: string;
  lastName: string;
  idProofType: string;
  idProofNumber: string;
  dob: string;
  fatherName: string;
  currCountry: string;
  currDistrict: string;
  currProvince: string;
  birthCountry: string;
  birthDistrict: string;
  birthProvince: string;
  phone: string;
  email: string;
  password: string;
  gender: string;
  registered: boolean;
  error: string | null;
}

type BulkRegTab = 'upload' | 'uploaded' | 'approved' | 'rejected';

@Component({
  selector: 'app-bulk-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './bulk-registration.component.html',
  styleUrl: './bulk-registration.component.css'
})
export class BulkRegistrationComponent {
  private readonly ID_PROOF_TYPES = ['E_TAZKIRA', 'PAPER_TAZKIRA', 'PASSPORT'];
  private readonly GENDERS = ['MALE', 'FEMALE'];
  private readonly DOB_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
  private readonly EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly PASSWORD_PATTERN = /^\d{6}$/;

  activeTab: BulkRegTab = 'upload';
  pageSize = 10;

  isLoading = false;
  selectedFile: File | null = null;
  previewRecords: BulkRegistrationRecord[] = [];
  registeredUsers: any[] = [];

  isBatchListLoading = false;

  pendingBatches: BulkRegBatch[] = [];
  pendingPage = 0;
  pendingIsLastPage = false;

  approvedBatches: BulkRegBatch[] = [];
  approvedPage = 0;
  approvedIsLastPage = false;

  rejectedBatches: BulkRegBatch[] = [];
  rejectedPage = 0;
  rejectedIsLastPage = false;

  showBatchModal = false;
  selectedBatch: BulkRegBatch | null = null;
  isBatchDetailsLoading = false;
  batchDetails: BulkRegBatchDetail[] = [];

  showActionModal = false;
  actionType: 'approve' | 'reject' | null = null;
  actionItem: BulkRegBatch | null = null;
  actionRemarks = '';

  loginUserId: any = sessionStorage.getItem('loginUserId');

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private apiService: ApiServiceService) { }

  get invalidCount(): number {
    return this.previewRecords.filter(r => !r.isValid).length;
  }

  //--------------------------------- Tab navigation ---------------------------------//

  changeTab(tab: BulkRegTab): void {
    this.activeTab = tab;
    if (tab === 'uploaded') {
      this.pendingPage = 0;
      this.loadPendingBatches();
    } else if (tab === 'approved') {
      this.approvedPage = 0;
      this.loadApprovedBatches();
    } else if (tab === 'rejected') {
      this.rejectedPage = 0;
      this.loadRejectedBatches();
    }
  }

  statusBadgeClass(status: string): string {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  //--------------------------------- Uploaded (Pending) ---------------------------------//

  loadPendingBatches(): void {
    this.isBatchListLoading = true;
    this.apiService.getBulkRegPendingBatches(this.pendingPage, this.pageSize).subscribe({
      next: (data: any) => {
        this.isBatchListLoading = false;
        this.pendingBatches = Array.isArray(data?.data) ? data.data : [];
        this.pendingIsLastPage = this.pendingBatches.length < this.pageSize;
      },
      error: () => { this.isBatchListLoading = false; }
    });
  }

  pendingNextPage(): void {
    if (!this.pendingIsLastPage) {
      this.pendingPage++;
      this.loadPendingBatches();
    }
  }

  pendingPrevPage(): void {
    if (this.pendingPage > 0) {
      this.pendingPage--;
      this.loadPendingBatches();
    }
  }

  //--------------------------------- Approve / Reject ---------------------------------//

  approveBatch(batch: BulkRegBatch): void {
    this.openActionModal(batch, 'approve');
  }

  rejectBatch(batch: BulkRegBatch): void {
    this.openActionModal(batch, 'reject');
  }

  openActionModal(batch: BulkRegBatch, type: 'approve' | 'reject'): void {
    this.actionItem = batch;
    this.actionType = type;
    this.actionRemarks = '';
    this.showActionModal = true;
  }

  closeActionModal(): void {
    this.showActionModal = false;
    this.actionType = null;
    this.actionItem = null;
    this.actionRemarks = '';
  }

  confirmAction(): void {
    if (!this.actionRemarks?.trim()) { alert('Please enter remarks'); return; }
    if (!this.actionItem) { return; }

    const body = { id: this.actionItem.id, remarks: this.actionRemarks };
    const apiCall = this.actionType === 'approve'
      ? this.apiService.approveBulkRegBatch(body)
      : this.apiService.rejectBulkRegBatch(body);

    this.isLoading = true;
    apiCall.subscribe({
      next: (data: any) => {
        this.isLoading = false;
        if (data?.responseCode == 200) {
          alert(this.actionType === 'approve' ? 'Batch Approved' : 'Batch Rejected');
          this.pendingBatches = this.pendingBatches.filter(b => b.id !== this.actionItem?.id);
          this.closeActionModal();
        } else {
          alert(data?.error || 'Failed to process the batch');
        }
      },
      error: () => { this.isLoading = false; alert('Failed to process the batch'); }
    });
  }

  //--------------------------------- Approved ---------------------------------//

  loadApprovedBatches(): void {
    this.isBatchListLoading = true;
    this.apiService.getBulkRegApprovedBatches(this.approvedPage, this.pageSize).subscribe({
      next: (data: any) => {
        this.isBatchListLoading = false;
        this.approvedBatches = Array.isArray(data?.data) ? data.data : [];
        this.approvedIsLastPage = this.approvedBatches.length < this.pageSize;
      },
      error: () => { this.isBatchListLoading = false; }
    });
  }

  approvedNextPage(): void {
    if (!this.approvedIsLastPage) {
      this.approvedPage++;
      this.loadApprovedBatches();
    }
  }

  approvedPrevPage(): void {
    if (this.approvedPage > 0) {
      this.approvedPage--;
      this.loadApprovedBatches();
    }
  }

  //--------------------------------- Rejected ---------------------------------//

  loadRejectedBatches(): void {
    this.isBatchListLoading = true;
    this.apiService.getBulkRegRejectedBatches(this.rejectedPage, this.pageSize).subscribe({
      next: (data: any) => {
        this.isBatchListLoading = false;
        this.rejectedBatches = Array.isArray(data?.data) ? data.data : [];
        this.rejectedIsLastPage = this.rejectedBatches.length < this.pageSize;
      },
      error: () => { this.isBatchListLoading = false; }
    });
  }

  rejectedNextPage(): void {
    if (!this.rejectedIsLastPage) {
      this.rejectedPage++;
      this.loadRejectedBatches();
    }
  }

  rejectedPrevPage(): void {
    if (this.rejectedPage > 0) {
      this.rejectedPage--;
      this.loadRejectedBatches();
    }
  }

  //--------------------------------- Batch details modal ---------------------------------//

  viewBatch(batch: BulkRegBatch): void {
    this.selectedBatch = batch;
    this.showBatchModal = true;
    this.batchDetails = [];
    this.isBatchDetailsLoading = true;
    this.apiService.getBulkRegBatchDetails(batch.id).subscribe({
      next: (data: any) => {
        this.isBatchDetailsLoading = false;
        this.batchDetails = Array.isArray(data?.data) ? data.data : [];
      },
      error: () => { this.isBatchDetailsLoading = false; }
    });
  }

  closeBatchModal(): void {
    this.showBatchModal = false;
    this.selectedBatch = null;
    this.batchDetails = [];
  }

  get batchDetailsFailedCount(): number {
    return this.batchDetails.filter(r => !r.registered).length;
  }

  //--------------------------------- Upload tab (existing) ---------------------------------//

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) { return; }
    this.selectedFile = file;
    this.registeredUsers = [];
    this.previewRecords = [];

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary', cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
      const dataRows = rows.slice(1).filter(row => row.some(cell => this.cellToString(cell) !== ''));
      this.previewRecords = dataRows.map((row, index) => this.buildRecord(row, index + 2));
    };
    reader.readAsBinaryString(file);
  }

  private cellToString(value: any): string {
    if (value === null || value === undefined) { return ''; }
    return value.toString().trim();
  }

  private formatDob(value: any): string {
    if (value === null || value === undefined || value === '') { return ''; }
    if (value instanceof Date) {
      const y = value.getFullYear();
      const m = (value.getMonth() + 1).toString().padStart(2, '0');
      const d = value.getDate().toString().padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    return value.toString().trim();
  }

  private isValidCalendarDate(dob: string): boolean {
    if (!this.DOB_PATTERN.test(dob)) { return false; }
    const [year, month, day] = dob.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }

  private buildRecord(cells: any[], rowNumber: number): BulkRegistrationRecord {
    const get = (i: number) => this.cellToString(cells[i]);

    const firstName = get(0);
    const lastName = get(1);
    const idProofType = get(2).toUpperCase();
    const idProofNumber = get(3);
    const dob = this.formatDob(cells[4]);
    const fatherName = get(5);
    const currentCountry = get(6);
    const currentDistrict = get(7);
    const currentProvince = get(8);
    const currentLocation = get(9);
    const phone = get(10);
    const email = get(11);
    const gender = get(12).toUpperCase();
    const birthCountry = get(13);
    const birthDistrict = get(14);
    const birthProvince = get(15);
    const password = get(16);

    const fieldErrors: { [key: string]: string } = {};

    if (!firstName) { fieldErrors['firstName'] = 'First name is required'; }
    if (!lastName) { fieldErrors['lastName'] = 'Last name is required'; }
    if (!this.ID_PROOF_TYPES.includes(idProofType)) { fieldErrors['idProofType'] = 'Must be E_TAZKIRA, PAPER_TAZKIRA or PASSPORT'; }
    if (!idProofNumber) { fieldErrors['idProofNumber'] = 'ID proof number is required'; }
    if (!this.isValidCalendarDate(dob)) { fieldErrors['dob'] = 'DOB must be a valid date in yyyy-MM-dd format'; }
    if (!fatherName) { fieldErrors['fatherName'] = 'Father name is required'; }
    if (!currentCountry) { fieldErrors['currentCountry'] = 'Current country is required'; }
    if (!currentDistrict) { fieldErrors['currentDistrict'] = 'Current district is required'; }
    if (!currentProvince) { fieldErrors['currentProvince'] = 'Current province is required'; }
    if (!currentLocation) { fieldErrors['currentLocation'] = 'Current location is required'; }
    if (!phone) { fieldErrors['phone'] = 'Phone is required'; }
    if (!email || !this.EMAIL_PATTERN.test(email)) { fieldErrors['email'] = 'A valid email is required'; }
    if (!this.GENDERS.includes(gender)) { fieldErrors['gender'] = 'Must be MALE or FEMALE'; }
    if (!birthCountry) { fieldErrors['birthCountry'] = 'Birth country is required'; }
    if (!birthDistrict) { fieldErrors['birthDistrict'] = 'Birth district is required'; }
    if (!birthProvince) { fieldErrors['birthProvince'] = 'Birth province is required'; }
    if (!this.PASSWORD_PATTERN.test(password)) { fieldErrors['password'] = 'Password must be a 6 digit numeric value'; }

    const errors = Object.values(fieldErrors);

    return {
      rowNumber, firstName, lastName, idProofType, idProofNumber, dob, fatherName,
      currentCountry, currentDistrict, currentProvince, currentLocation, phone, email,
      gender, birthCountry, birthDistrict, birthProvince, password,
      fieldErrors, errors, isValid: errors.length === 0
    };
  }

  confirmUpload(): void {
    if (!this.selectedFile) { alert('Please select an excel file to upload'); return; }
    if (this.invalidCount > 0) { alert('Please fix the invalid records before submitting'); return; }

    this.isLoading = true;
    this.apiService.bulkRegisterCustomers(this.selectedFile).subscribe({
      next: (data: any) => {
        this.isLoading = false;
        if (data?.responseCode == 200) {
          this.registeredUsers = Array.isArray(data?.data) ? data.data : [];
          alert(data?.data);
          this.reuploadFile();
        } else {
          alert(data?.error || 'Failed to register customers');
        }
      },
      error: () => { this.isLoading = false; alert('Failed to upload file'); }
    });
  }

  reuploadFile(): void {
    this.selectedFile = null;
    this.previewRecords = [];
    if (this.fileInput) { this.fileInput.nativeElement.value = ''; }
  }
}
