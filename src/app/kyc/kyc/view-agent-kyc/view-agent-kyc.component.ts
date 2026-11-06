import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { KycModuleService } from "../kyc-module.service";
import { CommonModule, NgClass, NgFor, NgIf } from "@angular/common";
import { ToastService } from "../toast.service";
import { environment } from "../../../../environments/environment";
import { UserManagementService } from "../../../user-management/user-management/user-management/openapi";
import { saveAs } from 'file-saver';
import { MatIconModule } from "@angular/material/icon";
import { CorporateService } from "../../../corporate/corporate.service";
import { SharedFunctionsService } from "../../../shared-functions.service";
import { PermissionService } from "../../../permission.service";
import { finalize } from "rxjs";
import { UserService } from "../../../user-management/user-management/user-management/user.service";
interface fileList {
  name: string,
  url: any
}
interface NewImageFile {
  name: string;
  url: any;
}
interface fileListByMaker {
  name: string,
  url: any
}
interface FileItem {
  name: string;
  url: string;
  selectedFile?: File;   // newly chosen file
  isUpdated?: boolean;   // API success
  isEditing?: boolean;   // pencil clicked for THIS file
}
@Component({
  selector: "app-view-agent-kyc",
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgFor, NgIf, NgClass, CommonModule, MatIconModule],
  templateUrl: "./view-agent-kyc.component.html",
  styleUrl: "./view-agent-kyc.component.css",
})
export class ViewAgentKycComponent implements OnInit {
  // @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('firstNameEdit') firstNameEdit!: ElementRef<HTMLInputElement>;
  @ViewChild('lastNameEdit') lastNameEdit!: ElementRef<HTMLInputElement>;
  isEditing: boolean = false;
  isEditingLast: boolean = false;
  isEditingGender: boolean = false;
  compForm: FormGroup = new FormGroup({});
  regForm: FormGroup = new FormGroup({});
  modifiedForm: FormGroup = new FormGroup({});
  regInput: FormControl = new FormControl();
  regDateInput: FormControl = new FormControl();
  remarkForm: FormGroup = new FormGroup({});
  remark: FormControl = new FormControl('', Validators.required);
  ComplianceInput: FormControl = new FormControl();
  ComplianceDateInput: FormControl = new FormControl();

  // remark = new FormControl();
  reason = new FormControl('', Validators.required,);
  MaleChecked = new FormControl();
  FemaleChecked = new FormControl();
  married = new FormControl();
  single = new FormControl();
  MMagent = new FormControl();
  MMussd = new FormControl();
  MMstaff = new FormControl();
  MMmicro = new FormControl();
  MMmerchant = new FormControl();
  riskLow = new FormControl();
  riskMedium = new FormControl();
  riskHigh = new FormControl();
  watchYes = new FormControl();
  watchNo = new FormControl();

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

  EMINo = new FormControl();
  EMIYes = new FormControl();

  KycProcessedInput = new FormControl();
  KycProcessedDateInput = new FormControl();
  VerifiedInput = new FormControl();
  VerifiedDateInput = new FormControl();
  // ComplianceInput = new FormControl();
  // ComplianceDateInput = new FormControl();

  undertaken: FormControl = new FormControl('', [])
  agentForm: FormGroup = new FormGroup({});
  editProfile: boolean = false
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
  // EMIname: any;
  accountName: any;
  accountNo: any;
  nextOfKinName: any;
  nextOfKinFatherName: any;
  relationship: any;
  mobileNo: any;
  customerName: any;
  customerDate: any;
  noDataRisk: boolean = false;
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
  kycSign: any
  agentVerifySign: any;
  opSign: any;
  compSign: any;
  type!: string;
  uploadedImage: any;
  uploadedImageFile0: any;
  uploadedImageFileType0: any;
  uploadedImageFileNameExtension0: any;
  uploadedImageFileData0: any
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
  uploadedImageKycSignName: any;
  uploadedImageAgentVerifySignName: any;
  uploadedImageOpSignName: any;
  uploadedImageCompSignName: any;
  submittedForId: any;
  watchlistRemarksVal: any;
  kycVal: any;
  kycProcessedDateVal: any;
  VerifiedVal: any;
  VerifiedDateVal: any;
  ComplianceVal: any;
  ComplianceDateVal: any;
  showRiskModal: boolean = false;
  riskDetails: any;
  showdigitalModal: boolean = false;
  showAbmmcHigh: boolean = false;
  showAbmmcLowMed: boolean = true;

  uploadedImageCompHeadSign: any;
  uploadedImageCompHeadSignName: any;
  uploadedImageCEOSign: any;
  uploadedImageCEOSignName: any;
  uploadedImageAttachmentName: any;
  currentDate: any;

  approveStatus: any;
  showApprove1Btn: boolean = false;
  showApprove2Btn: boolean = false;
  showApproveFinalBtn: boolean = false;
  showRejectApprove: boolean = false;
  sdnChecked: boolean = false;
  riskChecked: boolean = false;
  readOnly: boolean = false;
  viewOnly: boolean = false;
  dobValue: any;
  watchTarget: boolean = false;
  profileDetails: any;
  loginUser!: string;
  compHedSign: any;
  ceoSign: any;
  approvedByComplianceValue: any;
  approvedByComplianceDateValue: any;
  riskTarget: any;
  fileLists: fileList[] = [];
  newImageFileLists: NewImageFile[] = [];
  fileListsByMaker: fileListByMaker[] = [];
  DataRisk: boolean = false;
  riskTierValue: any;
  sdnView: any;
  showSdnAndRiskView: boolean = false;
  ShowEmi: boolean = false;
  otherDocsArray: any[] = [];
  otherdocsorNot: any;
  page: number = 0;
  currentPage!: number;
  item: any;
  custProofFrontPhoto: any;
  tinLetterPhoto: any;
  agentSignaturePhoto: any;
  custProofBackPhoto: any;
  bizOrGovtLicensePhoto: any;
  addressProofPhoto: any;
  newFile: any;
  newFileProfile: any;
  noDataSdn: boolean = false;
  newCompHead: any;
  newComp: any;
  newCeo: any;
  opsSignaturePhoto: any;
  previousRoute: any;
  firstNameOrginal: any;
  newGender: any;
  lastNameOrginal: any;
  MMwallet: any;
  kycLocked: boolean = false;
  regName: any;
  regDate: any;
  userType: any;
  showRegSection: boolean = false;
  regBySign: any;
  regSign: any;
  regEmail: any;
  modifiedName: any;
  modifiedEmail: any;
  modifiedDate: any;
  rawValueTurnover: any;
  formattedTurnover!: string;
  rawValueIncome: any;
  formattedIncome!: string;
  showBirthProvinceDrop: boolean = false;
  showBirthCountryDrop: boolean = false;
  showBirthCountryText: boolean = true;
  showBirthProvinceText: boolean = true;
  showCountryDrop: boolean = false;
  showProvinceDrop: boolean = false;
  showDistrictDrop: boolean = false;
  showDistrictText: boolean = true;
  showProvinceText: boolean = true;
  showCountryText: boolean = true;
  showNationalityText: boolean = true;
  showNationalityDrop: boolean = false;
  showSourceDrop: boolean = false;
  showSourceText: boolean = true;
  showNatureDrop: boolean = false;
  showNatureText: boolean = true;
  showPurposeDrop: boolean = false;
  showPurposeText: boolean = true;
  accPurposeData: any;
  incomeSourceData: any;
  natureOfBusinessData: any;
  nationalities: any;
  districtsPer: any;
  districtsCur: any;
  provincePerTarget: any;
  selectedProvincePer: any;
  provinceIdPer: any;
  provinceIdCur: any;
  provinceCurTarget: any;
  provinces: any;
  provincesBirth: any;
  countryNamePer: any;
  BirthProvinceValue: any;
  BirthCountryValue: any;
  countryNameCur: any;
  selectedProvinceCur: any;
  custGender: string = '';
  custMarital: string = '';
  countryCurReq: any;
  countryPerReq: any;
  provincePerReq: any;
  provinceCurReq: any;
  districtCurReq: any;
  districtPerReq: any;
  nationalityReq: any;
  sourceOfIncomeReq: any;
  natureReq: any;
  purposeOfAccReq: any;
  phoneErrorReg: boolean = false;
  showIdExist: boolean = false;
  emailError: boolean = false;
  replacedFiles: { [key: number]: File } = {};
  editingIndex: number | null = null;
  isUpdated: boolean = false;
  provincesPer: any;
  provincesCur: any;
  birthCountryReq: any;
  birthProvinceReq: any;
  authOrRejectID: any;
  idToSend: any;
  showUpdateBtn: boolean = false;
 regPhone !: string ;
  showEditPhoneInput : boolean = false;
  showEditEmailInput : boolean = false;
  reg_Email !: string ;
  phoneTouched: boolean = false;
  emailTouched: boolean = false;
   regPhone1: any;
  phoneEditComments: string = '';
  emailEditComments: string = '';
  phoneFileName: string = '';
  emailFileName: string = '';
  phoneFileSelected: File | null = null;
  emailFileSelected: File | null = null;
  phoneEmailRequestId: number | null = null;
   get isPhoneInvalid(): boolean {
    return !/^7[0-9]{8}$/.test(this.regPhone1 ?? '');
  }

