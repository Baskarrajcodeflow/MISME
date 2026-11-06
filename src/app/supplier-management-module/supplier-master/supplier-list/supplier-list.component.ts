import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SupplierService } from '../../supplier.service';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { LoaderComponent } from '../../../loader/loader.component';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [NgFor, NgIf, LoaderComponent],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.css'
})
export class SupplierListComponent {

  public editSupplierForm: FormGroup = new FormGroup({});
  public supplierName: FormControl = new FormControl('', [Validators.required]);
  public wallet: FormControl = new FormControl('', [Validators.required]);
  public phoneNumber: FormControl = new FormControl('', [Validators.required]);
  public email: FormControl = new FormControl('', [Validators.required]);
  public commission: FormControl = new FormControl('', [Validators.required]);
  public desc: FormControl = new FormControl('', [Validators.required]);
  res: any;
  miPayUserId: any;
  supplierId: any;
  suppliers: any;
  sId: any;
  object: any;
  supplierDetails: any;
  isLoading: boolean = false;
  userPrivileges: any;
  userPrevilages1: any;
  rolePrivilege: any;


  constructor(private supplierService: SupplierService, private router: Router) { }

  ngOnInit(): void {
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "Supplier Management") {
          if (item.subComponent?.subComponentName == "Supplier Master")
            this.rolePrivilege = item;
        }
      }
    }
    this.initForm();
    this.getSupplier();
  }

  private initForm() {
    this.editSupplierForm.addControl('supplierName', this.supplierName);
    this.editSupplierForm.addControl('wallet', this.wallet);
    this.editSupplierForm.addControl('phoneNumber', this.phoneNumber);
    this.editSupplierForm.addControl('email', this.email);
    this.editSupplierForm.addControl('commission', this.commission);
    this.editSupplierForm.addControl('desc', this.desc);
  }

  onClickCreate() {
    this.router.navigateByUrl("CreateSupplier");
  }

  onClickEdit(id: number) {
    this.router.navigateByUrl('EditSupplier/'+id)
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
}