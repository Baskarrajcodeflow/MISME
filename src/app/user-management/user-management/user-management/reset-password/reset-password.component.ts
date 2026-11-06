import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { boService } from '../bo/bo.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm!: FormGroup;

  loading = false;

  otpSent = false;

  errorMessage = '';

  successMessage = '';

  readonly userTypes = [
    'AGENT',
    'MERCHANT',
    'CUSTOMER'
  ];

  constructor(
    private fb: FormBuilder,
    private passwordResetService: boService
  ) { }

  ngOnInit(): void {

    this.resetPasswordForm = this.fb.group({

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{9,15}$/)
        ]
      ],

      userType: [
        '',
        Validators.required
      ],

      otp: ['']

    });

  }

  get f() {
    return this.resetPasswordForm.controls;
  }

  sendOtp(): void {

  this.errorMessage = '';
  this.successMessage = '';

  this.f['phone'].markAsTouched();
  this.f['userType'].markAsTouched();

  if (
    this.f['phone'].invalid ||
    this.f['userType'].invalid
  ) {
    return;
  }

  const payload = {
    email: null,
    phone: this.f['phone'].value,
    userType: this.f['userType'].value
  };

  this.loading = true;

  this.passwordResetService.generateOtp(payload).subscribe({

    next: (response: any) => {

      this.loading = false;

      if (response?.responseCode === 200) {

        this.otpSent = true;

        this.successMessage =
          response?.data || 'OTP sent successfully.';

        this.errorMessage = '';

        this.f['otp'].setValidators([
          Validators.required,
          Validators.pattern(/^[0-9]{6}$/)
        ]);

        this.f['otp'].updateValueAndValidity();

      } else {

        this.errorMessage =
          response?.error || 'Failed to send OTP.';

        this.successMessage = '';

      }

    },

    error: (error) => {

      this.loading = false;

      this.successMessage = '';

      this.errorMessage =
        error?.error?.error ||
        'Something went wrong. Please try again later.';

    }

  });

}

 verifyOtp(): void {

  this.errorMessage = '';
  this.successMessage = '';

  this.f['otp'].markAsTouched();

  if (this.resetPasswordForm.invalid) {
    return;
  }

  const payload = {

    username: this.f['phone'].value,

    password: null,

    userType: this.f['userType'].value,

    otp: this.f['otp'].value

  };

  this.loading = true;

  this.passwordResetService.resetPassword(payload).subscribe({

    next: (response: any) => {

      this.loading = false;

      if (response?.responseCode === 200) {

        this.errorMessage = '';

        this.successMessage =
          'A temporary PIN has been generated and sent via email/SMS.';

        this.resetPasswordForm.reset();

        this.otpSent = false;

        this.f['otp'].clearValidators();
        this.f['otp'].updateValueAndValidity();

      } else {

        this.successMessage = '';

        this.errorMessage =
          response?.error || 'OTP verification failed.';

      }

    },

    error: (error) => {

      this.loading = false;

      this.successMessage = '';

      this.errorMessage =
        error?.error?.error ||
        'Something went wrong. Please try again later.';

    }

  });

}

  resendOtp(): void {

    this.errorMessage = '';
    this.successMessage = '';

    this.sendOtp();

  }

}