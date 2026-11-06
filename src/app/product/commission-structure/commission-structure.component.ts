import { Component } from '@angular/core';
import { ApiServiceService } from '../api-service/api-service.service';
import { CommonModule } from '@angular/common';

export interface CommissionData{
  id:number,
  name:string,
  type:string,
  amount:number,
  currency:string,
  commissionCategory:string,
  active:boolean
}

@Component({
  selector: 'app-commission-structure',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './commission-structure.component.html',
  styleUrl: './commission-structure.component.css'
})
export class CommissionStructureComponent {
 page:number = 0;
 commissionData:CommissionData[]=[]
  constructor(private apiService:ApiServiceService){}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getCommissionStructure();

  }

  getCommissionStructure(){
    this.apiService.getCommissionStructure(this.page).subscribe({
      next:(res:any)=>{
        console.log(res);
        if(res){
          this.commissionData = res
        }
      },error:()=>{
        alert("Something Went Wrong.")
      }
    })
  }
}
