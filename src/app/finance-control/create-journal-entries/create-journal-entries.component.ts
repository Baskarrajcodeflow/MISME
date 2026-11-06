import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ApiServiceService } from "../../product/api-service/api-service.service";
import { LoaderComponent } from "../../loader/loader.component";
import { Router } from "@angular/router";
import {  finalize } from 'rxjs/operators';

@Component({
  selector: "app-create-journal-entries",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: "./create-journal-entries.component.html",
  styleUrl: "./create-journal-entries.component.css",
})
export class CreateJournalEntriesComponent {
  journalForm!: FormGroup;
  isLoading: boolean = false;
  accountList: any[] = [];
  accDestination: any;
  accSource: any;
    currentBalance: any;
    currentBalanceDes: any;
    currentDate: any = new Date();
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
      refNumber: ["", Validators.required],
    });

    this.getSystemAccounts();
  }

  getSystemAccounts() {
    this.apiService.getSystemAccounts().subscribe({
      next: (data: any) => {
        console.log("System Accounts Data:", data);
        this.accountList = data?.data;
      },
      error: (error: any) => {
        console.error("Error fetching system accounts data:", error);
      },
    });
  }

  submitForm() {
    let payload = {
      sourceAcc: this.journalForm.value.sourceAcc,
      destinationAcc: this.journalForm.value.destinationAcc,
      amount: this.journalForm.value.amount,
      description: this.journalForm.value.description,
      refNumber: this.journalForm.value.refNumber,
    };
    console.log("Form Payload:", payload);

    this.isLoading = true;
    this.apiService.createJournalEntry(payload).subscribe({
      next: (response: any) => {
        if (response?.responseCode === 200) {
          this.isLoading = false;
          alert(response?.data);
          this.route.navigateByUrl("/journalEntry");
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
    this.route.navigateByUrl("/journalEntry");
  }


    getCurrentBalanceForSourceAcc(accNo: any) {
      let acc_number = accNo.target.value;
      this.apiService
        .getCurrentBalance(
          acc_number
        ).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
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
        .getCurrentBalance(
          acc_number
        ).pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
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
}