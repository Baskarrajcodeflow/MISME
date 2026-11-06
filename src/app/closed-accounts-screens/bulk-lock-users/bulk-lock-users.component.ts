import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../loader/loader.component';
import { ApiServiceService } from '../../product/api-service/api-service.service';
import * as XLSX from 'xlsx';

interface BulkLockRecord {
  rowNumber: number;
  walletNumber: string;
  phone: string;
  walletValid: boolean;
  phoneValid: boolean;
  isValid: boolean;
  errors: string[];
}

interface BulkLockedUser {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  userType: string;
  walletNumber: string;
}

interface BulkLockReportRecord {
  rowNumber: number;
  walletNumber: string;
  phone: string;
  firstName: string;
  lastName: string;
  locked: boolean;
  reason: string;
}

@Component({
  selector: 'app-bulk-lock-users',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './bulk-lock-users.component.html',
  styleUrl: './bulk-lock-users.component.css'
})
export class BulkLockUsersComponent {
  private readonly WALLET_NUMBER_PATTERN = /^[a-zA-Z0-9]+$/;
  private readonly PHONE_PATTERN = /^7\d{8}$/;

  isLoading = false;
  selectedFile: File | null = null;
  lockedUsers: BulkLockedUser[] = [];
  previewRecords: BulkLockRecord[] = [];
  reportRecords: BulkLockReportRecord[] = [];

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private apiService: ApiServiceService) { }

  get invalidCount(): number {
    return this.previewRecords.filter(r => !r.isValid).length;
  }

  get reportFailedCount(): number {
    return this.reportRecords.filter(r => !r.locked).length;
  }

  get reportSuccessCount(): number {
    return this.reportRecords.length - this.reportFailedCount;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) {
      return;
    }
    this.selectedFile = file;
    this.lockedUsers = [];
    this.previewRecords = [];
    this.reportRecords = [];

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      this.previewRecords = rows.map((row, index) => this.buildRecord(row, index + 2));
    };
    reader.readAsBinaryString(file);
  }

  private buildRecord(row: any, rowNumber: number): BulkLockRecord {
    const keys = Object.keys(row);
    const walletKey = keys.find(k => k.trim().toLowerCase() === 'walletnumber');
    const phoneKey = keys.find(k => k.trim().toLowerCase() === 'phone');
    const walletNumber = (walletKey ? row[walletKey] : '').toString().trim();
    const phone = (phoneKey ? row[phoneKey] : '').toString().trim();

    const walletValid = this.WALLET_NUMBER_PATTERN.test(walletNumber);
    const phoneValid = this.PHONE_PATTERN.test(phone);
    const errors: string[] = [];
    if (!walletValid) {
      errors.push('Invalid wallet number');
    }
    if (!phoneValid) {
      errors.push('Invalid phone number');
    }

    return { rowNumber, walletNumber, phone, walletValid, phoneValid, isValid: errors.length === 0, errors };
  }

  confirmUpload(): void {
    if (!this.selectedFile) {
      alert('Please select an excel file to upload');
      return;
    }
    this.isLoading = true;
    this.apiService.bulkLockUsers(this.selectedFile).subscribe({
      next: (data: any) => {
        this.isLoading = false;
        if (data?.responseCode == 200) {
          this.lockedUsers = Array.isArray(data?.data) ? data.data : [];
          this.buildReport();
          this.reuploadFile();
        } else {
          alert(data?.error || 'Failed to lock users');
        }
      },
      error: () => {
        this.isLoading = false;
        alert('Failed to upload file');
      }
    });
  }

  private buildReport(): void {
    const lockedByWallet = new Map<string, BulkLockedUser>();
    this.lockedUsers.forEach(u => {
      if (u?.walletNumber) {
        lockedByWallet.set(u.walletNumber.trim(), u);
      }
    });

    this.reportRecords = this.previewRecords.map(record => {
      const matched = lockedByWallet.get(record.walletNumber.trim());
      if (matched) {
        return {
          rowNumber: record.rowNumber,
          walletNumber: record.walletNumber,
          phone: record.phone,
          firstName: matched.firstName,
          lastName: matched.lastName,
          locked: true,
          reason: ''
        };
      }
      return {
        rowNumber: record.rowNumber,
        walletNumber: record.walletNumber,
        phone: record.phone,
        firstName: '',
        lastName: '',
        locked: false,
        reason: record.isValid ? 'Failed' : record.errors.join(', ')
      };
    });
  }

  reuploadFile(): void {
    this.selectedFile = null;
    this.previewRecords = [];
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
