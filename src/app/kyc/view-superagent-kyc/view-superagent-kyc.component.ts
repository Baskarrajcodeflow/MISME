import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { KycModuleService } from '../kyc/kyc-module.service';
import { UserManagementService } from '../../user-management/user-management/user-management/openapi';
import { saveAs } from 'file-saver';
import { MatIconModule } from '@angular/material/icon';
import { CorporateService } from '../../corporate/corporate.service';
import { SharedFunctionsService } from '../../shared-functions.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CurrencyFormatPipe } from '../../pipe/currency-format.pipe';
import { finalize, catchError, combineLatest, concatMap, debounceTime, distinctUntilChanged, filter, from, map, Observable, of, shareReplay, switchMap, take, tap, throwError, toArray } from 'rxjs';
import { PermissionService } from '../../permission.service';

interface fileList {
  name: string,
  url: any,
  upload: any
  mapping?: string

}
interface Shareholder {
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
  shareholdingPercentage: any;
  sourceOfIncome: any;
  relationship: any;
  phone: any
  tinNumber: any
  idProofFrontPhoto: any;
  idProofBackPhoto: any
  newFileProfile: any

  // Add other fields as necessary
}
@Component({
  selector: 'app-view-superagent-kyc',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, ReactiveFormsModule, FormsModule, CommonModule, MatIconModule],
  templateUrl: './view-superagent-kyc.component.html',
  styleUrl: './view-superagent-kyc.component.css'
})
export class ViewSuperagentKycComponent {
  compForm: FormGroup = new FormGroup({});
  regForm: FormGroup = new FormGroup({});
  regInput: FormControl = new FormControl();
  regDateInput: FormControl = new FormControl();
  remarkForm: FormGroup = new FormGroup({});
  remark: FormControl = new FormControl();
  ComplianceInput: FormControl = new FormControl();
  ComplianceDateInput: FormControl = new FormControl();

  reason = new FormControl();
  MaleChecked = new FormControl();
  FemaleChecked = new FormControl();
  provinces$!: Observable<any[]>;

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
  shareHolderDetailsForm: FormGroup = new FormGroup({});
  signatoryDetailsForm: FormGroup = new FormGroup({});
  agencyForm: FormGroup = new FormGroup({});
  ngoForm: FormGroup = new FormGroup({});

  refundForm: FormGroup = new FormGroup({});
  otherDocsArray: any[] = [];
  approveStatus: any;
  showApprove1Btn: boolean = false;
  showApprove2Btn: boolean = false;
  showApproveFinalBtn: boolean = false;
  fileLists: fileList[] = [];
  filesEdited: fileList[] = [];
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
  presidentSign: any;
  vicePresSign: any;
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
  DataRisk: boolean = false;
  noDataRisk: boolean = false;
  riskTierValue: any;
  newFileProfile: any;
  newFile: any;
  newComp: any;
  newCompHead: any;
  newCeo: any;
  authSigSignature1: any
  authSigSignature2: any
  authSigImage1: any
  authSigImage2: any
  noDataSdn: boolean = false;
  opsSignaturePhoto: any;
  previousRoute: any;
  shareholderIdFront: any;
  shareholderIdBack: any;
  authSignPhoto: any;
  authSignature: any;
  authIdFront: any;
  authIdBack: any;
  contactIdProofBackPhoto: any;
  kycType: any;
  presidentVicepresidentName: any;
  presidentVicepresidentSignImg: any;
  presidentViceImg: any;
  regName: any;
  regDate: any;
  regEmail: any;
  userType: any;
  showRegSection: boolean = false;
  regBySign: any;
  regSign: any;
  modifiedName: any;
  modifiedEmail: any;
  modifiedDate: any;
  originalCorporateKyc: any;
  formInitialised: boolean = false;
  editMode: boolean = false;
  purposeOfAccount: any;
  natureOfBusinessData: any;
  countryNamePer: any;
  BirthProvinceValue: any;
  BirthCountryValue: any;
  countryNameCur: any;
  provincesBirth: any;
  accPurposeData: any;
  incomeSourceData: any;
  provinceIdCur: any;
  provinceCurTarget: any;
  provinceIdPer: any;
  provincePerTarget: any;
  districtsCur: any;
  districtsPer: any;
  selectedProvincePer: any;
  selectedProvinceCur: any;

