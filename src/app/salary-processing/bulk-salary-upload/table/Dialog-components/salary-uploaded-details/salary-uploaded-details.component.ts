import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { ApiServiceService } from "../../../../../product/api-service/api-service.service";
import { RejectReasonDialogComponent } from "../reject-reason-dialog/reject-reason-dialog.component";
import { LoaderComponent } from "../../../../../loader/loader.component";
import { FormsModule } from "@angular/forms";
import { finalize } from "rxjs";

@Component({
  selector: "app-salary-uploaded-details",
  standalone: true,
  imports: [CommonModule, MatIconModule, LoaderComponent, FormsModule],
  templateUrl: "./salary-uploaded-details.component.html",
  styleUrl: "./salary-uploaded-details.component.css",
})
export class SalaryUploadedDetailsComponent {
  csvData!: string;
  completedStatus: any;
  searchTerm: any;
  showDialog: boolean = false;
  searchData: any = [];
    currentPage: number = 1;
  totalPages: number = 1;
    totalAmountUnProcessed: any;
  processedCount: any;
  unprocessedCount: any;
  totalAmountProcessed:any
  totalAmount:any
  clsoingBalance:any
  constructor(
    private dialogRef: MatDialogRef<SalaryUploadedDetailsComponent>,
    private apiService: ApiServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {
    console.log(data);
  }
  isLoading: boolean = false;
  userPrivileges: any;
  SalaryPrivelege: any;
  ngOnInit(): void {
    const privilegesData = sessionStorage.getItem("privileges");
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrivileges = this.userPrivileges[0];
      console.log(this.userPrivileges[0], "this.userPrevilages");
      console.log(this.userPrivileges, "this.userPrevilages1");

      for (let item of this.userPrivileges?.uiComponentPrivileges) {
        if (item?.component?.componentName == "Bulk Salary Process") {
          if (item.subComponent?.subComponentName == "Bulk Salary Process")
            this.SalaryPrivelege = item;
        }
      }
    }
    if (this.data?.id != 4) {
      this.isLoading = true;
      this.apiService
        .uploadedFileReport(this.data?.item?.id, this.data?.id)
        .subscribe({
          next: (res: any) => {
            if (res?.responseCode == 200) {
              this.isLoading = false;
              this.csvData = res?.data;
              this.rawData = res?.data;
              this.parsedData = this.parseCSV(this.csvData);
              this.compareData(this.rawData);
            } else {
              this.isLoading = false;
              console.log(res?.error);
            }
          },
          error: () => {
            this.isLoading = false;
            alert("Something Went Wrong.Try Again Later!!!");
          },
        });
    }
    
    if (this.data?.id == 4) {
      this.isLoading = true;
          this.apiService
        .completedSalaryTransactionReport(this.data?.item?.id)
        .subscribe({
          next: (res: any) => {
            console.log(res);
            if (res?.responseCode == 200) {
              this.isLoading = false;
              this.completedStatus = res?.data?.salaryProcesses;
              this.currentPage = 1; // Reset to first page
              this.updatePaginationNew(); //
    
              this.totalAmountProcessed = res?.data?.totalCreditAmount;
              this.totalAmountUnProcessed = this.completedStatus.reduce(
                (sum: any, item: any) => {
                  return item?.processed ? sum : sum + (item.amount || 0);
                },
                0
              );
              this.processedCount = res?.data?.totalCreditCount;
              this.unprocessedCount = this.completedStatus.filter(
                (item: any) => !item.processed
              ).length;
                           this.totalAmount =
                Number(res?.data?.totalCreditAmount ?? 0) +
                Number(this.totalAmountUnProcessed ?? 0);   
                this.clsoingBalance = res?.data?.corpClosingBal ?? 0;           
            } else {
              this.isLoading = false;
              alert(res?.error);
            }
          },
          error: () => {
            this.isLoading = false;
            alert('Something Went Wrong');
          },
        });
    }
  }
   itemsPerPage: number = 10;
  itemsPerPageNew: number = 7;
  displayedDataNew: any[] = [];

  updatePaginationNew() {
    // Calculate total pages
    this.totalPages = Math.ceil(
      this.completedStatus.length / this.itemsPerPageNew
    );

    // Calculate the start and end index for slicing the data
    const startIndex = (this.currentPage - 1) * this.itemsPerPageNew;
    const endIndex = startIndex + this.itemsPerPageNew;

    // Slice the completedStatus array to get data for the current page
    this.displayedDataNew = this.completedStatus.slice(startIndex, endIndex);
  }
  changePageNew(direction: string) {
    if (direction === 'next' && this.currentPage < this.totalPages) {
      this.currentPage++; // Move to the next page
    } else if (direction === 'prev' && this.currentPage > 1) {
      this.currentPage--; // Move to the previous page
    }
    this.updatePaginationNew(); // Update the paginated data
  }
  parsedData: any[] = [];

  parseCSV(csv: string): any[] {
    const lines = csv.split("\n");
    const headers = lines[0].trim().split(",");
    const rows = lines.slice(1);

    return rows.map((row) => {
      const values = row.trim().split(",");
      let obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      return obj;
    });
  }

  closeDialog() {
    this.dialogRef.close(true);
  }
  close() {
    this.showDialog = false;
  }
  confirmDialog() {
    let dialogRef = this.dialog
      .open(RejectReasonDialogComponent, {
        width: "500px",
        height: "190px",
        panelClass: "custom-dialog-container",
        data: this.data?.item?.id,
        disableClose: true,
      })
      .afterClosed()
      .subscribe((res) => {
        if (res == undefined) {
          this.dialogRef.close();
        }
      });
  }

