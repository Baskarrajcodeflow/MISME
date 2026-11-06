import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-yearend-finance-operations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './yearend-finance-operations.component.html',
  styleUrl: './yearend-finance-operations.component.css'
})
export class YearendFinanceOperationsComponent {
entity = "ABC EMI Ltd";
financialYear = "FY 2025-2026";

annualExecutiveSummary = {
  openingFloat: 450000,
  annualTxnVolume: 15000000,
  annualTxnCount: 520000,
  grossRevenue: 950000,
  netRevenue: 820000,
  totalAdjustments: 15000,
  closingFloat: 520000,
  yoyGrowth: "12%"
};
transactionSummary = [
  {
    channel: "Wallet Transfers",
    opening: 10000,
    inflow: 50000,
    outflow: 30000,
    net: 20000,
    closing: 30000,
    gl: "GL2001"
  },
  {
    channel: "Cash-in/Cash-out",
    opening: 15000,
    inflow: 40000,
    outflow: 25000,
    net: 15000,
    closing: 30000,
    gl: "GL2002"
  },

  // 👉 THESE ARE THE ONES YOU ASKED
  {
    channel: "Merchant Payments",
    opening: 8000,
    inflow: 20000,
    outflow: 15000,
    net: 5000,
    closing: 13000,
    gl: "GL2003"
  },
  {
    channel: "Airtime / Utilities",
    opening: 5000,
    inflow: 12000,
    outflow: 9000,
    net: 3000,
    closing: 8000,
    gl: "GL2004"
  },
  {
    channel: "Bill Payments",
    opening: 6000,
    inflow: 15000,
    outflow: 11000,
    net: 4000,
    closing: 10000,
    gl: "GL2005"
  },
  {
    channel: "Remittance",
    opening: 7000,
    inflow: 18000,
    outflow: 14000,
    net: 4000,
    closing: 11000,
    gl: "GL2006"
  }
];
yearEndAdjustments = [
  {
    ref: "YE1001",
    type: "Provision",
    description: "Year-end expected loss provision",
    rootCause: "Regulatory requirement",
    amount: 15000,
    impactArea: "Revenue Adjustment",
    approval: "Approved"
  },
  {
    ref: "YE1002",
    type: "Write-back",
    description: "Unused provision reversal",
    rootCause: "Overestimation",
    amount: 5000,
    impactArea: "Expense Adjustment",
    approval: "Approved"
  }
];

annualTransactionSummary = [
  { channel: "Wallet Transfers", opening: 100000, inflow: 500000, outflow: 400000 },
  { channel: "Cash-in/Cash-out", opening: 80000, inflow: 300000, outflow: 250000 },
  { channel: "Merchant Payments", opening: 60000, inflow: 280000, outflow: 220000 },
  { channel: "Airtime/Utilities", opening: 30000, inflow: 150000, outflow: 120000 },
  { channel: "Bill Payments", opening: 25000, inflow: 130000, outflow: 110000 },
  { channel: "Remittance", opening: 40000, inflow: 200000, outflow: 170000 }
];
annualRevenueBreakdown = [
  {
    stream: "Customer Fees",
    opening: 20000,
    revenueFY: 80000,
    adjustment: 2000
  },
  {
    stream: "Merchant Discount",
    opening: 15000,
    revenueFY: 60000,
    adjustment: 1500
  },
  {
    stream: "Partner Commissions",
    opening: 10000,
    revenueFY: 45000,
    adjustment: 500
  },
  {
    stream: "Float Interest",
    opening: 5000,
    revenueFY: 15000,
    adjustment: 0
  },
  {
    stream: "Other Income",
    opening: 3000,
    revenueFY: 10000,
    adjustment: 200
  }
];

annualCustomerFloat = [
  {
    item: "Customer Wallet Balances",
    opening: 400000,
    inflow: 900000,
    outflow: 850000,
    adjustment: 5000
  },
  {
    item: "Transit/Suspense Accounts",
    opening: 50000,
    inflow: 120000,
    outflow: 100000,
    adjustment: 2000
  }
];

yearEndSettlementData = [
  {
    partner: "Banks",
    opening: 250000,
    settlement: 800000,
    adjustment: 5000,
    status: "Reconciled"
  },
  {
    partner: "Telco",
    opening: 120000,
    settlement: 400000,
    adjustment: 3000,
    status: "Pending"
  },
  {
    partner: "Billers",
    opening: 80000,
    settlement: 220000,
    adjustment: 0,
    status: "Reconciled"
  },
  {
    partner: "Merchants",
    opening: 150000,
    settlement: 500000,
    adjustment: 2000,
    status: "Reconciled"
  },
  {
    partner: "Government Programs",
    opening: 60000,
    settlement: 180000,
    adjustment: 1000,
    status: "Pending"
  }
];
fyAccountingEntries = [
  {
    date: '2026-03-31',
    ref: 'JE-FY-0001',
    debit: 'Customer Float Account',
    credit: 'Safeguarding Bank Account',
    amount: 250000,
    narration: 'Year-end safeguarding adjustment'
  },
  {
    date: '2026-03-30',
    ref: 'JE-FY-0002',
    debit: 'Commission Expense',
    credit: 'Partner Payable',
    amount: 85000,
    narration: 'Year-end partner commission accrual'
  },
  {
    date: '2026-03-29',
    ref: 'JE-FY-0003',
    debit: 'Suspense Account',
    credit: 'Customer Wallet Control',
    amount: 12000,
    narration: 'Transit reconciliation adjustment'
  }
];
yearEndCloseEntries = [
  {
    ref: 'YE-ADJ-001',
    type: 'Provision',
    description: 'Expected credit loss provision',
    rootCause: 'Regulatory requirement',
    amount: 15000,
    impactArea: 'Revenue Adjustment',
    approval: 'Approved'
  },
  {
    ref: 'YE-ADJ-002',
    type: 'Write-back',
    description: 'Unused provision reversal',
    rootCause: 'Overestimation',
    amount: 5000,
    impactArea: 'Expense Adjustment',
    approval: 'Approved'
  },
  {
    ref: 'YE-ADJ-003',
    type: 'Provision',
    description: 'Partner settlement risk buffer',
    rootCause: 'Risk reassessment',
    amount: 22000,
    impactArea: 'Liability Adjustment',
    approval: 'Pending'
  }
];
getNet(row: any) {
  return row.inflow - row.outflow;
}

getClosing(row: any) {
  return row.opening + this.getNet(row);
}

getTotal(field: any) {
  return this.annualTransactionSummary.reduce((sum:any, row:any) => {
    if (field === 'net') return sum + this.getNet(row);
    if (field === 'closing') return sum + this.getClosing(row);
    return sum + row[field];
  }, 0);
}

getRevenueClosing(row:any){
  return row.opening + row.revenueFY + row.adjustment;
}

getRevenueTotal(field:string){
  return this.annualRevenueBreakdown.reduce((sum:any,row:any)=>{
    if(field==='closing') return sum + this.getRevenueClosing(row);
    return sum + row[field];
  },0);
}
getFloatClosing(row:any){
  return row.opening + row.inflow - row.outflow + row.adjustment;
}

getFloatTotal(field:string){
  return this.annualCustomerFloat.reduce((sum:any,row:any)=>{
    if(field==='closing') return sum + this.getFloatClosing(row);
    return sum + row[field];
  },0);
}
getSettlementClosing(row:any){
  return row.opening + row.settlement + row.adjustment;
}

getSettlementTotal(field:string){
  return this.yearEndSettlementData.reduce((sum:any,row:any)=>{
    if(field === 'closing') return sum + this.getSettlementClosing(row);
    return sum + row[field];
  },0);
}
getFyEntryTotal(){
  return this.fyAccountingEntries.reduce((sum,row)=> sum + row.amount,0);
}
getYearEndAdjustmentTotal(){
  return this.yearEndCloseEntries.reduce((sum,row)=> sum + row.amount,0);
}
}
