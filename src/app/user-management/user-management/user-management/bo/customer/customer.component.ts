import { Component, ElementRef, OnInit, TestabilityRegistry, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { SearchUserComponent } from '../search-user/search-user.component';
import { UserManagementService } from '../../openapi';
import { ToastService } from '../../../../../toast.service';
import { KycModuleService } from '../../../../../kyc/kyc/kyc-module.service';
import { LoaderComponent } from '../../../../../loader/loader.component';
import { GenericPaginationComponent } from '../../../../../generic-services/generic-pagination/generic-pagination.component';
import { UserService } from '../user.service';
import { CorporateService } from '../../../../../corporate/corporate.service';
import { SuspendUserDialogComponent } from '../../../../../corporate/suspend-user-dialog/suspend-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [NgFor, CustomerViewComponent, FormsModule, ReactiveFormsModule, SearchUserComponent, LoaderComponent, NgIf, MatIconModule, CommonModule, FormsModule, GenericPaginationComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent implements OnInit {
  @ViewChild('commonSearchDropdown') commonSearchDropdown!: ElementRef<HTMLSelectElement>;
  searchForm: FormGroup = new FormGroup({});
  searchText: FormControl = new FormControl('');
  request: any;
  basicDetails: any;
  customers: any[] = [];
  selected: any | undefined = undefined;
  customerData: any;
  userPrivileges: any;
  userPrevilages1: any;
  customerprivelege: any;
  productId: any;
  products: any;
  masterProduct: any;
  walletaccounts: any;
  isLoading: boolean = false
  customerUser: any;
  showModal: boolean = false;
  showModalAuthorize: boolean = false;
  AuthProductList: any;
  authId: any;
  description: string = '';
  fwSubProduct: string = '';
  ptSubProduct: string = '';
  id: any;
  approvedBy: any;
  pageno: number = 0;
  searchValue: any;

  constructor(
    private customerService: UserManagementService,
    private toastService: ToastService,
    private KycService: KycModuleService,
    private userService: UserService,
    private corporate: CorporateService,
    private dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchText: [''],
      searchBy: ['']// FormControl for the search input
    });
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      console.log(this.userPrivileges[0], "this.userPrevilages");
      console.log(this.userPrevilages1, "this.userPrevilages1");

      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "User Management") {
          if (item.subComponent?.subComponentName == "Customer")
            this.customerprivelege = item;
        }
      }
    }
    this.getAllCustomers();
  }
  showModalNew: boolean = false;
  viewDetails: any;

  view(event: any) {
    this.showModalNew = true;
    this.isLoading = true;
    this.corporate.getLogs(event).subscribe({
      next: (res) => {
        if (res) {
          this.isLoading = false;
          this.viewDetails = res
        } else {
          this.isLoading = false;
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something Went Wrong");
      },
    });
  }
  getAllCustomers() {
    this.isLoading = true;
    this.customerService.getAllCustomers(this.pageno).subscribe({
      next: (users: any[]) => {
        if (users) {
          this.customers = users;
          this.isLoading = false;
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something went wrong");
      }
    });
  }
  onClickSearchBy($event: any) {
    this.searchValue = $event.target.value
    this.searchText.reset();
  }
  onClickSearch() {
    const searchByValue = this.searchForm.value.searchBy || 'EMAIL'; // default to EMAIL
    const keywordValue = this.searchText.value?.trim() || '';
    if (!keywordValue) {
      alert('Please enter a search keyword.');
      return;
    }
    const req = {
      keyword: keywordValue,
      searchMeta: searchByValue,
      page: 0
    };
    console.log('req search', req);
    this.KycService.customerSearchBy(req).subscribe((data: any) => {
      this.customers = data;
    });
  }
  onResetSearch() {
    this.searchText.reset('');
    this.searchForm.patchValue({ searchBy: '' });
    this.getAllCustomers();
  }

  pageData(event: any) {
    this.pageno = event;
    this.getAllCustomers();
  }

  onCancel(): void {
    this.selected = undefined;
  }
  getProducts() {
    this.KycService.getCustomerProducts().subscribe((data: any) => {
      this.products = data
      // console.log('Fetched products:', data);
    })
  }
  onClickChangeProduct(user: any) {
    this.getProducts();
    this.showModal = true;
    this.walletaccounts = user?.walletAccount
  }

  onClickAuthorizeProduct(user: any) {
    this.showModalAuthorize = true
    this.userService.getAuthProducts(user?.id).subscribe((data: any) => {
      this.AuthProductList = data?.data;
      const product = data?.data[0];
      this.description = product?.currentProductId?.description || '';
      this.id = product?.id;
      // this.approvedBy = product?.approvedBy ? product.approvedBy : null;
      this.approvedBy = this.AuthProductList.approvedBy;
      console.log('Approved By:', this.approvedBy);
      this.fwSubProduct = product?.currentProductId?.ptSubProduct?.name || '';
      this.ptSubProduct = product?.currentProductId?.ptSubProduct?.subProdType || '';
      console.log("this.description", this.description)
      console.log("this.fwSubProduct", this.fwSubProduct)
      console.log("this.ptSubProduct", this.ptSubProduct)
    })

  }
  onConfirmAuthorize(flag: any, flag2: any) {
    // this.corporate.finalAuthorizeProduct(this.id).subscribe((data: any) => {
    //   alert("Authorized");
    // });
    this.showModalAuthorize = false
    let dialogRef = this.dialog
      .open(SuspendUserDialogComponent, {
        width: "750px",
        height: "200px",
        data: { message: this.id, flag: flag, flag2: flag2 },
        panelClass: "custom-dialog-container",
        disableClose: true,
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.getAllCustomers();
        if (res == undefined) {
        }
      });
  }
  closeAuthorizeModal() {
    this.showModalAuthorize = false;
  }
  onChangeGetProduct($event: any) {
    this.productId = $event.target.value
  }
  reason: any
  saveProduct() {
    //saveproduct
    for (let item of this.products) {
      if (this.productId == item?.id) {
        this.masterProduct = item
      }
    }

    console.log('this.masterProduct', this.masterProduct);
    console.log(" this.walletaccounts", this.walletaccounts);
    let req = {
      walletAccount: this.walletaccounts,
      masterProduct: this.masterProduct
    }
    this.KycService.changeProduct(req, this.reason).subscribe((data: any) => {
      if (data?.responseCode == 200) {
        alert('Success: The product has been changed successfully.');
        this.showModal = false;
      } else {
        alert('Failure: There was an issue changing the product.');
        this.showModal = false;
      }
    }, error => {
      alert('Error: Something went wrong. Please try again later.');
      this.showModal = false;
    });

  }
  closeModal() {
    this.showModal = false;
    this.showModalNew = false;
  }

  saveBasicDetails(basicDetails: any): void {
    this.basicDetails = basicDetails;
  }

  onSave(customer: any): void {
    this.request = {
      kycInputs: customer,
      miPayUser: this.basicDetails
    }
    if (customer.id === undefined) {
      this.customerService.registerCustomer('', '', '', this.request).subscribe({
        next: (user: any) => {
          if (user) {
            this.customerData = user;
            alert("Customer created successfully")
          }

          this.customers.push(user);
          this.toastService.showMessage("success", "successfull");
        }
      });
    } else {
      this.customerService.editCustomer('', this.request).subscribe({
        next: (user: any) => {
          this.customers = this.customers.filter(o => o.id !== user.id);
          this.customers.push(user);
          this.selected = undefined;
        }
      });
    }
  }
  suspendUser(event: any, flag: any, flag2: any) {
    let dialogRef = this.dialog
      .open(SuspendUserDialogComponent, {
        width: "750px",
        height: "200px",
        data: { message: event, flag: flag, flag2: flag2 },
        panelClass: "custom-dialog-container",
        disableClose: true,
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.getAllCustomers();
        if (res == undefined) {
        }
      });
  }
  unSuspendUser(event: any) {
    console.log(event?.id);
    let body = {
      userId: event?.id,
    };
    this.isLoading = true;
    this.corporate.unSuspendUser(event?.id).subscribe({
      next: (res) => {
        if (res) {
          this.isLoading = false;
          alert("Request Sent For UnSuspend");
          this.getAllCustomers();
        } else {
          this.isLoading = false;
          alert(res?.error);
        }
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 500) {
          const errorMessage = error.error?.message || 'Maker cannot be checker';
          alert(errorMessage);
        } else {
          alert('An error occurred: ' + error.message);
        }
      }
    });
  }
  authSuspendUser(event: any) {
    console.log(event?.id);
    let body = {
      userId: event?.id,
    };
    this.isLoading = true;
    this.corporate.authSuspendUser(event?.id).subscribe({
      next: (res) => {
        if (res) {
          this.isLoading = false;
          alert("Suspended");
          this.getAllCustomers();
        } else {
          this.isLoading = false;
          alert(res);
        }
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 500) {
          const errorMessage = error.error?.message || 'Maker cannot be checker';
          alert(errorMessage);
        } else {
          alert('An error occurred: ' + error.message);
        }
      }
    });
  }
  authorizeUnSuspendUser(event: any, flag: any, flag2: any) {
    let dialogRef = this.dialog
      .open(SuspendUserDialogComponent, {
        width: "750px",
        height: "200px",
        data: { message: event, flag: flag, flag2: flag2 },
        panelClass: "custom-dialog-container",
        disableClose: true,
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.getAllCustomers();
        if (res == undefined) {
        }
      });
  }
  /* passwordUnlock(id:any){
   this.userService.passwordUnlock(id).subscribe(response =>{
     if(response.responseCode == 200){
       alert("Account Unlocked Successfully")
     }
     else if(response.responseCode == 0){
       alert("Error Occured - "+response.error)
     }
   })
   

  } */
  passwordUnlock(event: any, flag: any, flag2: any) {
    let dialogRef = this.dialog
      .open(SuspendUserDialogComponent, {
        width: "750px",
        height: "300px",
        data: { message: event, flag: flag, flag2: flag2 },
        panelClass: "custom-dialog-container",
        disableClose: true,
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.getAllCustomers();
        if (res == undefined) {
        }
      });
    /* this.userService.passwordUnlock(id).subscribe(response =>{
      if(response.responseCode == 200){
        alert("Account Unlocked Successfully")
      }
      else if(response.responseCode == 0){
        alert("Error Occured - "+response.error)
      }
    }) */


  }
  approvePasswordUnlock(id: any) {
    this.userService.passwordUnlockRevoke(id).subscribe(response => {
      if (response.responseCode == 200) {
        alert("Account Unlock Approved Successfully");
        this.getAllCustomers();
      }
      else if (response.responseCode == 0) {
        alert("Error Occured - " + response.error)
      }
    })

  }
  onClickActivePending(user: any, flag: any, flag2: any) {
    // this.isLoading = true;
    // const request = Array.isArray(user)
    //   ? user.map((u) => ({ id: u.id }))
    //   : [{ id: user.id }];
    // this.userService.authorizePending(request).subscribe({
    //   next:(data)=>{
    //       if (data) {
    //         this.isLoading = false;
    //         alert("Requested To Unlock.");
    //         this.getAllCustomers();
    //         // user.active = false;
    //       } else {
    //         this.isLoading = false;
    //         alert("Failed");
    //       }
    //   }, error: (error) => {
    //     this.isLoading = false;
    //     if (error.status === 500) {
    //       const errorMessage =
    //         error.error?.message || "Locked User Can't be the checker user";
    //       alert(errorMessage);
    //     } else {
    //       alert("An error occurred: " + error.message);
    //     }
    //   },
    // })
    let dialogRef = this.dialog
      .open(SuspendUserDialogComponent, {
        width: "750px",
        height: "200px",
        data: { message: user, flag: flag, flag2: flag2 },
        panelClass: "custom-dialog-container",
        disableClose: true,
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.getAllCustomers();
        if (res == undefined) {
        }
      });
  }

  onClickAuthorize(user: any, flag: any, flag2: any) {
    let dialogRef = this.dialog
      .open(SuspendUserDialogComponent, {
        width: "750px",
        height: "200px",
        data: { message: user, flag: flag, flag2: flag2 },
        panelClass: "custom-dialog-container",
        disableClose: true,
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.getAllCustomers();
        if (res == undefined) {
        }
      });
  }
  onClickDeactivate(event: any, flag: any, flag2: any) {
    let dialogRef = this.dialog
      .open(SuspendUserDialogComponent, {
        width: "750px",
        height: "200px",
        data: { message: event, flag: flag, flag2: flag2 },
        panelClass: "custom-dialog-container",
        disableClose: true,
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.getAllCustomers();
        if (res == undefined) {
        }
      });
  }

  onUserRowClick($event: any, user: any): void {
    this.selected = user;
  }

  onAdd(): void {
     this.router.navigateByUrl("userManagement/customer-kyc");
  }

  gotoCustomerReg() {
    this.router.navigateByUrl("userManagement/customer-kyc");
  }

   passwordRevoke(c: any) {
    console.log(c);

    let body = {
      baseUserId: c?.id,
    };
    
   this.isLoading = true;
    this.corporate.passwordRevoke(body).subscribe({
      next: (res) => {
        if (res?.responseCode == 200) {
          this.isLoading = false;
          alert(res?.data);
        } else {
          this.isLoading = false;
          alert(res?.error);
        }
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 500) {
          const errorMessage =
            error.error?.message;
          alert(errorMessage);
        } else {
          alert("An error occurred: " + error.message);
        }
      },
    })
    
  }
}
