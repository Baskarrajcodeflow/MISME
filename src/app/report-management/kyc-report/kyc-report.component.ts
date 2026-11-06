import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, Renderer2 } from "@angular/core";
import { DataSharingService } from "../../product/dataSharing/data-sharing.service";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { KycModuleService } from "../../kyc/kyc/kyc-module.service";
import { SuperAgentComponent } from "../super-agent/super-agent.component";
import { CustomerKycComponent } from "../customer-kyc/customer-kyc.component";

@Component({
  selector: "app-kyc-report",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SuperAgentComponent, CustomerKycComponent],
  templateUrl: "./kyc-report.component.html",
  styleUrl: "./kyc-report.component.css",
})
export class KycReportComponent {
  // @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  remark = new FormControl();
  reason = new FormControl();
  MaleChecked = new FormControl();
  FemaleChecked = new FormControl();
  married = new FormControl();
  single = new FormControl();
  MMagent = new FormControl();
  MMussd = new FormControl();
  MMstaff = new FormControl();
  MMmicro = new FormControl();
  MMmerchant = new FormControl();

  licenseNoo = new FormControl();
  licenseYes = new FormControl();
  passNo = new FormControl();
  passYes = new FormControl();
  signNo = new FormControl();
  signYes = new FormControl();
  articleNo = new FormControl();
  articleYes = new FormControl();
  ResNo = new FormControl();
  ResYes = new FormControl();
  powerNo = new FormControl();
  powerYes = new FormControl();

  mnoNo = new FormControl();
  mnoYes = new FormControl();

  undertaken: FormControl = new FormControl("", []);
  agentForm: FormGroup = new FormGroup({});
  editProfile: boolean = false;
  users: any;
  photoId: any;
  first: any;
  father: any;
  last: any;
  posNo: any;
  positionHeld: any;
  tazkira: any;
  dob: any;
  dateOfIssue: any;
  licenseNo: any;
  country: any;
  dateOfExpiry: any;
  iccidNo: any;
  ptidNo: any;
  sourceOfIncome: any;
  monthlyIncome: any;
  gender: any;
  marital: any;
  email: any;
  accOpenDate: any;
  mmAccType: any;
  fullName: any;
  purposeOfAcc: any;
  houseNo: any;
  location: any;
  province: any;
  street: any;
  district: any;
  countryAddress: any;
  permanentHouseNo: any;
  permanentLocation: any;
  permanentProvince: any;
  permanentStreet: any;
  permanentDistrict: any;
  permanentCountry: any;
  shopName: any;
  address: any;
  activityType: any;
  shopIncomeSource: any;
  shopPosition: any;
  shopIncome: any;
  turnover: any;
  tinNumber: any;
  haveOtherAccounts: any;
  MNOname: any;
  accountName: any;
  accountNo: any;
  nextOfKinName: any;
  nextOfKinFatherName: any;
  relationship: any;
  mobileNo: any;
  customerName: any;
  customerDate: any;
  validLic: any;
  validDir: any;
  validSig: any;
  article: any;
  resolution: any;
  attorney: any;
  undertakenCust: any;
  undertakenCustDate: any;
  ICCIDverify: any;
  cmpnyVerify: any;
  PTIDverify: any;
  locationVerify: any;
  POSverify: any;
  KycVerify: any;
  processingDateverify: any;
  Verified: any;
  VerifiedDate: any;
  ComplianceAgent: any;
  ComplianceDate: any;
  riskReq!: string;
  watchListReq!: boolean;
  remarksValue: any;
  imageUrl = environment.apiUrl;
  rejectReasonRequired: boolean = true;

