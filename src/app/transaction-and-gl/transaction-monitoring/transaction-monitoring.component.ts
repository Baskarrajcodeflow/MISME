import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HeadAccountControllerService, LeafAccountControllerService, SubAccountControllerService } from '../openapi';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { GlService } from '../gl.service';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-transaction-monitoring',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,NgFor,LoaderComponent],
  templateUrl: './transaction-monitoring.component.html',
  styleUrl: './transaction-monitoring.component.css'
})
export class TransactionMonitoringComponent {

  ListForm: FormGroup = new FormGroup({});
  category = new FormControl();
  allHead: any;
  allSubhead: any;
  allLeaf: any;
  categoryValue: any;
  showHeadTable: boolean = false;
  showSubTable: boolean = false;
  showLeafTable: boolean = false;
  latestTransactions: any;
  privilege: any;
  isLoading: boolean = false;
  constructor(private glService: GlService) { }
  ngOnInit() {
    this.loadPrivileges();
    this.getHundredFilteredTransaction();
  }
  loadPrivileges(): void {
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      const userPrivileges = JSON.parse(privilegesData);
      const userPrevilages1 = userPrivileges[0];
      for (const item of userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName === 'Transaction and GL') {
          if (item.subComponent?.subComponentName === 'Transaction Monitoring') {
            this.privilege = item;
          }
        }
      }
    }
  }
  getHundredFilteredTransaction() {
    this.isLoading  = true;
    this.glService.getHundredFilteredTransaction().subscribe({
      next: (response: any) => {
        if (response) {
      this.latestTransactions = response?.data;
      this.isLoading  = false;
        }
      },
      error: (error) => {
        alert("Something went wrong")
        this.isLoading = false;
      }
    })
  }
 
  refreshData(){
 this.getHundredFilteredTransaction();
  }
}

