import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiServiceService } from '../../product/api-service/api-service.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { KycModuleService } from "../../kyc/kyc/kyc-module.service";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-remittance-pay-details',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, CommonModule, ReactiveFormsModule, FormsModule,
    MatIconModule,
    MatIconModule, MatMenuModule,
  ],
  templateUrl: './remittance-pay-details.component.html',
  styleUrl: './remittance-pay-details.component.css'
})
export class RemittancePayDetailsComponent {
  isLoading: boolean = false;
  totalCreditCount: any;
  totalDebit: any;
  totalDebitCount: any;
  totalCredit: any;
  agentSummaryReport: any;
  paginatedData: any;
  currentPage: any = 1;
  totalPages: any;
  pageSize: any = 10;
  backOfficeUser: any;
  showStatus: boolean = false;
  showMobno: boolean = false;
  showReceiverName: boolean = false;
  searchByTarget: any;
  showSearchButton: boolean = false;
  status: string = '';
  mobNo: string = '';
  receiverName: string = '';

  constructor(private apiService: ApiServiceService,
    private KycModuleService: KycModuleService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.KycModuleService.getProfileDetails().subscribe(response => {
      if (response?.responseCode == 200) {
        this.backOfficeUser = response?.data?.firstName + ' ' + response?.data?.lastName;
      }
    })

  }
  onChangeSearchBy($event: any) {
    this.searchByTarget = $event.target.value;
    this.agentSummaryReport = [];
    this.paginatedData = [];
    this.currentPage = 1;
    this.totalPages = 0;
    this.status = '';
    this.mobNo = '';
    this.receiverName = '';
    this.showStatus = false;
    this.showMobno = false;
    this.showReceiverName = false;
    this.showSearchButton = false;
    if (this.searchByTarget === "STATUS") {
      this.showStatus = true;
    }
    else if (this.searchByTarget === "RECEIVER_NAME") {
      this.showReceiverName = true;
      this.showSearchButton = true;
    }
    else if (this.searchByTarget === "MOB_NO") {
      this.showMobno = true;
      this.showSearchButton = true;
    }
  }
  onChangeStatus($event: any) {
    console.log("statusstatus:", this.status);
    this.apiService.getRemittanceReportByStatus(this.status).subscribe({
      next: (data: any) => {
        this.isLoading = false;
        this.agentSummaryReport = data?.data || [];
        this.paginatedData = this.agentSummaryReport
        this.currentPage = 1;
        this.calculatePagination();
      },
      error: () => {
        this.isLoading = false;
        alert("Error Try Again");
      },
    });
  }
  onClickSearch() {
    if (this.searchByTarget == "RECEIVER_NAME") {
      this.apiService.getRemittanceReportByReceiverName(this.receiverName).subscribe({
        next: (data: any) => {
          this.isLoading = false;
          this.agentSummaryReport = data?.data || [];
          this.paginatedData = this.agentSummaryReport
          this.currentPage = 1;
          this.calculatePagination();
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
    else if (this.searchByTarget == "MOB_NO") {
      this.apiService.getRemittanceReportByMobno(this.mobNo).subscribe({
        next: (data: any) => {
          this.isLoading = false;
          this.agentSummaryReport = data?.data || [];
          this.paginatedData = this.agentSummaryReport
          this.currentPage = 1;
          this.calculatePagination();
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
    }
  }
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.agentSummaryReport.length / this.pageSize);
    if (this.totalPages === 0) {
      this.totalPages = 1;
    }
    this.updatePagination();
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination(); // Update the table data for the new page
    }
  }
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.agentSummaryReport.slice(startIndex, endIndex);
  }
  downloadJasperPDF() {
    const doc = new jsPDF('landscape');
    doc.setFontSize(18);
    doc.text('Remittance Pay Details', 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [[
        'ID',
        'Transaction No',
        'Token No',
        'Sender Wallet No',
        'Receiver Name',
        'Receiver Mobile',
        'Amount',
        'Status'
      ]],
      body: this.agentSummaryReport.map((item: any) => [
        item.id ?? 'NIL',
        item.transactionNo ?? 'NIL',
        item.tokenNo ?? 'NIL',
        item.senderWalletNo ?? 'NIL',
        item.receiverName ?? 'NIL',
        item.receiverMobile ?? 'NIL',
        item.amount ?? 'NIL',
        item.status ?? 'NIL'
      ]),
      styles: {
        fontSize: 8
      },
      headStyles: {
        fillColor: [244, 122, 32]
      }
    });
    doc.save('Remittance_Pay_Details.pdf');
  }
  downloadJasperExcel() {
    const data = this.agentSummaryReport.map((item: any) => ({
      ID: item.id ?? 'NIL',
      'Transaction No': item.transactionNo ?? 'NIL',
      'Token No': item.tokenNo ?? 'NIL',
      'Sender Wallet No': item.senderWalletNo ?? 'NIL',
      'Receiver Name': item.receiverName ?? 'NIL',
      'Receiver Mobile': item.receiverMobile ?? 'NIL',
      Amount: item.amount ?? 'NIL',
      Status: item.status ?? 'NIL'
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Remittance');

    XLSX.writeFile(wb, 'Remittance_Pay_Details.xlsx');
  }
  downloadJasperCSV() {
    const data = this.agentSummaryReport.map((item: any) => ({
      ID: item.id ?? 'NIL',
      'Transaction No': item.transactionNo ?? 'NIL',
      'Token No': item.tokenNo ?? 'NIL',
      'Sender Wallet No': item.senderWalletNo ?? 'NIL',
      'Receiver Name': item.receiverName ?? 'NIL',
      'Receiver Mobile': item.receiverMobile ?? 'NIL',
      Amount: item.amount ?? 'NIL',
      Status: item.status ?? 'NIL'
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    });
    saveAs(blob, 'Remittance_Pay_Details.csv');
  }
}
