import { NgFor, NgIf, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AmlService } from '../aml.service';
import { CorporateService } from '../../corporate/corporate.service';

@Component({
  selector: 'app-create-risk-parameter',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule,
    NgFor, NgIf, NgClass
  ],
  templateUrl: './create-risk-parameter.component.html',
  styleUrls: ['./create-risk-parameter.component.scss']
})
export class CreateRiskParameterComponent implements OnInit {
  public createForm: FormGroup = new FormGroup({});
  public riskType: FormControl = new FormControl('', [Validators.required]);
  public riskValue: FormControl = new FormControl('');
  public userType: FormControl = new FormControl('', [Validators.required]);
  public Score: FormControl = new FormControl('', [Validators.required,Validators.max(100)]);
  public desc: FormControl = new FormControl('');

  provinceList: any;
  // RiskTypeVaLue: any;
  OccupationList: any;
  showProvince: boolean = false;
  showOccupation: boolean = false;
  incomeList: any;
  showIncome: boolean = false;
  provinceValue: any;
  RISK_VALUE: any;
  volumeList: any;
  showVolume: boolean = false;
  RiskTypeVaLue: any;
  showProduct: boolean = false;
  productList: any;
  userTypeVaLue: any;
  isLoading: boolean=false;
  provinceId: any;
  selectedProvinceName: any;
  provinces: any;
  showRiskCommon: boolean=true;
  constructor(private amlService: AmlService,
    private corporate: CorporateService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getProvinces();
    // this.getOccupation();
    // this.getIncome();
  }
  private initForm() {
    this.createForm.addControl('riskType', this.riskType);
    // this.addRiskParameterForm.addControl('riskValue', this.riskValue);
    this.createForm.addControl('riskValue', this.riskValue);
    this.createForm.addControl('Score', this.Score);
    this.createForm.addControl('userType', this.userType);
    this.createForm.addControl('desc', this.desc);

  }
  onSelectRiskType($event: any) {
    this.RiskTypeVaLue = $event.target.value;
    if(this.RiskTypeVaLue=="GEO_LOCATION"){
      this.showProvince=true
      this.showRiskCommon=false
       }
    else{
      this.showProvince=false
      this.showRiskCommon=true
    }
  }
  onSelectUserType($event: any) {
    this.userTypeVaLue == $event.target.value;
  }
  getProvinces() {
    this.corporate.getprovinces().subscribe({
      next: (data: any) => {
        this.provinces = data?.data;
      }
    });
  }
  onSelectProvince($event: any) {
    this.provinceId = $event.target.value;
    const filteredProvinces = this.provinces.filter((province: any) => province.name === this.provinceId);
    if (filteredProvinces && filteredProvinces.length > 0) {
      this.selectedProvinceName = filteredProvinces[0].id;
    }
  }
  AddRiskParamABMMC() {
    if (this.createForm.valid) {
    let req = {
      "riskParamType": this.riskType.value,
      "riskValue": this.riskValue.value,
      "score": this.Score.value,
      "userType": this.userType.value,
      "description": this.desc.value,
    }
    this.isLoading=true
    this.amlService.addRiskParamABMMC(req).subscribe((data: any) => {
    this.isLoading=false
    if (data) {
        alert("Success");
      }
      else {
        alert("Failed");
      }
    })
  }
  }
}
