import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-password-strength',
  standalone: true,
  imports: [Input  ],
  templateUrl: './password-strength.component.html',
  styleUrl: './password-strength.component.css'
})
export class PasswordStrengthComponent {
  @Input() password: string = '';

  getColor(): string {
    const length = this.password.length;

    if (length <= 5) {
      return 'red';
    } else if (length <= 8) {
      return 'orange';
    } else if (length <= 12) {
      return 'yellow';
    } else if (length <= 16) {
      return 'lightgreen';
    } else {
      return 'green';
    }
  }
}
