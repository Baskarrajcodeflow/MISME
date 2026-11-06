export interface AmountLimit {
  id?: number; // Use optional property for id since it's auto-generated
  name: string;
  perTxnLimit?: number; // Use number for Double
  perDayLimit?: number; // Use number for Double
  perMonthLimit?: number; // Use number for Double
  currency: string;
  active?: boolean;
  createdOn?: string; // Use string to represent LocalDateTime (ISO 8601 format)
  modifiedOn?: string; // Use string to represent LocalDateTime (ISO 8601 format)
}

export interface Service {
  id?: number; // Use optional property for id since it's auto-generated
  name: string;

  active: boolean;
}
export interface SubProductService {
  id?: number; // Use optional property for id since it's auto-generated
  name: string;
  subProdType: string;
  // combo:
}
export interface EditSubProductService {
  id?: number; // Use optional property for id since it's auto-generated
  name: string;
  subProdType: string;
  ptService: Service;
  // combo:
}
export interface Cashback {
  id?: number; // Optional property since it's auto-generated
  active: boolean;
  type: CashBackType; // Enum for CashBackType
  amount?: number; // Optional and non-negative
  name: string;
  percentage?: number; // Optional and non-negative
}

// Define the CashBackType enum to match the possible values in your backend
export enum CashBackType {
  FIXED = "FIXED",
  PERCENT = "PERCENT",
}

export interface ChargesAndCommission {
  id?: number; // Optional property since it's auto-generated
  type: FeesAndCommissionType; // Enum for FeesAndCommissionType
  amount?: number; // Optional and non-negative
  percentage?: number; // Optional and non-negative
  active: boolean;
  currency: string;
  slabwiseCommisions?: ChargesAndCommissionSlabwise[]; // Optional list of slabwise commissions
  name: string;
}

export enum FeesAndCommissionType {
  FIXED = "FIXED",
  PERCENT = "PERCENT",
  SLABWISE = "SLABWISE",
  SLABWISE_FIXED = "SLABWISE_FIXED",
  SLABWISE_PERCENT = "SLABWISE_PERCENT",
}

// Define the ChargesAndCommissionSlabwise interface
export interface ChargesAndCommissionSlabwise {
  id?: number; // Optional property since it's auto-generated
  minAmount?: number; // Optional and non-negative
  maxAmount?: number; // Optional and non-negative
  chargesAndCommission?: ChargesAndCommission; // Reference to ChargesAndCommission
  active: boolean;
  value?: number; // Optional
  percentage?: number; // Optional
  name?: string; // Optional
  currency?: string; // Optional
}

export interface FeesAndCommission {
  id?: number; // Optional property since it's auto-generated
  type: FeesAndCommissionType; // Enum for FeesAndCommissionType
  active: boolean;
  amount?: number; // Optional and non-negative
  percentage?: number; // Optional and non-negative
  currency: string;
  slabwiseCommisions?: FeesAndCommissionSlabwise[]; // Optional list of slabwise commissions
  name: string;
  commissionType?: string; // Optional
  subAgentCommission?: SubAgentCommission[]; // Optional list of sub-agent commissions
  merchantCommission?: MerchantCommission[]; // Optional list of merchant commissions
}
export interface FeesAndCommissionSlabwise {
  id?: number; // Optional property since it's auto-generated
  minAmount?: number; // Optional and non-negative
  name?: string; // Optional
  maxAmount?: number; // Optional and non-negative
  feesAndCommission?: FeesAndCommission; // Reference to FeesAndCommission, can be null
  active: boolean;
  value?: number; // Optional
  percentage?: number; // Optional
  currency?: string; // Optional
}

export interface SubAgentCommission {
  id?: number; // Optional property since it's auto-generated
  feesAndCommission?: FeesAndCommission; // Reference to FeesAndCommission, can be null
  commissionPercentage?: number; // Optional
}

export interface MerchantCommission {
  id?: number; // Optional property since it's auto-generated
  feesAndCommission?: FeesAndCommission; // Reference to FeesAndCommission, can be null
  commissionPercentage?: number; // Optional
}
export interface TaxComponent {
  id?: number; // Optional property since it's auto-generated
  name: string; // Required
  percentage: number; // Required
  active: boolean; // Default is false
}

export interface TransactionLimit {
  id?: number; // Optional property since it's auto-generated
  dailyAllowed?: number; // Optional
  monthlyAllowed?: number; // Optional
  active: boolean; // Default is false
  currency: string; // Required
  name: string; // Required
  createdOn?: Date; // Optional, auto-generated
  modifiedOn?: Date; // Optional, auto-generated
}
export interface  AccountClosureRequest {
  walletNo: string;
  reasonForClosure: string;
}
