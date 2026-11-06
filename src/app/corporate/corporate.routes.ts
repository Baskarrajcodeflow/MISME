import { Routes } from '@angular/router';

export const CORPORATE_ROUTES: Routes = [
   {
          path: 'list-master-agent',
        loadComponent: () => import('./list-master-agent/list-master-agent.component').then(c => c.ListMasterAgentComponent)
        },
         {
        path: 'create-master-agent',
        loadComponent: () => import('./create-master-agent/create-master-agent.component').then(c => c.CreateMasterAgentComponent)
      },
        {
          path: 'list-direct-agent',
        loadComponent: () => import('./list-direct-agent/list-direct-agent.component').then(c => c.ListDirectAgentComponent)
        },
  
        {
          path: 'merchant-edit',
        loadComponent: () => import('./merchant-edit/merchant-edit.component').then(c => c.MerchantEditComponent)
        },
        {
          path: 'agent-edit',
        loadComponent: () => import('./agent-edit/agent-edit.component').then(c => c.AgentEditComponent)
        },
  
        {
          path: 'create-direct-agent',
        loadComponent: () => import('./create-direct-agent/create-direct-agent.component').then(c => c.CreateDirectAgentComponent)
        },
        {
          path: 'create-merchant-onboarding',
        loadComponent: () => import('./create-merchant-onboarding/create-merchant-onboarding.component').then(c => c.CreateMerchantOnboardingComponent)

        },
        {
          path: 'list-merchant-onboarded',
        loadComponent: () => import('./list-merchant-onboarded/list-merchant-onboarded.component').then(c => c.ListMerchantOnboardedComponent)
        },
        {
          path: 'create-agent',
        loadComponent: () => import('./create-agent/create-agent.component').then(c => c.CreateAgentComponent)
        },
           {
        path: 'corporate-registartion',
        loadComponent: () => import('./corporate-registartion/corporate-registartion.component').then(c => c.CorporateRegistartionComponent)
      },
      {
        path: 'corporate-list',
        loadComponent: () => import('./corporate-list/corporate-list.component').then(c => c.CorporateListComponent)
      },

        
      
  
 
];

