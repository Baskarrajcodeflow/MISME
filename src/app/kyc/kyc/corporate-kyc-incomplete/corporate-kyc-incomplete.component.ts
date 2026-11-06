import { Component, EventEmitter, Output } from '@angular/core';
import { KycModuleService } from '../kyc-module.service';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

import {
  AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, ValidationErrors, ValidatorFn
} from '@angular/forms';
import { CorporateService } from '../../../corporate/corporate.service';
import { CurrencyFormatPipe } from '../../../pipe/currency-format.pipe';
import { catchError, concatMap, debounceTime, distinctUntilChanged, from, map, Observable, of, switchMap, tap, toArray } from 'rxjs';
import { SharedFunctionsService } from '../../../shared-functions.service';


@Component({
  selector: 'app-corporate-kyc-incomplete',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './corporate-kyc-incomplete.component.html',
  styleUrl: './corporate-kyc-incomplete.component.css'
})
export class CorporateKycIncompleteComponent {
  isLoading : boolean = false;
  page: number = 0;
  incompleteKycData : any;
  userPrivileges: any;
  kycPrivelege: any;
  kycId: any;
  showForm: boolean = false;
  @Output() cancel = new EventEmitter<void>();
  public corporateForm: FormGroup = new FormGroup({});
  showTooltip: boolean = false;
  formTabs: string[] = [];
  currentTab: number = 0;
  nationalities: any;
  provinces: any;
  provinceId: any;
  selectedProvinceName: any;
  districts: any;
  initForm: any;
  tab!: string;
  //isLoading: boolean = false;
  basicDetailsForm!: FormGroup<{ type: FormControl<string | null>; corporteFirstName: FormControl<string | null>; corporteLastName: FormControl<string | null>; corporateEmail: FormControl<string | null>; corporatePhone: FormControl<string | null>;  /* SalarythirdLevelAuth: FormControl<any | null>; */ organizationType: FormControl<any | null>; }>;
  companyDetailsForm!: FormGroup;
  businessLicenceDetailsForm!: FormGroup<{ licenceNumber: FormControl<string | null>; licenceIssueAuthority: FormControl<string | null>; dateofIssue: FormControl<string | null>; dateofExpiry: FormControl<string | null>; tinNumber: FormControl<string | null>; }>;
  businessActivityDetailsForm!: FormGroup<{ businessName: FormControl<string | null>; natureofBusiness: FormControl<string | null>; monthlyIncome: FormControl<string | null>; netWorth: FormControl<string | null>; sourceofFund: FormControl<string | null>; monthlyTurnover: FormControl<string | null>; }>;
  companyAddressDetailsForm!: FormGroup<{ location: FormControl<string | null>; streetNumber: FormControl<string | null>; houseNumber: FormControl<string | null>; district: FormControl<string | null>; province: FormControl<string | null>; country: FormControl<string | null>; officePhone: FormControl<string | null>; officeEmail: FormControl<string | null>; }>;
  shareHolderDetailsForm !: FormGroup;
  authorizedDetailsForm !: FormGroup;
  ngoDetailsForm!: FormGroup;
  ngoAddressDetailsForm!: FormGroup;
  ngocommitteMemberDetailsForm!: FormGroup;
  ngoRepresntativeDetailsForm!: FormGroup;
  unGovtAgencyPocDetailsForm!: FormGroup;
  unGovtAgencyContractDetailsForm!: FormGroup;
  unGovtAgencyDetailsForm!: FormGroup;
  attachedFiles: { [key: string]: File } = {};
  attachedFilesNgoUN: { mapping?: string, title?: string, file?: File | undefined }[] = [];
  otherDocArray: any[] = [];
  natureofBusinesses: any;
  mapping!: string;
  file1: any;
  fileName!: string;
  userId: any;
  shareHolderId: any;
  shareholderImgCount: any;
  shareholderCount1: any;
  registerResponse: any;
  isPasswordVisible: boolean = false;
  natureOfBuisness: any;
  profile!: File;
  authorizedSignatoryGroup: FormGroup = new FormGroup({});
  showUsernameExist: boolean = false;
  payloadForSubmitKYC!: {};
  currentDistricts: any[] = [];
  currentProvinces:any[]=[];
  emailError: string | null = null;
  phoneError: string | null = null;
  item: any;


  constructor(private KycService: KycModuleService, private router: Router,  private fb: FormBuilder,private sharedFunctionsServic: SharedFunctionsService,
  private corporate : CorporateService,   private currencyFormatPipe: CurrencyFormatPipe){}

