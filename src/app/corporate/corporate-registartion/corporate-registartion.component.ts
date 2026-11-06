import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import {
  AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, ValidationErrors, ValidatorFn
} from '@angular/forms';
import { CorporateService } from '../corporate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyFormatPipe } from '../../pipe/currency-format.pipe';
import { catchError, combineLatest, concatMap, debounceTime, distinctUntilChanged, filter, from, map, Observable, of, shareReplay, switchMap, take, tap, throwError, toArray } from 'rxjs';
import { SharedFunctionsService } from '../../shared-functions.service';
import { DataSharingService } from '../../product/dataSharing/data-sharing.service';
import { isUndefined } from 'util';
import { KycModule } from '../../kyc/kyc/kyc.module';
import { KycModuleService } from '../../kyc/kyc/kyc-module.service';

@Component({
  selector: 'app-corporate-registartion',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './corporate-registartion.component.html',
  styleUrl: './corporate-registartion.component.css'
})
export class CorporateRegistartionComponent implements OnDestroy {
  @Output() cancel = new EventEmitter<void>();
  public corporateForm: FormGroup = new FormGroup({});
  showTooltip: boolean = false;
  formTabs: string[] = [];
  currentTab: number = 0;
  nationalities: any;
  provinceId: any;
  selectedProvinceName: any;
  initForm: any;
  tab!: string;
  isLoading: boolean = false;
  basicDetailsForm!: FormGroup<{ type: FormControl<string | null>; corporteFirstName: FormControl<string | null>; corporteLastName: FormControl<string | null>; corporateEmail: FormControl<string | null>; corporatePhone: FormControl<string | null>;currentProvince: FormControl<string | null>; corporatePassword: FormControl<string | null>; isFundingParty: FormControl<string | null>, SalarythirdLevelAuth: FormControl<any | null>; organizationType: FormControl<any | null>; }>;
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
  corporateFilesChanged: { [key: string]: boolean } = {};
  errorMessages: { [key: string]: string } = {};
  attachedFilesNgoUN: { mapping?: string, title?: string, file?: File | undefined, fileURL?: string | undefined }[] = [];
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
  accPurpose: any;
  purposeOfAccount: any;
  profile!: File;
  authorizedSignatoryGroup: FormGroup = new FormGroup({});
  showUsernameExist: boolean = false;
  payloadForSubmitKYC!: {};
  currentProvinces: any[] = [];
  emailError: string | null = null;
  phoneError: string | null = null;
  taskiraOrPass: any;
  shareTaskiraType: any;
  showSharePass: boolean = false;
  showShareTaskira: boolean = false;
  authTaskiraOrPass: any;
  showAuthPass: boolean = false;
  showAuthTaskira: boolean = false;
  showngoCommitteePass: boolean = false;
  showngoCommitteeTaskira: boolean = false;
  ngoCommitteeTaskiraOrPass: any;
  showNgoRepPass: boolean = false;
  showNgoRepTaskira: boolean = false;
  ngoRepTaskiraOrPass: any;
  showUnGovtPass: boolean = false;
  showUnGovtTaskira: boolean = false;
  unGovtTaskiraOrPass: any;
  public passError: string | null = null;
  shareTaskiraOrPass: any;
  corporateId: any;
  currentDate!: any;
  error: boolean = false;
  tazkiraControl: any;
  passportControl: any;
  registerResponseSignatory: any;
  kycData: any;
  addtionalDocs: any[] = [];
  source: any;
  signPhoto: any;
  existingContactSignFileName: any;
  corporateIdReg: any;
  // tabSaveCompleted: { [key: string]: boolean } = {};
  tabSaveCompleted: Record<string, boolean> = {};

  corporateUpdateId: any;
  imageChanged: Record<string, boolean> = {};
  currentForm: FormGroup | null = null;
  showPassExist: boolean = false;
  showIdExist: boolean = false;
  showShareIdExist: boolean = false;
  showSharePassExist: boolean = false;
  showAuthPhoneExist: boolean = false;
  showSharePhoneExist: boolean = false;
  otherDocsEdited: boolean = false;
  accPurposeData: any;
  provinces: any[] = [];
  provinces$!: Observable<any[]>;
  districts: any[] = [];
  currentDistricts: any[] = [];
  permDistricts: any[] = [];
  permDistrictsMap: { [index: number]: any[] } = {};
  currentDistrictsMap: { [index: number]: any[] } = {};
  digitalSignatureFile: File | null = null;
  digitalSignatureUploaded = false;
  opnSignatureFileName: string= '';

  constructor(private corporate: CorporateService, private route: ActivatedRoute,
    private fb: FormBuilder, private sharedFunctionsServic: SharedFunctionsService,
    private router: Router, private currencyFormatPipe: CurrencyFormatPipe, private service: DataSharingService, private kycService: KycModuleService
  ) {
    this.service.corporateDataService$.subscribe((res) => {
      this.kycData = res
      if (this.kycData) {
        let docs
        if (this.kycData?.kycType === 'CORPORATE') {
          docs = this.kycData?.corporateKyc?.otherDocs;
        }
        else if (this.kycData?.kycType === 'NGO') {
          docs = this.kycData?.ngoKyc?.otherDocs;
        }

        // Always create a proper structure
        if (docs && typeof docs === 'string' && docs.trim() !== '') {
          this.addtionalDocs.push(docs.split(','));
        } else {
          this.addtionalDocs = [[]];
        }
        console.log(this.addtionalDocs, "Corporate Docs");
      }

    })
  }

  ngOnInit(): void {
    this.getCountries();
    this.getDistricts;
    this.getProvinces();
    this.getNatureofBusiness();
    this.getAccPurpose();

    this.source = this.route.snapshot.queryParamMap.get('source');
    console.log('Navigation Source:', this.source);
    this.kycData = this.kycService.getItem();
    this.basicDetailsForm = this.fb.group({
      type: ['', [Validators.required]],
      corporteFirstName: ['', Validators.required],
      corporteLastName: ['', Validators.required],
      corporateEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      corporatePhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      currentProvince : ['', Validators.required],      
      corporatePassword: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[0-9]*$')]],      
      isFundingParty: ['False', Validators.required],
      SalarythirdLevelAuth: ['', Validators.required],
      organizationType: ['', Validators.required]
    })

    if (!this.kycData) {
      this.formTabs = ['Basic Info'];
      this.tab = 'Basic Info';

    }
    else {
      this.corporateId = this.kycData?.submittedFor?.id;
      // this.corporateUpdateId = this.kycData?.submittedFor?.id
      console.log(this.corporateId);
      this.basicDetailsForm.get('SalarythirdLevelAuth')?.clearValidators();
      this.basicDetailsForm.get('SalarythirdLevelAuth')?.updateValueAndValidity({ emitEvent: false });
      this.basicDetailsForm.get('SalarythirdLevelAuth')?.setErrors(null);
      this.basicDetailsForm.get('corporatePassword')?.clearValidators();
      this.basicDetailsForm.get('corporatePassword')?.updateValueAndValidity({ emitEvent: false });
      this.basicDetailsForm.get('corporatePassword')?.setErrors(null);
      this.basicDetailsForm.get('type')?.clearValidators();
      this.basicDetailsForm.get('type')?.updateValueAndValidity({ emitEvent: false });
      this.basicDetailsForm.get('type')?.setErrors(null);


      this.basicDetailsForm.patchValue({ organizationType: `${this.kycData?.kycType}` });
      console.log(this.basicDetailsForm.get('organizationType')?.value, "this.basicDetailsForm.get('organizationType')?.value");
      if (this.basicDetailsForm.get('organizationType')?.value == 'CORPORATE') {
        this.generateBusinessCorporateForm();
      }
      else if (this.basicDetailsForm.get('organizationType')?.value == 'NGO') {
        this.generateNGOForm();
      }
      else if (this.basicDetailsForm.get('organizationType')?.value == 'UN_AGENCY' || this.basicDetailsForm.get('organizationType')?.value == 'GOVT_AGENCY') {
        this.generateUNGovtAgencyForm();
      }
      //this.basicDetailsForm.get('organizationType')?.disable();

    }

    this.basicDetailsForm.get('type')?.valueChanges.subscribe(type => {
      if (this.basicDetailsForm.get('type')?.value == 'SUPPLIER' || this.basicDetailsForm.get('type')?.value == 'SYSTEM_OP') {
        //this.generateBusinessCorporateForm();
        this.basicDetailsForm.patchValue({ organizationType: 'CORPORATE' });

      }
      else {
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

    this.companyDetailsForm?.get('shareholderCount')?.valueChanges.subscribe(count => {
      if (this.kycData) {
        this.sharholderFormfetch();
      }
    });

    this.companyDetailsForm?.get('authorizedSignatoryCount')?.valueChanges.subscribe(count => {
      if (this.kycData) {
        this.signatoryFormFetch();
      }
      //alert("Authorized Signatory Count Changed");
    });

    this.ngoDetailsForm?.get('exMemberCount')?.valueChanges.subscribe(count => {
      if (this.kycData) {
        this.ngoExecutiveFormFetch();
      }
    });

  }
  private loadDistrictAndPatch(provinceName: string, districtApiCallback: (districts: any[]) => void, patchCallback: () => void) {
    if (!provinceName) return;
    this.provinces$
      .pipe(
        take(1),
        map((provinces) =>
          provinces.find((p: any) => p.name === provinceName)?.id
        ),
        filter(Boolean),
        switchMap((provinceId) =>
          this.corporate.getdistricts(provinceId)
        )
      )
      .subscribe({
        next: (res: any) => {
          districtApiCallback(res?.data || []);
          patchCallback();
        },
        error: (err) => console.error('District load error', err)
      });
  }

  // resetAllForms() {
  //   this.basicDetailsForm.reset({ isFundingParty: 'False' });
  //   this.companyDetailsForm.reset();
  //   this.businessLicenceDetailsForm.reset();
  //   this.businessActivityDetailsForm.reset();
  //   this.companyAddressDetailsForm.reset();

  //   (this.shareHolderDetailsForm.get('shareHolders') as FormArray).clear();
  //   (this.authorizedDetailsForm.get('authorizedSignatories') as FormArray).clear();
  // }
  //update validation 1 method
  /* private createShareholderForm(sh?: any): FormGroup {
    const isTazkira = sh?.idProofType === 'E_TAZKIRA';

    return this.fb.group({
      shareholderFirstName: [sh?.firstName || '', Validators.required],
      shareholderLastName: [sh?.lastName || '', Validators.required],
      shareholderFatherName: [sh?.fatherName || '', Validators.required],
      shareholderDOB: [sh?.dob || '', Validators.required],
      shareholderNationality: [sh?.nationality || '', Validators.required],
      shareholderPhone: [
        sh?.phone || '',
        [Validators.required, Validators.pattern('^[0-9]+$')]
      ],
      shareholderRelationship: [sh?.relationship || '', Validators.required],
      shareholdingPercentage: [sh?.shareholdingPercentage || '', Validators.required],

      shareholderIdProofType: [
        isTazkira ? 'TAZKIRA' : 'PASSPORT',
        Validators.required
      ],

      shareholdertazkiraNo: [isTazkira ? sh?.idProofNumber : null],
      shareholderPassNo: [!isTazkira ? sh?.idProofNumber : null],

      shareholderCurrentCountry: [sh?.currCountry || '', Validators.required],
      shareholderPermanantCountry: [sh?.permCountry || '', Validators.required]
    });
  } */

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
      'Other Documents (Optional)',
      'Final Submission'
    ]
    this.tab = 'Basic Info';
    this.formTabs = [...this.formTabs, ...corporateBusinessTabs];
    console.log("this.formTabs", this.formTabs);
    //this.tab = 'Company Details';



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
      purposeofAccount: ['', Validators.required],
      purposeofAccountOther: ['']


      //contactPersonTazkiraPhoto: ['',Validators.required],
      //contactPersonSign: ['',Validators.required],
    });
    this.companyDetailsForm.controls['authorizedSignatoryCount'].patchValue('2');

    this.businessLicenceDetailsForm = this.fb.group({
      licenceNumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      licenceIssueAuthority: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // alphanumeric
      dateofIssue: ['', [Validators.required, this.sharedFunctionsServic.pastDateValidator()]], // Date
      dateofExpiry: ['', [Validators.required, this.sharedFunctionsServic.futureDateValidator()]], // Date
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

    if (this.kycData) {
      //

      this.signatoryFormFetch();
      this.sharholderFormfetch();

      this.basicDetailsForm.patchValue({
        //type: `${this.kycData?.submittedBy?.userType}`,
        corporteLastName: `${this.kycData?.submittedFor?.lastName}`,
        corporatePhone: `${this.kycData?.submittedFor?.phone}`,
        corporteFirstName: `${this.kycData?.submittedFor?.firstName}`,
        corporateEmail: `${this.kycData?.submittedFor?.email}`,
        // SalarythirdLevelAuth: `${this.kycData?.submittedBy?.signatories?.length}`,
        // organizationType: `${this.kycData?.submittedBy?.signatories?.length}`,
      })
      console.log("Purpose of account", this.purposeOfAccount);
      this.companyDetailsForm.patchValue({
        companyName: `${this.kycData?.corporateKyc?.companyName}`,
        contactPersonName: `${this.kycData?.corporateKyc?.contactPersonName}`,
        contactpersonDesignation: `${this.kycData?.corporateKyc?.contactPersonDesignation}`,
        shareholderCount: `${this.kycData?.corporateKyc?.shareholders?.length}`,
        authorizedSignatoryCount: `${this.kycData?.corporateKyc?.signatories?.length}`,
        purposeofAccount: `${this.kycData?.corporateKyc?.purposeOfAcc}`,
      })
      this.businessLicenceDetailsForm.patchValue({
        licenceNumber: this.clean(this.kycData?.corporateKyc?.bizLicenseNumber),
        licenceIssueAuthority: this.clean(this.kycData?.corporateKyc?.bizLicenseAuthority),
        dateofIssue: this.clean(this.kycData?.corporateKyc?.bizLicenseDateOfIssue),
        dateofExpiry: this.clean(this.kycData?.corporateKyc?.bizLicenseDateOfExpiry),
        tinNumber: this.clean(this.kycData?.corporateKyc?.bizLicenseTinNumber),
      });

      this.businessActivityDetailsForm.patchValue({
        businessName: this.kycData?.corporateKyc?.bizName,
        natureofBusiness: this.kycData?.corporateKyc?.natureOfBiz,
        monthlyIncome: this.kycData?.corporateKyc?.monthlyIncome,
        netWorth: this.kycData?.corporateKyc?.netWorth,
        sourceofFund: this.kycData?.corporateKyc?.sourceOfFund,
        monthlyTurnover: this.kycData?.corporateKyc?.monthlyTurnover
      })

      this.companyAddressDetailsForm.patchValue({
        location: `${this.kycData?.corporateKyc?.companyLocation}`,
        streetNumber: `${this.kycData?.corporateKyc?.companyStreet}`,
        houseNumber: `${this.kycData?.corporateKyc?.companyHouseNumber}`,
        district: `${this.kycData?.corporateKyc?.companyDistrict}`,
        province: `${this.kycData?.corporateKyc?.companyProvince}`,
        country: `${this.kycData?.corporateKyc?.companyCountry}`,
        officePhone: `${this.kycData?.corporateKyc?.companyOfficePhone}`,
        officeEmail: `${this.kycData?.corporateKyc?.companyEmail}`
      })

      const provinceName = this.kycData?.corporateKyc?.companyProvince;

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

          this.companyAddressDetailsForm.patchValue({
            district: this.kycData?.corporateKyc?.companyDistrict
          });
        },
        error: (error) => {
          console.error('Error fetching districts:', error);
        }
      });




      if (this.kycData?.corporateKyc?.authorizationLetterPhoto) {
        let authorizationLetterPhoto = this.kycData?.corporateKyc?.authorizationLetterPhoto
        this.attachedFiles['authorizedLetter'] = authorizationLetterPhoto;
      }
      //new
      if (this.kycData?.corporateKyc?.otherDocs) {
        const docs = this.kycData.corporateKyc.otherDocs;

        if (typeof docs === 'string' && docs.trim() !== '') {
          this.addtionalDocs = [docs.split(',')];
        } else {
          this.addtionalDocs = [[]];
        }
      }

