import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { BusinessProfileComponent } from '../../../kyc/business-profile/business-profile.component';
import { CompanyAuthorizePersonDetailsComponent } from '../../../kyc/company-authorize-person-details/company-authorize-person-details.component';
import { CustomerKycComponent } from '../../../kyc/customer-kyc/customer-kyc.component';
import { NextOfKinComponent } from '../../../kyc/next-of-kin/next-of-kin.component';
import { PersonalDetailsComponent } from '../../../kyc/personal-details/personal-details.component';
import { UserService } from '../../../user.service';
import { MiPayAgent, MiRole, UserManagementService } from '../../../openapi';
import { IndividualKYCService } from '../../kyc.service';
import { LoaderComponent } from '../../../../../../loader/loader.component';

interface imageUpload {
  type: any,
  file: any,
}

@Component({
  selector: 'app-agent-view',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf,
    CustomerKycComponent,NextOfKinComponent,LoaderComponent,
    PersonalDetailsComponent,
    BusinessProfileComponent,CompanyAuthorizePersonDetailsComponent],
  templateUrl: './agent-view.component.html',
  styleUrls: ['./agent-view.component.css']
})
export class AgentViewComponent implements OnInit {

  @Input() backOffice?: MiPayAgent;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Output() saveBasicDetails = new EventEmitter<void>();

  agentForm: FormGroup;
  kycForm:FormGroup;
  typeAgent: any;
  currentPage: number = 1;
  formValues: any;
  CountryList: any;
  provinceList: any;
  districtList: any;
  provinceId: any;
  selectedProvinceName: any;
  genderValue: any;
  request: any;
  agentData: any;
  isLoading: boolean = false;
  agentId: any;
  type: any;
  uploadedImage: any;
  uploadedImageFileName: any;
  uploadedImageFileType: any;
  uploadedImageFileNameExtension: any;
  uploadedImageFileData: any;
  imageValue: imageUpload[] = []
  type1: any;
  uploadedImageUndertaken: any;
  uploadedImageFileType1: any;
  uploadedImage1: any;
  photoUploaded: boolean = false;
  signatureUploaded: boolean = false;
  provinceReq: any;
  provinceValue: any;
  countryValue: any;
  country_id: any;

  constructor(private fb: FormBuilder,private addKyc: IndividualKYCService, private agentService: UserManagementService, private userService:UserService) {
    
    this.agentForm = this.fb.group({
      id: [''],
      email: ['', Validators.email],
      username: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      userType: ['AGENT'],
      role: [null],
      gender: [''],
      agentType: [''],
      accountType: ['AGENT'],
      password: [],
    });

    this.kycForm = this.fb.group({
      custInfoFirstName: ['',[Validators.required,Validators.pattern('[a-zA-Z]+'), Validators.minLength(3)]],
      custInfoLastName: ['',,[Validators.required,Validators.pattern('[a-zA-Z]+')]],
      custInfoFatherName: ['', [Validators.required,Validators.pattern('[a-zA-Z]+')]],
      custInfoDob: ['', [Validators.required,this.ageValidator]],
      gender: ['',Validators.required],
      custInfoCountry: ['',Validators.required],
      custInfoAltPhone: ['',[ Validators.required,Validators.pattern("^7[0-9]{8}$")]],
      custInfoEmail: ['',[Validators.required,Validators.email]],
      custInfoTazkira: ['', Validators.required],
      currHouseNo: [''],
      currLocation: ['', Validators.required],
      currProvince: ['',Validators.required],
      currStreet: [''],
      currDistrict: [''],
      currCountry: [''],
      occupation: [''],
      salary: [''],
      empName: [''],
      nokName: [''],
      nokMobile: ['',[Validators.pattern("^7[0-9]{8}$")]],
      nokEmail: ['', Validators.email],
      nokHouseNo: [''],
      nokLocation: [''],
      nokProvince: [''],
      nokStreet: [''],
      nokDistrict: [''],
      nokCountry: [''],
      orgName: [''],
      orgTypeOfActivity: [''],
      orgSourceOfIncome: [''],
      orgMonthlyIncome: ['', [Validators.pattern(/^\d+$/)]],
      orgTurnover: [''],
      orgHouseNo: [''],
      orgLocation: [''],
      orgProvince: [''],
      orgStreet: [''],
      orgDistrict: [''],
      orgCountry: [''],
      orgPhone: ['', [Validators.pattern("^7[0-9]{8}$")]],
      orgEmail: ['', [Validators.email]],
      custInfoLicenseNo: ['', Validators.required],
      custInfoLicenseExpiry: ['', Validators.required],
      agentType:'AGENT',
      password: ['',[Validators.required,Validators.minLength(6)]],
      agentPhoto_img_0: ['',Validators.required],
      undertakenSign_img_0 : ['',Validators.required],
      cnfpwd: ['',Validators.required]
    });
  }
  ngOnInit() {
    this.getCountries();
    this.getDistricts
    this.getProvinces();
    this.setBackOfficeForm();
  }

