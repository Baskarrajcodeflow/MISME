import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupplierService } from '../../supplier.service';
import { ActivatedRoute, Router } from '@angular/router';
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

  countries: any;
  public addSupplierForm: FormGroup = new FormGroup({});
  public supplierName: FormControl = new FormControl('', [Validators.required]);
  public walletNo: FormControl = new FormControl('', [Validators.required]);
  public phone: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^7\d{8}$/) // Phone number should start with '7' and be 9 digits
  ]);
  public email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  public commission: FormControl = new FormControl('', [Validators.required]);
  public inventoryAccountNo: FormControl = new FormControl('', [Validators.required]);
  public description: FormControl = new FormControl('', [Validators.required]);
  wallets: any;
  glProducts: any;
  inventoryAcc: any;
  isLoading: boolean = false;
  supplierId: any;

  constructor(private supplierService: SupplierService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getWallet();
    this.initForm();
    this.getInventory();
    this.supplierId = this.route.snapshot.paramMap.get('id');
    if (this.supplierId) {
      this.loadSupplierData(this.supplierId);
    }
  }

  private initForm() {
    this.addSupplierForm.addControl('supplierName', this.supplierName);
    this.addSupplierForm.addControl('walletNo', this.walletNo);
    this.addSupplierForm.addControl('phone', this.phone);
    this.addSupplierForm.addControl('email', this.email);
    this.addSupplierForm.addControl('commission', this.commission);
    this.addSupplierForm.addControl('inventoryAccountNo', this.inventoryAccountNo);
    this.addSupplierForm.addControl('description', this.description);
  }

  loadSupplierData(id: any): void {
    this.isLoading = true;
    this.supplierService.getSupplierById(id).subscribe({
      next: (data: any) => {
        if (data) {
          this.isLoading = false;
          this.addSupplierForm.patchValue(data);
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
    });
  }

  private getWallet() {
    this.isLoading = true;
    this.supplierService.getCorporateWallet().subscribe({
      next: (data: any) => {
        if (data) {
          this.isLoading = false;
          this.wallets = data?.data;
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

  private getInventory() {
    this.isLoading = true
    this.supplierService.getInventory().subscribe({
      next: (data: any) => {
        this.inventoryAcc = data;
        this.isLoading = false;
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


  onSubmit() {
    this.isLoading = true;
    let req = {
      supplierName: this.supplierName.value,
      phone: this.phone.value,
      email: this.email.value,
      walletNo: "0000000",
      commission: this.commission.value,
      leafGlAccountNo: "",
      inventoryAccountNo: this.inventoryAccountNo.value,
      description: this.description.value
    }
    if (this.supplierId) {
      this.supplierService.update(req, this.supplierId).subscribe({
        next: (data: any) => {
          if (data) {
            this.isLoading = false;
            this.addSupplierForm.reset();
            alert("Supplier updated successfully")
            this.gotoSupplierList()
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
    else {
      this.supplierService.addSupplier(req).subscribe({
        next: (data: any) => {
          if (data) {
            this.isLoading = false;
            this.addSupplierForm.reset();
            alert("Supplier added successfully")
            this.gotoSupplierList()
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
  }

  gotoSupplierList() {
    this.router.navigateByUrl("SupplierList");
  }

}

