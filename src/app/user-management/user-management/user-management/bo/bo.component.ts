import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { SearchUserComponent } from './search-user/search-user.component';
import { BackOffice, BaseUser, UserManagementService } from '../openapi';
import { BoViewComponent } from './bo-view/bo-view.component';
import { PermissionService } from '../../../../permission.service';
import { LoaderComponent } from '../../../../loader/loader.component';
import { UserService } from './user.service';
import { boService } from './bo.service';
import { FormsModule } from '@angular/forms';
import { SuspendUserDialogComponent } from '../../../../corporate/suspend-user-dialog/suspend-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BoUserEditComponent } from '../bo-user-edit/bo-user-edit.component';
import { showToast } from '../../../../core/toast/toast';

@Component({
  selector: 'app-bo',
  standalone: true,
  imports: [NgFor, BoViewComponent, SearchUserComponent, NgIf,LoaderComponent,FormsModule,BoUserEditComponent],
  templateUrl: './bo.component.html',
  styleUrl: './bo.component.css'
})
export class BOComponent implements OnInit {

  boUsers: any;
  selected: BackOffice | undefined = undefined;
  boPrvilege: any;
  userPrevilages1: any;
  userPrivileges: any;
  isDisableField: boolean = false;
  isLoading: boolean = false;
  request: any;
  private activationState = new Map<number, boolean>();
  isEnableEditView: boolean = false;
  constructor(private boService: UserManagementService,private backOfficeService:boService,private permissionService: PermissionService, private userService:UserService, private dialog:MatDialog,) { }

  ngOnInit(): void {
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "User Management") {
          if (item.subComponent?.subComponentName == "Back Office User")
            this.boPrvilege = item;
        }
      }
    }
    this.getAllBackOffice();
  }

 onAdd(dd: any): void {
  this.selected = { id: undefined, department: { id: 1 }, branch: { id: 1 } };
  this.isEnableEditView = false;   // IMPORTANT for CREATE mode
}


