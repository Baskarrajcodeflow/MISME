import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CorporateService } from '../corporate.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { from, concatMap, of, Observable, map, catchError, toArray, forkJoin, firstValueFrom, debounceTime, distinctUntilChanged } from 'rxjs';
import { CurrencyFormatPipe } from '../../pipe/currency-format.pipe';
import { SharedFunctionsService } from '../../shared-functions.service';
import { KycModuleService } from '../../kyc/kyc/kyc-module.service';
import { DataSharingService } from '../../product/dataSharing/data-sharing.service';

@Component({
  selector: 'app-create-master-agent',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, ReactiveFormsModule, FormsModule],
  templateUrl: './create-master-agent.component.html',
  styleUrl: './create-master-agent.component.css'
})
export class CreateMasterAgentComponent {
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
  showSharePass: boolean = false;
  isLoading: boolean = false;
  basicDetailsForm!: FormGroup<{ corporteFirstName: FormControl<string | null>; corporteLastName: FormControl<string | null>; corporateEmail: FormControl<string | null>; corporatePhone: FormControl<string | null>; corporatePassword: FormControl<string | null>;province: FormControl<string | null>; }>;
  companyDetailsForm!: FormGroup<{ companyName: FormControl<string | null>; contactPersonName: FormControl<string | null>; contactpersonDesignation: FormControl<string | null>; shareholderCount: FormControl<any>; purposeofAccount: FormControl<string | null>; purposeofAccountOther: FormControl<string | null>; }>; //authorizedSignatoryCount: FormControl<any>;
  businessLicenceDetailsForm!: FormGroup<{ licenceNumber: FormControl<string | null>; licenceIssueAuthority: FormControl<string | null>; dateofIssue: FormControl<string | null>; dateofExpiry: FormControl<string | null>; tinNumber: FormControl<string | null>; }>;
  businessActivityDetailsForm!: FormGroup<{ businessName: FormControl<string | null>; natureofBusiness: FormControl<string | null>; monthlyIncome: FormControl<string | null>; netWorth: FormControl<string | null>; sourceofFund: FormControl<string | null>; monthlyTurnover: FormControl<string | null>; }>;
  companyAddressDetailsForm!: FormGroup<{ location: FormControl<string | null>; streetNumber: FormControl<string | null>; houseNumber: FormControl<string | null>; district: FormControl<string | null>; province: FormControl<string | null>; country: FormControl<string | null>; officePhone: FormControl<string | null>; officeEmail: FormControl<string | null>; }>;
  shareHolderDetailsForm !: FormGroup;
  authorizedDetailsForm !: FormGroup;
  passwordMatch!: boolean;
  //attachmentsList : any[] =[];
  attachedFiles: { [key: string]: File } = {};
  natureofBusinesses: any;
  mapping!: string;
  file1: any;
  fileName!: string;
  userId: any;
  file2!: File;
  file3 !: File;
  file4!: File;
  file5!: File;
  file6!: File;
  file7!: File;
  file8!: File;
  file9!: File;
  mapping2: any;
  mapping3: any;
  mapping4: any;
  mapping5: any;
  mapping6: any;
  mapping7: any;
  mapping8: any;
  mapping9: any;
  mapping1: any;
  masterAgentId: any
  shareHolderId: any;
  shareholderImgCount: any;
  shareholderCount1: any;
  registerResponse: any;
  isPasswordVisible: boolean = false;
  natureOfBuisness: any;
  companyPTID: any;
  newdata: any;
  submittedForUpdateUserId: any;
  profile!: File
  addtionalDocs: any[] = []
  errorMessages: { [key: string]: string } = {};
  public passError: string | null = null;
  registerResponseSignatory: any;
  signatoryCount: number = 2;
  purposeOfAccount: any;
  accPurpose: any;
  constructor(private corporate: CorporateService,
    private fb: FormBuilder,
    private sharedFunctionsServic: SharedFunctionsService,
    private router: Router, private currencyFormatPipe: CurrencyFormatPipe,
    private kycModuleService: KycModuleService,
    private service: DataSharingService,
    private cdr: ChangeDetectorRef
  ) {
    //  this.newdata = this.kycModuleService.getItem()
    this.service.masteragentDataService$.subscribe((res) => {
      this.newdata = res
      console.log(this.newdata, 'New Dat');
      let addDoc = this.newdata?.masterAgentKyc?.otherDocs.split(',')
      this.addtionalDocs.push(addDoc)
      console.log(...this.addtionalDocs, 'otherDoc');

    })

  }
  showShareTaskira: boolean = false;

