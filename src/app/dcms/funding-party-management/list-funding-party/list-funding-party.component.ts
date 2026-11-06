import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DcmsService } from '../../dcms.service';

@Component({
  selector: 'app-list-funding-party',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './list-funding-party.component.html',
  styleUrl: './list-funding-party.component.css'
})
export class ListFundingPartyComponent {
  userPrevilages1: any;
  privilege: any;
  userPrivileges: any;
  fundingPartyList: any;
  isLoading: boolean = false;
  source: any;
  constructor(private dcmsService: DcmsService,
    private router: Router) { }
  ngOnInit(): void {
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "User Management") {
          if (item.subComponent?.subComponentName == "MM Staff")
            this.privilege = item;
        }
      }
    }
    this.source = "Funding party";
    console.log('this.source', this.source);
    this.getFundingPartyList();
  }
  getFundingPartyList() {
    this.dcmsService.getFundingPartyList().subscribe((data: any) => {
      this.fundingPartyList = data?.data
    })
  }
  onClickCreate() {
    this.router.navigateByUrl("dcms/funding-party-management/create-funding-party");
    // this.router.navigate(['/corporate/corporate-registartion'], {
    // queryParams: { source: 'Funding party' }
    // });

  }
}
