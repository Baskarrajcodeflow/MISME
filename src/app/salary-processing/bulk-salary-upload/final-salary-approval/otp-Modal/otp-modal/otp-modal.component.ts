import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Form, FormGroup, FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { DataSharingService } from '../../../../../product/dataSharing/data-sharing.service';

@Component({
  selector: 'app-otp-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './otp-modal.component.html'
})
export class OtpModalComponent implements OnInit {
  @Input() digits = 6;
  @Input() title = 'Enter OTP';
  @Input() subtitle = 'We sent a code to your email & phone';
  @Input() show = false;

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<string>();

  @ViewChildren('otpInput') inputs!: QueryList<ElementRef<HTMLInputElement>>;
  constructor(private dataSharingService: DataSharingService) { }

  boxes: string[] = [];
  isSubmitting = false;
  isOtpComplete: any;
  otpForm: FormGroup = new FormGroup({
    otp1: new FormControl(''),
    otp2: new FormControl(''),
    otp3: new FormControl(''),
    otp4: new FormControl(''),
    otp5: new FormControl(''),
    otp6: new FormControl(''),
  });

  ngOnInit() {
    //this.boxes = Array(this.digits).fill('');
  }

  ngOnChanges() {
    if (this.show) setTimeout(() => this.focus(0), 0);
  }

  private focus(index: number) {
    const el = this.inputs?.get(index)?.nativeElement;
    el?.focus();
    el?.select();
  }

  onInput(e: any, i: number) {
    const val = (e.target.value || '').replace(/\D/g, '').slice(0, 1);
    this.boxes[i] = val;
    if (val && i < this.digits - 1) this.focus(i + 1);

    // if last box filled and all digits present → auto-submit & close
    if (i === this.digits - 1 && this.boxes.every(x => x.length === 1)) {
      this.submit();
    }
  }

  // handle paste of full OTP
  onPaste(e: ClipboardEvent) {
    e.preventDefault();
    const txt = (e.clipboardData?.getData('text') || '').replace(/\D/g, '');
    for (let i = 0; i < this.digits; i++) this.boxes[i] = txt[i] || '';
    // focus next empty or submit if complete
    const firstEmpty = this.boxes.findIndex(x => x === '');
    if (firstEmpty === -1) this.submit(); else this.focus(firstEmpty);
  }
  onOtpInput(event: any, nextInput: any, prevInput: any) {
    if (event.target.value.length === 1 && nextInput) {
      nextInput.focus();
    } else if (event.target.value.length === 0 && prevInput) {
      prevInput.focus();
    }
    else {
      const otp = Object.values(this.otpForm.value).join('');
      this.dataSharingService.setOTP(otp);
       this.submitted.emit(otp);
    // auto-close after emit
    this.isSubmitting = false;
      this.close();
    }
  }


  onKeyDown(e: KeyboardEvent, i: number) {
    if (e.key === 'Backspace' && !this.boxes[i] && i > 0) {
      this.focus(i - 1);
      this.boxes[i - 1] = '';
      e.preventDefault();
    }
    if (e.key === 'ArrowLeft' && i > 0) { this.focus(i - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight' && i < this.digits - 1) { this.focus(i + 1); e.preventDefault(); }
    if (e.key === 'Enter' && this.boxes.every(x => x)) this.submit();
  }

  submit() {
    if (this.isSubmitting) return;
    const otp = this.boxes.join('');
    if (otp.length !== this.digits) return;
    this.isSubmitting = true;
    // emit first; parent can verify later
    this.submitted.emit(otp);
    // auto-close after emit
    this.isSubmitting = false;
    this.close();
  }

  close() {
    this.show = false;
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEsc() { if (this.show) this.close(); }
}
