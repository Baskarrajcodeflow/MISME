import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeesOrCommission } from '../../../product/openapi';
import { DcmsService } from '../../dcms.service';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-general-status-report',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './general-status-report.component.html',
  styleUrl: './general-status-report.component.css'
})
export class GeneralStatusReportComponent {
  reportForm: FormGroup = new FormGroup({});
  userPrevilages1: any;
  privilege: any;
  userPrivileges: any;
  projectList: any;
  isLoading: boolean = false;
  subprojectList: any;
  beneficiaryList: any;
  refNo: any;
  idNo: any;
  showViewModal: boolean = false;
  dataByRef: any;
  totalCount: any;
  totalAmount: any;
  totalpaidcount: any;
  totalAmountUnpaid: any;
  totalUnpaidCount: any;
  totalAmountPaid: any;
  showDownloadMenu = false;
  constructor(private dcmsService: DcmsService, private fb: FormBuilder) { }
  ngOnInit(): void {
    this.reportForm = this.fb.group({
      project: ['', [Validators.required]],
      subproject: ['', Validators.required],
    })
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "User Management") {
          if (item.subComponent?.subComponentName == "MM Staff")
            this.privilege = item;
        }
      }
    }
    this.fetch();
  }
  fetch() {
    this.dcmsService.getFileData().subscribe((data: any) => {
      this.beneficiaryList = data?.data;
    })
  }
  getExpiryDate(createdOn: string): string {
    if (!createdOn) {
      return 'NIL';
    }
    const expiry = new Date(createdOn);
    expiry.setMonth(expiry.getMonth() + 3);
    const day = String(expiry.getDate()).padStart(2, '0');
    const month = String(expiry.getMonth() + 1).padStart(2, '0');
    const year = expiry.getFullYear();
    return `${day}-${month}-${year}`;
  }
  viewMore(c: any) {
    this.refNo = c?.referenceNo
    this.idNo = c?.id
    this.showViewModal = true;
    this.dcmsService.getFileDataByRef(this.refNo).subscribe((data: any) => {
      this.dataByRef = data?.data
      // Total count and amount
      const records = this.dataByRef || [];
      this.totalCount = records.length;
      this.totalAmount = records.reduce((sum: number, c: any) => sum + Number(c.amount || 0), 0);

      // Processed (paid = true)
      const processed = records.filter((c: any) => c.paid === true);
      this.totalpaidcount = processed.length;
      this.totalAmountPaid = processed.reduce((sum: number, c: any) => sum + Number(c.amount || 0), 0);

      // Unprocessed (paid = false)
      const unprocessed = records.filter((c: any) => c.paid === false);
      this.totalUnpaidCount = unprocessed.length;
      this.totalAmountUnpaid = unprocessed.reduce((sum: number, c: any) => sum + Number(c.amount || 0), 0);
    })
  }
  toggleDownloadMenu() {
    this.showDownloadMenu = !this.showDownloadMenu;
  }
   closeViewMore() {
    this.showViewModal = false;
  }
  exportWalletToExcel() {
    if (!this.dataByRef?.length) {
      alert('No data available to export');
      return;
    }
    const wsData = [];
    const headers = [
      'Address',
      'Account No',
      'City',
      'Country',
      'Description',
      'Employee ID',
      'Father Name',
      'Gender',
      'ID',
      'Job Status',
      'Name',
      'Province',
      'Work Location',
      'Reference No',
      'Taskira',
      'Mobile',
      'Amount',
      'Paid Status'
    ];
    wsData.push(headers);
    this.dataByRef.forEach((c: any) => {
      wsData.push([
        c.address || 'NIL',
        c.accountNumber || 'NIL',
        c.city || 'NIL',
        c.country || 'NIL',
        c.descriptions || 'NIL',
        c.employeeId || 'NIL',
        c.fatherName || 'NIL',
        c.gender || 'NIL',
        c.id || 'NIL',
        c.jobStatus || 'NIL',
        c.name || 'NIL',
        c.province || 'NIL',
        c.provinceWorkLocation || 'NIL',
        c.referenceNo || 'NIL',
        c.taskira || 'NIL',
        c.mobileNumber || 'NIL',
        c.amount ?? 0,
        c.paid === true ? 'PAID' : c.paid === false ? 'UNPAID' : 'NIL'
      ]);
    });

    // Convert to worksheet and export
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'File Data');
    XLSX.writeFile(wb, 'File_Data.xlsx');
  }
  exportWalletToPDF() {
    if (!this.dataByRef || this.dataByRef.length === 0) {
      alert("No data available to export!");
      return;
    }
    const doc = new jsPDF('l', 'pt', 'a4'); // landscape
    const title = "File Details";
    doc.setFontSize(14);
    doc.text(title, 40, 40);

    const headers = [
      [
        "Employee ID", "Name", "Father Name", "Taskira", "Gender", "City",
        "Province", "Country", "Account No", "Amount", "Mobile", "Paid Status"
      ]
    ];

    const rows = this.dataByRef.map((c: any) => [
      c.employeeId || 'NIL',
      c.name || 'NIL',
      c.fatherName || 'NIL',
      c.taskira || 'NIL',
      c.gender || 'NIL',
      c.city || 'NIL',
      c.province || 'NIL',
      c.country || 'NIL',
      c.accountNumber || 'NIL',
      c.amount || '0',
      c.mobileNumber || 'NIL',
      c.paid === true ? "PAID" : (c.paid === false ? "UNPAID" : "NIL")
    ]);

    autoTable(doc, {
      startY: 60,
      head: headers,
      body: rows,
      styles: { fontSize: 8, cellPadding: 4 },
      headStyles: { fillColor: [10, 54, 90] },
    });

    doc.save(`Wallet_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  }
}
