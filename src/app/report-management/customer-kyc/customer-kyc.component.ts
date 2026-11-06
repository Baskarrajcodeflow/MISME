import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { KycModuleService } from '../../kyc/kyc/kyc-module.service';
import { UserManagementService } from '../../user-management/user-management/user-management/openapi';
import { DataSharingService } from '../../product/dataSharing/data-sharing.service';

@Component({
  selector: 'app-customer-kyc',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './customer-kyc.component.html',
  styleUrl: './customer-kyc.component.css'
})
export class CustomerKycComponent {
  alertMessage: string | null = null;
  alertType: 'success' | 'error' = 'success';
  rejectreasonForm!: FormGroup;
  remark = new FormControl();
  reason = new FormControl();
  MaleChecked = new FormControl();
  FemaleChecked = new FormControl();
  married = new FormControl();
  single = new FormControl();
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
  userStatus: any;
  customer: any;
  customerId: any;

  isLowSelected = false;
  isMediumOrHighSelected = false;
  isWatchlistDisabled = false;
  seqNo: any;
  customerForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private dataSharing: DataSharingService,) {
      this.customerForm = this.fb.group({
        middleName: ['', Validators.required],
        firstName: ['', Validators.required],
        fatherName: ['', Validators.required],
        surName: ['', Validators.required],
        birthPlace: ['', Validators.required],
        dob: ['', Validators.required],
        tazkira: ['', Validators.required],
        nationality: ['', Validators.required],
        expiry: ['', Validators.required],
        issue: ['', Validators.required],
        accountOpenDate: ['', Validators.required],
        MMwallet: ['', Validators.required],
        // married: ['', Validators.required],
        // single: ['', Validators.required],
        // female: ['', Validators.required],
        // male: ['', Validators.required],
        email: ['', Validators.email],
        contactNO: ['', Validators.required],
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
        //proffession
        position: ['', Validators.required],
        source: ['', Validators.required],
        income: ['', Validators.required],
        service: ['', Validators.required],
        turnover: ['', Validators.required],
        purpose: ['', Validators.required],
        tin: ['', Validators.required],
        //kin
        kinName: ['', Validators.required],
        kinMobile: ['', Validators.required],
        kinFather: ['', Validators.required],
        kinRelation: ['', Validators.required],
        kinEmail: ['', Validators.required],
        kinHouse: ['', Validators.required],
        kinLoc: ['', Validators.required],
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
      this.dataSharing.kycData$.subscribe({
        next:(item)=>{
          console.log(item);
          
          if (item) {
            this.customerId = item?.id;
            this.activeFlag = item?.submittedFor?.active;
            this.deletedFlag = item?.submittedFor?.deleted;
            if (item?.kycInputs?.custInfoMale) {
              this.MaleChecked.setValue(true);
            }
            if (item?.kycInputs?.custInfoFemale) {
              this.FemaleChecked.setValue(true);
            }
            if (item?.kycInputs?.custInfoMarried) {
              this.married.setValue(true);
            }
            if (item?.kycInputs?.custInfoSingle) {
              this.single.setValue(true);
            }
            // custInfoMarried
            // custInfoSingle
            this.undertakenSign = item?.kycInputs?.undertakenSign_img_0;
            this.kycSign = item?.kycInputs?.agentSign_img_0;
            this.agentVerifySign = item?.kycInputs?.superAgentSign_img_0;
            this.opSign = item?.kycInputs?.opsSign_img_1;
            this.compSign = item?.kycInputs?.complianceSign_img_1;
  
            this.CustomerImg = item?.kycInputs?.custPhoto_img_0;
  
            this.customerForm.patchValue({ firstName: item?.kycInputs?.custInfoFirstName })
            this.customerForm.patchValue({ middleName: item?.kycInputs?.custInfoMiddleName })
            this.customerForm.patchValue({ fatherName: item?.kycInputs?.custInfoFatherName })
            this.customerForm.patchValue({ surName: item?.kycInputs?.custInfoSurname })
            this.customerForm.patchValue({ birthPlace: item?.kycInputs?.custInfoPlaceOfBirth })
  
            this.customerForm.patchValue({ dob: item?.kycInputs?.custInfoDob })
            this.customerForm.patchValue({ tazkira: item?.kycInputs?.custInfoTazkira })
            this.customerForm.patchValue({ nationality: item?.kycInputs?.custInfoNationality })
            this.customerForm.patchValue({ expiry: item?.kycInputs?.custInfoDateOfExpiry })
            this.customerForm.patchValue({ issue: item?.kycInputs?.custInfoDateOfIssue })
  
            this.customerForm.patchValue({ accountOpenDate: item?.kycInputs?.custInfoAccOpenDate })
            this.customerForm.patchValue({ MMwallet: item?.kycInputs?.custInfoMMWallet })
            this.customerForm.patchValue({ email: item?.kycInputs?.custInfoEmail })
            this.customerForm.patchValue({ contactNO: item?.kycInputs?.custInfoContactNo })
  
            this.CustomerfirstName = item?.kycInputs?.custInfoFirstName;
            // this.CustomerMiddleName = item?.kycInputs?.middleName;
            // this.CustomerSurName = item?.kycInputs?.custInfoSurname;
            this.CustomerFathername = item?.kycInputs?.custInfoFatherName;
            // this.CustomerDob = item?.kycInputs?.custInfoDob;
            // this.CustomerBirthPlace = item?.customerInfo?.placeOfBirth;
            // this.CustomerNationality = item?.kycInputs?.custInfoNationality;
            // this.CustomerTazkira = item?.kycInputs?.custInfoTazkira;
            // this.CustomerIssue = item?.customerInfo?.dateOfIssue;
            // this.CustomerExpiry = item?.customerInfo?.dateOfExpiry;
            // this.CustomerWallet = item?.customerInfo?.mmWalletNo;
            // this.CustomerAccountOpenDate = item?.customerInfo?.accOpenDate;
            // this.CustomerGender = item?.kycInputs?.gender;
            // this.CustomerMarital = item?.customerInfo?.maritalStatus;
            // this.CustomerContact = item?.kycInputs?.custInfoAltPhone;
            // this.CustomerEmail = item?.kycInputs?.custInfoEmail;
            // this.CustomerTurnover = item?.customerInfo?.monthlyTurnOver;
            // this.CustomerPurpose = item?.customerInfo?.purposeOfAcc;
            this.customerForm.patchValue({ houseNO: item?.kycInputs?.currHouseNo })
            this.customerForm.patchValue({ loc: item?.kycInputs?.currLocation })
            this.customerForm.patchValue({ province: item?.kycInputs?.currProvince })
            this.customerForm.patchValue({ street: item?.kycInputs?.currStreet })
            this.customerForm.patchValue({ district: item?.kycInputs?.currDistrict })
            this.customerForm.patchValue({ country: item?.kycInputs?.currCountry })
  
            // this.CustomerHouse = item?.kycInputs?.currHouseNo;
            // this.CustomerLocation = item?.kycInputs?.currLocation;
            // this.CustomerProvince = item?.kycInputs?.currProvince;
            // this.CustomerStreet = item?.kycInputs?.currStreet;
            // this.CustomerDistrict = item?.kycInputs?.currDistrict;
            // this.CustomerCountry = item?.kycInputs?.currCountry;
            this.customerForm.patchValue({ perHouseNO: item?.kycInputs?.permHouseNo })
            this.customerForm.patchValue({ perLoc: item?.kycInputs?.permLocation })
            this.customerForm.patchValue({ perProvince: item?.kycInputs?.permProvince })
            this.customerForm.patchValue({ perStreet: item?.kycInputs?.permStreet })
            this.customerForm.patchValue({ perDistrict: item?.kycInputs?.permDistrict })
            this.customerForm.patchValue({ perCountry: item?.kycInputs?.permCountry })
  
            // this.CustomerPermanentHouseNo = item?.permanentAddress?.permHouseNo;
            // this.CustomerPermanentLocation = item?.permanentAddress?.permLocation;
            // this.CustomerPermanentProvince = item?.permanentAddress?.permProvince;
            // this.CustomerPermanentStreet = item?.permanentAddress?.permStreet;
            // this.CustomerPermanentDistrict = item?.permanentAddress?.permDistrict;
            // this.CustomerPermanentCountry = item?.permanentAddress?.permCountry;
            this.customerForm.patchValue({ position: item?.kycInputs?.positionHeld })
            this.customerForm.patchValue({ source: item?.kycInputs?.occupation })
            this.customerForm.patchValue({ income: item?.kycInputs?.salary })
            this.customerForm.patchValue({ service: item?.kycInputs?.periodOfService })
            this.customerForm.patchValue({ turnover: item?.kycInputs?.monthlyTurnover })
            this.customerForm.patchValue({ purpose: item?.kycInputs?.purposeOfAcc })
            this.customerForm.patchValue({ tin: item?.kycInputs?.tinNumber })
  
            // this.CustomerSource = item?.kycInputs?.occupation;
            // this.CustomerPosition = item?.professionDetails?.positionHeld;
            // this.CustomerService = item?.professionDetails?.periodOfService;
            // this.CustomerMonthlyIncome = item?.kycInputs?.salary;
            // this.CustomerProfTurnover = item?.professionDetails?.monthlyTurnOver;
            // this.CustomerProfPurpose = item?.professionDetails?.purposeOfAcc;
            // this.CustomerProfTin = item?.professionDetails?.tinNumber
  
            this.customerForm.patchValue({ kinName: item?.kycInputs?.nokName })
            this.customerForm.patchValue({ kinMobile: item?.kycInputs?.nokMobile })
            this.customerForm.patchValue({ kinFather: item?.kycInputs?.nokFatherName })
            this.customerForm.patchValue({ kinRelation: item?.kycInputs?.nokRelationship })
            this.customerForm.patchValue({ kinEmail: item?.kycInputs?.nokEmail })
            this.customerForm.patchValue({ kinHouse: item?.kycInputs?.nokHouseNo })
            this.customerForm.patchValue({ kinLoc: item?.kycInputs?.nokLocation })
            this.customerForm.patchValue({ kinProvince: item?.kycInputs?.nokProvince })
            this.customerForm.patchValue({ kinStreet: item?.kycInputs?.nokStreet })
            this.customerForm.patchValue({ kinDistrict: item?.kycInputs?.nokDistrict })
            this.customerForm.patchValue({ kinCountry: item?.kycInputs?.nokCountry })
  
            // this.CustomerKINname = item?.kycInputs?.nokName;
            // this.CustomerKINmobile = item?.kycInputs?.nokMobile;
            // this.CustomerKINfatherName = item?.nextOfKin?.nextOfKinFatherName;
            // this.CustomerRelationship = item?.nextOfKin?.relationship;
            // this.kinEmail = item?.kycInputs?.nokEmail;
            // this.kinHouse = item?.kycInputs?.nokHouseNo;
            // this.kinLocation = item?.kycInputs?.nokLocation;
            // this.kinProvince = item?.kycInputs?.nokProvince;
            // this.kinStreet = item?.kycInputs?.nokStreet;
            // this.kinDistrict = item?.kycInputs?.nokDistrict;
            // this.kinCountry = item?.kycInputs?.nokCountry;
  
            this.CustomerApplicant = this.CustomerfirstName + ' ' + this.CustomerFathername;
            this.CustomerApplicantDate = item?.kycInputs?.undertakenDate;
            //completed acc to new API kycInputs
            this.customerForm.patchValue({ agentLicense: item?.kycInputs?.agentLicenseNo })
            this.customerForm.patchValue({ agentName: item?.kycInputs?.agentName })
            this.customerForm.patchValue({ agentPos: item?.kycInputs?.agentPOS })
            this.customerForm.patchValue({ agentLoc: item?.kycInputs?.agentLocation })
            this.customerForm.patchValue({ agentIccid: item?.kycInputs?.agentICCID })
            this.customerForm.patchValue({ agentPtid: item?.kycInputs?.agentPTID })
  
            this.customerForm.patchValue({ kyc: item?.kycInputs?.kycProcessedBy })
            this.customerForm.patchValue({ kycDate: item?.kycInputs?.kycProcessedDate })
            this.customerForm.patchValue({ agentVerify: item?.kycInputs?.superAgentVerification })
            this.customerForm.patchValue({ agentVerifyDate: item?.kycInputs?.superAgentVerificationDate })
  
            // this.CustomerAgentName = item?.agentVerificationagentVerification?.agentName;
            // this.CustomerLicense = item?.agentVerification?.licenseNo;
            // this.CustomerAgentLocation = item?.agentVerification?.agentLocation;
            // this.CustomerPOSno = item?.agentVerification?.posNo;
            // this.CustomerPTIDAgentVerify = item?.agentVerification?.ptidNo;
            // this.CustomerICCIDAgentVerify = item?.agentVerification?.iccidNo;
  
            // this.CustomerKYCProcessedBy = item?.agentVerification?.kycProcessedBy;
            // this.CustomerKYCDate = item?.agentVerification?.processingDate;
            // this.CustomerAgentVerification = item?.agentVerification?.superAgentVerification;
            // this.CustomerAgentVerifiedDate = item?.agentVerification?.verificationDate;
            this.customerForm.patchValue({ opVerify: item?.kycInputs?.verifiedByOps })
            this.customerForm.patchValue({ opVerifyDate: item?.kycInputs?.verifiedByOpsDate })
            this.customerForm.patchValue({ compVerify: item?.kycInputs?.approvedByCompliance })
            this.customerForm.patchValue({ compVerifyDate: item?.kycInputs?.approvedByComplianceDate })
  
            // this.CustomerVerified = item?.abmmcVerification?.verifiedByOperation;
            // this.CustomerVerifiedDate = item?.abmmcVerification?.verifyDate;
            // this.CustomerCompliance = item?.abmmcVerification?.approvedByCompliance;
            // this.CustomerComplianceDate = item?.abmmcVerification?.approvedDate;
        }
        }
      })
  }
  ngOnInit(): void {
    // const privilegesData = sessionStorage.getItem('privileges');
    // if (privilegesData) {
    //   this.userPrivileges = JSON.parse(privilegesData);
    //   this.userPrivileges = this.userPrivileges[0];
    //   console.log(this.userPrivileges[0], "this.userPrevilages");
    //   console.log(this.userPrivileges, "this.userPrevilages1");

    //   for (let item of this.userPrivileges?.uiComponentPrivileges) {
    //     if (item?.component?.componentName == 'KYC') {
    //       if (item.subComponent?.subComponentName == 'All KYC')
    //         this.kycPrivelege = item;
    //     }
    //   }
    // }
    // //new
  

  }
}
