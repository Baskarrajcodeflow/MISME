    import { NgModule } from '@angular/core';
    import { CommonModule } from '@angular/common';
import { Feature   } from '../interface/interface-list';



    @NgModule({
    
      declarations: [],
      imports: [
        CommonModule
      ]
    })
    export class KycModule { 
      getServices():Feature[]{
          return [{name:"customer", link:"/kyc/customer"},
          {name: 'Merchant', link:"kyc/Merchant"}]
      }
    }
