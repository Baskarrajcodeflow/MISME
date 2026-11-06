import { Component } from "@angular/core";
import { ApiServiceService } from "../../product/api-service/api-service.service";
import { CommonModule } from "@angular/common";
import { LoaderComponent } from "../../loader/loader.component";
import { FormsModule } from "@angular/forms";
import { concatMap, finalize } from "rxjs/operators";
import { DataSharingService } from "../../product/dataSharing/data-sharing.service";
import { Router } from "@angular/router";
import { KycModuleService } from "../../kyc/kyc/kyc-module.service";

@Component({
  selector: "app-list-closed-accounts",
  standalone: true,
  imports: [CommonModule, LoaderComponent, FormsModule],
  templateUrl: "./list-closed-accounts.component.html",
  styleUrl: "./list-closed-accounts.component.css",
})
export class ListClosedAccountsComponent {
  currentPage = 0;
  pageSize = 20;
  closedAccounts: any[] = [];
  isLoading: boolean = false;
  isLastPage = false;
  searchBy: any;
  searchValue: any;
  kycType: any;
  accountStatementDetails: any;
  openingBalanceNew: any;
  totalCredit: number = 0;
  totalDebit: number = 0;
  totalCreditCount: number = 0;
  totalDebitCount: number = 0;
  agentSummaryReport: any[] = [];
  closingBalNew: any;
  paginatedData: any[] = [];
  constructor(
    private apiService: ApiServiceService,
    private dataSharing: DataSharingService,
    private router: Router,
    private KycService: KycModuleService,
  ) {}

  ngOnInit(): void {
    this.getClosedAccounts(this.currentPage, this.pageSize);
  }

  getClosedAccounts(page: any, size: any) {
    this.isLoading = true;
    this.apiService.getClosedAccounts(page, size).subscribe({
      next: (response) => {
        if (response?.responseCode == 200) {
          this.isLoading = false;
          this.closedAccounts = response.data;
          this.isLastPage = this.closedAccounts.length < this.pageSize;
          console.log(response);
        } else {
          this.isLoading = false;
          console.log(response);
        }
      },
      error: () => {
        this.isLoading = false;
        console.log("An error occurred while fetching closed accounts.");
      },
    });
  }

  nextPage() {
    if (!this.isLastPage) {
      this.currentPage++;
      this.getClosedAccounts(this.currentPage, this.pageSize);
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getClosedAccounts(this.currentPage, this.pageSize);
    }
  }

  searchClosedAccounts() {
    let body = {
      filterType: this.searchBy,
      filterValues: [this.searchValue],
      page: this.currentPage,
      pageSize: this.pageSize,
      kycType: this.kycType,
      sort: "DESC",
    };
    this.apiService.searchClosedAccounts(body).subscribe({
      next: (response) => {
        if (response?.responseCode == 200) {
          this.closedAccounts = response.data;
          this.isLastPage = this.closedAccounts.length < this.pageSize;
        }
      },
      error: () => {
        console.log("An error occurred while searching closed accounts.");
      },
    });
  }

  showStatementModal = false;
  accountWalletNumber: any;
  openStatementModal(event: any) {
    this.accountWalletNumber = event;
    this.showStatementModal = true;
  }

