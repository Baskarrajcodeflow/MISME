import { NgFor, NgIf } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { LoggerService } from "../../core/services/logger/logger.service";
import { AmountLimit } from "../../product/models/model";
import {
  AmountLimitControllerService,
  BaseResponseAmountLimit,
  BaseResponseString,
} from "../../product/openapi";
import { GenericTableComponent } from "../../generic-table/generic-table.component";
import { DataSharingService } from "../../product/dataSharing/data-sharing.service";
import { LoadingService } from "../../loading.service";
import { LoaderComponent } from "../../loader/loader.component";
import { ApiServiceService } from "../../product/api-service/api-service.service";

export interface Column {
  field: string;
  header: string;
  type: string;
  enumValues?: string[];
}

@Component({
  selector: "app-amount-limit",
  standalone: true,
  templateUrl: "./amount-limit.component.html",
  styleUrls: ["./amount-limit.component.css"],
  imports: [
    FormsModule,
    NgxPaginationModule,
    NgFor,
    NgIf,
    GenericTableComponent,
    LoaderComponent
],
})
export class AmountLimitComponent implements OnInit {
  isLoading:boolean = false
  constructor(
    // private ProductManagementService: ProductManagementService,
    private loggerService: LoggerService,
    private amountLimitService: AmountLimitControllerService,
    private dataSharing: DataSharingService,
    private loadingService: LoadingService,
    private apiService:ApiServiceService,
    
  ) {
  }

  amountLimits!: AmountLimit[];
  amountLimitColumns: Column[] = [
    { field: "name", header: "Name", type: "string" },
    { field: "perTxnLimit", header: "Per Txn Limit", type: "number" },
    { field: "perDayLimit", header: "Per Day Limit", type: "number" },
    { field: "perMonthLimit", header: "Per month Limit", type: "number" },
    // { field: "active", header: "Active", type: "boolean" },
  ];
  page: number = 106;
  ngOnInit(): void {
    console.log('aaaaaaaaaaaaaa');
    
    this.dataSharing.setHeaderSubjectData("AmountLimit");
this.getAllData()

  }
  getAllData(){
    this.isLoading = true
    this.apiService.getAllAmountLimit(this.page).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res) {
          this.isLoading = false
          this.loadTable(res);
        }
      },error:()=>{
        this.isLoading = false
        alert('Something Went Wrong')
      }
    });
  }
  loadTable(data: AmountLimit[]) {
    // console.log(data);
    this.amountLimits = data;
  }

  handleSave(updatedRows: any[]) {
    console.log("Saved rows:", updatedRows);
  }

  handleDelete(event: { item: any; index: number }) {
    console.log("Deleted item:", event.item.id);
    console.log("Index:", event.index);
    this.amountLimitService
      .deleteAmountLimit(event.item.id, event?.item?.id)
      .subscribe((res: BaseResponseString) => {
        console.log(res.data);
        if (res) {
          alert("Delete Succuess");
         this.getAllData()

        }
      });
  }

  handleEdit(event: { item: any; index: number }) {
    console.log("Edited item:", event.item.id);
    console.log("Index:", event.index);
    this.amountLimitService
      .updateAmountLimit(event.item.id, event?.item)
      .subscribe({
        next: (res: BaseResponseAmountLimit) => {
          console.log(res);
          // this.loadTable(res.data);
          if (res) {
            alert("Update Succuess");
         this.getAllData()
          }
        },error:()=>{
          alert('Somthing Went Wrong!!!')
        }
      });
  }

  addRow(event: any) {
    console.log(event);
    let body = {
      name: event?.["name"],
      perTxnLimit: Number(event?.["perTxnLimit"]),
      perDayLimit: Number(event?.["perDayLimit"]),
      perMonthLimit: Number(event?.["perMonthLimit"]),
      currency: "AFN",
    };
    this.isLoading = true
    this.amountLimitService.createAmountLimit(body).subscribe({
      next: (res: BaseResponseAmountLimit) => {
        console.log(res);
        if (res) {
    this.isLoading = false
          alert("Add Succuess");
         this.getAllData()
         this.dataSharing.apiCallRefreshFeild(true)
        }
      },error:()=>{
    this.isLoading = false
        alert('Somthing Went Wrong!!!')
      }
    });
  }
}
