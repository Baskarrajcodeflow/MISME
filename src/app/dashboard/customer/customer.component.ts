import { Component } from '@angular/core';
import { AccountManagementCardComponent } from '../desktop/account-management-card/account-management-card.component';
import { ComplianceSecurityCardComponent } from '../desktop/compliance-security-card/compliance-security-card.component';
import { IntegrationManagementCardComponent } from '../desktop/integration-management-card/integration-management-card.component';
import { NotificationsAlertsCardComponent } from '../desktop/notifications-alerts-card/notifications-alerts-card.component';
import { ReportingAnalyticsCardComponent } from '../desktop/reporting-analytics-card/reporting-analytics-card.component';
import { SupportHelpdeskCardComponent } from '../desktop/support-helpdesk-card/support-helpdesk-card.component';
import { SystemAdministrationCardComponent } from '../desktop/system-administration-card/system-administration-card.component';
import { TransactionManagementCardComponent } from '../desktop/transaction-management-card/transaction-management-card.component';
import { UserManagementCardComponent } from '../desktop/user-management-card/user-management-card.component';
import { BackupRecoveryCardComponent } from '../desktop/backup-recovery-card/backup-recovery-card.component';
import { DashboardService } from '../dashboard.service';
import { PermissionService } from '../../permission.service';
import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
import { KycSummaryComponent } from "../kyc-summary/kyc-summary.component";
import { TransactionStatusCardComponent } from "../transaction-status-card/transaction-status-card.component";
import { BusinessReportsComponent } from "../business-reports/business-reports.component";
export interface UserStats {
  userType: string;
  userCount: number;
  cumulativeCount: number;
}
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
  selector: 'app-customer',
  standalone: true,
  imports: [NgChartsModule, CommonModule, KycSummaryComponent, TransactionStatusCardComponent, BusinessReportsComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})



export class CustomerComponent {

  totalUsersCount: number = 0;
  transactionCount: number = 0;
  totalTransactionCount: number = 0;
  eMoneyBalance: number = 0;
  setaraganBalance: number = 0;
  activeServiceBalance: number = 0;
  awccInventoryBalance: number = 0;
  transactionAmountData: any;
  kycCount: any;
  users_subTitle: string = 'Accumulated Count';
  activeTabMain: 'dashboard' | 'reports' = 'dashboard';
  // Chart configuration
  public pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend for clean look
      },
    },
  };

  public pieChartLabels = ['Customer', 'BO', 'Agent', 'Corporate', 'Merchant'];
  public pieChartData!: ChartData<'pie', number[], string | string[]>;
  public pieChartType: ChartType = 'pie';
  donutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: { enabled: true }
    },
    cutout: '50%' // 👈 makes it donut instead of pie

  };

  donutChartData!: ChartData<'doughnut'>;
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'y', // 👈 horizontal
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { stacked: true, beginAtZero: true },
      y: { stacked: true }
    }
  };

  barChartData!: ChartData<'bar'>;
  chartConfig!: ChartConfiguration<'bar' | 'line'>
  totalUsersData: UserStats[] = [];   // start as an empty array
  transactionStatusData: any;
  activeTab: 'daily' | 'all' = 'all';
  dayUsersCount: number = 0;
  currentYear: number = 0;
  chartLegends!: { label: string; color: string; }[];
  subTitle!: string;
