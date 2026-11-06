import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiModule } from './openapi';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ApiModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class TransactionAndGLModule { }
