import { Component, OnInit } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { GenericTableComponent } from "../../generic-table/generic-table.component";
import { LoadingService } from "../../loading.service";
import {
  BaseResponseString,
  BaseResponseTransactionLimit,
  TransactionLimit,
  TransactionLimitControllerService,
} from "../../product/openapi";
import { DataSharingService } from "../../product/dataSharing/data-sharing.service";
import { LoaderComponent } from "../../loader/loader.component";
export interface Column {
  field: string;
  header: string;
  type: string;
  enumValues?: string[];
}
@Component({
  selector: "app-transaction-limit",
  standalone: true,
  templateUrl: "./transaction-limit.component.html",
  styleUrl: "./transaction-limit.component.css",
  imports: [
    FormsModule,
    NgxPaginationModule,
    NgFor,
    NgIf,
    GenericTableComponent,
    LoaderComponent,
  ],
})
export class TransactionLimitComponent implements OnInit {
  searchKey: string = "";
  transactionLimits!: TransactionLimit[];
  page: number = 1;
  isLoading: boolean = false;

  constructor(
    private transactionLimitService: TransactionLimitControllerService,
    private dataSharing: DataSharingService,
    private loadingService: LoadingService
  ) {}
  getAllData() {
    this.isLoading = true;
    this.transactionLimitService.getTransactionLimit(this.page).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res) {
          this.isLoading = false;
          this.loadTable(res);
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something Went Wrong");
      },
    });
  }
  loadTable(data: TransactionLimit[]) {
    // console.log(data);
    this.transactionLimits = data;
  }
  ngOnInit(): void {
    this.dataSharing.setHeaderSubjectData("transactionLimit");
    this.getAllData();
  }

  transactionLimitColumns: Column[] = [
    { field: "name", header: "Limit Name", type: "string" },
    { field: "dailyAllowed", header: "Daily Allowed", type: "number" },
    { field: "monthlyAllowed", header: "Monthly Allowed", type: "number" },
    // { field: "active", header: "Active", type: "boolean" },
  ];

  handleSave(updatedRows: any[]) {
    console.log("Saved rows:", updatedRows);
  }

  handleDelete(event: { item: any; index: number }) {
    console.log("Deleted item:", event.item.id);
    console.log("Index:", event.index);
    this.transactionLimitService
      .deleteTransactionLimit(event.item.id, event?.item?.id)
      .subscribe((res: BaseResponseString) => {
        console.log(res.data);
        if (res) {
          alert("Delete Succuess");
        }
      });
  }

  handleEdit(event: { item: any; index: number }) {
    console.log("Edited item:", event.item.id);
    console.log("Index:", event.index);
    this.transactionLimitService
      .updateTransactionLimit(event.item.id, event?.item)
      .subscribe({
        next: (res: BaseResponseTransactionLimit) => {
          console.log(res);
          if (res) {
            alert("Update Succuess");
            this.getAllData();
          }
          // this.loadTable(res.data);
        },
        error: () => {
          alert("Somthing Went Wrong!!!");
        },
      });
  }

  addRow(event: any) {
    console.log(event);
    let body = {
      name: event?.["name"],
      dailyAllowed: Number(event?.["dailyAllowed"]),
      monthlyAllowed: Number(event?.["monthlyAllowed"]),
      currency: "AFN",
    };
    this.isLoading = true;
    this.transactionLimitService.createTransactionLimit(body).subscribe({
      next: (res: BaseResponseTransactionLimit) => {
        console.log(res);
        if (res) {
          this.isLoading = false
          alert("Add Succuess");
          this.getAllData();
          this.dataSharing.apiCallRefreshFeild(true);
        }
      },
      error: () => {
        this.isLoading = false
        alert("Somthing Went Wrong!!!");
      },
    });
  }
}
