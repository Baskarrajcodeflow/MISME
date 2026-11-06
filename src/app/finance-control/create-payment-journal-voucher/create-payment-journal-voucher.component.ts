import { Component } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router } from "@angular/router";
import { finalize } from "rxjs";
import { ApiServiceService } from "../../product/api-service/api-service.service";
import { CommonModule } from "@angular/common";
import { LoaderComponent } from "../../loader/loader.component";

@Component({
  selector: "app-create-payment-journal-voucher",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: "./create-payment-journal-voucher.component.html",
  styleUrl: "./create-payment-journal-voucher.component.css",
})
export class CreatePaymentJournalVoucherComponent {
  journalForm!: FormGroup;
  isLoading: boolean = false;
  accountList: any[] = [];
  accDestination: any;
  accSource: any;
  currentBalance: any;
  currentBalanceDes: any;
  currentDate: any = new Date();
  destinationUser: any;
  sourceUser: any;
  userNotFound: boolean = false;
  destinationUserNotFound: boolean = false;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiServiceService,
    private route: Router,
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.journalForm = this.fb.group({
      sourceAcc: ["", Validators.required],
      destinationAcc: ["", Validators.required],
      amount: ["", [Validators.required, Validators.min(1)]],
      description: ["", Validators.required],
      sourceAccType: ["", Validators.required],
      destinationAccType: ["", Validators.required],
    });

    // this.getOperationalAccounts();

    this.journalForm.controls['sourceAccType'].valueChanges.subscribe(() => {
      this.journalForm.patchValue({ sourceAcc: '' });
      this.currentBalance = null;
      this.userNotFound = false;
      this.sourceUser = null;
    });

    this.journalForm.controls['destinationAccType'].valueChanges.subscribe(() => {
      this.journalForm.patchValue({ destinationAcc: '' });
      this.currentBalanceDes = null;
      this.destinationUserNotFound = false;
      this.destinationUser = null;
    });
  }

  getOperationalAccounts() {
    this.apiService.getOperationalAccounts().subscribe({
      next: (data: any) => {
        console.log("Operational Accounts Data:", data);
        this.accountList = data?.data;
      },
      error: (error: any) => {
        console.error("Error fetching operational accounts data:", error);
      },
    });
  }

  submitForm() {
    let payload = {
      sourceAcc: this.journalForm.value.sourceAcc,
      destinationAcc: this.journalForm.value.destinationAcc,
      amount: this.journalForm.value.amount,
      description: this.journalForm.value.description,
    };
    console.log("Form Payload:", payload);

    this.isLoading = true;
    this.apiService.createPaymentJournalEntry(payload).subscribe({
      next: (response: any) => {
        if (response?.responseCode === 200) {
          this.isLoading = false;
          alert(response?.data);
          this.route.navigateByUrl("/paymentJournalVoucher");
        } else {
          this.isLoading = false;
          alert(response?.error);
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error("Error creating journal entry:", error);
        alert(
          "An error occurred while creating the journal entry. Please try again.",
        );
      },
    });
  }

  isDestinationDisabled(accNo: string): boolean {
    return this.journalForm.get("sourceAcc")?.value === accNo;
  }

  isSourceDisabled(accNo: string): boolean {
    return this.journalForm.get("destinationAcc")?.value === accNo;
  }

  navigateToJournalEntries() {
    this.route.navigateByUrl("/paymentJournalVoucher");
  }

  getCurrentBalanceForSourceAcc(accNo: any) {
    this.apiService
      .getCurrentBalance(accNo)
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
            this.currentBalance = res?.data;
            console.log(res);
          } else {
            this.isLoading = false;
            // alert(res?.error)
          }
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
  }

  getCurrentBalanceForDestinationAcc(accNo: any) {
    let acc_number = accNo.target.value;
    this.apiService
      .getCurrentBalance(acc_number)
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
            this.currentBalanceDes = res?.data;
            console.log(res);
          } else {
            this.isLoading = false;
            // alert(res?.error)
          }
        },
        error: () => {
          this.isLoading = false;
          alert("Error Try Again");
        },
      });
  }

  filteredSourceUsers: any[] = [];

  searchTimeoutSource: any;

  searchSourceAccounts(event: any) {
    const value = event.target.value;
    console.log("Search Value:", value.length);
    // Minimum characters
    if (!value || value.length < 2) {
      this.filteredSourceUsers = [];
      this.currentBalance = null;
      this.sourceUser = null
      return;
    }

    if (!value || value.length == 0) {
      this.filteredSourceUsers = [];
      this.currentBalance = null;
      this.sourceUser = null;
      return;
    }

    //    if(this.journalForm.controls['sourceAccType'].value == "BANK"){
    //   console.log("Bank account search");
    //  this.userNotFound = true;
    //  return;
    // }
    // Debounce
    clearTimeout(this.searchTimeoutSource);

    this.searchTimeoutSource = setTimeout(() => {
      this.apiService
        .searchSourceAccounts(
          this.journalForm.controls["sourceAccType"].value,
          value,
        )
        .subscribe({
          next: (res) => {
            if (res?.responseCode === 200) {
              this.filteredSourceUsers = res?.data;
              if (this.filteredSourceUsers.length === 0) {
                this.userNotFound = true;
              } else {
                this.userNotFound = false;
              }
            } else {
              this.filteredSourceUsers = [];
            }
          },
        });
    }, 400);
  }
  selectSourceAccount(user: any) {
    this.journalForm.patchValue({
      sourceAcc: user.accountNo,
    });

    this.sourceUser = user

    this.filteredSourceUsers = [];
    this.checkSameAccounts();
    this.getCurrentBalanceForSourceAcc(user.accountNo);
  }

  filteredDestinationUsers: any[] = [];

  searchTimeoutDestination: any;

  searchDestinationAccounts(event: any) {
    const value = event.target.value?.trim();
    console.log("Search Value:", value.length);

    if (!value || value.length == 0) {
      this.filteredDestinationUsers = [];
      this.destinationUser = null;
      return;
    }
    // Debounce
    clearTimeout(this.searchTimeoutDestination);

    this.searchTimeoutDestination = setTimeout(() => {
      this.apiService
        .searchDestinationAccounts(
          this.journalForm.controls["destinationAccType"].value,
          value,
        )
        .subscribe({
          next: (res) => {
            if (res?.responseCode === 200) {
              this.filteredDestinationUsers = res?.data;
              if (this.filteredDestinationUsers.length === 0) {
                this.destinationUserNotFound = true;
              } else {
                this.destinationUserNotFound = false;
              }
            } else {
              this.filteredDestinationUsers = [];
            }
          },
        });
    }, 400);
  }
  selectDestinationAccount(user: any) {
    this.journalForm.patchValue({
      destinationAcc: user.accountNo,
    });
    this.destinationUser = user;

    this.filteredDestinationUsers = [];
    this.checkSameAccounts();
  }

  checkSameAccounts() {
    const source = this.journalForm.get("sourceAcc")?.value;
    const destination = this.journalForm.get("destinationAcc")?.value;

    if (source && destination && source === destination) {
      this.journalForm.get("destinationAcc")?.setErrors({ sameAccount: true });
    } else {
      const errors = this.journalForm.get("destinationAcc")?.errors;

      if (errors) {
        delete errors["sameAccount"];

        if (Object.keys(errors).length === 0) {
          this.journalForm.get("destinationAcc")?.setErrors(null);
        }
      }
    }
  }
}
