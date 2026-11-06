import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TwoFactorAuthComponent } from '../two-factor-auth/two-factor-auth.component';
import { NgIf } from '@angular/common';
import { contextSwitch } from '../../interface/interface-list';

@Component({
  selector: 'app-signup',
  standalone:true,
imports:[FormsModule, ReactiveFormsModule, TwoFactorAuthComponent, NgIf],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  @Output() switchToContext = new EventEmitter<string>();
  contextS= contextSwitch
  contexts = Object.values(contextSwitch)


  signupForm: FormGroup;
  isUsernameAvailable: boolean = false;
  isLoading: boolean = false;
  show2FA: boolean = false;
username: any;
password: any;

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notSame: true };
  }

  onSignup() {
    this.isLoading = true;
    // Simulate HTTP request
    setTimeout(() => {
      this.isUsernameAvailable = true; // Change as needed based on actual HTTP response
      this.isLoading = false;
      this.show2FA = true;
    }, 2000);
  }

  invokeSwitchTo(context:contextSwitch) {
    console.log('(((((((((((((')
    this.switchToContext.emit(context);
  }
}
