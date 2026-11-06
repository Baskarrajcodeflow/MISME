import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-two-factor-auth',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './two-factor-auth.component.html',
  styleUrls: ['./two-factor-auth.component.scss']
})
export class TwoFactorAuthComponent {
  twoFactorForm: FormGroup;
  @Output() twoFactorVerified: EventEmitter<boolean> = new EventEmitter();

  constructor(private fb: FormBuilder) {
    this.twoFactorForm = this.fb.group({
      twoFactorCode: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  verifyTwoFactorCode() {
    // Here, you would typically check the 2FA code against the server
    console.log('Verifying 2FA code:', this.twoFactorForm.value.twoFactorCode);
    // Simulate the verification
    setTimeout(() => {
      this.twoFactorVerified.emit(true);  // Emit true if verification is successful
    }, 1000);
  }
}
