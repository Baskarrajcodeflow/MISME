import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js';

interface KycSummary {
  kycType: string;
  verifiedLevel1: number;
  verifiedLevel2: number;
  approved: number;
  rejected: number;
  inReview: number;
  incomplete: number;
}

@Component({
  selector: 'app-kyc-summary',
  templateUrl: './kyc-summary.component.html',
  styleUrls: ['./kyc-summary.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class KycSummaryComponent {
  @Input() kycData: KycSummary[] = [];
  chart : any;

  // Status categories in order
  statuses = [ 'Incomplete KYC' , 'In Review' , 'Verified L1' , 'Verified L2',  'Rejected',  'Approved' ,];

  // Color palette for KYC Types
  typeColors: Record<string, string> = {
    CUSTOMER: '#003F5C',
    AGENT: '#BC5090',
    SUPER_AGENT: 'bg-green-500',
    MERCHANT: '#FFA600',
    CORPORATE: '#FF6361',
    NGO: 'bg-orange-500',
    GOVT_AGENCY: 'bg-red-500',
    UN_AGENCY: 'bg-yellow-500',
    USSD_AGENT: 'bg-indigo-500',
    MM_STAFF: 'bg-cyan-500',
    MICRO_MERCHANT: 'bg-lime-500',
  };
  totalApplicationCount: number = 0;
  ngOnInit(){
    this.createPyramidChart();
    console.log("Kyc Data",this.kycData);
  }
    createPyramidChart() {
    const ctx = document.getElementById('kycPyramid') as HTMLCanvasElement;
   

    const datasets = this.kycData.map(type => ({
      label: type.kycType,
      data: [
        type.incomplete,
        type.inReview,
        type.verifiedLevel1,
        type.verifiedLevel2,
        type.rejected,
        type.approved,

        
      ],
      backgroundColor: this.typeColors[type.kycType] || '#ccc',
      borderWidth: 1
    }));

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.statuses,
        datasets: datasets
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${context.formattedValue}`;
              }
            }
          },
          legend: {
           // position: 'bottom'
           display : false
          }
        },
        scales: {
          x: { stacked: true },
          y: { stacked: true }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }



  // Get total count for a given status across all types
  getStatusTotal(status: string): number {
    return this.kycData.reduce(
      (sum, item) => sum + (item[status as keyof KycSummary] as number || 0),
      0
    );
  }

  // Get value safely
  getValue(item: KycSummary, key: string): number {
    return (item as any)[key] || 0;
  }

  // Compute percentage width
  getWidth(count: number, total: number): string {
    if (!total) return '0%';
    return ((count / total) * 100).toFixed(2) + '%';
  }
  // Total across all statuses
/* get totalApplications(): number {
  return this.statuses.reduce((sum, s) => sum + this.getStatusTotal(s.key), 0);
} */ 

}
