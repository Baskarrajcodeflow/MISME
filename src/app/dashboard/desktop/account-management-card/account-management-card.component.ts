import { Component } from '@angular/core';

@Component({
  selector: 'app-account-management-card',
  standalone: true,
  imports: [],
  templateUrl: './account-management-card.component.html',
  styleUrl: './account-management-card.component.css'
})
export class AccountManagementCardComponent {
  viewBalance() {
    console.log('View Balance clicked');
    // Implement your logic here
  }

  viewStatement() {
    console.log('View Statement clicked');
    // Implement your logic here
  }

  lockAccount() {
    console.log('Lock Account clicked');
    // Implement your logic here
  }

  closeAccount() {
    console.log('Close Account clicked');
    // Implement your logic here
  }

}
