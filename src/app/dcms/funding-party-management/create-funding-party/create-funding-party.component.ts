import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { DcmsService } from '../../dcms.service';
import { CorporateService } from '../../../corporate/corporate.service';
import { Router } from '@angular/router';
import { BlockList } from 'net';

@Component({
  selector: 'app-create-funding-party',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-funding-party.component.html',
  styleUrl: './create-funding-party.component.css'
})
export class CreateFundingPartyComponent {
  @Output() cancel = new EventEmitter<void>();
  backOfficeForm: FormGroup = new FormGroup({
    searchText: new FormControl('')
  })
  DistrictList: any;
  ProvinceList: any;
  fundingPartyList: any;
  filteredFundingParties: any = [];
  selectedFundingPartyName: any;
  selectedId: any;
  result: any;
  searchPerformed: Boolean = false;
  constructor(private dcmsService: DcmsService,
    private corporate: CorporateService,
    private router: Router) { }

  ngOnInit(): void {
    this.getCorporateUsers();
  }
  getCorporateUsers() {
    this.corporate.getCorporateUsers().subscribe((data: any) => {
      this.filteredFundingParties = data;
      console.log("filteredFundingParties", this.filteredFundingParties)
    });
  }
  onSearch() {
    this.searchPerformed = true;
    let corpArray = [];
    let searchText = this.backOfficeForm.controls["searchText"].value?.trim();
    for (let item of this.filteredFundingParties) {
      if (
        // item?.firstName?.toLowerCase().includes(searchText.toLowerCase())
        String(item?.firstName ?? '').toLowerCase().includes(searchText) ||
        String(item?.lastName ?? '').toLowerCase().includes(searchText) ||
        String(item?.phone ?? '').toLowerCase().includes(searchText) ||
        String(item?.email ?? '').toLowerCase().includes(searchText)
      ) {
        corpArray.push(item);
      }
    }
    this.result = corpArray
    console.log("result", this.result)
  }
  onMarkAsFundingParty(a: any) {
    this.dcmsService.addFundingParty(a).subscribe((data: any) => {
      if (data?.responseCode == 200) {
        alert("Registered Successfully")
        this.router.navigateByUrl("dcms/funding-party-management/list-funding-party");
      }
      else {
        alert(data?.error)
      }
    })
  }
  onCancel() {
    this.cancel.emit();
  }
}
