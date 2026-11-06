import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgentViewComponent } from '../../bo/agents/agent-view/agent-view.component';
import { NgFor, NgIf } from '@angular/common';
import { SearchUserComponent } from '../../bo/search-user/search-user.component';

@Component({
  selector: 'app-business-profile',
  standalone: true,
  imports: [NgFor, AgentViewComponent,ReactiveFormsModule,NgIf],
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.css']
})
export class BusinessProfileComponent {
  @Output() profileSaved = new EventEmitter<any>();
  businessProfileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.businessProfileForm = this.fb.group({
      businessName: ['', Validators.required],
      businessSectorType: ['', Validators.required],
      businessLicenseIssuer: ['', Validators.required],
      businessMonthlyIncome: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      location: ['', Validators.required],
      district: ['', Validators.required],
      province: ['', Validators.required],
      nationality: ['', Validators.required],
      employerNameNatureOfBusiness: [''],
      businessPhoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      businessEmail: ['', [Validators.required, Validators.email]],
      businessLicenseNumber: ['', Validators.required],
      businessLicenseExpiryDate: ['', Validators.required],
      businessMonthlyTurnover: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      businessSourceOfIncome: ['', Validators.required],
    });
  }

  onSave() {
    if (this.businessProfileForm.valid) {
      this.profileSaved.emit(this.businessProfileForm.value);
    }
  }
}
