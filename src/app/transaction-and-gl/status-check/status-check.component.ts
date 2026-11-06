import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlService } from '../gl.service';
import { Router } from '@angular/router';
import { subscribe } from 'diagnostics_channel';

@Component({
  selector: 'app-status-check',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './status-check.component.html',
  styleUrl: './status-check.component.css'
})
export class StatusCheckComponent {
  keyword: any;
  batchId: any;
  searchResult: any;
  searched = false;
  showRollback: boolean = false;
  searchDetails: any;
  serviceName: any;
  isClicked: boolean = false;
  isLoading: boolean = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private glService: GlService
  ) { }
  ngOnInit() {
  }
  search() {
     if (this.isClicked) {
    return;
  }
   this.isClicked = true
    this.isLoading = true
    const batchIds: string[] = [this.batchId];
    this.glService.getTransactionList(batchIds).subscribe((data: any) => {
      this.isLoading = false
      this.serviceName = data?.data?.serviceName;
      if (this.serviceName === "AWCC_TOPUP") {
        this.glService.getStatusCheckResult(batchIds).subscribe((data: any) => {
          console.log(data);
          this.isLoading = false
          this.searched = true
          this.searchResult = data?.data
          if (data?.responseCode == 505) {
            this.showRollback = true
          }
          if (data?.error != null) {
            alert(data?.error)
          }
        });
      }
      else if (this.serviceName != "AWCC_TOPUP" && this.serviceName.endsWith("_TOPUP")) {
        this.glService.getSetaraganTransactionProcess(batchIds).subscribe((data: any) => {
          console.log(data);
          this.searched = true
          this.isLoading = false
          this.searchResult = data?.data
          if (data?.responseCode == 505) {
            this.showRollback = true
          }
          if (data?.error != null) {
            alert(data?.error)
          }
        });
      }
    });
  }
  onInputChange() {
    this.isClicked = false;
  }
  reversal() {
    this.router.navigateByUrl("transaction-and-gl/refund-transaction")
  }
}
