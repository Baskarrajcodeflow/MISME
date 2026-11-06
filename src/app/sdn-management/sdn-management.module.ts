import { NgModule } from '@angular/core';

import { FormsModule, FormsModule as ngFormsModule, ReactiveFormsModule } from '@angular/forms';


//import { PaymentMoneytransferComponent } from './payment-moneytransfer.component';

import { CommonModule } from '@angular/common';


import { AmlUploadSdnComponent } from './aml-upload-sdn/aml-upload-sdn.component';
import { AmlSdnLogsComponent } from './aml-sdn-logs/aml-sdn-logs.component';
import { AmlSdnSearchComponent } from './aml-sdn-search/aml-sdn-search.component';
import { SdnManagementRoutingModule } from './sdn-management-routing.module';
import { AlertManagementComponent } from './alert-management/alert-management.component';
import { ListRiskParameterComponent } from './list-risk-parameter/list-risk-parameter.component';
import { CreateRiskParameterComponent } from './create-risk-parameter/create-risk-parameter.component';
import { ListLctrParameterComponent } from './list-lctr-parameter/list-lctr-parameter.component';
import { CreateLctrParameterComponent } from './create-lctr-parameter/create-lctr-parameter.component';
import { ListRiskTierComponent } from './list-risk-tier/list-risk-tier.component';
import { CreateRiskTierComponent } from './create-risk-tier/create-risk-tier.component';

@NgModule({
  imports: [
    CommonModule ,
    SdnManagementRoutingModule,
    FormsModule,
   
    ngFormsModule,
    ReactiveFormsModule,
  ],
  declarations: [

   AmlUploadSdnComponent,
   AmlSdnLogsComponent,
   AmlSdnSearchComponent,
   AlertManagementComponent,
   ListRiskParameterComponent,
   CreateRiskParameterComponent,
   ListLctrParameterComponent,
   CreateLctrParameterComponent,
   ListRiskTierComponent,
   CreateRiskTierComponent
   
  
    
  ],
})
export class SdnManagementModule { }
