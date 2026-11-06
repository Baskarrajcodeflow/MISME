import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-cash-in-out-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cash-in-out-report.component.html',
  styleUrl: './cash-in-out-report.component.css'
})
export class CashInOutReportComponent {
  @Input() data: any;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      console.log('Data changed:', changes['data'].currentValue);
    }
  }
}
