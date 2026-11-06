import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DcmsService } from '../dcms.service';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-beneficiary-management',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './beneficiary-management.component.html',
  styleUrl: './beneficiary-management.component.css'
})
export class BeneficiaryManagementComponent {
  @ViewChild('commonSearchDropdown') commonSearchDropdown!: ElementRef<HTMLSelectElement>;
  searchForm: FormGroup = new FormGroup({});
  searchText: FormControl = new FormControl('');
  benForm: FormGroup = new FormGroup({});
  selectedFundingParty: string | null = null;
  userPrevilages1: any;
  fileData: any;
  privilege: any;
  userPrivileges: any;
  projectList: any;
  isLoading: boolean = false;
  subprojectList: any;
  showTable: boolean = false
  beneficiaryList: any;
  activeTab: string = 'upload';
  fundingParties: any
  selectedFile: File | null = null;
  selectedFileName: string = '';
  errors: string[] = [];
  excelData: any[] = [];
  payload: any;
  searchValue: any;
  result: any;
  targetFundingPartyId: any;
  statusTarget: any;
  showViewModal: boolean = false;
  refNo: any;
  dataByRef: any;
  idNo: any;
  isEditMode: boolean = false;
  editingRowId: string | null = null;  // track which row is being edited
  selectedRow: any = null;
  pendingFiles: any;
  approvedFiles: any;
  tokenGeneratedFiles: any;
  rejectedFiles: any;
  corporateId: any;
  totalCount: any;
  totalAmount: any;
  totalpaidcount: any;
  totalAmountPaid: any;
  totalUnpaidCount: any;
  totalAmountUnpaid: any;
  showDownloadMenu = false;
  constructor(private dcmsService: DcmsService, private fb: FormBuilder) { }
  ngOnInit(): void {
    this.benForm = this.fb.group({
      project: ['', [Validators.required]],
      subproject: ['', Validators.required]
    })
    this.searchForm = this.fb.group({
      searchText: [''] // FormControl for the search input
    });
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
    this.getFundingPartyList();
    this.getFileData();
  }
  // Handle drag & drop
  onChangeFundingParty($event: any) {
    this.targetFundingPartyId = $event.target.value;
    this.corporateId = this.targetFundingPartyId
    console.log("corporateId onChangeFundingParty()", this.corporateId)
  }
  getFundingPartyList() {
    this.dcmsService.getFundingPartyList().subscribe((data: any) => {
      this.fundingParties = data?.data;
    })
  }
  changeTab(tab: string) {
    this.activeTab = tab;
    this.getFileData(); // refresh data on every tab change
  }
  getFileData() {
    this.dcmsService.getFileData().subscribe((data: any) => {
      this.fileData = data?.data || [];
      this.pendingFiles = this.fileData.filter((c: any) => c?.processStatus == null ||
        this.fileData.filter((c: any) => c?.processStatus == 'PENDING'));
      this.approvedFiles = this.fileData.filter((c: any) => c?.processStatus == 'APPROVED');
      this.tokenGeneratedFiles = this.fileData.filter((c: any) => c?.processStatus == 'TOKEN_GENERATED');
      this.rejectedFiles = this.fileData.filter((c: any) => c?.processStatus == 'REJECTED');
    });
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
  generateToken() {
    console.log("idNo", this.idNo)
    this.dcmsService.generateToken(this.idNo).subscribe((data: any) => {
      if (data?.responseCode == 200) {
        alert("Token genertated successfully");
        this.fileData = this.fileData.filter((row: any) => row.id !== this.idNo);
        this.showViewModal = false;
      }
      else {
        alert(data?.error)
        this.showViewModal = false;
      }
    })
  }
  edit(c: any) {
    this.isEditMode = true;
    this.editingRowId = c.id;          // only this row is editable
    this.selectedRow = { ...c };       // clone to avoid changing original until save
  }
  saveEditedData() {
    if (!this.selectedRow) return;

    this.dcmsService.editBenData(
      this.selectedRow.id,
      this.selectedRow.mobileNumber,  // ✅ fixed typo
      this.selectedRow.amount
    ).subscribe((data: any) => {
      console.log("Row updated successfully", data);
      // Update the row in table without reloading everything
      const index = this.dataByRef.findIndex((item: any) => item.id === this.selectedRow.id);
      if (index > -1) {
        this.dataByRef[index] = { ...this.selectedRow };
      }

      // Reset edit mode
      this.isEditMode = false;
      this.editingRowId = null;
      this.selectedRow = null;
    });
  }
  approveFile() {
    this.dcmsService.approveFile(this.idNo, "TRUE").subscribe((data: any) => {
      if (data?.responseCode == 200) {
        alert("Approved successfully")
        this.fileData = this.fileData.filter((row: any) => row.id !== this.idNo);
        this.showViewModal = false;
      }
      else {
        alert(data?.error)
        this.showViewModal = false;
      }
    })
  }
  rejectFile() {
    this.dcmsService.rejectFile(this.idNo, "FALSE").subscribe((data: any) => {
      if (data?.responseCode == 200) {
        alert("Rejected successfully")
        this.fileData = this.fileData.filter((row: any) => row.id !== this.idNo);
        this.showViewModal = false;
      }
      else {
        alert(data?.error)
        this.showViewModal = false;
      }
    })
  }
  closeViewMore() {
    this.showViewModal = false;
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.handleFile(file);
  }
  onFileDropped(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.handleFile(file);
    }
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
  handleFile(file: File) {
    this.errors = []; // reset
    if (!file) return;

    // File size check
    if (file.size > 140 * 1024) {
      this.errors.push('File size exceeds 140 KB limit!');
      return;
    }

    // File format check
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      this.errors.push('Invalid file format. Only Excel files are allowed.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const excelRows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      // 🔹 Validate first
      this.validateFileData(excelRows);

      if (this.errors.length === 0) {
        // Map to payload format
        const mappedRows = excelRows.map((row: any) => {
          return {
            employeeId: row["Employee-ID"] ? `E-${row["Employee-ID"]}` : "",
            name: row["Name"] || "",
            fatherName: row["FatherName"] || "",
            taskira: row["Taskira"] || "",
            gender: row["Gender"] || "",
            address: row["Address"] || "",
            city: row["City"] || "",
            province: row["Province"] || "",
            country: row["Country"] || "",
            provinceWorkLocation: row["Province (Work Location)"] || "",
            accountNumber: row["AccountNumber"] || "",
            descriptions: row["Descriptions"] || "",
            jobStatus: row["JobStatus"] || "Beneficiary",
            mobileNumber: row["MobileNumber"] || "", // ✅ unified column
            amount: row["Amount"] ? Number(row["Amount"]) : 0
          };
        });

        this.selectedFile = file;
        this.selectedFileName = file.name;
        this.payload = {
          fileName: this.selectedFileName,
          rows: mappedRows,
          corporateId: this.corporateId,
          // corporateId: "388"
        };
        console.log("corporateId handlefile():", this.corporateId);
        console.log("✅ Final Payload Ready:", this.payload);
      } else {
        this.selectedFile = null as any;
        this.selectedFileName = '';
        console.log('❌ File rejected due to validation errors:', this.errors);
      }
    };
    reader.readAsArrayBuffer(file);
  }
  validateFileData(data: any[]) {
    this.errors = [];
    const seenTaskira = new Set<string>();
    const seenMobile = new Set<string>();

    data.forEach((row, index) => {
      const rowNum = index + 2; // header is row 1

      // Taskira checks
      if (!row["Taskira"]) {
        this.errors.push(`Row ${rowNum}: Taskira is missing.`);
      } else {
        const taskira = String(row["Taskira"]).trim(); // ✅ ensure string for length check

        if (seenTaskira.has(taskira)) {
          this.errors.push(`Row ${rowNum}: Taskira "${taskira}" is duplicated.`);
        } else {
          seenTaskira.add(taskira);
        }

        // ✅ Length check (min 3, max 20)
        if (taskira.length < 3 || taskira.length > 20) {
          this.errors.push(
            `Row ${rowNum}: Taskira "${taskira}" must be between 3 and 20 characters.`
          );
        }
      }

      // Mobile Number checks
      if (!row["MobileNumber"]) {
        this.errors.push(`Row ${rowNum}: Mobile Number is missing.`);
      } else {
        const mobile = String(row["MobileNumber"]).trim();
        if (seenMobile.has(mobile)) {
          this.errors.push(`Row ${rowNum}: Mobile Number "${mobile}" is duplicated.`);
        } else {
          seenMobile.add(mobile);
        }
      }

      // Amount check
      if (row["Amount"] == null || isNaN(row["Amount"]) || Number(row["Amount"]) <= 0) {
        this.errors.push(`Row ${rowNum}: Amount must be greater than zero.`);
      }

      // Empty cell checks
      Object.keys(row).forEach((col) => {
        if (row[col] === null || row[col] === undefined || row[col] === '') {
          this.errors.push(`Row ${rowNum}: ${col} cannot be empty.`);
        }
      });
    });

    if (this.errors.length === 0) {
      console.log('✅ File is valid!');
    } else {
      console.log('❌ Validation errors:', this.errors);
    }
  }

  toggleDownloadMenu() {
    this.showDownloadMenu = !this.showDownloadMenu;
  }

  onSave() {
    console.log("this.payload before save:", this.payload);
    if (!this.payload) {
      alert("Please upload and process a valid file before saving!");
      return;
    }
    this.dcmsService.addBenFile(this.payload).subscribe((data: any) => {
      alert("File Upload Success")
    })
  }
}