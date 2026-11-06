import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmlSdnLogsComponent } from './aml-sdn-logs/aml-sdn-logs.component';
import { AmlSdnSearchComponent } from './aml-sdn-search/aml-sdn-search.component';
import { AmlUploadSdnComponent } from './aml-upload-sdn/aml-upload-sdn.component';
import { AlertManagementComponent } from './alert-management/alert-management.component';
import { ListRiskParameterComponent } from './list-risk-parameter/list-risk-parameter.component';
import { CreateRiskParameterComponent } from './create-risk-parameter/create-risk-parameter.component';
import { ListLctrParameterComponent } from './list-lctr-parameter/list-lctr-parameter.component';
import { CreateLctrParameterComponent } from './create-lctr-parameter/create-lctr-parameter.component';
import { ListRiskTierComponent } from './list-risk-tier/list-risk-tier.component';
import { CreateRiskTierComponent } from './create-risk-tier/create-risk-tier.component';

const routes: Routes = [
  {
    path: '',
    children: [

      {
        path: 'upload-sdn',
        component: AmlUploadSdnComponent,
      },
      {
        path: 'aml-sdn-logs',
        component: AmlSdnLogsComponent,
      },
      {
        path: 'aml-sdn-search',
        component: AmlSdnSearchComponent,
      },
      {
        path: 'alert-management',
        component: AlertManagementComponent,
      },
      {
        path: 'list-risk-parameter',
        component: ListRiskParameterComponent,
      },
      {
        path: 'create-risk-parameter',
        component: CreateRiskParameterComponent,
      },
      {
        path: 'list-lctr-parameter',
        component: ListLctrParameterComponent,
      },
      {
        path: 'create-lctr-parameter',
        component: CreateLctrParameterComponent,
      },
      {
        path: 'list-risk-tier',
        component: ListRiskTierComponent,
      },
      {
        path: 'create-risk-tier',
        component: CreateRiskTierComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class SdnManagementRoutingModule {
}

