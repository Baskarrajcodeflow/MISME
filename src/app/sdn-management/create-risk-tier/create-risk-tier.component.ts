import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../user-management/user-management/user-management/user.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { AmlService } from '../aml.service';

@Component({
  selector: 'app-create-risk-tier',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule,
    NgFor, NgIf, NgClass
  ],
  templateUrl: './create-risk-tier.component.html',
  styleUrls: ['./create-risk-tier.component.scss']
})
export class CreateRiskTierComponent implements OnInit {
  public createForm: FormGroup = new FormGroup({});
  public riskTier: FormControl = new FormControl('', [Validators.required]);
  public fromScore: FormControl = new FormControl('', [Validators.required,Validators.max(100)]);
  public toScore: FormControl = new FormControl('', [Validators.required,Validators.max(100)]);
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
  RiskTierVaLue: any;
  isLoading: boolean = false;
  constructor(private amlService: AmlService) { }

  ngOnInit(): void {
    this.initForm();
    // this.getProvince();
    // this.getOccupation();
    // this.getIncome();
  }
  private initForm() {
    this.createForm.addControl('riskTier', this.riskTier);
    this.createForm.addControl('fromScore', this.fromScore);
    this.createForm.addControl('toScore', this.toScore);

  }
  onSelectRiskTier($event: any) {
    this.RiskTierVaLue = $event.target.value;
  }

  AddRiskTierABMMC() {
    if (this.createForm.valid) {
      let req = {
        "riskTier": this.RiskTierVaLue,
        "fromScore": this.fromScore.value,
        "toScore": this.toScore.value
      }
      this.isLoading = true
      this.amlService.addRiskTierABMMC(req).subscribe((data: any) => {
        this.isLoading = false
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
