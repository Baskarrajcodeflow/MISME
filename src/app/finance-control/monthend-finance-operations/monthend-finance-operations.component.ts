import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-monthend-finance-operations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monthend-finance-operations.component.html',
  styleUrl: './monthend-finance-operations.component.css'
})
export class MonthendFinanceOperationsComponent {
 entity = "ABC EMI Ltd";
  period = "Jan 2026";

  // 1️⃣ Executive Snapshot
  executiveSnapshot = {
    openingFloat: 500000,
    txnVolume: 1200000,
    txnCount: 45200,
    grossRevenue: 85000,
    netRevenue: 72000,
    adjustments: -2000,
    closingFloat: 568000,
    glCode: "GL1001"
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

revenueBreakdown = [
  {
    stream: "Customer Fees",
    opening: 2000,
    revenue: 5000,
    adjustment: 200,
    closing: 7200,
    gl: "GL3001"
  },
  {
    stream: "Merchant Discount",
    opening: 1500,
    revenue: 4000,
    adjustment: 100,
    closing: 5600,
    gl: "GL3002"
  },
  {
    stream: "Partner Commissions",
    opening: 1000,
    revenue: 3500,
    adjustment: -50,
    closing: 4450,
    gl: "GL3003"
  },
  {
    stream: "Float Interest",
    opening: 800,
    revenue: 1200,
    adjustment: 0,
    closing: 2000,
    gl: "GL3004"
  },
  {
    stream: "Other Income",
    opening: 500,
    revenue: 900,
    adjustment: 0,
    closing: 1400,
    gl: "GL3005"
  },
  {
    stream: "Total",
    opening: 5800,
    revenue: 14600,
    adjustment: 250,
    closing: 20650,
    gl: ""
  }
];

 customerFloat = [
  {
    item: "Customer Wallet Balances",
    opening: 300000,
    inflow: 120000,
    outflow: 90000,
    adjustment: 0,
    closing: 330000,
    gl: "GL4001"
  },
  {
    item: "Transit / Suspense Accounts",
    opening: 20000,
    inflow: 15000,
    outflow: 10000,
    adjustment: 500,
    closing: 25500,
    gl: "GL4002"
  },
  {
    item: "Total Customer Float",
    opening: 320000,
    inflow: 135000,
    outflow: 100000,
    adjustment: 500,
    closing: 355500,
    gl: ""
  }
];

 settlement = [
  {
    partner: "Bank",
    opening: 50000,
    settlement: 30000,
    adjustment: 1000,
    closing: 81000,
    status: "Matched",
    gl: "GL5001"
  },
  {
    partner: "Telco",
    opening: 20000,
    settlement: 15000,
    adjustment: 0,
    closing: 35000,
    status: "Pending",
    gl: "GL5002"
  },
  {
    partner: "Billers",
    opening: 18000,
    settlement: 12000,
    adjustment: -500,
    closing: 29500,
    status: "Matched",
    gl: "GL5003"
  },
  {
    partner: "Merchants",
    opening: 25000,
    settlement: 20000,
    adjustment: 0,
    closing: 45000,
    status: "Matched",
    gl: "GL5004"
  },
  {
    partner: "Government",
    opening: 10000,
    settlement: 8000,
    adjustment: 0,
    closing: 18000,
    status: "Pending",
    gl: "GL5005"
  }
];

accountingEntries = [
  {
    date: "2026-01-05",
    journalRef: "JR1001",
    debitAccount: "Customer Float Account",
    debitGL: "GL4001",
    creditAccount: "Bank Settlement Account",
    creditGL: "GL5001",
    amount: 25000,
    narration: "Float adjustment settlement"
  },
  {
    date: "2026-01-12",
    journalRef: "JR1002",
    debitAccount: "Merchant Payable",
    debitGL: "GL6001",
    creditAccount: "Wallet Clearing",
    creditGL: "GL6002",
    amount: 18000,
    narration: "Merchant settlement entry"
  }
];

adjustmentsLog = [
  {
    ref: "ADJ1001",
    description: "Incorrect merchant settlement reversal",
    rootCause: "Manual posting error",
    amount: -5000,
    impactArea: "Merchant Payments",
    gl: "GL2003",
    approval: "Approved"
  },
  {
    ref: "ADJ1002",
    description: "Float reconciliation difference",
    rootCause: "Timing mismatch",
    amount: 2500,
    impactArea: "Customer Float",
    gl: "GL4001",
    approval: "Pending"
  }
];
}
