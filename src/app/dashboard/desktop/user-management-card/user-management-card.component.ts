import { Component } from '@angular/core';

@Component({
  selector: 'app-user-management-card',
  standalone: true,
  imports: [],
  templateUrl: './user-management-card.component.html',
  styleUrl: './user-management-card.component.css'
})
export class UserManagementCardComponent {
  newUsers: number = 0;
  superActiveUsers: number = 0;
  inactiveUsers: number = 0;
  totalUsers: number = 0;

  ngOnInit() {
    this.fetchUserStatistics();
  }

  fetchUserStatistics() {
    // Replace with actual service call
   // this.newUsers = 100; // Example data
   // this.superActiveUsers = 50; // Example data
   // this.inactiveUsers = 20; // Example data
   // this.totalUsers = 170; // Example data
  }

  viewUsers() {
    console.log('View Users clicked');
    // Implement your logic here
  }

  addUser() {
    console.log('Add User clicked');
    // Implement your logic here
  }

  manageKYC() {
    console.log('Manage KYC clicked');
    // Implement your logic here
  }

  deactivateUsers() {
    console.log('Deactivate Users clicked');
    // Implement your logic here
  }
}
