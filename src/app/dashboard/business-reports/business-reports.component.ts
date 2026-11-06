import { Component, Input, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-business-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './business-reports.component.html',
  styleUrl: './business-reports.component.css'
})
export class BusinessReportsComponent {
 @Input() userData: any;
 @Input() kycData :any;
}