  get isEmailInvalid(): boolean {
    return !/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(this.reg_Email ?? '');
  }
  constructor(
    private corporate: CorporateService,
    private renderer: Renderer2,
    private corporateService: CorporateService,
    private fb: FormBuilder,
    private KycService: KycModuleService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private userManagemantService: UserManagementService,
    private router: Router,
    private sharedFunctionsServic: SharedFunctionsService,
    private permissionService: PermissionService,
     private userService: UserService
  ) {
    this.permissionService.hideSidebar = false;
    
    // this.rejectreasonForm = this.fb.group({
    //   reason: ["", Validators.required],
    // });

    // Subscribe to value changes of 'reason' form control
    // this.rejectreasonForm.get("reason")?.valueChanges.subscribe((value) => {
    //   this.rejectReasonRequired =
    //     this.rejectreasonForm.get("reason")?.invalid || false;
    // });
  }
  ngOnInit(): void {
    this.getProvincesBirth();
    this.riskLow.disable();
    this.riskMedium.disable();
    this.riskHigh.disable();
    this.watchYes.disable();
    this.watchNo.disable();
    this.watchYes.valueChanges.subscribe((value: boolean | null) => {
      this.sdnChecked = value === true; // Update sdnChecked based on watchYes
    });
    this.initForm();
    this.route.queryParams.subscribe((params) => {
      this.previousRoute = params['from'] || 'kyc/customer-kyc'; // Default to 'kyc/customer-kyc' if not provided
      console.log("this.previousRoute", this.previousRoute)
      this.viewOnly = params['viewOnly'] === 'true';
    });
    this.KycService.getProfileDetails().subscribe((data: any) => {
      this.profileDetails = data?.data
      this.loginUser = this.profileDetails?.firstName + ' ' + this.profileDetails?.lastName
      console.log("this.loginUser", this.loginUser)
      // this.agentImg = this.profileDetails?.profilePic;
      // console.log("this.agentImg", this.agentImg);
      //new
      this.approvedByComplianceValue = this.item?.agentKyc?.approvedByComplianceFullName
      console.log("approvedByComplianceValue", this.approvedByComplianceValue)
      this.approvedByComplianceDateValue = this.item?.agentKyc?.approvedByComplianceDate
      console.log("approvedByComplianceDateValue", this.approvedByComplianceDateValue)
      if (this.userStatus === 'IN_REVIEW' ||
        this.userStatus === 'VERIFIED_L1' || this.userStatus === 'VERIFIED_L2') {
        this.compForm.get('ComplianceInput')?.setValue(this.loginUser);
        console.log("this.loginUser1", this.loginUser)
        this.compForm.get('ComplianceDateInput')?.setValue(this.currentDate);
      } else {
        this.compForm.get('ComplianceInput')?.setValue(this.approvedByComplianceValue);
        this.compForm.get('ComplianceDateInput')?.setValue(this.approvedByComplianceDateValue);
      }
    })
    const today = new Date();
    this.currentDate = today.toISOString().split('T')[0];
    this.ComplianceDateInput.setValue(this.currentDate);
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrivileges = this.userPrivileges[0];
      console.log(this.userPrivileges[0], "this.userPrevilages");
      console.log(this.userPrivileges, "this.userPrevilages1");

      for (let item of this.userPrivileges?.uiComponentPrivileges) {
        if (item?.component?.componentName == 'KYC') {
          if (item.subComponent?.subComponentName == 'Pending KYC')
            this.kycPrivelege = item;
        }
      }
    }
    this.agentForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 -]+$/)]],
      last: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 -]+$/)]],
      father: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 -]+$/)]],
      walletNO: ['', Validators.required],
      idType: ['', Validators.required],
      idNO: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      issue: ['', [Validators.required, this.sharedFunctionsServic.pastDateValidator()]],
      expiry: ['', [Validators.required, this.sharedFunctionsServic.futureDateValidator()]],
      pageNo: ['', Validators.required],
      bookNo: ['', Validators.required],
      regNo: ['', Validators.required],

      dob: ['', Validators.required],

      birthPlace: ['', Validators.required],
      basicCountry: ['', Validators.required],
      basicProvince: ['', Validators.required],
      birthCountryDrop: ['', Validators.required],
      birthProvinceDrop: ['', Validators.required],
      nationality: ['', Validators.required],
      nationalityDrop: ['', Validators.required],
      basicPhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      accOpenDate: ['', Validators.required],
      PTID: ['', Validators.required],
      purpose: ['', Validators.required],
      PurposeDrop: ['', Validators.required],
      //current
      houseNO: ['', Validators.required],
      loc: ['', Validators.required],
      province: ['', Validators.required],
      street: ['', Validators.required],
      district: ['', Validators.required],
      country: ['', Validators.required],
      //permanent
      perHouseNO: ['', Validators.required],
      perLoc: ['', Validators.required],
      perProvince: ['', Validators.required],
      perStreet: ['', Validators.required],
      perDistrict: ['', Validators.required],
      perCountry: ['', Validators.required],
      // per and cur address drop
      countryAddress: ['', Validators.required],
      perCountryAddress: ['', Validators.required],
      provinceAddress: ['', Validators.required],
      permanentProvince: ['', Validators.required],
      districtAddress: ['', Validators.required],
      permanentDistrict: ['', Validators.required],
      //shop
      shopSource: ['', Validators.required],
      incomeSourceOrg: ['', Validators.required],
      shopName: ['', Validators.required],
      shopPosition: ['', Validators.required],
      shopAddress: ['', Validators.required],
      shopIncome: ['', Validators.required],
      Nature: ['', Validators.required],
      NatureDrop: ['', Validators.required],
      shopTurnover: ['', Validators.required],
      shopTin: ['', Validators.required],

      orgHouseNo: ['', Validators.required],
      orgLocation: ['', Validators.required],
      orgProvince: ['', Validators.required],
      orgStreet: ['', Validators.required],
      orgDistrict: ['', Validators.required],
      orgCountry: ['', Validators.required],
      orgEmail: ['', Validators.required],
      orgPhone: ['', Validators.required],

      //EMI
      EMIname: ['', [Validators.required, , Validators.pattern(/^[a-zA-Z0-9 -]+$/)]],
      EMIAccName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 -]+$/)]],
      EMIAccNo: ['', Validators.required],
      //kin
      kinName: ['', Validators.required],
      kinMobile: ['', Validators.required],
      kinFather: ['', Validators.required],
      kinRelation: ['', Validators.required],
      kinAddress: ['', Validators.required],

      //agent verify
      ICCIDverify: ['', Validators.required],
      cmpnyVerify: ['', Validators.required],
      PTIDverify: ['', Validators.required],
      locationVerify: ['', Validators.required],
      POSverify: ['', Validators.required],

      kyc: ['', Validators.required],
      kycDate: ['', Validators.required],

      //abmmc verify
      opVerify: ['', Validators.required],
      opVerifyDate: ['', Validators.required],
      compVerify: ['', Validators.required],
      compVerifyDate: ['', Validators.required],
      //newValues
      firstNameNew: [''],
      lastNew: [''],
      fatherNew: [''],
      dobNew: [''],
      basicCountryNew: [''],
      basicProvinceNew: [''],
      nationalityNew: [''],
      basicPhoneNew: [''],
      emailNew: [''],
      PTIDNew: [''],
      purposeNew: [''],
      genderNew: [''],
      maritalNew: [''],
      idNONew: [''],
      issueNew: [''],
      expiryNew: [''],
      pageNoNew: [''],
      bookNoNew: [''],
      regNoNew: [''],

      locNew: [''],
      perCountryNew: [''],
      countryNew: [''],
      perProvinceNew: [''],
      provinceNew: [''],
      perDistrictNew: [''],
      districtNew: [''],

      shopSourceNew: [''],
      shopNameNew: [''],
      shopPositionNew: [''],
      shopAddressNew: [''],
      shopIncomeNew: [''],
      shopTurnoverNew: [''],
      NatureNew: [''],
      shopTinNew: [''],
      EMInameNew: [''],
      EMIAccNameNew: [''],
      EMIAccNoNew: [''],
    });
    this.scrollToBottom();
    // this.getAgentProducts();
    // this.getAllKyc();

    // this.route.paramMap.subscribe((params) => {
    //   this.kycId = params.get("kycId");
    //   console.log("kycId:", this.kycId);
    // });

    ///instead getAllKyc
    // this.route.queryParams.subscribe(params => {
    //   if (params['data']) {
    //     this.item = JSON.parse(params['data']);
    //     console.log("Received item:", this.item);
    //   }
    // });
    this.item = this.KycService.getItem();
    this.KycService.lockKYCforMultipleAccess(this.item?.id).subscribe(response => {
      if (response?.responseCode != 200) {
        this.kycLocked = true;
      }
    })
    console.log("Received item new method:", this.item);
    console.log("kyc id of Received item:", this.item?.id);
    this.kycId = this.item?.id;
    console.log("Extracted kycId:", this.kycId);
    this.userStatus = this.item?.status;
    this.regName = this.item?.submittedBy?.firstName + " " + this.item?.submittedBy?.lastName;
    this.regEmail = this.item?.submittedBy?.email
    this.regForm.get('regInput')?.setValue(this.regName);
    this.regDate = this.item?.agentKyc?.custInfoAccOpenDate;
    this.regForm.get('regDateInput')?.setValue(this.regDate);
    console.log("this.regName", this.regName)
    console.log("this.regDate", this.regDate)

    this.modifiedName = this.item?.modifiedBy?.firstName + " " + this.item?.modifiedBy?.lastName;
    this.modifiedEmail = this.item?.modifiedBy?.email
    this.modifiedDate = this.item?.modifiedOn;

    this.userType = this.item?.submittedBy?.userType
    console.log("this.userType 1231321", this.userType)
    if (this.userType == "BO") {
      this.showRegSection = true
      // this.showRegUsertypeOP = true
      // this.showRegUsertypeAgent = false
      // this.showRegUsertypeCustomer = false
    }
    else if (this.userType == "AGENT") {
      this.showRegSection = true
      // this.showRegUsertypeOP = false
      // this.showRegUsertypeAgent = true
      // this.showRegUsertypeCustomer = false
    }
    else if (this.userType == "CUSTOMER") {
      this.showRegSection = true;
      // this.showRegUsertypeOP = false
      // this.showRegUsertypeAgent = false
      // this.showRegUsertypeCustomer = true
    }

    if (this.userStatus == "IN_REVIEW") {
      this.showRejectApprove = true
    }
    this.seqNo = this.item?.seqNo;
    this.submittedForId = this.item?.submittedFor?.id
    // if (this.item?.agentKyc?.attachments.length != 0) {
    //   let i = 1;
    //   for (let file of this.item.agentKyc.attachments) {
    //     this.fileLists.push({
    //       name: 'Attachment - ' + i,
    //       url: this.imageUrl + '/kyc/static/' + file
    //     })
    //     i++;
    //   }
    // }
    //new
    if (this.item?.agentKyc?.otherDocs) {
      this.otherdocsorNot = this.item.agentKyc.otherDocs
      const otherDocsArray = this.item.agentKyc.otherDocs.split(',');
      let i = 1;
      for (let file of otherDocsArray) {
        this.fileLists.push({
          name: 'Other Document - ' + i,
          // url: `${this.imageUrl}/kyc/static/${file}`,
          url: file
          // url: this.imageUrl + '/kyc/static/' + file

        });
        i++;
      }
    }

    // if (this.item?.newValues?.otherDocs) {
    //   this.otherdocsorNot = this.item.newValues.otherDocs
    //   const otherDocsArray = this.item.newValues.otherDocs.split(',');
    //   let i = 1;
    //   for (let file of otherDocsArray) {
    //     this.fileListsByMaker.push({
    //       name: 'Other Document - ' + i,
    //       url: file
    //     });
    //     i++;
    //   }
    // }
    //new
    this.watchlistRemarksVal = this.item?.agentKyc?.watchlistRemarks
    console.log("watchlistRemarksVal", this.watchlistRemarksVal)
    //new added RESET when status is PENDING
    if (this.item?.status === 'PENDING') {
      this.remarkForm.patchValue({ remark: '' });
      this.readOnly = false;
    }
    else {
      this.remarkForm.patchValue({
        remark: this.watchlistRemarksVal || ''
      });
    }
    //
    if (this.watchlistRemarksVal || this.userStatus == 'APPROVED') {
      this.readOnly = true;
    }
    else if (this.watchlistRemarksVal == 'NIL' || !this.watchlistRemarksVal) {
      this.readOnly = false;
    }
    //

    this.walletaccounts = this.item?.submittedFor?.walletAccount;
    console.log(" this.walletaccounts", this.walletaccounts);

    this.agentId = this.item?.submittedFor?.id;
    console.log(" this.agentId", this.walletaccounts);
    this.agentid = this.item?.id;
    this.activeFlag = this.item?.submittedFor?.active;
    this.deletedFlag = this.item?.submittedFor?.deleted;
    if (this.item?.status == 'IN_REVIEW' || 'APPROVED') {
      this.readOnly = true;
    }
    else {
      this.readOnly = false;
    }
    //gender
    if (this.item.agentKyc.custInfoGender == "MALE") {
      this.MaleChecked.setValue(true);
    }
    if (this.item.agentKyc.custInfoGender == "FEMALE") {
      this.FemaleChecked.setValue(true);
    }
    //marital
    if (this.item.agentKyc.custInfoMaritalStatus == "SINGLE") {
      this.single.setValue(true);
    }
    if (this.item.agentKyc.custInfoMaritalStatus == "MARRIED") {
      this.married.setValue(true);
    }
    //risk&watch
    //risk
    if (this.item?.status != 'PENDING') {
      if (this.item?.agentKyc?.riskCategory == "LOW") {
        this.riskLow.setValue(true);
      }
      if (this.item?.agentKyc?.riskCategory == "MEDIUM") {
        this.riskMedium.setValue(true);
      }
      if (this.item?.agentKyc?.riskCategory == "HIGH") {
        this.riskHigh.setValue(true);
      }
      //watchlist
      console.log("checkedWatchlist", this.item?.agentKyc?.checkedWatchlist)
      if (this.item?.agentKyc?.checkedWatchlist) {
        this.watchYes.setValue(true);
        this.watchNo.setValue(false);
      }
      else if (!this.item?.agentKyc?.checkedWatchlist && this.item?.agentKyc?.checkedWatchlist != null) {
        this.watchYes.setValue(false);
        this.watchNo.setValue(true);
      }
      else {
        this.watchYes.setValue(false);
        this.watchNo.setValue(false);
      }
    }

    console.log("checkedWatchlist", this.item?.agentKyc?.otherMnoFacility)
    if (this.item?.agentKyc?.otherMnoFacility) {
      this.EMIYes.setValue(true);
      this.EMINo.setValue(false);
      this.ShowEmi = true
    }
    else if (!this.item?.agentKyc?.otherMnoFacility && this.item?.agentKyc?.otherMnoFacility != null) {
      this.EMIYes.setValue(false);
      this.EMINo.setValue(true);
      this.ShowEmi = false
    }
    else {
      this.EMIYes.setValue(false);
      this.EMINo.setValue(false);
      this.ShowEmi = false
    }
    //MM accType
    if (this.item.agentKyc.mmAgent) {
      this.MMagent.setValue(true);
    }
    if (this.item.agentKyc.mmUSSD) {
      this.MMussd.setValue(true);
    }
    if (this.item.agentKyc.mmStaff) {
      this.MMstaff.setValue(true);
    }
    if (this.item.agentKyc.mmMicro) {
      this.MMmicro.setValue(true);
    }
    if (this.item.agentKyc.mmMerchant) {
      this.MMmerchant.setValue(true);
    }
    //doc
    if (this.item.agentKyc.validLicenseNo) {
      this.licenseNoo.setValue(true);
    }
    if (this.item.agentKyc.validLicenseYes) {
      this.licenseYes.setValue(true);
    }
    if (this.item.agentKyc.validPassportNo) {
      this.passNo.setValue(true);
    }
    if (this.item.agentKyc.validPassportYes) {
      this.passYes.setValue(true);
    }
    if (this.item.agentKyc.validSignatoryNo) {
      this.signNo.setValue(true);
    }
    if (this.item.agentKyc.validSignatoryYes) {
      this.signYes.setValue(true);
    }
    if (this.item.agentKyc.validAssociationNo) {
      this.articleNo.setValue(true);
    }
    if (this.item.agentKyc.validAssociationYes) {
      this.articleYes.setValue(true);
    }
    if (this.item.agentKyc.validBoardResNo) {
      this.ResNo.setValue(true);
    }
    if (this.item.agentKyc.validBoardResYes) {
      this.ResYes.setValue(true);
    }
    if (this.item.agentKyc.validPOANo) {
      this.powerNo.setValue(true);
    }
    if (this.item.agentKyc.validPOAYes) {
      this.powerYes.setValue(true);
    }
    //haveEMI
    if (this.item.agentKyc.otherEMINo) {
      this.EMINo.setValue(true);
    }
    if (this.item.agentKyc.otherEMIYes) {
      this.EMIYes.setValue(true);
    }
    //old
    this.kycSign = this.item?.agentKyc?.superSign_img_1;
    this.opSign = this.item?.agentKyc?.opsSign_img_1;
    this.photoId = this.item?.id;
    //new //caused error
    if (this.item?.agentKyc?.agentSignaturePhoto) {
      this.getImages(this.item?.agentKyc?.agentSignaturePhoto, 'undertakenSign');
    }
    if (this.item?.agentKyc?.opsSignaturePhoto) {
      this.regSign = this.item?.agentKyc?.opsSignaturePhoto;
      this.getImages(this.item?.agentKyc?.opsSignaturePhoto, 'regBySign');
    }
    if (this.item?.agentKyc?.agentPhoto) {
      this.agentImg = this.item?.agentKyc?.agentPhoto;
      this.getImagesProfile(this.agentImg)
    }
    if (this.item?.agentKyc?.complianceSignaturePhoto) {
      this.compSign = this.item?.agentKyc?.complianceSignaturePhoto;
      this.getImagesComp(this.compSign)
    }
    if (this.item?.agentKyc?.complianceHeadSignaturePhoto) {
      this.compHedSign = this.item?.agentKyc?.complianceHeadSignaturePhoto;
      this.getImagesCompHead(this.compHedSign)
    }
    if (this.item?.agentKyc?.ceoSignaturePhoto) {
      this.ceoSign = this.item?.agentKyc?.ceoSignaturePhoto;
      this.getImagesCEO(this.ceoSign)
    }

    if (this.agentImg) {
      // this.CustomerImg = item?.agentKyc?.custPhoto;
      console.log("agentImg", this.agentImg)
      this.getImagesProfile(this.agentImg)
      this.fileLists.push({
        name: 'Agent Profile Picture',
        url: this.agentImg
        // url: this.imageUrl + '/kyc/static/' + this.agentImg
        // url: this.imageUrl + '/kyc/static/' + this.agentImg
        // url: this.imageUrl + '/um/static/profile/' + this.agentImg
      })
    }
    // if (this.item?.newValues?.agentPhoto) {
    //   console.log("agentImg", this.item?.newValues?.agentPhoto)
    //   this.getImagesProfile(this.item?.newValues?.agentPhoto)
    //   this.fileListsByMaker.push({
    //     name: 'Agent Profile Picture',
    //     url: this.item?.newValues?.agentPhoto
    //   })
    // }
    // if (this.item?.agentKyc.opsSignaturePhoto) {
    //   this.opsSignaturePhoto = this.item?.agentKyc.opsSignaturePhoto
    //   console.log("opsSignaturePhoto", this.opsSignaturePhoto)
    //   this.fileLists.push({
    //     name: 'Operations Signature Photo',
    //     url: this.opsSignaturePhoto
    //   })
    // }
    if (this.item?.agentKyc.custProofFrontPhoto) {
      this.custProofFrontPhoto = this.item?.agentKyc.custProofFrontPhoto
      console.log("custProofFrontPhoto", this.custProofFrontPhoto)
      this.fileLists.push({
        name: 'Agent Proof FrontPhoto',
        url: this.custProofFrontPhoto
        // url: this.imageUrl + '/kyc/static/' + this.custProofFrontPhoto
      })
    }
    // if (this.item?.newValues.custProofFrontPhoto) {
    //   // this.custProofFrontPhoto = this.item?.newValues.custProofFrontPhoto
    //   this.fileListsByMaker.push({
    //     name: 'Agent Proof FrontPhoto',
    //     url: this.item?.newValues.custProofFrontPhoto
    //   })
    // }
    if (this.item?.agentKyc.custProofBackPhoto) {
      this.custProofBackPhoto = this.item?.agentKyc.custProofBackPhoto
      console.log("custProofBackPhoto", this.custProofBackPhoto)
      this.fileLists.push({
        name: 'Agent Proof BackPhoto',
        url: this.custProofBackPhoto
        // url: this.imageUrl + '/kyc/static/' + this.custProofBackPhoto
      })
    }
    // if (this.item?.newValues.custProofBackPhoto) {
    //   // this.custProofBackPhoto = this.item?.newValues.custProofBackPhoto
    //   this.fileListsByMaker.push({
    //     name: 'Agent Proof BackPhoto',
    //     url: this.item?.newValues.custProofBackPhoto
    //   })
    // }
    if (this.item?.agentKyc.bizOrGovtLicensePhoto) {
      this.bizOrGovtLicensePhoto = this.item?.agentKyc.bizOrGovtLicensePhoto
      console.log("bizOrGovtLicensePhoto", this.bizOrGovtLicensePhoto)
      this.fileLists.push({
        name: 'Agent Business Or Govt LicensePhoto ',
        url: this.bizOrGovtLicensePhoto
        // url: this.imageUrl + '/kyc/static/' + this.bizOrGovtLicensePhoto
      })
    }
    // if (this.item?.newValues.bizOrGovtLicensePhoto) {
    //   // this.bizOrGovtLicensePhoto = this.item?.agentKyc.bizOrGovtLicensePhoto
    //   console.log("bizOrGovtLicensePhoto", this.bizOrGovtLicensePhoto)
    //   this.fileListsByMaker.push({
    //     name: 'Agent Business Or Govt LicensePhoto ',
    //     url: this.item?.newValues.bizOrGovtLicensePhoto
    //   })
    // }
    if (this.item?.agentKyc.agentSignaturePhoto) {
      this.agentSignaturePhoto = this.item?.agentKyc.agentSignaturePhoto
      console.log("agentSignaturePhoto", this.agentSignaturePhoto)
      this.fileLists.push({
        name: 'Agent Signature Photo',
        url: this.agentSignaturePhoto
        // url: this.imageUrl + '/kyc/static/' + this.agentSignaturePhoto
      })
    }
    // if (this.item?.newValues.agentSignaturePhoto) {
    //   // this.agentSignaturePhoto = this.item?.agentKyc.agentSignaturePhoto
    //   this.fileLists.push({
    //     name: 'Agent Signature Photo',
    //     url: this.item?.newValues.agentSignaturePhoto
    //   })
    // }
    if (this.item?.agentKyc.addressProofPhoto) {
      this.addressProofPhoto = this.item?.agentKyc.addressProofPhoto
      console.log("addressProofPhoto", this.addressProofPhoto)
      this.fileLists.push({
        name: 'Agent Address Proof Photo',
        url: this.addressProofPhoto
        // url: this.imageUrl + '/kyc/static/' + this.addressProofPhoto
      })
    }
    // if (this.item?.newValues.addressProofPhoto) {
    //   // this.addressProofPhoto = this.item?.agentKyc.addressProofPhoto
    //   this.fileListsByMaker.push({
    //     name: 'Agent Address Proof Photo',
    //     url: this.item?.newValues.addressProofPhoto
    //   })
    // }
    if (this.item?.agentKyc.tinLetterPhoto) {
      this.tinLetterPhoto = this.item?.agentKyc.tinLetterPhoto
      console.log("tinLetterPhoto", this.tinLetterPhoto)
      this.fileLists.push({
        name: 'Tin Letter Photo',
        url: this.tinLetterPhoto
        // url: this.imageUrl + '/kyc/static/' + this.tinLetterPhoto
      })
    }
    //new image section
    if (this.item?.newValues) {
      const img = this.item.newValues;
      const fullUrl = img.filePath; // ✅ FIXED
      //  this.item.newValues.forEach((img: any) => {
      console.log(" newValues9", this.item?.newValues)
      switch (img.mapping) {
        case 'bizOrGovtLicensePhoto':
          this.newImageFileLists.push({
            name: 'Agent Business / Govt License Photo',
            url: fullUrl
          });
          break;

        case 'agentPhoto':
          this.newImageFileLists.push({
            name: 'Agent Profile Picture',
            url: fullUrl
          });
          break;

        case 'agentSignaturePhoto':
          this.newImageFileLists.push({
            name: 'Agent Signature Photo',
            url: fullUrl
          });
          break;

        case 'custProofFrontPhoto':
          this.newImageFileLists.push({
            name: 'Agent Proof Front Photo',
            url: fullUrl
          });
          break;

        case 'custProofBackPhoto':
          this.newImageFileLists.push({
            name: 'Agent Proof Back Photo',
            url: fullUrl
          });
          break;

        case 'otherDocs':
          this.newImageFileLists.push({
            name: 'Other Document',
            url: fullUrl
          });
          break;
      }
    }
    // new image section
    // if (this.item?.newValues.tinLetterPhoto) {
    //   // this.tinLetterPhoto = this.item?.newValues.tinLetterPhoto
    //   this.fileLists.push({
    //     name: 'Tin Letter Photo',
    //     url: this.item?.newValues.tinLetterPhoto
    //   })
    // }
    //old patchvalue
    this.agentForm.patchValue({ firstName: this.item?.agentKyc?.custInfoFirstName || 'NIL' })
    this.agentForm.patchValue({ last: this.item?.agentKyc?.custInfoLastName || 'NIL' })
    this.agentForm.patchValue({ father: this.item?.agentKyc?.custInfoFatherName || 'NIL' })
    this.agentForm.patchValue({ walletNO: this.item?.agentKyc?.custInfoMMWallet || 'NIL' })
    this.agentForm.patchValue({ idType: this.item?.agentKyc?.custProofType || 'NIL' })
    // this.agentForm.patchValue({
    //   idType: this.formatProofType(item?.agentKyc?.custProofType || 'NIL')
    // });
    this.agentForm.patchValue({ idNO: this.item?.agentKyc?.custProofNumber || 'NIL' })
    this.agentForm.patchValue({ issue: this.item?.agentKyc?.custProofDateOfIssue || 'NIL' })
    this.agentForm.patchValue({ expiry: this.item?.agentKyc?.custProofDateOfExpiry || 'NIL' })
    this.agentForm.patchValue({ pageNo: this.item?.agentKyc?.tazkiraPageNo || 'NIL' })
    this.agentForm.patchValue({ bookNo: this.item?.agentKyc?.tazkiraBookNo || 'NIL' })
    this.agentForm.patchValue({ regNo: this.item?.agentKyc?.tazkiraRegNo || 'NIL' })
    this.agentForm.patchValue({ dob: this.item?.agentKyc?.custInfoDob })
    this.dobValue = this.item?.agentKyc?.custInfoDob
    this.agentForm.patchValue({ birthPlace: this.item?.agentKyc?.custInfoLicenseNo })
    this.agentForm.patchValue({ basicCountry: this.item?.agentKyc?.custInfoBirthCountry })
    this.agentForm.patchValue({ basicProvince: this.item?.agentKyc?.custInfoBirthProvince || 'NIL' })
    this.agentForm.patchValue({ birthCountryDrop: this.item?.agentKyc?.custInfoBirthCountry || 'NIL' })
    this.agentForm.patchValue({ birthProvinceDrop: this.item?.agentKyc?.custInfoBirthProvince || 'NIL' })
    this.agentForm.patchValue({ nationality: this.item?.agentKyc?.custInfoNationality || 'NIL' })
    this.agentForm.patchValue({ nationalityDrop: this.item?.agentKyc?.custInfoNationality || 'NIL' })
    this.agentForm.patchValue({ basicPhone: this.item?.agentKyc?.custInfoPhoneNumber || 'NIL' })
    this.agentForm.patchValue({ email: this.item?.agentKyc?.custInfoEmail || 'NIL' })
    this.agentForm.patchValue({ accOpenDate: this.item?.agentKyc?.custInfoAccOpenDate || 'NIL' })
    this.agentForm.patchValue({ PTID: this.item?.agentKyc?.custInfoPTID || 'NIL' })
    this.agentForm.patchValue({ purpose: this.item?.agentKyc?.custInfoPurposeOfAcc || 'NIL' })
    this.agentForm.patchValue({ PurposeDrop: this.item?.agentKyc?.custInfoPurposeOfAcc || 'NIL' })

    this.first = this.item?.agentKyc?.custInfoFirstName;
    this.last = this.item?.agentKyc?.custInfoLastName;
    this.firstNameOrginal = this.item?.agentKyc?.custInfoFirstName;
    this.lastNameOrginal = this.item?.agentKyc?.custInfoLastName;
    this.agentForm.patchValue({ houseNO: this.item?.agentKyc?.currHouseNo || 'NIL' })
    this.agentForm.patchValue({ loc: this.item?.agentKyc?.currLocation || 'NIL' })
    this.agentForm.patchValue({ province: this.item?.agentKyc?.currProvince || 'NIL' })
    this.agentForm.patchValue({ street: this.item?.agentKyc?.currStreet || 'NIL' })
    this.agentForm.patchValue({ district: this.item?.agentKyc?.currDistrict || 'NIL' })
    this.agentForm.patchValue({ country: this.item?.agentKyc?.currCountry || 'NIL' })

    this.agentForm.patchValue({ perHouseNO: this.item?.agentKyc?.permHouseNo || 'NIL' })
    this.agentForm.patchValue({ perLoc: this.item?.agentKyc?.permLocation || 'NIL' })
    this.agentForm.patchValue({ perProvince: this.item?.agentKyc?.permProvince || 'NIL' })
    this.agentForm.patchValue({ perStreet: this.item?.agentKyc?.permStreet || 'NIL' })
    this.agentForm.patchValue({ perDistrict: this.item?.agentKyc?.permDistrict || 'NIL' })
    this.agentForm.patchValue({ perCountry: this.item?.agentKyc?.permCountry || 'NIL' })
    //drop per and curr
    this.agentForm.patchValue({ countryAddress: this.item?.agentKyc?.currCountry || 'NIL' })
    this.agentForm.patchValue({ perCountryAddress: this.item?.agentKyc?.permCountry || 'NIL' })
    this.agentForm.patchValue({ provinceAddress: this.item?.agentKyc?.currProvince || 'NIL' })
    this.agentForm.patchValue({ permanentProvince: this.item?.agentKyc?.permProvince || 'NIL' })
    // this.agentForm.patchValue({ districtAddress: this.item?.agentKyc?.currDistrict || 'NIL' })
    // this.agentForm.patchValue({ permanentDistrict: this.item?.agentKyc?.permDistrict || 'NIL' })
    this.loadDistrictsAfterPatch(this.item?.agentKyc);

    this.agentForm.patchValue({ shopSource: this.item?.agentKyc?.orgSourceOfIncome || 'NIL' })
    this.agentForm.patchValue({ incomeSourceOrg: this.item?.agentKyc?.orgSourceOfIncome || 'NIL' })
    this.agentForm.patchValue({ shopName: this.item?.agentKyc?.orgName || 'NIL' })
    this.agentForm.patchValue({ shopPosition: this.item?.agentKyc?.orgPositionHeld || 'NIL' })
    this.agentForm.patchValue({ shopAddress: this.item?.agentKyc?.orgAddress || 'NIL' })
    // this.agentForm.patchValue({ shopIncome: item?.agentKyc?.orgMonthlyIncome || 'NIL' })
    this.agentForm.patchValue({
      shopIncome: this.item?.agentKyc?.orgMonthlyIncome
        ? `AFN ${this.formatNumber(this.item.agentKyc.orgMonthlyIncome)}`
        : 'NIL'
    });
    this.agentForm.patchValue({ Nature: this.item?.agentKyc?.orgBizNature || 'NIL' })
    this.agentForm.patchValue({ NatureDrop: this.item?.agentKyc?.orgBizNature || 'NIL' })
    // this.agentForm.patchValue({ shopTurnover: item?.agentKyc?.orgTurnover || 'NIL' })
    this.agentForm.patchValue({
      shopTurnover: this.item?.agentKyc?.orgTurnover
        ? `AFN ${this.formatNumber(this.item.agentKyc.orgTurnover)}`
        : 'NIL'
    });
    this.agentForm.patchValue({ shopTin: this.item?.agentKyc?.orgTinNumber || 'NIL' })

    this.agentForm.patchValue({ orgHouseNo: this.item?.agentKyc?.orgHouseNo || 'NIL' })
    this.agentForm.patchValue({ orgLocation: this.item?.agentKyc?.orgLocation || 'NIL' })
    this.agentForm.patchValue({ orgProvince: this.item?.agentKyc?.orgProvince || 'NIL' })
    this.agentForm.patchValue({ orgStreet: this.item?.agentKyc?.orgStreet || 'NIL' })
    this.agentForm.patchValue({ orgDistrict: this.item?.agentKyc?.orgDistrict || 'NIL' })
    this.agentForm.patchValue({ orgCountry: this.item?.agentKyc?.orgCountry || 'NIL' })
    this.agentForm.patchValue({ orgEmail: this.item?.agentKyc?.orgEmail || 'NIL' })
    this.agentForm.patchValue({ orgPhone: this.item?.agentKyc?.orgPhone || 'NIL' })

    this.agentForm.patchValue({ EMIname: this.item?.agentKyc?.otherMnoName || 'NIL' })
    this.agentForm.patchValue({ EMIAccName: this.item?.agentKyc?.otherMnoAccName || 'NIL' })
    this.agentForm.patchValue({ EMIAccNo: this.item?.agentKyc?.otherMnoAccNo || 'NIL' })

    this.agentForm.patchValue({ kinName: this.item?.agentKyc?.nokName || 'NIL' })
    this.agentForm.patchValue({ kinMobile: this.item?.agentKyc?.nokPhone || 'NIL' })
    this.agentForm.patchValue({ kinFather: this.item?.agentKyc?.nokFatherName || 'NIL' })
    this.agentForm.patchValue({ kinRelation: this.item?.agentKyc?.nokRelationship || 'NIL' })
    this.agentForm.patchValue({ kinAddress: this.item?.agentKyc?.nokLocation || 'NIL' })


    this.customerName = this.first + ' ' + this.last;
    this.customerDate = this.item?.agentKyc?.undertakenDate;

    this.undertakenCust = this.item?.undertaken?.name;
    this.undertakenCustDate = this.item?.undertaken?.date;

    this.agentForm.patchValue({ ICCIDverify: this.item?.agentKyc?.superICCID || 'NIL' })
    this.agentForm.patchValue({ cmpnyVerify: this.item?.agentKyc?.superCompanyName || 'NIL' })
    this.agentForm.patchValue({ PTIDverify: this.item?.agentKyc?.superPTID || 'NIL' })
    this.agentForm.patchValue({ locationVerify: this.item?.agentKyc?.superLocation || 'NIL' })
    this.agentForm.patchValue({ POSverify: this.item?.agentKyc?.superPOS || 'NIL' })
    this.agentForm.patchValue({ kyc: this.item?.agentKyc?.kycProcessedBy || 'NIL' })
    this.agentForm.patchValue({ kycDate: this.item?.agentKyc?.kycProcessedDate || 'NIL' })
    this.agentForm.patchValue({ opVerify: this.item?.agentKyc?.superAgentVerification || 'NIL' })
    this.agentForm.patchValue({ opVerifyDate: this.item?.agentKyc?.superAgentVerificationDate || 'NIL' })

    this.agentForm.patchValue({ opVerify: this.item?.agentKyc?.verifiedByOps || 'NIL' })
    this.agentForm.patchValue({ opVerifyDate: this.item?.agentKyc?.verifiedByOpsDate || 'NIL' })
    this.agentForm.patchValue({ compVerify: this.item?.agentKyc?.approvedByCompliance || 'NIL' })
    this.agentForm.patchValue({ compVerifyDate: this.item?.agentKyc?.approvedByComplianceDate || 'NIL' })
    if (this.readOnly) {
      this.FemaleChecked.disable();
      this.MaleChecked.disable();
      this.married.disable();
      this.single.disable();
    }
    //end
    //newvalue checker
    if (this.item?.newValues) {
      this.agentForm.patchValue({ firstNameNew: this.item?.newValues?.custInfoFirstName })
      this.agentForm.patchValue({ lastNew: this.item?.newValues?.custInfoLastName })
      this.agentForm.patchValue({ fatherNew: this.item?.newValues?.custInfoFatherName })
      this.agentForm.patchValue({ dobNew: this.item?.newValues?.custInfoDob })
      this.agentForm.patchValue({ basicCountryNew: this.item?.newValues?.custInfoBirthCountry || 'NIL' })
      this.agentForm.patchValue({ genderNew: this.item?.newValues?.custInfoGender || 'NIL' })
      this.agentForm.patchValue({ maritalNew: this.item?.newValues?.custInfoMaritalStatus || 'NIL' })

      this.agentForm.patchValue({ basicProvinceNew: this.item?.newValues?.custInfoBirthProvince || 'NIL' })
      this.agentForm.patchValue({ nationalityNew: this.item?.newValues?.custInfoNationality || 'NIL' })
      this.agentForm.patchValue({ basicPhoneNew: this.item?.newValues?.custInfoPhoneNumber || 'NIL' })
      this.agentForm.patchValue({ emailNew: this.item?.newValues?.custInfoEmail || 'NIL' })
      this.agentForm.patchValue({ PTIDNew: this.item?.newValues?.custInfoPTID || 'NIL' })

      this.agentForm.patchValue({ purposeNew: this.item?.newValues?.custInfoPurposeOfAcc || 'NIL' })
      this.agentForm.patchValue({ idNONew: this.item?.newValues?.custProofNumber || 'NIL' })
      this.agentForm.patchValue({ issueNew: this.item?.newValues?.custProofDateOfIssue || 'NIL' })
      this.agentForm.patchValue({ expiryNew: this.item?.newValues?.custProofDateOfExpiry || 'NIL' })

      this.agentForm.patchValue({ pageNoNew: this.item?.newValues?.tazkiraPageNo || 'NIL' })
      this.agentForm.patchValue({ bookNoNew: this.item?.newValues?.tazkiraBookNo || 'NIL' })
      this.agentForm.patchValue({ regNoNew: this.item?.newValues?.tazkiraRegNo || 'NIL' })

      this.agentForm.patchValue({ locNew: this.item?.newValues?.currLocation || 'NIL' })
      this.agentForm.patchValue({ perCountryNew: this.item?.newValues?.permCountry || 'NIL' })
      this.agentForm.patchValue({ countryNew: this.item?.newValues?.currCountry || 'NIL' })
      this.agentForm.patchValue({ perProvinceNew: this.item?.newValues?.permProvince || 'NIL' })
      this.agentForm.patchValue({ provinceNew: this.item?.newValues?.currProvince || 'NIL' })
      this.agentForm.patchValue({ perDistrictNew: this.item?.newValues?.permDistrict || 'NIL' })
      this.agentForm.patchValue({ districtNew: this.item?.newValues?.currDistrict || 'NIL' })

      this.agentForm.patchValue({ shopSourceNew: this.item?.newValues?.orgSourceOfIncome || 'NIL' })
      this.agentForm.patchValue({ shopNameNew: this.item?.newValues?.orgName || 'NIL' })
      this.agentForm.patchValue({ shopPositionNew: this.item?.newValues?.orgPositionHeld || 'NIL' })
      this.agentForm.patchValue({ shopAddressNew: this.item?.newValues?.orgAddress || 'NIL' })
      this.agentForm.patchValue({ shopIncomeNew: this.item?.newValues?.orgMonthlyIncome || 'NIL' })
      this.agentForm.patchValue({ shopTurnoverNew: this.item?.newValues?.orgTurnover || 'NIL' })
      this.agentForm.patchValue({ NatureNew: this.item?.newValues?.orgBizNature || 'NIL' })
      this.agentForm.patchValue({ shopTinNew: this.item?.newValues?.orgTinNumber || 'NIL' })

      this.agentForm.patchValue({ EMInameNew: this.item?.newValues?.otherMnoName || 'NIL' })
      this.agentForm.patchValue({ EMIAccNameNew: this.item?.newValues?.otherMnoAccName || 'NIL' })
      this.agentForm.patchValue({ EMIAccNoNew: this.item?.newValues?.otherMnoAccNo || 'NIL' })
    }
    //newvalue checker

    //new
    this.userName = sessionStorage.getItem('loginUserName')
    console.log("username", this.userName);
    // for (let item of this.allUsers) {
    // if (this.userName == item?.email) {
    if (this.userName == this.item?.agentKyc?.custInfoEmail) {

      this.showUpdate = true
    }
    // }
    //new
  }
  initForm() {
    this.remarkForm.addControl('remark', this.remark)
    this.compForm.addControl('ComplianceInput', this.ComplianceInput)
    this.compForm.addControl('ComplianceDateInput', this.ComplianceDateInput)
    this.regForm.addControl('regInput', this.regInput)
    this.regForm.addControl('regDateInput', this.regDateInput)

  }
  //new added
  isFieldChanged(oldValue: any, newValue: any): boolean {
    if (newValue === null || newValue === undefined) {
      return false;
    }
    const normalize = (val: any) => {
      if (val === null || val === undefined) return '';
      const v = val.toString().trim().toUpperCase();
      if (v === 'NIL') return '';
      return v;
    };
    return normalize(oldValue) !== normalize(newValue);
  }
  showChangedField(masterField: string, newField: string): boolean {
    return (
      this.userStatus === 'PENDING' &&
      this.item?.editType === 'KYC_DATA' &&
      this.isFieldChanged(
        this.item?.agentKyc?.[masterField],
        this.item?.newValues?.[newField]
      )
    );
  }
  //
  getImages(imgParam: any, type?: 'undertakenSign' | 'regBySign') {
    this.KycService.getImage(imgParam).subscribe((res) => {
      console.log(res);
      const objectURL = URL.createObjectURL(res);
      this.newFile = objectURL;
      if (type === 'regBySign') {
        this.regBySign = objectURL;
      } else if (type === 'undertakenSign') {
        this.undertakenSign = objectURL;
      }
    })
  }
  getImagesComp(imgParam: any) {
    this.KycService.getImage(imgParam).subscribe((res) => {
      console.log(res);
      const objectURL = URL.createObjectURL(res);
      this.newComp = objectURL;
    })
  }
  getImagesCompHead(imgParam: any) {
    this.KycService.getImage(imgParam).subscribe((res) => {
      console.log(res);
      const objectURL = URL.createObjectURL(res);
      this.newCompHead = objectURL;
    })
  }
  getImagesCEO(imgParam: any) {
    this.KycService.getImage(imgParam).subscribe((res) => {
      console.log(res);
      const objectURL = URL.createObjectURL(res);
      this.newCeo = objectURL;
    })
  }
  getImagesProfile(imgParam: any) {
    this.KycService.getImage(imgParam).subscribe((res) => {
      console.log(res);
      const objectURL = URL.createObjectURL(res);
      this.newFileProfile = objectURL;
    })
  }
  //new update

  toggleReadOnly(event: Event): void {
    const checkbox = event.target as HTMLInputElement;

    this.readOnly = !checkbox.checked; // Set `readOnly` based on checkbox state
    if (checkbox.checked) {
      this.showUpdateBtn = checkbox.checked
      this.getCountries();
      this.getAccPurpose();
      this.getIncomeSource();
      this.getNatureOfBusiness();
      //new address
      this.getProvincesPer();
      this.getProvincesCur();

      this.FemaleChecked.enable();
      this.MaleChecked.enable();
      this.married.enable();
      this.single.enable();
      //curr and per
      this.showCountryDrop = true
      this.showProvinceDrop = true
      this.showDistrictDrop = true
      this.showDistrictText = false
      this.showProvinceText = false
      this.showCountryText = false
      //birth place
      this.showBirthCountryText = false
      this.showBirthCountryDrop = true
      this.showBirthProvinceText = false
      this.showBirthProvinceDrop = true
      //nationality
      this.showNationalityDrop = true
      this.showNationalityText = false
      //source
      this.showSourceDrop = true
      this.showSourceText = false
      //nature
      this.showNatureDrop = true
      this.showNatureText = false
      //purpose
      this.showPurposeDrop = true
      this.showPurposeText = false

    }
    else {
      this.showUpdateBtn = false
      this.FemaleChecked.disable();
      this.MaleChecked.disable();
      this.married.disable();
      this.single.disable();

      // Optionally, you can hide or disable related dropdowns and text
      this.showCountryDrop = false;
      this.showProvinceDrop = false;
      this.showDistrictDrop = false;
      this.showDistrictText = true;
      this.showProvinceText = true;
      this.showCountryText = true;

      this.showBirthCountryText = true;
      this.showBirthCountryDrop = false;
      this.showBirthProvinceText = true;
      this.showBirthProvinceDrop = false;
      //nationality
      this.showNationalityDrop = false;
      this.showNationalityText = true;
      //source
      this.showSourceDrop = false
      this.showSourceText = true
      //nature
      this.showNatureDrop = false
      this.showNatureText = true
      //purpose
      this.showPurposeDrop = false
      this.showPurposeText = true
    }
  }
  getCountries() {
    this.corporateService.getCountries().subscribe({
      next: (data: any) => {
        this.nationalities = data?.data;
      }
    });
  }
  getNatureOfBusiness() {
    this.corporateService.getNatureOfBusiness().subscribe({
      next: (data: any) => {
        this.natureOfBusinessData = data?.data;
      }
    });
  }
  getIncomeSource() {
    this.corporateService.getIncomeSource().subscribe({
      next: (data: any) => {
        this.incomeSourceData = data?.data;
      }
    });
  }
  getAccPurpose() {
    this.corporateService.getAccPurpose().subscribe({
      next: (data: any) => {
        this.accPurposeData = data?.data;
      }
    });
  }
  onChangeBirthCountryDrop($event: any) {
    this.BirthCountryValue = $event.target.value
    this.getProvincesBirth();
    // this.onSelectBirthProvinceDrop(this.BirthCountryValue, $event);
  }
  getProvincesBirth() {
    this.corporateService.getprovinces().subscribe({
      next: (data: any) => {
        // this.provinces = data?.data;
        this.provincesBirth = Array.isArray(data?.data) ? data?.data : [];
        console.log("Provinces fetched:", this.provinces);
      }
    });
  }
  onSelectBirthProvinceDrop(BirthCountryValue: any, $event: any) {
    this.BirthProvinceValue = BirthCountryValue;
    console.log("BirthProvinceValue", this.BirthProvinceValue);
  }
  // onChangeCountryCur($event: any) {
  //   this.countryNameCur = $event.target.value
  //   this.getProvinces();
  //   console.log("this.countryNameCur", this.countryNameCur)
  //   this.onSelectProvinceCurr(this.countryNameCur, $event);
  // }
  // onChangeCountryPer($event: any) {
  //   this.countryNamePer = $event.target.value
  //   this.getProvinces();
  //   console.log("this.countryNamePer", this.countryNamePer)
  //   this.onSelectProvincePer(this.countryNamePer, $event);
  // }
  onChangeCountryCur($event: any) {
    this.countryNameCur = $event.target.value
    this.getProvincesCur();
    console.log("this.countryNameCur", this.countryNameCur)
    // this.onSelectProvinceCurr(this.countryNameCur, $event);
  }
  onChangeCountryPer($event: any) {
    this.countryNamePer = $event.target.value
    this.getProvincesPer();
    console.log("this.countryNamePer", this.countryNamePer)
    // this.onSelectProvincePer(this.countryNamePer, $event);
  }
  getProvinces() {
    this.corporateService.getprovinces().subscribe({
      next: (data: any) => {
        // this.provinces = data?.data;
        this.provinces = Array.isArray(data?.data) ? data?.data : [];
        console.log("Provinces fetched:", this.provinces);
      }
    });
  }
  getProvincesPer() {
    this.corporateService.getprovinces().subscribe({
      next: (data: any) => {
        // this.provinces = data?.data;
        this.provincesPer = Array.isArray(data?.data) ? data?.data : [];
        console.log("Provinces fetched:", this.provinces);
        this.tryLoadDistricts();
      }
    });
  }
  getProvincesCur() {
    this.corporateService.getprovinces().subscribe({
      next: (data: any) => {
        // this.provinces = data?.data;
        this.provincesCur = Array.isArray(data?.data) ? data?.data : [];
        console.log("Provinces fetched:", this.provinces);
        //
        this.tryLoadDistricts();
      }
    });
  }
  tryLoadDistricts() {
    if (
      this.provincesCur?.length &&
      this.provincesPer?.length &&
      this.item?.agentKyc
    ) {
      this.loadDistrictsAfterPatch(this.item.agentKyc);
    }
  }
  loadDistrictsAfterPatch(data: any) {

    const currProvince = this.provincesCur?.find(
      (p: any) => p.name === data?.currProvince
    );
    if (currProvince) {
      this.getDistrictsCur(currProvince.id, data?.currDistrict);
    }
    const permProvince = this.provincesPer?.find(
      (p: any) => p.name === data?.permProvince
    );
    if (permProvince) {
      this.getDistrictsPer(permProvince.id, data?.permDistrict);
    }
  }
  onSelectProvinceCurr(event: any) {
    this.provinceCurTarget = event.target.value;

    if (Array.isArray(this.provincesCur)) {
      for (let item of this.provincesCur) {
        if (this.provinceCurTarget === item.name) {
          this.selectedProvinceCur = item.id;
          break;
        }
      }
      // clear old district
      this.agentForm.patchValue({ districtAddress: null });

      this.getDistrictsCur(this.selectedProvinceCur);
    } else {
      console.error("provincesCur is not an array:", this.provincesCur);
    }
  }
  onSelectProvincePer(event: any) {
    this.provincePerTarget = event.target.value;

    if (Array.isArray(this.provincesPer)) {
      for (let item of this.provincesPer) {
        if (this.provincePerTarget === item.name) {
          this.selectedProvincePer = item.id;
          break;
        }
      }

      // clear old district
      this.agentForm.patchValue({ permanentDistrict: null });
      this.getDistrictsPer(this.selectedProvincePer);
    } else {
      console.error("provincesPer is not an array:", this.provincesPer);
    }
  }
  getDistrictsCur(provinceId: number, districtValue?: string) {
    this.corporateService.getdistricts(provinceId).subscribe(res => {
      this.districtsCur = res?.data || [];

      if (districtValue) {
        this.agentForm.patchValue({
          districtAddress: districtValue
        });
      }
    });
  }
  getDistrictsPer(provinceId: number, districtValue?: string) {
    this.corporateService.getdistricts(provinceId).subscribe(res => {
      this.districtsPer = res?.data || [];

      if (districtValue) {
        this.agentForm.patchValue({
          permanentDistrict: districtValue
        });
      }
    });
  }
  // onSelectProvinceCurr(countryNameCur: any, $event: any) {
  //   this.provinceIdCur = countryNameCur;
  //   console.log("this.provinceIdCur", this.provinceIdCur);
  //   this.provinceCurTarget = $event.target.value
  //   console.log("this.provinceCurTarget", this.provinceCurTarget);
  //   // for (let item of this.provinces) {
  //   //   if (this.provinceCurTarget == item?.name) {
  //   //     this.selectedProvinceCur = item?.id;
  //   //   }
  //   // }
  //   // this.getDistricts(this.selectedProvinceCur);
  //   if (Array.isArray(this.provinces)) {
  //     for (let item of this.provinces) {
  //       if (this.provinceCurTarget == item?.name) {
  //         this.selectedProvinceCur = item?.id;
  //       }
  //     }
  //     this.getDistrictsCur(this.selectedProvinceCur);
  //   } else {
  //     console.error("Provinces is not an array:", this.provinces);
  //   }
  // }
  // onSelectProvincePer(countryNamePer: any, $event: any) {
  //   this.provinceIdPer = countryNamePer;
  //   this.provincePerTarget = $event.target.value
  //   console.log("this.provincePerTarget", this.provincePerTarget);
  //   // for (let item of this.provinces) {
  //   //   if (this.provincePerTarget == item?.name) {
  //   //     this.selectedProvincePer = item?.id;
  //   //   }
  //   // }
  //   // console.log("this.selectedProvincePer", this.selectedProvincePer);
  //   // this.getDistricts(this.selectedProvincePer);
  //   if (Array.isArray(this.provinces)) {
  //     for (let item of this.provinces) {
  //       if (this.provincePerTarget == item?.name) {
  //         this.selectedProvincePer = item?.id;
  //       }
  //     }
  //     console.log("this.selectedProvincePer", this.selectedProvincePer);
  //     this.getDistrictsPer(this.selectedProvincePer);
  //   } else {
  //     console.error("Provinces is not an array:", this.provinces);
  //   }
  // }
  // getDistrictsCur(provinceId: number) {
  //   this.corporateService.getdistricts(provinceId).subscribe({
  //     next: (data: any) => {
  //       this.districtsCur = data?.data;
  //     }
  //   });
  // }
  // getDistrictsPer(provinceId: number) {
  //   this.corporateService.getdistricts(provinceId).subscribe({
  //     next: (data: any) => {
  //       this.districtsPer = data?.data;
  //     }
  //   });
  // }
  //new update
  setFieldValue(key: string, value: any) {
    this.agentForm.patchValue({ [key]: value ?? 'nil' });
  }
  //

  formatProofType(proofType: string): string {
    if (!proofType) return '';

    // Replace underscores with spaces and capitalize the first letter of each word
    return proofType
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  formatNumber(value: number | string): string {
    if (value === null || value === undefined || value === '') {
      return '0';
    }
    const numericValue = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(numericValue)) {
      return '0';
    }
    return numericValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  showUpdateAgentButton(): boolean {
    return this.kycPrivelege?.updatePrivelege && this.userStatus === 'REJECTED';
  }
  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
  checkPhoneExistence() {
    const phone = this.agentForm.get('basicPhone')?.value;
    if (!phone) return;

    let userTypeToCheck = 'CUSTOMER';
    if (this.item?.agentKyc) {
      userTypeToCheck = 'AGENT';
    } else if (this.item?.merchantKyc) {
      userTypeToCheck = 'MERCHANT';
    }

    this.corporate.checkPhoneExist(phone).subscribe(
      (response: any) => {
        if (response && response.data) {
          const match = response.data.find(
            (item: any) => item.userType === userTypeToCheck  // ✅ FIX HERE
          );

          this.phoneErrorReg = !!match;
        }
      },
      (error) => {
        console.error('Error checking phone existence:', error);
      }
    );
  }
  checkIdExists(): void {
    const idNumber = this.agentForm.get('idNO')?.value;
    let userTypeToCheck = 'CUSTOMER'; // default
    if (this.item?.agentKyc) {
      userTypeToCheck = 'AGENT';
    } else if (this.item?.merchantKyc) {
      userTypeToCheck = 'MERCHANT';
    }
    if (idNumber) {
      let req = {
        "idProof": this.agentForm.get('idNO')?.value,
        "kycType": userTypeToCheck
      }
      this.corporate.checkIDexists(req).subscribe(
        (data: any) => {
          // this.showIdExist = data.exists; // Assume API response contains "exists" field
          if (data?.data === true) {
            this.showIdExist = true; // Show error if username exists
          } else {
            this.showIdExist = false; // Hide error if username is valid
          }
        },
        (error) => {
          console.error('Error checking ID:', error);
          this.showIdExist = false; // Reset error on API failure
        }
      );
    }
  }
  checkEmailExistence() {
    const email = this.agentForm.get('email')?.value;
    let userTypeToCheck = 'CUSTOMER'; // default
    if (this.item?.agentKyc) {
      userTypeToCheck = 'AGENT';
    } else if (this.item?.merchantKyc) {
      userTypeToCheck = 'MERCHANT';
    }
    if (email) {
      this.corporate.checkEmailExist(email).subscribe(
        (response: any) => {
          if (response && response.data) {
            // Check if email matches any record with user type 'CUSTOMER'
            const customerMatch = response.data.find(
              (item: any) =>
                item.userType === userTypeToCheck
            );

            if (customerMatch) {
              this.emailError = true;
            } else {
              this.emailError = false; // Clear the error message if no match is found
            }
          }
        },
        (error) => {
          console.error('Error checking email existence:', error);
        }
      );
    }
  }
  startEdit(fileItem: any) {
    // close editing on all files
    this.fileLists.forEach((f: any) => f.isEditing = false);
    // open editing only for clicked file
    fileItem.isEditing = true;
  }

  docTypeMap: { [key: string]: string } = {
    'Agent Profile Picture': 'agentPhoto',
    'Agent Proof FrontPhoto': 'custProofFrontPhoto',
    'Agent Proof BackPhoto': 'custProofBackPhoto',
    'Agent Business Or Govt LicensePhoto': 'bizOrGovtLicensePhoto',
    'Agent Signature Photo': 'agentSignaturePhoto',
    'Agent Address Proof Photo': 'addressProofPhoto',
    'Tin Letter Photo': 'tinLetterPhoto'
  };
  detectFilesByMaker(event: any, fileItem: any) {
    const selectedFile: File = event.target.files[0];
    if (!selectedFile) return;
    // store file locally
    fileItem.selectedFile = selectedFile;
    fileItem.isUpdated = false;
    const docName = fileItem.name.trim().toLowerCase();
    // find the correct key in docTypeMap (case-insensitive)
    const typeKey = Object.keys(this.docTypeMap)
      .find(k => k.trim().toLowerCase() === docName);

    if (!typeKey) {
      alert(`Invalid document type: ${fileItem.name}`);
      return;
    }
    const mappedType = this.docTypeMap[typeKey];

    // call API with mappedType
    this.KycService.agentUpdateImageByMaker(selectedFile, mappedType, this.agentId)
      .subscribe({
        next: (data: any) => {
          if (data?.responseCode === 200) {
            fileItem.isUpdated = true;
            fileItem.isEditing = false;
            this.editingIndex = null;
            alert(data?.data);
          } else {
            alert(data?.error || 'Update failed');
          }
        },
        error: () => {
          fileItem.isEditing = false;
          alert(`Error updating ${docName}`)
        }
      });
  }
   detectFilesByMakerOtherDocs(event: any, mapping: any){
    // const input = event.target as HTMLInputElement;
    if (event.target.files && event.target.files[0]) {
      let file: File | null = event.target.files[0];

      this.isLoading = true;
      if (file) {
        this.KycService.agentUpdateImageByMaker(file, mapping,this.agentId).subscribe({
          next: (res: any) => {
            if (res.responseCode === 200) {
              alert(`File uploaded successfully.`);
            } else {
              console.error(`Failed to upload ${mapping}: ${res.data}`);
            }
          }
        });
      }
    }
    else {
      console.error('No file provided for upload.');
      return;
    }
    this.isLoading = false;
  }
  //
  detectFilesPhoto(event: any) {
    // if (event.target.files && event.target.files[0]) {
    //   this.uploadedImage = event.target.files[0];
    //   this.uploadedImageFile0 = event.target.files[0].name;
    //   this.uploadedImageFileType0 = event.target.files[0].type
    //   this.uploadedImageFileNameExtension0 = event.target.files[0].name.split('.').pop();
    //   const file = event.target.files[0];
    //   const reader = new FileReader();
    //   reader.readAsDataURL(file);
    //   this.uploadedImageFileData0 = reader.result;
    //   reader.onload = () => {
    //     this.uploadedImageFileData0 = reader.result;
    //   };
    // }
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.uploadedImage = input.files[0];
      // Handle file upload here
      // For example, you can use a service to upload the file and update `agentImg`
      console.log(this.uploadedImage);
    }
    // for (let item of this.users) {
    // if (this.kycId == item?.id) {
    this.agentId = this.item?.submittedFor?.id;
    console.log("agentId", this.agentId);
    this.type = "agentPhoto";
    this.KycService.addAgentphoto(this.uploadedImage, this.type, this.agentId).subscribe((data: any) => {
    })
    // }
    // }

  }
  detectFilesUndertaken(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadedImageUndertaken = event.target.files[0];
      // console.log("uploadedImage1", this.uploadedImage1);
      this.uploadedImageFileName = event.target.files[0].name;
      this.uploadedImageFileType1 = event.target.files[0].type
      this.uploadedImageFileNameExtension = event.target.files[0].name.split('.').pop();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.uploadedImageFileData = reader.result;
      reader.onload = () => {
        this.uploadedImageFileData = reader.result;
      };
    }
    // for (let item of this.users) {
    // if (this.kycId == item?.id) {
    this.agentId = this.item?.submittedFor?.id;
    console.log("agentId", this.agentId);
    this.type = "agentSignaturePhoto";
    this.KycService.addAgentSign(this.uploadedImageUndertaken, this.type, this.agentId).subscribe((data: any) => {
    })
    // }
    // }

    // setTimeout(() => {
    //   let Req: imageUpload = {
    //     type: "SIGNATURE",
    //     file: this.uploadedImage1
    //   }
    //   this.imageValue.push(Req);
    // }, 1800);

  }
  detectFilesCompHeadSign(event: any) {
    // this.showdigitalModal = true

    if (event.target.files && event.target.files[0]) {
      this.uploadedImageCompHeadSign = event.target.files[0];
      this.uploadedImageCompHeadSignName = event.target.files[0].name;
      // this.uploadedImageKycSign = event.target.files[0].type
      // this.uploadedImageKycSign = event.target.files[0].name.split('.').pop();
      // const file = event.target.files[0];
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // this.uploadedImageKycSign = reader.result;
      // reader.onload = () => {
      //   this.uploadedImageKycSign = reader.result;
      // };
    }
    this.type = "complianceHeadSignaturePhoto"
    this.KycService.addAgentSign(this.uploadedImageCompHeadSign, this.type, this.submittedForId).subscribe((data: any) => {
    })
  }

  detectFilesCEOSign(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadedImageCEOSign = event.target.files[0];
      this.uploadedImageCEOSignName = event.target.files[0].name;
      // this.uploadedImageAgentVerifySign = event.target.files[0].type
      // this.uploadedImageAgentVerifySign = event.target.files[0].name.split('.').pop();
      // const file = event.target.files[0];
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // this.uploadedImageAgentVerifySign = reader.result;
      // reader.onload = () => {
      //   this.uploadedImageAgentVerifySign = reader.result;
      // };
    }
    this.type = "ceoSignaturePhoto"
    this.KycService.addCustomerCEOSign(this.uploadedImageCEOSign, this.type, this.submittedForId).subscribe((data: any) => {
    })

  }
  detectFilesOpSign(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadedImageOpSign = event.target.files[0];
      this.uploadedImageOpSignName = event.target.files[0].name;
      // this.uploadedImageOpSign = event.target.files[0].type
      // this.uploadedImageOpSign = event.target.files[0].name.split('.').pop();
      // const file = event.target.files[0];
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // this.uploadedImageOpSign = reader.result;
      // reader.onload = () => {
      //   this.uploadedImageOpSign = reader.result;
      // };
    }
    this.type = "opsSign_img_0";
    this.KycService.addAgentSign(this.uploadedImageOpSign, this.type, this.agentId).subscribe((data: any) => {
    })
  }
  detectFilesCompSign(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadedImageCompSign = event.target.files[0];
      this.uploadedImageCompSignName = event.target.files[0].name;
      // this.uploadedImageCompSign = event.target.files[0].type
      // this.uploadedImageCompSign = event.target.files[0].name.split('.').pop();
      // const file = event.target.files[0];
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // this.uploadedImageCompSign = reader.result;
      // reader.onload = () => {
      //   this.uploadedImageCompSign = reader.result;
      // };
    }
    this.type = "complianceSignaturePhoto";
    this.KycService.addAgentSign(this.uploadedImageCompSign, this.type, this.agentId).subscribe((data: any) => {
    })

  }
  detectFilesAttachment(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0]; // Get the uploaded file
      this.uploadedImageAttachmentName = file.name; // Store file name to display
      const formData = new FormData();
      formData.append('file', file);
      this.KycService.addAgentAttachment(formData, this.submittedForId).subscribe(
        (data: any) => {
          console.log("File uploaded successfully", data);
        },
        (error: any) => {
          console.error("File upload failed", error);
        }
      );
    }
  }
  ngAfterViewChecked(): void {
    this.scrollToBottom();
    // this.adjustContainerHeight();
  }
  getAgentProducts() {
    this.KycService.getAgentProducts().subscribe((data: any) => {
      this.products = data;
    });
  }
  makePdf() {
    this.MMwallet = this.item?.agentKyc?.custInfoMMWallet
    const download$ = this.viewOnly
      ? this.KycService.downloadPDFForClosedAccounts(this.kycId)
      : this.KycService.downloadPDF(this.kycId);
    download$.subscribe({
      next: (data: Blob) => {
        console.log(data.type);  // Ensure it logs 'application/pdf'
        const filename = this.seqNo + '_kYC.pdf';
        saveAs(data, filename);
      },
      error: (error : any) => {
        console.error('Download failed:', error);
        alert('Failed to download PDF');
      }
    });
  }
  makeRiskPdf() {
    this.KycService.downloadRiskPDF(this.kycId).subscribe(
      (data: Blob) => {
        console.log(data.type);  // Ensure it logs 'application/pdf'
        const filename = 'Risk_Result.pdf';
        saveAs(data, filename);
      },
      (error) => {
        console.error('Download failed:', error);
        alert('Failed to download PDF');
      }
    );
  }
  makeSdnPdf() {
    this.KycService.downloadSdnPDF(this.submittedForId).subscribe(
      (data: Blob) => {
        console.log(data.type);  // Ensure it logs 'application/pdf'
        const filename = 'Sdn_Result.pdf';
        saveAs(data, filename);
      },
      (error) => {
        console.error('Download failed:', error);
        alert('Failed to download PDF');
      }
    );
  }
  onChangeGetProduct($event: any) {
    this.productId = $event.target.value;
  }
  // saveChangedProduct() {
  //   for (let item of this.products) {
  //     if (this.productId == item?.id) {
  //       this.masterProduct = item;
  //     }
  //   }
  //   console.log(" this.walletaccounts", this.walletaccounts);
  //   console.log(" this.masterProduct", this.masterProduct);
  //   let req = {
  //     walletAccount: this.walletaccounts,
  //     masterProduct: this.masterProduct,
  //   };
  //   this.isLoading = true;
  //   this.KycService.changeProduct(req).subscribe((data: any) => {
  //     this.isLoading = false;
  //     if (data && data.walletNo) {
  //       alert("Success: The product has been changed successfully.")
  //     } else {
  //       alert("Failure: There was an issue changing the product.")
  //     }
  //   }, error => {
  //     alert("Error: Something went wrong. Please try again later.")
  //     this.isLoading = false;
  //   });
  // }
  checkSdn() {
    this.isLoading = true;
    this.watchYes.enable();
    // this.watchNo.enable();
    this.watchYes.setValue(true);
    this.watchNo.setValue(false);
    this.sdnChecked = true
    this.watchTarget = true;

    //new added
    if (this.item?.status == 'PENDING') {
      this.submittedForId = this.item?.submittedFor?.id;
      if (this?.item?.newValues && this?.item?.newValues?.length > 0 && this.item?.newValues?.custInfoDob) {
        this.item.agentKyc.custInfoDob = this.item?.newValues?.custInfoDob;
      }
      if (this.item?.newValues?.custInfoFirstName) {
        this.item.agentKyc.custInfoFirstName = this.item?.newValues?.custInfoFirstName;
      }
    }

    const req = {
      // name: this.first,
      // percentage: 50
      "name": this.item?.agentKyc?.custInfoFirstName,
      "minMatchPercent": 60,
      "dob": this.item?.agentKyc?.custInfoDob,
      "kycId": this.kycId,
      "userId": this.submittedForId
    };

    // ---- FIELD-LEVEL NULL / EMPTY CHECK ----
    const missingFields: string[] = [];

    Object.entries(req).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        missingFields.push(key);
      }
    });

    if (missingFields.length > 0) {
      alert(
        'SDN check cannot be performed.\n\nMissing or invalid field(s):\n' +
        missingFields.join(', ')
      );
      this.isLoading = false;
      return;
    }
    console.log("SDN Req", req);

    // this.KycService.searchSdn(req).subscribe((data: any) => {
    this.KycService.searchSdn(req)
      .pipe(
        finalize(() => {
          this.isLoading = false; // ✅ centralized, no logic change
        })
      )
      .subscribe((data: any) => {
        // this.isLoading = false;
        // this.showModal = true;
        // this.sdnDetails = data
        // console.log("sdnDetails", this.sdnDetails)
        // this.showModal = true;
        // if (!data) {
        //   this.isLoading = false;
        //   this.noDataSdn=true
        // }
        // this.isLoading = false;
        if (data && data.length > 0) {
          this.sdnDetails = data;
          this.noDataSdn = false;
          this.showModal = true;
        } else {
          this.sdnDetails = [];
          this.noDataSdn = true;
          this.showModal = true;
          alert(data?.error);
        }
      });
  }
  hasValidData(detail: any): boolean {
    return !!(
      detail?.firstName ||
      detail?.secondName ||
      detail?.fullName ||
      (detail?.dobList && detail.dobList.length > 0) ||
      (detail?.addressList && detail.addressList.length > 0 && (
        detail.addressList[0].address1 ||
        detail.addressList[0].country ||
        detail.addressList[0].city
      )) ||
      detail?.sdnSource
    );
  }
  //old
  // checkRisk() {
  //   this.riskChecked = true;
  //   this.isLoading = true;
  //   this.KycService.checkRisk(this.kycId).subscribe((data: any) => {
  //     if (data && data?.data) {
  //       // Data is found, show the table
  //       this.DataRisk = true;
  //       this.noDataRisk = false;
  //       this.riskDetails = data?.data;
  //       this.riskTierValue = this.riskDetails.riskTier
  //       console.log("riskTierValue", this.riskTierValue);
  //       //latest
  //       // this.riskLow.enable();
  //       // this.riskMedium.enable();
  //       // this.riskHigh.enable();
  //       if (this.riskTierValue === 'LOW') {
  //         this.riskLow.setValue(true); // Check Low
  //         this.showApproveFinalBtn = true;
  //         this.showApprove1Btn = false;
  //         this.showApprove2Btn = false;
  //       } else if (this.riskTierValue === 'MEDIUM') {
  //         this.riskMedium.setValue(true); // Check Medium
  //         this.showApproveFinalBtn = true;
  //         this.showApprove1Btn = false;
  //         this.showApprove2Btn = false;
  //       } else if (this.riskTierValue === 'HIGH') {
  //         this.riskHigh.setValue(true); // Check High
  //         this.showApproveFinalBtn = false;
  //         this.showApprove1Btn = true;
  //         this.showApprove2Btn = false;
  //       }
  //       this.isLoading = false;
  //     } else {
  //       // No data found, show the error message
  //       this.isLoading = false;
  //       this.DataRisk = false;
  //       this.noDataRisk = true;
  //     }
  //     this.showRiskModal = true;
  //   });
  // }
  //new added
  checkRisk() {
    this.riskChecked = true;
    // this.isLoading = true;
    if (this.item?.status == 'PENDING') {
      this.kycId = this.item?.kycMasterId;
    }
    this.KycService.checkRisk(this.kycId)
      .pipe(
        finalize(() => {
          // this.isLoading = false;  // ✅ keep commented, same as your logic
        })
      )
      .subscribe((data: any) => {

        if (data && data?.data) {
          this.showRiskModal = true;
          this.riskDetails = data?.data;
          this.riskTierValue = data?.data?.riskTier;
          console.log("riskTierValue", this.riskTierValue);

          this.DataRisk = true;
          this.noDataRisk = false;

          if (this.riskTierValue === 'LOW') {
            this.riskLow.setValue(true);
            this.showApproveFinalBtn = true;
            this.showApprove1Btn = false;
            this.showApprove2Btn = false;

          } else if (this.riskTierValue === 'MEDIUM') {
            this.riskMedium.setValue(true);
            this.showApproveFinalBtn = true;
            this.showApprove1Btn = false;
            this.showApprove2Btn = false;

          } else if (this.riskTierValue === 'HIGH') {
            this.riskHigh.setValue(true);
            this.showApproveFinalBtn = false;
            this.showApprove1Btn = true;
            this.showApprove2Btn = false;
          }

          // this.isLoading = false;
        }
        else {
          // this.isLoading = true;
          this.DataRisk = false;
          this.noDataRisk = true;
          alert(data?.error);
        }

        // this.showRiskModal = true;
      });
  }
  viewRiskandSdn() {
    this.isLoading = true; // Start loading
    this.KycService.viewRiskAndSdn(this.submittedForId).subscribe((data: any) => {
      this.isLoading = false; // Stop loading
      // this.sdnView = data?.searchResult; // Assign search results to sdnView
      // this.showSdnAndRiskView = true; // Show the table with data
      const results = data[data.length - 1]?.searchResult || [];
      this.sdnView = results; // Assign the results to sdnView
      this.showSdnAndRiskView = true;
    }, error => {
      this.isLoading = false; // Stop loading on error
      console.error('Error fetching data:', error);
    });
  }
  closeRiskAndSdnModal() {
    this.showSdnAndRiskView = false;
  }
  closeModal() {
    this.showModal = false;
  }
  closeModalDigital() {
    this.showdigitalModal = false;
  }
  closeRiskModal() {
    this.showRiskModal = false;
  }
  //old
  viewFile(fileUrl: string) {
    // window.open(fileUrl, '_blank');  // Opens the file in a new tab
    console.log('VIEW FILE ID:', fileUrl);
    this.KycService.getImageAndOpen(fileUrl)
  }
  viewFileByMaker(fileItem: any) {
    if (
      this.userStatus === 'APPROVED' &&
      fileItem?.isUpdated &&
      fileItem?.selectedFile
    ) {
      const objectUrl = URL.createObjectURL(fileItem.selectedFile);
      window.open(objectUrl, '_blank');
      return;
    }
    this.KycService.getImageAndOpen(fileItem.url);
  }
  printFile(fileUrl: string) {
    this.KycService.getImage(fileUrl).subscribe((res: Blob) => {
      const objectUrl = URL.createObjectURL(res); // Create an object URL for the Blob
      const printWindow = window.open(objectUrl, '_blank');
      if (printWindow) {
        printWindow.onload = function () {
          printWindow.print();
          URL.revokeObjectURL(objectUrl); // Release the object URL after printing
        };
      }
    });
  }
  isFileInOtherDocs(fileUrl: string): boolean {
    if (!this.otherdocsorNot) return false; // Ensure `otherdocsorNot` exists
    const otherDocsArray = this.otherdocsorNot.split(','); // Convert string to array
    return otherDocsArray.includes(fileUrl); // Check if fileUrl exists in otherDocs
  }
  deleteFile(index: number) {
    // Get the full file URL from fileLists
    const fileUrl = this.fileLists[index].url;

    // Extract only the part of the path after "/kyc/static/"
    const photoId = fileUrl.split('/kyc/static/').pop(); // Gets "160/1731656339720.jpg"

    if (photoId) {
      // Call the API to delete the specific file using only the extracted part
      if (this.userStatus == 'IN_REVIEW') {
        let req = {
          "otherDocs": [
            photoId,
          ]
        }
        this.KycService.deleteAgentMultipleDoc(req, this.submittedForId).subscribe((data: any) => {
          if (data?.code === 200) {
            alert('File deleted successfully');
          } else {
            alert('Error deleting file:');
          }
        });
      }
      else if (this.userStatus == 'APPROVED') {
        let req = {
          "otherDocs": [
            photoId,
          ]
        }
        this.KycService.deleteAgentMultipleDocByMaker(req, this.submittedForId).subscribe((data: any) => {
          if (data?.code === 200) {
            alert('File deleted successfully');
          } else {
            alert('Error deleting file:');
          }
        });
      }
    }
  }

  // Function to download the file
  downloadFile(fileUrl: string) {
    this.KycService.getImage(fileUrl).subscribe((res: Blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(res); // Create an object URL for the Blob
      a.href = objectUrl;

      // Extract the file name from the URL string
      const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
      a.download = fileName;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl); // Release the object URL after use
    });
  }
  private v(value: any): any {
    if (value === undefined || value === null) return null;
    const v = String(value).trim().toUpperCase();
    return v === '' || v === 'NIL' ? null : value;
  }

  onSubmitEdit() {
    if (this.agentForm.get('dob')?.hasError('underage') || this.agentForm.get('dob')?.hasError('overage')) {
      alert('Please ensure the date of birth is valid (between 18 and 100 years old).');
      return;
    }
    console.log("currCountry start", this.item?.agentKyc?.currCountry);
    // Handle permanent country address logic
    if (this.agentForm.get('countryAddress')?.value === this.item?.agentKyc?.currCountry) {
      this.countryCurReq = this.item?.agentKyc?.currCountry;
      console.log("else countryAddress", this.countryCurReq);
    } else {
      this.countryCurReq = this.agentForm.get('countryAddress')?.value;
      console.log("if countryAddress", this.countryCurReq);
    }
    if (this.agentForm.get('perCountryAddress')?.value === this.item?.agentKyc?.permCountry) {
      this.countryPerReq = this.item?.agentKyc?.permCountry;
      console.log("else countryPerReq", this.countryPerReq);
    } else {
      this.countryPerReq = this.agentForm.get('perCountryAddress')?.value;
      console.log("if countryPerReq", this.countryPerReq);
    }

    // Handle permanent Province address logic
    if (this.agentForm.get('provinceAddress')?.value === this.item?.agentKyc?.currProvince) {
      this.provinceCurReq = this.item?.agentKyc?.currProvince;
    } else {
      this.provinceCurReq = this.agentForm.get('provinceAddress')?.value;
    }
    if (this.agentForm.get('permanentProvince')?.value === this.item?.agentKyc?.permProvince) {
      this.provincePerReq = this.item?.agentKyc?.permProvince;
    } else {
      this.provincePerReq = this.agentForm.get('permanentProvince')?.value;
    }

    // Handle permanent district address logic
    if (this.agentForm.get('districtAddress')?.value === this.item?.agentKyc?.currDistrict) {
      this.districtCurReq = this.item?.agentKyc?.currDistrict;
    } else {
      this.districtCurReq = this.agentForm.get('districtAddress')?.value;
    }
    if (this.agentForm.get('permanentDistrict')?.value === this.item?.agentKyc?.permDistrict) {
      this.districtPerReq = this.item?.agentKyc?.permDistrict;
    } else {
      this.districtPerReq = this.agentForm.get('permanentDistrict')?.value;
    }

    //Birthplace
    if (this.agentForm.get('birthCountryDrop')?.value === this.item?.agentKyc?.custInfoBirthCountry) {
      this.birthCountryReq = this.item?.agentKyc?.custInfoBirthCountry;
    } else {
      this.birthCountryReq = this.agentForm.get('birthCountryDrop')?.value;
    }
    if (this.agentForm.get('birthProvinceDrop')?.value === this.item?.agentKyc?.custInfoBirthProvince) {
      this.birthProvinceReq = this.item?.agentKyc?.custInfoBirthProvince;
    } else {
      this.birthProvinceReq = this.agentForm.get('birthProvinceDrop')?.value;
    }
    //nationalty
    const nationalityText = this.agentForm.get('nationality')?.value;
    const nationalityDrop = this.agentForm.get('nationalityDrop')?.value;
    this.nationalityReq = nationalityDrop || nationalityText || null;

    //source
    const srcText = this.agentForm.get('shopSource')?.value;
    const srcDrop = this.agentForm.get('incomeSourceOrg')?.value;
    this.sourceOfIncomeReq = srcDrop || srcText || null;

    //nature
    const natureText = this.agentForm.get('Nature')?.value;
    const natureDrop = this.agentForm.get('NatureDrop')?.value;
    this.natureReq = natureDrop || natureText || null;

    //purpose
    const purposeText = this.agentForm.get('purpose')?.value;
    const purposeDrop = this.agentForm.get('PurposeDrop')?.value;
    this.purposeOfAccReq = purposeDrop || purposeText || null;

    // marital status
    if (this.married.value) {
      this.custMarital = 'MARRIED';
    } else if (this.single.value) {
      this.custMarital = 'SINGLE';
    } else {
      this.custMarital = '';
    }
    //gender
    if (this.FemaleChecked.value) {
      this.custGender = 'FEMALE';
    } else if (this.MaleChecked.value) {
      this.custGender = 'MALE';
    } else {
      this.custGender = '';
    }
    console.log('custGender:', this.custGender);

    const rawIncome = this.agentForm.get('shopIncome')?.value;
    const rawTurnover = this.agentForm.get('shopTurnover')?.value;

    const income = rawIncome ? rawIncome.toString().replace(/[^0-9.]/g, '') : null;
    const turnover = rawTurnover ? rawTurnover.toString().replace(/[^0-9.]/g, '') : null;

    if (this.userStatus == "IN_REVIEW") {
      let req = {
        kycInputs: {
          custInfoFirstName: this.v(this.agentForm.get('firstName')?.value),
          custInfoLastName: this.v(this.agentForm.get('last')?.value),
          custInfoFatherName: this.v(this.agentForm.get('father')?.value),
          custProofType: this.v(this.agentForm.get('idType')?.value),
          custInfoDob: this.v(this.agentForm.get('dob')?.value),
          // custInfoMMWallet: this.v(this.agentForm.get('walletNO')?.value),
          // custInfoBirthCountry: this.v(this.agentForm.get('basicCountry')?.value),
          // custInfoBirthProvince: this.v(this.agentForm.get('basicProvince')?.value),
          custInfoBirthCountry: this.birthCountryReq,
          custInfoBirthProvince: this.birthProvinceReq,
          custInfoNationality: this.v(this.nationalityReq),
          custInfoPhoneNumber: this.v(this.agentForm.get('basicPhone')?.value),
          custInfoEmail: this.v(this.agentForm.get('email')?.value),
          custInfoAccOpenDate: this.v(this.agentForm.get('accOpenDate')?.value),
          custInfoPTID: this.v(this.agentForm.get('PTID')?.value),
          custInfoMaritalStatus: this.v(this.custMarital),
          custInfoGender: this.v(this.custGender),
          custInfoPurposeOfAcc: this.v(this.purposeOfAccReq),
          custProofNumber: this.v(this.agentForm.get('idNO')?.value),
          custProofDateOfExpiry: this.v(this.agentForm.get('expiry')?.value),
          custProofDateOfIssue: this.v(this.agentForm.get('issue')?.value),
          tazkiraPageNo: this.v(this.agentForm.get('pageNo')?.value),
          tazkiraBookNo: this.v(this.agentForm.get('bookNo')?.value),
          tazkiraRegNo: this.v(this.agentForm.get('regNo')?.value),

          currLocation: this.v(this.agentForm.get('loc')?.value),
          currCountry: this.v(this.countryCurReq),
          currProvince: this.v(this.provinceCurReq),
          currDistrict: this.v(this.districtCurReq),
          permCountry: this.v(this.countryPerReq),
          permProvince: this.v(this.provincePerReq),
          permDistrict: this.v(this.districtPerReq),

          orgSourceOfIncome: this.v(this.sourceOfIncomeReq),
          orgName: this.v(this.agentForm.get('shopName')?.value),
          orgPositionHeld: this.v(this.agentForm.get('shopPosition')?.value),
          orgAddress: this.v(this.agentForm.get('shopAddress')?.value),
          orgMonthlyIncome: this.v(income),
          orgTurnover: this.v(turnover),
          orgBizNature: this.v(this.natureReq),
          orgTinNumber: this.v(this.agentForm.get('shopTin')?.value),

          otherMnoName: this.v(this.agentForm.get('EMIname')?.value),
          otherMnoAccName: this.v(this.agentForm.get('EMIAccName')?.value),
          otherMnoAccNo: this.v(this.agentForm.get('EMIAccNo')?.value),

          nokName: this.v(this.agentForm.get('kinName')?.value),
          nokFatherName: this.v(this.agentForm.get('kinFather')?.value),
          nokRelationship: this.v(this.agentForm.get('kinRelation')?.value),
          nokPhone: this.v(this.agentForm.get('kinMobile')?.value),
          nokLocation: this.v(this.agentForm.get('kinAddress')?.value),
        },
        kycType: this.item?.kycType,
        submittedFor: this.submittedForId
      }
      this.isLoading = true;
      this.KycService.agentFinalUpdate(req).subscribe((data: any) => {
        this.isLoading = false;
        if (data?.responseCode == 200) {
          this.corporateService.completeAgentKyc(this.item?.submittedFor?.id).subscribe((data: any) => {
            if (data?.responseCode == 200) {
              alert("Updated Successfully")
              // this.router.navigate(["kyc/customer"]);
            }
            else {
              alert(data?.error)
            }
          })
        }
        else {
          alert(data?.error)
        }
      })
    }
    else if (this.userStatus == "APPROVED") {
      let req = {
        kycInputs: {
          custInfoFirstName: this.v(this.agentForm.get('firstName')?.value),
          custInfoLastName: this.v(this.agentForm.get('last')?.value),
          custInfoFatherName: this.v(this.agentForm.get('father')?.value),
          custProofType: this.v(this.agentForm.get('idType')?.value),
          custInfoDob: this.v(this.agentForm.get('dob')?.value),
          // custInfoMMWallet: this.v(this.agentForm.get('walletNO')?.value),
          custInfoBirthCountry: this.v(this.agentForm.get('basicCountry')?.value),
          custInfoBirthProvince: this.v(this.agentForm.get('basicProvince')?.value),
          custInfoNationality: this.v(this.nationalityReq),
          custInfoPhoneNumber: this.v(this.agentForm.get('basicPhone')?.value),
          custInfoEmail: this.v(this.agentForm.get('email')?.value),
          custInfoAccOpenDate: this.v(this.agentForm.get('accOpenDate')?.value),
          custInfoPTID: this.v(this.agentForm.get('PTID')?.value),
          custInfoMaritalStatus: this.v(this.custMarital),
          custInfoGender: this.v(this.custGender),
          custInfoPurposeOfAcc: this.v(this.purposeOfAccReq),
          custProofNumber: this.v(this.agentForm.get('idNO')?.value),
          custProofDateOfExpiry: this.v(this.agentForm.get('expiry')?.value),
          custProofDateOfIssue: this.v(this.agentForm.get('issue')?.value),
          tazkiraPageNo: this.v(this.agentForm.get('pageNo')?.value),
          tazkiraBookNo: this.v(this.agentForm.get('bookNo')?.value),
          tazkiraRegNo: this.v(this.agentForm.get('regNo')?.value),

          currLocation: this.v(this.agentForm.get('loc')?.value),
          currCountry: this.v(this.countryCurReq),
          currProvince: this.v(this.provinceCurReq),
          currDistrict: this.v(this.districtCurReq),
          permCountry: this.v(this.countryPerReq),
          permProvince: this.v(this.provincePerReq),
          permDistrict: this.v(this.districtPerReq),

          orgSourceOfIncome: this.v(this.sourceOfIncomeReq),
          orgName: this.v(this.agentForm.get('shopName')?.value),
          orgPositionHeld: this.v(this.agentForm.get('shopPosition')?.value),
          orgAddress: this.v(this.agentForm.get('shopAddress')?.value),
          orgMonthlyIncome: this.v(income),
          orgTurnover: this.v(turnover),
          orgBizNature: this.v(this.natureReq),
          orgTinNumber: this.v(this.agentForm.get('shopTin')?.value),

          otherMnoName: this.v(this.agentForm.get('EMIname')?.value),
          otherMnoAccName: this.v(this.agentForm.get('EMIAccName')?.value),
          otherMnoAccNo: this.v(this.agentForm.get('EMIAccNo')?.value),

          nokName: this.v(this.agentForm.get('kinName')?.value),
          nokFatherName: this.v(this.agentForm.get('kinFather')?.value),
          nokRelationship: this.v(this.agentForm.get('kinRelation')?.value),
          nokPhone: this.v(this.agentForm.get('kinMobile')?.value),
          nokLocation: this.v(this.agentForm.get('kinAddress')?.value),
        },
        kycType: this.item?.kycType,
        submittedFor: this.submittedForId
      }
      this.isLoading = true;
      this.KycService.agentFinalUpdateByMaker(req).subscribe((data: any) => {
        this.isLoading = false;
        if (data?.responseCode == 200) {
          alert(data?.data)
          this.router.navigate(["kyc/kyc-edit-requests"]);
        }
        else {
          alert(data.error)
        }
      })
    }
  }
  scrollToBottom(): void {
    // try {
    //   this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    // } catch (err) { }
  }

  // adjustContainerHeight(): void {
  //   const scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
  //   const clientHeight = this.scrollContainer.nativeElement.clientHeight;
  //   if (scrollHeight > clientHeight) {
  //     this.renderer.setStyle(this.scrollContainer.nativeElement, 'max-height', `${clientHeight}px`);
  //   } else {
  //     this.renderer.setStyle(this.scrollContainer.nativeElement, 'max-height', 'unset');
  //   }
  // }

  onCheckedRisk($event: any, riskType: any) {
    this.riskTarget = riskType
    console.log("riskTarget11", this.riskTarget)
    window.scrollTo(0, 0);
    this.riskValue = $event.target.value;
    this.cdr.detectChanges();
    let riskLevel = $event.target.value
    console.log("riskLevel", riskLevel)
    // for (let item of this.allUsers) {
    if (this.kycId == this.item?.id) {
      this.approveStatus = this.item?.status
      this.showApprove1Btn = false;
      this.showApprove2Btn = false;
      this.showApproveFinalBtn = false;
    }

    // if (riskLevel === 'high' && this.approveStatus === 'IN_REVIEW') {
    //   this.showApproveFinalBtn = false;
    //   this.showApprove1Btn = true;
    //   this.showApprove2Btn = false;
    // }
    // else if (riskLevel === 'low' && this.approveStatus === 'IN_REVIEW') {
    //   this.showApproveFinalBtn = true;
    //   this.showApprove1Btn = false;
    //   this.showApprove2Btn = false;
    // }
    // else if (riskLevel === 'medium' && this.approveStatus === 'IN_REVIEW') {
    //   this.showApproveFinalBtn = true;
    //   this.showApprove1Btn = false;
    //   this.showApprove2Btn = false;
    // }
  }

  onCheckedWatchlist($event: any, selectedValue: boolean) {
    window.scrollTo(0, 0);
    this.watchListValue = $event.target.value;
    this.watchTarget = selectedValue;
    this.watchYes.setValue(selectedValue === true);
    this.watchNo.setValue(selectedValue === false);
    console.log("watchTarget", this.watchTarget)
    this.cdr.detectChanges();
  }
  sendRemarksValue($event: any) {
    this.remarkValue = $event.target.value;
    this.cdr.detectChanges();
  }
  enableEdit(): void {
    this.isEditing = !this.isEditing;
    this.readOnly = !this.isEditing;
    this.firstNameEdit.nativeElement.focus();

  }
  enableEditLast(): void {
    // alert('Edit Last Name triggered');
    this.isEditingLast = !this.isEditingLast;
    this.readOnly = !this.isEditingLast;
    this.lastNameEdit.nativeElement.focus();
  }
  enableGenderEdit(): void {
    this.isEditingGender = !this.isEditingGender;
    this.readOnly = !this.isEditingGender;

    const currentGender = this.MaleChecked.value ? 'Male' : 'Female';
    this.newGender = currentGender === 'Male' ? 'Female' : 'Male';
    const confirmChange = window.confirm(`Do you want to update the gender to "${this.newGender}"?`);

    if (confirmChange) {
      // Create the request payload
      const formattedNewGender = this.newGender.toUpperCase();
      console.log("newGender11", formattedNewGender)
      const request = {
        kycType: "AGENT",
        submittedFor: this.submittedForId,
        kycInputs: {
          custInfoGender: formattedNewGender,
        },
      };
      // Make the API call to update the gender
      this.corporateService.agentUpdate(request).subscribe(
        (response: any) => {
          if (response?.responseCode === 200) {
            // Call the complete API to finalize changes
            this.corporateService.agentComplete(this.item?.submittedFor?.id).subscribe((data: any) => {
              if (data?.responseCode === 200) {
                alert(`Gender updated successfully to "${this.newGender}"`);

                // Update form controls to reflect the new gender
                if (this.newGender === 'Female') {
                  this.FemaleChecked.setValue(true);
                  this.MaleChecked.setValue(false);
                } else {
                  this.MaleChecked.setValue(true);
                  this.FemaleChecked.setValue(false);
                }
              } else {
                console.error('Gender completion failed', data);
                alert('Gender completion failed');
              }
            });
          } else {
            console.error('Gender update failed', response);
            alert('Gender update failed');
          }
        },
        (error) => {
          console.error('API error:', error);
          alert('An error occurred while updating the gender');
        }
      );
    }

    // Reset editing state
    this.isEditingGender = false;
    this.readOnly = true;
  }
  updateFirstName() {
    //alert(this.agentForm.get('firstName')?.value);
    if (this.agentForm.get('firstName')?.value.toLowerCase() !== this.firstNameOrginal.toLowerCase()) {
      const confirmChange = window.confirm(
        `Do you want to update the name to "${this.agentForm.get('firstName')?.value}"?`
      );

      if (confirmChange) {
        let request = {
          "kycType": "AGENT",
          "submittedFor": this.submittedForId,
          "kycInputs": {
            "custInfoFirstName": this.agentForm.get('firstName')?.value,
          }
        }
        this.corporateService.agentUpdate(request).subscribe(
          (response: any) => {
            if (response?.responseCode === 200) {
              this.corporateService.agentComplete(this.item?.submittedFor?.id).subscribe((data: any) => {
                if (data?.responseCode == 200) {
                  alert('First Name Updated Successfully');
                  this.firstNameOrginal = this.agentForm.get('firstName')?.value;
                }
              })
              // Notify success or update UI as needed
            } else {
              console.error('First Name Update failed', response);
              alert("First Name Update failed");

            }
          });

      } else {

      }

    }
    this.isEditing = false;
    this.readOnly = true;

  }
  // auth by checker -->
  AuthorizeEditedForm() {
    if (this.userStatus == 'PENDING') {
      this.idToSend = this.item?.id
    }
    console.log("this.idToSend", this.idToSend)
    let req = {
      "id": this.idToSend,
      "approvalRemark": this.remarkValue
    }
    this.KycService.AuthorizeEditedForm(req).subscribe((data: any) => {
      if (data?.responseCode == 200) {
        alert(data?.data)
      }
      else {
        alert(data?.error)
      }
    })
  }
  RejectEditedForm() {
    if (this.userStatus == 'PENDING') {
      this.idToSend = this.item?.id
    }
    let req = {
      "id": this.idToSend,
      "rejectReason": this.reason.value
    }
    console.log("RejectEditedForm req", req)
    // if(this.loginUser)
    this.KycService.RejectEditedForm(req).subscribe((data: any) => {
      if (data?.responseCode == 200) {
        alert(data?.data)
      }
      else {
        alert(data?.error)
      }
    })
  }
  updateLastName() {
    //alert(this.agentForm.get('firstName')?.value);
    if (this.agentForm.get('last')?.value.toLowerCase() !== this.lastNameOrginal.toLowerCase()) {
      const confirmChange = window.confirm(
        `Do you want to update the name to "${this.agentForm.get('last')?.value}"?`
      );

      if (confirmChange) {
        let request = {
          "kycType": "AGENT",
          "submittedFor": this.submittedForId,
          "kycInputs": {
            "custInfoLastName": this.agentForm.get('last')?.value,
          }
        }
        this.corporateService.agentUpdate(request).subscribe(
          (response: any) => {
            if (response?.responseCode === 200) {
              this.corporateService.agentComplete(this.item?.submittedFor?.id).subscribe((data: any) => {
                if (data?.responseCode == 200) {
                  alert('Last Name Updated Successfully');
                  this.lastNameOrginal = this.agentForm.get('last')?.value;
                }
              })
              // Notify success or update UI as needed
            } else {
              console.error('Last Name Update failed', response);
              alert("Last Name Update failed");

            }
          });

      } else {

      }

    }
    this.isEditingLast = false;
    this.readOnly = true;

  }
  onClickApprove1() {
    console.log("riskTarget22", this.riskTarget)
    console.log("watchTarget22", this.watchTarget)
    console.log("loginuser", this.loginUser)
    console.log("currentDate", this.currentDate)

    this.ComplianceVal = this.ComplianceInput.value;
    this.ComplianceDateVal = this.ComplianceDateInput.value;
    let req = {
      "kycId": this.kycId,
      "watchlistRemarks": this.remarkValue,
      "approvedByComplianceDate": this.currentDate,
      "approvedByComplianceFullName": this.loginUser,
      "riskCategory": this.riskTierValue,
      "checkedWatchlist": this.watchTarget,
    }
    this.isLoading = true;
    this.KycService.approveCustomerKyc1(req).subscribe((data: any) => {
      this.isLoading = false;
      if (data?.responseCode == 200) {
        // this.alertMessage = data?.data;
        // this.alertType = 'success';
        alert(data?.data);
        this.router.navigate(["kyc/agent"]);
      }
      else {
        // this.alertMessage = 'Something went wrong';
        // this.alertType = 'error';
        alert(data?.data);
      }

    })
  }
  onClickApprove1Only() {
    console.log("riskTarget22", this.riskTarget)
    console.log("watchTarget22", this.watchTarget)

    let req = {
      "kycId": this.kycId,
      "watchlistRemarks": this.remarkValue,
      "approvedByComplianceDate": this.currentDate,
      "approvedByComplianceFullName": this.loginUser,
      "riskCategory": this.riskTierValue,
      "checkedWatchlist": this.watchTarget,
    }
    this.isLoading = true;
    this.KycService.approveCustomerKyc1(req).subscribe((data: any) => {
      this.isLoading = false;
      if (data?.responseCode == 200) {
        // this.alertMessage = data?.data;
        // this.alertType = 'success';
        alert(data?.data);
        this.router.navigate(["kyc/agent"]);
      }
      else {
        // this.alertMessage = 'Something went wrong';
        // this.alertType = 'error';
        alert(data?.data);
      }

    })
  }
  onClickApprove2() {
    console.log("riskTarget22", this.riskTarget)
    console.log("watchTarget22", this.watchTarget)

    this.ComplianceVal = this.ComplianceInput.value;
    this.ComplianceDateVal = this.ComplianceDateInput.value;
    let req = {
      "kycId": this.kycId,
      // "watchlistRemarks": this.remarkValue,
      // "approvedByComplianceDate": this.currentDate,
      // "approvedByComplianceFullName": this.loginUser,
      // "riskCategory": this.riskTarget,
      // "checkedWatchlist": this.watchTarget,
    }
    this.isLoading = true;
    this.KycService.approveCustomerKyc2(req).subscribe((data: any) => {
      this.isLoading = false;
      if (data?.responseCode == 200) {
        // this.alertMessage = data?.data;
        // this.alertType = 'success';
        alert(data?.data);
        this.router.navigate(["kyc/agent"]);
      }
      else {
        // this.alertMessage = 'Something went wrong';
        // this.alertType = 'error';
        alert(data?.data);
      }

    })
  }
  onClickApprove2Only() {
    console.log("riskTarget22", this.riskTarget)
    console.log("watchTarget22", this.watchTarget)

    let req = {
      "kycId": this.kycId,
      // "watchlistRemarks": this.remarkValue,
      // "approvedByComplianceDate": this.currentDate,
      // "approvedByComplianceFullName": this.loginUser,
      // "riskCategory": this.riskTarget,
      // "checkedWatchlist": this.watchTarget,
    }
    this.KycService.approveCustomerKyc2(req).subscribe((data: any) => {
      this.isLoading = false;
      if (data?.responseCode == 200) {
        // this.alertMessage = data?.data;
        // this.alertType = 'success';
        alert(data?.data);
        this.router.navigate(["kyc/agent"]);
      }
      else {
        // this.alertMessage = 'Something went wrong';
        // this.alertType = 'error';
        alert(data?.data);
      }

    })
  }
  onClickApproveFinal() {
    console.log("riskTarget22", this.riskTarget)
    console.log("watchTarget22", this.watchTarget)
    console.log("loginuser", this.loginUser)
    console.log("currentDate", this.currentDate)
    // high,true high,false  medium,true medium,false low,true low,false
    this.kycVal = this.KycProcessedInput.value;
    this.kycProcessedDateVal = this.KycProcessedDateInput.value;
    this.VerifiedVal = this.VerifiedInput.value;
    this.VerifiedDateVal = this.VerifiedDateInput.value;
    this.ComplianceVal = this.ComplianceInput.value;
    this.ComplianceDateVal = this.ComplianceDateInput.value;
    console.log("ComplianceVal", this.ComplianceVal)
    console.log("ComplianceDateVal", this.ComplianceDateVal)

    let req = {
      "kycId": this.kycId,
      "watchlistRemarks": this.remarkValue,
      "approvedByComplianceDate": this.currentDate,
      "approvedByComplianceFullName": this.loginUser,
      "riskCategory": this.riskTierValue,
      "checkedWatchlist": this.watchTarget,
    }
    this.isLoading = true;
    this.KycService.approveCustomerKyc(req).subscribe((data: any) => {
      this.isLoading = false;
      if (data?.responseCode == 200) {
        // this.alertMessage = data?.data;
        // this.alertType = 'success';
        alert(data?.data);
        this.router.navigate(["kyc/customer"]);
      }
      else {
        // this.alertMessage = 'Something went wrong';
        // this.alertType = 'error';
        alert(data?.data);
      }

    })


  }
  onClickApproveFinalOnly() {
    console.log("riskTarget22", this.riskTarget)
    console.log("watchTarget22", this.watchTarget)
    console.log("loginuser", this.loginUser)
    console.log("currentDate", this.currentDate)

    let req = {
      "kycId": this.kycId,
      // "watchlistRemarks": this.remarkValue,
      // "approvedByComplianceDate": this.currentDate,
      // "approvedByComplianceFullName": this.loginUser,
      // "riskCategory": this.riskTarget,
      // "checkedWatchlist": this.watchTarget,
    }
    this.isLoading = true;
    this.KycService.approveCustomerKyc(req).subscribe((data: any) => {
      this.isLoading = false;
      if (data?.responseCode == 200) {
        alert(data?.data);
        this.router.navigate(["kyc/customer"]);
      }
      else {
        alert(data?.data);
      }

    })
  }
  onClickReject() {
    console.log("watchTarget22", this.watchTarget)
    console.log("riskTarget22", this.riskTarget)

    let req = {
      "kycId": this.kycId,
      "watchlistRemarks": this.remarkValue,
      "approvedByComplianceDate": this.currentDate,
      "approvedByComplianceFullName": this.loginUser,
      "riskCategory": this.riskTierValue,
      "checkedWatchlist": this.watchTarget,
      "rejectReason": this.reason.value
    }
    this.isLoading = true; // Set loading state to true when starting API call
    this.KycService.rejectCustomerKyc(req).subscribe((data: any) => {
      this.isLoading = false; // Set loading state to true when starting API call
      if (data?.responseCode == 200) {
        // this.alertMessage = 'Rejected';
        alert(data?.data);
        this.router.navigate(["kyc/customer"]);

      }
      else {
        // this.alertMessage = 'Something went wrong';
        // this.alertType = 'error';
        alert("Something went wrong");
      }
    })

  }
   onPhoneFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('Phone file selected:', file.name, 'Size:', file.size, 'Type:', file.type);
      // Validate file type
      const allowedExtensions = ['pdf', 'jpeg', 'jpg', 'png'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedExtensions.includes(fileExtension || '')) {
        alert('Invalid file format. Only PDF, JPEG, JPG, PNG are allowed.');
        event.target.value = '';
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        event.target.value = '';
        return;
      }

      this.phoneFileSelected = file;
      this.phoneFileName = file.name;
      console.log('Phone file stored successfully:', this.phoneFileSelected);
    }
  }

  onEmailFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('Email file selected:', file.name, 'Size:', file.size, 'Type:', file.type);
      // Validate file type
      const allowedExtensions = ['pdf', 'jpeg', 'jpg', 'png'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedExtensions.includes(fileExtension || '')) {
        alert('Invalid file format. Only PDF, JPEG, JPG, PNG are allowed.');
        event.target.value = '';
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        event.target.value = '';
        return;
      }

      this.emailFileSelected = file;
      this.emailFileName = file.name;
      console.log('Email file stored successfully:', this.emailFileSelected);
    }
  }

  updatePhoneEmail(meta : string){
    let value;
    let comments;
    let fileSelected;

    if(meta == 'PHONE') {
      value = this.regPhone1;
      comments = this.phoneEditComments;
      fileSelected = this.phoneFileSelected;
    } else {
      value = this.reg_Email;
      comments = this.emailEditComments;
      fileSelected = this.emailFileSelected;
    }

    // Validate comments and file
    if (!comments || !comments.trim()) {
      alert('Please enter comments for the ' + (meta === 'PHONE' ? 'phone' : 'email') + ' change.');
      return;
    }

    if (!fileSelected) {
      alert('Please attach a document (Sign/Agreement) for the ' + (meta === 'PHONE' ? 'phone' : 'email') + ' change.');
      return;
    }

    // Use submittedForId (user ID) instead of customerProfile which might be undefined
    let req = {
      userId: this.submittedForId,
      meta: meta, //PHONE or EMAIL
      value: value,
      makerComments: comments.trim()
    };

    console.log('Creating edit request with payload:', req);

    this.userService.editProfilePhoneEmail(req).subscribe((data: any) => {
      console.log('Edit request response:', data);
      console.log('Response data object:', data?.data);
      
      // Handle response
      if(data.responseCode == 200){
        // Try multiple ways to get the ID from response
        const requestId = data?.data ;
        console.log('Extracted requestId:', requestId);
        this.phoneEmailRequestId = requestId;
        
        // Upload file after successful request creation
        if (fileSelected && requestId) {
          console.log('Starting file upload with requestId:', requestId);
          this.userService.uploadPhoneEmailEditSignature(fileSelected, requestId).subscribe({
            next: (fileData: any) => {
              console.log('File upload successful:', fileData);
              alert("Edit request sent successfully with document attached.");
              // Reset form
              this.resetPhoneEmailForm(meta);
            },
            error: (error) => {
              console.error('Error uploading file:', error);
              alert("Request created but failed to upload document. Please try uploading again.");
              // Reset form
              this.resetPhoneEmailForm(meta);
            }
          });
        } else {
          console.log('File or requestId missing. File:', !!fileSelected, 'RequestId:', requestId);
          alert("Edit request sent successfully");
          this.resetPhoneEmailForm(meta);
        }
      }
      else if(data.responseCode == 0){
        alert("Failed" + data?.error);
      }
      console.log("Full response of update reg phone or email", data);
    }, (error) => {
      console.error('Error creating request:', error);
      alert("Failed to create edit request. Please try again.");
    });
  }

  resetPhoneEmailForm(meta: string): void {
    if (meta === 'PHONE') {
      this.showEditPhoneInput = false;
      this.phoneEditComments = '';
      this.phoneFileName = '';
      this.phoneFileSelected = null;
      this.regPhone1 = '';
      this.phoneTouched = false;
    } else {
      this.showEditEmailInput = false;
      this.emailEditComments = '';
      this.emailFileName = '';
      this.emailFileSelected = null;
      this.reg_Email = '';
      this.emailTouched = false;
    }
  }

  isFormValidApprove1(): boolean {
    //pending
    //  !!this.watchListValue &&
    return !!this.remarkValue
      && this.uploadedImageCompSign &&
      this.sdnChecked && this.riskChecked;
    //pending
  }
  isFormValidApprove2Only(): boolean {
    return this.uploadedImageCompHeadSign
  }
  isFormValidApprove(): boolean {

    console.log("remarkValue:", this.remark.value);
    console.log("ComplianceInput value:", this.ComplianceInput.value);
    if (this.compSign) {
      this.uploadedImageCompSign = true;
    }
    // && !!this.watchListValue
    return !!this.remarkValue
      && this.uploadedImageCompSign
      && this.sdnChecked && this.riskChecked;
    // && this.uploadedImageCEOSign
  }
  isFormValidApproveFinalOnly(): boolean {
    console.log("this.remarkValue22", this.remark.value)

    // console.log("riskValue:", this.riskValue);
    // console.log("watchListValue:", this.watchListValue);
    console.log("remarkValue23:", this.remark.value);
    console.log("ComplianceInput value:", this.ComplianceInput.value);
    // console.log("uploadedImageFileNameCompliance:", this.uploadedImageCompSignName);
    // console.log("sdnChecked:", this.sdnChecked);
    // console.log("riskChecked:", this.riskChecked);
    // return this.uploadedImageCEOSign
    if (this.approveStatus === 'IN_REVIEW') {
      // && !!this.watchListValue && this.remark.value
      return this.remarkValue
        && this.uploadedImageCompSign
        && this.sdnChecked && this.riskChecked;
    }
    return !!this.uploadedImageCEOSign;
    //pending
  }
  closeAlert() {
    this.alertMessage = null;
  }
  // goback() {
  //   this.router.navigateByUrl('/kyc/agent')
  // }
  goback() {
    this.router.navigateByUrl(this.previousRoute);
  }
}