  fromDate: any;
  toDate: any;
  getAccountStatement() {
    this.currentPageNo = 1; // Reset to first page on new search
    let fromDate = this.fromDate;
    let toDate = this.toDate;

    let fromDateTime: any;
    let toDateTime: any;

    // console.log(typeof(fromDateTime))
    // console.log(fromTime)
    this.isLoading = true;
    this.apiService
      .getReversalStatement(
        this.accountWalletNumber,
        `${fromDate} ${"00:00:00"}`,
        `${toDate} ${"23:59:59"}`,
      )
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res?.responseCode == 200) {
            this.isLoading = false;
            console.log(res);
            this.accountStatementDetails = res?.data;
            this.agentSummaryReport = res?.data?.accStatementPojo;
            if (res?.data?.accStatementPojo?.length > 0) {
              const list = res.data.accStatementPojo;
              const lastObj = list[list.length - 1]; // oldest transaction

              const runningBal = parseFloat(lastObj.runningBal) || 0;
              const debit = parseFloat(lastObj.debit) || 0;
              const credit = parseFloat(lastObj.credit) || 0;

              this.openingBalanceNew = runningBal - credit + debit;
            } else {
              this.openingBalanceNew = 0;
            }
            const firstObject = res?.data?.accStatementPojo?.[0];
            this.closingBalNew = firstObject?.runningBal;
            this.calculatePagination();
            this.totalCredit =
              this.accountStatementDetails?.accStatementPojo.reduce(
                (acc: number, item: any) => {
                  return acc + parseFloat(item?.credit || "0");
                },
                0,
              );

            this.totalDebit =
              this.accountStatementDetails?.accStatementPojo.reduce(
                (acc: number, item: any) => {
                  return acc + parseFloat(item?.debit || "0");
                },
                0,
              );
            this.totalCreditCount =
              this.accountStatementDetails?.accStatementPojo.reduce(
                (acc: number, item: any) => {
                  // Only count if debit is 0 and credit is non-zero
                  return (
                    acc +
                    (parseFloat(item?.debit) === 0 &&
                    parseFloat(item?.credit) !== 0
                      ? 1
                      : 0)
                  );
                },
                0,
              );

            this.totalDebitCount =
              this.accountStatementDetails?.accStatementPojo.reduce(
                (acc: number, item: any) => {
                  // Only count if credit is 0 and debit is non-zero
                  return (
                    acc +
                    (parseFloat(item?.credit) === 0 &&
                    parseFloat(item?.debit) !== 0
                      ? 1
                      : 0)
                  );
                },
                0,
              );
          } else {
            this.isLoading = false;
            alert(res?.error);
          }
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
  }
  currentPageNo: number = 1; // Start with page 1
  pageSizeNew: number = 20; // Number of records per page
  totalPages: number = 0; // Total number of pages
  calculatePagination(): void {
    this.totalPages = Math.ceil(
      this.accountStatementDetails?.accStatementPojo.length / this.pageSizeNew,
    );
    this.updatePagination(); // Update the displayed data for the first page
  }

  updatePagination(): void {
    const startIndex = (this.currentPageNo - 1) * this.pageSizeNew;
    const endIndex = startIndex + this.pageSizeNew;
    this.paginatedData = this.agentSummaryReport.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPageNo = page;
      this.updatePagination(); // Update the table data for the new page
    }
  }

  viewKyc(event: any) {
    this.isLoading = true;
    this.apiService
      .viewClosedAccountKyc(event?.id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (res: any) => {
          if (res?.responseCode == 200) {
            this.isLoading = false;
            console.log("Sending to observable:", res?.data);
            console.log(event,'event+++++++++')
            this.KycService.setItem(res?.data);
            this.openKycView(event?.userType);
          } else {
            this.isLoading = false;
            alert(res?.error);
          }
        },
        error: () => {
          this.isLoading = false;
          alert("Error Pls Try again.");
        },
      });
  }

  showClosureModal = false;
  closureAccount: any;
  closureDocUrl: string | null = null;
  closureDocIsImage = false;
  closureDocLoading = false;
  closureDocError = false;
  openClosureModal(account: any) {
    this.closureAccount = account;
    this.showClosureModal = true;
    this.closureDocError = false;
    this.revokeClosureDocUrl();

    if (!account?.closureDoc) {
      return;
    }

    this.closureDocLoading = true;
    this.apiService
      .getClosureDocument(account.closureDoc)
      .pipe(
        finalize(() => {
          this.closureDocLoading = false;
        }),
      )
      .subscribe({
        next: (blob: Blob) => {
          this.closureDocIsImage =
            blob.type.startsWith("image/") ||
            /\.(jpe?g|png|gif|bmp|webp)$/i.test(account.closureDoc);
          this.closureDocUrl = URL.createObjectURL(blob);
        },
        error: (error) => {
          console.error("Error fetching closure document", error);
          this.closureDocError = true;
        },
      });
  }

  openClosureDocInNewTab() {
    if (this.closureDocUrl) {
      window.open(this.closureDocUrl, "_blank");
    }
  }

  closeClosureModal() {
    this.showClosureModal = false;
    this.closureAccount = null;
    this.revokeClosureDocUrl();
  }

  revokeClosureDocUrl() {
    if (this.closureDocUrl) {
      URL.revokeObjectURL(this.closureDocUrl);
    }
    this.closureDocUrl = null;
    this.closureDocIsImage = false;
  }

  // Same kycType -> route mapping the KYC lists and CRM screens use.
  // Closed accounts are always opened read-only, hence viewOnly: 'true'.
  openKycView(userType: any) {
    const type = String(userType ?? "")
      .trim()
      .toUpperCase()
      .replace(/_/g, " ");

    const routeMap: { [key: string]: string } = {
      CUSTOMER: "/kyc/view-customer-kyc",
      AGENT: "/kyc/view-agent-kyc",
      MERCHANT: "/kyc/view-agent-kyc",
      CORPORATE: "/kyc/view-superagent-kyc",
      NGO: "/kyc/view-superagent-kyc",
      "UN AGENCY": "/kyc/view-superagent-kyc",
      "GOVT AGENCY": "/kyc/view-superagent-kyc",
      "MASTER AGENT": "/kyc/view-masteragent-kyc",
      "SUPER AGENT": "/kyc/view-masteragent-kyc",
    };

    const route = routeMap[type];

    if (!route) {
      console.warn("Unknown KYC user type:", userType);
      alert("Unable to open the KYC form for this account type: " + (userType || "N/A"));
      return;
    }

    this.router.navigate([route], {
      queryParams: { viewOnly: "true", from: this.router.url },
    });
  }
}
