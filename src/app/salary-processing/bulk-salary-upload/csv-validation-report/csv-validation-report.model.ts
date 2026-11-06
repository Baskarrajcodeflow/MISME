export interface Failure {
    lineNumber: number;
    reason: string;
  }
  
  export interface IncorrectFieldCountFailure extends Failure {}
  export interface EmptyNameFailure extends Failure {}
  export interface InvalidAccountFormatFailure extends Failure {}
  export interface NegativeAmountFailure extends Failure {}
  export interface InvalidAmountNumberFailure extends Failure {}
  
  export type FailureType =
    | 'IncorrectFieldCountFailure'
    | 'EmptyNameFailure'
    | 'InvalidAccountFormatFailure'
    | 'NegativeAmountFailure'
    | 'InvalidAmountNumberFailure';
  
  export interface LineResult {
    failure?: Failure;
    accountNumber?: string;
  }
  
  export interface StatusReport {
    fileName: string;
    fileSize: number; // in bytes
    md5Checksum: string;
    totalLines: number;
    failuresByType: {
      [key in FailureType]: Failure[];
    };
    duplicateAccounts: {
      [accountNumber: string]: number;
    };
  }
  