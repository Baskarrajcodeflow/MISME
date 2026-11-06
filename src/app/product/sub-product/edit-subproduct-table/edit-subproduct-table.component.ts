import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GenericTableComponent } from "../../../generic-table/generic-table.component";
import { EditSubProductService, SubProductService } from "../../models/model";
import { DataSharingService } from "../../dataSharing/data-sharing.service";
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { finalize, forkJoin, take } from "rxjs";
import { ApiServiceService } from "../../api-service/api-service.service";
import {
  ServiceControllerService,
  AmountLimitControllerService,
  TransactionLimitControllerService,
  FeesOrCommissionControllerService,
  SubProductControllerService,
  SubProduct,
} from "../../openapi";
import { NgFor, NgIf, CommonModule } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { LoaderComponent } from "../../../loader/loader.component";
export interface Column {
  field: string;
  header: string;
  type: string;
  enumValues?: string[];
}
@Component({
  selector: "app-edit-subproduct-table",
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
  templateUrl: "./edit-subproduct-table.component.html",
  styleUrl: "./edit-subproduct-table.component.css",
})
export class EditSubproductTableComponent implements OnInit {
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
  Service: any;
  subProductId: any;
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
    private activatedRoute: ActivatedRoute,
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
    this.dataSharing.setHeaderSubjectData("EditlistSubProduct");

    this.dataSharing.setModuleNameData$
      .pipe(take(1))
      .subscribe((module: any) => {
        console.log("MODULE:", module);

        if (module?.name === "Payment and Money Transfer") {
          this.productType = SubProduct.SubProdTypeEnum.Pt;
        } else if (module?.name === "Funding and Withdrawal") {
          this.productType = SubProduct.SubProdTypeEnum.Fpw;
        }

        // Now productType is ready
        this.loadDropdownData();
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
    } else if (selectedService?.name === "WELCOME_BONUS") {
      controlsToToggle.forEach((control) => {
        serviceGroup.get(control)?.disable();
      });

      // Referral should be disabled
      serviceGroup.get("ptReferralComponent")?.disable();
      serviceGroup.get("ptReferralBonusComponent")?.enable();
    } else {
      controlsToToggle.forEach((control) => {
        serviceGroup.get(control)?.enable();
      });

      // Referral should be disabled
      serviceGroup.get("ptReferralComponent")?.disable();
      serviceGroup.get("ptReferralBonusComponent")?.disable();
    }
  }

