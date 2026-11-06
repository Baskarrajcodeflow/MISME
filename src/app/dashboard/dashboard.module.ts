import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { Feature } from '../interface/interface-list';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgChartsModule } from 'ng2-charts';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgChartsModule,
  ],
  
})

export class DashboardModule {    
  
}

export function getServices(): any[] {
    return [{name:"Customer", link:"customer"},
    {name:"Agent", link:"dashboard/agent"}]
}
