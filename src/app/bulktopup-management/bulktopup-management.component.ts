import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TopupFileUploadComponent } from "./topup-file-upload/topup-file-upload.component";
import { TopupTableComponent } from "./topup-table/topup-table.component";
import { ApprovedFilesComponent } from "./approved-files/approved-files.component";
import { RejectedFilesComponent } from "./rejected-files/rejected-files.component";

@Component({
  selector: 'app-bulktopup-management',
  standalone: true,
  imports: [CommonModule, TopupFileUploadComponent, TopupTableComponent, ApprovedFilesComponent, RejectedFilesComponent],
  templateUrl: './bulktopup-management.component.html',
  styleUrl: './bulktopup-management.component.css'
})
export class BulktopupManagementComponent {
  activeTab: number = 1;

  setActiveTab(tabNumber: number) {
    this.activeTab = tabNumber;
  }

  userPrivileges: any;
  SalaryPrivelege: any;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrivileges = this.userPrivileges[0];
      console.log(this.userPrivileges[0], "this.userPrevilages");
      console.log(this.userPrivileges, "this.userPrevilages1");

      for (let item of this.userPrivileges?.uiComponentPrivileges) {
        if (item?.component?.componentName == 'Bulk Topup Process') {
          if (item.subComponent?.subComponentName == 'Bulk Topup Process')
            this.SalaryPrivelege = item;
        }
      }
    
  }
  }
}