  rejectreasonForm: FormGroup = new FormGroup({});
  products: any;
  allAgents: any;
  riskValue: any;
  watchListValue: any;
  remarkValue: any;
  kycId: any;
  walletaccounts: any;
  productId: any;
  masterProduct: any;
  undertakenSign: any;
  agentImg: any;
  kinEmail: any;
  kinHouse: any;
  kinLocation: any;
  kinProvince: any;
  kinStreet: any;
  kinDistrict: any;
  kinCountry: any;
  alertMessage: string | null = null;
  alertType: "success" | "error" = "success";
  uploadedImageUndertaken: any;
  uploadedImageFileName: any;
  uploadedImageFileType1: any;
  uploadedImageFileNameExtension: any;
  uploadedImageFileData: any;
  uploadedImageKycSign: any;
  uploadedImageAgentVerifySign: any;
  uploadedImageOpSign: any;
  uploadedImageCompSign: any;
  kycSign: any;
  agentVerifySign: any;
  opSign: any;
  compSign: any;
  type!: string;
  uploadedImage: any;
  uploadedImageFile0: any;
  uploadedImageFileType0: any;
  uploadedImageFileNameExtension0: any;
  uploadedImageFileData0: any;
  agentId: any;
  userName!: string | null;
  allUsers: any[] = [];
  showUpdate: boolean = false;
  userPrivileges: any;
  kycPrivelege: any;
  isLoading: boolean = false;
  sdnDetails: any;
  showModal: boolean = false;
  activeFlag: boolean = false;
  deletedFlag: boolean = false;
  showRejectButton: boolean = false;
  showApproveButton: boolean = false;
  showUpdateButton: boolean = false;
  userStatus: any;
  agent: any;
  agentid: any;
  seqNo: any;
  kycType: any;

