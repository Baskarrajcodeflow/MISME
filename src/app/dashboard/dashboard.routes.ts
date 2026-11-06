import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./customer/customer.component').then(m => m.CustomerComponent)
  }
  
 
];
