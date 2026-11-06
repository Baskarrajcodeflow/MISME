import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MiPayAgent, UserManagementService } from '../../../openapi';
import { NgFor, NgIf } from '@angular/common';
import { UserService } from '../../../user.service';
import { LoaderComponent } from '../../../../../../loader/loader.component';
import { IndividualKYCService } from '../../kyc.service';
interface imageUpload {
  type: any,
  file: any,
}
@Component({
  selector: 'app-sub-agent-view',
  standalone: true,
  imports : [ReactiveFormsModule,NgFor,NgIf,LoaderComponent],
  templateUrl: './sub-agent-view.component.html',
  styleUrls: ['./sub-agent-view.component.css']
})
export class SubAgentViewComponent {

  @Input() backOffice?: MiPayAgent;
  @Output() save = new EventEmitter<MiPayAgent>();
  @Output() cancel = new EventEmitter<void>();
  @Output() saveParentId = new EventEmitter<any>();
  @Input() disableField!:boolean;

  subAgentForm: FormGroup;
  agents!: MiPayAgent[];
  parentId: any;
  agentName: any;
  isActiveAgentDropDown: boolean = false;
  countryVal: any;
  countryValue: any;
  country_id: any;
  provinceReq: any;
  districtReq: any;
  countryId!: number;
  provinceList: any;
  provinceValue: any;
  showProvinceDrop: boolean = true;
  showProvinceText!: boolean;
  showDistrictDrop: boolean = true;
  showDistrictText!: boolean;
  districtList: any;
  CountryList: any;
  isLoading: boolean = false;
  request: any;
  formValues: any;
  genderValue: any;
  uploadedImageUndertaken: any;
  uploadedImageFileType1: any;
  uploadedImageFileName: any;
  uploadedImageFileNameExtension: any;
  uploadedImageFileData: any;
  imageValue: imageUpload[] = []
  uploadedImage1: any;
  type: any;
  type1: any;
  uploadedImage: any;
  uploadedImageFileType: any;
  subagentDetails: any;
  subAgentId: any;
  signatureUploaded: boolean = false;
  photoUploaded: boolean = false;

