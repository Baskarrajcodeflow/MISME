import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableColumn, TableRow, Product } from "../../interface/interface-list";
import { TableComponent } from "../../table/table.component";
import { GenericTableComponent } from "../../generic-table/generic-table.component";
import { DataSharingService } from "../dataSharing/data-sharing.service";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MasterProduct, MasterProductControllerService } from "../openapi";
import { SubProductService } from "../models/model";
import { LoadingService } from "../../loading.service";
import { LoaderComponent } from "../../loader/loader.component";
import { ApiServiceService } from "../api-service/api-service.service";
export interface Column {
  field: string;
  header: string;
  type: string;
  enumValues?: string[];
}
@Component({
  selector: "app-product",
  standalone: true,
  templateUrl: "./product.component.html",
  styleUrl: "./product.component.css",
  imports: [
    CommonModule,
    TableComponent,
    GenericTableComponent,
    ReactiveFormsModule,
    LoaderComponent
],
})
export class ProductComponent implements OnInit {
  constructor(
    private dataSharing: DataSharingService,
private apiService:ApiServiceService,
    private masterProductApi: MasterProductControllerService,
    private loadingService: LoadingService
  ) {}
  Service!: MasterProduct[];
  isLoading:boolean=false
  amountLimitColumns: Column[] = [
    { field: "productName", header: "Product Name", type: "none" },
    { field: "description", header: "Description", type: "none" },
    { field: "userType", header: "User Type", type: "none" },
    { field: "default", header: "Is Default", type: "none" },
    // { field: "agentCommission", header: "Active", type: "none" },
  ];
  ngOnInit(): void {
    this.dataSharing.setHeaderSubjectData("MasterProduct");
   this.isLoading = true
    this.apiService.getAllMasterProduct(1).subscribe({
      next:(res:any)=>{
          console.log(res);
          if (res) {
            this.isLoading = false
            this.loadTable(res);
          }
      },error:()=>{
        this.isLoading = false
        alert('Something Went Wrong')
      }
    })
  }
  loadTable(data: MasterProduct[]) {
    this.Service = data;
    console.log(this.Service);
  }

  handleDelete(event: { item: any; index: number }) {
    console.log("Deleted item:", event.item.id);
    this.masterProductApi
      .deleteMasterProduct(event.item.id, event?.item?.id)
      .subscribe((res: any) => {
        console.log(res.data);
      });
  }
}
