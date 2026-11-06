import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ApiModule } from './openapi';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProductRoutingModule,
    ApiModule
  ]
})
export class ProductModule { }
