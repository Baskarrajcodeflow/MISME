import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { UserManagementService } from '../../../user-management/user-management/user-management/openapi';
import { WalletAccount } from '../../wallet-status';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { LoaderComponent } from '../../../loader/loader.component';
import { WalletService } from '../wallet-managemnt.service';
import { walletService } from '../wallet.service';

@Component({
  selector: 'app-wallet-list',
  templateUrl: './wallet-list.component.html',
  styleUrls: ['./wallet-list.component.css'],
  standalone: true,
  imports: [NgFor, FormsModule, NgIf, LoaderComponent],
})
export class WalletListComponent implements OnInit {
  walletAccounts: WalletAccount[] = [];
  filteredWallets: any[] = [];
  dropdownOpen: boolean[] = [];
  selectedWalletType: string = '';
  isLoading: boolean = false;
  privilege: any;

  statusMapping: { [key: string]: string } = {
    noCredit: 'No Credit',
    noDebit: 'No Debit',
    locked: 'Locked',
    unlock: 'Unlock',
    dormant: 'Dormant'
  };



  statuses: string[] = Object.keys(this.statusMapping); // Extract backend keys

  walletTypes: string[] = ["CUSTOMER", "MERCHANT", "AGENT"]; // Add your wallet types here

  @ViewChild(ModalComponent) modal!: ModalComponent;
  walletId: any;
  statusChangeRequest: any;

  constructor(private walletService: UserManagementService,private walletService1: walletService, private walletManagementService: WalletService) { }

  ngOnInit(): void {
    this.loadPrivileges();
    this.getWallets();
  }

  loadPrivileges(): void {
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      const userPrivileges = JSON.parse(privilegesData);
      const userPrevilages1 = userPrivileges[0];
      for (const item of userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName === 'Wallet Management') {
          if (item.subComponent?.subComponentName === 'Wallet Accounts') {
            this.privilege = item;
          }
        }
      }
    }
  }

  getWallets(): void {
    this.isLoading = true;
    this.walletService1.getAllWallet().subscribe({
      next: (data: any) => {
        this.walletAccounts = data;
        this.filteredWallets = data;
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
    });
  }

  filterWallets(): void {
    if (this.selectedWalletType) {
      this.filteredWallets = this.walletAccounts.filter(wallet => wallet.walletType === this.selectedWalletType);
    } else {
      this.filteredWallets = this.walletAccounts;
    }
  }

  // Toggle dropdown visibility
  toggleDropdown(index: number): void {
    this.dropdownOpen[index] = !this.dropdownOpen[index];
  }

  // Handle status change for checkboxes
  onStatusChange(wallet: WalletAccount, status: string, event: any): void {
    wallet[status] = event.target.checked;
  }

  // confirmSelection(wallet: WalletAccount): void {
  //   this.isLoading = true;
  //   this.walletId = wallet.id;
  //   this.statusChangeRequest = {
  //     ...wallet,
  //   };

  //   this.walletService.changeWalletStatus(this.walletId, this.statusChangeRequest).subscribe({
  //     next: () => {
  //       this.isLoading = false;
  //       alert('Wallet status updated successfully');
  //       this.getWallets();
  //     },
  //     error: () => {
  //       this.isLoading = false;
  //       alert('Error updating wallet status');
  //       this.getWallets();
  //     }
  //   });
  // }
  
  confirmSelection(wallet: WalletAccount, index: number): void {
    this.isLoading = true;
    this.walletId = wallet.id;
    this.statusChangeRequest = {
      ...wallet,
    };
  
    // Close the dropdown after confirmation
    this.dropdownOpen[index] = false;
  
    this.walletService1.changeWalletStatus(this.walletId, this.statusChangeRequest).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Wallet status updated successfully');
        this.getWallets();  // Refresh the wallet list
      },
      error: (error) => {
        this.isLoading = false;  
        this.getWallets();  // Refresh the wallet list even in case of error
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
  onClickAuthorize(wallet: any) {
    this.isLoading = true;
    wallet.active = true;
    this.walletManagementService.authorizeWallet(wallet.id, wallet).subscribe({
      next: () => {
        alert('Authorized successfully');
        this.getWallets();
      },
      error: (error) => {
        wallet.active = false;
        this.getWallets();
        let errorMessage = "A server error occurred. Please try again later."; // Default 500 message
        if (error.status === 500) {
          alert('Something went wrong.Please try again');
        } else { // Handling other errors
          errorMessage = 'An error occurred: ' + error.message;
          alert(errorMessage); // Or this.showErrorMessage(errorMessage);
        }
      }
    });
  }
}
