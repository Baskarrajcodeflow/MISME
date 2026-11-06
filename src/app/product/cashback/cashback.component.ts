import { Component, OnInit } from "@angular/core";
import { TableColumn, TableRow } from "../../interface/interface-list";
import { TableComponent } from "../../table/table.component";
import { ApiServiceService } from "../api-service/api-service.service";
import { DataSharingService } from "../dataSharing/data-sharing.service";
import { GenericTableComponent } from "../../generic-table/generic-table.component";
import { Cashback } from "../models/model";
import { FeesOrCommissionControllerService } from "../openapi/api/feesOrCommissionController.service";
import { BaseResponseFeesOrCommission, BaseResponseString } from "../openapi";
import { LoadingService } from "../../loading.service";
import { LoaderComponent } from "../../loader/loader.component";
import { CommonModule } from "@angular/common";
export interface Column {
  field: string;
  header: string;
  type: string;
  enumValues?: string[];
}
@Component({
  selector: "app-cashback",
  standalone: true,
  templateUrl: "./cashback.component.html",
  styleUrl: "./cashback.component.css",
  imports: [GenericTableComponent, LoaderComponent,CommonModule],
})
export class CashbackComponent implements OnInit {
  constructor(
    private chashbackAndCommission: FeesOrCommissionControllerService,
    private dataSharing: DataSharingService,
    private loadingService: LoadingService
  ) {}
  page: number = 1;
  chargesLimits!: Cashback[];
  isLoading: boolean = false;

  chargesColumns: Column[] = [
    { field: "name", header: "Name", type: "string" },
    { field: "type", header: "Type", type: "dropdown" },
    { field: "amount", header: "Amount", type: "string" },
    // { field: "active", header: "Active", type: "boolean" },
  ];
  ngOnInit(): void {
    this.dataSharing.setHeaderSubjectData("cashBack");
    this.getAllData();
  }
  getAllData() {
    this.isLoading = true;
    this.chashbackAndCommission.listCashBackFeesOrCommission().subscribe({
      next: (res: BaseResponseFeesOrCommission | any) => {
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
  loadTable(data: Cashback[]) {
    // console.log(data);
    this.chargesLimits = data;
  }
  handleSave(updatedRows: any[]) {
    console.log("Saved rows:", updatedRows);
  }

  handleDelete(event: { item: any; index: number }) {
    console.log("Deleted item:", event.item.id);
    console.log("Index:", event.index);
    this.chashbackAndCommission
      .deleteFeesAndCommission(event.item.id, event?.item?.id)
      .subscribe((res: BaseResponseString) => {
        console.log(res.data);
        if (res) {
          alert("Delete Succuess");
          this.getAllData();
        }
      });
  }

  handleEdit(event: { item: any; index: number }) {
    console.log("Edited item:", event.item.id);
    console.log("Index:", event.index);
    this.chashbackAndCommission
      .updateFeesAndCommission(event.item.id, event?.item)
      .subscribe({
        next: (res: BaseResponseFeesOrCommission) => {
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
    let body: any = {
      name: event?.["name"],
      commissionCategory: 2,
      currency: "AFN",
      amount: Number(event?.["amount"]),
      type: event?.["type"],
    };
    this.isLoading = true
    this.chashbackAndCommission.createCashBackFeesOrCommission(body).subscribe({
      next: (res: BaseResponseFeesOrCommission) => {
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
