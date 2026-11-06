import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'warning';

export interface ToastMessage {
  type: ToastType;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messageSource = new BehaviorSubject<ToastMessage | null>(null);
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  showMessage(type: ToastType, message: string) {
    this.messageSource.next({ type, message });
  }

  getMessage() {
    return this.currentMessage;
  }
}