  nextPage() {
    this.currentPage++;
  }

  previousPage() {
    if (this.currentPage !== 1) {
      this.currentPage--;
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['backOffice'] && changes['backOffice'].currentValue) {
      this.setBackOfficeForm();
    }
  }

  getCountries(){
    this.isLoading = true;
    this.userService.getCountries().subscribe({
      next: (data: any) => {
        if (data) {
          this.CountryList = data?.data;
          this.isLoading = false;
        }
      },
    error: () => {
      this.isLoading = false;
      alert("Something went wrong");
    }
    });
  }

   getProvinces(){
    this.isLoading = true;
    this.userService.getprovinces().subscribe({
      next: (data: any) => {
        if(data){
        this.provinceList = data?.data;  
        this.isLoading = false;
      }   
      },
      error: () => {
        this.isLoading = false;
        alert("Something went wrong");
      }
    });
   }
   
   getDistricts(provinceId:number){
    this.isLoading = true;
    this.userService.getdistricts(provinceId).subscribe({
      next: (data: any) => {
        if(data){
          this.districtList = data?.data;        
          this.isLoading = false;
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something went wrong");
      }
    });
   }

  onSelectProvince($event:any){
    this.provinceId = $event.target.value;
    const filteredProvinces = this.provinceList.filter((province: any) => province.name === this.provinceId);
        if (filteredProvinces && filteredProvinces.length > 0) {
          this.selectedProvinceName = filteredProvinces[0].id;
        }
     this.getDistricts(this.selectedProvinceName);  
    }

  setBackOfficeForm() {
    if (this.backOffice) {
      this.agentForm.patchValue(this.backOffice);
    }
  }

  onGenderChange($event: any) {
    this.genderValue = $event.target.value;
    if (this.genderValue === '1') { 
      this.kycForm.removeControl('custInfoFemale');
      this.kycForm.addControl('custInfoMale', this.fb.control('1'));
    } else if (this.genderValue === '2') { 
      this.kycForm.removeControl('custInfoMale');
      this.kycForm.addControl('custInfoFemale', this.fb.control('1'));
    } else {
      this.kycForm.removeControl('custInfoMale');
      this.kycForm.removeControl('custInfoFemale');
    }
  }
  
  onSave() {
    this.formValues = {
      id: '',
      email: this.kycForm.value?.custInfoEmail,
      username: this.kycForm.value?.custInfoEmail,
      firstName: this.kycForm.value?.custInfoFirstName,
      lastName: this.kycForm.value?.custInfoLastName,
      phone: this.kycForm.value?.custInfoAltPhone,
      userType: 'AGENT',
      password: this.kycForm.value?.password,
      gender: this.kycForm.value?.gender,
      agentType: this.typeAgent,
      accountType: 'AGENT',
    }
    this.kycForm.removeControl('gender');
    this.kycForm.removeControl('password');
    this.kycForm.removeControl('agentType');
    this.kycForm.removeControl('agentPhoto_img_0');
    this.kycForm.removeControl('undertakenSign_img_0');
    const custInfoMale = this.kycForm.get('custInfoMale')?.value;


    const formValue = this.kycForm.value;
    // this.saveBasicDetails.emit(this.formValues);
    // this.save.emit(formValue);

    this.request = {
        kycInputs:formValue,
        miPayAgent: this.formValues
      }
      if (formValue.id == undefined) {
        this.agentService.registerAgent('','','',this.request).subscribe({
          next: (user: any) => {
            if (user) {
              this.agentData = user;
              this.agentId = this.agentData?.id;
              if (this.agentData) {
                this.retryUploadPhoto();
                // this.uploadUndertakenSignature();
              }
            }
          },
          error: () => {
            this.isLoading = false;
            alert("Something went wrong");
          }
        });
    }
  }

  onChangeCountry($event: any) {
    this.countryValue = $event.target.value;
    for (let item of this.CountryList) {
      if (this.countryValue == item?.name) {
        this.country_id = item?.id;
      }
    }
  }
  
  onChangeProvince($event: any) {
    this.provinceValue = $event.target.value;
    console.log("provinceValue", this.provinceValue);
    for (let item of this.provinceList) {
      if (this.provinceValue == item?.name) {
        this.provinceReq = item?.id;
        console.log("provinceReq", this.provinceReq);
      }
    }

    this.userService.getdistricts(this.provinceReq).subscribe((data: any) => {
      this.districtList = data?.data;
    })
  }

  formatTazkira(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\s+/g, ''); // Remove all spaces

    if (value.length > 16) {
      value = value.slice(0, 16); // Limit to 16 digits
    }

    let formattedValue = '';
    for (let i = 0; i < value.length; i += 4) {
      if (i > 0) {
        formattedValue += ' ';
      }
      formattedValue += value.substring(i, i + 4);
    }
    input.value = formattedValue;
    this.kycForm.get('custInfoTazkira')?.setValue(formattedValue, { emitEvent: false });
  }