  onSubmit(): void {
    console.log("========== SUBMIT START ==========");
    const data: any = {
      name: this.form.get("name")?.value,
      subProdType: this.productType,
      combo: [],
    };

    this.services.controls.forEach((service: any) => {
      const feesGlAccount = service.get("feesGlAccountNo")?.value;

      const chargesGlAccount = service.get("chargesGlAccountNo")?.value;

      const taxGlAccount = service.get("taxGlAccountNo")?.value;

      const serviceData = {
        ptService: service.get("service")?.value || null,

        amountLimit: this.getValue(service.get("amountLimit")?.value),

        transactionLimit: this.getValue(service.get("transactionLimit")?.value),

        thirdPartyCharge: null,

        glAccount: null,

        feesOrCommission: this.getValue(service.get("feesCommission")?.value),

        ptTaxComponent: this.getValue(service.get("ptTaxComponent")?.value),

        cashback: this.getValue(service.get("cashback")?.value),

        chargesAndCommission: this.getValue(
          service.get("chargesAndCommission")?.value,
        ),

        feesGlAccountNo: this.getAccountNo(feesGlAccount),

        chargesGlAccountNo: this.getAccountNo(chargesGlAccount),

        taxGlAccountNo: this.getAccountNo(taxGlAccount),

        cashBackGlAccountNo: null,

        loyaltyConfig: this.getValue(service.get("ptLoyaltyComponent")?.value),

        referralConfig: this.getValue(
          service.get("ptReferralComponent")?.value,
        ),

        welcomeBonusConfig: this.getValue(
          service.get("ptReferralBonusComponent")?.value,
        ),
      };

      data.combo.push(serviceData);
    });

    console.log("UPDATE PAYLOAD:", data);

    this.isLoading = true;
    this.subProductService
      .updateSubProduct(this.subProductId, data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.isLoading = false;
            console.log(res);
            alert("Sub Product Updated Successfully");
            this.route.navigateByUrl("/SubProductComponent");
          } else {
            this.isLoading = false;
            alert(res?.error);
          }
        },
        error: () => {
          this.isLoading = false;
          alert("Error While Updating Sub Product");
        },
      });
  }

  patchSubProduct(data: any): void {
    console.log("========== PATCH START ==========");
    console.log("EDIT DATA:", data);
    this.subProductId = data?.id;
    // Product name
    this.form.patchValue({
      name: data?.name,
    });

    // Remove existing services
    this.services.clear();

    data?.combo?.forEach((item: any, index: number) => {
      console.log(`========== SERVICE ${index} ==========`);

      console.log("API SERVICE:", item?.ptService);
      console.log("API AMOUNT:", item?.amountLimit);
      console.log("API TRANSACTION:", item?.transactionLimit);
      console.log("API FEES:", item?.feesOrCommission);
      console.log("API CHARGES:", item?.chargesAndCommission);
      console.log("API TAX:", item?.ptTaxComponent);
      console.log("API CASHBACK:", item?.cashback);
      console.log("API LOYALTY:", item?.loyaltyConfig);
      console.log("API REFERRAL:", item?.referralConfig);
      console.log("API WELCOME:", item?.welcomeBonusConfig);

      // --------------------------------
      // FIND SERVICE
      // --------------------------------

      const selectedService = this.serviceArray?.find(
        (x: any) => String(x.id) === String(item?.ptService?.id),
      );

      // --------------------------------
      // FIND AMOUNT LIMIT
      // --------------------------------

      const selectedAmountLimit = this.amountLimit?.find(
        (x: any) => String(x.id) === String(item?.amountLimit?.id),
      );

      // --------------------------------
      // FIND TRANSACTION LIMIT
      // --------------------------------

      const selectedTransactionLimit = this.transactionLimitArray?.find(
        (x: any) => String(x.id) === String(item?.transactionLimit?.id),
      );

      // --------------------------------
      // FIND FEES
      // --------------------------------

      const selectedFees = this.feesAndCommissionArray?.find(
        (x: any) => String(x.id) === String(item?.feesOrCommission?.id),
      );

      // --------------------------------
      // FIND CHARGES
      // --------------------------------

      const selectedCharges = this.chargesAndCommissionArray?.find(
        (x: any) => String(x.id) === String(item?.chargesAndCommission?.id),
      );

      // --------------------------------
      // FIND TAX
      // --------------------------------

      const selectedTax = this.taxAndCommissionArray?.find(
        (x: any) => String(x.id) === String(item?.ptTaxComponent?.id),
      );

      // --------------------------------
      // FIND CASHBACK
      // --------------------------------

      const selectedCashback = this.cashbackAndCommissionArray?.find(
        (x: any) => String(x.id) === String(item?.cashback?.id),
      );

      // --------------------------------
      // FIND LOYALTY
      // --------------------------------

      const selectedLoyalty = this.listLoyalty?.find(
        (x: any) => String(x.id) === String(item?.loyaltyConfig?.id),
      );

      // --------------------------------
      // FIND REFERRAL
      // --------------------------------

      const selectedReferral = this.listReferral?.find(
        (x: any) => String(x.id) === String(item?.referralConfig?.id),
      );

      // --------------------------------
      // FIND WELCOME BONUS
      // --------------------------------

      const selectedWelcomeBonus = this.listReferralBonus?.find(
        (x: any) => String(x.id) === String(item?.welcomeBonusConfig?.id),
      );

      // --------------------------------
      // DEBUG
      // --------------------------------

      console.log("MATCHED SERVICE:", selectedService);
      console.log("MATCHED AMOUNT:", selectedAmountLimit);
      console.log("MATCHED TRANSACTION:", selectedTransactionLimit);
      console.log("MATCHED FEES:", selectedFees);
      console.log("MATCHED CHARGES:", selectedCharges);
      console.log("MATCHED TAX:", selectedTax);
      console.log("MATCHED CASHBACK:", selectedCashback);
      console.log("MATCHED LOYALTY:", selectedLoyalty);
      console.log("MATCHED REFERRAL:", selectedReferral);
      console.log("MATCHED WELCOME:", selectedWelcomeBonus);

      // --------------------------------
      // CREATE FORM
      // --------------------------------

      const serviceForm = this.createServiceFormGroup();

      // --------------------------------
      // PATCH
      // --------------------------------

      serviceForm.patchValue({
        service: selectedService ?? null,

        amountLimit: selectedAmountLimit ?? null,

        transactionLimit: selectedTransactionLimit ?? null,

        feesCommission: selectedFees ?? null,

        chargesAndCommission: selectedCharges ?? null,

        ptTaxComponent: selectedTax ?? null,

        cashback: selectedCashback ?? null,

        ptLoyaltyComponent: selectedLoyalty ?? null,

        ptReferralComponent: selectedReferral ?? null,

        ptReferralBonusComponent: selectedWelcomeBonus ?? null,

        feesGlAccountNo: item?.feesGlAccountNo ?? null,

        chargesGlAccountNo: item?.chargesGlAccountNo ?? null,

        taxGlAccountNo: item?.taxGlAccountNo ?? null,
      });

      // --------------------------------
      // PUSH FIRST
      // --------------------------------

      this.services.push(serviceForm);

      // --------------------------------
      // APPLY SERVICE RULE
      // --------------------------------

      this.serviceOnchage(selectedService, index);
    });

    console.log("========== FINAL FORM ==========");

    console.log(this.form.getRawValue());
  }

  private createServiceFormGroup(): FormGroup {
    return this.fb.group({
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
  }

  private loadDropdownData(): void {
    forkJoin({
      services: this.apiService.getAllService(this.page),

      amountLimit: this.apiService.getAllAmountLimit(this.page),

      transactionLimit: this.apiService.getTransactionLimit(this.page),

      fees: this.apiService.listFeesOrCommission(),

      cashback: this.apiService.listCashBackFeesOrCommission(),

      charges: this.apiService.listChargeFeesOrCommission(),

      tax: this.apiService.listTaxFeesOrCommission(),

      loyalty: this.apiService.getLoyalty(this.productType),

      referral: this.apiService.getReferralConfig(),

      referralBonus: this.apiService.getReferralBonusConfig(),
    }).subscribe({
      next: (res: any) => {
        console.log("ALL DROPDOWN DATA:", res);

        // -------------------------
        // SERVICE
        // -------------------------

        this.serviceArray = res.services.filter(
          (item: any) =>
            item?.subProdType ===
            (this.productType === SubProduct.SubProdTypeEnum.Pt ? "PT" : "FPW"),
        );

        // -------------------------
        // OTHER ARRAYS
        // -------------------------

        this.amountLimit = res.amountLimit;

        this.transactionLimitArray = res.transactionLimit;

        this.feesAndCommissionArray = res.fees;

        this.cashbackAndCommissionArray = res.cashback;

        this.chargesAndCommissionArray = res.charges;

        this.taxAndCommissionArray = res.tax;

        this.glAccountForChargesandCommission = res.leafAccounts?.data;

        this.listLoyalty = res.loyalty?.data;

        this.listReferral = res.referral?.data;

        this.listReferralBonus = res.referralBonus?.data;

        console.log("SERVICE ARRAY:", this.serviceArray);
        console.log("AMOUNT ARRAY:", this.amountLimit);
        console.log("TRANSACTION ARRAY:", this.transactionLimitArray);
        console.log("FEES ARRAY:", this.feesAndCommissionArray);
        console.log("CASHBACK ARRAY:", this.cashbackAndCommissionArray);
        console.log("CHARGES ARRAY:", this.chargesAndCommissionArray);
        console.log("TAX ARRAY:", this.taxAndCommissionArray);
        console.log("LOYALTY ARRAY:", this.listLoyalty);

        // -------------------------
        // NOW GET EDIT DATA
        // -------------------------

        this.dataSharing.setIdOperator$
          .pipe(take(1))
          .subscribe((operator: any) => {
            console.log("EDIT RESPONSE:", operator);

            if (operator?.data) {
              this.patchSubProduct(operator.data);
            }
          });

        this.isLoading = false;
      },

      error: (error) => {
        console.error("ERROR LOADING DROPDOWNS:", error);

        this.isLoading = false;
      },
    });
  }

  compareById = (a: any, b: any): boolean => {
    if (a === b) {
      return true;
    }

    if (!a || !b) {
      return false;
    }

    return String(a.id) === String(b.id);
  };

  private getValue(value: any): any {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === "null" ||
      value === "----"
    ) {
      return null;
    }

    return value;
  }

  private getAccountNo(value: any): any {
    if (!value || value === "null" || value === "----") {
      return null;
    }

    return value?.accountNo ?? null;
  }
}
