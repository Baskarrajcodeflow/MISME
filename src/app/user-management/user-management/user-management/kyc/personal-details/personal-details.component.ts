import { NgIf, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,NgFor],
  templateUrl: './personal-details.component.html',
  styleUrl: './personal-details.component.css'
})
export class PersonalDetailsComponent {



  
    detailsForm: FormGroup;
  
    constructor(private fb: FormBuilder) {
      this.detailsForm = this.fb.group({
        fatherName: ['', Validators.required],
        idType: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        gender: ['', Validators.required],
        idNumber: ['', Validators.required],
        selfiePhoto: ['', Validators.required],
        digitalSignature: ['', Validators.required],
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
