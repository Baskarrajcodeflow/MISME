import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../user-management/user-management/user-management/user.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, ReactiveFormsModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  userType: string = 'BO';
  constructor(private fb: FormBuilder, private userService: UserService) {
    this.resetPasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required,
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)]],
      confirmPassword: ['', Validators.required]
    });
  }
  ngOnInit() {
  }
  passwordsMatch(): boolean {
    const newPassword = this.resetPasswordForm.get('newPassword')?.value;
    const confirmPassword = this.resetPasswordForm.get('confirmPassword')?.value;
    return newPassword === confirmPassword;
  }
  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const { oldPassword, newPassword, confirmPassword } = this.resetPasswordForm.value;
      let req = {
        "oldPassword": oldPassword,
        "newPassword": newPassword,
        "userType": this.userType
      }
      this.userService.resetPassword(req).subscribe((data: any) => {
        if (data?.responseCode == 200) {
          alert(data?.data);
        }
      })
    }
  }
  onReset() {
    this.resetPasswordForm.reset();
  }
}
