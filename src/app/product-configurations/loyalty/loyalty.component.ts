import { Component } from '@angular/core';
import { BaseResponseFeesOrCommission, BaseResponseString, FeesOrCommissionControllerService, SubProduct } from '../../product/openapi';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { GenericTableComponent } from '../../generic-table/generic-table.component';
import { LoaderComponent } from '../../loader/loader.component';
import { LoadingService } from '../../loading.service';
import { DataSharingService } from '../../product/dataSharing/data-sharing.service';
import { FeesAndCommission } from '../../product/models/model';
import { ApiServiceService } from '../../product/api-service/api-service.service';

export interface Column {
  field: string;
  header: string;
  type: string;
  enumValues?: string[];
}
@Component({
  selector: 'app-loyalty',
  standalone: true,
  imports: [  FormsModule,
    NgxPaginationModule,
    NgFor,
    NgIf,
    GenericTableComponent,
    LoaderComponent,],
  templateUrl: './loyalty.component.html',
  styleUrl: './loyalty.component.css'
})
export class LoyaltyComponent {
 isLoading: boolean = false;
  constructor(
    private feesAndCommission: FeesOrCommissionControllerService,
    private apiService: ApiServiceService,
    private loadingService: LoadingService,
    private dataSharing: DataSharingService
  ) {}
  feesAndCommision!: FeesAndCommission[];
  feesAndCommisionArray: Column[] = [
    { field: "name", header: "Name", type: "string" },
    // { field: "maxLimit", header: "Max Limit", type: "string" },
    { field: "expiryDays", header: "Expiry Days", type: "string" },
    { field: "calcType", header: "Calculation Type", type: "selectbox" },
    { field: "pointPerUnit", header: "Points Per Unit", type: "string" },
    // { field: "active", header: "Active", type: "boolean" },
  ];
  page: number = 106;
  ngOnInit(): void {
    this.dataSharing.setHeaderSubjectData("Loyalty");
         this.dataSharing.setModuleNameData$.subscribe((res) => {
          console.log(res?.name);
          if (res?.name == "Payment and Money Transfer" || res?.name == "Loyalty Management") {
            this.productType = SubProduct.SubProdTypeEnum.Pt;
          } else if (res?.name == "Funding and Withdrawal") {
            this.productType = SubProduct.SubProdTypeEnum.Fpw;
          }
        });
    this.getAllData();
  }
  getAllData() {
    this.isLoading = true;
    this.apiService.getLoyalty(this.productType).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res?.responseCode == 200) {
          this.isLoading = false;
          this.loadTable(res?.data);
        }else{
          this.isLoading = false;
          alert(res?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something Went Wrong");
      },
    });
  }
  loadTable(data: any[]) {
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
    console.log("Edited item Id:", event.item.id);
    console.log("Edited item:", event.item);
    // console.log("Index:", event.index);
    this.apiService
      .updateLoyalty(event?.item, event?.item?.id)
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
  productType: any;
  addRow(event: any) {
    console.log(event);
    let body: any = {
      name: event?.["name"],
      // maxLimit: Number(event?.["maxLimit"]),
      expiryDays: Number(event?.["expiryDays"]),
      calcType: event?.["calcType"],
      pointPerUnit: Number(event?.["pointPerUnit"]),
      subProdType: this.productType,
    };
    this.isLoading = true;
    this.apiService.createLoyalty(body).subscribe({
      next: (res: any) => {

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
