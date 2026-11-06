import { ChangeDetectorRef, Component } from "@angular/core";
import { GlService } from "../gl.service";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { NgFor, NgIf, NgClass, CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
@Component({
  selector: "app-balance-sheet",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgFor,
    NgIf,
    NgClass,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: "./balance-sheet.component.html",
  styleUrl: "./balance-sheet.component.css",
})
export class BalanceSheetComponent {
  filterForm: FormGroup = new FormGroup({});
  showMenu: boolean = false;
  balanceForm: FormGroup;
  userPrivileges: any;
  userPrevilages1: any;
  privilege: any;
  assetsList: any[] = [];
  liabilitySections: any[] = [];
  assetSections: any;
  totalAmount: number | null = null;
  incomeSections: any;
  expenseSections: any;
  BalanceSheetData: any = {
    ASSET: [],
    LIABILITY: [],
    INCOME: [],
    EXPENSE: [],
  };
  subAcc: any;
  selectedItem: any = null;
  AccnoSubtable: any;
  balanceSheetAccStatement: any;
  totalSubTableBalance: any;
  subAccNO: any;
  currentPageSub = 0;
  totalPageSub = 0;
  pageSize = 500;
  totalElements = 0;
  subAccountDetails: any[] = [];
  totalElementSub: any;
  pageSizeSub: any;
  subAccountNew: any;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private glService: GlService,
    private fb: FormBuilder
  ) {
    this.balanceForm = this.fb.group({
      selectedDate: [""],
    });
    this.filterForm = this.fb.group({
      from: [""],
      to: [""],
      accountNo: [""],
    });
  }
  
  ngOnInit() {
    const privilegesData = sessionStorage.getItem("privileges");
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
    // this.loadSubAccountData(0);
  }
  callDate() {
    const page = 0;
    const size = 500;
    const selectedDate = this.balanceForm.get("selectedDate")?.value;

    this.glService.getBalanceSheetData(page, size, selectedDate).subscribe(
      (res: any) => {
        const data = res?.data || [];

        const groupWithTotals = (items: any[]) => {
          const map: any = {};
          items.forEach((item) => {
            const key = item.headDescription || "Others";
            if (!map[key]) {
              map[key] = { key, items: [], total: 0 };
            }
            map[key].items.push(item);
            map[key].total += item.runningBalance || 0;
          });
          return Object.values(map);
        };

        this.BalanceSheetData = {
          ASSET: groupWithTotals(data.filter((d: any) => d.type === "ASSET")),
          LIABILITY: groupWithTotals(
            data.filter((d: any) => d.type === "LIABILITY")
          ),
          INCOME: groupWithTotals(data.filter((d: any) => d.type === "INCOME")),
          EXPENSE: groupWithTotals(
            data.filter((d: any) => d.type === "EXPENSE")
          ),
        };

        console.log("BalanceSheetData with totals:", this.BalanceSheetData);
      },
      (err) => console.error(err)
    );
  }
  groupBy(array: any[], key: string) {
    if (!array) return [];
    const grouped = array.reduce((acc: any, obj: any) => {
      const property = obj[key];
      if (!acc[property]) acc[property] = [];
      acc[property].push(obj);
      return acc;
    }, {});
    return Object.keys(grouped).map((k) => ({ key: k, items: grouped[k] }));
  }
  toggleSubAccount(item: any) {
    if (this.selectedItem === item) {
      this.selectedItem = null; // collapse if clicked again
      this.subAccountDetails = [];
      this.subAccountNew = item.subAccountNo;
    } else {
      this.selectedItem = item;
      this.BalanceSheetBySubAc(item); // load subAccountDetails for this row
      this.subAccountNew = item.subAccountNo;
    }
  }
  calculateTotalBalance() {
    this.totalSubTableBalance = this.subAccountDetails.reduce(
      (sum: any, row: any) => {
        return sum + (parseFloat(row.runningBalance) || 0);
      },
      0
    );
  }
  BalanceSheetBySubAc(item: any) {
    console.log("Clicked BalanceSheetBySubAc fn subDescription:", item);
    const selectedDate = this.balanceForm.get("selectedDate")?.value;
    const page = 0;
    const size = 500;
    this.subAccNO = item?.subAccountNo;
    this.subAccountNew = item.subAccountNo;
    this.glService
      .getBalanceSheetBySubAc(
        item?.subAccountNo,
       selectedDate,
        page,
        size
      )
      .subscribe((data: any) => {
        this.subAccountDetails = data?.data;
        this.totalElementSub = data?.totalElements;
        this.pageSizeSub = data?.pageSize;
        this.totalPageSub = Math.ceil(this.totalElementSub / this.pageSizeSub);
        this.calculateTotalBalance();
      });
  }

  loadSubAccountData(page: number): void {
    const selectedDate = this.balanceForm.get("selectedDate")?.value;
    this.glService
      .getBalanceSheetBySubAc(this.subAccNO, selectedDate, page, this.pageSize)
      .subscribe((res: any) => {
        this.subAccountDetails = res?.data || [];

        // Pagination values from backend
        this.currentPageSub = res?.currentPage ?? page;
        this.totalPageSub = res?.totalPages ?? 0;
        this.pageSize = res?.pageSize ?? this.pageSize;
        this.totalElements = res?.totalElements ?? 0;
      });
  }

  onExpandedNext(): void {
    if (this.currentPageSub + 1 < this.totalPageSub) {
      this.loadSubAccountData(this.currentPageSub + 1);
    }
  }

  onExpandedPrev(): void {
    if (this.currentPageSub > 0) {
      this.loadSubAccountData(this.currentPageSub - 1);
    }
  }

  onChangeAccnoSubtable($event: any) {
    this.AccnoSubtable = $event.target.value;
    const from = this.filterForm.get("from")?.value;
    const to = this.filterForm.get("to")?.value;
    console.log("from bb", from);
    console.log("to bb", to);
    console.log("AccnoSubtable", this.AccnoSubtable);
    this.glService
      .getBalanceSheetAccStatementWithoutPaginationDate(this.AccnoSubtable, from, to)
      .subscribe((data: any) => {
        this.balanceSheetAccStatement = data;
        this.subAccountDetails = this.balanceSheetAccStatement;
      });
  }
  getReadableGroupTotal(key: string): string {
    if (!key) return "";
    const map: any = {
      Current_Assets: "Current Assets",
      "Non Current Assets": "Non Current Assets",
      "Current Liabilities": "Current Liabilities",
      "Other Liabilities": "Other Liabilities",
      "Equity Capital": "Equity Capital",
    };
    return map[key] || key;
  }
  makePdf() {
    const doc = new jsPDF();
    let y = 15;

    const pageHeight = doc.internal.pageSize.height - 20;

    const addLine = (
      text: string,
      x: number,
      increase: number,
      bold = false
    ) => {
      if (y > pageHeight) {
        doc.addPage();
        y = 15;
      }
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.text(text, x, y);
      y += increase;
    };

    // 🔵 TITLE
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("ABMMC - Balance Sheet Report", 14, y);
    y += 10;

    for (const section of ["ASSET", "LIABILITY", "INCOME", "EXPENSE"]) {
      const groups = this.BalanceSheetData[section];
      if (!groups?.length) continue;

      // 🔵 SECTION HEADER BAR
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(30, 64, 175);
      doc.rect(14, y, 180, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.text(section, 16, y + 6);
      y += 14;

      doc.setTextColor(0);

      for (const group of groups) {
        if (!group.key) continue;

        // GROUP NAME
        addLine(group.key, 16, 6, true);

        group.items?.forEach((item: any) => {
          if (!item.subDescription) return;

          addLine(item.subDescription, 20, 6);
          doc.text((item.runningBalance ?? 0).toFixed(2), 180, y - 6, {
            align: "right",
          });
        });

        // GROUP TOTAL
        if (group.total != null) {
          const readable = this.getReadableGroupTotal(group.key);
          addLine("Total " + readable, 20, 8, true);
          doc.text(group.total.toFixed(2), 180, y - 8, { align: "right" });
        }

        y += 4;
      }
    }

    doc.save("BalanceSheet.pdf");
  }
  exportToExcel() {
    const wb = XLSX.utils.book_new();
    for (const section of ["ASSET", "LIABILITY", "INCOME", "EXPENSE"]) {
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
          wsData.push([
            "Total " + this.getReadableGroupTotal(group.key),
            group.total,
          ]);
        }
        wsData.push([]); // empty row between groups
      }
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, section);
    }
    // Generate Excel file as array buffer
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    // Create blob
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    // Simple download without FileSaver
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "BalanceSheet.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  subAccountDetailsNew: any[] = [];
  fromDate: any;
  toDate: any;
  AccnoSubtableNew: any;

  // makeWalletPdf() {
  //   const filterFormValues = this.filterForm.value;

  //   this.fromDate = filterFormValues.from;
  //   this.toDate = filterFormValues.to;
  //   this.AccnoSubtableNew = this.AccnoSubtable;

  //   const hasDate = !!this.fromDate && !!this.toDate;
  //   const hasSubAcc = !!this.AccnoSubtableNew;

  //   let apiCall$;
  //   let isFullExport = false;

  //   // ✅ API SELECTION (SAME AS EXCEL)
  //   if (!hasDate && !hasSubAcc) {
  //     isFullExport = true;
  //     apiCall$ = this.glService.getBalanceSheetBySubAcWithoutPagination(
  //       this.subAccountNew
  //     );
  //   } else {
  //     apiCall$ =
  //       this.glService.getBalanceSheetAccStatementWithoutPaginationDate(
  //         this.AccnoSubtable,
  //         this.fromDate,
  //         this.toDate
  //       );
  //   }

  //   apiCall$.subscribe({
  //     next: (res: any[]) => {
  //       if (!res || res.length === 0) {
  //         alert("No data available to export");
  //         return;
  //       }

  //       const doc = new jsPDF("l", "mm", "a4");
  //       doc.setFontSize(14);
  //       doc.text("Account Summary", 14, 12);

  //       // ✅ BUILD COLUMNS DYNAMICALLY
  //       const columns: any[] = [
  //         { header: "ACCOUNT NAME", dataKey: "accName" },
  //         { header: "ACCOUNT NUMBER", dataKey: "accountNo" },
  //         { header: "TOTAL DEBIT", dataKey: "totalDebit" },
  //         { header: "TOTAL CREDIT", dataKey: "totalCredit" },
  //         { header: "MOD BALANCE", dataKey: "runningBalance" },
  //       ];

  //       if (isFullExport) {
  //         columns.push(
  //           { header: "HEAD ACCOUNT NO", dataKey: "headAccountNo" },
  //           { header: "SUB ACCOUNT NO", dataKey: "subAccountNo" }
  //         );
  //       }

  //       // ✅ BUILD ROWS
  //       const rows = res.map((row: any) => {
  //         const baseRow: any = {
  //           accName: row.accName || "N/A",
  //           accountNo: row.accountNo || row.accNo || "N/A",
  //           totalDebit: row.totalDebit || row.credit || 0,
  //           totalCredit: row.totalCredit || row.debit || 0,
  //           runningBalance: row.runningBalance || 0,
  //         };

  //         if (isFullExport) {
  //           baseRow.headAccountNo = row.headAccountNo || "N/A";
  //           baseRow.subAccountNo = row.subAccountNo || "N/A";
  //         }

  //         return baseRow;
  //       });

  //       autoTable(doc, {
  //         columns,
  //         body: rows,
  //         startY: 20,
  //         theme: "grid",
  //         styles: {
  //           fontSize: 8,
  //           cellPadding: 3,
  //         },
  //         headStyles: {
  //           fillColor: [10, 54, 90],
  //           textColor: 255,
  //         },
  //       });

  //       doc.save("BalanceSheet.pdf");
  //     },
  //     error: (err) => {
  //       console.error("PDF export error:", err);
  //       alert("Error while generating PDF");
  //     },
  //   });
  // }

  makeWalletPdf() {
    const filterFormValues = this.filterForm.value;

    this.fromDate = filterFormValues.from;
    this.toDate = filterFormValues.to;
    this.AccnoSubtableNew = this.AccnoSubtable;

    const hasDate = !!this.fromDate && !!this.toDate;
    const hasSubAcc = !!this.AccnoSubtableNew;
    const selectedDate = this.balanceForm.get("selectedDate")?.value;

    let apiCall$;
    let isFullExport = false;

    if (!hasDate && !hasSubAcc) {
      isFullExport = true;
      apiCall$ = this.glService.getBalanceSheetBySubAcWithoutPagination(
        this.subAccountNew,
        selectedDate
      );
    } else {
      apiCall$ =
        this.glService.getBalanceSheetAccStatementWithoutPaginationDate(
          this.AccnoSubtable,
          this.fromDate,
          this.toDate
        );
    }

    apiCall$.subscribe({
      next: (res: any[]) => {
        if (!res || res.length === 0) {
          alert("No data available to export");
          return;
        }

        const doc = new jsPDF("l", "mm", "a4");
        doc.setFontSize(14);
        doc.text("Account Summary", 14, 12);

        // ✅ BUILD COLUMNS DYNAMICALLY
        const columns: any[] = [
          { header: "ACCOUNT NAME", dataKey: "accName" },  
          { header: "COMPANY NAME", dataKey: "companyName" },
          { header: "ACCOUNT NUMBER", dataKey: "accountNo" },
          { header: "TOTAL DEBIT", dataKey: "totalDebitFormatted" },
          { header: "TOTAL CREDIT", dataKey: "totalCreditFormatted" },
          { header: "MOD BALANCE", dataKey: "runningBalanceFormatted" },
        ];

        if (isFullExport) {
          columns.push(
            { header: "HEAD ACCOUNT NO", dataKey: "headAccountNo" },
            { header: "SUB ACCOUNT NO", dataKey: "subAccountNo" }
          );
        }

        // ✅ BUILD ROWS WITH FORMATTED NUMBERS
        const rows = res.map((row: any) => {
          
          // ✅ FORMAT NUMBER FUNCTION - AVOIDS SCIENTIFIC NOTATION
          const formatNumber = (num: any): string => {
            if (num === null || num === undefined) return "0";
            const n = Number(num);
            if (isNaN(n)) return "0";
            
            // For very large numbers, format with commas
            if (Math.abs(n) >= 1000000) {
              return n.toLocaleString('en-IN', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
              });
            }
            
            // For regular numbers
            return n.toLocaleString('en-IN', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            });
          };

          const baseRow: any = {
            accName: row.accName || "N/A",
            companyName: row.companyName || "N/A",
            accountNo: row.accountNo || row.accNo || "N/A",
            // Original values (if needed)
            totalDebit: row.totalDebit || row.credit || 0,
            totalCredit: row.totalCredit || row.debit || 0,
            runningBalance: row.runningBalance || 0,
            // ✅ FORMATTED VALUES FOR DISPLAY
            totalDebitFormatted: formatNumber(row.totalDebit || row.credit || 0),
            totalCreditFormatted: formatNumber(row.totalCredit || row.debit || 0),
            runningBalanceFormatted: formatNumber(row.runningBalance || 0),
          };

          if (isFullExport) {
            baseRow.headAccountNo = row.headAccountNo || "N/A";
            baseRow.subAccountNo = row.subAccountNo || "N/A";
          }

          return baseRow;
        });

       autoTable(doc, {
          columns,
          body: rows,
          startY: 20,
          theme: "grid",
          styles: {
            fontSize: 8,
            cellPadding: 3,
          },
          headStyles: {
            fillColor: [10, 54, 90],
            textColor: 255,
          },
        });

        doc.save("BalanceSheet.pdf");
      },
      error: (err) => {
        console.error("PDF export error:", err);
        alert("Error while generating PDF");
      },
    });
  }
  
  exportWalletToExcel() {
    const filterFormValues = this.filterForm.value;

    this.fromDate = filterFormValues.from;
    this.toDate = filterFormValues.to;
    this.AccnoSubtableNew = this.AccnoSubtable;
    const hasDate = !!this.fromDate && !!this.toDate;
    const hasSubAcc = !!this.AccnoSubtableNew;
    const selectedDate = this.balanceForm.get("selectedDate")?.value;

    let apiCall$;
    let isFullExport = false;

    if (!hasDate && !hasSubAcc) {
      isFullExport = true;
      apiCall$ = this.glService.getBalanceSheetBySubAcWithoutPagination(
        this.subAccountNew,
        selectedDate
      );
    } else {
      apiCall$ =
        this.glService.getBalanceSheetAccStatementWithoutPaginationDate(
          this.AccnoSubtable,
          this.fromDate,
          this.toDate
        );
    }

    apiCall$.subscribe({
      next: (res: any[]) => {
        if (!res || res.length === 0) {
          alert("No data available to export");
          return;
        }

        const excelData = res.map((row: any) => {
          // ✅ Convert numbers to STRINGS to prevent scientific notation
          const formatNumber = (num: any): string => {
            if (num === null || num === undefined) return "0";
            const n = Number(num);
            if (isNaN(n)) return "0";
            // Format as string without scientific notation
            return n.toLocaleString('fullwide', { useGrouping: false });
          };

          const baseRow: any = {
            "ACCOUNT NAME": row.accName || "N/A",
            "COMPANY NAME": row.companyName || "N/A",
            "ACCOUNT NUMBER": row.accountNo || row.accNo || "N/A",
            "TOTAL DEBIT": formatNumber(row.totalDebit || row.credit || 0),
            "TOTAL CREDIT": formatNumber(row.totalCredit || row.debit || 0),
            "MOD BALANCE": formatNumber(row.runningBalance || 0),
          };

          if (isFullExport) {
            baseRow["HEAD ACCOUNT NO"] = row.headAccountNo || "N/A";
            baseRow["SUB ACCOUNT NO"] = row.subAccountNo || "N/A";
          }

          return baseRow;
        });

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        
        // ✅ ADD THIS: Set column format to text for numeric columns
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        for (let C = range.s.c; C <= range.e.c; C++) {
          const address = XLSX.utils.encode_col(C) + "1";
          if (worksheet[address]) {
            const header = worksheet[address].v;
            // Check if this column contains numbers
            if (header === "TOTAL DEBIT" || header === "TOTAL CREDIT" || header === "MOD BALANCE") {
              for (let R = range.s.r + 1; R <= range.e.r; R++) {
                const cellAddress = XLSX.utils.encode_cell({r: R, c: C});
                if (worksheet[cellAddress]) {
                  // Force cell to be text
                  worksheet[cellAddress].t = 's'; // 's' for string type
                }
              }
            }
          }
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Wallet Summary");

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });

        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, "BalanceSheet.xlsx");
      },
      error: (err) => {
        console.error("Error fetching data for Excel export:", err);
      },
    });
  }

   formatNumber (num: any): string  {
  if (num === null || num === undefined) return "0";
  const n = Number(num);
  if (isNaN(n)) return "0";
  
  return n.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
};
}
