import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HeadAccountControllerService, LeafAccountControllerService, SubAccountControllerService } from '../openapi';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { GlService } from '../gl.service';
@Component({
  selector: 'app-list-transaction-and-gl',
  standalone: true,
  imports: [NgIf, NgClass, ReactiveFormsModule, NgFor],
  templateUrl: './list-transaction-and-gl.component.html',
  styleUrl: './list-transaction-and-gl.component.css'
})
export class ListTransactionAndGlComponent {
  ListForm: FormGroup = new FormGroup({});
  category = new FormControl();
  allHead: any;
  allSubhead: any;
  allLeaf: any;
  categoryValue: any;
  showHeadTable: boolean = false;
  showSubTable: boolean = false;
  showLeafTable: boolean = false;
  privilege: any;
  constructor(private headAccountService: HeadAccountControllerService,
    private LeafAccountService: LeafAccountControllerService,
    private SubAccountService: SubAccountControllerService,
    private service:GlService,
    private router: Router,) { }
  ngOnInit() {
    this.loadPrivileges();
  }
  loadPrivileges(): void {
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      const userPrivileges = JSON.parse(privilegesData);
      const userPrevilages1 = userPrivileges[0];
      for (const item of userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName === 'Transaction and GL') {
          if (item.subComponent?.subComponentName === 'Account Maintanance') {
            this.privilege = item;
          }
        }
      }
    }
  }
  getAllHeads() {
    this.headAccountService.getAllHeadAccounts().subscribe((data: any) => {
      this.allHead = data
    })
  }
  getAllSubheads() {
    this.SubAccountService.getAllSubAccounts().subscribe((data: any) => {
      this.allSubhead = data

    })
  }
  getAllLeaf() {
    this.LeafAccountService.getAllLeafAccounts().subscribe((data: any) => {
      this.allLeaf = data

    })
  }
  onChangeCategory($event: any) {
    this.categoryValue = $event.target.value
    if (this.categoryValue == 'HEAD') {
      this.showHeadTable = true
      this.showSubTable = false
      this.showLeafTable = false
      this.getAllHeads();
    }
    else if (this.categoryValue == 'SUBHEAD') {
      this.showHeadTable = false
      this.showSubTable = true
      this.showLeafTable = false
      this.getAllSubheads();
    }
    else {
      this.showHeadTable = false
      this.showSubTable = false
      this.showLeafTable = true
      this.getAllLeaf();
    }
  }


  onClickCreate() {
    this.router.navigateByUrl('transaction-and-gl/create-transaction-and-gl')
  }
}
