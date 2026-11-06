import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ApiServiceService } from "../../product/api-service/api-service.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";
import { LoaderComponent } from "../../loader/loader.component";

@Component({
  selector: "app-payment-journal-voucher",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoaderComponent,
    MatIconModule,
    MatTooltip,
  ],
  templateUrl: "./payment-journal-voucher.component.html",
  styleUrl: "./payment-journal-voucher.component.css",
})
export class PaymentJournalVoucherComponent {
  journalList: any[] = [];
  showVerifyModal = false;
  selectedRow: any = null;
  verifyRemarks: string = "";
  isLoading: boolean = false;
  descisionEvent: any;
  selectedDetails: any = null;
  showDetailsModal = false;
  userPrivileges: any;
  jeEntryPrivelege: any;
  currentPage = 0;
  pageSize = 10;
  isLastPage = false;
  constructor(
    private apiService: ApiServiceService,
    private route: Router,
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getJournalEntries(this.currentPage, this.pageSize);
    const privilegesData = sessionStorage.getItem("privileges");
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrivileges = this.userPrivileges[0];
      console.log(this.userPrivileges[0], "this.userPrevilages");
      console.log(this.userPrivileges, "this.userPrevilages1");

      for (let item of this.userPrivileges?.uiComponentPrivileges) {
        if (item?.component?.componentName == "Finance Control") {
          if (item.subComponent?.subComponentName == "Payment Journal Voucher")
            this.jeEntryPrivelege = item;
        }
      }
    }
  }

  getJournalEntries(currentPage: number, pageSize: number) {
    this.isLoading = true;
    this.apiService
      .getPaymentJournalEntriesData(currentPage, pageSize)
      .subscribe({
        next: (data: any) => {
          if (data?.responseCode == 200) {
            this.isLoading = false;
            console.log("Journal Entries Data:", data);
            this.journalList = data?.data || [];
            this.isLastPage = this.journalList.length < this.pageSize;
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error("Error fetching journal entries data:", error);
        },
      });
  }

  viewJournal() {
    this.route.navigateByUrl("/createPaymentJournalVoucher");
  }

  verify(row: any, event: string) {
    console.log("Verify clicked", row, event);
    this.selectedRow = row;
    this.verifyRemarks = "";
    this.showVerifyModal = true;
    this.descisionEvent = event;
  }

  approve(row: any) {
    console.log("Approve clicked", row);
  }

  reject(row: any) {
    console.log("Reject clicked", row);
  }

  closeVerifyModal() {
    this.showVerifyModal = false;
    this.selectedRow = null;
  }

  submitVerify() {
    const payload = {
      id: this.selectedRow.id,
      remarks: this.verifyRemarks,
    };

    console.log("Verify Payload:", payload);
    this.isLoading = true;
    this.apiService
      .JEPaymentDecisionMaking(payload, this.descisionEvent)
      .subscribe({
        next: (response: any) => {
          if (response?.responseCode === 200) {
            this.isLoading = false;
            alert(response?.data);
            this.closeVerifyModal();
            this.getJournalEntries(this.currentPage, this.pageSize);
          } else {
            this.isLoading = false;
            alert(response?.error);
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error("Error submitting verification decision:", error);
          alert(
            "An error occurred while submitting the verification. Please try again.",
          );
        },
      });
  }

  openDetailsModal(row: any) {
    this.selectedDetails = row;
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedDetails = null;
  }

printFile() {
  const printContents = document.getElementById('print-section')?.innerHTML;

  const popupWin = window.open('', '_blank', 'width=900,height=700');

  popupWin!.document.open();
  popupWin!.document.write(`
    <html>
      <head>
        <title>JOURNAL VOCHER ABMMC</title>
       <style>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 10px;
  }

  .voucher {
    width: 190mm;
    margin: auto;
    color: #000;
  }

  .box {
    border: 2px solid black;
    padding: 10px;
  }

  .header-grid {
    display: grid;
    grid-template-columns: 140px 1fr 220px;
    align-items: center;
    border-bottom: 2px solid black;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .logo-section img {
    height: 60px;
  }

  .org {
    font-weight: bold;
    margin-top: 5px;
  }

  .title {
    text-align: center;
    font-weight: bold;
    font-size: 22px;
  }
.bottom-item-note {
  margin-top: 10%;
}
  .ref-section {
    font-size: 12px;
  }

  .ref-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 5px;
  }

  /* IMPORTANT */
  .line,
  .line-long,
  .long-line {
    display: inline-block;
    vertical-align: middle;
    border-bottom: 1px solid black;
    height: 14px;
  }

  .line {
    width: 120px;
  }

  .line-long,
  .long-line {
    width: 300px;
  }

  .voucher-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }

  .voucher-table th,
  .voucher-table td {
    border: 1px solid black;
    padding: 6px;
    font-size: 12px;
  }

  .voucher-table th {
    text-align: center;
    background: #f3f3f3;
  }

  .sign-row {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    font-size: 12px;
  }

  .sign {
    margin-top: 5px;
    text-align: center;
  }

  .bottom-section {
    margin-top: 25px;
    font-size: 12px;
  }

  .bottom-section div {
    margin-top: 10px;
  }

  
.signature-text {
  font-size: 11px;
  color: #444;
  margin-top: 20px;
  font-weight: bold;
}
.approval {
  margin-top: 40px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}
   .rejected-reason {
    margin-top: 20px;
    font-size: 12px;
      display: flex;
}
  @page {
    size: A4;
    margin: 10mm;
  }
</style>
      </head>
      <body onload="window.print(); window.close();">
        ${printContents}
      </body>
    </html>
  `);

  popupWin!.document.close();
}

  nextPage() {
    if (!this.isLastPage) {
      this.currentPage++;
      this.getJournalEntries(this.currentPage, this.pageSize);
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getJournalEntries(this.currentPage, this.pageSize);
    }
  }

  refreshData(){
    this.currentPage = 0;
    this.pageSize = 10;
    this.getJournalEntries(this.currentPage,this.pageSize)
  }
}
