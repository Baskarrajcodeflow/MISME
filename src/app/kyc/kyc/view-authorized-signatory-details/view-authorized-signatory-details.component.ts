import { Component, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiServiceService } from '../../../product/api-service/api-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { KycModuleService } from '../kyc-module.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../loader/loader.component';
import { MatIconModule } from '@angular/material/icon';
import { CorporateService } from '../../../corporate/corporate.service';
import { AbstractControl, FormsModule, NgModel, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-view-authorized-signatory-details',
  standalone: true,
  imports: [CommonModule, LoaderComponent, MatIconModule,FormsModule],
  templateUrl: './view-authorized-signatory-details.component.html',
  styleUrl: './view-authorized-signatory-details.component.css'
})
export class ViewAuthorizedSignatoryDetailsComponent {
  kycId: any;
  responseData: any;
  newFileProfile: any;
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
  authorizedSignArray: any
  data: any;
  imageUrl = environment.apiUrl;
  isLoading: boolean = false;
  userStatus: any;
  submittedForId: any;
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
    this.getCountries()
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
    this.route.paramMap.subscribe(params => {
      this.kycId = params.get('kycId');
      console.log('kycId:', this.kycId);
    });
    this.isLoading = true;
    this.shareHolderArray = this.KycService.getShareHolderArray();
    this.authorizedSignArray = this.KycService.getAuthorizedSignArray();

    this.KycService.getAuthorizedData(this.kycId).subscribe({
      next: (res) => {
        this.responseData = res?.data
        if (res?.responseCode == 200) {
          this.isLoading = false;
          this.getFlag = res?.data?.masterAgentKyc
          if (res?.data?.corporateKyc) {
            this.submittedForId = res?.data?.submittedFor?.id
            this.userStatus = res?.data?.status
            this.data = res?.data?.corporateKyc?.signatories;
            this.data.forEach((signatory: any) => {
              console.log(signatory);
              this.getImagesProfile(signatory, signatory?.idProofFrontPhoto, 'idProofFrontPhotoUrl');
              this.getImagesProfile(signatory, signatory?.signaturePhoto, 'signaturePhotoUrl');
              this.getImagesProfile(signatory, signatory?.signatoryPhoto, 'signatoryPhotoUrl');
            });
          }
          else if (res?.data?.masterAgentKyc) {
            this.submittedForId = res?.data?.submittedFor?.id
            this.userStatus = res?.data?.status
            this.data = res?.data?.masterAgentKyc?.signatories;
            this.data.forEach((signatory: any) => {
              console.log(signatory);
              this.getImagesProfile(signatory, signatory?.idProofFrontPhoto, 'idProofFrontPhotoUrl');
              this.getImagesProfile(signatory, signatory?.idProofBackPhoto, 'idProofBackPhotoUrl');
              this.getImagesProfile(signatory, signatory?.signaturePhoto, 'signaturePhotoUrl');
              this.getImagesProfile(signatory, signatory?.signatoryPhoto, 'signatoryPhotoUrl');
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
      // this.router.navigate(["kyc/view-superagent-kyc", this.kycId]);
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
        signatories: [
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
  onFileSelectedForProfile(event:any,item:any,field:any){
    console.log(event,item,field);
if(this.getFlag){
  this.isLoading = true
  this.corporate.submitMasterKYCSignatoryFiles(field, this.submittedForId, item?.id, event.target.files[0]).subscribe({
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
  this.corporate.submitCorporateKYCSignatoryFiles(field, this.submittedForId, item?.id, event.target.files[0]).subscribe({
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
      console.log(fileUrl)
      // window.open(fileUrl, '_blank');  // Opens the file in a new tab
      this.KycService.getImageAndOpen(fileUrl)
  
    }
}


