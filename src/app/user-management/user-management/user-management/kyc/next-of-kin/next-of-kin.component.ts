import { NgIf, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-next-of-kin',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,NgFor],
  templateUrl: './next-of-kin.component.html',
  styleUrl: './next-of-kin.component.css'
})
export class NextOfKinComponent {
  kinForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.kinForm = this.fb.group({
      name: ['', Validators.required],
      province: ['', Validators.required],
      district: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
    });
  }

  onSubmit() {
    if (this.kinForm.valid) {
      console.log(this.kinForm.value);
      // Handle form submission, e.g., send the data to the server
    } else {
      console.log('Form is invalid');
    }
  }

}