// getAllKyc() {
//   //old
//   // this.isLoading = true;
//   // this.KycService.getAllKyc().subscribe((data: any) => {
//   //   this.isLoading = false;
//   //   this.users = data?.data;
//   //   this.allUsers = this.users
//   //old
//   let req = {
//     "filterType": null,
//     "filterValues": [
//       null
//     ],
//     "page": this.page,
//     "kycType": null
//   }
//   this.isLoading = true; // Set loading state to true when starting API call
//   // Set loading state to false when API call completes
//   this.KycService.getDataFilter(req).subscribe((data: any) => {
//     // this.data = data?.data
//     // this.allData = [...this.data]
//     this.users = data?.data
//     this.allUsers = this.users
//     console.log('Fetched products:', this.allUsers);
//     this.isLoading = false; // Set loading state to true when starting API call

//     //new
//     // for (let item of this.allUsers) {
//     // if (this.kycId == item?.id) {
//     this.userStatus = this.item?.status;
//     //new
//     this.approvedByComplianceValue = this.item?.agentKyc?.approvedByComplianceFullName
//     console.log("approvedByComplianceValue", this.approvedByComplianceValue)
//     this.approvedByComplianceDateValue = this.item?.agentKyc?.approvedByComplianceDate
//     console.log("approvedByComplianceDateValue", this.approvedByComplianceDateValue)
//     if (this.userStatus === 'IN_REVIEW') {
//       this.compForm.get('ComplianceInput')?.setValue(this.loginUser);
//       console.log("this.loginUser1", this.loginUser)
//       this.compForm.get('ComplianceDateInput')?.setValue(this.currentDate);
//     } else {
//       this.compForm.get('ComplianceInput')?.setValue(this.approvedByComplianceValue);
//       this.compForm.get('ComplianceDateInput')?.setValue(this.approvedByComplianceDateValue);
//     }

