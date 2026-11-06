import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../../../loader/loader.component";
import { Router } from '@angular/router';
import { CrmServiceService } from '../../crm-service.service';
import { UserService } from '../../../user-management/user-management/user-management/bo/user.service';
import { SuspendUserDialogComponent } from '../../../corporate/suspend-user-dialog/suspend-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CorporateService } from '../../../corporate/corporate.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-case-management',
  standalone: true,
  imports: [CommonModule, LoaderComponent, SuspendUserDialogComponent],
  templateUrl: './case-management.component.html',
  styleUrl: './case-management.component.css'
})
export class CaseManagementComponent {
  isLoading: boolean = false;
  usersList: any[] = [];
  pageNo : number = 0;
  selectedOption: string = '1';
  selectedFilter: any;
  fileName!: string;

  constructor(private router: Router, private crmService: CrmServiceService,private userService: UserService,private dialog:MatDialog,private corporate : CorporateService) { }
  ngOnInit() {
    // Initialization logic here
    this.onFilterChange({ target: { value: '1' } });

  }
  onNavigate(route: string) {
    this.router.navigate([route]);
  }
  
  onFilterChange(event: any) {
  this.selectedOption = event.target.value;
  this.pageNo = 0;       // 🔥 reset pagination when filter changes
  this.loadUsers();      // 🔥 central method
}

  
  loadUsers() {
  switch (this.selectedOption) {

    case '1':
      this.crmService.getActiveUser(this.pageNo).subscribe((response: any) => {
        this.usersList = response?.data?.content;
        //this.totalPages = response?.data?.totalPages ?? 0;
      });
      break;

    case '2':
      this.crmService.getDeActivateUsers(this.pageNo).subscribe((response: any) => {
        this.usersList = response?.data?.content;
        //this.totalPages = response?.data?.totalPages ?? 0;
      });
      break;

    case '3':
      this.crmService.getAllDormantUsers(this.pageNo).subscribe((response: any) => {
        this.usersList = response?.data;
        //this.totalPages = response?.data?.totalPages ?? 0;
      });
      break;

    case '4':
      this.crmService.getSuspendUserList(this.pageNo).subscribe((response: any) => {
        this.usersList = response?.data?.content;
        //this.totalPages = response?.data?.totalPages ?? 0;
      });
      break;

    case '5':
      this.crmService.getPasswordLockutUserList(this.pageNo).subscribe((response: any) => {
        this.usersList = response?.data?.content;
        //this.totalPages = response?.data?.totalPages ?? 0;
      });
      break;

    case '6':
      this.crmService.getFirstDeActiveUser(this.pageNo).subscribe((response: any) => {
        this.usersList = response?.data?.content;
        //this.totalPages = response?.data?.totalPages ?? 0;
      });
      break;
  }
}
nextPage() {
  if (this.usersList.length === 25) {   // 🔥 only allow next if full page received
    this.pageNo++;
    this.loadUsers();
  }
}
prevPage() {
  if (this.pageNo > 0) {
    this.pageNo--;
    this.loadUsers();
  }
}


