import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../../environments/environment";
import { KycModuleService } from "../../kyc/kyc/kyc-module.service";
import { UserManagementService } from "../../user-management/user-management/user-management/openapi";
import { DataSharingService } from "../../product/dataSharing/data-sharing.service";

@Component({
  selector: "app-super-agent",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./super-agent.component.html",
  styleUrl: "./super-agent.component.css",
})
export class SuperAgentComponent {
  reason = new FormControl();
  MaleChecked = new FormControl();
  FemaleChecked = new FormControl();
  remark = new FormControl();

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
  KycProcessedDateInput: any;
  VerifiedInput = new FormControl();
  VerifiedDateInput = new FormControl();
  ComplianceInput = new FormControl();
  ComplianceDateInput = new FormControl();

  superAgentForm: FormGroup = new FormGroup({});

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
  firstName: any;
  lastName: any;
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
  ComplianceValue: any;
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
  firstNameAuth: any;
  lastNameAuth: any;
  fatherNameAuth: any;
  positionHeldAuth: any;
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
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private KycService: KycModuleService,
    private cdr: ChangeDetectorRef,
    private userManagemantService: UserManagementService,
    private dataSharing: DataSharingService
  ) {
    this.superAgentForm = this.fb.group({
      basicFirstName: ["", Validators.required],
      basicLastName: ["", Validators.required],
      basicEmail: ["", Validators.required],
      basicPhone: ["", Validators.required],
      basicUsername: ["", Validators.required],
      KycProcessedInput: ["", Validators.required],
      KycProcessedDateInput: ["", Validators.required],

      companyName: ["", Validators.required],
      pos: ["", Validators.required],
      location: ["", Validators.required],
      accountDate: ["", Validators.required],
      PTID: ["", Validators.required],
      ICCID: ["", Validators.required],
      accCreationPurpose: ["", Validators.required],

      licenseAuth: ["", Validators.required],
      licenseNo: ["", Validators.required],
      issueDate: ["", Validators.required],
      expiryDate: ["", Validators.required],
      street: ["", Validators.email],
      houseNo: ["", Validators.required],
      province: ["", Validators.required],
      TIN: ["", Validators.required],

      district: ["", Validators.required],
      contactNo: ["", Validators.required],
      country: ["", Validators.required],
      email: ["", Validators.required],
      telNo: ["", Validators.required],

      outward: ["", Validators.required],
      inward: ["", Validators.required],
      fund: ["", Validators.required],
      businessNature: ["", Validators.required],
      turnover: ["", Validators.required],
      monthlyIncome: ["", Validators.required],
      //pres
      lastName: ["", Validators.required],
      firstName: ["", Validators.required],
      positionPresident: ["", Validators.required],
      fatherName: ["", Validators.required],
      tazkira: ["", Validators.required],
      emailPresident: ["", Validators.required],
      countryPresident: ["", Validators.required],
      dob: ["", Validators.required],
      DateofExpiryPresident: ["", Validators.required],
      issueDatePresident: ["", Validators.required],
      nationalityPresident: ["", Validators.required],
      incomeSourcePresident: ["", Validators.required],
      mobilePresident: ["", Validators.required],
      monthlyIncomePresident: ["", Validators.required],
      PresidentTin: ["", Validators.required],

      permanentHouseNo: ["", Validators.required],
      permanentLocation: ["", Validators.required],
      permanentProvince: ["", Validators.required],
      permanentStreet: ["", Validators.required],
      permanentDistrict: ["", Validators.required],
      permanentCountry: ["", Validators.required],

      houseNoAddress: ["", Validators.required],
      locationAddress: ["", Validators.required],
      provinceAddress: ["", Validators.required],
      streetAddress: ["", Validators.required],
      districtAddress: ["", Validators.required],
      countryAddress: ["", Validators.required],
      //vice
      lastNameCompanyVice: ["", Validators.required],
      firstNameCompanyVice: ["", Validators.required],
      positionCompanyVice: ["", Validators.required],
      fatherNameCompanyVice: ["", Validators.required],
      tazkiraCompanyVice: ["", Validators.required],
      emailCompanyVice: ["", Validators.required],
      countryCompanyVice: ["", Validators.required],
      dobCompanyVice: ["", Validators.required],
      DateofExpiryCompanyVice: ["", Validators.required],
      issueDateCompanyVice: ["", Validators.required],
      nationalityCompanyVice: ["", Validators.required],
      incomeSourceCompanyVice: ["", Validators.required],
      mobileCompanyVice: ["", Validators.required],
      monthlyIncomeCompanyVice: ["", Validators.required],
      viceTin: ["", Validators.required],

      VicepermanentHouseNo: ["", Validators.required],
      VicepermanentLocation: ["", Validators.required],
      VicepermanentProvince: ["", Validators.required],
      VicepermanentStreet: ["", Validators.required],
      VicepermanentDistrict: ["", Validators.required],
      VicepermanentCountry: ["", Validators.required],

      VicehouseNoAddress: ["", Validators.required],
      VicelocationAddress: ["", Validators.required],
      ViceprovinceAddress: ["", Validators.required],
      VicestreetAddress: ["", Validators.required],
      VicedistrictAddress: ["", Validators.required],
      VicecountryAddress: ["", Validators.required],
      //mno
      MNOname: ["", Validators.required],
      accountName: ["", Validators.required],
      accountNo: ["", Validators.required],

      presidentName: ["", Validators.required],
      presidentDate: ["", Validators.required],
      V_presidentName: ["", Validators.required],
      V_presidentDate: ["", Validators.required],
      //abmmc verify
      // KycProcessed: ['', Validators.required],
      // KycProcessedDate: ['', Validators.required],
      // Verified: ['', Validators.required],
      // VerifiedDate: ['', Validators.required],
      // Compliance: ['', Validators.required],
      // ComplianceDate: ['', Validators.required],
    });
    const dateObj = new Date();
    this.currentDate = dateObj.toISOString().substring(0, 10);
    console.log("currentDate", this.currentDate);
    this.dataSharing.kycData$.subscribe({
      next: (item) => {
        console.log(item, "item");

        if (item?.id) {
          this.superAgentId = item?.id;
          this.activeFlag = item?.submittedFor?.active;
          this.deletedFlag = item?.submittedFor?.deleted;
          //gender
          //gender
          if (item.kycInputs.custInfoMale) {
            this.MaleChecked.setValue(true);
          }
          if (item.kycInputs.custInfoFemale) {
            this.FemaleChecked.setValue(true);
          }
          //doc
          if (item.kycInputs.validLicenseNo) {
            this.licenseNoo.setValue(true);
          }
          if (item.kycInputs.validLicenseYes) {
            this.licenseYes.setValue(true);
          }
          if (item.kycInputs.validPassportNo) {
            this.passNo.setValue(true);
          }
          if (item.kycInputs.validPassportYes) {
            this.passYes.setValue(true);
          }
          if (item.kycInputs.validSignatoryNo) {
            this.signNo.setValue(true);
          }
          if (item.kycInputs.validSignatoryYes) {
            this.signYes.setValue(true);
          }
          if (item.kycInputs.validAssociationNo) {
            this.articleNo.setValue(true);
          }
          if (item.kycInputs.validAssociationYes) {
            this.articleYes.setValue(true);
          }
          if (item.kycInputs.validResolutionNo) {
            this.ResNo.setValue(true);
          }
          if (item.kycInputs.validResolutionYes) {
            this.ResYes.setValue(true);
          }
          if (item.kycInputs.validPowerOfAttNo) {
            this.powerNo.setValue(true);
          }
          if (item.kycInputs.validPowerOfAttYes) {
            this.powerYes.setValue(true);
          }
          //havemno
          if (item.kycInputs.otherMnoNo) {
            this.mnoNo.setValue(true);
          }
          if (item.kycInputs.otherMnoYes) {
            this.mnoYes.setValue(true);
          }

          this.superAgentForm.patchValue({
            basicFirstName: item?.submittedFor?.firstName,
          });
          this.superAgentForm.patchValue({
            basicLastName: item?.submittedFor?.lastName,
          });
          this.superAgentForm.patchValue({
            basicEmail: item?.submittedFor?.email,
          });
          this.superAgentForm.patchValue({
            basicPhone: item?.submittedFor?.phone,
          });
          this.superAgentForm.patchValue({
            basicUsername: item?.submittedFor?.username,
          });

          this.superAgentForm.patchValue({
            companyName: item?.kycInputs?.custInfoCompanyName,
          });
          this.superAgentForm.patchValue({ pos: item?.kycInputs?.custInfoPOS });
          this.superAgentForm.patchValue({
            location: item?.kycInputs?.custInfoLocation,
          });
          this.superAgentForm.patchValue({
            accountDate: item?.kycInputs?.custInfoAccOpenDate,
          });
          this.superAgentForm.patchValue({
            PTID: item?.kycInputs?.custInfoPTID,
          });
          this.superAgentForm.patchValue({
            ICCID: item?.kycInputs?.custInfoICCID,
          });
          this.superAgentForm.patchValue({
            accCreationPurpose: item?.kycInputs?.purposeOfAcc,
          });

          this.superAgentForm.patchValue({
            licenseAuth: item?.kycInputs?.licenseAuthority,
          });
          this.superAgentForm.patchValue({
            licenseNo: item?.kycInputs?.licenseNumber,
          });
          this.superAgentForm.patchValue({
            issueDate: item?.kycInputs?.licenseDateOfIssue,
          });
          this.superAgentForm.patchValue({ TIN: item?.kycInputs?.licenseTIN });
          this.superAgentForm.patchValue({
            expiryDate: item?.kycInputs?.licenseDateOfExpiry,
          });

          this.superAgentForm.patchValue({
            street: item?.kycInputs?.companyStreet,
          });
          this.superAgentForm.patchValue({
            houseNo: item?.kycInputs?.companyHouseNumber,
          });
          this.superAgentForm.patchValue({
            province: item?.kycInputs?.companyProvince,
          });
          this.superAgentForm.patchValue({
            district: item?.kycInputs?.companyDistrict,
          });
          this.superAgentForm.patchValue({
            contactNo: item?.kycInputs?.companyContact,
          });
          this.superAgentForm.patchValue({
            country: item?.kycInputs?.companyCountry,
          });
          this.superAgentForm.patchValue({
            email: item?.kycInputs?.companyEmail,
          });
          this.superAgentForm.patchValue({
            telNo: item?.kycInputs?.companyTelephone,
          });

          this.superAgentForm.patchValue({
            outward: item?.kycInputs?.remittanceOutward,
          });
          this.superAgentForm.patchValue({
            inward: item?.kycInputs?.remittanceInward,
          });
          this.superAgentForm.patchValue({
            fund: item?.kycInputs?.remittanceSourceOfFund,
          });
          this.superAgentForm.patchValue({
            businessNature: item?.kycInputs?.remittanceNatureOfBiz,
          });
          this.superAgentForm.patchValue({
            turnover: item?.kycInputs?.remittanceTurnover,
          });
          this.superAgentForm.patchValue({
            monthlyIncome: item?.kycInputs?.remittanceIncome,
          });

          this.superAgentForm.patchValue({
            lastName: item?.kycInputs?.prezLastName,
          });
          this.superAgentForm.patchValue({
            firstName: item?.kycInputs?.prezFirstName,
          });
          this.superAgentForm.patchValue({
            positionPresident: item?.kycInputs?.prezPosition,
          });
          this.superAgentForm.patchValue({
            fatherName: item?.kycInputs?.prezFatherName,
          });
          this.superAgentForm.patchValue({
            tazkira: item?.kycInputs?.prezTazkira,
          });
          this.superAgentForm.patchValue({
            emailPresident: item?.kycInputs?.prezEmail,
          });
          this.superAgentForm.patchValue({
            countryPresident: item?.kycInputs?.prezCountry,
          });
          this.superAgentForm.patchValue({ dob: item?.kycInputs?.prezDob });
          this.superAgentForm.patchValue({
            DateofExpiryPresident: item?.kycInputs?.prezDateOfExpiry,
          });
          this.superAgentForm.patchValue({
            issueDatePresident: item?.kycInputs?.prezDateOfIssue,
          });
          this.superAgentForm.patchValue({
            nationalityPresident: item?.kycInputs?.prezNationality,
          });
          this.superAgentForm.patchValue({
            incomeSourcePresident: item?.kycInputs?.prezSourceOfIncome,
          });
          this.superAgentForm.patchValue({
            mobilePresident: item?.kycInputs?.prezMobile,
          });
          this.superAgentForm.patchValue({
            monthlyIncomePresident: item?.kycInputs?.prezIncome,
          });
          this.superAgentForm.patchValue({
            PresidentTin: item?.kycInputs?.prezTIN,
          });

          this.superAgentForm.patchValue({
            permanentHouseNo: item?.kycInputs?.prezPermHouseNumber,
          });
          this.superAgentForm.patchValue({
            permanentLocation: item?.kycInputs?.prezPermLocation,
          });
          this.superAgentForm.patchValue({
            permanentProvince: item?.kycInputs?.prezPermProvince,
          });
          this.superAgentForm.patchValue({
            permanentStreet: item?.kycInputs?.prezPermStreet,
          });
          this.superAgentForm.patchValue({
            permanentDistrict: item?.kycInputs?.prezPermDistrict,
          });
          this.superAgentForm.patchValue({
            permanentCountry: item?.kycInputs?.prezPermCountry,
          });

          this.superAgentForm.patchValue({
            houseNoAddress: item?.kycInputs?.prezCurrHouseNumber,
          });
          this.superAgentForm.patchValue({
            locationAddress: item?.kycInputs?.prezCurrLocation,
          });
          this.superAgentForm.patchValue({
            provinceAddress: item?.kycInputs?.prezCurrProvince,
          });
          this.superAgentForm.patchValue({
            streetAddress: item?.kycInputs?.prezCurrStreet,
          });
          this.superAgentForm.patchValue({
            districtAddress: item?.kycInputs?.prezCurrDistrict,
          });
          this.superAgentForm.patchValue({
            countryAddress: item?.kycInputs?.prezCurrCountry,
          });

          this.superAgentForm.patchValue({
            lastNameCompanyVice: item?.kycInputs?.vicePrezLastName,
          });
          this.superAgentForm.patchValue({
            firstNameCompanyVice: item?.kycInputs?.vicePrezFirstName,
          });
          this.superAgentForm.patchValue({
            positionCompanyVice: item?.kycInputs?.vicePrezPosition,
          });
          this.superAgentForm.patchValue({
            fatherNameCompanyVice: item?.kycInputs?.vicePrezFatherName,
          });
          this.superAgentForm.patchValue({
            tazkiraCompanyVice: item?.kycInputs?.vicePrezTazkira,
          });
          this.superAgentForm.patchValue({
            emailCompanyVice: item?.kycInputs?.vicePrezEmail,
          });
          this.superAgentForm.patchValue({
            countryCompanyVice: item?.kycInputs?.vicePrezCountry,
          });
          this.superAgentForm.patchValue({
            dobCompanyVice: item?.kycInputs?.vicePrezDob,
          });
          this.superAgentForm.patchValue({
            DateofExpiryCompanyVice: item?.kycInputs?.vicePrezDateOfExpiry,
          });
          this.superAgentForm.patchValue({
            issueDateCompanyVice: item?.kycInputs?.vicePrezDateOfIssue,
          });
          this.superAgentForm.patchValue({
            nationalityCompanyVice: item?.kycInputs?.vicePrezNationality,
          });
          this.superAgentForm.patchValue({
            incomeSourceCompanyVice: item?.kycInputs?.vicePrezSourceOfIncome,
          });
          this.superAgentForm.patchValue({
            mobileCompanyVice: item?.kycInputs?.vicePrezMobile,
          });
          this.superAgentForm.patchValue({
            monthlyIncomeCompanyVice: item?.kycInputs?.vicePrezIncome,
          });
          this.superAgentForm.patchValue({
            viceTin: item?.kycInputs?.vicePrezTIN,
          });

          this.superAgentForm.patchValue({
            VicepermanentHouseNo: item?.kycInputs?.vicePrezPermHouseNumber,
          });
          this.superAgentForm.patchValue({
            VicepermanentLocation: item?.kycInputs?.vicePrezPermLocation,
          });
          this.superAgentForm.patchValue({
            VicepermanentProvince: item?.kycInputs?.vicePrezPermProvince,
          });
          this.superAgentForm.patchValue({
            VicepermanentStreet: item?.kycInputs?.vicePrezPermStreet,
          });
          this.superAgentForm.patchValue({
            VicepermanentDistrict: item?.kycInputs?.vicePrezPermDistrict,
          });
          this.superAgentForm.patchValue({
            VicepermanentCountry: item?.kycInputs?.vicePrezPermCountry,
          });

          this.superAgentForm.patchValue({
            VicehouseNoAddress: item?.kycInputs?.vicePrezCurrHouseNumber,
          });
          this.superAgentForm.patchValue({
            VicelocationAddress: item?.kycInputs?.vicePrezCurrLocation,
          });
          this.superAgentForm.patchValue({
            ViceprovinceAddress: item?.kycInputs?.vicePrezCurrProvince,
          });
          this.superAgentForm.patchValue({
            VicestreetAddress: item?.kycInputs?.vicePrezCurrStreet,
          });
          this.superAgentForm.patchValue({
            VicedistrictAddress: item?.kycInputs?.vicePrezCurrDistrict,
          });
          this.superAgentForm.patchValue({
            VicecountryAddress: item?.kycInputs?.vicePrezCurrCountry,
          });

          this.superAgentForm.patchValue({
            MNOname: item?.kycInputs?.otherMnoName,
          });
          this.superAgentForm.patchValue({
            accountName: item?.kycInputs?.otherMnoAccName,
          });
          this.superAgentForm.patchValue({
            accountNo: item?.kycInputs?.otherMnoAccNumber,
          });

          this.PresidentName = item?.kycInputs?.undertakenPrezName;
          this.Date = item?.kycInputs?.undertakenPrezDate;
          this.VPresidentName = item?.kycInputs?.custInfoFirstName;
          this.VDate = item?.kycInputs?.custInfoFatherName;

          //abmmc verify
          this.firstNameValue = item?.submittedFor?.firstName;
          this.kycProcessed =
            item?.submittedFor?.firstName + " " + item?.submittedFor?.lastName;
          this.kycProcessedDate = item?.kycInputs?.undertakenPrezDate;
          this.VerifiedOp = item?.kycInputs?.custInfoFirstName;
          this.VerifiedOpDate = item?.kycInputs?.custInfoFatherName;
          this.compliance = item?.kycInputs?.custInfoFirstName;
          this.complianceDate = item?.kycInputs?.custInfoFirstName;

          this.superAgentForm.patchValue({
            presidentName: item?.kycInputs?.undertakenPrezName,
          });
          this.superAgentForm.patchValue({
            presidentDate: item?.kycInputs?.undertakenPrezDate,
          });
          this.superAgentForm.patchValue({
            V_presidentName: item?.kycInputs?.undertakenVicePrezName,
          });
          this.superAgentForm.patchValue({
            V_presidentDate: item?.kycInputs?.undertakenVicePrezDate,
          });

          this.superAgentForm.patchValue({
            KycProcessed: item?.kycInputs?.kycProcessedBy,
          });
          this.superAgentForm.patchValue({
            KycProcessedDate: item?.kycInputs?.kycProcessedDate,
          });
          this.superAgentForm.patchValue({
            Verified: item?.kycInputs?.verifiedByOps,
          });
          this.superAgentForm.patchValue({
            VerifiedDate: item?.kycInputs?.verifiedByOpsDate,
          });
          this.superAgentForm.patchValue({
            Compliance: item?.kycInputs?.approvedByCompliance,
          });
          this.superAgentForm.patchValue({
            ComplianceDate: item?.kycInputs?.approvedByComplianceDate,
          });
          this.superAgentForm.patchValue({
            KycProcessedInput: item?.kycInputs?.firstName,
          });
          this.superAgentForm.patchValue({
            ComplianceDate: item?.kycInputs?.approvedByComplianceDate,
          });
          this.KycProcessedDateInput = `${item?.approvedBy?.firstName} ${item?.approvedBy?.lastName}`;
        }
      },
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.kycId = params.get("kycId");
      console.log("kycId:", this.kycId);
    });
    const privilegesData = sessionStorage.getItem("privileges");

    for (let item of this.allUsers) {
      if (this.userName == item?.submittedFor?.email) {
        this.showUpdate = true;
      }
    }
  }
}