  showIdExist: boolean = false;
  phoneErrorReg: boolean = false;
  emailError: boolean = false;
  originalGovtUnKyc: any;
  kycTypeValue: any;
  originalNGOKyc: any;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private KycService: KycModuleService,
    private cdr: ChangeDetectorRef,
    private userManagemantService: UserManagementService,
    // private masterAgentService: CorporateService,
    private corporate: CorporateService,
    private sharedFunctionsServic: SharedFunctionsService,
    private sanitizer: DomSanitizer,
    private currencyFormatPipe: CurrencyFormatPipe,
    private permissionService: PermissionService
  ) {
    const dateObj = new Date();
    this.currentDate = dateObj.toISOString().substring(0, 10);
    console.log("currentDate", this.currentDate);
    this.refundForm = this.fb.group({
      digitalKey: ['', Validators.required], // Assuming batchId is required
    });
    this.permissionService.hideSidebar = false; // Hide sidebar when viewing customer details
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
  onProvinceChange(selectedProvinceName: string) {
    // Find the province by its name in the list
    const selectedProvince = this.provinces.find((province: any) => province.name === selectedProvinceName);

    if (selectedProvince) {
      // Now you can pass the province id to getDistricts
      this.getDistricts(selectedProvince.id);
    }
  }

  getImagesCEO(imgParam: any) {
    this.KycService.getImage(imgParam).subscribe((res) => {
      console.log(res);
      const objectURL = URL.createObjectURL(res);
      this.newCeo = objectURL;
    })
  }
  getImages(imgParam: any) {
    this.KycService.getImage(imgParam).subscribe((res) => {
      console.log(res);
      const objectURL = URL.createObjectURL(res);
      this.newFile = objectURL;
      this.regBySign = objectURL
    })
  }
  signatureImages: { [key: string]: SafeUrl } = {};

  getPreAndVicePreImg(imgParam: any, mapping: any) {
    this.KycService.getImage(imgParam).subscribe((res) => {
      const unsafeUrl = URL.createObjectURL(res);
      const safeUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeUrl);
      this.signatureImages = { ...this.signatureImages, [mapping]: safeUrl };

      if (this.signatureImages['authSigSignature1']) {
      }
      this.cdr.detectChanges();
    })
  }
  getImagesProfile(imgParam: any) {
    this.KycService.getImage(imgParam).subscribe((res) => {
      console.log(res);
      const objectURL = URL.createObjectURL(res);
      this.newFileProfile = objectURL;
    })
  }
  getAuthSignature1(imgParam: any) {
    this.KycService.getImage(imgParam).subscribe((res) => {
      console.log(res);
      const objectURL = URL.createObjectURL(res);
      this.authSigImage1 = objectURL;
    })
  }
  getAuthSignature2(imgParam: any) {
    this.KycService.getImage(imgParam).subscribe((res) => {
      console.log(res);
      const objectURL = URL.createObjectURL(res);
      this.authSigImage2 = objectURL;
    })
  }


  isEditingList: boolean[] = [];
  natureofBusinesses: any
  nationalities: any
  districts: any
  provinces: any




  ngOnInit(): void {
    this.isEditingList = new Array(this.fileLists.length).fill(false);
    this.getNatureofBusiness()
    this.getAccPurpose()
    this.getCountries()
    this.getDistricts()
    this.getProvinces()
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
      console.log("params['from'] - params['viewOnly']", params['from'], params['viewOnly']);
      this.viewOnly = params['viewOnly'] === 'true';
    });
    this.KycService.getProfileDetails().subscribe((data: any) => {
      this.profileDetails = data?.data
      this.loginUser = this.profileDetails?.firstName + ' ' + this.profileDetails?.lastName
      // console.log("this.loginUser", this.loginUser)
      // this.superImg = this.profileDetails?.profilePic;
      // console.log("this.superImg", this.superImg);
      this.approvedByComplianceValue = this.item?.corporateKyc?.approvedByComplianceFullName
      console.log("approvedByComplianceValue", this.approvedByComplianceValue)
      this.approvedByComplianceDateValue = this.item?.corporateKyc?.approvedByComplianceDate
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

    //instead getAllKyc 
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
    this.regName = this.item?.submittedBy?.firstName + " " + this.item?.submittedBy?.lastName;
    this.regEmail = this.item?.submittedBy?.email
    this.regForm.get('regInput')?.setValue(this.regName);
    this.regDate = this.item?.corporateKyc?.companyAccOpenDate;
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
    // if (item?.attachments.length != 0) {
    //   let i = 1;
    //   for (let file of item.attachments) {
    //     this.fileLists.push({
    //       name: 'Attachment - ' + i,
    //       url: this.imageUrl + '/kyc/static/' + file
    //     })
    //     i++;
    //   }
    // }
    //new
    if (this.kycType == 'CORPORATE') {
      //
      this.initCorporateForm();
      this.originalCorporateKyc = this.superAgentForm.getRawValue(); // deep clone

    }
    else if (this.kycType == 'GOVT_AGENCY' || this.kycType == 'UN_AGENCY') {
      this.initAgencyForm();
      this.originalGovtUnKyc = this.agencyForm.getRawValue(); // deep clone
    }
    else if (this.kycType == 'NGO') {
      this.initNgoForm();
      this.originalNGOKyc = this.ngoForm.getRawValue(); // deep clone
    }



    /* if (this.item?.corporateKyc?.otherDocs) {
      this.otherdocsorNot = this.item.corporateKyc.otherDocs
      const otherDocsArray = this.item.corporateKyc.otherDocs.split(',');
      let i = 1;
      for (let file of otherDocsArray) {
        this.fileLists.push({
          name: 'Other Document - ' + i,
          url: file,
          upload: 'otherDocs'

        });
        i++;
      }
    } */
    this.watchlistRemarksVal = this.item?.corporateKyc?.watchlistRemarks

    //this.walletaccounts = this.item?.submittedFor?.walletAccount;
    // console.log(" this.walletaccounts", this.walletaccounts);

    this.superId = this.item?.submittedFor?.id;
    console.log(" this.superId", this.superId);

    this.superAgentId = this.item?.id;
    this.activeFlag = this.item?.submittedFor?.active;
    this.deletedFlag = this.item?.submittedFor?.deleted;
    // let shareholdersArray: Shareholder[] = [];
    // this.item.forEach((item: any) => {
    //   if (item?.corporateKyc?.shareholders && Array.isArray(item.corporateKyc.shareholders)) {
    //     shareholdersArray.push(...item.corporateKyc.shareholders);
    //   }
    // });
    // this.shareHolderArray = shareholdersArray
    // console.log("shareholdersArray", shareholdersArray);
    // let authorizedArray: signatories[] = [];
    // this.item.forEach((item: any) => {
    //   if (item?.corporateKyc?.signatories && Array.isArray(item.corporateKyc.signatories)) {
    //     authorizedArray.push(...item.corporateKyc.signatories);
    //   }
    // });
    // this.authorizedSignArray = authorizedArray

    this.submittedForId = this.item?.submittedFor?.id
    if (this.item?.status == 'IN_REVIEW' || 'APPROVED') {
      // this.readOnly = true;
    }
    else {
      // this.readOnly = false;
    } //img
    this.kycSign = this.item?.corporateKyc?.superSign_img_2;
    this.opSign = this.item?.corporateKyc?.opsSign_img_2;
    this.authSigSignature1 = this.item?.corporateKyc?.signatories[0]?.signaturePhoto;
    this.authSigSignature2 = this.item?.corporateKyc?.signatories[1]?.signaturePhoto;
    if (this.authSigSignature1) {
      this.getAuthSignature1(this.authSigSignature1)
    }
    if (this.authSigSignature2) {
      this.getAuthSignature2(this.authSigSignature2)
    }
    //new  //caused error
    if (!!this.item?.corporateKyc?.opsSignaturePhoto) {
      this.regSign = this.item?.corporateKyc?.opsSignaturePhoto;
      this.getImages(this.regSign)
    }
    if (!!this.item?.corporateKyc?.complianceSignaturePhoto) {
      this.compSign = this.item?.corporateKyc?.complianceSignaturePhoto;
      this.getImagesComp(this.compSign)
    }
    if (!!this.item?.corporateKyc?.complianceHeadSignaturePhoto) {
      this.compHedSign = this.item?.corporateKyc?.complianceHeadSignaturePhoto;
      this.getImagesCompHead(this.compHedSign)
    }
    if (!!this.item?.corporateKyc?.ceoSignaturePhoto) {
      this.ceoSign = this.item?.corporateKyc?.ceoSignaturePhoto;
      this.getImagesCEO(this.ceoSign)
    }
    if (this.item?.corporateKyc?.shareholders[0]?.idProofFrontPhoto) {
      this.getPreAndVicePreImg(this.item?.corporateKyc?.shareholders[0]?.idProofFrontPhoto, 'presidentViceImg');
    } else {
      this.getPreAndVicePreImg(this.item?.corporateKyc?.shareholders[1]?.idProofFrontPhoto, 'presidentViceImg');
    }
    //gender
    if (this.item?.corporateKyc?.custInfoGender == "MALE") {
      this.MaleChecked.setValue(true);
    }
    if (this.item?.corporateKyc?.custInfoGender == "FEMALE") {
      this.FemaleChecked.setValue(true);
    }
    //risk&watch
    //risk
    if (this.item?.status != 'PENDING') {
      if (this.item?.corporateKyc?.riskCategory == "LOW") {
        this.riskLow.setValue(true);
      }
      if (this.item?.corporateKyc?.riskCategory == "MEDIUM") {
        this.riskMedium.setValue(true);
      }
      if (this.item?.corporateKyc?.riskCategory == "HIGH") {
        this.riskHigh.setValue(true);
      }
      //watchlist
      if (this.item?.corporateKyc?.checkedWatchlist) {
        this.watchYes.setValue(true);
        this.watchNo.setValue(false);
      }
      else if (!this.item?.corporateKyc?.checkedWatchlist && this.item?.corporateKyc?.checkedWatchlist != null) {
        this.watchYes.setValue(false);
        this.watchNo.setValue(true);
      }
      else {
        this.watchYes.setValue(false);
        this.watchNo.setValue(false);
      }
    }
    /* getProvince$(): Observable<any[]> {
   return this.corporate.getprovinces().pipe(
     map((res: any) => res?.data || [])
   );
 } */




    //doc
    /* if (this.item?.corporateKyc?.validLicenseNo) {
      this.licenseNoo.setValue(true);
    }
    if (this?.item.corporateKyc?.validLicenseYes) {
      this.licenseYes.setValue(true);
    }
    if (this?.item.corporateKyc?.validPassportNo) {
      this.passNo.setValue(true);
    }
    if (this.item.corporateKyc?.validPassportYes) {
      this.passYes.setValue(true);
    }
    if (this.item?.corporateKyc?.validSignatoryNo) {
      this.signNo.setValue(true);
    }
    if (this.item?.corporateKyc.validSignatoryYes) {
      this.signYes.setValue(true);
    }
    if (this.item.corporateKyc?.validAssociationNo) {
      this.articleNo.setValue(true);
    }
    if (this.item.corporateKyc.validAssociationYes) {
      this.articleYes.setValue(true);
    }
    if (this.item.corporateKyc.validResolutionNo) {
      this.ResNo.setValue(true);
    }
    if (this.item.corporateKyc.validResolutionYes) {
      this.ResYes.setValue(true);
    }
    if (this.item.corporateKyc.validPowerOfAttNo) {
      this.powerNo.setValue(true);
    }
    if (this.item.corporateKyc.validPowerOfAttYes) {
      this.powerYes.setValue(true);
    }
    //havemno
    if (this.item.corporateKyc.otherMnoNo) {
      this.mnoNo.setValue(true);
    }
    if (this.item.corporateKyc.otherMnoYes) {
      this.mnoYes.setValue(true);
    } */
    //NEW
    //this.taskiraPhotoFront = this.item?.corporateKyc?.contactIdProofFrontPhoto;
    // this.taskiraPhotoBack = this.item?.cocukrporateKyc?.contactIdProofBackPhoto;
    //this.contactPersonSign = this.item?.corporateKyc?.contactSignaturePhoto;

    //this.businessLicensePhoto = this.item?.corporateKyc?.bizLicensePhoto;
    //this.cmpnyAddressProofFront = this.item?.corporateKyc?.addressProofPhoto;
    // this.cmpnyAddressProofBack = item?.corporateKyc?.idProofBackPhoto;

    this.shareholderPassportPhotoFront = this.item?.corporateKyc?.shareholders?.idProofFrontPhoto;
    this.shareholderPassportPhotoBack = this.item?.corporateKyc?.shareholders?.idProofBackPhoto;

    // this.AuthorizedSignPhotoFront = this.item?.corporateKyc?.signatoryPhoto;
    this.AuthorizedSignPhotoBack = this.item?.corporateKyc?.signatoryIdProofBackPhoto;
    this.AuthorizedSignTaskiraPhoto = this.item?.corporateKyc?.signatoryIdProofFrontPhoto;
    this.powerPhoto = this.item?.corporateKyc?.authorizationLetterPhoto;
    this.DigitalSign = this.item?.corporateKyc?.signatorySignature;

    //NEW
    // this.superImg = this.item?.corporateKyc?.signatories[0].signatoryPhoto;
    this.presidentSign = this.item?.corporateKyc?.prezSign_img_1;
    // this.agentVerifySign = item?.corporateKyc?.superSign_img_1;
    this.vicePresSign = this.item?.corporateKyc?.vicePrezSign_img_1;

    if (this.readOnly) {
      this.FemaleChecked.disable();
      this.MaleChecked.disable();
    }
    // if (this.item?.corporateKyc?.signatories[0].signatoryPhoto) {
    //   this.superImg = this.item?.corporateKyc?.signatories[0].signatoryPhoto;
    //   this.fileLists.push({
    //     name: 'Corportate Profile Picture',
    //     url: this.superImg
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
    if (this.item?.corporateKyc?.contactIdProofFrontPhoto) {
      this.contactIdProofFrontPhoto = this.item?.corporateKyc?.contactIdProofFrontPhoto;
      let file = {
        name: 'Contact Person Tazkira/ Passport Photo Front',
        url: this.contactIdProofFrontPhoto,
        upload: 'contactPersonTazkiraPhotoFront',
        mapping: 'contactIdProofFrontPhoto',
        // url: this.imageUrl + '/kyc/static/' + this.contactIdProofFrontPhoto
      }
      this.fileLists.push(file)
      if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'contactIdProofFrontPhoto') {
        this.filesEdited.push(file);
      }

    }
    if (this.item?.corporateKyc?.contactIdProofBackPhoto) {
      this.contactIdProofBackPhoto = this.item?.corporateKyc?.contactIdProofBackPhoto
      let file = {
        name: 'Contact Person Tazkira/Passport Photo Back',
        url: this.contactIdProofBackPhoto,
        upload: 'contactPersonTazkiraPhotoBack',
        mapping: 'contactIdProofBackPhoto',
        // url: this.imageUrl + '/kyc/static/' + this.contactIdProofFrontPhoto
      }
      this.fileLists.push(file)
      if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'contactIdProofBackPhoto') {
        this.filesEdited.push(file);
      }
    }
    if (this.item?.corporateKyc?.contactSignaturePhoto) {
      this.contactSignaturePhoto = this.item?.corporateKyc?.contactSignaturePhoto
      let file = {
        name: 'Contact Person Signature Photo',
        url: this.contactSignaturePhoto,
        upload: 'contactPersonSign',
        mapping: 'contactSignaturePhoto',
        // url: this.imageUrl + '/kyc/static/' + this.contactSignaturePhoto
      }
      this.fileLists.push(file)
      if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'contactSignaturePhoto') {
        this.filesEdited.push(file);
      }
    }
    if (this.item?.corporateKyc?.bizLicensePhoto) {
      this.bizLicensePhoto = this.item?.corporateKyc?.bizLicensePhoto
      let file = {
        name: 'Business License Photo',
        url: this.bizLicensePhoto,
        upload: 'businessLicencePhoto',
        mapping: 'bizLicensePhoto',
        // url: this.imageUrl + '/kyc/static/' + this.bizLicensePhoto
      }
      this.fileLists.push(file)
      if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'bizLicensePhoto') {
        file.url = this.item?.newValues?.filePath; // Update URL to new file URL
        this.filesEdited.push(file);
      }
    }
    if (this.item?.corporateKyc?.addressProofPhoto) {
      this.addressProofPhoto = this.item?.corporateKyc?.addressProofPhoto
      let file = {
        name: 'Address Proof Photo',
        url: this.addressProofPhoto,
        upload: 'addressProof',
        mapping: 'addressProofPhoto',
        // url: this.imageUrl + '/kyc/static/' + this.addressProofPhoto
      }
      this.fileLists.push(file)
      if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'addressProofPhoto') {
        this.filesEdited.push(file);
      }
    }
    if (this.item?.corporateKyc?.authorizationLetterPhoto) {
      this.authorizationLetterPhoto = this.item?.corporateKyc?.authorizationLetterPhoto
      let file = {
        name: 'Authorization /Power of Attony Photo ',
        url: this.authorizationLetterPhoto,
        upload: 'authorizedLetter',
        mapping: 'authorizationLetterPhoto',
        // url: this.imageUrl + '/kyc/static/' + this.authorizationLetterPhoto
      }
      this.fileLists.push(file)
      if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'authorizationLetterPhoto') {
        this.filesEdited.push(file);
      }
    }
     if (this.item?.corporateKyc?.otherDocs) {
      this.otherdocsorNot = this.item.corporateKyc.otherDocs
      const otherDocsArray = this.item.corporateKyc.otherDocs.split(',');
      let i = 1;
      for (let files of otherDocsArray) {
       let file ={
          name: 'Other Document - ' + i,
          url: files,
          upload: 'otherDocs',
          mapping: 'otherDocs'

          // url: `${this.imageUrl}/kyc/static/${file}`,
        };
        this.fileLists.push(file);
        if(this.item?.newValues?.mapping =='otherDocs'){
           file.url = this.item?.newValues?.filePath; // Update URL to new file URL{
          this.filesEdited.push(file);
          console.log("file in other doc", file, this.filesEdited);
        }
        i++;
      }
    

    }
    //ngo/govt
    if (this.item?.corporateKyc?.articleOfAssociationPhoto) {
      this.articleOfAssociationPhoto = this.item?.corporateKyc?.articleOfAssociationPhoto
      let file = {
        name: 'Corportate Article Of AssociationPhoto',
        url: this.articleOfAssociationPhoto,
        upload: 'articleOfAssociationPhoto',
        // url: this.imageUrl + '/kyc/static/' + this.articleOfAssociationPhoto
      }
      this.fileLists.push(file)
      if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'articleOfAssociationPhoto') {
        this.filesEdited.push(file);
      }

    }
    if (this.item?.corporateKyc?.taxClearanceLetterPhoto) {
      this.taxClearanceLetterPhoto = this.item?.corporateKyc?.taxClearanceLetterPhoto
      this.fileLists.push({
        name: 'Corportate Tax Clearance LetterPhoto',
        url: this.taxClearanceLetterPhoto,
        upload: 'taxClearanceLetterPhoto',
        // url: this.imageUrl + '/kyc/static/' + this.taxClearanceLetterPhoto
      })
    }
    //ngo/govt
    if (this.item?.corporateKyc?.companyTINLetterPhoto) {
      this.companyTINLetterPhoto = this.item?.corporateKyc?.companyTINLetterPhoto
      this.fileLists.push({
        name: 'Corportate Company TINLetter Photo',
        url: this.companyTINLetterPhoto,
        upload: 'companyTINLetterPhoto',
        // url: this.imageUrl + '/kyc/static/' + this.companyTINLetterPhoto
      })
    }
    // For Shareholders
    this.item?.corporateKyc?.shareholders?.forEach((shareholder: any, index: any) => {
      const i = index + 1;

      if (shareholder.idProofFrontPhoto) {
        let file = {
          name: `Shareholder ${i} ID Proof Front Photo`,
          url: shareholder.idProofFrontPhoto,
          upload: `shareholderIdFront${i}`,
          mapping: 'idProofFrontPhoto',
        };
        this.fileLists.push(file);
        if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'idProofFrontPhoto') {
          this.filesEdited.push(file);
        }
      }

      if (shareholder.idProofBackPhoto) {
        let file = {
          name: `Shareholder ${i} ID Proof Back Photo`,
          url: shareholder.idProofBackPhoto,
          upload: `shareholderIdBack${i}`,
          mapping: 'idProofBackPhoto',
        };
        this.fileLists.push(file);
        if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'idProofBackPhoto') {
          this.filesEdited.push(file);
        }
      }
    }
    );


    // For Signatories
    this.item?.corporateKyc?.signatories?.forEach((signatory: any, index: any) => {
      const i = index + 1;
      if (signatory.signatoryPhoto) {
        let file = {
          name: `Authorized Signatory ${i} Photo`,
          url: signatory.signatoryPhoto,
          upload: `signatoryPhoto${i}`,
          mapping: 'signatoryPhoto',
        };
        this.fileLists.push(file);
        if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'signatoryPhoto') {
          this.filesEdited.push(file);
        }

      }
      if (signatory.idProofFrontPhoto) {
        let file = {
          name: `Authorized Signatory ${i} ID Proof Front Photo`,
          url: signatory.idProofFrontPhoto,
          upload: `signatoryIdFront${i}`,
          mapping: 'idProofFrontPhoto',
        };
        this.fileLists.push(file);
        if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'idProofFrontPhoto') {
          this.filesEdited.push(file);
        }

      }
      if (signatory.idProofBackPhoto) {
        let file = {
          name: `Authorized Signatory ${i} ID Proof Back Photo`,
          url: signatory.idProofBackPhoto,
          upload: `signatoryIdBack${i}`,
          mapping: 'idProofBackPhoto',
        };
        this.fileLists.push(file);
        if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'idProofBackPhoto') {
          file.url = this.item?.newValues?.filePath; // Update URL to new file URL
          this.filesEdited.push(file);
        }
      }
      if (signatory.signaturePhoto) {
        let file = {
          name: `Authorized Signatory ${i} Signature Photo`,
          url: signatory.signaturePhoto,
          upload: `signatorySignature${i}`,
          mapping: 'signaturePhoto',
        };
        this.fileLists.push(file);
        if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'signaturePhoto') {
          this.filesEdited.push(file);
        }
      }
    });


    console.log("Files", this.fileLists);

    // this.dobValue = this.item?.corporateKyc?.signatoryDOB

    //abmmc verify
    //this.firstNameValue = this.item?.submittedFor?.firstName
    this.kycProcessed = this.item?.submittedFor?.firstName + ' ' + this.item?.submittedFor?.lastName;
    this.kycProcessedDate = this.item?.corporateKyc?.kycProcessedDate;
    this.VerifiedOp = this.item?.corporateKyc?.custInfoFirstName;
    this.VerifiedOpDate = this.item?.corporateKyc?.custInfoFatherName;
    this.compliance = this.item?.corporateKyc?.custInfoFirstName;
    this.complianceDate = this.item?.corporateKyc?.custInfoFirstName;


    // }
    // }
    //end
    // for (let item of this.users) {
    // if (this.kycId == item?.id) {
    //this.walletaccounts = this.item?.submittedFor?.walletAccount
    //console.log(" this.walletaccounts", this.walletaccounts);

    // }
    // }
    //end

    // this.getAllKyc();
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

    const shareholders = this.item?.corporateKyc?.shareholders || [];
    const signatories = this.item?.corporateKyc?.signatories || [];

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
    // if (presidentName) {
    //   this.presidentVicepresidentName = presidentName;
    //   this.presidentVicepresidentSignImg = presidentSignature;
    //   this.getPresidentSignature(this.presidentVicepresidentSignImg)
    // } else if (vicePresidentName) {
    //   this.presidentVicepresidentName = vicePresidentName;
    //   this.presidentVicepresidentSignImg = vicePresidentSignature;
    //   this.getPresidentSignature(this.presidentVicepresidentSignImg)
    // }

    // if (presidentSignature) {
    //   this.presidentVicepresidentName = presidentName;
    //   this.presidentVicepresidentSignImg = presidentSignature;
    //   this.getPresidentSignature(this.presidentVicepresidentSignImg)
    // } else if (vicePresidentSignature) {
    //   this.presidentVicepresidentName = vicePresidentName;
    //   this.presidentVicepresidentSignImg = vicePresidentSignature;
    //   this.getPresidentSignature(this.presidentVicepresidentSignImg)
    // }
  }
  initForm() {
    this.remarkForm.addControl('remark', this.remark)
    this.compForm.addControl('ComplianceInput', this.ComplianceInput)
    this.compForm.addControl('ComplianceDateInput', this.ComplianceDateInput)
    this.regForm.addControl('regInput', this.regInput)
    this.regForm.addControl('regDateInput', this.regDateInput)
  }
  getCountries() {
    this.corporate.getCountries().subscribe({
      next: (data: any) => {
        this.nationalities = data?.data;
      }
    });
  }
  getNatureOfBusiness() {
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
  getAccPurpose() {
    this.corporate.getAccPurpose().subscribe({
      next: (data: any) => {
        this.purposeOfAccount = data?.data;
      }
    });
  }
  onChangeCountryCur($event: any) {
    this.countryNameCur = $event.target.value
    this.getProvinces();
    console.log("this.countryNameCur", this.countryNameCur)
    this.onSelectProvinceCurr(this.countryNameCur, $event);
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
  onChangeCountryPer($event: any) {
    this.countryNamePer = $event.target.value
    this.getProvinces();
    console.log("this.countryNamePer", this.countryNamePer)
    this.onSelectProvincePer(this.countryNamePer, $event);
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

  onSelectProvinceCurr(countryNameCur: any, $event: any) {
    this.provinceIdCur = countryNameCur;
    console.log("this.provinceIdCur", this.provinceIdCur);
    this.provinceCurTarget = $event.target.value
    console.log("this.provinceCurTarget", this.provinceCurTarget);
    // for (let item of this.provinces) {
    //   if (this.provinceCurTarget == item?.name) {
    //     this.selectedProvinceCur = item?.id;
    //   }
    // }
    // this.getDistricts(this.selectedProvinceCur);
    if (Array.isArray(this.provinces)) {
      for (let item of this.provinces) {
        if (this.provinceCurTarget == item?.name) {
          this.selectedProvinceCur = item?.id;
        }
      }
      this.getDistrictsCur(this.selectedProvinceCur);
    } else {
      console.error("Provinces is not an array:", this.provinces);
    }
  }


  onSelectProvincePer(countryNamePer: any, $event: any) {
    this.provinceIdPer = countryNamePer;
    this.provincePerTarget = $event.target.value
    console.log("this.provincePerTarget", this.provincePerTarget);
    // for (let item of this.provinces) {
    //   if (this.provincePerTarget == item?.name) {
    //     this.selectedProvincePer = item?.id;
    //   }
    // }
    // console.log("this.selectedProvincePer", this.selectedProvincePer);
    // this.getDistricts(this.selectedProvincePer);
    if (Array.isArray(this.provinces)) {
      for (let item of this.provinces) {
        if (this.provincePerTarget == item?.name) {
          this.selectedProvincePer = item?.id;
        }
      }
      console.log("this.selectedProvincePer", this.selectedProvincePer);
      this.getDistrictsPer(this.selectedProvincePer);
    } else {
      console.error("Provinces is not an array:", this.provinces);
    }
  }


  getDistrictsCur(provinceId: number) {
    this.corporate.getdistricts(provinceId).subscribe({
      next: (data: any) => {
        this.districtsCur = data?.data;
      }
    });
  }
  getDistrictsPer(provinceId: number) {
    this.corporate.getdistricts(provinceId).subscribe({
      next: (data: any) => {
        this.districtsPer = data?.data;
      }
    });
  }
  getNatureofBusiness() {
    this.corporate.getAllFirmType().subscribe({
      next: (data: any) => {
        this.natureofBusinesses = data?.data;
      }
    });

  }
  getDistricts(provinceId = 1) {
    this.corporate.getdistricts(provinceId).subscribe({
      next: (data: any) => {
        this.districts = data?.data;
      }
    });
  }
  //new update
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
    console.log(fileUrl)

    // window.open(fileUrl, '_blank');  // Opens the file in a new tab
    this.KycService.getImageAndOpen(fileUrl)

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

    // Extract only the part of the path after "/kyc/static/"
    const photoId = fileUrl.split('/kyc/static/').pop(); // Gets "160/1731656339720.jpg"

    if (photoId) {
      // Call the API to delete the specific file using only the extracted part
      let req = {
        "otherDocs": [
          photoId,
        ]
      }
      this.corporate.deleteCorporateMultipleDoc(req, this.submittedForId).subscribe((data: any) => {
        if (data?.responseCode == 200) {
          console.log('File deleted successfully');
          this.fileLists.splice(index, 1);
        } else {
          console.error('Error deleting file:', data);
        }
      });
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
  formatCurrency(form: FormGroup, formControlName: string): string | null {
    const formCurrency = form.get(formControlName);
    if (formCurrency) {
      const value = formCurrency.value;
      if (value) {
        (formCurrency as any)['rawValue'] = value;
        const formattedValue = this.currencyFormatPipe.transform(value);
        formCurrency.setValue(formattedValue);
      }
      return (formCurrency as any)['rawValue'] ?? formCurrency.value;
    }
    return null;
  }

  onClickEdit() {
    this.editMode = true;
    console.log("Edit mode enabled",this.superAgentForm);
  /*   this.formatCurrency(this.superAgentForm, 'monthlyIncome');
    this.formatCurrency(this.superAgentForm, 'netWorth');
    this.formatCurrency(this.superAgentForm, 'monthlyTurnover'); */
  }
  getProvince$(): Observable<any[]> {
    return this.corporate.getprovinces().pipe(
      map((res: any) => res?.data || [])
    );
  }
  getProvinces() {
    this.provinces$ = this.corporate.getprovinces().pipe(
      map((res: any) => res?.data || []),
      tap((data) => (this.provinces = data)),
      shareReplay(1)
    );
    // 👇 THIS triggers the API
    this.provinces$.subscribe();
  }
  checkIdExists(): void {
    const idNumber = this.agencyForm.get('contactPerIDNo')?.value;
    let userTypeToCheck = 'GOVT_AGENCY'; // default
    if (idNumber) {
      let req = {
        "idProof": this.agencyForm.get('contactPerIDNo')?.value,
        "kycType": userTypeToCheck
      }
      this.corporate.checkIDexists(req).subscribe(
        (data: any) => {
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
  navigateToEditRequestKYC(){
    this.router.navigate(["kyc/kyc-edit-requests"]);
  }

  onSubmitEdit(status: 'APPROVED' | 'IN_REVIEW') {
    console.log("Submitting form with status:", this.superAgentForm.invalid);
    if (this.kycType === 'CORPORATE') {
      console.log("originalCorporateKyc", this.originalCorporateKyc);
      const currentFormValue = this.superAgentForm.getRawValue();
      const updatePayload = this.normalizeCorporatePayload(
        this.getChangedPayload(this.originalCorporateKyc, currentFormValue)
      );
      console.log('UPDATE PAYLOAD:', updatePayload);

      // 🔒 Stop if nothing changed
      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        alert('No changes detected');
        return;
      }

      let req = {
        kycInputs: updatePayload,
        kycType: "CORPORATE",
        submittedFor: this.submittedForId
      }
      this.isLoading = true;
      const corporateUpdateAPI: Record<string, () => Observable<any>> = {
        'IN_REVIEW': () =>
          this.corporate.corporateKYCUpdate(req),
        'APPROVED': () =>
          this.corporate.corporateKYCUpdateByMaker(req),
      };

      const apiCall = corporateUpdateAPI[status];

      if (!apiCall) {
        console.error('Invalid status provided:', status);
        this.isLoading = false;
        return;
      }

     apiCall().pipe(

  switchMap((res: any) => {

    if (res?.responseCode !== 200) {
      throw new Error(res?.error || 'Update failed');
    }

    // ✅ If IN_REVIEW → call complete API
    if (status === 'IN_REVIEW') {
      return this.corporate.completeRegisterKYC(this.submittedForId);
    }

    // ✅ If APPROVED → just return original response
    return of(res);
  })

).subscribe({

  next: (finalRes: any) => {
    this.isLoading = false;

    if (finalRes?.responseCode === 200) {
      this.editMode = false;
      alert(finalRes?.data || "Success");
      // An APPROVED edit only raises a request for the checker to authorize.
      if (status === 'IN_REVIEW') {
        this.router.navigate(["kyc/customer"]);
      } else {
        this.navigateToEditRequestKYC();
      }

    } else {
      alert(finalRes?.error || "Failed");
    }
  },

  error: (err) => {
    this.isLoading = false;
    alert(err.message || "Something went wrong");
  }

});
    }
    else if (this.kycType === 'GOVT_AGENCY' || this.kycType === 'UN_AGENCY') {

      console.log("originalGovtUnKyc", this.originalGovtUnKyc);

      const currentFormValue = this.agencyForm.getRawValue();
      const updatePayload = this.getChangedPayload(
        this.originalGovtUnKyc,
        currentFormValue
      );

      // 🔒 Stop if nothing changed
      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        alert('No changes detected');
        return;
      }

      const req = {
        kycInputs: updatePayload,
        kycType: this.kycType,
        submittedFor: this.submittedForId
      };

      this.isLoading = true;

      const agencyUpdateAPI: Record<string, () => Observable<any>> = {
        'IN_REVIEW': () => this.corporate.corporateAgencyKYCUpdate(req),
        'APPROVED': () => this.corporate.corporateAgencyKYCUpdateByMaker(req)
      };

      agencyUpdateAPI[status]().subscribe({
        next: (res: any) => {
          if (res?.responseCode === 200) {

            if (status === 'IN_REVIEW') {
              this.corporate
                .completeRegisterAgencyKYC(this.submittedForId)
                .subscribe({
                  next: (finalRes: any) => {
                    this.isLoading = false;
                    if (finalRes?.responseCode === 200) {
                      alert(finalRes?.data);
                      this.router.navigate(["kyc/customer"]);
                    } else {
                      alert(finalRes?.error);
                    }
                  },
                  error: () => this.isLoading = false
                });

            } else {
              this.isLoading = false;
              alert(res?.data);
              this.router.navigate(["kyc/kyc-edit-requests"]);
            }

          } else {
            this.isLoading = false;
            alert(res?.error || 'Update failed');
          }
        },
        error: () => {
          this.isLoading = false;
          alert('Something went wrong');
        }
      });
    }
    else  if (this.kycType === 'NGO') {
      console.log("orginalNGO", this.originalNGOKyc);
      const currentFormValue = this.ngoForm.getRawValue();
      const updatePayload = this.getChangedPayload(this.originalNGOKyc, currentFormValue);
      console.log('UPDATE PAYLOAD:', updatePayload);
      let req = {
        kycInputs: updatePayload,
        kycType: "NGO",
        submittedFor: this.submittedForId
      }
      this.isLoading = true;
      const corporateUpdateAPI: Record<string, () => Observable<any>> = {
        'IN_REVIEW': () =>
          this.corporate.corporateNGOKYCUpdate(req),
        'APPROVED': () =>
          this.corporate.corporateNGOKYCUpdateByMaker(req),
      };

      const apiCall = corporateUpdateAPI[status];

      if (!apiCall) {
        console.error('Invalid status provided:', status);
        this.isLoading = false;
        return;
      }

        apiCall().pipe(

  switchMap((res: any) => {

    if (res?.responseCode !== 200) {
      throw new Error(res?.error || 'Update failed');
    }

    // ✅ If IN_REVIEW → call complete API
    if (status === 'IN_REVIEW') {
      return this.corporate.completeRegisterNGOKYC(this.submittedForId);
    }

    // ✅ If APPROVED → just return original response
    return of(res);
  })

).subscribe({

  next: (finalRes: any) => {
    this.isLoading = false;

    if (finalRes?.responseCode === 200) {
      alert(finalRes?.data || "Success");   
      this.navigateToEditRequestKYC();  
  

    } else {
      alert(finalRes?.error || "Failed");
    }
  },

  error: (err) => {
    this.isLoading = false;
    alert(err.message || "Something went wrong");
  }

});
    }
  }
  getChangedPayload(original: any, current: any): any {
    const result: any = {};

    Object.keys(current || {}).forEach((key) => {
      const currentValue = current[key];
      const originalValue = original?.[key];

      // Arrays (shareholders, signatories)
      if (Array.isArray(currentValue)) {
        const arrayDiff = this.getChangedArray(originalValue || [], currentValue);
        if (arrayDiff.length > 0) {
          result[key] = arrayDiff;
        }
        return;
      }

      // Nested Objects
      if (
        typeof currentValue === 'object' &&
        currentValue !== null &&
        !Array.isArray(currentValue)
      ) {
        const nestedDiff = this.getChangedPayload(originalValue || {}, currentValue);
        if (Object.keys(nestedDiff).length > 0) {
          result[key] = nestedDiff;
        }
        return;
      }

      // Primitive values
      if (!this.isEqual(originalValue, currentValue)) {
        result[key] = currentValue;
      }
    });

    return result;
  }

  getChangedArray(originalArray: any[], currentArray: any[]): any[] {
    const result: any[] = [];

    currentArray.forEach((currentItem, index) => {
      const originalItem = originalArray[index] || {};

      const diff = this.getChangedPayload(originalItem, currentItem);

      if (Object.keys(diff).length > 0) {
        result.push({
          ...(currentItem.id ? { id: currentItem.id } : {}),
          ...diff
        });
      }
    });

    return result;
  }
  isEqual(a: any, b: any): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  // Amount fields are held in the form as display strings ("AFN 1,200,000"),
  // but the KYC APIs expect plain numbers.
  toAmount(value: any): any {
    if (typeof value !== 'string') {
      return value;
    }
    const numeric = parseFloat(value.replace(/[^0-9.-]/g, ''));
    return isNaN(numeric) ? value : numeric;
  }

  // The corporate form holds a few controls under names the API does not use,
  // so map them back before the diff is sent as kycInputs.
  normalizeCorporatePayload(payload: any): any {
    const result: any = { ...(payload || {}) };

    if ('NoOfShareHolder' in result) {
      result.companyNoOfShareholders = this.toAmount(result.NoOfShareHolder);
      delete result.NoOfShareHolder;
    }

    ['monthlyIncome', 'netWorth', 'monthlyTurnover'].forEach((key) => {
      if (key in result) {
        result[key] = this.toAmount(result[key]);
      }
    });

    ['shareholders', 'signatories'].forEach((key) => {
      if (Array.isArray(result[key])) {
        result[key] = result[key].map((entry: any) =>
          entry && 'monthlyIncome' in entry
            ? { ...entry, monthlyIncome: this.toAmount(entry.monthlyIncome) }
            : entry
        );
      }
    });

    return result;
  }





  makePdf() {
    const download$ = this.viewOnly
      ? this.KycService.downloadPDFForClosedAccounts(this.kycId)
      : this.KycService.downloadPDF(this.kycId);
    download$.subscribe({
      next: (data: Blob) => {
        console.log(data.type);  // Ensure it logs 'application/pdf'
        const filename = this.seqNo + '_KYC.pdf';
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
  // saveChangedProduct() {
  //   for (let item of this.products) {
  //     if (this.productId == item?.id) {
  //       this.masterProduct = item
  //     }
  //   }
  //   console.log('Filtered product:', this.masterProduct);
  //   console.log(" this.walletaccounts", this.walletaccounts);
  //   let req = {
  //     walletAccount: this.walletaccounts,
  //     masterProduct: this.masterProduct
  //   }
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
  //   });
  // }
  //old
  
  checkSdn() {  
    this.isLoading = true;
    this.watchYes.enable();
    this.watchYes.setValue(true);
    this.watchNo.setValue(false);
    this.sdnChecked = true;
    this.watchTarget = true;

    // Existing basic validation (unchanged)
    if (
      this.dobValue == null || this.dobValue === '' ||
      this.firstNameValue == null || this.firstNameValue === ''
    ) {
      alert("Please provide Signatory Name and Date of Birth to perform SDN Check.");
      this.isLoading = false;
      return;
    }
    if (this.item?.status == 'PENDING') {
      this.submittedForId = this.item?.submittedFor?.id;
      if (this?.item?.newValues?.signatories && this?.item?.newValues?.signatories.length > 0 && this.item?.newValues?.signatories[0]?.dob) {
        this.item.corporateKyc.signatories[0].dob = this.item?.newValues?.signatories[0]?.dob;
      }
      if (this.item?.newValues?.companyName) {
        this.item.corporateKyc.companyName = this.item?.newValues?.companyName;
      }
    }

    // ---- req OBJECT (UNCHANGED) ----
    let sdnName,sdnDob;
    switch(this.item?.kycType) {
      case 'CORPORATE':
        sdnName = this.item?.corporateKyc?.companyName;
        sdnDob = this.item?.corporateKyc?.signatories[0]?.dob;
        break;
      case 'GOVT_AGENCY':
        sdnName = this.item?.govtAgencyKyc?.name;
        sdnDob = this.item?.govtAgencyKyc?.pocDob;
        break;
      case 'UN_AGENCY':
        sdnName = this.item?.govtAgencyKyc?.name;
        sdnDob = this.item?.govtAgencyKyc?.pocDob;
        break;
      case 'NGO':
        sdnName = this.item?.ngoKyc?.name;
        sdnDob = this.item?.ngoKyc?.repDob;
        break;
    }

    const req = {
      name: sdnName,
      minMatchPercent: 60,
      dob: sdnDob,
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

    // ---- API CALL (UNCHANGED) ----
    this.KycService.searchSdn(req)
      .pipe(
        finalize(() => {
          this.isLoading = false;
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
          //alert(data?.error);
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
  //   this.isLoading = true;
  //   this.KycService.checkRisk(this.kycId).subscribe((data: any) => {
  //     if (data && data?.data) {
  //       this.showRiskModal = true;
  //       this.riskDetails = data?.data
  //       this.riskTierValue = this.riskDetails.riskTier
  //       console.log("riskTierValue", this.riskTierValue);
  //       this.DataRisk = true;
  //       this.noDataRisk = false;
  //       this.isLoading = false;
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
  //     }
  //     else {
  //       this.isLoading = false;
  //       this.DataRisk = false;
  //       this.noDataRisk = true;
  //       alert(data?.error);
  //     }

  //     this.showRiskModal = true;

  //   });
  // }
  checkRisk() {
    this.riskChecked = true;
    this.isLoading = true;
    if (this.item?.status == 'PENDING') {
      this.kycId = this.item?.kycMasterId;
    }

    this.KycService.checkRisk(this.kycId)
      .pipe(
        finalize(() => {
          this.isLoading = false; // ✅ only centralized here
        })
      )
      .subscribe((data: any) => {
        if (data && data?.data) {
          this.showRiskModal = true;
          this.riskDetails = data?.data;
          this.riskTierValue = this.riskDetails.riskTier;
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
        }
        else {
          this.DataRisk = false;
          this.noDataRisk = true;
          alert(data?.error);
        }

        this.showRiskModal = true;
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
  AuthorizeEditedForm() {
    let req = {
      id: this.item?.id,
      approvalRemark: this.remarkForm.get('remark')?.value
    }
    this.isLoading = true;
    this.KycService.AuthorizeEditedForm(req)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((data: any) => {
        if (data?.responseCode == 200) {
          alert(data?.data)
          this.navigateToEditRequestKYC();
        }
        else {
          alert(data?.error)
        }
      })
  }
  RejectEditedForm() {
    let req = {
      id: this.item?.id,
      // The reject button is gated on this input, not on the approval remark.
      rejectReason: this.reason.value
    }
    this.isLoading = true;
    this.KycService.RejectEditedForm(req)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((data: any) => {
        if (data?.responseCode == 200) {
          alert(data?.data)
          this.navigateToEditRequestKYC();
        }
        else {
          alert(data?.error)
        }
      })
  }

  closeRiskAndSdnModal() {
    this.showSdnAndRiskView = false;
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
    // if (this.kycId == this.item?.id) {
    this.superId = this.item?.submittedFor?.id;
    console.log(" this.superId", this.superId);
    // }
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
    // if (this.kycId == this.item?.id) {
    this.superId = this.item?.submittedFor?.id;
    console.log(" this.superId", this.superId);
    // }
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
    // if (this.kycId == this.item?.id) {
    this.superId = this.item?.submittedFor?.id;
    console.log(" this.superId", this.superId);
    // }
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
    // if (this.kycId == this.item?.id) {
    this.superId = this.item?.submittedFor?.id;
    console.log(" this.superId", this.superId);
    // }
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
    // if (this.kycId == this.item?.id) {
    this.superId = this.item?.submittedFor?.id;
    console.log(" this.superId", this.superId);
    // }
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
    // if (this.kycId == this.item?.id) {
    this.superId = this.item?.submittedFor?.id;
    console.log(" this.superId", this.superId);
    // }
    // }
    this.KycService.addSuperPresSign(this.uploadedImageCompliance, "complianceSignaturePhoto", this.superId).subscribe((data: any) => {
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
  initCorporateForm() {
    this.superAgentForm = this.fb.group({

      companyName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      contactPersonName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      contactPersonDesignation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      companyWalletNumber: ['', Validators.required],
      companyAccOpenDate: ['', Validators.required],
      purposeOfAcc: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric

      bizLicenseNumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      bizLicenseAuthority: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      bizLicenseDateOfIssue: ['', [Validators.required, this.sharedFunctionsServic.pastDateValidator()]], // Date
      bizLicenseDateOfExpiry: ['', [Validators.required, this.sharedFunctionsServic.futureDateValidator()]], // Date
      bizLicenseTinNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Numeric
      NoOfShareHolder: ['', Validators.required],

      bizName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      natureOfBiz: ['', Validators.required],
      monthlyIncome: ['', Validators.required], // Strictly Numerical
      netWorth: ['', Validators.required], // Strictly Numerical
      sourceOfFund: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric 
      monthlyTurnover: ['', Validators.required], // Strictly Numerical

      companyLocation: ['', Validators.required],
      companyStreet: ['', Validators.required],
      companyHouseNumber: ['', Validators.required],
      companyDistrict: ['', Validators.required],
      companyProvince: ['', Validators.required],
      companyCountry: ['', Validators.required],
      companyOfficePhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      companyEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],

      shareholders: this.fb.array([]),
      signatories: this.fb.array([]),






      //positionPresident: ['', Validators.required],
      //emailPresident: ['', Validators.required],
      //countryPresident: ['', Validators.required],
     /*  DateofExpiryPresident: ['', Validators.required],
      issueDatePresident: ['', Validators.required],
      nationalityPresident: ['', Validators.required],
      incomeSourcePresident: ['', Validators.required],
      mobilePresident: ['', Validators.required],
      monthlyIncomePresident: ['', Validators.required],
      PresidentTin: ['', Validators.required],
 */


     /*  houseNoAddress: ['', Validators.required],
      locationAddress: ['', Validators.required],
      provinceAddress: ['', Validators.required],
      streetAddress: ['', Validators.required],
      districtAddress: ['', Validators.required],
      countryAddress: ['', Validators.required],
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
      V_presidentDate: ['', Validators.required], */





      /* shareholderPerc: ['', Validators.required],
      otherSrc: ['', Validators.required],
      shareholderRelation: ['', Validators.required],
      shareholderPh: ['', Validators.required],
      shareholderTin: ['', Validators.required],
 */
     /*  shareCurrLoc: ['', Validators.required],
      shareCurrDis: ['', Validators.required],
      shareCurrPro: ['', Validators.required],
      shareCurrCount: ['', Validators.required],

      sharePerLoc: ['', Validators.required],
      sharePerDis: ['', Validators.required],
      sharePerPro: ['', Validators.required],
      sharePerCount: ['', Validators.required],

      firstNameAuth: ['', Validators.required],
      lastNameAuth: ['', Validators.required],
      tazkiraAuth: ['', Validators.required],
      dobAuth: ['', Validators.required],
      birthPlaceAuth: ['', Validators.required],
      NationalityAuth: ['', Validators.required],
      designationAuth: ['', Validators.required],
      resiAuth: ['', Validators.required],
      phAuth: ['', Validators.required],
      srcAuth: ['', Validators.required],
      incomeAuth: ['', Validators.required],
      typeAuth: ['', Validators.required], */
      //NEW
    });
    this.dobValue = this.item?.corporateKyc?.signatories[0]?.dob
    this.firstNameValue = this.item?.corporateKyc?.signatories[0]?.firstName;
    this.superAgentForm.patchValue({ companyName: this.item?.corporateKyc?.companyName || 'NIL' })
    this.superAgentForm.patchValue({ companyWalletNumber: this.item?.corporateKyc?.companyWalletNumber || 'NIL' })
    this.superAgentForm.patchValue({ companyAccOpenDate: this.item?.corporateKyc?.companyAccOpenDate || 'NIL' })
    this.superAgentForm.patchValue({ purposeOfAcc: this.item?.corporateKyc?.purposeOfAcc || 'NIL' })
    this.superAgentForm.patchValue({ contactPersonName: this.item?.corporateKyc?.contactPersonName || 'NIL' })
    this.superAgentForm.patchValue({ contactPersonDesignation: this.item?.corporateKyc?.contactPersonDesignation || 'NIL' })


    this.superAgentForm.patchValue({ NoOfShareHolder: this.item?.corporateKyc?.companyNoOfShareholders || 'NIL' })
    this.superAgentForm.patchValue({ bizLicenseNumber: this.item?.corporateKyc?.bizLicenseNumber || 'NIL' })
    this.superAgentForm.patchValue({ bizLicenseAuthority: this.item?.corporateKyc?.bizLicenseAuthority || 'NIL' })
    this.superAgentForm.patchValue({ bizLicenseDateOfIssue: this.item?.corporateKyc?.bizLicenseDateOfIssue || 'NIL' })
    this.superAgentForm.patchValue({ bizLicenseDateOfExpiry: this.item?.corporateKyc?.bizLicenseDateOfExpiry || 'NIL' })
    this.superAgentForm.patchValue({ bizLicenseTinNumber: this.item?.corporateKyc?.bizLicenseTinNumber || 'NIL' })

    this.superAgentForm.patchValue({ bizName: this.item?.corporateKyc?.bizName || 'NIL' })
    this.superAgentForm.patchValue({ natureOfBiz: this.item?.corporateKyc?.natureOfBiz || 'NIL' })
    this.superAgentForm.patchValue({
      monthlyIncome: this.item?.corporateKyc?.monthlyIncome
        ? `AFN ${this.formatNumber(this.item.corporateKyc.monthlyIncome)}`
        : 'NIL'
    });
    this.superAgentForm.patchValue({
      netWorth: this.item?.corporateKyc?.netWorth
        ? `AFN ${this.formatNumber(this.item.corporateKyc.netWorth)}`
        : 'NIL'
    });
    this.superAgentForm.patchValue({ sourceOfFund: this.item?.corporateKyc?.sourceOfFund || 'NIL' })
    this.superAgentForm.patchValue({
      monthlyTurnover: this.item?.corporateKyc?.monthlyTurnover
        ? `AFN ${this.formatNumber(this.item.corporateKyc.monthlyTurnover)}`
        : 'NIL'
    });

    this.superAgentForm.patchValue({ companyLocation: this.item?.corporateKyc?.companyLocation || 'NIL' })
    this.superAgentForm.patchValue({ companyStreet: this.item?.corporateKyc?.companyStreet || 'NIL' })
    this.superAgentForm.patchValue({ companyHouseNumber: this.item?.corporateKyc?.companyHouseNumber || 'NIL' })
    this.superAgentForm.patchValue({ companyDistrict: this.item?.corporateKyc?.companyDistrict || 'NIL' })
    this.superAgentForm.patchValue({ companyProvince: this.item?.corporateKyc?.companyProvince || 'NIL' })
    this.superAgentForm.patchValue({ companyCountry: this.item?.corporateKyc?.companyCountry || 'NIL' })
    this.superAgentForm.patchValue({ companyOfficePhone: this.item?.corporateKyc?.companyOfficePhone || 'NIL' })
    this.superAgentForm.patchValue({ companyEmail: this.item?.corporateKyc?.companyEmail || 'NIL' })
    const provinceName = this.item?.corporateKyc?.companyProvince;

    if (!provinceName) return;

    combineLatest([
      this.getProvince$(), // provinces API
      of(provinceName)     // province name from KYC
    ]).pipe(
      take(1), // 👈 important: run only once
      map(([provinces, name]) => {
        this.provinces = provinces;

        return provinces.find(
          (p: any) => p.name === name
        )?.id;
      }),
      filter(Boolean), // 👈 ensure provinceId exists
      switchMap((provinceId) =>
        this.corporate.getdistricts(provinceId)
      )
    ).subscribe({
      next: (res: any) => {
        this.districts = res?.data || [];

        this.superAgentForm.patchValue({
          district: this.item?.corporateKyc?.companyDistrict
        });
      },
      error: (error) => {
        console.error('Error fetching districts:', error);
      }
    });

    this.shareHolderDetailsForm = this.fb.group({
      shareholders: this.fb.array([])
    });

    this.item?.corporateKyc?.shareholders?.forEach((sh: any) => {
      this.shareholdersArray.push(this.createShareholderGroup(sh));
    });


    this.signatoryDetailsForm = this.fb.group({
      signatories: this.fb.array([])
    });

    this.item?.corporateKyc?.signatories?.forEach((sg: any) => {
      this.signatoriesArray.push(this.createSignatoryGroup(sg));
    });
    console.log("SUPER AGENT FORM VALUE", this.superAgentForm.value);
    this.superAgentForm.updateValueAndValidity();
    this.superAgentForm.markAllAsTouched();


   
    this.formInitialised = true;



  }
  createShareholderGroup(data?: any): FormGroup {
    return this.fb.group({
      firstName: [
        data?.firstName ?? '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]
      ],

      lastName: [
        data?.lastName ?? '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]
      ],



      fatherName: [
        data?.fatherName ?? '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]
      ],

      idProofNumber: [
        data?.idProofNumber ?? '',
        [Validators.required]
      ],

      dob: [
        data?.dob ?? '',
        [Validators.required, this.sharedFunctionsServic.ageValidator()]
      ],

      placeOfBirth: [
        data?.placeOfBirth ?? '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]
      ],

      nationality: [
        data?.nationality ?? '',
        [Validators.required]
      ],

      monthlyIncome: [
        data?.monthlyIncome ? `AFN ${this.formatNumber(data?.monthlyIncome)}`
          : 'NIL',
        [Validators.required]
      ],

      shareholdingPercentage: [
        data?.shareholdingPercentage ?? '',
        [Validators.required]
      ],

      sourceOfIncome: [
        data?.sourceOfIncome ?? '',
        [Validators.pattern('^[a-zA-Z0-9 ]+$')]
      ],

      relationship: [
        data?.relationship ?? '',
        [Validators.required]
      ],

      phone: [
        data?.phone ?? '',
        [Validators.required, Validators.pattern(/^(7\d{8})$/)]
      ],

      tinNumber: [
        data?.tinNumber ?? '',
        [this.optionalShareholderTinValidator()]
      ],

      isSignatory: [
        data?.isSignatory ?? false
      ],

      currLocation: [
        data?.currLocation ?? '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]
      ],

      currDistrict: [
        data?.currDistrict ?? '',
        [Validators.required]
      ],

      currProvince: [
        data?.currProvince ?? '',
        [Validators.required]
      ],

      currCountry: [
        data?.currCountry ?? '',
        [Validators.required]
      ],

      // Permanent Address
      permLocation: [
        data?.permLocation ?? '',
        /* [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')] */
      ],

      permDistrict: [
        data?.permDistrict ?? '',
        [Validators.required]
      ],

      permProvince: [
        data?.permProvince ?? '',
        [Validators.required]
      ],

      permCountry: [
        data?.permCountry ?? '',
        [Validators.required]
      ]
    });
  }
  get shareholdersArray(): FormArray {
    return this.superAgentForm.get('shareholders') as FormArray;
  }

  createSignatoryGroup(data?: any): FormGroup {
    return this.fb.group({

      firstName: [
        data?.firstName ?? '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]
      ],

      lastName: [
        data?.lastName ?? '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]
      ],

      email: [
        data?.email ?? '',
        [Validators.email]
      ],

      idProofNumber: [
        data?.idProofNumber ?? '',
        [Validators.required]
      ],

      dob: [
        data?.dob ?? '',
        [Validators.required, this.sharedFunctionsServic.ageValidator()]
      ],

      placeOfBirth: [
        data?.placeOfBirth ?? '',
        [Validators.required]
      ],

      nationality: [
        data?.nationality ?? '',
        [Validators.required]
      ],

      designation: [
        data?.designation ?? '',
        [Validators.required]
      ],

      residentAddress: [
        data?.residentAddress ?? '',
        [Validators.required]
      ],

      phone: [
        data?.phone ?? '',
        [Validators.required, Validators.pattern(/^(7\d{8,9})$/)]
      ],

      sourceOfIncome: [
        data?.sourceOfIncome ?? ''
      ],

      monthlyIncome: [
        data?.monthlyIncome
          ? `AFN ${this.formatNumber(data?.monthlyIncome)}`
          : 'NIL', [Validators.required]
      ],

      signatoryType: [
        data?.signatoryType ?? '',
        [Validators.required]
      ],

      /*   signatoryPhoto: [
          data?.signatoryPhoto ?? ''
        ],
    
        idProofFrontPhoto: [
          data?.idProofFrontPhoto ?? ''
        ],
    
        idProofBackPhoto: [
          data?.idProofBackPhoto ?? ''
        ],
    
        signaturePhoto: [
          data?.signaturePhoto ?? ''
        ],*/

      makerChecker: [
        data?.makerChecker ?? ''
      ]
    });
  }




  get signatoriesArray(): FormArray {
    return this.superAgentForm.get('signatories') as FormArray;
  }







  optionalShareholderTinValidator(): (control: AbstractControl) => ValidationErrors | boolean {
    return (control: AbstractControl): ValidationErrors | boolean => {
      if (!control.value) {
        return true; // Don't validate empty values
      }



      return /^[0-9]+$/.test(control.value) ? true : { numeric: true };
    };


  }
  initAgencyForm() {
    this.agencyForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      walletNumber: ['', Validators.required],
      accOpenDate: ['', Validators.required],
      location: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9  -,+.]+$')]],
      street: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      houseNo: ['', Validators.required],
      district: ['', Validators.required],
      province: ['', Validators.required],
      country: ['', Validators.required],
      officePhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      officeEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],

      contractNumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      contractType: ['', [Validators.required]],
      contractStartDate: ['', [Validators.required, this.sharedFunctionsServic.pastDateValidator()]],
      contractEndDate: ['', [Validators.required, this.sharedFunctionsServic.futureDateValidator()]],
      contractSummary: ['', [Validators.required]],

      pocFirstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      pocLastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      pocDob: ['', [Validators.required, this.sharedFunctionsServic.ageValidator()]],
      //not needed
      contactPerLocation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      // contactPerDesignation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      //
      pocIdProofType: ['', [Validators.required]],
      pocIdProofNumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      pocPlaceOfBirth: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      pocDesignation: ['', [Validators.required]],
      pocNationality: ['', [Validators.required]],
      pocResidentAddress: ['', [Validators.required]],
      pocPhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],

    });
    this.firstNameValue = this.item?.govtAgencyKyc?.pocFirstName;
    this.dobValue = this.item?.govtAgencyKyc?.pocDob;
    console.log("this.item?.govtAgencyKyc?.street", this.item?.govtAgencyKyc?.street)
    console.log("this.item?.govtAgencyKyc?.houseNo", this.item?.govtAgencyKyc?.houseNo)
    console.log("this.item?.govtAgencyKyc?.officeEmail", this.item?.govtAgencyKyc?.officeEmail)
    console.log("this.item?.govtAgencyKyc?.officePhone", this.item?.govtAgencyKyc?.officePhone)

    this.agencyForm.patchValue({ name: this.item?.govtAgencyKyc?.name || 'NIL' })
    this.agencyForm.patchValue({ walletNumber: this.item?.govtAgencyKyc?.walletNumber || 'NIL' })
    this.agencyForm.patchValue({ accOpenDate: this.item?.govtAgencyKyc?.accOpenDate || 'NIL' })
    this.agencyForm.patchValue({ location: this.item?.govtAgencyKyc?.location || 'NIL' })
    this.agencyForm.patchValue({ street: this.item?.govtAgencyKyc?.street || 'NIL' })
    // this.agencyForm.patchValue({ houseNo: this.item?.govtAgencyKyc?.houseNoz || 'NIL' })
    this.agencyForm.patchValue({ houseNo: this.item?.govtAgencyKyc?.houseNo || 'NIL' })
    this.agencyForm.patchValue({ district: this.item?.govtAgencyKyc?.district || 'NIL' })
    this.agencyForm.patchValue({ province: this.item?.govtAgencyKyc?.province || 'NIL' })
    this.agencyForm.patchValue({ country: this.item?.govtAgencyKyc?.country || 'NIL' })
    this.agencyForm.patchValue({ officePhone: this.item?.govtAgencyKyc?.officePhone || 'NIL' })
    this.agencyForm.patchValue({ officeEmail: this.item?.govtAgencyKyc?.officeEmail || 'NIL' })

    this.agencyForm.patchValue({ contractNumber: this.item?.govtAgencyKyc?.contractNumber || 'NIL' })
    this.agencyForm.patchValue({ contractType: this.item?.govtAgencyKyc?.contractType || 'NIL' })
    this.agencyForm.patchValue({ contractStartDate: this.item?.govtAgencyKyc?.contractStartDate || 'NIL' })
    this.agencyForm.patchValue({ contractEndDate: this.item?.govtAgencyKyc?.contractEndDate || 'NIL' })
    this.agencyForm.patchValue({ contractSummary: this.item?.govtAgencyKyc?.contractSummary || 'NIL' })

    this.agencyForm.patchValue({ pocFirstName: this.item?.govtAgencyKyc?.pocFirstName || 'NIL' })
    this.agencyForm.patchValue({ pocLastName: this.item?.govtAgencyKyc?.pocLastName || 'NIL' })
    this.agencyForm.patchValue({ pocResidentAddress: this.item?.govtAgencyKyc?.pocResidentAddress || 'NIL' })
    this.agencyForm.patchValue({ pocDob: this.item?.govtAgencyKyc?.pocDob || 'NIL' })
    this.agencyForm.patchValue({ pocIdProofType: this.item?.govtAgencyKyc?.pocIdProofType || 'NIL' })
    this.agencyForm.patchValue({ pocIdProofNumber: this.item?.govtAgencyKyc?.pocIdProofNumber || 'NIL' })
    // this.agencyForm.patchValue({ pocLocation: this.item?.govtAgencyKyc?.pocLocation || 'NIL' })
    this.agencyForm.patchValue({ pocPlaceOfBirth: this.item?.govtAgencyKyc?.pocPlaceOfBirth || 'NIL' })
    this.agencyForm.patchValue({ pocDesignation: this.item?.govtAgencyKyc?.pocDesignation || 'NIL' })
    this.agencyForm.patchValue({ pocPhone: this.item?.govtAgencyKyc?.pocPhone || 'NIL' })
    this.agencyForm.patchValue({ pocNationality: this.item?.govtAgencyKyc?.pocNationality || 'NIL' })
    console.log("agency Form Values", this.agencyForm.value);

    if (this.item?.govtAgencyKyc?.authorizationLetterPhoto) {
      let authorizationLetterPhoto = this.item?.govtAgencyKyc?.authorizationLetterPhoto
      let file ={
        name: 'Authorization Letter Photo',
        url: authorizationLetterPhoto,
        upload: 'authorizationLetterPhoto',
        mapping: 'authorizationLetterPhoto'
      }
      this.fileLists.push(file);
      if(this.item?.newValues?.authorizationLetterPhoto) {
        this.filesEdited.push(file);
      }
    }
      
    
    if (this.item?.govtAgencyKyc?.pocIdProofFrontPhoto) {
      let pocIdProofFrontPhoto = this.item?.govtAgencyKyc?.pocIdProofFrontPhoto
      let file = {
        name: 'POC ID Proof Front Photo',
        url: pocIdProofFrontPhoto,
        upload: 'pocIdProofFrontPhoto',
        mapping: 'pocIdProofFrontPhoto'
      }
      this.fileLists.push(file);
      if(this.item?.newValues?.pocIdProofFrontPhoto) {
        this.filesEdited.push(file);
      }
    }
    if (this.item?.govtAgencyKyc?.pocIdProofBackPhoto) {
      let pocIdProofBackPhoto = this.item?.govtAgencyKyc?.pocIdProofBackPhoto
      let file = {
        name: 'POC ID Proof Back Photo',
        url: pocIdProofBackPhoto,
        upload: 'pocIdProofBackPhoto',
        mapping: 'pocIdProofBackPhoto'
      }
      this.fileLists.push(file);
      if(this.item?.newValues?.pocIdProofBackPhoto) {
        this.filesEdited.push(file);
      }
    }
    if (this.item?.govtAgencyKyc?.pocSignaturePhoto) {
      let pocSignaturePhoto = this.item?.govtAgencyKyc?.pocSignaturePhoto
      let file = {
        name: 'POC Signature Photo',
        url: pocSignaturePhoto,
        upload: 'pocSignaturePhoto',
        mapping: 'pocSignaturePhoto'
      }
      this.fileLists.push(file);
      if(this.item?.newValues?.pocSignaturePhoto) {
        this.filesEdited.push(file);
      }
      
    }
    if (this.item?.govtAgencyKyc?.otherDocs) {
      this.otherdocsorNot = this.item.govtAgencyKyc.otherDocs
      const otherDocsArray = this.item.govtAgencyKyc.otherDocs.split(',');
      let i = 1;
      for (let files of otherDocsArray) {
       let file ={
          name: 'Other Document - ' + i,
          url: files,
          upload: 'otherDocs',
          mapping: 'otherDocs'

          // url: `${this.imageUrl}/kyc/static/${file}`,
        };
        this.fileLists.push(file);
        if(this.item?.newValues?.otherDocs) {
          this.filesEdited.push(file);
        }
        i++;
      }
    }
    this.formInitialised = true;




  }
  initNgoForm() {
    this.ngoForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      walletNumber: ['', Validators.required],
      accOpenDate: ['', Validators.required],
      location: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9  -,+.]+$')]],
      street: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      houseNo: ['', Validators.required],
      district: ['', Validators.required],
      province: ['', Validators.required],
      country: ['', Validators.required],
      officePhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      officeEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      tinNumber: ['', Validators.required],
      monthlyTurnover: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      sourceOfFund: ['', Validators.required],
      NoOfexmembers: ['', Validators.required],
      licenseRegNumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],


      execFirstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      execLastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      execResidentAddress: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      execDob: ['', [Validators.required, this.sharedFunctionsServic.ageValidator()]],
      execPosition: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      execIdProofType: ['', [Validators.required]],
      execIdProofNumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      execPlaceOfBirth: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],


      repFirstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      repLastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      repResidentAddress: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      repDob: ['', [Validators.required, this.sharedFunctionsServic.ageValidator()]],
      repDesignation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      repIdProofType: ['', [Validators.required]],
      repIdProofNumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      repPlaceOfBirth: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      repNationality: ['', [Validators.required]],
      repPhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      repSourceofIncome: ['', Validators.required],
      repMonthlyIncome: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
    this.firstNameValue = this.item?.ngoKyc?.repFirstName;
    this.dobValue = this.item?.ngoKyc?.repDob;
    console.log("firstNameValue", this.firstNameValue);
    console.log("dobValue", this.dobValue);

    this.ngoForm.patchValue({ name: this.item?.ngoKyc?.name });
    this.ngoForm.patchValue({ walletNumber: this.item?.ngoKyc?.walletNumber });
    this.ngoForm.patchValue({ accOpenDate: this.item?.ngoKyc?.accOpenDate });
    this.ngoForm.patchValue({ location: this.item?.ngoKyc?.location });
    this.ngoForm.patchValue({ street: this.item?.ngoKyc?.street });
    this.ngoForm.patchValue({ houseNo: this.item?.ngoKyc?.houseNo });
    this.ngoForm.patchValue({ district: this.item?.ngoKyc?.district });
    this.ngoForm.patchValue({ province: this.item?.ngoKyc?.province });
    this.ngoForm.patchValue({ country: this.item?.ngoKyc?.country });
    this.ngoForm.patchValue({ officePhone: this.item?.ngoKyc?.officePhone });
    this.ngoForm.patchValue({ officeEmail: this.item?.ngoKyc?.officeEmail });
    this.ngoForm.patchValue({ tinNumber: this.item?.ngoKyc?.tinNumber });
    // this.ngoForm.patchValue({ monthlyTurnover : this.item?.ngoKyc?.monthlyTurnover});
    this.ngoForm.patchValue({
      monthlyTurnover: this.item?.ngoKyc?.monthlyTurnover
        ? `AFN ${this.formatNumber(this.item.ngoKyc.monthlyTurnover)}`
        : 'NIL'
    });
    this.ngoForm.patchValue({ sourceOfFund: this.item?.ngoKyc?.sourceOfFund });
    this.ngoForm.patchValue({ NoOfexmembers: this.item?.ngoKyc?.noOfExMembers });

    this.ngoForm.patchValue({ licenseRegNumber: this.item?.ngoKyc?.licenseRegNumber });

    this.ngoForm.patchValue({ execFirstName: this.item?.ngoKyc?.executiveCommittee[0]?.execFirstName });
    this.ngoForm.patchValue({ execLastName: this.item?.ngoKyc?.executiveCommittee[0]?.execLastName });
    this.ngoForm.patchValue({ execResidentAddress: this.item?.ngoKyc?.executiveCommittee[0]?.execResidentAddress });
    this.ngoForm.patchValue({ execDob: this.item?.ngoKyc?.executiveCommittee[0]?.execDob });
    this.ngoForm.patchValue({ execPosition: this.item?.ngoKyc?.executiveCommittee[0]?.execPosition });
    this.ngoForm.patchValue({ execIdProofType: this.item?.ngoKyc?.executiveCommittee[0]?.execIdProofType });
    this.ngoForm.patchValue({ execIdProofNumber: this.item?.ngoKyc?.executiveCommittee[0]?.execIdProofNumber });
    this.ngoForm.patchValue({ execPlaceOfBirth: this.item?.ngoKyc?.executiveCommittee[0]?.execPlaceOfBirth });

    this.ngoForm.patchValue({ repFirstName: this.item?.ngoKyc?.repFirstName });
    this.ngoForm.patchValue({ repLastName: this.item?.ngoKyc?.repLastName });
    this.ngoForm.patchValue({ repResidentAddress: this.item?.ngoKyc?.repResidentAddress });
    this.ngoForm.patchValue({ repDob: this.item?.ngoKyc?.repDob });
    this.ngoForm.patchValue({ repDesignation: this.item?.ngoKyc?.repDesignation });
    this.ngoForm.patchValue({ repIdProofType: this.item?.ngoKyc?.repIdProofType });
    this.ngoForm.patchValue({ repIdProofNumber: this.item?.ngoKyc?.repIdProofNumber });
    this.ngoForm.patchValue({ repPlaceOfBirth: this.item?.ngoKyc?.repPlaceOfBirth });
    this.ngoForm.patchValue({ repNationality: this.item?.ngoKyc?.repNationality });
    this.ngoForm.patchValue({ repPhone: this.item?.ngoKyc?.repPhone });
    this.ngoForm.patchValue({ repSourceOfIncome: this.item?.ngoKyc?.repSourceOfIncome });
    this.ngoForm.patchValue({ repMonthlyIncome: this.item?.ngoKyc?.repMonthlyIncome });
    console.log("ngo Form Values", this.ngoForm.value);

    if (this.item?.ngoKyc?.regCertificatePhoto) {
      let regCertificatePhoto = this.item?.ngoKyc?.regCertificatePhoto
      let file ={
        name: 'Registration Certificate Photo',
        url: regCertificatePhoto,
        upload: 'regCertificatePhoto',
        mapping: 'regCertificatePhoto'
        // url: this.imageUrl + '/kyc/static/' + this.contactIdProofFrontPhoto
      }
      this.fileLists.push(file);
        if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'regCertificatePhoto') {
        this.filesEdited.push(file);
      }
    }
    if (this.item?.ngoKyc?.articleOfAssociationPhoto) {
      let articleOfAssociationPhoto = this.item?.ngoKyc?.articleOfAssociationPhoto
      let file = {
        name: 'Article of Association',
        url: articleOfAssociationPhoto,
        upload: 'articleOfAssociationPhoto',
        mapping: 'articleOfAssociationPhoto'
        // url: this.imageUrl + '/kyc/static/' + this.contactIdProofFrontPhoto
      }
      this.fileLists.push(file);
        if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'articleOfAssociationPhoto') {
        this.filesEdited.push(file);
      }
    }
    if (this.item?.ngoKyc?.addressProofPhoto) {
      let addressProofPhoto = this.item?.ngoKyc?.addressProofPhoto
      let file = {
        name: 'Address Proof',
        url: addressProofPhoto,
        upload: 'addressProofPhoto',
        mapping: 'addressProofPhoto'
        // url: this.imageUrl + '/kyc/static/' + this.contactIdProofFrontPhoto
      }
      this.fileLists.push(file);
        if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'addressProofPhoto') {
        this.filesEdited.push(file);
      }
    }
    if (this.item?.ngoKyc?.authorizationLetterPhoto) {
      let authorizationLetterPhoto = this.item?.ngoKyc?.authorizationLetterPhoto
      let file = {
        name: 'Authorization Letter',
        url: authorizationLetterPhoto,
        upload: 'authorizationLetterPhoto',
        mapping: 'authorizationLetterPhoto'
        // url: this.imageUrl + '/kyc/static/' + this.contactIdProofFrontPhoto
      }
      this.fileLists.push(file);
        if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'authorizationLetterPhoto') {
        this.filesEdited.push(file);
      }
    }
    if (this.item?.ngoKyc?.repIdProofFrontPhoto) {
      let repIdProofFrontPhoto = this.item?.ngoKyc?.repIdProofFrontPhoto
      let file = {
        name: 'Representative ID Proof Front Photo',
        url: repIdProofFrontPhoto,
        upload: 'repIdProofFrontPhoto',
        mapping: 'repIdProofFrontPhoto'
        // url: this.imageUrl + '/kyc/static/' + this.contactIdProofFrontPhoto
      }
      this.fileLists.push(file);
        if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'repIdProofFrontPhoto') {
        this.filesEdited.push(file);
      }
    }
    if (this.item?.ngoKyc?.repIdProofBackPhoto) {
      let repIdProofBackPhoto = this.item?.ngoKyc?.repIdProofBackPhoto
      let file = {
        name: 'Representative ID Proof Back Photo',
        url: repIdProofBackPhoto,
        upload: 'repIdProofBackPhoto',
        mapping: 'repIdProofBackPhoto'
        // url: this.imageUrl + '/kyc/static/' + this.contactIdProofFrontPhoto
      }
      this.fileLists.push(file);
        if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'repIdProofBackPhoto') {
        this.filesEdited.push(file);
      }
    }
    if (this.item?.ngoKyc?.repIdProofBackPhoto) {
      let repIdProofBackPhoto = this.item?.ngoKyc?.repIdProofBackPhoto
      let file = {
        name: 'Representative ID Proof Back Photo',
        url: repIdProofBackPhoto,
        upload: 'repIdProofBackPhoto',
        mapping: 'repIdProofBackPhoto'
        // url: this.imageUrl + '/kyc/static/' + this.contactIdProofFrontPhoto
      }
      this.fileLists.push(file);
        if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'repIdProofBackPhoto') {
        this.filesEdited.push(file);
      }
    }
    if (this.item?.ngoKyc?.taxClearancePhoto) {
      let taxClearancePhoto = this.item?.ngoKyc?.taxClearancePhoto
      let file = {
        name: 'Tax Clearance Letter',
        url: taxClearancePhoto,
        upload: 'taxClearancePhoto',
        mapping: 'taxClearancePhoto'
        // url: this.imageUrl + '/kyc/static/' + this.contactIdProofFrontPhoto
      }
      this.fileLists.push(file);
        if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'taxClearancePhoto') {
        this.filesEdited.push(file);
      }
    }
    if (this.item?.ngoKyc?.tinLetterPhoto) {
      let tinLetterPhoto = this.item?.ngoKyc?.tinLetterPhoto
      let file = {
        name: 'TIN Letter',
        url: tinLetterPhoto,
        upload: 'tinLetterPhoto',
        mapping: 'tinLetterPhoto'
        // url: this.imageUrl + '/kyc/static/' + this.contactIdProofFrontPhoto
      }
      this.fileLists.push(file);
        if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'tinLetterPhoto') {
        this.filesEdited.push(file);
      }
    }
    if (this.item?.ngoKyc?.auditedFinancialStmtPhoto) {
      let auditedFinancialStmtPhoto = this.item?.ngoKyc?.auditedFinancialStmtPhoto
      let file = {
        name: 'Audited Financial Statement',
        url: auditedFinancialStmtPhoto,
        upload: 'auditedFinancialStmtPhoto',
        mapping: 'auditedFinancialStmtPhoto'
        // url: this.imageUrl + '/kyc/static/' + this.contactIdProofFrontPhoto
      }
      this.fileLists.push(file);
        if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'auditedFinancialStmtPhoto') {
        this.filesEdited.push(file);
      }
    }
    this.otherdocsorNot = this.item.ngoKyc.otherDocs
    const otherDocsArray = this.item.ngoKyc.otherDocs.split(',');
    let i = 1;
    for (let file of otherDocsArray) {
      let otherDocFile = {
        name: 'Other Document - ' + i,
        url: file,
        upload: 'otherDocs',
        mapping: 'otherDocs'
      }
      this.fileLists.push(otherDocFile);
        if (this.item?.status == 'PENDING' && this.item?.newValues?.mapping == 'otherDocs') {
        this.filesEdited.push(otherDocFile);
      }
        // url: `${this.imageUrl}/kyc/static/${file}`,
      
      i++;
    }
    console.log("ngo fileLists", this.fileLists);
    this.formInitialised = true;






  }
  uploadFile(event: any, mapping: any, shareholderOrSignatoryID?: any, type?: 'SHAREHOLDER' | 'SIGNATORY') {
    if (!event.target.files || !event.target.files[0]) {
      console.error('No file provided for upload.');
      return;
    }

    const file: File = event.target.files[0];
    // An APPROVED KYC can only be changed through the maker-checker edit process,
    // so its documents go to editProcess/uploadImage instead of the KYC itself.
    const byMaker = this.userStatus === 'APPROVED';
    let upload$: Observable<any> | null = null;

    if (shareholderOrSignatoryID && type === 'SHAREHOLDER') {
      upload$ = byMaker
        ? this.corporate.submitCorporateKYCShareholderFilesByMaker(mapping, this.submittedForId, shareholderOrSignatoryID, file)
        : this.corporate.submitCorporateKYCShareholderFiles(mapping, this.submittedForId, shareholderOrSignatoryID, file);
    }
    else if (shareholderOrSignatoryID && type === 'SIGNATORY') {
      upload$ = byMaker
        ? this.corporate.submitCorporateKYCSignatoryFilesByMaker(mapping, this.submittedForId, shareholderOrSignatoryID, file)
        : this.corporate.submitCorporateKYCSignatoryFiles(mapping, this.submittedForId, shareholderOrSignatoryID, file);
    }
    else if (this.item?.kycType === 'CORPORATE') {
      upload$ = byMaker
        ? this.corporate.submitCorporateKYCFilesByMaker(this.submittedForId, mapping, file)
        : this.corporate.submitCorporateKYCFiles(this.submittedForId, mapping, file);
    }
    else if (this.item?.kycType === 'GOVT_AGENCY' || this.item?.kycType === 'UN_AGENCY') {
      upload$ = byMaker
        ? this.corporate.submitCorporateGOVTAgencyKYCFilesByMaker(this.submittedForId, mapping, file)
        : this.corporate.submitCorporateGOVTAgencyKYCFiles(this.submittedForId, mapping, file);
    }
    else if (this.item?.kycType === 'NGO') {
      upload$ = byMaker
        ? this.corporate.submitCorporateNGOKYCFilesByMaker(this.submittedForId, mapping, file)
        : this.corporate.submitCorporateNGOKYCFiles(this.submittedForId, mapping, file);
    }

    if (!upload$) {
      console.error('Unknown kycType for upload:', this.item?.kycType);
      return;
    }

    this.isLoading = true;
    upload$
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: any) => {
          if (res?.responseCode === 200) {
            alert(`File uploaded successfully.`);
          } else {
            alert(res?.error || `Failed to upload ${mapping}`);
          }
        },
        error: () => alert(`Failed to upload ${mapping}`)
      });
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
  validateData(event: any, formcontrol: any) {
    let inputValue = event.target.value;
    console.log("inputValue", inputValue);
    console.log("formcontrol", formcontrol);

  }
  //new
  formatMonthlyIncome(value: any): string {
    return value !== null && value !== undefined && value !== ''
      ? `AFN ${this.formatNumber(value)}`
      : 'NIL';
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
    console.log("ComplianceInput value:", this.ComplianceInput.value);
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
    console.log("ComplianceInput value:", this.ComplianceInput.value);
    // console.log("uploadedImageFileNameCompliance:", this.uploadedImageCompSignName);
    // console.log("sdnChecked:", this.sdnChecked);
    // console.log("riskChecked:", this.riskChecked);
    // return this.uploadedImageCEOSign
    if (this.approveStatus === 'IN_REVIEW') {
      // && !!this.watchListValue && this.remark.value
      return this.remarkValue
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
  isEditingIndex: number | null = null

  /*  enableEdit(event: any): void {
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
   } */

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

    this.corporate.corporateKYCUpdate(request).subscribe((response: any) => {
      if (response?.responseCode === 200) {
        this.corporate.completeRegisterKYC(this.item?.submittedFor?.id).subscribe((data: any) => {
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
          } else {
            alert(data?.error)
          }
        });
      } else {
        console.error(`${fieldData.label} Update failed`, response);
        alert(`${fieldData.label} Update failed`);
      }
    });
  }

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
    this.corporate.submitCorporateKYCFiles(this.submittedForId, field, event.target.files[0]).subscribe({
      next: (res) => {
        console.log(res);
        if (res?.responseCode == 200) {
          if (this.userStatus === 'IN_REVIEW') {
            this.corporate.completeRegisterKYC(this.submittedForId).subscribe({
              next: (completeRes: any) => {
                this.isLoading = false
                this.isEditingIndex = null
                if (completeRes?.responseCode === 200) {
                  alert('File Updated Successfully')
                } else {
                  alert(completeRes?.error || 'Complete step failed')
                }
              },
              error: () => {
                this.isLoading = false
                alert('Something Went Wrong!!!')
              }
            })
          } else {
            this.isLoading = false
            // this.cancelEdit();
            this.isEditingIndex = null
            alert('File Updated Successfully')
          }
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
   onKeyPressNumbersOnly(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow only numbers (0-9), block everything else
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }

  }
}
