import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFooterTemplateDirective } from '@ng-select/ng-select';
import { KycModuleService } from '../kyc-module.service';
import { UserManagementService } from '../../../user-management/user-management/user-management/openapi';
import saveAs from 'file-saver';
import { environment } from '../../../../environments/environment';
import { CorporateService } from '../../../corporate/corporate.service';
import { SharedFunctionsService } from '../../../shared-functions.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { combineLatest, filter, finalize, map, Observable, of, switchMap, take } from 'rxjs';
import { PermissionService } from '../../../permission.service';
interface fileList {
  name: string,
  url: any,
  upload: any
}
interface NewImageFile {
  name: string;
  url: any;
}
interface Shareholder {
  id: number;
  firstName: string;
  lastName: string;
  fatherName: string;
  idProofType: string;
  dob: any;
  placeOfBirth: any;
  nationality: any;
  shareholdingPercentage: any;
  sourceOfIncome: any;
  phone: any
  tinNumber: any
  currLocation: any;
  currDistrict: any;
  currProvince: any;
  currCountry: any;
  permLocation: any;
  permDistrict: any;
  permProvince: any;
  permCountry: any;
  idProofFrontPhoto: any;
  idProofBackPhoto: any
  // Add other fields as necessary  
}
interface signatories {
  id: number;
  firstName: string;
  lastName: string;
  fatherName: string;
  idProofType: string;
  idProofNumber: any;
  dob: any;
  placeOfBirth: any;
  nationality: any;
  monthlyIncome: any;
  shareholdingPercentage: any;
  sourceOfIncome: any;
  relationship: any;
  phone: any
  tinNumber: any
  idProofFrontPhoto: any;
  idProofBackPhoto: any
  // Add other fields as necessary
}
@Component({
  selector: 'app-view-masteragent-kyc',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, ReactiveFormsModule, FormsModule, CommonModule, MatIconModule],
  templateUrl: './view-masteragent-kyc.component.html',
  styleUrl: './view-masteragent-kyc.component.css'
})
export class ViewMasteragentKycComponent {
  @ViewChildren('sharefirstName') shareFirstNames!: QueryList<ElementRef>;
  @ViewChildren('sharelastName') shareLastNames!: QueryList<ElementRef>;
  @ViewChildren('sharefatherName') shareFatherNames!: QueryList<ElementRef>;
  @ViewChildren('sharedob') shareDobs!: QueryList<ElementRef>;
  @ViewChildren('sharetazkira') shareTazkiras!: QueryList<ElementRef>;
  @ViewChildren('sharebirthPlace') shareBirthPlaces!: QueryList<ElementRef>;
  @ViewChildren('sharerelation') shareRelations!: QueryList<ElementRef>;
  @ViewChildren('shareNationality') shareNationalities!: QueryList<ElementRef>;
  @ViewChildren('sharePerc') sharePercs!: QueryList<ElementRef>;
  @ViewChildren('sharePh') sharePhones!: QueryList<ElementRef>;
  @ViewChildren('shareIncome') shareIncomes!: QueryList<ElementRef>;
  @ViewChildren('shareTin') shareTins!: QueryList<ElementRef>;
  @ViewChildren('shareOtherSrc') shareOtherSrcs!: QueryList<ElementRef>;
  @ViewChildren('sharePerLoc') sharePerLoc!: QueryList<ElementRef>;
  @ViewChildren('shareCurrLoc') shareCurrLoc!: QueryList<ElementRef>;

  @ViewChildren('shareCurrPro') shareCurrPro!: QueryList<ElementRef>;
  @ViewChildren('sharePerPro') sharePerPro!: QueryList<ElementRef>;
  @ViewChildren('shareCurrDis') shareCurrDis!: QueryList<ElementRef>;
  @ViewChildren('sharePerDis') sharePerDis!: QueryList<ElementRef>;
  @ViewChildren('shareCurrCoun') shareCurrCoun!: QueryList<ElementRef>;
  @ViewChildren('shareperCoun') shareperCoun!: QueryList<ElementRef>;

  // @ViewChild('sharefirstName') sharefirstName!: ElementRef;
  @ViewChildren('firstNameAuth') signFirstNames!: QueryList<ElementRef>;
  @ViewChildren('lastNameAuth') signLastNames!: QueryList<ElementRef>;
  @ViewChildren('tazkiraAuth') signTazkiras!: QueryList<ElementRef>;
  @ViewChildren('dobAuth') signDobs!: QueryList<ElementRef>;
  @ViewChildren('designationAuth') signDesignations!: QueryList<ElementRef>;
  @ViewChildren('birthPlaceAuth') signBirthPlaces!: QueryList<ElementRef>;
  @ViewChildren('resiAuth') signResis!: QueryList<ElementRef>;
  @ViewChildren('phAuth') signPhones!: QueryList<ElementRef>;
  @ViewChildren('incomeAuth') signIncomes!: QueryList<ElementRef>;
  @ViewChildren('typeAuth') signTypes!: QueryList<ElementRef>;
  @ViewChildren('emailAuth') signEmail!: QueryList<ElementRef>;
  @ViewChildren('NationalityAuth') signNationality!: QueryList<ElementRef>;
  @ViewChildren('srcAuth') signSrcFund!: QueryList<ElementRef>;

  compForm: FormGroup = new FormGroup({});
  regForm: FormGroup = new FormGroup({});
  modifiedForm: FormGroup = new FormGroup({});
  regInput: FormControl = new FormControl();
  regDateInput: FormControl = new FormControl();
  remarkForm: FormGroup = new FormGroup({});
  remark: FormControl = new FormControl('', Validators.required);
  ComplianceInput: FormControl = new FormControl();
  ComplianceDateInput: FormControl = new FormControl();
  presidentVicepresidentSignImg: any;
  reason = new FormControl('', Validators.required);
  MaleChecked = new FormControl();
  FemaleChecked = new FormControl();
  // remark = new FormControl();

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

  mnoNo = new FormControl();
  mnoYes = new FormControl();

  KycProcessedInput = new FormControl();
  KycProcessedDateInput = new FormControl();
  VerifiedInput = new FormControl();
  VerifiedDateInput = new FormControl();
  // ComplianceInput = new FormControl();
  // ComplianceDateInput = new FormControl();
  complianceValue: string = '';
  superAgentForm: FormGroup = new FormGroup({});
  refundForm: FormGroup = new FormGroup({});

  approveStatus: any;
  showApprove1Btn: boolean = false;
  showApprove2Btn: boolean = false;
  showApproveFinalBtn: boolean = false;
  fileLists: fileList[] = [];
  newImageFileLists: NewImageFile[] = [];
  users: any[] = [];
  id!: string | null;
  companyName: any;
  pos: any;
  location: any;
  accOpenDate: any;
  ptidNo: any;
  iccidNo: any;
  licenseNumber: any;
  fatherName: any;
  tinNo: any;
  dateOfIssue: any;
  dateOfExpiry: any;
  houseNo: any;
  street: any;
  district: any;
  province: any;
  country: any;
  contactNo: any;
  officePhoneNo: any;
  email: any;
  inward: any;
  outward: any;
  natureOfBusiness: any;
  sourceOfFund: any;
  monthlyTurnover: any;
  fatherNamePresident: any;
  positionHeld: any;
  emailPresident: any;
  tazkiraPresident: any;
  dobPres: any;
  countryPres: any;
  issuePres: any;
  expiryPres: any;
  sourcePres: any;
  nationPres: any;
  incomePres: any;
  mobPres: any;
  houseNoPres: any;
  locationPres: any;
  provincePres: any;
  streetPres: any;
  districtPres: any;
  countryAddressPres: any;
  permanentHouseNoPres: any;
  permanentLocationPres: any;
  permanentProvincePres: any;
  permanentStreetPres: any;
  permanentDistrictPres: any;
  permanentCountryPres: any;
  permanentCountryVice: any;
  permanentDistrictVice: any;
  permanentStreetVice: any;
  permanentProvinceVice: any;
  permanentLocationVice: any;
  permanentHouseNoVice: any;
  countryAddressVice: any;
  districtVice: any;
  streetVice: any;
  provinceVice: any;
  locationVice: any;
  houseNoVice: any;
  mobVice: any;
  incomeVice: any;
  nationVice: any;
  sourceVice: any;
  expiryVice: any;
  issueVice: any;
  countryVice: any;
  dobVice: any;
  tazkiraVice: any;
  emailVice: any;
  positionHeldVice: any;
  fatherNameVice: any;
  lastNameVice: any;
  firstNameVice: any;
  haveOtherAccounts: any;
  MNOname: any;
  accountName: any;
  accountNo: any;
  Date: any;
  PresidentName: any;
  VPresidentName: any;
  VDate: any;
  risk: any;
  watchlistMOI: any;
  watchlistUnOFAC: any;
  watchlistFinTRACA: any;
  validLic: any;
  validDir: any;
  validSig: any;
  article: any;
  resolution: any;
  attorney: any;
  LicenseAuth: any;
  image: any;
  imageUrl = environment.apiUrl;
  uploadedImage1: any;
  uploadedImageFileName: any;
  uploadedImageFileType1: any;
  uploadedImageFileNameExtension: any;
  uploadedImageFileData!: string | ArrayBuffer | null;
  uploadedImage2: any;
  uploadedImageFileType2: any;
  presidentValue: any;
  presdateValue: any;
  v_presidentValue: any;
  v_presdateValue: any;
  riskValue: any;
  watchlistValue: any;
  applicantValue: any;
  dateValue: any;
  type1: any;
  photoId: any;
  type2: any;
  sign: any;
  presSign: any;
  viceSign: any;
  uploadedImageKYC: any;
  uploadedImageVerified: any;
  uploadedImageCompliance: any;
  uploadedImage3: any;
  uploadedImage4: any;
  KycProcessedValue: any;
  KycProcessedDateValue: any;
  VerifiedValue: any;
  VerifiedDateValue: any;
  ComplianceDateValue: any;
  role!: string | null;
  showRejectApprove: boolean = false;
  showApproveOrReject: boolean = false;
  riskReq!: string;
  watchListReq: boolean = false;
  VerifiedSuper: any;
  kycProcessed: any;
  kycProcessedDate: any;
  VerifiedSuperDate: any;
  ComplianceAgent: any;
  priv1: any;
  showAbmmcVerify: boolean = false;
  ops_sign: any;
  com_sign: any;
  super_sign: any;
  currentDate: string;
  showOpsVerify!: boolean;
  showComVerify!: boolean;
  fullName!: string;
  uploadedImageUndertaken: any;
  typeUndertaken!: string;
  userName!: string | null;
  uploadedImagePres: any;
  uploadedImageFileTypePres: any;
  uploadedImageVice: any;
  uploadedImageFileTypeVice: any;
  type3!: string;
  purposeOfAcc: any;
  tinNumber: any;
  tinNumberPres: any;
  tinNumberVice: any;
  remarksValue: any;
  emailAuth: any;
  tazkiraAuth: any;
  dobAuth: any;
  countryAuth: any;
  issueAuth: any;
  expiryAuth: any;
  sourceAuth: any;
  incomeAuth: any;
  mobAuth: any;
  tinNumberAuth: any;
  nationAuth: any;
  kycId: any;
  allUsers: any[] = [];
  walletaccounts: any;
  agentId: any;
  undertakenSign: any;
  kycSign: any;
  opSign: any;
  compSign: any;
  agentImg: any;
  first: any;
  father: any;
  customerName: any;
  last: any;
  customerDate: any;
  undertakenCust: any;
  undertakenCustDate: any;
  addKyc: any;
  alertMessage: any;
  alertType!: string;
  products: any;
  productId: any;
  masterProduct: any;
  watchListValue: any;
  remarkValue: any;
  superImg: any;
  showUpdate: boolean = false;
  uploadedImageFileDataOp: any;
  uploadedImageFileNameExtensionOp: any;
  uploadedImageFileTypeOp: any;
  uploadedImageFileNameOp: any;
  uploadedImageOp: any;
  superId: any;
  uploadedImageFileNameKYC: any;
  uploadedImageFileTypeKYC: any;
  uploadedImageFileNameExtensionKYC: any;
  uploadedImageFileDataKYC: any;
  uploadedImageFileNameCompliance: any;
  uploadedImageFileTypeCompliance: any;
  uploadedImageFileNameExtensionCompliance: any;
  uploadedImageFileDataCompliance: any;
  uploadedImagePhoto: any;
  uploadedImageFileNamePhoto: any;
  uploadedImageFileTypePhoto: any;
  uploadedImageFileNameExtensionPhoto: any;
  uploadedImageFileDataPhoto: any;
  VerifiedOp: any;
  VerifiedOpDate: any;
  compliance: any;
  complianceDate: any;
  kycVal: any;
  kycProcessedDateVal: any;
  VerifiedVal: any;
  VerifiedDateVal: any;
  ComplianceVal: any;
  ComplianceDateVal: any;
  userPrivileges: any;
  kycPrivelege: any;
  isLoading: boolean = false;
  sdnDetails: any;
  showModal: boolean = false;
  userStatus: any;
  firstNameValue: any;
  superAgent: any;
  superAgentId: any;
  activeFlag: boolean = false;
  deletedFlag: boolean = false;
  seqNo: any;
  watchlistRemarksVal: any;
  showRiskModal: boolean = false;
  showdigitalModal: boolean = false
  riskDetails: any;

  showAbmmcHigh: boolean = false;
  showAbmmcLowMed: boolean = true;
  uploadedImageCEOSign: any;
  uploadedImageCEOSignName: any;
  uploadedImageCompHeadSign: any;
  uploadedImageCompHeadSignName: any;
  type: any;
  uploadedImageAttachmentName: any;
  sdnChecked: boolean = false;
  riskChecked: boolean = false;
  readOnly: boolean = false;
  viewOnly: boolean = false;
  taskiraPhoto: any;
  contactPersonSign: any;
  businessLicensePhoto: any;
  cmpnyAddressProof: any;
  shareholderPassportPhoto: any;
  AuthorizedSignPhoto: any;
  AuthorizedSignTaskiraPhoto: any;
  powerPhoto: any;
  DigitalSign: any;
  taskiraPhotoFront: any;
  taskiraPhotoBack: any;
  cmpnyAddressProofFront: any;
  cmpnyAddressProofBack: any;
  AuthorizedSignPhotoFront: any;
  AuthorizedSignPhotoBack: any;
  shareholderPassportPhotoFront: any;
  shareholderPassportPhotoBack: any;
  submittedForId: any;
  dobValue: any;
  shareHolderArray: any[] = [];
  authorizedSignArray: any[] = []
  approvedByComplianceValue: any;
  compHedSign: any;
  ceoSign: any;
  approvedByComplianceDateValue: any;
  profileDetails: any;
  loginUser: any;
  riskTarget: any;
  watchTarget: boolean = false;
  sdnView: any;
  showSdnAndRiskView: boolean = false;
  otherdocsorNot: any;
  item: any;
  contactIdProofFrontPhoto: any;
  contactSignaturePhoto: any;
  bizLicensePhoto: any;
  addressProofPhoto: any;
  authorizationLetterPhoto: any;
  articleOfAssociationPhoto: any;
  taxClearanceLetterPhoto: any;
  companyTINLetterPhoto: any;
  shareHolderFrontPhoto1: any;
  shareHolderFrontPhoto2: any;
  shareHolderBackPhoto1: any;
  shareHolderBackPhoto2: any;
  signatoriesFrontPhoto1: any;
  signatoriesFrontPhoto2: any;
  signatoriesBackPhoto1: any;
  signatoriesBackPhoto2: any;
  authSignatoryPhoto1: any;
  authSignatoryPhoto2: any;
  authSignatorySignaturePhoto1: any;
  authSignatorySignaturePhoto2: any;
  DataRisk: boolean = false;
  noDataRisk: boolean = false;
  riskTierValue: any;
  newFileProfile: any
  newFile: any;
  noDataSdn: boolean = false;
  opsSignaturePhoto: any;
  previousRoute: any;
  complianceSignaturePhoto: any;
  complianceSignaturePhotopart: any;
  kycType: any;
  companyPTID: any;
  presidentVicepresidentName: any;
  userType: any;
  regDate: any;
  regName: any;
  regEmail: any;
  showRegSection: boolean = false;
  regSign: any;
  regBySign: any;
  modifiedName: any;
  modifiedEmail: any;
  modifiedDate: any;
  natureofBusinesses: any
  nationalities: any
  districts: any
  provinces: any;
  isEditingList: boolean[] = [];
  districtsPer: any;
  districtsCur: any;
  selectedProvincePer: any;
  provincePerTarget: any;
  provinceIdPer: any;
  provinceCurTarget: any;
  selectedProvinceCur: any;
  provinceIdCur: any;
  provincesBirth: any;
  countryNamePer: any;
  BirthProvinceValue: any;
  BirthCountryValue: any;
  countryNameCur: any;
  accPurposeData: any;
  incomeSourceData: any;
  natureOfBusinessData: any;
  showCountryDrop: boolean = false;
  showProvinceDrop: boolean = false;
  showDistrictDrop: boolean = false;
  showDistrictText: boolean = true;
  showProvinceText: boolean = true;
  showCountryText: boolean = true;
  showBirthCountryText: boolean = true;
  showBirthCountryDrop: boolean = false;
  showBirthProvinceText: boolean = true;
  showBirthProvinceDrop: boolean = false;
  showNationalityDrop: boolean = false;
  showNationalityText: boolean = true;
  showNationalityAuthDrop: boolean = false;
  showNationalityAuthText: boolean = true;
  showSourceDrop: boolean = false;
  showSourceText: boolean = true;
  showSourceAuthDrop: boolean = false;
  showSourceAuthText: boolean = true;

  showNatureDrop: boolean = false;
  showNatureText: boolean = true;
  showPurposeDrop: boolean = false;
  showPurposeText: boolean = true;
  countryCurReq: any;
  nationalityReq: any;
  sourceOfIncomeReq: any;
  sourceOfIncomeAuthReq: any;
  countryPerReq: any;
  provinceCurReq: any;
  provincePerReq: any;
  districtCurReq: any;
  districtPerReq: any;
  natureReq: any;
  purposeOfAccReq: any;
  custGender: any;
  nationalityAuthReq: any;
  showIdExist: boolean = false;
  phoneErrorReg: boolean = false;
  emailError: boolean = false;
  phoneErrors: any = {};
  dobErrors: { underage?: boolean; overage?: boolean }[] = [];
  nameErrors: {
    firstName?: { required?: boolean; pattern?: boolean };
    lastName?: { required?: boolean; pattern?: boolean };
    fatherName?: { required?: boolean; pattern?: boolean };
  }[] = [];

  authNameErrors: {
    firstName?: { required?: boolean; pattern?: boolean };
    lastName?: { required?: boolean; pattern?: boolean };
  }[] = [];

  authPhoneErrors: {
    required?: boolean;
    pattern?: boolean;
  }[] = [];

  authEmailErrors: {
    required?: boolean;
    pattern?: boolean;
  }[] = [];
  authDobErrors: {
    required?: boolean;
    underage?: boolean;
    overage?: boolean;
  }[] = [];
  shareholderIds: any;
  editingIndex: number | null = null;
  //new checker maker update
  // permDistrictMap: Record<number, string> = {};
  // currDistrictMap: Record<number, string> = {};
  // currCountryMap: Record<number, string> = {};
  // permProvinceMap: Record<number, string> = {};
  // permCountryMap: Record<number, string> = {};
  // currProvinceMap: Record<number, string> = {};
  //
  permDistrictMap: Record<number, string> = {};
  currDistrictMap: Record<number, string> = {};

  currCountryMap: any[] = [];
  countryNameCurMap: any[] = [];

  permCountryMap: any[] = [];
  countryNamePerMap: any[] = [];

  currProvinceMap: any[] = [];
  permProvinceMap: any[] = [];

  provincesCurMap: any[] = [];
  provincesPerMap: any[] = [];

  districtsCurMap: any[] = [];
  districtsPerMap: any[] = [];

  selectedProvinceCurMap: any[] = [];
  selectedProvincePerMap: any[] = [];

