import { Component} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { SearchUserComponent } from '../search-user/search-user.component';
import { AgentViewComponent } from './agent-view/agent-view.component';
import { MiPayAgent, UserManagementService } from '../../openapi';
import { LoaderComponent } from '../../../../../loader/loader.component';
import { UserService } from '../user.service';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [NgFor,NgIf,AgentViewComponent, SearchUserComponent, LoaderComponent],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.css'
})
export class AgentsComponent {
  parent = {} as MiPayAgent;
  request: any;
  agents: any[] = [];
  selected: any | undefined = undefined;
  basicDetails: any;
  userPrivileges: any;
  userPrevilages1: any;
  agentprivelege: any;
  isLoading: boolean = false;
  agentUser: any;

  constructor(private agentService: UserManagementService,private userService:UserService) { }

  ngOnInit(): void {
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      console.log(this.userPrivileges[0], "this.userPrevilages");
      console.log(this.userPrevilages1, "this.userPrevilages1");

      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "User Management") {
          if (item.subComponent?.subComponentName == "Super Agent")
            this.agentprivelege = item;
        }
      }
    }
    this.getAllAgents();
  }

  getAllAgents() {
    this.isLoading = true;
    this.agentService.getAllAgents().subscribe({
      next: (usrs: MiPayAgent[]) => {
        if (usrs) {
          this.isLoading = false;
          this.agents = usrs;
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something went wrong");
      }
    });
  }

  onCancel() {
    this.selected = undefined;
  }

  saveBasicDetails(basicDetails: any): void {
    this.basicDetails = basicDetails;
  }


  onSave(agentData: any) {
    this.request = {
      kycInputs: agentData,
      miPayAgent: this.basicDetails
    }
      if (agentData.id == undefined) {
        this.agentService.registerAgent('','','',this.request).subscribe({
          next: (a: any) => {
            if (a) {
              alert("Agent created successfully")
            }
            else{
              alert("Something went wrong")
            }
            if (!this.agents) {
              this.agents = [];
            }
            this.agents.push(a);
          }
        });
      } else {
        this.agentService.editAgent('', this.request).subscribe({
          next: (a: any) => {
            this.agents = this.agents.filter(o => o.id != a.id).concat(a);
            if(a){
              alert("Agent edit successfull")
            }
            else{
              alert("Something went wrong")
            }
          }
        });
    }
  }

  // onClickActive(user: any) {
  //   this.agentService.activate('', user?.id).subscribe({
  //     next: (a: any) => {
  //       if (a) {
  //         alert("Agent activate successfull")
  //       }
  //     },
  //     error: () => {
  //       // this.isLoading = false;
  //       alert("Something went wrong");
  //     }
  //   }); this.agentService.getAllAgents().subscribe({
  //     next: (usrs: any) => {
  //       this.agents = usrs;
  //     }
  //   });
  // }

  // onClickDeactive(user: any) {
  //   this.agentService.deactiveAcc(user.id).subscribe({
  //     next: (a: any) => {
  //       // this.agents.push(a);
  //       // this.agents = this.agents.filter(o => o.id !== a.id);
  //       // this.agents.push(a);
  //       if (a) {
  //         alert("Deactiveted")
  //       }
  //       // else {
  //       //   alert("Something went wrong")
  //       // }
  //     },
  //     error: () => {
  //       // this.isLoading = false;
  //       alert("Something went wrong");
  //     }

  //   });
  //   this.agentService.getAllAgents().subscribe({
  //     next: (usrs: any) => {
  //       this.agents = usrs;
  //     }
  //   });

  // }

  // onClickReject(user: any) {
  //   this.agentService.deleteAcc(user.id).subscribe({
  //     next: (a: any) => {
  //       // this.agents.push(a);
  //       // this.agents = this.agents.filter(o => o.id !== a.id);
  //       // this.agents.push(a);
  //       if (a) {
  //         alert("rejected")
  //       }
  //       else {
  //         alert("Something went wrong")
  //       }
  //     },
  //     error: () => {
  //       // this.isLoading = false;
  //       alert("Something went wrong");
  //     }
  //   });
  //   this.agentService.getAllAgents().subscribe({
  //     next: (usrs: any) => {
  //       this.agents = usrs;
  //     }
  //   });

  // }

  onClickDeactive(user: any) {
    this.isLoading = true;
    this.agentService.deactiveAcc(user.id).subscribe({
      next: (a: any) => {
        // this.agentUser = this.agentUser.filter((o:any)=> o.id !== a.id);
        // this.agentUser.push(a);
        if (a.responseCode == 200) {
          alert("Deactiveted")
          this.isLoading = false;
          this.getAllAgents();
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something went wrong");
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
          this.getAllAgents();
          alert("Activated");
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
  
  onUserClick(_t19: any) {
    this.selected = _t19;
  }

  onAdd(event: any) {
    this.selected = { ...{ id: undefined }, ...this.parent, role: { id: 1 } };
  }
}
