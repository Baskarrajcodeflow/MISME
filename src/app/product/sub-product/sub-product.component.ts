import { CommonModule, NgFor, NgIf } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import {
  AmountLimitControllerService,
  BaseResponseFeesOrCommission,
  BaseResponseService,
  FeesOrCommissionControllerService,
  ServiceControllerService,
  SubProduct,
  SubProductControllerService,
  TransactionLimitControllerService,
} from "../openapi";
import { DataSharingService } from "../dataSharing/data-sharing.service";
import { ApiServiceService } from "../api-service/api-service.service";
import { Router } from "@angular/router";
import { LoaderComponent } from "../../loader/loader.component";
import { concatMap, finalize } from 'rxjs/operators';

@Component({
  selector: "app-afac-sub-product",
  standalone: true,
  imports: [
    FormsModule,
    NgxPaginationModule,
    NgFor,
    NgIf,
    CommonModule,
    ReactiveFormsModule,
    LoaderComponent,
  ],

  templateUrl: "./sub-product.component.html",
  styleUrl: "./sub-product.component.css",
})
export class SubProductComponent implements OnInit {
  amount: any;
  transactionLimitData: any;
  chargesbackChangedData: any;
  feesChangedData: any;
  taxChangedData: any;
  cashbackChangedData: any;
  serviceOnchageData: any;
  TaxAFC: any;
  transactionLimitArray: any;
  productType: any;
  isLoading: boolean = false;
  listLoyalty: any;
  loyaltyChangedData: any;
  referralChangedData: any;
  listReferral: any;
  listReferralBonus: any;
  referralBonusChangedData: any;
  constructor(
    private service: ServiceControllerService,
    private amountLimitService: AmountLimitControllerService,
    private transactionLimitService: TransactionLimitControllerService,
    private feesAndCommission: FeesOrCommissionControllerService,
    private subProductService: SubProductControllerService,
    private fb: FormBuilder,
    private dataSharing: DataSharingService,
    private apiService: ApiServiceService,
    private route: Router,
  ) {
    this.form = this.fb.group({
      name: ["", Validators.required],
      services: this.fb.array([]),
    });
  }
  // subProduct!: SubProduct[];
  page: number = 1;
  form: FormGroup;
  serviceArray: any;
  amountLimit: any;
  transactionLimit: any;
  feesAndCommissionArray: any;
  taxAndCommissionArray: any;
  chargesAndCommissionArray: any;
  cashbackAndCommissionArray: any;
  glAccountForChargesandCommission: any;
  combo: any = [];
  ngOnInit(): void {
    this.dataSharing.setModuleNameData$.subscribe((res) => {
      console.log(res?.name);
      if (res?.name == "Payment and Money Transfer") {
        this.productType = SubProduct.SubProdTypeEnum.Pt;
      } else if (res?.name == "Funding and Withdrawal") {
        this.productType = SubProduct.SubProdTypeEnum.Fpw;
      }
    });
    const array: any = [];

    this.apiService.getAllService(this.page).subscribe({
      next: (data: any) => {
        // console.log(res);
        this.dataSharing.setModuleNameData$.subscribe((res) => {
          if (res?.name == "Payment and Money Transfer") {
            data.forEach((res: any) => {
              if (res?.subProdType == "PT") {
                array.push(res);
              }
            });
          } else if (res?.name == "Funding and Withdrawal") {
            data.forEach((res: any) => {
              if (res?.subProdType == "FPW") {
                array.push(res);
              }
            });
          }
        });
      },
    });
    this.serviceArray = array;
    this.apiService.getAllAmountLimit(this.page).subscribe({
      next: (res: any) => {
        console.log(res);
        this.amountLimit = res;
      },
    });
    this.apiService.getTransactionLimit(this.page).subscribe({
      next: (res: any) => {
        console.log(res);
        this.transactionLimitArray = res;
      },
    });
    this.apiService.listFeesOrCommission().subscribe({
      next: (res: any) => {
        console.log(res);
        this.feesAndCommissionArray = res;
      },
    });
    this.apiService.listCashBackFeesOrCommission().subscribe({
      next: (res) => {
        console.log(res);
        this.cashbackAndCommissionArray = res;
      },
    });
    this.apiService.listChargeFeesOrCommission().subscribe({
      next: (res) => {
        console.log(res);
        this.chargesAndCommissionArray = res;
      },
    });
    this.apiService.listTaxFeesOrCommission().subscribe({
      next: (res) => {
        console.log(res);
        this.taxAndCommissionArray = res;
      },
    });

    this.apiService.getLeafAccounts().subscribe({
      next: (res) => {
        console.log(res);
        this.glAccountForChargesandCommission = res?.data;
      },
    });
    this.apiService.getLoyalty(this.productType).subscribe({
      next: (res: any) => {
        console.log(res);
        this.listLoyalty = res?.data;
      },
    });
    this.apiService.getReferralConfig().subscribe({
      next: (res: any) => {
        console.log(res, "referral");
        this.listReferral = res?.data;
      },
    });
     this.apiService.getReferralBonusConfig().subscribe({
      next: (res: any) => {
        console.log(res, "referral");
        this.listReferralBonus = res?.data;
      },
    });
  }
  
