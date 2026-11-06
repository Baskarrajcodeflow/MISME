import { Component, OnInit } from "@angular/core";
import { Router, RouterModule, Routes } from "@angular/router";
import { SubProductComponent } from "../sub-product.component";
import { BaseResponseString, SubProductControllerService } from "../../openapi";
import { SpinnerComponent } from "../../../spinner.component";
import { LoadingService } from "../../../loading.service";
import { GenericTableComponent } from "../../../generic-table/generic-table.component";
import { SubProductService } from "../../models/model";
import { DataSharingService } from "../../dataSharing/data-sharing.service";
import { LoaderComponent } from "../../../loader/loader.component";
import { CommonModule } from "@angular/common";
import { ApiServiceService } from "../../api-service/api-service.service";
export interface Column {
  field: string;
  header: string;
  type: string;
  enumValues?: string[];
}
@Component({
  selector: "app-list-subproduct-table",
  standalone: true,
  imports: [
    RouterModule,
    SpinnerComponent,
    GenericTableComponent,
    LoaderComponent,
    CommonModule
  ],
  templateUrl: "./list-subproduct-table.component.html",
  styleUrl: "./list-subproduct-table.component.css",
})
export class ListSubproductTableComponent implements OnInit {
  ptArray: any[] = [];
  fwpArray: any[] = [];
  isLoading: boolean = false;
  constructor(
    private subProductService: SubProductControllerService,
    private loadingService: LoadingService,
    private dataSharing: DataSharingService,
    private apiService:ApiServiceService,

  ) {}

  pageNo: any = 1;
  Service!: SubProductService[];
  amountLimitColumns: Column[] = [
    { field: "name", header: "Service Name", type: "none" },
  ];
  ngOnInit(): void {
    this.dataSharing.setHeaderSubjectData("listSubProduct");
    this.isLoading = true;
    this.apiService.getAllSubProduct(this.pageNo).subscribe({
      next: (res: any) => {
        if (res) {
          this.isLoading = false;
          res.forEach((res: any) => {
            if (res?.subProdType == "PT") {
              this.ptArray.push(res);
            } else if (res?.subProdType == "FPW") {
              this.fwpArray.push(res);
            }
          });

          this.dataSharing.setModuleNameData$.subscribe((res) => {
            console.log(res?.name);
            if (res?.name == "Payment and Money Transfer") {
              this.loadTable(this.ptArray);
            } else if (res?.name == "Funding and Withdrawal") {
              this.loadTable(this.fwpArray);
            }
          });
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Somthing Went Wrong!!!");
      },
    });
  }
  loadTable(data: SubProductService[]) {
    console.log(data);
    this.Service = data;
  }
  handleDelete(event: { item: any; index: number }) {
    console.log("Deleted item:", event.item.id);
    console.log("Index:", event.index);
    this.subProductService
      .deleteSubProduct(event.item.id, event?.item?.id)
      .subscribe((res: any) => {
        console.log(res.data);
      });
  }
}