isAdminLoggedIn: boolean=false;

  setTab(tab: 'daily' | 'all', graphIndex: number) {
    this.activeTab = tab;
    if (graphIndex == 1)
      this.generateUserCountChartData();
    else
      this.generateTransactionStatusChart();
  }
  constructor(private dashboardService: DashboardService, public permissionService: PermissionService) {
    this.permissionService.hideSidebar = false; // Ensure sidebar is visible when entering CRM screen
  }

  ngOnInit() {
    if ((typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') && sessionStorage.getItem('JWT_TOKEN')) {
      const username = sessionStorage.getItem('loginUserName');
      if(username == 'najib.hashimi@afghan-wireless.com' || username == 'essa.bawer@afghan-wireless.com'){
      this.isAdminLoggedIn = true;
      this.getTotalUsers();
      this.getKYCCount();
      this.currentYear = new Date().getFullYear();
      this.getTransactionSummary(this.currentYear);
      this.getTransactionAmountSummary(this.currentYear);
      this.getActiveServiceBalance();
      this.getAwccInventoryBalance();
      this.getEmoneyBalance();
      this.largeTransactionCount();
      }else{
        this.isAdminLoggedIn = false;
      }


    }

  }

  getTotalUsers() {
    this.dashboardService.getTotalUsers().subscribe(response => {
      if (response.responseCode == 200) {
        this.totalUsersData = response.data;
        this.totalUsersData.map(item => {
          this.totalUsersCount += item.cumulativeCount;
        });

      }
    });
    setTimeout(() => {
      this.generateUserCountChartData();
    }, 500);
  }

  generateUserCountChartData() {
    if (this.activeTab === 'all') {
      this.users_subTitle = 'Accumulated Count';
      this.chartLegends = [
        { label: 'Customer', color: '#003F5C' },
        { label: 'BO', color: '#58508D' },
        { label: 'Agent', color: '#BC5090' },
        { label: 'Corporate', color: '#FF6361' },
        { label: 'Merchant', color: '#FFA600' }

      ];
      this.pieChartData = {
        labels: this.pieChartLabels,
        datasets: [
          {
            data: this.totalUsersData.map(item => item.cumulativeCount),
            backgroundColor: ['#003F5C', '#58508D', '#BC5090', '#FF6361', '#FFA600'], // Tailwind blues
            borderWidth: 0,
          },
        ],
      };
    } else {
      this.users_subTitle = 'New Users Last Day';
      this.totalUsersCount = 0;
      this.totalUsersData.map(item => {
        this.dayUsersCount = this.totalUsersCount += item.userCount;
      });
      this.pieChartData = {
        labels: this.pieChartLabels,
        datasets: [
          {
            data: this.totalUsersData.map(item => item.userCount),
            backgroundColor: ['#003F5C', '#58508D', '#BC5090', '#FF6361', '#FFA600'], // Tailwind blues
            borderWidth: 0,
          },
        ],
      };
    }


  }
  generateKYCChart(kycType: string[], kycStatus: string[]) {
    const datasets = kycStatus.map((status, index) => ({
      label: status,
      data: this.kycCount.map((item: any) => item[status] || 0),
      backgroundColor: this.pickColor(index)
    }));
    this.barChartData = {
      labels: kycType,
      datasets
    }
  }
  pickColor(index: number): string {
    const colors = [
      '#f87171', // red-400
      '#fbbf24', // yellow-400
      '#60a5fa', // blue-400
      '#818cf8', // indigo-400
      '#34d399', // green-400
      '#a78bfa'  // purple-400
    ];
    return colors[index % colors.length];
  }
  generateTransactionStatusChart() {
        if (this.activeTab === 'all') {
          this.subTitle = `Year - ${this.currentYear}`;

    const totalSuccess = this.transactionStatusData.reduce((acc: any, m: any) => acc + m.successCount, 0);
    const totalFailed = this.transactionStatusData.reduce((acc: any, m: any) => acc + m.failedCount, 0);
    const totalPending = this.transactionStatusData.reduce((acc: any, m: any) => acc + m.pendingCount, 0);
    this.totalTransactionCount = totalSuccess + totalFailed + totalPending;
    this.donutChartData = {
      labels: ['Success', 'Failed', 'Pending'],
      datasets: [
        {
          data: [
            totalSuccess,
            totalFailed,
            totalPending
          ],
          backgroundColor: ['#47B39C', '#EC6B56', '#FFC154'], // Green, Red, Orange
          borderWidth: 0,
          hoverOffset: 4
        },
      ],
    };
  }
  else{
    const length = this.transactionStatusData.length;
    const currentMonth = new Date().getMonth();
    const currentMonthInwords = new Intl.DateTimeFormat('en', { month: 'long' }).format(
        new Date(this.currentYear, currentMonth));
    this.subTitle = `Current Month - ${currentMonthInwords}`
    alert(currentMonth);
    alert(length);
    alert(this.transactionStatusData[length-1].successCount);
    this.totalTransactionCount = this.transactionStatusData[currentMonth].successCount+this.transactionStatusData[currentMonth].failedCount+this.transactionStatusData[currentMonth].pendingCount;
    this.donutChartData = {
      labels: ['Success', 'Failed', 'Pending'],
      datasets: [
        {
          data: [
            this.transactionStatusData[currentMonth].successCount,
            this.transactionStatusData[currentMonth].failedCount,
            this.transactionStatusData[currentMonth].pendingCount
          ],
          backgroundColor: ['#47B39C', '#EC6B56', '#FFC154'], // Green, Red, Orange
          borderWidth: 0,
          hoverOffset: 4
        },
      ],
    };
  }
  }
  generateTransactionAmountChart() {
    const labels = this.transactionAmountData.map((d: any) => `M${d.month}`);
    /* this.chartConfig = {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              type: 'bar',
              label: 'No. of Transactions',
              data: this.transactionAmountData.map((d: any) => d.noOfTxn),
              backgroundColor: '#57657F' // Tailwind blue-400
            },
            {
              type: 'line',
              label: 'Total Amount (؋)',
              data: this.transactionAmountData.map((d: any) => d.totalAmount),
              borderColor: '#47B39C', // Tailwind pink-400
              borderWidth: 4,
              fill: false,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#374151' // Tailwind gray-700
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Transactions' }
            },
            y1: {
              beginAtZero: true,
              position: 'right',
              title: { display: true, text: 'Total Amount (؋)' },
              grid: { drawOnChartArea: false }
            }
          }
        }
      };*/
    const pastelColors = [
      '#A7F3D0', // green-200
      '#BFDBFE', // blue-200
      '#C7D2FE', // indigo-200
      '#FBCFE8', // pink-200
      '#FDE68A', // yellow-200
      '#FCD34D', // amber-300
      '#F9A8D4', // rose-300
      '#FCA5A5', // red-300
      '#FDBA74', // orange-300
      '#FDE68A', // yellow-200 (repeat for 10)
      '#E9D5FF', // purple-200
      '#D9F99D'  // lime-200
    ];

    this.chartConfig = {
      type: 'bar',
      data: {
        labels: this.getMonthLabels(),
        datasets: [
          {
            type: 'bar',
            label: 'Total Amount (؋)',
            data: this.transactionAmountData.map((d: any) => d.totalAmount),
            backgroundColor: '#FCA5A5',
            borderRadius: 2 // smooth rounded bars
          },
          {
            type: 'line',
            label: 'No. of Transactions',
            data: this.transactionAmountData.map((d: any) => d.noOfTxn),
            borderColor: '#6366F1', // Tailwind indigo-500
            backgroundColor: '#6366F1',
            tension: 0.4,
            borderWidth: 2,
            yAxisID: 'y1',
            pointRadius: 4,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#6366F1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#374151' }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                if (ctx.dataset.label?.includes('Total Amount')) {
                  return `؋ ${ctx.formattedValue}`;
                }
                return `Transactions: ${ctx.formattedValue}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Total Amount (؋)' }
          },
          y1: {
            beginAtZero: true,
            position: 'right',
            title: { display: true, text: 'Transactions' },
            grid: { drawOnChartArea: false }
          }
        }
      }
    };

  }
  getKYCCount() {
    this.dashboardService.getTotalKYC().subscribe(response => {
      if (response.responseCode == 200) {
        this.kycCount = response.data;
        const kycStatus = ['Incomplete', 'In Review', 'Verified L1', 'Verified L2', 'Approved', 'Rejected'];
        setTimeout(() => {
          const kycType = this.kycCount.map((item: any) => item.kycType);
          this.generateKYCChart(kycType, kycStatus);
        }, 500);
      }
    })
  }
  getTransactionSummary(year: any) {
    this.dashboardService.getTransactionSummary(year).subscribe(response => {
      if (response.responseCode == 200) {
        this.transactionStatusData = response.data;
        setTimeout(() => {

          this.generateTransactionStatusChart();
        }, 500);

      }
    })
  }
  getTransactionAmountSummary(year: any) {
    this.dashboardService.getTransactionSummaryAmount(year).subscribe(response => {
      if (response.responseCode == 200) {
        this.transactionAmountData = response.data;
        setTimeout(() => {
          this.generateTransactionAmountChart();
        }, 500);
      }
    })
  }
  largeTransactionCount() {
    this.dashboardService.largeTransactionCount().subscribe(response => {
      if (response.responseCode == 200) {
        this.transactionCount = response.data;

      }
      else {
        //alert("Network Error");
      }
    })
  }
  getEmoneyBalance() {
    this.dashboardService.getEmoneyBalance().subscribe(response => {
      if (response.responseCode == 200) {
        this.eMoneyBalance = response.data;

      }
      else {
        //alert("Network Error");
      }
    })
  }
  getSetaraganBalance() {
    this.dashboardService.getSetaraganBalance().subscribe(response => {
      if (response.responseCode == 200) {
        this.setaraganBalance = response.data;

      }
      else {
        // alert("Network Error");
      }
    })
  }
  getActiveServiceBalance() {
    this.dashboardService.getActiveServiceBalance().subscribe(response => {
      if (response.responseCode == 200) {
        this.activeServiceBalance = response.data?.data?.balance?.available_amount;
        console.log("Active", this.activeServiceBalance);

      }
      else {
        // alert("Network Error");
      }
    })
  }
  getAwccInventoryBalance() {
    this.dashboardService.getAwccInventoryBalance().subscribe(response => {
      if (response.responseCode == 200) {
        this.awccInventoryBalance = response.data;

      }
      else {
        //alert("Network Error");
      }
    })
  }
  getMonthLabels(): string[] {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-based index (0 = Jan, 11 = Dec)

    return Array.from({ length: currentMonth + 1 }, (_, i) => {
      return new Intl.DateTimeFormat('en', { month: 'short' }).format(
        new Date(currentYear, i)
      );
    });
  }

}
