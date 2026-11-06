// spinner.component.ts
import { Component } from '@angular/core';
import { LoadingService } from './loading.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  standalone:true,
  selector: 'app-spinner',
  template: `
    <div class="spinner-overlay" *ngIf="loadingService.loading$ | async">
        <span>Hey its me </span>
    </div>
  `,
  styles: [`
    .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.3);
      z-index: 9999;
    }
  `],
  imports:[NgIf,CommonModule],

})
export class SpinnerComponent {
  constructor(public loadingService: LoadingService) {}
}