  isFeesAccountSelected(): boolean {
    return this.services.controls.every((service) => {
      return (
        service.get("feesGlAccountNo")?.valid &&
        service.get("feesCommission")?.valid
      );
    });
  }

  isService(): boolean {
    return this.services.controls.every((service) => {
      return service.get("service")?.valid;
    });
  }
  get services(): FormArray {
    return this.form.get("services") as FormArray;
  }

  addService() {
    const serviceForm = this.fb.group({
      service: ["", Validators.required],
      amountLimit: ["", Validators.required],
      transactionLimit: ["", Validators.required],
      thirdPartyCharge: ["", Validators.required],
      glAccount: ["", Validators.required],
      feesCommission: ["", Validators.required],
      ptTaxComponent: ["", Validators.required],
      cashback: ["", Validators.required],
      chargesAndCommission: ["", Validators.required],
      feesGlAccountNo: ["", Validators.required],
      taxGlAccountNo: ["", Validators.required],
      chargesGlAccountNo: ["", Validators.required],
      ptLoyaltyComponent: ["", Validators.required],
      ptReferralComponent: ["", Validators.required],
      ptReferralBonusComponent: ["", Validators.required],
    });
    this.services.push(serviceForm);
  }

  isButtonDisabled(): boolean {
    for (let group of this.services.controls) {
      const serviceControl = group.get("service");
      const feesCommissionControl = group.get("feesCommission");
      const feesGlAccountNoControl = group.get("feesGlAccountNo");
      const chargesGlAccountNoControl = group.get("chargesAndCommission");
      const chargeGlAccountNoControl = group.get("chargesGlAccountNo");
      const taxesGlAccountNoControl = group.get("ptTaxComponent");
      const taxGlAccountNoControl = group.get("taxGlAccountNo");

      // If the service field is invalid, disable the button
      if (!serviceControl?.valid) {
        return true;
      }

      // If "Fees & Commission" is selected and "GL Account for Fees & Commission" is not valid, disable the button
      if (feesCommissionControl?.valid && !feesGlAccountNoControl?.valid) {
        return true;
      }
      if (
        chargesGlAccountNoControl?.valid &&
        !chargeGlAccountNoControl?.valid
      ) {
        return true;
      }
      if (taxesGlAccountNoControl?.valid && !taxGlAccountNoControl?.valid) {
        return true;
      }
    }

    // If all checks are passed, enable the button
    return false;
  }

