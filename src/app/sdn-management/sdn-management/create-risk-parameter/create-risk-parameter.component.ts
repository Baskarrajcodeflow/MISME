import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-risk-parameter',
  templateUrl: './create-risk-parameter.component.html',
  styleUrls: ['./create-risk-parameter.component.scss']
})
export class CreateRiskParameterComponent implements OnInit {
  public addRiskParameterForm: FormGroup = new FormGroup({});
  public riskType: FormControl = new FormControl('', [Validators.required]);
  // public riskValue: FormControl = new FormControl('', [Validators.required]);
  public riskScore: FormControl = new FormControl('', [Validators.required]);
  public customer: FormControl = new FormControl('', [Validators.required]);
  public description: FormControl = new FormControl('', [Validators.required]);
  public province: FormControl = new FormControl('', [Validators.required]);
  public occupation: FormControl = new FormControl('', [Validators.required]);
  public income: FormControl = new FormControl('', [Validators.required]);
  public product: FormControl = new FormControl('', [Validators.required]);
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
  showProduct: boolean= false;
  productList: any;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.initForm();
    // this.getProvince();
    // this.getOccupation();
    // this.getIncome();
  }
  private initForm() {
    this.addRiskParameterForm.addControl('riskType', this.riskType);
    // this.addRiskParameterForm.addControl('riskValue', this.riskValue);
    this.addRiskParameterForm.addControl('riskScore', this.riskScore);
    this.addRiskParameterForm.addControl('customer', this.customer);
    this.addRiskParameterForm.addControl('description', this.description);
    this.addRiskParameterForm.addControl('province', this.province);
    this.addRiskParameterForm.addControl('occupation', this.occupation);
    this.addRiskParameterForm.addControl('income', this.income);
    this.addRiskParameterForm.addControl('product', this.product);

  }
  onChangeRiskType() {
    this.RiskTypeVaLue = this.riskType.value;
    if (this.RiskTypeVaLue == "PRODUCT") {
      this.getProduct();
      this.showProduct=true;
      this.showVolume = false;
      this.showProvince = false;
      this.showOccupation = false;
      this.showIncome = false;
      // this.RISK_VALUE = "";
    }
    if (this.RiskTypeVaLue == "PROVINCE") {
      this.getProvince();
      this.showProvince = true;
      this.showOccupation = false;
      this.showIncome = false;
      this.showVolume = false;
    }
    if (this.RiskTypeVaLue == "OCCUPATION") {
      this.getOccupation();
      this.showOccupation = true;
      this.showProvince = false;
      this.showIncome = false;
      this.showVolume = false;
    }
    if (this.RiskTypeVaLue == "INCOME") {
      this.getIncome();
      this.showIncome = true;
      this.showProvince = false;
      this.showOccupation = false;
      this.showVolume = false;
    }
    if (this.RiskTypeVaLue == "TXN_VOL_DAY") {
      this.getVolume();
      this.showVolume = true;
      this.showProvince = false;
      this.showOccupation = false;
      this.showIncome = false;
    }
    if (this.RiskTypeVaLue == "PEP") {
      this.showVolume = false;
      this.showProvince = false;
      this.showOccupation = false;
      this.showIncome = false;
      this.RISK_VALUE = "";
    }
  }
  onChangeProduct($event: any){
    if (this.RiskTypeVaLue == "PRODUCT") {
      this.RISK_VALUE = $event.target.value;
    }
  }
  onChangeProvince($event: any) {
    if (this.RiskTypeVaLue == "PROVINCE") {
      this.RISK_VALUE = $event.target.value;
    }
  }
  onChangeOccupation($event: any) {
    if (this.RiskTypeVaLue == "OCCUPATION") {
      this.RISK_VALUE = $event.target.value;
    }
  }
  onChangeIncome($event: any) {
    if (this.RiskTypeVaLue == "INCOME") {
      this.RISK_VALUE = $event.target.value;
    }
  }
  onChangeVolume($event: any) {
    if (this.RiskTypeVaLue == "TXN_VOL_DAY") {
      this.RISK_VALUE = $event.target.value;
    }
  }
  getProduct() {
    this.userService.getProduct().subscribe((data: any) => {
      this.productList = data?.response;
    })
  }
  getProvince() {
    this.userService.getProvince().subscribe((data: any) => {
      this.provinceList = data?.response;
    })
  }
  getOccupation() {
    this.userService.getOccupation().subscribe((data: any) => {
      this.OccupationList = data?.response;
    })
  }
  getIncome() {
    this.userService.getIncome().subscribe((data: any) => {
      this.incomeList = data?.response;
    })
  }
  getVolume() {
    this.userService.getVolume().subscribe((data: any) => {
      this.volumeList = data?.response;
    })
  }
  onClickSubmit() {
    let req = {

      riskType: this.riskType.value,
      riskValue: this.RISK_VALUE,
      score: this.riskScore.value,
      userType: this.customer.value,
      description: this.description.value

    }
    this.userService.addRiskParameter(req).subscribe((data: any) => {
      if (data?.code == 100) {
        alert(data?.message);
        window.location.reload();
      }
      else {
        alert(data?.message);
      }
    })
  }
}
