import { Component } from '@angular/core';

@Component({
  selector: 'app-support-helpdesk-card',
  standalone: true,
  imports: [],
  templateUrl: './support-helpdesk-card.component.html',
  styleUrl: './support-helpdesk-card.component.css'
})
export class SupportHelpdeskCardComponent {
  openTickets: number = 0;
  resolvedTickets: number = 0;
  pendingTickets: number = 0;
  highPriorityTickets: number = 0;

  ngOnInit() {
    this.fetchSupportStatistics();
  }

  fetchSupportStatistics() {
    // Replace with actual service call
    this.openTickets = 45; // Example data
    this.resolvedTickets = 120; // Example data
    this.pendingTickets = 30; // Example data
    this.highPriorityTickets = 5; // Example data
  }

  viewTickets() {
    console.log('View Tickets clicked');
    // Implement your logic here
  }

  resolveTickets() {
    console.log('Resolve Tickets clicked');
    // Implement your logic here
  }

  manageFAQs() {
    console.log('Manage FAQs clicked');
    // Implement your logic here
  }

  exportTicketData() {
    console.log('Export Data clicked');
    // Implement your logic here
  }
  applyUpdates(){
    
  }
}
