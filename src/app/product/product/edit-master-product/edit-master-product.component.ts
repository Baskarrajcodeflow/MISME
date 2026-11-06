import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiServiceService } from "../../api-service/api-service.service";
import { DataSharingService } from "../../dataSharing/data-sharing.service";
import {
  MasterProductControllerService,
  FeesOrCommissionControllerService,
  BaseResponseFeesOrCommission,
} from "../../openapi";
import { CommonModule } from "@angular/common";
import { MatRadioModule } from "@angular/material/radio";
import { LoaderComponent } from "../../../loader/loader.component";
import { forkJoin, take } from "rxjs";

@Component({
  selector: "app-edit-master-product",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatRadioModule, LoaderComponent],
  templateUrl: "./edit-master-product.component.html",
  styleUrl: "./edit-master-product.component.css",
})
export class EditMasterProductComponent {
  materProductId: any;
  ptServiceArray: any;
  fpwServiceArray: any;
  ptServiceData: any;
  fwpServiceData: any;
  agencyFeesAndCommission: any;
  agencyFeesAndCommissionData: any[] = [];
  fpwAgencyFeesAndCommissionData: any[] = [];
  fpwEvent: any;
  ptEvent: any;
  subProductId: any;
  isLoading: boolean = false;
  constructor(
    private dataSharing: DataSharingService,
    private route: ActivatedRoute,
    private router: Router,
    private masterProductApi: MasterProductControllerService,
    private apiService: ApiServiceService,
    private feesAndCommission: FeesOrCommissionControllerService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      productName: new FormControl("", Validators.required),
      category: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
      isDefault: new FormControl("", Validators.required),
      fundingAndWithdrawal: new FormControl("", Validators.required),
      isKYC: new FormControl("", Validators.required),
      agentCommission: new FormControl("", Validators.required),
      paymentTransfer: new FormControl("", Validators.required),
      fwpService: new FormControl("", Validators.required),
      ptservice: new FormControl("", Validators.required),
      fwpagencyfeesandCommission: new FormControl("", Validators.required),
      ptpagencyfeesandCommission: new FormControl("", Validators.required),
    });
    this.myForm = this.fb.group({
      serviceFields: this.fb.array([]),
    });

    this.ptForm = this.fb.group({
      ptServiceFields: this.fb.array([]),
    });
    this.addServiceField();

    this.loadDropdownData();
  }

  getPtService() {
    return this.apiService.getPtService();
  }

  getFpwService() {
    return this.apiService.getFwService();
  }

  getListAFC() {
    return this.feesAndCommission.listAFCFeesOrCommission();
  }
  ptDataChanged(event: any) {
    this.ptEvent = event;
    console.log(event);
    this.apiService.getSubProductById(event?.id).subscribe((res) => {
      console.log(res.combo, "aaa");
      this.ptServiceData = res?.combo;
    });
  }
  fpwDataChanged(event: any) {
    this.fpwEvent = event;
    this.apiService.getSubProductById(event?.id).subscribe((res) => {
      console.log(res.combo, "aaa");
      this.fwpServiceData = res?.combo;
    });
    // console.log(event);
  }

  submit() {
    let agentCommission: any;
    if (this.form.controls["agentCommission"].value) {
      agentCommission = Number(this.form.controls["agentCommission"].value);
    } else {
      agentCommission = null;
    }

    if (this.materProductId) {
      if (
        this.form.controls["category"].value == "CUSTOMER" ||
        this.form.controls["category"].value == "CORPORATE"
      ) {
        let body: any = {
          id: this.materProductId,
          productName: this.form.controls["productName"].value,
          description: this.form.controls["description"].value,
          ptSubProduct: this.ptEvent,
          fwSubProduct: this.fpwEvent,
          userType: this.form.controls["category"].value,
          default: this.form.controls["isDefault"].value,
          agentCommission: agentCommission,
        };
        console.log(body, "update");
        this.masterProductApi
          .updateMasterProduct(this.materProductId, body)
          .subscribe((res) => {
            console.log(res);
            if (res) {
              alert("Product Updated Successfully");
              this.router.navigateByUrl("/ProductComponent");
            }
          });
      } else if (this.form.controls["category"].value == "AGENT") {
        let body: any = {
          id: this.materProductId,
          productName: this.form.controls["productName"].value,
          description: this.form.controls["description"].value,
          ptAgentMainProductList: this.array,
          masterProductId: null,
          fwAgentMainProductList: this.fpwArray,
          userType: this.form.controls["category"].value,
          default: this.form.controls["isDefault"].value,
          agentCommission: agentCommission,
        };
        console.log(body);

        this.masterProductApi
          .updateMasterProduct(this.materProductId, body)
          .subscribe((res) => {
            console.log(res);
            if (res) {
              alert("Product Updated Successfully");
              this.router.navigateByUrl("/ProductComponent");
            }
          });
      }
    } else {
      let data: any = this.form.controls["paymentTransfer"].value;
      console.log(data, "first");
      this.subProductId = data?.id;
      let data2: any = this.form.controls["fundingAndWithdrawal"].value;

      if (this.form.controls["category"].value == "AGENT") {
        console.log("aas");

        let body: any = {
          productName: this.form.controls["productName"].value,
          description: this.form.controls["description"].value,
          ptAgentMainProductList: this.array,
          masterProductId: null,
          subProductId: data?.id,
          fwAgentMainProductList: this.fpwArray,
          userType: this.form.controls["category"].value,
          default: this.form.controls["isDefault"].value,
          agentCommission: agentCommission,
        };
        console.log(body);

        this.masterProductApi
          .createMasterProduct(body, "response")
          .subscribe((res) => {
            console.log(res);
            if (res.status == 200) {
              alert("Product Created Successfully");
              this.router.navigateByUrl("/ProductComponent");
            } else {
              alert("Product Creation Failed");
            }
          });
      }
       else if (
        this.form.controls["category"].value == "CUSTOMER" ||
        this.form.controls["category"].value == "CORPORATE"
      ) {
        let body: any = {
          productName: this.form.controls["productName"].value,
          description: this.form.controls["description"].value,
          ptSubProduct: this.ptEvent,
          masterProductId: this.masterProductId,
          subProductId: data?.id,
          fwSubProduct: this.fpwEvent,
          userType: this.form.controls["category"].value,
          default: this.form.controls["isDefault"].value,
          agentCommission: null,
        };
        console.log(body);
        this.isLoading = true;
        this.masterProductApi.updateMasterProduct(this.masterProductId, body).subscribe({
          next: (res) => {
            if (res) {
              this.isLoading = false;
              alert("Product Updated Successfully");
              this.router.navigateByUrl("/ProductComponent");
            } else {
              this.isLoading = false;
              alert("Product Update Failed");
            }
          },
          error: () => {
            this.isLoading = false;
            alert("Something Went Wrong");
          },
        });
      }
    }
  }
  removeTopLevelId(obj: any) {
    if (Array.isArray(obj)) {
      obj.forEach((item) => {
        if (item.hasOwnProperty("id")) {
          delete item.id;
        }
      });
    } else {
      if (obj.hasOwnProperty("id")) {
        delete obj.id;
      }
    }
  }

  //------------------------------------------------------------------------------------------//
  myForm!: FormGroup;
  ptForm!: FormGroup;
  form!: FormGroup;
  get serviceFields(): FormArray {
    return this.myForm.get("serviceFields") as FormArray;
  }

  addServiceField() {
    const serviceGroup = this.fb.group({
      fwpService: ["", Validators.required],
      fwpagencyfeesandCommission: ["", Validators.required],
    });
    this.serviceFields.push(serviceGroup);
  }

  get ptServiceFields(): FormArray {
    return this.ptForm.get("ptServiceFields") as FormArray;
  }

  addPtServiceField() {
    const serviceGroup = this.fb.group({
      ptservice: ["", Validators.required],
      ptpagencyfeesandCommission: ["", Validators.required],
    });
    this.ptServiceFields.push(serviceGroup);
  }

  arr: any;
  array: any[] = [];
  fpwArray: any[] = [];
  ptServiceDataChange(event: any, index: number) {
    this.arr = event;

    let agencyFeesOrCommission =
      this.agencyFeesAndCommissionData[index] || null;

    const obj = {
      afacGlAccounts: null,
      agencyFeesOrCommission: agencyFeesOrCommission,
      masterProductId: null,
      productByService: event,
      subProductId: this.subProductId,
    };

    if (this.array[index]) {
      // replace existing row data
      this.array[index] = obj;
    } else {
      // first time add
      this.array.push(obj);
    }

    console.log(this.array, "array");
  }
  ptpagencyfeesandCommission(event: any, index: number) {
    this.agencyFeesAndCommissionData[index] = event;

    // update main array also here
    if (this.array[index]) {
      this.array[index].agencyFeesOrCommission = event;
    }
  }

  fwpServiceDataChange(event: any, index: number) {
    let fpwagencyFeesOrCommission =
      this.fpwAgencyFeesAndCommissionData[index] || null;

    const obj = {
      afacGlAccounts: null,
      agencyFeesOrCommission: fpwagencyFeesOrCommission,
      masterProductId: null,
      productByService: event,
      subProductId: this.subProductId,
    };

    if (this.fpwArray[index]) {
      // Replace existing row
      this.fpwArray[index] = obj;
    } else {
      // First time add
      this.fpwArray.push(obj);
    }

    console.log(this.fpwArray);
  }
  fwpagencyfeesandCommission(event: any, index: number) {
    console.log(event, "ptpagencyfeesandCommission");
    this.fpwAgencyFeesAndCommissionData[index] = event;
    if (this.fpwArray[index]) {
      this.fpwArray[index].agencyFeesOrCommission = event;
    }
  }

  cancel() {
    this.router.navigateByUrl("/ProductComponent");
  }

  patchMasterProduct(data: any): void {
    console.log("MASTER PRODUCT EDIT DATA:", data);

    // Find PT product from dropdown list
    const selectedPTProduct = this.ptServiceArray?.find(
      (x: any) => x.id === data?.ptSubProduct?.id,
    );

    // Find FPW product from dropdown list
    const selectedFPWProduct = this.fpwServiceArray?.find(
      (x: any) => x.id === data?.fwSubProduct?.id,
    );

    this.form.patchValue({
      productName: data?.productName ?? "",
      category: data?.userType ?? "",
      description: data?.description ?? "",
      isDefault: data?.default ?? false,
      agentCommission: data?.agentCommission ?? null,

      paymentTransfer: selectedPTProduct ?? null,

      fundingAndWithdrawal: selectedFPWProduct ?? null,
    });

    console.log("MAIN FORM:", this.form.getRawValue());
  }

  masterProductId!: number;
  masterUserType!: string;
  private loadDropdownData(): void {
    forkJoin({
      pt: this.getPtService(),
      fpw: this.getFpwService(),
      afc: this.getListAFC(),
    }).subscribe({
      next: (res: any) => {
        this.ptServiceArray = res.pt;
        this.fpwServiceArray = res.fpw;
        this.agencyFeesAndCommission = res.afc;

        this.dataSharing.editMasterProd$.pipe(take(1)).subscribe((editRes) => {
          if (editRes?.data) {
            console.log("EDIT MASTER PRODUCT DATA:", editRes.data);
            this.masterProductId = editRes.data.id;
            console.log("MASTER PRODUCT ID:", editRes.data?.id);
            if(editRes.data.userType == 'CUSTOMER' || editRes.data.userType == 'CORPORATE'){      
              this.patchMasterProduct(editRes.data);
            }else if(editRes.data.userType == 'AGENT'){
             this.patchAgentMasterProduct(editRes.data);
            }
          }
        });
      },
    });
  }

  private patchAgentMasterProduct(data: any): void {

  // Patch common fields
  this.form.patchValue({
    productName: data?.productName,
    category: data?.userType,
    description: data?.description,
    isDefault: data?.default,
    agentCommission: data?.agentCommission,
  });

  
   // PAYMENT & MONEY TRANSFER

  this.ptServiceFields.clear();

  data?.ptAgentMainProductList?.forEach((item: any) => {

    const productByService = item?.productByService;
    const agencyFees = item?.agencyFeesOrCommission;

    // Find the exact object from dropdown
    const selectedService = this.ptServiceData?.find(
      (x: any) =>
        x?.ptService?.id === productByService?.ptService?.id
    );

    const selectedAfc = this.agencyFeesAndCommission?.find(
      (x: any) =>
        x?.id === agencyFees?.id
    );

    const serviceForm = this.fb.group({
      ptservice: [selectedService ?? null, Validators.required],

      ptpagencyfeesandCommission: [
        selectedAfc ?? null,
        Validators.required
      ],
    });

    this.ptServiceFields.push(serviceForm);
  });



   // FUNDING & WITHDRAWAL

  this.serviceFields.clear();

  data?.fwAgentMainProductList?.forEach((item: any) => {

    const productByService = item?.productByService;
    const agencyFees = item?.agencyFeesOrCommission;

    // Find service from FPW dropdown
    const selectedService = this.fwpServiceData?.find(
      (x: any) =>
        x?.ptService?.id === productByService?.ptService?.id
    );

    // Find AFC from AFC dropdown
    const selectedAfc = this.agencyFeesAndCommission?.find(
      (x: any) =>
        x?.id === agencyFees?.id
    );

    const serviceForm = this.fb.group({
      fwpService: [
        selectedService ?? null,
        Validators.required
      ],

      fwpagencyfeesandCommission: [
        selectedAfc ?? null,
        Validators.required
      ],
    });

    this.serviceFields.push(serviceForm);
  });


  console.log(
    "PATCHED AGENT FORM:",
    this.form.getRawValue()
  );

  console.log(
    "PT SERVICE FIELDS:",
    this.ptServiceFields.getRawValue()
  );

  console.log(
    "FPW SERVICE FIELDS:",
    this.serviceFields.getRawValue()
  );
}
}
