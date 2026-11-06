import { StatusReport } from "../csv-validation-report/csv-validation-report.model";

export interface DataPreviewResponse {
  dataEntry: DataEntry[];
  statusReport: StatusReport;
  aggregateBalanceError: string;
  ignoredRecords: string[];
}

export interface DataEntry {
  name: string;
  amount: number;
  accountNumber: string;
  status: string;
  riskScore: number;
  riskTier: string;
}

