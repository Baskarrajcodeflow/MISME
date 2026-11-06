import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-company-authorize-person-details',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,NgFor],
  templateUrl: './company-authorize-person-details.component.html',
  styleUrl: './company-authorize-person-details.component.css'
})
export class CompanyAuthorizePersonDetailsComponent {
  detailsForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.detailsForm = this.fb.group({
      companyAuthorizePersonDetails: ['', Validators.required],
      alternativePhoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      address: ['', Validators.required],
      sourceOfIncomeOccupation: ['', Validators.required],
      monthlyIncome: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    });
  }

  onSubmit() {
    if (this.detailsForm.valid) {
      console.log(this.detailsForm.value);
      // Handle form submission, e.g., send the data to the server
    } else {
      console.log('Form is invalid');
    }
  }
}