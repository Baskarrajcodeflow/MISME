import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-financial-period-setup',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './financial-period-setup.component.html',
  styleUrl: './financial-period-setup.component.css'
})
export class FinancialPeriodSetupComponent {
months = [
  { name: 'Jan', value: 1, days: 31 },
  { name: 'Feb', value: 2, days: 29 },
  { name: 'Mar', value: 3, days: 31 },
  { name: 'Apr', value: 4, days: 30 },
  { name: 'May', value: 5, days: 31 },
  { name: 'Jun', value: 6, days: 30 },
  { name: 'Jul', value: 7, days: 31 },
  { name: 'Aug', value: 8, days: 31 },
  { name: 'Sep', value: 9, days: 30 },
  { name: 'Oct', value: 10, days: 31 },
  { name: 'Nov', value: 11, days: 30 },
  { name: 'Dec', value: 12, days: 31 }
];

financialPeriod = {
  fromMonth: 1,
  fromDay: 1,
  toMonth: 12,
  toDay: 31
};

getDays(monthValue: number) {
  return this.months.find(m => m.value === monthValue)?.days || 31;
}
}
