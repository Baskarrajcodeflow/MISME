import { NgFor, NgIf } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { TableComponent } from "../../table/table.component";
import { TableColumn, TableRow } from "../../interface/interface-list";
import { DataSharingService } from "../../product/dataSharing/data-sharing.service";
import { ApiServiceService } from "../../product/api-service/api-service.service";
import { GenericTableComponent } from "../../generic-table/generic-table.component";
import {
  BaseResponseFeesOrCommission,
  BaseResponseString,
  FeesOrCommissionControllerService,
} from "../../product/openapi";
import { FeesAndCommission } from "../../product/models/model";
import { LoadingService } from "../../loading.service";
import { LoaderComponent } from "../../loader/loader.component";
export interface Column {
  field: string;
  header: string;
  type: string;
  enumValues?: string[];
}
@Component({
  selector: "app-fees-and-commission",
  standalone: true,
  templateUrl: "./fees-and-commission.component.html",
  styleUrl: "./fees-and-commission.component.css",
  imports: [
    FormsModule,
    NgxPaginationModule,
    NgFor,
    NgIf,
    GenericTableComponent,
    LoaderComponent,
  ],
})
export class FeesAndCommissionComponent implements OnInit {
  isLoading: boolean = false;
  constructor(
    private feesAndCommission: FeesOrCommissionControllerService,
    private loadingService: LoadingService,
    private dataSharing: DataSharingService
  ) {}
  feesAndCommision!: FeesAndCommission[];
  feesAndCommisionArray: Column[] = [
    { field: "name", header: "Name", type: "string" },
    { field: "type", header: "Type", type: "dropdown" },
    { field: "amount", header: "Amount", type: "string" },
    // { field: "active", header: "Active", type: "boolean" },
  ];
  page: number = 106;
  ngOnInit(): void {
    this.dataSharing.setHeaderSubjectData("AFC");
    this.getAllData();
  }
  getAllData() {
    this.isLoading = true;
    this.feesAndCommission.listFeesOrCommission().subscribe({
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
  loadTable(data: FeesAndCommission[]) {
    // console.log(data);
    this.feesAndCommision = data;
  }

  handleSave(updatedRows: any[]) {
    console.log("Saved rows:", updatedRows);
  }

  handleDelete(event: { item: any; index: number }) {
    console.log("Deleted item:", event.item.id);
    console.log("Index:", event.index);
    this.feesAndCommission
      .deleteFeesAndCommission(event.item.id, event?.item?.id)
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
    this.feesAndCommission
      .updateFeesAndCommission(event.item.id, event?.item)
      .subscribe({
        next: (res: BaseResponseFeesOrCommission) => {
          console.log(res);
          // this.loadTable(res.data);
          if (res) {
            alert("Update Succuess");
            this.getAllData();
          }
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
      commissionCategory: 1,
      currency: "AFN",
      amount: Number(event?.["amount"]),
      type: event?.["type"],
    };
    this.isLoading = true;
    this.feesAndCommission.createFeesOrCommission(body).subscribe({
      next: (res: BaseResponseFeesOrCommission) => {
        console.log(res);
        if (res) {
          this.isLoading = false;
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
