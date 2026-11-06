import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../interface/interface-list';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ServiceManagementModule {
  getServices(): Feature[] {
    throw new Error('Method not implemented.');
  }
}
