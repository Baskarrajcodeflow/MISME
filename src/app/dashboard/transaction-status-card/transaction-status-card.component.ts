import { Component, OnInit } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface transStatus{
  month : number;
  successCount : number;
  failedCount : number;
  pendingCount : number;

}

@Component({
  selector: 'app-transaction-status-card',
  standalone: true,
  imports: [NgChartsModule,CommonModule],
  templateUrl: './transaction-status-card.component.html'
})
export class TransactionStatusCardComponent implements OnInit {
  @Input() transactionData : transStatus[] =[];
  currentMonthInwords : string = '';

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { title: { display: false, text: 'Month' } },
      y: { beginAtZero: true, title: { display: true, text: 'Count' } }
    }
  };

  lineChartData!: ChartData<'line'>;

  ngOnInit(): void {
    console.log("trans", this.transactionData);
    this.lineChartData = {
      labels: this.getMonthLabels(),
      datasets: [
        {
          label: 'Success',
          data: this.transactionData.map((d:any)=> d.successCount),
          borderColor: '#34d399', // green
          backgroundColor: '#34d399',
          fill: false,
          tension: 0.3
        },
        {
          label: 'Pending',
          data: this.transactionData.map((d:any) => d.pendingCount),
          borderColor: '#fbbf24', // yellow
          backgroundColor: '#fbbf24',
          fill: false,
          tension: 0.3
        },
        {
          label: 'Failed',
          data: this.transactionData.map((d:any) => d.failedCount),
          borderColor: '#f87171', // red
          backgroundColor: '#f87171',
          fill: false,
          tension: 0.3
        }
      ]
    };
  }
  getMonthLabels(): string[] {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-based index (0 = Jan, 11 = Dec)
    this.currentMonthInwords = new Intl.DateTimeFormat('en', { month: 'short' }).format( new Date(currentYear, currentMonth));

    return Array.from({ length: currentMonth + 1 }, (_, i) => {
      return new Intl.DateTimeFormat('en', { month: 'short' }).format(
        new Date(currentYear, i)
      );
    });
  }
}
