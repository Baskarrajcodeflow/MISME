export interface WalletAccount {
  id: number;
  accountNo: any;
  baseUserId: number;
  headAccountNo: any;
  subAccountNo: any;
  walletNo: any;
  walletType: any;
  accountDescription: any;
  walletStatus: any; // This can be a single status or adjusted to an array if needed
  dormant: boolean;
  locked: boolean;
  noCredit: boolean;
  noDebit: boolean;
  acOpenDate: any;
  acStmtDay: any;
  accRemarks: any;
  branchCode: any;
  ccy: any;
  productReference: number;
  checkerDtStamp: any;
  makerDtStamp: any;
  checkerId: any;
  makerId: any;
  cifNo: any;
  wallet: any; // Adjust as needed
  [key: string]: any;  // This allows accessing any property dynamically
  status: string;  
}
