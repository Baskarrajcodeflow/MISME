import { Component } from '@angular/core';

@Component({
  selector: 'app-system-administration-card',
  standalone: true,
  imports: [],
  templateUrl: './system-administration-card.component.html',
  styleUrl: './system-administration-card.component.css'
})
export class SystemAdministrationCardComponent {
  serverStatus: string = 'Running';
  cpuUsage: number = 30; // Example data
  memoryUsage: number = 60; // Example data
  diskUsage: number = 70; // Example data
  pendingUpdates: number = 5; // Example data
  securityAlerts: number = 2; // Example data

  ngOnInit() {
    this.fetchSystemStatistics();
  }

  fetchSystemStatistics() {
    // Replace with actual service call to fetch data
    this.serverStatus = 'Running'; // Example data
    this.cpuUsage = 30; // Example data
    this.memoryUsage = 60; // Example data
    this.diskUsage = 70; // Example data
    this.pendingUpdates = 5; // Example data
    this.securityAlerts = 2; // Example data
  }

  viewLogs() {
    console.log('View Logs clicked');
    // Implement your logic here
  }

  manageConfigs() {
    console.log('Manage Configs clicked');
    // Implement your logic here
  }

  applyUpdates() {
    console.log('Apply Updates clicked');
    // Implement your logic here
  }

  viewSecurityAlerts() {
    console.log('View Security Alerts clicked');
    // Implement your logic here
  }
}
