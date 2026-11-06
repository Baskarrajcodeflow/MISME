import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { MerchantViewComponent } from "./merchant-view/merchant-view.component";
import { SearchUserComponent } from "../../search-user/search-user.component";
import { CommonModule, NgFor, NgIf } from "@angular/common";
import { MiPayAgent, UserManagementService } from "../../../openapi";
import { Router } from "@angular/router";
import { CorporateService } from "../../../../../../corporate/corporate.service";
import { KycModuleService } from "../../../../../../kyc/kyc/kyc-module.service";
import { LoaderComponent } from "../../../../../../loader/loader.component";
import { SuspendUserDialogComponent } from "../../../../../../corporate/suspend-user-dialog/suspend-user-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { UserService } from "../../user.service";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { readv } from "fs";

@Component({
  selector: "app-merchant",
  standalone: true,
  imports: [
    NgFor,
    ReactiveFormsModule, FormsModule,
    NgIf,
    MerchantViewComponent,
    SearchUserComponent,
    LoaderComponent,
    MatIconModule,
    MatTooltipModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: "./merchant.component.html",
  styleUrls: ["./merchant.component.css"],
})
export class MerchantComponent {
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
  showModalNew: boolean = false;
  showModalAuthorize: boolean = false;
  AuthProductList: any;
  isLoading: boolean = false;

  id: any;
  approvedBy: any;
  agentType: any;
  viewDetails: any;
  reason: any;
  searchValue: any;
  commissionStructure: any;
  subAgentId: any;
  showCommissionModal: boolean = false;
  parentDetails: any;
  showHierarchyModal: boolean = false;
  agentName: any;

  constructor(
    private corporate: CorporateService,
    private router: Router,
    private KycService: KycModuleService,
    private dialog: MatDialog,
    private userService: UserService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchText: [''],
      searchBy: [''] // FormControl for the search input
    });
    const privilegesData = sessionStorage.getItem("privileges");
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "User Management") {
          if (item.subComponent?.subComponentName == "Agent")
            this.privilege = item;
        }
      }
    }
    this.getAgents();
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
          this.getAgents();
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
    this.agentType = "SUBAGENT";
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
    this.getAgents();
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
    this.walletaccounts = c?.walletAccount;
  }
  onClickShowAgentHierarchy(c: any) {
    this.showHierarchyModal = true;
    this.agentName = c?.firstName;
     this.parentDetails = c?.parent ? [c.parent] : [];
    // this.parentDetails = c?.parent;
     console.log("c",c)
    console.log("agentName",this.agentName)
    console.log("parentDetails",this.parentDetails)
  }
  closeModalHierarchy() {
    this.showHierarchyModal = false;
  }
  onClickAuthorizeProduct(user: any) {
    this.showModalAuthorize = true;
    this.corporate.getAuthProducts(user?.id).subscribe((data: any) => {
      this.AuthProductList = data?.data;
      const product = data?.data[0];
      console.log(product, 'newProd');

      this.id = product?.id
      // this.approvedBy = product?.approvedBy ? product.approvedBy : null;
      this.approvedBy = this.AuthProductList.approvedBy;
      console.log("Approved By:", this.approvedBy);
    });
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
    this.productId = $event.target.value;
  }
  saveProduct() {
    //saveproduct
    for (let item of this.products) {
      if (this.productId == item?.id) {
        this.masterProduct = item;
      }
    }

    console.log("this.masterProduct", this.masterProduct);
    console.log(" this.walletaccounts", this.walletaccounts);
    let req = {
      walletAccount: this.walletaccounts,
      masterProduct: this.masterProduct,
    };
    this.KycService.changeProduct(req, this.reason).subscribe(
      (data: any) => {
        if (data?.responseCode == 200) {
          alert("Success: The product has been changed successfully.");
          this.showModal = false;
        } else {
          alert("Failure: There was an issue changing the product.");
          this.showModal = false;
        }
      },
      (error) => {
        alert("Error: Something went wrong. Please try again later.");
      }
    );
  }
  closeModal() {
    this.showModal = false;
    this.showModalNew = false;
  }
  onClickRegister() {
    this.router.navigateByUrl("corporate/create-agent");
  }
  onClickAuthorize(user: any, flag: any, flag2: any) {
    // this.isLoading = true;
    // const request = Array.isArray(user)
    //   ? user.map((u) => ({ id: u.id }))
    //   : [{ id: user.id }];
    // this.userService.authorizeBoUser(request).subscribe({
    //   next: (data) => {
    //     if (data) {
    //       this.isLoading = false;
    //       alert("User account has been successfully unlocked.");
    //       this.getAgents();
    //       // c.active = true;
    //     } else {
    //       this.isLoading = false;
    //       alert("Failed");
    //     }
    //   },
    //   error: (error) => {
    //     this.isLoading = false;
    //     if (error.status === 500) {
    //       const errorMessage =
    //         error.error?.message || "Locked User Can't be the checker user";
    //       alert(errorMessage);
    //     } else {
    //       alert("An error occurred: " + error.message);
    //     }
    //   },
    // });
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
  onClickReject(c: any) {
    this.corporate.rejectCorporateUsers(c?.id).subscribe((data: any) => {
      if (data?.responseCode == 200) {
        alert("Rejected");
      } else {
        alert("Failed");
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

  authSuspendUser(event: any) {
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
          const errorMessage =
            error.error?.message || "Maker cannot be checker";
          alert(errorMessage);
        } else {
          alert("An error occurred: " + error.message);
        }
      },
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


  onClickGetCommissionStructure(item: any) {
    this.subAgentId = item?.id
    this.corporate.getSubAgentCommission(item?.id).subscribe({
      next: (response) => {
        if (response?.responseCode === 200) {
          this.commissionStructure = response?.data
          this.showCommissionModal = true
        } else {
          alert(response?.error)
        }
      }, error: (error) => {
        alert('Error fetching commission structure. Please try again later.');
      }
    })
  }
  validateCommission(item: any) {

    if (item.commissionType === 'FIXED') {
      item.showError = Number(item.subAgentCommission) > Number(item.afcAmount);
    } else {
      item.showError = false;
    }

  }


  formatService(name: string): string {
    return name
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
  }
  updateCommission() {


    const payload = {
      baseUserId: this.subAgentId,
      services: this.commissionStructure.map((item: any) => ({
        serviceName: item.serviceName,
        type: item.commissionType,
        subAgentCommission: Number(item.subAgentCommission)
      }))
    };

    console.log(payload);
    this.isLoading = true;
    this.corporate.updateSubAgentCommissionStructure(payload).subscribe({
      next: (response) => {
        if (response?.responseCode === 200) {
          this.isLoading = false;
          alert('Commission structure updated successfully.');
          this.showCommissionModal = false;
        } else {
          this.isLoading = false;
          alert(response?.error)
        }
      }, error: (error) => {
        this.isLoading = false;
        alert('Error updating commission structure. Please try again later.');
      }
    })



  }
}

//   parent = {} as MiPayAgent;
//   @Input() type!: string;
//   parentId!: number;
//   merchants: MiPayAgent[] = [];
//   selected: MiPayAgent | undefined;
//   userPrivileges: any;
//   userPrevilages1: any;
//   merchantPrivelege: any;
//   diasbleField: boolean = false;

//   constructor(private merchantService: UserManagementService) { }

//   ngOnInit(): void {
//     this.merchantService.getAllMerchants().subscribe({
//       next: (users: MiPayAgent[]) => {
//         this.merchants = users;
//       }
//     });
//     const privilegesData = sessionStorage.getItem('privileges');
//     if (privilegesData) {
//       this.userPrivileges = JSON.parse(privilegesData);
//     this.userPrevilages1 =this.userPrivileges[0];
//     console.log(this.userPrivileges[0],"this.userPrevilages");
//     console.log(this.userPrevilages1,"this.userPrevilages1");

//       for(let item of this.userPrevilages1?.uiComponentPrivileges){
//       if(item?.component?.componentName=="User Management"){
//         if(item.subComponent?.subComponentName=="Agent")
//         this.merchantPrivelege = item;
//       }
//     }
//     }
//   }

//   onCancel(): void {
//     this.selected = undefined;
//   }

//   onSaveParentId(parentId: number): void {
//     this.parentId = parentId;
//   }

//   onSave(bo: MiPayAgent): void {
//     if (bo.id === undefined) {
//       this.merchantService.registerMerchant('', this.parentId, bo).subscribe({
//         next: (a: any) => {
//           if (a) {
//             alert("Merchant created successfully");
//           } else {
//             alert("Something went wrong");
//           }
//           this.merchants.push(a);
//         },
//         error: () => {
//           alert("Something went wrong");
//         }
//       });
//     } else {
//       this.merchantService.editMerchant('', this.parentId, bo).subscribe({
//         next: (a: any) => {
//           if (a) {
//             alert("Merchant edit successful");
//           } else {
//             alert("Something went wrong");
//           }
//           this.merchants = this.merchants.filter(o => o.id !== a.id).concat(a);
//         }
//       });
//     }
//   }

//   onUserClick(_t19: MiPayAgent): void {
//     this.selected = _t19;
//     this.diasbleField = true;
//   }

//   onAdd(event: any): void {
//     this.selected = { ...{ id: undefined }, ...this.parent };
//   }
//   onClickActive(user: any) {
//     this.merchantService.activate('', user?.id).subscribe({
//       next: (a: any) => {
//         if (a) {
//           alert("Subagent activate successfull")
//         }
//       },
//       error: () => {
//         alert("Something went wrong");
//       }
//     }); this.merchantService.getAllMerchants().subscribe({
//       next: (usrs: any) => {
//         this.merchants = usrs;
//       }
//     });
//   }

//   onClickDeactive(user: any) {
//     this.merchantService.deactiveAcc(user.id).subscribe({
//       next: (a: any) => {
//         if (a) {
//           alert("Deactiveted")
//         }
//       },
//       error: () => {
//         alert("Something went wrong");
//       }

//     });
//     this.merchantService.getAllMerchants().subscribe({
//       next: (usrs: any) => {
//         this.merchants = usrs;
//       }
//     });

//   }

//   onClickReject(user: any) {
//     this.merchantService.deleteAcc(user.id).subscribe({
//       next: (a: any) => {
//         if (a) {
//           alert("rejected")
//         }
//         else {
//           alert("Something went wrong")
//         }
//       },
//       error: () => {
//         alert("Something went wrong");
//       }
//     });
//     this.merchantService.getAllMerchants().subscribe({
//       next: (usrs: any) => {
//         this.merchants = usrs;
//       }
//     });

// }
// }