//     if (this.userStatus == "IN_REVIEW") {
//       this.showRejectApprove = true
//     }
//     this.seqNo = this.item?.seqNo;
//     this.submittedForId = this.item?.submittedFor?.id
//     if (this.item?.agentKyc?.attachments.length != 0) {
//       let i = 1;
//       for (let file of this.item.agentKyc.attachments) {
//         this.fileLists.push({
//           name: 'Attachment - ' + i,
//           url: this.imageUrl + '/kyc/static/' + file
//         })
//         i++;
//       }
//     }
//     //new
//     if (this.item?.agentKyc?.otherDocs) {
//       this.otherdocsorNot = this.item.agentKyc.otherDocs
//       const otherDocsArray = this.item.agentKyc.otherDocs.split(',');
//       let i = 1;
//       for (let file of otherDocsArray) {
//         this.fileLists.push({
//           name: 'Other Document - ' + i,
//           // url: `${this.imageUrl}/kyc/static/${file}`,
//           url: this.imageUrl + '/kyc/static/' + file

//         });
//         i++;
//       }
//     }
//     //new
//     this.watchlistRemarksVal = this.item?.agentKyc?.watchlistRemarks
//     console.log("watchlistRemarksVal", this.watchlistRemarksVal)

//     // }
//     // }
//     //saveproduct
//     // for (let item of this.allUsers) {
//     // if (this.kycId == item?.id) {
//     this.walletaccounts = this.item?.submittedFor?.walletAccount;
//     console.log(" this.walletaccounts", this.walletaccounts);
//     // }
//     // }
//     // for (let item of this.allUsers) {
//     // if (this.kycId == item?.id) {
//     this.agentId = this.item?.submittedFor?.id;
//     console.log(" this.agentId", this.walletaccounts);
//     // }
//     // }
//     //as mikyc
//     // for (let item of this.allUsers) {
//     // if (this.kycId == item?.id) {
//     this.agentid = this.item?.id;
//     this.activeFlag = this.item?.submittedFor?.active;
//     this.deletedFlag = this.item?.submittedFor?.deleted;
//     if (this.item?.status == 'IN_REVIEW' || 'APPROVED') {
//       this.readOnly = true;
//     }
//     else {
//       this.readOnly = false;
//     }
//     //gender
//     if (this.item.agentKyc.custInfoGender == "MALE") {
//       this.MaleChecked.setValue(true);
//     }
//     if (this.item.agentKyc.custInfoGender == "FEMALE") {
//       this.FemaleChecked.setValue(true);
//     }
//     //marital
//     if (this.item.agentKyc.custInfoMaritalStatus == "SINGLE") {
//       this.married.setValue(true);
//     }
//     if (this.item.agentKyc.custInfoMaritalStatus == "MARRIED") {
//       this.single.setValue(true);
//     }
//     //risk&watch
//     //risk
//     if (this.item?.agentKyc?.riskCategory == "LOW") {
//       this.riskLow.setValue(true);
//     }
//     if (this.item?.agentKyc?.riskCategory == "MEDIUM") {
//       this.riskMedium.setValue(true);
//     }
//     if (this.item?.agentKyc?.riskCategory == "HIGH") {
//       this.riskHigh.setValue(true);
//     }

