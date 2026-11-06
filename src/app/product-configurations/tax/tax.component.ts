import { NgFor, NgIf } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { TableColumn, TableRow } from "../../interface/interface-list";
import { TableComponent } from "../../table/table.component";
import { DataSharingService } from "../../product/dataSharing/data-sharing.service";
import { ApiServiceService } from "../../product/api-service/api-service.service";
import { FeesOrCommissionControllerService } from "../../product/openapi/api/feesOrCommissionController.service";
import {
  BaseResponseFeesOrCommission,
  BaseResponseString,
} from "../../product/openapi";
import { GenericTableComponent } from "../../generic-table/generic-table.component";
import { LoadingService } from "../../loading.service";
import { LoaderComponent } from "../../loader/loader.component";
export interface Column {
  field: string;
  header: string;
  type: string;
  enumValues?: string[];
}
@Component({
  selector: "app-tax",
  standalone: true,
  templateUrl: "./tax.component.html",
  styleUrl: "./tax.component.css",
  imports: [
    FormsModule,
    NgxPaginationModule,
    NgFor,
    NgIf,
    GenericTableComponent,
    LoaderComponent,
  ],
})
export class TaxComponent implements OnInit {
  isLoading: boolean = false;

  constructor(
    private taxAndCommission: FeesOrCommissionControllerService,
    private dataSharing: DataSharingService,
    private loadingService: LoadingService,
    private apiService: ApiServiceService

  ) {}
  page: number = 1;
  taxLimits!: TaxComponent[];
  taxColumns: Column[] = [
    { field: "name", header: "Name", type: "string" },
    { field: "type", header: "Type", type: "dropdown" },
    { field: "amount", header: "Amount", type: "string" },
    // { field: "active", header: "Active", type: "boolean" },
  ];
  ngOnInit(): void {
    this.dataSharing.setHeaderSubjectData("tax");
    this.getAllData();
  }
  getAllData() {
    this.isLoading = true;
    this.apiService.listTaxFeesOrCommission().subscribe({
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
  loadTable(data: TaxComponent[]) {
    // console.log(data);
    this.taxLimits = data;
  }
  handleSave(updatedRows: any[]) {
    console.log("Saved rows:", updatedRows);
  }

  handleDelete(event: { item: any; index: number }) {
    console.log("Deleted item:", event.item.id);
    console.log("Index:", event.index);
    this.taxAndCommission
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
    this.taxAndCommission
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
      commissionCategory: 1,
      currency: "AFN",
      amount: Number(event?.["amount"]),
      type: event?.["type"],
    };
    this.isLoading = true;
    this.taxAndCommission.createTaxFeesOrCommission(body).subscribe({
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