  authorize() {
    this.isLoading = true;
    this.apiService.approveUploadedFiles(this.data?.item?.id).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res?.responseCode == 200) {
          this.isLoading = false;
          alert("Approved Successfully");
          this.dialogRef.close();
        } else {
          this.isLoading = false;
          alert(res?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something Went Wrong");
      },
    });
  }

  comparisonResults: any[] = [];
  rawData: any;

  compareData(csvData: string) {
    const rows = csvData.split(/\r?\n/).filter((row) => row.trim() !== ""); // Split rows by either \n or \r\n and filter out empty rows
    const headers = rows[0].split(","); // Extract headers

    const kycColumns = ["KYC_NAME", "KYC_PHONE", "KYC_EMAIL", "WALLET_STATUS"];
    const actualColumns = ["name", "account", "amount", "email", "phone#"];

    // Iterate over the rows starting from the second row
    rows.slice(1).forEach((row) => {
      const columns = row.split(",");

      // Check if the row has the expected number of columns
      if (columns.length < headers.length) return; // Skip if incomplete

      // Extract the left side (KYC data)
      const kycData = kycColumns.map(
        (col) => columns[headers.indexOf(col)] || ""
      ); // Default to empty string if missing
      // Extract the right side (actual data)
      const actualData = actualColumns.map(
        (col) => columns[headers.indexOf(col)] || ""
      );

      const [kycName, kycPhone, kycEmail, walletStatus] = kycData;
      const [
        actualName,
        actualAccount,
        actualAmount,
        actualEmail,
        actualPhone,
      ] = actualData;

      // Compare fields
      const nameMismatch = kycName !== actualName;
      const emailMismatch = kycEmail !== actualEmail;
      const phoneMismatch = kycPhone !== actualPhone;

      // Handle wallet status: display if not empty, otherwise show as empty
      const walletStatusDisplay = walletStatus ? walletStatus : "";

      // Push results to the comparison array
      this.comparisonResults.push({
        kycName,
        kycPhone,
        kycEmail,
        walletStatus: walletStatusDisplay, // Show the wallet status only if present
        actualName,
        actualAccount,
        actualAmount,
        actualEmail,
        actualPhone,
        nameMismatch,
        emailMismatch,
        phoneMismatch,
      });
    });
  }

  selectAll: boolean = false;
  selectAllSearch: boolean = false;
  selectedRows: any[] = [];
  selectedRowsForSearch: any[] = [];

  toggleSelectAll() {
    this.selectedRows = []; // reset

    this.completedStatus.forEach((row: any) => {
      if (row.processed === true) {
        row.selected = this.selectAll;
        if (this.selectAll) {
          this.selectedRows.push(row);
        }
      }
    });

    console.log("Selected Rows:", this.selectedRows);
  }

  onRowSelectChange(row: any) {
    if (row.selected) {
      // ADD to array only if not already added
      const exists = this.selectedRows.some((item) => item.id === row.id);
      if (!exists) {
        this.selectedRows.push(row); // push FULL row, not just ID
      }
    } else {
      // REMOVE from array
      this.selectedRows = this.selectedRows.filter(
        (item) => item.id !== row.id
      );
    }

    // Update selectAll only for processed rows
    const allProcessedSelected = this.completedStatus
      .filter((r: any) => r.processed === true)
      .every((r: any) => r.selected === true);

    this.selectAll = allProcessedSelected;

    console.log("Selected Rows:", this.selectedRows);
    console.log("Selected Rows Length:", this.selectedRows.length);
  }

  onRowSelectChangeForSearch(row: any) {
    if (row.selected) {
      const exists = this.selectedRowsForSearch.some(
        (item) => item.id === row.id
      );
      if (!exists) {
        this.selectedRowsForSearch.push(row);
      }
    } else {
      this.selectedRowsForSearch = this.selectedRowsForSearch.filter(
        (item) => item.id !== row.id
      );
    }

    console.log("Selected from SEARCH:", this.selectedRowsForSearch);
  }

  submit() {
    const mergedSelections = [
      ...this.selectedRows,
      ...this.selectedRowsForSearch,
    ];

    const ids = mergedSelections.map((item) => item?.id);

    console.log(ids);

    this.isLoading = true;
    this.apiService.selectiveReversal(ids).pipe(finalize(() => this.isLoading = false)).subscribe({
      next: (res: any) => {
        if (res?.responseCode == 200) {
          this.isLoading = false;
          alert(res?.data);
          this.dialog.closeAll();
        } else {
          this.isLoading = false;
          alert(res?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something Went Wrong");
      },
    });
  }

  filterTable() {
    let data = {
      // fileStatusId: 302,
      fileStatusId: this.completedStatus[0]?.fileStatusId,
      keyword: this.searchTerm,
    };
    this.isLoading = true;
    this.apiService.searchSalaryData(data).pipe(finalize(() => this.isLoading = false)).subscribe({
      next: (res: any) => {
        if (res?.responseCode == 200) {
          this.isLoading = false;
          this.searchData = res?.data;
          this.showDialog = true;
          // alert(res?.data);
          // this.dialog.closeAll();
        } else {
          this.isLoading = false;
          alert(res?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something Went Wrong");
      },
    });
  }

  // selectedRowFromSearch: any = null;
 confirmSelectedRow() {
  this.selectedRowsForSearch.forEach((modalRow) => {
    // Find row in MAIN table based on id
    const mainRow = this.completedStatus.find(
      (item: any) => item.id === modalRow.id
    );

    if (mainRow) {
      // Set selected on MAIN row, not modal row
      mainRow.selected = true;

      // Add to selectedRows only if not already added
      if (!this.selectedRows.some((item) => item.id === mainRow.id)) {
        this.selectedRows.push(mainRow);
      }
    }
  });

  this.selectedRowsForSearch = [];
  this.showDialog = false;
}

}