      if (this.kycData?.corporateKyc?.bizLicensePhoto) {
        let bizLicensePhoto = this.kycData?.corporateKyc?.bizLicensePhoto
        this.attachedFiles['businessLicencePhoto'] = bizLicensePhoto;

      }
      if (this.kycData?.corporateKyc?.contactIdProofFrontPhoto) {
        let contactIdProofFrontPhoto = this.kycData?.corporateKyc?.contactIdProofFrontPhoto
        this.attachedFiles['contactPersonTazkiraPhotoFront'] = contactIdProofFrontPhoto;

      }
      if (this.kycData?.corporateKyc?.contactIdProofBackPhoto) {
        let contactIdProofBackPhoto = this.kycData?.corporateKyc?.contactIdProofBackPhoto
        this.attachedFiles['contactPersonTazkiraPhotoBack'] = contactIdProofBackPhoto;
      }
      if (this.kycData?.corporateKyc?.contactSignaturePhoto) {
        let contactSignaturePhoto = this.kycData?.corporateKyc?.contactSignaturePhoto
        this.attachedFiles['contactPersonSign'] = contactSignaturePhoto;
      }
      if (this.kycData?.corporateKyc?.addressProofPhoto) {
        let addressProofPhoto = this.kycData?.corporateKyc?.addressProofPhoto
        this.attachedFiles['addressProof'] = addressProofPhoto;

      }
      if (this.kycData?.corporateKyc?.signatories) {
        const signatories = this.kycData?.corporateKyc?.signatories || [];
        for (let i = 0; i < signatories.length; i++) {
          const signatory = signatories[i];
          if (signatory?.idProofFrontPhoto) {
            this.attachedFiles[`authorizedzkiraPhotoFront${i}`] = signatory.idProofFrontPhoto;
          }
          if (signatory?.idProofBackPhoto) {
            this.attachedFiles[`authorizedzkiraPhotoBack${i}`] = signatory.idProofBackPhoto;
          }
          if (signatory?.signatoryPhoto) {
            this.attachedFiles[`authorizedPhoto${i}`] = signatory.signatoryPhoto;
          }
          if (signatory?.signaturePhoto) {
            this.attachedFiles[`authorizedSign${i}`] = signatory.signaturePhoto;
          }
        }
      }
      if (this.kycData?.corporateKyc?.shareholders) {
        const shareholders = this.kycData?.corporateKyc?.shareholders || [];
        for (let i = 0; i < shareholders.length; i++) {
          const shareholder = shareholders[i];
          if (shareholder?.idProofFrontPhoto) {

            this.attachedFiles[`shareholderTazkiraPhotoFront${i}`] = shareholder.idProofFrontPhoto;
          }
          if (shareholder?.idProofBackPhoto) {
            this.attachedFiles[`shareholderTazkiraPhotoBack${i}`] = shareholder.idProofBackPhoto;
          }
        }
      }
      console.log(this.attachedFiles, "this.attachedFiles-rekyc");


    }
    this.markAllFormsTouchedAndValidated();
  }
  //update validation 1 method
  private markAllFormsTouchedAndValidated(): void {
    const forms = [
      this.basicDetailsForm,
      this.companyDetailsForm,
      this.businessLicenceDetailsForm,
      this.businessActivityDetailsForm,
      this.companyAddressDetailsForm,
      this.shareHolderDetailsForm,
      this.authorizedDetailsForm
    ];

    forms.forEach(form => {
      form.markAllAsTouched();
      form.updateValueAndValidity({ emitEvent: false });
    });
  }
  //
  //update validation 2 method
  clean(v: any) {
    return v === 'NIL' || v === '' || v === undefined ? null : v;
  }
  getFormByTab(tab: string, kycType?: 'NGO' | 'CORPORATE' | 'GOVT_AGENCY' | 'UN_AGENCY'): FormGroup | null {
    if (kycType === 'NGO') {
      switch (tab) {
        case 'Basic Info':
          return this.basicDetailsForm;
        case 'NGO Details':
          return this.ngoDetailsForm;
        case 'NGO Address':
          return this.ngoAddressDetailsForm;
        case 'NGO Executive Committee Members Details':
          return this.ngocommitteMemberDetailsForm;
        case 'NGO Representative Details':
          return this.ngoRepresntativeDetailsForm;
        case 'Documents':
        // return this.ngoDocsEdited;

        default:
          return null;
      }



    } else if (kycType === 'CORPORATE') {
      switch (tab) {
        case 'Basic Info':
          return this.basicDetailsForm;

        case 'Company Details':
          return this.companyDetailsForm;

        case 'Company Business License Details':
          return this.businessLicenceDetailsForm;

        case 'Company Business Activities':
          return this.businessActivityDetailsForm;

        case 'Company Address':
          return this.companyAddressDetailsForm;

        case 'Company Shareholder Details':
          return this.shareHolderDetailsForm;

        case 'Authorized Signatory Details':
          return this.authorizedDetailsForm;

        default:
          return null; // Other Docs & Final Submission
      }
    }
    else if (kycType === 'GOVT_AGENCY' || kycType === 'UN_AGENCY') {
      switch (tab) {
        case 'Basic Info':
          return this.basicDetailsForm;
        case 'Agency Details':
          return this.unGovtAgencyDetailsForm;
        case 'Contract Details':
          return this.unGovtAgencyContractDetailsForm;
        case 'Point of Contact Details':
          return this.unGovtAgencyPocDetailsForm;
        case 'Documents':
        // return this.ngoDocsEdited;
        case 'Other Documents (Optional)':
        //return this.otherDocsEdited;
        default:
          return null;
      }
    }
    else {
      return null;
    }
  }
  private hasRequiredImages(config: { key: string; mapping: string; isArray?: boolean }[]): boolean {
    return config.every(item => {
      if (item.isArray) {
        // For array items, check indexed attachedFiles keys OR kycData per entry
        const arr = item.key.includes('shareholder')
          ? this.kycData?.corporateKyc?.shareholders
          : this.kycData?.corporateKyc?.signatories;

        if (!Array.isArray(arr) || arr.length === 0) {
          return !!this.attachedFiles[item.key + '0'];
        }

        return arr.every((obj: any, i: number) =>
          !!this.attachedFiles[item.key + i] || !!obj?.[item.mapping]
        );
      }

      // Single file: check attachedFiles first, then kycData
      if (!!this.attachedFiles[item.key]) return true;
      return !!this.kycData?.corporateKyc?.[item.mapping];
    });
  }

  private imageConfigByTab: Record<string, { key: string; mapping: string; isArray?: boolean }[]> = {
    'Company Details': [
      { key: 'contactPersonTazkiraPhotoFront', mapping: 'contactIdProofFrontPhoto' },
      { key: 'contactPersonTazkiraPhotoBack', mapping: 'contactIdProofBackPhoto' },
      { key: 'contactPersonSign', mapping: 'contactSignaturePhoto' },
      { key: 'authorizedLetter', mapping: 'authorizationLetterPhoto' }
    ],

    'Company Business License Details': [
      { key: 'businessLicencePhoto', mapping: 'bizLicensePhoto' }
    ],

    'Company Address': [
      { key: 'addressProof', mapping: 'addressProofPhoto' }
    ],

    // ✅ New Shareholder Form
    'Company Shareholder Details': [
      { key: 'shareholderTazkiraPhotoFront', mapping: 'idProofFrontPhoto', isArray: true },
      { key: 'shareholderTazkiraPhotoBack', mapping: 'idProofBackPhoto', isArray: true }
    ],

    // ✅ New Authorized Signatory Form
    'Authorized Signatory Details': [
      { key: 'signatoryTazkiraFront', mapping: 'idProofFrontPhoto', isArray: true },
      { key: 'signatoryTazkiraBack', mapping: 'idProofBackPhoto', isArray: true },
      { key: 'signatoryPhoto', mapping: 'signatoryPhoto', isArray: true },
      { key: 'signatorySignature', mapping: 'signaturePhoto', isArray: true }
    ]
  };
  canEnableSave(tab: string, kycType?: 'NGO' | 'CORPORATE' | 'GOVT_AGENCY' | 'UN_AGENCY'): boolean {
    // Exclude "Other Documents" from blocking save
    if (tab === 'Other Documents (Optional)') {
      return true;
    }

    const form = this.getFormByTab(tab, kycType);
    if (!form || form.invalid) return false;

    const imageConfig = this.imageConfigByTab[tab];
    if (imageConfig) return this.hasRequiredImages(imageConfig);

    return true;
  }

  // isSaveDisabled(tab: string): boolean {
  //   const form = this.getFormByTab(tab);
  //   if (!form) return false;
  //   return form.invalid;
  // }
  //
  //old   sharholderFormfetch
  // sharholderFormfetch() {
  //   const shareholders = this.kycData?.corporateKyc?.shareholders || [];
  //   const formArray = this.shareHolderDetailsForm.get('shareHolders') as FormArray;
  //   formArray.clear();
  //   this.showShareTaskira = false;
  //   this.showSharePass = false;
  //   this.showShareIdExist = false;
  //   this.showSharePassExist = false;
  //   shareholders.forEach((sh: any) => {
  //     const isTazkira = sh.idProofType === 'E_TAZKIRA';
  //     const fg = this.fb.group({
  //       shareholderFirstName: [sh.firstName],
  //       shareholderLastName: [sh.lastName],
  //       shareholderFatherName: [sh.fatherName],
  //       shareholderDOB: [sh.dob],
  //       shareholderNationality: [sh.nationality],
  //       shareholderPhone: [sh.phone],
  //       shareholderRelationship: [sh.relationship],
  //       shareholdingPercentage: [sh.shareholdingPercentage],
  //       shareholderPlaceofBirth: [sh.placeOfBirth],
  //       shareholderMonthlyIncome: [sh.monthlyIncome],
  //       shareholdingOtherSource: [sh.sourceOfIncome],
  //       shareholderTin: [sh.tinNumber],
  //       shareholderIdProofType: [
  //         isTazkira ? 'TAZKIRA' : 'PASSPORT'
  //       ],
  //       shareholdertazkiraNo: [
  //         isTazkira ? sh.idProofNumber : null
  //       ],
  //       shareholderPassNo: [
  //         !isTazkira ? sh.idProofNumber : null
  //       ],
  //       shareholderCurrentlocation: [sh.currLocation],
  //       shareholderCurrentCountry: [sh.currCountry],
  //       shareholderCurrentProvince: [sh.currProvince],
  //       shareholderCurrentDistrict: [sh.currDistrict],
  //       shareholderPermanantCountry: [sh.permCountry],
  //       shareholderPermanantProvince: [sh.permProvince],
  //       shareholderPermanantDistrict: [sh.permDistrict],
  //     });

  //     if (isTazkira) {
  //       this.showShareTaskira = true;
  //       this.showSharePass = false;
  //     } else {
  //       this.showShareTaskira = false;
  //       this.showSharePass = true;
  //     }
  //     formArray.push(fg);
  //     this.loadShareholderPermanentAddress(fg, sh);
  //     this.loadShareholderCurrentAddress(fg, sh);
  //   });

  // }
  //new for tetsing validation
  sharholderFormfetch() {
    const shareholders = this.kycData?.corporateKyc?.shareholders || [];
    const formArray = this.shareHolderDetailsForm.get('shareHolders') as FormArray;

    formArray.clear();

    shareholders.forEach((sh: any, index: number) => {
      const isTazkira = sh.idProofType === 'E_TAZKIRA';

      const fg = this.fb.group({
        shareholderFirstName: [
          sh.firstName,
          [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]
        ],

        shareholderLastName: [
          sh.lastName,
          [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]
        ],

        shareholderFatherName: [
          sh.fatherName,
          [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]
        ],

        shareholderDOB: [
          sh.dob ? sh.dob.split('T')[0] : null,
          [Validators.required, this.sharedFunctionsServic.ageValidator()]
        ],

        shareholderNationality: [
          sh.nationality,
          Validators.required
        ],

        shareholderPhone: [
          sh.phone,
          [Validators.required, Validators.pattern(/.*(7\d{8})$/)]
        ],

        shareholderRelationship: [
          sh.relationship,
          Validators.required
        ],

        shareholdingPercentage: [
          sh.shareholdingPercentage,
          Validators.required
        ],

        shareholderPlaceofBirth: [
          sh.placeOfBirth,
          [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]
        ],

        shareholderMonthlyIncome: [
          sh.monthlyIncome,
          Validators.required
        ],

        shareholdingOtherSource: [
          sh.sourceOfIncome,
          Validators.pattern('^[a-zA-Z0-9 ]+$')
        ],

        shareholderTin: [
          sh.tinNumber,
          [this.optionalShareholderTinValidator()]
        ],

        // 🔑 ID PROOF TYPE
        shareholderIdProofType: [
          isTazkira ? 'TAZKIRA' : 'PASSPORT',
          Validators.required
        ],

        // ✅ TAZKIRA ONLY WHEN TAZKIRA
        shareholdertazkiraNo: [
          isTazkira ? sh.idProofNumber : null,
          isTazkira
            ? [Validators.required, Validators.pattern('^[0-9]+$')]
            : []
        ],

        // ✅ PASSPORT ONLY WHEN PASSPORT
        shareholderPassNo: [
          !isTazkira ? sh.idProofNumber : null,
          !isTazkira
            ? [Validators.required, Validators.pattern('^[a-zA-Z0-9 !@#$%^&*()_+=\\-\\[\\]{};:"\'|,.<>?/]*$')]
            : []
        ],

        shareholderCurrentlocation: [
          sh.currLocation,
          Validators.required
        ],

        shareholderCurrentDistrict: [
          sh.currDistrict,
          Validators.required
        ],

        shareholderCurrentProvince: [
          sh.currProvince,
          Validators.required
        ],

        shareholderCurrentCountry: [
          sh.currCountry,
          Validators.required
        ],

        shareholderPermanantDistrict: [
          sh.permDistrict,
          Validators.required
        ],

        shareholderPermanantProvince: [
          sh.permProvince,
          Validators.required
        ],

        shareholderPermanantCountry: [
          sh.permCountry,
          Validators.required
        ]
      });

      formArray.push(fg);

      this.loadShareholderPermanentAddress(fg, sh, index);
      this.loadShareholderCurrentAddress(fg, sh, index);
    });

    // 🔴 MUST
    formArray.updateValueAndValidity();
    this.shareHolderDetailsForm.updateValueAndValidity();
  }
  //old   signatoryFormFetch
  // signatoryFormFetch() {
  //   const signatories = this.kycData?.corporateKyc?.signatories || [];
  //   const formArraySg = this.authorizedDetailsForm.get('authorizedSignatories') as FormArray;
  //   formArraySg.clear();
  //   this.showAuthTaskira = false;
  //   this.showAuthPass = false;
  //   this.showIdExist = false;
  //   this.showPassExist = false;
  //   signatories.forEach((sg: any) => {
  //     const isTazkira = sg.idProofType === 'E_TAZKIRA';

  //     if (isTazkira) {
  //       this.showAuthTaskira = true;
  //       this.showAuthPass = false;
  //     } else {
  //       this.showAuthTaskira = false;
  //       this.showAuthPass = true;
  //     }
  //     formArraySg.push(
  //       this.fb.group({
  //         authorizedFirstName: [sg.firstName],
  //         authorizedLastName: [sg.lastName],
  //         authorizedDOB: [sg.dob],
  //         authorizedNationality: [sg.nationality],
  //         authorizedDesignation: [sg.designation],
  //         authorizedPhone: [sg.phone],
  //         authorizedEmail: [sg.email],
  //         authUsername: [sg.username],

  //         authorizedIdProofType: [isTazkira ? '1' : '2'],
  //         authorizedtazkiraNo: [isTazkira ? sg.idProofNumber : null],
  //         authorizedPassNo: [!isTazkira ? sg.idProofNumber : null],

  //         authorizedPlaceofBirth: [sg.placeOfBirth],
  //         authorizedMonthlyIncome: [sg.monthlyIncome],
  //         authorizedSourceofIncome: [sg.sourceOfIncome],
  //         authorizedlocation: [sg.residentAddress],
  //         authorizedType: [sg.signatoryType],

  //         authorizedPhoto: [sg.signatoryPhoto],
  //         authorizedzkiraPhotoFront: [sg.idProofFrontPhoto],
  //         authorizedzkiraPhotoBack: [sg.idProofBackPhoto],
  //         authorizedSign: [sg.signaturePhoto],

  //         roleMaker: [sg.makerChecker === 'MAKER'],
  //         roleChecker: [sg.makerChecker === 'CHECKER']
  //       })
  //     );
  //   });
  // }
  //new for tetsing validation
  signatoryFormFetch() {
    console.log("signatoryFormFetch called");
    const signatories = this.kycData?.corporateKyc?.signatories || [];
    const formArraySg = this.authorizedDetailsForm.get('authorizedSignatories') as FormArray;

    formArraySg.clear();

    signatories.forEach((sg: any) => {

      const isTazkira = sg.idProofType === 'E_TAZKIRA';

      const fg = this.fb.group({
        authorizedFirstName: [
          sg.firstName,
          [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]
        ],

        authorizedLastName: [
          sg.lastName,
          [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]
        ],

        authorizedEmail: [
          sg.email,
          [Validators.required, Validators.email]
        ],

        authUsername: [
          sg.username,
          [Validators.required]
        ],

        authorizedIdProofType: [
          isTazkira ? '1' : '2',
          Validators.required
        ],

        authorizedtazkiraNo: [
          isTazkira ? sg.idProofNumber : null,
          isTazkira
            ? [Validators.required, Validators.pattern('^[0-9]+$')]
            : []
        ],

        authorizedPassNo: [
          !isTazkira ? sg.idProofNumber : null,
          !isTazkira
            ? [Validators.required, Validators.pattern('^[a-zA-Z0-9 !@#$%^&*()_+=\\-\\[\\]{};:"\'|,.<>?/]*$')]
            : []
        ],

        authorizedDOB: [
          sg.dob ? sg.dob.split('T')[0] : null,
          [Validators.required, this.sharedFunctionsServic.ageValidator()]
        ],

        authorizedPlaceofBirth: [
          sg.placeOfBirth,
          Validators.required
        ],

        authorizedNationality: [
          sg.nationality,
          Validators.required
        ],

        authorizedDesignation: [
          sg.designation,
          Validators.required
        ],

        authorizedlocation: [
          sg.residentAddress,
          Validators.required
        ],

        authorizedMonthlyIncome: [
          sg.monthlyIncome,
          Validators.required
        ],

        authorizedSourceofIncome: [
          sg.sourceOfIncome
        ],

        authorizedPhone: [
          sg.phone,
          Validators.required
        ],

        authorizedType: [
          sg.signatoryType,
          Validators.required
        ],

        roleMaker: [sg.makerChecker === 'MAKER'],
        roleChecker: [sg.makerChecker === 'CHECKER'],

        authorizedPhoto: [sg.signatoryPhoto],
        authorizedzkiraPhotoFront: [sg.idProofFrontPhoto],
        authorizedzkiraPhotoBack: [sg.idProofBackPhoto],
        authorizedSign: [sg.signaturePhoto]
      });

      // keep your existing username logic
      this.attachUsernameValidation(fg);

      formArraySg.push(fg);
    });

    formArraySg.updateValueAndValidity();
    this.authorizedDetailsForm.updateValueAndValidity();
  }
  //new
  shouldShowSaveButton(): boolean {
    // if (!this.kycData || this.tab === 'Final Submission') {
    //   return false;
    // }'
    this.tabSaveCompleted[this.tab] = false;
    switch (this.tab) {
      case 'Basic Info':
        return this.hasBasicInfoChanged();

      case 'Company Details':
        return this.hasCompanyDetailsChanged();

      case 'Company Business License Details':
        return this.hasCompanyBusinessLicenseChanged();

      case 'Company Business Activities':
        return this.hasCompanyBusinessActivityChanged();

      case 'Company Address':
        return this.hasCompanyAddressChanged();

      case 'Company Shareholder Details':
        return this.hasShareHolderDetailsChanged();

      case 'Authorized Signatory Details':
        return this.hasAuthorizedSignatoryDetailsChanged();

      case 'Other Documents (Optional)':
        return this.hasOtherDocsUpdated();
      default:
        return false;
    }
  }
  hasBasicInfoChanged(): boolean {
    const f = this.basicDetailsForm;
    return !!(
      f?.get('corporteFirstName')?.dirty ||
      f?.get('corporteLastName')?.dirty ||
      f?.get('corporateEmail')?.dirty
    );
  }
  hasCompanyDetailsChanged(): boolean {
    const c = this.companyDetailsForm;
    return !!(
      c?.get('companyName')?.dirty ||
      c?.get('contactPersonName')?.dirty ||
      c?.get('contactpersonDesignation')?.dirty ||
      c?.get('authorizedSignatoryCount')?.dirty ||
      c?.get('shareholderCount')?.dirty ||
      this.imageChanged?.['contactPersonTazkiraPhotoFront'] ||
      this.imageChanged?.['contactPersonTazkiraPhotoBack'] ||
      this.imageChanged?.['contactPersonSign']
    );
  }
  hasCompanyBusinessLicenseChanged(): boolean {
    const f = this.businessLicenceDetailsForm;
    return !!(
      f?.get('licenceNumber')?.dirty ||
      f?.get('dateofIssue')?.dirty ||
      f?.get('dateofExpiry')?.dirty ||
      f?.get('tinNumber')?.dirty ||
      f?.get('licenceIssueAuthority')?.dirty ||   // ✅ FIXED
      this.imageChanged?.['businessLicencePhoto'] // ✅ file change
    );
  }
  hasCompanyBusinessActivityChanged(): boolean {
    const f = this.businessActivityDetailsForm;
    return !!(
      f?.get('businessName')?.dirty ||
      f?.get('natureofBusiness')?.dirty ||
      f?.get('monthlyIncome')?.dirty ||
      f?.get('sourceofFund')?.dirty ||
      f?.get('netWorth')?.dirty ||
      f?.get('monthlyTurnover')?.dirty
    );
  }
  hasCompanyAddressChanged(): boolean {
    const f = this.companyAddressDetailsForm;
    return !!(
      f?.get('officePhone')?.dirty ||
      f?.get('country')?.dirty ||
      f?.get('provimce')?.dirty ||
      f?.get('location')?.dirty ||
      f?.get('officeEmail')?.dirty ||
      f?.get('houseNumber')?.dirty ||
      f?.get('district')?.dirty ||
      this.imageChanged?.['addressProof']
    );
  }
  hasShareHolderDetailsChanged(): boolean {
    const fa = this.shareHolderDetailsForm?.get('shareHolders') as any;
    if (!fa || !fa.controls) {
      return false;
    }
    // 🔹 Any form control changed
    if (fa.controls.some((group: any) => group.dirty)) {
      return true;
    }
    // 🔹 Any shareholder image changed
    return fa.controls.some((_: any, i: number) =>
      this.imageChanged?.['shareholderTazkiraPhotoFront' + i] ||
      this.imageChanged?.['shareholderTazkiraPhotoBack' + i]
    );
  }
  hasAuthorizedSignatoryDetailsChanged(): boolean {
    const fa = this.authorizedDetailsForm?.get('authorizedSignatories') as any;
    if (!fa || !fa.controls) {
      return false;
    }
    if (fa.controls.some((group: any) => group.dirty)) {
      return true;
    }
    return fa.controls.some((_: any, i: number) =>
      this.imageChanged?.['authorizedPhoto' + i] ||
      this.imageChanged?.['authorizedzkiraPhotoFront' + i] ||
      this.imageChanged?.['authorizedzkiraPhotoBack' + i] ||
      this.imageChanged?.['authorizedSign' + i]
      //this.imageChanged?.['authorizedLetter' + i]
    );
  }
  hasOtherDocsUpdated(): boolean {
    // New files uploaded in this session
    if (this.imageChanged?.['otherDoc']) {
      return true;
    }
    // Files removed from newly added list
    if (this.otherDocArray && this.otherDocArray.length === 0 && this.imageChanged?.['otherDocRemoved']) {
      return true;
    }
    return false;
  }
  loadShareholderPermanentAddress(fg: FormGroup, sh: any, index: number) {
    this.loadDistrictAndPatch(sh?.permProvince, (districts) => (this.permDistrictsMap[index] = districts), () => {
      fg.patchValue({
        shareholderPermanantDistrict: sh?.permDistrict
      });
      fg.updateValueAndValidity();
    }
    );
  }

  loadShareholderCurrentAddress(fg: FormGroup, sh: any, index: number) {
    this.loadDistrictAndPatch(sh?.currProvince, (districts) => (this.currentDistrictsMap[index] = districts), () => {
      fg.patchValue({
        shareholderCurrentDistrict: sh?.currDistrict
      });
      fg.updateValueAndValidity();
    }
    );
  }

  ngoExecutiveFormFetch() {
    const execMembers = this.kycData?.ngoKyc?.executiveCommittee || [];
    const formArrayEx = this.ngocommitteMemberDetailsForm.get('exCommitteeMembers') as FormArray;
    formArrayEx.clear();
    execMembers.forEach((ex: any) => {
      const isTazkira = ex.execIdProofType === 'E_TAZKIRA';
      const fg = this.fb.group({
        firstName: [ex.execFirstName],
        lastName: [ex.execLastName],
        location: [ex.execResidentAddress],
        tazkiraNo: [isTazkira ? ex.execIdProofNumber : null],
        ngoCommitteePassNo: [isTazkira ? null : ex.execIdProofNumber],
        dateofBirth: [ex.execDob],
        placeofBirth: [ex.execPlaceOfBirth],
        position: [ex.execPosition],
        idProofType: [isTazkira ? '1' : '2'],
      });
      formArrayEx.push(fg);
    });
    formArrayEx.updateValueAndValidity();
    this.ngocommitteMemberDetailsForm.updateValueAndValidity();
    console.log("Form -Ex", this.ngocommitteMemberDetailsForm);
    console.log("NGO - Ex Count", this.ngocommitteMemberDetailsForm.controls['exCommitteeMembers'].value.length);

  }

  viewFile(fileUrl: string | undefined) {
    if (!fileUrl) return;

    console.log("Viewing file:", fileUrl);

    this.kycService.getImageAndOpen(fileUrl)
  }
  public removeFile(index: number): void {
    this.selectedFiles.splice(index, 1); // Remove file from selectedFiles array
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
      'Other Documents (Optional)',
      'Final Submission'
    ]
    this.tab = 'Basic Info';
    this.formTabs = [...this.formTabs, ...ngoFormTabs];
    let imagesmappings = ['regCertificatePhoto', 'articleOfAssociationPhoto', 'addressProofPhoto', 'authorizationLetterPhoto', 'execIdProofFrontPhoto', 'execIdProofBackPhoto', 'repIdProofFrontPhoto', 'repIdProofBackPhoto', 'taxClearancePhoto', 'tinLetterPhoto', 'auditedFinancialStmtPhoto', 'repSignaturePhoto', 'otherDocs']
    let imageTitles = ['Valid Registration Certificate', 'Article of Association/Structure of NGO', 'NGO Address Proof', 'Authorization Letter (Power of Attorney)', 'Executive Committee Member Tazkira/Passport Front', 'Executive Committee Member Tazkira/Passport Back', 'Representative Tazkira/Passport Front', 'Representative Tazkira/Passport Back', 'Annual Tax Clearance Letter', 'TIN Letter', 'Audited Financial Statement (Optional)', 'Digital Signatures of Representative', 'Additional Supporting Documents'];

    let i = 0;
    this.attachedFilesNgoUN = [];
    imagesmappings.forEach(image => {
      this.attachedFilesNgoUN.push({ mapping: image, title: imageTitles[i] });
      i++;
    })
    this.getCountries();
    //this.getProvinces();
    this.getNatureofBusiness();

    this.ngoDetailsForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      licenseRegNo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      tinNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Strictly Numerical
      sourceofFund: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric 
      monthlyTurnover: ['', Validators.required,], // Strictly Numerical      
      exMemberCount: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
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
      exCommitteeMembers: this.fb.array([])
    });
    this.addExCommitteMemberNGO();

    this.ngoRepresntativeDetailsForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]],
      location: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]], // Alphanumeric
      idProofType: ['', [Validators.required]],
      tazkiraNo: ['', [Validators.pattern('^[0-9]+$')]], // Alphanumeric
      ngoRepPassNo: ['', [, Validators.pattern('^[a-zA-Z0-9 !@#$%^&*()_+=\\-\\[\\]{};:"\'|,.<>?/]*$')]], // Alphanumeric
      dateofBirth: ['', [Validators.required, this.ageValidator()]], // Date
      placeofBirth: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      designation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      nationality: ['', [Validators.required]],
      sourceofIncome: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric 
      monthlyIncome: ['', Validators.required,],
      phone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],



    })

    if (this.kycData) {
      this.ngoExecutiveFormFetch();
      this.basicDetailsForm.patchValue({
        //type: `${this.kycData?.submittedBy?.userType}`,
        corporteLastName: `${this.kycData?.submittedFor?.lastName}`,
        corporatePhone: `${this.kycData?.submittedFor?.phone}`,
        corporteFirstName: `${this.kycData?.submittedFor?.firstName}`,
        corporateEmail: `${this.kycData?.submittedFor?.email}`,
        // SalarythirdLevelAuth: `${this.kycData?.submittedBy?.signatories?.length}`,
        // organizationType: `${this.kycData?.submittedBy?.signatories?.length}`,
      })
      this.ngoDetailsForm.patchValue({
        companyName: `${this.kycData?.ngoKyc?.name}`,
        licenseRegNo: `${this.kycData?.ngoKyc?.licenseRegNumber}`,
        tinNumber: `${this.kycData?.ngoKyc?.tinNumber}`,
        sourceofFund: `${this.kycData?.ngoKyc?.sourceOfFund}`,
        monthlyTurnover: `${this.kycData?.ngoKyc?.monthlyTurnover}`,
        exMemberCount: `${this.kycData?.ngoKyc?.executiveCommittee?.length}`
      })

      this.ngoAddressDetailsForm.patchValue({
        location: `${this.kycData?.ngoKyc?.location}`,
        streetNumber: `${this.kycData?.ngoKyc?.street}`,
        houseNumber: `${this.kycData?.ngoKyc?.houseNo}`,
        district: `${this.kycData?.ngoKyc?.district}`,
        province: `${this.kycData?.ngoKyc?.province}`,
        country: `${this.kycData?.ngoKyc?.country}`,
        officePhone: `${this.kycData?.ngoKyc?.officePhone}`,
        officeEmail: `${this.kycData?.ngoKyc?.officeEmail}`
      })
      const provinceName = this.kycData?.ngoKyc?.province;

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

          this.ngoAddressDetailsForm.patchValue({
            district: this.kycData?.ngoKyc?.district
          });
        },
        error: (error) => {
          console.error('Error fetching districts:', error);
        }
      });

      const isTazkira = this.kycData?.ngoKyc?.repIdProofType === 'E_TAZKIRA';



      this.ngoRepresntativeDetailsForm.patchValue({
        firstName: `${this.kycData?.ngoKyc?.repFirstName}`,
        lastName: `${this.kycData?.ngoKyc?.repLastName}`,
        location: `${this.kycData?.ngoKyc?.repResidentAddress}`,
        tazkiraNo: isTazkira ? `${this.kycData?.ngoKyc?.repIdProofNumber}` : null, //`${this.kycData?.ngoKyc?.repIdProofNumber}`
        ngoRepPassNo: !isTazkira ? `${this.kycData?.ngoKyc?.repIdProofNumber}` : null,
        dateofBirth: `${this.kycData?.ngoKyc?.repDob}`,
        placeofBirth: `${this.kycData?.ngoKyc?.repPlaceOfBirth}`,
        designation: `${this.kycData?.ngoKyc?.repDesignation}`,
        sourceofIncome: `${this.kycData?.ngoKyc?.repSourceOfIncome}`,
        monthlyIncome: `${this.kycData?.ngoKyc?.repMonthlyIncome}`,
        phone: `${this.kycData?.ngoKyc?.repPhone}`,
        nationality: `${this.kycData?.ngoKyc?.repNationality}`,
        idProofType: isTazkira ? '1' : '2'

      })


    }

    this.attachedFilesNgoUN.forEach((doc: any) => {
      if (this.kycData?.ngoKyc?.[doc.mapping]) {
        doc.fileURL = this.kycData?.ngoKyc?.[doc.mapping];
      }
    })
    if (this.kycData?.ngoKyc?.otherDocs) {
      const docs = this.kycData.ngoKyc.otherDocs;

      if (typeof docs === 'string' && docs.trim() !== '') {
        this.addtionalDocs = [docs.split(',')];
      } else {
        this.addtionalDocs = [[]];
      }
    }

  }
  generateUNGovtAgencyForm() {
    this.formTabs.length = 0;
    this.formTabs = ['Basic Info'];

    let ngoFormTabs = [
      'Agency Details',
      'Contract Details',
      'Point of Contact Details',
      'Documents',
      'Other Documents (Optional)',
      'Final Submission'
    ]
    this.tab = 'Basic Info';
    this.formTabs = [...this.formTabs, ...ngoFormTabs];

    let imagesmappings = ['authorizationLetterPhoto', 'pocIdProofFrontPhoto', 'pocIdProofBackPhoto', 'pocSignaturePhoto',]
    let imageTitles = ['Authorization Letter (Optional)', 'Point of Contact Tazkira/Passport Front (Optional) ', 'Point of Contact Tazkira/Passport Back (Optional)', 'Digital Signatures of Point of Contact (Optional)'];

    let i = 0;
    this.attachedFilesNgoUN = [];
    imagesmappings.forEach(image => {
      this.attachedFilesNgoUN.push({ mapping: image, title: imageTitles[i] });
      i++;
    })




    console.log("this.attached Files for NGO", this.attachedFilesNgoUN)

    this.getCountries();
    this.getNatureofBusiness();





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
      dateofIssue: ['', [Validators.required, this.sharedFunctionsServic.pastDateValidator()]], // Date
      dateofExpiry: ['', [Validators.required, this.sharedFunctionsServic.futureDateValidator()]], // Date
      contractSummary: ['', [Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric


    })

    this.unGovtAgencyPocDetailsForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]],
      location: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]], // Alphanumeric
      idProofType: ['', [Validators.required]],
      tazkiraNo: ['', [Validators.pattern('^[0-9]+$')]], // Alphanumeric
      // unGovtPassNo: ['', [Validators.required, Validators.pattern('^[0-9!@#$%^&*()_+=\\-\\[\\]{};:"\'|,.<>?/]*$')]], // Alphanumeric
      unGovtPassNo: ['', [Validators.pattern('^[a-zA-Z0-9 !@#$%^&*()_+=\\-\\[\\]{};:"\'|,.<>?/]*$')]], // Alphanumeric

      dateofBirth: ['', [Validators.required, this.ageValidator()]], // Date
      placeofBirth: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      designation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      nationality: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],



    })

    if (this.kycData) {
      this.basicDetailsForm.patchValue({
        corporteLastName: `${this.kycData?.submittedFor?.lastName}`,
        corporatePhone: `${this.kycData?.submittedFor?.phone}`,
        corporteFirstName: `${this.kycData?.submittedFor?.firstName}`,
        corporateEmail: `${this.kycData?.submittedFor?.email}`,
      })
      this.unGovtAgencyDetailsForm.patchValue({
        unGovtAgencyName: `${this.kycData?.govtAgencyKyc?.name}`,
        location: `${this.kycData?.govtAgencyKyc?.location}`,
        streetNumber: `${this.kycData?.govtAgencyKyc?.street}`,
        houseNumber: `${this.kycData?.govtAgencyKyc?.houseNo}`,
        district: `${this.kycData?.govtAgencyKyc?.district}`,
        province: `${this.kycData?.govtAgencyKyc?.province}`,
        country: `${this.kycData?.govtAgencyKyc?.country}`,
        officePhone: `${this.kycData?.govtAgencyKyc?.officePhone}`,
        officeEmail: `${this.kycData?.govtAgencyKyc?.officeEmail}`
      })
      const provinceName = this.kycData?.govtAgencyKyc?.province;

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

          this.unGovtAgencyDetailsForm.patchValue({
            district: this.kycData?.govtAgencyKyc?.district
          });
        },
        error: (error) => {
          console.error('Error fetching districts:', error);
        }
      });


      this.unGovtAgencyContractDetailsForm.patchValue({
        contractNumber: `${this.kycData?.govtAgencyKyc?.contractNumber}`,
        contractType: `${this.kycData?.govtAgencyKyc?.contractType}`,
        dateofIssue: `${this.kycData?.govtAgencyKyc?.contractStartDate}`,
        dateofExpiry: `${this.kycData?.govtAgencyKyc?.contractEndDate}`,
        contractSummary: `${this.kycData?.govtAgencyKyc?.contractSummary}`
      })


      const isTazkira = this.kycData?.govtAgencyKyc?.pocIdProofType === 'E_TAZKIRA';

      this.unGovtAgencyPocDetailsForm.patchValue({
        firstName: `${this.kycData?.govtAgencyKyc?.pocFirstName}`,
        lastName: `${this.kycData?.govtAgencyKyc?.pocLastName}`,
        location: `${this.kycData?.govtAgencyKyc?.pocResidentAddress}`,
        idProofType: isTazkira ? '1' : '2',
        tazkiraNo: isTazkira ? `${this.kycData?.govtAgencyKyc?.pocIdProofNumber}` : null,
        unGovtPassNo: isTazkira ? null : `${this.kycData?.govtAgencyKyc?.pocPassportNumber}`,
        dateofBirth: `${this.kycData?.govtAgencyKyc?.pocDob}`,
        placeofBirth: `${this.kycData?.govtAgencyKyc?.pocPlaceOfBirth}`,
        designation: `${this.kycData?.govtAgencyKyc?.pocDesignation}`,
        nationality: `${this.kycData?.govtAgencyKyc?.pocNationality}`,
        phone: `${this.kycData?.govtAgencyKyc?.pocPhone}`
      })
    }
    this.attachedFilesNgoUN.forEach((doc: any) => {
      if (this.kycData?.govtAgencyKyc?.[doc.mapping]) {
        doc.fileURL = this.kycData?.govtAgencyKyc?.[doc.mapping];
      }
    })
    if (this.kycData?.govtAgencyKyc?.otherDocs) {
      const docs = this.kycData.govtAgencyKyc.otherDocs;

      if (typeof docs === 'string' && docs.trim() !== '') {
        this.addtionalDocs = [docs.split(',')];
      } else {
        this.addtionalDocs = [[]];
      }
    }
    console.log("this.attached Files for UN after patch", this.attachedFilesNgoUN + "\n otherDocs" + this.addtionalDocs);







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
      // shareholderIdProofType: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]], // Alphanumeric
      shareholderIdProofType: ['', [Validators.required]],
      shareholderFatherName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholdertazkiraNo: ['', [Validators.pattern('^[0-9]+$')]], // Alphanumeric
      shareholderPassNo: ['', [Validators.pattern('^[a-zA-Z0-9 !@#$%^&*()_+=\\-\\[\\]{};:"\'|,.<>?/]*$')]],
      shareholderDOB: ['', [Validators.required, this.sharedFunctionsServic.ageValidator()]], // Date
      shareholderPlaceofBirth: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholderNationality: ['', [Validators.required]],
      shareholderMonthlyIncome: ['', Validators.required,],
      shareholdingPercentage: ['', [Validators.required]],
      shareholdingOtherSource: ['', [Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholderRelationship: ['', [Validators.required]],
      shareholderPhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]], // Strictly Numerical
      shareholderTin: ['', [this.optionalShareholderTinValidator()]],

      isSignatory: [false],
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

  createExCommitteMemberNGO(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]],
      location: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]], // Alphanumeric
      tazkiraNo: ['', [Validators.pattern('^[0-9]+$')]], // Alphanumeric
      ngoCommitteePassNo: ['', [Validators.pattern('^[a-zA-Z0-9 !@#$%^&*()_+=\\-\\[\\]{};:"\'|,.<>?/]*$')]], // Alphanumeric

      // Validators.pattern('^[a-zA-Z0-9 ]+$')
      dateofBirth: ['', [Validators.required, this.ageValidator()]], // Date
      placeofBirth: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      position: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      idProofType: ['', Validators.required],
    })
  }

  optionalShareholderTinValidator(): (control: AbstractControl) => ValidationErrors | boolean {
    return (control: AbstractControl): ValidationErrors | boolean => {
      if (!control.value) {
        return true; // Don't validate empty values
      }



      return /^[0-9]+$/.test(control.value) ? true : { numeric: true };
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
      authorizedtazkiraNo: ['', [Validators.pattern('^[0-9]+$')]], // Alphanumeric
      authorizedIdProofType: ['', Validators.required], // Alphanumeric
      authorizedPassNo: ['', [Validators.pattern('^[a-zA-Z0-9 !@#$%^&*()_+=\\-\\[\\]{};:"\'|,.<>?/]*$')]],
      authorizedDOB: ['', [Validators.required, this.sharedFunctionsServic.ageValidator()]], // Date
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
    return this.shareHolderDetailsForm.get('shareHolders') as FormArray<FormGroup>;
  }
  get authorizedSignatoryFormArray(): FormArray {
    return this.authorizedDetailsForm.get('authorizedSignatories') as FormArray;
  }
  get exCommitteMemberNGOFormArray(): FormArray {
    return this.ngocommitteMemberDetailsForm.get('exCommitteeMembers') as FormArray;
  }

  addShareholder() {
    if (this.kycData) {
      if (this.shareHoldersFormArray.length < this.companyDetailsForm.controls['shareholderCount'].value) {
        let newCount = Number(this.companyDetailsForm.controls['shareholderCount'].value) - this.shareHoldersFormArray.length;
        for (let i = 0; i < newCount; i++) {
          let newShArray = this.createShareholderGroup();
          this.shareHoldersFormArray.push(newShArray);
        }
        return;
      }
    }
    else {
      this.shareHoldersFormArray.reset();
      this.shareHoldersFormArray.updateValueAndValidity();
      this.shareHoldersFormArray.clear();

      for (let i = 0; i < Number(this.companyDetailsForm.controls['shareholderCount'].value); i++) {
        this.shareHoldersFormArray.push(this.createShareholderGroup());
      }

    }
  }

  addauthorizedSignatory() {
    if (this.kycData) {
      if (this.authorizedSignatoryFormArray.length < this.companyDetailsForm.controls['authorizedSignatoryCount'].value) {
        //this.signatoryFormFetch();
        let newCount = Number(this.companyDetailsForm.controls['authorizedSignatoryCount'].value) - this.authorizedSignatoryFormArray.length;
        for (let i = 0; i < newCount; i++) {
          let newSigArray = this.createAuthorizedSignatoryGroup();
          this.authorizedSignatoryFormArray.push(newSigArray);
        }
        return;
      }
    }
    else {
      this.authorizedSignatoryFormArray.reset();
      this.authorizedSignatoryFormArray.clear();
      this.authorizedSignatoryFormArray.updateValueAndValidity();

      for (let i = 0; i < Number(this.companyDetailsForm.controls['authorizedSignatoryCount'].value); i++) {
        this.authorizedSignatoryFormArray.push(this.createAuthorizedSignatoryGroup());
      }
    }


  }

  addExCommitteMemberNGO() {
    if (this.kycData) {
      if (this.exCommitteMemberNGOFormArray.length < this.ngoDetailsForm.controls['exMemberCount'].value) {
        let newCount = this.ngoDetailsForm.controls['exMemberCount'].value;
        for (let i = 0; i < newCount; i++) {
          let newExComArray = this.createExCommitteMemberNGO();
          this.exCommitteMemberNGOFormArray.push(newExComArray);
        }
        return;
      }
      console.log("Array - Ex", this.exCommitteMemberNGOFormArray);
    }
    else {
      this.exCommitteMemberNGOFormArray.reset();
      this.exCommitteMemberNGOFormArray.clear();
      this.exCommitteMemberNGOFormArray.updateValueAndValidity();

      for (let i = 0; i < Number(this.ngoDetailsForm.controls['exMemberCount'].value); i++) {
        this.exCommitteMemberNGOFormArray.push(this.createExCommitteMemberNGO());
      }
    }

  }

  selectedTab(selected: string, i: number) {
    this.tab = selected;
    this.currentTab = this.formTabs.indexOf(this.tab);
    //tabDisabled = true;
    /* const shareholder = this.shareHoldersFormArray.at(i) as FormGroup;
  return shareholder.get('isSignatory')?.value || false; */
  }
  //old
  // isFormEdited(tab: string): boolean {
  //   if (this.tabSaveCompleted[tab]) {
  //     return false; // already saved, don’t show button
  //   }
  //   switch (tab) {
  //     case 'Basic Info':
  //       return this.basicDetailsForm?.dirty ?? false;
  //     case 'Company Details':
  //       return this.companyDetailsForm?.dirty ?? false;
  //     case 'Company Business License Details':
  //       return this.businessLicenceDetailsForm?.dirty ?? false;
  //     case 'Company Business Activities':
  //       return this.businessActivityDetailsForm?.dirty ?? false;
  //     case 'Company Address':
  //       return this.companyAddressDetailsForm?.dirty ?? false;
  //     case 'Company Shareholder Details':
  //       return this.shareHolderDetailsForm?.dirty ?? false;
  //     case 'Authorized Signatory Details':
  //       return this.authorizedDetailsForm?.dirty ?? false;
  //     case 'Other Documents (Optional)':
  //       // ✅ SHOW SAVE ONLY IF ANY FILE UPLOADED
  //       return (this.otherDocArray?.length ?? 0) > 0;
  //     default:
  //       return false;
  //   }
  // }
  //new
  isFormEdited(tab: string, kycType?: 'NGO' | 'CORPORATE' | 'GOVT_AGENCY' | 'UN_AGENCY'): boolean {

    const formDirty = (() => {
      if (kycType === 'NGO') {
        switch (tab) {
          case 'Basic Info':
            return this.basicDetailsForm?.dirty ?? false;
          case 'NGO Details':
            return this.ngoDetailsForm?.dirty ?? false;
          case 'NGO Address':
            return this.ngoAddressDetailsForm?.dirty ?? false;
          case 'NGO Executive Committee Members Details':
            return this.exCommitteMemberNGOFormArray?.dirty ?? false;
          case 'NGO Representative Details':
            return this.ngoRepresntativeDetailsForm?.dirty ?? false;
          case 'Documents':
           return true;
          case 'Other Documents (Optional)':
            return this.otherDocsEdited;
          default:
            return false;
        }
      } else if (kycType === 'CORPORATE') {
        switch (tab) {
          case 'Basic Info':
            return this.basicDetailsForm?.dirty ?? false;
          case 'Company Details':
            return this.companyDetailsForm?.dirty ?? false;
          case 'Company Business License Details':
            return this.businessLicenceDetailsForm?.dirty ?? false;
          case 'Company Business Activities':
            return this.businessActivityDetailsForm?.dirty ?? false;
          case 'Company Address':
            return this.companyAddressDetailsForm?.dirty ?? false;
          case 'Company Shareholder Details':
            return this.shareHolderDetailsForm?.dirty ?? false;
          case 'Authorized Signatory Details':
            return this.authorizedDetailsForm?.dirty ?? false;
          // case 'Other Documents (Optional)':
          //   return (this.otherDocArray?.length ?? 0) > 0;
          case 'Other Documents (Optional)':
            return this.otherDocsEdited;

          default:
            return false;
        }
      }
      else if (kycType === 'GOVT_AGENCY' || kycType === 'UN_AGENCY') {
        switch (tab) {
          case 'Basic Info':
            return this.basicDetailsForm?.dirty ?? false;
          case 'Agency Details':
            return this.unGovtAgencyDetailsForm?.dirty ?? false;
          case 'Contract Details':
            return this.unGovtAgencyContractDetailsForm?.dirty ?? false;
          case 'Point of Contact Details':
            return this.unGovtAgencyPocDetailsForm?.dirty ?? false;
          case 'Documents':
          // return this.ngoDocsEdited;
          case 'Other Documents (Optional)':
            return this.otherDocsEdited && this.selectedFiles.length != 0;
          default:
            return false;
        }
      }
      else {
        return false;
      }
    })();

    // 🔑 KEY LINE
    if (formDirty) {
      this.tabSaveCompleted[tab] = false;
    }
    return formDirty && !this.tabSaveCompleted[tab];
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
  //old
  // formCompleted(section: string) {
  //   // if (this.kycData) {
  //   //   return true;
  //   // }
  //   if (this.basicDetailsForm.controls['organizationType'].value == 'CORPORATE') {
  //     if (section === 'Basic Info') {
  //       return this.basicDetailsForm.valid || this.tabSaveCompleted['Basic Info'];
  //     } else if (section === 'Company Details') {
  //       return (this.companyDetailsForm.valid &&
  //         Object.keys(this.attachedFiles).includes('contactPersonSign') &&
  //         Object.keys(this.attachedFiles).includes('contactPersonTazkiraPhotoBack') &&
  //         Object.keys(this.attachedFiles).includes('contactPersonTazkiraPhotoFront'))
  //         || this.tabSaveCompleted['Company Details'];
  //     } else if (section === 'Company Business License Details') {
  //       return (this.businessLicenceDetailsForm.valid &&
  //         Object.keys(this.attachedFiles).includes('businessLicencePhoto'))
  //         || this.tabSaveCompleted['Company Business License Details'];
  //     } else if (section === 'Company Business Activities') {
  //       return (this.businessActivityDetailsForm.valid)
  //         || this.tabSaveCompleted['Company Business Activities'];
  //     } else if (section === 'Company Address') {
  //       return (this.companyAddressDetailsForm.valid &&
  //         Object.keys(this.attachedFiles).includes('addressProof'))
  //         || this.tabSaveCompleted['Company Address'];
  //     } else if (section === 'Authorized Signatory Details') {
  //       console.log("authorizedDetailsForm", this.authorizedDetailsForm.valid);
  //       const isFormValid = this.authorizedDetailsForm.valid;
  //       const allFilesUploaded = this.authorizedSignatoryFormArray.controls.every((_, i) =>
  //         Object.keys(this.attachedFiles).includes(`authorizedPhoto${i}`) &&
  //         Object.keys(this.attachedFiles).includes(`authorizedSign${i}`) &&
  //         Object.keys(this.attachedFiles).includes(`authorizedzkiraPhotoFront${i}`) &&
  //         Object.keys(this.attachedFiles).includes(`authorizedzkiraPhotoBack${i}`)
  //         // Object.keys(this.attachedFiles).includes(`authorizedLetter${i}`)
  //       );
  //       console.log(isFormValid, allFilesUploaded,)
  //       return (isFormValid && allFilesUploaded)
  //         || this.tabSaveCompleted['Authorized Signatory Details'];
  //     } else if (section === 'Company Shareholder Details') {
  //       console.log(this.shareHolderDetailsForm);
  //       const isFormValid = this.shareHolderDetailsForm.valid;
  //       const allFilesUploaded = this.shareHoldersFormArray.controls.every((_, i) =>
  //         Object.keys(this.attachedFiles).includes(`shareholderTazkiraPhotoFront${i}`) &&
  //         Object.keys(this.attachedFiles).includes(`shareholderTazkiraPhotoBack${i}`)

  //       );
  //       return (isFormValid && allFilesUploaded)
  //         || this.tabSaveCompleted['Company Shareholder Details']
  //     }
  //     else if (section === 'Other Documents (Optional)') {
  //       return (this.otherDocArray?.length != 0)
  //         || this.tabSaveCompleted['Other Documents (Optional)'];
  //     }
  //     else {
  //       return false;
  //     }

  //   }
  //   else if (this.basicDetailsForm.controls['organizationType'].value == 'NGO') {
  //     if (section === 'Basic Info') {
  //       return this.basicDetailsForm.valid;
  //     } else if (section === 'NGO Details') {
  //       return this.ngoDetailsForm.valid;
  //     } else if (section === 'NGO Address') {
  //       return this.ngoAddressDetailsForm.valid;
  //     } else if (section === 'NGO Executive Committee Members Details') {
  //       return this.ngocommitteMemberDetailsForm.valid;
  //     } else if (section === 'NGO Representative Details') {
  //       return this.ngoRepresntativeDetailsForm.valid;
  //     } else if (section === 'Documents') {
  //       // console.log(this.authorizedDetailsForm.valid);
  //       return true;
  //     } else if (section === 'Company Shareholder Details') {
  //       return this.shareHolderDetailsForm.valid;
  //     }
  //     else {
  //       return false;
  //     }
  //   }
  //   else if (this.basicDetailsForm.controls['organizationType'].value == 'GOVT_AGENCY' || this.basicDetailsForm.controls['organizationType'].value == 'UN_AGENCY') {
  //     if (section === 'Basic Info') {
  //       return this.basicDetailsForm.valid;
  //     } else if (section === 'Agency Details') {
  //       return this.unGovtAgencyDetailsForm.valid;
  //     } else if (section === 'Contract Details') {
  //       return this.unGovtAgencyContractDetailsForm.valid;
  //     } else if (section === 'Point of Contact Details') {
  //       return this.unGovtAgencyPocDetailsForm.valid;
  //     } else if (section === 'Documents') {
  //       // console.log(this.authorizedDetailsForm.valid);
  //       return true;
  //     }
  //     else {
  //       return false;
  //     }

  //   }
  //   else {
  //     return false;
  //   }
  //   //Add for un and govt agency

  // }
  formCompleted(section: string, kycType?: 'NGO' | 'CORPORATE' | 'GOVT_AGENCY' | 'UN_AGENCY'): boolean {
    if (kycType == 'CORPORATE' || this.basicDetailsForm.controls['organizationType'].value == 'CORPORATE') {
      if (section === 'Basic Info') {
        return this.basicDetailsForm.valid;
      } else if (section === 'Company Details') {
        return this.companyDetailsForm.valid &&
          Object.keys(this.attachedFiles).includes('contactPersonSign') &&
          Object.keys(this.attachedFiles).includes('contactPersonTazkiraPhotoBack') &&
          Object.keys(this.attachedFiles).includes('contactPersonTazkiraPhotoFront') &&
          Object.keys(this.attachedFiles).includes('authorizedLetter');
      } else if (section === 'Company Business License Details') {
        return this.businessLicenceDetailsForm.valid &&
          Object.keys(this.attachedFiles).includes('businessLicencePhoto');
      } else if (section === 'Company Business Activities') {
        return this.businessActivityDetailsForm.valid;;
      } else if (section === 'Company Address') {
        return this.companyAddressDetailsForm.valid &&
          Object.keys(this.attachedFiles).includes('addressProof');
      } else if (section === 'Authorized Signatory Details') {
        const isFormValid = this.authorizedDetailsForm.valid;
        const allFilesUploaded = this.authorizedSignatoryFormArray.controls.every((_, i) =>
          Object.keys(this.attachedFiles).includes(`authorizedPhoto${i}`) &&
          Object.keys(this.attachedFiles).includes(`authorizedSign${i}`) &&
          Object.keys(this.attachedFiles).includes(`authorizedzkiraPhotoFront${i}`) &&
          Object.keys(this.attachedFiles).includes(`authorizedzkiraPhotoBack${i}`)
        );
        return isFormValid && allFilesUploaded;
      } else if (section === 'Company Shareholder Details') {
        const isFormValid = this.shareHolderDetailsForm.valid;
        const allFilesUploaded = this.shareHoldersFormArray.controls.every((_, i) =>
          Object.keys(this.attachedFiles).includes(`shareholderTazkiraPhotoFront${i}`) &&
          Object.keys(this.attachedFiles).includes(`shareholderTazkiraPhotoBack${i}`)
        );
        console.log(isFormValid, allFilesUploaded, "Shareholder");
        const fa = this.shareHolderDetailsForm.get('shareHolders') as FormArray;
        fa.controls.forEach((group: any, i: number) => {
          Object.keys(group.controls).forEach((key: string) => {
            if (group.controls[key].invalid) {
              console.log(`Shareholder ${i} - INVALID field: ${key}`, group.controls[key].errors, 'value:', group.controls[key].value);
            }
          });
        });
        return isFormValid && allFilesUploaded
      }
      else if (section === 'Other Documents (Optional)') {
        return this.selectedFiles?.length != 0
      }
      else {
        return false;
      }

    }
    else if (kycType == 'NGO' || this.basicDetailsForm.controls['organizationType'].value == 'NGO') {
      if (section === 'Basic Info') {
        return this.basicDetailsForm.valid;
      } else if (section === 'NGO Details') {
        return this.ngoDetailsForm.valid;
      } else if (section === 'NGO Address') {
        return this.ngoAddressDetailsForm.valid;
      } else if (section === 'NGO Executive Committee Members Details') {
        return this.ngocommitteMemberDetailsForm.valid;
      } else if (section === 'NGO Representative Details') {
        return this.ngoRepresntativeDetailsForm.valid;
      } else if (section === 'Documents') {
        // console.log(this.authorizedDetailsForm.valid);
        return true;
      } else if (section === 'Other Documents (Optional)') {
        return this.selectedFiles?.length != 0
      }
      else {
        return false;
      }
    }
    else if (kycType == 'GOVT_AGENCY' || this.basicDetailsForm.controls['organizationType'].value == 'GOVT_AGENCY' || kycType == 'UN_AGENCY' || this.basicDetailsForm.controls['organizationType'].value == 'UN_AGENCY') {
      if (section === 'Basic Info') {
        return this.basicDetailsForm.valid;
      } else if (section === 'Agency Details') {
        return this.unGovtAgencyDetailsForm.valid;
      } else if (section === 'Contract Details') {
        return this.unGovtAgencyContractDetailsForm.valid;
      } else if (section === 'Point of Contact Details') {
        return this.unGovtAgencyPocDetailsForm.valid;
      } else if (section === 'Documents') {
        // console.log(this.authorizedDetailsForm.valid);
        return true;
      }
      else {
        return false;
      }

    }
    else {
      return false;
    }
    //Add for un and govt agency

  }
  allFormsCompleted(): boolean {
    if (this.basicDetailsForm.controls['organizationType'].value == 'CORPORATE') {
      return this.formCompleted('Basic Info') &&
        this.formCompleted('Company Details') &&
        this.formCompleted('Company Business License Details') &&
        this.formCompleted('Company Business Activities') &&
        this.formCompleted('Company Address') &&
        this.formCompleted('Authorized Signatory Details') &&
        this.formCompleted('Company Shareholder Details');
    } else if (this.basicDetailsForm.controls['organizationType'].value == 'NGO') {
      return this.formCompleted('Basic Info') &&
        this.formCompleted('NGO Details') &&
        this.formCompleted('NGO Address') &&
        this.formCompleted('NGO Executive Committee Members Details') &&
        this.formCompleted('NGO Representative Details') &&
        this.formCompleted('Documents') ;
        //this.formCompleted('Company Shareholder Details');
    }
    else if (this.basicDetailsForm.controls['organizationType'].value == 'GOVT_AGENCY' || this.basicDetailsForm.controls['organizationType'].value == 'UN_AGENCY') {
      return this.formCompleted('Basic Info') &&
        this.formCompleted('Agency Details') &&
        this.formCompleted('Contract Details') &&
        this.formCompleted('Point of Contact Details') &&
        this.formCompleted('Documents');
    }
    return false;
  }
  registerCorporate() {
    console.log("corpType registerCorporate", this.basicDetailsForm.controls['type'].value)
    console.log("corpEmail registerCorporate", this.basicDetailsForm.controls['corporateEmail'].value)
    console.log("corporteFirstName registerCorporate", this.basicDetailsForm.controls['corporteFirstName'].value)
    const reqBasic = {
      corpType: this.basicDetailsForm.controls['type'].value,
      email: this.basicDetailsForm.controls['corporateEmail'].value,
      username: this.basicDetailsForm.controls['corporateEmail'].value,
      firstName: this.basicDetailsForm.controls['corporteFirstName'].value,
      lastName: this.basicDetailsForm.controls['corporteLastName'].value,
      phone: this.basicDetailsForm.controls['corporatePhone'].value,
      userType: 'CORPORATE',
      gender: 'MALE',
      currProvince : this.basicDetailsForm.controls['currentProvince'].value,
      password: this.basicDetailsForm.controls['corporatePassword'].value,
      isNeedThirdLevelAuth: this.basicDetailsForm.controls['SalarythirdLevelAuth'].value,
    };

    this.corporate.submitCorporateRegister(reqBasic).subscribe((data: any) => {
      // this.corporate.submitFundingPartyRegister(reqBasic).subscribe((data: any) => {
      setTimeout(() => {
        if (data.responseCode == 200) {
          this.corporateId = data.data;
          console.log("Corp Id", this.corporateId);
          if (this.corporateId) {
            this.basicRegister();
          }
        }
        else {
          this.isLoading = false;
          alert(data?.error)
          this.error = true;
        }



      }, 1000);
    }
    )

  }
  //new op sign
  public detectDigitalSignature(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.digitalSignatureFile = file;
      this.uploadDigitalSignature(file);
    }
  }
  private uploadDigitalSignature(file: File): void {
    this.opnSignatureFileName = file.name;
    console.log("Corp Id in op sign", this.corporateId);
    if(this.basicDetailsForm.controls['organizationType'].value == 'CORPORATE'){
    this.corporate
      .submitCorporateKYCFiles(this.corporateId, 'opsSignaturePhoto', file)
      .pipe(
        map((response: any) => response?.responseCode == 200),
        catchError(error => {
          console.error('Digital Signature upload error', error);
          return of(false);
        })
      )
      .subscribe(success => {
        if (success) {
          this.digitalSignatureUploaded = true;
        }
      });
  }
  else if(this.basicDetailsForm.controls['organizationType'].value == 'NGO'){
    this.corporate
      .submitCorporateNGOKYCFiles(this.corporateId, 'opsSignaturePhoto', file)
      .pipe(
        map((response: any) => response?.responseCode == 200),
        catchError(error => {
          console.error('Digital Signature upload error', error);
          return of(false);
        })
      )
      .subscribe(success => {
        if (success) {
          this.digitalSignatureUploaded = true;
        }
      });
  }
  else if(this.basicDetailsForm.controls['organizationType'].value == 'GOVT_AGENCY' || this.basicDetailsForm.controls['organizationType'].value == 'UN_AGENCY'){
    this.corporate
      .submitCorporateGOVTAgencyKYCFiles(this.corporateId, 'opsSignaturePhoto', file)
      .pipe(
        map((response: any) => response?.responseCode == 200),
        catchError(error => {
          console.error('Digital Signature upload error', error);
          return of(false);
        })
      )
      .subscribe(success => {
        if (success) {
          this.digitalSignatureUploaded = true;
        }
      });
  }
  else{
    console.error('Unknown organization type for digital signature upload');
  }
}
  //










  basicRegister() {
    console.log("organization type", this.basicDetailsForm.controls['organizationType'].value);
    if (this.basicDetailsForm.controls['organizationType'].value == "CORPORATE") {

      const corpReq = {
        
          companyName: this.companyDetailsForm.controls['companyName'].value,
          companyAccOpenDate: this.currentDate,
          contactPersonName: this.companyDetailsForm.controls['contactPersonName'].value,
          contactPersonDesignation: this.companyDetailsForm.controls['contactpersonDesignation'].value,
        
      };
      this.payloadForSubmitKYC = {
        kycType: "CORPORATE",
        submittedFor: this.corporateId,
        kycInputs: corpReq
      }
      this.corporate.submitCorporateRegisterKYC(this.payloadForSubmitKYC).subscribe((data: any) => {
        if (data.responseCode == 200) {
          alert("Corporate account basic registration completed, Please complete KYC");
        }
        else {
          alert(data?.error)
          this.error = true;
        }
      })


    }
    else if (this.basicDetailsForm.controls['organizationType'].value == "NGO") {
      let NGOreq = {

        name: this.ngoDetailsForm.controls['companyName'].value,
        //walletNumber: "",
        accOpenDate: this.currentDate,
        licenseRegNumber: this.ngoDetailsForm.controls['licenseRegNo'].value,
        tinNumber: this.ngoDetailsForm.controls['tinNumber'].value,
        sourceOfFund: this.ngoDetailsForm.controls['sourceofFund'].value,
        monthlyTurnover: 0,/*  parseFloat((this.ngoDetailsForm.controls['monthlyTurnover'] as any)['rawValue'] ?? this.ngoDetailsForm.controls['monthlyTurnover'].value), */
        location: this.ngoAddressDetailsForm.controls['location'].value,
        street: this.ngoAddressDetailsForm.controls['streetNumber'].value,
        houseNo: this.ngoAddressDetailsForm.controls['houseNumber'].value,
        district: this.ngoAddressDetailsForm.controls['district'].value,
        province: this.ngoAddressDetailsForm.controls['province'].value,
        country: this.ngoAddressDetailsForm.controls['country'].value,
        officePhone: this.ngoAddressDetailsForm.controls['officePhone'].value,
        officeEmail: this.ngoAddressDetailsForm.controls['officeEmail'].value,
        execCommittee: [],//exeCommitteMembersList,
        repFirstName: this.ngoRepresntativeDetailsForm.controls['firstName'].value,
        repLastName: this.ngoRepresntativeDetailsForm.controls['lastName'].value,
        repIdProofType: "E_TAZKIRA",
        repIdProofNumber: this.ngoRepTaskiraOrPass,
        repDob: this.ngoRepresntativeDetailsForm.controls['dateofBirth'].value,
        repPlaceOfBirth: this.ngoRepresntativeDetailsForm.controls['placeofBirth'].value,
        repNationality: this.ngoRepresntativeDetailsForm.controls['nationality'].value,
        repDesignation: this.ngoRepresntativeDetailsForm.controls['designation'].value,
        repResidentAddress: this.ngoRepresntativeDetailsForm.controls['location'].value,
        repPhone: this.ngoRepresntativeDetailsForm.controls['phone'].value,
        repSourceOfIncome: this.ngoRepresntativeDetailsForm.controls['sourceofIncome'].value,
        repMonthlyIncome: 0/* parseFloat((this.ngoRepresntativeDetailsForm.controls['monthlyIncome'] as any['rawValue'] ?? this.ngoRepresntativeDetailsForm.controls['monthlyIncome'].value)) */,


      }
      this.payloadForSubmitKYC = {
        kycType: "NGO",
        submittedFor: this.corporateId,
        kycInputs: NGOreq,
      }
      this.corporate.submitCorporateNGORegisterKYC(this.payloadForSubmitKYC).subscribe((data: any) => {
        if (data.responseCode == 200) {
          alert("Corporate account basic registration completed, Please complete KYC");
        }
        else {
          this.error = true;
        }
      })
    }
    else if (this.basicDetailsForm.controls['organizationType'].value == 'GOVT_AGENCY' || this.basicDetailsForm.controls['organizationType'].value == 'UN_AGENCY') {

      // this.unGovtTaskiraOrPass = this.unGovtAgencyDetailsForm.controls['unGovtPassNo'].value
      // this.unGovtTaskiraOrPass = this.unGovtAgencyPocDetailsForm.controls['tazkiraNo'].value

      let govtAgencyReq = {
        name: this.unGovtAgencyDetailsForm.controls['unGovtAgencyName'].value,
        //walletNumber: walletNumber_53a8da155fba,
        accOpenDate: this.currentDate,
        // location: this.unGovtAgencyDetailsForm.controls['location'].value,
        // street: this.unGovtAgencyDetailsForm.controls['streetNumber'].value,
        // houseNo: this.unGovtAgencyDetailsForm.controls['houseNumber'].value,
        /*  district: this.unGovtAgencyDetailsForm.controls['district'].value,
         province: this.unGovtAgencyDetailsForm.controls['province'].value,
         country: this.unGovtAgencyDetailsForm.controls['country'].value,
         officePhone: this.unGovtAgencyDetailsForm.controls['officePhone'].value,
         officeEmail: this.unGovtAgencyDetailsForm.controls['officeEmail'].value,
          contractNumber: this.unGovtAgencyContractDetailsForm.controls['contractNumber'].value,
          contractType: this.unGovtAgencyContractDetailsForm.controls['contractType'].value,
          contractStartDate: this.unGovtAgencyContractDetailsForm.controls['dateofIssue'].value,
          contractEndDate: this.unGovtAgencyContractDetailsForm.controls['dateofExpiry'].value,
          contractSummary: this.unGovtAgencyContractDetailsForm.controls['contractSummary'].value,
          pocFirstName: this.unGovtAgencyPocDetailsForm.controls['firstName'].value,
         pocLastName: this.unGovtAgencyPocDetailsForm.controls['lastName'].value,
         pocIdProofType: "E_TAZKIRA",
         pocIdProofNumber: this.unGovtTaskiraOrPass,
         pocDob: this.unGovtAgencyPocDetailsForm.controls['dateofBirth'].value,
         pocPlaceOfBirth: this.unGovtAgencyPocDetailsForm.controls['placeofBirth'].value,
         pocNationality: this.unGovtAgencyPocDetailsForm.controls['nationality'].value,
         pocDesignation: this.unGovtAgencyPocDetailsForm.controls['designation'].value,
         pocResidentAddress: this.unGovtAgencyPocDetailsForm.controls['location'].value,
         pocPhone: this.unGovtAgencyPocDetailsForm.controls['phone'].value, */

      }
      this.payloadForSubmitKYC = {
        kycType: this.basicDetailsForm.controls['organizationType']?.value,
        submittedFor: this.corporateId,
        kycInputs: govtAgencyReq,
      }
      this.corporate.submitCorporateGOVTAgencyRegisterKYC(this.payloadForSubmitKYC).subscribe((data: any) => {
        if (data.responseCode == 200) {
          alert("Corporate account basic registration completed, Please complete KYC");
        }
        else {
          this.error = true;
        }
      })
    }
    if (this.error) {
      alert("Registration Failed, please try again");
    }


  }

  updateCorporate(tab: string) {
    if (this.basicDetailsForm.controls['organizationType'].value == 'CORPORATE') {
      this.isLoading = true;
      let corpReq = {}
      if (tab == 'Basic Info') {
        corpReq = {
          corpType: this.basicDetailsForm.controls['type'].value,
          email: this.basicDetailsForm.controls['corporateEmail'].value,
          username: this.basicDetailsForm.controls['corporateEmail'].value,
          firstName: this.basicDetailsForm.controls['corporteFirstName'].value,
          lastName: this.basicDetailsForm.controls['corporteLastName'].value,
          phone: this.basicDetailsForm.controls['corporatePhone'].value,
          userType: 'CORPORATE',
          gender: 'MALE',
          password: this.basicDetailsForm.controls['corporatePassword'].value,
          isNeedThirdLevelAuth: this.basicDetailsForm.controls['SalarythirdLevelAuth'].value,
        };
        // this.companyFiles().subscribe((uploadSuccess: any) => {
        //   if (uploadSuccess?.responseCode == 200) {
        //   } else {
        //     console.error('File uploads failed');
        //   }
        // });
      }
      else if (tab == 'Company Details') {
        let accountPurpose: any;
        if (this.companyDetailsForm.controls['purposeofAccount'].value == 'Others') {
          accountPurpose = this.companyDetailsForm?.get('purposeofAccountOther')?.value;

        } else {
          accountPurpose = this.companyDetailsForm?.get('purposeofAccount')?.value;
        }
        corpReq = {
          companyName: this.companyDetailsForm.controls['companyName'].value,
          //companyWalletNumber: this.companyDetailsForm.controls['mmwalletNumber'].value,
          companyAccOpenDate: this.currentDate,
          contactPersonName: this.companyDetailsForm.controls['contactPersonName'].value,
          contactPersonDesignation: this.companyDetailsForm.controls['contactpersonDesignation'].value,
          companyNoOfShareholders: parseInt(this.companyDetailsForm.controls['shareholderCount'].value),
          purposeOfAcc: accountPurpose,
        }
        this.companyFiles().subscribe((uploadSuccess: any) => {
          if (uploadSuccess) {
            console.log("Corporate file uploads completed.");
          } else {
            console.error("Failed uploading corporate docs");
          }
        });
      }
      else if (tab == "Company Business License Details") {
        corpReq = {
          bizLicenseNumber: this.businessLicenceDetailsForm.controls['licenceNumber'].value,
          bizLicenseAuthority: this.businessLicenceDetailsForm.controls['licenceIssueAuthority'].value,
          bizLicenseDateOfIssue: this.businessLicenceDetailsForm.controls['dateofIssue'].value,
          bizLicenseDateOfExpiry: this.businessLicenceDetailsForm.controls['dateofExpiry'].value,
          bizLicenseTinNumber: this.businessLicenceDetailsForm.controls['tinNumber'].value,
        }

        this.companyBuisness().subscribe((uploadSuccess: any) => {
          if (uploadSuccess) {
            console.log("Corporate file uploads completed.");

          } else {
            console.error('Failed uploading corporate docs');
            // Notify user about the upload failure
          }
        });
      }
      else if (tab == 'Company Business Activities') {
        let nautureOfBuisness: any;
        if (this.businessActivityDetailsForm.controls['natureofBusiness'].value == 'Other') {
          nautureOfBuisness = this.natureOfBuisness

        } else {
          nautureOfBuisness = this.businessActivityDetailsForm.controls['natureofBusiness'].value;
        }
        corpReq = {
          bizName: this.businessActivityDetailsForm.controls['businessName'].value,
          natureOfBiz: nautureOfBuisness,
          monthlyIncome: parseFloat((this.businessActivityDetailsForm.controls['monthlyIncome'] as any)['rawValue'] ?? this.businessActivityDetailsForm.controls['monthlyIncome'].value),
          netWorth: parseFloat((this.businessActivityDetailsForm.controls['netWorth'] as any)['rawValue'] ?? this.businessActivityDetailsForm.controls['netWorth'].value),
          sourceOfFund: this.businessActivityDetailsForm.controls['sourceofFund'].value,
          monthlyTurnover: parseFloat((this.businessActivityDetailsForm.controls['monthlyTurnover'] as any)['rawValue'] ?? this.businessActivityDetailsForm.controls['monthlyTurnover'].value),
        }


      }
      else if (tab == 'Company Address') {
        corpReq = {
          companyLocation: this.companyAddressDetailsForm.controls['location'].value,
          companyStreet: this.companyAddressDetailsForm.controls['streetNumber'].value,
          companyHouseNumber: this.companyAddressDetailsForm.controls['houseNumber'].value,
          companyDistrict: this.companyAddressDetailsForm.controls['district'].value,
          companyProvince: this.companyAddressDetailsForm.controls['province'].value,
          companyCountry: this.companyAddressDetailsForm.controls['country'].value,
          companyOfficePhone: this.companyAddressDetailsForm.controls['officePhone'].value,
          companyEmail: this.companyAddressDetailsForm.controls['officeEmail'].value,

        }
        this.addressProof().subscribe((uploadSuccess: any) => {
          if (uploadSuccess) {
            console.log("Corporate file uploads completed.");

          } else {
            console.error('Failed uploading corporate docs');
            // Notify user about the upload failure
          }
        });
      }
      else if (tab == 'Company Shareholder Details') {
        let shareholdersList: any[] = [];
        let i = 0;
        for (let item of this.shareHolderDetailsForm.controls['shareHolders'].value) {
          console.log("Item -", item);
          const formArray = this.shareHolderDetailsForm.controls['shareHolders'] as FormArray;
          const index = this.shareHolderDetailsForm.controls['shareHolders'].value.indexOf(item);

          const monthlyIncomeControl = formArray.at(index).get('shareholderMonthlyIncome');
          const monthlyIncome = monthlyIncomeControl && (monthlyIncomeControl as any)['rawValue'] !== undefined
            ? (monthlyIncomeControl as any)['rawValue']
            : monthlyIncomeControl?.value;
          //old
          // if (item.shareholderIdProofType == 'TAZKIRA') {
          //   this.shareTaskiraOrPass = item.shareholdertazkiraNo
          // }
          // else {
          //   this.shareTaskiraOrPass = item.shareholderPassNo
          // }

          //new
          let idProofType = '';
          let idProofNumber = '';

          if (item.shareholderIdProofType === 'TAZKIRA') {
            idProofType = 'E_TAZKIRA';
            idProofNumber = item.shareholdertazkiraNo;
          }
          else {
            idProofType = 'PASSPORT';
            idProofNumber = item.shareholderPassNo;
          }
          if (!this.kycData) {
            let shareholders =
            {
              //id: i,
              firstName: item.shareholderFirstName,
              lastName: item.shareholderLastName,
              fatherName: item.shareholderFatherName,
              // idProofType: "E_TAZKIRA",
              // idProofNumber: this.shareTaskiraOrPass,
              idProofType: idProofType,
              idProofNumber: idProofNumber,
              dob: item.shareholderDOB,
              placeOfBirth: item.shareholderPlaceofBirth,
              nationality: item.shareholderNationality,
              monthlyIncome: parseFloat(monthlyIncome),
              shareholdingPercentage: item.shareholdingPercentage,
              sourceOfIncome: item.shareholdingOtherSource,
              relationship: item.shareholderRelationship,
              phone: item.shareholderPhone,
              tinNumber: item.shareholderTin,
              currLocation: item.shareholderCurrentlocation,
              currDistrict: item.shareholderCurrentDistrict,
              currProvince: item.shareholderCurrentProvince,
              currCountry: item.shareholderCurrentCountry,
              permDistrict: item.shareholderPermanantDistrict,
              permProvince: item.shareholderPermanantProvince,
              permCountry: item.shareholderPermanantCountry,
            }


            shareholdersList.push(shareholders);
            i++;
            console.log("List", shareholdersList);
          } else {
            let shareholders =
            {
              id: this.kycData?.corporateKyc?.shareholders[i]?.id,
              firstName: item.shareholderFirstName,
              lastName: item.shareholderLastName,
              fatherName: item.shareholderFatherName,
              // idProofType: "E_TAZKIRA",
              // idProofNumber: this.shareTaskiraOrPass,
              idProofType: idProofType,
              idProofNumber: idProofNumber,
              dob: item.shareholderDOB,
              placeOfBirth: item.shareholderPlaceofBirth,
              nationality: item.shareholderNationality,
              monthlyIncome: parseFloat(monthlyIncome),
              shareholdingPercentage: item.shareholdingPercentage,
              sourceOfIncome: item.shareholdingOtherSource,
              relationship: item.shareholderRelationship,
              phone: item.shareholderPhone,
              tinNumber: item.shareholderTin,
              currLocation: item.shareholderCurrentlocation,
              currDistrict: item.shareholderCurrentDistrict,
              currProvince: item.shareholderCurrentProvince,
              currCountry: item.shareholderCurrentCountry,
              permDistrict: item.shareholderPermanantDistrict,
              permProvince: item.shareholderPermanantProvince,
              permCountry: item.shareholderPermanantCountry,
            }
            shareholdersList.push(shareholders);
          }
          i++;
          console.log("List", shareholdersList);
        }
        corpReq = {
          shareholders: shareholdersList,
        }

      }
      else if (tab == 'Authorized Signatory Details') {
        let authorizedSignatoryList: any[] = [];
        let j = 0;

        for (let item of this.authorizedDetailsForm.controls['authorizedSignatories'].value) {
          console.log("Item -", item);
          const formArray = this.authorizedDetailsForm.controls['authorizedSignatories'] as FormArray;
          const index = this.authorizedDetailsForm.controls['authorizedSignatories'].value.indexOf(item);
          let monthlyIncomeControl: any
          let monthlyIncome: any
          if (index !== -1 && formArray?.at(index)) {
            monthlyIncomeControl = formArray.at(index).get('authorizedMonthlyIncome');

            // Safely extract and clean the value
            monthlyIncome = monthlyIncomeControl?.value
              ? parseFloat(monthlyIncomeControl.value.toString().replace(/[^0-9.]/g, ''))
              : 0;

            console.log("Monthly Income:", monthlyIncome);
          } else {
            console.error("Invalid index or form control not found.");
          }
          // const monthlyIncomeControl = formArray.at(index).get(' authorizedMonthlyIncome');
          // const monthlyIncome = monthlyIncomeControl && (monthlyIncomeControl as any)['rawValue'] !== undefined
          //   ? (monthlyIncomeControl as any)['rawValue']
          //   : monthlyIncomeControl?.value;

          // this.authTaskiraOrPass = item.authorizedPassNo
          // this.authTaskiraOrPass = item.authorizedtazkiraNo
          let authIdProofType = '';
          let authIdProofNumber = '';

          if (item.authorizedIdProofType === '1') {
            authIdProofType = 'E_TAZKIRA';
            authIdProofNumber = item.authorizedtazkiraNo;
          }
          else {
            authIdProofType = 'PASSPORT';
            authIdProofNumber = item.authorizedPassNo;
          }
          if (!this.kycData) {
            let authorizedSignatory =
            {
              //id: j,
              firstName: item.authorizedFirstName,
              lastName: item.authorizedLastName,
              email: item.authorizedEmail,
              // no need
              username: item.authUsername,
              // idProofType: "E_TAZKIRA",
              // idProofNumber: this.authTaskiraOrPass,
              idProofType: authIdProofType,
              idProofNumber: authIdProofNumber,
              dob: item.authorizedDOB,
              placeOfBirth: item.authorizedPlaceofBirth,
              nationality: item.authorizedNationality,
              designation: item.authorizedDesignation,
              residentAddress: item.authorizedlocation,
              phone: item.authorizedPhone,
              sourceOfIncome: item.authorizedSourceofIncome,
              monthlyIncome: (monthlyIncome),
              signatoryType: item.authorizedType,
              makerChecker: (item.roleMaker ? 'MAKER' : (item.roleChecker ? 'CHECKER' : null)),
            }
            console.log("item.authUsername", item.authUsername)
            authorizedSignatoryList.push(authorizedSignatory);
            j++;
            console.log("List", authorizedSignatoryList);
          } else {
            if (this.authorizedSignatoryFormArray.length < this.companyDetailsForm.controls['authorizedSignatoryCount'].value) {

            }
            console.log("sig Form", this.authorizedSignatoryFormArray);
            let authorizedSignatory =
            {
              id: this.kycData?.corporateKyc?.signatories?.[j]?.id,
              firstName: item.authorizedFirstName,
              lastName: item.authorizedLastName,
              email: item.authorizedEmail,
              // no need
              username: item.authUsername,
              // idProofType: "E_TAZKIRA",
              // idProofNumber: this.authTaskiraOrPass,
              idProofType: authIdProofType,
              idProofNumber: authIdProofNumber,
              dob: item.authorizedDOB,
              placeOfBirth: item.authorizedPlaceofBirth,
              nationality: item.authorizedNationality,
              designation: item.authorizedDesignation,
              residentAddress: item.authorizedlocation,
              phone: item.authorizedPhone,
              sourceOfIncome: item.authorizedSourceofIncome,
              monthlyIncome: (monthlyIncome),
              signatoryType: item.authorizedType,
              makerChecker: (item.roleMaker ? 'MAKER' : (item.roleChecker ? 'CHECKER' : null)),
            }
            console.log("item.authUsername", item.authUsername)
            authorizedSignatoryList.push(authorizedSignatory);
            j++;
            console.log("List", authorizedSignatoryList);
          }
        }
        corpReq = {
          signatories: authorizedSignatoryList,

        }


      }
      else if (tab == 'Other Documents (Optional)') {
        this.MultipleDocUpload()
      }
      this.payloadForSubmitKYC = {
        kycType: "CORPORATE",
        submittedFor: this.corporateId,
        kycInputs: corpReq,
      }


      this.corporate.corporateKYCUpdate(this.payloadForSubmitKYC).subscribe({
        next: (user: any) => {
          // if (user) {
          if (user?.responseCode === 200) {
            this.tabSaveCompleted[tab] = true;
            this.markFormPristine(tab);
            this.registerResponse = user.data;
            this.registerResponseSignatory = user.data;
            if (tab == 'Company Shareholder Details') {
              if (this.registerResponse) {
                this.addShareholderImage()
              }
            }
            if (tab == 'Authorized Signatory Details') {
              if (this.registerResponseSignatory) {
                this.addSignatoryImage()
              }
              console.log(this.registerResponse);
            }
            this.isLoading = false;
            this.nextTab(tab);
          }
          else {
            this.isLoading = false;
            // alert("Something went wrong");
            alert(
              (user?.error || 'Unable to proceed.') +
              ' Please try saving again after updating the ID proof number.'
            );
          }
        },
        error: () => {
          this.isLoading = false;
          alert("Something went wrong");
        }
      });


    }
    else if (this.basicDetailsForm.controls['organizationType'].value == "NGO") {

      this.isLoading = true;
      let NGOreq = {}
      if (tab == 'NGO Details') {
        NGOreq = {
          name: this.ngoDetailsForm.controls['companyName'].value,
          //walletNumber: "",
          accOpenDate: this.currentDate,
          licenseRegNumber: this.ngoDetailsForm.controls['licenseRegNo'].value,
          tinNumber: this.ngoDetailsForm.controls['tinNumber'].value,
          sourceOfFund: this.ngoDetailsForm.controls['sourceofFund'].value,
          monthlyTurnover: parseFloat((this.ngoDetailsForm.controls['monthlyTurnover'] as any)['rawValue'] ?? this.ngoDetailsForm.controls['monthlyTurnover'].value),
        }
      }


      else if (tab == "NGO Address") {
        NGOreq = {
          location: this.ngoAddressDetailsForm.controls['location'].value,
          street: this.ngoAddressDetailsForm.controls['streetNumber'].value,
          houseNo: this.ngoAddressDetailsForm.controls['houseNumber'].value,
          district: this.ngoAddressDetailsForm.controls['district'].value,
          province: this.ngoAddressDetailsForm.controls['province'].value,
          country: this.ngoAddressDetailsForm.controls['country'].value,
          officePhone: this.ngoAddressDetailsForm.controls['officePhone'].value,
          officeEmail: this.ngoAddressDetailsForm.controls['officeEmail'].value,
        }
      }
      else if (tab == 'NGO Executive Committee Members Details') {
        let exeCommitteMembersList: any[] = [];
        let i = 0;
        for (let item of this.ngocommitteMemberDetailsForm.controls['exCommitteeMembers'].value) {
          console.log("Item -", item.firstName);
          let list =
          {
            execFirstName: item.firstName,
            execLastName: item.lastName,
            execIdProofType: "E_TAZKIRA",
            execIdProofNumber: this.ngoCommitteeTaskiraOrPass,
            execDob: item.dateofBirth,
            execPlaceOfBirth: item.placeofBirth,
            execResidentAddress: item.location,
            execPosition: item.position,


          }


          exeCommitteMembersList.push(list);
          i++;
          console.log("List", exeCommitteMembersList);
        }
        NGOreq = {
          execCommittee: exeCommitteMembersList
        }



      }
      else if (tab == 'NGO Representative Details') {
        NGOreq = {
          repFirstName: this.ngoRepresntativeDetailsForm.controls['firstName'].value,
          repLastName: this.ngoRepresntativeDetailsForm.controls['lastName'].value,
          repIdProofType: "E_TAZKIRA",
          repIdProofNumber: this.ngoRepTaskiraOrPass,
          repDob: this.ngoRepresntativeDetailsForm.controls['dateofBirth'].value,
          repPlaceOfBirth: this.ngoRepresntativeDetailsForm.controls['placeofBirth'].value,
          repNationality: this.ngoRepresntativeDetailsForm.controls['nationality'].value,
          repDesignation: this.ngoRepresntativeDetailsForm.controls['designation'].value,
          repResidentAddress: this.ngoRepresntativeDetailsForm.controls['location'].value,
          repPhone: this.ngoRepresntativeDetailsForm.controls['phone'].value,
          repSourceOfIncome: this.ngoRepresntativeDetailsForm.controls['sourceofIncome'].value,
          repMonthlyIncome: parseFloat((this.ngoRepresntativeDetailsForm.controls['monthlyIncome'] as any['rawValue'] ?? this.ngoRepresntativeDetailsForm.controls['monthlyIncome'].value)),

        }

      }
      else if (tab == 'Documents') {
        this.uploadDocuments().subscribe((uploadSuccess: boolean) => {
          if (uploadSuccess) {
            alert("Images uploaded succesfully");

          } else {
            console.error('File uploads failed');
            // Notify user about the upload failure
          }
        });

      }
      this.payloadForSubmitKYC = {
        kycType: "NGO",
        submittedFor: this.corporateId,
        kycInputs: NGOreq,
      }


      this.corporate.corporateNGOKYCUpdate(this.payloadForSubmitKYC).subscribe({
        next: (user: any) => {
          if (user) {
            this.isLoading = false;
            this.nextTab(tab);
          }
          else {
            this.isLoading = false;
            alert("Something went wrong");
          }
        },
        error: () => {
          this.isLoading = false;
          alert("Something went wrong");
        }
      });



    }
    else if (this.basicDetailsForm.controls['organizationType'].value == 'GOVT_AGENCY' || this.basicDetailsForm.controls['organizationType'].value == 'UN_AGENCY') {
      this.isLoading = true;
      let govtAgencyReq = {}
      if (tab == 'Agency Details') {
        govtAgencyReq = {
          name: this.unGovtAgencyDetailsForm.controls['unGovtAgencyName'].value,
          officeEmail: this.unGovtAgencyDetailsForm.controls['officeEmail'].value,
          location: this.unGovtAgencyDetailsForm.controls['location'].value,
          street: this.unGovtAgencyDetailsForm.controls['streetNumber'].value,
          houseNo: this.unGovtAgencyDetailsForm.controls['houseNumber'].value,
          district: this.unGovtAgencyDetailsForm.controls['district'].value,
          province: this.unGovtAgencyDetailsForm.controls['province'].value,
          country: this.unGovtAgencyDetailsForm.controls['country'].value,
          officePhone: this.unGovtAgencyDetailsForm.controls['officePhone'].value,
        }

      }
      else if (tab == 'Contract Details') {
        govtAgencyReq = {
          contractNumber: this.unGovtAgencyContractDetailsForm.controls['contractNumber'].value,
          contractType: this.unGovtAgencyContractDetailsForm.controls['contractType'].value,
          contractStartDate: this.unGovtAgencyContractDetailsForm.controls['dateofIssue'].value,
          contractEndDate: this.unGovtAgencyContractDetailsForm.controls['dateofExpiry'].value,
          contractSummary: this.unGovtAgencyContractDetailsForm.controls['contractSummary'].value,
        }
      }
      else if (tab == 'Point of Contact Details') {
        //this.unGovtTaskiraOrPass = this.unGovtAgencyDetailsForm.controls['unGovtPassNo'].value
        // this.unGovtTaskiraOrPass = this.unGovtAgencyPocDetailsForm.controls['tazkiraNo'].value

        govtAgencyReq = {
          pocFirstName: this.unGovtAgencyPocDetailsForm.controls['firstName'].value,
          pocLastName: this.unGovtAgencyPocDetailsForm.controls['lastName'].value,
          pocIdProofType: "E_TAZKIRA",
          pocIdProofNumber: this.unGovtAgencyPocDetailsForm.controls['tazkiraNo'].value,
          pocDob: this.unGovtAgencyPocDetailsForm.controls['dateofBirth'].value,
          pocPlaceOfBirth: this.unGovtAgencyPocDetailsForm.controls['placeofBirth'].value,
          pocNationality: this.unGovtAgencyPocDetailsForm.controls['nationality'].value,
          pocDesignation: this.unGovtAgencyPocDetailsForm.controls['designation'].value,
          pocResidentAddress: this.unGovtAgencyPocDetailsForm.controls['location'].value,
          pocPhone: this.unGovtAgencyPocDetailsForm.controls['phone'].value,
        }

      }
      else if (tab == 'Documents') {
        /*  this.uploadDocuments().subscribe((uploadSuccess: boolean) => {
          if (uploadSuccess) {
            alert("Images uploaded succesfully");

          } else {
            console.error('File uploads failed');
            // Notify user about the upload failure
          }
        }); */
        this.uploadDocuments().subscribe((uploadSuccess: boolean) => {
          if (uploadSuccess) {
            alert("Images uploaded succesfully");

          } else {
            console.error('File uploads failed');
            // Notify user about the upload failure
          }
        });
      }
      this.payloadForSubmitKYC = {
        kycType: this.basicDetailsForm.controls['organizationType'].value,
        submittedFor: this.corporateId,
        kycInputs: govtAgencyReq,
      }
      this.corporate.corporateAgencyKYCUpdate(this.payloadForSubmitKYC).subscribe({
        next: (user: any) => {
          if (user) {
            this.isLoading = false;
            this.nextTab(tab);
          }
          else {
            this.isLoading = false;
            alert("Something went wrong");
          }
        },
        error: () => {
          this.isLoading = false;
          alert("Something went wrong");
        }
      });

    }

  }
  markFormPristine(tab: string) {
    switch (tab) {
      case 'Basic Info':
        this.basicDetailsForm.markAsPristine();
        break;

      case 'Company Details':
        this.companyDetailsForm.markAsPristine();
        break;

      case 'Company Business License Details':
        this.businessLicenceDetailsForm.markAsPristine();
        break;

      case 'Company Business Activities':
        this.businessActivityDetailsForm.markAsPristine();
        break;

      case 'Company Address':
        this.companyAddressDetailsForm.markAsPristine();
        break;

      case 'Company Shareholder Details':
        this.shareHolderDetailsForm.markAsPristine();
        break;

      case 'Authorized Signatory Details':
        this.authorizedDetailsForm.markAsPristine();
        break;
    }
  }

  completeCorporate() {
    this.isLoading = true;

    if (this.basicDetailsForm.controls['organizationType'].value == 'CORPORATE') {
      console.log("CORPORATE corporateId", this.corporateId)
      this.corporate.completeRegisterKYC(this.corporateId).subscribe({
        next: (user: any) => {
          if (user?.responseCode == 200) {
            this.isLoading = false;
            alert("KYC Submitted Successfully");
            this.router.navigate(["corporate/corporate-list"]);
          }
          else {
            this.isLoading = false;
          }
        },
        error: () => {
          this.isLoading = false;
          alert("Something went wrong");
        }
      });
    }
    else if (this.basicDetailsForm.controls['organizationType'].value == "NGO") {
      console.log("NGO corporateId", this.corporateId)
      this.corporate.completeRegisterNGOKYC(this.corporateId).subscribe({
        next: (user: any) => {
          if (user?.responseCode == 200) {
            this.isLoading = false;
            alert("KYC Submitted Successfully");
            this.router.navigate(["corporate/corporate-list"]);
          }
        },
        error: () => {
          this.isLoading = false;
          alert("Something went wrong");
        }
      });
    }
    else if (this.basicDetailsForm.controls['organizationType'].value == 'GOVT_AGENCY' || this.basicDetailsForm.controls['organizationType'].value == 'UN_AGENCY') {
      console.log("GOVT_AGENCY corporateId", this.corporateId)
      this.corporate.completeRegisterAgencyKYC(this.corporateId).subscribe({
        next: (user: any) => {
          if (user?.responseCode == 200) {
            this.isLoading = false;
            alert("KYC Submitted Successfully");
            this.router.navigate(["corporate/corporate-list"]);
          }
        },
        error: () => {
          this.isLoading = false;
          alert("Something went wrong");
        }
      });
    }
  }
  save(tab: string) {
    if (tab == 'Basic Info' && !this.kycData) {
      console.log("reg save")
      this.registerCorporate();
    }
    else {
      console.log("update save")
      this.updateCorporate(tab);
    }
    // this.tabSaveCompleted[tab] = true;
  }
  isTabCompleted(tab: string): boolean {
    if (this.kycData) {
      return !!this.tabSaveCompleted[tab];
    }
    return this.formCompleted(tab);
  }


  allshareholderDocsAttached() {
    for (let i = 0; i < this.companyDetailsForm.controls['shareholderCount'].value; i++) {
      if (!(Object.keys(this.attachedFiles).includes('shareholderTazkiraPhotoFront' + i) && (Object.keys(this.attachedFiles).includes('shareholderTazkiraPhotoFront' + i)))) {
        return false;
      }



    }
    for (let i = 0; i < this.companyDetailsForm.controls['authorizedSignatoryCount'].value; i++) {
      if (!((Object.keys(this.attachedFiles).includes('authorizedzkiraPhotoFront' + i)) && (Object.keys(this.attachedFiles).includes('authorizedzkiraPhotoBack' + i) && (Object.keys(this.attachedFiles).includes('authorizedSign' + i))))) {
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
    let request = this.createPayload();
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
  getAccPurpose() {
    this.corporate.getAccPurpose().subscribe({
      next: (data: any) => {
        this.purposeOfAccount = data?.data;
      this.patchPurpose(this.kycData?.corporateKyc?.purposeOfAcc);

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
  getProvince$(): Observable<any[]> {
    return this.corporate.getprovinces().pipe(
      map((res: any) => res?.data || [])
    );
  }

  patchPurpose(valueFromApi: any) {
  if (
    !valueFromApi ||
    typeof valueFromApi !== 'string' ||
    !this.purposeOfAccount?.length
  ) {
    return;
  }

  const normalizedApiValue = valueFromApi.trim().toLowerCase();

  const matchedPurpose = this.purposeOfAccount.find(
    (p: string) =>
      typeof p === 'string' &&
      p.trim().toLowerCase() === normalizedApiValue
  );

  if (matchedPurpose) {
    this.companyDetailsForm.patchValue({
      purposeofAccount: matchedPurpose,
      purposeofAccountOther: ''
    });
  } else {
    this.companyDetailsForm.patchValue({
      purposeofAccount: 'Others',
      purposeofAccountOther: valueFromApi
    });
  }
}

  onProvinceChange(
    event: any,
    options: {
      type: 'other' | 'permanent' | 'current';
      index?: number;
      fg?: AbstractControl;
    }
  ) {
    const provinceName = event.target.value;
    if (!provinceName || !options.fg) return;

    const controlName =
      options.type === 'permanent'
        ? 'shareholderPermanantDistrict'
        : options.type === 'current'
          ? 'shareholderCurrentDistrict'
          : 'district';

    // ✅ Reset district safely
    options.fg.patchValue({ [controlName]: '' });

    // ✅ Load districts
    this.loadDistrictAndPatch(
      provinceName,
      (districts) => {
        if (options.type === 'other') {
          this.districts = districts;
        } else if (options.type === 'permanent') {
          this.permDistrictsMap[options.index!] = districts;
        } else if (options.type === 'current') {
          this.currentDistrictsMap[options.index!] = districts;
        }
      },
      () => { }
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

  getDistricts(provinceId: number, type?: string) {

    this.corporate.getdistricts(provinceId).subscribe({
      next: (data: any) => {
        if (type && type == 'current') {
          //this.currentDistrictsArray.push({index:index,provinceId : provinceId);
          this.currentDistricts = data?.data;



        }
        else
          this.districts = data?.data;
      }
    });
  }


  onFileSelected(event: Event, formControlName: string, kycType?: 'NGO'| 'GOVT_AGENCY' | 'UN_AGENCY', index?: any) {
    const fileInput = event.target as HTMLInputElement;

    if (!fileInput.files || fileInput.files.length === 0) {
      return; // No file selected
    }

    const file = fileInput.files[0];
    if(!kycType){
      kycType = this.basicDetailsForm.controls['organizationType'].value;
    }
    if (kycType && kycType == 'NGO') {
      this.attachedFilesNgoUN[index].file = file;
      console.log(this.attachedFilesNgoUN);
    }
    else if (kycType && kycType == 'GOVT_AGENCY' ||  kycType == 'UN_AGENCY') {
      this.attachedFilesNgoUN[index].file = file;
      console.log(this.attachedFilesNgoUN);


    }
    
    if (formControlName == 'otherDoc') {
      this.otherDocArray.push(file);
      console.log("otherdocs", this.otherDocArray);
      this.imageChanged[formControlName] = true;
    }
    else {


      // Define allowed MIME types based on formControlName
      const validFileTypes = (formControlName === 'contactPersonSign')
        ? ['image/jpeg', 'image/png', 'image/jpg']
        : ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

      // Validate file type
      if (!validFileTypes.includes(file.type)) {
        this.errorMessages[formControlName] = (formControlName === 'contactPersonSign')
          ? 'Only image files (JPEG, PNG, JPG) are allowed.'
          : 'Only image files (JPEG, PNG, JPG) or PDF files are allowed.';
        fileInput.value = ''; // Clear the file input

      }
      else {
        this.errorMessages[formControlName] = '';
        this.attachedFiles = this.attachedFiles || {}; // Ensure attachedFiles is initialized
        this.attachedFiles[formControlName] = file;
        this.corporateFilesChanged[formControlName] = true;
        console.log("Attached Files:", this.attachedFiles);
      }
    }


    /* this.errorMessages[formControlName] = '';

    this.attachedFiles = this.attachedFiles || {};
    this.attachedFiles[formControlName] = file;

    this.imageChanged[formControlName] = true;

    console.log('Attached Files:', this.attachedFiles);
    console.log('Image Changed:', this.imageChanged); */
    this.markCurrentTabFormDirty();
  }
  onFileSelectedForShareholderAndAuthorizedSignatories(event: Event, formControlName: string, tab: string, index: number) {
    //const input = event.target as HTMLInputElement;
    const fileInput = event.target as HTMLInputElement;

    if (!fileInput.files || fileInput.files.length === 0) {
      return; // No file selected
    }

    const file = fileInput.files[0];
    const validFileTypes = (formControlName === 'authorizedPhoto' || formControlName === 'authorizedSign')
      ? ['image/jpeg', 'image/png', 'image/jpg']
      : ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

    if (!validFileTypes.includes(file.type)) {
      this.errorMessages[formControlName + index] = (formControlName === 'authorizedPhoto' || formControlName === 'authorizedSign')
        ? 'Only image files (JPEG, PNG, JPG) are allowed.'
        : 'Only image files (JPEG, PNG, JPG) or PDF files are allowed.';
      fileInput.value = ''; // Clear the file input

    }
    else {
      this.errorMessages[formControlName] = '';
      let key = formControlName + index;
      this.attachedFiles[key] = file;
      this.corporateFilesChanged[key] = true;
      console.log("this.attachedFiles-shareholder", this.attachedFiles)
    }
    this.markCurrentTabFormDirty();
  }
  markCurrentTabFormDirty() {
    switch (this.tab) {
      case 'Company Details':
        this.companyDetailsForm.markAsDirty();
        break;

      case 'Company Business License Details':
        this.businessLicenceDetailsForm.markAsDirty();
        break;

      case 'Company Address':
        this.companyAddressDetailsForm.markAsDirty();
        break;

      case 'Authorized Signatory Details':
        this.authorizedDetailsForm.markAsDirty();
        break;

      case 'Company Shareholder Details':
        this.shareHolderDetailsForm.markAsDirty();
        break;
    }
  }
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible; // Toggle the visibility
  }
  onPasswordInput(event: Event): void {
    const password = (event.target as HTMLInputElement).value;
    if (password.length < 4) {
      this.passError = 'Password must be at least 4 characters.';
    } else {
      this.passError = null; // Clear the error if validation passes
    }
  }

  addShareholderImage() {

    const shareholderCountValue = this.companyDetailsForm.get('shareholderCount')?.value;
    this.shareholderImgCount = parseInt(shareholderCountValue, 10);

    if (!this.shareholderImgCount || this.shareholderImgCount <= 0) {
      console.error('Invalid number of shareholders.');
      return;
    }

    const shareholders = this.registerResponse?.shareholders;

    if (!shareholders || shareholders.length === 0) {
      console.error('No shareholders found in register response.');
      return;
    }

    for (let i = 0; i < this.shareholderImgCount; i++) {

      if (!shareholders[i]) {
        console.error(`No shareholder data found for index ${i}`);
        continue;
      }

      const shareholderId = shareholders[i].id;

      /** ------------------------------------------
       * New KYC → upload if file exists
       * Update KYC → upload only if file changed
       ------------------------------------------ */

      const frontKey = 'shareholderTazkiraPhotoFront' + i;
      const backKey = 'shareholderTazkiraPhotoBack' + i;

      const frontFile = this.attachedFiles[frontKey];
      const backFile = this.attachedFiles[backKey];

      /** FRONT FILE UPLOAD */
      if (
        (!this.kycData && frontFile) ||                         // New KYC case
        (this.kycData && this.corporateFilesChanged[frontKey]   // Update KYC case
          && frontFile)
      ) {
        this.corporate.submitCorporateKYCShareholderFiles(
          "idProofFrontPhoto",
          this.corporateId,
          shareholderId,
          frontFile
        ).subscribe(
          () => console.log(`Front file submitted for shareholder ${i + 1}`),
          err => console.error(`Error uploading front file for shareholder ${i + 1}`, err)
        );
      }

      /** BACK FILE UPLOAD */
      if (
        (!this.kycData && backFile) ||                        // New KYC case
        (this.kycData && this.corporateFilesChanged[backKey]  // Update KYC case
          && backFile)
      ) {
        this.corporate.submitCorporateKYCShareholderFiles(
          "idProofBackPhoto",
          this.corporateId,
          shareholderId,
          backFile
        ).subscribe(
          () => console.log(`Back file submitted for shareholder ${i + 1}`),
          err => console.error(`Error uploading back file for shareholder ${i + 1}`, err)
        );
      }

    } // loop end
  }





  addSignatoryImage() {

    const signatoryCount = parseInt(
      this.companyDetailsForm.get('authorizedSignatoryCount')?.value
    );

    if (!signatoryCount || signatoryCount <= 0) {
      console.error('Invalid number of signatories.');
      return;
    }

    const signatories = this.registerResponseSignatory?.signatories;

    if (!signatories || signatories.length === 0) {
      console.error('No signatory found in register response.');
      return;
    }

    for (let i = 0; i < signatoryCount; i++) {

      if (!signatories[i]) {
        console.error(`No signatory data found for index ${i}`);
        continue;
      }

      const signatoryId = signatories[i].id;

      const filesToUpload = [
        { field: 'signatoryPhoto', key: 'authorizedPhoto' + i },
        { field: 'idProofFrontPhoto', key: 'authorizedzkiraPhotoFront' + i },
        { field: 'idProofBackPhoto', key: 'authorizedzkiraPhotoBack' + i },
        { field: 'signaturePhoto', key: 'authorizedSign' + i }
      ];

      from(filesToUpload).pipe(
        concatMap(({ field, key }) => {

          const file = this.attachedFiles[key];

          // NEW KYC → upload if a file exists
          if (!this.kycData && file) {
            return this.corporate.submitCorporateKYCSignatoryFiles(
              field, this.corporateId, signatoryId, file
            );
          }

          // UPDATE MODE → upload only if file changed
          if (this.kycData && this.corporateFilesChanged[key] && file) {
            return this.corporate.submitCorporateKYCSignatoryFiles(
              field, this.corporateId, signatoryId, file
            );
          }

          // Skip upload
          return of(null);
        })
      )
        .subscribe({
          next: (res) => {
            if (res)
              console.log(`Upload successful for signatory ${i + 1}`);
          },
          error: (err) => {
            console.error(`Upload failed for signatory ${i + 1}`, err);
          },
          complete: () => {
            console.log(`Completed uploads for signatory ${i + 1}`);
          }
        });

    } // loop ends

  }


  previousTab(tab: string) {
    let index = this.formTabs.indexOf(tab);

    this.selectedTab(this.formTabs[--index], --index);

  }
  nextTab(tab: string) {
    let index = this.formTabs.indexOf(tab);

    this.selectedTab(this.formTabs[++index], ++index);

  }
  sanitizeInput(event: Event): void {
    /* const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-Z0-9]/g, '');

      this.shareHolderDetailsForm.get('shareholdertazkiraNo')?.setValue(input.value);
    this.basicDetailsForm.get('corporatePassword')?.setValue(input.value); */

  }
  onKeyPressNumbersOnly(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow only numbers (0-9), block everything else
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }

  }
  onKeyPressNoAlphabet(event: KeyboardEvent): void {
    const charCode = event.which || event.keyCode;
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {
      // Prevent input if the pressed key is an alphabet character (ASCII range: 65-90, 97-122)
      event.preventDefault();
    }
  }
  onChangeShareTaskiraType(index: number) {

    const formArray = this.shareHolderDetailsForm.get('shareHolders') as FormArray;
    const group = formArray.at(index) as FormGroup;

    if (!group) return;

    const type = group.get('shareholderIdProofType')?.value;

    const tazkiraCtrl = group.get('shareholdertazkiraNo');
    const passportCtrl = group.get('shareholderPassNo');

    // 🔹 Reset everything first
    tazkiraCtrl?.clearValidators();
    passportCtrl?.clearValidators();

    tazkiraCtrl?.setValue('');
    passportCtrl?.setValue('');

    if (type === 'TAZKIRA') {

      tazkiraCtrl?.setValidators([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9 ]+$')
      ]);

    }
    else if (type === 'PASSPORT') {

      passportCtrl?.setValidators([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9 !@#$%^&*()_+=\\-\\[\\]{};:"\'|,.<>?/]*$')
      ]);
    }

    // 🔑 THIS IS WHAT ENABLES SAVE BUTTON
    tazkiraCtrl?.updateValueAndValidity();
    passportCtrl?.updateValueAndValidity();

    // 🔑 Also update the group itself
    group.updateValueAndValidity();
  }
  //old
  // onChangeAuthTaskiraType($event: any) {
  //   console.log("$event.target.value", $event.target.value)

  //   if ($event.target.value == "1") {
  //     this.showAuthPass = false;
  //     this.showAuthTaskira = true;
  //     this.authorizedDetailsForm.get('authorizedtazkiraNo')?.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);
  //     this.authorizedDetailsForm.get('authorizedPassNo')?.clearValidators();
  //   }
  //   else if ($event.target.value == "2") {
  //     this.showAuthPass = true;
  //     this.showAuthTaskira = false;
  //     this.authorizedDetailsForm.get('authorizedPassNo')?.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9 !@#$%^&*()_+=\\-\\[\\]{};:"\'|,.<>?/]*$')]);
  //     this.authorizedDetailsForm.get('authorizedtazkiraNo')?.clearValidators();
  //   }
  //   else {
  //     this.showAuthTaskira = false;
  //     this.showAuthPass = false;
  //     this.authorizedDetailsForm.get('authorizedtazkiraNo')?.clearValidators();
  //     this.authorizedDetailsForm.get('authorizedPassNo')?.clearValidators();
  //   }
  //   this.authorizedDetailsForm.get('authorizedtazkiraNo')?.updateValueAndValidity();
  //   this.authorizedDetailsForm.get('authorizedPassNo')?.updateValueAndValidity();
  // }
  onChangeAuthTaskiraType(index: number) {
    const authorizedFG = this.authorizedSignatoryFormArray.at(index) as FormGroup;

    const type = authorizedFG.get('authorizedIdProofType')?.value;

    const tazkiraCtrl = authorizedFG.get('authorizedtazkiraNo');
    const passportCtrl = authorizedFG.get('authorizedPassNo');

    if (type === '1') { // TAZKIRA
      tazkiraCtrl?.setValidators([
        Validators.required,
        Validators.pattern('^[0-9]+$')
      ]);

      passportCtrl?.clearValidators();
      passportCtrl?.setValue(null);

    } else if (type === '2') { // PASSPORT
      passportCtrl?.setValidators([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9 !@#$%^&*()_+=\\-\\[\\]{};:"\'|,.<>?/]*$')
      ]);

      tazkiraCtrl?.clearValidators();
      tazkiraCtrl?.setValue(null);
    }

    tazkiraCtrl?.updateValueAndValidity({ emitEvent: false });
    passportCtrl?.updateValueAndValidity({ emitEvent: false });
  }
  onChangeNgoCommitteeTaskiraType($event: any) {

    console.log("$event.target.value", $event.target.value)
    const exCommitteeMembersArray = this.ngocommitteMemberDetailsForm.get('exCommitteeMembers') as FormArray;

    exCommitteeMembersArray.controls.forEach((group: AbstractControl) => {
      if (group instanceof FormGroup) {
        // Correctly retrieve FormControl instances
        const tazkiraControl = group.get('tazkiraNo') as FormControl;
        const passportControl = group.get('ngoCommitteePassNo') as FormControl;
        if ($event.target.value == "1") {
          this.showngoCommitteePass = false;
          this.showngoCommitteeTaskira = true;

          tazkiraControl.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);
          passportControl.clearValidators();
          passportControl.setValue('');
        }
        else if ($event.target.value == "2") {
          this.showngoCommitteePass = true;
          this.showngoCommitteeTaskira = false;
          passportControl.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9 !@#$%^&*()_+=\\-\\[\\]{};:"\'|,.<>?/]*$')]);
          tazkiraControl.clearValidators();
          tazkiraControl.setValue('');
        }
        else {
          this.showngoCommitteePass = false;
          this.showngoCommitteeTaskira = false;
        }
        // Ensure changes reflect immediately
        tazkiraControl.updateValueAndValidity();
        passportControl.updateValueAndValidity();
      }
    });
  }
  onChangeNgoRepTaskiraType($event: any) {
    const tazkiraNoControl = this.ngoRepresntativeDetailsForm.get('tazkiraNo');
    const ngoRepPassNoControl = this.ngoRepresntativeDetailsForm.get('ngoRepPassNo');

    if ($event.target.value == "1") {
      this.showNgoRepPass = false;
      this.showNgoRepTaskira = true;
      tazkiraNoControl?.setValidators([Validators.required, Validators.pattern('^[0-9]+$')]); // Only numbers
      ngoRepPassNoControl?.clearValidators();
    }
    else if ($event.target.value == "2") {
      this.showNgoRepPass = true;
      this.showNgoRepTaskira = false;
      ngoRepPassNoControl?.setValidators([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9 !@#$%^&*()_+=\\-\\[\\]{};:"\'|,.<>?/]*$')
      ]);
      tazkiraNoControl?.clearValidators();
    }

    tazkiraNoControl?.updateValueAndValidity();
    ngoRepPassNoControl?.updateValueAndValidity();
  }
  onChangeUnGovtTaskiraType($event: any) {
    const tazkiraControl = this.unGovtAgencyPocDetailsForm.get('tazkiraNo');
    const passControl = this.unGovtAgencyPocDetailsForm.get('unGovtPassNo');
    console.log("passControl", passControl)
    console.log("tazkiraControl", tazkiraControl)

    if ($event.target.value == "1") {
      this.showUnGovtPass = false;
      this.showUnGovtTaskira = true;
      tazkiraControl?.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);
      passControl?.clearValidators();
      passControl?.setValue('');
    }
    else if ($event.target.value == "2") {
      this.showUnGovtPass = true;
      this.showUnGovtTaskira = false;
      passControl?.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9 !@#$%^&*()_+=\\-\\[\\]{};:"\'|,.<>?/]*$')]);
      tazkiraControl?.clearValidators();
      tazkiraControl?.setValue('');
    }
    tazkiraControl?.updateValueAndValidity();
    passControl?.updateValueAndValidity();
  }
  onFileSelectedForProfile(event: any) {
    //const input = event.target as HTMLInputElement;
    if (event.target.files[0]) {
      const file = event.target.files[0];
      this.profile = file
    }
  }

  createPayload() {
    const reqBasic = {
      corpType: this.basicDetailsForm.controls['type'].value,
      email: this.basicDetailsForm.controls['corporateEmail'].value,
      username: this.basicDetailsForm.controls['corporateEmail'].value,
      firstName: this.basicDetailsForm.controls['corporteFirstName'].value,
      lastName: this.basicDetailsForm.controls['corporteLastName'].value,
      phone: this.basicDetailsForm.controls['corporatePhone'].value,
      userType: 'CORPORATE',
      gender: 'MALE',
      password: this.basicDetailsForm.controls['corporatePassword'].value,
      isNeedThirdLevelAuth: this.basicDetailsForm.controls['SalarythirdLevelAuth'].value,
    };

    const today = new Date();
    this.currentDate = today.toISOString().split('T')[0];

    this.corporate.submitCorporateRegister(reqBasic).pipe(
      concatMap((data: any) => {
        if (data.responseCode == 200) {
          this.userId = data.data;
          alert("Corporate account registration completed, Please complete KYC");
          if (!this.userId) {
            alert("Corporate Registration failed, please try again later");
            return of(null);
          }

          // Build the req for submitCorporateRegisterKYC


          if (this.basicDetailsForm.controls['organizationType'].value == 'CORPORATE') {
            let shareholdersList: any[] = [];
            let i = 0;
            for (let item of this.shareHolderDetailsForm.controls['shareHolders'].value) {
              console.log("Item -", item);
              const formArray = this.shareHolderDetailsForm.controls['shareHolders'] as FormArray;
              const index = this.shareHolderDetailsForm.controls['shareHolders'].value.indexOf(item);

              const monthlyIncomeControl = formArray.at(index).get('shareholderMonthlyIncome');
              const monthlyIncome = monthlyIncomeControl && (monthlyIncomeControl as any)['rawValue'] !== undefined
                ? (monthlyIncomeControl as any)['rawValue']
                : monthlyIncomeControl?.value;

              this.shareTaskiraOrPass = item.shareholdertazkiraNo
              this.shareTaskiraOrPass = item.shareholderPassNo

              let shareholders =
              {
                //id: i,
                firstName: item.shareholderFirstName,
                lastName: item.shareholderLastName,
                fatherName: item.shareholderFatherName,
                idProofType: "E_TAZKIRA",
                idProofNumber: this.shareTaskiraOrPass,
                dob: item.shareholderDOB,
                placeOfBirth: item.shareholderPlaceofBirth,
                nationality: item.shareholderNationality,
                monthlyIncome: parseFloat(monthlyIncome),
                shareholdingPercentage: item.shareholdingPercentage,
                sourceOfIncome: item.shareholdingOtherSource,
                relationship: item.shareholderRelationship,
                phone: item.shareholderPhone,
                tinNumber: item.shareholderTin,
                currLocation: item.shareholderCurrentlocation,
                currDistrict: item.shareholderCurrentDistrict,
                currProvince: item.shareholderCurrentProvince,
                currCountry: item.shareholderCurrentCountry,
                permDistrict: item.shareholderPermanantDistrict,
                permProvince: item.shareholderPermanantProvince,
                permCountry: item.shareholderPermanantCountry,
              }


              shareholdersList.push(shareholders);
              i++;
              console.log("List", shareholdersList);
            }
            let authorizedSignatoryList: any[] = [];
            let j = 0;

            for (let item of this.authorizedDetailsForm.controls['authorizedSignatories'].value) {
              console.log("Item -", item);
              const formArray = this.authorizedDetailsForm.controls['authorizedSignatories'] as FormArray;
              const index = this.authorizedDetailsForm.controls['authorizedSignatories'].value.indexOf(item);

              const monthlyIncomeControl = formArray.at(index).get(' authorizedMonthlyIncome');
              const monthlyIncome = monthlyIncomeControl && (monthlyIncomeControl as any)['rawValue'] !== undefined
                ? (monthlyIncomeControl as any)['rawValue']
                : monthlyIncomeControl?.value;

              this.authTaskiraOrPass = item.authorizedPassNo
              this.authTaskiraOrPass = item.authorizedtazkiraNo
              let authorizedSignatory =
              {
                //id: j,
                firstName: item.authorizedFirstName,
                lastName: item.authorizedLastName,
                email: item.authorizedEmail,
                username: item.authUsername,
                idProofType: "E_TAZKIRA",
                idProofNumber: this.authTaskiraOrPass,
                dob: item.authorizedDOB,
                placeOfBirth: item.authorizedPlaceofBirth,
                nationality: item.authorizedNationality,
                designation: item.authorizedDesignation,
                residentAddress: item.authorizedlocation,
                phone: item.authorizedPhone,
                sourceOfIncome: item.authorizedSourceofIncome,
                monthlyIncome: 0.00,
                signatoryType: item.authorizedType,
                makerChecker: (item.roleMaker ? 'MAKER' : (item.roleChecker ? 'CHECKER' : null)),
              }
              console.log("item.authUsername", item.authUsername)
              authorizedSignatoryList.push(authorizedSignatory);
              j++;
              console.log("List", authorizedSignatoryList);
            }
            let nautureOfBuisness: any;
            if (this.businessActivityDetailsForm.controls['natureofBusiness'].value == 'Other') {
              nautureOfBuisness = this.natureOfBuisness

            } else {
              nautureOfBuisness = this.businessActivityDetailsForm.controls['natureofBusiness'].value;
            }
            // console.log(nautureOfBuisness);
            const req = {
              kycInputs: {
                companyName: this.companyDetailsForm.controls['companyName'].value,
                //companyWalletNumber: this.companyDetailsForm.controls['mmwalletNumber'].value,
                companyAccOpenDate: this.currentDate,
                contactPersonName: this.companyDetailsForm.controls['contactPersonName'].value,
                contactPersonDesignation: this.companyDetailsForm.controls['contactpersonDesignation'].value,
                companyNoOfShareholders: parseInt(this.companyDetailsForm.controls['shareholderCount'].value),

                bizLicenseNumber: this.businessLicenceDetailsForm.controls['licenceNumber'].value,
                bizLicenseAuthority: this.businessLicenceDetailsForm.controls['licenceIssueAuthority'].value,
                bizLicenseDateOfIssue: this.businessLicenceDetailsForm.controls['dateofIssue'].value,
                bizLicenseDateOfExpiry: this.businessLicenceDetailsForm.controls['dateofExpiry'].value,
                bizLicenseTinNumber: this.businessLicenceDetailsForm.controls['tinNumber'].value,

                bizName: this.businessActivityDetailsForm.controls['businessName'].value,
                natureOfBiz: nautureOfBuisness,
                monthlyIncome: parseFloat((this.businessActivityDetailsForm.controls['monthlyIncome'] as any)['rawValue'] ?? this.businessActivityDetailsForm.controls['monthlyIncome'].value),
                netWorth: parseFloat((this.businessActivityDetailsForm.controls['netWorth'] as any)['rawValue'] ?? this.businessActivityDetailsForm.controls['netWorth'].value),
                sourceOfFund: this.businessActivityDetailsForm.controls['sourceofFund'].value,
                monthlyTurnover: parseFloat((this.businessActivityDetailsForm.controls['monthlyTurnover'] as any)['rawValue'] ?? this.businessActivityDetailsForm.controls['monthlyTurnover'].value),


                companyLocation: this.companyAddressDetailsForm.controls['location'].value,
                companyStreet: this.companyAddressDetailsForm.controls['streetNumber'].value,
                companyHouseNumber: this.companyAddressDetailsForm.controls['houseNumber'].value,
                companyDistrict: this.companyAddressDetailsForm.controls['district'].value,
                companyProvince: this.companyAddressDetailsForm.controls['province'].value,
                companyCountry: this.companyAddressDetailsForm.controls['country'].value,
                companyOfficePhone: this.companyAddressDetailsForm.controls['officePhone'].value,
                companyEmail: this.companyAddressDetailsForm.controls['officeEmail'].value,
                shareholders: shareholdersList,
                signatories: authorizedSignatoryList,



                /*  signatoryFirstName: this.authorizedDetailsForm.controls['authorizedFirstName'].value,
                 signatoryLastName: this.authorizedDetailsForm.controls['authorizedLastName'].value,
                 signatoryIdProofType: "E_TAZKIRA",
                 signatoryIdProofNumber: this.authorizedDetailsForm.controls['authorizedtazkiraNo'].value,
                 signatoryDOB: this.authorizedDetailsForm.controls['authorizedDOB'].value,
                 signatoryPlaceOfBirth: this.authorizedDetailsForm.controls['authorizedPlaceofBirth'].value,
                 signatoryNationality: this.authorizedDetailsForm.controls['authorizedNationality'].value,
                 signatoryDesignation: this.authorizedDetailsForm.controls['authorizedDesignation'].value,
                 signatoryResidentAddress: this.authorizedDetailsForm.controls['authorizedlocation'].value,
                 signatoryPhone: this.authorizedDetailsForm.controls['authorizedPhone'].value,
                 signatorySourceOfIncome: this.authorizedDetailsForm.controls['authorizedSourceofIncome'].value,
                 signatoryMonthlyIncome: (this.authorizedDetailsForm.controls['authorizedMonthlyIncome'] as any)['rawValue'] ?? this.authorizedDetailsForm.controls['authorizedMonthlyIncome'].value,
                 signatoryType: this.authorizedDetailsForm.controls['authorizedType'].value, */
              }
            };
            this.payloadForSubmitKYC = {
              kycType: "CORPORATE",
              submittedFor: this.corporateId,
            }
            this.payloadForSubmitKYC = { ...this.payloadForSubmitKYC, ...req };
            return this.corporate.submitCorporateRegisterKYC(this.payloadForSubmitKYC)


          }
          else if (this.basicDetailsForm.controls['organizationType'].value == 'NGO') {

            this.ngoCommitteeTaskiraOrPass = this.ngocommitteMemberDetailsForm.controls['ngoCommitteePassNo'].value
            this.ngoCommitteeTaskiraOrPass = this.ngocommitteMemberDetailsForm.controls['tazkiraNo'].value

            this.ngoRepTaskiraOrPass = this.ngoRepresntativeDetailsForm.controls['tazkiraNo'].value
            this.ngoRepTaskiraOrPass = this.ngoRepresntativeDetailsForm.controls['ngoRepPassNo'].value

            let exeCommitteMembersList: any[] = [];
            let i = 0;
            for (let item of this.ngocommitteMemberDetailsForm.controls['exCommitteeMembers'].value) {
              console.log("Item -", item);




              let list =
              {
                execFirstName: item.controls['firstName'].value,
                execLastName: item.controls['lastName'].value,
                execIdProofType: "E_TAZKIRA",
                execIdProofNumber: this.ngoCommitteeTaskiraOrPass,
                execDob: item.controls['dateofBirth'].value,
                execPlaceOfBirth: item.controls['placeofBirth'].value,
                execResidentAddress: item.controls['location'].value,
                execPosition: item.controls['position'].value,


              }


              exeCommitteMembersList.push(list);
              i++;
              console.log("List", exeCommitteMembersList);
            }
            let NGOreq = {

              name: this.ngoDetailsForm.controls['companyName'].value,
              //walletNumber: "",
              accOpenDate: this.currentDate,
              licenseRegNumber: this.ngoDetailsForm.controls['licenseRegNo'].value,
              tinNumber: this.ngoDetailsForm.controls['tinNumber'].value,
              sourceOfFund: this.ngoDetailsForm.controls['sourceofFund'].value,
              monthlyTurnover: parseFloat((this.ngoDetailsForm.controls['monthlyTurnover'] as any)['rawValue'] ?? this.ngoDetailsForm.controls['monthlyTurnover'].value),
              location: this.ngoAddressDetailsForm.controls['location'].value,
              street: this.ngoAddressDetailsForm.controls['streetNumber'].value,
              houseNo: this.ngoAddressDetailsForm.controls['houseNumber'].value,
              district: this.ngoAddressDetailsForm.controls['district'].value,
              province: this.ngoAddressDetailsForm.controls['province'].value,
              country: this.ngoAddressDetailsForm.controls['country'].value,
              officePhone: this.ngoAddressDetailsForm.controls['officePhone'].value,
              officeEmail: this.ngoAddressDetailsForm.controls['officeEmail'].value,
              execCommittee: exeCommitteMembersList,
              repFirstName: this.ngoRepresntativeDetailsForm.controls['firstName'].value,
              repLastName: this.ngoRepresntativeDetailsForm.controls['lastName'].value,
              repIdProofType: "E_TAZKIRA",
              repIdProofNumber: this.ngoRepTaskiraOrPass,
              repDob: this.ngoRepresntativeDetailsForm.controls['dateofBirth'].value,
              repPlaceOfBirth: this.ngoRepresntativeDetailsForm.controls['placeofBirth'].value,
              repNationality: this.ngoRepresntativeDetailsForm.controls['nationality'].value,
              repDesignation: this.ngoRepresntativeDetailsForm.controls['designation'].value,
              repResidentAddress: this.ngoRepresntativeDetailsForm.controls['location'].value,
              repPhone: this.ngoRepresntativeDetailsForm.controls['phone'].value,
              repSourceOfIncome: this.ngoRepresntativeDetailsForm.controls['sourceofIncome'].value,
              repMonthlyIncome: parseFloat((this.ngoRepresntativeDetailsForm.controls['monthlyIncome'] as any['rawValue'] ?? this.ngoRepresntativeDetailsForm.controls['monthlyIncome'].value)),


            }
            this.payloadForSubmitKYC = {
              kycType: "NGO",
              submittedFor: this.corporateId,
              kycInputs: NGOreq,
            }
            return this.corporate.submitCorporateNGORegisterKYC(this.payloadForSubmitKYC)
          }
          else if (this.basicDetailsForm.controls['organizationType'].value == 'GOVT_AGENCY' || this.basicDetailsForm.controls['organizationType'].value == 'UN_AGENCY') {

            this.unGovtTaskiraOrPass = this.unGovtAgencyDetailsForm.controls['unGovtPassNo'].value
            this.unGovtTaskiraOrPass = this.unGovtAgencyPocDetailsForm.controls['tazkiraNo'].value

            let govtAgencyReq = {
              name: this.unGovtAgencyDetailsForm.controls['unGovtAgencyName'].value,
              //walletNumber: walletNumber_53a8da155fba,
              accOpenDate: this.currentDate,
              location: this.unGovtAgencyDetailsForm.controls['location'].value,
              street: this.unGovtAgencyDetailsForm.controls['streetNumber'].value,
              houseNo: this.unGovtAgencyDetailsForm.controls['houseNumber'].value,
              district: this.unGovtAgencyDetailsForm.controls['district'].value,
              province: this.unGovtAgencyDetailsForm.controls['province'].value,
              country: this.unGovtAgencyDetailsForm.controls['country'].value,
              officePhone: this.unGovtAgencyDetailsForm.controls['officePhone'].value,
              officeEmail: this.unGovtAgencyDetailsForm.controls['officeEmail'].value,
              contractNumber: this.unGovtAgencyContractDetailsForm.controls['contractNumber'].value,
              contractType: this.unGovtAgencyContractDetailsForm.controls['contractType'].value,
              contractStartDate: this.unGovtAgencyContractDetailsForm.controls['dateofIssue'].value,
              contractEndDate: this.unGovtAgencyContractDetailsForm.controls['dateofExpiry'].value,
              contractSummary: this.unGovtAgencyContractDetailsForm.controls['contractSummary'].value,
              pocFirstName: this.unGovtAgencyPocDetailsForm.controls['firstName'].value,
              pocLastName: this.unGovtAgencyPocDetailsForm.controls['lastName'].value,
              pocIdProofType: "E_TAZKIRA",
              pocIdProofNumber: this.unGovtTaskiraOrPass,
              pocDob: this.unGovtAgencyPocDetailsForm.controls['dateofBirth'].value,
              pocPlaceOfBirth: this.unGovtAgencyPocDetailsForm.controls['placeofBirth'].value,
              pocNationality: this.unGovtAgencyPocDetailsForm.controls['nationality'].value,
              pocDesignation: this.unGovtAgencyPocDetailsForm.controls['designation'].value,
              pocResidentAddress: this.unGovtAgencyPocDetailsForm.controls['location'].value,
              pocPhone: this.unGovtAgencyPocDetailsForm.controls['phone'].value,

            }
            this.payloadForSubmitKYC = {
              kycType: this.basicDetailsForm.controls['organizationType']?.value,
              submittedFor: this.corporateId,
              kycInputs: govtAgencyReq,
            }
            return this.corporate.submitCorporateGOVTAgencyRegisterKYC(this.payloadForSubmitKYC);
          }
          else {
            return of(null)
          }



        } else {
          alert("Corporate Registration failed, please try again later");
          return of(null);
        }
      }),
      concatMap((data: any) => {
        if (data?.responseCode === 200) {
          this.registerResponse = data.data;
          return this.uploadDocuments();  // Upload documents if KYC submission is successful
        } else {
          alert("KYC Submission Failed, Please submit again");
          return of(false);
        }
      }),
      concatMap((uploadSuccess: boolean) => {
        if (uploadSuccess) {
          //completeRegisterNGOKYC
          if (this.basicDetailsForm.controls['organizationType'].value == 'CORPORATE') {
            return this.corporate.completeRegisterKYC(this.userId);  // Call completeRegisterKYC only if uploads succeeded
          }
          else if (this.basicDetailsForm.controls['organizationType'].value == 'NGO') {
            return this.corporate.completeRegisterNGOKYC(this.userId);  // Call completeRegisterKYC only if uploads succeeded
          }
          else if (this.basicDetailsForm.controls['organizationType'].value == 'UN_AGENCY' || this.basicDetailsForm.controls['organizationType'].value == 'GOVT_AGENCY') {
            return this.corporate.completeRegisterGOVTAgencyKYC(this.userId);  // Call completeRegisterKYC only if uploads succeeded
          }
          else {
            return of(null);
          }



        } else {
          alert("Document Upload Failed, please resubmit KYC");
          return of(null);
        }
      }),
      concatMap((data: any) => {
        if (this.otherDocArray.length > 0) {
          if (data?.responseCode == 200) {
            alert("KYC Submitted Succesfully");
            return this.uploadAdditionalDocuments()  // Call completeRegisterKYC only if uploads succeeded
          } else {
            alert("Kyc Registration is Incomplete, Pls try again to complete it");
            return of(null);
          }

        }
        else {
          return of(null);

        }

      })

    ).subscribe({
      next: (data: any) => {
        if (data?.responseCode == 200) {
          console.log("data,", data)
          this.isLoading = false;
          alert("Registration Completed Successfully");
          this.router.navigate(["corporate/corporate-list"]);
        } else {
          this.isLoading = false;
          //alert("Registration Failed");
          alert("Additional Document Upload Failed");
        }
      }, error: () => {
        alert("Registration Failed");
        this.isLoading = false;
      }
    })
  }



  uploadDocuments(): Observable<boolean> {

    if (this.basicDetailsForm.get('organizationType')?.value == 'NGO') {
      const filteredFile = this.attachedFilesNgoUN.filter(({ file }) => file);
      return of(...filteredFile).pipe(
        concatMap(({ mapping, file }) => {
          return this.corporate.submitCorporateNGOKYCFiles(this.corporateId, mapping, file).pipe(
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
    else if (this.basicDetailsForm.get('organizationType')?.value == 'GOVT_AGENCY' || this.basicDetailsForm.get('organizationType')?.value == 'UN_AGENCY') {
      const filteredFile = this.attachedFilesNgoUN.filter(({ file }) => file);
      return of(...filteredFile).pipe(
        concatMap(({ mapping, file }) => {
          return this.corporate.submitCorporateGOVTAgencyKYCFiles(this.corporateId, mapping, file).pipe(
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
    else {
      return of(false);

    }

  }
  private uploadFilesSequentially(fileMappings: any[]): Observable<boolean> {

    if (!fileMappings.length) return of(true);

    return fileMappings.reduce(
      (acc$, { mapping, file }) =>
        acc$.pipe(
          concatMap(success => {
            if (!success) throw new Error("Previous file upload failed");

            return this.corporate.submitCorporateKYCFiles(
              this.corporateId,
              mapping,
              file
            ).pipe(
              map((response: any) => response?.responseCode === 200),
              catchError(error => {
                console.error(`Error submitting file with mapping ${mapping}`, error);
                return of(false);
              })
            );
          })
        ),
      of(true)
    ).pipe(
      tap(success =>
        success
          ? console.log("All files uploaded successfully")
          : console.error("One or more uploads failed")
      ),
      catchError(error => {
        console.error("Error in upload sequence", error);
        return of(false);
      })
    );
  }
  private buildFileMappings(config: any[]): any[] {

    return config
      .filter(item => {
        if (!this.kycData) return !!this.attachedFiles[item.key];

        return this.corporateFilesChanged[item.key];
      })
      .map(item => ({
        mapping: item.mapping,
        file: this.attachedFiles[item.key]
      }));
  }


  companyFiles(): Observable<boolean> {

    const config = [
      { key: 'contactPersonTazkiraPhotoFront', mapping: 'contactIdProofFrontPhoto' },
      { key: 'contactPersonTazkiraPhotoBack', mapping: 'contactIdProofBackPhoto' },
      { key: 'contactPersonSign', mapping: 'contactSignaturePhoto' },
      { key: 'authorizedLetter', mapping: 'authorizationLetterPhoto' }
    ];

    const fileMappings = this.buildFileMappings(config);

    return this.uploadFilesSequentially(fileMappings);
  }

  companyBuisness(): Observable<boolean> {

    const config = [
      { key: 'businessLicencePhoto', mapping: 'bizLicensePhoto' }
    ];

    const fileMappings = this.buildFileMappings(config);

    return this.uploadFilesSequentially(fileMappings);
  }


  addressProof(): Observable<boolean> {

    const config = [
      { key: 'addressProof', mapping: 'addressProofPhoto' }
    ];

    const fileMappings = this.buildFileMappings(config);

    return this.uploadFilesSequentially(fileMappings);
  }


  uploadAdditionalDocuments(): Observable<boolean> {

    if (!this.otherDocArray?.length) return of(true);

    // if reKYc, upload only changed documents
    const docs = !this.kycData
      ? this.otherDocArray
      : this.otherDocArray.filter((doc: any) => doc?.changed === true);

    if (!docs.length) return of(true);

    return of(...docs).pipe(
      concatMap((file: any) =>
        this.corporate.submitCorporateKYCFiles(this.corporateId, 'otherDocs', file).pipe(
          map((response: any) => response?.responseCode === 200),
          catchError(error => {
            console.error(`Other doc upload error`, error);
            return of(false);
          })
        )
      ),
      toArray(),
      map(results => results.every(success => success))
    );
  }

  public MultipleDocUpload(): void {
    if (this.kycData) {
      if (this.selectedFiles.length > 0) {
        from(this.selectedFiles).pipe(
          concatMap(file =>
            this.corporate.submitCorporateKYCFiles(this.corporateId, "otherDocs", file)
              .pipe(
                catchError(error => {
                  console.error('Error uploading file:', file.name, error);
                  throw error; // Continue with the next file
                })
              )
          )
        ).subscribe(
          (response) => {
            console.log('File uploaded successfully:', response);
          },
          (error) => {
            console.error('Error in file uploads:', error);
          },
          () => {
            console.log('All files processed.');
          }
        );
      } else {
        console.log('No files to upload');
      }
    } else {
      if (this.selectedFiles.length > 0) {
        from(this.selectedFiles).pipe(
          concatMap(file =>
            this.corporate.submitCorporateKYCFiles(this.corporateId, "otherDocs", file)
              .pipe(
                catchError(error => {
                  console.error('Error uploading file:', file.name, error);
                  throw error; // Continue with the next file
                })
              )
          )
        ).subscribe(
          (response) => {
            console.log('File uploaded successfully:', response);
          },
          (error) => {
            console.error('Error in file uploads:', error);
          },
          () => {
            console.log('All files processed.');
          }
        );
      } else {
        console.log('No files to upload');
      }
    }
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
                item.usertype === 'CORPORATE'
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


  selectedFiles: File[] = [];

  // Detect and add multiple files to selectedFiles without uploading
  public detectFilesMultipleDocs(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const files: FileList = input.files;

      // Only add new files that aren't already in selectedFiles
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExists = this.selectedFiles.some(
          existingFile => existingFile.name === file.name && existingFile.size === file.size
        );

        if (!fileExists) {
          this.selectedFiles.push(file); // Add only unique files
          this.otherDocsEdited = true;
          this.tabSaveCompleted['Other Documents (Optional)'] = false;
        }
      }
    }
  }
  public triggerFileInput(): void {
    document.getElementById('multipleDocs')?.click();
  }
  deleteFile(index: number, kycType?: 'CORPORATE' | 'NGO' | 'GOVT_AGENCY' | 'UN_AGENCY'): void {
    // Get the full file URL from fileLists
    const fileUrl = this.addtionalDocs[0][index];
    console.log(fileUrl);

    // Extract only the part of the path after "/kyc/static/"
    const photoId = fileUrl.split('/kyc/static/').pop(); // Gets "160/1731656339720.jpg"

    if (photoId) {
      // Call the API to delete the specific file using only the extracted part
      let req = {
        "otherDocs": [
          photoId,
        ]
      }
      const deleteApiMap: Record<string, () => Observable<any>> = {
        CORPORATE: () =>
          this.corporate.deleteMasterAgentMultipleDoc(req, this.corporateId),

        NGO: () =>
          this.corporate.deleteNGOMultipleDoc(req, this.corporateId),

        GOVT_AGENCY: () =>
          this.corporate.deleteUnGovtAgencyMultipleDoc(req, this.corporateId),

        UN_AGENCY: () =>
          this.corporate.deleteUnGovtAgencyMultipleDoc(req, this.corporateId)
      };

      const deleteApiFn = deleteApiMap[this.kycData?.kycType];

      if (!deleteApiFn) {
        console.error('Unsupported KYC type:', this.kycData?.kycType);
        return;
      }

      deleteApiFn().subscribe({
        next: (data: any) => {
          if (data?.responseCode === 200) {
            alert('File deleted successfully');
            this.addtionalDocs[0].splice(index, 1);
          } else {
            alert('Error deleting file');
          }
        },
        error: () => alert('Error deleting file')
      });
      
    }
  }

  signatoryCopy(event: any, index: number): void {
    const shareholder = this.shareHoldersFormArray.at(index) as FormGroup;
    const authorized = this.authorizedSignatoryFormArray.at(index) as FormGroup;

    if (event.target.checked) {
      // Set values from Shareholder to Authorized Signatory
      authorized.patchValue({
        authorizedFirstName: shareholder.get('shareholderFirstName')?.value,
        authorizedLastName: shareholder.get('shareholderLastName')?.value,
        authorizedtazkiraNo: shareholder.get('shareholdertazkiraNo')?.value,
        authorizedDOB: shareholder.get('shareholderDOB')?.value,
        authorizedPlaceofBirth: shareholder.get('shareholderPlaceofBirth')?.value,
        authorizedNationality: shareholder.get('shareholderNationality')?.value,
        authorizedlocation: shareholder.get('shareholderCurrentlocation')?.value,
        authorizedMonthlyIncome: shareholder.get('shareholderMonthlyIncome')?.value,
        authorizedSourceofIncome: shareholder.get('shareholdingOtherSource')?.value,
        authorizedPhone: shareholder.get('shareholderPhone')?.value
      });
      shareholder.patchValue({ isSignatory: true });
    } else {
      // Reset the values if unchecked
      authorized.reset();
      shareholder.patchValue({ isSignatory: false });
    }
  }
  isCheckboxChecked(index: number): boolean {
    const shareholder = this.shareHoldersFormArray.at(index) as FormGroup;
    return !!shareholder.get('isSignatory')?.value;
  }
  disableCheckbox(index: number): boolean {
    const shareholder = this.shareHoldersFormArray.at(index) as FormGroup;
    // Example condition: Disable if 'shareholderFirstName' is empty
    return !shareholder.get('shareholderFirstName')?.value || !shareholder.get('shareholderLastName')?.value
      || !shareholder.get('shareholdertazkiraNo')?.value || !shareholder.get('shareholderDOB')?.value
      || !shareholder.get('shareholderPlaceofBirth')?.value || !shareholder.get('shareholderNationality')?.value
      || !shareholder.get('shareholderCurrentlocation')?.value || !shareholder.get('shareholderMonthlyIncome')?.value
      || !shareholder.get('shareholdingOtherSource')?.value || !shareholder.get('shareholderPhone')?.value
  }
  /* getProvinceValue(): string {
    return this.showProOrgText ? this.corporateForm.get('provinceText')?.value : this.corporateForm.get('province')?.value;
  }
  getDistrictValue(): string {
    return this.showDisOrgText ? this.corporateForm.get('districtText')?.value : this.corporateForm.get('district')?.value;
  } */
  //
  /* getProvinceCurValue(): string {
    return this.showCurProText ? this.corporateForm.get('provinceTextCur')?.value : this.corporateForm.get('provinceAddress')?.value;
  }
  getDistrictCurValue(): string {
    return this.showCurDisText ? this.corporateForm.get('districtTextCur')?.value : this.corporateForm.get('districtAddress')?.value;
  }
  //
  getProvincePerValue(): string {
    return this.showPerProText ? this.corporateForm.get('provinceTextPer')?.value : this.corporateForm.get('permanentProvince')?.value;
  }
  getDistrictPerValue(): string {
    return this.showPerDisText ? this.corporateForm.get('districtTextPer')?.value : this.corporateForm.get('permanentDistrict')?.value;
  }
  //
  getProvinceViceCurValue(): string {
    return this.showViceCurProText ? this.corporateForm.get('provinceTextViceCur')?.value : this.corporateForm.get('ViceprovinceAddress')?.value;
  }
  getDistrictViceCurValue(): string {
    return this.showViceCurDisText ? this.corporateForm.get('districtTextViceCur')?.value : this.corporateForm.get('VicedistrictAddress')?.value;
  }
  //
  getProvinceVicePerValue(): string {
    return this.showVicePerProText ? this.corporateForm.get('provinceTextVicePer')?.value : this.corporateForm.get('VicepermanentProvince')?.value;
  }
  getDistrictVicePerValue(): string {
    return this.showVicePerDisText ? this.corporateForm.get('districtTextVicePer')?.value : this.corporateForm.get('VicepermanentDistrict')?.value;
  } */
  /* submit() {
  
  
    
      
    }
    
  
    this.corporate.submitCorporateRegister(req).subscribe((data: any) => {
      this.photoId = data?.data
      console.log(photoId, this.photoId);
  
      if (data?.responseCode == 200) {
        alert(success)
      }
      else {
        alert(failed)
      }
      
  
      this.corporate.addSuperAgentPhoto(this.uploadedImage, superPhoto_img_0, this.photoId).subscribe((data: any) => {
        if (data?.responseCode == 200) {
          this.corporate.addSuperAgentSign(this.uploadedImagePres, prezSign_img_1, this.photoId).subscribe((data: any) => {
            if (data?.responseCode == 200) {
              this.corporate.addSuperAgentSign(this.uploadedImageVice, vicePrezSign_img_1, this.photoId).subscribe((data: any) => {
                if (data?.responseCode == 200) {
                  alert(File Upload success)
                 
                }
              })
            }
          })
        }
      })
  
    })
  } */
  ngOnDestroy() {
    this.kycData = null;
    console.log("Destroyed KYC data");
  }
}
