import { NgFor, NgIf } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { TableComponent } from "../../table/table.component";
import { TableColumn, TableRow } from "../../interface/interface-list";
import { ApiServiceService } from "../../product/api-service/api-service.service";
import { DataSharingService } from "../../product/dataSharing/data-sharing.service";
import {
  BaseResponseService,
  BaseResponseString,
  ServiceControllerService,
  SubProduct,
} from "../../product/openapi";
import { GenericTableComponent } from "../../generic-table/generic-table.component";
import { Service } from "../../product/models/model";
import { LoadingService } from "../../loading.service";
import { LoaderComponent } from "../../loader/loader.component";
export interface Column {
  field: string;
  header: string;
  type: string;
  enumValues?: string[];
}
@Component({
  selector: "app-service",
  standalone: true,
  templateUrl: "./service.component.html",
  styleUrl: "./service.component.css",
  imports: [
    FormsModule,
    NgxPaginationModule,
    NgFor,
    NgIf,
    GenericTableComponent,
    LoaderComponent,
  ],
})
export class ServiceComponent implements OnInit {
  isLoading: boolean = false;

  constructor(
    // private apiService: ApiServiceService,
    private dataSharing: DataSharingService,
    private service: ServiceControllerService,
    private loadingService: LoadingService,
    private apiService: ApiServiceService
  ) {}
  Service!: Service[];
  amountLimitColumns: Column[] = [
    { field: "name", header: "Service Name", type: "string" },
    // { field: "active", header: "Active", type: "boolean" },
  ];
  page: number = 1;
  ptArray: any[] = [];
  fwpArray: any[] = [];
  ngOnInit(): void {
    this.dataSharing.setHeaderSubjectData("Service");
    this.getAllData();
  }
  getAllData() {
    this.isLoading = true;
    this.apiService.getService().subscribe({
      next: (res: BaseResponseService | any) => {
        console.log(res);
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
        alert("Something Went Wrong");
      },
    });
  }
  loadTable(data: Service[]) {
    console.log(data);
    this.Service = data;
  }
  handleSave(updatedRows: any[]) {
    console.log("Saved rows:", updatedRows);
  }

  handleDelete(event: { item: any; index: number }) {
    console.log("Deleted item:", event.item.id);
    console.log("Index:", event.index);
    this.service
      .deleteService(event.item.id, event?.item?.id)
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
    this.service.updateService(event.item.id, event?.item).subscribe({
      next: (res: BaseResponseService) => {
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
  productType: any;

  addRow(event: any) {
    this.dataSharing.setModuleNameData$.subscribe((res) => {
      console.log(res?.name);
      if (res?.name == "Payment and Money Transfer") {
        this.productType = SubProduct.SubProdTypeEnum.Pt;
      } else if (res?.name == "Funding and Withdrawal") {
        this.productType = SubProduct.SubProdTypeEnum.Fpw;
      }
    });
    console.log(event);
    let body = {
      name: event?.["name"],
      perTxnLimit: Number(event?.["perTxnLimit"]),
      perDayLimit: Number(event?.["perDayLimit"]),
      perMonthLimit: Number(event?.["perMonthLimit"]),
      currency: "AFN",
      subProdType: this.productType,
    };
    this.isLoading = true
    this.service.createService(body).subscribe({
      next: (res: BaseResponseService) => {
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
