import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPreviewResponse } from './data-preview.model';

@Injectable({
  providedIn: 'root',
})
export class DataPreviewService {
  constructor() {}

  getDataPreviewResponse(): Observable<DataPreviewResponse> {
    const mockData: DataPreviewResponse = {
      dataEntry: [
            {
              name: 'John Doe',
              amount: 1500.0,
              accountNumber: 'ACC12345',
              status: 'Pending',
              riskScore: 5,
              riskTier: 'Low',
            },
            {
              name: 'Jane Smith',
              amount: 2500.0,
              accountNumber: 'ACC67890',
              status: 'Approved',
              riskScore: 3,
              riskTier: 'Medium',
            },
            {
              name: 'Alice Johnson',
              amount: 3000.0,
              accountNumber: 'ACC54321',
              status: 'Rejected',
              riskScore: 8,
              riskTier: 'High',
            },
            {
              name: 'Bob Brown',
              amount: 2000.0,
              accountNumber: 'ACC09876',
              status: 'Pending',
              riskScore: 6,
              riskTier: 'Medium',
            },
            {
              name: 'Carol White',
              amount: 1800.0,
              accountNumber: 'ACC11223',
              status: 'Approved',
              riskScore: 4,
              riskTier: 'Low',
            },
      ],
      statusReport: {
        fileName: 'detailed_financial_report.csv',
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
      },
      aggregateBalanceError: 'Total amount exceeds the allowed limit.',
      ignoredRecords: ['Record with ID 101', 'Record with ID 102'],
    };

    return of(mockData);
  }
}
