import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, MatPaginator } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { NgxPaginationModule } from "ngx-pagination";
import { DataSharingService } from "../product/dataSharing/data-sharing.service";
import { ApiServiceService } from "../product/api-service/api-service.service";
import { Router } from "@angular/router";
import { DialogComponent } from "../product/sub-product/dialog/dialog.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatTooltip } from "@angular/material/tooltip";

export interface Column {
  field: string | any;
  header: string;
  type: string;
  enumValues?: string[];
}

export interface TableRow {
  [key: string]: any;
  selected?: boolean;
}
interface TableEvent<T> {
  item: T;
  index: number;
}
@Component({
  selector: "app-generic-table",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatPaginator,
    NgxPaginationModule,
    MatTooltip,
  ],
  templateUrl: "./generic-table.component.html",
  styleUrl: "./generic-table.component.css",
})
export class GenericTableComponent<T extends TableRow> implements OnInit {
  subagentPrivilege:any
  userPrivileges: any;
  userPrevilages1: any;
  constructor(
    private apiService: ApiServiceService,
    private dataSharing: DataSharingService,
    private router: Router,
    private dialog: MatDialog
  ) {
    dataSharing.headerOperator$.subscribe((res) => {
      this.headerTitle = res;
      console.log(res,'headertitle');
    });
    this.columns.forEach((col) => {
      console.log(col.field,'+++++++++++');
      
      this.newRow[col.field] = "";
    });
  }

  ngOnInit(): void {
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      console.log(this.userPrivileges[0], "this.userPrevilages");
      console.log(this.userPrevilages1, "this.userPrevilages1");
      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "Payment and Money Transfer") {
          if (item.subComponent?.subComponentName == "Amount Limit" || 
            item.subComponent?.subComponentName == "Transaction Limit" ||
            item.subComponent?.subComponentName == "Charges and Commission" ||
            item.subComponent?.subComponentName == "Fees and Commission" ||
            item.subComponent?.subComponentName == "Agency Fees and Commission" ||
            item.subComponent?.subComponentName == "Tax" ||
            item.subComponent?.subComponentName == "Cashback" ||
            item.subComponent?.subComponentName == "SubProduct"
          ){
            this.subagentPrivilege = item;
          }
        }else if(item?.component?.componentName == "Funding and Withdrawal"){
          if (item.subComponent?.subComponentName == "Amount Limit" || 
            item.subComponent?.subComponentName == "Transaction Limit" ||
            item.subComponent?.subComponentName == "Charges and Commission" ||
            item.subComponent?.subComponentName == "Fees and Commission" ||
            item.subComponent?.subComponentName == "Agency Fees and Commission" ||
            item.subComponent?.subComponentName == "Tax" ||
            item.subComponent?.subComponentName == "Cashback" ||
            item.subComponent?.subComponentName == "SubProduct"
          ){
            this.subagentPrivilege = item;
          }
        }else if(item?.component?.componentName == "Funding and Withdrawal"){
          if (item.subComponent?.subComponentName == "Product" 
          ){
            this.subagentPrivilege = item;
          }
        }
      }
    }
  }

  @Input() columns: Column[] = [];
  @Input() rows: T[] = [];
  @Output() onSave = new EventEmitter<T[]>();
  @Output() onDelete = new EventEmitter<TableEvent<T>>();
  @Output() onEdit = new EventEmitter<TableEvent<T>>();
  @Output() onAddRowData = new EventEmitter<TableEvent<T>>();
  newRow: TableRow = {};
  bulkEditMode: boolean = false;
  editIndex: number | null = null;
  amountType: any = ["FIXED", "PERCENT"];
  calcType: any = ["AMOUNT", "COUNT"];
  conversionType: any = ["POINT_TO_E_MONEY"];
  headerTitle: any;
  toggleBulkEditMode() {
    this.bulkEditMode = !this.bulkEditMode;
  }
  route() {
    this.router.navigateByUrl("/listOfSubProducts");
  }
  saveBulkChanges() {
    this.onSave.emit(this.rows);
    this.bulkEditMode = false;
  }

  editRow(item: T, index: number) {
    console.log(item, index,'edittttttttttt');
    this.onEdit.emit({ item, index });
  }

  deleteRow(item: T, index: number) {
    console.log(item, index);

    this.onDelete.emit({ item, index });
  }

  onAddRow(newRow: any) {
    this.onAddRowData.emit(newRow);
    this.dataSharing.apiCallRefreshFeilds$.subscribe((res)=>{
      if(res == true){
        this.newRow = {}
      }
    })
  }

  editRowData(item: T, index: number) {
    if (this.headerTitle == "listSubProduct") {
      this.router.navigateByUrl("/editListOfSubProducts")
      this.dataSharing.setIdSubjectData({
        data: item,
      });
      this.onEdit.emit({ item, index });
    } else if (this.headerTitle == "EditlistSubProduct") {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: "1000px",
        data: item,
      });
    } else if (this.headerTitle == "MasterProduct") {
     this.router.navigateByUrl("/editMasterProduct")
      this.dataSharing.editMasterProdData({
        data: item,
      });
    } else if(this.headerTitle == 'ListAFC'){
    let data = JSON.stringify(item);
    this.router.navigate(["/AFCComponent"], { queryParams: { data: data } });

    }
  }
  editRowDetails(item: T, index: number){
    console.log("aaaaaaaaaaaa");
  }
  routeProduct() {
    this.router.navigateByUrl("/createProduct");
  }
  createAFC() {
    this.router.navigateByUrl("/AFCComponent");
  }
  editRowDataDialog(item: T, index: number) {}
  //---------------------------------------------------------------------------------------------------//
}
