import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import { GlService } from '../gl.service';
import { Router } from '@angular/router';
import { CommonModule, NgClass, NgFor, NgForOfContext, NgIf } from '@angular/common';
import { LoaderComponent } from "../../loader/loader.component";

@Component({
  selector: 'app-process-refund',
  standalone: true,
  imports: [NgIf, NgClass, ReactiveFormsModule, FormsModule, NgFor, CommonModule, LoaderComponent],
  templateUrl: './process-refund.component.html',
  styleUrl: './process-refund.component.css'
})
export class ProcessRefundComponent {
  @ViewChild("content") content!: ElementRef;
  refundDetails: any[] = [];
  showAllTable: boolean = false
  privilege: any;
  refundForm: FormGroup = new FormGroup({});
  batchIdValue: any;
  isReverseButtonDisabled: boolean = false;
  isAuthorizeButtonDisabled: boolean = false;
  getAllReverseData: any;
  isLoading:boolean = false
  constructor(private router: Router, private fb: FormBuilder, private glService: GlService) {
    this.refundForm = this.fb.group({
      batchId: ['', Validators.required], // Assuming batchId is required
    });
  }
  ngOnInit() {
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      const userPrivileges = JSON.parse(privilegesData);
      const userPrevilages1 = userPrivileges[0];
      for (const item of userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName === 'Transaction and GL') {
          if (item.subComponent?.subComponentName === 'Refund Transaction') {
            this.privilege = item;
          }
        }
      }
    }
  }

  search() {
    this.showAllTable = true;
    const batchIdValue = this.refundForm.get('batchId')?.value;
    console.log("this.refundForm.get('batchId')?.value", this.refundForm.get('batchId')?.value)
    this.isLoading = true
    this.glService.getRefundTransactionReport(batchIdValue).subscribe({
      next:(data)=>{
        if(data?.responseCode == 200){
              this.isLoading = false
          this.refundDetails = data?.data
        }
      },error:()=>{
              this.isLoading = false
        alert('Something Went Wrong.')
      }
    })
  }
  reverse() {
    if (this.isReverseButtonDisabled) return;
    this.isReverseButtonDisabled = true;
    const batchIdValue = this.refundForm.get('batchId')?.value;
              this.isLoading = true
    this.glService.ReverseRefundTransaction(batchIdValue).subscribe(
      (data: any) => {
        if (data?.responseCode == 200) {
              this.isLoading = false
          alert("Success")
    this.router.navigateByUrl("transaction-and-gl/refund-transaction");
        }else{
              this.isLoading = false
          alert(data?.data)
        }
      },
      (error) => {
              this.isLoading = false
          alert("Error")
        this.isReverseButtonDisabled = false;
      }
    );
  }
}