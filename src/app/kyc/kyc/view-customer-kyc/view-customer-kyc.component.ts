import { Component, ElementRef, ViewChild, Renderer2, OnInit, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormRecord, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { KycModuleService } from '../kyc-module.service';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../toast.service';
import { finalize, takeLast } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserManagementService } from '../../../user-management/user-management/user-management/openapi';
import { saveAs } from 'file-saver';
import { UserService } from '../../../user-management/user-management/user-management/user.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CorporateService } from '../../../corporate/corporate.service';
import { SharedFunctionsService } from '../../../shared-functions.service';
import { PermissionService } from '../../../permission.service';

// import 'jspdf-autotable';
interface fileList {
  name: string,
  url: any
}
interface NewImageFile {
  name: string;
  url: any;
}
@Component({
  selector: 'app-view-customer-kyc',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule,
    NgFor, NgIf, NgClass, CommonModule, MatIconModule],
  templateUrl: './view-customer-kyc.component.html',
  styleUrl: './view-customer-kyc.component.css'
})

export class ViewCustomerKycComponent implements OnInit {
  // @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('content') content!: ElementRef;
  @ViewChild('firstNameEdit') firstNameEdit!: ElementRef<HTMLInputElement>;
  @ViewChild('lastNameEdit') lastNameEdit!: ElementRef<HTMLInputElement>;

  isLowDisabled = true;
  isMediumDisabled = true;
  isHighDisabled = true;
  regPhone !: string;
  showEditPhoneInput: boolean = false;
  showEditEmailInput: boolean = false;
  reg_Email !: string;
  phoneTouched: boolean = false;
  emailTouched: boolean = false;
  //non afghan new
  showProvinceTextbox: boolean = false;
  showCurrProvinceDrop: boolean = true;
  showCurrProvinceTextbox: boolean = false;
  showPerProvinceTextbox: boolean = false;
  showPerProvinceDrop: boolean = true;
  showCurrDistrictTextbox: boolean=false;
  showCurrDistrictDrop: boolean=true;
  showPerDistrictDrop: boolean=true;
  showPerDistrictTextbox: boolean=false;
  viewOnly: boolean = false;

  get isPhoneInvalid(): boolean {
    return !/^7[0-9]{8}$/.test(this.regPhone1 ?? '');
  }

  get isEmailInvalid(): boolean {
    return !/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(this.reg_Email ?? '');
  }

  isEditing: boolean = false;
  isEditingLast: boolean = false;
  isEditingGender: boolean = false;
  customerForm: FormGroup = new FormGroup({});
  refundForm: FormGroup = new FormGroup({});

  compForm: FormGroup = new FormGroup({});
  regForm: FormGroup = new FormGroup({});
  modifiedForm: FormGroup = new FormGroup({});
  regInput: FormControl = new FormControl();
  regDateInput: FormControl = new FormControl();

  remarkForm: FormGroup = new FormGroup({});
  remark: FormControl = new FormControl('', Validators.required);
  ComplianceInput: FormControl = new FormControl();
  ComplianceDateInput: FormControl = new FormControl();

  readOnly: boolean = false;
  fileLists: fileList[] = [];
  newImageFileLists: NewImageFile[] = [];
  // this.newImageFileLists = [];

  alertMessage: string | null = null;
  alertType: 'success' | 'error' = 'success';
  rejectreasonForm!: FormGroup;
  reason = new FormControl('', Validators.required);
  MaleChecked = new FormControl();
  FemaleChecked = new FormControl();
  married = new FormControl();
  single = new FormControl();
  riskLow = new FormControl(false);
  riskMedium = new FormControl(false);
  riskHigh = new FormControl(false);
  watchYes = new FormControl();
  watchNo = new FormControl();

  maritalText = new FormControl();
  genderText = new FormControl();
  KycProcessedInput = new FormControl();
  KycProcessedDateInput = new FormControl();
  agentVerify = new FormControl();
  agentVerifyDate = new FormControl();
  VerifiedInput = new FormControl();
  VerifiedDateInput = new FormControl();
  // remark = new FormControl();
  // ComplianceInput = new FormControl();
  // ComplianceDateInput = new FormControl();

  rejectReasonRequired: boolean = true;
  users: any;
  photoId: any;
  CustomerfirstName: any;
  CustomerMiddleName: any;
  CustomerSurName: any;
  CustomerFathername: any;
  CustomerDob: any;
  CustomerBirthPlace: any;
  CustomerNationality: any;
  CustomerTazkira: any;
  CustomerIssue: any;
  CustomerExpiry: any;
  CustomerWallet: any;
  CustomerAccountOpenDate: any;
  CustomerGender: any;
  CustomerMarital: any;
  CustomerContact: any;
  CustomerEmail: any;
  CustomerTurnover: any;
  CustomerPurpose: any;
  CustomerHouse: any;
  CustomerLocation: any;
  CustomerProvince: any;
  CustomerStreet: any;
  CustomerDistrict: any;
  CustomerCountry: any;
  CustomerPermanentHouseNo: any;
  CustomerPermanentLocation: any;
  CustomerPermanentProvince: any;
  CustomerPermanentStreet: any;
  CustomerPermanentDistrict: any;
  CustomerPermanentCountry: any;
  customeremploymentType: any;
  CustomerSource: any;
  CustomerPosition: any;
  CustomerService: any;
  CustomerMonthlyIncome: any;
  CustomerProfTurnover: any;
  CustomerProfPurpose: any;
  CustomerProfTin: any;
  CustomerKINname: any;
  CustomerKINfatherName: any;
  CustomerRelationship: any;
  CustomerKINmobile: any;
  CustomerApplicant: any;
  CustomerApplicantDate: any;
  CustomerAgentName: any;
  CustomerLicense: any;
  CustomerAgentLocation: any;
  CustomerPOSno: any;
  CustomerPTIDAgentVerify: any;
  CustomerICCIDAgentVerify: any;
  CustomerKYCProcessedBy: any;
  CustomerKYCDate: any;
  CustomerAgentVerification: any;
  CustomerAgentVerifiedDate: any;
  CustomerVerified: any;
  CustomerVerifiedDate: any;
  CustomerCompliance: any;
  CustomerComplianceDate: any;
  riskReq!: string;
  watchListReq: boolean = false;
  products: any;
  showError: boolean = false;
  page: any;
  watchListValue: any;
  remarkValue: any;
  riskValue: any;
  req: any
  kycId: any;
  allCustomers: any;
  walletaccounts: any;
  productId: any;
  masterProduct!: string;
  undertakenSign: any;
  imageUrl = environment.apiUrl;
  // imageUrl = "http://192.168.0.195:8080"

  isButtonDisabled: boolean = false;
  CustomerImg: any;
  kinEmail: any;
  kinHouse: any;
  kinLocation: any;
  kinProvince: any;
  kinStreet: any;
  kinDistrict: any;
  kinCountry: any;

  middleName: any
  // editProfile: boolean = false;
  uploadedImageUndertaken: any;
  uploadedImageFileName: any;
  uploadedImageFileType1: any;
  uploadedImageFileNameExtension: any;
  uploadedImageFileData: any;
  compSign: any;
  kycSign: any;
  agentVerifySign: any;
  opSign: any;
  uploadedImageKycSign: any;
  uploadedImageAgentVerifySign: any;
  uploadedImageOpSign: any;
  uploadedImageCompSign: any;
  type: any;
  uploadedImage: any;
  uploadedImageFile0: any;
  uploadedImageFileType0: any;
  uploadedImageFileNameExtension0: any;
  uploadedImageFileData0: any;
  showUpdate: boolean = false;
  userName!: string | null;
  UserEmail: any;
  allUsers: any[] = [];
  userPrivileges: any;
  kycPrivelege: any;
  isLoading: boolean = false;
  sdnDetails: any;
  showModal: boolean = false;
  activeFlag: boolean = false;
  deletedFlag: boolean = false;
  kycType: any;
  kycStatus: any;
  // showRejectButton: boolean = false;
  // showApproveButton: boolean = false;
  // showUpdateButton: boolean = false;
  isRiskChecked: boolean = false;
  isSdnChecked: boolean = false;

  userStatus: any;
  customer: any;
  customerId: any;

  isLowSelected = false;
  isMediumOrHighSelected = false;
  isWatchlistDisabled = false;
  seqNo: any;
  data: any;
  allData: any[] = [];
  watchlistRemark: any;
  uploadedImageKycSignName: any;
  uploadedImageAgentVerifySignName: any;
  uploadedImageOpSignName: any;
  uploadedImageCompSignName: any;
  typeOp: any;
  CustomerLastName: any;
  showdigitalModal: boolean = false;
  showRiskModal: boolean = false;
  riskDetails: any;
  watchlistRemarksVal: any;
  submittedForId: any;
  kycVal: any;
  kycProcessedDateVal: any;
  agentVerifyVal: any;
  agentVerifyDateVal: any;
  VerifiedVal: any;
  VerifiedDateVal: any;
  ComplianceVal: any;
  ComplianceDateVal: any;
  showAbmmcHigh: boolean = false;
  showAbmmcLowMed: boolean = true;

  uploadedImageCompHeadSign: any;
  uploadedImageCompHeadSignName: any;
  uploadedImageCEOSign: any;
  uploadedImageCEOSignName: any;
  uploadedImageAttachmentName: any;

  approveStatus: any;
  showApprove1Btn: boolean = false;
  showApprove2Btn: boolean = false;
  showApproveFinalBtn: boolean = false;
  currentDate: any;
  riskHighValue: any;
  riskChecked: boolean = false;
  sdnChecked: boolean = false;
  selectedRisk: string = '';
  selectedWatchlist: any = '';
  kycData: any;
  approvedByCompliance: any;
  rejectReasonValue: any;
  approvedByComplianceValue: any;
  compHeadSign: any;
  ceoSign: any;
  compHedSign: any;
  addressList: any;
  showSdnAndRiskView: boolean = false;
  sdnView: any
  riskMediumCheck: any;
  riskLowCheck: any;
  riskhighCheck: any;
  prooftype!: string;
  disabledRisk: boolean = false;
  dobValue: any;
  searchResults: any;
  noDataRisk: boolean = false;
  DataRisk: boolean = false;
  noDataSdn: boolean = false;
  DataSdn: boolean = false;
  riskTierValue: any;
  riskTarget: any;
  watchTarget: boolean = false;
  custProofType: any;
  ProofType: any;
  approvedByComplianceDateValue: any;
  profileDetails: any;
  loginUser: any;
  item: any;
  custProofFrontPhoto: any;
  custSignaturePhoto: any;
  custProofBackPhoto: any;
  newFile: any;
  regBySign: any
  newFileProfile: any;
  newComp: any;
  newCompHead: any;
  newCeo: any
  opsSignaturePhoto: any;
  previousRoute: any;
  firstNameOrginal: any;
  lastNameOrginal: any;
  newGender: any;
  showPerCountryAddress: boolean = false;
  showCountryDrop: boolean = false;
  showProvinceDrop: boolean = false;
  showDistrictDrop: boolean = false;
  countryNameCur: any;
  countryNamePer: any;
  nationalities: any;
  provinceId: any;
  provinces: any;
  districts: any;
  showDistrictText: boolean = true;
  showProvinceText: boolean = true;
  showCountryText: boolean = true;
  selectedProvinceName: any;
  provinceIdCur: any;
  provinceIdPer: any;
  selectedProvincePer: any;
  selectedProvinceCur: any;
  provincePerTarget: any;
  provinceCurTarget: any;
  countryCurReq: any;
  countryPerReq: any;
  districtsCur: any;
  districtsPer: any;
  provinceCurReq: any;
  provincePerReq: any;
  districtPerReq: any;
  districtCurReq: any;
  custGender: string = '';
  custMarital: string = '';
  selectedGender: any
  selectedStatus: any
  userType: any;
  regName: any;
  regDate: any;
  showRegUsertypeAgent: boolean = false;
  showRegUsertypeOP: boolean = false;
  showRegSection: boolean = false;
  showRegUsertypeCustomer: boolean = false;
  BirthProvince: any;
  BirthProvinceValue: any;
  BirthCountryValue: any;
  BirthProvinceTarget: any;
  provincesBirth: any;
  showBirthCountryText: boolean = true;
  showBirthCountryDrop: boolean = false;
  showBirthProvinceText: boolean = true;
  showBirthProvinceDrop: boolean = false;
  age: any;
  showNationalityDrop: boolean = false;
  showNationalityText: boolean = true;
  birthCountryReq: any;
  birthProvinceReq: any;
  nationalityReq: any;
  formattedTurnover: string = '';
  formattedSalary: string = '';
  formattedIncome: string = '';
  rawValueTurnover: any;
  rawValueIncome: any;
  sourceOfIncomeReq: any;
  showSourceText: boolean = true;
  showSourceDrop: boolean = false;
  natureReq: any;
  showNatureDrop: boolean = false;
  showNatureText: boolean = true;
  natureOfBusinessData: any;
  incomeSourceData: any;
  purposeOfAccReq: any;
  accPurposeData: any;
  showPurposeDrop: boolean = false;
  showPurposeText: boolean = true;
  uploadedImageRegSign: any;
  uploadedImageRegSignName: any;
  MMwallet: any;
  otherdocsorNot: any;
  kycLocked: boolean = false;
  regSign: any;
  regEmail: any;
  modifiedName: any;
  modifiedEmail: any;
  modifiedDate: any;
  firstNameNew: any;
  provincesPer: any[] = [];
  provincesCur: any[] = [];
  isUpdateChecked = false;
  editingIndex: number | null = null;
  showUpdateBtn: boolean = false;
  baseImageUrl: any;
  phoneErrorReg: boolean = false;
  showIdExist: boolean = false;
  emailError: boolean = false;
  updatedByName: any;
  updatedByEmail: any;
  updatedOn: any;
  idToSend: any;
  customerProfile: any;
  regPhone1: any;
  phoneEditComments: string = '';
  emailEditComments: string = '';
  phoneFileName: string = '';
  emailFileName: string = '';
  phoneFileSelected: File | null = null;
  emailFileSelected: File | null = null;
  phoneEmailRequestId: number | null = null;

