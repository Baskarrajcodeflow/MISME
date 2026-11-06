import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<Toast | null>(null);
  toast$ = this.toastSubject.asObservable();
  constructor() { }
  showToast(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    this.toastSubject.next({ message, type });
    setTimeout(() => this.toastSubject.next(null), 3000); // Dismiss after 3 seconds
  }

  showSuccess(message: string) {
    this.showToast(message, 'success');
  }

  showError(message: string) {
    this.showToast(message, 'error');
  }
}
