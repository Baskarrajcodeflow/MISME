import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupplierService } from '../../supplier.service';
import { NgFor, NgIf } from '@angular/common';
import { LoaderComponent } from '../../../loader/loader.component';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf, LoaderComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {

  public topupForm: FormGroup = new FormGroup({});
  public supplier: FormControl = new FormControl('', [Validators.required]);
  public wallet: FormControl = new FormControl('', [Validators.required]);
  public amount: FormControl = new FormControl('', [Validators.required]);
  public info: FormControl = new FormControl('',);
  public transactionPin: FormControl = new FormControl('');
  public agentName: FormControl = new FormControl('');
  supplierId: any;
  suppliers: any;
  walletNo: any;
  object: any;
  sId: any;
  transferType: any;
  wallets: any;
  enableWalletSelection: boolean = false;
  enableDefaultWallet: boolean = false;
  commission: any;
  totalAmount: any;
  getAmount: any;
  commissionField: boolean = false;
  totalAmountLast: number = 0;
  isLoading: boolean = false;
  userPrivileges: any;
  userPrevilages1: any;
  rolePrivilege: any;
  amount1: any;

  constructor(private supplierService: SupplierService) { }

  ngOnInit(): void {
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "Supplier Management") {
          if (item.subComponent?.subComponentName == "Topup Credit Purchase")
            this.rolePrivilege = item;
        }
      }
    }
    this.getSupplier();
    this.getCorporateWallet();
    this.initForm();
  }

  private initForm() {
    this.topupForm = new FormGroup({
      supplier: new FormControl('', Validators.required),
      wallet: new FormControl('', Validators.required),
      amount: new FormControl('', [Validators.required, Validators.min(0), Validators.pattern("^[0-9]*$")]), // Positive number validation
      info: new FormControl(''),
      agentName: new FormControl(''),
      transactionPin: new FormControl('', [Validators.minLength(4)]) // Assuming transaction pin should be at least 4 digits
    });
    this.topupForm.get('amount')?.valueChanges.subscribe(value => {
      const enteredAmount = parseFloat(value || '0');
      this.updateTotalAmount(enteredAmount);
    });
  }
  updateTotalAmount(enteredAmount: number): void {
    // Logic for updating the total amount based on the entered amount
    this.totalAmountLast = enteredAmount * 1.1; // Example calculation (e.g., adding 10% tax)
  }

  // Getter for amount control to simplify template access
  //  amount() {
  //   return this.topupForm.get('amount');
  // }

  onChangeSupplier($event: any) {
    this.object = this.topupForm.controls['supplier'].value;
    this.sId = $event.target.value;
    for (let item of this.suppliers) {
      if (item.id == this.sId) {
        this.walletNo = item.walletNo;
        this.commission = item.commission;
        this.commissionField = true;
      }
    }
  }

  getCorporateWallet() {
    this.isLoading = true;
    this.supplierService.getCorporateWallet().subscribe({
      next: (data: any) => {
        if (data) {
          this.isLoading = false;
          this.wallets = data?.data;
          // this.enableWalletSelection = true;
          // this.enableWalletSelection = true;
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something went wrong");
      }
    })
  }

  private getSupplier() {
    this.isLoading = true;
    this.supplierService.getSupplier().subscribe({
      next: (data: any) => {
        if (data) {
          this.isLoading = false;
          this.suppliers = data;
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something went wrong");
      }
    })
  }
  onChangeTransfer($event: any) {
    this.enableWalletSelection = false;
    this.transferType = $event.target.value;
    if (this.transferType == 'WALLET') {
      this.supplierService.getCorporateWallet().subscribe(data => {
        this.wallets = data?.data;
        this.enableWalletSelection = true;
        this.enableDefaultWallet = false;
      })
    }
    else{
      this.enableDefaultWallet = true;
      this.enableWalletSelection = false;
    }
  }
  onChangeAmount() {
    this.getAmount = this.topupForm.controls['amount'].value;
    this.getAmount = parseFloat(this.getAmount);
    this.totalAmount = (this.getAmount * this.commission) / 100;
    this.totalAmount = parseFloat(this.totalAmount);
    this.totalAmountLast = (this.totalAmount) + (this.getAmount);
  }

  onSubmit() {
    this.amount1 = this.topupForm.controls['amount'].value
    this.isLoading = true;
    let req = {
     initiator: {
        id: 111
      },
      serviceProvider: {
        id: 111
      },
      serviceReceiver: {
        id: 111
      },
      context: {
        SERVICE_NAME: "SUPPLIER_TOPUP",
        MEDIUM: "PHONE",
        CHANNEL: "BACKOFFICE",
        AMOUNT: this.amount1,
        SUPPLIER: parseInt(this.sId, 10),
        COMMISSION: this.commission,
        MODE_OF_PAY:this.transferType,
        TransactionPin: ""
      }

    }
    this.supplierService.SupplierTopUpPurchase(req).subscribe({
      next: (data: any) => {
        if (data) {
          this.isLoading = false
          this.topupForm.reset();
          if(data?.responseCode == 200){
            alert("Success")
          }
          else{
            alert(data?.error) 
          }
        }
      },
      error: (error) => {
        this.isLoading = false;  
        let errorMessage = "A server error occurred. Please try again later."; // Default 500 message
        if (error.status === 500) {
          alert("Something went wrong");
        } else { // Handling other errors
          errorMessage = 'An error occurred: ' + error.message;
          alert(errorMessage); // Or this.showErrorMessage(errorMessage);
        }
      }
    })
  }
  // onChangeAmount(){
  //   this.getAmount = this.addSupplierForm.controls['amount'].value;
  //   this.getAmount = parseFloat(this.getAmount);
  //   this.totalAmount =( this.getAmount * this.commission) /100;
  //   this.totalAmount = parseFloat(this.totalAmount);
  //   this.totalAmountLast = (this.totalAmount) + (this.getAmount);
  // }
}