  removeService(index: number) {
    this.services.removeAt(index);
    this.feesChangedData = null;
    this.taxChangedData = null;
    this.chargesbackChangedData = null;
  }
  dt: any;
  dataChanged(event: any) {
    this.amount = event;
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
  loyaltyChanged(event: any) {
    this.loyaltyChangedData = event;
    console.log(this.loyaltyChangedData);
  }
  referralChanged(event: any) {
    this.referralChangedData = event;
    console.log(this.referralChangedData);
  }
   referralBonusChanged(event: any) {
    this.referralBonusChangedData = event;
    console.log(this.referralBonusChangedData);
  }
  serviceOnchage(event: any, i: number) {
    this.serviceOnchageData = event;
    console.log(this.serviceOnchageData, "data");

    const serviceGroup = this.services.at(i);
    const selectedService = serviceGroup.get("service")?.value;

    const controlsToToggle = [
      "amountLimit",
      "transactionLimit",
      "cashback",
      "chargesAndCommission",
      "chargesGlAccountNo",
      "feesCommission",
      "feesGlAccountNo",
      "ptTaxComponent",
      "taxGlAccountNo",
      "ptLoyaltyComponent",
      "ptReferralBonusComponent",
    ];

    if (selectedService?.name === "CUSTOMER_ACCOUNT_CREATION") {
      controlsToToggle.forEach((control) => {
        serviceGroup.get(control)?.disable();
      });

      // Referral should remain enabled
      serviceGroup.get("ptReferralComponent")?.enable();
      serviceGroup.get("ptReferralBonusComponent")?.disable();
    } else if(selectedService?.name === "WELCOME_BONUS") {
      controlsToToggle.forEach((control) => {
        serviceGroup.get(control)?.disable();
      });

        // Referral should be disabled      
        serviceGroup.get("ptReferralComponent")?.disable();
        serviceGroup.get("ptReferralBonusComponent")?.enable();
    }
    else {
      controlsToToggle.forEach((control) => {
        serviceGroup.get(control)?.enable();
      });

      // Referral should be disabled
      serviceGroup.get("ptReferralComponent")?.disable();
      serviceGroup.get("ptReferralBonusComponent")?.disable();
    }
  }

  onSubmit() {
    this.dataSharing.setModuleNameData$.subscribe((res) => {
      console.log(res?.name);
      if (res?.name == "Payment and Money Transfer") {
        this.productType = SubProduct.SubProdTypeEnum.Pt;
      } else if (res?.name == "Funding and Withdrawal") {
        this.productType = SubProduct.SubProdTypeEnum.Fpw;
      }
    });
    let data: any = {
      name: this.form.controls["name"].value,
      subProdType: this.productType,
      combo: [],
    };

    this.services.controls.forEach((service: any) => {
      let feesGlAccountNo = service.get("feesGlAccountNo").value;
      let feesGlAccountNoObj = feesGlAccountNo["accountNo"];
      let chargesGlAccountNo = service.get("chargesGlAccountNo").value;
      let chargesGlAccountNoObj = chargesGlAccountNo["accountNo"];
      let taxGlAccountNo = service.get("taxGlAccountNo").value;
      let taxGlAccountNoObj = taxGlAccountNo["accountNo"];
      let serviceData = {
        ptService: service.get("service").value || null,
        amountLimit:
          service.get("amountLimit").value &&
          service.get("amountLimit").value !== "null" &&
            service.get("amountLimit").value !== "----"
            ? service.get("amountLimit").value
            : null,
        transactionLimit:
          service.get("transactionLimit").value &&
          service.get("transactionLimit").value !== "null" &&
          service.get("transactionLimit").value !== "----"
            ? service.get("transactionLimit").value
            : null,
        thirdPartyCharge: null,
        glAccount: null,
        feesOrCommission:
          service.get("feesCommission").value &&
          service.get("feesCommission").value !== "null" &&
          service.get("feesCommission").value !== "----"
            ? service.get("feesCommission").value
            : null,
        ptTaxComponent: null,
        cashback:
          service.get("cashback").value &&
          service.get("cashback").value !== "null" &&
          service.get("cashback").value !== "----"
            ? service.get("cashback").value
            : null,
        chargesAndCommission:
          service.get("chargesAndCommission").value &&
          service.get("chargesAndCommission").value !== "null" &&
          service.get("chargesAndCommission").value !== "----"
            ? service.get("chargesAndCommission").value
            : null,

        feesGlAccountNo:
          feesGlAccountNoObj && feesGlAccountNoObj !== "null" && feesGlAccountNoObj !== "----"
            ? feesGlAccountNoObj
            : null,

        chargesGlAccountNo:
          chargesGlAccountNoObj && chargesGlAccountNoObj !== "null" && chargesGlAccountNoObj !== "----"
            ? chargesGlAccountNoObj
            : null,

        taxGlAccountNo:
          taxGlAccountNoObj && taxGlAccountNoObj !== "null" && taxGlAccountNoObj !== "----"
            ? taxGlAccountNoObj
            : null,
        cashBackGlAccountNo: null,
        loyaltyConfig:
          service.get("ptLoyaltyComponent").value &&
          service.get("ptLoyaltyComponent").value !== "null" &&
          service.get("ptLoyaltyComponent").value !== "----"
            ? service.get("ptLoyaltyComponent").value
            : null,
        referralConfig:
          service.get("ptReferralComponent").value &&
          service.get("ptReferralComponent").value !== "null" &&
          service.get("ptReferralComponent").value !== "----"
            ? service.get("ptReferralComponent").value
            : null,
        welcomeBonusConfig:
          service.get("ptReferralBonusComponent").value &&
          service.get("ptReferralBonusComponent").value !== "null" &&
          service.get("ptReferralBonusComponent").value !== "----"
            ? service.get("ptReferralBonusComponent").value
            : null,
      };

      data.combo.push(serviceData);
    });

    console.log(data);
    this.isLoading = true;
    this.subProductService.createSubProduct(data).pipe(finalize(() => {
            this.isLoading = false;
          })).subscribe({
      next: (res:any) => {
        if (res?.responseCode == 200) {
          this.isLoading = false;
          console.log(res);
          alert("Sub Product Created Successfully");
          this.route.navigateByUrl("/SubProductComponent");
        }else{
          this.isLoading = false;
          alert(res?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Error While Creating Sub Product");
      },
    });
  }
}
