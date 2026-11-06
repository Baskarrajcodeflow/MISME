import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature } from '../interface/interface-list';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ProfileManagementModule { 
    getServices():Feature[]{
      return []
    }
}