//     console.log("checkedWatchlist", this.item?.agentKyc?.otherMnoFacility)
//     if (this.item?.agentKyc?.otherMnoFacility) {
//       this.EMIYes.setValue(true);
//       this.EMINo.setValue(false);
//       this.ShowEmi = true
//     }
//     else if (!this.item?.agentKyc?.otherMnoFacility && this.item?.agentKyc?.otherMnoFacility != null) {
//       this.EMIYes.setValue(false);
//       this.EMINo.setValue(true);
//       this.ShowEmi = false
//     }
//     else {
//       this.EMIYes.setValue(false);
//       this.EMINo.setValue(false);
//       this.ShowEmi = false
//     }
//     //watchlist
//     console.log("checkedWatchlist", this.item?.agentKyc?.checkedWatchlist)
//     if (this.item?.agentKyc?.checkedWatchlist) {
//       this.watchYes.setValue(true);
//       this.watchNo.setValue(false);
//     }
//     else if (!this.item?.agentKyc?.checkedWatchlist && this.item?.agentKyc?.checkedWatchlist != null) {
//       this.watchYes.setValue(false);
//       this.watchNo.setValue(true);
//     }
//     else {
//       this.watchYes.setValue(false);
//       this.watchNo.setValue(false);
//     }
//     //MM accType
//     if (this.item.agentKyc.mmAgent) {
//       this.MMagent.setValue(true);
//     }
//     if (this.item.agentKyc.mmUSSD) {
//       this.MMussd.setValue(true);
//     }
//     if (this.item.agentKyc.mmStaff) {
//       this.MMstaff.setValue(true);
//     }
//     if (this.item.agentKyc.mmMicro) {
//       this.MMmicro.setValue(true);
//     }
//     if (this.item.agentKyc.mmMerchant) {
//       this.MMmerchant.setValue(true);
//     }
//     //doc
//     if (this.item.agentKyc.validLicenseNo) {
//       this.licenseNoo.setValue(true);
//     }
//     if (this.item.agentKyc.validLicenseYes) {
//       this.licenseYes.setValue(true);
//     }
//     if (this.item.agentKyc.validPassportNo) {
//       this.passNo.setValue(true);
//     }
//     if (this.item.agentKyc.validPassportYes) {
//       this.passYes.setValue(true);
//     }
//     if (this.item.agentKyc.validSignatoryNo) {
//       this.signNo.setValue(true);
//     }
//     if (this.item.agentKyc.validSignatoryYes) {
//       this.signYes.setValue(true);
//     }
//     if (this.item.agentKyc.validAssociationNo) {
//       this.articleNo.setValue(true);
//     }
//     if (this.item.agentKyc.validAssociationYes) {
//       this.articleYes.setValue(true);
//     }
//     if (this.item.agentKyc.validBoardResNo) {
//       this.ResNo.setValue(true);
//     }
//     if (this.item.agentKyc.validBoardResYes) {
//       this.ResYes.setValue(true);
//     }
//     if (this.item.agentKyc.validPOANo) {
//       this.powerNo.setValue(true);
//     }
//     if (this.item.agentKyc.validPOAYes) {
//       this.powerYes.setValue(true);
//     }
//     //haveEMI
//     if (this.item.agentKyc.otherEMINo) {
//       this.EMINo.setValue(true);
//     }
//     if (this.item.agentKyc.otherEMIYes) {
//       this.EMIYes.setValue(true);
//     }
//     //old
//     this.kycSign = this.item?.agentKyc?.superSign_img_1;
//     this.opSign = this.item?.agentKyc?.opsSign_img_1;
//     this.photoId = this.item?.id;
//     //new
//     this.undertakenSign = this.item?.agentKyc?.agentSignaturePhoto;
//     this.agentImg = this.item?.agentKyc?.agentPhoto;
//     this.compSign = this.item?.agentKyc?.complianceSignaturePhoto;
//     this.compHedSign = this.item?.agentKyc?.complianceHeadSignaturePhoto;
//     this.ceoSign = this.item?.agentKyc?.ceoSignaturePhoto;
//     if (this.agentImg) {
//       // this.CustomerImg = item?.agentKyc?.custPhoto;
//       console.log("agentImg", this.agentImg)
//       this.fileLists.push({
//         name: 'Agent Profile Picture',
//         url: this.imageUrl + '/kyc/static/' + this.agentImg
//         // url: this.imageUrl + '/um/static/profile/' + this.agentImg
//       })
//     }
//     //new patchvalue
//     // this.setFieldValue('father', item?.agentKyc?.custInfoFatherName);
//     // this.setFieldValue('firstName', item?.agentKyc?.custInfoFirstName);
//     // this.setFieldValue('pos', item?.agentKyc?.custInfoPOS);
//     // this.setFieldValue('last', item?.agentKyc?.custInfoLastName);
//     // this.setFieldValue('tazkira', item?.agentKyc?.custInfoTazkira);
//     // this.setFieldValue('position', item?.agentKyc?.custInfoPositionHeld);
//     // this.setFieldValue('issue', item?.agentKyc?.custInfoDateOfIssue);
//     // this.setFieldValue('dob', item?.agentKyc?.custInfoDob);
//     // this.setFieldValue('countryBasic', item?.agentKyc?.custInfoCountry);
//     // this.setFieldValue('license', item?.agentKyc?.custInfoLicenseNo);
//     // this.setFieldValue('iccid', item?.agentKyc?.custInfoICCID);
//     // this.setFieldValue('expiry', item?.agentKyc?.custInfoDateOfExpiry);
//     // this.setFieldValue('source', item?.agentKyc?.custInfoSourceOfIncome);
//     // this.setFieldValue('ptid', item?.agentKyc?.custInfoPTID);
//     // this.setFieldValue('income', item?.agentKyc?.custInfoMonthlyIncome);
//     // this.setFieldValue('accOpenDate', item?.agentKyc?.custInfoAccOpenDate);
//     // this.setFieldValue('custInfoEmail', item?.agentKyc?.custInfoEmail);
//     // this.setFieldValue('purpose', item?.agentKyc?.custInfoPurposeOfAcc);