onCancel(): void {
  this.selected = undefined;
  this.isEnableEditView = false;
}

  onSave(bo: BackOffice): void {
    this.isLoading = true
    if (!bo.id) {
      this.backOfficeService.createBOUser(bo).subscribe({
        next: (a: any) => {
          if (a) {
            this.isLoading = false;
            this.boUsers = this.boUsers.filter((o:any)=> o.id !== a.id);
            this.boUsers.push(a);
            this.selected = undefined
            showToast("Back office user created successfully")
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error("Full Error Response:", error);
    
          let errorMessage = "A server error occurred. Please try again later."; // Default 500 message
    
          if (error.status === 500) {
            if (typeof error.error === 'string') {
              errorMessage = error.error;
            } else if (error.error && typeof error.error === 'object' && error.error.message) {
              errorMessage = error.error.message;
            }
    
            // **THIS IS THE CORRECT PLACEMENT OF THE ALERT (OR BETTER METHOD)**
            showToast(errorMessage); // Or use a better method like: this.showErrorMessage(errorMessage); 
    
          } else { // Handling other errors
            errorMessage = 'An error occurred: ' + error.message;
            showToast(errorMessage); // Or this.showErrorMessage(errorMessage);
          }
        }
      });
    } else {
      this.backOfficeService.boUserEdit(bo).subscribe({
        next: (a: BackOffice) => {
          if (a) {
            this.isLoading = false;
            this.boUsers = this.boUsers.filter((o:any) => o.id !== a.id);
            this.boUsers.push(a);
            this.selected = undefined
            showToast("Back office user edit successfull")
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error("Full Error Response:", error);
    
          let errorMessage = "A server error occurred. Please try again later."; // Default 500 message
    
          if (error.status === 500) {
            if (typeof error.error === 'string') {
              errorMessage = error.error;
            } else if (error.error && typeof error.error === 'object' && error.error.message) {
              errorMessage = error.error.message;
            }
    
            // **THIS IS THE CORRECT PLACEMENT OF THE ALERT (OR BETTER METHOD)**
            showToast(errorMessage); // Or use a better method like: this.showErrorMessage(errorMessage); 
    
          } else { // Handling other errors
            errorMessage = 'An error occurred: ' + error.message;
            showToast(errorMessage); // Or this.showErrorMessage(errorMessage);
          }
        }
      });
    }
  }

 onUserClick(user: any): void {
  this.selected = user;
  this.isDisableField = true;
  this.isEnableEditView = true;   // IMPORTANT for EDIT mode
}


  // onClickActive(user: any) {
  //   this.isLoading = true;
  //     const request = Array.isArray(user) 
  //     ? user.map(u => ({ id: u.id })) 
  //     : [{ id: user.id }];            
  //   this.userService.authorizeBoUser(request).subscribe({
  //     next: (response: any) => {
  //       if (response) {
  //         this.getAllBackOffice();
  //         alert("Activated");
  //       }
  //     },
  //     error: (error) => {
  //       this.isLoading = false;
  //       if (error.status === 500) {
  //         const errorMessage = error.error?.message || 'Maker cannot be checker';
  //         alert(errorMessage);
  //       } else {
  //         alert('An error occurred: ' + error.message);
  //       } 
  //     }
  //   });
  // }

  onClickActive(user: any) {
    this.isLoading = true;
    const request = Array.isArray(user) 
      ? user.map(u => ({ id: u.id })) 
      : [{ id: user.id }];            
    this.userService.authorizeBoUser(request,'').subscribe({
      next: (response: any) => {
        if (response) {
          user.active = true;
          this.activationState.set(user.id, true);          // user.isFirstActivated = true; 
          this.getAllBackOffice();
          showToast("Activated");
        }
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 500) {
          const errorMessage = error.error?.message || 'Maker cannot be checker';
          showToast(errorMessage);
        } else {
          showToast('An error occurred: ' + error.message);
        } 
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
           this.getAllBackOffice();
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
             showToast("Account Unlock Approved Successfully");
             this.getAllBackOffice();
           }
           else if(response.responseCode == 0){
             showToast("Error Occured - "+response.error)
           }
         })
     
       }
  
  shouldShowRejectButton(user: any): boolean {
    // Check if user has been activated before
    const hasBeenActivated = this.activationState.get(user.id) || false;
    
    // Show reject button only if the user has never been activated and is not deleted
    return this.boPrvilege.authorizePrivelege && !hasBeenActivated && !user.deleted && !user.active;
  }
  getAllBackOffice() {
    this.isLoading = true;
    this.backOfficeService.getAllBackOffice().subscribe({
      next: (usrs: any) => {
        this.isLoading = false;
        this.boUsers = usrs;
        if(this.boUsers.isFirstActivated != false){
        }
      },
      error: () => {
        this.isLoading = false;
        showToast("Something went wrong");
      }
    });
  }
  
  onClickDeactive(user: any) {
    this.isLoading = true;
    this.backOfficeService.deactiveAcc(user.id,'').subscribe({
      next: (a: any) => {
        this.boUsers = this.boUsers.filter((o:any)=> o.id !== a.id);
        this.boUsers.push(a);
        if (a) {
          this.isLoading = false;
          this.getAllBackOffice();
          showToast("Deactiveted")
        }
      },
      error: () => {
        this.isLoading = false;
        showToast("Something went wrong");
      }
    });
  }

  onClickReject(user: any) {
    this.isLoading = true;
    this.backOfficeService.deleteAcc(user.id).subscribe({
      next: (a: any) => {
        if (a) {
          this.boUsers = this.boUsers.filter((o:any)=> o.id !== a.id);
          this.boUsers.push(a);
          showToast("rejected")
          this.isLoading = false;
        }
      },error: (error) => {
        this.isLoading = false;
        if (error.status === 500) {
          const errorMessage = error.error?.message || 'Maker cannot be checker';
          showToast(errorMessage);
        } else {
          showToast('An error occurred: ' + error.message);
        } 
      }
    });
    this.getAllBackOffice();
  }

}
