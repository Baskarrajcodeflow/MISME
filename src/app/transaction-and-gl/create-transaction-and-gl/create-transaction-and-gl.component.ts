import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormComponentComponent } from '../../form-component/form-component.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { HeadAccount, HeadAccountControllerService, LeafAccount, LeafAccountControllerService, SubAccount, SubAccountControllerService } from '../openapi';
import { LoggerService } from '../../core/services/logger/logger.service';
import { GlService } from '../gl.service';

@Component({
  selector: 'app-create-transaction-and-gl',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf, NgClass],
  templateUrl: './create-transaction-and-gl.component.html',
  styleUrl: './create-transaction-and-gl.component.css'
})
export class CreateTransactionAndGlComponent implements OnInit {
  transactionForm: FormGroup = new FormGroup({});
  accNO: FormControl = new FormControl('');
  desc: FormControl = new FormControl('');
  type: FormControl = new FormControl('');
  category: FormControl = new FormControl('');
  alertMessage: string | null = null;
  alertType: 'success' | 'error' = 'success';
  categoryValue: any;
  parentdropdown: boolean = false;
  parentHead: boolean = false;
  parentSubHead: boolean = false;
  heads: any;
  isSubmitted: boolean = false;
  headId: any;
  apiCalled: boolean = false;
  headAccount!: string;
  typeValue: any;
  accId: any;
  types: any;
  subHeads: any;
  headSubmit: boolean = true;
  subheadSubmit: boolean = false;
  leafSubmit: boolean = false;
  subheadId: any;
  subHeadAccNO: any;
  subHeadType: any;
  leafAccNO: any;
  leafType: any;
  accNoResponse: any;
  subHeadDesc: any;
  headDesc: any;
  constructor(private headAccountService: HeadAccountControllerService,
    private LeafAccountService: LeafAccountControllerService,
    private SubAccountService: SubAccountControllerService,
    private glService: GlService) { }
  ngOnInit(): void {
    this.initForm();
    this.transactionForm.controls['type'].valueChanges.subscribe((res) => {
      this.transactionForm.controls['category'].reset()
    })
  }
  initForm() {
    this.transactionForm.addControl('accNO', this.accNO);
    this.transactionForm.addControl('desc', this.desc);
    this.transactionForm.addControl('type', this.type);
    this.transactionForm.addControl('category', this.category);
  }
  closeAlert() {
    this.alertMessage = null;
  }
  onChangeCategory($event: any) {
    this.categoryValue = $event.target.value
    this.glService.getAllHeadAccounts(this.transactionForm.controls['type'].value).subscribe((data: any) => {
      this.heads = data
      console.log("heads", this.heads);
    })
    if (this.categoryValue == 'HEAD') {
      this.parentHead = false
      this.parentSubHead = false
      this.headSubmit = true
      // this.subheadSubmit = false
      // this.leafSubmit = false

    }
    else if (this.categoryValue == 'SUBHEAD') {
      this.parentHead = true
      this.parentSubHead = false
      this.headSubmit = false
      // this.subheadSubmit = true
      // this.leafSubmit = false
    }
    else {
      this.parentHead = true
      this.parentSubHead = true
      this.headSubmit = false
      // this.subheadSubmit = false
      // this.leafSubmit = true
    }
  }
  onChangeParentHead($event: any) {
    this.headId = $event.target.value
    console.log("headId", this.headId);

    this.headAccountService.getSubAccountByHeadId(this.headId).subscribe((data: any) => {
      this.subHeads = data
      for (let item of this.heads) {
        if (this.headId == item?.id) {
          this.subHeadAccNO = item?.accountNo
          this.subHeadType = item?.type
          this.headDesc = item?.accountDescription
        }
      }
    })
  }
  onChangeSubHeads($event: any) {
    this.subheadId = $event.target.value
    for (let item of this.subHeads) {
      if (this.subheadId == item?.id) {
        this.leafAccNO = item?.accountNo
        this.leafType = item?.type
        this.subHeadDesc = item?.accountDescription
      }
    }
  }
  submit() {
    this.isSubmitted = true
    console.log("categoryValue", this.categoryValue);

    if (this.categoryValue == 'HEAD') {
      let req: HeadAccount = {
        accountNo: "null",
        accountDescription: this.desc.value,
        type: this.type.value,
      };
      this.headAccountService.createHeadAccount(req).subscribe((data: any) => {
        this.isSubmitted = false; // Enable the button after API call completes
        this.apiCalled = true;
        if (data && data?.id) {
          this.accNoResponse = data?.accountNo;
          this.alertMessage = 'Success';
          this.alertType = 'success';
          this.transactionForm.reset();
        } else {
          this.alertMessage = 'Something went wrong';
          this.alertType = 'error';
          this.transactionForm.reset();
        }
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000);
      });
    }
    else if (this.categoryValue == 'SUBHEAD') {
      this.isSubmitted = true
      let req: SubAccount = {
        // this.accNO.value
        accountNo: "null",
        accountDescription: this.desc.value,
        headAccountNo: this.subHeadAccNO,
        type: this.subHeadType,
      }
      this.SubAccountService.createSubAccount(req).subscribe((data: any) => {
        this.isSubmitted = false; // Enable the button after API call completes
        this.apiCalled = true;
        if (data && data?.id) {
          this.accNoResponse = data?.accountNo
          this.alertMessage = 'Success';
          this.alertType = 'success';
          this.transactionForm.reset();
        }
        else {
          this.alertMessage = 'Something went wrong';
          this.alertType = 'error';
          this.transactionForm.reset();
        }
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000);
      })
    }
    else if (this.categoryValue == 'LEAF') {
      this.isSubmitted = true
      // let req: LeafAccount = {
      let req = {
        accountNo: "null",
        accountDescription: this.desc.value,
        subAccountNo: this.leafAccNO,
        headAccountNo: this.subHeadAccNO,
        type: this.leafType,
        subDescription: this.subHeadDesc,
        headDescription: this.headDesc,
      }
      // this.LeafAccountService.createLeafAccount(req).subscribe((data: any) => {
      this.glService.createLeafAccount(req).subscribe((data: any) => {
        this.isSubmitted = false; // Enable the button after API call completes
        this.apiCalled = true;
        if (data && data?.id) {
          this.accNoResponse = data?.accountNo
          this.alertMessage = 'Success';
          this.alertType = 'success';
          this.transactionForm.reset();
        }
        else {
          this.alertMessage = 'Something went wrong';
          this.alertType = 'error';
          this.transactionForm.reset();
        }
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000);
      })
    }
  }
}