//     // this.setFieldValue('houseNO', item?.agentKyc?.currHouseNo);
//     // this.setFieldValue('loc', item?.agentKyc?.currLocation);
//     // this.setFieldValue('province', item?.agentKyc?.currProvince);
//     // this.setFieldValue('street', item?.agentKyc?.currStreet);
//     // this.setFieldValue('district', item?.agentKyc?.currDistrict);
//     // this.setFieldValue('country', item?.agentKyc?.currCountry);

//     // this.setFieldValue('perHouseNO', item?.agentKyc?.permHouseNo);
//     // this.setFieldValue('perLoc', item?.agentKyc?.permLocation);
//     // this.setFieldValue('perProvince', item?.agentKyc?.permProvince);
//     // this.setFieldValue('perStreet', item?.agentKyc?.permStreet);
//     // this.setFieldValue('perDistrict', item?.agentKyc?.permDistrict);
//     // this.setFieldValue('perCountry', item?.agentKyc?.permCountry);

//     // this.setFieldValue('shopSource', item?.agentKyc?.orgSourceOfIncome);
//     // this.setFieldValue('shopName', item?.agentKyc?.orgName);
//     // this.setFieldValue('shopPosition', item?.agentKyc?.orgPositionHeld);
//     // this.setFieldValue('shopAddress', item?.agentKyc?.orgAddress);
//     // this.setFieldValue('shopIncome', item?.agentKyc?.orgMonthlyIncome);
//     // this.setFieldValue('Nature', item?.agentKyc?.orgTypeOfActivity);
//     // this.setFieldValue('shopTurnover', item?.agentKyc?.orgTurnover);
//     // this.setFieldValue('shopTin', item?.agentKyc?.orgTinNumber);

