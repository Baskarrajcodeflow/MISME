import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiServiceService } from '../../../product/api-service/api-service.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Corp } from './corp-chooser.model';
import { MakerComponent } from "../workflow/maker/maker.component";

@Component({
  selector: 'app-bulk-salary-processing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MakerComponent],
  templateUrl: './bulk-salary-processing.component.html',
  styleUrl: './bulk-salary-processing.component.css'
})
export class BulkSalaryProcessingComponent implements OnInit {
allcorpData: any;
  filteredData: any;
  corporates: any;
constructor(
  private apiService:ApiServiceService,
){}
accountNumber: string = '';
corporateName: string = '';
@Output() corporateSelected = new EventEmitter<Corp>();

ngOnInit(): void {

}

filterByAccountNumber(): void {
  if(this.accountNumber.length == 0){
    this.corporates = []
  }
  if (this.accountNumber) {
    this.filteredData = this.allcorpData.filter((data: any) =>
      data.walletAccount.accountNo.includes(this.accountNumber)
    );
    console.log(this.filteredData)
    this.corporates = this.filteredData
  } 
}

filterByCorporateName(): void {
  if(this.corporateName.length == 0){
    this.corporates = []
  }
  if (this.corporateName) {
    this.filteredData = this.allcorpData.filter((data: any) =>
      data.firstName.toLowerCase().includes(this.corporateName.toLowerCase())
    );
    this.corporates = this.filteredData

    console.log(this.filteredData)
  } 
}
selectCorporate(corporate: any) {
  console.log('Selected corporate:', corporate);
  this.corporateSelected.emit(corporate);
}

}
