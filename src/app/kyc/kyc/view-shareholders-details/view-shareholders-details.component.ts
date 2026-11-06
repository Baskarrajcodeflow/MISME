import { CommonModule } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { ApiServiceService } from "../../../product/api-service/api-service.service";
import { ActivatedRoute, Router } from "@angular/router";
import { KycModuleService } from "../kyc-module.service";
import { environment } from "../../../../environments/environment";
import { LoaderComponent } from "../../../loader/loader.component";
import { MatIconModule } from "@angular/material/icon";
import { AbstractControl, FormsModule, NgModel, ValidationErrors, ValidatorFn } from "@angular/forms";
import { CorporateService } from "../../../corporate/corporate.service";

@Component({
  selector: "app-view-shareholders-details",
  standalone: true,
  imports: [CommonModule, LoaderComponent, MatIconModule,FormsModule],
  templateUrl: "./view-shareholders-details.component.html",
  styleUrl: "./view-shareholders-details.component.css",
})
export class ViewShareholdersDetailsComponent {
  responseData: any;
  kycId: any;
  userStatus: any;
  submittedForId: any;
  getFlag: any;

  constructor(
    private apiService: ApiServiceService,
    private router: Router,
    private KycService: KycModuleService,
    private route: ActivatedRoute,
    private masterAgentService:CorporateService,
    private corporate: CorporateService,
  ) { }
  shareHolderArray: any;
  data: any;
  imageUrl = environment.apiUrl;
  isLoading: boolean = false;
  userPrivileges: any;
  kycPrivelege: any;
  // data:any
  getImagesProfile(signatory: any, imgParam: any, propertyName: string) {
    if (imgParam) {
      this.KycService.getImage(imgParam).subscribe((res) => {
        const objectURL = URL.createObjectURL(res);
        signatory[propertyName] = objectURL; 
      });
    }
  }
  ngOnInit(): void {
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

    this.getCountries();
    // this.getDistricts()
    this.getProvinces();

    this.route.paramMap.subscribe(params => {
      this.kycId = params.get('kycId');
      console.log('kycId:', this.kycId);
    });
    this.isLoading = true;
    this.shareHolderArray = this.KycService.getShareHolderArray();
    this.KycService.getKYCShareHoldresData(this.kycId).subscribe({
      next: (res) => {
        this.responseData = res?.data
        if (res?.responseCode == 200) {
          this.isLoading = false;
          this.getFlag = res?.data?.masterAgentKyc
          if (res?.data?.corporateKyc) {
            this.submittedForId = res?.data?.submittedFor?.id
            this.userStatus = res?.data?.status
            this.data = res?.data?.corporateKyc?.shareholders;
            this.data.forEach((shareholders: any) => {
              console.log(shareholders);
              this.getImagesProfile(shareholders, shareholders?.idProofFrontPhoto, 'idProofFrontPhotoUrl');
            });
          }
          else if (res?.data?.masterAgentKyc) {
            console.log(res?.data,'new++++++++++');
            this.submittedForId = res?.data?.submittedFor?.id
            this.userStatus = res?.data?.status
            this.data = res?.data?.masterAgentKyc?.shareholders;
            this.data.forEach((shareholders: any) => {
              console.log(shareholders);
              this.getImagesProfile(shareholders, shareholders?.idProofFrontPhoto, 'idProofFrontPhotoUrl');
              this.getImagesProfile(shareholders, shareholders?.idProofBackPhoto, 'idProofBackPhotoUrl');
            });
          }
        } else {
          this.isLoading = false;
          alert(res?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something Went Wrong");
      },
    });
  }
  goback() {
    if (this.responseData?.corporateKyc) {
      this.router.navigate(["kyc/view-superagent-kyc"]);
    }
    else if (this.responseData?.masterAgentKyc) {
      this.router.navigate(["kyc/view-masteragent-kyc"]);
    }
  }
  isEditing: number | null = null;
  editableField: string | null = null;
  editableValue: string = '';
  

  enableEdit(item: any, field: string) {
    console.log(field);
    
    this.isEditing = item.id;
    this.editableField = field;
    this.editableValue = item[field];
  }
  
  cancelEdit() {
    this.isEditing = null;
    this.editableField = null;
    this.editableValue = '';
  }
  
  clickSend(itemData: any, field: string) {
    console.log(field);
    
    if (!this.editableValue.trim()) return;
  
    const confirmChange = window.confirm(`Do you want to update ${field} to "${this.editableValue}"?`);
    if (!confirmChange) return;
  
    let request = {
      kycType: "SUPER_AGENT",
      submittedFor: this.submittedForId,
      kycInputs: {
        shareholders: [
          {
            id: itemData.id,
            [field]: this.editableValue,
          }
        ]
      }
    };
  console.log(request);
  if(this.getFlag){
    this.isLoading = true
      this.masterAgentService.updateMasterAgentRegisterKYC(request).subscribe((response: any) => {
        if (response?.responseCode === 200) {
          this.masterAgentService.completeMasterAgentRegisterKYC(this.submittedForId).subscribe((data: any) => {
            if (data?.responseCode === 200) {
            this.isLoading = false
              alert('Updated Successfully');
              itemData[field] = this.editableValue; 
              this.cancelEdit(); 
            }
          });
        } else {
          this.isLoading = false
          alert("Update failed");
        }
      });
  }else{
    this.isLoading = true
      this.masterAgentService.corporateKYCUpdate(request).subscribe((response: any) => {
        if (response?.responseCode === 200) {
          this.masterAgentService.completeRegisterKYC(this.submittedForId).subscribe((data: any) => {
            if (data?.responseCode === 200) {
            this.isLoading = false
              alert('Updated Successfully');
              itemData[field] = this.editableValue; 
              this.cancelEdit(); 
            }
          });
        } else {
          this.isLoading = false
          alert("Update failed");
        }
      }); 
  }
  }

  onFileSelectedForProfile(event:any,item:any){
    console.log(event,item);
    if(this.getFlag){
      this.isLoading = true
      this.corporate.submitmasterAgentKYCShareholderFiles('idProofFrontPhoto', this.submittedForId, item?.id, event.target.files[0]).subscribe({
        next:(res)=>{
          console.log(res);
          if(res?.responseCode == 200){
            this.isLoading = false
            this.cancelEdit(); 
            alert('File Updated Successfully')
          }else{
            this.isLoading = false
            alert(res?.error)
          }
        },error:()=>{
          this.isLoading = false
          alert('Something Went Wrong!!!')
        }
      })
    }else{
      this.isLoading = true
      this.corporate.submitCorporateKYCShareholderFiles('idProofFrontPhoto', this.submittedForId, item?.id, event.target.files[0]).subscribe({
        next:(res)=>{
          console.log(res);
          if(res?.responseCode == 200){
            this.isLoading = false
            this.cancelEdit(); 
            alert('File Updated Successfully')
          }else{
            this.isLoading = false
            alert(res?.error)
          }
        },error:()=>{
          this.isLoading = false
          alert('Something Went Wrong!!!')
        }
      })
    }
  }
  nationalities: any;
  provinces: any;

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
  currentDistricts: any[] = [];

  // onSelectProvince($event: any, type?: string) {
  //   this.provinceId = $event.target.value;
  //   console.log(this.provinceId);
  //   const filteredProvinces = this.provinces.filter((province: any) => province.name === this.provinceId);
  //   if (filteredProvinces && filteredProvinces.length > 0) {
  //     this.selectedProvinceName = filteredProvinces[0].id;
  //     console.log("Hi", this.selectedProvinceName);
  //   }

  //   (type) ? this.getDistricts(this.selectedProvinceName, type) : this.getDistricts(this.selectedProvinceName);
  // }
  // getDistricts(provinceId: number, type?: string) {

  //   this.corporate.getdistricts(provinceId).subscribe({
  //     next: (data: any) => {
  //       if (type && type == 'current') {
  //         //this.currentDistrictsArray.push({index:index,provinceId : provinceId);
  //         this.currentDistricts = data?.data;



  //       }
  //       else
  //         this.districts = data?.data;
  //     }
  //   });
  // }

  ageValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const today = new Date();
      const birthDate = new Date(control.value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      const isUnderage = age < 18 || (age === 18 && monthDifference < 0);
      const isOverage = age > 100 || (age === 100 && monthDifference < 0);

      if (isUnderage) {
        return { underage: true };
      }

      if (isOverage) {
        return { overage: true };
      }

      return null;
    };
  }

  @ViewChild('dob') dobModel!: NgModel;

  ngAfterViewInit() {
    // 👇 Apply validator directly to the NgModel instance
    this.dobModel.control.setValidators([this.ageValidator()]);
    this.dobModel.control.updateValueAndValidity();
  }

  onDobChange(dobModel: NgModel) {
    if (dobModel?.control) {
      dobModel.control.setValidators([this.ageValidator()]);
      dobModel.control.updateValueAndValidity();
    }
  }
  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault(); // block non-numeric keys
    }
  }
  viewFile(fileUrl: string) {
    console.log(fileUrl,'filePath')
    // window.open(fileUrl, '_blank');  // Opens the file in a new tab
    this.KycService.getImageAndOpen(fileUrl)

  }
}