//     // this.setFieldValue('orgHouseNo', item?.agentKyc?.orgHouseNo);
//     // this.setFieldValue('orgLocation', item?.agentKyc?.orgLocation);
//     // this.setFieldValue('orgProvince', item?.agentKyc?.orgProvince);
//     // this.setFieldValue('orgStreet', item?.agentKyc?.orgStreet);
//     // this.setFieldValue('orgDistrict', item?.agentKyc?.orgDistrict);
//     // this.setFieldValue('orgCountry', item?.agentKyc?.orgCountry);
//     // this.setFieldValue('orgEmail', item?.agentKyc?.orgEmail);
//     // this.setFieldValue('orgPhone', item?.agentKyc?.orgPhone);

//     // this.setFieldValue('EMIname', item?.agentKyc?.otherEMIName);
//     // this.setFieldValue('EMIAccName', item?.agentKyc?.otherEMIAccName);
//     // this.setFieldValue('EMIAccNo', item?.agentKyc?.otherEMIAccNo);

//     // this.setFieldValue('kinName', item?.agentKyc?.nokName);
//     // this.setFieldValue('kinMobile', item?.agentKyc?.nokMobile);
//     // this.setFieldValue('kinFather', item?.agentKyc?.nokFatherName);
//     // this.setFieldValue('kinRelation', item?.agentKyc?.nokRelationship);
//     // this.setFieldValue('kinEmail', item?.agentKyc?.nokEmail);
//     // this.setFieldValue('kinHouse', item?.agentKyc?.nokHouseNo);
//     // this.setFieldValue('kinLoc', item?.agentKyc?.nokLocation);
//     // this.setFieldValue('kinProvince', item?.agentKyc?.nokProvince);
//     // this.setFieldValue('kinStreet', item?.agentKyc?.nokStreet);
//     // this.setFieldValue('kinDistrict', item?.agentKyc?.nokDistrict);
//     // this.setFieldValue('kinCountry', item?.agentKyc?.nokCountry);

