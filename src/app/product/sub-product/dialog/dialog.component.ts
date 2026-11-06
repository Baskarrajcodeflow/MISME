import { Component, Inject, OnInit } from "@angular/core";
import { SubProductComponent } from "../sub-product.component";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgFor, NgIf, CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import {
  ServiceControllerService,
  AmountLimitControllerService,
  TransactionLimitControllerService,
  FeesOrCommissionControllerService,
  SubProductControllerService,
  BaseResponseService,
  BaseResponseFeesOrCommission,
  SubProduct,
} from "../../openapi";
import { DataSharingService } from "../../dataSharing/data-sharing.service";
import { ApiServiceService } from "../../api-service/api-service.service";

@Component({
  selector: "app-dialog",
  standalone: true,
  imports: [
    SubProductComponent,
    FormsModule,
    NgxPaginationModule,
    NgFor,
    NgIf,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./dialog.component.html",
  styleUrl: "./dialog.component.css",
})
export class DialogComponent implements OnInit {
  amount: any;
  transactionLimitData: any;
  chargesbackChangedData: any;
  feesChangedData: any;
  taxChangedData: any;
  cashbackChangedData: any;
  serviceOnchageData: any;
  page: any = 1;
  serviceArray: any = [];
  amountLimit: any;
  transactionLimit: any;
  feesAndCommissionArray: any;
  taxAndCommissionArray: any;
  chargesAndCommissionArray: any;
  cashbackAndCommissionArray: any;

  form = new FormGroup({
    service: new FormControl("", Validators.required),
    amountLimit: new FormControl("", Validators.required),
    transactionLimit: new FormControl("", Validators.required),
    cashback: new FormControl("", Validators.required),
    chargesAndCommission: new FormControl("", Validators.required),
    thirdPartyCharge: new FormControl("", Validators.required),
    glAccount: new FormControl("", Validators.required),
    feesCommission: new FormControl("", Validators.required),
    ptTaxComponent: new FormControl("", Validators.required),
  });
  subProductId: any;
  subProductName: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: ServiceControllerService,
    private amountLimitService: AmountLimitControllerService,
    private transactionLimitService: TransactionLimitControllerService,
    private feesAndCommission: FeesOrCommissionControllerService,
    private subProductService: SubProductControllerService,
    private dataSharing: DataSharingService,
    private apiService: ApiServiceService,
  
  ) {
    console.log(data, "aa");
    dataSharing.setIdOperator$.subscribe((res) => {
      console.log(res);
      this.subProductId = res?.id;
      this.subProductName = res?.productName;
    });

    this.form.controls["amountLimit"].setValue(data?.amountLimit?.name);
    this.form.controls["cashback"].setValue(data?.cashback?.name);
    this.form.controls["feesCommission"].setValue(data?.feesOrCommission?.name);
    this.form.controls["ptTaxComponent"].setValue(data?.ptTaxComponent?.name);
    this.form.controls["transactionLimit"].setValue(
      data?.transactionLimit?.name
    );
    this.form.controls["service"].setValue(data?.ptService?.name);
  }
  ngOnInit(): void {
    this.apiService.getAllService(this.page).subscribe({
      next: (res: any) => {
        console.log(res);
        this.serviceArray = res;
      },
    });
    this.apiService.getAllAmountLimit(this.page).subscribe({
      next: (res: any) => {
        console.log(res);
        this.amountLimit = res;
      },
    });
    this.apiService.getTransactionLimit(this.page).subscribe({
      next: (res: any) => {
        console.log(res);
        this.taxAndCommissionArray = res;
      },
    });
    this.apiService.listFeesOrCommission().subscribe({
      next: (res: any) => {
        console.log(res);
        this.feesAndCommissionArray = res;
      },
    });
    this.apiService.listCashBackFeesOrCommission().subscribe({
      next: (res: any) => {
        console.log(res);
        this.cashbackAndCommissionArray = res;
      },
    });
    this.apiService.listChargeFeesOrCommission().subscribe({
      next: (res : any) => {
        console.log(res);
        this.chargesAndCommissionArray = res;
      },
    });
  }

  dataChanged(event: any) {
    this.amount = event;
    console.log(event);
  }
  transactionLimitChanged(event: any) {
    this.transactionLimitData = event;
  }
  cashbackChanged(event: any) {
    this.cashbackChangedData = event;
  }
  chargesbackChanged(event: any) {
    this.chargesbackChangedData = event;
  }
  feesChanged(event: any) {
    this.feesChangedData = event;
  }
  taxChanged(event: any) {
    this.taxChangedData = event;
  }
  serviceOnchage(event: any) {
    console.log(event);

    this.serviceOnchageData = event;
  }
  onSubmit() {
    let body: any = {
      name: this.subProductName,
      subProdType: SubProduct.SubProdTypeEnum.Pt,
      id:this.subProductId,
      combo: [],
    };  

    // let serviceData = {
    //   id: this.data.id,
    //   ptService: this.form.controls["service"].value,
    //   amountLimit: this.form.controls["amountLimit"].value,
    //   transactionLimit: this.form.controls["transactionLimit"].value,
    //   thirdPartyCharge: null,
    //   glAccount: null,
    //   feesOrCommission: this.form.controls["feesCommission"].value,
    //   ptTaxComponent: null,
    //   cashback: this.form.controls["cashback"].value,
    //   chargesAndCommission: this.form.controls["chargesAndCommission"].value,
    //   feesGlAccountNo: null,
    //   chargesGlAccountNo: null,
    //   taxGlAccountNo: null,
    //   cashBackGlAccountNo: null,
    // };
    // body.combo.push(serviceData);

    // console.log(body);

    this.apiService
      .editSubproduct(this.subProductId, body)
      .subscribe((res) => {
        console.log(res);
      });
  }
}