  constructor(
    private renderer: Renderer2,
    private fb: FormBuilder,
    private KycService: KycModuleService,
    private route: ActivatedRoute,
    private dataSharing: DataSharingService
  ) {
    this.agentForm = this.fb.group({
      father: ["", Validators.required],
      firstName: ["", Validators.required],
      pos: ["", Validators.required],
      last: ["", Validators.required],
      tazkira: ["", Validators.required],
      position: ["", Validators.required],
      issue: ["", Validators.required],
      dob: ["", Validators.required],
      countryBasic: ["", Validators.required],
      license: ["", Validators.required],
      iccid: ["", Validators.required],
      expiry: ["", Validators.required],
      source: ["", Validators.required],
      ptid: ["", Validators.required],
      income: ["", Validators.required],
      accOpenDate: ["", Validators.required],
      email: ["", Validators.email],
      purpose: ["", Validators.required],
      //current
      houseNO: ["", Validators.required],
      loc: ["", Validators.required],
      province: ["", Validators.required],
      street: ["", Validators.required],
      district: ["", Validators.required],
      country: ["", Validators.required],
      //permanent
      perHouseNO: ["", Validators.required],
      perLoc: ["", Validators.required],
      perProvince: ["", Validators.required],
      perStreet: ["", Validators.required],
      perDistrict: ["", Validators.required],
      perCountry: ["", Validators.required],
      //shop
      shopSource: ["", Validators.required],
      shopName: ["", Validators.required],
      shopPosition: ["", Validators.required],
      shopAddress: ["", Validators.required],
      shopIncome: ["", Validators.required],
      shopActivityType: ["", Validators.required],
      shopTurnover: ["", Validators.required],
      shopTin: ["", Validators.required],

      orgHouseNo: ["", Validators.required],
      orgLocation: ["", Validators.required],
      orgProvince: ["", Validators.required],
      orgStreet: ["", Validators.required],
      orgDistrict: ["", Validators.required],
      orgCountry: ["", Validators.required],
      orgEmail: ["", Validators.required],
      orgPhone: ["", Validators.required],

      //mno
      MNOname: ["", Validators.required],
      MNOAccName: ["", Validators.required],
      MNOAccNo: ["", Validators.required],
      //kin
      kinName: ["", Validators.required],
      kinMobile: ["", Validators.required],
      kinFather: ["", Validators.required],
      kinRelation: ["", Validators.required],
      kinEmail: ["", Validators.required],
      kinHouse: ["", Validators.required],
      kinLoc: ["", Validators.required],
      kinProvince: ["", Validators.required],
      kinStreet: ["", Validators.required],
      kinDistrict: ["", Validators.required],
      kinCountry: ["", Validators.required],
      //agent verify
      ICCIDverify: ["", Validators.required],
      cmpnyVerify: ["", Validators.required],
      PTIDverify: ["", Validators.required],
      locationVerify: ["", Validators.required],
      POSverify: ["", Validators.required],

      kyc: ["", Validators.required],
      kycDate: ["", Validators.required],

      //abmmc verify
      opVerify: ["", Validators.required],
      opVerifyDate: ["", Validators.required],
      compVerify: ["", Validators.required],
      compVerifyDate: ["", Validators.required],
    });
    this.dataSharing.kycData$.subscribe({
      next: (item) => {
        this.kycType = item?.kycType
        if (item?.id) {
          // console.log(item, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
          this.agentForm.patchValue({ father: item?.kycInputs?.custInfoFatherName });
          this.agentForm.patchValue({ firstName: item?.kycInputs?.custInfoFirstName });
          this.agentForm.patchValue({ pos: item?.kycInputs?.custInfoPOS })
          this.agentForm.patchValue({ last: item?.kycInputs?.custInfoLastName })
          this.agentForm.patchValue({ tazkira: item?.kycInputs?.custInfoTazkira })
          this.agentForm.patchValue({ position: item?.kycInputs?.custInfoPositionHeld })
          this.agentForm.patchValue({ issue: item?.kycInputs?.custInfoDateOfIssue })
          this.agentForm.patchValue({ dob: item?.kycInputs?.custInfoDob })
          this.agentForm.patchValue({ countryBasic: item?.kycInputs?.custInfoCountry })
          this.agentForm.patchValue({ license: item?.kycInputs?.custInfoLicenseNo })
          this.agentForm.patchValue({ iccid: item?.kycInputs?.custInfoICCID })
          this.agentForm.patchValue({ expiry: item?.kycInputs?.custInfoDateOfExpiry })
          this.agentForm.patchValue({ source: item?.kycInputs?.custInfoSourceOfIncome })
          this.agentForm.patchValue({ ptid: item?.kycInputs?.custInfoPTID })
          this.agentForm.patchValue({ income: item?.kycInputs?.custInfoMonthlyIncome })
          this.agentForm.patchValue({ accOpenDate: item?.kycInputs?.custInfoAccOpenDate })
          this.agentForm.patchValue({ email: item?.kycInputs?.custInfoEmail })
          this.agentForm.patchValue({ purpose: item?.kycInputs?.not })

          // this.father = item?.kycInputs?.custInfoFatherName;
          // this.first = item?.kycInputs?.custInfoFirstName;
          // this.last = item?.kycInputs?.custInfoLastName;
          // this.last = item?.kycInputs?.custInfoSurname;
          // this.posNo = item?.kycInputs?.posNo;
          // this.positionHeld = item?.kycInputs?.custInfoPositionHeld;
          // this.tazkira = item?.kycInputs?.custInfoTazkira;
          // this.dob = item?.kycInputs?.custInfoDob;
          // this.dateOfIssue = item?.kycInputs?.custInfoDateOfIssue;
          // this.licenseNo = item?.kycInputs?.custInfoLicenseNo;
          // this.country = item?.kycInputs?.custInfoCountry;
          // this.dateOfExpiry = item?.kycInputs?.custInfoLicenseExpiry;
          // this.iccidNo = item?.kycInputs?.custInfoICCID;
          // this.ptidNo = item?.kycInputs?.custInfoPTID;
          // this.sourceOfIncome = item?.kycInputs?.custInfoSourceOfIncome;
          // this.monthlyIncome = item?.kycInputs?.custInfoMonthlyIncome;
          // this.gender = item?.kycInputs?.gender;
          // this.marital = item?.kycInputs?.maritalStatus;
          // this.email = item?.kycInputs?.custInfoEmail;
          // this.mmAccType = item?.kycInputs?.mmAccType;
          // this.purposeOfAcc = item?.kycInputs?.purposeOfAcc;
          this.agentForm.patchValue({ houseNO: item?.kycInputs?.currHouseNo })
          this.agentForm.patchValue({ loc: item?.kycInputs?.currLocation })
          this.agentForm.patchValue({ province: item?.kycInputs?.currProvince })
          this.agentForm.patchValue({ street: item?.kycInputs?.currStreet })
          this.agentForm.patchValue({ district: item?.kycInputs?.currDistrict })
          this.agentForm.patchValue({ country: item?.kycInputs?.currCountry })
          // this.houseNo = item?.kycInputs?.currHouseNo;
          // this.location = item?.kycInputs?.currLocation;
          // this.province = item?.kycInputs?.currProvince;
          // this.street = item?.kycInputs?.currStreet;
          // this.district = item?.kycInputs?.currDistrict;
          // this.countryAddress = item?.kycInputs?.currCountry;
          this.agentForm.patchValue({ perHouseNO: item?.kycInputs?.permHouseNo })
          this.agentForm.patchValue({ perLoc: item?.kycInputs?.permLocation })
          this.agentForm.patchValue({ perProvince: item?.kycInputs?.permProvince })
          this.agentForm.patchValue({ perStreet: item?.kycInputs?.permStreet })
          this.agentForm.patchValue({ perDistrict: item?.kycInputs?.permDistrict })
          this.agentForm.patchValue({ perCountry: item?.kycInputs?.permCountry })
          // this.permanentHouseNo = item?.kycInputs?.nokHouseNo;
          // this.permanentLocation = item?.kycInputs?.nokLocation;
          // this.permanentProvince = item?.kycInputs?.nokProvince;
          // this.permanentStreet = item?.kycInputs?.nokStreet;
          // this.permanentDistrict = item?.kycInputs?.nokDistrict;
          // this.permanentCountry = item?.kycInputs?.nokCountry;

          this.agentForm.patchValue({ shopSource: item?.kycInputs?.orgSourceOfIncome })
          this.agentForm.patchValue({ shopName: item?.kycInputs?.orgName })
          this.agentForm.patchValue({ shopPosition: item?.kycInputs?.orgPositionHeld })
          this.agentForm.patchValue({ shopAddress: item?.kycInputs?.orgAddress })
          this.agentForm.patchValue({ shopIncome: item?.kycInputs?.orgMonthlyIncome })
          this.agentForm.patchValue({ shopActivityType: item?.kycInputs?.orgTypeOfActivity })
          this.agentForm.patchValue({ shopTurnover: item?.kycInputs?.orgTurnover })
          this.agentForm.patchValue({ shopTin: item?.kycInputs?.orgTinNumber })

          this.agentForm.patchValue({ orgHouseNo: item?.kycInputs?.orgHouseNo })
          this.agentForm.patchValue({ orgLocation: item?.kycInputs?.orgLocation })
          this.agentForm.patchValue({ orgProvince: item?.kycInputs?.orgProvince })
          this.agentForm.patchValue({ orgStreet: item?.kycInputs?.orgStreet })
          this.agentForm.patchValue({ orgDistrict: item?.kycInputs?.orgDistrict })
          this.agentForm.patchValue({ orgCountry: item?.kycInputs?.orgCountry })
          this.agentForm.patchValue({ orgEmail: item?.kycInputs?.orgEmail })
          this.agentForm.patchValue({ orgPhone: item?.kycInputs?.orgPhone })

          // this.shopName = item?.agentShopDetails?.shopName;
          // this.address = item?.agentShopDetails?.address;
          // this.activityType = item?.agentShopDetails?.typeOfActivity;
          // this.shopIncomeSource = item?.agentShopDetails?.sourceOfIncome;
          // this.shopPosition = item?.agentShopDetails?.positionHeld;
          // this.shopIncome = item?.agentShopDetails?.monthlyIncome;
          // this.turnover = item?.agentShopDetails?.monthlyTurnover;
          // this.tinNumber = item?.agentShopDetails?.tinNumber;
          this.agentForm.patchValue({ MNOname: item?.kycInputs?.otherMnoName });
          this.agentForm.patchValue({
            MNOAccName: item?.kycInputs?.otherMnoAccName,
          });
          this.agentForm.patchValue({
            MNOAccNo: item?.kycInputs?.otherMnoAccNo,
          });

          this.haveOtherAccounts = item?.otherMNOAccount?.haveOtherAccounts;
          this.MNOname = item?.otherMNOAccount?.mnoName;
          this.accountName = item?.otherMNOAccount?.accName;
          this.accountNo = item?.otherMNOAccount?.accNo;

          this.agentForm.patchValue({ kinName: item?.kycInputs?.nokName });
          this.agentForm.patchValue({ kinMobile: item?.kycInputs?.nokMobile });
          this.agentForm.patchValue({
            kinFather: item?.kycInputs?.nokFatherName,
          });
          this.agentForm.patchValue({
            kinRelation: item?.kycInputs?.nokRelationship,
          });
          this.agentForm.patchValue({ kinEmail: item?.kycInputs?.nokEmail });
          this.agentForm.patchValue({ kinHouse: item?.kycInputs?.nokHouseNo });
          this.agentForm.patchValue({ kinLoc: item?.kycInputs?.nokLocation });
          this.agentForm.patchValue({
            kinProvince: item?.kycInputs?.nokProvince,
          });
          this.agentForm.patchValue({ kinStreet: item?.kycInputs?.nokStreet });
          this.agentForm.patchValue({
            kinDistrict: item?.kycInputs?.nokDistrict,
          });
          this.agentForm.patchValue({
            kinCountry: item?.kycInputs?.nokCountry,
          });
          // this.nextOfKinName = item?.kycInputs?.nextOfKinName;
          // this.nextOfKinFatherName = item?.kycInputs?.nextOfKinFatherName;
          // this.relationship = item?.kycInputs?.relationship;
          // this.mobileNo = item?.kycInputs?.mobileNo;
          // this.kinEmail = item?.kycInputs?.nokEmail;
          // this.kinHouse = item?.kycInputs?.nokHouseNo;
          // this.kinLocation = item?.kycInputs?.nokLocation;
          // this.kinProvince = item?.kycInputs?.nokProvince;
          // this.kinStreet = item?.kycInputs?.nokStreet;
          // this.kinDistrict = item?.kycInputs?.nokDistrict;
          // this.kinCountry = item?.kycInputs?.nokCountry;
          //completed acc to new API kycInputs

          this.customerName = this.first + " " + this.last;
          this.customerDate = item?.kycInputs?.undertakenDate;

          // this.validLic = item?.documentsObtained?.validLicense;
          // this.validDir = item?.documentsObtained?.validPassportOrIdOfDirectors;
          // this.validSig =
          //   item?.documentsObtained?.validPassportOrIdOfSignatories;
          // this.article = item?.documentsObtained?.validArticleOfAssociation;
          // this.resolution = item?.documentsObtained?.validBoardResolution;
          // this.attorney = item?.documentsObtained?.validPowerOfAttorney;

          this.undertakenCust = item?.undertaken?.name;
          this.undertakenCustDate = item?.undertaken?.date;

          this.agentForm.patchValue({
            ICCIDverify: item?.kycInputs?.superICCID,
          });
          this.agentForm.patchValue({
            cmpnyVerify: item?.kycInputs?.superCompanyName,
          });
          this.agentForm.patchValue({ PTIDverify: item?.kycInputs?.superPTID });
          this.agentForm.patchValue({
            locationVerify: item?.kycInputs?.superLocation,
          });
          this.agentForm.patchValue({ POSverify: item?.kycInputs?.superPOS });
          this.agentForm.patchValue({ kyc: item?.kycInputs?.kycProcessedBy });
          this.agentForm.patchValue({
            kycDate: item?.kycInputs?.kycProcessedDate,
          });
          this.agentForm.patchValue({
            opVerify: item?.kycInputs?.superAgentVerification,
          });
          this.agentForm.patchValue({
            opVerifyDate: item?.kycInputs?.superAgentVerificationDate,
          });

          // this.ICCIDverify = item?.superAgentVerification?.iccidNo;
          // this.cmpnyVerify = item?.superAgentVerification?.companyName;
          // this.PTIDverify = item?.superAgentVerification?.ptidNo;
          // this.locationVerify = item?.superAgentVerification?.location;
          // this.POSverify = item?.superAgentVerification?.posNo;
          this.KycVerify = item?.submittedFor?.verifiedBy;
          this.processingDateverify =
            item?.submittedFor?.
            authorizedOn;
          this.agentForm.patchValue({
            opVerify: item?.kycInputs?.verifiedByOps,
          });
          this.agentForm.patchValue({
            opVerifyDate: item?.kycInputs?.verifiedByOpsDate,
          });
          this.agentForm.patchValue({
            compVerify: item?.kycInputs?.approvedByCompliance,
          });
          this.agentForm.patchValue({
            compVerifyDate: item?.kycInputs?.approvedByComplianceDate,
          });

          // this.Verified = item?.abmmcVerification?.verifiedByOperation;
          // this.VerifiedDate = item?.abmmcVerification?.verifyDate;
          // this.ComplianceAgent = item?.abmmcVerification?.approvedByCompliance;
          this.ComplianceDate = item?.abmmcVerification?.approvedOn;
        }
      },
    });
  }
  ngOnInit(): void {
    const privilegesData = sessionStorage.getItem("privileges");
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrivileges = this.userPrivileges[0];
      console.log(this.userPrivileges[0], "this.userPrevilages");
      console.log(this.userPrivileges, "this.userPrevilages1");

      for (let item of this.userPrivileges?.uiComponentPrivileges) {
        if (item?.component?.componentName == "KYC") {
          if (item.subComponent?.subComponentName == "Pending KYC")
            this.kycPrivelege = item;
        }
      }
    }
 

