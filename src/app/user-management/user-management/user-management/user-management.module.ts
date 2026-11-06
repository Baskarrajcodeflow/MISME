import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiModule } from './openapi';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ApiModule
  ]
})
export class UserManagementModule { }
