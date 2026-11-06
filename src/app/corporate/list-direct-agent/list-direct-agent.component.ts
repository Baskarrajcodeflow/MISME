import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CorporateService } from '../corporate.service';
import { KycModuleService } from '../../kyc/kyc/kyc-module.service';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../../loader/loader.component';
import { SuspendUserDialogComponent } from '../suspend-user-dialog/suspend-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../user-management/user-management/user-management/bo/user.service';
import { MatIconModule } from '@angular/material/icon';
import { ApiServiceService } from '../../product/api-service/api-service.service';

@Component({
  selector: 'app-list-direct-agent',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, ReactiveFormsModule, FormsModule, LoaderComponent, CommonModule, MatIconModule],
  templateUrl: './list-direct-agent.component.html',
  styleUrl: './list-direct-agent.component.css'
})
export class ListDirectAgentComponent {
  @ViewChild('commonSearchDropdown') commonSearchDropdown!: ElementRef<HTMLSelectElement>;
  searchForm: FormGroup = new FormGroup({});
  searchText: FormControl = new FormControl('');
  agentUsers: any[] = [];
  products: any;
  productId: any;
  masterProduct: any;
  walletaccounts: any;
  userPrivileges: any;
  userPrevilages1: any;
  privilege: any;
  showModal: boolean = false;
  showModalAuthorize: boolean = false;
  isLoading: boolean = false;

  AuthProductList: any;
  fwSubProduct: any;
  description: any;
  id: any;
  ptSubProduct: any;
  approvedBy: any;
  agentType: any;
  searchValue: any;
  constructor(private corporate: CorporateService,
    private router: Router, private KycService: KycModuleService,
    private dialog: MatDialog,
    private api: ApiServiceService, private userService: UserService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchText: [''], // FormControl for the search input
      searchBy: ['']
    });
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "User Management") {
          if (item.subComponent?.subComponentName == "MM Staff")
            this.privilege = item;
        }
      }
    }
    this.getAgents();
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
        this.getAgents();
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
        this.getAgents();
      }
      else if (response.responseCode == 0) {
        alert("Error Occured - " + response.error)
      }
    })

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
        this.getAgents();
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
          alert("Requested For UnSuspend");
          this.getAgents()
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
  getAgents() {
    this.agentType = "SUBAGENT"
    this.isLoading = true;
    this.corporate.getAgents(this.agentType).subscribe({
      next: (data) => {
        if (data) {
          this.isLoading = false;
          this.agentUsers = data;
        } else {
          this.isLoading = false;
          alert("Something Went Wrong");
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something Went Wrong");
      },
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
      this.agentUsers = data;
    });
  }
  onResetSearch() {
    this.searchText.reset('');
    this.searchForm.patchValue({ searchBy: '' });
    this.agentUsers = [];
  }
  getProducts() {
    this.KycService.getAgentProducts().subscribe((data: any) => {
      this.products = data
      //console.log('Fetched products:', data);
    })
  }
  onClickChangeProduct(c: any) {
    this.getProducts();
    this.showModal = true;
    this.walletaccounts = c?.walletAccount
  }

  onClickAuthorizeProduct(user: any) {
    this.showModalAuthorize = true
    this.corporate.getAuthProducts(user?.id).subscribe((data: any) => {
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
        this.getAgents();
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
    });

  }
  closeModal() {
    this.showModal = false;
    this.showModalNew = false;
  }
  onClickRegister() {
    this.router.navigateByUrl("corporate/create-direct-agent")
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
        this.getAgents();
        if (res == undefined) {
        }
      });
  }
  onClickActivePending(user: any, flag: any, flag2: any) {
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
        this.getAgents();
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
        this.getAgents();
        if (res == undefined) {
        }
      });
  }
  onClickReject(c: any) {
    this.corporate.rejectCorporateUsers(c?.id).subscribe((data: any) => {
      if (data?.responseCode == 200) {

        alert("Rejected")
      }
      else {
        alert("Failed")
      }
    })
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
          this.getAgents();
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
        this.getAgents();
        if (res == undefined) {
        }
      });
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
