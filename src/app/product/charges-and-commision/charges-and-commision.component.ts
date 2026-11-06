import { NgFor, NgIf } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { TableColumn, TableRow } from "../../interface/interface-list";
import { TableComponent } from "../../table/table.component";
import { ApiServiceService } from "../api-service/api-service.service";
import { DataSharingService } from "../dataSharing/data-sharing.service";
import { GenericTableComponent } from "../../generic-table/generic-table.component";
import { FeesOrCommissionControllerService } from "../openapi/api/feesOrCommissionController.service";
import { BaseResponseFeesOrCommission, BaseResponseString } from "../openapi";
import { ChargesAndCommission } from "../models/model";
import { LoadingService } from "../../loading.service";
import { LoaderComponent } from "../../loader/loader.component";
export interface Column {
  field: string;
  header: string;
  type: string;
  enumValues?: string[];
}

@Component({
  selector: "app-charges-and-commision",
  standalone: true,
  templateUrl: "./charges-and-commision.component.html",
  styleUrl: "./charges-and-commision.component.css",
  imports: [FormsModule, NgxPaginationModule, NgFor, NgIf, GenericTableComponent, LoaderComponent],
})
export class ChargesAndCommisionComponent implements OnInit {
  constructor(
    private chargesAndCommission: FeesOrCommissionControllerService,
    private loadingService: LoadingService,
    private data:DataSharingService,
    private apiService: ApiServiceService

    
  ) {}
  page: number = 1;
  chargesLimits!: ChargesAndCommission[];
  isLoading:boolean = false
  chargesColumns: Column[] = [
    { field: "name", header: "Name", type: "string" },
    { field: "type", header: "Type", type: "dropdown" },
    { field: "amount", header: "Amount", type: "string" },
    // { field: "active", header: "Active", type: "boolean" }, 
  ];
  ngOnInit(): void {
    this.data.setHeaderSubjectData("Charges");

    this.isLoading = true
    this.apiService.listChargeFeesOrCommission().subscribe({
      next: (res: BaseResponseFeesOrCommission | any) => {
        console.log(res);
        if(res){
          this.isLoading = false
          this.loadTable(res);
        }
      },error:()=>{
        this.isLoading = false
        alert('Something Went Wrong')
      }
    });
  }
  loadTable(data: ChargesAndCommission[]) {
    // console.log(data);
    this.chargesLimits = data;
  }
  handleSave(updatedRows: any[]) {
    console.log("Saved rows:", updatedRows);
  }

  handleDelete(event: { item: any; index: number }) {
    console.log("Deleted item:", event.item.id);
    console.log("Index:", event.index);
    this.chargesAndCommission
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
    this.chargesAndCommission
      .updateFeesAndCommission(event.item.id, event?.item)
      .subscribe({
        next: (res: BaseResponseFeesOrCommission) => {
          console.log(res);
          // this.loadTable(res.data);
          if (res) {
            alert("Update Succuess");
          }
        },
      });
  }

  addRow(event: any) {
    console.log(event);
    let body: any = {
      name: event?.["name"],
      commissionCategory: 4,
      currency: "AFN",
      amount: Number(event?.["amount"]),
      type: event?.["type"],
    };
    this.isLoading = true
    this.chargesAndCommission.createChargeFeesOrCommission(body).subscribe({
      next: (res: BaseResponseFeesOrCommission) => {
        console.log(res);
        if (res) {
          this.isLoading = false
          alert("Add Succuess");
          this.data.apiCallRefreshFeild(true);
        }
      }, error: () => {
        this.isLoading = false
        alert("Somthing Went Wrong!!!");
      },
    });
  }
}