    this.route.paramMap.subscribe((params) => {
      this.kycId = params.get("kycId");
      console.log("kycId:", this.kycId);
    });
    //new
    this.userName = sessionStorage.getItem("loginUserName");
    console.log("username", this.userName);
    for (let item of this.allUsers) {
      // if (this.userName == item?.email) {
      if (this.userName == item?.kycInputs?.custInfoEmail) {
        this.showUpdate = true;
      }
    }
    //new
  }
  getAllKyc() {
    this.isLoading = true;
    this.KycService.getAllKyc().subscribe((data: any) => {
      this.isLoading = false;
      this.users = data?.data;
      this.allUsers = this.users;
      //new
      for (let item of this.allUsers) {
        if (this.kycId == item?.id) {
          this.userStatus = item?.status;
          this.seqNo = item?.seqNo;
          // if (userStatus === 'REJECTED' || userStatus === 'APPROVED') {
          //   this.showRejectButton = false;
          //   this.showApproveButton = false;
          // } else if (userStatus === 'IN_REVIEW') {
          //   this.showRejectButton = true;
          //   this.showApproveButton = true;
          // }
          // this.showUpdateButton = (userStatus === 'REJECTED');
        }
      }
      //saveproduct
      for (let item of this.users) {
        if (this.kycId == item?.id) {
          this.walletaccounts = item?.submittedFor?.walletAccount;
          console.log(" this.walletaccounts", this.walletaccounts);
        }
      }
      for (let item of this.users) {
        if (this.kycId == item?.id) {
          this.agentId = item?.submittedFor?.id;
          console.log(" this.agentId", this.walletaccounts);
        }
      }
      //as mikyc

      //end
    });
  }
  showUpdateAgentButton(): boolean {
    return this.kycPrivelege?.updatePrivelege && this.userStatus === "REJECTED";
  }
  triggerFileInput() {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}