  onFileSelectedForProfile(event: any, fieldName: string) {
    const input = event.target as HTMLInputElement;

    if (input?.files?.length) {
      const file = input.files[0];
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];

      if (!validTypes.includes(file.type)) {
        console.warn('Invalid file type selected:', file.type);
        this.errorMessages[fieldName] = 'Invalid file type. Please select a valid image';
        input.value = ''; // Clear the input field
      } else {
        console.log('Valid file selected:', file.name);
        this.errorMessages[fieldName] = ''; // Clear error message for the field
      }
    }
  }
  shareTaskiraType: any;

  onChangeShareTaskiraType($event: any) {
    this.shareTaskiraType = $event.target.value;
    const shareHoldersArray = this.shareHolderDetailsForm.get('shareHolders') as FormArray;

    shareHoldersArray.controls.forEach((group: AbstractControl) => {
      if (group instanceof FormGroup) {
        // Correctly retrieve FormControl instances
        const tazkiraControl = group.get('shareholdertazkiraNo') as FormControl;
        const passportControl = group.get('shareholderPassNo') as FormControl;

        if (this.shareTaskiraType == "E_TAZKIRA") {

          this.showSharePass = false;
          this.showShareTaskira = true;

          tazkiraControl.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);
          passportControl.clearValidators();
          passportControl.setValue('');
        }
        else if (this.shareTaskiraType == "PASSPORT") {

          this.showSharePass = true;
          this.showShareTaskira = false;

          passportControl.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9 !@#$%^&*()_+=\\-\\[\\]{};:"\'|,.<>?/]*$')]);
          tazkiraControl.clearValidators();
          tazkiraControl.setValue('');
        }
        else {
          this.showShareTaskira = false;
          this.showSharePass = false;
        }
        // Ensure changes reflect immediately
        tazkiraControl.updateValueAndValidity();
        passportControl.updateValueAndValidity();
      }
    });
  }
  onKeyPressNumbersOnly(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow only numbers (0-9), block everything else
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }

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




  ngOnInit(): void {
    if (!this.newdata) {
      this.formTabs = ['Basic Info',
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
    }
    else {
      this.formTabs = [
        'Company Details',
        'Company Business License Details',
        'Company Business Activities',
        'Company Address',
        'Company Shareholder Details',
        'Authorized Signatory Details',
        'Other Documents (Optional)',
        'Final Submission'
      ]
      this.tab = 'Company Details';
    }

    this.getCountries();
    this.getDistricts
    this.getProvinces();
    this.getNatureofBusiness();
    this.getAccPurpose();




    this.basicDetailsForm = this.fb.group({
      corporteFirstName: ['', Validators.required],
      corporteLastName: ['', Validators.required],
      corporateEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      corporatePhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      //gender: ['',Validators.required],
      // corporateUserName: ['', Validators.required],
      // corporatePassword: ['', Validators.required],
      corporatePassword: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[0-9]*$')]],
      province: ['', Validators.required]
    })

    this.companyDetailsForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]], // Alphanumeric
      contactPersonName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]], // Alphanumeric
      contactpersonDesignation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      shareholderCount: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Strictly Numerical
      purposeofAccount: ['', Validators.required],
      purposeofAccountOther: ['']
      
      /*  authorizedSignatoryCount: ['', [Validators.required, Validators.pattern('^[2-9]+$')]],  */


      //contactPersonTazkiraPhoto: ['',Validators.required],
      //contactPersonSign: ['',Validators.required],
    });

    this.businessLicenceDetailsForm = this.fb.group({
      licenceNumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      licenceIssueAuthority: ['', [Validators.required]], // Strictly Numerical
      dateofIssue: ['', [Validators.required, this.sharedFunctionsServic.pastDateValidator()]], // Date
      dateofExpiry: ['', [Validators.required, this.sharedFunctionsServic.futureDateValidator()]], // Date
      tinNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Strictly Numerical
      //businessLicencePhoto: ['', Validators.required]
    })

    this.businessActivityDetailsForm = this.fb.group({
      businessName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]], // Alphanumeric
      natureofBusiness: ['', Validators.required],
      monthlyIncome: ['', Validators.required], // Strictly Numerical
      netWorth: ['', Validators.required,], // Strictly Numerical
      sourceofFund: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric 
      monthlyTurnover: ['', Validators.required,], // Strictly Numerical
    })

    this.companyAddressDetailsForm = this.fb.group({
      location: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9  -,+.]+$')]], // Alphanumeric
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


    if (this.newdata) {
      //
      const shareholders = this.newdata?.masterAgentKyc?.shareholders || [];
      const formArray = this.shareHolderDetailsForm.get('shareHolders') as FormArray;
      formArray.clear();
      shareholders.forEach((sh: any) => {
        formArray.push(this.fb.group({
          shareholderFirstName: [sh.firstName],
          shareholderFatherName: [sh.fatherName],
          shareholderDOB: [sh.dob],
          shareholderNationality: [sh.nationality],
          shareholdingPercentage: [sh.shareholdingPercentage],
          shareholderRelationship: [sh.relationship],
          shareholderPhone: [sh.phone],
          shareholderLastName: [sh.lastName],
          shareholderPlaceofBirth: [sh.placeOfBirth],
          shareholderMonthlyIncome: [sh.monthlyIncome],
          shareholdingOtherSource: [sh.sourceOfIncome],
          shareholderTin: [sh.tinNumber],
          shareholderTazkiraPhotoFront: [sh.idProofFrontPhoto],
          shareholderTazkiraPhotoBack: [sh.idProofBackPhoto],
          shareholderIdProofType: [
            sh.idProofType === 'E_TAZKIRA' ? 'TAZKIRA' : sh.idProofType
          ],
          shareholdertazkiraNo: [
            sh.idProofType === 'E_TAZKIRA' ? sh.idProofNumber : null
          ],
          shareholderPassNo: [
            sh.idProofType === 'PASSPORT' ? sh.idProofNumber : null
          ],
          shareholderCurrentlocation: [sh.currLocation],
          shareholderCurrentCountry: [sh.currCountry],
          shareholderCurrentProvince: [sh.currProvince],
          shareholderCurrentDistrict: [sh.currentDistrict],
          // this.fixDistrict
          shareholderPermanantCountry: [sh.permCountry],
          shareholderPermanantProvince: [sh.permProvince],
          shareholderPermanantDistrict: [sh.permDistrict],
        }));
      });

      if(this.newdata?.masterAgentKyc?.signatories.length > 0){
        const signatories = this.newdata?.masterAgentKyc?.signatories || [];
        const formArraySg = this.authorizedDetailsForm.get('authorizedSignatories') as FormArray;
        formArraySg.clear();
        signatories.forEach((sg: any) => {
          formArraySg.push(
            this.fb.group({
              authorizedFirstName: [sg.firstName],
              authorizedLastName: [sg.lastName],
              authorizedDOB: [sg.dob],
              authorizedNationality: [sg.nationality],
              authorizedDesignation: [sg.designation],
              authorizedPhone: [sg.phone],
              authorizedEmail: [sg.email],
              authUsername: [sg.username],
              authorizedIdProofType: [sg.idProofType === 'E_TAZKIRA' ? '1'
                : sg.idProofType === 'PASSPORT' ? '2'
                  : ''],
              authorizedtazkiraNo: [sg.idProofType === 'E_TAZKIRA' ? sg.idProofNumber : null],
              authorizedPassNo: [sg.idProofType === 'PASSPORT' ? sg.idProofNumber : null],
  
              authorizedPlaceofBirth: [sg.placeOfBirth],
              authorizedMonthlyIncome: [sg.monthlyIncome],
              authorizedSourceofIncome: [sg.sourceOfIncome],
              authorizedlocation: [sg.residentAddress],
              authorizedType: [sg.signatoryType],
  
              authorizedPhoto: [sg.signatoryPhoto],
              authorizedzkiraPhotoFront: [sg.idProofFrontPhoto],
              authorizedzkiraPhotoBack: [sg.idProofBackPhoto],
              authorizedSign: [sg.signaturePhoto],
  
              roleMaker: [sg.makerChecker === 'MAKER'],
              roleChecker: [sg.makerChecker === 'CHECKER']
            })
          );
        });
      }
      //
      // this.getProvinces()
      this.submittedForUpdateUserId = this.newdata?.submittedFor?.id
      this.basicDetailsForm.controls['corporteFirstName'].setValue(this.newdata?.submittedFor?.firstName || '');
      this.basicDetailsForm.controls['corporteLastName'].setValue(this.newdata?.submittedFor?.lastName || '');
      this.basicDetailsForm.controls['corporateEmail'].setValue(this.newdata?.submittedFor?.email || '');
      this.basicDetailsForm.controls['corporatePhone'].setValue(this.newdata?.submittedFor?.phone || '');
      // this.basicDetailsForm.controls['corporateUserName'].setValue(this.newdata?.submittedFor?.email || '');

      this.companyDetailsForm.controls['companyName'].setValue(this.newdata?.masterAgentKyc?.companyName || '');
      this.companyDetailsForm.controls['contactPersonName'].setValue(this.newdata?.masterAgentKyc?.contactPersonName || '');
      this.companyDetailsForm.controls['contactpersonDesignation'].setValue(this.newdata?.masterAgentKyc?.contactPersonDesignation || '');
      this.companyDetailsForm.controls['shareholderCount'].setValue(this.newdata?.masterAgentKyc?.companyNoOfShareholders || '');
      // this.companyDetailsForm.controls['purposeofAccount'].setValue(this.newdata?.masterAgentKyc?.purposeOfAcc || '');
      // this.patchPurpose(this.newdata?.masterAgentKyc?.purposeOfAcc || '');
      this.companyPTID = (this.newdata?.masterAgentKyc?.companyPTID || '');

      this.businessLicenceDetailsForm.controls['dateofExpiry'].setValue(this.newdata?.masterAgentKyc?.bizLicenseDateOfExpiry || '');
      this.businessLicenceDetailsForm.controls['dateofIssue'].setValue(this.newdata?.masterAgentKyc?.bizLicenseDateOfIssue || '');
      this.businessLicenceDetailsForm.controls['licenceIssueAuthority'].setValue(this.newdata?.masterAgentKyc?.bizLicenseAuthority || '');
      this.businessLicenceDetailsForm.controls['licenceNumber'].setValue(this.newdata?.masterAgentKyc?.bizLicenseNumber || '');
      this.businessLicenceDetailsForm.controls['tinNumber'].setValue(this.newdata?.masterAgentKyc?.bizLicenseTinNumber || '');

      this.businessActivityDetailsForm.controls['businessName'].setValue(this.newdata?.masterAgentKyc?.bizName || '');
      this.businessActivityDetailsForm.controls['monthlyIncome'].setValue(this.newdata?.masterAgentKyc?.monthlyIncome || '');
      this.businessActivityDetailsForm.controls['monthlyTurnover'].setValue(this.newdata?.masterAgentKyc?.monthlyTurnover || '');
      this.businessActivityDetailsForm.controls['natureofBusiness'].setValue(this.newdata?.masterAgentKyc?.natureOfBiz || '');
      this.businessActivityDetailsForm.controls['netWorth'].setValue(this.newdata?.masterAgentKyc?.netWorth || '');
      this.businessActivityDetailsForm.controls['sourceofFund'].setValue(this.newdata?.masterAgentKyc?.sourceOfFund || '');

      this.companyAddressDetailsForm.controls['country'].setValue(this.newdata?.masterAgentKyc?.companyCountry || '');
      this.companyAddressDetailsForm.controls['district'].setValue(this.newdata?.masterAgentKyc?.companyDistrict || '');
      this.companyAddressDetailsForm.controls['houseNumber'].setValue(this.newdata?.masterAgentKyc?.companyHouseNumber || '');
      this.companyAddressDetailsForm.controls['location'].setValue(this.newdata?.masterAgentKyc?.companyLocation || '');
      this.companyAddressDetailsForm.controls['officeEmail'].setValue(this.newdata?.masterAgentKyc?.companyEmail || '');
      this.companyAddressDetailsForm.controls['officePhone'].setValue(this.newdata?.masterAgentKyc?.companyOfficePhone || '');
      this.companyAddressDetailsForm.controls['province'].setValue(this.newdata?.masterAgentKyc?.companyProvince || '');
      this.companyAddressDetailsForm.controls['streetNumber'].setValue(this.newdata?.masterAgentKyc?.companyStreet || '');



      if (this.newdata?.masterAgentKyc?.signatories.length != 0) {
        const authorizedSignatoriesArray = this.authorizedDetailsForm.get('authorizedSignatories') as FormArray;
        authorizedSignatoriesArray.clear(); // Clear existing values if needed

        this.newdata?.masterAgentKyc?.signatories
          ?.forEach((signatory: any) => {
            console.log(signatory, 'asdadsdsad sadasd');

            const signatoryGroup = this.fb.group({
              authorizedFirstName: [signatory.firstName || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
              authorizedLastName: [signatory.lastName || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
              authorizedEmail: [signatory.email || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
              authorizedtazkiraNo: [signatory.idProofNumber || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
              authorizedDOB: [signatory.dob || '', [Validators.required, this.sharedFunctionsServic.ageValidator()]],
              authorizedPlaceofBirth: [signatory.placeOfBirth || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
              authorizedNationality: [signatory.nationality || '', [Validators.required]],
              authUsername: [signatory.username],
              authorizedDesignation: [signatory.designation || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
              authorizedlocation: [signatory.residentAddress || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9  -,+.]+$')]],
              authorizedMonthlyIncome: [signatory.monthlyIncome || '', Validators.required],
              authorizedSourceofIncome: [signatory.sourceOfIncome || '', [Validators.pattern('^[a-zA-Z0-9 ]+$')]],
              authorizedPhone: [signatory.phone || '', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
              authorizedType: [signatory.signatoryType || '', Validators.required],
              roleMaker: [signatory.makerChecker === 'MAKER', Validators.required],
              roleChecker: [signatory.makerChecker === 'CHECKER', Validators.required]
            });

            authorizedSignatoriesArray.push(signatoryGroup);
          });
      }

      console.log(this.newdata?.masterAgentKyc?.shareholders.length, 'this.newdata?.masterAgentKyc?.shareholders.length');
      console.log(this.newdata?.masterAgentKyc?.signatories.length, 'this.newdata?.masterAgentKyc?.signatories.length');


      if (this.newdata?.masterAgentKyc?.shareholders.length != 0) {
        const shareHolders = this.shareHolderDetailsForm.get('shareHolders') as FormArray;
        shareHolders.clear(); // Clear existing values if needed

        this.newdata?.masterAgentKyc?.shareholders
          ?.forEach((signatory: any, index: number) => {
            console.log(signatory, 'asdadsdsad sadasd');

            const shareHoldersGroup = this.fb.group({
              shareholderFirstName: [signatory.firstName || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
              shareholderLastName: [signatory.lastName || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
              shareholderFatherName: [signatory.fatherName || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
              shareholdertazkiraNo: [signatory.idProofNumber || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
              shareholderDOB: [signatory.dob || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
              shareholderPlaceofBirth: [signatory.placeOfBirth || '', [Validators.required, this.sharedFunctionsServic.ageValidator()]],
              shareholderNationality: [signatory.nationality || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
              shareholderMonthlyIncome: [signatory.monthlyIncome || '', [Validators.required]],
              shareholdingPercentage: [signatory.shareholdingPercentage || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
              shareholdingOtherSource: [signatory.sourceOfIncome || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
              shareholderRelationship: [signatory.relationship || '', Validators.required],
              shareholderPhone: [signatory.phone || '', [Validators.pattern('^[a-zA-Z0-9 ]+$')]],
              shareholderTin: [signatory.tinNumber || '', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
              shareholderCurrentlocation: [signatory.currLocation || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9  -,+.]+$')]],
              shareholderCurrentDistrict: [signatory.currDistrict || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
              shareholderCurrentProvince: [signatory.currProvince || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
              shareholderPermanantDistrict: [signatory.permDistrict || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
              shareholderCurrentCountry: [signatory.currCountry || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
              shareholderPermanantProvince: [signatory.permProvince || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
              shareholderPermanantCountry: [signatory.permCountry || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
              shareholderType: [signatory.idProofType || '', [Validators.required]],


            });

            shareHolders.push(shareHoldersGroup);
            if (signatory?.idProofType == 'E_TAZKIRA') {
              this.showSharePass = false;
              this.showShareTaskira = true;
            } else {
              this.showSharePass = true;
              this.showShareTaskira = false;
            }

            this.corporate.getprovinces().subscribe({
              next: (res: any) => {
                if (res?.responseCode === 200) {
                  let provinces = res.data;

                  const matchedProvince = this.provinces.find((p: any) => p.name === signatory.currProvince);

                  if (matchedProvince) {
                    this.corporate.getdistricts(matchedProvince.id).subscribe({
                      next: (districtRes: any) => {
                        this.currentDistricts = districtRes?.data || [];

                        // Patch the district value **after** district options are loaded
                        shareHoldersGroup.get('shareholderCurrentDistrict')?.setValue(signatory.currDistrict || '');
                      }
                    });
                  }
                }
              }
            });
            this.corporate.getprovinces().subscribe({
              next: (res: any) => {
                if (res?.responseCode === 200) {
                  let provinces = res.data;

                  const matchedProvince = this.provinces.find((p: any) => p.name === signatory.permProvince);

                  if (matchedProvince) {
                    this.corporate.getdistricts(matchedProvince.id).subscribe({
                      next: (districtRes: any) => {
                        this.districts = districtRes?.data || [];

                        // Patch the district value **after** district options are loaded
                        shareHoldersGroup.get('shareholderPermanantDistrict')?.setValue(signatory.permDistrict || '');
                      }
                    });
                  }
                }
              }
            });
          });
      }



      // Call this after patching form values for edit
      const selectedProvinceName = this.companyAddressDetailsForm.get('province')?.value;
      console.log(selectedProvinceName, 'province');
      this.corporate.getprovinces().subscribe({
        next: (data: any) => {
          if (data?.responseCode == 200) {
            let provinces = data?.data;
            console.log(provinces, 'provincess');
          }

          if (selectedProvinceName) {
            const matchedProvince = this.provinces.find((p: any) => p.name === selectedProvinceName)
            if (matchedProvince) {
              this.selectedProvinceName = matchedProvince.id;
              this.getDistricts(this.selectedProvinceName);

              // Optional: Set the selected district again after districts are loaded
              this.corporate.getdistricts(matchedProvince.id).subscribe({
                next: (data: any) => {
                  this.districts = data?.data;

                  const selectedDistrict: any = this.companyAddressDetailsForm.get('district')?.value;
                  // Re-set the value to trigger display in case it wasn't showing due to missing options
                  this.companyAddressDetailsForm.get('district')?.setValue(selectedDistrict);
                }
              });
            }
          }
          // console.log(data,'logData')

        }
      });

    }

    this.companyDetailsForm.valueChanges.subscribe(() => {
      this.savedTabs['Company Details'] = false
    });

    this.businessLicenceDetailsForm.valueChanges.subscribe(() => {
      this.savedTabs['Company Business License Details'] = false
    });

    this.businessActivityDetailsForm.valueChanges.subscribe(() => {
      this.savedTabs['Company Business Activities'] = false
    });

    this.companyAddressDetailsForm.valueChanges.subscribe(() => {
      this.savedTabs['Company Address'] = false
    });

    this.shareHolderDetailsForm.valueChanges.subscribe(() => {
      this.savedTabs['Company Shareholder Details'] = false
    });

    this.authorizedDetailsForm.valueChanges.subscribe(() => {
      this.savedTabs['Authorized Signatory Details'] = false
    });

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
      shareholderType: [''],
      shareholderCurrentlocation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9  -,+.]+$')]], // Alphanumeric
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



      return /^[0-9]+$/.test(control.value) ? true : { numeric: true };
    };


  }
  createAuthorizedSignatoryGroup(): FormGroup {
    const group = this.fb.group({
      authorizedFirstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]], // Alphanumeric
      authorizedLastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]], // Alphanumeric
      authorizedEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      authUsername: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+$'), Validators.minLength(9)]], // Email pattern
      authorizedtazkiraNo: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedDOB: ['', [Validators.required, this.sharedFunctionsServic.ageValidator()]], // Date
      authorizedPlaceofBirth: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedNationality: ['', [Validators.required]],
      authorizedDesignation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedlocation: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9  -,+.]+$')]], // Alphanumeric
      authorizedMonthlyIncome: ['', Validators.required],
      authorizedSourceofIncome: ['', [Validators.pattern('^[a-zA-Z0-9 ]+$')]], // Alphanumeric
      authorizedPhone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      authorizedType: ['', Validators.required],
      roleMaker: [false, Validators.required],
      roleChecker: [false, Validators.required],
    })

    this.attachUsernameValidation(group);

    return group;
  }
  showUsernameExist: boolean = false;

  attachUsernameValidation(group: FormGroup): void {
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

    for (let i = 0; i < this.signatoryCount; i++) {
      this.authorizedSignatoryFormArray.push(this.createAuthorizedSignatoryGroup());
    }
    console.log("Form - new", this.authorizedDetailsForm);

  }
  savedTabs: { [key: string]: boolean } = {};
  selectedTab(selected: string, i: number) {
    this.tab = selected;
    this.currentTab = this.formTabs.indexOf(this.tab);
    console.log(selected, '++++++++++++++++++_______________');

    // You can also set a global flag if needed
    // this.isAnySaveClicked = false;
  }
  onPasswordInput(event: Event): void {
    const password = (event.target as HTMLInputElement).value;
    if (password.length < 4) {
      this.passError = 'Password must be at least 4 characters.';
    } else {
      this.passError = null; // Clear the error if validation passes
    }
  }
  onKeyPressNoAlphabet(event: KeyboardEvent): void {
    const charCode = event.which || event.keyCode;
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {
      // Prevent input if the pressed key is an alphabet character (ASCII range: 65-90, 97-122)
      event.preventDefault();
    }
  }
  sanitizeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Replace all non-alphanumeric characters with an empty string
    input.value = input.value.replace(/[^a-zA-Z0-9]/g, '');

    // Update the form control value to match the sanitized input
    this.shareHolderDetailsForm.get('shareholdertazkiraNo')?.setValue(input.value);
    this.basicDetailsForm.get('corporatePassword')?.setValue(input.value);

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
  isAnySaveClicked: any;
  formCompleted(section: string) {
    if (section === 'Basic Info') {
      // console.log(true);
      // console.log(this.basicDetailsForm.valid);
      return this.basicDetailsForm.valid;
    } else if (section === 'Company Details') {
      console.log(this.companyDetailsForm.valid);
      return this.companyDetailsForm.valid &&
        Object.keys(this.attachedFiles).includes('articleOfAssociationPhoto');
    } else if (section === 'Company Business License Details') {
      return this.businessLicenceDetailsForm.valid && Object.keys(this.attachedFiles).includes('businessLicencePhoto');
    } else if (section === 'Company Business Activities') {
      return this.businessActivityDetailsForm.valid &&
        Object.keys(this.attachedFiles).includes('companyTINLetterPhoto') &&
        Object.keys(this.attachedFiles).includes('taxClearanceLetterPhoto');
    } else if (section === 'Company Address') {
      return this.companyAddressDetailsForm.valid && Object.keys(this.attachedFiles).includes('addressProof');
    } else if (section === 'Authorized Signatory Details') {
      const isFormValid = this.authorizedDetailsForm.valid;
      const allFilesUploaded = this.authorizedSignatoryFormArray.controls.every((_, i) =>
        Object.keys(this.attachedFiles).includes(`authorizedPhoto${i}`) &&
        Object.keys(this.attachedFiles).includes(`authorizedSign${i}`) &&
        Object.keys(this.attachedFiles).includes(`authorizedzkiraPhoto${i}`) &&
        Object.keys(this.attachedFiles).includes(`authorizedzkiraPhotoBack${i}`) &&
        Object.keys(this.attachedFiles).includes(`authorizedLetter${i}`)
      );
      console.log(isFormValid, allFilesUploaded,)
      return isFormValid && allFilesUploaded;
    } else if (section === 'Company Shareholder Details') {
      console.log(this.shareHolderDetailsForm);
      const isFormValid = this.shareHolderDetailsForm.valid;
      const allFilesUploaded = this.shareHoldersFormArray.controls.every((_, i) =>
        Object.keys(this.attachedFiles).includes(`shareholderTazkiraPhoto${i}`) &&
        Object.keys(this.attachedFiles).includes(`shareholderTazkiraPhotoBack${i}`)

      );
      return isFormValid && allFilesUploaded;
    } else if (section === 'Other Documents (Optional)') {
      console.log(this.shareHolderDetailsForm);
      return this.selectedFiles?.length != 0
    }
    else {
      return false;
    }
  }
  requiredTabs: string[] = [
    'Company Details',
    'Company Business License Details',
    'Company Business Activities',
    'Company Address',
    'Authorized Signatory Details',
    'Company Shareholder Details'
  ];
  allFormsSaved(): boolean {
    return this.requiredTabs.every(tab => this.savedTabs[tab]);
  }

  allFormsCompleted(): boolean {
    return this.formCompleted('Basic Info') &&
      this.formCompleted('Company Details') &&
      this.formCompleted('Company Business License Details') &&
      this.formCompleted('Company Business Activities') &&
      this.formCompleted('Company Address') &&
      this.formCompleted('Authorized Signatory Details') &&
      this.formCompleted('Company Shareholder Details') &&
      Object.keys(this.attachedFiles).includes('opnSignature');
  }

  allDocumentsAttached() {
    if (
      // Object.keys(this.attachedFiles).includes('contactPersonTazkiraPhoto') &&
      // Object.keys(this.attachedFiles).includes('contactPersonSign') &&
      Object.keys(this.attachedFiles).includes('articleOfAssociationPhoto') &&
      Object.keys(this.attachedFiles).includes('taxClearanceLetterPhoto') &&
      Object.keys(this.attachedFiles).includes('companyTINLetterPhoto') &&
      Object.keys(this.attachedFiles).includes('businessLicencePhoto') &&
      Object.keys(this.attachedFiles).includes('addressProof') &&
      //Object.keys(this.attachedFiles).includes('shareholderTazkiraPhoto') &&
      Object.keys(this.attachedFiles).includes('authorizedzkiraPhoto') &&
      Object.keys(this.attachedFiles).includes('authorizedzkiraPhotoBack') &&
      Object.keys(this.attachedFiles).includes('authorizedSign') &&
      Object.keys(this.attachedFiles).includes('authorizedLetter') && this.allshareholderDocsAttached()) {

      return true;

    }
    else
      return false;
  }

  allshareholderDocsAttached() {
    for (let i = 0; i < this.companyDetailsForm.controls['shareholderCount'].value; i++) {
      if (!(Object.keys(this.attachedFiles).includes('shareholderTazkiraPhoto' + i))) {
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
        }
      }
    }
  }
  public triggerFileInput(): void {
    document.getElementById('multipleDocs')?.click();
  }
  public removeFile(index: number): void {
    this.selectedFiles.splice(index, 1); // Remove file from selectedFiles array
  }

  // Function to upload all files in selectedFiles
  public MultipleDocUpload(): void {
    if (this.newdata) {
      if (this.selectedFiles.length > 0) {
        from(this.selectedFiles).pipe(
          concatMap(file =>
            this.corporate.addMasterAgentMultipleDoc(file, "otherDocs", this.submittedForUpdateUserId)
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
            this.corporate.addMasterAgentMultipleDoc(file, "otherDocs", this.masterAgentId)
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
  submitKYCForm() {
    this.isLoading = true;
    if (this.newdata) {
      let request = this.createUpdatePayload();
    } else {
      let request = this.createPayload();
    }
  }
  error: boolean = false;

  save(tab: string) {
    if (tab == 'Basic Info') {
      this.registerMaster();
    }
    else {

      this.updateMaster(tab);
    }
  }

  registerMaster() {
    this.savedTabs['Basic Info'] = true;
    this.cdr.detectChanges();
    const reqBasic = {
      email: this.basicDetailsForm.controls['corporateEmail'].value,
      username: this.basicDetailsForm.controls['corporateEmail'].value,
      firstName: this.basicDetailsForm.controls['corporteFirstName'].value,
      lastName: this.basicDetailsForm.controls['corporteLastName'].value,
      phone: this.basicDetailsForm.controls['corporatePhone'].value,
      userType: 'AGENT',
      agentType: 'MASTER_AGENT',
      gender: 'MALE',
      password: this.basicDetailsForm.controls['corporatePassword'].value,
      currProvince: this.basicDetailsForm.controls['province'].value,
    };
    this.corporate.submitMasterAgentRegister(reqBasic).subscribe((data: any) => {
      if (data.responseCode == 200) {
        this.masterAgentId = data.data;
        if (this.masterAgentId) {

          const corpReq = {
            kycInputs: {
              companyName: this.companyDetailsForm.controls['companyName'].value,
              //companyWalletNumber: this.companyDetailsForm.controls['mmwalletNumber'].value,
              companyAccOpenDate: this.currentDate,
              contactPersonName: this.companyDetailsForm.controls['contactPersonName'].value,
              contactPersonDesignation: this.companyDetailsForm.controls['contactpersonDesignation'].value,
              // companyNoOfShareholders: parseInt(this.companyDetailsForm.controls['shareholderCount'].value),

              /*  bizLicenseNumber: this.businessLicenceDetailsForm.controls['licenceNumber'].value,
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
*/


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
            kycType: "SUPER_AGENT",
            submittedFor: this.masterAgentId,
            kycInputs: corpReq
          }
          this.corporate.submitMasterAgentRegisterKYC(this.payloadForSubmitKYC).subscribe((data: any) => {
            if (data.responseCode == 200) {
              alert("Master Agent account basic registration completed, Please complete KYC");
            }
            else {
              this.error = true;
            }
          })



        }

        if (!this.masterAgentId) {
          alert("Master Agent Registration failed, please try again later");
        }
      }
      else {
        alert(data?.error)
        this.error = true;
      }
    })
    // if (this.error) {
    //   alert("Registration Failed, please try again");
    // }
    this.isLoading = false;

  }

  async uploadOperationSignature(): Promise<boolean> {
    try {
      if (this.newdata) {
        this.masterAgentId = this.submittedForUpdateUserId
      }
      const res: any = await firstValueFrom(
        this.corporate.submitmasterAgentKYCFiles(
          this.masterAgentId,
          'opsSignaturePhoto',
          this.attachedFiles['opnSignature']
        )
      );
      return res?.responseCode === 200;
    } catch (error) {
      return false;
    }
  }

  async completeCorporate() {
    if (this.newdata) {
      this.masterAgentId = this.submittedForUpdateUserId
    }
    this.isLoading = true;
    const fileUploaded = await this.uploadOperationSignature();
    if (fileUploaded) {
      this.corporate.completeMasterAgentRegisterKYC(this.masterAgentId).subscribe({
        next: (user: any) => {
          if (user) {
            this.isLoading = false;
            alert("KYC Submitted Successfully");
            this.router.navigate(["kyc/agent"]);
          }
        },
        error: () => {
          this.isLoading = false;
          alert("Something went wrong");
        }
      });

    }
    else {
      this.isLoading = false;
      alert("Operation's Signature upload failed, Please submit KYC again");
    }

  }
  shareTaskiraOrPass: any;
  currentDate!: any;
  payloadForSubmitKYC!: {};
  authTaskiraOrPass: any;

  updateMaster(tab: string) {
    this.isLoading = true;
    let corpReq = {}
    if (tab == 'Company Details') {
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
        companyPTID: this.companyPTID,
        purposeOfAcc: accountPurpose,
      }

      this.companyFiles().subscribe((uploadSuccess: any) => {
        if (uploadSuccess?.responseCode == 200) {
          this.savedTabs[tab] = true;
          this.cdr.detectChanges();
          // alert("Images uploaded succesfully");
        } else {
          console.error('File uploads failed');
          // Notify user about the upload failure
        }
      });
      // this.addSignatoryImage();
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
        if (uploadSuccess?.responseCode == 200) {
          // alert("Images uploaded succesfully");
          this.savedTabs[tab] = true;
          this.cdr.detectChanges();
        } else {
          console.error('File uploads failed');
          // Notify user about the upload failure
        }
      });
      // this.addSignatoryImage();
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

      this.buisnessActivities().subscribe((uploadSuccess: any) => {
        if (uploadSuccess?.responseCode == 200) {
          // alert("Images uploaded succesfully");
          this.savedTabs[tab] = true;
          this.cdr.detectChanges();
        } else {
          console.error('File uploads failed');
          // Notify user about the upload failure
        }
      });
      // this.addSignatoryImage();

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

      this.companyAddress().subscribe((uploadSuccess: any) => {
        if (uploadSuccess?.responseCode == 200) {
          // alert("Images uploaded succesfully");
          this.savedTabs[tab] = true;
          this.cdr.detectChanges();
        } else {
          console.error('File uploads failed');
          // Notify user about the upload failure
        }
      });
      // this.addSignatoryImage();
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
        console.log(monthlyIncome, 'AuthmonthlyIncomeControl')

        if (item.shareholdertazkiraNo) {
          this.shareTaskiraOrPass = item.shareholdertazkiraNo
        } else if (item.shareholderPassNo) {
          this.shareTaskiraOrPass = item.shareholderPassNo
        }

        let tazkiraValue: any;
        if (this.shareTaskiraType == 'E_TAZKIRA') {
          tazkiraValue = 'E_TAZKIRA'
        } else {
          tazkiraValue = 'PASSPORT'
        }
        if (!this.newdata) {
          let shareholders =
          {
            //id: i,
            firstName: item.shareholderFirstName,
            lastName: item.shareholderLastName,
            fatherName: item.shareholderFatherName,
            idProofType: tazkiraValue,
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
        } else {
           const shareholdersArray = this.newdata?.masterAgentKyc?.shareholders ?? [];
          const hasExistingShareholders = shareholdersArray.length > 0;
          let shareholders: any =
          {
            // id: this.newdata?.masterAgentKyc?.shareholders[i]?.id,
            firstName: item.shareholderFirstName,
            lastName: item.shareholderLastName,
            fatherName: item.shareholderFatherName,
            idProofType: tazkiraValue,
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
            if (hasExistingShareholders && shareholdersArray[i]?.id) {
          shareholders.id = shareholdersArray[i].id;
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
        // const monthlyIncomeControl = formArray.at(index).get('authorizedMonthlyIncome');
        // const monthlyIncome = monthlyIncomeControl && (monthlyIncomeControl as any)['rawValue'] !== undefined
        //   ? (monthlyIncomeControl as any)['rawValue']
        //   : monthlyIncomeControl?.value;
        // console.log(monthlyIncome,'monthlyIncomeControl')
        this.authTaskiraOrPass = item.authorizedPassNo
        this.authTaskiraOrPass = item.authorizedtazkiraNo
        if (!this.newdata) {
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
            monthlyIncome: (monthlyIncome),
            signatoryType: item.authorizedType,
            makerChecker: (item.roleMaker ? 'MAKER' : (item.roleChecker ? 'CHECKER' : null)),
          }
          console.log("item.authUsername", item.authUsername)
          authorizedSignatoryList.push(authorizedSignatory);
          j++;
          console.log("AuthList", authorizedSignatoryList);
        } else {
          const signatories = this.newdata?.masterAgentKyc?.signatories ?? [];
          const hasExistingSignatories = signatories.length > 0;
          let authorizedSignatory: any =
          {
            // id: this.newdata?.masterAgentKyc?.signatories?.[j]?.id,
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
            monthlyIncome: (monthlyIncome),
            signatoryType: item.authorizedType,
            makerChecker: (item.roleMaker ? 'MAKER' : (item.roleChecker ? 'CHECKER' : null)),
          }
          if (hasExistingSignatories && signatories[j]?.id) {
          authorizedSignatory.id = signatories[j].id;
          }
          console.log("item.authUsername", item.authUsername)
          authorizedSignatoryList.push(authorizedSignatory);
          j++;
          console.log("AuthList", authorizedSignatoryList);
        }
      }
      corpReq = {
        signatories: authorizedSignatoryList,

      }

    }
    else if (tab == 'Other Documents (Optional)') {
      this.MultipleDocUpload()
      this.savedTabs[tab] = true;
      this.cdr.detectChanges();
    }
    if (this.newdata) {
      this.masterAgentId = this.submittedForUpdateUserId
    }
    this.payloadForSubmitKYC = {
      kycType: "SUPER_AGENT",
      submittedFor: this.masterAgentId,
      kycInputs: corpReq,
    }
    console.log(this.payloadForSubmitKYC);


    this.corporate.updateMasterAgentRegisterKYC(this.payloadForSubmitKYC).subscribe({
      next: (user: any) => {
        if (user?.responseCode == 200) {
          this.registerResponse = user.data;
          this.registerResponseSignatory = user.data;
          this.savedTabs[tab] = true;
          this.cdr.detectChanges();
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
          if (this.tab != 'Final Submission') {
            this.nextTab(tab);
          }
        }
        else {
          this.isLoading = false;
          alert(user?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something went wrong");
      }
    });






  }

  checkPassword(password: string) {
    //console.log(password)
    if (this.basicDetailsForm.controls['corporatePassword'].value == password) {
      this.passwordMatch = true;
    }
    else {
      this.passwordMatch = false;
    }
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
  getAccPurpose() {
  this.corporate.getAccPurpose().subscribe({
    next: (data: any) => {
      this.purposeOfAccount = data?.data || [];
      this.patchPurpose(this.newdata?.masterAgentKyc?.purposeOfAcc);
    }
  });
}

  getProvinces() {
    this.corporate.getprovinces().subscribe({
      next: (data: any) => {
        // console.log(data,'logData')
        this.provinces = data?.data;
      }
    });
  }
  currentDistricts: any[] = [];

  onSelectProvince($event: any, type?: string) {
    this.provinceId = $event.target.value;
    console.log(this.provinceId);
    const filteredProvinces = this.provinces.filter((province: any) => province.name === this.provinceId);
    if (filteredProvinces && filteredProvinces.length > 0) {
      this.selectedProvinceName = filteredProvinces[0].id;
      console.log("Hi", this.selectedProvinceName);
    }

    (type) ? this.getDistricts(this.selectedProvinceName, type) : this.getDistricts(this.selectedProvinceName);
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

  onFileSelected(event: Event, formControlName: string) {
    const fileInput = event.target as HTMLInputElement;

    if (!fileInput.files || fileInput.files.length === 0) {
      return; // No file selected
    }

    const file = fileInput.files[0];

    // Define allowed MIME types based on formControlName
    const validFileTypes = (formControlName === 'contactPersonSign' || formControlName === 'opnSignature')
      ? ['image/jpeg', 'image/png', 'image/jpg']
      : ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

    // Validate file type
    if (!validFileTypes.includes(file.type)) {
      this.errorMessages[formControlName] = (formControlName === 'contactPersonSign' || formControlName === 'opnSignature')
        ? 'Only image files (JPEG, PNG, JPG) are allowed.'
        : 'Only image files (JPEG, PNG, JPG) or PDF files are allowed.';
      fileInput.value = ''; // Clear the file input
      this.attachedFiles[formControlName] ? delete this.attachedFiles[formControlName] : '';

    }
    else {
      this.errorMessages[formControlName] = '';
      this.attachedFiles = this.attachedFiles || {}; // Ensure attachedFiles is initialized
      console.log("File Selected:", this.attachedFiles);
      this.attachedFiles[formControlName] = file;
      console.log("Attached Files:", this.attachedFiles);
    }


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
    console.log(true, 'new________+++++++++');

    // Ensure shareholderCount is a valid number
    if (this.shareholderImgCount && this.shareholderImgCount > 0) {

      const shareholders = this.registerResponse?.shareholders; // Get shareholders from registerResponse
      console.log(this.registerResponse, 'registerResponse');
      console.log(shareholders, 'shareholderImgCount');

      if (shareholders && shareholders.length > 0) {
        console.log(true, 'shareholders');

        for (let i = 0; i < this.shareholderImgCount; i++) {
          // Ensure there is a matching shareholder
          if (shareholders[i]) {
            const shareholderId = shareholders[i].id; // Get the shareholder ID

            // Submit file for each shareholder using their respective ID
            let userIdVar: any;
            if (this.newdata) {
              userIdVar = this.submittedForUpdateUserId
            } else if (!this.newdata) {
              userIdVar = this.masterAgentId
            }
            this.corporate.submitMasterKYCShareholderFiles("idProofFrontPhoto", userIdVar, shareholderId, this.attachedFiles['shareholderTazkiraPhoto' + i]).subscribe(
              (data: any) => {
                console.log(`File submitted successfully for shareholder ${i + 1}`);
              },
              (error: any) => {
                console.error(`Error submitting file for shareholder ${i + 1}`, error);
              }
            )
            this.corporate.submitMasterKYCShareholderFiles("idProofBackPhoto", userIdVar, shareholderId, this.attachedFiles['shareholderTazkiraPhotoBack' + i]).subscribe(
              (data: any) => {
                console.log(`File submitted successfully for shareholder ${i + 1}`);
              },
              (error: any) => {
                console.error(`Error submitting file for shareholder ${i + 1}`, error);
              }
            )
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



    if (this.signatoryCount && this.signatoryCount > 0) {
      const signatories = this.registerResponseSignatory?.signatories;

      if (signatories && signatories.length > 0) {
        for (let i = 0; i < this.signatoryCount; i++) {
          if (signatories[i]) {
            const signatoryId = signatories[i].id; // Get the shareholder ID

            // Define the files to upload for the current signatory
            let filesToUpload = [
              { field: 'signatoryPhoto', file: this.attachedFiles['authorizedPhoto' + i] },
              { field: 'idProofFrontPhoto', file: this.attachedFiles['authorizedzkiraPhoto' + i] },
              { field: 'idProofBackPhoto', file: this.attachedFiles['authorizedzkiraPhotoBack' + i] },
              { field: 'signaturePhoto', file: this.attachedFiles['authorizedSign' + i] },
              { field: 'authorizationLetterPhoto', file: this.attachedFiles['authorizedLetter' + i] }

            ];

            from(filesToUpload).pipe(
              concatMap(({ field, file }) => {
                if (file) {
                  return this.corporate.submitMasterKYCSignatoryFiles(field, this.masterAgentId, signatoryId, file);
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

            // if(this.newdata){
            //   // Sequentially upload each file using concatMap
            //   from(filesToUpload).pipe(
            //     concatMap(({ field, file }) => {
            //       if (file) {
            //         return this.corporate.submitCorporateKYCSignatoryFiles(field, this.submittedForUpdateUserId, signatoryId, file);
            //       }
            //       return of(null); // Skip upload if file is missing
            //     })
            //   ).subscribe({
            //     next: (response) => {
            //       console.log(`File uploaded successfully for signatory ${i + 1}`, response);
            //     },
            //     error: (err) => {
            //       console.error(`Error uploading file for signatory ${i + 1}`, err);
            //     },
            //     complete: () => {
            //       console.log(`All files processed for signatory ${i + 1}`);
            //     }
            //   });
            // }
            // if(!this.newdata){

            // }

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

  createUpdatePayload() {
    let shareholdersList: any[] = [];
    let i = 0;
    for (let i = 0; i < this.newdata?.masterAgentKyc?.shareholders.length; i++) {
      console.log(this.newdata?.masterAgentKyc?.shareholders[i]?.id)
    }
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];
    for (let item of this.shareHolderDetailsForm.controls['shareHolders'].value) {
      console.log("Item -", item);
      const formArray = this.shareHolderDetailsForm.controls['shareHolders'] as FormArray;
      const index = this.shareHolderDetailsForm.controls['shareHolders'].value.indexOf(item);

      const monthlyIncomeControl = formArray.at(index).get('shareholderMonthlyIncome');
      const monthlyIncome = monthlyIncomeControl && (monthlyIncomeControl as any)['rawValue'] !== undefined
        ? (monthlyIncomeControl as any)['rawValue']
        : monthlyIncomeControl?.value;

      let shareholders =
      {
        id: this.newdata?.masterAgentKyc?.shareholders[i]?.id,
        firstName: item.shareholderFirstName,
        lastName: item.shareholderLastName,
        fatherName: item.shareholderFatherName,
        idProofType: "E_TAZKIRA",
        idProofNumber: item.shareholdertazkiraNo,
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
      console.log(this.newdata?.masterAgentKyc?.signatories?.[j]?.id, 'signatory')
      let authorizedSignatory =
      {
        id: this.newdata?.masterAgentKyc?.signatories?.[j]?.id,
        firstName: item.authorizedFirstName,
        lastName: item.authorizedLastName,
        email: item.authorizedEmail,
        idProofType: "E_TAZKIRA",
        idProofNumber: item.authorizedtazkiraNo,
        dob: item.authorizedDOB,
        placeOfBirth: item.authorizedPlaceofBirth,
        nationality: item.authorizedNationality,
        designation: item.authorizedDesignation,
        residentAddress: item.authorizedlocation,
        phone: item.authorizedPhone,
        sourceOfIncome: item.authorizedSourceofIncome,
        monthlyIncome: parseFloat(monthlyIncome),
        signatoryType: item.authorizedType,
        makerChecker: (item.roleMaker ? 'MAKER' : (item.roleChecker ? 'CHECKER' : null)),
      }

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
      kycType: "MASTER_AGENT",
      submittedFor: this.submittedForUpdateUserId,
      kycInputs: {
        companyName: this.companyDetailsForm.controls['companyName'].value,
        companyPTID: this.companyPTID,
        companyAccOpenDate: currentDate,
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

    //   return this.corporate.updateMasterAgentRegisterKYC(req).pipe( concatMap((data: any) => {
    //     if (data?.responseCode === 200) {
    //       // this.registerResponse = data.data;
    //       return this.uploadDocuments();  // Upload documents if KYC submission is successful
    //     } else {
    //       alert("KYC Submission Failed, Please try again");
    //       return of(false);
    //     }
    //   }),
    //   concatMap((uploadSuccess: boolean) => {
    //     if (uploadSuccess) {
    //       return this.corporate.completeMasterAgentRegisterKYC(this.submittedForUpdateUserId);  // Call completeMasterAgentRegisterKYC only if uploads succeeded
    //     } else {
    //       alert("Document Upload Failed, Update Incomplete");
    //       return of(null);
    //     }
    //   })
    // ).subscribe({
    //   next: (data: any) => {
    //     if (data?.responseCode === 200) {
    //       this.isLoading = false;
    //       alert("KYC Updated Successfully");
    //       this.router.navigate(["corporate/list-master-agent"]);
    //     } else {
    //       this.isLoading = false;
    //       alert("Registration Failed");
    //     }
    //   }, error: () => {
    //     alert("Registration Failed");
    //   }
    // })

  }


  createPayload() {
    const reqBasic = {
      email: this.basicDetailsForm.controls['corporateEmail'].value,
      username: this.basicDetailsForm.controls['corporateEmail'].value,
      firstName: this.basicDetailsForm.controls['corporteFirstName'].value,
      lastName: this.basicDetailsForm.controls['corporteLastName'].value,
      phone: this.basicDetailsForm.controls['corporatePhone'].value,
      userType: 'AGENT',
      agentType: 'MASTER_AGENT',
      gender: 'MALE',
      password: this.basicDetailsForm.controls['corporatePassword'].value,
    };

    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];

    this.corporate.submitMasterAgentRegister(reqBasic).pipe(
      concatMap((data: any) => {
        if (data.responseCode === 200) {
          this.userId = data.data;
          if (!this.userId) {
            alert("Corporate Registration failed, please try again later");
            return of(null);
          }

          // Build the req for submitCorporateRegisterKYC
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

            let shareholders =
            {
              //id: i,
              firstName: item.shareholderFirstName,
              lastName: item.shareholderLastName,
              fatherName: item.shareholderFatherName,
              idProofType: "E_TAZKIRA",
              idProofNumber: item.shareholdertazkiraNo,
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
            let authorizedSignatory =
            {
              //id: j,
              firstName: item.authorizedFirstName,
              lastName: item.authorizedLastName,
              email: item.authorizedEmail,
              idProofType: "E_TAZKIRA",
              idProofNumber: item.authorizedtazkiraNo,
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
            kycType: "MASTER_AGENT",
            submittedFor: this.userId,
            kycInputs: {
              companyName: this.companyDetailsForm.controls['companyName'].value,
              companyPTID: this.companyPTID,
              companyAccOpenDate: currentDate,
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

          return this.corporate.submitMasterAgentRegisterKYC(req)
        } else {
          alert("Error occurred");
          return of(null);
        }
      }),
      // concatMap((data: any) => {
      //   if (data?.responseCode === 200) {
      //     // this.registerResponse = data.data;
      //     return this.uploadDocuments();  // Upload documents if KYC submission is successful
      //   } else {
      //     alert("KYC Submission Failed, Please try again");
      //     return of(false);
      //   }
      // }),
      concatMap((uploadSuccess: boolean) => {
        if (uploadSuccess) {
          return this.corporate.completeMasterAgentRegisterKYC(this.userId);  // Call completeMasterAgentRegisterKYC only if uploads succeeded
        } else {
          alert("Document Upload Failed, Registration Incomplete");
          return of(null);
        }
      })
    ).subscribe({
      next: (data: any) => {
        if (data?.responseCode === 200) {
          this.isLoading = false;
          alert("Registration Completed Successfully");
          this.router.navigate(["corporate/list-master-agent"]);
        } else {
          this.isLoading = false;
          alert("Registration Failed");
        }
      }, error: () => {
        alert("Registration Failed");
      }
    })
  }

  signatoryCopy(event: any, index: number): void {
    const shareholder = this.shareHoldersFormArray.at(index) as FormGroup;
    const authorized = this.authorizedSignatoryFormArray.at(index) as FormGroup;
    const incomeVal = shareholder.get('shareholderMonthlyIncome')?.value ?? 0;
    const incomeStr = String(incomeVal);
    const cleanedIncome = parseFloat(incomeStr.replace(/[^0-9.]/g, '')) || 0;
    authorized.patchValue({ authorizedMonthlyIncome: cleanedIncome });


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
        authorizedMonthlyIncome: incomeStr,
        authorizedSourceofIncome: shareholder.get('shareholdingOtherSource')?.value,
        authorizedPhone: shareholder.get('shareholderPhone')?.value
      });
      shareholder.patchValue({ isSignatory: true });
      // console.log("Shareholder Monthly Income:", shareholder.get('shareholderMonthlyIncome')?.value);
      // console.log("Authorized Monthly Income:", authorized.get('authorizedMonthlyIncome')?.value);

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
  //old(baskar)
  // uploadDocuments(): Observable<boolean> {
  //   const fileMappings = [
  //     { key: 'contactPersonTazkiraPhoto', mapping: 'contactPersonIdProofFrontPhoto', file: this.attachedFiles['contactPersonTazkiraPhoto'] },
  //     { key: 'contactPersonSign', mapping: 'contactPersonSignature', file: this.attachedFiles['contactPersonSign'] },
  //     { key: 'businessLicencePhoto', mapping: 'bizLicensePhoto', file: this.attachedFiles['businessLicencePhoto'] },
  //     { key: 'addressProof', mapping: 'addressProofPhoto', file: this.attachedFiles['addressProof'] },
  //     { key: 'shareholderTazkiraPhoto', mapping: 'idProofFrontPhoto', file: this.attachedFiles['shareholderTazkiraPhoto'] },
  //     { key: 'authorizedPhoto', mapping: 'signatoryPhoto', file: this.attachedFiles['authorizedPhoto'] },
  //     { key: 'authorizedzkiraPhoto', mapping: 'signatoryIdProofFrontPhoto', file: this.attachedFiles['authorizedzkiraPhoto'] },
  //     { key: 'authorizedSign', mapping: 'signatorySignature', file: this.attachedFiles['authorizedSign'] },
  //     { key: 'authorizedLetter', mapping: 'authorizationLetterPhoto', file: this.attachedFiles['authorizedLetter'] },
  //     { key: 'articleOfAssociationPhoto', mapping: 'articleOfAssociationPhoto', file: this.attachedFiles['articleOfAssociationPhoto'] },
  //     { key: 'taxClearanceLetterPhoto', mapping: 'taxClearanceLetterPhoto', file: this.attachedFiles['taxClearanceLetterPhoto'] },
  //     { key: 'companyTINLetterPhoto', mapping: 'companyTINLetterPhoto', file: this.attachedFiles['companyTINLetterPhoto'] },
  //   ].filter(({ file }) => file);  // Filter out any undefined files
  //   if(this.profile){
  //     this.corporate.submitMasterAgentProfilePic(this.profile).subscribe((res)=>{
  //       console.log(res);

  //     })
  //   }
  //   return of(...fileMappings).pipe(
  //     concatMap(({ mapping, file }) => {
  //       // Call `addShareholderImage` if mapping is 'idProofFrontPhoto'
  //       //if (mapping === 'idProofFrontPhoto') {
  //       this.addShareholderImage();
  //       this.addSignatoryImage();
  //       this.MultipleDocUpload()
  //       //}
  //       return this.corporate.submitmasterAgentKYCFiles(this.userId, mapping, file).pipe(
  //         map((response: any) => response?.responseCode === 200), // Map to `true` if successful, `false` otherwise
  //         catchError(error => {
  //           console.error("Error submitting file", error);
  //           return of(false); // Return `false` instead of `null` to indicate failure
  //         })
  //       );
  //     }),
  //     toArray(),
  //     map((results: boolean[]) => results.every(success => success))  // Return `true` only if all results are `true`
  //   );
  // }
  // uploadDocuments(): Observable<boolean> {
  //   // this.addShareholderImage()
  //   // this.addSignatoryImage();
  //   const fileMappings = [
  //     { key: 'contactPersonTazkiraPhoto', mapping: 'contactIdProofFrontPhoto', file: this.attachedFiles['contactPersonTazkiraPhoto'] },
  //     { key: 'contactPersonSign', mapping: 'contactSignaturePhoto', file: this.attachedFiles['contactPersonSign'] },
  //     { key: 'businessLicencePhoto', mapping: 'bizLicensePhoto', file: this.attachedFiles['businessLicencePhoto'] },
  //     { key: 'addressProof', mapping: 'addressProofPhoto', file: this.attachedFiles['addressProof'] },
  //     { key: 'shareholderTazkiraPhoto', mapping: 'idProofFrontPhoto', file: this.attachedFiles['shareholderTazkiraPhoto'] },
  //     { key: 'authorizedPhoto', mapping: 'signatoryPhoto', file: this.attachedFiles['authorizedPhoto'] },
  //     { key: 'authorizedzkiraPhoto', mapping: 'signatoryIdProofFrontPhoto', file: this.attachedFiles['authorizedzkiraPhoto'] },
  //     { key: 'authorizedSign', mapping: 'signatorySignature', file: this.attachedFiles['authorizedSign'] },
  //     { key: 'authorizedLetter', mapping: 'authorizationLetterPhoto', file: this.attachedFiles['authorizedLetter'] },
  //     { key: 'articleOfAssociationPhoto', mapping: 'articleOfAssociationPhoto', file: this.attachedFiles['articleOfAssociationPhoto'] },
  //     { key: 'taxClearanceLetterPhoto', mapping: 'taxClearanceLetterPhoto', file: this.attachedFiles['taxClearanceLetterPhoto'] },
  //     { key: 'companyTINLetterPhoto', mapping: 'companyTINLetterPhoto', file: this.attachedFiles['companyTINLetterPhoto'] },
  //   ].filter(({ file }) => file); // Filter out any undefined files

  //   const sequentialUploads = fileMappings.reduce((acc, { mapping, file }) => {
  //     return acc.pipe(
  //       concatMap(success => {
  //         if (!success) {
  //           throw new Error("Previous file upload failed");
  //         }
  //         // if(this.newdata){
  //           return this.corporate.submitmasterAgentKYCFiles(this.masterAgentId, mapping, file).pipe(
  //             map((response: any) => response?.responseCode === 200),
  //             catchError(error => {
  //               console.error(`Error submitting file with mapping ${mapping}`, error);
  //               return of(false);
  //             })
  //           );
  //         // }else{
  //           // return this.corporate.submitmasterAgentKYCFiles(this.masterAgentId, mapping, file).pipe(
  //           //   map((response: any) => response?.responseCode === 200),
  //           //   catchError(error => {
  //           //     console.error(`Error submitting file with mapping ${mapping}`, error);
  //           //     return of(false);
  //           //   })
  //           // );
  //         // }
  //       })
  //     );
  //   }, of(true)); // Start with an observable that emits `true` to begin the chain

  //   if (this.profile) {
  //     this.corporate.submitMasterAgentProfilePic(this.profile).subscribe(
  //       res => console.log(res),
  //       error => console.error("Error submitting profile picture", error)
  //     );
  //   }

  //   return sequentialUploads.pipe(
  //     map(finalSuccess => {
  //       if (!finalSuccess) {
  //         console.error("One or more uploads failed");
  //       } else {
  //         console.log("All files uploaded successfully");
  //       }
  //       return finalSuccess;
  //     }),
  //     catchError(error => {
  //       console.error("Error in upload sequence", error);
  //       return of(false);
  //     })
  //   );
  // }
  companyFiles(): Observable<boolean> {
    // this.addShareholderImage()
    // this.addSignatoryImage();
    const fileMappings = [
      // { key: 'contactPersonTazkiraPhoto', mapping: 'contactIdProofFrontPhoto', file: this.attachedFiles['contactPersonTazkiraPhoto'] },
      // { key: 'contactPersonSign', mapping: 'complianceSignaturePhoto', file: this.attachedFiles['contactPersonSign'] },
      { key: 'articleOfAssociationPhoto', mapping: 'articleOfAssociationPhoto', file: this.attachedFiles['articleOfAssociationPhoto'] },
    ].filter(({ file }) => file); // Filter out any undefined files

    const sequentialUploads = fileMappings.reduce((acc, { mapping, file }) => {
      return acc.pipe(
        concatMap(success => {
          if (!success) {
            throw new Error("Previous file upload failed");
          }
          if (this.newdata) {
            return this.corporate.submitmasterAgentKYCFiles(this.submittedForUpdateUserId, mapping, file).pipe(
              map((response: any) => response?.responseCode === 200),
              catchError(error => {
                console.error(`Error submitting file with mapping ${mapping}`, error);
                return of(false);
              })
            );
          } else {
            return this.corporate.submitmasterAgentKYCFiles(this.masterAgentId, mapping, file).pipe(
              map((response: any) => response?.responseCode === 200),
              catchError(error => {
                console.error(`Error submitting file with mapping ${mapping}`, error);
                return of(false);
              })
            );
          }
        })
      );
    }, of(true)); // Start with an observable that emits `true` to begin the chain

    if (this.profile) {
      this.corporate.submitMasterAgentProfilePic(this.profile).subscribe(
        res => console.log(res),
        error => console.error("Error submitting profile picture", error)
      );
    }

    return sequentialUploads.pipe(
      map(finalSuccess => {
        if (!finalSuccess) {
          console.error("One or more uploads failed");
        } else {
          console.log("All files uploaded successfully");
        }
        return finalSuccess;
      }),
      catchError(error => {
        console.error("Error in upload sequence", error);
        return of(false);
      })
    );
  }
  companyBuisness(): Observable<boolean> {
    // this.addShareholderImage()
    // this.addSignatoryImage();
    const fileMappings = [
      { key: 'businessLicencePhoto', mapping: 'bizLicensePhoto', file: this.attachedFiles['businessLicencePhoto'] },
    ].filter(({ file }) => file); // Filter out any undefined files

    const sequentialUploads = fileMappings.reduce((acc, { mapping, file }) => {
      return acc.pipe(
        concatMap(success => {
          if (!success) {
            throw new Error("Previous file upload failed");
          }
          if (this.newdata) {
            return this.corporate.submitmasterAgentKYCFiles(this.submittedForUpdateUserId, mapping, file).pipe(
              map((response: any) => response?.responseCode === 200),
              catchError(error => {
                console.error(`Error submitting file with mapping ${mapping}`, error);
                return of(false);
              })
            );
          } else {
            return this.corporate.submitmasterAgentKYCFiles(this.masterAgentId, mapping, file).pipe(
              map((response: any) => response?.responseCode === 200),
              catchError(error => {
                console.error(`Error submitting file with mapping ${mapping}`, error);
                return of(false);
              })
            );
          }
        })
      );
    }, of(true)); // Start with an observable that emits `true` to begin the chain

    if (this.profile) {
      this.corporate.submitMasterAgentProfilePic(this.profile).subscribe(
        res => console.log(res),
        error => console.error("Error submitting profile picture", error)
      );
    }

    return sequentialUploads.pipe(
      map(finalSuccess => {
        if (!finalSuccess) {
          console.error("One or more uploads failed");
        } else {
          console.log("All files uploaded successfully");
        }
        return finalSuccess;
      }),
      catchError(error => {
        console.error("Error in upload sequence", error);
        return of(false);
      })
    );
  }
  buisnessActivities(): Observable<boolean> {
    // this.addShareholderImage()
    // this.addSignatoryImage();
    const fileMappings = [
      { key: 'taxClearanceLetterPhoto', mapping: 'taxClearanceLetterPhoto', file: this.attachedFiles['taxClearanceLetterPhoto'] },
      { key: 'companyTINLetterPhoto', mapping: 'companyTINLetterPhoto', file: this.attachedFiles['companyTINLetterPhoto'] },
    ].filter(({ file }) => file); // Filter out any undefined files

    const sequentialUploads = fileMappings.reduce((acc, { mapping, file }) => {
      return acc.pipe(
        concatMap(success => {
          if (!success) {
            throw new Error("Previous file upload failed");
          }
          if (this.newdata) {
            return this.corporate.submitmasterAgentKYCFiles(this.submittedForUpdateUserId, mapping, file).pipe(
              map((response: any) => response?.responseCode === 200),
              catchError(error => {
                console.error(`Error submitting file with mapping ${mapping}`, error);
                return of(false);
              })
            );
          } else {
            return this.corporate.submitmasterAgentKYCFiles(this.masterAgentId, mapping, file).pipe(
              map((response: any) => response?.responseCode === 200),
              catchError(error => {
                console.error(`Error submitting file with mapping ${mapping}`, error);
                return of(false);
              })
            );
          }
        })
      );
    }, of(true)); // Start with an observable that emits `true` to begin the chain

    if (this.profile) {
      this.corporate.submitMasterAgentProfilePic(this.profile).subscribe(
        res => console.log(res),
        error => console.error("Error submitting profile picture", error)
      );
    }

    return sequentialUploads.pipe(
      map(finalSuccess => {
        if (!finalSuccess) {
          console.error("One or more uploads failed");
        } else {
          console.log("All files uploaded successfully");
        }
        return finalSuccess;
      }),
      catchError(error => {
        console.error("Error in upload sequence", error);
        return of(false);
      })
    );
  }
  companyAddress(): Observable<boolean> {
    // this.addShareholderImage()
    // this.addSignatoryImage();
    const fileMappings = [
      { key: 'addressProof', mapping: 'addressProofPhoto', file: this.attachedFiles['addressProof'] },
    ].filter(({ file }) => file); // Filter out any undefined files

    const sequentialUploads = fileMappings.reduce((acc, { mapping, file }) => {
      return acc.pipe(
        concatMap(success => {
          if (!success) {
            throw new Error("Previous file upload failed");
          }
          if (this.newdata) {
            return this.corporate.submitmasterAgentKYCFiles(this.submittedForUpdateUserId, mapping, file).pipe(
              map((response: any) => response?.responseCode === 200),
              catchError(error => {
                console.error(`Error submitting file with mapping ${mapping}`, error);
                return of(false);
              })
            );
          } else {
            return this.corporate.submitmasterAgentKYCFiles(this.masterAgentId, mapping, file).pipe(
              map((response: any) => response?.responseCode === 200),
              catchError(error => {
                console.error(`Error submitting file with mapping ${mapping}`, error);
                return of(false);
              })
            );
          }
        })
      );
    }, of(true)); // Start with an observable that emits `true` to begin the chain

    if (this.profile) {
      this.corporate.submitMasterAgentProfilePic(this.profile).subscribe(
        res => console.log(res),
        error => console.error("Error submitting profile picture", error)
      );
    }

    return sequentialUploads.pipe(
      map(finalSuccess => {
        if (!finalSuccess) {
          console.error("One or more uploads failed");
        } else {
          console.log("All files uploaded successfully");
        }
        return finalSuccess;
      }),
      catchError(error => {
        console.error("Error in upload sequence", error);
        return of(false);
      })
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
  emailError: string | null = null;
  phoneError: string | null = null;
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
                item.usertype === 'AGENT'
            );

            if (customerMatch) {
              this.emailError = 'Email is already registered.';
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
                item.usertype === 'AGENT'
            );

            if (customerMatch) {
              this.phoneError = 'Phone number is already registered.';
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




  deleteFile(index: number) {
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
      this.kycModuleService.deleteMasterAgentMultipleDoc(req, this.submittedForUpdateUserId).subscribe((data: any) => {
        if (data?.responseCode === 200) {
          alert('File deleted successfully');
          this.addtionalDocs[0].splice(index, 1);
        } else {
          alert(`Error deleting file`);
        }
      });
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
  viewFile(fileUrl: string) {
    console.log(fileUrl)
    // window.open(fileUrl, '_blank');  // Opens the file in a new tab
    this.kycModuleService.getImageAndOpen(fileUrl)

  }
  viewFileShare(fileUrl: any) {
    console.log(fileUrl)
    // window.open(fileUrl, '_blank');  // Opens the file in a new tab
    this.kycModuleService.getImageAndOpen(fileUrl)

  }

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
}
// authPersonLastName: this.lastNameAuth.value,
// authPersonPositionHeld: this.positionAuth.value,
// authPersonTazkira: this.tazkiraAuth.value,
// authPersonCountry: this.countryAuth.value,
// authPersonDateOfExpiry: this.DateofExpiryAuth.value,
// authPersonNationality: this.nationalityAuth.value,
// authPersonMobile: this.monthlyIncomeAuth.value,
// authPersonTinNumber: this.TinAuth.value,
// authPersonFirstName: this.firstNameAuth.value,
// authPersonFatherName: this.fatherNameAuth.value,
// authPersonEmail: this.emailAuth.value,
// authPersonDOB: this.dobAuth.value,
// authPersonDateOfIssue: this.issueDateAuth.value,
// authPersonSourceOfIncome: this.incomeSourceAuth.value,
// authPersonMonthlyIncome: this.monthlyIncomeAuth.value,