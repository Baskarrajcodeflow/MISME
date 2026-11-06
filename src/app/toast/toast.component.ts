import { Component, OnInit } from '@angular/core';
import { ToastService, ToastMessage } from '../toast.service';

@Component({
  standalone: true,
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  toast: ToastMessage | null = null;

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    
    this.toastService.getMessage().subscribe(toast => {
      console.log("component toast");
      this.toast = toast;
      if (toast) {
        setTimeout(() => this.toast = null, 3000); // Auto-hide after 3 seconds
      }
    });
  }

  closeToast() {
    this.toast = null;
  }
}
