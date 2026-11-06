import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { DataPreviewService } from './data-preview.service';
import { DataPreviewResponse } from './data-preview.model';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports:[
  FormsModule,
  DragDropModule,
  NgIf,NgFor,
  CommonModule,
  ],
  selector: 'app-data-preview',
  templateUrl: './data-preview.component.html',
  styleUrls: ['./data-preview.component.css'],
})
export class DataPreviewComponent implements OnInit {
  dataPreviewResponse: DataPreviewResponse | null = null;
  lowBalanceAction: WritableSignal<string> = signal('');
  summary: { 
    totalEntries: number; 
    totalAmount: number; 
    averageRiskScore: number;
     riskTierCounts: { [tier: string]: number; };
      statusCounts: { [status: string]: number; };
       totalDuplicateAccounts: unknown; 
      }|null = null;
  lowBalanceActions: string[] = ['Process in sequence', 
    'Process lowest First', 
    'process highest',"Don't proceed",
  ];
actions: string[]=["Include","Exclude"];

  constructor(private dataPreviewService: DataPreviewService) {}

  ngOnInit(): void {
    this.dataPreviewService.getDataPreviewResponse().subscribe(
      (data) => {
        this.dataPreviewResponse = data;
      this.computeSummary()  ;
      },
      (error) => {
        console.error('Error fetching data preview response', error);
      }
    );
  }

 
computeSummary(): void {
  if (!this.dataPreviewResponse) return;

  const { dataEntry, statusReport } = this.dataPreviewResponse;

  // Total Entries
  const totalEntries = dataEntry.length;

  // Total Amount
  const totalAmount = dataEntry.reduce((sum, entry) => sum + entry.amount, 0);

  // Average Risk Score
  const averageRiskScore =
    dataEntry.reduce((sum, entry) => sum + entry.riskScore, 0) / totalEntries;

  // Total Duplicate Accounts
  const totalDuplicateAccounts = Object.values(statusReport.duplicateAccounts ).reduce(
    (sum, count) => sum + count,
    0
  );

  // Count of each type of account status
  const statusCounts: { [status: string]: number } = {};
  dataEntry.forEach((entry) => {
    statusCounts[entry.status] = (statusCounts[entry.status] || 0) + 1;
  });

  // Count of each type of risk tier
  const riskTierCounts: { [tier: string]: number } = {};
  dataEntry.forEach((entry) => {
    riskTierCounts[entry.riskTier] = (riskTierCounts[entry.riskTier] || 0) + 1;
  });



  this.summary = {
    totalEntries,
    totalAmount,
    averageRiskScore: parseFloat(averageRiskScore.toFixed(2)),
    riskTierCounts,
    statusCounts,
    totalDuplicateAccounts,
  };
}

// Helper method to get object keys
objectKeys(obj: object): string[] {
  return Object.keys(obj);
}

// Action Button Handlers
onReUpload(): void {
  // Implement reUpload functionality
  console.log('ReUpload button clicked');
}

onSchedule(): void {
  // Implement schedule functionality
  console.log('Schedule button clicked');
}

onScheduleWithError(): void {
  // Implement schedule with error functionality
  console.log('Schedule with Error button clicked');
}

onDeleteFile(): void {
  // Implement delete file functionality
  console.log('Delete File button clicked');
}
}