import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { KycModuleService } from '../kyc/kyc-module.service';
import { UserManagementService } from '../../user-management/user-management/user-management/openapi';
import { saveAs } from 'file-saver';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
interface fileList {
  name: string,
  url: any
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
  selector: 'app-view-govt-kyc',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, ReactiveFormsModule, FormsModule, CommonModule, MatIconModule],
  templateUrl: './view-govt-kyc.component.html',
  styleUrl: './view-govt-kyc.component.css'
})
export class ViewGovtKycComponent {
  compForm: FormGroup = new FormGroup({});
  remarkForm: FormGroup = new FormGroup({});
  remark: FormControl = new FormControl();
  ComplianceInput: FormControl = new FormControl();
  ComplianceDateInput: FormControl = new FormControl();

  reason = new FormControl();
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
  otherDocsArray: any[] = [];
  approveStatus: any;
  showApprove1Btn: boolean = false;
  showApprove2Btn: boolean = false;
  showApproveFinalBtn: boolean = false;
  fileLists: fileList[] = [];
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
  monthlyIncome: any;
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
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private KycService: KycModuleService,
    private cdr: ChangeDetectorRef,
    private userManagemantService: UserManagementService

  ) {
    const dateObj = new Date();
    this.currentDate = dateObj.toISOString().substring(0, 10);
    console.log("currentDate", this.currentDate);
    this.refundForm = this.fb.group({
      digitalKey: ['', Validators.required], // Assuming batchId is required
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.KycService.getProfileDetails().subscribe((data: any) => {
      this.profileDetails = data?.data
      this.loginUser = this.profileDetails?.firstName + ' ' + this.profileDetails?.lastName
      console.log("this.loginUser", this.loginUser)
      // this.superImg = this.profileDetails?.profilePic;
      // console.log("this.superImg", this.superImg);
      this.approvedByComplianceValue = this.item?.corporateKyc?.approvedByComplianceFullName
      console.log("approvedByComplianceValue", this.approvedByComplianceValue)
      this.approvedByComplianceDateValue = this.item?.corporateKyc?.approvedByComplianceDate
      console.log("approvedByComplianceDateValue", this.approvedByComplianceDateValue)
      if (this.userStatus === 'IN_REVIEW') {
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
      basicFirstName: ['', Validators.required],
      basicLastName: ['', Validators.required],
      basicEmail: ['', Validators.required],
      basicPhone: ['', Validators.required],
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
      accTitle: ['', Validators.required],
      MMwallet: ['', Validators.required],
      accOpenDate: ['', Validators.required],
      contactPerName: ['', Validators.required],
      contactPerDesignation: ['', Validators.required],
      NoOfShareHolder: ['', Validators.required],

      licenseNo: ['', Validators.required],
      licenseAuth: ['', Validators.required],
      issueDate: ['', Validators.required],
      expiryDate: ['', Validators.required],
      tinNo: ['', Validators.required],

      businessName: ['', Validators.required],
      grossAnnualIncome: ['', Validators.required],
      natureBusiness: ['', Validators.required],
      monthlyIncome: ['', Validators.required],
      netWorth: ['', Validators.required],
      fundSrc: ['', Validators.required],
      monthlyTurnover: ['', Validators.required],

      cmpnyLoc: ['', Validators.required],
      streetNo: ['', Validators.required],
      houseNo: ['', Validators.required],
      district: ['', Validators.required],
      province: ['', Validators.required],
      country: ['', Validators.required],
      offPhNo: ['', Validators.required],
      cmpnyEmail: ['', Validators.required],

      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      fatherName: ['', Validators.required],
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
      typeAuth: ['', Validators.required],
      //NEW
    });
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        this.item = JSON.parse(params['data']);
        console.log("Received item:", this.item);
      }
    });
    //instead getAllKyc 
    // for (let item of this.allUsers) {
    // if (this.kycId == item?.id) {
    this.kycId = this.item?.id;
    console.log("Extracted kycId:", this.kycId);
    this.userStatus = this.item?.status
    console.log("this.userStatus", this.userStatus)
    this.seqNo = this.item?.seqNo;

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
    if (this.item?.corporateKyc?.otherDocs) {
      this.otherdocsorNot = this.item.corporateKyc.otherDocs
      const otherDocsArray = this.item.corporateKyc.otherDocs.split(',');
      let i = 1;
      for (let file of otherDocsArray) {
        this.fileLists.push({
          name: 'Other Document - ' + i,
          url: `${this.imageUrl}/kyc/static/${file}`,
        });
        i++;
      }
    }
    this.watchlistRemarksVal = this.item?.corporateKyc?.watchlistRemarks

    this.walletaccounts = this.item?.submittedFor?.walletAccount;
    console.log(" this.walletaccounts", this.walletaccounts);

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
      this.readOnly = true;
    }
    else {
      this.readOnly = false;
    } //img
    this.kycSign = this.item?.corporateKyc?.superSign_img_2;
    this.opSign = this.item?.corporateKyc?.opsSign_img_2;
    //new
    this.compSign = this.item?.corporateKyc?.complianceSignaturePhoto;
    this.compHedSign = this.item?.corporateKyc?.complianceHeadSignaturePhoto;
    this.ceoSign = this.item?.corporateKyc?.ceoSignaturePhoto;
    //gender
    if (this.item?.corporateKyc?.custInfoGender == "MALE") {
      this.MaleChecked.setValue(true);
    }
    if (this.item?.corporateKyc?.custInfoGender == "FEMALE") {
      this.FemaleChecked.setValue(true);
    }
    //risk&watch
    //risk
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
    //doc
    if (this.item.corporateKyc.validLicenseNo) {
      this.licenseNoo.setValue(true);
    }
    if (this.item.corporateKyc.validLicenseYes) {
      this.licenseYes.setValue(true);
    }
    if (this.item.corporateKyc.validPassportNo) {
      this.passNo.setValue(true);
    }
    if (this.item.corporateKyc.validPassportYes) {
      this.passYes.setValue(true);
    }
    if (this.item.corporateKyc.validSignatoryNo) {
      this.signNo.setValue(true);
    }
    if (this.item.corporateKyc.validSignatoryYes) {
      this.signYes.setValue(true);
    }
    if (this.item.corporateKyc.validAssociationNo) {
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
    }
    //NEW
    this.taskiraPhotoFront = this.item?.corporateKyc?.contactIdProofFrontPhoto;
    this.taskiraPhotoBack = this.item?.cocukrporateKyc?.contactIdProofBackPhoto;
    this.contactPersonSign = this.item?.corporateKyc?.contactSignaturePhoto;

    this.businessLicensePhoto = this.item?.corporateKyc?.bizLicensePhoto;
    this.cmpnyAddressProofFront = this.item?.corporateKyc?.addressProofPhoto;
    // this.cmpnyAddressProofBack = item?.corporateKyc?.idProofBackPhoto;

    this.shareholderPassportPhotoFront = this.item?.corporateKyc?.shareholders?.idProofFrontPhoto;
    this.shareholderPassportPhotoBack = this.item?.corporateKyc?.shareholders?.idProofBackPhoto;

    this.AuthorizedSignPhotoFront = this.item?.corporateKyc?.signatoryPhoto;
    this.AuthorizedSignPhotoBack = this.item?.corporateKyc?.signatoryIdProofBackPhoto;
    this.AuthorizedSignTaskiraPhoto = this.item?.corporateKyc?.signatoryIdProofFrontPhoto;
    this.powerPhoto = this.item?.corporateKyc?.authorizationLetterPhoto;
    this.DigitalSign = this.item?.corporateKyc?.signatorySignature;

    //NEW
    this.superImg = this.item?.corporateKyc?.signatories[0].signatoryPhoto;
    this.presidentSign = this.item?.corporateKyc?.prezSign_img_1;
    // this.agentVerifySign = item?.corporateKyc?.superSign_img_1;
    this.vicePresSign = this.item?.corporateKyc?.vicePrezSign_img_1;

    if (this.readOnly) {
      this.FemaleChecked.disable();
      this.MaleChecked.disable();
    }
    if (this.item?.corporateKyc?.signatories[0].signatoryPhoto) {
      this.superImg = this.item?.corporateKyc?.signatories[0].signatoryPhoto;
      this.fileLists.push({
        name: 'Corportate Profile Picture',
        url: this.imageUrl + '/kyc/static/' + this.superImg
        // url: this.imageUrl + '/um/static/profile/' + this.superImg
      })
    }
    if (this.item?.corporateKyc?.contactIdProofFrontPhoto) {
      this.contactIdProofFrontPhoto = this.item?.corporateKyc?.contactIdProofFrontPhoto
      this.fileLists.push({
        name: 'Corportate Contact Id Proof Front Photo',
        url: this.imageUrl + '/kyc/static/' + this.contactIdProofFrontPhoto
      })
    }
    if (this.item?.corporateKyc?.contactSignaturePhoto) {
      this.contactSignaturePhoto = this.item?.corporateKyc?.contactSignaturePhoto
      this.fileLists.push({
        name: 'Corportate Contact Signature Photo',
        url: this.imageUrl + '/kyc/static/' + this.contactSignaturePhoto
      })
    }
    if (this.item?.corporateKyc?.bizLicensePhoto) {
      this.bizLicensePhoto = this.item?.corporateKyc?.bizLicensePhoto
      this.fileLists.push({
        name: 'Corportate Business License Photo',
        url: this.imageUrl + '/kyc/static/' + this.bizLicensePhoto
      })
    }
    if (this.item?.corporateKyc?.addressProofPhoto) {
      this.addressProofPhoto = this.item?.corporateKyc?.addressProofPhoto
      this.fileLists.push({
        name: 'Corportate Address Proof Photo',
        url: this.imageUrl + '/kyc/static/' + this.addressProofPhoto
      })
    }
    if (this.item?.corporateKyc?.authorizationLetterPhoto) {
      this.authorizationLetterPhoto = this.item?.corporateKyc?.authorizationLetterPhoto
      this.fileLists.push({
        name: 'Corportate Authorization LetterPhoto',
        url: this.imageUrl + '/kyc/static/' + this.authorizationLetterPhoto
      })
    }
    if (this.item?.corporateKyc?.articleOfAssociationPhoto) {
      this.articleOfAssociationPhoto = this.item?.corporateKyc?.articleOfAssociationPhoto
      this.fileLists.push({
        name: 'Corportate Article Of AssociationPhoto',
        url: this.imageUrl + '/kyc/static/' + this.articleOfAssociationPhoto
      })
    }
    if (this.item?.corporateKyc?.taxClearanceLetterPhoto) {
      this.taxClearanceLetterPhoto = this.item?.corporateKyc?.taxClearanceLetterPhoto
      this.fileLists.push({
        name: 'Corportate Tax Clearance LetterPhoto',
        url: this.imageUrl + '/kyc/static/' + this.taxClearanceLetterPhoto
      })
    }
    if (this.item?.corporateKyc?.companyTINLetterPhoto) {
      this.companyTINLetterPhoto = this.item?.corporateKyc?.companyTINLetterPhoto
      this.fileLists.push({
        name: 'Corportate Company TINLetter Photo',
        url: this.imageUrl + '/kyc/static/' + this.companyTINLetterPhoto
      })
    }

    console.log("Files", this.fileLists);

    this.dobValue = this.item?.corporateKyc?.signatoryDOB
    this.firstNameValue = this.item?.corporateKyc?.signatoryFirstName;
    this.superAgentForm.patchValue({ accTitle: this.item?.corporateKyc?.companyName || 'NIL' })
    this.superAgentForm.patchValue({ MMwallet: this.item?.corporateKyc?.companyWalletNumber || 'NIL' })
    this.superAgentForm.patchValue({ accOpenDate: this.item?.corporateKyc?.companyAccOpenDate || 'NIL' })
    this.superAgentForm.patchValue({ contactPerName: this.item?.corporateKyc?.contactPersonName || 'NIL' })
    this.superAgentForm.patchValue({ contactPerDesignation: this.item?.corporateKyc?.contactPersonDesignation || 'NIL' })
    this.superAgentForm.patchValue({ NoOfShareHolder: this.item?.corporateKyc?.companyNoOfShareholders || 'NIL' })
    this.superAgentForm.patchValue({ licenseNo: this.item?.corporateKyc?.bizLicenseNumber || 'NIL' })
    this.superAgentForm.patchValue({ licenseAuth: this.item?.corporateKyc?.bizLicenseAuthority || 'NIL' })
    this.superAgentForm.patchValue({ issueDate: this.item?.corporateKyc?.bizLicenseDateOfIssue || 'NIL' })
    this.superAgentForm.patchValue({ expiryDate: this.item?.corporateKyc?.bizLicenseDateOfExpiry || 'NIL' })

    this.superAgentForm.patchValue({ tinNo: this.item?.corporateKyc?.bizLicenseTinNumber || 'NIL' })
    this.superAgentForm.patchValue({ businessName: this.item?.corporateKyc?.bizName || 'NIL' })
    this.superAgentForm.patchValue({ grossAnnualIncome: this.item?.corporateKyc?.natureOfBiz || 'NIL' })
    // this.superAgentForm.patchValue({ monthlyIncome: item?.corporateKyc?.monthlyIncome || 'NIL' })
    this.superAgentForm.patchValue({
      monthlyIncome: this.item?.corporateKyc?.monthlyIncome
        ? `AFN ${this.formatNumber(this.item.corporateKyc.monthlyIncome)}`
        : 'NIL'
    });
    // this.superAgentForm.patchValue({ netWorth: item?.corporateKyc?.netWorth || 'NIL' })
    this.superAgentForm.patchValue({
      netWorth: this.item?.corporateKyc?.netWorth
        ? `AFN ${this.formatNumber(this.item.corporateKyc.netWorth)}`
        : 'NIL'
    });
    this.superAgentForm.patchValue({ fundSrc: this.item?.corporateKyc?.sourceOfFund || 'NIL' })
    // this.superAgentForm.patchValue({ monthlyTurnover: item?.corporateKyc?.monthlyTurnover || 'NIL' })
    this.superAgentForm.patchValue({
      monthlyTurnover: this.item?.corporateKyc?.monthlyTurnover
        ? `AFN ${this.formatNumber(this.item.corporateKyc.monthlyTurnover)}`
        : 'NIL'
    });
    this.superAgentForm.patchValue({ cmpnyLoc: this.item?.corporateKyc?.companyLocation || 'NIL' })
    this.superAgentForm.patchValue({ streetNo: this.item?.corporateKyc?.companyStreet || 'NIL' })
    this.superAgentForm.patchValue({ houseNo: this.item?.corporateKyc?.companyHouseNumber || 'NIL' })
    this.superAgentForm.patchValue({ district: this.item?.corporateKyc?.companyDistrict || 'NIL' })
    this.superAgentForm.patchValue({ province: this.item?.corporateKyc?.companyProvince || 'NIL' })
    this.superAgentForm.patchValue({ country: this.item?.corporateKyc?.companyCountry || 'NIL' })
    this.superAgentForm.patchValue({ offPhNo: this.item?.corporateKyc?.companyOfficePhone || 'NIL' })
    this.superAgentForm.patchValue({ cmpnyEmail: this.item?.corporateKyc?.companyEmail || 'NIL' })

    this.superAgentForm.patchValue({ firstName: this.item?.corporateKyc?.shareholders?.firstName || 'NIL' })
    this.superAgentForm.patchValue({ lastName: this.item?.corporateKyc?.shareholders?.lastName || 'NIL' })
    this.superAgentForm.patchValue({ fatherName: this.item?.corporateKyc?.shareholders?.fatherName || 'NIL' })
    this.superAgentForm.patchValue({ tazkira: this.item?.corporateKyc?.shareholders?.idProofNumber || 'NIL' })
    this.superAgentForm.patchValue({ dob: this.item?.corporateKyc?.shareholders?.dob || 'NIL' })
    this.superAgentForm.patchValue({ birthPlace: this.item?.corporateKyc?.shareholders?.placeOfBirth || 'NIL' })
    this.superAgentForm.patchValue({ Nationality: this.item?.corporateKyc?.shareholders?.nationality || 'NIL' })
    this.superAgentForm.patchValue({ shareholderIncome: this.item?.corporateKyc?.shareholders?.monthlyIncome || 'NIL' })
    this.superAgentForm.patchValue({ shareholderPerc: this.item?.corporateKyc?.shareholders?.shareholdingPercentage || 'NIL' })
    this.superAgentForm.patchValue({ otherSrc: this.item?.corporateKyc?.shareholders?.sourceOfIncome || 'NIL' })
    this.superAgentForm.patchValue({ shareholderRelation: this.item?.corporateKyc?.shareholders?.relationship || 'NIL' })
    this.superAgentForm.patchValue({ shareholderPh: this.item?.corporateKyc?.shareholders?.phone || 'NIL' })
    this.superAgentForm.patchValue({ shareholderTin: this.item?.corporateKyc?.shareholders?.tinNumber || 'NIL' })

    this.superAgentForm.patchValue({ shareCurrLoc: this.item?.corporateKyc?.shareholders?.currLocation || 'NIL' })
    this.superAgentForm.patchValue({ shareCurrDis: this.item?.corporateKyc?.shareholders?.currDistrict || 'NIL' })
    this.superAgentForm.patchValue({ shareCurrPro: this.item?.corporateKyc?.shareholders?.currProvince || 'NIL' })
    this.superAgentForm.patchValue({ shareCurrCount: this.item?.corporateKyc?.shareholders?.currCountry || 'NIL' })

    this.superAgentForm.patchValue({ sharePerLoc: this.item?.corporateKyc?.shareholders?.permLocation || 'NIL' })
    this.superAgentForm.patchValue({ sharePerDis: this.item?.corporateKyc?.shareholders?.permDistrict || 'NIL' })
    this.superAgentForm.patchValue({ sharePerPro: this.item?.corporateKyc?.shareholders?.permProvince || 'NIL' })
    this.superAgentForm.patchValue({ sharePerCount: this.item?.corporateKyc?.shareholders?.permCountry || 'NIL' })

    this.superAgentForm.patchValue({ firstNameAuth: this.item?.corporateKyc?.signatoryFirstName || 'NIL' })
    this.superAgentForm.patchValue({ lastNameAuth: this.item?.corporateKyc?.signatoryLastName || 'NIL' })
    this.superAgentForm.patchValue({ tazkiraAuth: this.item?.corporateKyc?.signatoryIdProofNumber || 'NIL' })
    this.superAgentForm.patchValue({ dobAuth: this.item?.corporateKyc?.signatoryDOB || 'NIL' })
    this.superAgentForm.patchValue({ birthPlaceAuth: this.item?.corporateKyc?.signatoryPlaceOfBirth || 'NIL' })
    this.superAgentForm.patchValue({ NationalityAuth: this.item?.corporateKyc?.signatoryNationality || 'NIL' })
    console.log("signatoryNationality", this.item?.corporateKyc?.signatoryNationality)
    this.superAgentForm.patchValue({ designationAuth: this.item?.corporateKyc?.signatoryDesignation || 'NIL' })
    this.superAgentForm.patchValue({ resiAuth: this.item?.corporateKyc?.signatoryResidentAddress || 'NIL' })
    this.superAgentForm.patchValue({ phAuth: this.item?.corporateKyc?.signatoryPhone || 'NIL' })
    this.superAgentForm.patchValue({ srcAuth: this.item?.corporateKyc?.signatorySourceOfIncome || 'NIL' })
    this.superAgentForm.patchValue({ incomeAuth: this.item?.corporateKyc?.signatoryMonthlyIncome || 'NIL' })
    this.superAgentForm.patchValue({ typeAuth: this.item?.corporateKyc?.signatoryType || 'NIL' })

    this.superAgentForm.patchValue({ presidentName: this.item?.corporateKyc?.not || 'NIL' })
    this.superAgentForm.patchValue({ presidentDate: this.item?.corporateKyc?.not || 'NIL' })
    this.superAgentForm.patchValue({ V_presidentName: this.item?.corporateKyc?.not || 'NIL' })
    this.superAgentForm.patchValue({ V_presidentDate: this.item?.corporateKyc?.not || 'NIL' })

    this.superAgentForm.patchValue({ KycProcessed: this.item?.corporateKyc?.kycProcessedBy || 'NIL' })
    this.superAgentForm.patchValue({ KycProcessedDate: this.item?.corporateKyc?.kycProcessedDate || 'NIL' })
    this.superAgentForm.patchValue({ Verified: this.item?.corporateKyc?.verifiedByOps || 'NIL' })
    this.superAgentForm.patchValue({ VerifiedDate: this.item?.corporateKyc?.verifiedByOpsDate || 'NIL' })
    this.superAgentForm.patchValue({ Compliance: this.item?.corporateKyc?.approvedByCompliance || 'NIL' })
    this.superAgentForm.patchValue({ ComplianceDate: this.item?.corporateKyc?.approvedByComplianceDate || 'NIL' })
    //old patchvalue

    this.PresidentName = this.item?.corporateKyc?.undertakenPrezName;
    this.Date = this.item?.corporateKyc?.undertakenPrezDate;
    this.VPresidentName = this.item?.corporateKyc?.custInfoFirstName;
    this.VDate = this.item?.corporateKyc?.custInfoFatherName;

    //abmmc verify
    this.firstNameValue = this.item?.submittedFor?.firstName
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
    this.walletaccounts = this.item?.submittedFor?.walletAccount
    console.log(" this.walletaccounts", this.walletaccounts);

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
  }
  initForm() {
    this.remarkForm.addControl('remark', this.remark)
    this.compForm.addControl('ComplianceInput', this.ComplianceInput)
    this.compForm.addControl('ComplianceDateInput', this.ComplianceDateInput)
  }

  setFieldValue(key: string, value: any) {
    this.superAgentForm.patchValue({ [key]: value ?? 'nil' });
  }

  formatNumber(value: number): string {
    if (value === null || value === undefined) {
      return '0';
    }
    return value.toString().replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  }
  isFileInOtherDocs(fileUrl: string): boolean {
    const relativePath = fileUrl.split('/').slice(-2).join('/'); // Extract relative path
    return this.otherdocsorNot.split(',').includes(relativePath);
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
    window.open(fileUrl, '_blank');  // Opens the file in a new tab
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
      this.KycService.deleteAgentMultipleDoc(req, this.submittedForId).subscribe((data: any) => {
        if (data?.code === 200) {
          console.log('File deleted successfully');
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

  onSubmitEdit() {
    let req = {
      corporateKyc: {
        custInfoCompanyName: this.superAgentForm.get('companyName')?.value,
        custInfoPOS: this.superAgentForm.get('pos')?.value,
        custInfoLocation: this.superAgentForm.get('location')?.value,
        custInfoAccOpenDate: this.superAgentForm.get('accountDate')?.value,
        custInfoPTID: this.superAgentForm.get('PTID')?.value,
        custInfoICCID: this.superAgentForm.get('ICCID')?.value,
        purposeOfAcc: this.superAgentForm.get('accCreationPurpose')?.value,
        licenseAuthority: this.superAgentForm.get('licenseAuth')?.value,
        licenseDateOfIssue: this.superAgentForm.get('issueDate')?.value,
        licenseDateOfExpiry: this.superAgentForm.get('expiryDate')?.value,
        licenseNumber: this.superAgentForm.get('licenseNo')?.value,
        licenseTIN: this.superAgentForm.get('TIN')?.value,
        //start from here
        companyStreet: this.superAgentForm.get('street')?.value,
        companyProvince: this.superAgentForm.get('province')?.value,
        companyContact: this.superAgentForm.get('contactNo')?.value,
        companyEmail: this.superAgentForm.get('email')?.value,
        companyHouseNumber: this.superAgentForm.get('houseNo')?.value,
        companyDistrict: this.superAgentForm.get('district')?.value,
        companyCountry: this.superAgentForm.get('country')?.value,
        companyTelephone: this.superAgentForm.get('contactNo')?.value,

        remittanceOutward: this.superAgentForm.get('outward')?.value,
        remittanceSourceOfFund: this.superAgentForm.get('fund')?.value,
        remittanceTurnover: this.superAgentForm.get('turnover')?.value,
        remittanceInward: this.superAgentForm.get('inward')?.value,
        remittanceNatureOfBiz: this.superAgentForm.get('businessNature')?.value,
        remittanceIncome: this.superAgentForm.get('monthlyIncome')?.value,

        prezLastName: this.superAgentForm.get('lastName')?.value,
        prezPosition: this.superAgentForm.get('positionPresident')?.value,
        prezTazkira: this.superAgentForm.get('tazkira')?.value,
        prezCountry: this.superAgentForm.get('countryPresident')?.value,
        prezDateOfExpiry: this.superAgentForm.get('DateofExpiryPresident')?.value,
        prezNationality: this.superAgentForm.get('nationalityPresident')?.value,
        prezMobile: this.superAgentForm.get('mobilePresident')?.value,
        prezFirstName: this.superAgentForm.get('firstName')?.value,
        prezFatherName: this.superAgentForm.get('fatherName')?.value,
        prezEmail: this.superAgentForm.get('emailPresident')?.value,
        prezDob: this.superAgentForm.get('dob')?.value,
        prezDateOfIssue: this.superAgentForm.get('issueDatePresident')?.value,
        prezSourceOfIncome: this.superAgentForm.get('incomeSourcePresident')?.value,
        prezIncome: this.superAgentForm.get('monthlyIncomePresident')?.value,
        prezTIN: this.superAgentForm.get('PresidentTin')?.value,

        prezPermHouseNumber: this.superAgentForm.get('permanentHouseNo')?.value,
        prezPermLocation: this.superAgentForm.get('permanentLocation')?.value,
        prezPermProvince: this.superAgentForm.get('permanentProvince')?.value,
        prezPermStreet: this.superAgentForm.get('permanentStreet')?.value,
        prezPermDistrict: this.superAgentForm.get('permanentDistrict')?.value,
        prezPermCountry: this.superAgentForm.get('permanentCountry')?.value,

        prezCurrHouseNumber: this.superAgentForm.get('houseNoAddress')?.value,
        prezCurrLocation: this.superAgentForm.get('locationAddress')?.value,
        prezCurrProvince: this.superAgentForm.get('provinceAddress')?.value,
        prezCurrStreet: this.superAgentForm.get('streetAddress')?.value,
        prezCurrDistrict: this.superAgentForm.get('districtAddress')?.value,
        prezCurrCountry: this.superAgentForm.get('countryAddress')?.value,

        vicePrezLastName: this.superAgentForm.get('lastNameCompanyVice')?.value,
        vicePrezPosition: this.superAgentForm.get('positionCompanyVice')?.value,
        vicePrezTazkira: this.superAgentForm.get('tazkiraCompanyVice')?.value,
        vicePrezCountry: this.superAgentForm.get('countryCompanyVice')?.value,
        vicePrezDateOfExpiry: this.superAgentForm.get('DateofExpiryCompanyVice')?.value,
        vicePrezNationality: this.superAgentForm.get('nationalityCompanyVice')?.value,
        vicePrezMobile: this.superAgentForm.get('mobileCompanyVice')?.value,
        vicePrezFirstName: this.superAgentForm.get('firstNameCompanyVice')?.value,
        vicePrezFatherName: this.superAgentForm.get('fatherNameCompanyVice')?.value,
        vicePrezEmail: this.superAgentForm.get('emailCompanyVice')?.value,
        vicePrezDob: this.superAgentForm.get('dobCompanyVice')?.value,
        vicePrezDateOfIssue: this.superAgentForm.get('issueDateCompanyVice')?.value,
        vicePrezSourceOfIncome: this.superAgentForm.get('incomeSourceCompanyVice')?.value,
        vicePrezIncome: this.superAgentForm.get('monthlyIncomeCompanyVice')?.value,
        vicePrezTIN: this.superAgentForm.get('viceTin')?.value,

        vicePrezPermHouseNumber: this.superAgentForm.get('VicepermanentHouseNo')?.value,
        vicePrezPermLocation: this.superAgentForm.get('VicepermanentLocation')?.value,
        vicePrezPermProvince: this.superAgentForm.get('VicepermanentProvince')?.value,
        vicePrezPermStreet: this.superAgentForm.get('VicepermanentStreet')?.value,
        vicePrezPermDistrict: this.superAgentForm.get('VicepermanentDistrict')?.value,
        vicePrezPermCountry: this.superAgentForm.get('VicepermanentCountry')?.value,

        vicePrezCurrHouseNumber: this.superAgentForm.get('VicehouseNoAddress')?.value,
        vicePrezCurrLocation: this.superAgentForm.get('VicelocationAddress')?.value,
        vicePrezCurrProvince: this.superAgentForm.get('ViceprovinceAddress')?.value,
        vicePrezCurrStreet: this.superAgentForm.get('VicestreetAddress')?.value,
        vicePrezCurrDistrict: this.superAgentForm.get('VicedistrictAddress')?.value,
        vicePrezCurrCountry: this.superAgentForm.get('VicecountryAddress')?.value,

        otherMnoNo: "",
        otherMnoYes: "",
        otherMnoAccName: this.superAgentForm.get('accountName')?.value,
        otherMnoName: this.superAgentForm.get('MNOname')?.value,
        otherMnoAccNumber: this.superAgentForm.get('accountNo')?.value,

        undertakenPrezName: this.superAgentForm.get('presidentName')?.value,
        undertakenPrezDate: this.superAgentForm.get('presidentDate')?.value,
        undertakenVicePrezName: this.superAgentForm.get('V_presidentName')?.value,
        undertakenVicePrezDate: this.superAgentForm.get('V_presidentDate')?.value,


        validLicenseNo: "",
        validLicenseYes: "",
        validPassportNo: "",
        validPassportYes: "",
        validSignatoryNo: "",
        validAssociationNo: "",
        validResolutionNo: "",
        validPowerOfAttNo: "",
        validSignatoryYes: "",
        validAssociationYes: "",
        validResolutionYes: "",
        validPowerOfAttYes: "",
      },
      kycType: "CORPORATE",
      submittedFor: this.submittedForId
    }
    this.isLoading = true;
    this.KycService.superFinalUpdate(req).subscribe((data: any) => {
      this.isLoading = false;
      if (data?.responseCode == 1) {
        alert("success")
      }
      else {
        alert("failed")
      }
    })
  }
  makePdf() {
    this.KycService.downloadPDF(this.kycId).subscribe(
      (data: Blob) => {
        console.log(data.type);  // Ensure it logs 'application/pdf'
        const filename = 'SuperAgent_Report.pdf';
        saveAs(data, filename);
      },
      (error) => {
        console.error('Download failed:', error);
        alert('Failed to download PDF');
      }
    );
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
    this.KycService.downloadSdnPDF(this.kycId).subscribe(
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
  checkSdn() {
    this.isLoading = true;

    this.watchYes.setValue(true);
    this.watchNo.setValue(false);
    this.sdnChecked = true;
    this.watchTarget = true;
    const req = {
      // name: this.firstNameValue,
      "name": this.firstNameValue,
      "minMatchPercent": 60,
      "dob": this.dobValue,
      "kycId": this.kycId,
      "userId": this.submittedForId
    };
    this.KycService.searchSdn(req).subscribe((data: any) => {
      if (data) {
        this.isLoading = false;
        this.sdnDetails = data
        this.showModal = true;
      }
      else if (!data?.id) {
        this.isLoading = false;
        alert("No data found");
      }
    });
  }
  checkRisk() {
    this.riskChecked = true
    this.isLoading = true;
    this.KycService.checkRisk(this.kycId).subscribe((data: any) => {
      if (data) {
        this.isLoading = false;
        this.riskDetails = data?.data
        this.showRiskModal = true;
      }
      else if (!data) {
        this.isLoading = false;
        alert("No data found");
      }
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
    this.KycService.viewRiskAndSdn(this.kycId).subscribe((data: any) => {
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
    if (riskLevel === 'high' && this.approveStatus === 'IN_REVIEW') {
      this.showApproveFinalBtn = false;
      this.showApprove1Btn = true;
      this.showApprove2Btn = false;
    }
    else if (riskLevel === 'low' && this.approveStatus === 'IN_REVIEW') {
      this.showApproveFinalBtn = true;
      this.showApprove1Btn = false;
      this.showApprove2Btn = false;
    }
    else if (riskLevel === 'medium' && this.approveStatus === 'IN_REVIEW') {
      this.showApproveFinalBtn = true;
      this.showApprove1Btn = false;
      this.showApprove2Btn = false;
    }
    else if (riskLevel === 'medium') {
      this.showAbmmcHigh = false;
      this.showAbmmcLowMed = true;

      this.showApproveFinalBtn = true;
      this.showApprove1Btn = false;
      this.showApprove2Btn = false;
    }
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
      "riskCategory": this.riskTarget,
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
      "riskCategory": this.riskTarget,
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
      "riskCategory": this.riskTarget,
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
      "riskCategory": this.riskTarget,
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
    return !!this.riskValue && !!this.remarkValue
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
    return !!this.riskValue && !!this.remarkValue
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
    this.router.navigateByUrl('/kyc/agent')
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
//         this.approvedByComplianceValue = item?.corporateKyc?.approvedByComplianceFullName
//         console.log("approvedByComplianceValue", this.approvedByComplianceValue)
//         this.approvedByComplianceDateValue = item?.corporateKyc?.approvedByComplianceDate
//         console.log("approvedByComplianceDateValue", this.approvedByComplianceDateValue)
//         if (this.userStatus === 'IN_REVIEW') {
//           this.compForm.get('ComplianceInput')?.setValue(this.loginUser);
//           console.log("this.loginUser1", this.loginUser)
//           this.compForm.get('ComplianceDateInput')?.setValue(this.currentDate);
//         } else {
//           this.compForm.get('ComplianceInput')?.setValue(this.approvedByComplianceValue);
//           this.compForm.get('ComplianceDateInput')?.setValue(this.approvedByComplianceDateValue);
//         }
//         // if (item?.attachments.length != 0) {
//         //   let i = 1;
//         //   for (let file of item.attachments) {
//         //     this.fileLists.push({
//         //       name: 'Attachment - ' + i,
//         //       url: this.imageUrl + '/kyc/static/' + file
//         //     })
//         //     i++;
//         //   }
//         // }
//         //new
//         if (item?.corporateKyc?.otherDocs) {
//           this.otherdocsorNot = item.corporateKyc.otherDocs
//           const otherDocsArray = item.corporateKyc.otherDocs.split(',');
//           let i = 1;
//           for (let file of otherDocsArray) {
//             this.fileLists.push({
//               name: 'Other Document - ' + i,
//               url: `${this.imageUrl}/kyc/static/${file}`,
//             });
//             i++;
//           }
//         }
//         this.watchlistRemarksVal = item?.corporateKyc?.watchlistRemarks
//         // this.approvedByComplianceValue = item?.corporateKyc?.approvedByCompliance

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
//         // let shareholdersArray: Shareholder[] = [];
//         // this.item.forEach((item: any) => {
//         //   if (item?.corporateKyc?.shareholders && Array.isArray(item.corporateKyc.shareholders)) {
//         //     shareholdersArray.push(...item.corporateKyc.shareholders);
//         //   }
//         // });
//         // this.shareHolderArray = shareholdersArray
//         // console.log("shareholdersArray", shareholdersArray);
//         // let authorizedArray: signatories[] = [];
//         // this.item.forEach((item: any) => {
//         //   if (item?.corporateKyc?.signatories && Array.isArray(item.corporateKyc.signatories)) {
//         //     authorizedArray.push(...item.corporateKyc.signatories);
//         //   }
//         // });
//         // this.authorizedSignArray = authorizedArray

//         this.submittedForId = item?.submittedFor?.id
//         if (item?.status == 'IN_REVIEW' || 'APPROVED') {
//           this.readOnly = true;
//         }
//         else {
//           this.readOnly = false;
//         } //img
//         this.kycSign = item?.corporateKyc?.superSign_img_2;
//         this.opSign = item?.corporateKyc?.opsSign_img_2;
//         //new
//         this.compSign = item?.corporateKyc?.complianceSignaturePhoto;
//         this.compHedSign = item?.corporateKyc?.complianceHeadSignaturePhoto;
//         this.ceoSign = item?.corporateKyc?.ceoSignaturePhoto;
//         //gender
//         if (item?.corporateKyc?.custInfoGender == "MALE") {
//           this.MaleChecked.setValue(true);
//         }
//         if (item?.corporateKyc?.custInfoGender == "FEMALE") {
//           this.FemaleChecked.setValue(true);
//         }
//         //risk&watch
//         //risk
//         if (item?.corporateKyc?.riskCategory == "LOW") {
//           this.riskLow.setValue(true);
//         }
//         if (item?.corporateKyc?.riskCategory == "MEDIUM") {
//           this.riskMedium.setValue(true);
//         }
//         if (item?.corporateKyc?.riskCategory == "HIGH") {
//           this.riskHigh.setValue(true);
//         }
//         //watchlist
//         if (item?.corporateKyc?.checkedWatchlist) {
//           this.watchYes.setValue(true);
//           this.watchNo.setValue(false);
//         }
//         else if (!item?.corporateKyc?.checkedWatchlist && item?.corporateKyc?.checkedWatchlist != null) {
//           this.watchYes.setValue(false);
//           this.watchNo.setValue(true);
//         }
//         else {
//           this.watchYes.setValue(false);
//           this.watchNo.setValue(false);
//         }
//         //doc
//         if (item.corporateKyc.validLicenseNo) {
//           this.licenseNoo.setValue(true);
//         }
//         if (item.corporateKyc.validLicenseYes) {
//           this.licenseYes.setValue(true);
//         }
//         if (item.corporateKyc.validPassportNo) {
//           this.passNo.setValue(true);
//         }
//         if (item.corporateKyc.validPassportYes) {
//           this.passYes.setValue(true);
//         }
//         if (item.corporateKyc.validSignatoryNo) {
//           this.signNo.setValue(true);
//         }
//         if (item.corporateKyc.validSignatoryYes) {
//           this.signYes.setValue(true);
//         }
//         if (item.corporateKyc.validAssociationNo) {
//           this.articleNo.setValue(true);
//         }
//         if (item.corporateKyc.validAssociationYes) {
//           this.articleYes.setValue(true);
//         }
//         if (item.corporateKyc.validResolutionNo) {
//           this.ResNo.setValue(true);
//         }
//         if (item.corporateKyc.validResolutionYes) {
//           this.ResYes.setValue(true);
//         }
//         if (item.corporateKyc.validPowerOfAttNo) {
//           this.powerNo.setValue(true);
//         }
//         if (item.corporateKyc.validPowerOfAttYes) {
//           this.powerYes.setValue(true);
//         }
//         //havemno
//         if (item.corporateKyc.otherMnoNo) {
//           this.mnoNo.setValue(true);
//         }
//         if (item.corporateKyc.otherMnoYes) {
//           this.mnoYes.setValue(true);
//         }
//         //NEW
//         this.taskiraPhotoFront = item?.corporateKyc?.contactIdProofFrontPhoto;
//         this.taskiraPhotoBack = item?.cocukrporateKyc?.contactIdProofBackPhoto;
//         this.contactPersonSign = item?.corporateKyc?.contactSignaturePhoto;

//         this.businessLicensePhoto = item?.corporateKyc?.bizLicensePhoto;
//         this.cmpnyAddressProofFront = item?.corporateKyc?.addressProofPhoto;
//         // this.cmpnyAddressProofBack = item?.corporateKyc?.idProofBackPhoto;

//         this.shareholderPassportPhotoFront = item?.corporateKyc?.shareholders?.idProofFrontPhoto;
//         this.shareholderPassportPhotoBack = item?.corporateKyc?.shareholders?.idProofBackPhoto;

//         this.AuthorizedSignPhotoFront = item?.corporateKyc?.signatoryPhoto;
//         this.AuthorizedSignPhotoBack = item?.corporateKyc?.signatoryIdProofBackPhoto;
//         this.AuthorizedSignTaskiraPhoto = item?.corporateKyc?.signatoryIdProofFrontPhoto;
//         this.powerPhoto = item?.corporateKyc?.authorizationLetterPhoto;
//         this.DigitalSign = item?.corporateKyc?.signatorySignature;

//         //NEW
//         this.superImg = item?.corporateKyc?.signatories[0].signatoryPhoto;
//         this.presidentSign = item?.corporateKyc?.prezSign_img_1;
//         // this.agentVerifySign = item?.corporateKyc?.superSign_img_1;
//         this.vicePresSign = item?.corporateKyc?.vicePrezSign_img_1;

//         if (this.readOnly) {
//           this.FemaleChecked.disable();
//           this.MaleChecked.disable();
//         }
//         if (item?.corporateKyc?.signatories[0].signatoryPhoto) {
//           this.superImg = item?.corporateKyc?.signatories[0].signatoryPhoto;
//           this.fileLists.push({
//             name: 'Corportate Profile Picture',
//             url: this.imageUrl + '/kyc/static/' + this.superImg
//             // url: this.imageUrl + '/um/static/profile/' + this.superImg
//           })
//         }

//         console.log("Files", this.fileLists);
//         //new patchvalue
//         // this.setFieldValue('accTitle', item?.corporateKyc?.companyName);
//         // this.setFieldValue('MMwallet', item?.corporateKyc?.companyWalletNumber);
//         // this.setFieldValue('accOpenDate', item?.corporateKyc?.companyAccOpenDate);
//         // this.setFieldValue('contactPerName', item?.corporateKyc?.contactPersonName);
//         // this.setFieldValue('contactPerDesignation', item?.corporateKyc?.contactPersonDesignation);
//         // this.setFieldValue('NoOfShareHolder', item?.corporateKyc?.companyNoOfShareholders);

//         // this.setFieldValue('licenseNo', item?.corporateKyc?.bizLicenseNumber);
//         // this.setFieldValue('licenseAuth', item?.corporateKyc?.bizLicenseAuthority);
//         // this.setFieldValue('issueDate', item?.corporateKyc?.bizLicenseDateOfIssue);
//         // this.setFieldValue('expiryDate', item?.corporateKyc?.bizLicenseDateOfExpiry);
//         // this.setFieldValue('tinNo', item?.corporateKyc?.bizLicenseTinNumber);
//         // this.setFieldValue('businessName', item?.corporateKyc?.bizName);

//         // this.setFieldValue('grossAnnualIncome', item?.corporateKyc?.natureOfBiz);
//         // this.setFieldValue('monthlyIncome', item?.corporateKyc?.monthlyIncome);
//         // this.setFieldValue('netWorth', item?.corporateKyc?.netWorth);
//         // this.setFieldValue('fundSrc', item?.corporateKyc?.sourceOfFund);
//         // this.setFieldValue('monthlyTurnover', item?.corporateKyc?.monthlyTurnover);
//         // this.setFieldValue('cmpnyLoc', item?.corporateKyc?.companyLocation);
//         // this.setFieldValue('streetNo', item?.corporateKyc?.companyStreet);
//         // this.setFieldValue('houseNo', item?.corporateKyc?.companyHouseNumber);
//         // this.setFieldValue('district', item?.corporateKyc?.companyDistrict);
//         // this.setFieldValue('province', item?.corporateKyc?.companyProvince);
//         // this.setFieldValue('country', item?.corporateKyc?.companyCountry);
//         // this.setFieldValue('offPhNo', item?.corporateKyc?.companyOfficePhone);
//         // this.setFieldValue('cmpnyEmail', item?.corporateKyc?.companyEmail);

//         // this.setFieldValue('firstName', item?.corporateKyc?.shareholders?.firstName);
//         // this.setFieldValue('lastName', item?.corporateKyc?.shareholders?.lastName);
//         // this.setFieldValue('fatherName', item?.corporateKyc?.shareholders?.fatherName);
//         // this.setFieldValue('tazkira', item?.corporateKyc?.shareholders?.idProofNumber);
//         // this.setFieldValue('dob', item?.corporateKyc?.shareholders?.dob);
//         // this.setFieldValue('birthPlace', item?.corporateKyc?.shareholders?.placeOfBirth);
//         // this.setFieldValue('Nationality', item?.corporateKyc?.shareholders?.nationality);
//         // this.setFieldValue('shareholderIncome', item?.corporateKyc?.shareholders?.monthlyIncome);
//         // this.setFieldValue('shareholderPerc', item?.corporateKyc?.shareholders?.shareholdingPercentage);
//         // this.setFieldValue('otherSrc', item?.corporateKyc?.shareholders?.sourceOfIncome);
//         // this.setFieldValue('shareholderRelation', item?.corporateKyc?.shareholders?.relationship);
//         // this.setFieldValue('shareholderPh', item?.corporateKyc?.shareholders?.phone);
//         // this.setFieldValue('shareholderTin', item?.corporateKyc?.shareholders?.tinNumber);

//         // this.setFieldValue('shareCurrLoc', item?.corporateKyc?.shareholders?.currLocation);
//         // this.setFieldValue('shareCurrDis', item?.corporateKyc?.shareholders?.currDistrict);
//         // this.setFieldValue('shareCurrPro', item?.corporateKyc?.shareholders?.currProvince);
//         // this.setFieldValue('shareCurrCount', item?.corporateKyc?.shareholders?.currCountry);

//         // this.setFieldValue('sharePerLoc', item?.corporateKyc?.shareholders?.permLocation);
//         // this.setFieldValue('sharePerDis', item?.corporateKyc?.shareholders?.permDistrict);
//         // this.setFieldValue('sharePerPro', item?.corporateKyc?.shareholders?.permProvince);
//         // this.setFieldValue('sharePerCount', item?.corporateKyc?.shareholders?.permCountry);

//         // this.setFieldValue('firstNameAuth', item?.corporateKyc?.signatoryFirstName);
//         // this.setFieldValue('lastNameAuth', item?.corporateKyc?.signatoryLastName);
//         // this.setFieldValue('tazkiraAuth', item?.corporateKyc?.signatoryIdProofNumber);
//         // this.setFieldValue('dobAuth', item?.corporateKyc?.signatoryDOB);

//         // this.setFieldValue('birthPlaceAuth', item?.corporateKyc?.signatoryPlaceOfBirth);
//         // this.setFieldValue('NationalityAuth', item?.corporateKyc?.signatoryNationality);
//         // this.setFieldValue('designationAuth', item?.corporateKyc?.signatoryDesignation);
//         // this.setFieldValue('resiAuth', item?.corporateKyc?.signatoryResidentAddress);
//         // this.setFieldValue('phAuth', item?.corporateKyc?.signatoryPhone);
//         // this.setFieldValue('srcAuth', item?.corporateKyc?.signatorySourceOfIncome);
//         // this.setFieldValue('incomeAuth', item?.corporateKyc?.signatoryMonthlyIncome);
//         // this.setFieldValue('typeAuth', item?.corporateKyc?.signatoryType);

//         // this.setFieldValue('presidentName', item?.corporateKyc?.not);
//         // this.setFieldValue('presidentDate', item?.corporateKyc?.not);
//         // this.setFieldValue('V_presidentName', item?.corporateKyc?.not);
//         // this.setFieldValue('V_presidentDate', item?.corporateKyc?.not);
//         //old patchvalue
//         this.dobValue = item?.corporateKyc?.signatoryDOB
//         this.firstNameValue = item?.corporateKyc?.signatoryFirstName;
//         this.superAgentForm.patchValue({ accTitle: item?.corporateKyc?.companyName || 'NIL' })
//         this.superAgentForm.patchValue({ MMwallet: item?.corporateKyc?.companyWalletNumber || 'NIL' })
//         this.superAgentForm.patchValue({ accOpenDate: item?.corporateKyc?.companyAccOpenDate || 'NIL' })
//         this.superAgentForm.patchValue({ contactPerName: item?.corporateKyc?.contactPersonName || 'NIL' })
//         this.superAgentForm.patchValue({ contactPerDesignation: item?.corporateKyc?.contactPersonDesignation || 'NIL' })
//         this.superAgentForm.patchValue({ NoOfShareHolder: item?.corporateKyc?.companyNoOfShareholders || 'NIL' })
//         this.superAgentForm.patchValue({ licenseNo: item?.corporateKyc?.bizLicenseNumber || 'NIL' })
//         this.superAgentForm.patchValue({ licenseAuth: item?.corporateKyc?.bizLicenseAuthority || 'NIL' })
//         this.superAgentForm.patchValue({ issueDate: item?.corporateKyc?.bizLicenseDateOfIssue || 'NIL' })
//         this.superAgentForm.patchValue({ expiryDate: item?.corporateKyc?.bizLicenseDateOfExpiry || 'NIL' })

//         this.superAgentForm.patchValue({ tinNo: item?.corporateKyc?.bizLicenseTinNumber || 'NIL' })
//         this.superAgentForm.patchValue({ businessName: item?.corporateKyc?.bizName || 'NIL' })
//         this.superAgentForm.patchValue({ grossAnnualIncome: item?.corporateKyc?.natureOfBiz || 'NIL' })
//         // this.superAgentForm.patchValue({ monthlyIncome: item?.corporateKyc?.monthlyIncome || 'NIL' })
//         this.superAgentForm.patchValue({
//           monthlyIncome: item?.corporateKyc?.monthlyIncome
//             ? `AFN ${this.formatNumber(item.corporateKyc.monthlyIncome)}`
//             : 'NIL'
//         });
//         // this.superAgentForm.patchValue({ netWorth: item?.corporateKyc?.netWorth || 'NIL' })
//         this.superAgentForm.patchValue({
//           netWorth: item?.corporateKyc?.netWorth
//             ? `AFN ${this.formatNumber(item.corporateKyc.netWorth)}`
//             : 'NIL'
//         });
//         this.superAgentForm.patchValue({ fundSrc: item?.corporateKyc?.sourceOfFund || 'NIL' })
//         // this.superAgentForm.patchValue({ monthlyTurnover: item?.corporateKyc?.monthlyTurnover || 'NIL' })
//         this.superAgentForm.patchValue({
//           monthlyTurnover: item?.corporateKyc?.monthlyTurnover
//             ? `AFN ${this.formatNumber(item.corporateKyc.monthlyTurnover)}`
//             : 'NIL'
//         });
//         this.superAgentForm.patchValue({ cmpnyLoc: item?.corporateKyc?.companyLocation || 'NIL' })
//         this.superAgentForm.patchValue({ streetNo: item?.corporateKyc?.companyStreet || 'NIL' })
//         this.superAgentForm.patchValue({ houseNo: item?.corporateKyc?.companyHouseNumber || 'NIL' })
//         this.superAgentForm.patchValue({ district: item?.corporateKyc?.companyDistrict || 'NIL' })
//         this.superAgentForm.patchValue({ province: item?.corporateKyc?.companyProvince || 'NIL' })
//         this.superAgentForm.patchValue({ country: item?.corporateKyc?.companyCountry || 'NIL' })
//         this.superAgentForm.patchValue({ offPhNo: item?.corporateKyc?.companyOfficePhone || 'NIL' })
//         this.superAgentForm.patchValue({ cmpnyEmail: item?.corporateKyc?.companyEmail || 'NIL' })

//         this.superAgentForm.patchValue({ firstName: item?.corporateKyc?.shareholders?.firstName || 'NIL' })
//         this.superAgentForm.patchValue({ lastName: item?.corporateKyc?.shareholders?.lastName || 'NIL' })
//         this.superAgentForm.patchValue({ fatherName: item?.corporateKyc?.shareholders?.fatherName || 'NIL' })
//         this.superAgentForm.patchValue({ tazkira: item?.corporateKyc?.shareholders?.idProofNumber || 'NIL' })
//         this.superAgentForm.patchValue({ dob: item?.corporateKyc?.shareholders?.dob || 'NIL' })
//         this.superAgentForm.patchValue({ birthPlace: item?.corporateKyc?.shareholders?.placeOfBirth || 'NIL' })
//         this.superAgentForm.patchValue({ Nationality: item?.corporateKyc?.shareholders?.nationality || 'NIL' })
//         this.superAgentForm.patchValue({ shareholderIncome: item?.corporateKyc?.shareholders?.monthlyIncome || 'NIL' })
//         this.superAgentForm.patchValue({ shareholderPerc: item?.corporateKyc?.shareholders?.shareholdingPercentage || 'NIL' })
//         this.superAgentForm.patchValue({ otherSrc: item?.corporateKyc?.shareholders?.sourceOfIncome || 'NIL' })
//         this.superAgentForm.patchValue({ shareholderRelation: item?.corporateKyc?.shareholders?.relationship || 'NIL' })
//         this.superAgentForm.patchValue({ shareholderPh: item?.corporateKyc?.shareholders?.phone || 'NIL' })
//         this.superAgentForm.patchValue({ shareholderTin: item?.corporateKyc?.shareholders?.tinNumber || 'NIL' })

//         this.superAgentForm.patchValue({ shareCurrLoc: item?.corporateKyc?.shareholders?.currLocation || 'NIL' })
//         this.superAgentForm.patchValue({ shareCurrDis: item?.corporateKyc?.shareholders?.currDistrict || 'NIL' })
//         this.superAgentForm.patchValue({ shareCurrPro: item?.corporateKyc?.shareholders?.currProvince || 'NIL' })
//         this.superAgentForm.patchValue({ shareCurrCount: item?.corporateKyc?.shareholders?.currCountry || 'NIL' })

//         this.superAgentForm.patchValue({ sharePerLoc: item?.corporateKyc?.shareholders?.permLocation || 'NIL' })
//         this.superAgentForm.patchValue({ sharePerDis: item?.corporateKyc?.shareholders?.permDistrict || 'NIL' })
//         this.superAgentForm.patchValue({ sharePerPro: item?.corporateKyc?.shareholders?.permProvince || 'NIL' })
//         this.superAgentForm.patchValue({ sharePerCount: item?.corporateKyc?.shareholders?.permCountry || 'NIL' })

//         this.superAgentForm.patchValue({ firstNameAuth: item?.corporateKyc?.signatoryFirstName || 'NIL' })
//         this.superAgentForm.patchValue({ lastNameAuth: item?.corporateKyc?.signatoryLastName || 'NIL' })
//         this.superAgentForm.patchValue({ tazkiraAuth: item?.corporateKyc?.signatoryIdProofNumber || 'NIL' })
//         this.superAgentForm.patchValue({ dobAuth: item?.corporateKyc?.signatoryDOB || 'NIL' })
//         this.superAgentForm.patchValue({ birthPlaceAuth: item?.corporateKyc?.signatoryPlaceOfBirth || 'NIL' })
//         this.superAgentForm.patchValue({ NationalityAuth: item?.corporateKyc?.signatoryNationality || 'NIL' })
//         console.log("signatoryNationality", item?.corporateKyc?.signatoryNationality)
//         this.superAgentForm.patchValue({ designationAuth: item?.corporateKyc?.signatoryDesignation || 'NIL' })
//         this.superAgentForm.patchValue({ resiAuth: item?.corporateKyc?.signatoryResidentAddress || 'NIL' })
//         this.superAgentForm.patchValue({ phAuth: item?.corporateKyc?.signatoryPhone || 'NIL' })
//         this.superAgentForm.patchValue({ srcAuth: item?.corporateKyc?.signatorySourceOfIncome || 'NIL' })
//         this.superAgentForm.patchValue({ incomeAuth: item?.corporateKyc?.signatoryMonthlyIncome || 'NIL' })
//         this.superAgentForm.patchValue({ typeAuth: item?.corporateKyc?.signatoryType || 'NIL' })

//         this.superAgentForm.patchValue({ presidentName: item?.corporateKyc?.not || 'NIL' })
//         this.superAgentForm.patchValue({ presidentDate: item?.corporateKyc?.not || 'NIL' })
//         this.superAgentForm.patchValue({ V_presidentName: item?.corporateKyc?.not || 'NIL' })
//         this.superAgentForm.patchValue({ V_presidentDate: item?.corporateKyc?.not || 'NIL' })

//         this.superAgentForm.patchValue({ KycProcessed: item?.corporateKyc?.kycProcessedBy || 'NIL' })
//         this.superAgentForm.patchValue({ KycProcessedDate: item?.corporateKyc?.kycProcessedDate || 'NIL' })
//         this.superAgentForm.patchValue({ Verified: item?.corporateKyc?.verifiedByOps || 'NIL' })
//         this.superAgentForm.patchValue({ VerifiedDate: item?.corporateKyc?.verifiedByOpsDate || 'NIL' })
//         this.superAgentForm.patchValue({ Compliance: item?.corporateKyc?.approvedByCompliance || 'NIL' })
//         this.superAgentForm.patchValue({ ComplianceDate: item?.corporateKyc?.approvedByComplianceDate || 'NIL' })
//         //old patchvalue

//         this.PresidentName = item?.corporateKyc?.undertakenPrezName;
//         this.Date = item?.corporateKyc?.undertakenPrezDate;
//         this.VPresidentName = item?.corporateKyc?.custInfoFirstName;
//         this.VDate = item?.corporateKyc?.custInfoFatherName;

//         //abmmc verify
//         this.firstNameValue = item?.submittedFor?.firstName
//         this.kycProcessed = item?.submittedFor?.firstName + ' ' + item?.submittedFor?.lastName;
//         this.kycProcessedDate = item?.corporateKyc?.kycProcessedDate;
//         this.VerifiedOp = item?.corporateKyc?.custInfoFirstName;
//         this.VerifiedOpDate = item?.corporateKyc?.custInfoFatherName;
//         this.compliance = item?.corporateKyc?.custInfoFirstName;
//         this.complianceDate = item?.corporateKyc?.custInfoFirstName;


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