  suspendUser(event: any, flag: any,flag2:any) {
        let dialogRef = this.dialog
          .open(SuspendUserDialogComponent, {
            width: "750px",
            height: "200px",
            data: { message: event, flag: flag,flag2:flag2 },
            panelClass: "custom-dialog-container",
            disableClose: true,
          })
          .afterClosed()
          .subscribe((res: any) => {
            //this.getAllCustomers();
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
             // this.getAllCustomers();
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
             // this.getAllCustomers();
            } else {
              this.isLoading = false;
              alert(res);
            }
          },
          error: (error) => {
           
            if (error.status === 500) {
              const errorMessage = error.error?.message || 'Maker cannot be checker';
              alert(errorMessage);
            } else {
              alert('An error occurred: ' + error.message);
            } 
             this.isLoading = false;
          }
        });
      } 
      authorizeUnSuspendUser(event: any, flag: any,flag2:any) {
         let dialogRef = this.dialog
           .open(SuspendUserDialogComponent, {
             width: "750px",
             height: "200px",
             data: { message: event, flag: flag,flag2:flag2 },
             panelClass: "custom-dialog-container",
             disableClose: true,
           })
           .afterClosed()
           .subscribe((res: any) => {
             //this.getAllCustomers();
             if (res == undefined) {
             }
           });
       }
       passwordUnlock( event: any, flag: any,flag2:any){
         let dialogRef = this.dialog
         .open(SuspendUserDialogComponent, {
           width: "750px",
           height: "300px",
           data: { message: event, flag: flag,flag2:flag2 },
           panelClass: "custom-dialog-container",
           disableClose: true,
         })
         .afterClosed()
         .subscribe((res: any) => {
           //this.getAllCustomers();
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
       approvePasswordUnlock(id:any){
         this.userService.passwordUnlockRevoke(id).subscribe(response =>{
           if(response.responseCode == 200){
             alert("Account Unlock Approved Successfully");
             //this.getAllCustomers();
           }
           else if(response.responseCode == 0){
             alert("Error Occured - "+response.error)
           }
         })
     
       }
      activateDormant(item : any){
    this.crmService.activateDormantUser(item.id).subscribe({  
      next: (response: any) => {
        if(response && response.responseCode === 200){
          alert("Activated Dormant User Successfully");
         // this.customerUserDetails.user.dormant = false;
        console.log('Activate Dormant User Response:', response);
      }
      else{
        alert("Error -"+ response.error);
      }
    },
      error: () => {
        console.error('Error activating dormant user');
      }
    });
  }

  // downloadPdf() {
  //   if (!this.selectedOption) {
  //     alert('Please select a filter');
  //     return;
  //   }

  //   this.isLoading = true;

  //   let apiCall: any;

  //   switch (this.selectedOption) {
  //     case '1':
  //       apiCall = this.userService.downloadActiveUserList();
  //       break;
  //     case '2':
  //       apiCall = this.userService.downloadDeactiveUserList();
  //       break;
  //     case '4':
  //       apiCall = this.userService.downloadSuspendUserList();
  //       break;
  //     case '5':
  //       apiCall = this.userService.downloadPasswordLockoutUserList();
  //       break;
  //     default:
  //       alert('Invalid Selection');
  //       this.isLoading = false;
  //       return;
  //   }

  //   apiCall
  //     .pipe(
  //       finalize(() => {
  //         this.isLoading = false;
  //       })
  //     )
  //     .subscribe({
  //       next: (res: Blob) => {
  //         this.downloadFile(res, 'users.pdf');
  //       },
  //       error: (err: any) => {
  //         console.error('PDF Error:', err);
  //         this.handleBlobError(err, 'PDF Download Failed');
  //       }
  //     });
  // }
  downloadExcel() {
    if (!this.selectedOption) {
      alert('Please select a filter');
      return;
    }

    this.isLoading = true;

    let apiCall: any;

    switch (this.selectedOption) {
      case '1':
        apiCall = this.userService.downloadActiveUserList();
        this.fileName = 'active_users'
        break;
      case '2':
        apiCall = this.userService.downloadDeactiveUserList();
         this.fileName = 'deactived_users'
        break;
      case '3':
        apiCall = this.userService.downloadDormantUserList();
        this.fileName = 'dormant_users'
        break;
      case '4':
        apiCall = this.userService.downloadSuspendUserList();
        this.fileName = 'suspended_users'
        break;
      case '5':
        apiCall = this.userService.downloadPasswordLockoutUserList();
        this.fileName = 'passwordlockout_users'
        break;
        case '6':
        apiCall = this.userService.downloadFirstDeactiveUserList();
        this.fileName = 'new_user_activation'
        break;
      default:
        alert('Invalid Selection');
        this.isLoading = false;
        return;
    }

    apiCall
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res: Blob) => {
          this.downloadFile(res, this.fileName);
        },
        error: (err: any) => {
          console.error('Excel Error:', err);
          this.handleBlobError(err, 'Excel Download Failed');
        }
      });
  }
  handleBlobError(err: any, fallbackMsg: string) {
    if (err?.error instanceof Blob) {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const text = reader.result as string;
          const json = JSON.parse(text);
          alert(json.message || fallbackMsg);
        } catch {
          alert(reader.result || fallbackMsg);
        }
      };

      reader.readAsText(err.error);
    } else {
      alert(err?.error?.message || fallbackMsg);
    }
  }
  downloadFile(data: Blob, fileName: string) {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

}

