import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { GlService } from '../gl.service';
import { Router } from '@angular/router';
import { Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf, NgClass, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-profit-and-loss',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ReactiveFormsModule, FormsModule, CommonModule, MatIconModule],
  templateUrl: './profit-and-loss.component.html',
  styleUrl: './profit-and-loss.component.css'
})
export class ProfitAndLossComponent {
  showMenu: boolean = false
  balanceForm: FormGroup;
  filterForm: FormGroup = new FormGroup({});
  userPrivileges: any;
  userPrevilages1: any;
  privilege: any;
  assetsList: any[] = [];
  liabilitySections: any[] = [];
  assetSections: any
  totalAmount: number | null = null;
  incomeSections: any;
  expenseSections: any;
  BalanceSheetData: any = {
    ASSET: [],
    LIABILITY: [],
    INCOME: [],
    EXPENSE: []
  };
  subAcc: any;
  subAccountDetails: any;
  selectedItem: any = null;
  AccnoSubtable: any;
  balanceSheetAccStatement: any;
  totalSubTableBalance: any;
  totalIncome: number = 0;
  totalExpense: number = 0;
  netProfit: number = 0;
  constructor(private router: Router, private cdr: ChangeDetectorRef,
    private glService: GlService,
    private fb: FormBuilder) {
    this.balanceForm = this.fb.group({
      selectedDate: ['']
    });
    this.filterForm = this.fb.group({
      from: [''],
      to: [''],
      accountNo: ['']
    });
  }
  fromDate: string = '';
  toDate: string = '';
  selectedAccount: string = '';
  filteredSubAccountDetails: any[] = [];
  ngOnInit() {
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "Transaction and GL") {
          if (item.subComponent?.subComponentName == "Balance Sheet")
            this.privilege = item;
        }
      }
    }
  }
  callDate() {
    const page = 0;
    const size = 500;
    const selectedDate = this.balanceForm.get('selectedDate')?.value;

    this.glService.getPLdata(page, size, selectedDate)
      .subscribe((res: any) => {
        const data = res?.data || [];

        const groupWithTotals = (items: any[]) => {
          const map: any = {};
          items.forEach(item => {
            const key = item.headDescription || 'Others';
            if (!map[key]) {
              map[key] = { key, items: [], total: 0 };
            }
            map[key].items.push(item);
            map[key].total += item.runningBalance || 0;
          });
          return Object.values(map);
        };

        this.BalanceSheetData = {
          ASSET: groupWithTotals(data.filter((d: any) => d.type === 'ASSET')),
          LIABILITY: groupWithTotals(data.filter((d: any) => d.type === 'LIABILITY')),
          INCOME: groupWithTotals(data.filter((d: any) => d.type === 'INCOME')),
          EXPENSE: groupWithTotals(data.filter((d: any) => d.type === 'EXPENSE')),
        };
        // Calculate totals
        this.totalIncome = data
          .filter((d: any) => d.type === 'INCOME')
          .reduce((sum: number, item: any) => sum + (Number(item.runningBalance) || 0), 0);

        this.totalExpense = data
          .filter((d: any) => d.type === 'EXPENSE')
          .reduce((sum: number, item: any) => sum + (Number(item.runningBalance) || 0), 0);


        this.netProfit = Math.abs(this.totalIncome) - Math.abs(this.totalExpense);
        console.log('exp:', Math.abs(this.totalExpense));
        console.log('inc:', Math.abs(this.totalIncome));
        console.log('Bnet pl:', this.netProfit);
        console.log('BalanceSheetData with totals:', this.BalanceSheetData);
      }, err => console.error(err));
  }
  groupBy(array: any[], key: string) {
    if (!array) return [];
    const grouped = array.reduce((acc: any, obj: any) => {
      const property = obj[key];
      if (!acc[property]) acc[property] = [];
      acc[property].push(obj);
      return acc;
    }, {});
    return Object.keys(grouped).map(k => ({ key: k, items: grouped[k] }));
  }
  toggleSubAccount(item: any) {
    if (this.selectedItem === item) {
      this.selectedItem = null; // collapse if clicked again
      this.subAccountDetails = [];
    } else {
      this.selectedItem = item;
      this.BalanceSheetBySubAc(item); // load subAccountDetails for this row
    }
  }
  calculateTotalBalance() {
    this.totalSubTableBalance = this.subAccountDetails.reduce((sum: any, row: any) => {
      return sum + (parseFloat(row.runningBalance) || 0);
    }, 0);
  }
  BalanceSheetBySubAc(item: any) {
    const selectedDate = this.balanceForm.get('selectedDate')?.value;
    const page = 0;
    const size = 500;
    this.glService.getBalanceSheetBySubAc(item?.subAccountNo, selectedDate, page, size).subscribe((data: any) => {
      this.subAccountDetails = data?.data
      console.log(" this.subAccountDetails", this.subAccountDetails)
      this.calculateTotalBalance();
    })
  }
  onChangeAccnoSubtable($event: any) {
    this.AccnoSubtable = $event.target.value;
    const from = this.filterForm.get('from')?.value
    const to = this.filterForm.get('to')?.value
    console.log("from bb", from)
    console.log("to bb", to)
    this.glService.getBalanceSheetAccStatement(this.AccnoSubtable, from, to).subscribe((data: any) => {
      this.balanceSheetAccStatement = data?.data
      this.subAccountDetails = this.balanceSheetAccStatement
    })
  }
  resetFilters() {
    this.fromDate = '';
    this.toDate = '';
    this.selectedAccount = '';
    // this.filteredSubAccountDetails = this.subAccountDetails;
  }
  makePdf() {
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('ABMMC - Balance Sheet Report', 14, y);
    y += 10;
    for (const section of ['ASSET', 'LIABILITY', 'INCOME', 'EXPENSE']) {
      const groups = this.BalanceSheetData[section];
      if (!groups?.length) continue; // skip empty sections
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(30, 64, 175);
      doc.rect(14, y, 180, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.text(section, 16, y + 6);
      y += 10;
      for (const group of groups) {
        if (!group.key || !group.items?.length) continue; // skip undefined group or empty items
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0);
        doc.text(group.key, 16, y);
        y += 6;

        doc.setFont('helvetica', 'normal');
        group.items.forEach((item: any) => {
          if (!item.subDescription) return; // skip undefined subDescription
          const balance = item.runningBalance ?? 0;
          doc.text(item.subDescription, 20, y);
          doc.text(balance.toFixed(2), 160, y, { align: 'right' });
          y += 6;
        });
        if (group.total != null) {
          doc.setFont('helvetica', 'bold');
          doc.text('Total', 20, y);
          doc.text(group.total.toFixed(2), 160, y, { align: 'right' });
          y += 8;
        }
      }
      y += 6; // space after section
    }
    doc.save('Profit&Loss.pdf');
  }
  exportToExcel() {
    const wb = XLSX.utils.book_new();
    for (const section of ['ASSET', 'LIABILITY', 'INCOME', 'EXPENSE']) {
      const groups = this.BalanceSheetData[section];
      if (!groups?.length) continue;
      const wsData: any[] = [];
      wsData.push([section]); // Section header
      for (const group of groups) {
        if (!group.key || !group.items?.length) continue;
        wsData.push([group.key]); // Group header
        // Items
        group.items.forEach((item: any) => {
          if (!item.subDescription) return;
          wsData.push([item.subDescription, item.runningBalance ?? 0]);
        });
        // Total row
        if (group.total != null) {
          wsData.push(['Total', group.total]);
        }
        wsData.push([]); // empty row between groups
      }
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, section);
    }
    // Generate Excel file as array buffer
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    // Create blob
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    // Simple download without FileSaver
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Profit&Loss.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }
  makeWalletPdf() {
    try {
      // Select the first <table> inside the element with id="tableContainer"
      const table: any = document.querySelector('#tableContainer table');
      if (!table) {
        alert('No table found!');
        return;
      }

      const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation
      doc.setFontSize(14);
      doc.text('Account Summary', 14, 12);

      autoTable(doc, {
        html: table,
        startY: 20,
        headStyles: { fillColor: [10, 54, 90], textColor: 255 },
        theme: 'grid',
        styles: { fontSize: 8 },
      });
      doc.save('Profit&Loss.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error while generating PDF. Check console for details.');
    }
  }
  exportWalletToExcel() {
    const data = this.subAccountDetails.map((row: any) => ({
      'ACCOUNT NAME': row.accName || 'N/A',
      'ACCOUNT NUMBER': row.accountNo || row.accNo || 'N/A',
      'TOTAL DEBIT': row.totalDebit || row.credit || 0,
      'TOTAL CREDIT': row.totalCredit || row.debit || 0,
      'HEAD ACCOUNT NO': row.headAccountNo || 'N/A',
      'SUB ACCOUNT NO': row.subAccountNo || 'N/A',
      'MOD BALANCE': row.runningBalance || 0
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Wallet Summary');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(blob, 'Profit&Loss.xlsx');
  }
}
