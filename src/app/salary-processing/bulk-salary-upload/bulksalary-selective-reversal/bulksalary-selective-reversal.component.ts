import { Component } from '@angular/core';
import { DataSharingService } from '../../../product/dataSharing/data-sharing.service';
import { CommonModule } from '@angular/common';
import { SelectiveReversalMailComponent } from "./selective-reversal-main/selective-reversal-mail.component";
import { ReconciliationFilesComponent } from "../table/reconciliation-files/reconciliation-files.component";
import { PendingBulksalaryReversalComponent } from "./pending-bulksalary-reversal/pending-bulksalary-reversal.component";
import { RejectedReversalComponent } from './rejected-reversal/rejected-reversal.component';

@Component({
  selector: 'app-bulksalary-selective-reversal',
  standalone: true,
  imports: [CommonModule, SelectiveReversalMailComponent, ReconciliationFilesComponent, PendingBulksalaryReversalComponent,RejectedReversalComponent],
  templateUrl: './bulksalary-selective-reversal.component.html',
  styleUrl: './bulksalary-selective-reversal.component.css'
})
export class BulksalarySelectiveReversalComponent {
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
