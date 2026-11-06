import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
@Component({
  selector: 'app-financial-period-lock-unlock',
  standalone: true,
  imports: [CommonModule,FormsModule,MatSlideToggleModule],
  templateUrl: './financial-period-lock-unlock.component.html',
  styleUrl: './financial-period-lock-unlock.component.css'
})
export class FinancialPeriodLockUnlockComponent {
softLock = false;
hardLock = false;

unlockReason = '';

onSoftToggle() {
  if (this.softLock) {
    this.hardLock = false;
  }
}

onHardToggle() {
  if (this.hardLock) {
    this.softLock = false;
  }
}

isLocked() {
  return this.softLock || this.hardLock;
}

unlockPeriod() {
  if (!this.unlockReason.trim()) {
    alert('Please enter unlock reason');
    return;
  }

  console.log('Unlock Reason:', this.unlockReason);

  this.softLock = false;
  this.hardLock = false;
  this.unlockReason = '';

  alert('Unlocked Successfully');
}
}