  ageValidator(control: AbstractControl): ValidationErrors | null {
    const dob = new Date(control.value);
    const today = new Date();

      let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();
  
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
  
    // Validate age
    if (age >= 18) {
      return null; // Age is 18 or above
    }
  
    return { underage: true }; // Age is below 18
  }
  

  checkPasswords() {
    if (this.kycForm.controls['cnfpwd'].value == this.kycForm.controls['password'].value) {
      return '';
    } else {
      return 'Passwords did not match';
    }
  }

  retryUploadPhoto() {
    this.type = "agentPhoto_img_0";
    this.addKyc.agentImageUpload(this.uploadedImage, this.type, this.agentId).subscribe({
      next: (data: any) => {
        if (data?.responseCode == 200) {
          this.photoUploaded = true;
          this.retryUploadSignature();
        } else {
          this.isLoading = false;
          alert("agent photo upload failed, please try again.");
        }
      },
      error: () => {
        this.isLoading = false;
        alert("agent photo upload failed, please try again.");
      }
    });
  }

  retryUploadSignature() {
    this.type1 = "undertakenSign_img_0";
    this.addKyc.agentImageUpload(this.uploadedImageUndertaken, this.type1, this.agentId).subscribe({
      next: (data: any) => {
        if (data?.responseCode == 200) {
          this.signatureUploaded = true;
          this.isLoading = false;
          alert("Agent created successfully");
          this.kycForm.reset();
        } else {
          this.isLoading = false;
          alert("Undertaken signature upload failed, please try again.");
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Undertaken signature upload failed, please try again.");
      }
    });
  }

  detectFilesUndertaken(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadedImageUndertaken = event.target.files[0];
      this.uploadedImageFileName = event.target.files[0].name;
      this.uploadedImageFileType1 = event.target.files[0].type
      this.uploadedImageFileNameExtension = event.target.files[0].name.split('.').pop();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.uploadedImageFileData = reader.result;
      reader.onload = () => {
        this.uploadedImageFileData = reader.result;
      };
    }
    setTimeout(() => {
      let Req: imageUpload = {
        type: "SIGNATURE",
        file: this.uploadedImage1
      }
      this.imageValue.push(Req);

    }, 1800);

  }
  
  detectFiles(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.uploadedImage = event.target.files[0];
      this.uploadedImageFileName = event.target.files[0].name;
      this.uploadedImageFileType = event.target.files[0].type
      this.uploadedImageFileNameExtension = event.target.files[0].name.split('.').pop();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.uploadedImageFileData = reader.result;
      reader.onload = () => {
        this.uploadedImageFileData = reader.result;
      };
    }
    setTimeout(() => {
      let Req: imageUpload = {
        type: "PHOTO",
        file: this.uploadedImage
      }
      this.imageValue.push(Req);

    }, 1800);
  }
  onChangeCountry1($event: any) {
    this.countryValue = $event.target.value;
    for (let item of this.CountryList) {
      if (this.countryValue == item?.name) {
        this.country_id = item?.id;
      }
    }
  }
  
  onChangeProvince1($event: any) {
    this.provinceValue = $event.target.value;
    console.log("provinceValue", this.provinceValue);
    for (let item of this.provinceList) {
      if (this.provinceValue == item?.name) {
        this.provinceReq = item?.id;
        console.log("provinceReq", this.provinceReq);
      }
    }
    this.userService.getdistricts(this.provinceReq).subscribe((data: any) => {
      this.districtList = data?.data;
    })
  }

  onChangeCountry2($event: any) {
    this.countryValue = $event.target.value;
    for (let item of this.CountryList) {
      if (this.countryValue == item?.name) {
        this.country_id = item?.id;
      }
    }
  }
  
  onChangeProvince2($event: any) {
    this.provinceValue = $event.target.value;
    console.log("provinceValue", this.provinceValue);
    for (let item of this.provinceList) {
      if (this.provinceValue == item?.name) {
        this.provinceReq = item?.id;
        console.log("provinceReq", this.provinceReq);
      }
    }
    this.userService.getdistricts(this.provinceReq).subscribe((data: any) => {
      this.districtList = data?.data;
    })
  }
  onCancel() {
    this.cancel.emit();
  }
}
