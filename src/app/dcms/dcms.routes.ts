import { Routes } from '@angular/router';

export const DCMS_ROUTES: Routes = [
  /*  {
      path: '/project-management/list-project',
      loadComponent: () => import('./project-management/list-project/list-project.component').then(c => c.ListProjectComponent)
    },
    {
      path: '/subproject-management/list-subproject',
      loadComponent: () => import('./subproject-management/list-subproject/list-subproject.component').then(c => c.ListSubprojectComponent)
    },
    {
      path: '/project-management/create-project',
      loadComponent: () => import('./project-management/create-project/create-project.component').then(c => c.CreateProjectComponent)
    },
    {
      path: '/subproject-management/create-subproject',
      loadComponent: () => import('./subproject-management/create-subproject/create-subproject.component').then(c => c.CreateSubprojectComponent)
    }, */
    {
      path: '/funding-party-management/create-funding-party',
      loadComponent: () => import('./funding-party-management/create-funding-party/create-funding-party.component').then(c => c.CreateFundingPartyComponent)
    },
    {
      path: '/funding-party-management/list-funding-party',
      loadComponent: () => import('./funding-party-management/list-funding-party/list-funding-party.component').then(c => c.ListFundingPartyComponent)
    },
    {
      path: '/generate-token',
      loadComponent: () => import('.//generate-token/generate-token.component').then(c => c.GenerateTokenComponent)
    },
    {
      path: '/beneficiary-management',
      loadComponent: () => import('./beneficiary-management/beneficiary-management.component').then(c => c.BeneficiaryManagementComponent)
    },
    {
      path: '/report-management/general-status-report',
      loadComponent: () => import('./report-management/general-status-report/general-status-report.component').then(c => c.GeneralStatusReportComponent)
    },
    {
      path: '/report-management/project-report',
      loadComponent: () => import('./report-management/project-report/project-report.component').then(c => c.ProjectReportComponent)
    }
   

        
      
  
 
];