//     // this.customerName = this.first + ' ' + this.last;
//     // this.customerDate = item?.agentKyc?.undertakenDate;

//     // this.setFieldValue('ICCIDverify', item?.agentKyc?.superICCID);
//     // this.setFieldValue('cmpnyVerify', item?.agentKyc?.superCompanyName);
//     // this.setFieldValue('PTIDverify', item?.agentKyc?.superPTID);
//     // this.setFieldValue('locationVerify', item?.agentKyc?.superLocation);
//     // this.setFieldValue('POSverify', item?.agentKyc?.superPOS);
//     // this.setFieldValue('kyc', item?.agentKyc?.kycProcessedBy);
//     // this.setFieldValue('kycDate', item?.agentKyc?.kycProcessedDate);
//     // this.setFieldValue('opVerify', item?.agentKyc?.superAgentVerification);
//     // this.setFieldValue('opVerifyDate', item?.agentKyc?.superAgentVerificationDate);

//     // this.setFieldValue('opVerify', item?.agentKyc?.verifiedByOps);
//     // this.setFieldValue('opVerifyDate', item?.agentKyc?.verifiedByOpsDate);
//     // this.setFieldValue('compVerify', item?.agentKyc?.approvedByCompliance);
//     // this.setFieldValue('compVerifyDate', item?.agentKyc?.approvedByComplianceDate);

//     //old patchvalue
//     this.agentForm.patchValue({ firstName: this.item?.agentKyc?.custInfoFirstName || 'NIL' })
//     this.agentForm.patchValue({ last: this.item?.agentKyc?.custInfoLastName || 'NIL' })
//     this.agentForm.patchValue({ father: this.item?.agentKyc?.custInfoFatherName || 'NIL' })
//     this.agentForm.patchValue({ walletNO: this.item?.agentKyc?.custInfoMMWallet || 'NIL' })
//     this.agentForm.patchValue({ idType: this.item?.agentKyc?.custProofType || 'NIL' })
//     // this.agentForm.patchValue({
//     //   idType: this.formatProofType(item?.agentKyc?.custProofType || 'NIL')
//     // });
//     this.agentForm.patchValue({ idNO: this.item?.agentKyc?.custProofNumber || 'NIL' })
//     this.agentForm.patchValue({ issue: this.item?.agentKyc?.custProofDateOfIssue || 'NIL' })
//     this.agentForm.patchValue({ expiry: this.item?.agentKyc?.custProofDateOfExpiry || 'NIL' })
//     this.agentForm.patchValue({ pageNo: this.item?.agentKyc?.tazkiraPageNo || 'NIL' })
//     this.agentForm.patchValue({ bookNo: this.item?.agentKyc?.tazkiraBookNo || 'NIL' })
//     this.agentForm.patchValue({ regNo: this.item?.agentKyc?.tazkiraRegNo || 'NIL' })
//     this.agentForm.patchValue({ dob: this.item?.agentKyc?.custInfoDob })
//     this.dobValue = this.item?.agentKyc?.custInfoDob
//     this.agentForm.patchValue({ birthPlace: this.item?.agentKyc?.custInfoLicenseNo })
//     this.agentForm.patchValue({ basicCountry: this.item?.agentKyc?.custInfoBirthCountry })
//     this.agentForm.patchValue({ basicProvince: this.item?.agentKyc?.custInfoBirthProvince || 'NIL' })
//     this.agentForm.patchValue({ nationality: this.item?.agentKyc?.custInfoNationality || 'NIL' })
//     this.agentForm.patchValue({ basicPhone: this.item?.agentKyc?.custInfoPhoneNumber || 'NIL' })
//     this.agentForm.patchValue({ email: this.item?.agentKyc?.custInfoEmail || 'NIL' })
//     this.agentForm.patchValue({ accOpenDate: this.item?.agentKyc?.custInfoAccOpenDate || 'NIL' })
//     this.agentForm.patchValue({ PTID: this.item?.agentKyc?.custInfoPTID || 'NIL' })
//     this.agentForm.patchValue({ purpose: this.item?.agentKyc?.custInfoPurposeOfAcc || 'NIL' })

//     this.first = this.item?.agentKyc?.custInfoFirstName;
//     this.last = this.item?.agentKyc?.custInfoLastName;
//     // this.last = item?.agentKyc?.custInfoSurname;
//     // this.posNo = item?.agentInfo?.posNo;
//     // this.positionHeld = item?.agentInfo?.positionHeld;
//     // this.tazkira = item?.agentKyc?.custInfoTazkira;
//     // this.dob = item?.agentKyc?.custInfoDob;
//     // this.dateOfIssue = item?.agentInfo?.dateOfIssue;
//     // this.licenseNo = item?.agentInfo?.licenseNo;
//     // this.country = item?.agentInfo?.country;
//     // this.dateOfExpiry = item?.agentInfo?.dateOfExpiry;
//     // this.iccidNo = item?.agentInfo?.iccidNo;
//     // this.ptidNo = item?.agentInfo?.ptidNo;
//     // this.sourceOfIncome = item?.agentInfo?.sourceOfIncome;
//     // this.monthlyIncome = item?.agentInfo?.monthlyIncome;
//     // this.gender = item?.agentKyc?.gender;
//     // this.marital = item?.agentInfo?.maritalStatus;
//     // this.email = item?.agentKyc?.custInfoEmail;
//     // this.mmAccType = item?.agentInfo?.mmAccType;
//     // this.purposeOfAcc = item?.agentInfo?.purposeOfAcc;
//     this.agentForm.patchValue({ houseNO: this.item?.agentKyc?.currHouseNo || 'NIL' })
//     this.agentForm.patchValue({ loc: this.item?.agentKyc?.currLocation || 'NIL' })
//     this.agentForm.patchValue({ province: this.item?.agentKyc?.currProvince || 'NIL' })
//     this.agentForm.patchValue({ street: this.item?.agentKyc?.currStreet || 'NIL' })
//     this.agentForm.patchValue({ district: this.item?.agentKyc?.currDistrict || 'NIL' })
//     this.agentForm.patchValue({ country: this.item?.agentKyc?.currCountry || 'NIL' })
//     // this.houseNo = item?.agentKyc?.currHouseNo;
//     // this.location = item?.agentKyc?.currLocation;
//     // this.province = item?.agentKyc?.currProvince;
//     // this.street = item?.agentKyc?.currStreet;
//     // this.district = item?.agentKyc?.currDistrict;
//     // this.countryAddress = item?.agentKyc?.currCountry;
//     this.agentForm.patchValue({ perHouseNO: this.item?.agentKyc?.permHouseNo || 'NIL' })
//     this.agentForm.patchValue({ perLoc: this.item?.agentKyc?.permLocation || 'NIL' })
//     this.agentForm.patchValue({ perProvince: this.item?.agentKyc?.permProvince || 'NIL' })
//     this.agentForm.patchValue({ perStreet: this.item?.agentKyc?.permStreet || 'NIL' })
//     this.agentForm.patchValue({ perDistrict: this.item?.agentKyc?.permDistrict || 'NIL' })
//     this.agentForm.patchValue({ perCountry: this.item?.agentKyc?.permCountry || 'NIL' })
//     // this.permanentHouseNo = item?.permanentAddress?.houseNo;
//     // this.permanentLocation = item?.permanentAddress?.location;
//     // this.permanentProvince = item?.permanentAddress?.province;
//     // this.permanentStreet = item?.permanentAddress?.street;
//     // this.permanentDistrict = item?.permanentAddress?.district;
//     // this.permanentCountry = item?.permanentAddress?.country;

//     this.agentForm.patchValue({ shopSource: this.item?.agentKyc?.orgSourceOfIncome || 'NIL' })
//     this.agentForm.patchValue({ shopName: this.item?.agentKyc?.orgName || 'NIL' })
//     this.agentForm.patchValue({ shopPosition: this.item?.agentKyc?.orgPositionHeld || 'NIL' })
//     this.agentForm.patchValue({ shopAddress: this.item?.agentKyc?.orgAddress || 'NIL' })
//     // this.agentForm.patchValue({ shopIncome: item?.agentKyc?.orgMonthlyIncome || 'NIL' })
//     this.agentForm.patchValue({
//       shopIncome: this.item?.agentKyc?.orgMonthlyIncome
//         ? `AFN ${this.formatNumber(this.item.agentKyc.orgMonthlyIncome)}`
//         : 'NIL'
//     });
//     this.agentForm.patchValue({ Nature: this.item?.agentKyc?.orgBizNature || 'NIL' })
//     // this.agentForm.patchValue({ shopTurnover: item?.agentKyc?.orgTurnover || 'NIL' })
//     this.agentForm.patchValue({
//       shopTurnover: this.item?.agentKyc?.orgTurnover
//         ? `AFN ${this.formatNumber(this.item.agentKyc.orgTurnover)}`
//         : 'NIL'
//     });
//     this.agentForm.patchValue({ shopTin: this.item?.agentKyc?.orgTinNumber || 'NIL' })

//     this.agentForm.patchValue({ orgHouseNo: this.item?.agentKyc?.orgHouseNo || 'NIL' })
//     this.agentForm.patchValue({ orgLocation: this.item?.agentKyc?.orgLocation || 'NIL' })
//     this.agentForm.patchValue({ orgProvince: this.item?.agentKyc?.orgProvince || 'NIL' })
//     this.agentForm.patchValue({ orgStreet: this.item?.agentKyc?.orgStreet || 'NIL' })
//     this.agentForm.patchValue({ orgDistrict: this.item?.agentKyc?.orgDistrict || 'NIL' })
//     this.agentForm.patchValue({ orgCountry: this.item?.agentKyc?.orgCountry || 'NIL' })
//     this.agentForm.patchValue({ orgEmail: this.item?.agentKyc?.orgEmail || 'NIL' })
//     this.agentForm.patchValue({ orgPhone: this.item?.agentKyc?.orgPhone || 'NIL' })

//     // this.shopName = item?.agentShopDetails?.shopName;
//     // this.address = item?.agentShopDetails?.address;
//     // this.activityType = item?.agentShopDetails?.typeOfActivity;
//     // this.shopIncomeSource = item?.agentShopDetails?.sourceOfIncome;
//     // this.shopPosition = item?.agentShopDetails?.positionHeld;
//     // this.shopIncome = item?.agentShopDetails?.monthlyIncome;
//     // this.turnover = item?.agentShopDetails?.monthlyTurnover;
//     // this.tinNumber = item?.agentShopDetails?.tinNumber;
//     this.agentForm.patchValue({ EMIname: this.item?.agentKyc?.otherMnoName || 'NIL' })
//     this.agentForm.patchValue({ EMIAccName: this.item?.agentKyc?.otherMnoAccName || 'NIL' })
//     this.agentForm.patchValue({ EMIAccNo: this.item?.agentKyc?.otherMnoAccNo || 'NIL' })

//     // this.haveOtherAccounts = item?.otherEMIAccount?.haveOtherAccounts;
//     // this.EMIname = item?.otherEMIAccount?.EMIName;
//     // this.accountName = item?.otherEMIAccount?.accName;
//     // this.accountNo = item?.otherEMIAccount?.accNo;

//     this.agentForm.patchValue({ kinName: this.item?.agentKyc?.nokName || 'NIL' })
//     this.agentForm.patchValue({ kinMobile: this.item?.agentKyc?.nokPhone || 'NIL' })
//     this.agentForm.patchValue({ kinFather: this.item?.agentKyc?.nokFatherName || 'NIL' })
//     this.agentForm.patchValue({ kinRelation: this.item?.agentKyc?.nokRelationship || 'NIL' })
//     this.agentForm.patchValue({ kinAddress: this.item?.agentKyc?.nokLocation || 'NIL' })

//     // this.nextOfKinName = item?.agentKyc?.nextOfKinName;
//     // this.nextOfKinFatherName = item?.agentKyc?.nextOfKinFatherName;
//     // this.relationship = item?.agentKyc?.relationship;
//     // this.mobileNo = item?.agentKyc?.mobileNo;
//     // this.kinEmail = item?.agentKyc?.nokEmail;
//     // this.kinHouse = item?.agentKyc?.nokHouseNo;
//     // this.kinLocation = item?.agentKyc?.nokLocation;
//     // this.kinProvince = item?.agentKyc?.nokProvince;
//     // this.kinStreet = item?.agentKyc?.nokStreet;
//     // this.kinDistrict = item?.agentKyc?.nokDistrict;
//     // this.kinCountry = item?.agentKyc?.nokCountry;
//     //completed acc to new API agentKyc

//     this.customerName = this.first + ' ' + this.last;
//     this.customerDate = this.item?.agentKyc?.undertakenDate;

//     // this.validLic = item?.documentsObtained?.validLicense;
//     // this.validDir = item?.documentsObtained?.validPassportOrIdOfDirectors;
//     // this.validSig =
//     //   item?.documentsObtained?.validPassportOrIdOfSignatories;
//     // this.article = item?.documentsObtained?.validArticleOfAssociation;
//     // this.resolution = item?.documentsObtained?.validBoardResolution;
//     // this.attorney = item?.documentsObtained?.validPowerOfAttorney;

//     this.undertakenCust = this.item?.undertaken?.name;
//     this.undertakenCustDate = this.item?.undertaken?.date;

//     this.agentForm.patchValue({ ICCIDverify: this.item?.agentKyc?.superICCID || 'NIL' })
//     this.agentForm.patchValue({ cmpnyVerify: this.item?.agentKyc?.superCompanyName || 'NIL' })
//     this.agentForm.patchValue({ PTIDverify: this.item?.agentKyc?.superPTID || 'NIL' })
//     this.agentForm.patchValue({ locationVerify: this.item?.agentKyc?.superLocation || 'NIL' })
//     this.agentForm.patchValue({ POSverify: this.item?.agentKyc?.superPOS || 'NIL' })
//     this.agentForm.patchValue({ kyc: this.item?.agentKyc?.kycProcessedBy || 'NIL' })
//     this.agentForm.patchValue({ kycDate: this.item?.agentKyc?.kycProcessedDate || 'NIL' })
//     this.agentForm.patchValue({ opVerify: this.item?.agentKyc?.superAgentVerification || 'NIL' })
//     this.agentForm.patchValue({ opVerifyDate: this.item?.agentKyc?.superAgentVerificationDate || 'NIL' })

//     // this.ICCIDverify = item?.superAgentVerification?.iccidNo;
//     // this.cmpnyVerify = item?.superAgentVerification?.companyName;
//     // this.PTIDverify = item?.superAgentVerification?.ptidNo;
//     // this.locationVerify = item?.superAgentVerification?.location;
//     // this.POSverify = item?.superAgentVerification?.posNo;
//     // this.KycVerify = item?.superAgentVerification?.kycProcessedBy;
//     // this.processingDateverify =
//     //   item?.superAgentVerification?.processingDate;
//     this.agentForm.patchValue({ opVerify: this.item?.agentKyc?.verifiedByOps || 'NIL' })
//     this.agentForm.patchValue({ opVerifyDate: this.item?.agentKyc?.verifiedByOpsDate || 'NIL' })
//     this.agentForm.patchValue({ compVerify: this.item?.agentKyc?.approvedByCompliance || 'NIL' })
//     this.agentForm.patchValue({ compVerifyDate: this.item?.agentKyc?.approvedByComplianceDate || 'NIL' })
//     if (this.readOnly) {
//       this.FemaleChecked.disable();
//       this.MaleChecked.disable();
//       this.married.disable();
//       this.single.disable();
//     }
//     // this.Verified = item?.abmmcVerification?.verifiedByOperation;
//     // this.VerifiedDate = item?.abmmcVerification?.verifyDate;
//     // this.ComplianceAgent = item?.abmmcVerification?.approvedByCompliance;
//     // this.ComplianceDate = item?.abmmcVerification?.approvedDate;
//     //old patchvalue

//     // }
//     // }
//     //end
//   });
// }