import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IndividualKYCService } from '../../kyc.service';
import { UserService } from '../../../user.service';
import { HttpClient } from '@angular/common/http';
import { UserManagementService } from '../../../openapi';
import { AmlService } from '../../../../../../sdn-management/aml.service';
import { LoaderComponent } from '../../../../../../loader/loader.component';
import { CurrencyFormatPipe } from '../../../../../../pipe/currency-format.pipe';
import { catchError, concatMap, debounceTime, distinctUntilChanged, map, of, toArray } from 'rxjs';
import { forkJoin } from 'rxjs';
import { SharedFunctionsService } from '../../../../../../shared-functions.service';
import { Router } from '@angular/router';
import { KycModuleService } from '../../../../../../kyc/kyc/kyc-module.service';
import { SessionService } from '../../../../../../session.service';
import { from } from 'rxjs';
import { last, } from 'rxjs/operators';
import { ApiService } from '../../../../../../core/services/api/api.service';
import { CustomerApiService } from '../ApiService/api.service';
import { CustomerDatasharingService } from '../datasharing.service';
import { showToast } from '../../../../../../core/toast/toast';
interface imageUpload {
  type: any,
  file: any,
}

@Component({
  selector: 'app-customer-view',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf, NgClass, FormsModule, LoaderComponent],
  templateUrl: './customer-view.component.html',
  styleUrl: './customer-view.component.css'
})