  ngOnInit(){
    this.getincompleteKycData(this.page);
    this.getuserPermissions();
    this.formTabs = ['Basic Info'];
    this.tab = 'Basic Info';
    this.basicDetailsForm = this.fb.group({
      type: ['', [Validators.required]],
      corporteFirstName: ['', Validators.required],
      corporteLastName: ['', Validators.required],
      corporateEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      corporatePhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      //gender: ['',Validators.required],
      //corporateUserName: ['', Validators.required],
     /*  corporatePassword: ['', Validators.required], */
     /*  SalarythirdLevelAuth: ['', Validators.required], */
      organizationType: ['', Validators.required]

    })

    this.basicDetailsForm.get('type')?.valueChanges.subscribe( type =>{
      if (this.basicDetailsForm.get('type')?.value == 'SUPPLIER' || this.basicDetailsForm.get('type')?.value == 'SYSTEM'){
        //this.generateBusinessCorporateForm();
        this.basicDetailsForm.patchValue({organizationType : 'CORPORATE'});

      }
      else{
        this.basicDetailsForm.controls['organizationType'].reset('');

      }
    })

    this.basicDetailsForm.get('organizationType')?.valueChanges.subscribe(type => {
      //alert("Type changed");
      if (this.basicDetailsForm.get('organizationType')?.value == 'CORPORATE') {
        this.generateBusinessCorporateForm();
      }
      else if (this.basicDetailsForm.get('organizationType')?.value == 'NGO') {
        this.generateNGOForm();
      }
      else if (this.basicDetailsForm.get('organizationType')?.value == 'UN_AGENCY' || this.basicDetailsForm.get('organizationType')?.value == 'GOVT_AGENCY') {
        this.generateUNGovtAgencyForm();
      }
    })
  this.patchValueForm();
  }
  generateBusinessCorporateForm() {
    this.authorizedSignatoryGroup = this.createAuthorizedSignatoryGroup();
    this.formTabs.length = 0;
    this.formTabs = ['Basic Info'];
    let corporateBusinessTabs = [
      'Company Details',
      'Company Business License Details',
      'Company Business Activities',
      'Company Address',
      'Company Shareholder Details',
      'Authorized Signatory Details',
      'Final Submission'
    ]
    //this.tab = 'Basic Info';
    this.formTabs = [...this.formTabs, ...corporateBusinessTabs];

    this.getCountries();
    this.getDistricts
    this.getProvinces();
    this.getNatureofBusiness();

    /* this.basicDetailsForm = this.fb.group({
      type: ['', [Validators.required]],
      corporteFirstName: ['', Validators.required],
      corporteLastName: ['', Validators.required],
      corporateEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      corporatePhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      corporateUserName: ['', Validators.required],
      corporatePassword: ['', Validators.required],
      SalarythirdLevelAuth: ['', Validators.required],

    }) */

    this.companyDetailsForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      contactPersonName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      contactpersonDesignation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholderCount: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Strictly Numerical
      authorizedSignatoryCount: ['', [Validators.required, Validators.pattern('^(2|3)$')]], // Strictly Numerical


      //contactPersonTazkiraPhoto: ['',Validators.required],
      //contactPersonSign: ['',Validators.required],
    });
    this.companyDetailsForm.controls['authorizedSignatoryCount'].patchValue('2');

    this.businessLicenceDetailsForm = this.fb.group({
      licenceNumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      licenceIssueAuthority: ['', [Validators.required]], // Strictly Numerical
      dateofIssue: ['', [Validators.required,this.sharedFunctionsServic.pastDateValidator()]], // Date
      dateofExpiry: ['', [Validators.required,this.sharedFunctionsServic.futureDateValidator()]], // Date
      tinNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Strictly Numerical
      //businessLicencePhoto: ['', Validators.required]
    })

    this.businessActivityDetailsForm = this.fb.group({
      businessName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      natureofBusiness: ['', Validators.required],
      monthlyIncome: ['', Validators.required], // Strictly Numerical
      netWorth: ['', Validators.required,], // Strictly Numerical
      sourceofFund: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric 
      monthlyTurnover: ['', Validators.required,], // Strictly Numerical
    })

    this.companyAddressDetailsForm = this.fb.group({
      location: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      streetNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Strictly Numerical
      houseNumber: ['', [Validators.pattern('^[0-9]+$')]], // Strictly Numerical
      district: ['', [Validators.required]],
      province: ['', [Validators.required]],
      country: ['', [Validators.required]],
      officePhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      officeEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      //addressProof: ['', [Validators.required]],
    })

    this.shareHolderDetailsForm = this.fb.group({
      shareHolders: this.fb.array([this.createShareholderGroup()]) // Initialize with one shareholder
    });


    this.authorizedDetailsForm = this.fb.group({
      authorizedSignatories: this.fb.array([this.createAuthorizedSignatoryGroup()]) // Initialize with one shareholder 
    })
    this.addauthorizedSignatory();


  }
  generateNGOForm() {
    this.formTabs.length = 0;
    this.formTabs = ['Basic Info'];

    let ngoFormTabs = [
      'NGO Details',
      'NGO Address',
      'NGO Executive Committee Members Details',
      'NGO Representative Details',
      'Documents',
      'Final Submission'
    ]
    this.tab = 'Basic Info';
    this.formTabs = [...this.formTabs, ...ngoFormTabs];
    let imagesmappings = ['regCertificatePhoto', 'articleOfAssociationPhoto', 'addressProofPhoto', 'execIdProofFrontPhoto', 'execIdProofBackPhoto', 'authorizationLetterPhoto', 'repIdProofFrontPhoto', 'repIdProofBackPhoto', 'tinLetterPhoto', 'auditedFinancialStmtPhoto', 'repSignaturePhoto', 'otherDocs']
    let imageTitles = ['Valid Registration Certificate', 'Article of Association/Structure of NGO', 'Proof of Address', 'Executive Committee Member Tazkira/Passport Front', 'Executive Committee Member Tazkira/Passport Back', 'Authorization Letter (Power of Attorney)', 'Representative Tazkira/Passport', 'Annual Tax Clearance Letter', 'TIN Letter', 'Audited Financial Statement (Optional)', 'Digital Signatures of Representative', 'Additional Supporting Documents'];

    let i = 0;
    this.attachedFilesNgoUN = [];
    imagesmappings.forEach(image => {
      this.attachedFilesNgoUN.push({ mapping: image, title: imageTitles[i] });
      i++;
    })




    console.log("this.attached Files for NGO", this.attachedFilesNgoUN)
    this.getCountries();
    this.getProvinces();
    this.getNatureofBusiness();

    /* this.basicDetailsForm = this.fb.group({
      type: ['', [Validators.required]],
      corporteFirstName: ['', Validators.required],
      corporteLastName: ['', Validators.required],
      corporateEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      corporatePhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      corporateUserName: ['', Validators.required],
      corporatePassword: ['', Validators.required],
      SalarythirdLevelAuth: ['', Validators.required],

    }) */

    this.ngoDetailsForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      licenseRegNo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      tinNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Strictly Numerical
      sourceofFund: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric 
      monthlyTurnover: ['', Validators.required,], // Strictly Numerical      
    });

    this.ngoAddressDetailsForm = this.fb.group({
      location: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      streetNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Strictly Numerical
      houseNumber: ['', [Validators.pattern('^[0-9]+$')]], // Strictly Numerical
      district: ['', [Validators.required]],
      province: ['', [Validators.required]],
      country: ['', [Validators.required]],
      officePhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      officeEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
    })

    this.ngocommitteMemberDetailsForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]],
      location: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]], // Alphanumeric
      tazkiraNo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      dateofBirth: ['', [Validators.required, this.ageValidator()]], // Date
      placeofBirth: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      position: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric

    })

    this.ngoRepresntativeDetailsForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]],
      location: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]], // Alphanumeric
      tazkiraNo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      dateofBirth: ['', [Validators.required, this.ageValidator()]], // Date
      placeofBirth: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      designation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      nationality: ['', [Validators.required]],
      sourceofIncome: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric 
      monthlyIncome: ['', Validators.required,],
      phone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],



    })






  }
  generateUNGovtAgencyForm() {
    this.formTabs.length = 0;
    this.formTabs = ['Basic Info'];

    let ngoFormTabs = [
      'Agency Details',
      'Contract Details',
      'Point of Contact Details',
      'Documents',
      'Final Submission'
    ]
    this.tab = 'Basic Info';
    this.formTabs = [...this.formTabs, ...ngoFormTabs];

    let imagesmappings = ['authorizationLetterPhoto', 'pocIdProofFrontPhoto', 'pocIdProofBackPhoto', 'pocSignaturePhoto', , 'otherDocs']
    let imageTitles = ['Authorization Letter (Optional)', 'Point of Contact Tazkira/Passport Front (Optional) ', 'Point of Contact Tazkira/Passport Back (Optional)', 'Digital Signatures of Point of Contact (Optional)', 'Additional Supporting Documents'];

    let i = 0;
    this.attachedFilesNgoUN = [];
    imagesmappings.forEach(image => {
      this.attachedFilesNgoUN.push({ mapping: image, title: imageTitles[i] });
      i++;
    })




    console.log("this.attached Files for NGO", this.attachedFilesNgoUN)

    this.getCountries();
    //this.getDistricts
    this.getProvinces();
    this.getNatureofBusiness();

    /* this.basicDetailsForm = this.fb.group({
      type: ['', [Validators.required]],
      corporteFirstName: ['', Validators.required],
      corporteLastName: ['', Validators.required],
      corporateEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      corporatePhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      corporateUserName: ['', Validators.required],
      corporatePassword: ['', Validators.required],
      SalarythirdLevelAuth: ['', Validators.required],

    }) */



    this.unGovtAgencyDetailsForm = this.fb.group({
      unGovtAgencyName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      location: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      streetNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Strictly Numerical
      houseNumber: ['', [Validators.pattern('^[0-9]+$')]], // Strictly Numerical
      district: ['', [Validators.required]],
      province: ['', [Validators.required]],
      country: ['', [Validators.required]],
      officePhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      officeEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
    })

    this.unGovtAgencyContractDetailsForm = this.fb.group({
      contractNumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]], // Alphanumeric with dash
      contractType: ['', [Validators.required]],
      dateofIssue: ['', [Validators.required,this.sharedFunctionsServic.pastDateValidator()]], // Date
      dateofExpiry: ['',[ Validators.required,this.sharedFunctionsServic.futureDateValidator()]], // Date
      contractSummary: ['', [Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric


    })

    this.unGovtAgencyPocDetailsForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]],
      location: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]], // Alphanumeric
      tazkiraNo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      dateofBirth: ['', [Validators.required, this.ageValidator()]], // Date
      placeofBirth: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      designation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      nationality: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],



    })






  }
  ageValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty values
      }

      const today = new Date();
      const birthDate = new Date(control.value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      // Check if the person is at least 18 years old
      const isUnderage = age < 18 || (age === 18 && monthDifference < 0);

      return isUnderage ? { underage: { value: control.value } } : null;
    };


  }
  // onMonthlyIncomeChange(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  // let rawValue = inputElement.value;
  // this.businessActivityDetailsForm.controls['monthlyIncome'].setValue(rawValue, { emitEvent: false });
  // inputElement.value = rawValue; 
  // }

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



  formatCurrencyForShareholdersAndAuthorizedSignatories(type: string, formArrayName: string, index: number, formControlName: string): void {
    //let form : 'shareholder' | 'authorizedSignatory'
    //form = type;
    let formArray;
    (type == 'shareholder') ? formArray = this.shareHolderDetailsForm.get(formArrayName) as FormArray : formArray = this.authorizedDetailsForm.get(formArrayName) as FormArray
    const formControl = formArray.at(index).get(formControlName);

    if (formControl) {
      const value = formControl.value;
      if (value) {
        (formControl as any)['rawValue'] = value;
        const formattedValue = this.currencyFormatPipe.transform(value);
        formControl.setValue(formattedValue);
      }
    }
  }
  setRoleforAuthorizedSignatory(formArrayName: string, index: number, formControlName: string, role: string, value: any) {
    const formArray = this.authorizedDetailsForm.get(formArrayName) as FormArray;
    const formControl = formArray.at(index).get(formControlName);


    console.log("HTML", value)
    if (formControl) {
      formControl.setValue(value);
      if (role == 'MAKER' && value) {
        formArray.at(index).get('roleChecker')?.setValue(!formArray.at(index).get('roleMaker')?.value);
        console.log("1", formArray.at(index).get('roleChecker')?.value + "--Maker" + formArray.at(index).get('roleMaker')?.value)


      }


      else if (role == 'CHECKER' && value) {
        formArray.at(index).get('roleMaker')?.setValue(!formArray.at(index).get('roleChecker')?.value);
        console.log("2", formArray.at(index).get('roleChecker')?.value + "--Maker" + formArray.at(index).get('roleMaker')?.value)




      }
    }







  }

  createShareholderGroup(): FormGroup {
    return this.fb.group({
      //this.shareHolderDetailsForm = this.fb.group({
      shareholderFirstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]], // Alphanumeric
      shareholderLastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]], // Alphanumeric
      shareholderFatherName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholdertazkiraNo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholderDOB: ['', [Validators.required, this.sharedFunctionsServic.ageValidator()]], // Date
      shareholderPlaceofBirth: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholderNationality: ['', [Validators.required]],
      shareholderMonthlyIncome: ['', Validators.required,],
      shareholdingPercentage: ['', [Validators.required]],
      shareholdingOtherSource: ['', [Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholderRelationship: ['', [Validators.required]],
      shareholderPhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]], // Strictly Numerical
      shareholderTin: ['', [this.optionalShareholderTinValidator()]],
      

      shareholderCurrentlocation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholderCurrentDistrict: ['', [Validators.required]],
      shareholderCurrentProvince: ['', [Validators.required]],
      shareholderCurrentCountry: ['', [Validators.required]],

      //permanentAddresss
      shareholderPermanantDistrict: ['', [Validators.required]],
      shareholderPermanantProvince: ['', [Validators.required]],
      shareholderPermanantCountry: ['', [Validators.required]],


    })
  }

  optionalShareholderTinValidator(): (control: AbstractControl) => ValidationErrors | boolean {
    return (control: AbstractControl): ValidationErrors | boolean => {
      if (!control.value) {
        return true; // Don't validate empty values
      }

      

      return  /^[0-9]+$/.test(control.value) ? true : { numeric: true };
    };


  }
  // createAuthorizedSignatoryGroup(): FormGroup {
  //   return this.fb.group({
  //     authorizedFirstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
  //     authorizedLastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
  //     authorizedEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
  //     authUsername: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
  //     authorizedtazkiraNo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
  //     authorizedDOB: ['', [Validators.required, this.ageValidator()]], // Date
  //     authorizedPlaceofBirth: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
  //     authorizedNationality: ['', [Validators.required]],
  //     authorizedDesignation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
  //     authorizedlocation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
  //     authorizedMonthlyIncome: ['', Validators.required],
  //     authorizedSourceofIncome: ['', [Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
  //     authorizedPhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
  //     authorizedType: ['', Validators.required],
  //     roleMaker: [false, Validators.required],
  //     roleChecker: [false, Validators.required],

  //   })
  // }
  createAuthorizedSignatoryGroup(): FormGroup {
    const group = this.fb.group({
      authorizedFirstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]], // Alphanumeric
      authorizedLastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]], // Alphanumeric
      authorizedEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      authUsername: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+$')]], // Email pattern
      authorizedtazkiraNo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedDOB: ['', [Validators.required, this.ageValidator()]], // Date
      authorizedPlaceofBirth: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedNationality: ['', [Validators.required]],
      authorizedDesignation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedlocation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedMonthlyIncome: ['', Validators.required],
      authorizedSourceofIncome: ['', [Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedPhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      authorizedType: ['', Validators.required],
      roleMaker: [false, Validators.required],
      roleChecker: [false, Validators.required],
    });

    this.attachUsernameValidation(group);

    return group;
  }
  private attachUsernameValidation(group: FormGroup): void {
    const usernameControl = group.get('authUsername');

    if (usernameControl) {
      usernameControl.valueChanges
        .pipe(
          debounceTime(300), // Wait for 300ms after the user stops typing
          distinctUntilChanged() // Only proceed if the value has changed
        )
        .subscribe((username: string) => {
          console.log("Typing username:", username); // Log the username being typed
          // Ensure the username is not empty
          if (username && username.trim().length > 0) {
            console.log("Valid username, calling API..."); // Log before making the API call
            // Call the API to check if the username exists
            this.corporate.checkUserName(username).subscribe(
              (data: any) => {
                console.log("API response:", data); // Log the API response
                if (data?.data === true) {
                  this.showUsernameExist = true; // Show error if username exists
                } else {
                  this.showUsernameExist = false; // Hide error if username is valid
                }
              },
              (error) => {
                console.log("API error:", error); // Handle any API errors
                this.showUsernameExist = false;
              }
            );
          } else {
            // Reset the error state if the input is empty
            this.showUsernameExist = false;
          }
        });
    }
  }



  // private attachUsernameValidation(group: FormGroup): void {
  //   const usernameControl = group.get('authUsername');
  //   if (usernameControl) {
  //     usernameControl.valueChanges
  //       .pipe(
  //         debounceTime(300), // Wait for 300ms of no typing
  //         distinctUntilChanged(), // Only proceed if the value has changed
  //         switchMap((username: string) => {
  //           if (!username || !this.isValidEmail(username)) {
  //             return of(null); // Avoid API call if the field is empty or invalid
  //           }
  //           return this.corporate.checkUserName(username); // Call the API method
  //         }),
  //         catchError(() => of({ exists: false })) // Handle API errors gracefully
  //       )
  //       .subscribe((response: any) => {
  //         console.log("response", response)
  //         if (response?.exists) {
  //           usernameControl.setErrors({ usernameExists: true }); // Set custom error if username exists
  //         } else {
  //           const currentErrors = usernameControl.errors;
  //           if (currentErrors) {
  //             delete currentErrors['usernameExists']; // Remove the custom error if username is available
  //             usernameControl.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
  //           }
  //         }
  //       });
  //   }
  // }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email); // Return true if the email is valid
  }



  get shareHoldersFormArray(): FormArray {
    return this.shareHolderDetailsForm.get('shareHolders') as FormArray;
  }
  get authorizedSignatoryFormArray(): FormArray {
    return this.authorizedDetailsForm.get('authorizedSignatories') as FormArray;
  }

  addShareholder() {
    this.shareHoldersFormArray.clear();


    for (let i = 0; i < Number(this.companyDetailsForm.controls['shareholderCount'].value); i++) {
      this.shareHoldersFormArray.push(this.createShareholderGroup());
    }

  }

  addauthorizedSignatory() {
    console.log("Form - old", this.authorizedDetailsForm);
    this.authorizedSignatoryFormArray.reset();
    this.authorizedSignatoryFormArray.clear();
    this.authorizedSignatoryFormArray.updateValueAndValidity();

    for (let i = 0; i < Number(this.companyDetailsForm.controls['authorizedSignatoryCount'].value); i++) {
      this.authorizedSignatoryFormArray.push(this.createAuthorizedSignatoryGroup());
    }
    console.log("Form - new", this.authorizedDetailsForm);

  }

  selectedTab(selected: string, i: number) {
    this.tab = selected;
    this.currentTab = this.formTabs.indexOf(this.tab);

    //tabDisabled = true;
  }

  saveForm(section: string) {
    if (section === 'Basic Info') {
      //this.isBasicDetailsSaved = this.basicDetailsForm.valid;
    } /* else if (section === 'Company Details') {
      this.isContactDetailsSaved = this.contactDetailsForm.valid;
    } else if (section === 'Company Business License Details') {
      this.isAccountDetailsSaved = this.accountDetailsForm.valid;
    } else if (section === 'Company Business Activities') {
      this.isAccountDetailsSaved = this.accountDetailsForm.valid;
    } else if (section === 'Company Address') {
      this.isAccountDetailsSaved = this.accountDetailsForm.valid;
    } else if (section === 'Authorized Signatory') {
      this.isAccountDetailsSaved = this.accountDetailsForm.valid;
    } else if (section === 'Company Address') {
      this.isAccountDetailsSaved = this.accountDetailsForm.valid;
    } */
  }

  formCompleted(section: string) {
    if (section === 'Basic Info') {
      return this.basicDetailsForm.valid;
    } else if (section === 'Company Details') {
      return this.companyDetailsForm.valid;
    } else if (section === 'Company Business License Details') {
      return this.businessLicenceDetailsForm.valid;
    } else if (section === 'Company Business Activities') {
      return this.businessActivityDetailsForm.valid;
    } else if (section === 'Company Address') {
      return this.companyAddressDetailsForm.valid;
    } else if (section === 'Authorized Signatory Details') {
      console.log(this.authorizedDetailsForm.valid);
      return this.authorizedDetailsForm.valid;
    } else if (section === 'Company Shareholder Details') {
      console.log(this.shareHolderDetailsForm);
      return this.shareHolderDetailsForm.valid;
    }
    else {
      return false;
    }
  }

  allDocumentsAttached() {
    console.log("File", this.attachedFiles);
    if (Object.keys(this.attachedFiles).includes('contactPersonTazkiraPhoto') &&
      Object.keys(this.attachedFiles).includes('contactPersonSign') &&
      Object.keys(this.attachedFiles).includes('businessLicencePhoto') &&
      Object.keys(this.attachedFiles).includes('addressProof') &&
      //Object.keys(this.attachedFiles).includes('shareholderTazkiraPhoto') &&
      
      //Object.keys(this.attachedFiles).includes('authorizedLetter') 
       this.allshareholderDocsAttached()) {
        console.log("All docs atached", this.attachedFiles);
      return true;
      

    }
    else
    console.log("some docs atached", this.attachedFiles);
      return false;
  }

  allshareholderDocsAttached() {
    for (let i = 0; i < this.companyDetailsForm.controls['shareholderCount'].value; i++) {
      if (!(Object.keys(this.attachedFiles).includes('shareholderTazkiraPhoto' + i))) {
        return false;
      }



    }
    for (let i = 0; i < this.companyDetailsForm.controls['authorizedSignatoryCount'].value; i++) {
      if (!( Object.keys(this.attachedFiles).includes('authorizedzkiraPhoto' +i) && Object.keys(this.attachedFiles).includes('authorizedSign' + i))) {
        return false;
      }



    }
    return true;


  }

  resetForm(section: string) {
    if (section === 'Basic Info') {
      this.basicDetailsForm.reset();

    } else if (section === 'Company Details') {
      this.companyDetailsForm.reset();
    } else if (section === 'Company Business License Details') {
      this.businessLicenceDetailsForm.reset();
    } else if (section === 'Company Business Activities') {
      this.businessActivityDetailsForm.reset();
    } else if (section === 'Company Address') {
      this.companyAddressDetailsForm.reset();
    } else if (section === 'Authorized Signatory') {
      this.shareHolderDetailsForm.reset();
    } else if (section === 'Company Address') {
      this.authorizedDetailsForm.reset();
    }

  }

  submitKYCForm() {
    this.isLoading = true;
    //let request = this.createPayload();
  }



  isFormValid(): boolean {
    return false;
    //return this.isCompanyDetailsSaved && this.isContactDetailsSaved && this.isAccountDetailsSaved;
  }

  submitForm() {
    if (this.isFormValid()) {
      // Handle final form submission
      console.log('Form Submitted', {
        //...this.companyDetailsForm.value,
        //...this.contactDetailsForm.value,
        //...this.accountDetailsForm.value
      });
    }
  }

  goToStep(step: number) {
    // this.currentStep = step;
  }



  formatPercentage(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except '.'

    if (value) {
      value = parseFloat(value).toFixed(2); // Format to two decimal places
      input.value = `${value}%`; // Append percentage symbol
      this.corporateForm.patchValue({ shareholdingPercentage: value }); // Update form control value without the '%' symbol
    }
  }
  getNatureofBusiness() {
    this.corporate.getAllFirmType().subscribe({
      next: (data: any) => {
        this.natureofBusinesses = data?.data;
      }
    });

  }
  getCountries() {
    this.corporate.getCountries().subscribe({
      next: (data: any) => {
        this.nationalities = data?.data;
      }
    });
  }

  getProvinces() {
    this.corporate.getprovinces().subscribe({
      next: (data: any) => {
        this.provinces = data?.data;
      }
    });
  }
  onSelectProvince($event: any, type?: string) {
    this.provinceId = $event.target.value;
    console.log(this.provinceId);
    const filteredProvinces = this.provinces.filter((province: any) => province.name === this.provinceId);
    if (filteredProvinces && filteredProvinces.length > 0) {
      this.selectedProvinceName = filteredProvinces[0].id;
      console.log("Hi",this.selectedProvinceName);
    }
   
    (type)?this.getDistricts(this.selectedProvinceName,type):this.getDistricts(this.selectedProvinceName) ;
  }
  getDistricts(provinceId: number, type?: string) {
    
    this.corporate.getdistricts(provinceId).subscribe({
      next: (data: any) => {
        if(type && type == 'current'){
          //this.currentDistrictsArray.push({index:index,provinceId : provinceId);
          this.currentDistricts = data?.data;


         
        }
        else
        this.districts = data?.data;
      }
    });
  }
  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
  deleteFile(index: number) {
    this.otherDocArray.splice(index, 1);

  }

  onFileSelected(event: any, formControlName: string, tab?: string, form?: string, index?: any) {


    //const input = event.target as HTMLInputElement;
    if (event.target.files[0]) {
      const file = event.target.files[0];
      if (form && form == 'NGO') {
        this.attachedFilesNgoUN[index].file = file;
        console.log(this.attachedFilesNgoUN);
      }
      else if (form && form == 'GOVT') {


      }
      else {
        if (formControlName == 'otherDoc') {
          this.otherDocArray.push(file);
          console.log("otherdocs", this.otherDocArray);

        }
        else {
          this.attachedFiles[formControlName] = file;
          console.log("this.attachedFiles", this.attachedFiles);
        }

      }



    }
  }
  onFileSelectedForShareholderAndAuthorizedSignatories(event: any, formControlName: string, tab: string, index: number,) {
    //const input = event.target as HTMLInputElement;
    if (event.target.files[0]) {
      console.log(this.attachedFiles)
      const file = event.target.files[0];
      let key = formControlName + index;
      this.attachedFiles[key] = file;
      this.file1 = file
      this.fileName = formControlName

      console.log("this.attachedFiles-shareholder", this.attachedFiles)
    }
  }
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible; // Toggle the visibility
  }
  addShareholderImage() {
    this.shareholderCount1 = this.companyDetailsForm.get('shareholderCount')?.value;

    // Convert shareholderCount to a number
    this.shareholderImgCount = parseInt(this.shareholderCount1, 10);

    // Ensure shareholderCount is a valid number
    if (this.shareholderImgCount && this.shareholderImgCount > 0) {
      const shareholders = this.registerResponse?.shareholders; // Get shareholders from registerResponse

      if (shareholders && shareholders.length > 0) {
        for (let i = 0; i < this.shareholderImgCount; i++) {
          // Ensure there is a matching shareholder
          if (shareholders[i]) {
            const shareholderId = shareholders[i].id; // Get the shareholder ID

            // Submit file for each shareholder using their respective ID
            this.corporate.submitCorporateKYCShareholderFiles("idProofFrontPhoto", this.userId, shareholderId, this.attachedFiles['shareholderTazkiraPhoto' + i]).subscribe(
              (data: any) => {
                console.log(`File submitted successfully for shareholder ${i + 1}`);
              },
              (error: any) => {
                console.error(`Error submitting file for shareholder ${i + 1}`, error);
              }
            );
          } else {
            console.error(`No shareholder data found for index ${i}`);
          }
        }
      } else {
        console.error('No shareholders found in register response.');
      }
    } else {
      console.error('Invalid number of shareholders.');
    }
  }
  addSignatoryImage() {

    const signatoryCount = parseInt(this.companyDetailsForm.get('authorizedSignatoryCount')?.value);


    if (signatoryCount && signatoryCount > 0) {
      const signatories = this.registerResponse?.signatories;

      if (signatories && signatories.length > 0) {
        for (let i = 0; i < signatoryCount; i++) {
          if (signatories[i]) {
            const signatoryId = signatories[i].id; // Get the shareholder ID

            // Define the files to upload for the current signatory
            let filesToUpload = [
              { field: 'signatoryPhoto', file: this.attachedFiles['authorizedPhoto' + i] },
              { field: 'idProofFrontPhoto', file: this.attachedFiles['authorizedzkiraPhoto' + i] },
              { field: 'signaturePhoto', file: this.attachedFiles['authorizedSign' + i] },
              { field: 'authorizationLetterPhoto', file: this.attachedFiles['authorizedLetter' + i] }

            ];

            // Sequentially upload each file using concatMap
            from(filesToUpload).pipe(
              concatMap(({ field, file }) => {
                if (file) {
                  return this.corporate.submitCorporateKYCSignatoryFiles(field, this.userId, signatoryId, file);
                }
                return of(null); // Skip upload if file is missing
              })
            ).subscribe({
              next: (response) => {
                console.log(`File uploaded successfully for signatory ${i + 1}`, response);
              },
              error: (err) => {
                console.error(`Error uploading file for signatory ${i + 1}`, err);
              },
              complete: () => {
                console.log(`All files processed for signatory ${i + 1}`);
              }
            });

          } else {
            console.error(`No signatory data found for index ${i}`);
          }
        }
      } else {
        console.error('No signatory found in register response.');
      }
    } else {
      console.error('Invalid number of signatories.');
    }

    /*  this.corporate.submitCorporateKYCSignatoryFiles("signatoryPhoto", this.userId, signatoryId, this.attachedFiles['authorizedPhoto' + i]).subscribe(
       (data: any) => {
         console.log(`File submitted successfully for signatory ${i + 1}`, this.file5);
       },
       (error: any) => {
         console.error(`Error submitting file for signatory ${i + 1}`, error);
       }
     )
   } else {
     console.error(`No signatory data found for index ${i}`);
   }
 }
} else {
 console.error('No signatory found in register response.');
}
} else {
console.error('Invalid number of signatory.');
} */

  }

  previousTab(tab: string) {
    let index = this.formTabs.indexOf(tab);

    this.selectedTab(this.formTabs[--index], --index);

  }
  nextTab(tab: string) {
    let index = this.formTabs.indexOf(tab);

    this.selectedTab(this.formTabs[++index], ++index);

  }
  onFileSelectedForProfile(event: any) {
    //const input = event.target as HTMLInputElement;
    if (event.target.files[0]) {
      const file = event.target.files[0];
      this.profile = file
    }
  }

  



  uploadDocuments(): Observable<boolean> {
    if (this.basicDetailsForm.get('organizationType')?.value == 'CORPORATE') {
      this.addShareholderImage()
      this.addSignatoryImage();
      const fileMappings = [
        { key: 'contactPersonTazkiraPhoto', mapping: 'contactIdProofFrontPhoto', file: this.attachedFiles['contactPersonTazkiraPhoto'] },
        { key: 'contactPersonSign', mapping: 'contactSignaturePhoto', file: this.attachedFiles['contactPersonSign'] },
        { key: 'businessLicencePhoto', mapping: 'bizLicensePhoto', file: this.attachedFiles['businessLicencePhoto'] },
        { key: 'addressProof', mapping: 'addressProofPhoto', file: this.attachedFiles['addressProof'] },
        /* { key: 'shareholderTazkiraPhoto', mapping: 'idProofFrontPhoto', file: this.attachedFiles['shareholderTazkiraPhoto'] },
        { key: 'authorizedPhoto', mapping: 'signatoryPhoto', file: this.attachedFiles['authorizedPhoto'] },
        { key: 'authorizedzkiraPhoto', mapping: 'idProofFrontPhoto', file: this.attachedFiles['authorizedzkiraPhoto'] },
        { key: 'authorizedSign', mapping: 'signaturePhoto', file: this.attachedFiles['authorizedSign'] },
        { key: 'authorizedLetter', mapping: 'authorizationLetterPhoto', file: this.attachedFiles['authorizedLetter'] } */
      ].filter(({ file }) => file);  // Filter out any undefined files
      /* if (this.profile) {
        this.corporate.submitCorporateProfilePic(this.profile).subscribe((res) => {
          console.log(res);

        })
      } */
      return of(...fileMappings).pipe(
        concatMap(({ mapping, file }) => {
          // Call `addShareholderImage` if mapping is 'idProofFrontPhoto'
          //if (mapping === 'idProofFrontPhoto') {

          //}

          return this.corporate.submitCorporateKYCFiles(this.userId, mapping, file).pipe(
            map((response: any) => response?.responseCode == 200), // Map to `true` if successful, `false` otherwise
            catchError(error => {
              console.error("Error submitting file", error,mapping);
              return of(false); // Return `false` instead of `null` to indicate failure
            })
          );
        }),
        toArray(),
        map((results: boolean[]) => results.every(success => success))  // Return `true` only if all results are `true`
      );

    }
    else if (this.basicDetailsForm.get('organizationType')?.value == 'NGO') {
      const filteredFile = this.attachedFilesNgoUN.filter(({ file }) => file);
      return of(...filteredFile).pipe(
        concatMap(({ mapping, file }) => {
          return this.corporate.submitCorporateNGOKYCFiles(this.userId, mapping, file).pipe(
            map((response: any) => response?.responseCode === 200), // Map to `true` if successful, `false` otherwise
            catchError(error => {
              console.error("Error submitting file", error);
              return of(false); // Return `false` instead of `null` to indicate failure
            })
          );
        }),
        toArray(),
        map((results: boolean[]) => results.every(success => success))  // Return `true` only if all results are `true`
      );

    }
    else if (this.basicDetailsForm.get('organizationType')?.value == 'GOVT_AGENCY' || this.basicDetailsForm.get('organizationType')?.value == 'UN_AGENCY'){
      const filteredFile = this.attachedFilesNgoUN.filter(({ file }) => file);
      return of(...filteredFile).pipe(
        concatMap(({ mapping, file }) => {
          return this.corporate.submitCorporateGOVTAgencyKYCFiles(this.userId, mapping, file).pipe(
            map((response: any) => response?.responseCode === 200), // Map to `true` if successful, `false` otherwise
            catchError(error => {
              console.error("Error submitting file", error);
              return of(false); // Return `false` instead of `null` to indicate failure
            })
          );
        }),
        toArray(),
        map((results: boolean[]) => results.every(success => success))  // Return `true` only if all results are `true`
      );

    }
    else{
      return of(false);

    }

  }
  uploadAdditionalDocuments(): Observable<boolean> {

    return of(...this.otherDocArray).pipe(
      concatMap((file: any) => {
        // Call `addShareholderImage` if mapping is 'idProofFrontPhoto'
        //if (mapping === 'idProofFrontPhoto') {

        //}

        return this.corporate.submitCorporateKYCFiles(this.userId, 'otherDocs', file).pipe(
          map((response: any) => response?.responseCode === 200), // Map to `true` if successful, `false` otherwise
          catchError(error => {
            console.error("Error submitting Additional Document", error);
            return of(false); // Return `false` instead of `null` to indicate failure
          })
        );
      }),
      toArray(),
      map((results: boolean[]) => results.every(success => success))  // Return `true` only if all results are `true`
    );
  }

  showFilename(formControlName: string) {
    if (this.attachedFiles[formControlName]) {
      return true;
    }
    else {
      return false;
    }

  }
  showFilenameNGO(index: number): boolean {
    return this.attachedFilesNgoUN[index].mapping && this.attachedFilesNgoUN[index].file ? !!this.attachedFilesNgoUN[index].file : false;
  }
  showFilenameForShareholdersAndAuthorizedSignatories(formArrayName: string, index: number, formControlName: string) {
    const formArray = this.shareHolderDetailsForm.get(formArrayName) as FormArray;
    const formControl = formArray.at(index).get(formControlName);

    if (this.attachedFiles[formControlName]) {
      return true;
    }
    else {
      return false;
    }

  }

  change(event: any) {
    console.log(event.target.value);

  }

  availableOptions = ['PRESIDENT', 'VICE_PRESIDENT', 'SHAREHOLDER'];
  getSelectedOptions(): string[] {
    return this.shareHoldersFormArray.controls
      .map(control => control.get('shareholderRelationship')?.value)
      .filter(value => value); // Filter out null or empty values
  }

  isOptionDisabled(option: string, currentIndex: number): boolean {
       if (option === 'SHAREHOLDER') {
    return false;
  }
    const selectedOptions = this.getSelectedOptions();
    return selectedOptions.includes(option) &&
      this.shareHoldersFormArray.at(currentIndex).get('shareholderRelationship')?.value !== option;
  }

  checkEmailExistence() {
    const email = this.basicDetailsForm.get('corporateEmail')?.value;

    if (email) {
      this.corporate.checkEmailExist(email).subscribe(
        (response: any) => {
          if (response && response.data) {
            // Check if email matches any record with user type 'CUSTOMER'
            const customerMatch = response.data.find(
              (item: any) =>
                item.email === email && item.usertype === 'CORPORATE'
            );

            if (customerMatch) {
              this.emailError = 'Email is already registered for a customer.';
            } else {
              this.emailError = null; // Clear the error message if no match is found
            }
          }
        },
        (error) => {
          console.error('Error checking email existence:', error);
        }
      );
    }
  }
  checkPhoneExistence() {
    const phone = this.basicDetailsForm.get('corporatePhone')?.value;

    if (phone) {
      this.corporate.checkPhoneExist(phone).subscribe(
        (response: any) => {
          if (response && response.data) {
            // Check if email matches any record with user type 'CUSTOMER'
            const customerMatch = response.data.find(
              (item: any) =>
                item.phone === phone && item.usertype === 'CORPORATE'
            );

            if (customerMatch) {
              this.phoneError = 'Phone number is already registered for a customer.';
            } else {
              this.phoneError = null; // Clear the error message if no match is found
            }
          }
        },
        (error) => {
          console.error('Error checking phone existence:', error);
        }
      );
    }
  }

  /* detectFiles(event: any, selectedTab: string, filetitle : string) {
    if (event.target.files && event.target.files[0]) {
      let attachment = event.target.files[0];
      if(selectedTab == 'Basic Info'){
        
  
      } */
  // this.uploadedImage = event.target.files[0];
  // this.uploadedImageFileName = event.target.files[0].name;
  // this.uploadedImageFileType = event.target.files[0].type
  // this.uploadedImageFileNameExtension = event.target.files[0].name.split('.').pop();
  // const file = event.target.files[0];
  // const reader = new FileReader();
  // reader.readAsDataURL(file);
  // this.uploadedImageFileData = reader.result;
  // reader.onload = () => {
  //   this.uploadedImageFileData = reader.result;
  // };



  detectFilesAuth(event: any) {
    if (event.target.files && event.target.files[0]) {
      // this.uploadedImageAuth = event.target.files[0];
      // this.uploadedImageFileName = event.target.files[0].name;
      // this.uploadedImageFileType = event.target.files[0].type
      // this.uploadedImageFileNameExtension = event.target.files[0].name.split('.').pop();
      // const file = event.target.files[0];
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // this.uploadedImageFileData = reader.result;
      // reader.onload = () => {
      //   this.uploadedImageFileData = reader.result;
      // };
    }

  }
  detectFilesPresident(event: any) {
    if (event.target.files && event.target.files[0]) {
      //this.uploadedImagePres = event.target.files[0];
      // this.uploadedImageFileName = event.target.files[0].name;
      // this.uploadedImageFileType = event.target.files[0].type
      // this.uploadedImageFileNameExtension = event.target.files[0].name.split('.').pop();
      // const file = event.target.files[0];
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // this.uploadedImageFileData = reader.result;
      // reader.onload = () => {
      //   this.uploadedImageFileData = reader.result;
      // };
    }

  }
  detectFilesVice(event: any) {
    if (event.target.files && event.target.files[0]) {
      //this.uploadedImageVice = event.target.files[0];
      // this.uploadedImageFileName = event.target.files[0].name;
      // this.uploadedImageFileType = event.target.files[0].type
      // this.uploadedImageFileNameExtension = event.target.files[0].name.split('.').pop();
      // const file = event.target.files[0];
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // this.uploadedImageFileData = reader.result;
      // reader.onload = () => {
      //   this.uploadedImageFileData = reader.result;
      // };
    }

  }
  detectFilesKyc(event: any) {
    if (event.target.files && event.target.files[0]) {
      //this.uploadedImageKyc = event.target.files[0];
      // this.uploadedImageFileName = event.target.files[0].name;
      // this.uploadedImageFileType = event.target.files[0].type
      // this.uploadedImageFileNameExtension = event.target.files[0].name.split('.').pop();
      // const file = event.target.files[0];
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // this.uploadedImageFileData = reader.result;
      // reader.onload = () => {
      //   this.uploadedImageFileData = reader.result;
      // };
    }

  }
  detectFilesOp(event: any) {
    if (event.target.files && event.target.files[0]) {
      //this.uploadedImageOp = event.target.files[0];
      // this.uploadedImageFileName = event.target.files[0].name;
      // this.uploadedImageFileType = event.target.files[0].type
      // this.uploadedImageFileNameExtension = event.target.files[0].name.split('.').pop();
      // const file = event.target.files[0];
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // this.uploadedImageFileData = reader.result;
      // reader.onload = () => {
      //   this.uploadedImageFileData = reader.result;
      // };
    }

  }
  detectFilesCom(event: any) {
    if (event.target.files && event.target.files[0]) {
      //this.uploadedImageCom = event.target.files[0];
      // this.uploadedImageFileName = event.target.files[0].name;
      // this.uploadedImageFileType = event.target.files[0].type
      // this.uploadedImageFileNameExtension = event.target.files[0].name.split('.').pop();
      // const file = event.target.files[0];
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // this.uploadedImageFileData = reader.result;
      // reader.onload = () => {
      //   this.uploadedImageFileData = reader.result;
      // };
    }

  }
  onCancel() {
    this.cancel.emit();
  }
      
  

  getuserPermissions(){
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrivileges = this.userPrivileges[0];  
      console.log(this.userPrivileges);    

      for (let item of this.userPrivileges?.uiComponentPrivileges) {
        if (item?.component?.componentName == 'KYC') {
          if (item.subComponent?.subComponentName == 'Incomplete Corporate KYC')
            this.kycPrivelege = item;
          console.log(this.kycPrivelege);
        }
      }
    }
  }
  getincompleteKycData(page : number){
    this.KycService.getIncompleteCorporateKyc(this.page).subscribe((data:any) =>{
      
      this.incompleteKycData = (data?.data.filter((item: any) => item.kycType == 'CORPORATE'));
      console.log("Result -", this.incompleteKycData);

    })

  }

  onClickEdit(kycItem : any){
    console.log("item",kycItem);
    //this.router.navigate(["user-management/corporate"], { queryParams: { data: JSON.stringify(kycItem) } });
      this.kycId = kycItem?.id;
     // this.KycService.setItem(kycItem);
      this.item=kycItem;
      this.showForm = true;
      this.patchValueForm();
  }

  onNextPage() {
    this.page++;
    this.getincompleteKycData(this.page);
  }
  onPreviousPage() {
    if (this.page > 0) {
      this.page--;  
      this.getincompleteKycData(this.page);    
    }
  }
  patchValueForm(){
   // this.dobValue = this.item?.corporateKyc?.signatoryDOB
   // this.firstNameValue = this.item?.corporateKyc?.signatoryFirstName;
   console.log("Item", this.item);
    this.basicDetailsForm.patchValue({ type: this.item?.kycType || 'NIL' });
    this.basicDetailsForm.patchValue({ corporteFirstName: this.item?.submittedFor?.firstName || 'NIL' })
    this.basicDetailsForm.patchValue({ corporteLastName: this.item?.submittedFor?.lastName || 'NIL' })
    this.basicDetailsForm.patchValue({ corporatePhone: this.item?.submittedFor?.phone || 'NIL' })
    this.basicDetailsForm.patchValue({ corporateEmail: this.item?.submittedFor?.email || 'NIL' })
    this.basicDetailsForm.patchValue({ organizationType:  this.item?.kycType || 'NIL'  })

    this.companyDetailsForm.patchValue({ companyName:  this.item?.corporateKyc?.companyName || 'NIL'  })
    this.companyDetailsForm.patchValue({ contactpersonDesignation:  this.item?.corporateKyc?.contactPersonDesignation || 'NIL'  })
    this.companyDetailsForm.patchValue({ authorizedSignatoryCount:  this.item?.corporateKyc?.signatories.length || 'NIL'  })
    this.companyDetailsForm.patchValue({ contactPersonName:  this.item?.corporateKyc?.contactPersonName || 'NIL'  })
    this.companyDetailsForm.patchValue({ shareholderCount:  this.item?.corporateKyc?.shareholders.length || 'NIL'  })

    this.businessLicenceDetailsForm.patchValue({ licenceNumber:  this.item?.corporateKyc?.bizLicenseNumber || 'NIL'  })
    this.businessLicenceDetailsForm.patchValue({ dateofIssue:  this.item?.corporateKyc?.bizLicenseDateOfIssue || 'NIL'  }) 
    this.businessLicenceDetailsForm.patchValue({ tinNumber:  this.item?.corporateKyc?.bizLicenseTinNumber || 'NIL'  })
    this.businessLicenceDetailsForm.patchValue({ licenceIssueAuthority:  this.item?.corporateKyc?.bizLicenseAuthority || 'NIL'  })
    this.businessLicenceDetailsForm.patchValue({ dateofExpiry:  this.item?.corporateKyc?.bizLicenseDateOfExpiry || 'NIL'  })

    this.businessActivityDetailsForm.patchValue({ businessName:  this.item?.corporateKyc?.bizName || 'NIL'  })
    this.businessActivityDetailsForm.patchValue({ natureofBusiness:  this.item?.corporateKyc?.natureOfBiz || 'NIL'  })
    this.businessActivityDetailsForm.patchValue({ monthlyIncome:  this.item?.corporateKyc?.monthlyIncome || 'NIL'  })
    this.businessActivityDetailsForm.patchValue({ sourceofFund:  this.item?.corporateKyc?.sourceOfFund || 'NIL'  })
   // this.businessActivityDetailsForm.patchValue({ natureofBusiness:  this.item?.corporateKyc?.bizLicenseNumber || 'NIL'  })
    this.businessActivityDetailsForm.patchValue({ netWorth:  this.item?.corporateKyc?.netWorth || 'NIL'  })
    this.businessActivityDetailsForm.patchValue({ monthlyTurnover:  this.item?.corporateKyc?.monthlyTurnover || 'NIL'  })
    
    this.companyAddressDetailsForm.patchValue({ officePhone:  this.item?.corporateKyc?.companyOfficePhone || 'NIL'  })
    this.companyAddressDetailsForm.patchValue({ country:  this.item?.corporateKyc?.companyCountry || 'NIL'  })
    this.companyAddressDetailsForm.patchValue({ province:  this.item?.corporateKyc?.companyProvince || 'NIL'  })
    this.companyAddressDetailsForm.patchValue({ location:  this.item?.corporateKyc?.companyLocation || 'NIL'  })
    this.companyAddressDetailsForm.patchValue({ officeEmail:  this.item?.corporateKyc?.companyEmail || 'NIL'  })
    this.companyAddressDetailsForm.patchValue({ streetNumber:  this.item?.corporateKyc?.companyStreet || 'NIL'  })
    this.companyAddressDetailsForm.patchValue({ houseNumber:  this.item?.corporateKyc?.companyHouseNumber || 'NIL'  })
    this.companyAddressDetailsForm.patchValue({ district:  this.item?.corporateKyc?.companyDistrict || 'NIL'  })
   // this.companyAddressDetailsForm.patchValue({ businessName:  this.item?.corporateKyc?.bizLicenseNumber || 'NIL'  })
    //this.businessActivityDetailsForm.patchValue({ businessName:  this.item?.corporateKyc?.bizLicenseNumber || 'NIL'  })



    //this.businessLicenceDetailsForm.patchValue({ shareholderCount:  this.item?.corporateKyc?.companyName || 'NIL'  })
    /* this.companyDetailsForm.patchValue({ companyName:  this.item?.corporateKyc?.companyName || 'NIL'  })
    this.companyDetailsForm.patchValue({ companyName:  this.item?.corporateKyc?.companyName || 'NIL'  })
    this.companyDetailsForm.patchValue({ companyName:  this.item?.corporateKyc?.companyName || 'NIL'  })
    this.companyDetailsForm.patchValue({ companyName:  this.item?.corporateKyc?.companyName || 'NIL'  })
    this.companyDetailsForm.patchValue({ companyName:  this.item?.corporateKyc?.companyName || 'NIL'  })
    this.companyDetailsForm.patchValue({ companyName:  this.item?.corporateKyc?.companyName || 'NIL'  }) */


   
    /* this.superAgentForm.patchValue({ MMwallet: this.item?.corporateKyc?.companyWalletNumber || 'NIL' })
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
    this.superAgentForm.patchValue({ grossAnnualIncome: this.item?.corporateKyc?.natureOfBiz || 'NIL' }) */
    // this.superAgentForm.patchValue({ monthlyIncome: item?.corporateKyc?.monthlyIncome || 'NIL' })
   /*  this.superAgentForm.patchValue({
      monthlyIncome: this.item?.corporateKyc?.monthlyIncome
        ? `AFN ${this.formatNumber(this.item.corporateKyc.monthlyIncome)}`
        : 'NIL'
    }); */
    // this.superAgentForm.patchValue({ netWorth: item?.corporateKyc?.netWorth || 'NIL' })
    /* this.superAgentForm.patchValue({
      netWorth: this.item?.corporateKyc?.netWorth
        ? `AFN ${this.formatNumber(this.item.corporateKyc.netWorth)}`
        : 'NIL'
    });
    this.superAgentForm.patchValue({ fundSrc: this.item?.corporateKyc?.sourceOfFund || 'NIL' })
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
  } */


  }
}
