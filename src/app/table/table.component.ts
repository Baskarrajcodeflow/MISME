import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableColumn, TableRow } from '../interface/interface-list';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserManagementService } from '../user-management/user-management/user-management/openapi';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {

  @Input() columns : TableColumn[] = [];
  @Input() rows : TableRow[] = [];
  @Input() tableType : any;gender: any;
  position: any;
  department: any;
  location: any;
  company: any;
  alternatePhones: any;
  password: any;
  /*  'subComponent' | 'subProduct' | 'productMaster' */;
  @Input() userType:any;
  @Output() activateUsers: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() deactivateUsers: EventEmitter<number[]> = new EventEmitter<number[]>();  newRow : TableRow = {};
  @Output() deleteUser: EventEmitter<number[]> = new EventEmitter<number[]>();

  sortOrder : 'asc'| 'desc' = 'asc';
  sortField : string = '';
  products : any[] = [];
  isCreatingUser: boolean = false;
  checkedRows: Set<number> = new Set<number>();
  showModal: boolean = false;
  rowToDeleteOrDeactivate: any;
  modalAction: 'delete' | 'deactivate' = 'delete';

  constructor(private router: Router, private userService:UserManagementService){
    this.columns.forEach(col =>{
      this.newRow[col.field] = '';

      
    })
  }

  ngOninit(){
    //if(this.tableType ==)
    console.log("Hi "+this.tableType);
   }

  onSort(field : string, order: 'asc' | 'desc'){

  }

  // onAddRow(){

  // }


  /* groupByProduct_ProductMaster(){
     return this.rows.reduce((acc : TableRow[], row : TableRow[]) => {
      const product = acc.find( p => p['productName'] == row[])
    })
  } */
  groupByProduct() {
  }
}