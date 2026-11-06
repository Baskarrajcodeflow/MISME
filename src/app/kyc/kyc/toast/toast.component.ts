import { Component, Input, OnInit } from '@angular/core';
import { Toast, ToastService } from '../toast.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgClass],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit {

  @Input() message: string | null = null;
  @Input() alertType: string = 'alert-success';
  constructor(private toastService: ToastService) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  closeAlert() {
    this.message = null;
  }
}
