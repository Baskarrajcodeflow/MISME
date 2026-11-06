import { Routes } from '@angular/router';

export const TRANSACTION_AND_GL_ROUTES: Routes = [
  {
    path: 'create-transaction-and-gl',
    loadComponent: () => import('./create-transaction-and-gl/create-transaction-and-gl.component').then(c => c.CreateTransactionAndGlComponent)
  },
  {
    path: 'list-transaction-and-gl',
    loadComponent: () => import('./list-transaction-and-gl/list-transaction-and-gl.component').then(c => c.ListTransactionAndGlComponent)
  },
  {
    path: 'status-check',
    loadComponent: () => import('./status-check/status-check.component').then(c => c.StatusCheckComponent)
  },
  {
    path: 'refund-transaction',
    loadComponent: () => import('./refund-transaction/refund-transaction.component').then(c => c.RefundTransactionComponent)
  },

  {
    path: 'process-refund',
    loadComponent: () => import('./process-refund/process-refund.component').then(c => c.ProcessRefundComponent)
  },
  {
    path: 'chart-of-accounts',
    loadComponent: () => import('./chart-of-accounts/chart-of-accounts.component').then(c => c.ChartOfAccountsComponent)
  },

  {
    path: 'chart-of-acc-basic-page',
    loadComponent: () => import('./chart-of-acc-basic-page/chart-of-acc-basic-page.component').then(c => c.ChartOfAccBasicPageComponent)
  },
  {
    path: 'balance-sheet',
    loadComponent: () => import('./balance-sheet/balance-sheet.component').then(c => c.BalanceSheetComponent)

  },
  {
    path: 'transaction-monitoring',
    loadComponent: () => import('./transaction-monitoring/transaction-monitoring.component').then(c => c.TransactionMonitoringComponent)
  },





];

