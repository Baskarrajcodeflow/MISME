import { Component } from '@angular/core';
import {LowBalanceService} from './low-balance.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-low-balance-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './low-balance-list.component.html',
  styleUrl: './low-balance-list.component.css'
})
export class LowBalanceListComponent {
  constructor( private lowBlanceService : LowBalanceService){

  }
  lowBalanceList : any;
  currentPage : number = 0;
  totalPages : number = 0;
  listLength : number = 0;

  ngOnInit(){
    this.getList(this.currentPage);
   
  }
  getList(pageNumber : number){
    this.currentPage = pageNumber;
    console.log("Fetching low balance list for page:", pageNumber);
     this.lowBlanceService.getLowbalanceList(pageNumber).subscribe(data =>{
      if(data.responseCode == 200){
        this.lowBalanceList = data?.data;
        this.listLength = this.lowBalanceList?.length;
        console.log("Low balance list:", this.lowBalanceList);
      }
      else{
        console.error("API Failed");
      }
    })
  }

}
