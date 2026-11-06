export const mockDataEntry: DataEntry = {
  name: 'John Doe',
  amount: 1234.56,
  accountNumber: 'ACC123456789',
  status: 'Pending',
  riskScore: 75,
  riskTier: 'Medium',
};
const records : mockDataEntry[] ;


export const mockStatusReport: StatusReport = {
  fileName: 'sample_data.csv',
  fileSize: 204800, // in bytes
  md5Checksum: 'd41d8cd98f00b204e9800998ecf8427e',
  totalLines: 100,
  failuresByType: {
    IncorrectFieldCountFailure: [
      { lineNumber: 10, reason: 'Incorrect number of fields' },
      { lineNumber: 20, reason: 'Incorrect number of fields' },
    ],
    InvalidAccountFormatFailure: [
      { lineNumber: 30, reason: 'Account format is invalid' },
    ],
  },
  duplicateAccounts: {
    'ACC12345': 2,
    'ACC67890': 3,
  },
};

export const mockDataPreviewResponse: DataPreviewResponse = {
  dataEntry: mockDataEntry[],
  statusReport: mockStatusReport,
  aggregateBalanceError: 'Total amount exceeds the allowed limit.',
  ignoredRecords: ['Record 50: Negative amount', 'Record 75: Missing account number'],
};
