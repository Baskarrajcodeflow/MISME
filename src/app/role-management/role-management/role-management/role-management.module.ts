import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleManagementRoutingModule } from './role-management-routing.module';
import { BranchService } from './branch/branch.service';
import { ApiModule } from './openapi';
import { IsExpandedPipe } from '../../../pipe/is-expanded.pipe';


@NgModule({
  declarations: [IsExpandedPipe],
  imports: [
    CommonModule,
    RoleManagementRoutingModule,
    ApiModule
  ],
  providers:[
    BranchService
  ],
  exports:[
    IsExpandedPipe
  ]
})
export class RoleManagementModule { 
  
}