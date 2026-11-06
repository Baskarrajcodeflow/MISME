import { Component, OnInit } from '@angular/core';
import { GenericTableComponent } from '../../generic-table/generic-table.component';
import { FeesAndCommission } from '../../product/models/model';
import { DataSharingService } from '../../product/dataSharing/data-sharing.service';
import { LoadingService } from '../../loading.service';
import { FeesOrCommissionControllerService, BaseResponseFeesOrCommission, BaseResponseString } from '../../product/openapi';
export interface Column {
  field: string;
  header: string;
  type: string;
  enumValues?: string[];
}
@Component({
  selector: 'app-list-afc-details',
  standalone: true,
  imports: [GenericTableComponent],
  templateUrl: './list-afc-details.component.html',
  styleUrl: './list-afc-details.component.css'
})
export class ListAFCDetailsComponent implements OnInit {
  constructor(
    private feesAndCommission: FeesOrCommissionControllerService,
    private loadingService: LoadingService,
    private dataSharing:DataSharingService
  ){
    this.dataSharing.setHeaderSubjectData("ListAFC");
  }
  feesAndCommision!: FeesAndCommission[];
  feesAndCommisionArray: Column[] = [
    { field: "name", header: "Name", type: "string" },
    { field: "type", header: "Commission Type", type: "dropdown" },
    { field: "amount", header: "Amount/Percent", type: "string" },
    // { field: "active", header: "Active", type: "boolean" },
  ];

  ngOnInit(): void {
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
  
}
