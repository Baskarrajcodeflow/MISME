import { Routes } from '@angular/router';

export const KYC_ROUTES: Routes = [
   {
          path: 'view-superagent-kyc',
          loadComponent: () => import('./view-superagent-kyc/view-superagent-kyc.component').then(c => c.ViewSuperagentKycComponent)
        },
         {
        path: 'customer',
        loadComponent: () => import('./kyc/customer-kyc/customer-kyc.component').then(c => c.CustomerKycComponent)
      },
        {
          path: 'view-govt-kyc',
          loadComponent: () => import('./view-govt-kyc/view-govt-kyc.component').then(c => c.ViewGovtKycComponent)
        },
  
        {
          path: 'view-basic-customer',
          loadComponent: () => import('./kyc/view-basic-customer/view-basic-customer.component').then(c => c.ViewBasicCustomerComponent)
        },
        {
          path: 'view-customer-kyc',
          loadComponent: () => import('./kyc/view-customer-kyc/view-customer-kyc.component').then(c => c.ViewCustomerKycComponent)
        },
  
        {
          path: 'incomplete-kyc',
          loadComponent: () => import('./kyc/incomplete-kyc/incomplete-kyc.component').then(c => c.IncompleteKycComponent)
        },
        {
          path: 'agent',
          loadComponent: () => import('./kyc/agent-kyc/agent-kyc.component').then(c => c.AgentKycComponent)

        },
        {
          path: 'Incomplete_Corporate_Kyc',
          loadComponent: () => import('./kyc/corporate-kyc-incomplete/corporate-kyc-incomplete.component').then(c => c.CorporateKycIncompleteComponent)
        },

        
        {
          path: 'view-basic-agent',
          loadComponent: () => import('./kyc/view-basic-agent/view-basic-agent.component').then(c => c.ViewBasicAgentComponent)
        },
        {
          path: 'reset-password',
          loadComponent: () => import('./kyc/reset-password/reset-password.component').then(c => c.ResetPasswordComponent)
        },
        {
          path: 'view-agent-kyc',
          loadComponent: () => import('./kyc/view-agent-kyc/view-agent-kyc.component').then(c => c.ViewAgentKycComponent)
        },
  
        {
          path: 'view-masteragent-kyc',
          loadComponent: () => import('./kyc/view-masteragent-kyc/view-masteragent-kyc.component').then(c => c.ViewMasteragentKycComponent)
        },
        {
          path: 'toast',
          loadComponent: () => import('./kyc/toast/toast.component').then(c => c.ToastComponent)
        },
        {
          path: 'view-shareholder-details/:kycId',
          loadComponent: () => import('./kyc/view-shareholders-details/view-shareholders-details.component').then(c => c.ViewShareholdersDetailsComponent)
        },
  
        {
          path: 'view-authorized-signatory-details/:kycId',
          loadComponent: () => import('./kyc/view-authorized-signatory-details/view-authorized-signatory-details.component').then(c => c.ViewAuthorizedSignatoryDetailsComponent)
        },
  
 
];
