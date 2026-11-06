import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { StatusReport } from './csv-validation-report.model';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
// import { NgChartsModule } from 'ng2-charts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { EmailService } from './email.service';
import { CsvUploadComponent } from "../csv-upload/csv-upload.component"; // Import your email service

@Component({
  selector: 'app-csv-validation-report',
  standalone: true,
  imports: [ KeyValuePipe, NgIf, NgFor, CsvUploadComponent],
  templateUrl: './csv-validation-report.component.html',
  styleUrls: ['./csv-validation-report.component.css'],
})
export class CsvValidationReportComponent implements OnInit {
  @Output() validationEvent = new EventEmitter<string>();
getAnalysisReport() {
  this.validationEvent.emit("GET_ANALYSIS_REPORT")
}
onScheduleClick() {
  this.validationEvent.emit("SCHEDULE")
  }
  
  @ViewChild('reportContent') reportContent!: ElementRef;
  report: StatusReport = {
    fileName: 'Hydhros_Employee_Salaries_Dec_2024.csv',
    fileSize: 1048576, // in bytes (1 MB)
    md5Checksum: 'ab56b4d92b40713acc5af89985d4b786',
    totalLines: 5000,
    failuresByType: {
      IncorrectFieldCountFailure: [
        { lineNumber: 15, reason: 'Incorrect number of fields' },
        { lineNumber: 87, reason: 'Incorrect number of fields' },
        { lineNumber: 256, reason: 'Incorrect number of fields' },
        { lineNumber: 789, reason: 'Incorrect number of fields' },
        { lineNumber: 1023, reason: 'Incorrect number of fields' },
        { lineNumber: 2048, reason: 'Incorrect number of fields' },
      ],
      EmptyNameFailure: [
        { lineNumber: 34, reason: 'Name is empty' },
        { lineNumber: 478, reason: 'Name is empty' },
        { lineNumber: 1500, reason: 'Name is empty' },
      ],
      InvalidAccountFormatFailure: [
        { lineNumber: 56, reason: 'Account format is invalid' },
        { lineNumber: 1234, reason: 'Account format is invalid' },
        { lineNumber: 1987, reason: 'Account format is invalid' },
        { lineNumber: 2500, reason: 'Account format is invalid' },
      ],
      NegativeAmountFailure: [
        { lineNumber: 78, reason: 'Amount is negative' },
        { lineNumber: 345, reason: 'Amount is negative' },
        { lineNumber: 678, reason: 'Amount is negative' },
        { lineNumber: 901, reason: 'Amount is negative' },
        { lineNumber: 1123, reason: 'Amount is negative' },
        { lineNumber: 1800, reason: 'Amount is negative' },
      ],
      InvalidAmountNumberFailure: [
        { lineNumber: 150, reason: 'Amount is not a valid number' },
        { lineNumber: 321, reason: 'Amount is not a valid number' },
        { lineNumber: 654, reason: 'Amount is not a valid number' },
        { lineNumber: 999, reason: 'Amount is not a valid number' },
      ],
    },
    duplicateAccounts: {
      'ACC12345': 4,
      'ACC67890': 3,
      'ACC54321': 2,
      'ACC09876': 5,
      'ACC11223': 2,
      'ACC33445': 6,
      'ACC55667': 3,
      'ACC77889': 2,
      'ACC99000': 4,
      'ACC11122': 3,
    },
  };


  public failureChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      // legend: { position: 'top' },
      title: { display: true, text: 'Failures by Type' },
    },
  };
  // public failureChartType: ChartType = 'doughnut';
  public failureChartData!: ChartData<'doughnut'>;

  public duplicateAccountsChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Duplicate Accounts' },
    },
    scales: {
      x: { title: { display: true, text: 'Account Number' } },
      y: { title: { display: true, text: 'Count' }, beginAtZero: true },
    },
  };
  // public duplicateAccountsChartType: ChartType = 'bar';
  public duplicateAccountsChartData!: ChartData<'bar'>;

  openSections: { [key: string]: boolean } = {};
  isEmailLoading: boolean = false;
  isDuplicateExpanded: boolean = false;

  constructor(private emailService: EmailService){}

  ngOnInit(): void {
    this.prepareFailureChartData();
    this.prepareDuplicateAccountsChartData();
  }

  private prepareFailureChartData(): void {
    const labels = Object.keys(this.report.failuresByType).map(key => this.getReadableLabel(key));
    const data = Object.values(this.report.failuresByType).map(arr => arr.length);
  
    this.failureChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: ['#F87171', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA'],
          hoverOffset: 4,
        },
      ],
    };
  }
  
  private prepareDuplicateAccountsChartData(): void {
    const labels = this.duplicateAccountEntries.map(entry => entry.accountNumber);
    const data = this.duplicateAccountEntries.map(entry => entry.count);
  
    this.duplicateAccountsChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Duplicate Count',
          data: data,
          backgroundColor: '#60A5FA',
        },
      ],
    };
  }

  public getReadableLabel(key: string): string {
      const labels: { [key: string]: string } = {
        IncorrectFieldCountFailure: 'Incorrect Field Count',
        EmptyNameFailure: 'Empty Name',
        InvalidAccountFormatFailure: 'Invalid Account Format',
        NegativeAmountFailure: 'Negative Amount',
        InvalidAmountNumberFailure: 'Invalid Amount Number',
      };
      return labels[key] || key;
    }
    

  get fileSizeInKB(): string {
    return (this.report.fileSize / 1024).toFixed(2) + ' KB';
  }

  get duplicateAccountEntries(): { accountNumber: string; count: number }[] {
    return Object.entries(this.report.duplicateAccounts).map(([accountNumber, count]) => ({
      accountNumber,
      count,
    }));
  }

  isFieldsExpanded = false;
  toggleFieldAccordion() {
    this.isFieldsExpanded = !this.isFieldsExpanded;
  }
  toggleAccordion() {
    this.isDuplicateExpanded = !this.isDuplicateExpanded
  }
  exportAndEmailReport() {
    // this.isLoading = true; // Show loading indicator

    const DATA = this.reportContent.nativeElement;
    html2canvas(DATA, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const pdfOutput = pdf.output('blob');

      // Send the PDF data to the backend API to handle email sending
      this.sendEmailWithPdf(pdfOutput);
    });
  }

  sendEmailWithPdf(pdfData: Blob) {
    this.emailService.sendEmailWithAttachment(pdfData).subscribe(
      (response: any) => {
        this.isEmailLoading = false;
        alert('Email sent successfully!');
      },
      (error: any) => {
        this.isEmailLoading = false;
        alert('An error occurred while sending the email.');
      }
    );
  }
}
