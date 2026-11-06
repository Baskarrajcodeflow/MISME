import { Component, Input } from '@angular/core';
import { SubAgentViewComponent } from '../sub-agent-view/sub-agent-view.component';
import { NgFor, NgIf } from '@angular/common';
import { SearchUserComponent } from '../../search-user/search-user.component';
import { MiPayAgent, UserManagementService } from '../../../openapi';
import { LoaderComponent } from '../../../../../../loader/loader.component';
import { KycModuleService } from '../../../../../../kyc/kyc/kyc-module.service';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-sub-agent',
  standalone: true,
  imports: [NgFor, SubAgentViewComponent , SearchUserComponent,NgIf,LoaderComponent],
  templateUrl: './sub-agent.component.html',
  styleUrl: './sub-agent.component.css'
})
export class SubAgentComponent {

  parent = {} as MiPayAgent;
  @Input() type!: string;
  parentId!: number;
  diasbleField: boolean = false;
  userPrivileges: any;
  userPrevilages1: any;
  subagentPrivilege: any;
  isLoading: boolean = false;
  products: any;
  productId: any;
  masterProduct: any;
  walletaccounts: any;
  subAgentUser: any;

  onCancel() {
    this.selected = undefined
  }
  onSaveParentId(parentId: number) {
    this.parentId = parentId;
  }
  onSave(bo: any) {
    this.isLoading = true;
    if(bo.id== undefined){
      this.subAgentService.registerSubAgent('','',this.parentId,bo).subscribe({
        next:(a:any)=>{
          if (a) {
            this.isLoading = false;
            this.agents.push(a);
            this.selected = undefined;
            alert("Sub agent created successfully")
          }
        },
        error: () => {
          this.isLoading = false;
          alert("Something went wrong");
        }
      })
    }else{
    this.subAgentService.editSubAgent('',this.parentId,bo).subscribe({
    next:(a:any)=>{
      if(a){
        this.isLoading = false;
        alert("Sub agent edit successfull")
        this.agents.filter(o => o.id != a.id).push(a);
        this.selected = undefined;
      }
      },
      error: () => {
        this.isLoading = false;
        alert("Something went wrong");
      }
  })
    
    }
  }


  // onClickActive(user: any) {
  //   this.subAgentService.activate('', user?.id).subscribe({
  //     next: (a: any) => {
  //       if (a) {
  //         alert("Subagent activate successfull")
  //       }
  //     },
  //     error: () => {
  //       alert("Something went wrong");
  //     }
  //   }); this.subAgentService.getAllSubAgents().subscribe({
  //     next: (usrs: any) => {
  //       this.agents = usrs;
  //     }
  //   });
  // }

  // onClickDeactive(user: any) {
  //   this.subAgentService.deactiveAcc(user.id).subscribe({
  //     next: (a: any) => {
  //       if (a) {
  //         alert("Deactiveted")
  //       }
  //     },
  //     error: () => {
  //       alert("Something went wrong");
  //     }

  //   });
  //   this.subAgentService.getAllSubAgents().subscribe({
  //     next: (usrs: any) => {
  //       this.agents = usrs;
  //     }
  //   });

  // }

  onClickDeactive(user: any) {
    this.isLoading = true;
    this.subAgentService.deactiveAcc(user.id).subscribe({
      next: (a: any) => {
        // this.subAgentUser = this.subAgentUser.filter((o:any)=> o.id !== a.id);
        // this.subAgentUser.push(a);
        if (a?.responseCode == 200) {
          alert("Deactiveted")
          this.isLoading = false;
          this.getAllSubAgents();
        }
      },
      error: () => {
        alert("Something went wrong");
        this.isLoading = false;
      }
    });
  }

  onClickActive(user: any) {
    this.isLoading = true;
      const request = Array.isArray(user) 
      ? user.map(u => ({ id: u.id })) 
      : [{ id: user.id }];            
    this.userService.authorizeBoUser(request,'').subscribe({
      next: (response: any) => {
        if (response) {
          alert("Activated");
          this.getAllSubAgents();
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
  

  onClickReject(user: any) {
    this.subAgentService.deleteAcc(user.id).subscribe({
      next: (a: any) => {
        // this.agents.push(a);
        // this.agents = this.agents.filter(o => o.id !== a.id);
        // this.agents.push(a);
        if (a) {
          alert("rejected")
        }
        else {
          alert("Something went wrong")
        }
      },
      error: () => {
        // this.isLoading = false;
        alert("Something went wrong");
      }
    });
    this.subAgentService.getAllSubAgents().subscribe({
      next: (usrs: any) => {
        this.agents = usrs;
      }
    });

  }

  getAllSubAgents(){
    this.isLoading = true;
    this.subAgentService.getAllSubAgents().subscribe({
      next:(usrs: any[])=>{
        if(usrs){
          this.agents = usrs;
          this.isLoading = false;
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something went wrong");
      }
    })
  }

  onUserClick(_t19: any) {
    this.selected =  _t19;    
    this.diasbleField = true;
  }
  constructor(private subAgentService: UserManagementService,private KycService:KycModuleService,private userService:UserService
  ) { }
  agents !: any[]
  selected: any | undefined = undefined;
    ngOnInit(): void {
      const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      console.log(this.userPrivileges[0], "this.userPrevilages");
      console.log(this.userPrevilages1, "this.userPrevilages1");
      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "User Management") {
          if (item.subComponent?.subComponentName == "Agent")
            this.subagentPrivilege = item;
        }
      }
    }
    this.getAllSubAgents();
    this.getAgentProducts();

    }
    onAdd(event: any) {
      this.selected = { ...{ id: undefined },...this.parent};
      
    }
    getAgentProducts() {
      this.KycService.getAgentProducts().subscribe((data: any) => {
        this.products = data;
      });
    }
  reason:any

    onChangeGetProduct($event: any, user: any) {
      this.productId = $event.target.value
      //saveproduct
      for (let item of this.products) {
        if (this.productId == item?.id) {
          this.masterProduct = item
        }
      }
      this.walletaccounts = user?.walletAccount
      console.log('this.masterProduct', this.masterProduct);
      console.log(" this.walletaccounts", this.walletaccounts);
      let req = {
        walletAccount: this.walletaccounts,
        masterProduct: this.masterProduct
      }
      this.KycService.changeProduct(req,this.reason).subscribe((data: any) => {
        if (data && data.walletNo) {
          alert('Success: The product has been changed successfully.');
        } else {
          alert('Failure: There was an issue changing the product.');
        }
      }, error => {
        alert('Error: Something went wrong. Please try again later.');
      });
  }
}