  constructor(private fb: FormBuilder, private boService: UserManagementService, private addKyc: IndividualKYCService, private userService:UserService, private subAgentService:UserManagementService) {
    this.subAgentForm = this.fb.group({
      custInfoFirstName: ['', [Validators.required,Validators.pattern('[a-zA-Z]+'), Validators.minLength(3)]],
      custInfoLastName: ['',Validators.required],
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
      currDistrict: ['',Validators.required],
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
      agentType: ['SUBAGENT'],
      companyName: [''],
      commissionPercentage: ['',[Validators.pattern(/^\d+$/)]],
      password: ['', [Validators.required,Validators.minLength(6)]],
      cnfpwd: ['',Validators.required],
      agentPhoto_img_0: ['',Validators.required],
      undertakenSign_img_0 : ['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.setBackOfficeForm();
    this.getCountryList();
    this.getAllAgents();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['backOffice'] && changes['backOffice'].currentValue) {
      this.setBackOfficeForm();
    }
  }

  setBackOfficeForm() {
    if (this.backOffice) {
      this.subAgentForm.patchValue(this.backOffice);
    }
  }
  
  getAllAgents(){
    this.isLoading = true;
    this.boService.getAllAgents().subscribe({
      next: (agents: any) => {
        if(agents){
          this.agents = agents;
          this.isLoading = false
        }
      },error: () => {
        this.isLoading = false;
        alert("Something went wrong");
      }
    });
  }

  onSelectAgent(event: any) {
    this.parentId = event.target.value;
    for (let item of this.agents) {
      if (this.parentId == item?.id) {
        this.agentName = item?.parent;
        this.isActiveAgentDropDown = true;
      }
    }
  }

  getCountryList() {
    this.isLoading = true;
    this.userService.getCountries().subscribe({
      next: (data: any) => {
      this.CountryList = data?.data;
      if(data){
        this.isLoading = false;
        this.getProvinceList();
      }
    },error: () => {
      this.isLoading = false;
      alert("Something went wrong");
    }
    })
  }
  
  getProvinceList() {
    this.countryId = 1
    this.userService.getprovinces().subscribe((data: any) => {
      this.provinceList = data?.data;
    })
  }

  onChangeCountry($event: any) {
    this.countryValue = $event.target.value;
    for (let item of this.CountryList) {
      if (this.countryValue == item?.name) {
        this.country_id = item?.id;
      }
    }
    if (this.country_id == 1) {
      this.showProvinceDrop = true
      this.showProvinceText = false
    }
    else {
      this.showProvinceText = true;
      this.showProvinceDrop = false;
      this.showDistrictText = true;
      this.showDistrictDrop = false;
      console.log("provinceReq", this.provinceReq);
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
    if (this.provinceReq) {
      this.showDistrictDrop = true;
      this.showDistrictText = false
    }
    else {
      this.showDistrictText = true;
      this.showDistrictDrop = false;
    }

    this.userService.getdistricts(this.provinceReq).subscribe((data: any) => {
      this.districtList = data?.data;
    })
  }

  onChangeCountry1($event: any) {
    this.countryValue = $event.target.value;
    for (let item of this.CountryList) {
      if (this.countryValue == item?.name) {
        this.country_id = item?.id;
      }
    }
    if (this.country_id == 1) {
      this.showProvinceDrop = true
      this.showProvinceText = false
    }
    else {
      this.showProvinceText = true;
      this.showProvinceDrop = false;
      this.showDistrictText = true;
      this.showDistrictDrop = false;
      console.log("provinceReq", this.provinceReq);
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
    if (this.provinceReq) {
      this.showDistrictDrop = true;
      this.showDistrictText = false
    }
    else {
      this.showDistrictText = true;
      this.showDistrictDrop = false;
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
    if (this.country_id == 1) {
      this.showProvinceDrop = true
      this.showProvinceText = false
    }
    else {
      this.showProvinceText = true;
      this.showProvinceDrop = false;
      this.showDistrictText = true;
      this.showDistrictDrop = false;
      console.log("provinceReq", this.provinceReq);
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
    if (this.provinceReq) {
      this.showDistrictDrop = true;
      this.showDistrictText = false
    }
    else {
      this.showDistrictText = true;
      this.showDistrictDrop = false;
    }

    this.userService.getdistricts(this.provinceReq).subscribe((data: any) => {
      this.districtList = data?.data;
    })
  }

  ageValidator(control: AbstractControl): ValidationErrors | null {
    const custInfoDob = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - custInfoDob.getFullYear();
    const monthDifference = today.getMonth() - custInfoDob.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < custInfoDob.getDate())
    ) {
      return { underage: true };
    }

    if (age > 18 || (age === 18 && monthDifference >= 0 && today.getDate() >= custInfoDob.getDate())) {
      return null; // Age is above 18
    }
    return { underage: true }; // Age is below 18
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
    this.subAgentForm.get('custInfoTazkira')?.setValue(formattedValue, { emitEvent: false });
  }

  checkPasswords() {
    if (this.subAgentForm.controls['cnfpwd'].value == this.subAgentForm.controls['password'].value) {
      return '';
    } else {
      return 'Passwords did not match';
    }
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

  onSave() {
    this.formValues = {
      id: '',
      userType: 'AGENT',
      agentType: this.subAgentForm.value?.agentType,
      accountType: 'AGENT',
      companyName: this.subAgentForm.value?.companyName,
      firstName: this.subAgentForm.value?.custInfoFirstName,
      lastName: this.subAgentForm.value?.custInfoSurname,
      licenseNumber: this.subAgentForm.value?.custInfoLicenseNo,
      email: this.subAgentForm.value?.custInfoEmail,
      phone: this.subAgentForm.value?.custInfoAltPhone,
      gender : this.subAgentForm.value.gender,
      password: this.subAgentForm.value?.password,
    }
    this.subAgentForm.removeControl('gender');
    this.subAgentForm.removeControl('password');
    this.subAgentForm.removeControl('cnfpwd');
    this.subAgentForm.removeControl('accountType');
    this.subAgentForm.removeControl('companyName');
    this.subAgentForm.removeControl('username');
    this.subAgentForm.removeControl('agentPhoto_img_0');
    this.subAgentForm.removeControl('undertakenSign_img_0');
    this.subAgentForm.removeControl('agentType');

    const custInfoMale = this.subAgentForm.get('custInfoMale')?.value;
    const formValue = this.subAgentForm.value;
   
    this.request = {
        kycInputs:formValue,
        miPayAgent: this.formValues
      }
    
    if (this.subAgentForm.get('gender')?.value === 'MALE') {
      formValue.custInfoMale = 1;
      delete formValue.custInfoFemale;
    } else if (this.subAgentForm.get('gender')?.value === 'FEMALE') {
      formValue.custInfoFemale = 1;
      delete formValue.custInfoMale;
    }
    console.log(this.request?.kycInputs,"kycInputs");
    console.log(this.request?.miPayAgent,"miPayAgent");
    this.isLoading = true;

        this.addKyc.registerSubAgent(this.parentId,this.request).subscribe({
          next: (user: any) => {
            if (user) {
              this.subagentDetails = user?.data;
              this.subAgentId = this.subagentDetails?.id;
              if (this.subagentDetails) {
                this.retryUploadPhoto();
                // this.uploadUndertakenSignature();
              }
            }
          },
          error: () => {
            this.isLoading = false;
            alert("Something went wrong");
          }
        })      
    }
  
  
    retryUploadPhoto() {
      this.type = "agentPhoto_img_0";
      this.addKyc.agentImageUpload(this.uploadedImage,this.type,this.subAgentId).subscribe({
        next: (data: any) => {
          if (data?.responseCode == 200) {
            this.photoUploaded = true;
            this.retryUploadSignature();
          } else {
            this.isLoading = false;
            alert("subagent photo upload failed, please try again.");
          }
        },
        error: () => {
          this.isLoading = false;
          alert("subagent photo upload failed, please try again.");
        }
      });
    }
  
    retryUploadSignature() {
      this.type1 = "undertakenSign_img_0";
      this.addKyc.agentImageUpload(this.uploadedImageUndertaken, this.type1, this.subAgentId).subscribe({
        next: (data: any) => {
          if (data?.responseCode == 200) {
            this.signatureUploaded = true;
            this.isLoading = false;
            alert("Subagent created successfully");
            this.subAgentForm.reset();
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
  
  
  onCancel() {
    this.cancel.emit();
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
}
