import { NgFor, NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { LoadingService } from "../../loading.service";
import { FeesAndCommission } from "../../product/models/model";
import { FeesOrCommissionControllerService, BaseResponseFeesOrCommission, BaseResponseString } from "../../product/openapi";
import { Column } from "../service/service.component";
import { GenericTableComponent } from "../../generic-table/generic-table.component";
import { DataSharingService } from "../../product/dataSharing/data-sharing.service";

@Component({
  selector: "app-fees-and-commission-slabwise",
  standalone: true,
  imports: [
    GenericTableComponent,
  ],
  templateUrl: "./fees-and-commission-slab.component.html",
  styleUrls: ["./fees-and-commission-slab.component.css"],
})
export class FeesAndCommissionSlabComponent {
  constructor(
    private feesAndCommission: FeesOrCommissionControllerService,
    private loadingService: LoadingService,
    private dataSharing:DataSharingService
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
    this.loadingService.show()
    this.feesAndCommission.listAFCFeesOrCommission().subscribe({
      next: (res: BaseResponseFeesOrCommission | any) => {
        console.log(res);
        if(res){
          this.loadingService.hide()
        }
        this.loadTable(res);
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
      slabwiseCommisions:[],
      percentage:null,
      commissionType:null,
      subAgentCommission:null,
      merchantCommission:null,
    };
    this.feesAndCommission.createAFCFeesOrCommission(body).subscribe({
      next: (res: BaseResponseFeesOrCommission) => {
        console.log(res);
        if (res) {
          alert("Add Succuess");
        }
      },
    });
  }
}
