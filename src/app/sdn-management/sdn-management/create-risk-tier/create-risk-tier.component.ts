import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-risk-tier',
  templateUrl: './create-risk-tier.component.html',
  styleUrls: ['./create-risk-tier.component.scss']
})
export class CreateRiskTierComponent implements OnInit {
  public addRiskTierForm: FormGroup = new FormGroup({});
  public tier: FormControl = new FormControl('', [Validators.required]);
  public from: FormControl = new FormControl('', [Validators.required]);
  public to: FormControl = new FormControl('', [Validators.required]);
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.initForm();
  }
  private initForm() {
    this.addRiskTierForm.addControl('tier', this.tier);
    this.addRiskTierForm.addControl('from', this.from);
    this.addRiskTierForm.addControl('to', this.to);
  }
  onClickSubmit() {
    let req = {
      riskTier: this.tier.value,
      fromScore: this.from.value,
      toScore: this.to.value
    }
    this.userService.addRiskTier(req).subscribe((data: any) => {
      if (data?.code == 100) {
        alert(data?.message);
      }
      else {
        alert(data?.message);
      }
    })
  }
}
