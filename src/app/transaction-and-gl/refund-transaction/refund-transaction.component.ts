import { CommonModule, NgClass, NgFor, NgIf } from "@angular/common";
import { Component, ElementRef, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { GlService } from "../gl.service";
import jsPDF from "jspdf";
import { LoaderComponent } from "../../loader/loader.component";

@Component({
  selector: "app-refund-transaction",
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgClass,
    NgFor,
    CommonModule,
    LoaderComponent,
  ],
  templateUrl: "./refund-transaction.component.html",
  styleUrl: "./refund-transaction.component.css",
})
export class RefundTransactionComponent {
  @ViewChild("content") content!: ElementRef;
  refundDetails: any[] = [];
  showAllTable: boolean = false;
  privilege: any;
  refundForm: FormGroup = new FormGroup({});
  batchIdValue: any;
  isReverseButtonDisabled: boolean = false;
  isAuthorizeButtonDisabled: boolean = false;
  showAuthorizeTable: boolean = false;
  getAllReverseData: any;
  showModal: boolean = false;
  viewDetails: any[] = [];
  isLoading: boolean = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private glService: GlService
  ) {
    this.refundForm = this.fb.group({
      batchId: ["", Validators.required], // Assuming batchId is required
    });
  }
  ngOnInit() {
    this.getReverseData();
    const privilegesData = sessionStorage.getItem("privileges");
    if (privilegesData) {
      const userPrivileges = JSON.parse(privilegesData);
      const userPrevilages1 = userPrivileges[0];
      for (const item of userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName === "Transaction and GL") {
          if (item.subComponent?.subComponentName === "Refund Transaction") {
            this.privilege = item;
          }
        }
      }
    }
  }
  getReverseData() {
    this.isLoading = true;
    this.glService.getReverseData().subscribe({
      next: (data) => {
        if (data?.responseCode == 200) {
          this.isLoading = false;
          this.getAllReverseData = data?.data;
        } else {
          this.isLoading = false;
          alert(data?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        this.isAuthorizeButtonDisabled = false;
      },
    });
  }
  onClickView(item: any) {
    this.glService
      .getRefundTransactionReport(item?.batchId)
      .subscribe((data: any) => {
        this.showModal = true;
        this.viewDetails = data?.data;
      });
  }
  closeModal() {
    this.showModal = false;
  }
  processData() {
    this.router.navigateByUrl("transaction-and-gl/process-refund");
  }

  authorize(item: any) {
    this.isLoading = true;
    this.glService.AuthorizeRefundTransaction(item?.id).subscribe({
      next: (data) => {
        if (data?.responseCode == 200) {
          this.isLoading = false;
          alert("Authorized Successfully");
          this.getReverseData();
        } else {
          this.isLoading = false;
          alert(data?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        this.isAuthorizeButtonDisabled = false;
      },
    });
    if (this.isAuthorizeButtonDisabled) return;
    this.isAuthorizeButtonDisabled = true;
    // const batchIdValue = this.refundForm.get('batchId')?.value;
  }
   reject(item: any) {
    this.isLoading = true;
    this.glService.rejectRefundTransaction(item?.id).subscribe({
      next: (data) => {
        if (data?.responseCode == 200) {
          this.isLoading = false;
          alert("Rejected Successfully");
          this.getReverseData();
        } else {
          this.isLoading = false;
          alert(data?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        this.isAuthorizeButtonDisabled = false;
      },
    });
    if (this.isAuthorizeButtonDisabled) return;
    this.isAuthorizeButtonDisabled = true;
    // const batchIdValue = this.refundForm.get('batchId')?.value;
  }
  makePdf() {
    const doc = new jsPDF("p", "pt", "a4");
    doc.html(this.content.nativeElement, {
      callback: function (doc: any) {
        doc.save("account-statement.pdf");
      },
      x: 20,
      y: 20,
      margin: [7, 7, 7, 7],
      autoPaging: "text",
      width: 550,
      windowWidth: 800,
    });
  }
}
