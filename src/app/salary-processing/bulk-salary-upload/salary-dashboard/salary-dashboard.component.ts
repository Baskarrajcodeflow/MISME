import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MakerComponent } from "../workflow/maker/maker.component";
import { BulkSalaryProcessingComponent } from "../bulk-salary-processing/bulk-salary-processing.component";
import { TableComponent } from '../table/table.component';
import { SheduledTableComponent } from "../table/sheduled-table/sheduled-table.component";
import { ProcessFilesTableComponent } from "../table/process-files-table/process-files-table.component";
import { RefundTransactionComponent } from "../../../transaction-and-gl/refund-transaction/refund-transaction.component";
import { RejectedTableComponent } from "../table/rejected-table/rejected-table.component";
import { DataSharingService } from '../../../product/dataSharing/data-sharing.service';
import { ReconciliationFilesComponent } from "../table/reconciliation-files/reconciliation-files.component";

@Component({
  selector: 'app-salary-dashboard',
  standalone: true,
  imports: [CommonModule, MakerComponent, BulkSalaryProcessingComponent, TableComponent, SheduledTableComponent, ProcessFilesTableComponent, RefundTransactionComponent, RejectedTableComponent, ReconciliationFilesComponent],
  templateUrl: './salary-dashboard.component.html',
  styleUrl: './salary-dashboard.component.css'
})
export class SalaryDashboardComponent {
  activeTab: number = 1;
  userPrivileges: any;
  SalaryPrivelege: any;
constructor(private data:DataSharingService){
  data.reuploadFileData(false)
 
}
  setActiveTab(tabNumber: number) {
    this.activeTab = tabNumber;
  }

  ngOnInit(): void {

    
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrivileges = this.userPrivileges[0];
      console.log(this.userPrivileges[0], "this.userPrevilages");
      console.log(this.userPrivileges, "this.userPrevilages1");

      for (let item of this.userPrivileges?.uiComponentPrivileges) {
        if (item?.component?.componentName == 'Bulk Salary Process') {
          if (item.subComponent?.subComponentName == 'Bulk Salary Process')
            this.SalaryPrivelege = item;
        }
      }
    
  }
  }
}