  constructor(private renderer: Renderer2,
    private sharedFunctionsService: SharedFunctionsService,
    private fb: FormBuilder,
    private KycService: KycModuleService,
    private userService: UserService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private userManagemantService: UserManagementService,
    private corporateService: CorporateService,
    private router: Router, private permissionService: PermissionService) {
    this.refundForm = this.fb.group({
      digitalKey: ['', Validators.required], // Assuming batchId is required
    });
    // const batchIdValue = this.refundForm.get('digitalKey')?.value;
    this.permissionService.hideSidebar = false;
  }
  /*  files = [
     { name: 'Customer Profile pic', url: 'https://example.com/image.jpg', type: 'image' },
     { name: 'PDF File', url: 'https://example.com/document.pdf', type: 'pdf' },
   ]; */
  ngOnInit(): void {
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
      console.log("FROM URL:", this.previousRoute)
      this.viewOnly = params['viewOnly'] === 'true';
    });
    // if (this.previousRoute == '/kyc/kyc-edit-requests') {
    //   this.getAllEditKycRequests();
    // }
    // this.firstNameNew=this.item.newValues?.
    this.firstNameNew = this.item?.seqNo
    this.kycId = this.item?.id;
    this.userStatus = this.item?.status;
    this.KycService.getProfileDetails().subscribe((data: any) => {
      this.profileDetails = data?.data
      this.loginUser = this.profileDetails?.firstName + ' ' + this.profileDetails?.lastName
      console.log("this.loginUser", this.loginUser)
      // this.CustomerImg = this.profileDetails?.profilePic;
      // console.log("this.CustomerImg", this.CustomerImg)

      this.approvedByComplianceValue = this.item?.customerKyc?.approvedByComplianceFullName
      // this.approvedByComplianceValue = this.item?.customerKyc?.approvedBy?.name
      console.log("approvedByComplianceFullName", this.approvedByComplianceValue)
      this.approvedByComplianceDateValue = this.item?.customerKyc?.approvedByComplianceDate
      // this.approvedByComplianceDateValue = this.item?.customerKyc?.approvedBy?.date
      console.log("approvedByComplianceDateValue", this.approvedByComplianceDateValue)
      if (this.userStatus === 'IN_REVIEW' ||
        this.userStatus === 'VERIFIED_L1' || this.userStatus === 'VERIFIED_L2'
      ) {
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
    // this.ComplianceDateInput.setValue(this.currentDate);
    this.compForm.get('ComplianceDateInput')?.setValue(this.currentDate);

    this.customerForm.get('dob')?.valueChanges.subscribe(() => {
      console.log("dob changed", this.customerForm.get('dob'));
      this.onClickAge();  // Trigger the validation whenever the dob changes
    });

    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrivileges = this.userPrivileges[0];
      console.log(this.userPrivileges[0], "this.userPrevilages");
      console.log(this.userPrivileges, "this.userPrevilages1");

      for (let item of this.userPrivileges?.uiComponentPrivileges) {
        if (item?.component?.componentName == 'KYC') {
          if (item.subComponent?.subComponentName == 'All KYC')
            this.kycPrivelege = item;
        }
      }
    }
    // //new
    this.customerForm = this.fb.group({
      firstName: ['', [
        Validators.required, Validators.pattern(/^[a-zA-Z0-9 -]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 -]+$/)]],
      fatherName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]+$/)]],
      walletNO: ['', Validators.required],
      dob: ['', [Validators.required, this.sharedFunctionsService.ageValidator()]],
      altPh: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      nationality: ['', Validators.required],
      nationalityDrop: ['', Validators.required],
      birthCountry: ['', Validators.required],
      birthCountryDrop: ['', Validators.required],
      birthProvince: ['', Validators.required],
      birthProvinceDrop: ['', Validators.required],
      maritalText: ['', Validators.required],
      genderText: ['', Validators.required],

      idNO: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      issue: ['', [Validators.required, this.sharedFunctionsService.pastDateValidator()]],
      expiry: ['', [Validators.required, this.sharedFunctionsService.futureDateValidator()]],
      bookNo: ['', Validators.required],
      pageNo: ['', Validators.required],
      regNo: ['', Validators.required],
      custProofType: ['', Validators.required],
      //
      // firstNameNew: ['', [
      //   Validators.required, Validators.pattern(/^[a-zA-Z0-9 -]+$/)]],
      // lastNameNew: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 -]+$/)]],
      // fatherNameNew: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]+$/)]],
      // dobNew: ['', [Validators.required, this.ageValidator]],
      // altPhNew: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      // custProofTypeNew: ['', Validators.required],
      // birthCountryNew: ['', Validators.required],
      // birthProvinceNew: ['', Validators.required],
      // idNONew: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      // nationalityNew: ['', Validators.required],
      // issueNew: ['', Validators.required],
      // expiryNew: ['', Validators.required],
      // bookNoNew: ['', Validators.required],
      // genderNew: ['', Validators.required],
      // maritalNew: ['', Validators.required],
      // pageNoNew: ['', Validators.required],
      // regNoNew: ['', Validators.required],
      // emailNew: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],

      //
      houseNO: ['', Validators.required],
      loc: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
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

      //
      locNew: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      provinceNew: ['', Validators.required],
      districtNew: ['', Validators.required],
      countryNew: ['', Validators.required],
      perLocNew: ['', Validators.required],
      perProvinceNew: ['', Validators.required],
      perDistrictNew: ['', Validators.required],
      perCountryNew: ['', Validators.required],
      //

      countryAddress: ['', Validators.required],
      perCountryAddress: ['', Validators.required],
      provinceAddress: ['', Validators.required],
      permanentProvince: ['', Validators.required],
      districtAddress: ['', Validators.required],
      permanentDistrict: ['', Validators.required],
      //proffession
      employmentType: ['', Validators.required],
      natureofBusiness: ['', Validators.required],
      NatureDrop: ['', Validators.required],
      position: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      source: ['', Validators.required],
      incomeSourceOrg: ['', Validators.required],
      employerName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      income: ['', Validators.required],
      service: ['', Validators.required],
      turnover: ['', Validators.required],
      purpose: ['', Validators.required],
      PurposeDrop: ['', Validators.required],
      accOpenDate: ['', Validators.required],
      tin: ['', [Validators.pattern('^[0-9]+$')]],
      govtOrgName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      govtPosition: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      sourceOfFund: ['', Validators.required],
      //new values
      sourceNew: ['', Validators.required],
      employerNameNew: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      natureofBusinessNew: ['', Validators.required],
      positionNew: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      govtPositionNew: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      turnoverNew: ['', Validators.required],
      tinNew: ['', [Validators.pattern('^[0-9]+$')]],
      incomeNwew: ['', Validators.required],
      govtOrgNameNew: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      purposeNew: ['', Validators.required],
      //kin
      kinName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      kinMobile: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      kinFather: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      kinRelation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      kinAddress: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],

      kinEmail: ['', Validators.required],
      kinHouse: ['', Validators.required],
      kinProvince: ['', Validators.required],
      kinStreet: ['', Validators.required],
      kinDistrict: ['', Validators.required],
      kinCountry: ['', Validators.required],
      //customer verify
      agentLicense: ['', Validators.required],
      agentName: ['', Validators.required],
      agentPos: ['', Validators.required],
      agentLoc: ['', Validators.required],
      agentIccid: ['', Validators.required],
      agentPtid: ['', Validators.required],
      kyc: ['', Validators.required],
      kycDate: ['', Validators.required],
      agentVerify: ['', Validators.required],
      agentVerifyDate: ['', Validators.required],

      //abmmc verify
      opVerify: ['', Validators.required],
      opVerifyDate: ['', Validators.required],
      compVerify: ['', Validators.required],
      compVerifyDate: ['', Validators.required],

    });

    this.scrollToBottom();


    this.item = this.KycService.getItem();
    console.log("Received item new method:", this.item);
    this.KycService.lockKYCforMultipleAccess(this.item?.id).subscribe(response => {
      if (response?.responseCode != 200) {
        this.kycLocked = true;
      }
    })
    //instead getAllKyc
    this.regName = this.item?.submittedBy?.firstName + " " + this.item?.submittedBy?.lastName;
    this.regForm.get('regInput')?.setValue(this.regName);
    this.regEmail = this.item?.submittedBy?.email
    this.regDate = this.item?.customerKyc?.custInfoAccOpenDate;
    this.regForm.get('regDateInput')?.setValue(this.regDate);
    console.log("this.regName", this.regName)
    console.log("this.regDate", this.regDate)
    //modified By
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
    this.kycId = this.item?.id;
    console.log("kyc id of Received item:", this.item?.id);
    console.log("Extracted kycId:", this.kycId);
    this.userStatus = this.item?.status;

    this.seqNo = this.item?.seqNo;
    this.ProofType = this.item?.customerKyc?.custProofType
    console.log('ProofType :', this.ProofType);
    // if (this.item?.customerKyc?.attachments.length != 0) {
    //   let i = 1;
    //   for (let file of this.item.customerKyc.attachments) {
    //     this.fileLists.push({
    //       name: 'Attachment - ' + i,
    //       url: this.imageUrl + '/kyc/static/' + file
    //       // url: this.imageUrl + '/um/static/profile/' + file
    //     })
    //     i++;

    //   }
    // }
    //new
    if (this.item?.customerKyc?.otherDocs) {
      this.otherdocsorNot = this.item.customerKyc.otherDocs
      const otherDocsArray = this.item.customerKyc.otherDocs.split(',');
      let i = 1;
      for (let file of otherDocsArray) {
        this.fileLists.push({
          name: 'Other Document - ' + i,
          url: file,
          // url: `${this.imageUrl}/kyc/static/${file}`,
        });
        i++;
      }
    }
    //new
    // this.watchlistRemark = item?.customerKyc?.watchlistRemark
    //remark
    this.watchlistRemarksVal = this.item?.customerKyc?.watchlistRemarks
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

    this.rejectReasonValue = this.item?.rejectReason
    this.submittedForId = this.item?.submittedFor?.id

    this.customerId = this.item?.id;
    this.activeFlag = this.item?.submittedFor?.active;
    this.deletedFlag = this.item?.submittedFor?.deleted;

    // if (this.item?.status == 'IN_REVIEW' || 'APPROVED') {
    //   this.readOnly = true;
    // }
    // else
    /* Removing this part as Edit of Rejected KYC is a different screen now  if (this.item?.status == 'REJECTED') {
       this.readOnly = false;
     }
     else {
       this.readOnly = true;
 
     } */
    if (this.item?.customerKyc?.custInfoGender == "MALE") {
      this.MaleChecked.setValue(true);
    }
    if (this.item?.customerKyc?.custInfoGender == "FEMALE") {
      this.FemaleChecked.setValue(true);
    }
    if (this.item?.customerKyc?.custInfoMaritalStatus == "SINGLE") {
      this.single.setValue(true);
    }
    if (this.item?.customerKyc?.custInfoMaritalStatus == "MARRIED") {
      this.married.setValue(true);
    }
    //risk
    if (this.item?.status != 'PENDING') {
      if (this.item?.customerKyc?.riskCategory == "LOW") {
        this.riskLow.setValue(true);
        // this.riskLowCheck = item?.customerKyc?.riskLow

      }
      if (this.item?.customerKyc?.riskCategory == "MEDIUM") {
        this.riskMedium.setValue(true);
        // this.riskMediumCheck = item?.customerKyc?.riskMedium
      }
      if (this.item?.customerKyc?.riskCategory == "HIGH") {
        this.riskHigh.setValue(true);
        // this.riskhighCheck = item?.customerKyc?.riskHigh
      }

      //watchlist
      console.log("checkedWatchlist", this.item?.customerKyc?.checkedWatchlist)
      if (this.item?.customerKyc?.checkedWatchlist) {
        this.watchYes.setValue(true);
        this.watchNo.setValue(false);
      }
      else if (!this.item?.customerKyc?.checkedWatchlist && this.item?.customerKyc?.checkedWatchlist != null) {
        this.watchYes.setValue(false);
        this.watchNo.setValue(true);
      }
      else {
        this.watchYes.setValue(false);
        this.watchNo.setValue(false);
      }
    }
    // custInfoMarried
    // custInfoSingle
    if (this.item?.customerKyc?.custInfoProofType == 'Paper Tazkira') {
      this.prooftype = 'Paper Tazkira';

    }
    else {
      this.prooftype = '';
    }
    this.undertakenSign = this.item?.customerKyc?.custSignaturePhoto;
    this.getImages(this.undertakenSign)
    this.fileLists.push({
      name: 'Customer Signature',
      // url: this.imageUrl + '/kyc/static/' + this.undertakenSign
      url: this.undertakenSign
    })
    // this.kycSign = item?.customerKyc?.agentSign_img_0;
    // this.agentVerifySign = item?.customerKyc?.superAgentSign_img_0;
    // this.opSign = item?.customerKyc?.opsSign_img_1;

    //caused error
    if (this.item?.customerKyc?.custSignaturePhoto) {
      this.undertakenSign = this.item?.customerKyc?.custSignaturePhoto;
      this.getImages(this.undertakenSign)
    }
    if (this.item?.customerKyc?.opsSignaturePhoto) {
      this.regSign = this.item?.customerKyc?.opsSignaturePhoto;
      this.getImages(this.regSign)
    }
    if (this.item?.customerKyc?.complianceSignaturePhoto) {
      this.compSign = this.item?.customerKyc?.complianceSignaturePhoto;
      this.getImagesComp(this.compSign)
    }
    if (this.item?.customerKyc?.complianceHeadSignaturePhoto) {
      this.compHedSign = this.item?.customerKyc?.complianceHeadSignaturePhoto;
      this.getImagesCompHead(this.compHedSign)
    }
    if (this.item?.customaerKyc?.ceoSignaturePhoto) {
      this.ceoSign = this.item?.customaerKyc?.ceoSignaturePhoto;
      this.getImagesCEO(this.ceoSign)
    }
    if (this.item?.customerKyc?.custPhoto) {
      this.CustomerImg = this.item?.customerKyc?.custPhoto;
      console.log("CustomerImg111", this.CustomerImg)
      this.getImagesProfile(this.CustomerImg)
      this.fileLists.push({
        name: 'Customer Profile Picture',
        url: this.CustomerImg
        // url: this.imageUrl + '/um/static/profile/' + this.CustomerImg
      })
    }
    // if (this.item?.agentKyc.opsSignaturePhoto) {
    //   this.opsSignaturePhoto = this.item?.agentKyc.opsSignaturePhoto
    //   console.log("opsSignaturePhoto", this.opsSignaturePhoto)
    //   this.fileLists.push({
    //     name: 'Operations Signature Photo',
    //     url: this.opsSignaturePhoto
    //   })
    // }
    if (this.item?.customerKyc?.custProofFrontPhoto) {
      this.custProofFrontPhoto = this.item?.customerKyc?.custProofFrontPhoto;
      console.log("custProofFrontPhoto", this.custProofFrontPhoto)
      this.fileLists.push({
        name: 'Customer Proof FrontPhoto',
        url: this.custProofFrontPhoto
        // url: this.imageUrl + '/kyc/static/' + this.custProofFrontPhoto
        // url: this.imageUrl + '/um/static/profile/' + this.CustomerImg
      })
    }
    if (this.item?.customerKyc?.custProofBackPhoto) {
      this.custProofBackPhoto = this.item?.customerKyc?.custProofBackPhoto;
      console.log("custProofBackPhoto", this.custProofBackPhoto)
      this.fileLists.push({
        name: 'Customer Proof BackPhoto',
        url: this.custProofBackPhoto
        // url: this.imageUrl + '/kyc/static/' + this.custProofBackPhoto
        // url: this.imageUrl + '/um/static/profile/' + this.CustomerImg
      })
    }
    // if (this.item?.customerKyc?.custSignaturePhoto) {
    //   this.custSignaturePhoto = this.item?.customerKyc?.custSignaturePhoto;
    //   console.log("custSignaturePhoto", this.custSignaturePhoto)
    //   this.fileLists.push({
    //     name: 'Customer Signature Photo',
    //     url: this.custSignaturePhoto
    //     // url: this.imageUrl + '/kyc/static/' + this.custSignaturePhoto
    //     // url: this.imageUrl + '/um/static/profile/' + this.CustomerImg
    //   })
    // }

    //new image section
    if (this.item?.newValues) {
      const img = this.item.newValues;
      const fullUrl = img.filePath; // ✅ FIXED

      switch (img.mapping) {
        case 'custPhoto':
          this.newImageFileLists.push({
            name: 'Customer Profile Picture',
            url: fullUrl
          });
          break;

        case 'custSignaturePhoto':
          this.newImageFileLists.push({
            name: 'Customer Signature',
            url: fullUrl
          });
          break;

        case 'custProofFrontPhoto':
          this.newImageFileLists.push({
            name: 'Customer Proof Front Photo',
            url: fullUrl
          });
          break;

        case 'custProofBackPhoto':
          this.newImageFileLists.push({
            name: 'Customer Proof Back Photo',
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
    console.log("Files", this.fileLists);
    this.firstNameOrginal = this.item?.customerKyc?.custInfoFirstName;
    this.lastNameOrginal = this.item?.customerKyc?.custInfoLastName;

    this.customerForm.patchValue({ firstName: this.item?.customerKyc?.custInfoFirstName || '' })
    this.customerForm.patchValue({ lastName: this.item?.customerKyc?.custInfoLastName || '' })
    this.customerForm.patchValue({ fatherName: this.item?.customerKyc?.custInfoFatherName || '' })
    this.customerForm.patchValue({ walletNO: this.item?.customerKyc?.custInfoMMWallet || 'NIL' })
    this.customerForm.patchValue({ dob: this.item?.customerKyc?.custInfoDob || 'NIL' })
    let altphone = "+93" + " " + this.item?.customerKyc?.custInfoAltPhone.slice(-9)
    this.customerForm.patchValue({ altPh: altphone || 'NIL' })

    this.dobValue = this.item?.customerKyc?.custInfoDob
    console.log("dobValue", this.dobValue)
    this.customerForm.patchValue({ email: this.item?.customerKyc?.custInfoEmail || 'NIL' });
    this.customerForm.patchValue({ nationality: this.item?.customerKyc?.custInfoNationality || 'NIL' });
    // this.customerForm.patchValue({ nationalityDrop: this.item?.customerKyc?.custInfoNationality || 'NIL' });

    this.customerForm.patchValue({ birthCountry: this.item?.customerKyc?.custInfoBirthCountry || 'NIL' })
    this.customerForm.patchValue({ birthProvince: this.item?.customerKyc?.custInfoBirthProvince || 'NIL' })
    this.customerForm.patchValue({ birthCountryDrop: this.item?.customerKyc?.custInfoBirthCountry || 'NIL' })
    this.customerForm.patchValue({ birthProvinceDrop: this.item?.customerKyc?.custInfoBirthProvince || 'NIL' })


    let phone = "+93" + " " + this.item?.submittedFor?.phone.slice(-9)
    this.customerForm.patchValue({ contactNO: phone || 'NIL' })
    this.CustomerfirstName = this.item?.customerKyc?.firstName;
    console.log('this.CustomerfirstName11:', this.CustomerfirstName);
    console.log("province11:", this.item?.customerKyc?.currProvince)
    this.CustomerLastName = this.item?.customerKyc?.lastName
    this.CustomerFathername = this.item?.customerKyc?.custInfoFatherName;

    this.customerForm.patchValue({ houseNO: this.item?.customerKyc?.currHouseNo || 'NIL' })
    this.customerForm.patchValue({ loc: this.item?.customerKyc?.currLocation || 'NIL' })
    this.customerForm.patchValue({ province: this.item?.customerKyc?.currProvince || 'NIL' })
    this.customerForm.patchValue({ street: this.item?.customerKyc?.currStreet || 'NIL' })
    this.customerForm.patchValue({ district: this.item?.customerKyc?.currDistrict || 'NIL' })
    this.customerForm.patchValue({ country: this.item?.customerKyc?.currCountry || 'NIL' })

    this.customerForm.patchValue({ perHouseNO: this.item?.customerKyc?.permHouseNo || 'NIL' })
    this.customerForm.patchValue({ perLoc: this.item?.customerKyc?.permLocation || 'NIL' })
    this.customerForm.patchValue({ perProvince: this.item?.customerKyc?.permProvince || 'NIL' })
    this.customerForm.patchValue({ perStreet: this.item?.customerKyc?.permStreet || 'NIL' })
    this.customerForm.patchValue({ perDistrict: this.item?.customerKyc?.permDistrict || 'NIL' })
    this.customerForm.patchValue({ perCountry: this.item?.customerKyc?.permCountry || 'NIL' })

    //drop per and curr
    this.customerForm.patchValue({ countryAddress: this.item?.customerKyc?.currCountry || 'NIL' })
    this.customerForm.patchValue({ perCountryAddress: this.item?.customerKyc?.permCountry || 'NIL' })
    this.customerForm.patchValue({ provinceAddress: this.item?.customerKyc?.currProvince || 'NIL' })
    this.customerForm.patchValue({ permanentProvince: this.item?.customerKyc?.permProvince || 'NIL' })
    // this.customerForm.patchValue({ districtAddress: this.item?.customerKyc?.currDistrict || 'NIL' })
    // this.customerForm.patchValue({ permanentDistrict: this.item?.customerKyc?.permDistrict || 'NIL' })
    this.loadDistrictsAfterPatch(this.item?.customerKyc);

    this.customerForm.patchValue({ employmentType: this.item?.customerKyc?.employmentType || 'NIL' })
    // this.customerForm.patchValue({
    //   employmentType: this.formatEmploymentType(item?.customerKyc?.employmentType || 'NIL')
    // });

    this.customerForm.patchValue({ source: this.item?.customerKyc?.sourceOfIncome || 'NIL' })
    this.customerForm.patchValue({ incomeSourceOrg: this.item?.customerKyc?.sourceOfIncome || 'NIL' })
    this.customerForm.patchValue({ natureofBusiness: this.item?.customerKyc?.bizNature || 'NIL' })
    this.customerForm.patchValue({ NatureDrop: this.item?.customerKyc?.bizNature || 'NIL' })
    this.customerForm.patchValue({ employerName: this.item?.customerKyc?.employerName || 'NIL' })
    this.customerForm.patchValue({ position: this.item?.customerKyc?.positionHeld || 'NIL' })

    // this.customerForm.patchValue({ income: item?.customerKyc?.monthlyIncome || 'NIL' })
    // this.customerForm.patchValue({
    //   income: item?.customerKyc?.monthlyIncome ? `AFN ${item.customerKyc.monthlyIncome}` : 'NIL'
    // });
    this.customerForm.patchValue({
      income: this.item?.customerKyc?.monthlyIncome
        ? `AFN ${this.formatNumber(this.item.customerKyc.monthlyIncome)}`
        : 'NIL'
    });
    this.customerForm.patchValue({ service: this.item?.customerKyc?.periodOfService || 'NIL' })
    // this.customerForm.patchValue({ turnover: item?.customerKyc?.monthlyTurnover || 'NIL' })

    this.customerForm.patchValue({
      turnover: this.item?.customerKyc?.monthlyTurnover
        ? `AFN ${this.formatNumber(this.item.customerKyc.monthlyTurnover)}`
        : 'NIL'
    });
    this.customerForm.patchValue({ tin: this.item?.customerKyc?.tinNumber || 'NIL' })
    this.customerForm.patchValue({ govtOrgName: this.item?.customerKyc?.govtOrgName || 'NIL' })
    this.customerForm.patchValue({ govtPosition: this.item?.customerKyc?.govtPositionHeld || 'NIL' })
    this.customerForm.patchValue({ sourceOfFund: this.item?.customerKyc?.sourceOfIncome || 'NIL' })

    this.customerForm.patchValue({ kinName: this.item?.customerKyc?.nokName || 'NIL' })
    let Kinphone = "+93" + " " + this.item?.customerKyc?.nokPhone.slice(-9)
    this.customerForm.patchValue({ kinMobile: Kinphone || 'NIL' })
    this.customerForm.patchValue({ kinFather: this.item?.customerKyc?.nokFatherName || 'NIL' })
    this.customerForm.patchValue({ kinRelation: this.item?.customerKyc?.nokRelationship || 'NIL' })
    this.customerForm.patchValue({ kinAddress: this.item?.customerKyc?.nokLocation || 'NIL' })

    this.customerForm.patchValue({ kinEmail: this.item?.customerKyc?.nokEmail || 'NIL' })
    this.customerForm.patchValue({ kinHouse: this.item?.customerKyc?.nokHouseNo || 'NIL' })
    this.customerForm.patchValue({ kinProvince: this.item?.customerKyc?.nokProvince || 'NIL' })
    this.customerForm.patchValue({ kinStreet: this.item?.customerKyc?.nokStreet || 'NIL' })
    this.customerForm.patchValue({ kinDistrict: this.item?.customerKyc?.nokDistrict || 'NIL' })
    this.customerForm.patchValue({ kinCountry: this.item?.customerKyc?.nokCountry || 'NIL' })

    this.CustomerApplicant = this.customerForm.get('firstName')?.value + ' ' + this.customerForm.get('lastName')?.value;
    this.CustomerApplicantDate = this.item?.customerKyc?.undertakenDate;

    this.customerForm.patchValue({ purpose: this.item?.customerKyc?.purposeOfAcc || 'NIL' })
    this.customerForm.patchValue({ PurposeDrop: this.item?.customerKyc?.purposeOfAcc || 'NIL' })
    this.customerForm.patchValue({ accOpenDate: this.item?.customerKyc?.custInfoAccOpenDate || 'NIL' })

    this.customerForm.patchValue({ custProofType: this.item?.customerKyc?.custProofType || 'NIL' })
    // this.customerForm.patchValue({
    //   custProofType: this.formatProofType(item?.customerKyc?.custProofType || 'NIL')
    // });
    this.customerForm.patchValue({ idNO: this.item?.customerKyc?.custProofNumber || 'NIL' });
    this.customerForm.patchValue({ issue: this.item?.customerKyc?.custProofDateOfIssue || 'NIL' });
    this.customerForm.patchValue({ expiry: this.item?.customerKyc?.custProofDateOfExpiry || 'NIL' });
    this.customerForm.patchValue({ bookNo: this.item?.customerKyc?.tazkiraBookNo || 'NIL' });
    this.customerForm.patchValue({ pageNo: this.item?.customerKyc?.tazkiraPageNo || 'NIL' });
    this.customerForm.patchValue({ regNo: this.item?.customerKyc?.tazkiraRegNo || 'NIL' });

    this.customerForm.patchValue({ agentLicense: this.item?.customerKyc?.agentLicenseNo || 'NIL' })
    this.customerForm.patchValue({ agentName: this.item?.customerKyc?.agentName || 'NIL' })
    this.customerForm.patchValue({ agentPos: this.item?.customerKyc?.agentPOS || 'NIL' })
    this.customerForm.patchValue({ agentLoc: this.item?.customerKyc?.agentLocation || 'NIL' })
    this.customerForm.patchValue({ agentIccid: this.item?.customerKyc?.agentICCID || 'NIL' })
    this.customerForm.patchValue({ agentPtid: this.item?.customerKyc?.agentPTID || 'NIL' })

    this.customerForm.patchValue({ kyc: this.item?.customerKyc?.kycProcessedBy || 'NIL' })
    this.customerForm.patchValue({ kycDate: this.item?.customerKyc?.kycProcessedDate || 'NIL' })
    this.customerForm.patchValue({ agentVerify: this.item?.customerKyc?.superAgentVerification || 'NIL' })
    this.customerForm.patchValue({ agentVerifyDate: this.item?.customerKyc?.superAgentVerificationDate || 'NIL' })


    this.customerForm.patchValue({ opVerify: this.item?.customerKyc?.verifiedByOps || 'NIL' })
    this.customerForm.patchValue({ opVerifyDate: this.item?.customerKyc?.verifiedByOpsDate || 'NIL' })
    this.customerForm.patchValue({ compVerify: this.item?.customerKyc?.approvedByCompliance || 'NIL' })
    this.customerForm.patchValue({ compVerifyDate: this.item?.customerKyc?.approvedByComplianceDate || 'NIL' })
    if (this.readOnly) {
      this.FemaleChecked.disable();
      this.MaleChecked.disable();
      this.married.disable();
      this.single.disable();
    }
    this.userService.getCustomerProfile(this.item?.customerKyc?.custInfoMMWallet).subscribe(
      (response) => {
        if (response.responseCode === 200) {
          this.customerProfile = response.data;
          this.regPhone = this.customerProfile[0]?.phone;
          this.reg_Email = this.customerProfile[0]?.email;
          console.log("Customer Profile:", this.customerProfile);
        }
        else {
          console.error("Failed to fetch customer profile. Response code:", response.responseCode);
        }
      }
    );
    //newValues
    // if (this.item?.newValues) {
    //   this.customerForm.patchValue({
    //     firstNameNew: this.item?.newValues?.custInfoFirstName || '',
    //     lastNameNew: this.item?.newValues?.custInfoLastName || '',
    //     fatherNameNew: this.item?.newValues?.custInfoFatherName || '',
    //     dobNew: this.item?.newValues?.custInfoDob || 'NIL',
    //     altPhNew: this.item?.newValues?.custInfoAltPhone || 'NIL',
    //     birthCountryNew: this.item?.newValues?.custInfoBirthCountry || 'NIL',
    //     birthProvinceNew: this.item?.newValues?.custInfoBirthProvince || 'NIL',
    //     idNONew: this.item?.newValues?.custProofNumber || 'NIL',
    //     nationalityNew: this.item?.newValues?.custInfoNationality || 'NIL',
    //     pageNoNew: this.item?.newValues?.tazkiraPageNo || 'NIL',
    //     bookNoNew: this.item?.newValues?.tazkiraBookNo || 'NIL',
    //     regNoNew: this.item?.newValues?.tazkiraRegNo || 'NIL',
    //     issueNew: this.item?.newValues?.custProofDateOfIssue || 'NIL',
    //     expiryNew: this.item?.newValues?.custProofDateOfExpiry || 'NIL',
    //     genderNew: this.item?.newValues?.custInfoGender || 'NIL',
    //     maritalNew: this.item?.newValues?.custInfoMaritalStatus || 'NIL',
    //     emailNew: this.item?.newValues?.custInfoEmail || 'NIL',

    //     perLocNew: this.item?.newValues?.permLocation || 'NIL',
    //     locNew: this.item?.newValues?.currLocation || 'NIL',
    //     perDistrictNew: this.item?.newValues?.permDistrict || 'NIL',
    //     districtNew: this.item?.newValues?.currDistrict || 'NIL',
    //     perProvinceNew: this.item?.newValues?.permProvince || 'NIL',
    //     provinceNew: this.item?.newValues?.currProvince || 'NIL',
    //     perCountryNew: this.item?.newValues?.permCountry || 'NIL',
    //     countryNew: this.item?.newValues?.currCountry || 'NIL',

    //     sourceNew: this.item?.newValues?.sourceOfIncome || 'NIL',
    //     employerNameNew: this.item?.newValues?.employerName || 'NIL',
    //     natureofBusinessNew: this.item?.newValues?.bizNature || 'NIL',
    //     positionNew: this.item?.newValues?.positionHeld || 'NIL',
    //     govtPositionNew: this.item?.newValues?.govtPositionHeld || 'NIL',
    //     turnoverNew: this.item?.newValues?.monthlyTurnover || 'NIL',
    //     tinNew: this.item?.newValues?.tinNumber || 'NIL',
    //     incomeNwew: this.item?.newValues?.monthlyIncome || 'NIL',
    //     govtOrgNameNew: this.item?.newValues?.govtOrgName || 'NIL',
    //     purposeNew: this.item?.newValues?.purposeOfAcc || 'NIL',

    //     kinNameNew: this.item?.newValues?.nokName || 'NIL',
    //     kinFatherNew: this.item?.newValues?.nokFatherName || 'NIL',
    //     kinMobileNew: this.item?.newValues?.nokPhone || 'NIL',
    //     kinRelationNew: this.item?.newValues?.nokRelationship || 'NIL',
    //     kinAddressNew: this.item?.newValues?.nokLocation || 'NIL',

    //   });

    //   this.walletaccounts = this.item?.submittedFor?.walletAccount
    //   console.log(" this.walletaccounts", this.walletaccounts);
    //   //end 

    //   //new
    //   // for (let item of this.allUsers) {
    //   //   if (this.kycId == item?.id) {
    //   //     this.kycStatus = item?.status
    //   //     if (this.kycStatus === 'REJECTED' || this.kycStatus === 'APPROVED') {
    //   //       this.showRejectButton = false
    //   //     }
    //   //   }
    //   // }
    //   //new
    //   const currentDate = new Date();
    //   this.CustomerAccountOpenDate = this.formatDate(currentDate);
    //   this.selectedGender = this.item?.customerKyc?.custInfoGender;
    //   this.selectedStatus = this.item?.customerKyc?.custInfoMaritalStatus;
    // }
  }
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
        this.item?.customerKyc?.[masterField],
        this.item?.newValues?.[newField]
      )
    );
  }
  // loadDistrictsAfterPatch(data: any) {
  //   /* CURRENT ADDRESS */
  //   const currProvince = this.provinces?.find((
  //     p: any) => p.name === data?.currProvince
  //   );

  //   if (currProvince) {
  //     this.getDistrictsCur(currProvince.id);

  //     setTimeout(() => {
  //       this.customerForm.patchValue({
  //         districtAddress: data?.currDistrict || 'NIL'
  //       });
  //     }, 0);
  //   }

  //   /* PERMANENT ADDRESS */
  //   const permProvince = this.provinces?.find((
  //     p: any) => p.name === data?.permProvince
  //   );

  //   if (permProvince) {
  //     this.getDistrictsPer(permProvince.id);

  //     setTimeout(() => {
  //       this.customerForm.patchValue({
  //         permanentDistrict: data?.permDistrict || 'NIL'
  //       });
  //     }, 0);
  //   }
  // }

  onGenderChange(event: Event, gender: string): void {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      this.selectedGender = gender;
    } else {
      if (this.selectedGender === gender) {
        this.selectedGender = '';
      }
    }
    console.log("Selected Gender", this.selectedGender);
  }
  onStatusChange(status: string): void {
    this.selectedStatus = status;
  }
  formatTurnover(event: any): void {
    let turnover = event.target.value;
    // Remove any non-numeric characters (except for commas)
    const rawValue = turnover.replace(/[^\d]/g, ''); // Remove non-numeric characters
    this.rawValueTurnover = rawValue
    console.log(",rawValue,", rawValue);
    // Format the number with commas (AFN 3,000)
    const formatted = this.formatNumberWithCommas(rawValue);

    // Set the formatted value to display
    this.formattedTurnover = 'AFN ' + formatted;

    // Update the raw numeric value in the form control (without commas)
    this.customerForm.get('turnover')?.setValue(rawValue);
  }
  formatNumberWithCommas(value: string): string {
    const number = parseInt(value, 10);
    if (isNaN(number)) return '';
    return number.toLocaleString(); // Automatically formats with commas (e.g., 3000 -> 3,000)
  }
  formatIncome(event: any): void {
    let income = event.target.value;

    // Remove any non-numeric characters (except for commas)
    const rawValueIn = income.replace(/[^\d]/g, ''); // Remove non-numeric characters
    this.rawValueIncome = rawValueIn

    // Format the number with commas (AFN 3,000)
    const formatted = this.formatNumberWithCommas(rawValueIn);

    // Set the formatted value to display
    this.formattedIncome = 'AFN ' + formatted;

    // Update the raw numeric value in the form control (without commas)
    this.customerForm.get('income')?.setValue(rawValueIn);
  }
  onKeyPressNoAlphabet(event: KeyboardEvent): void {
    const charCode = event.which || event.keyCode;
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {
      // Prevent input if the pressed key is an alphabet character (ASCII range: 65-90, 97-122)
      event.preventDefault();
    }
  }
  getAllEditKycRequests() {
    this.isLoading = true;
    this.KycService.getAllEditKycRequests(0).subscribe(
      (data: any) => {
        this.data = data?.data;
        this.allData = [...this.data]
      },
      (error) => {
        console.error("Error fetching KYC data", error);
      },
      () => {
        this.isLoading = false; // Set loading state to false when API call completes
      }
    );
  }
  toggleReadOnly(event: Event): void {
    const checkbox = event.target as HTMLInputElement;

    this.readOnly = !checkbox.checked; // Set `readOnly` based on checkbox state
    if (checkbox.checked) {
      this.customerForm.patchValue({ nationalityDrop: this.item?.customerKyc?.custInfoNationality || 'NIL' });
      this.showUpdateBtn = checkbox.checked
      //new
      this.getCountries();
      this.getAccPurpose();
      this.getIncomeSource();
      this.getNatureOfBusiness();
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
      //new issue fix
      // setTimeout(() => {
      //   const perCountry = this.customerForm.get('permCountry')?.value;
      //   if (perCountry && !this.countryNamePer) {
      //     this.countryNamePer = perCountry;
      //     this.getProvincesPer();
      //   }
      //   const curCountry = this.customerForm.get('currCountry')?.value;
      //   if (curCountry && !this.countryNameCur) {
      //     this.countryNameCur = curCountry;
      //     this.getProvincesCur();
      //   }
      // }, 0);

      //
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

      this.showNationalityDrop = false;
      this.showNationalityText = true;

      this.showSourceDrop = false
      this.showSourceText = true

      this.showNatureDrop = false
      this.showNatureText = true

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
  // onChangenationalityDrop($event: any) {
  // }
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
  //new
  onChangeBirthCountryDrop($event: any) {
    this.BirthCountryValue = $event.target.value
    this.getProvincesBirth();
    console.log("BirthCountryValue", $event.target.value)
    // this.onSelectBirthProvinceDrop(this.BirthCountryValue, $event);
    if (this.BirthCountryValue === 'Afghanistan') {
      this.showBirthProvinceDrop = true
      this.showProvinceTextbox = false
    }
    else {
      this.showBirthProvinceDrop = false
      this.showProvinceTextbox = true
    }
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
  //new
  onChangeCountryCur($event: any) {
    this.countryNameCur = $event.target.value
    this.getProvincesCur();
    console.log("this.countryNameCur", this.countryNameCur)
    // this.onSelectProvinceCurr(this.countryNameCur, $event);
    if ($event.target.value === 'Afghanistan') {
      this.showCurrProvinceDrop = true
      this.showCurrDistrictDrop = true

      this.showCurrProvinceTextbox = false
      this.showCurrDistrictTextbox = false
    }
    else {
      this.showCurrProvinceDrop = false
      this.showCurrDistrictDrop = false

      this.showCurrProvinceTextbox = true
      this.showCurrDistrictTextbox = true
    }
  }
  onChangeCountryPer($event: any) {
    this.countryNamePer = $event.target.value
    this.getProvincesPer();
    console.log("this.countryNamePer", this.countryNamePer)
    // this.onSelectProvincePer(this.countryNamePer, $event);
    if ($event.target.value === 'Afghanistan') {
      this.showPerProvinceDrop = true
      this.showPerDistrictDrop = true

      this.showPerProvinceTextbox = false
      this.showPerDistrictTextbox = false
    }
    else {
      this.showPerProvinceDrop = false
      this.showPerDistrictDrop = false

      this.showPerProvinceTextbox = true
      this.showPerDistrictTextbox = true
    }
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
  //new start 
  tryLoadDistricts() {
    if (
      this.provincesCur?.length &&
      this.provincesPer?.length &&
      this.item?.customerKyc
    ) {
      this.loadDistrictsAfterPatch(this.item.customerKyc);
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
      this.customerForm.patchValue({ districtAddress: null });

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
      this.customerForm.patchValue({ permanentDistrict: null });
      this.getDistrictsPer(this.selectedProvincePer);
    } else {
      console.error("provincesPer is not an array:", this.provincesPer);
    }
  }
  //new end

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
  getDistrictsCur(provinceId: number, districtValue?: string) {
    this.corporateService.getdistricts(provinceId).subscribe(res => {
      this.districtsCur = res?.data || [];

      if (districtValue) {
        this.customerForm.patchValue({
          districtAddress: districtValue
        });
      }
    });
  }
  getDistrictsPer(provinceId: number, districtValue?: string) {
    this.corporateService.getdistricts(provinceId).subscribe(res => {
      this.districtsPer = res?.data || [];

      if (districtValue) {
        this.customerForm.patchValue({
          permanentDistrict: districtValue
        });
      }
    });
  }

  getImages(imgParam: any) {
    this.KycService.getImage(imgParam).subscribe((res) => {
      console.log(res);
      const objectURL = URL.createObjectURL(res);
      this.newFile = objectURL;
      this.regBySign = objectURL
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
  initForm() {
    this.remarkForm.addControl('remark', this.remark)
    this.compForm.addControl('ComplianceInput', this.ComplianceInput)
    this.compForm.addControl('ComplianceDateInput', this.ComplianceDateInput)
    this.regForm.addControl('regInput', this.regInput)
    this.regForm.addControl('regDateInput', this.regDateInput)
  }
  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  setFieldValue(key: string, value: any) {
    this.customerForm.patchValue({ [key]: value ?? 'NIL' });
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
        this.KycService.deleteCustomerMultipleDoc(req, this.submittedForId).subscribe((data: any) => {
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
        this.KycService.deleteCustomerMultipleDocByMaker(req, this.submittedForId).subscribe((data: any) => {
          if (data?.code === 200) {
            alert('File deleted successfully');
          } else {
            alert('Error deleting file:');
          }
        });
      }
    }
  }
  formatProofType(proofType: string): string {
    if (!proofType) return '';

    // Replace underscores with spaces and capitalize the first letter of each word
    return proofType
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  // formatEmploymentType(employmentType: string): string {
  //   const employmentTypeMap: { [key: string]: string } = {
  //     EMPLOYED: 'Employed',
  //     SELF_EMPLOYED: 'Self Employed',
  //     UNEMPLOYED: 'Unemployed',
  //     GOVT_EMPLOYED: 'Government Employed' // Add any other mappings as needed
  //   };

  //   return employmentTypeMap[employmentType] || employmentType;
  // }

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

  openPdfViewer() {
    const pdfUrl = 'path/to/your/pdf/document.pdf'; // Replace with the actual path or URL to your PDF
    window.open(pdfUrl, '_blank');
  }
  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
  //
  startEdit(fileItem: any) {
    // close editing on all files
    this.fileLists.forEach((f: any) => f.isEditing = false);
    // open editing only for clicked file
    fileItem.isEditing = true;
  }
  private normalize(value: string): string {
    return value
      .toLowerCase()
      .replace(/\s+/g, '')   // remove ALL spaces
      .trim();
  }
  customerDocTypeMap: { [key: string]: string } = {
    'Customer Signature': 'custSignaturePhoto',
    'Customer Profile Picture': 'custPhoto',
    'Customer Proof FrontPhoto': 'custProofFrontPhoto',
    'Customer Proof BackPhoto': 'custProofBackPhoto',
    'Additional Doc': 'otherDocs'
  };
  detectFilesByMaker(event: any, fileItem?: any) {
    const selectedFile: File = event.target.files[0];
    if (!selectedFile) return;

    fileItem.selectedFile = selectedFile;
    fileItem.isUpdated = false;

    const normalizedDocName = this.normalize(fileItem.name);

    const typeKey = Object.keys(this.customerDocTypeMap)
      .find(k => this.normalize(k) === normalizedDocName);

    if (!typeKey) {
      console.error('DOC NAME:', fileItem.name);
      console.error('AVAILABLE KEYS:', Object.keys(this.customerDocTypeMap));
      alert(`Invalid document type: ${fileItem.name}`);
      return;
    }
    const mappedType = this.customerDocTypeMap[typeKey];
    this.KycService.customerUpdateImageByMaker(selectedFile, mappedType, this.submittedForId).subscribe({
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
        alert(`Error updating ${fileItem.name}`);
      }
    });
  }
  detectFilesByMakerOtherDocs(event: any, mapping: any) {
    // const input = event.target as HTMLInputElement;
    if (event.target.files && event.target.files[0]) {
      let file: File | null = event.target.files[0];

      this.isLoading = true;
      if (file) {
        this.KycService.customerUpdateImageByMaker(file, mapping, this.submittedForId).subscribe({
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
    if (event.target.files && event.target.files[0]) {
      this.uploadedImage = event.target.files[0];
      // console.log("uploadedImage1", this.uploadedImage1);
      this.uploadedImageFile0 = event.target.files[0].name;
      this.uploadedImageFileType0 = event.target.files[0].type
      this.uploadedImageFileNameExtension0 = event.target.files[0].name.split('.').pop();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.uploadedImageFileData0 = reader.result;
      reader.onload = () => {
        this.uploadedImageFileData0 = reader.result;
      };
    }
    this.type = "custPhoto";
    this.KycService.addCustomerPhoto(this.uploadedImage, this.type).subscribe((data: any) => {
    })

  }
  detectFilesUndertaken(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadedImageUndertaken = event.target.files[0];
      this.uploadedImageFileName = event.target.files[0].name;
      // this.uploadedImageFileType1 = event.target.files[0].type
      // this.uploadedImageFileNameExtension = event.target.files[0].name.split('.').pop();
      // const file = event.target.files[0];
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // this.uploadedImageFileData = reader.result;
      // reader.onload = () => {
      //   this.uploadedImageFileData = reader.result;
      // };
    }
    this.type = "custSignaturePhoto";
    this.KycService.addCustomerSign(this.uploadedImageUndertaken, this.type, this.submittedForId).subscribe((data: any) => {
    })
    // setTimeout(() => {
    //   let Req: imageUpload = {
    //     type: "SIGNATURE",
    //     file: this.uploadedImage1
    //   }
    //   this.imageValue.push(Req);
    // }, 1800);

  }
  openKycSignModal() {
    this.showdigitalModal = true
  }
  viewFile(fileUrl: string) {
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
    this.KycService.addCustomerCompHeadSign(this.uploadedImageCompHeadSign, this.type, this.submittedForId).subscribe((data: any) => {
    })
  }
  upload() {
    const batchIdValue = this.refundForm.get('digitalKey')?.value;
    if (batchIdValue) {
      this.KycService.addCustomerKycSign(this.uploadedImageKycSign, this.type, this.submittedForId).subscribe((data: any) => {
      })
    }
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
    console.log('File:', this.uploadedImageOpSign);
    console.log('Type Op:', this.typeOp);
    this.typeOp = "opsSign_img_0";
    this.KycService.addCustomerOpSign(this.uploadedImageOpSign, this.typeOp, this.submittedForId).subscribe((data: any) => {
    })
  }
  detectFilesRegSign(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadedImageRegSign = event.target.files[0];
      this.uploadedImageRegSignName = event.target.files[0].name;

    }
    // this.type = "complianceSignaturePhoto";
    // this.KycService.addCustomerCompSign(this.uploadedImageCompSign, this.type, this.submittedForId).subscribe((data: any) => {
    // })
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
    this.KycService.addCustomerCompSign(this.uploadedImageCompSign, this.type, this.submittedForId).subscribe((data: any) => {
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
      this.KycService.addCustomerAttachment(formData, this.submittedForId).subscribe(
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
  onChangeGetProduct($event: any) {
    this.productId = $event.target.value
  }
  getProducts() {
    this.KycService.getCustomerProducts().subscribe((data: any) => {
      this.products = data
      console.log('Fetched products:', data);
    })
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
  //       alert("Success: The product has been changed successfully.");
  //     } else {
  //       alert("Failure: There was an issue changing the product.")
  //     }
  //   }, error => {
  //     alert("Error: Something went wrong. Please try again later.")
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
    if (this.item?.status == 'PENDING') {
      this.submittedForId = this.item?.submittedFor?.id;
      if (this?.item?.newValues && this?.item?.newValues?.length > 0 && this.item?.newValues?.custInfoDob) {
        this.item.customerKyc.custInfoDob = this.item?.newValues?.custInfoDob;
      }
      if (this.item?.newValues?.custInfoFirstName) {
        this.item.customerKyc.custInfoFirstName = this.item?.newValues?.custInfoFirstName;
      }
    }
    const req = {
      // name: this.firstNameValue,
      "name": this.customerForm.get('firstName')?.value,
      "minMatchPercent": 60,
      "dob": this.item?.customerKyc?.custInfoDob,
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
        this.isLoading = false;
        if (data && data.length > 0) {
          this.sdnDetails = data;
          this.noDataSdn = false;
          this.showModal = true;
        } else {
          this.sdnDetails = [];
          this.noDataSdn = true;
          this.showModal = true;
        }
        // this.isLoading = false;
        // this.showModal = true;
        // this.sdnDetails = data
        // console.log("sdnDetails", this.sdnDetails)
        // this.showModal = true;
        // if (!data) {
        //   this.isLoading = false;
        //   this.noDataSdn=true
        // }
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
  //     }
  //     else {
  //       // No data found, show the error message
  //       this.isLoading = false;
  //       this.DataRisk = false;
  //       this.noDataRisk = true;
  //     }

  //     this.showRiskModal = true;
  //   });
  // }
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
  ngAfterViewChecked(): void {
    this.scrollToBottom();
    // this.adjustContainerHeight();
  }

  scrollToBottom(): void {
    // try {
    //   this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    // } catch (err) { }
  }
  makePdf() {
    // this.seqNo = this.item?.seqNo
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

  onCheckedRisk($event: any, riskType: any) {
    const checkbox = $event.target as HTMLInputElement;

    let riskLevel = $event.target.value
    this.riskTarget = riskType
    console.log("riskTarget11", this.riskTarget)
    // for (let item of this.allUsers) {
    if (this.kycId == this.item?.id) {
      this.approveStatus = this.item?.status
      this.riskHighValue = this.item?.customerKyc?.riskHigh
      this.showApprove1Btn = false;
      this.showApprove2Btn = false;
      this.showApproveFinalBtn = false;
      // if (this.approveStatus === 'IN_REVIEW') {
      //   this.showApprove1Btn = true;

    }
    // }
    console.log("this.riskDetails ", this.riskDetails?.riskTier)
    //not

    // if (riskLevel === 'high' && this.approveStatus === 'IN_REVIEW') {
    //   this.showAbmmcHigh = true;
    //   this.showAbmmcLowMed = true;

    //   this.showApproveFinalBtn = false;
    //   this.showApprove1Btn = true;
    //   this.showApprove2Btn = false;
    // }
    // else if (riskLevel === 'high' && this.approveStatus === 'VERIFIED_L1') {
    //   this.showAbmmcHigh = true;
    //   this.showAbmmcLowMed = true;

    //   this.showApproveFinalBtn = false;
    //   this.showApprove1Btn = false;
    //   this.showApprove2Btn = true;
    // }

    // else if (riskLevel === 'high' && this.approveStatus === 'VERIFIED_L2') {
    //   this.showAbmmcHigh = true;
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
    // else if (riskLevel === 'medium') {
    //   this.showAbmmcHigh = false;
    //   this.showAbmmcLowMed = true;

    //   this.showApproveFinalBtn = true;
    //   this.showApprove1Btn = false;
    //   this.showApprove2Btn = false;
    // }
    //not

    //new
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
    //latest 
    // if (this.riskTierValue === 'HIGH' && this.approveStatus === 'IN_REVIEW') {
    //   this.showApproveFinalBtn = false;
    //   this.showApprove1Btn = true;
    //   this.showApprove2Btn = false;
    // }
    // else if (this.riskTierValue === 'LOW' && this.approveStatus === 'IN_REVIEW') {
    //   this.showApproveFinalBtn = true;
    //   this.showApprove1Btn = false;
    //   this.showApprove2Btn = false;
    // }
    // else if (this.riskTierValue === 'MEDIUM' && this.approveStatus === 'IN_REVIEW') {
    //   this.showApproveFinalBtn = true;
    //   this.showApprove1Btn = false;
    //   this.showApprove2Btn = false;
    // }
    // else if (this.riskTierValue === 'MriskEDIUM') {
    //   this.showAbmmcHigh = false;
    //   this.showAbmmcLowMed = true;

    //   this.showApproveFinalBtn = true;
    //   this.showApprove1Btn = false;
    //   this.showApprove2Btn = false;
    // }

    /* this code is not working, so replacing new code below  if (riskType === 'low') {
       this.isLowSelected = checkbox.checked;
       this.isMediumOrHighSelected = false;
     } else if (riskType === 'medium' || riskType === 'high') {
       this.isMediumOrHighSelected = checkbox.checked;
       if (checkbox.checked) {
         this.isLowSelected = false;
       }
     }
 
     // Make sure only one checkbox is checked at a time
     if (this.isLowSelected) {
       this.isMediumOrHighSelected = false;
     } */
    //new
    // if (checkbox) {
    //   this.selectedRisk = riskType;
    //   switch (riskType) {
    //     case 'low':
    //       this.riskLow.setValue(true);
    //       this.riskMedium.setValue(false);
    //       this.riskHigh.setValue(false);
    //       break;
    //     case 'medium':
    //       this.riskLow.setValue(false);
    //       this.riskMedium.setValue(true);
    //       this.riskHigh.setValue(false);
    //       break;
    //     case 'high':
    //       this.riskLow.setValue(false);
    //       this.riskMedium.setValue(false);
    //       this.riskHigh.setValue(true);
    //       break;
    //   }
    // } else {
    //   this.selectedRisk = '';
    // }
    //latest 
    // if (this.riskTierValue) {
    //   this.selectedRisk = this.riskTierValue;
    //   switch (this.riskTierValue) {
    //     case 'LOW':
    //       this.riskLow.setValue(true);
    //       this.riskMedium.setValue(false);
    //       this.riskHigh.setValue(false);
    //       break;
    //     case 'MEDIUM':
    //       this.riskLow.setValue(false);
    //       this.riskMedium.setValue(true);
    //       this.riskHigh.setValue(false);
    //       break;
    //     case 'HIGH':
    //       this.riskLow.setValue(false);
    //       this.riskMedium.setValue(false);
    //       this.riskHigh.setValue(true);
    //       break;
    //   }
    // } else {
    //   this.selectedRisk = '';
    // }

    window.scrollTo(0, 0);
    this.riskValue = $event.target.value
    this.cdr.detectChanges();
  }
  ageValidator(control: any) {
    const dob = control.value;
    if (!dob) return null;  // Return null if no value, just to prevent errors

    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear(); // Use let to allow re-assignment if needed
    const month = today.getMonth() - birthDate.getMonth();

    // Adjust age if the birthday hasn't occurred yet this year
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Check if the age is less than 18 or more than 100
    if (age < 18) {
      console.log("Age is under 18:", age);
      //this.customerForm.get('dob')?.setErrors({ underage: true });
      // this.customerForm.setV({ dob: this.item?.customerKyc?.custInfoDob || 'NIL' })
      return { underage: true };
    } else if (age > 100) {
      console.log("Age is over 100:", age);
      //this.customerForm.get('dob')?.setErrors({ overage: true });
      //this.customerForm.patchValue({ dob: this.item?.customerKyc?.custInfoDob || 'NIL' })
      return { overage: true };
    }

    return null;  // Valid age
  }
  // Immediately show the alert when age is typed
  onClickAge() {
    const dobControl = this.customerForm.get('dob');
    if (dobControl?.hasError('underage')) {
      alert('Age should be at least 18 years old.');
    } else if (dobControl?.hasError('overage')) {
      alert('Age should not exceed 100 years old.');
    }
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
    console.log("this.remarkValue11", this.remarkValue)
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
        kycType: "CUSTOMER",
        submittedFor: this.submittedForId,
        kycInputs: {
          custInfoGender: formattedNewGender,
        },
      };
      // Make the API call to update the gender
      this.corporateService.customerKYCUpdate(request).subscribe(
        (response: any) => {
          if (response?.responseCode === 200) {
            // Call the complete API to finalize changes
            this.corporateService.completeCustomerKyc(this.item?.submittedFor?.id).subscribe((data: any) => {
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
    //alert(this.customerForm.get('firstName')?.value);
    if (this.customerForm.get('firstName')?.value.toLowerCase() !== this.firstNameOrginal.toLowerCase()) {
      const confirmChange = window.confirm(
        `Do you want to update the name to "${this.customerForm.get('firstName')?.value}"?`
      );

      if (confirmChange) {
        let request = {
          "kycType": "CUSTOMER",
          "submittedFor": this.submittedForId,
          "kycInputs": {
            "custInfoFirstName": this.customerForm.get('firstName')?.value,
          }
        }
        this.corporateService.customerKYCUpdate(request).subscribe(
          (response: any) => {
            if (response?.responseCode === 200) {
              // customerKYCComplete
              this.corporateService.completeCustomerKyc(this.item?.submittedFor?.id).subscribe((data: any) => {
                if (data?.responseCode == 200) {
                  alert('First Name Updated Successfully');
                  this.firstNameOrginal = this.customerForm.get('firstName')?.value;
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
  updateLastName() {
    //alert(this.customerForm.get('firstName')?.value);
    if (this.customerForm.get('lastName')?.value.toLowerCase() !== this.lastNameOrginal.toLowerCase()) {
      const confirmChange = window.confirm(
        `Do you want to update the name to "${this.customerForm.get('lastName')?.value}"?`
      );

      if (confirmChange) {
        let request = {
          "kycType": "CUSTOMER",
          "submittedFor": this.submittedForId,
          "kycInputs": {
            "custInfoLastName": this.customerForm.get('lastName')?.value,
          }
        }
        this.corporateService.customerKYCUpdate(request).subscribe(
          (response: any) => {
            if (response?.responseCode === 200) {
              this.corporateService.completeCustomerKyc(this.item?.submittedFor?.id).subscribe((data: any) => {
                if (data?.responseCode == 200) {
                  alert('Last Name Updated Successfully');
                  this.lastNameOrginal = this.customerForm.get('lastName')?.value;
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
    console.log("riskTierValue", this.riskTierValue);
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
    console.log("riskTierValue", this.riskTierValue);

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
    console.log("riskTierValue", this.riskTierValue);

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
    console.log("riskTierValue", this.riskTierValue);

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
    console.log("riskTierValue", this.riskTierValue);
    console.log("riskTarget22", this.riskTarget)
    console.log("watchTarget22", this.watchTarget)
    console.log("loginuser", this.loginUser)
    console.log("currentDate", this.currentDate)
    // high,true high,false  medium,true medium,false low,true low,false
    this.kycVal = this.KycProcessedInput.value;
    this.kycProcessedDateVal = this.KycProcessedDateInput.value;
    this.agentVerifyVal = this.KycProcessedDateInput.value;
    this.agentVerifyDateVal = this.KycProcessedDateInput.value;
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
    console.log("riskTierValue", this.riskTierValue);
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
    console.log("riskTierValue", this.riskTierValue);
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
  // updateGender() {
  //   if (this.FemaleChecked.value) {
  //     this.customerForm.get('genderInfo')?.setValue('FEMALE');
  //     this.MaleChecked.setValue(false, { emitEvent: false }); // Uncheck Male
  //   } else if (this.MaleChecked.value) {
  //     this.customerForm.get('genderInfo')?.setValue('MALE');
  //     this.FemaleChecked.setValue(false, { emitEvent: false }); // Uncheck Female
  //   }
  // }
  private stripCurrencyFormatting(value: string): string {
    return value ? value.replace(/[^0-9]/g, '') : '';
  }
  extractPhoneNumber(phone: string): string {
    // Remove non-numeric characters
    const numbersOnly = phone.replace(/\D/g, '');

    // Extract last 9 digits (assuming the phone number format is correct)
    return numbersOnly.length > 9 ? numbersOnly.slice(-9) : numbersOnly;
  }
  updateUndertakenSign() {
    if (this.userStatus == 'IN_REVIEW') {
      this.KycService.addCustomerSign(this.uploadedImageUndertaken, this.type, this.submittedForId).subscribe((data: any) => {
        this.corporateService.completeCustomerKyc(this.item?.submittedFor?.id).subscribe((data: any) => {
          if (data?.responseCode == 200) {
            alert("Updated Successfully")
          }
        })
      })
    }
    else if (this.userStatus == 'APPROVED') {
      this.KycService.updateCustomerSignByMaker(this.uploadedImageUndertaken, this.type, this.submittedForId).subscribe((data: any) => {
        if (data?.responseCode == 200) {
          alert("Updated Successfully")
        }
      })
    }
  }
  checkPhoneExistence(regPhone?: string) {
    let phone;
    if (!regPhone)
      phone = this.customerForm.get('altPh')?.value;
    else
      phone = regPhone

    if (!phone) return;

    let userTypeToCheck = 'CUSTOMER';
    this.corporateService.checkPhoneExist(phone).subscribe(
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
    const idNumber = this.customerForm.get('idNO')?.value;
    let userTypeToCheck = 'CUSTOMER'; // default
    if (idNumber) {
      let req = {
        "idProof": this.customerForm.get('idNO')?.value,
        "kycType": userTypeToCheck
      }
      this.corporateService.checkIDexists(req).subscribe(
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
  checkEmailExistence() {
    const email = this.customerForm.get('email')?.value;
    let userTypeToCheck = 'CUSTOMER'; // default
    if (email) {
      this.corporateService.checkEmailExist(email).subscribe(
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
  updateRegBySign() {
    if (this.userStatus == 'IN_REVIEW') {
      this.KycService.addCustomerPhoto(this.uploadedImage, this.type).subscribe((data: any) => {
        this.corporateService.completeCustomerKyc(this.item?.submittedFor?.id).subscribe((data: any) => {
          if (data?.responseCode == 200) {
            alert("Updated Successfully")
          }
        })
      })
    }
    else if (this.userStatus == 'APPROVED') {
      // this.corporate.addCustomerPhoto(this.uploadedImage, this.type).subscribe((data: any) => {
      // if (data?.responseCode == 200) {
      //   alert("Updated Successfully")
      // }
      // })
    }
  }
  onSubmitEdit() {
    if (this.customerForm.get('dob')?.hasError('underage') || this.customerForm.get('dob')?.hasError('overage')) {
      alert('Please ensure the date of birth is valid (between 18 and 100 years old).');
      return;
    }
    console.log("currCountry start", this.item?.customerKyc?.currCountry);
    // Handle permanent country address logic
    if (this.customerForm.get('countryAddress')?.value === this.item?.customerKyc?.currCountry) {
      this.countryCurReq = this.item?.customerKyc?.currCountry;
      console.log("else countryAddress", this.countryCurReq);
    } else {
      this.countryCurReq = this.customerForm.get('countryAddress')?.value;
      console.log("if countryAddress", this.countryCurReq);
    }
    if (this.customerForm.get('perCountryAddress')?.value === this.item?.customerKyc?.permCountry) {
      this.countryPerReq = this.item?.customerKyc?.permCountry;
      console.log("else countryPerReq", this.countryPerReq);
    } else {
      this.countryPerReq = this.customerForm.get('perCountryAddress')?.value;
      console.log("if countryPerReq", this.countryPerReq);
    }

    // Handle permanent Province address logic
    if (this.customerForm.get('provinceAddress')?.value === this.item?.customerKyc?.currProvince) {
      this.provinceCurReq = this.item?.customerKyc?.currProvince;
    } else {
      this.provinceCurReq = this.customerForm.get('provinceAddress')?.value;
    }
    if (this.customerForm.get('permanentProvince')?.value === this.item?.customerKyc?.permProvince) {
      this.provincePerReq = this.item?.customerKyc?.permProvince;
    } else {
      this.provincePerReq = this.customerForm.get('permanentProvince')?.value;
    }

    // Handle permanent district address logic
    if (this.customerForm.get('districtAddress')?.value === this.item?.customerKyc?.currDistrict) {
      this.districtCurReq = this.item?.customerKyc?.currDistrict;
    } else {
      this.districtCurReq = this.customerForm.get('districtAddress')?.value;
    }
    if (this.customerForm.get('permanentDistrict')?.value === this.item?.customerKyc?.permDistrict) {
      this.districtPerReq = this.item?.customerKyc?.permDistrict;
    } else {
      this.districtPerReq = this.customerForm.get('permanentDistrict')?.value;
    }

    //Birthplace
    if (this.customerForm.get('birthCountryDrop')?.value === this.item?.customerKyc?.custInfoBirthCountry) {
      this.birthCountryReq = this.item?.customerKyc?.custInfoBirthCountry;
    } else {
      this.birthCountryReq = this.customerForm.get('birthCountryDrop')?.value;
    }

    if (this.customerForm.get('birthProvinceDrop')?.value === this.item?.customerKyc?.custInfoBirthProvince) {
      this.birthProvinceReq = this.item?.customerKyc?.custInfoBirthProvince;
    } else {
      this.birthProvinceReq = this.customerForm.get('birthProvinceDrop')?.value;
    }
    //nationalty
    if (this.customerForm.get('nationalityDrop')?.value === this.item?.customerKyc?.custInfoNationality) {
      this.nationalityReq = this.item?.customerKyc?.custInfoNationality;
    } else {
      this.nationalityReq = this.customerForm.get('nationalityDrop')?.value;
    }

    //source
    if (this.customerForm.get('incomeSourceOrg')?.value === this.item?.customerKyc?.sourceOfIncome) {
      this.sourceOfIncomeReq = this.item?.customerKyc?.sourceOfIncome;
    } else {
      this.sourceOfIncomeReq = this.customerForm.get('incomeSourceOrg')?.value;
    }

    //nature
    if (this.customerForm.get('NatureDrop')?.value === this.item?.customerKyc?.bizNature) {
      this.natureReq = this.item?.customerKyc?.bizNature;
    } else {
      this.natureReq = this.customerForm.get('NatureDrop')?.value;
    }

    //purpose
    if (this.customerForm.get('PurposeDrop')?.value === this.item?.customerKyc?.purposeOfAcc) {
      this.purposeOfAccReq = this.item?.customerKyc?.purposeOfAcc;
    } else {
      this.purposeOfAccReq = this.customerForm.get('PurposeDrop')?.value;
    }
    // marital status
    if (this.married.value) {
      this.custMarital = 'MARRIED';
    } else if (this.single.value) {
      this.custMarital = 'SINGLE';
    } else {
      this.custMarital = '';
    }
    if (this.userStatus == "IN_REVIEW") {
      let req = {
        kycInputs: {
          custInfoFirstName: this.customerForm.get('firstName')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('firstName')?.value || '',

          custInfoLastName: this.customerForm.get('lastName')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('lastName')?.value || '',

          custInfoFatherName: this.customerForm.get('fatherName')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('fatherName')?.value || '',

          custProofType: this.customerForm.get('custProofType')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('custProofType')?.value || '',

          purposeOfAcc: this.purposeOfAccReq,

          custProofNumber: this.customerForm.get('idNO')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('idNO')?.value || '',

          custProofDateOfExpiry: this.customerForm.get('expiry')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('expiry')?.value || '',

          custProofDateOfIssue: this.customerForm.get('issue')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('issue')?.value || '',

          tazkiraPageNo: this.customerForm.get('pageNo')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('pageNo')?.value || '',

          tazkiraBookNo: this.customerForm.get('bookNo')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('bookNo')?.value || '',

          tazkiraRegNo: this.customerForm.get('regNo')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('regNo')?.value || '',


          custInfoDob: this.customerForm.get('dob')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('dob')?.value || '',

          custInfoBirthCountry: this.birthCountryReq,

          custInfoBirthProvince: this.birthProvinceReq,

          custInfoNationality: this.nationalityReq,
          custInfoGender: this.selectedGender,
          custInfoMaritalStatus: this.custMarital,
          custInfoAltPhone: this.customerForm.get('altPh')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.extractPhoneNumber(this.customerForm.get('altPh')?.value || ''),

          custInfoEmail: this.customerForm.get('email')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('email')?.value || '',

          // custInfoPurposeOfAcc: this.customerForm.get('purpose')?.value?.toUpperCase() === 'NIL'
          //   ? ''
          //   : this.customerForm.get('purpose')?.value || '',


          currLocation: this.customerForm.get('loc')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('loc')?.value || '',

          currCountry: this.countryCurReq,
          currProvince: this.provinceCurReq,
          currDistrict: this.districtCurReq,

          permCountry: this.countryPerReq,
          permProvince: this.provincePerReq,
          permDistrict: this.districtPerReq,


          employmentType: this.customerForm.get('employmentType')?.value || '',
          employerName: this.customerForm.get('employerName')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('employerName')?.value || '',

          sourceOfIncome: this.sourceOfIncomeReq,

          positionHeld: this.customerForm.get('position')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('position')?.value || '',
          monthlyTurnover: (this.customerForm.get('turnover')?.value || '')
            .replace(/[^0-9]/g, ''),
          // (this.customerForm.get('income')?.value || '').replace('AFN', '').trim()
          monthlyIncome:
            (this.customerForm.get('income')?.value || '')
              .replace(/[^0-9]/g, ''),
          tinNumber: this.customerForm.get('tin')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('tin')?.value || '',
          bizNature: this.natureReq,
          govtOrgName: this.customerForm.get('govtOrgName')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('govtOrgName')?.value || '',

          govtPositionHeld: this.customerForm.get('govtPosition')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('govtPosition')?.value || '',


          // nokName: this.customerForm.get('kinName')?.value?.toUpperCase() === 'NIL'
          //   ? ''
          //   : this.customerForm.get('kinName')?.value || '',

          // nokFatherName: this.customerForm.get('kinFather')?.value?.toUpperCase() === 'NIL'
          //   ? ''
          //   : this.customerForm.get('kinFather')?.value || '',

          // nokRelationship: this.customerForm.get('kinRelation')?.value?.toUpperCase() === 'NIL'
          //   ? ''
          //   : this.customerForm.get('kinRelation')?.value || '',

          // nokPhone: this.customerForm.get('kinMobile')?.value?.toUpperCase() === 'NIL'
          //   ? ''
          //   : this.extractPhoneNumber(this.customerForm.get('kinMobile')?.value || ''),

          // nokLocation: this.customerForm.get('kinAddress')?.value?.toUpperCase() === 'NIL'
          //   ? ''
          //   : this.customerForm.get('kinAddress')?.value || '',

        },
        kycType: "CUSTOMER",
        submittedFor: this.item?.submittedFor?.id
      }
      // this.isLoading = true;
      this.corporateService.customerKYCUpdate(req).subscribe((data: any) => {
        // this.isLoading = false;
        if (data?.responseCode == 200) {
          this.corporateService.completeCustomerKyc(this.item?.submittedFor?.id).subscribe((data: any) => {
            if (data?.responseCode == 200) {
              // alert("Registartion completed successfully");
              alert("Updated Successfully");
              // this.router.navigate(["kyc/customer"]);
            }
          })
        }
        else {
          alert("failed")
        }
      })
    }
    else if (this.userStatus == "APPROVED") {
      let req = {
        kycInputs: {
          custInfoFirstName: this.customerForm.get('firstName')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('firstName')?.value || '',

          custInfoLastName: this.customerForm.get('lastName')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('lastName')?.value || '',

          custInfoFatherName: this.customerForm.get('fatherName')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('fatherName')?.value || '',

          custProofType: this.customerForm.get('custProofType')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('custProofType')?.value || '',

          purposeOfAcc: this.purposeOfAccReq,

          custProofNumber: this.customerForm.get('idNO')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('idNO')?.value || '',

          custProofDateOfExpiry: this.customerForm.get('expiry')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('expiry')?.value || '',

          custProofDateOfIssue: this.customerForm.get('issue')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('issue')?.value || '',

          tazkiraPageNo: this.customerForm.get('pageNo')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('pageNo')?.value || '',

          tazkiraBookNo: this.customerForm.get('bookNo')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('bookNo')?.value || '',

          tazkiraRegNo: this.customerForm.get('regNo')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('regNo')?.value || '',


          custInfoDob: this.customerForm.get('dob')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('dob')?.value || '',

          custInfoBirthCountry: this.birthCountryReq,

          custInfoBirthProvince: this.birthProvinceReq,

          custInfoNationality: this.nationalityReq,
          custInfoGender: this.selectedGender,
          custInfoMaritalStatus: this.custMarital,
          custInfoAltPhone: this.customerForm.get('altPh')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.extractPhoneNumber(this.customerForm.get('altPh')?.value || ''),

          custInfoEmail: this.customerForm.get('email')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('email')?.value || '',

          // custInfoPurposeOfAcc: this.customerForm.get('purpose')?.value?.toUpperCase() === 'NIL'
          //   ? ''
          //   : this.customerForm.get('purpose')?.value || '',


          currLocation: this.customerForm.get('loc')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('loc')?.value || '',

          currCountry: this.countryCurReq,
          currProvince: this.provinceCurReq,
          currDistrict: this.districtCurReq,

          permCountry: this.countryPerReq,
          permProvince: this.provincePerReq,
          permDistrict: this.districtPerReq,


          employmentType: this.customerForm.get('employmentType')?.value || '',
          employerName: this.customerForm.get('employerName')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('employerName')?.value || '',

          sourceOfIncome: this.sourceOfIncomeReq,

          positionHeld: this.customerForm.get('position')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('position')?.value || '',
          monthlyTurnover: (this.customerForm.get('turnover')?.value || '')
            .replace(/[^0-9]/g, ''),
          // (this.customerForm.get('income')?.value || '').replace('AFN', '').trim()
          monthlyIncome:
            (this.customerForm.get('income')?.value || '')
              .replace(/[^0-9]/g, ''),
          tinNumber: this.customerForm.get('tin')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('tin')?.value || '',
          bizNature: this.natureReq,
          govtOrgName: this.customerForm.get('govtOrgName')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('govtOrgName')?.value || '',

          govtPositionHeld: this.customerForm.get('govtPosition')?.value?.toUpperCase() === 'NIL'
            ? ''
            : this.customerForm.get('govtPosition')?.value || '',


          // nokName: this.customerForm.get('kinName')?.value?.toUpperCase() === 'NIL'
          //   ? ''
          //   : this.customerForm.get('kinName')?.value || '',

          // nokFatherName: this.customerForm.get('kinFather')?.value?.toUpperCase() === 'NIL'
          //   ? ''
          //   : this.customerForm.get('kinFather')?.value || '',

          // nokRelationship: this.customerForm.get('kinRelation')?.value?.toUpperCase() === 'NIL'
          //   ? ''
          //   : this.customerForm.get('kinRelation')?.value || '',

          // nokPhone: this.customerForm.get('kinMobile')?.value?.toUpperCase() === 'NIL'
          //   ? ''
          //   : this.extractPhoneNumber(this.customerForm.get('kinMobile')?.value || ''),

          // nokLocation: this.customerForm.get('kinAddress')?.value?.toUpperCase() === 'NIL'
          //   ? ''
          //   : this.customerForm.get('kinAddress')?.value || '',

        },
        kycType: "CUSTOMER",
        submittedFor: this.item?.submittedFor?.id
      }
      // this.isLoading = true;
      this.corporateService.customerKYCUpdateByMaker(req).subscribe((data: any) => {
        // this.isLoading = false;
        if (data?.responseCode == 200) {
          alert("Updated Successfully")
          this.router.navigate(["kyc/kyc-edit-requests"]);
        }
        else {
          alert(data?.error)
        }
      })
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
  // goback() {
  //   this.router.navigateByUrl('/kyc/agent')
  // }
  goback() {
    this.router.navigateByUrl(this.previousRoute);
  }
  closeAlert() {
    this.alertMessage = null;
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

  updatePhoneEmail(meta: string) {
    let value;
    let comments;
    let fileSelected;

    if (meta == 'PHONE') {
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
      if (data.responseCode == 200) {
        // Try multiple ways to get the ID from response
        const requestId = data?.data;
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
      else if (data.responseCode == 0) {
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
}

// getAllKyc() {
//   //old
//   // this.isLoading = true;
//   // this.KycService.getAllKyc().subscribe((data: any) => {
//   //   if (!data) {
//   //     this.isLoading = false;
//   //     alert("Something went wrong")
//   //   }
//   //   this.isLoading = false;
//   //   this.users = data?.data
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
//     //new item passed
//     // this.KycService.getAllKyc().subscribe((data: any) => {
//     //new item passed
//     // this.data = data?.data
//     // this.allData = [...this.data]
//     //new item passed
//     // this.users = data?.data
//     // this.allUsers = [this.users]
//     this.users = Array.isArray(data?.data) ? data.data : [];
//     this.allUsers = [...this.users];
//     console.log('Fetched users:', this.users);
//     this.isLoading = false; // Set loading state to true when starting API call

//     //new
//     // for (let item of this.allUsers) {
//     // if (this.kycId == item?.id) {
//     this.userStatus = this.item?.status;
//     this.approvedByComplianceValue = this.item?.customerKyc?.approvedByComplianceFullName
//     console.log("approvedByComplianceValue", this.approvedByComplianceValue)
//     this.approvedByComplianceDateValue = this.item?.customerKyc?.approvedByComplianceDate
//     console.log("approvedByComplianceDateValue", this.approvedByComplianceDateValue)
//     if (this.userStatus === 'IN_REVIEW') {
//       this.compForm.get('ComplianceInput')?.setValue(this.loginUser);
//       console.log("this.loginUser1", this.loginUser)
//       this.compForm.get('ComplianceDateInput')?.setValue(this.currentDate);
//     } else {
//       this.compForm.get('ComplianceInput')?.setValue(this.approvedByComplianceValue);
//       this.compForm.get('ComplianceDateInput')?.setValue(this.approvedByComplianceDateValue);
//     }

//     this.seqNo = this.item?.seqNo;
//     this.ProofType = this.item?.customerKyc?.custProofType
//     console.log('ProofType :', this.ProofType);
//     if (this.item?.customerKyc?.attachments.length != 0) {
//       let i = 1;
//       for (let file of this.item.customerKyc.attachments) {
//         this.fileLists.push({
//           name: 'Attachment - ' + i,
//           url: this.imageUrl + '/kyc/static/' + file
//           // url: this.imageUrl + '/um/static/profile/' + file
//         })
//         i++;

//       }
//     }
//     //new
//     if (this.item?.customerKyc?.otherDocs) {
//       const otherDocsArray = this.item.customerKyc.otherDocs.split(',');
//       let i = 1;
//       for (let file of otherDocsArray) {
//         this.fileLists.push({
//           name: 'Other Document - ' + i,
//           url: `${this.imageUrl}/kyc/static/${file}`,
//         });
//         i++;
//       }
//     }
//     //new
//     // this.watchlistRemark = item?.customerKyc?.watchlistRemark
//     //remark
//     this.watchlistRemarksVal = this.item?.customerKyc?.watchlistRemarks
//     console.log("watchlistRemarksVal", this.watchlistRemarksVal)
//     if (this.watchlistRemarksVal) {
//       this.readOnly = true;
//     }
//     else if (this.watchlistRemarksVal == 'NIL' || !this.watchlistRemarksVal) {
//       this.readOnly = false;
//     }
//     //ComplianceValue

//     // if (this.userStatus=="IN_REVIEW") {
//     //   this.compForm.get('ComplianceInput')?.setValue(this.loginUser);
//     //   this.readOnly = true;
//     // }
//     // else {
//     //   this.compForm.get('ComplianceInput')?.setValue(this.approvedByComplianceValue);
//     // }

//     //ComplianceDate

//     this.rejectReasonValue = this.item?.rejectReason
//     this.submittedForId = this.item?.submittedFor?.id
//     // this.showApprove1Btn = false;
//     // this.showApprove2Btn = false;
//     // this.showApproveFinalBtn = false;
//     // this.approveStatus = item?.status
//     // if (this.approveStatus === 'IN_REVIEW') {
//     //   this.showApprove1Btn = true;
//     // } else if (this.approveStatus === 'VERIFIED_L1') {
//     //   this.showApprove2Btn = true;
//     // } else if (this.approveStatus == "VERIFIED_L2") {
//     //   this.showApproveFinalBtn = true;
//     // }

//     // if (userStatus === 'REJECTED' || userStatus === 'APPROVED') {
//     //   this.showRejectButton = false;
//     //   this.showApproveButton = false;
//     // }
//     // else if(userStatus==='IN_REVIEW'){
//     //   this.showRejectButton = true;
//     //   this.showApproveButton = true;
//     // }
//     // this.showUpdateButton = (userStatus === 'REJECTED');
//     // }
//     // }
//     //as mikyc
//     // for (let item of this.allUsers) {
//     // if (this.kycId == item?.id) {
//     this.customerId = this.item?.id;
//     this.activeFlag = this.item?.submittedFor?.active;
//     this.deletedFlag = this.item?.submittedFor?.deleted;
//     if (this.item?.status == 'IN_REVIEW' || 'APPROVED') {
//       this.readOnly = true;
//     }
//     else {
//       this.readOnly = false;
//     }
//     if (this.item?.customerKyc?.custInfoGender == "MALE") {
//       this.MaleChecked.setValue(true);
//     }
//     if (this.item?.customerKyc?.custInfoGender == "FEMALE") {
//       this.FemaleChecked.setValue(true);
//     }
//     if (this.item?.customerKyc?.custInfoMaritalStatus == "SINGLE") {
//       this.single.setValue(true);
//     }
//     if (this.item?.customerKyc?.custInfoMaritalStatus == "MARRIED") {
//       this.married.setValue(true);
//     }
//     //risk
//     if (this.item?.customerKyc?.riskCategory == "LOW") {
//       this.riskLow.setValue(true);
//       // this.riskLowCheck = item?.customerKyc?.riskLow

//     }
//     if (this.item?.customerKyc?.riskCategory == "MEDIUM") {
//       this.riskMedium.setValue(true);
//       // this.riskMediumCheck = item?.customerKyc?.riskMedium
//     }
//     if (this.item?.customerKyc?.riskCategory == "HIGH") {
//       this.riskHigh.setValue(true);
//       // this.riskhighCheck = item?.customerKyc?.riskHigh
//     }
//     // if (this.readOnly) {
//     //   this.riskLow.disable();
//     //   this.riskMedium.disable();
//     //   this.riskHigh.disable();
//     //   this.watchYes.disable();
//     //   this.watchNo.disable();
//     // }
//     //watchlist
//     console.log("checkedWatchlist", this.item?.customerKyc?.checkedWatchlist)
//     if (this.item?.customerKyc?.checkedWatchlist) {
//       this.watchYes.setValue(true);
//       this.watchNo.setValue(false);
//     }
//     else if (!this.item?.customerKyc?.checkedWatchlist && this.item?.customerKyc?.checkedWatchlist != null) {
//       this.watchYes.setValue(false);
//       this.watchNo.setValue(true);
//     }
//     else {
//       this.watchYes.setValue(false);
//       this.watchNo.setValue(false);
//     }
//     // custInfoMarried
//     // custInfoSingle
//     if (this.item?.customerKyc?.custInfoProofType == 'Paper Tazkira') {
//       this.prooftype = 'Paper Tazkira';

//     }
//     else {
//       this.prooftype = '';
//     }
//     this.undertakenSign = this.item?.customerKyc?.custSignaturePhoto;
//     this.fileLists.push({
//       name: 'Customer Signature',
//       url: this.imageUrl + '/kyc/static/' + this.undertakenSign
//     })
//     // this.kycSign = item?.customerKyc?.agentSign_img_0;
//     // this.agentVerifySign = item?.customerKyc?.superAgentSign_img_0;
//     // this.opSign = item?.customerKyc?.opsSign_img_1;

//     this.compSign = this.item?.customerKyc?.complianceSignaturePhoto;
//     this.compHedSign = this.item?.customerKyc?.complianceHeadSignaturePhoto;
//     this.ceoSign = this.item?.customerKyc?.ceoSignaturePhoto;

//     if (this.item?.customerKyc?.custPhoto) {
//       this.CustomerImg = this.item?.customerKyc?.custPhoto;
//       console.log("CustomerImg111", this.CustomerImg)
//       this.fileLists.push({
//         name: 'Customer Profile Picture',
//         url: this.imageUrl + '/kyc/static/' + this.CustomerImg
//         // url: this.imageUrl + '/um/static/profile/' + this.CustomerImg
//       })
//     }

//     console.log("Files", this.fileLists);


//     // this.setFieldValue('middleName', item?.customerKyc?.custInfoMiddleName);
//     // this.setFieldValue('firstName', item?.customerKyc?.custInfoFirstName);
//     // this.setFieldValue('fatherName', item?.customerKyc?.custInfoFatherName);
//     // this.setFieldValue('surName', item?.customerKyc?.custInfoSurname);
//     // this.setFieldValue('birthPlace', item?.customerKyc?.custInfoPlaceOfBirth);
//     // this.setFieldValue('dob', item?.customerKyc?.custInfoDob);
//     // this.setFieldValue('bookNo', item?.customerKyc?.custInfoBookNo);
//     // this.setFieldValue('pageNo', item?.customerKyc?.custInfoPageNo);
//     // this.setFieldValue('regNo', item?.customerKyc?.custInfoRegNo);
//     // this.setFieldValue('tazkira', item?.customerKyc?.custInfoTazkira);
//     // this.setFieldValue('nationality', item?.customerKyc?.custInfoNationality);
//     // this.setFieldValue('expiry', item?.customerKyc?.custInfoDateOfExpiry);
//     // this.setFieldValue('issue', item?.customerKyc?.custInfoDateOfIssue);
//     // this.setFieldValue('accountOpenDate', item?.customerKyc?.custInfoAccOpenDate);
//     // this.setFieldValue('MMwallet', item?.customerKyc?.custInfoMMWallet);
//     // this.setFieldValue('email', item?.customerKyc?.custInfoEmail);
//     // this.setFieldValue('contactNO', item?.submittedFor?.phone);

//     // this.setFieldValue('houseNO', item?.customerKyc?.currHouseNo);
//     // this.setFieldValue('loc', item?.customerKyc?.currLocation);
//     // this.setFieldValue('province', item?.customerKyc?.currProvince);
//     // this.setFieldValue('street', item?.customerKyc?.currStreet);
//     // this.setFieldValue('district', item?.customerKyc?.currDistrict);
//     // this.setFieldValue('country', item?.customerKyc?.currCountry);

//     // this.setFieldValue('perHouseNO', item?.customerKyc?.permHouseNo);
//     // this.setFieldValue('perLoc', item?.customerKyc?.permLocation);
//     // this.setFieldValue('perProvince', item?.customerKyc?.permProvince);
//     // this.setFieldValue('perStreet', item?.customerKyc?.permStreet);
//     // this.setFieldValue('perDistrict', item?.customerKyc?.permDistrict);
//     // this.setFieldValue('perCountry', item?.customerKyc?.permCountry);

//     // this.setFieldValue('employmentType', item?.customerKyc?.employementType);
//     // this.setFieldValue('natureofBusiness', item?.customerKyc?.bizNature);
//     // this.setFieldValue('position', item?.customerKyc?.positionHeld);
//     // this.setFieldValue('source', item?.customerKyc?.occupation);
//     // this.setFieldValue('employerName', item?.customerKyc?.employerName);
//     // this.setFieldValue('income', item?.customerKyc?.salary);
//     // this.setFieldValue('service', item?.customerKyc?.periodOfService);
//     // this.setFieldValue('turnover', item?.customerKyc?.monthlyTurnover);
//     // this.setFieldValue('purpose', item?.customerKyc?.purposeOfAcc);
//     // this.setFieldValue('tin', item?.customerKyc?.tinNumber);

//     // this.setFieldValue('kinName', item?.customerKyc?.nokName);
//     // this.setFieldValue('kinMobile', item?.customerKyc?.nokMobile);
//     // this.setFieldValue('kinFather', item?.customerKyc?.nokFatherName);
//     // this.setFieldValue('kinRelation', item?.customerKyc?.nokRelationship);
//     // this.setFieldValue('kinEmail', item?.customerKyc?.nokEmail);
//     // this.setFieldValue('kinHouse', item?.customerKyc?.nokHouseNo);
//     // this.setFieldValue('kinAddress', item?.customerKyc?.nokLocation);
//     // this.setFieldValue('kinProvince', item?.customerKyc?.nokProvince);
//     // this.setFieldValue('kinStreet', item?.customerKyc?.nokStreet);
//     // this.setFieldValue('kinDistrict', item?.customerKyc?.nokDistrict);
//     // this.setFieldValue('kinCountry', item?.customerKyc?.nokCountry);

//     // this.setFieldValue('agentLicense', item?.customerKyc?.agentLicenseNo);
//     // this.setFieldValue('agentName', item?.customerKyc?.agentName);
//     // this.setFieldValue('agentPos', item?.customerKyc?.agentPOS);
//     // this.setFieldValue('agentLoc', item?.customerKyc?.agentLocation);
//     // this.setFieldValue('agentIccid', item?.customerKyc?.agentICCID);
//     // this.setFieldValue('agentPtid', item?.customerKyc?.agentPTID);
//     // this.setFieldValue('kyc', item?.customerKyc?.kycProcessedBy);
//     // this.setFieldValue('kycDate', item?.customerKyc?.kycProcessedDate);
//     // this.setFieldValue('agentVerify', item?.customerKyc?.superAgentVerification);
//     // this.setFieldValue('agentVerifyDate', item?.customerKyc?.superAgentVerificationDate);

//     // this.setFieldValue('opVerify', item?.customerKyc?.verifiedByOps);
//     // this.setFieldValue('opVerifyDate', item?.customerKyc?.verifiedByOpsDate);
//     // this.setFieldValue('compVerify', item?.customerKyc?.approvedByCompliance);
//     // this.setFieldValue('compVerifyDate', item?.customerKyc?.approvedByComplianceDate);


//     this.customerForm.patchValue({ firstName: this.item?.customerKyc?.custInfoFirstName || '' })
//     this.customerForm.patchValue({ lastName: this.item?.customerKyc?.custInfoLastName || '' })
//     this.customerForm.patchValue({ fatherName: this.item?.customerKyc?.custInfoFatherName || '' })
//     this.customerForm.patchValue({ walletNO: this.item?.customerKyc?.custInfoMMWallet || 'NIL' })
//     this.customerForm.patchValue({ dob: this.item?.customerKyc?.custInfoDob || 'NIL' })
//     let altphone = "+93" + " " + this.item?.customerKyc?.custInfoAltPhone.slice(-9)
//     this.customerForm.patchValue({ altPh: altphone || 'NIL' })

//     this.dobValue = this.item?.customerKyc?.custInfoDob
//     console.log("dobValue", this.dobValue)
//     this.customerForm.patchValue({ email: this.item?.customerKyc?.custInfoEmail || 'NIL' });
//     this.customerForm.patchValue({ nationality: this.item?.customerKyc?.custInfoNationality || 'NIL' });
//     this.customerForm.patchValue({ birthCountry: this.item?.customerKyc?.custInfoBirthCountry || 'NIL' })
//     this.customerForm.patchValue({ birthProvince: this.item?.customerKyc?.custInfoBirthProvince || 'NIL' })

//     // this.customerForm.patchValue({ tazkira: item?.customerKyc?.custInfoTazkira || 'NIL' })
//     // this.customerForm.patchValue({ nationality: item?.customerKyc?.custInfoNationality || 'NIL' })
//     // this.customerForm.patchValue({ accountOpenDate: item?.customerKyc?.custInfoAccOpenDate || 'NIL' })
//     // this.customerForm.patchValue({ MMwallet: item?.customerKyc?.custInfoMMWallet || 'NIL' })
//     // this.customerForm.patchValue({ email: item?.customerKyc?.custInfoEmail || 'NIL' })
//     let phone = "+93" + " " + this.item?.submittedFor?.phone.slice(-9)
//     this.customerForm.patchValue({ contactNO: phone || 'NIL' })
//     this.CustomerfirstName = this.item?.customerKyc?.firstName;
//     console.log('this.CustomerfirstName11:', this.CustomerfirstName);
//     console.log("province11:", this.item?.customerKyc?.currProvince)
//     this.CustomerLastName = this.item?.customerKyc?.lastName
//     this.CustomerFathername = this.item?.customerKyc?.custInfoFatherName;

//     this.customerForm.patchValue({ houseNO: this.item?.customerKyc?.currHouseNo || 'NIL' })
//     this.customerForm.patchValue({ loc: this.item?.customerKyc?.currLocation || 'NIL' })
//     this.customerForm.patchValue({ province: this.item?.customerKyc?.currProvince || 'NIL' })
//     this.customerForm.patchValue({ street: this.item?.customerKyc?.currStreet || 'NIL' })
//     this.customerForm.patchValue({ district: this.item?.customerKyc?.currDistrict || 'NIL' })
//     this.customerForm.patchValue({ country: this.item?.customerKyc?.currCountry || 'NIL' })


//     this.customerForm.patchValue({ perHouseNO: this.item?.customerKyc?.permHouseNo || 'NIL' })
//     this.customerForm.patchValue({ perLoc: this.item?.customerKyc?.permLocation || 'NIL' })
//     this.customerForm.patchValue({ perProvince: this.item?.customerKyc?.permProvince || 'NIL' })
//     this.customerForm.patchValue({ perStreet: this.item?.customerKyc?.permStreet || 'NIL' })
//     this.customerForm.patchValue({ perDistrict: this.item?.customerKyc?.permDistrict || 'NIL' })
//     this.customerForm.patchValue({ perCountry: this.item?.customerKyc?.permCountry || 'NIL' })

//     this.customerForm.patchValue({ employmentType: this.item?.customerKyc?.employmentType || 'NIL' })
//     // this.customerForm.patchValue({
//     //   employmentType: this.formatEmploymentType(item?.customerKyc?.employmentType || 'NIL')
//     // });

//     this.customerForm.patchValue({ source: this.item?.customerKyc?.sourceOfIncome || 'NIL' })
//     this.customerForm.patchValue({ natureofBusiness: this.item?.customerKyc?.bizNature || 'NIL' })
//     this.customerForm.patchValue({ employerName: this.item?.customerKyc?.employerName || 'NIL' })
//     this.customerForm.patchValue({ position: this.item?.customerKyc?.positionHeld || 'NIL' })

//     // this.customerForm.patchValue({ income: item?.customerKyc?.monthlyIncome || 'NIL' })
//     // this.customerForm.patchValue({
//     //   income: item?.customerKyc?.monthlyIncome ? `AFN ${item.customerKyc.monthlyIncome}` : 'NIL'
//     // });
//     this.customerForm.patchValue({
//       income: this.item?.customerKyc?.monthlyIncome
//         ? `AFN ${this.formatNumber(this.item.customerKyc.monthlyIncome)}`
//         : 'NIL'
//     });
//     this.customerForm.patchValue({ service: this.item?.customerKyc?.periodOfService || 'NIL' })
//     // this.customerForm.patchValue({ turnover: item?.customerKyc?.monthlyTurnover || 'NIL' })

//     this.customerForm.patchValue({
//       turnover: this.item?.customerKyc?.monthlyTurnover
//         ? `AFN ${this.formatNumber(this.item.customerKyc.monthlyTurnover)}`
//         : 'NIL'
//     });
//     this.customerForm.patchValue({ tin: this.item?.customerKyc?.tinNumber || 'NIL' })
//     this.customerForm.patchValue({ govtOrgName: this.item?.customerKyc?.govtOrgName || 'NIL' })
//     this.customerForm.patchValue({ govtPosition: this.item?.customerKyc?.govtPositionHeld || 'NIL' })
//     this.customerForm.patchValue({ sourceOfFund: this.item?.customerKyc?.sourceOfIncome || 'NIL' })

//     this.customerForm.patchValue({ kinName: this.item?.customerKyc?.nokName || 'NIL' })
//     let Kinphone = "+93" + " " + this.item?.customerKyc?.nokPhone.slice(-9)
//     this.customerForm.patchValue({ kinMobile: Kinphone || 'NIL' })
//     this.customerForm.patchValue({ kinFather: this.item?.customerKyc?.nokFatherName || 'NIL' })
//     this.customerForm.patchValue({ kinRelation: this.item?.customerKyc?.nokRelationship || 'NIL' })
//     this.customerForm.patchValue({ kinAddress: this.item?.customerKyc?.nokLocation || 'NIL' })

//     this.customerForm.patchValue({ kinEmail: this.item?.customerKyc?.nokEmail || 'NIL' })
//     this.customerForm.patchValue({ kinHouse: this.item?.customerKyc?.nokHouseNo || 'NIL' })
//     this.customerForm.patchValue({ kinProvince: this.item?.customerKyc?.nokProvince || 'NIL' })
//     this.customerForm.patchValue({ kinStreet: this.item?.customerKyc?.nokStreet || 'NIL' })
//     this.customerForm.patchValue({ kinDistrict: this.item?.customerKyc?.nokDistrict || 'NIL' })
//     this.customerForm.patchValue({ kinCountry: this.item?.customerKyc?.nokCountry || 'NIL' })

//     this.CustomerApplicant = this.customerForm.get('firstName')?.value + ' ' + this.customerForm.get('lastName')?.value;
//     this.CustomerApplicantDate = this.item?.customerKyc?.undertakenDate;

//     this.customerForm.patchValue({ purpose: this.item?.customerKyc?.purposeOfAcc || 'NIL' })
//     this.customerForm.patchValue({ custProofType: this.item?.customerKyc?.custProofType || 'NIL' })
//     // this.customerForm.patchValue({
//     //   custProofType: this.formatProofType(item?.customerKyc?.custProofType || 'NIL')
//     // });
//     this.customerForm.patchValue({ idNO: this.item?.customerKyc?.custProofNumber || 'NIL' });
//     this.customerForm.patchValue({ issue: this.item?.customerKyc?.custProofDateOfIssue || 'NIL' });
//     this.customerForm.patchValue({ expiry: this.item?.customerKyc?.custProofDateOfExpiry || 'NIL' });
//     this.customerForm.patchValue({ bookNo: this.item?.customerKyc?.tazkiraBookNo || 'NIL' });
//     this.customerForm.patchValue({ pageNo: this.item?.customerKyc?.tazkiraPageNo || 'NIL' });
//     this.customerForm.patchValue({ regNo: this.item?.customerKyc?.tazkiraRegNo || 'NIL' });

//     this.customerForm.patchValue({ agentLicense: this.item?.customerKyc?.agentLicenseNo || 'NIL' })
//     this.customerForm.patchValue({ agentName: this.item?.customerKyc?.agentName || 'NIL' })
//     this.customerForm.patchValue({ agentPos: this.item?.customerKyc?.agentPOS || 'NIL' })
//     this.customerForm.patchValue({ agentLoc: this.item?.customerKyc?.agentLocation || 'NIL' })
//     this.customerForm.patchValue({ agentIccid: this.item?.customerKyc?.agentICCID || 'NIL' })
//     this.customerForm.patchValue({ agentPtid: this.item?.customerKyc?.agentPTID || 'NIL' })

//     this.customerForm.patchValue({ kyc: this.item?.customerKyc?.kycProcessedBy || 'NIL' })
//     this.customerForm.patchValue({ kycDate: this.item?.customerKyc?.kycProcessedDate || 'NIL' })
//     this.customerForm.patchValue({ agentVerify: this.item?.customerKyc?.superAgentVerification || 'NIL' })
//     this.customerForm.patchValue({ agentVerifyDate: this.item?.customerKyc?.superAgentVerificationDate || 'NIL' })


//     this.customerForm.patchValue({ opVerify: this.item?.customerKyc?.verifiedByOps || 'NIL' })
//     this.customerForm.patchValue({ opVerifyDate: this.item?.customerKyc?.verifiedByOpsDate || 'NIL' })
//     this.customerForm.patchValue({ compVerify: this.item?.customerKyc?.approvedByCompliance || 'NIL' })
//     this.customerForm.patchValue({ compVerifyDate: this.item?.customerKyc?.approvedByComplianceDate || 'NIL' })
//     //this.customerForm.controls['FemaleChecked'].disable();
//     //this.readOnly ? this.FemaleChecked.disable() : this.FemaleChecked.enable()
//     if (this.readOnly) {
//       this.FemaleChecked.disable();
//       this.MaleChecked.disable();
//       this.married.disable();
//       this.single.disable();
//     }

//     //old  patch value
//     // this.CustomerMiddleName = item?.customerKyc?.middleName;
//     // this.CustomerSurName = item?.customerKyc?.custInfoSurname;
//     // this.CustomerDob = item?.customerKyc?.custInfoDob;
//     // this.CustomerBirthPlace = item?.customerInfo?.placeOfBirth;
//     // this.CustomerNationality = item?.customerKyc?.custInfoNationality;
//     // this.CustomerTazkira = item?.customerKyc?.custInfoTazkira;
//     // this.CustomerIssue = item?.customerInfo?.dateOfIssue;
//     // this.CustomerExpiry = item?.customerInfo?.dateOfExpiry;
//     // this.CustomerWallet = item?.customerInfo?.mmWalletNo;
//     // this.CustomerAccountOpenDate = item?.customerInfo?.accOpenDate;
//     // this.CustomerGender = item?.customerKyc?.gender;
//     // this.CustomerMarital = item?.customerInfo?.maritalStatus;
//     // this.CustomerContact = item?.customerKyc?.custInfoAltPhone;
//     // this.CustomerEmail = item?.customerKyc?.custInfoEmail;
//     // this.CustomerTurnover = item?.customerInfo?.monthlyTurnOver;
//     // this.CustomerPurpose = item?.customerInfo?.purposeOfAcc;

//     // this.CustomerHouse = item?.customerKyc?.currHouseNo;
//     // this.CustomerLocation = item?.customerKyc?.currLocation;
//     // this.CustomerProvince = item?.customerKyc?.currProvince;
//     // this.CustomerStreet = item?.customerKyc?.currStreet;
//     // this.CustomerDistrict = item?.customerKyc?.currDistrict;
//     // this.CustomerCountry = item?.customerKyc?.currCountry;

//     // this.CustomerPermanentHouseNo = item?.permanentAddress?.permHouseNo;
//     // this.CustomerPermanentLocation = item?.permanentAddress?.permLocation;
//     // this.CustomerPermanentProvince = item?.permanentAddress?.permProvince;
//     // this.CustomerPermanentStreet = item?.permanentAddress?.permStreet;
//     // this.CustomerPermanentDistrict = item?.permanentAddress?.permDistrict;
//     // this.CustomerPermanentCountry = item?.permanentAddress?.permCountry;


//     // this.CustomerSource = item?.customerKyc?.occupation;
//     // this.CustomerPosition = item?.professionDetails?.positionHeld;
//     // this.CustomerService = item?.professionDetails?.periodOfService;
//     // this.CustomerMonthlyIncome = item?.customerKyc?.salary;
//     // this.CustomerProfTurnover = item?.professionDetails?.monthlyTurnOver;
//     // this.CustomerProfPurpose = item?.professionDetails?.purposeOfAcc;
//     // this.CustomerProfTin = item?.professionDetails?.tinNumber

//     // this.CustomerKINname = item?.customerKyc?.nokName;
//     // this.CustomerKINmobile = item?.customerKyc?.nokMobile;
//     // this.CustomerKINfatherName = item?.nextOfKin?.nextOfKinFatherName;
//     // this.CustomerRelationship = item?.nextOfKin?.relationship;
//     // this.kinEmail = item?.customerKyc?.nokEmail;
//     // this.kinHouse = item?.customerKyc?.nokHouseNo;
//     // this.kinLocation = item?.customerKyc?.nokLocation;
//     // this.kinProvince = item?.customerKyc?.nokProvince;
//     // this.kinStreet = item?.customerKyc?.nokStreet;
//     // this.kinDistrict = item?.kyhttps://github.com/mindlabsolutions/abmmc-mipay/pull/235cInputs?.nokDistrict;
//     // this.kinCountry = item?.customerKyc?.nokCountry;

//     // this.CustomerAgentName = item?.agentVerificationagentVerification?.agentName;
//     // this.CustomerLicense = item?.agentVerification?.licenseNo;
//     // this.CustomerAgentLocation = item?.agentVerification?.agentLocation;
//     // this.CustomerPOSno = item?.agentVerification?.posNo;
//     // this.CustomerPTIDAgentVerify = item?.agentVerification?.ptidNo;
//     // this.CustomerICCIDAgentVerify = item?.agentVerification?.iccidNo;

//     // this.CustomerKYCProcessedBy = item?.agentVerification?.kycProcessedBy;
//     // this.CustomerKYCDate = item?.agentVerification?.processingDate;
//     // this.CustomerAgentVerification = item?.agentVerification?.superAgentVerification;
//     // this.CustomerAgentVerifiedDate = item?.agentVerification?.verificationDate;

//     // this.CustomerVerified = item?.abmmcVerification?.verifiedByOperation;
//     // this.CustomerVerifiedDate = item?.abmmcVerification?.verifyDate;
//     // this.CustomerCompliance = item?.abmmcVerification?.approvedByCompliance;
//     // this.CustomerComplianceDate = item?.abmmcVerification?.approvedDate;
//     // }
//     // }
//     //end
//     //saveproduct
//     // for (let item of this.allUsers) {
//     // if (this.kycId == item?.id) {
//     this.walletaccounts = this.item?.submittedFor?.walletAccount
//     console.log(" this.walletaccounts", this.walletaccounts);
//     // }
//     // }
//     //new item passed
//   })
// }