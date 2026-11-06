import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  isVisible = false;

  @Output() onConfirm = new EventEmitter<void>();
  @Input() walletStatus: any;
  open() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }

  confirm() {
    this.onConfirm.emit();
    this.close();
  }
}