  showBizNature: boolean = false;
  authOrRejectID: any;
  nationalityAuthMap: { [index: number]: string } = {};
  sourceAuthMap: { [index: number]: string } = {};
  nationalityMap: string[] = [];
  idToSend: any;
  //new added
  nationalityShareMap: { [index: number]: string } = {};
  showUpdateBtn: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private KycService: KycModuleService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private userManagemantService: UserManagementService,
    private masterAgentService: CorporateService,
    private corporate: CorporateService,
    private sharedFunctionsServic: SharedFunctionsService,
    private permissionService: PermissionService
  ) {
    const dateObj = new Date();
    this.currentDate = dateObj.toISOString().substring(0, 10);
    console.log("currentDate", this.currentDate);
    this.refundForm = this.fb.group({
      digitalKey: ['', Validators.required], // Assuming batchId is required
    });
     this.permissionService.hideSidebar = false;
  }
  private NEW_IMAGE_NAME_MAP: any = {
    bizLicensePhoto: 'Master Agent Business License Photo',
    signatoryPhoto: 'Authorized Signatory Photo',
    addressProofPhoto: 'Master Agent Address Proof Photo',
    articleOfAssociationPhoto: 'Master Agent Article Of Association Photo',
    taxClearanceLetterPhoto: 'Master Agent Tax Clearance Letter Photo',
    companyTINLetterPhoto: 'Master Agent Company TIN Letter Photo',
  };
  ngOnInit(): void {
    const Sharecount = this.item?.masterAgentKyc?.shareholders?.length || 0;
    this.phoneErrors = Array.from({ length: Sharecount }, () => ({
      required: false,
      pattern: false
    }));
    this.nameErrors = Array.from({ length: Sharecount }, () => ({
      firstName: {},
      lastName: {},
      fatherName: {}
    }));
    this.dobErrors = Array.from({ length: Sharecount }, () => ({}));

    const signcount = this.item?.masterAgentKyc?.signatories?.length || 0;
    this.authNameErrors = Array.from({ length: signcount }, () => ({
      firstName: {},
      lastName: {}
    }));
    this.authPhoneErrors = Array.from({ length: signcount }, () => ({
      required: false,
      pattern: false
    }));
    this.authEmailErrors = Array.from({ length: signcount }, () => ({
      required: false,
      pattern: false
    }));
    this.authDobErrors = Array.from({ length: signcount }, () => ({}));

    this.isEditingList = new Array(this.fileLists.length).fill(false);
    // this.getCountries()
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
      // this.superImg = this.profileDetails?.profilePic;
      // console.log("this.superImg", this.superImg);
      this.approvedByComplianceValue = this.item?.masterAgentKyc?.approvedByComplianceFullName
      console.log("approvedByComplianceValue", this.approvedByComplianceValue)
      this.approvedByComplianceDateValue = this.item?.masterAgentKyc?.approvedByComplianceDate
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
    // this.route.paramMap.subscribe(params => {
    //   this.kycId = params.get('kycId');
    //   console.log('kycId:', this.kycId);
    // });
    this.superAgentForm = this.fb.group({
      //old
      basicFirstName: ['', Validators.required, Validators.pattern(/^[a-zA-Z0-9 -]+$/)],
      basicLastName: ['', Validators.required, Validators.pattern(/^[a-zA-Z0-9 -]+$/)],
      basicEmail: ['', Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)],
      basicPhone: ['', Validators.required, Validators.pattern(/.*(7\d{8})$/)],
      basicUsername: ['', Validators.required],

      companyName: ['', Validators.required],
      pos: ['', Validators.required],
      location: ['', Validators.required],
      accountDate: ['', Validators.required],
      PTID: ['', Validators.required],
      ICCID: ['', Validators.required],
      accCreationPurpose: ['', Validators.required],

      // licenseAuth: ['', Validators.required],
      // licenseNo: ['', Validators.required],
      // issueDate: ['', Validators.required],
      // expiryDate: ['', Validators.required],
      street: ['', Validators.email],
      // houseNo: ['', Validators.required],
      // province: ['', Validators.required],
      TIN: ['', Validators.required],

      // district: ['', Validators.required],
      contactNo: ['', Validators.required],
      // country: ['', Validators.required],
      // email: ['', Validators.required],
      telNo: ['', Validators.required],

      outward: ['', Validators.required],
      inward: ['', Validators.required],
      fund: ['', Validators.required],
      businessNature: ['', Validators.required],
      turnover: ['', Validators.required],
      // monthlyIncome: ['', Validators.required],


      positionPresident: ['', Validators.required],
      // fatherName: ['', Validators.required],
      // tazkira: ['', Validators.required],
      emailPresident: ['', Validators.required],
      countryPresident: ['', Validators.required],
      // dob: ['', Validators.required],
      DateofExpiryPresident: ['', Validators.required],
      issueDatePresident: ['', Validators.required],
      nationalityPresident: ['', Validators.required],
      incomeSourcePresident: ['', Validators.required],
      mobilePresident: ['', Validators.required],
      monthlyIncomePresident: ['', Validators.required],
      PresidentTin: ['', Validators.required],

      permanentHouseNo: ['', Validators.required],
      permanentLocation: ['', Validators.required],
      permanentProvince: ['', Validators.required],
      permanentStreet: ['', Validators.required],
      permanentDistrict: ['', Validators.required],
      permanentCountry: ['', Validators.required],

      houseNoAddress: ['', Validators.required],
      locationAddress: ['', Validators.required],
      provinceAddress: ['', Validators.required],
      streetAddress: ['', Validators.required],
      districtAddress: ['', Validators.required],
      countryAddress: ['', Validators.required],
      //vice
      lastNameCompanyVice: ['', Validators.required],
      firstNameCompanyVice: ['', Validators.required],
      positionCompanyVice: ['', Validators.required],
      fatherNameCompanyVice: ['', Validators.required],
      tazkiraCompanyVice: ['', Validators.required],
      emailCompanyVice: ['', Validators.required],
      countryCompanyVice: ['', Validators.required],
      dobCompanyVice: ['', Validators.required],
      DateofExpiryCompanyVice: ['', Validators.required],
      issueDateCompanyVice: ['', Validators.required],
      nationalityCompanyVice: ['', Validators.required],
      incomeSourceCompanyVice: ['', Validators.required],
      mobileCompanyVice: ['', Validators.required],
      monthlyIncomeCompanyVice: ['', Validators.required],
      viceTin: ['', Validators.required],

      VicepermanentHouseNo: ['', Validators.required],
      VicepermanentLocation: ['', Validators.required],
      VicepermanentProvince: ['', Validators.required],
      VicepermanentStreet: ['', Validators.required],
      VicepermanentDistrict: ['', Validators.required],
      VicepermanentCountry: ['', Validators.required],

      VicehouseNoAddress: ['', Validators.required],
      VicelocationAddress: ['', Validators.required],
      ViceprovinceAddress: ['', Validators.required],
      VicestreetAddress: ['', Validators.required],
      VicedistrictAddress: ['', Validators.required],
      VicecountryAddress: ['', Validators.required],
      //mno
      MNOname: ['', Validators.required],
      accountName: ['', Validators.required],
      accountNo: ['', Validators.required],

      presidentName: ['', Validators.required],
      presidentDate: ['', Validators.required],
      V_presidentName: ['', Validators.required],
      V_presidentDate: ['', Validators.required],
      //abmmc verify
      // KycProcessed: ['', Validators.required],
      // KycProcessedDate: ['', Validators.required],
      // Verified: ['', Validators.required],
      // VerifiedDate: ['', Validators.required],
      // Compliance: ['', Validators.required],
      // ComplianceDate: ['', Validators.required],
      //old
      //NEW
      accTitle: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      MMwallet: ['', Validators.required],
      accOpenDate: ['', Validators.required],
      contactPerName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]],
      contactPerDesignation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      accOpenPurpose: ['', [Validators.required]],

      licenseNo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      licenseAuth: ['', [Validators.required]],
      issueDate: ['', [Validators.required, this.sharedFunctionsServic.pastDateValidator()]],
      expiryDate: ['', [Validators.required, this.sharedFunctionsServic.futureDateValidator()]],
      tinNo: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      NoOfShareHolder: ['', Validators.required],

      businessName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]],
      grossAnnualIncome: ['', Validators.required],
      natureBusiness: ['', Validators.required],
      monthlyIncome: ['', [Validators.required]],
      netWorth: ['', [Validators.required]],
      fundSrc: ['', [Validators.required]],
      monthlyTurnover: ['', [Validators.required]],

      cmpnyLoc: ['', [Validators.required]],
      streetNo: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      district: ['', Validators.required],
      houseNo: ['', Validators.required],
      province: ['', Validators.required],
      country: ['', Validators.required],
      offPhNo: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      cmpnyEmail: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],

      firstName: ['', Validators.required, Validators.pattern(/^[a-zA-Z0-9 -]+$/)],
      lastName: ['', Validators.required, Validators.pattern(/^[a-zA-Z0-9 -]+$/)],
      fatherName: ['', Validators.required, Validators.pattern(/^[a-zA-Z0-9 -]+$/)],
      tazkira: ['', Validators.required],
      dob: ['', Validators.required],
      birthPlace: ['', Validators.required],
      Nationality: ['', Validators.required],
      shareholderIncome: ['', Validators.required],
      shareholderPerc: ['', Validators.required],
      otherSrc: ['', Validators.required],
      shareholderRelation: ['', Validators.required],
      shareholderPh: ['', Validators.required],
      shareholderTin: ['', Validators.required],

      shareCurrLoc: ['', Validators.required],
      shareCurrDis: ['', Validators.required],
      shareCurrPro: ['', Validators.required],
      shareCurrCount: ['', Validators.required],

      sharePerLoc: ['', Validators.required],
      sharePerDis: ['', Validators.required],
      sharePerPro: ['', Validators.required],
      sharePerCount: ['', Validators.required],

      firstNameAuth: ['', Validators.required, Validators.pattern(/^[a-zA-Z0-9 -]+$/)],
      lastNameAuth: ['', Validators.required, Validators.pattern(/^[a-zA-Z0-9 -]+$/)],
      tazkiraAuth: ['', Validators.required],
      dobAuth: ['', Validators.required],
      birthPlaceAuth: ['', Validators.required],
      NationalityAuth: ['', Validators.required],
      designationAuth: ['', Validators.required],
      resiAuth: ['', Validators.required],
      phAuth: ['', Validators.required, Validators.pattern(/.*(7\d{8})$/)],
      srcAuth: ['', Validators.required],
      incomeAuth: ['', Validators.required],
      typeAuth: ['', Validators.required],
      //NEW
      // per and cur address drop
      countryAddressDrop: ['', Validators.required],
      perCountryDrop: ['', Validators.required],
      provinceAddressDrop: ['', Validators.required],
      permanentProvinceDrop: ['', Validators.required],
      districtAddressDrop: ['', Validators.required],
      permanentDistrictDrop: ['', Validators.required],

      // nationalityDrop: ['', Validators.required],
      nationalityAuthDrop: ['', Validators.required],

      incomeSourceOrg: ['', Validators.required],
      incomeSourceOrgAuth: ['', Validators.required],

      PurposeDrop: ['', Validators.required],
      //newValues
      // accTitleNew: [''],
      // contactPerNameNew: [''],
      // PTIDNew: [''],
      // contactPerDesignationNew: [''],
      // licenseNoNew: [''],
      // licenseAuthNew: [''],
      // issueDateNew: [''],
      // expiryDateNew: [''],
      // tinNoNew: [''],
      // NoOfShareHolderNew: [''],
      // businessNameNew: [''],
      // monthlyIncomeNew: [''],
      // netWorthNew: [''],
      // monthlyTurnoverNew: [''],
      // fundSrcNew: [''],
      // cmpnyLocNew: [''],
      // streetNoNew: [''],
      // districtNew: [''],
      // houseNoNew: [''],
      // offPhNoNew: [''],
      // cmpnyEmailNew: [''],
    });
    // this.route.queryParams.subscribe(params => {
    //   if (params['data']) {
    //     this.item = JSON.parse(params['data']);
    //     console.log("Received item:", this.item);
    //   }
    // });
    this.item = this.KycService.getItem();
    console.log("Received item new method:", this.item);
    console.log("kyc id of Received item:", this.item?.id);
    this.kycId = this.item?.id;
    console.log("Extracted kycId:", this.kycId);

    this.userStatus = this.item?.status
    console.log("this.userStatus", this.userStatus)
    this.seqNo = this.item?.seqNo;
    this.kycType = this.item?.kycType;
    this.companyPTID = this.item?.masterAgentKyc?.companyPTID;
    this.regName = this.item?.submittedBy?.firstName + " " + this.item?.submittedBy?.lastName;
    this.regEmail = this.item?.submittedBy?.email
    this.regForm.get('regInput')?.setValue(this.regName);
    this.regDate = this.item?.masterAgentKyc?.companyAccOpenDate;
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
    }
    else if (this.userType == "AGENT") {
      this.showRegSection = true
    }
    else if (this.userType == "CUSTOMER") {
      this.showRegSection = true;
    }
    // if (item?.masterAgentKyc?.attachments.length != 0) {
    //   let i = 1;
    //   for (let file of item.masterAgentKyc.attachments) {
    //     this.fileLists.push({
    //       name: 'Attachment - ' + i,
    //       url: this.imageUrl + '/kyc/static/' + file
    //     })
    //     i++;
    //   }
    // }

    //newValues section
    console.log("new image section", this.item.newValues)
    console.log('newValues.shareholders = ', this.item?.newValues?.shareholders);
    // if (this.item?.newValues) {
    //   console.log("new companyName", this.item?.newValues?.companyName);
    //   console.log(" new contactPersonName", this.item?.newValues?.contactPersonName);
    //   console.log("new companyPTID", this.item?.newValues?.companyPTID);
    //   console.log("new contactPersonDesignation", this.item?.newValues?.contactPersonDesignation);
    //   this.superAgentForm.patchValue({
    //     accTitleNew: this.item?.newValues?.companyName,
    //     contactPerNameNew: this.item?.newValues?.contactPersonName,
    //     PTIDNew: this.item?.newValues?.companyPTID,
    //     contactPerDesignationNew: this.item?.newValues?.contactPersonDesignation,
    //     licenseNoNew: this.item?.newValues?.bizLicenseNumber,
    //     licenseAuthNew: this.item?.newValues?.bizLicenseAuthority,
    //     issueDateNew: this.item?.newValues?.bizLicenseDateOfIssue,
    //     expiryDateNew: this.item?.newValues?.bizLicenseDateOfExpiry,
    //     tinNoNew: this.item?.newValues?.bizLicenseTinNumber,
    //     NoOfShareHolderNew: this.item?.newValues?.companyNoOfShareholders,

    //     businessNameNew: this.item?.newValues?.bizName,
    //     monthlyIncomeNew: this.item?.newValues?.monthlyIncome,
    //     netWorthNew: this.item?.newValues?.netWorth,
    //     monthlyTurnoverNew: this.item?.newValues?.monthlyTurnover,
    //     fundSrcNew: this.item?.newValues?.sourceOfFund,

    //     cmpnyLocNew: this.item?.newValues?.companyLocation,
    //     streetNoNew: this.item?.newValues?.companyStreet,
    //     districtNew: this.item?.newValues?.companyDistrict,
    //     houseNoNew: this.item?.newValues?.companyHouseNumber,
    //     offPhNoNew: this.item?.newValues?.companyOfficePhone,
    //     cmpnyEmailNew: this.item?.newValues?.companyEmail,

    //   });
    // }
    //newValues section

    //new
    if (this.item?.masterAgentKyc?.otherDocs) {
      this.otherdocsorNot = this.item?.masterAgentKyc?.otherDocs
      const otherDocsArray = this.item?.masterAgentKyc?.otherDocs.split(',');
      let i = 1;
      for (let file of otherDocsArray) {
        this.fileLists.push({
          name: 'Other Document - ' + i,
          url: file,
          upload: 'otherDocs'
          // url: `${this.imageUrl}/kyc/static/${file}`,
        });
        i++;
      }
    }
    this.watchlistRemarksVal = this.item?.masterAgentKyc?.watchlistRemarks

    this.walletaccounts = this.item?.submittedFor?.walletAccount;
    console.log(" this.walletaccounts", this.walletaccounts);

    this.superId = this.item?.submittedFor?.id;
    console.log(" this.superId", this.superId);

    this.superAgentId = this.item?.id;
    this.activeFlag = this.item?.submittedFor?.active;
    this.deletedFlag = this.item?.submittedFor?.deleted;
    // let shareholdersArray: Shareholder[] = [];
    // this.item.forEach((item: any) => {
    //   if (item?.masterAgentKyc?.shareholders && Array.isArray(item.masterAgentKyc.shareholders)) {
    //     shareholdersArray.push(...item.masterAgentKyc.shareholders);
    //   }
    // });
    // this.shareHolderArray = shareholdersArray
    // console.log("shareholdersArray", shareholdersArray);
    // let authorizedArray: signatories[] = [];
    // this.item.forEach((item: any) => {
    //   if (item?.masterAgentKyc?.signatories && Array.isArray(item.masterAgentKyc.signatories)) {
    //     authorizedArray.push(...item.masterAgentKyc.signatories);
    //   }
    // });
    // this.authorizedSignArray = authorizedArray

    this.submittedForId = this.item?.submittedFor?.id
    if (this.item?.status == 'IN_REVIEW' || 'APPROVED') {
      this.readOnly = true;
    }
    else {
      this.readOnly = false;
    } //img
    if (this.item?.masterAgentKyc?.opsSignaturePhoto) {
      this.regSign = this.item?.masterAgentKyc?.opsSignaturePhoto;
      this.getImagesRegSign(this.regSign)
    }
    if (this.item?.masterAgentKyc?.signatories[0]?.signaturePhoto) {
      this.getImages(this.item?.masterAgentKyc?.signatories[0]?.signaturePhoto, 'authSigSignature1');
    }
    if (this.item?.masterAgentKyc?.signatories[1]?.signaturePhoto) {
      this.getImages(this.item?.masterAgentKyc?.signatories[1]?.signaturePhoto, 'authSigSignature2');
    }
    if (this.item?.masterAgentKyc?.shareholders[0]?.signaturePhoto) {
      this.getImages(this.item?.masterAgentKyc?.shareholders[0]?.idProofFrontPhoto, 'presidentViceImg');
    } else {
      this.getImages(this.item?.masterAgentKyc?.shareholders[1]?.idProofFrontPhoto, 'presidentViceImg');
    }
    if (this.item?.masterAgentKyc?.complianceSignaturePhoto) {
      this.getImages(this.item?.masterAgentKyc?.complianceSignaturePhoto, 'compSign');
    }
    if (this.item?.masterAgentKyc?.shareholders[0]?.idProofFrontPhoto) {
      this.getImages(this.item?.masterAgentKyc?.shareholders[0]?.idProofFrontPhoto, 'presidentViceImg');
    } else {
      this.getImages(this.item?.masterAgentKyc?.shareholders[1]?.idProofFrontPhoto, 'presidentViceImg');
    }
    if (this.item?.masterAgentKyc?.ceoSignaturePhoto) {
      this.getImages(this.item?.masterAgentKyc?.ceoSignaturePhoto, 'ceoSign');
    }
    if (this.item?.masterAgentKyc?.complianceHeadSignaturePhoto) {
      this.getImages(this.item?.masterAgentKyc?.complianceHeadSignaturePhoto, 'compHedSign');
    }
    if (this.item?.submittedBy?.userType == 'BO' && this.item?.masterAgentKyc?.opsSignaturePhoto) {
      this.getImages(this.item?.masterAgentKyc?.opsSignaturePhoto, 'opnSign');
    }

    //gender
    if (this.item?.masterAgentKyc?.custInfoGender == "MALE") {
      this.MaleChecked.setValue(true);
    }
    if (this.item?.masterAgentKyc?.custInfoGender == "FEMALE") {
      this.FemaleChecked.setValue(true);
    }
    //risk&watch
    //risk
    //new added
    if (this.item?.status != 'PENDING') {
      if (this.item?.masterAgentKyc?.riskCategory == "LOW") {
        this.riskLow.setValue(true);
      }
      if (this.item?.masterAgentKyc?.riskCategory == "MEDIUM") {
        this.riskMedium.setValue(true);
      }
      if (this.item?.masterAgentKyc?.riskCategory == "HIGH") {
        this.riskHigh.setValue(true);
      }
      //watchlist
      if (this.item?.masterAgentKyc?.checkedWatchlist) {
        this.watchYes.setValue(true);
        this.watchNo.setValue(false);
      }
      else if (!this.item?.masterAgentKyc?.checkedWatchlist && this.item?.masterAgentKyc?.checkedWatchlist != null) {
        this.watchYes.setValue(false);
        this.watchNo.setValue(true);
      }
      else {
        this.watchYes.setValue(false);
        this.watchNo.setValue(false);
      }
    }

    //doc
    if (this.item.masterAgentKyc.validLicenseNo) {
      this.licenseNoo.setValue(true);
    }
    if (this.item.masterAgentKyc.validLicenseYes) {
      this.licenseYes.setValue(true);
    }
    if (this.item.masterAgentKyc.validPassportNo) {
      this.passNo.setValue(true);
    }
    if (this.item.masterAgentKyc.validPassportYes) {
      this.passYes.setValue(true);
    }
    if (this.item.masterAgentKyc.validSignatoryNo) {
      this.signNo.setValue(true);
    }
    if (this.item.masterAgentKyc.validSignatoryYes) {
      this.signYes.setValue(true);
    }
    if (this.item.masterAgentKyc.validAssociationNo) {
      this.articleNo.setValue(true);
    }
    if (this.item.masterAgentKyc.validAssociationYes) {
      this.articleYes.setValue(true);
    }
    if (this.item.masterAgentKyc.validResolutionNo) {
      this.ResNo.setValue(true);
    }
    if (this.item.masterAgentKyc.validResolutionYes) {
      this.ResYes.setValue(true);
    }
    if (this.item.masterAgentKyc.validPowerOfAttNo) {
      this.powerNo.setValue(true);
    }
    if (this.item.masterAgentKyc.validPowerOfAttYes) {
      this.powerYes.setValue(true);
    }
    //havemno
    if (this.item.masterAgentKyc.otherMnoNo) {
      this.mnoNo.setValue(true);
    }
    if (this.item.masterAgentKyc.otherMnoYes) {
      this.mnoYes.setValue(true);
    }
    //NEW
    this.taskiraPhotoFront = this.item?.masterAgentKyc?.contactIdProofFrontPhoto;
    this.taskiraPhotoBack = this.item?.masterAgentKyc?.contactIdProofBackPhoto;
    this.contactPersonSign = this.item?.masterAgentKyc?.contactSignaturePhoto;

    this.businessLicensePhoto = this.item?.masterAgentKyc?.bizLicensePhoto;
    this.cmpnyAddressProofFront = this.item?.masterAgentKyc?.addressProofPhoto;
    this.complianceSignaturePhotopart = this.item?.masterAgentKyc?.complianceSignaturePhoto;
    // this.cmpnyAddressProofBack = item?.masterAgentKyc?.idProofBackPhoto;

    this.shareholderPassportPhotoFront = this.item?.masterAgentKyc?.shareholders?.idProofFrontPhoto;
    this.shareholderPassportPhotoBack = this.item?.masterAgentKyc?.shareholders?.idProofBackPhoto;

    // this.AuthorizedSignPhotoFront = this.item?.masterAgentKyc?.signatoryPhoto;
    this.AuthorizedSignPhotoBack = this.item?.masterAgentKyc?.signatoryIdProofBackPhoto;
    this.AuthorizedSignTaskiraPhoto = this.item?.masterAgentKyc?.signatoryIdProofFrontPhoto;
    this.powerPhoto = this.item?.masterAgentKyc?.authorizationLetterPhoto;
    this.DigitalSign = this.item?.masterAgentKyc?.signatorySignature;

    //NEW

    if (this.readOnly) {
      this.FemaleChecked.disable();
      this.MaleChecked.disable();
    }
    // if (this.item?.masterAgentKyc?.signatories[0].signatoryPhoto) {
    //   this.superImg = this.item?.masterAgentKyc?.signatories[0].signatoryPhoto
    //   this.fileLists.push({
    //     name: 'Master Agent Profile Picture',
    //     url: this.superImg,
    //     upload:'profile'
    //     // url: this.imageUrl + '/kyc/static/' + this.superImg
    //     // url: this.imageUrl + '/um/static/profile/' + this.superImg
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
    // if (this.item?.masterAgentKyc?.complianceSignaturePhoto) {
    //   console.log('New File Upload');

    //   this.complianceSignaturePhoto = this.item?.masterAgentKyc?.complianceSignaturePhoto
    //   this.fileLists.push({
    //     name: 'Master Agent Contact Person Signature Photo',
    //     url: this.complianceSignaturePhotopart,
    //     upload:'complianceSignaturePhoto',
    //     // url: this.imageUrl + '/um/static/profile/' + this.superImg
    //   })
    // }
    if (this.item?.masterAgentKyc?.contactIdProofFrontPhoto) {
      this.contactIdProofFrontPhoto = this.item?.masterAgentKyc?.contactIdProofFrontPhoto
      this.fileLists.push({
        name: 'Master Agent contactIdProofFrontPhoto',
        url: this.imageUrl + '/kyc/static/' + this.contactIdProofFrontPhoto,
        upload: 'contactPersonTazkiraPhoto',
        // url: this.imageUrl + '/um/static/profile/' + this.superImg
      })
    }
    if (this.item?.masterAgentKyc?.contactSignaturePhoto) {
      this.contactSignaturePhoto = this.item?.masterAgentKyc?.contactSignaturePhoto
      this.fileLists.push({
        name: 'Master Agent Contact Signature Photo',
        url: this.contactSignaturePhoto,
        upload: 'contactPersonSign',
        // url: this.imageUrl + '/kyc/static/' + this.contactSignaturePhoto
        // url: this.imageUrl + '/um/static/profile/' + this.superImg
      })
    }
    if (this.item?.masterAgentKyc?.bizLicensePhoto) {
      this.bizLicensePhoto = this.item?.masterAgentKyc?.bizLicensePhoto
      this.fileLists.push({
        name: 'Master Agent Business License Photo',
        url: this.bizLicensePhoto,
        upload: 'businessLicencePhoto',
        // url: this.imageUrl + '/kyc/static/' + this.bizLicensePhoto
        // url: this.imageUrl + '/um/static/profile/' + this.superImg
      })
    }
    if (this.item?.masterAgentKyc?.addressProofPhoto) {
      this.addressProofPhoto = this.item?.masterAgentKyc?.addressProofPhoto
      this.fileLists.push({
        name: 'Master Agent Address Proof Photo',
        url: this.addressProofPhoto,
        upload: 'addressProof',
        // url: this.imageUrl + '/kyc/static/' + this.addressProofPhoto
        // url: this.imageUrl + '/um/static/profile/' + this.superImg
      })
    }
    if (this.item?.masterAgentKyc?.authorizationLetterPhoto) {
      this.authorizationLetterPhoto = this.item?.masterAgentKyc?.authorizationLetterPhoto
      this.fileLists.push({
        name: 'Master Agent Authorization LetterPhoto',
        url: this.authorizationLetterPhoto,
        upload: 'authorizedLetter',
        // url: this.imageUrl + '/kyc/static/' + this.authorizationLetterPhoto
        // url: this.imageUrl + '/um/static/profile/' + this.superImg
      })
    }
    if (this.item?.masterAgentKyc?.articleOfAssociationPhoto) {
      this.articleOfAssociationPhoto = this.item?.masterAgentKyc?.articleOfAssociationPhoto
      this.fileLists.push({
        name: 'Master Agent Article Of AssociationPhoto',
        url: this.articleOfAssociationPhoto,
        upload: 'articleOfAssociationPhoto',
        // url: this.imageUrl + '/kyc/static/' + this.articleOfAssociationPhoto
        // url: this.imageUrl + '/um/static/profile/' + this.superImg
      })
    }
    if (this.item?.masterAgentKyc?.taxClearanceLetterPhoto) {
      this.taxClearanceLetterPhoto = this.item?.masterAgentKyc?.taxClearanceLetterPhoto
      this.fileLists.push({
        name: 'Master Agent Tax Clearance LetterPhoto',
        url: this.taxClearanceLetterPhoto,
        upload: 'taxClearanceLetterPhoto',
        // url: this.imageUrl + '/kyc/static/' + this.taxClearanceLetterPhoto
        // url: this.imageUrl + '/um/static/profile/' + this.superImg
      })
    }
    if (this.item?.masterAgentKyc?.companyTINLetterPhoto) {
      this.companyTINLetterPhoto = this.item?.masterAgentKyc?.companyTINLetterPhoto
      this.fileLists.push({
        name: 'Master Agent Company TINLetter Photo',
        url: this.companyTINLetterPhoto,
        upload: 'companyTINLetterPhoto',
        // url: this.imageUrl + '/kyc/static/' + this.companyTINLetterPhoto
        // url: this.imageUrl + '/um/static/profile/' + this.superImg
      })
    }
    if (this.item?.masterAgentKyc?.shareholders.length > 0) {
      for (let i = 0; i < this.item?.masterAgentKyc?.shareholders.length; i++) {
        if (this.item?.masterAgentKyc?.shareholders[i]?.idProofFrontPhoto) {
          this.shareHolderFrontPhoto1 = this.item?.masterAgentKyc?.shareholders[i]?.idProofFrontPhoto
          this.fileLists.push({
            name: `Shareholder ${i + 1} Id Proof Front Photo`,
            url: this.shareHolderFrontPhoto1,
            upload: 'shareHolderFrontPhoto1',
          })
        }
        if (this.item?.masterAgentKyc?.shareholders[i]?.idProofBackPhoto) {
          this.shareHolderBackPhoto1 = this.item?.masterAgentKyc?.shareholders[i]?.idProofBackPhoto
          this.fileLists.push({
            name: `Shareholder ${i + 1} Id Proof Back Photo`,
            url: this.shareHolderBackPhoto1,
            upload: 'shareHolderBackPhoto1',
          })
        }
      }
    }

    if (this.item?.masterAgentKyc?.signatories.length > 0) {
      for (let i = 0; i < this.item?.masterAgentKyc?.signatories.length; i++) {
        if (this.item?.masterAgentKyc?.signatories[i]?.idProofFrontPhoto) {
          this.signatoriesFrontPhoto1 = this.item?.masterAgentKyc?.signatories[i]?.idProofFrontPhoto
          this.fileLists.push({
            name: `Authorized Signatory ${i + 1} Id Proof Front Photo`,
            url: this.signatoriesFrontPhoto1,
            upload: 'signatoriesFrontPhoto1',
          })
        }
        if (this.item?.masterAgentKyc?.signatories[i]?.idProofBackPhoto) {
          this.signatoriesBackPhoto1 = this.item?.masterAgentKyc?.signatories[i]?.idProofBackPhoto
          this.fileLists.push({
            name: `Authorized Signatory ${i + 1} Id Proof Back Photo`,
            url: this.signatoriesBackPhoto1,
            upload: 'signatoriesBackPhoto1',
          })
        }
        if (this.item?.masterAgentKyc?.signatories[i]?.signatoryPhoto) {
          this.authSignatoryPhoto1 = this.item?.masterAgentKyc?.signatories[i]?.signatoryPhoto
          this.fileLists.push({
            name: `Authorized Signatory ${i + 1} signatory Photo`,
            url: this.authSignatoryPhoto1,
            upload: 'authSignatoryPhoto1',
          })
        }
        if (this.item?.masterAgentKyc?.signatories[i]?.signaturePhoto) {
          this.authSignatorySignaturePhoto1 = this.item?.masterAgentKyc?.signatories[i]?.signaturePhoto
          this.fileLists.push({
            name: `Authorized Signatory ${i + 1} Signature Photo`,
            url: this.authSignatorySignaturePhoto1,
            upload: 'authSignatorySignaturePhoto1',
          })
        }
      }




      const shareholders = this.item?.masterAgentKyc?.shareholders || [];
      const signatories = this.item?.masterAgentKyc?.signatories || [];

      let presidentName: string | null = null;
      let vicePresidentName: string | null = null;
      let presidentSignature: string | null = null;
      let vicePresidentSignature: string | null = null;

      shareholders.forEach((shareholder: any) => {
        const fullName = `${shareholder.firstName} ${shareholder.lastName}`;
        const match = signatories.find((sign: any) => sign.idProofNumber === shareholder.idProofNumber);

        if (shareholder.relationship.includes('PRESIDENT')) {
          // console.log("President Found:", fullName, match.signaturePhoto), '+++++++_+_+_+_+_+_+';
          if (match && !presidentName) {
            presidentName = fullName;
            presidentSignature = match.signaturePhoto;
          } else if (!presidentName) {
            presidentName = fullName;
          }
        }

        if (shareholder.relationship.includes('VICE_PRESIDENT')) {
          if (match && !vicePresidentName) {
            vicePresidentName = fullName;
            vicePresidentSignature = match.signaturePhoto;
          } else if (!vicePresidentName) {
            vicePresidentName = fullName;
          }
        }
      });
    }
    //new image section
    console.log(this.item?.masterAgentKyc?.companyName, '_________________++++++++++++++++++++++++=');

    // this.dobValue = this.item?.masterAgentKyc?.signatoryDOB
    this.dobValue = this.item?.masterAgentKyc?.signatories[0]?.dob
    // this.firstNameValue = this.item?.masterAgentKyc?.signatoryFirstName;
    this.superAgentForm.patchValue({ accTitle: this.item?.masterAgentKyc?.companyName || 'NIL' })
    this.superAgentForm.patchValue({ MMwallet: this.item?.masterAgentKyc?.companyWalletNumber || 'NIL' })
    this.superAgentForm.patchValue({ accOpenDate: this.item?.masterAgentKyc?.companyAccOpenDate || 'NIL' })
    this.superAgentForm.patchValue({ contactPerName: this.item?.masterAgentKyc?.contactPersonName || 'NIL' })
    this.superAgentForm.patchValue({ PTID: this.item?.masterAgentKyc?.companyPTID || 'NIL' })
    this.superAgentForm.patchValue({ contactPerDesignation: this.item?.masterAgentKyc?.contactPersonDesignation || 'NIL' })
    //  purposeOfAcc
    this.superAgentForm.patchValue({ accOpenPurpose: this.item?.masterAgentKyc?.purposeOfAcc || 'NIL' })
    this.superAgentForm.patchValue({ PurposeDrop: this.item?.masterAgentKyc?.purposeOfAcc || 'NIL' })

    this.superAgentForm.patchValue({ licenseNo: this.item?.masterAgentKyc?.bizLicenseNumber || 'NIL' })
    this.superAgentForm.patchValue({ licenseAuth: this.item?.masterAgentKyc?.bizLicenseAuthority || 'NIL' })
    this.superAgentForm.patchValue({ issueDate: this.item?.masterAgentKyc?.bizLicenseDateOfIssue || 'NIL' })
    this.superAgentForm.patchValue({ expiryDate: this.item?.masterAgentKyc?.bizLicenseDateOfExpiry || 'NIL' })
    this.superAgentForm.patchValue({ tinNo: this.item?.masterAgentKyc?.bizLicenseTinNumber || 'NIL' })
    this.superAgentForm.patchValue({ NoOfShareHolder: this.item?.masterAgentKyc?.companyNoOfShareholders || 'NIL' })

    this.superAgentForm.patchValue({ businessName: this.item?.masterAgentKyc?.bizName || 'NIL' })
    this.superAgentForm.patchValue({ grossAnnualIncome: this.item?.masterAgentKyc?.natureOfBiz || 'NIL' })
    // this.superAgentForm.patchValue({ monthlyIncome: item?.masterAgentKyc?.monthlyIncome || 'NIL' })
    this.superAgentForm.patchValue({
      monthlyIncome: this.item?.masterAgentKyc?.monthlyIncome
        ? `AFN ${this.formatNumber(this.item.masterAgentKyc.monthlyIncome)}`
        : 'NIL'
    });
    this.superAgentForm.patchValue({ netWorth: this.item?.masterAgentKyc?.netWorth || 'NIL' })
    this.superAgentForm.patchValue({ fundSrc: this.item?.masterAgentKyc?.sourceOfFund || 'NIL' })
    //this.superAgentForm.patchValue({ incomeSourceOrg: this.item?.masterAgentKyc?.sourceOfFund || 'NIL' })
    // this.superAgentForm.patchValue({ monthlyTurnover: item?.masterAgentKyc?.monthlyTurnover || 'NIL' })
    this.superAgentForm.patchValue({
      monthlyTurnover: this.item?.masterAgentKyc?.monthlyTurnover
        ? `AFN ${this.formatNumber(this.item.masterAgentKyc.monthlyTurnover)}`
        : 'NIL'
    });

    this.superAgentForm.patchValue({ cmpnyLoc: this.item?.masterAgentKyc?.companyLocation || 'NIL' })
    this.superAgentForm.patchValue({ streetNo: this.item?.masterAgentKyc?.companyStreet || 'NIL' })
    this.superAgentForm.patchValue({ district: this.item?.masterAgentKyc?.companyDistrict || 'NIL' })
    this.superAgentForm.patchValue({ houseNo: this.item?.masterAgentKyc?.companyHouseNumber || 'NIL' })
    this.superAgentForm.patchValue({ offPhNo: this.item?.masterAgentKyc?.companyOfficePhone || 'NIL' })
    this.superAgentForm.patchValue({ country: this.item?.masterAgentKyc?.companyCountry || 'NIL' })
    this.superAgentForm.patchValue({ cmpnyEmail: this.item?.masterAgentKyc?.companyEmail || 'NIL' })
   /*  this.superAgentForm.updateValueAndValidity();
    this.superAgentForm.markAllAsTouched(); */
    
     const provinceName = this.item?.masterAgentKyc?.companyProvince;
     console.log("Selected Province Name:", provinceName);
    
        if (!provinceName) return;
    
        combineLatest([
          this.getProvince$(), // provinces API
          of(provinceName)     // province name from KYC
        ]).pipe(
          take(1), // 👈 important: run only once
          map(([provinces, name]) => {
            this.provinces = provinces;
            this.superAgentForm.patchValue({ province: this.item?.masterAgentKyc?.companyProvince || 'NIL' })

    
            return provinces.find(
              (p: any) => p.name === name
            )?.id;
                                 

          } ),
          
          filter((provinceId) => provinceId != null), // 👈 ensure provinceId exists
          
          switchMap((provinceId) =>
            this.corporate.getdistricts(provinceId)
          
          )
          
        ).subscribe({
          next: (res: any) => {
            this.districts = res?.data || [];

            
            this.superAgentForm.patchValue({
              district: this.item?.masterAgentKyc?.companyDistrict
            });
          
          },
          error: (error) => {
            console.error('Error fetching districts:', error);
          }
        });
  
    //nationalityDrop
    // this.item.masterAgentKyc?.shareholders?.forEach((sh: any, i: number) => {
    //   this.nationalityMap[i] = sh.nationality;
    // });

    // this.superAgentForm.patchValue({ firstName: this.item?.masterAgentKyc?.shareholders?.firstName || 'NIL' })
    // this.superAgentForm.patchValue({ lastName: this.item?.masterAgentKyc?.shareholders?.lastName || 'NIL' })
    // this.superAgentForm.patchValue({ fatherName: this.item?.masterAgentKyc?.shareholders?.fatherName || 'NIL' })
    // this.superAgentForm.patchValue({ dob: this.item?.masterAgentKyc?.shareholders?.dob || 'NIL' })
    // this.superAgentForm.patchValue({ tazkira: this.item?.masterAgentKyc?.shareholders?.idProofNumber || 'NIL' })
    // this.superAgentForm.patchValue({ birthPlace: this.item?.masterAgentKyc?.shareholders?.placeOfBirth || 'NIL' })
    // this.superAgentForm.patchValue({ Nationality: this.item?.masterAgentKyc?.shareholders?.nationality || 'NIL' })
    // this.superAgentForm.patchValue({ shareholderRelation: this.item?.masterAgentKyc?.shareholders?.relationship || 'NIL' })
    // this.superAgentForm.patchValue({ shareholderIncome: this.item?.masterAgentKyc?.shareholders?.monthlyIncome || 'NIL' })
    // this.superAgentForm.patchValue({ shareholderPerc: this.item?.masterAgentKyc?.shareholders?.shareholdingPercentage || 'NIL' })
    // this.superAgentForm.patchValue({ otherSrc: this.item?.masterAgentKyc?.shareholders?.sourceOfIncome || 'NIL' })
    // this.superAgentForm.patchValue({ shareholderPh: this.item?.masterAgentKyc?.shareholders?.phone || 'NIL' })
    // this.superAgentForm.patchValue({ shareholderTin: this.item?.masterAgentKyc?.shareholders?.tinNumber || 'NIL' })

    //old share 
    // this.superAgentForm.patchValue({
    //   firstName: this.item?.masterAgentKyc?.shareholders?.firstName || null,
    //   lastName: this.item?.masterAgentKyc?.shareholders?.lastName || null,
    //   fatherName: this.item?.masterAgentKyc?.shareholders?.fatherName || null,
    //   dob: this.item?.masterAgentKyc?.shareholders?.dob || null,
    //   tazkira: this.item?.masterAgentKyc?.shareholders?.idProofNumber || null,
    //   birthPlace: this.item?.masterAgentKyc?.shareholders?.placeOfBirth || null,
    //   Nationality: this.item?.masterAgentKyc?.shareholders?.nationality || null,
    //   shareholderRelation: this.item?.masterAgentKyc?.shareholders?.relationship || null,
    //   shareholderIncome: this.item?.masterAgentKyc?.shareholders?.monthlyIncome || null,
    //   shareholderPerc: this.item?.masterAgentKyc?.shareholders?.shareholdingPercentage || null,
    //   otherSrc: this.item?.masterAgentKyc?.shareholders?.sourceOfIncome || null,
    //   shareholderPh: this.item?.masterAgentKyc?.shareholders?.phone || null,
    //   shareholderTin: this.item?.masterAgentKyc?.shareholders?.tinNumber || null,
    // });

    // this.superAgentForm.patchValue({ shareCurrLoc: this.item?.masterAgentKyc?.shareholders?.currLocation || 'NIL' })
    // this.superAgentForm.patchValue({ sharePerLoc: this.item?.masterAgentKyc?.shareholders?.permLocation || 'NIL' })

    // this.superAgentForm.patchValue({ shareCurrDis: this.item?.masterAgentKyc?.shareholders?.currDistrict || 'NIL' })
    // this.superAgentForm.patchValue({ shareCurrPro: this.item?.masterAgentKyc?.shareholders?.currProvince || 'NIL' })
    // this.superAgentForm.patchValue({ shareCurrCount: this.item?.masterAgentKyc?.shareholders?.currCountry || 'NIL' })

    // this.superAgentForm.patchValue({ sharePerDis: this.item?.masterAgentKyc?.shareholders?.permDistrict || 'NIL' })
    // this.superAgentForm.patchValue({ sharePerPro: this.item?.masterAgentKyc?.shareholders?.permProvince || 'NIL' })
    // this.superAgentForm.patchValue({ sharePerCount: this.item?.masterAgentKyc?.shareholders?.permCountry || 'NIL' })
    //old signatories auth
    // this.superAgentForm.patchValue({ firstNameAuth: this.item?.masterAgentKyc?.signatories?.firstName || 'NIL' })
    // this.superAgentForm.patchValue({ lastNameAuth: this.item?.masterAgentKyc?.signatories?.lastName || 'NIL' })
    // this.superAgentForm.patchValue({ tazkiraAuth: this.item?.masterAgentKyc?.signatories?.idProofNumber || 'NIL' })
    // this.superAgentForm.patchValue({ dobAuth: this.item?.masterAgentKyc?.signatories?.dob || 'NIL' })
    // this.superAgentForm.patchValue({ birthPlaceAuth: this.item?.masterAgentKyc?.signatories?.placeOfBirth || 'NIL' })
    // this.superAgentForm.patchValue({ NationalityAuth: this.item?.masterAgentKyc?.signatories?.nationality || 'NIL' })
    // console.log("signatoryNationality", this.item?.masterAgentKyc?.signatories?.nationality)
    // this.superAgentForm.patchValue({ designationAuth: this.item?.masterAgentKyc?.signatories?.designation || 'NIL' })
    // this.superAgentForm.patchValue({ resiAuth: this.item?.masterAgentKyc?.signatories?.residentAddress || 'NIL' })
    // this.superAgentForm.patchValue({ phAuth: this.item?.masterAgentKyc?.signatories?.phone || 'NIL' })
    // this.superAgentForm.patchValue({ srcAuth: this.item?.masterAgentKyc?.signatories?.sourceOfIncome || 'NIL' })
    // this.superAgentForm.patchValue({ incomeAuth: this.item?.masterAgentKyc?.signatories?.monthlyIncome || 'NIL' })
    // this.superAgentForm.patchValue({ typeAuth: this.item?.masterAgentKyc?.signatories?.makerChecker || 'NIL' })
    // //new
    // this.superAgentForm.patchValue({ incomeSourceOrgAuth: this.item?.masterAgentKyc?.signatories?.sourceOfIncome || 'NIL' })
    //
    this.superAgentForm.patchValue({ KycProcessed: this.item?.masterAgentKyc?.kycProcessedBy || 'NIL' })
    this.superAgentForm.patchValue({ KycProcessedDate: this.item?.masterAgentKyc?.kycProcessedDate || 'NIL' })
    this.superAgentForm.patchValue({ Verified: this.item?.masterAgentKyc?.verifiedByOps || 'NIL' })
    this.superAgentForm.patchValue({ VerifiedDate: this.item?.masterAgentKyc?.verifiedByOpsDate || 'NIL' })
    this.superAgentForm.patchValue({ Compliance: this.item?.masterAgentKyc?.approvedByCompliance || 'NIL' })
    this.superAgentForm.patchValue({ ComplianceDate: this.item?.masterAgentKyc?.approvedByComplianceDate || 'NIL' })
    //old patchvalue
    //abmmc verify
    this.firstNameValue = this.item?.submittedFor?.firstName
    this.kycProcessed = this.item?.submittedFor?.firstName + ' ' + this.item?.submittedFor?.lastName;
    this.kycProcessedDate = this.item?.masterAgentKyc?.kycProcessedDate;
    this.VerifiedOp = this.item?.masterAgentKyc?.custInfoFirstName;
    this.VerifiedOpDate = this.item?.masterAgentKyc?.custInfoFatherName;
    this.compliance = this.item?.masterAgentKyc?.custInfoFirstName;
    this.complianceDate = this.item?.masterAgentKyc?.custInfoFirstName;
    // for (let item of this.users) {
    // if (this.kycId == this.item?.id) {
    this.walletaccounts = this.item?.submittedFor?.walletAccount
    console.log(" this.walletaccounts", this.walletaccounts);
    //end

    //new image section
    if (this.item?.newValues && !Array.isArray(this.item.newValues)) {
      const img = this.item.newValues;
      const fullUrl = img.filePath;
      if (this.NEW_IMAGE_NAME_MAP[img.mapping]) {
        this.newImageFileLists.push({
          name: this.NEW_IMAGE_NAME_MAP[img.mapping],
          url: fullUrl
        });
      }
    }
    if (this.item?.newValues?.mapping === 'otherDocs') {
      const docs = this.item.newValues.filePath.split(',');
      let i = 1;
      for (const file of docs) {
        this.newImageFileLists.push({
          name: `Other Document - ${i}`,
          url: file
        });
        i++;
      }
    }
    // if (this.item?.newValues?.shareholderId) {
    //   const labelMap: any = {
    //     idProofFrontPhoto: 'Id Proof Front Photo',
    //     idProofBackPhoto: 'Id Proof Back Photo'
    //   };

    //   this.newImageFileLists.push({
    //     name: `Shareholder ${labelMap[this.item.newValues.mapping] || 'Document'} `,
    //     url: this.item.newValues.filePath
    //   });
    // }
    // SHAREHOLDER
    console.log("this.item?.newValues?.shareholderId", this.item?.newValues?.shareholderId);
    if (this.item?.newValues?.shareholderId) {
      const labelMap: any = {
        idProofFrontPhoto: 'Id Proof Front Photo',
        idProofBackPhoto: 'Id Proof Back Photo'
      };

      const shareholders = this.item?.masterAgentKyc?.shareholders || [];

      const index = shareholders.findIndex(
        (sh: any) => sh.id === this.item.newValues.shareholderId
      );
      const number = index !== -1 ? index + 1 : '';

      this.newImageFileLists.push({
        name: `Shareholder ${number} ${labelMap[this.item.newValues.mapping] || 'Document'}`,
        url: this.item.newValues.filePath
      });
    }
    // if (this.item?.newValues?.signatoryId) {

    //   const labelMap: any = {
    //     idProofFrontPhoto: 'Id Proof Front Photo',
    //     idProofBackPhoto: 'Id Proof Back Photo',
    //     signatoryPhoto: 'Signatory Photo',
    //     signaturePhoto: 'Signature Photo'
    //   };

    //   this.newImageFileLists.push({
    //     name: `Authorized Signatory ${labelMap[this.item.newValues.mapping] || 'Document'} `,
    //     url: this.item.newValues.filePath
    //   });
    // }
    if (this.item?.newValues?.signatoryId) {
      const labelMap: any = {
        idProofFrontPhoto: 'Id Proof Front Photo',
        idProofBackPhoto: 'Id Proof Back Photo',
        signatoryPhoto: 'Signatory Photo',
        signaturePhoto: 'Signature Photo'
      };

      const signatories = this.item?.masterAgentKyc?.signatories || [];

      const index = signatories.findIndex(
        (sg: any) => sg.id === this.item.newValues.signatoryId
      );

      const number = index !== -1 ? index + 1 : '';

      this.newImageFileLists.push({
        name: `Authorized Signatory ${number} ${labelMap[this.item.newValues.mapping] || 'Document'}`,
        url: this.item.newValues.filePath
      });
    }
    // new image section

    // this.getProducts();
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

    // for (let item of this.allUsers) {
    if (this.userName == this.item?.submittedFor?.email) {
      this.showUpdate = true
    }
    // }

    const shareholders = this.item?.masterAgentKyc?.shareholders || [];
    const signatories = this.item?.masterAgentKyc?.signatories || [];

    let presidentName: string | null = null;
    let vicePresidentName: string | null = null;
    let presidentSignature: string | null = null;
    let vicePresidentSignature: string | null = null;

    shareholders.forEach((shareholder: any) => {
      const fullName = `${shareholder.firstName} ${shareholder.lastName}`;
      const match = signatories.find((sign: any) => sign.idProofNumber === shareholder.idProofNumber);

      if (shareholder.relationship.includes('PRESIDENT')) {
        if (match && !presidentName) {
          presidentName = fullName;
          presidentSignature = match.signaturePhoto;
        } else if (!presidentName) {
          presidentName = fullName;
        }
      }

      if (shareholder.relationship.includes('VICE_PRESIDENT')) {
        if (match && !vicePresidentName) {
          vicePresidentName = fullName;
          vicePresidentSignature = match.signaturePhoto;
        } else if (!vicePresidentName) {
          vicePresidentName = fullName;
        }
      }
    });

    // Final assignment based on priority
    if (presidentName) {
      this.presidentVicepresidentName = presidentName;
      this.getImages(presidentSignature, 'presidentViceImg');
    } else if (vicePresidentName) {
      this.presidentVicepresidentName = vicePresidentName;
      this.getImages(vicePresidentSignature, 'presidentViceImg');

    }

  }
  // isFieldChanged(oldValue: any, newValue: any): boolean {
  //   const normalize = (val: any) => {
  //     if (val === null || val === undefined) return '';
  //     const v = val.toString().trim().toUpperCase();
  //     if (v === 'NIL') return '';
  //     return v;
  //   };
  //   return normalize(oldValue) !== normalize(newValue);
  // }
  isFieldChanged(oldValue: any, newValue: any): boolean {
    // VERY IMPORTANT:
    // if new value not provided → treat as unchanged
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
        this.item?.masterAgentKyc?.[masterField],
        this.item?.newValues?.[newField]
      )
    );
  }
  // for share
  showChangedShareholderField(index: number, field: string): boolean {
    return (
      this.userStatus === 'PENDING' &&
      this.item?.editType === 'KYC_DATA' &&
      this.isFieldChanged(
        this.item?.masterAgentKyc?.shareholders?.[index]?.[field],
        this.item?.newValues?.shareholders?.[index]?.[field]
      )
    );
  }
  // for signatory
  showChangedSignatoryField(index: number, field: string): boolean {
    return (
      this.userStatus === 'PENDING' &&
      this.item?.editType === 'KYC_DATA' &&
      this.isFieldChanged(
        this.item?.masterAgentKyc?.signatories?.[index]?.[field],
        this.item?.newValues?.signatories?.[index]?.[field]
      )
    );
  }
  // resetWatchlistIfPending() {
  //   if (this.item?.status === 'PENDING') {
  //     this.watchYes.reset(false, { emitEvent: false });
  //     this.watchNo.reset(false, { emitEvent: false });

  //     this.watchYes.enable();
  //     this.watchNo.enable();

  //     // this.watchYes.disable();
  //     // this.watchNo.disable();

  //     // this.watchTarget = null;
  //     // this.sdnChecked = false;
  //   }
  // }
  // isShareholderFieldChanged(i: number, field: string): boolean {
  //   const oldVal =
  //     this.item?.masterAgentKyc?.shareholders?.[i]?.[field];
  //   const newVal =
  //     this.item?.newValues?.shareholders?.[i]?.[field];

  //   console.log('COMPARE', { i, field, oldVal, newVal });

  //   if (newVal == null) return false;

  //   return String(oldVal ?? '').trim() !== String(newVal ?? '').trim();
  // }
  isShareholderFieldChanged(i: number, field: string): boolean {
    const oldVal = this.item?.masterAgentKyc?.shareholders?.[i]?.[field];
    const newVal = this.item?.newValues?.shareholders?.[i]?.[field];

    // protect against undefined
    if (newVal === undefined || newVal === null) {
      return false;
    }

    return oldVal !== newVal;
  }

  //share validation while update
  validateName(
    value: string,
    i: number,
    field: 'firstName' | 'lastName' | 'fatherName'
  ) {
    const v = value?.trim();

    // 🔹 SAFETY INITIALIZATION (THIS IS THE KEY FIX)
    if (!this.nameErrors[i]) {
      this.nameErrors[i] = {};
    }

    if (!this.nameErrors[i][field]) {
      this.nameErrors[i][field] = {};
    }

    // reset previous errors
    this.nameErrors[i][field]!.required = false;
    this.nameErrors[i][field]!.pattern = false;

    // required check
    if (!v || v === 'nil') {
      this.nameErrors[i][field]!.required = true;
      return;
    }

    // pattern check
    const pattern = /^[a-zA-Z0-9 ]+$/;
    if (!pattern.test(v)) {
      this.nameErrors[i][field]!.pattern = true;
    }
  }
  validatePhone(value: string, i: number) {
    const v = value?.trim();
    this.phoneErrors[i] = {
      required: false,
      pattern: false
    };
    if (!v || v === 'nil') {
      this.phoneErrors[i].required = true;
      return;
    }
    const phonePattern = /^7\d{8}$/; // 7XXXXXXXX
    if (!phonePattern.test(v)) {
      this.phoneErrors[i].pattern = true;
    }
  }
  validateDob(value: string, i: number) {
    this.dobErrors[i] = {}; // reset errors

    if (!value || value === 'nil') return;

    const dob = new Date(value);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18) {
      this.dobErrors[i].underage = true;
    }

    if (age > 100) {
      this.dobErrors[i].overage = true;
    }
  }
  //auth validation while update
  validateAuthName(
    value: string,
    i: number,
    field: 'firstName' | 'lastName'
  ) {
    const v = value?.trim();

    // ✅ ensure row exists
    if (!this.authNameErrors[i]) {
      this.authNameErrors[i] = {};
    }

    // ✅ ensure field object exists
    this.authNameErrors[i][field] = {
      required: false,
      pattern: false
    };

    // REQUIRED
    if (!v || v === 'nil') {
      this.authNameErrors[i][field]!.required = true;
      return;
    }

    // PATTERN
    const pattern = /^[a-zA-Z0-9 ]+$/;
    if (!pattern.test(v)) {
      this.authNameErrors[i][field]!.pattern = true;
    }
  }
  validateAuthPhone(value: string, i: number) {
    const v = value?.trim();
    this.authPhoneErrors[i] = { required: false, pattern: false };
    if (!v || v === 'nil') {
      this.authPhoneErrors[i].required = true;
      return;
    }
    const pattern = /^7\d{8}$/;
    if (!pattern.test(v)) {
      this.authPhoneErrors[i].pattern = true;
    }
  }
  validateAuthEmail(value: string, i: number) {
    const v = value?.trim();
    this.authEmailErrors[i] = { required: false, pattern: false };
    if (!v || v === 'nil') {
      this.authEmailErrors[i].required = true;
      return;
    }
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(v)) {
      this.authEmailErrors[i].pattern = true;
    }
  }
  validateAuthDob(value: string, i: number) {
    // 🔐 Ensure row exists
    if (!this.authDobErrors[i]) {
      this.authDobErrors[i] = {};
    }
    // reset
    this.authDobErrors[i] = {};
    if (!value) {
      this.authDobErrors[i].required = true;
      return;
    }
    const dob = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    if (age < 18) {
      this.authDobErrors[i].underage = true;
    } else if (age > 100) {
      this.authDobErrors[i].overage = true;
    }
  }

  onCountryChange(val: string) {
    console.log("Country changed:", val);
  }
  onInputChange(value: string) {
    console.log("Typed:", value);
  }
  initForm() {
    this.remarkForm.addControl('remark', this.remark)
    this.compForm.addControl('ComplianceInput', this.ComplianceInput)
    this.compForm.addControl('ComplianceDateInput', this.ComplianceDateInput)
  }
  //  toggleReadOnly(event: Event): void {
  //     const checkbox = event.target as HTMLInputElement;;
  //     this.readOnly = !checkbox.checked
  //   }
  //new update
  toggleReadOnly(event: Event): void {
    const checkbox = event.target as HTMLInputElement;

    this.readOnly = !checkbox.checked; // Set `readOnly` based on checkbox state
    if (checkbox.checked) {
      this.showUpdateBtn = checkbox.checked
      //new
      this.showBizNature = true
      this.item?.masterAgentKyc?.shareholders?.forEach((sh: any, i: number) => {

        // restore countries
        this.currCountryMap[i] = sh?.currCountry;
        this.permCountryMap[i] = sh?.permCountry;

        // restore provinces
        this.currProvinceMap[i] = sh?.currProvince;
        this.permProvinceMap[i] = sh?.permProvince;

        // restore districts
        this.currDistrictMap[i] = sh?.currDistrict;
        this.permDistrictMap[i] = sh?.permDistrict;

        //restore nationality
        this.nationalityShareMap[i] = sh?.nationality;
      });

      this.getCountries();
      this.getAccPurpose();
      this.getIncomeSource();
      this.getNatureofBusiness();

      this.getProvincesCur();
      this.getProvincesPer();
      this.getProvinces();
      //new
      /* setTimeout(() => { */
        this.item?.masterAgentKyc?.shareholders?.forEach((sh: any, i: number) => {

          const curProv = this.provincesCurMap[i]
            ?.find((p: any) => p.name === this.currProvinceMap[i]);

          if (curProv) {
            this.getDistrictsCur(i, curProv.id);
          }

          const perProv = this.provincesPerMap[i]
            ?.find((p: any) => p.name === this.permProvinceMap[i]);

          if (perProv) {
            this.getDistrictsPer(i, perProv.id);
          }

        });
      /* }); */
      //
      this.FemaleChecked.enable();
      this.MaleChecked.enable();
      // this.married.enable();
      // this.single.enable();
      //curr and per

      //
      this.showCountryDrop = true
      this.showProvinceDrop = true
      this.showDistrictDrop = true
      this.showDistrictText = false
      this.showProvinceText = false
      this.showCountryText = false
      this.isgrossAnnualIncome = true
      this.isdistrict = true
      this.iscountry = true
      this.isprovince = true
      //birth place
      // this.showBirthCountryText = false
      // this.showBirthCountryDrop = true
      // this.showBirthProvinceText = false
      // this.showBirthProvinceDrop = true
      //nationality
      this.showNationalityDrop = true
      this.showNationalityText = false
      this.showNationalityAuthDrop = true
      this.showNationalityAuthText = false
      //source
      this.showSourceDrop = true
      this.showSourceText = false
      this.showSourceAuthDrop = true
      this.showSourceAuthText = false
      //nature
      // this.showNatureDrop = true
      // this.showNatureText = false
      //purpose
      this.showPurposeDrop = true
      this.showPurposeText = false

    }
    else {
      this.showUpdateBtn = false;
      this.FemaleChecked.disable();
      this.MaleChecked.disable();
      // this.married.disable();
      // this.single.disable();

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
      this.showNationalityAuthDrop = false
      this.showNationalityAuthText = true
      //source
      this.showSourceDrop = false
      this.showSourceText = true
      this.showSourceAuthDrop = false
      this.showSourceAuthText = true
      //nature
      this.showNatureDrop = false
      this.showNatureText = true
      //purpose
      this.showPurposeDrop = false
      this.showPurposeText = true
    }
  }
  getCountries() {
    this.corporate.getCountries().subscribe({
      next: (data: any) => {
        this.nationalities = data?.data;
      }
    });
  }
  getNatureofBusiness() {
    this.corporate.getNatureOfBusiness().subscribe({
      next: (data: any) => {
        this.natureOfBusinessData = data?.data;
      }
    });
  }
  getIncomeSource() {
    this.corporate.getIncomeSource().subscribe({
      next: (data: any) => {
        this.incomeSourceData = data?.data;
      }
    });
  }
  getDistricts(provinceId: number) {
    this.corporate.getdistricts(provinceId).subscribe({
      next: (data: any) => {
        this.districts = data?.data;
      }
    });
  }
  onProvinceChange(selectedProvinceName: string) {
        // Find the province by its name in the list
    const selectedProvince = this.provinces.find((province: any) => province.name === selectedProvinceName);
    console.log("Selected Province Object:", selectedProvinceName);

    if (selectedProvince) {
      // Now you can pass the province id to getDistricts
      this.getDistricts(selectedProvince.id);
    }
  }
  getProvince$(): Observable<any[]> {
      return this.corporate.getprovinces().pipe(
        map((res: any) => res?.data || [])
      );
    }
  getAccPurpose() {
    this.corporate.getAccPurpose().subscribe({
      next: (data: any) => {
        this.accPurposeData = data?.data;
      }
    });
  }
  onChangeBirthCountryDrop($event: any) {
    this.BirthCountryValue = $event.target.value
    this.getProvincesBirth();
    this.onSelectBirthProvinceDrop(this.BirthCountryValue, $event);
  }
  onSelectBirthProvinceDrop(BirthCountryValue: any, $event: any) {
    this.BirthProvinceValue = BirthCountryValue;
    console.log("BirthProvinceValue", this.BirthProvinceValue);
  }
  onChangeCountryCur(i: number, $event: any) {
    const value = $event.target.value;

    this.currCountryMap[i] = value;
    this.countryNameCurMap[i] = value;

    this.currProvinceMap[i] = null;
    this.districtsCurMap[i] = [];

    this.getProvincesCur(i);
  }
  onChangeCountryPer(i: number, $event: any) {
    const value = $event.target.value;

    this.permCountryMap[i] = value;
    this.countryNamePerMap[i] = value;

    this.permProvinceMap[i] = null;
    this.districtsPerMap[i] = [];

    this.getProvincesPer(i);
  }
  getProvincesBirth() {
    this.corporate.getprovinces().subscribe({
      next: (data: any) => {
        // this.provinces = data?.data;
        this.provincesBirth = Array.isArray(data?.data) ? data?.data : [];
        console.log("Provinces fetched:", this.provinces);
      }
    });
  }
  getProvinces() {
    this.corporate.getprovinces().subscribe({
      next: (data: any) => {
        // this.provinces = data?.data;
        this.provinces = Array.isArray(data?.data) ? data?.data : [];
        console.log("Provinces fetched:", this.provinces);
      }
    });
  }
  getProvincesCur(i?: number) {
    this.corporate.getprovinces().subscribe({
      next: (res: any) => {
        const data = res?.data || [];

        if (i !== undefined) {
          this.provincesCurMap[i] = data;

          const selected = data.find((p: any) => p.name === this.currProvinceMap[i]);
          if (selected) {
            this.getDistrictsCur(i, selected.id);
          }

        } else {
          this.item?.masterAgentKyc?.shareholders?.forEach((sh: any, index: number) => {
            this.provincesCurMap[index] = data;

            const selected = data.find((p: any) => p.name === this.currProvinceMap[index]);
            if (selected) {
              this.getDistrictsCur(index, selected.id);
            }
          });
        }
      }
    });
  }
  getProvincesPer(i?: number) {
    this.corporate.getprovinces().subscribe({
      next: (res: any) => {
        const data = res?.data || [];

        if (i !== undefined) {
          this.provincesPerMap[i] = data;

          const selected = data.find((p: any) => p.name === this.permProvinceMap[i]);
          if (selected) {
            this.getDistrictsPer(i, selected.id);
          }

        } else {
          this.item?.masterAgentKyc?.shareholders?.forEach((sh: any, index: number) => {
            this.provincesPerMap[index] = data;

            const selected = data.find((p: any) => p.name === this.permProvinceMap[index]);
            if (selected) {
              this.getDistrictsPer(index, selected.id);
            }
          });
        }
      }
    });
  }
  // getProvincesCur(i: number) {
  //   this.corporate.getprovinces().subscribe({
  //     next: (res: any) => {
  //       this.provincesCurMap[i] = res?.data || [];
  //     }
  //   });
  // }
  // getProvincesPer(i: number) {
  //   this.corporate.getprovinces().subscribe({
  //     next: (res: any) => {
  //       this.provincesPerMap[i] = res?.data || [];
  //     }
  //   });
  // }
  onSelectProvinceCurr(i: number, countryNameCur: any, $event: any) {
    const value = $event.target.value;
    this.currProvinceMap[i] = value;

    const province = this.provincesCurMap[i]?.find((p: any) => p.name === value);
    if (province) {
      this.selectedProvinceCurMap[i] = province.id;
      this.getDistrictsCur(i, province.id);
    }
  }
  onSelectProvincePer(i: any, countryNamePer: any, $event: any) {
    const value = $event.target.value;
    this.permProvinceMap[i] = value;

    const province = this.provincesPerMap[i]?.find((p: any) => p.name === value);
    if (province) {
      this.selectedProvincePerMap[i] = province.id;
      this.getDistrictsPer(i, province.id);
    }
  }
  getDistrictsCur(index: number, provinceId: number) {
  this.corporate.getdistricts(provinceId).subscribe((res: any) => {
    this.districtsCurMap[index] = res?.data || [];
    // ✅ Set selected value AFTER districts load
    const savedDistrict = this.currDistrictMap[index];
    if (savedDistrict) {
      const match = this.districtsCurMap[index]
        .find((d: any) => d.name === savedDistrict);

      if (match) {
        this.currDistrictMap[index] = match.name;
      }
      else{
        // If no match found, clear the district selection
        this.currDistrictMap[index] = '';
      }
    }
  });
}
  getDistrictsPer(index: number, provinceId: number) {
  this.corporate.getdistricts(provinceId).subscribe((res: any) => {

    this.districtsPerMap[index] = res?.data || [];

    const savedDistrict = this.permDistrictMap[index];

    if (savedDistrict) {
      const match = this.districtsPerMap[index]
        .find((d: any) => d.name === savedDistrict);

      if (match) {
        this.permDistrictMap[index] = match.name;
      }
      else {
        // If no match found, clear the district selection
        this.permDistrictMap[index] = '';
      }
    }
  });
}
  //new update
  //old
  //  onChangeCountryCur(i: any, $event: any) {
  //   this.currCountryMap[i] = $event.target.value;
  //   this.countryNameCur = $event.target.value
  //   this.getProvinces();
  //   console.log("this.countryNameCur", this.countryNameCur)
  //   this.onSelectProvinceCurr(i, this.countryNameCur, $event);
  // }
  // onChangeCountryPer(i: any, $event: any) {
  //   this.permCountryMap[i] = $event.target.value;
  //   this.countryNamePer = $event.target.value
  //   this.getProvinces();
  //   console.log("this.countryNamePer", this.countryNamePer)
  //   this.onSelectProvincePer(i, this.countryNamePer, $event);
  // }
  // onSelectProvinceCurr(i: any, countryNameCur: any, $event: any) {
  //   this.currProvinceMap[i] = $event.target.value;
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
  // onSelectProvincePer(i: any, countryNamePer: any, $event: any) {
  //   this.permProvinceMap[i] = $event.target.value;
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
  //   this.corporate.getdistricts(provinceId).subscribe({
  //     next: (data: any) => {
  //       this.districtsCur = data?.data;
  //     }
  //   });
  // }
  // getDistrictsPer(provinceId: number) {
  //   this.corporate.getdistricts(provinceId).subscribe({
  //     next: (data: any) => {
  //       this.districtsPer = data?.data;
  //     }
  //   });
  // }
  onSourceChange(event: Event, i: number) {
    const value = (event.target as HTMLSelectElement).value;
    this.sourceAuthMap[i] = value;
  }
  onNationalityChange(event: Event, i: number) {
    const value = (event.target as HTMLSelectElement).value;
    this.nationalityAuthMap[i] = value;
  }
  onNationalityShareChange(event: Event, i: number) {
    const value = (event.target as HTMLSelectElement).value;
    this.nationalityShareMap[i] = value;
  }
  setFieldValue(key: string, value: any) {
    this.superAgentForm.patchValue({ [key]: value ?? 'nil' });
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

  isFileInOtherDocs(fileUrl: string): any {
    if (this.item?.masterAgentKyc?.otherDocs) {
      const relativePath = fileUrl.split('/').slice(-2).join('/'); // Extract relative path
      return this.otherdocsorNot.split(',').includes(relativePath);
    }
  }
  viewShareholder() {
    console.log("shareHolderArray1", this.shareHolderArray);
    this.KycService.setShareHolderArray(this.kycId);
    this.router.navigate(["kyc/view-shareholder-details", this.kycId]);
    // this.router.navigateByUrl("kyc/view-shareholder-details");
  }
  viewAuthSignatory() {
    // this.authorizedSignArray = authorizedArray
    console.log("authorizedSignArray1", this.authorizedSignArray);
    this.KycService.setShareHolderArray(this.kycId);
    // this.router.navigate(['kyc/view-authorized-signatory-details']);
    this.router.navigate(["kyc/view-authorized-signatory-details", this.kycId]);

  }
  viewFile(fileUrl: string) {
    console.log(fileUrl, 'viewFile')
    // window.open(fileUrl, '_blank');  // Opens the file in a new tab
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
  // Function to print the file
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
  deleteFile(index: number) {
    // Get the full file URL from fileLists
    const fileUrl = this.fileLists[index].url;
    console.log(fileUrl);

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
        this.KycService.deleteMasterAgentMultipleDoc(req, this.submittedForId).subscribe((data: any) => {
          if (data?.responseCode === 200) {
            alert('File deleted successfully');
            this.router.navigate(["kyc/agent"]);
          } else {
            alert(`Error deleting file`);
          }
        });
      }
      else if (this.userStatus == 'APPROVED') {
        let req = {
          "otherDocs": [
            photoId,
          ]
        }
        this.KycService.deleteMasterAgentMultipleDocByMaker(req, this.submittedForId).subscribe((data: any) => {
          if (data?.responseCode === 200) {
            alert('File deleted successfully');
            this.router.navigate(["kyc/agent"]);
          } else {
            alert(`Error deleting file`);
          }
        });
      }
    }
  }
  onChangeGetProduct($event: any) {
    this.productId = $event.target.value
  }
  getProducts() {
    this.KycService.getSuperProducts().subscribe((data: any) => {
      this.products = data
      console.log('Fetched products:', data);
    })
  }
  onPermDistrictChange(i: number, event: any) {
    this.permDistrictMap[i] = event.target.value;
  }
  onCurrDistrictChange(i: number, event: any) {
    this.currDistrictMap[i] = event.target.value;
  }
  private v(value: any): any {
    if (value === undefined || value === null) return null;
    const v = String(value).trim().toUpperCase();
    return v === '' || v === 'NIL' ? null : value;
  }
  // shareholderList() {
  //   const shareholdersList: any[] = [];

  //   const cleanup = (v: any) =>
  //     v === undefined || v === null || v === "" || v === "nil" ? null : v;

  //   // convert QueryLists to arrays once
  //   const arrFirstNames = this.shareFirstNames.toArray();
  //   const arrLastNames = this.shareLastNames.toArray();
  //   const arrFatherNames = this.shareFatherNames.toArray();
  //   const arrDobs = this.shareDobs.toArray();
  //   const arrTazkiras = this.shareTazkiras.toArray();
  //   const arrBirthPlaces = this.shareBirthPlaces.toArray();
  //   const arrRelations = this.shareRelations.toArray();
  //   const arrPercs = this.sharePercs.toArray();
  //   const arrPhones = this.sharePhones.toArray();
  //   const arrIncomes = this.shareIncomes.toArray();
  //   const arrTins = this.shareTins.toArray();
  //   const arrOtherSrcs = this.shareOtherSrcs.toArray();
  //   const arrCurrLocs = this.shareCurrLoc.toArray();
  //   const arrPerLocs = this.sharePerLoc.toArray();

  //   // Original readonly input elements for Country/Province/District
  //   const arrCurrCountryInputs = this.shareCurrCoun.toArray();
  //   const arrPermCountryInputs = this.shareperCoun.toArray();
  //   const arrCurrProInputs = this.shareCurrPro.toArray();
  //   const arrPermProInputs = this.sharePerPro.toArray();
  //   const arrCurrDistrictInputs = this.shareCurrDis.toArray();
  //   const arrPermDistrictInputs = this.sharePerDis.toArray();

  //   // nationality from form
  //   const nationalityText = this.superAgentForm.get('Nationality')?.value;
  //   const nationalityDrop = this.superAgentForm.get('nationalityDrop')?.value;
  //   const nationalityReq = cleanup(nationalityDrop || nationalityText);

  //   this.shareFirstNames.forEach((_, i) => {
  //     const backend = this.item?.masterAgentKyc?.shareholders?.[i];

  //     // --------- CURRENT & PERMANENT COUNTRY ---------
  //     const currCountryInput = arrCurrCountryInputs[i]?.nativeElement?.value;
  //     const currCountryDropdown = this.superAgentForm.get('countryAddressDrop')?.value;
  //     const currCountry =
  //       currCountryDropdown && currCountryDropdown !== backend?.currCountry
  //         ? currCountryDropdown
  //         : currCountryInput;

  //     const permCountryInput = arrPermCountryInputs[i]?.nativeElement?.value;
  //     const permCountryDropdown = this.superAgentForm.get('perCountryDrop')?.value;
  //     const permCountry =
  //       permCountryDropdown && permCountryDropdown !== backend?.permCountry
  //         ? permCountryDropdown
  //         : permCountryInput;

  //     // --------- CURRENT & PERMANENT PROVINCE ---------
  //     const currProvinceInput = arrCurrProInputs[i]?.nativeElement?.value;
  //     const currProvinceDropdown = this.superAgentForm.get('provinceAddressDrop')?.value;
  //     const currProvince =
  //       currProvinceDropdown && currProvinceDropdown !== backend?.currProvince
  //         ? currProvinceDropdown
  //         : currProvinceInput;

  //     const permProvinceInput = arrPermProInputs[i]?.nativeElement?.value;
  //     const permProvinceDropdown = this.superAgentForm.get('permanentProvinceDrop')?.value;
  //     const permProvince =
  //       permProvinceDropdown && permProvinceDropdown !== backend?.permProvince
  //         ? permProvinceDropdown
  //         : permProvinceInput;

  //     // --------- CURRENT & PERMANENT DISTRICT ---------
  //     const currDistrictInput = arrCurrDistrictInputs[i]?.nativeElement?.value;
  //     const currDistrictDropdown = this.superAgentForm.get('districtAddressDrop')?.value;
  //     const currDistrict =
  //       currDistrictDropdown && currDistrictDropdown !== backend?.currDistrict
  //         ? currDistrictDropdown
  //         : currDistrictInput;

  //     const permDistrictInput = arrPermDistrictInputs[i]?.nativeElement?.value;
  //     const permDistrictDropdown = this.superAgentForm.get('permanentDistrictDrop')?.value;
  //     const permDistrict =
  //       permDistrictDropdown && permDistrictDropdown !== backend?.permDistrict
  //         ? permDistrictDropdown
  //         : permDistrictInput;

  //     // --------- LOCATION ---------
  //     const currLocationRaw = arrCurrLocs[i]?.nativeElement?.value;
  //     const currLocation =
  //       currLocationRaw === backend?.currLocation ? backend?.currLocation : currLocationRaw;

  //     const permLocationRaw = arrPerLocs[i]?.nativeElement?.value;
  //     const permLocation =
  //       permLocationRaw === backend?.permLocation ? backend?.permLocation : permLocationRaw;

  //     // --------- MONTHLY INCOME ---------
  //     let incomeRaw = arrIncomes[i]?.nativeElement?.value;
  //     incomeRaw = cleanup(incomeRaw);
  //     const monthlyIncome = incomeRaw ? incomeRaw.toString().replace(/[^0-9.]/g, "") : null;

  //     // --------- BUILD SHAREHOLDER OBJECT ---------
  //     const shareholder = {
  //       firstName: cleanup(arrFirstNames[i]?.nativeElement?.value),
  //       lastName: cleanup(arrLastNames[i]?.nativeElement?.value),
  //       fatherName: cleanup(arrFatherNames[i]?.nativeElement?.value),
  //       dob: cleanup(arrDobs[i]?.nativeElement?.value),
  //       idProofNumber: cleanup(arrTazkiras[i]?.nativeElement?.value),
  //       placeOfBirth: cleanup(arrBirthPlaces[i]?.nativeElement?.value),
  //       relationship: cleanup(arrRelations[i]?.nativeElement?.value),
  //       nationality: cleanup(nationalityReq),
  //       shareholdingPercentage: cleanup(arrPercs[i]?.nativeElement?.value),
  //       phone: cleanup(arrPhones[i]?.nativeElement?.value),
  //       monthlyIncome: cleanup(monthlyIncome),
  //       tinNumber: cleanup(arrTins[i]?.nativeElement?.value),
  //       sourceOfIncome: cleanup(arrOtherSrcs[i]?.nativeElement?.value),

  //       currCountry: cleanup(currCountry),
  //       currProvince: cleanup(currProvince),
  //       currDistrict: cleanup(currDistrict),
  //       currLocation: cleanup(currLocation),

  //       permCountry: cleanup(permCountry),
  //       permProvince: cleanup(permProvince),
  //       permDistrict: cleanup(permDistrict),
  //       permLocation: cleanup(permLocation),
  //     };

  //     shareholdersList.push(shareholder);
  //   });

  //   console.log("Final Shareholders Payload:", shareholdersList);
  //   return shareholdersList;
  // }
  shareholderList() {
    const shareholdersList: any[] = [];

    const cleanup = (v: any) =>
      v === undefined || v === null || v === '' || v === 'nil' ? null : v;

    // Convert QueryLists to arrays
    const arrFirstNames = this.shareFirstNames.toArray();
    const arrLastNames = this.shareLastNames.toArray();
    const arrFatherNames = this.shareFatherNames.toArray();
    const arrDobs = this.shareDobs.toArray();
    const arrTazkiras = this.shareTazkiras.toArray();
    const arrBirthPlaces = this.shareBirthPlaces.toArray();
    const arrRelations = this.shareRelations.toArray();
    const arrPercs = this.sharePercs.toArray();
    const arrPhones = this.sharePhones.toArray();
    const arrIncomes = this.shareIncomes.toArray();
    const arrTins = this.shareTins.toArray();
    const arrOtherSrcs = this.shareOtherSrcs.toArray();
    const arrCurrLocs = this.shareCurrLoc.toArray();
    const arrPerLocs = this.sharePerLoc.toArray();

    // Readonly text inputs
    const arrCurrCountryInputs = this.shareCurrCoun.toArray();
    const arrPermCountryInputs = this.shareperCoun.toArray();
    const arrCurrProInputs = this.shareCurrPro.toArray();
    const arrPermProInputs = this.sharePerPro.toArray();
    const arrCurrDistrictInputs = this.shareCurrDis.toArray();
    const arrPermDistrictInputs = this.sharePerDis.toArray();
    const arrNationalityInputs = this.shareNationalities.toArray();
    console.log('arrNationalityInputs:', arrNationalityInputs);

    // Nationality
    // const nationalityText = this.superAgentForm.get('Nationality')?.value;
    // const nationalityDrop = this.superAgentForm.get('nationalityDrop')?.value;
    // const nationalityReq = cleanup(nationalityDrop || nationalityText);

    this.shareFirstNames.forEach((_, i) => {
      const backend = this.item?.masterAgentKyc?.shareholders?.[i];

      /* ================= NATIONALITY ================= */
      const nationalityReq =
        this.nationalityShareMap?.[i] ??
        arrNationalityInputs[i]?.nativeElement?.value ??
        backend?.nationality ??
        null;
      console.log('nationalityReq:', nationalityReq);

      /* ================= COUNTRY ================= */
      const currCountry =
        this.currCountryMap?.[i] ??
        arrCurrCountryInputs[i]?.nativeElement?.value ??
        backend?.currCountry ??
        null;

      const permCountry =
        this.permCountryMap?.[i] ??
        arrPermCountryInputs[i]?.nativeElement?.value ??
        backend?.permCountry ??
        null;

      /* ================= PROVINCE ================= */
      const currProvince =
        this.currProvinceMap?.[i] ??
        arrCurrProInputs[i]?.nativeElement?.value ??
        backend?.currProvince ??
        null;

      const permProvince =
        this.permProvinceMap?.[i] ??
        arrPermProInputs[i]?.nativeElement?.value ??
        backend?.permProvince ??
        null;

      /* ================= DISTRICT ================= */
      const currDistrict =
        this.currDistrictMap?.[i] ??
        arrCurrDistrictInputs[i]?.nativeElement?.value ??
        backend?.currDistrict ??
        null;

      const permDistrict =
        this.permDistrictMap?.[i] ??
        arrPermDistrictInputs[i]?.nativeElement?.value ??
        backend?.permDistrict ??
        null;

      /* ================= LOCATION ================= */
      const currLocation =
        arrCurrLocs[i]?.nativeElement?.value ??
        backend?.currLocation ??
        null;

      const permLocation =
        arrPerLocs[i]?.nativeElement?.value ??
        backend?.permLocation ??
        null;

      /* ================= INCOME ================= */
      let incomeRaw = cleanup(arrIncomes[i]?.nativeElement?.value);
      const monthlyIncome = incomeRaw
        ? incomeRaw.toString().replace(/[^0-9.]/g, '')
        : null;

      // this.shareholderIds = this.item?.masterAgentKyc?.shareholders?.map((s: any) => s.id) || [];
      const backendShareholders =
        this.item?.masterAgentKyc?.shareholders || [];
      const backendRes = backendShareholders[i];

      const shareholder = {
        id: backendRes?.id ?? null,
        firstName: cleanup(arrFirstNames[i]?.nativeElement?.value),
        lastName: cleanup(arrLastNames[i]?.nativeElement?.value),
        fatherName: cleanup(arrFatherNames[i]?.nativeElement?.value),
        dob: cleanup(arrDobs[i]?.nativeElement?.value),
        idProofNumber: cleanup(arrTazkiras[i]?.nativeElement?.value),
        placeOfBirth: cleanup(arrBirthPlaces[i]?.nativeElement?.value),
        relationship: cleanup(arrRelations[i]?.nativeElement?.value),
        nationality: cleanup(nationalityReq),
        shareholdingPercentage: cleanup(arrPercs[i]?.nativeElement?.value),
        phone: cleanup(arrPhones[i]?.nativeElement?.value),
        monthlyIncome: cleanup(monthlyIncome),
        tinNumber: cleanup(arrTins[i]?.nativeElement?.value),
        sourceOfIncome: cleanup(arrOtherSrcs[i]?.nativeElement?.value),

        currCountry: cleanup(currCountry),
        currProvince: cleanup(currProvince),
        currDistrict: cleanup(currDistrict),
        currLocation: cleanup(currLocation),

        permCountry: cleanup(permCountry),
        permProvince: cleanup(permProvince),
        permDistrict: cleanup(permDistrict),
        permLocation: cleanup(permLocation),
      };

      shareholdersList.push(shareholder);
    });
    console.log('Final Shareholders Payload:', shareholdersList);
    return shareholdersList;
  }

  // signatoryList() {
  //   const signatoriesList: any[] = [];
  //   // Convert nil/empty to null
  //   const cleanup = (v: any) =>
  //     v === undefined || v === null || v === "" || v === "nil" ? null : v;
  //   // Iterate over each row (like shareholders)
  //   this.signFirstNames.forEach((_, i) => {
  //     //new
  //     const arrNationality = this.signNationality?.toArray() || [];
  //     const arrSrcFund = this.signSrcFund?.toArray() || [];

  //     const arrFirst = this.signFirstNames.toArray();
  //     const arrLast = this.signLastNames.toArray();
  //     const arrTazkira = this.signTazkiras.toArray();
  //     const arrDob = this.signDobs.toArray();
  //     const arrDesignation = this.signDesignations.toArray();
  //     const arrBirthPlace = this.signBirthPlaces.toArray();
  //     const arrResi = this.signResis.toArray();
  //     const arrPhone = this.signPhones.toArray();
  //     const arrIncome = this.signIncomes.toArray();
  //     const arrType = this.signTypes.toArray();
  //     const arrEmail = this.signEmail.toArray();

  //     const backendSignatories =
  //       this.item?.masterAgentKyc?.signatories || [];
  //     const backendRes = backendSignatories[i];

  //     //new
  //     const nationalityText =
  //       arrNationality[i]?.nativeElement?.value || null;
  //     const nationalityDrop =
  //       this.superAgentForm.get('nationalityAuthDrop')?.value || null;
  //     this.nationalityAuthReq = cleanup(nationalityDrop || nationalityText);

  //     const srcText =
  //       arrSrcFund[i]?.nativeElement?.value || null;
  //     const srcDrop =
  //       this.superAgentForm.get('incomeSourceOrgAuth')?.value || null;
  //     this.sourceOfIncomeAuthReq = cleanup(srcDrop || srcText);

  //     const row = {
  //       id: backendRes?.id ?? null,
  //       firstName: cleanup(arrFirst[i].nativeElement.value),
  //       lastName: cleanup(arrLast[i].nativeElement.value),
  //       idProofNumber: cleanup(arrTazkira[i].nativeElement.value),
  //       dob: cleanup(arrDob[i].nativeElement.value),
  //       designation: cleanup(arrDesignation[i].nativeElement.value),
  //       placeOfBirth: cleanup(arrBirthPlace[i].nativeElement.value),
  //       residentAddress: cleanup(arrResi[i].nativeElement.value),
  //       nationality: this.nationalityAuthReq,
  //       sourceOfIncome: this.sourceOfIncomeAuthReq,
  //       phone: cleanup(arrPhone[i].nativeElement.value),
  //       monthlyIncome: cleanup(arrIncome[i].nativeElement.value),
  //       signatoryType: cleanup(arrType[i].nativeElement.value),
  //       Email: cleanup(arrEmail[i].nativeElement.value),
  //       makerChecker: cleanup(this.item?.masterAgentKyc?.signatories[i]?.makerChecker),
  //       // Values already available from initial data
  //     };
  //     signatoriesList.push(row);
  //   });
  //   console.log("Final Signatories Payload:", signatoriesList);
  //   return signatoriesList;
  // }
  signatoryList() {
    const signatoriesList: any[] = [];

    const cleanup = (v: any) =>
      v === undefined || v === null || v === "" || v === "nil" ? null : v;

    // 🔥 create arrays ONCE
    const arrNationality = this.signNationality?.toArray() || [];
    const arrSrcFund = this.signSrcFund?.toArray() || [];

    const arrFirst = this.signFirstNames.toArray();
    const arrLast = this.signLastNames.toArray();
    const arrTazkira = this.signTazkiras.toArray();
    const arrDob = this.signDobs.toArray();
    const arrDesignation = this.signDesignations.toArray();
    const arrBirthPlace = this.signBirthPlaces.toArray();
    const arrResi = this.signResis.toArray();
    const arrPhone = this.signPhones.toArray();
    const arrIncome = this.signIncomes.toArray();
    const arrType = this.signTypes.toArray();
    const arrEmail = this.signEmail.toArray();

    const backendSignatories =
      this.item?.masterAgentKyc?.signatories || [];

    this.signFirstNames.forEach((_, i) => {
      const backendRes = backendSignatories[i];

      // ✅ nationality per row
      // const nationalityText =
      //   arrNationality[i]?.nativeElement?.value || null;
      // const nationalityDrop =
      //   this.superAgentForm.get('nationalityAuthDrop')?.value || null;
      // const nationalityReq = cleanup(nationalityDrop || nationalityText);
      const nationality =
        this.nationalityAuthMap?.[i] ??
        arrNationality[i]?.nativeElement?.value ??
        backendRes?.nationality ??
        null;

      // ✅ source of income per row
      // const srcText =
      //   arrSrcFund[i]?.nativeElement?.value || null;
      // const srcDrop =
      //   this.superAgentForm.get('incomeSourceOrgAuth')?.value || null;
      // const sourceReq = cleanup(srcDrop || srcText);

      const sourceOfIncome =
        this.sourceAuthMap?.[i] ??
        arrSrcFund[i]?.nativeElement?.value ??
        backendRes?.sourceOfIncome ??
        null;

      const row = {
        id: backendRes?.id ?? null,
        firstName: cleanup(arrFirst[i].nativeElement.value),
        lastName: cleanup(arrLast[i].nativeElement.value),
        idProofNumber: cleanup(arrTazkira[i].nativeElement.value),
        dob: cleanup(arrDob[i].nativeElement.value),
        designation: cleanup(arrDesignation[i].nativeElement.value),
        placeOfBirth: cleanup(arrBirthPlace[i].nativeElement.value),
        residentAddress: cleanup(arrResi[i].nativeElement.value),

        nationality: cleanup(nationality),
        sourceOfIncome: cleanup(sourceOfIncome),

        phone: cleanup(arrPhone[i].nativeElement.value),
        monthlyIncome: cleanup(arrIncome[i].nativeElement.value),
        signatoryType: cleanup(arrType[i].nativeElement.value),
        email: cleanup(arrEmail[i].nativeElement.value),
        makerChecker: cleanup(backendRes?.makerChecker),
      };

      signatoriesList.push(row);
    });

    console.log("Final Signatories Payload:", signatoriesList);
    return signatoriesList;
  }
  onKeyPressNumbersOnly(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow only numbers (0-9), block everything else
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  onSubmitEdit() {
    // alert("dfgfdgfdg")
    if (this.superAgentForm.get('dob')?.hasError('underage') || this.superAgentForm.get('dob')?.hasError('overage')) {
      alert('Please ensure the date of birth is valid (between 18 and 100 years old).');
      return;
    }
    console.log("currCountry start", this.item?.agentKyc?.currCountry);
    //source
    const srcText = this.superAgentForm.get('fundSrc')?.value;
    const srcDrop = this.superAgentForm.get('incomeSourceOrg')?.value;
    this.sourceOfIncomeReq = srcDrop || srcText || null;

    //nature
    // const natureText = this.superAgentForm.get('Nature')?.value;
    // const natureDrop = this.superAgentForm.get('NatureDrop')?.value;
    // this.natureReq = natureDrop || natureText || null;

    //purpose
    const purposeText = this.superAgentForm.get('accOpenPurpose')?.value;
    const purposeDrop = this.superAgentForm.get('PurposeDrop')?.value;
    this.purposeOfAccReq = purposeDrop || purposeText || null;

    const rawIncome = this.superAgentForm.get('monthlyIncome')?.value;
    const rawTurnover = this.superAgentForm.get('monthlyTurnover')?.value;
    const income = rawIncome ? rawIncome.toString().replace(/[^0-9.]/g, '') : null;
    const turnover = rawTurnover ? rawTurnover.toString().replace(/[^0-9.]/g, '') : null;

    const shareholdersArray = this.shareholderList();
    console.log("shareholdersArray", shareholdersArray);
    const signatoryArray = this.signatoryList();
    if (this.userStatus == "IN_REVIEW") {
      let req = {
        kycInputs: {
          companyName: this.v(this.superAgentForm.get('accTitle')?.value),
          companyWalletNumber: this.v(this.superAgentForm.get('MMwallet')?.value),
          companyAccOpenDate: this.v(this.superAgentForm.get('accOpenDate')?.value),
          contactPersonName: this.v(this.superAgentForm.get('contactPerName')?.value),
          companyPTID: this.v(this.superAgentForm.get('PTID')?.value),
          contactPersonDesignation: this.v(this.superAgentForm.get('contactPerDesignation')?.value),
          purposeOfAcc: this.v(this.purposeOfAccReq),

          bizLicenseNumber: this.v(this.superAgentForm.get('licenseNo')?.value),
          bizLicenseAuthority: this.v(this.superAgentForm.get('licenseAuth')?.value),
          bizLicenseDateOfIssue: this.v(this.superAgentForm.get('issueDate')?.value),
          bizLicenseDateOfExpiry: this.v(this.superAgentForm.get('expiryDate')?.value),
          bizLicenseTinNumber: this.v(this.superAgentForm.get('tinNo')?.value),
          companyNoOfShareholders: this.v(this.superAgentForm.get('NoOfShareHolder')?.value),

          bizName: this.v(this.superAgentForm.get('businessName')?.value),
          natureOfBiz: this.v(this.superAgentForm.get('grossAnnualIncome')?.value),
          monthlyIncome: this.v(income),
          netWorth: this.v(this.superAgentForm.get('netWorth')?.value),
          sourceOfFund: this.v(this.superAgentForm.get('fundSrc')?.value),
          monthlyTurnover: this.v(turnover),

          companyLocation: this.v(this.superAgentForm.get('cmpnyLoc')?.value),
          companyStreet: this.v(this.superAgentForm.get('streetNo')?.value),
          companyDistrict: this.v(this.superAgentForm.get('district')?.value),
          companyHouseNumber: this.v(this.superAgentForm.get('houseNo')?.value),
          companyProvince: this.v(this.superAgentForm.get('province')?.value),
          companyOfficePhone: this.v(this.superAgentForm.get('offPhNo')?.value),
          companyCountry: this.v(this.superAgentForm.get('country')?.value),
          companyEmail: this.v(this.superAgentForm.get('cmpnyEmail')?.value),

          //shareholder
          shareholders: shareholdersArray,

          //auth signatory
          signatories: signatoryArray,

          otherMnoNo: "",
          otherMnoYes: "",
          otherMnoAccName: this.v(this.superAgentForm.get('accountName')?.value),
          otherMnoName: this.v(this.superAgentForm.get('MNOname')?.value),
          otherMnoAccNumber: this.v(this.superAgentForm.get('accountNo')?.value),

        },
        kycType: "SUPER_AGENT",
        // submittedFor: this.submittedForId,
        submittedFor: this.item?.submittedFor?.id

      }
      this.isLoading = true;
      this.KycService.masterAgentFinalUpdate(req).subscribe((data: any) => {
        if (data?.responseCode == 200) {
          this.corporate.completeMasterAgentRegisterKYC(this.item?.submittedFor?.id).subscribe((data: any) => {
            if (data?.responseCode == 200) {
              alert(data?.data)
              this.isLoading = false;
              // this.router.navigate(["kyc/customer"]);
            }
            else {
              alert(data?.error)
              this.isLoading = false;
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
          companyName: this.v(this.superAgentForm.get('accTitle')?.value),
          companyWalletNumber: this.v(this.superAgentForm.get('MMwallet')?.value),
          companyAccOpenDate: this.v(this.superAgentForm.get('accOpenDate')?.value),
          contactPersonName: this.v(this.superAgentForm.get('contactPerName')?.value),
          companyPTID: this.v(this.superAgentForm.get('PTID')?.value),
          contactPersonDesignation: this.v(this.superAgentForm.get('contactPerDesignation')?.value),
          purposeOfAcc: this.v(this.purposeOfAccReq),

          bizLicenseNumber: this.v(this.superAgentForm.get('licenseNo')?.value),
          bizLicenseAuthority: this.v(this.superAgentForm.get('licenseAuth')?.value),
          bizLicenseDateOfIssue: this.v(this.superAgentForm.get('issueDate')?.value),
          bizLicenseDateOfExpiry: this.v(this.superAgentForm.get('expiryDate')?.value),
          bizLicenseTinNumber: this.v(this.superAgentForm.get('tinNo')?.value),
          companyNoOfShareholders: this.v(this.superAgentForm.get('NoOfShareHolder')?.value),

          bizName: this.v(this.superAgentForm.get('businessName')?.value),
          natureOfBiz: this.v(this.superAgentForm.get('grossAnnualIncome')?.value),
          monthlyIncome: this.v(income),
          netWorth: this.v(this.superAgentForm.get('netWorth')?.value),
          sourceOfFund: this.v(this.superAgentForm.get('fundSrc')?.value),
          monthlyTurnover: this.v(turnover),

          companyLocation: this.v(this.superAgentForm.get('cmpnyLoc')?.value),
          companyStreet: this.v(this.superAgentForm.get('streetNo')?.value),
          companyDistrict: this.v(this.superAgentForm.get('district')?.value),
          companyHouseNumber: this.v(this.superAgentForm.get('houseNo')?.value),
          companyProvince: this.v(this.superAgentForm.get('province')?.value),
          companyOfficePhone: this.v(this.superAgentForm.get('offPhNo')?.value),
          companyCountry: this.v(this.superAgentForm.get('country')?.value),
          companyEmail: this.v(this.superAgentForm.get('cmpnyEmail')?.value),

          //shareholder
          shareholders: shareholdersArray,

          //auth signatory
          signatories: signatoryArray,

          otherMnoNo: "",
          otherMnoYes: "",
          otherMnoAccName: this.v(this.superAgentForm.get('accountName')?.value),
          otherMnoName: this.v(this.superAgentForm.get('MNOname')?.value),
          otherMnoAccNumber: this.v(this.superAgentForm.get('accountNo')?.value),

        },
        kycType: "SUPER_AGENT",
        // submittedFor: this.submittedForId
        submittedFor: this.item?.submittedFor?.id
      }
      this.isLoading = true;
      this.KycService.masterAgentFinalUpdateBymaker(req).subscribe((data: any) => {
        // this.isLoading = false;
        if (data?.responseCode == 200) {
          alert(data?.data)
          this.isLoading = false;
          this.router.navigate(["kyc/kyc-edit-requests"]);
        }
        else {
          alert(data?.error)
          this.isLoading = false;
        }
      })
    }
  }
  makePdf() {
    const download$ = this.viewOnly
      ? this.KycService.downloadPDFForClosedAccounts(this.kycId)
      : this.KycService.downloadPDF(this.kycId);
    download$.subscribe({
      next: (data: Blob) => {
        console.log(data.type);  // Ensure it logs 'application/pdf'
        const filename = 'Master-Agent-Report.pdf';
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

  signatureImages: { [key: string]: SafeUrl } = {};

  getImagesRegSign(imgParam: any) {
    this.KycService.getImage(imgParam).subscribe((res) => {
      console.log(res);
      const objectURL = URL.createObjectURL(res);
      this.regBySign = objectURL
    })
  }
  getImages(imgParam: any, mapping: any) {
    this.KycService.getImage(imgParam).subscribe((res) => {
      const unsafeUrl = URL.createObjectURL(res);
      const safeUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeUrl);
      this.signatureImages = { ...this.signatureImages, [mapping]: safeUrl };

      if (this.signatureImages['authSigSignature1']) {
      }
      this.cdr.detectChanges();
    })
  }
  //old
  // checkSdn() {
  //   this.isLoading = true;
  //   this.watchYes.enable();
  //   // this.watchNo.enable();
  //   this.watchYes.setValue(true);
  //   this.watchNo.setValue(false);
  //   this.sdnChecked = true;
  //   this.watchTarget = true;
  //   const req = {
  //     // name: this.firstNameValue,
  //     "name": this.item?.masterAgentKyc?.companyName,
  //     "minMatchPercent": 60,
  //     "dob": this.dobValue,
  //     "kycId": this.kycId,
  //     "userId": this.submittedForId
  //   };
  //   this.KycService.searchSdn(req).subscribe((data: any) => {
  //     // this.isLoading = false;
  //     // this.showModal = true;
  //     // this.sdnDetails = data
  //     // console.log("sdnDetails", this.sdnDetails)
  //     // this.showModal = true;
  //     // if (!data) {
  //     //   this.isLoading = false;
  //     //   this.noDataSdn=true
  //     // }
  //     this.isLoading = false;
  //     if (data && data.length > 0) {
  //       this.sdnDetails = data;
  //       this.noDataSdn = false;
  //       this.showModal = true;
  //     } else {
  //       this.sdnDetails = [];
  //       this.noDataSdn = true;
  //       this.showModal = true;
  //       alert(data?.error);
  //     }
  //   });
  // }
  checkSdn() {
    this.isLoading = true;
    this.watchYes.enable();
    // this.watchNo.enable();
    this.watchYes.setValue(true);
    this.watchNo.setValue(false);
    this.sdnChecked = true;
    this.watchTarget = true;
    //new added
    console.log("this.watchYes", this.watchYes)
    if (this.item?.status == 'PENDING') {
      this.submittedForId = this.item?.submittedFor?.id;
      if (this?.item?.newValues?.signatories && this?.item?.newValues?.signatories.length > 0 && this.item?.newValues?.signatories[0]?.dob) {
        this.item.masterAgentKyc.signatories[0].dob = this.item?.newValues?.signatories[0]?.dob;
      }
      if (this.item?.newValues?.companyName) {
        this.item.masterAgentKyc.companyName = this.item?.newValues?.companyName;
      }
    }

    const req = {
      // name: this.firstNameValue,
      name: this.item?.masterAgentKyc?.companyName,
      minMatchPercent: 60,
      dob: this.item?.masterAgentKyc?.signatories[0]?.dob,
      kycId: this.kycId,
      userId: this.submittedForId
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

    this.KycService.searchSdn(req)
      .pipe(
        finalize(() => {
          this.isLoading = false; // ✅ centralized, no logic change
        })
      )
      .subscribe((data: any) => {

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
  //   this.riskChecked = true
  //   // this.isLoading = true;
  //   this.KycService.checkRisk(this.kycId).subscribe((data: any) => {
  //     if (data && data?.data) {
  //       this.showRiskModal = true;
  //       this.riskDetails = data?.data
  //       this.riskTierValue = data?.data?.riskTier
  //       console.log("riskTierValue", this.riskTierValue);
  //       this.DataRisk = true;
  //       this.noDataRisk = false;

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
  //       // this.isLoading = false;

  //     }
  //     else {
  //       // this.isLoading = true;
  //       this.DataRisk = false;
  //       this.noDataRisk = true;
  //       alert(data?.error);
  //     }
  //     // this.showRiskModal = true;

  //   });
  // }
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
  closeModal() {
    this.showModal = false;
  }
  closeModalDigital() {
    this.showdigitalModal = false;
  }
  closeRiskModal() {
    this.showRiskModal = false;
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
  checkPhoneExistence() {
    const phone = this.superAgentForm.get('offPhNo')?.value;
    if (!phone) return;
    this.corporate.checkPhoneExist(phone).subscribe(
      (response: any) => {
        if (response && response.data) {
          const match = response.data.find(
            (item: any) => item.userType === "AGENT"   // ✅ FIX HERE
          );
          this.phoneErrorReg = !!match;
        }
      },
      (error) => {
        console.error('Error checking phone existence:', error);
      }
    );
  }
  checkEmailExistence() {
    const email = this.superAgentForm.get('cmpnyEmail')?.value;
    if (email) {
      this.corporate.checkEmailExist(email).subscribe(
        (response: any) => {
          if (response && response.data) {
            // Check if email matches any record with user type 'CUSTOMER'
            const customerMatch = response.data.find(
              (item: any) =>
                item.userType === "AGENT"
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
  checkIdExists(): void {
    const idNumber = this.superAgentForm.get('idNO')?.value;
    if (idNumber) {
      let req = {
        "idProof": this.superAgentForm.get('idNO')?.value,
        "kycType": "MASTER AGENT"
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
  //
  startEdit(fileItem: any) {
    // close editing on all files
    this.fileLists.forEach((f: any) => f.isEditing = false);
    // open editing only for clicked file
    fileItem.isEditing = true;
  }
  docTypeMap: { [key: string]: string } = {
    'Master Agent contactIdProofFrontPhoto': 'contactIdProofFrontPhoto',
    'Master Agent Contact Signature Photo': 'contactSignaturePhoto',

    'Master Agent Business License Photo': 'bizLicensePhoto',
    'Master Agent Address Proof Photo': 'addressProofPhoto',
    'Master Agent Authorization LetterPhoto': 'authorizationLetterPhoto',
    'Master Agent Article Of AssociationPhoto': 'articleOfAssociationPhoto',
    'Master Agent Tax Clearance LetterPhoto': 'taxClearanceLetterPhoto',
    'Master Agent Company TINLetter Photo': 'companyTINLetterPhoto',

    'Shareholder Id Proof Front Photo': 'idProofFrontPhoto',
    'Shareholder Id Proof Back Photo': 'idProofBackPhoto',

    'Authorized Signatory Id Proof Front Photo': 'idProofFrontPhoto',
    'Authorized Signatory Id Proof Back Photo': 'idProofBackPhoto',
    'Authorized Signatory signatory Photo': 'signatoryPhoto',
    'Authorized Signatory Signature Photo': 'signaturePhoto'
  };
  detectFilesByMaker(event: any, fileItem: any) {
    const selectedFile: File = event.target.files[0];
    if (!selectedFile) return;

    fileItem.selectedFile = selectedFile;
    fileItem.isUpdated = false;

    const docName = fileItem.name.trim();
    const lowerDocName = docName.toLowerCase();

    /* --------------------------------
       1. Detect OWNER TYPE
    ----------------------------------*/
    let ownerType: 'SHAREHOLDER' | 'SIGNATORY' | 'MASTER_AGENT' = 'MASTER_AGENT';

    if (lowerDocName.includes('shareholder')) {
      ownerType = 'SHAREHOLDER';
    }
    else if (lowerDocName.includes('authorized signatory')) {
      ownerType = 'SIGNATORY';
    }

    /* --------------------------------
       2. Extract INDEX (1 → 0, 2 → 1)
    ----------------------------------*/
    let personIndex: number | null = null;

    const indexMatch = lowerDocName.match(/\b(shareholder|authorized signatory)\s+(\d+)\b/);

    if (indexMatch) {
      personIndex = Number(indexMatch[2]) - 1;
    }

    /* --------------------------------
       3. Resolve mappedType
    ----------------------------------*/
    let mappedType: string;

    if (lowerDocName.startsWith('other document')) {
      mappedType = 'otherDocs';
    }
    else {
      const normalizedDocName = lowerDocName
        .replace(/\b\d+\b/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      const typeKey = Object.keys(this.docTypeMap)
        .find(k => k.trim().toLowerCase() === normalizedDocName);

      if (!typeKey) {
        alert(`Invalid document type: ${fileItem.name}`);
        return;
      }

      mappedType = this.docTypeMap[typeKey];
    }

    /* --------------------------------
       4. Pick correct PERSON ID
    ----------------------------------*/
    let shareId: any = null;
    let authId: any = null;

    if (ownerType === 'SHAREHOLDER') {
      shareId = this.item?.masterAgentKyc?.shareholders?.[personIndex ?? 0]?.id;
    }
    else if (ownerType === 'SIGNATORY') {
      authId = this.item?.masterAgentKyc?.signatories?.[personIndex ?? 0]?.id;
    }

    /* --------------------------------
       5. Select correct API
    ----------------------------------*/
    let apiCall;

    if (ownerType === 'SHAREHOLDER') {
      apiCall = this.KycService.masterAgentShareUpdateImageByMaker(
        selectedFile,
        mappedType,
        this.item?.submittedFor?.id,
        shareId
      );
    }
    else if (ownerType === 'SIGNATORY') {
      apiCall = this.KycService.masterAgentSignatoryUpdateImageByMaker(
        selectedFile,
        mappedType,
        this.item?.submittedFor?.id,
        authId
      );
    }
    else {
      apiCall = this.KycService.masterAgentUpdateImageByMaker(
        selectedFile,
        mappedType,
        this.item?.submittedFor?.id
      );
    }

    /* --------------------------------
       6. Common subscribe
    ----------------------------------*/
    apiCall.subscribe({
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
        alert(`Error updating ${docName}`);
      }
    });
  }
  //
  detectFilesByMakerOtherDocs(event: any, mapping: any){
    // const input = event.target as HTMLInputElement;
    if (event.target.files && event.target.files[0]) {
      let file: File | null = event.target.files[0];

      this.isLoading = true;
      if (file) {
      this.KycService.masterAgentUpdateImageByMaker(
        file,
        mapping,
        this.item?.submittedFor?.id
      ).subscribe({
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
  detectFilesPhoto(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadedImagePhoto = event.target.files[0];
      // console.log("uploadedImage1", this.uploadedImage1);
      this.uploadedImageFileNamePhoto = event.target.files[0].name;
      this.uploadedImageFileTypePhoto = event.target.files[0].type
      this.uploadedImageFileNameExtensionPhoto = event.target.files[0].name.split('.').pop();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.uploadedImageFileDataPhoto = reader.result;
      reader.onload = () => {
        this.uploadedImageFileDataPhoto = reader.result;
      };
    }
    // for (let item of this.allUsers) {
    if (this.kycId == this.item?.id) {
      this.superId = this.item?.submittedFor?.id;
      console.log(" this.superId", this.superId);
    }
    // }
    this.KycService.addSuperPresSign(this.uploadedImagePhoto, "superPhoto_img_0", this.superId).subscribe((data: any) => {
      if (data?.responseCode == 200) {
        alert("File Upload successful")
      }
      else {
        alert("File Upload failed")
      }
    })

  }
  detectFilesPres(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadedImagePres = event.target.files[0];
      // console.log("uploadedImage1", this.uploadedImage1);
      this.uploadedImageFileName = event.target.files[0].name;
      this.uploadedImageFileTypePres = event.target.files[0].type
      this.uploadedImageFileNameExtension = event.target.files[0].name.split('.').pop();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.uploadedImageFileData = reader.result;
      reader.onload = () => {
        this.uploadedImageFileData = reader.result;
      };
    }
    // for (let item of this.allUsers) {
    if (this.kycId == this.item?.id) {
      this.superId = this.item?.submittedFor?.id;
      console.log(" this.superId", this.superId);
    }
    // }
    this.KycService.addSuperPresSign(this.uploadedImagePres, "prezSign_img_1", this.superId).subscribe((data: any) => {
      if (data?.responseCode == 200) {
        alert("File Upload successful")
      }
      else {
        alert("File Upload failed")
      }
    })

  }
  detectFilesVice(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadedImageVice = event.target.files[0];
      // console.log("uploadedImage1", this.uploadedImage1);
      this.uploadedImageFileName = event.target.files[0].name;
      this.uploadedImageFileTypeVice = event.target.files[0].type
      this.uploadedImageFileNameExtension = event.target.files[0].name.split('.').pop();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.uploadedImageFileData = reader.result;
      reader.onload = () => {
        this.uploadedImageFileData = reader.result;
      };
    }

    // for (let item of this.allUsers) {
    if (this.kycId == this.item?.id) {
      this.superId = this.item?.submittedFor?.id;
      console.log(" this.superId", this.superId);
    }
    // }
    this.KycService.addSuperPresSign(this.uploadedImageVice, "vicePrezSign_img_1", this.superId).subscribe((data: any) => {
      if (data?.responseCode == 200) {
        alert("File Upload successful")
      }
      else {
        alert("File Upload failed")
      }
    })

  }

  detectFilesKYC(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadedImageKYC = event.target.files[0];
      // console.log("uploadedImage1", this.uploadedImage1);
      this.uploadedImageFileNameKYC = event.target.files[0].name;
      this.uploadedImageFileTypeKYC = event.target.files[0].type
      this.uploadedImageFileNameExtensionKYC = event.target.files[0].name.split('.').pop();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.uploadedImageFileDataKYC = reader.result;
      reader.onload = () => {
        this.uploadedImageFileDataKYC = reader.result;
      };
    }
    // for (let item of this.allUsers) {
    if (this.kycId == this.item?.id) {
      this.superId = this.item?.submittedFor?.id;
      console.log(" this.superId", this.superId);
    }
    // }
    // this.KycService.addSuperPresSign(this.uploadedImageKYC, "processedBySign_img_2", this.superId).subscribe((data: any) => {
    //   if (data?.responseCode == 200) {
    //     alert("File Upload successful")

    //   }
    //   else {
    //     alert("File Upload failed")

    //   }
    // })

  }
  upload() {
    const batchIdValue = this.refundForm.get('digitalKey')?.value;
    if (batchIdValue) {
      this.KycService.addSuperPresSign(this.uploadedImageKYC, "processedBySign_img_2", this.superId).subscribe((data: any) => {
        if (data?.responseCode == 200) {
          alert("File Upload successful")
        }
        else {
          alert("File Upload failed")
        }
      })
    }
  }
  detectFilesOp(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadedImageOp = event.target.files[0];
      // console.log("uploadedImage1", this.uploadedImage1);
      this.uploadedImageFileNameOp = event.target.files[0].name;
      this.uploadedImageFileTypeOp = event.target.files[0].type
      this.uploadedImageFileNameExtensionOp = event.target.files[0].name.split('.').pop();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.uploadedImageFileDataOp = reader.result;
      reader.onload = () => {
        this.uploadedImageFileDataOp = reader.result;
      };
    }
    // for (let item of this.allUsers) {
    if (this.kycId == this.item?.id) {
      this.superId = this.item?.submittedFor?.id;
      console.log(" this.superId", this.superId);
    }
    // }
    this.KycService.addSuperPresSign(this.uploadedImageOp, "opsSign_img_2", this.superId).subscribe((data: any) => {
      if (data?.responseCode == 200) {
        alert("File Upload successful")
      }
      else {
        alert("File Upload failed")
      }
    })

  }
  detectFilesCompliance(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadedImageCompliance = event.target.files[0];
      // console.log("uploadedImage1", this.uploadedImage1);
      this.uploadedImageFileNameCompliance = event.target.files[0].name;
      this.uploadedImageFileTypeCompliance = event.target.files[0].type
      this.uploadedImageFileNameExtensionCompliance = event.target.files[0].name.split('.').pop();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.uploadedImageFileDataCompliance = reader.result;
      reader.onload = () => {
        this.uploadedImageFileDataCompliance = reader.result;
      };
    }
    // for (let item of this.allUsers) {
    if (this.kycId == this.item?.id) {
      this.superId = this.item?.submittedFor?.id;
      console.log(" this.superId", this.superId);
    }
    // }
    this.KycService.addMasterPresSign(this.uploadedImageCompliance, "complianceSignaturePhoto", this.superId).subscribe((data: any) => {
      if (data?.responseCode == 200) {
        alert("File Upload successful")
      }
      else {
        alert("File Upload failed")
      }
    })

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
    this.KycService.addSuperPresSign(this.uploadedImageCompHeadSign, this.type, this.superId).subscribe((data: any) => {
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
    this.KycService.addSuperPresSign(this.uploadedImageCEOSign, this.type, this.superId).subscribe((data: any) => {
    })

  }
  detectFilesAttachment(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0]; // Get the uploaded file
      this.uploadedImageAttachmentName = file.name; // Store file name to display

      // Prepare FormData to send the file along with other necessary data
      const formData = new FormData();
      formData.append('file', file); // Append the file to FormData
      this.KycService.addSuperAgentAttachment(formData, this.superId).subscribe(
        (data: any) => {
          console.log("File uploaded successfully", data);
          // Handle success response here as needed
        },
        (error: any) => {
          console.error("File upload failed", error);
        }
      );
    }
  }
  onCheckedRisk($event: any, riskType: any) {
    let riskLevel = $event.target.value
    console.log("riskLevel", riskLevel);
    this.riskTarget = riskType
    console.log("riskTarget11", this.riskTarget)
    // for (let item of this.allUsers) {
    // if (this.kycId == this.item?.id) {
    this.showApprove1Btn = false;
    this.showApprove2Btn = false;
    this.showApproveFinalBtn = false;
    this.approveStatus = this.item?.status
    // if (this.approveStatus === 'IN_REVIEW') {
    //   this.showApprove1Btn = true;
    // } else if (this.approveStatus === 'VERIFIED_L1') {
    //   this.showApprove2Btn = true;
    // } else if (this.approveStatus == "VERIFIED_L2") {
    //   this.showApproveFinalBtn = true;
    // }
    // }
    // }
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
    // else if (riskLevel === 'medium') {
    //   this.showAbmmcHigh = false;
    //   this.showAbmmcLowMed = true;

    //   this.showApproveFinalBtn = true;
    //   this.showApprove1Btn = false;
    //   this.showApprove2Btn = false;
    // }
    // else if (riskLevel === 'low') {
    //   this.showAbmmcHigh = false;
    //   this.showAbmmcLowMed = true;

    //   this.showApproveFinalBtn = true;
    //   this.showApprove1Btn = false;
    //   this.showApprove2Btn = false;
    // }

    // if (riskLevel === 'high') {
    //   this.showAbmmcHigh = true;
    //   this.showAbmmcLowMed = true;
    // }
    // else if (riskLevel === 'low') {
    //   this.showAbmmcHigh = false;
    //   this.showAbmmcLowMed = true;
    // }
    // else if (riskLevel === 'medium') {
    //   this.showAbmmcHigh = false;
    //   this.showAbmmcLowMed = true;
    // }
    window.scrollTo(0, 0);
    this.riskValue = $event.target.value
    this.cdr.detectChanges();
  }

  onCheckedWatchlist($event: any, selectedValue: boolean) {
    window.scrollTo(0, 0);
    this.watchListValue = $event.target.value
    this.watchTarget = selectedValue;
    this.watchYes.setValue(selectedValue === true);
    this.watchNo.setValue(selectedValue === false);
    this.cdr.detectChanges();
  }
  sendRemarksValue($event: any) {
    this.remarkValue = $event.target.value
    this.cdr.detectChanges();
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
    console.log(" 11req", req)
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

  isFormValidApprove1(): boolean {
    //pending
    //  !!this.watchListValue &&
    return !!this.remarkValue
      && this.uploadedImageCompliance &&
      this.sdnChecked && this.riskChecked;
    //pending
  }
  isFormValidApprove2Only(): boolean {
    return this.uploadedImageCompHeadSign
  }
  isFormValidApprove(): boolean {

    console.log("remarkValue:", this.remark.value);
    // console.log("ComplianceInput value:", this.ComplianceInput.value);
    if (this.compSign) {
      this.uploadedImageCompliance = true;
    }
    // && !!this.watchListValue
    return !!this.remarkValue
      && this.uploadedImageCompliance
      && this.sdnChecked && this.riskChecked;
    // && this.uploadedImageCEOSign
  }
  isFormValidApproveFinalOnly(): boolean {
    console.log("this.remarkValue22", this.remark.value)

    // console.log("riskValue:", this.riskValue);
    // console.log("watchListValue:", this.watchListValue);
    console.log("remarkValue23:", this.remark.value);
    // console.log("ComplianceInput value:", this.ComplianceInput.value);
    // console.log("uploadedImageFileNameCompliance:", this.uploadedImageCompSignName);
    // console.log("sdnChecked:", this.sdnChecked);
    // console.log("riskChecked:", this.riskChecked);
    // return this.uploadedImageCEOSign
    if (this.approveStatus === 'IN_REVIEW') {
      // && !!this.watchListValue && this.remark.value
      return !!this.riskValue && this.remarkValue
        && this.uploadedImageCompliance
        && this.sdnChecked && this.riskChecked;
    }
    return !!this.uploadedImageCEOSign;
    //pending
  }
  closeAlert() {
    this.alertMessage = null;
  }

  goback() {
    this.router.navigateByUrl(this.previousRoute);
  }

  @ViewChild('accTitle') accTitle!: ElementRef<HTMLInputElement>;
  @ViewChild('contactPerName') contactPerName!: ElementRef<HTMLInputElement>;
  @ViewChild('contactPerDesignation') contactPerDesignation!: ElementRef<HTMLInputElement>;
  @ViewChild('licenseNo') licenseNo!: ElementRef<HTMLInputElement>;
  @ViewChild('licenseAuth') licenseAuth!: ElementRef<HTMLInputElement>;
  @ViewChild('issueDate') issueDate!: ElementRef<HTMLInputElement>;
  @ViewChild('expiryDate') expiryDate!: ElementRef<HTMLInputElement>;
  @ViewChild('tinNoele') tinNoele!: ElementRef<HTMLInputElement>;
  @ViewChild('businessNameele') businessNameele!: ElementRef<HTMLInputElement>;
  @ViewChild('grossAnnualIncome') grossAnnualIncome!: ElementRef<HTMLInputElement>;
  @ViewChild('monthlyIncomeele') monthlyIncomeele!: ElementRef<HTMLInputElement>;
  @ViewChild('netWorth') netWorth!: ElementRef<HTMLInputElement>;
  @ViewChild('fundSrc') fundSrc!: ElementRef<HTMLInputElement>;
  @ViewChild('monthlyTurnoverele') monthlyTurnoverele!: ElementRef<HTMLInputElement>;
  @ViewChild('cmpnyLoc') cmpnyLoc!: ElementRef<HTMLInputElement>;
  @ViewChild('streetNo') streetNo!: ElementRef<HTMLInputElement>;
  @ViewChild('houseNoele') houseNoele!: ElementRef<HTMLInputElement>;
  @ViewChild('districtele') districtele!: ElementRef<HTMLInputElement>;
  @ViewChild('provinceele') provinceele!: ElementRef<HTMLInputElement>;
  @ViewChild('countryele') countryele!: ElementRef<HTMLInputElement>;
  @ViewChild('offPhNoele') offPhNoele!: ElementRef<HTMLInputElement>;
  @ViewChild('cmpnyEmailele') cmpnyEmailele!: ElementRef<HTMLInputElement>;

  isEditing: boolean = false;
  iscontactPerName: boolean = false;
  istinNo: boolean = false;
  isexpiryDate: boolean = false;
  islicenseAuth: boolean = false;
  isissueDate: boolean = false;
  islicenseNo: boolean = false;
  isbusinessName: boolean = false;
  businessName: boolean = false;
  isgrossAnnualIncome: boolean = false;
  ismonthlyIncome: boolean = false;
  isnetWorth: boolean = false;
  isfundSrc: boolean = false;
  ismonthlyTurnover: boolean = false;
  iscmpnyEmail: boolean = false;
  isoffPhNo: boolean = false;
  isprovince: boolean = false;
  iscountry: boolean = false;
  isdistrict: boolean = false;
  ishouseNo: boolean = false;
  isstreetNo: boolean = false;
  iscmpnyLoc: boolean = false;
  iscontactPerDesignation: boolean = false;
  isEditingNew = false;
  isEditingIndex: number | null = null;
  enableEditNew(index: number) {
    if (this.isEditingIndex === index) {
      this.isEditingIndex = null; // Close if clicking the same row
    } else {
      this.isEditingIndex = index; // Open the clicked row and close others
    }
  }
  onFileSelectedForProfile(field: any, event: any, index: number) {
    // console.log(event,item);
    this.isLoading = true
    this.corporate.addMasterAgentMultipleDoc(event.target.files[0], field, this.submittedForId).subscribe({
      next: (res) => {
        console.log(res);
        if (res?.responseCode == 200) {
          this.isLoading = false
          // this.cancelEdit(); 
          this.isEditingIndex = null
          alert('File Updated Successfully')
        } else {
          this.isLoading = false
          alert(res?.error)
        }
      }, error: () => {
        this.isLoading = false
        alert('Something Went Wrong!!!')
      }
    })
  }
  enableEdit(event: any): void {
    console.log(event)
    if (event == 'accTitle') {
      this.isEditing = !this.isEditing;
      this.readOnly = !this.isEditing;
      this.accTitle.nativeElement.focus();
    } else if (event == 'contactPerName') {
      this.iscontactPerName = !this.iscontactPerName;
      this.readOnly = !this.iscontactPerName;
      this.contactPerName.nativeElement.focus();
    } else if (event == 'contactPerDesignation') {
      this.iscontactPerDesignation = !this.iscontactPerDesignation;
      this.readOnly = !this.iscontactPerDesignation;
      this.contactPerDesignation.nativeElement.focus();
    }
    else if (event == 'licenseNo') {
      this.islicenseNo = !this.islicenseNo;
      this.readOnly = !this.islicenseNo;
      this.licenseNo.nativeElement.focus();
    }
    else if (event == 'licenseAuth') {
      this.islicenseAuth = !this.islicenseAuth;
      this.readOnly = !this.islicenseAuth;
      this.licenseAuth.nativeElement.focus();
    }
    else if (event == 'issueDate') {
      this.isissueDate = !this.isissueDate;
      this.readOnly = !this.isissueDate;
      this.issueDate.nativeElement.focus();
    }
    else if (event == 'expiryDate') {
      this.isexpiryDate = !this.isexpiryDate;
      this.readOnly = !this.isexpiryDate;
      this.expiryDate.nativeElement.focus();
    }
    else if (event == 'tinNo') {
      this.istinNo = !this.istinNo;
      this.readOnly = !this.istinNo;
      this.tinNoele.nativeElement.focus();
    }
    else if (event == 'businessName') {
      this.isbusinessName = !this.isbusinessName;
      this.readOnly = !this.isbusinessName;
      this.businessNameele.nativeElement.focus();
    }
    else if (event == 'grossAnnualIncome') {
      // this.isgrossAnnualIncome = true
      this.isgrossAnnualIncome = !this.isgrossAnnualIncome;
      this.readOnly = !this.isgrossAnnualIncome;
      this.grossAnnualIncome.nativeElement.focus();
    } else if (event == 'monthlyIncome') {
      this.ismonthlyIncome = !this.ismonthlyIncome;
      this.readOnly = !this.ismonthlyIncome;
      this.monthlyIncomeele.nativeElement.focus();
    } else if (event == 'netWorth') {
      this.isnetWorth = !this.isnetWorth;
      this.readOnly = !this.isnetWorth;
      this.netWorth.nativeElement.focus();
    } else if (event == 'fundSrc') {
      this.isfundSrc = !this.isfundSrc;
      this.readOnly = !this.isfundSrc;
      this.fundSrc.nativeElement.focus();
    } else if (event == 'monthlyTurnover') {
      this.ismonthlyTurnover = !this.ismonthlyTurnover;
      this.readOnly = !this.ismonthlyTurnover;
      this.monthlyTurnoverele.nativeElement.focus();
    }
    else if (event == 'cmpnyLoc') {
      this.iscmpnyLoc = !this.iscmpnyLoc;
      this.readOnly = !this.iscmpnyLoc;
      this.cmpnyLoc.nativeElement.focus();
    } else if (event == 'streetNo') {
      this.isstreetNo = !this.isstreetNo;
      this.readOnly = !this.isstreetNo;
      this.streetNo.nativeElement.focus();
    } else if (event == 'houseNo') {
      this.ishouseNo = !this.ishouseNo;
      this.readOnly = !this.ishouseNo;
      this.houseNoele.nativeElement.focus();
    } else if (event == 'district') {
      this.isdistrict = !this.isdistrict;
      this.readOnly = !this.isdistrict;
      this.districtele.nativeElement.focus();
    } else if (event == 'province') {
      this.isprovince = !this.isprovince;
      this.readOnly = !this.isprovince;
      this.provinceele.nativeElement.focus();
    } else if (event == 'country') {
      this.iscountry = !this.iscountry;
      this.readOnly = !this.iscountry;
      this.countryele.nativeElement.focus();
    } else if (event == 'offPhNo') {
      this.isoffPhNo = !this.isoffPhNo;
      this.readOnly = !this.isoffPhNo;
      this.offPhNoele.nativeElement.focus();
    } else if (event == 'cmpnyEmail') {
      this.iscmpnyEmail = !this.iscmpnyEmail;
      this.readOnly = !this.iscmpnyEmail;
      this.cmpnyEmailele.nativeElement.focus();
    }
  }
  // clickSend(event:any){
  //     //alert(this.customerForm.get('firstName')?.value);
  //     // if (event == 'accTitle') {
  //     //   console.log('accTitle')
  //     //   const confirmChange = window.confirm(
  //     //     `Do you want to update the name to "${this.superAgentForm.get('accTitle')?.value}"?`
  //     //   );

  //     //   if (confirmChange) {
  //     //     let request = {
  //     //       "kycType": "SUPER_AGENT",
  //     //       "submittedFor": this.submittedForId,
  //     //       "kycInputs": {
  //     //         "companyName": this.superAgentForm.get('accTitle')?.value,
  //     //       }
  //     //     }
  //     //     this.masterAgentService.updateMasterAgentRegisterKYC(request).subscribe(
  //     //       (response: any) => {
  //     //         if (response?.responseCode === 200) {
  //     //           this.masterAgentService.completeMasterAgentRegisterKYC(this.item?.submittedFor?.id).subscribe((data: any) => {
  //     //             if (data?.responseCode == 200) {
  //     //               alert('First Name Updated Successfully');
  //     //               // this.firstNameOrginal = this.superAgentForm.get('firstName')?.value;
  //     //             }
  //     //           })
  //     //           // Notify success or update UI as needed
  //     //         } else {
  //     //           console.error('First Name Update failed', response);
  //     //           alert("First Name Update failed");

  //     //         }
  //     //       });
  //     //       this.isEditing = false;
  //     //       this.readOnly = true;
  //     //   } else {

  //     //   }

  //     // } 
  //     // if (event == 'contactPerName') {
  //     //   console.log('contactPerName')
  //     //   const confirmChange = window.confirm(
  //     //     `Do you want to update the name to "${this.superAgentForm.get('contactPerName')?.value}"?`
  //     //   );

  //     //   if (confirmChange) {
  //     //     let request = {
  //     //       "kycType": "SUPER_AGENT",
  //     //       "submittedFor": this.submittedForId,
  //     //       "kycInputs": {
  //     //         "contactPersonName": this.superAgentForm.get('contactPerName')?.value,
  //     //       }
  //     //     }
  //     //     this.masterAgentService.updateMasterAgentRegisterKYC(request).subscribe(
  //     //       (response: any) => {
  //     //         if (response?.responseCode === 200) {
  //     //           this.masterAgentService.completeMasterAgentRegisterKYC(this.item?.submittedFor?.id).subscribe((data: any) => {
  //     //             if (data?.responseCode == 200) {
  //     //               alert('Contact PersonName Updated Successfully');
  //     //               // this.firstNameOrginal = this.superAgentForm.get('firstName')?.value;
  //     //             }
  //     //           })
  //     //           // Notify success or update UI as needed
  //     //         } else {
  //     //           console.error('Contact PersonName Update failed', response);
  //     //           alert("Contact PersonName Update failed");

  //     //         }
  //     //       });

  //     //   } else {

  //     //   }
  //     //   this.iscontactPerName = false;
  //     //   this.readOnly = true;
  //     // }
  //     // if (event == 'contactPerDesignation') {
  //     //   console.log('contactPerDesignation')
  //     //   const confirmChange = window.confirm(
  //     //     `Do you want to update the name to "${this.superAgentForm.get('contactPerDesignation')?.value}"?`
  //     //   );

  //     //   if (confirmChange) {
  //     //     let request = {
  //     //       "kycType": "SUPER_AGENT",
  //     //       "submittedFor": this.submittedForId,
  //     //       "kycInputs": {
  //     //         "contactPersonDesignation": this.superAgentForm.get('contactPerDesignation')?.value,
  //     //       }
  //     //     }
  //     //     this.masterAgentService.updateMasterAgentRegisterKYC(request).subscribe(
  //     //       (response: any) => {
  //     //         if (response?.responseCode === 200) {
  //     //           this.masterAgentService.completeMasterAgentRegisterKYC(this.item?.submittedFor?.id).subscribe((data: any) => {
  //     //             if (data?.responseCode == 200) {
  //     //               alert('Contact Person Designation Updated Successfully');
  //     //               // this.firstNameOrginal = this.superAgentForm.get('firstName')?.value;
  //     //             }
  //     //           })
  //     //           // Notify success or update UI as needed
  //     //         } else {
  //     //           console.error('Contact Person Designation Update failed', response);
  //     //           alert("Contact Person Designation Update failed");

  //     //         }
  //     //       });

  //     //   } else {

  //     //   }
  //     //   this.iscontactPerName = false;
  //     //   this.readOnly = true;
  //     // }
  //     // if (event == 'contactPerDesignation') {
  //     //   console.log('contactPerDesignation')
  //     //   const confirmChange = window.confirm(
  //     //     `Do you want to update the name to "${this.superAgentForm.get('contactPerDesignation')?.value}"?`
  //     //   );

  //     //   if (confirmChange) {
  //     //     let request = {
  //     //       "kycType": "SUPER_AGENT",
  //     //       "submittedFor": this.submittedForId,
  //     //       "kycInputs": {
  //     //         "contactPersonDesignation": this.superAgentForm.get('contactPerDesignation')?.value,
  //     //       }
  //     //     }
  //     //     this.masterAgentService.updateMasterAgentRegisterKYC(request).subscribe(
  //     //       (response: any) => {
  //     //         if (response?.responseCode === 200) {
  //     //           this.masterAgentService.completeMasterAgentRegisterKYC(this.item?.submittedFor?.id).subscribe((data: any) => {
  //     //             if (data?.responseCode == 200) {
  //     //               alert('Contact Person Designation Updated Successfully');
  //     //               // this.firstNameOrginal = this.superAgentForm.get('firstName')?.value;
  //     //             }
  //     //           })
  //     //           // Notify success or update UI as needed
  //     //         } else {
  //     //           console.error('Contact Person Designation Update failed', response);
  //     //           alert("Contact Person Designation Update failed");

  //     //         }
  //     //       });

  //     //   } else {

  //     //   }
  //     //   this.iscontactPerName = false;
  //     //   this.readOnly = true;
  //     // }


  // }

  clickSend(field: string) {
    console.log(field);

    const fieldMappings: { [key: string]: { kycKey: string, label: string } } = {
      accTitle: { kycKey: "companyName", label: "Company Name" },
      contactPerName: { kycKey: "contactPersonName", label: "Contact Person Name" },
      contactPerDesignation: { kycKey: "contactPerDesignation", label: "Contact Person Designation Name" },
      licenseNo: { kycKey: "bizLicenseNumber", label: "License Number" },
      licenseAuth: { kycKey: "bizLicenseAuthority", label: "bizLicenseAuthority" },
      issueDate: { kycKey: "bizLicenseDateOfIssue", label: "bizLicenseDateOfIssue" },
      expiryDate: { kycKey: "bizLicenseDateOfExpiry", label: "bizLicenseDateOfExpiry" },
      businessName: { kycKey: "bizName", label: "bizLicenseTinNumber" },
      tinNo: { kycKey: "bizLicenseTinNumber", label: "bizLicenseTinNumber" },
      grossAnnualIncome: { kycKey: "natureOfBiz", label: "natureOfBiz" },
      monthlyIncome: { kycKey: "monthlyIncome", label: "monthlyIncome" },
      netWorth: { kycKey: "netWorth", label: "netWorth" },
      fundSrc: { kycKey: "sourceOfFund", label: "sourceOfFund" },
      monthlyTurnover: { kycKey: "monthlyTurnover", label: "monthlyTurnover" },
      cmpnyLoc: { kycKey: "companyLocation", label: "companyLocation" },
      streetNo: { kycKey: "companyStreet", label: "companyStreet" },
      houseNo: { kycKey: "companyHouseNumber", label: "companyHouseNumber" },
      district: { kycKey: "companyDistrict", label: "companyDistrict" },
      province: { kycKey: "companyProvince", label: "companyProvince" },
      country: { kycKey: "companyCountry", label: "companyCountry" },
      offPhNo: { kycKey: "companyOfficePhone", label: "companyOfficePhone" },
      cmpnyEmail: { kycKey: "companyEmail", label: "companyEmail" },
    };

    const fieldData = fieldMappings[field];
    if (!fieldData) return;

    const fieldValue = this.superAgentForm.get(field)?.value;
    const confirmChange = window.confirm(`Do you want to update ${fieldData.label} to "${fieldValue}"?`);

    if (!confirmChange) return;

    let request = {
      kycType: "SUPER_AGENT",
      submittedFor: this.submittedForId,
      kycInputs: {
        [fieldData.kycKey]: fieldValue,
      }
    };

    this.masterAgentService.updateMasterAgentRegisterKYC(request).subscribe((response: any) => {
      if (response?.responseCode === 200) {
        this.masterAgentService.completeMasterAgentRegisterKYC(this.item?.submittedFor?.id).subscribe((data: any) => {
          if (data?.responseCode === 200) {
            alert(`${fieldData.label} Updated Successfully`);
            this.isEditing = false;
            this.iscontactPerName = false;
            this.istinNo = false;
            this.isexpiryDate = false;
            this.islicenseAuth = false;
            this.isissueDate = false;
            this.islicenseNo = false;
            this.isbusinessName = false;
            this.businessName = false;
            this.isgrossAnnualIncome = false;
            this.ismonthlyIncome = false;
            this.isnetWorth = false;
            this.isfundSrc = false;
            this.ismonthlyTurnover = false;
            this.iscmpnyEmail = false;
            this.isoffPhNo = false;
            this.isprovince = false;
            this.iscountry = false;
            this.isdistrict = false;
            this.ishouseNo = false;
            this.isstreetNo = false;
            this.iscmpnyLoc = false;
            this.iscontactPerDesignation = false;
            this.readOnly = true;
          }
        });
      } else {
        console.error(`${fieldData.label} Update failed`, response);
        alert(`${fieldData.label} Update failed`);
      }
    });
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
//     "page": 0,
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
//     for (let item of this.allUsers) {
//       if (this.kycId == item?.id) {
//         this.userStatus = item?.status
//         console.log("this.userStatus", this.userStatus)
//         this.seqNo = item?.seqNo;
//         this.approvedByComplianceValue = item?.masterAgentKyc?.approvedByComplianceFullName
//         console.log("approvedByComplianceValue", this.approvedByComplianceValue)
//         this.approvedByComplianceDateValue = item?.masterAgentKyc?.approvedByComplianceDate
//         console.log("approvedByComplianceDateValue", this.approvedByComplianceDateValue)
//         if (this.userStatus === 'IN_REVIEW') {
//           this.compForm.get('ComplianceInput')?.setValue(this.loginUser);
//           console.log("this.loginUser1", this.loginUser)
//           this.compForm.get('ComplianceDateInput')?.setValue(this.currentDate);
//         } else {
//           this.compForm.get('ComplianceInput')?.setValue(this.approvedByComplianceValue);
//           this.compForm.get('ComplianceDateInput')?.setValue(this.approvedByComplianceDateValue);
//         }
//         // if (item?.masterAgentKyc?.attachments.length != 0) {
//         //   let i = 1;
//         //   for (let file of item.masterAgentKyc.attachments) {
//         //     this.fileLists.push({
//         //       name: 'Attachment - ' + i,
//         //       url: this.imageUrl + '/kyc/static/' + file
//         //     })
//         //     i++;
//         //   }
//         // }
//         this.watchlistRemarksVal = item?.masterAgentKyc?.watchlistRemarks
//         // this.approvedByComplianceValue = item?.masterAgentKyc?.approvedByCompliance

//         // this.showApprove1Btn = false;
//         // this.showApprove2Btn = false;
//         // this.showApproveFinalBtn = false;
//         // this.approveStatus = item?.status
//         // if (this.approveStatus === 'IN_REVIEW') {
//         //   this.showApprove1Btn = true;
//         // } else if (this.approveStatus === 'VERIFIED_L1') {
//         //   this.showApprove2Btn = true;
//         // } else if (this.approveStatus == "VERIFIED_L2") {
//         //   this.showApproveFinalBtn = true;
//         // }
//       }
//     }
//     //saveproduct
//     for (let item of this.allUsers) {
//       if (this.kycId == item?.id) {
//         this.walletaccounts = item?.submittedFor?.walletAccount;
//         console.log(" this.walletaccounts", this.walletaccounts);
//       }
//     }
//     for (let item of this.allUsers) {
//       if (this.kycId == item?.id) {
//         this.superId = item?.submittedFor?.id;
//         console.log(" this.superId", this.superId);
//       }
//     }

//     //as mikyc
//     for (let item of this.allUsers) {
//       if (this.kycId == item?.id) {
//         this.superAgentId = item?.id;
//         this.activeFlag = item?.submittedFor?.active;
//         this.deletedFlag = item?.submittedFor?.deleted;
//         let shareholdersArray: Shareholder[] = [];
//         this.allUsers.forEach((item: any) => {
//           if (item?.masterAgentKyc?.shareholders && Array.isArray(item.masterAgentKyc.shareholders)) {
//             shareholdersArray.push(...item.masterAgentKyc.shareholders);
//           }
//         });
//         this.shareHolderArray = shareholdersArray
//         console.log("shareholdersArray", shareholdersArray);
//         let authorizedArray: signatories[] = [];
//         this.allUsers.forEach((item: any) => {
//           if (item?.masterAgentKyc?.signatories && Array.isArray(item.masterAgentKyc.signatories)) {
//             authorizedArray.push(...item.masterAgentKyc.signatories);
//           }
//         });
//         this.authorizedSignArray = authorizedArray

//         this.submittedForId = item?.submittedFor?.id
//         if (item?.status == 'IN_REVIEW' || 'APPROVED') {
//           this.readOnly = true;
//         }
//         else {
//           this.readOnly = false;
//         } //img
//         this.kycSign = item?.masterAgentKyc?.superSign_img_2;
//         this.opSign = item?.masterAgentKyc?.opsSign_img_2;
//         //new
//         this.compSign = item?.masterAgentKyc?.complianceSignaturePhoto;
//         this.compHedSign = item?.masterAgentKyc?.complianceHeadSignaturePhoto;
//         this.ceoSign = item?.masterAgentKyc?.ceoSignaturePhoto;
//         //gender
//         if (item?.masterAgentKyc?.custInfoGender == "MALE") {
//           this.MaleChecked.setValue(true);
//         }
//         if (item?.masterAgentKyc?.custInfoGender == "FEMALE") {
//           this.FemaleChecked.setValue(true);
//         }
//         //risk&watch
//         //risk
//         if (item?.masterAgentKyc?.riskCategory == "LOW") {
//           this.riskLow.setValue(true);
//         }
//         if (item?.masterAgentKyc?.riskCategory == "MEDIUM") {
//           this.riskMedium.setValue(true);
//         }
//         if (item?.masterAgentKyc?.riskCategory == "HIGH") {
//           this.riskHigh.setValue(true);
//         }
//         //watchlist
//         if (item?.masterAgentKyc?.checkedWatchlist) {
//           this.watchYes.setValue(true);
//           this.watchNo.setValue(false);
//         }
//         else if (!item?.masterAgentKyc?.checkedWatchlist && item?.masterAgentKyc?.checkedWatchlist != null) {
//           this.watchYes.setValue(false);
//           this.watchNo.setValue(true);
//         }
//         else {
//           this.watchYes.setValue(false);
//           this.watchNo.setValue(false);
//         }
//         //doc
//         if (item.masterAgentKyc.validLicenseNo) {
//           this.licenseNoo.setValue(true);
//         }
//         if (item.masterAgentKyc.validLicenseYes) {
//           this.licenseYes.setValue(true);
//         }
//         if (item.masterAgentKyc.validPassportNo) {
//           this.passNo.setValue(true);
//         }
//         if (item.masterAgentKyc.validPassportYes) {
//           this.passYes.setValue(true);
//         }
//         if (item.masterAgentKyc.validSignatoryNo) {
//           this.signNo.setValue(true);
//         }
//         if (item.masterAgentKyc.validSignatoryYes) {
//           this.signYes.setValue(true);
//         }
//         if (item.masterAgentKyc.validAssociationNo) {
//           this.articleNo.setValue(true);
//         }
//         if (item.masterAgentKyc.validAssociationYes) {
//           this.articleYes.setValue(true);
//         }
//         if (item.masterAgentKyc.validResolutionNo) {
//           this.ResNo.setValue(true);
//         }
//         if (item.masterAgentKyc.validResolutionYes) {
//           this.ResYes.setValue(true);
//         }
//         if (item.masterAgentKyc.validPowerOfAttNo) {
//           this.powerNo.setValue(true);
//         }
//         if (item.masterAgentKyc.validPowerOfAttYes) {
//           this.powerYes.setValue(true);
//         }
//         //havemno
//         if (item.masterAgentKyc.otherMnoNo) {
//           this.mnoNo.setValue(true);
//         }
//         if (item.masterAgentKyc.otherMnoYes) {
//           this.mnoYes.setValue(true);
//         }
//         //NEW
//         this.taskiraPhotoFront = item?.masterAgentKyc?.contactIdProofFrontPhoto;
//         this.taskiraPhotoBack = item?.cocukrporateKyc?.contactIdProofBackPhoto;
//         this.contactPersonSign = item?.masterAgentKyc?.contactSignaturePhoto;

//         this.businessLicensePhoto = item?.masterAgentKyc?.bizLicensePhoto;
//         this.cmpnyAddressProofFront = item?.masterAgentKyc?.addressProofPhoto;
//         // this.cmpnyAddressProofBack = item?.masterAgentKyc?.idProofBackPhoto;

//         this.shareholderPassportPhotoFront = item?.masterAgentKyc?.shareholders?.idProofFrontPhoto;
//         this.shareholderPassportPhotoBack = item?.masterAgentKyc?.shareholders?.idProofBackPhoto;

//         this.AuthorizedSignPhotoFront = item?.masterAgentKyc?.signatoryPhoto;
//         this.AuthorizedSignPhotoBack = item?.masterAgentKyc?.signatoryIdProofBackPhoto;
//         this.AuthorizedSignTaskiraPhoto = item?.masterAgentKyc?.signatoryIdProofFrontPhoto;
//         this.powerPhoto = item?.masterAgentKyc?.authorizationLetterPhoto;
//         this.DigitalSign = item?.masterAgentKyc?.signatorySignature;

//         //NEW
//         this.superImg = item?.masterAgentKyc?.signatories[0].signatoryPhoto;
//         this.presidentSign = item?.masterAgentKyc?.prezSign_img_1;
//         // this.agentVerifySign = item?.masterAgentKyc?.superSign_img_1;
//         this.vicePresSign = item?.masterAgentKyc?.vicePrezSign_img_1;

//         if (this.readOnly) {
//           this.FemaleChecked.disable();
//           this.MaleChecked.disable();
//         }
//         if (item?.masterAgentKyc?.signatories[0].signatoryPhoto) {
//           // this.superImg = item?.kycInputs?.custPhoto_img_0;
//           this.fileLists.push({
//             name: 'Master Agent Profile Picture',
//             url: this.imageUrl + '/kyc/static/' + this.superImg
//             // url: this.imageUrl + '/um/static/profile/' + this.superImg
//           })
//         }

//         console.log("Files", this.fileLists);
//         //new patchvalue
//         // this.setFieldValue('accTitle', item?.masterAgentKyc?.companyName);
//         // this.setFieldValue('MMwallet', item?.masterAgentKyc?.companyWalletNumber);
//         // this.setFieldValue('accOpenDate', item?.masterAgentKyc?.companyAccOpenDate);
//         // this.setFieldValue('contactPerName', item?.masterAgentKyc?.contactPersonName);
//         // this.setFieldValue('contactPerDesignation', item?.masterAgentKyc?.contactPersonDesignation);
//         // this.setFieldValue('NoOfShareHolder', item?.masterAgentKyc?.companyNoOfShareholders);

//         // this.setFieldValue('licenseNo', item?.masterAgentKyc?.bizLicenseNumber);
//         // this.setFieldValue('licenseAuth', item?.masterAgentKyc?.bizLicenseAuthority);
//         // this.setFieldValue('issueDate', item?.masterAgentKyc?.bizLicenseDateOfIssue);
//         // this.setFieldValue('expiryDate', item?.masterAgentKyc?.bizLicenseDateOfExpiry);
//         // this.setFieldValue('tinNo', item?.masterAgentKyc?.bizLicenseTinNumber);
//         // this.setFieldValue('businessName', item?.masterAgentKyc?.bizName);

//         // this.setFieldValue('grossAnnualIncome', item?.masterAgentKyc?.natureOfBiz);
//         // this.setFieldValue('monthlyIncome', item?.masterAgentKyc?.monthlyIncome);
//         // this.setFieldValue('netWorth', item?.masterAgentKyc?.netWorth);
//         // this.setFieldValue('fundSrc', item?.masterAgentKyc?.sourceOfFund);
//         // this.setFieldValue('monthlyTurnover', item?.masterAgentKyc?.monthlyTurnover);
//         // this.setFieldValue('cmpnyLoc', item?.masterAgentKyc?.companyLocation);
//         // this.setFieldValue('streetNo', item?.masterAgentKyc?.companyStreet);
//         // this.setFieldValue('houseNo', item?.masterAgentKyc?.companyHouseNumber);
//         // this.setFieldValue('district', item?.masterAgentKyc?.companyDistrict);
//         // this.setFieldValue('province', item?.masterAgentKyc?.companyProvince);
//         // this.setFieldValue('country', item?.masterAgentKyc?.companyCountry);
//         // this.setFieldValue('offPhNo', item?.masterAgentKyc?.companyOfficePhone);
//         // this.setFieldValue('cmpnyEmail', item?.masterAgentKyc?.companyEmail);

//         // this.setFieldValue('firstName', item?.masterAgentKyc?.shareholders?.firstName);
//         // this.setFieldValue('lastName', item?.masterAgentKyc?.shareholders?.lastName);
//         // this.setFieldValue('fatherName', item?.masterAgentKyc?.shareholders?.fatherName);
//         // this.setFieldValue('tazkira', item?.masterAgentKyc?.shareholders?.idProofNumber);
//         // this.setFieldValue('dob', item?.masterAgentKyc?.shareholders?.dob);
//         // this.setFieldValue('birthPlace', item?.masterAgentKyc?.shareholders?.placeOfBirth);
//         // this.setFieldValue('Nationality', item?.masterAgentKyc?.shareholders?.nationality);
//         // this.setFieldValue('shareholderIncome', item?.masterAgentKyc?.shareholders?.monthlyIncome);
//         // this.setFieldValue('shareholderPerc', item?.masterAgentKyc?.shareholders?.shareholdingPercentage);
//         // this.setFieldValue('otherSrc', item?.masterAgentKyc?.shareholders?.sourceOfIncome);
//         // this.setFieldValue('shareholderRelation', item?.masterAgentKyc?.shareholders?.relationship);
//         // this.setFieldValue('shareholderPh', item?.masterAgentKyc?.shareholders?.phone);
//         // this.setFieldValue('shareholderTin', item?.masterAgentKyc?.shareholders?.tinNumber);

//         // this.setFieldValue('shareCurrLoc', item?.masterAgentKyc?.shareholders?.currLocation);
//         // this.setFieldValue('shareCurrDis', item?.masterAgentKyc?.shareholders?.currDistrict);
//         // this.setFieldValue('shareCurrPro', item?.masterAgentKyc?.shareholders?.currProvince);
//         // this.setFieldValue('shareCurrCount', item?.masterAgentKyc?.shareholders?.currCountry);

//         // this.setFieldValue('sharePerLoc', item?.masterAgentKyc?.shareholders?.permLocation);
//         // this.setFieldValue('sharePerDis', item?.masterAgentKyc?.shareholders?.permDistrict);
//         // this.setFieldValue('sharePerPro', item?.masterAgentKyc?.shareholders?.permProvince);
//         // this.setFieldValue('sharePerCount', item?.masterAgentKyc?.shareholders?.permCountry);

//         // this.setFieldValue('firstNameAuth', item?.masterAgentKyc?.signatoryFirstName);
//         // this.setFieldValue('lastNameAuth', item?.masterAgentKyc?.signatoryLastName);
//         // this.setFieldValue('tazkiraAuth', item?.masterAgentKyc?.signatoryIdProofNumber);
//         // this.setFieldValue('dobAuth', item?.masterAgentKyc?.signatoryDOB);

//         // this.setFieldValue('birthPlaceAuth', item?.masterAgentKyc?.signatoryPlaceOfBirth);
//         // this.setFieldValue('NationalityAuth', item?.masterAgentKyc?.signatoryNationality);
//         // this.setFieldValue('designationAuth', item?.masterAgentKyc?.signatoryDesignation);
//         // this.setFieldValue('resiAuth', item?.masterAgentKyc?.signatoryResidentAddress);
//         // this.setFieldValue('phAuth', item?.masterAgentKyc?.signatoryPhone);
//         // this.setFieldValue('srcAuth', item?.masterAgentKyc?.signatorySourceOfIncome);
//         // this.setFieldValue('incomeAuth', item?.masterAgentKyc?.signatoryMonthlyIncome);
//         // this.setFieldValue('typeAuth', item?.masterAgentKyc?.signatoryType);

//         // this.setFieldValue('presidentName', item?.masterAgentKyc?.not);
//         // this.setFieldValue('presidentDate', item?.masterAgentKyc?.not);
//         // this.setFieldValue('V_presidentName', item?.masterAgentKyc?.not);
//         // this.setFieldValue('V_presidentDate', item?.masterAgentKyc?.not);
//         //old patchvalue
//         this.dobValue = item?.masterAgentKyc?.signatoryDOB
//         this.firstNameValue = item?.masterAgentKyc?.signatoryFirstName;
//         this.superAgentForm.patchValue({ accTitle: item?.masterAgentKyc?.companyName || 'NIL' })
//         this.superAgentForm.patchValue({ MMwallet: item?.masterAgentKyc?.companyWalletNumber || 'NIL' })
//         this.superAgentForm.patchValue({ accOpenDate: item?.masterAgentKyc?.companyAccOpenDate || 'NIL' })
//         this.superAgentForm.patchValue({ contactPerName: item?.masterAgentKyc?.contactPersonName || 'NIL' })
//         this.superAgentForm.patchValue({ contactPerDesignation: item?.masterAgentKyc?.contactPersonDesignation || 'NIL' })
//         this.superAgentForm.patchValue({ NoOfShareHolder: item?.masterAgentKyc?.companyNoOfShareholders || 'NIL' })
//         this.superAgentForm.patchValue({ licenseNo: item?.masterAgentKyc?.bizLicenseNumber || 'NIL' })
//         this.superAgentForm.patchValue({ licenseAuth: item?.masterAgentKyc?.bizLicenseAuthority || 'NIL' })
//         this.superAgentForm.patchValue({ issueDate: item?.masterAgentKyc?.bizLicenseDateOfIssue || 'NIL' })
//         this.superAgentForm.patchValue({ expiryDate: item?.masterAgentKyc?.bizLicenseDateOfExpiry || 'NIL' })

//         this.superAgentForm.patchValue({ tinNo: item?.masterAgentKyc?.bizLicenseTinNumber || 'NIL' })
//         this.superAgentForm.patchValue({ businessName: item?.masterAgentKyc?.bizName || 'NIL' })
//         this.superAgentForm.patchValue({ grossAnnualIncome: item?.masterAgentKyc?.natureOfBiz || 'NIL' })
//         // this.superAgentForm.patchValue({ monthlyIncome: item?.masterAgentKyc?.monthlyIncome || 'NIL' })
//         this.superAgentForm.patchValue({
//           monthlyIncome: item?.masterAgentKyc?.monthlyIncome
//             ? `AFN ${this.formatNumber(item.masterAgentKyc.monthlyIncome)}`
//             : 'NIL'
//         });
//         this.superAgentForm.patchValue({ netWorth: item?.masterAgentKyc?.netWorth || 'NIL' })
//         this.superAgentForm.patchValue({ fundSrc: item?.masterAgentKyc?.sourceOfFund || 'NIL' })
//         // this.superAgentForm.patchValue({ monthlyTurnover: item?.masterAgentKyc?.monthlyTurnover || 'NIL' })
//         this.superAgentForm.patchValue({
//           monthlyTurnover: item?.masterAgentKyc?.monthlyTurnover
//             ? `AFN ${this.formatNumber(item.masterAgentKyc.monthlyTurnover)}`
//             : 'NIL'
//         });
//         this.superAgentForm.patchValue({ cmpnyLoc: item?.masterAgentKyc?.companyLocation || 'NIL' })
//         this.superAgentForm.patchValue({ streetNo: item?.masterAgentKyc?.companyStreet || 'NIL' })
//         this.superAgentForm.patchValue({ houseNo: item?.masterAgentKyc?.companyHouseNumber || 'NIL' })
//         this.superAgentForm.patchValue({ district: item?.masterAgentKyc?.companyDistrict || 'NIL' })
//         this.superAgentForm.patchValue({ province: item?.masterAgentKyc?.companyProvince || 'NIL' })
//         this.superAgentForm.patchValue({ country: item?.masterAgentKyc?.companyCountry || 'NIL' })
//         this.superAgentForm.patchValue({ offPhNo: item?.masterAgentKyc?.companyOfficePhone || 'NIL' })
//         this.superAgentForm.patchValue({ cmpnyEmail: item?.masterAgentKyc?.companyEmail || 'NIL' })

//         this.superAgentForm.patchValue({ firstName: item?.masterAgentKyc?.shareholders?.firstName || 'NIL' })
//         this.superAgentForm.patchValue({ lastName: item?.masterAgentKyc?.shareholders?.lastName || 'NIL' })
//         this.superAgentForm.patchValue({ fatherName: item?.masterAgentKyc?.shareholders?.fatherName || 'NIL' })
//         this.superAgentForm.patchValue({ tazkira: item?.masterAgentKyc?.shareholders?.idProofNumber || 'NIL' })
//         this.superAgentForm.patchValue({ dob: item?.masterAgentKyc?.shareholders?.dob || 'NIL' })
//         this.superAgentForm.patchValue({ birthPlace: item?.masterAgentKyc?.shareholders?.placeOfBirth || 'NIL' })
//         this.superAgentForm.patchValue({ Nationality: item?.masterAgentKyc?.shareholders?.nationality || 'NIL' })
//         this.superAgentForm.patchValue({ shareholderIncome: item?.masterAgentKyc?.shareholders?.monthlyIncome || 'NIL' })
//         this.superAgentForm.patchValue({ shareholderPerc: item?.masterAgentKyc?.shareholders?.shareholdingPercentage || 'NIL' })
//         this.superAgentForm.patchValue({ otherSrc: item?.masterAgentKyc?.shareholders?.sourceOfIncome || 'NIL' })
//         this.superAgentForm.patchValue({ shareholderRelation: item?.masterAgentKyc?.shareholders?.relationship || 'NIL' })
//         this.superAgentForm.patchValue({ shareholderPh: item?.masterAgentKyc?.shareholders?.phone || 'NIL' })
//         this.superAgentForm.patchValue({ shareholderTin: item?.masterAgentKyc?.shareholders?.tinNumber || 'NIL' })

//         this.superAgentForm.patchValue({ shareCurrLoc: item?.masterAgentKyc?.shareholders?.currLocation || 'NIL' })
//         this.superAgentForm.patchValue({ shareCurrDis: item?.masterAgentKyc?.shareholders?.currDistrict || 'NIL' })
//         this.superAgentForm.patchValue({ shareCurrPro: item?.masterAgentKyc?.shareholders?.currProvince || 'NIL' })
//         this.superAgentForm.patchValue({ shareCurrCount: item?.masterAgentKyc?.shareholders?.currCountry || 'NIL' })

//         this.superAgentForm.patchValue({ sharePerLoc: item?.masterAgentKyc?.shareholders?.permLocation || 'NIL' })
//         this.superAgentForm.patchValue({ sharePerDis: item?.masterAgentKyc?.shareholders?.permDistrict || 'NIL' })
//         this.superAgentForm.patchValue({ sharePerPro: item?.masterAgentKyc?.shareholders?.permProvince || 'NIL' })
//         this.superAgentForm.patchValue({ sharePerCount: item?.masterAgentKyc?.shareholders?.permCountry || 'NIL' })

//         this.superAgentForm.patchValue({ firstNameAuth: item?.masterAgentKyc?.signatoryFirstName || 'NIL' })
//         this.superAgentForm.patchValue({ lastNameAuth: item?.masterAgentKyc?.signatoryLastName || 'NIL' })
//         this.superAgentForm.patchValue({ tazkiraAuth: item?.masterAgentKyc?.signatoryIdProofNumber || 'NIL' })
//         this.superAgentForm.patchValue({ dobAuth: item?.masterAgentKyc?.signatoryDOB || 'NIL' })
//         this.superAgentForm.patchValue({ birthPlaceAuth: item?.masterAgentKyc?.signatoryPlaceOfBirth || 'NIL' })
//         this.superAgentForm.patchValue({ NationalityAuth: item?.masterAgentKyc?.signatoryNationality || 'NIL' })
//         console.log("signatoryNationality", item?.masterAgentKyc?.signatoryNationality)
//         this.superAgentForm.patchValue({ designationAuth: item?.masterAgentKyc?.signatoryDesignation || 'NIL' })
//         this.superAgentForm.patchValue({ resiAuth: item?.masterAgentKyc?.signatoryResidentAddress || 'NIL' })
//         this.superAgentForm.patchValue({ phAuth: item?.masterAgentKyc?.signatoryPhone || 'NIL' })
//         this.superAgentForm.patchValue({ srcAuth: item?.masterAgentKyc?.signatorySourceOfIncome || 'NIL' })
//         this.superAgentForm.patchValue({ incomeAuth: item?.masterAgentKyc?.signatoryMonthlyIncome || 'NIL' })
//         this.superAgentForm.patchValue({ typeAuth: item?.masterAgentKyc?.signatoryType || 'NIL' })

//         this.superAgentForm.patchValue({ presidentName: item?.masterAgentKyc?.not || 'NIL' })
//         this.superAgentForm.patchValue({ presidentDate: item?.masterAgentKyc?.not || 'NIL' })
//         this.superAgentForm.patchValue({ V_presidentName: item?.masterAgentKyc?.not || 'NIL' })
//         this.superAgentForm.patchValue({ V_presidentDate: item?.masterAgentKyc?.not || 'NIL' })

//         this.superAgentForm.patchValue({ KycProcessed: item?.masterAgentKyc?.kycProcessedBy || 'NIL' })
//         this.superAgentForm.patchValue({ KycProcessedDate: item?.masterAgentKyc?.kycProcessedDate || 'NIL' })
//         this.superAgentForm.patchValue({ Verified: item?.masterAgentKyc?.verifiedByOps || 'NIL' })
//         this.superAgentForm.patchValue({ VerifiedDate: item?.masterAgentKyc?.verifiedByOpsDate || 'NIL' })
//         this.superAgentForm.patchValue({ Compliance: item?.masterAgentKyc?.approvedByCompliance || 'NIL' })
//         this.superAgentForm.patchValue({ ComplianceDate: item?.masterAgentKyc?.approvedByComplianceDate || 'NIL' })
//         //old patchvalue

//         this.PresidentName = item?.masterAgentKyc?.undertakenPrezName;
//         this.Date = item?.masterAgentKyc?.undertakenPrezDate;
//         this.VPresidentName = item?.masterAgentKyc?.custInfoFirstName;
//         this.VDate = item?.masterAgentKyc?.custInfoFatherName;

//         //abmmc verify
//         this.firstNameValue = item?.submittedFor?.firstName
//         this.kycProcessed = item?.submittedFor?.firstName + ' ' + item?.submittedFor?.lastName;
//         this.kycProcessedDate = item?.masterAgentKyc?.kycProcessedDate;
//         this.VerifiedOp = item?.masterAgentKyc?.custInfoFirstName;
//         this.VerifiedOpDate = item?.masterAgentKyc?.custInfoFatherName;
//         this.compliance = item?.masterAgentKyc?.custInfoFirstName;
//         this.complianceDate = item?.masterAgentKyc?.custInfoFirstName;


//       }
//     }
//     //end
//     for (let item of this.users) {
//       if (this.kycId == item?.id) {
//         this.walletaccounts = item?.submittedFor?.walletAccount
//         console.log(" this.walletaccounts", this.walletaccounts);

//       }
//     }
//   });
// }