export class CustomerViewComponent {
  //new
 isLoading: boolean = false;
  isPasswordVisible: boolean = false;
  otp: any;
  otpVerify: boolean = false;
  nationalities: any;
  provinces: any;
  districts: any;
  identityDetailsForm!: FormGroup<{
    customerFirstName: FormControl<string | null>;
    customerLastName: FormControl<string | null>;
    customerGender: FormControl<string | null>;
    customerEmail: FormControl<string | null>;
    phone: FormControl<string | null>;
    password: FormControl<string | null>;
    dateOfBirth: FormControl<string | null>;
    birthCountry: FormControl<string | null>;
    birthProvince: FormControl<string | null>;
    birthDistrict: FormControl<string | null>;
    currCountry: FormControl<string | null>;
    currProvince: FormControl<string | null>;
    currDistrict: FormControl<string | null>;
    customerReferredBy: FormControl<string | null>;
  }>;
  addressDetailsForm!: FormGroup<{
    currentLocation: FormControl<string | null>;
    currentDistrict: FormControl<string | null>;
    currentProvince: FormControl<string | null>;
    currentCountry: FormControl<string | null>;
    permanantDistrict: FormControl<string | null>;
    permanantProvince: FormControl<string | null>;
    permanantCountry: FormControl<string | null>;
  }>;
  occupationDetailsForm: any;
  nextOfKinDetailsForm!: FormGroup<{
    fullName: FormControl<string | null>;
    fatherName: FormControl<string | null>;
    relationship: FormControl<string | null>;
    phoneNumber: FormControl<string | null>;
    location: FormControl<string | null>;
  }>;
  proofsDetailsForm!: any;
  otpForm!: FormGroup<{
    otp: FormControl<any | null>;
  }>;
  customerId: any;
  Currnationalities: any;
  Currprovinces: any;
  Currdistricts: any;
  constructor(
    private fb: FormBuilder,
    private apiService: CustomerApiService,
    private dataSgaring: CustomerDatasharingService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required]],
    });
    this.initForm();
    this.getCountries();
    this.getDistricts;
    this.getProvinces();
    this.getCurrCountries();
    this.getCurrDistricts;
    this.getCurrProvinces();
  }
  initForm() {
    this.identityDetailsForm = this.fb.group({
      customerFirstName: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')],
      ],
      customerLastName: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')],
      ], //customerMMWallet : ['', Validators.required],
      customerGender: ['', Validators.required],
      customerEmail: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'),
        ],
      ],
      phone: ['', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]],
      password: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      birthCountry: ['', Validators.required],
      birthProvince: ['', Validators.required],
      birthDistrict: ['', Validators.required],
      currCountry: ['', Validators.required],
      currProvince: ['', Validators.required],
      currDistrict: ['', Validators.required],
      customerReferredBy: [''],
    });
    (this.addressDetailsForm = this.fb.group({
      currentLocation: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')],
      ], // Alphanumeric
      currentProvince: ['', [Validators.required]],
      currentDistrict: ['', [Validators.required]],
      currentCountry: ['', [Validators.required]],
      permanantDistrict: ['', [Validators.required]],
      permanantProvince: ['', [Validators.required]],
      permanantCountry: ['', [Validators.required]], //addressProof: ['', [Validators.required]],
    })),
      (this.occupationDetailsForm = this.fb.group({})),
      (this.nextOfKinDetailsForm = this.fb.group({
        fullName: [
          '',
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)],
        ],
        fatherName: [
          '',
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)],
        ],
        relationship: ['', Validators.required],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern(/.*(7\d{8})$/)],
        ],
        location: [
          '',
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)],
        ],
      }));
    this.proofsDetailsForm = this.fb.group({});
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
      const isUnderage = age < 18 || (age === 18 && monthDifference < 0);
      return isUnderage ? { underage: { value: control.value } } : null;
    };
  }
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  createPayload() {
    let email = this.identityDetailsForm.controls['customerEmail'].value;
    let body = {
      email: email,
      otp: this.otpForm.controls['otp'].value,
    };
    this.isLoading = true;
    let request = {
      email: this.identityDetailsForm.value.customerEmail,
      username: this.identityDetailsForm.value.customerEmail,
      firstName: this.identityDetailsForm.value.customerFirstName,
      lastName: this.identityDetailsForm.value.customerLastName,
      phone: this.identityDetailsForm.value.phone,
      userType: 'CUSTOMER',
      password: this.identityDetailsForm.value.password,
      gender: this.identityDetailsForm.value.customerGender,
      dateOfBirth: this.identityDetailsForm.value.dateOfBirth,
      birthCountry: this.identityDetailsForm.value.birthCountry,
      birthProvince: this.identityDetailsForm.value.birthProvince,
      birthDistrict: this.identityDetailsForm.value.birthDistrict,
      currCountry: this.identityDetailsForm.value.currCountry,
      currProvince: this.identityDetailsForm.value.currProvince,
      currDistrict: this.identityDetailsForm.value.currDistrict,
    };
    console.log(request,'req');
    
    this.isLoading = true;
    this.apiService.verifyOtp(body).subscribe({
      next: (res) => {
        if (res?.responseCode == 200) {
          this.isLoading = false;
          this.apiService.customerKYCRegister(request).subscribe({
            next: (res) => {
              if (res?.responseCode == 200) {
                showToast('Customer Registration Success');
                this.router.navigateByUrl('userManagement/customer');
                this.dataSgaring.corpKycData(false);
                this.customerId = res?.id;
              } else {
                this.isLoading = false;
                showToast(res?.error);
              }
            },
            error: () => {
              this.isLoading = false;
              showToast('Something Went Wrong!!!');
            },
          });
        } else {
          this.isLoading = false;
          showToast(res?.error);
        }
      },
      error: () => {
        showToast('Error Try Again');
      },
    });
  } // customerKYCBasic() { //   let request = { //     kycType: 'CUSTOMER', //     submittedFor: this.customerId, //     kycInputs: { //       custInfoFirstName: this.identityDetailsForm.value.customerFirstName, //       custInfoLastName: this.identityDetailsForm.value.customerLastName, //       custInfoFatherName: this.identityDetailsForm.value.customerFatherName, //       custInfoDob: this.identityDetailsForm.value.customerDOB, //       custInfoGender: this.identityDetailsForm.value.customerGender, //       custInfoMaritalStatus: //         this.identityDetailsForm.value.customerMaritialStatus, //       custInfoAltPhone: this.identityDetailsForm.value.customerAlternatePhone, //       custInfoEmail: this.identityDetailsForm.value.customerEmail, //       custInfoNationality: this.identityDetailsForm.value.customerNationality, //       custInfoBirthCountry: //         this.identityDetailsForm.value.customerBirthCountry, //       custInfoBirthProvince: //         this.identityDetailsForm.value.customerBirthProvince, //       currLocation: this.addressDetailsForm.value.currentLocation, //       currCountry: this.addressDetailsForm.value.currentCountry, //       currProvince: this.addressDetailsForm.value.currentProvince, //       currProvinceId: this.addressDetailsForm.value.currentProvince, //       currDistrict: this.addressDetailsForm.value.currentDistrict, //       currDistrictId: this.addressDetailsForm.value.currentDistrict, //       permCountry: this.addressDetailsForm.value.permanantCountry, //       permProvince: this.addressDetailsForm.value.permanantProvince, //       permProvinceId: this.addressDetailsForm.value.permanantProvince, //       permDistrict: this.addressDetailsForm.value.permanantDistrict, //       permDistrictId: this.addressDetailsForm.value.permanantDistrict, //       employmentType: 'EMPLOYED', //       employerName: this.occupationDetailsForm.value?.employerName, //       sourceOfIncome: this.occupationDetailsForm.value?.sourceOfIncome, //       positionHeld: this.occupationDetailsForm.value?.positionHeld, //       periodOfService: 0, //       monthlyTurnover: this.occupationDetailsForm.value?.monthlyTurnover, //       monthlyIncome: this.occupationDetailsForm.value?.monthlyIncome, //       tinNumber: this.occupationDetailsForm.value?.tinNumber, //       bizNature: this.occupationDetailsForm.value?.natureofBusiness, //       govtOrgName: this.occupationDetailsForm.value?.govtOrganizationName, //       govtPositionHeld: this.occupationDetailsForm.value?.govtPositionHeld, //       nokName: this.nextOfKinDetailsForm.value.fullName, //       nokFatherName: this.nextOfKinDetailsForm.value.fatherName, //       nokRelationship: this.nextOfKinDetailsForm.value.relationship, //       nokPhone: this.nextOfKinDetailsForm.value.phoneNumber, //       nokLocation: this.nextOfKinDetailsForm.value.location, //       purposeOfAcc: this.proofsDetailsForm.value?.purposeofAcoount, //       custProofType: this.identityDetailsForm.value.idType, //       custProofNumber: this.proofsDetailsForm.value?.idNumber, //       custProofDateOfIssue: this.proofsDetailsForm.value?.dateofIsuue, //       custProofDateOfExpiry: this.proofsDetailsForm.value?.dateofExpiry, //       tazkiraPageNo: this.proofsDetailsForm.value?.pageNumber, //       tazkiraRegNo: this.proofsDetailsForm.value?.regNumber, //       tazkiraBookNo: this.proofsDetailsForm.value?.bookNumber, //     }, //   }; //   this.apiService.customerKYCSubmit(request).subscribe({ //     next: (user: any) => { //       if (user) { //         this.isLoading = false; //         this.otpVerify = true; //         this.dataSgaring.corpKycData(false); //         alert('Customer Registered Successfully'); //       } //     }, //     error: () => { //       this.isLoading = false; //       alert('Something went wrong'); //     }, //   }); // }
  sendOtp() {
    let body = {
      email: this.identityDetailsForm.controls['customerEmail'].value,
    };
    this.apiService.generateOtp(body).subscribe({
      next: (res) => {
        if (res?.responseCode == 200) {
          showToast('OTP has sent to you Email.Please Verify.');
          this.otpVerify = true;
        } else {
          if (res?.error) {
            showToast(res?.error);
          } else if (res?.data) {
            showToast(res?.data);
          }
        }
      },
      error: () => {
        showToast('Error Try Again');
      },
    });
  }
  gotoLogin() {
    this.dataSgaring.corpKycData(false);
  }
  validateNumberInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onSelectProvince($event: any) {
    let provinceId = $event.target.value;
    let selectedProvinceName;
    const filteredProvinces = this.provinces.filter(
      (province: any) => province.name === provinceId
    );
    if (filteredProvinces && filteredProvinces.length > 0) {
      selectedProvinceName = filteredProvinces[0].id;
    }
    this.getDistricts(selectedProvinceName);
  }
  onSelectCurrProvince($event: any) {
    let provinceId = $event.target.value;
    let selectedProvinceName;
    const filteredProvinces = this.Currprovinces.filter(
      (province: any) => province.name === provinceId
    );
    if (filteredProvinces && filteredProvinces.length > 0) {
      selectedProvinceName = filteredProvinces[0].id;
    }
    this.getCurrDistricts(selectedProvinceName);
  }
  getDistricts(provinceId: number) {
    this.apiService.getdistricts(provinceId).subscribe({
      next: (data: any) => {
        this.districts = data?.data;
      },
    });
  }
  getCurrDistricts(provinceId: number) {
    this.apiService.getdistricts(provinceId).subscribe({
      next: (data: any) => {
        this.Currdistricts = data?.data;
      },
    });
  }
  getCountries() {
    this.apiService.getCountries().subscribe({
      next: (data: any) => {
        this.nationalities = data?.data;
      },
    });
  }

  getProvinces() {
    this.apiService.getprovinces().subscribe({
      next: (data: any) => {
        this.provinces = data?.data;
      },
    });
  }
  getCurrCountries() {
    this.apiService.getCountries().subscribe({
      next: (data: any) => {
        this.Currnationalities = data?.data;
      },
    });
  }

  getCurrProvinces() {
    this.apiService.getprovinces().subscribe({
      next: (data: any) => {
        this.Currprovinces = data?.data;
      },
    });
  }
  phoneError: string | null = null;
  emailError: string | null = null;
  checkPhoneExistence() {
    const phone = this.identityDetailsForm.get('phone')?.value;

    if (phone) {
      this.apiService.checkPhoneExist(phone).subscribe(
        (response: any) => {
          if (response && response.data) {
            // Check if email matches any record with user type 'CUSTOMER'
            const customerMatch = response.data.length > 0;

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
  checkEmailExistence() {
    const email = this.identityDetailsForm.get('customerEmail')?.value;

    if (email) {
      this.apiService.checkEmailExist(email).subscribe(
        (response: any) => {
          if (response && response.data) {
            // Check if email matches any record with user type 'CUSTOMER'
            const customerMatch = response.data.length > 0;

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

    filteredSourceUsers: any;

  searchTimeoutSource: any;
  userNotFound: boolean = false;
referredByError:any
 searchReferredByReferralCode(event: any) {
    const value = event.target.value;
    console.log("Search Value:", value.length);
    // Minimum characters
  

  if (!value || value.length < 6) {
      this.filteredSourceUsers = [];
      return;
    }
    // Debounce
    clearTimeout(this.searchTimeoutSource);

    this.searchTimeoutSource = setTimeout(() => {
      this.apiService
        .searchUserByReferralCode(
          this.identityDetailsForm.controls["customerReferredBy"].value,
        )
        .subscribe({
          next: (res: any) => {
            if (res?.responseCode === 200) {
              this.filteredSourceUsers = res?.data;
              this.userNotFound = false;
            } else {
              this.referredByError = res?.error
              this.filteredSourceUsers = null;
              this.userNotFound = true;
            }
          },
        });
    }, 400);
  }

  cancel() {
    this.dataSgaring.corpKycData(false);
  }
}
