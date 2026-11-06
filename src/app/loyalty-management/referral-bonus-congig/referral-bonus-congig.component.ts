import { Component } from '@angular/core';
import { LoadingService } from '../../loading.service';
import { ApiServiceService } from '../../product/api-service/api-service.service';
import { DataSharingService } from '../../product/dataSharing/data-sharing.service';
import { FeesAndCommission } from '../../product/models/model';
import { FeesOrCommissionControllerService, BaseResponseString, BaseResponseFeesOrCommission } from '../../product/openapi';
import { GenericTableComponent,Column } from '../../generic-table/generic-table.component';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-referral-bonus-congig',
  standalone: true,
  imports: [CommonModule,GenericTableComponent,LoaderComponent],
  templateUrl: './referral-bonus-congig.component.html',
  styleUrl: './referral-bonus-congig.component.css'
})
export class ReferralBonusCongigComponent {
isLoading:boolean=false;
  constructor(
    private feesAndCommission: FeesOrCommissionControllerService,
    private apiService: ApiServiceService,
    private loadingService: LoadingService,
    private dataSharing: DataSharingService
  ) {}
  feesAndCommision!: FeesAndCommission[];
  feesAndCommisionArray: Column[] = [
    { field: "name", header: "Welcome Bonus Name", type: "string" },
    { field: "points", header: "Points", type: "string" },
    { field: "expiryDays", header: "Expiry Days", type: "string" },
  ];
  page: number = 106;
  ngOnInit(): void {
    this.dataSharing.setHeaderSubjectData("Points To Money");
         this.dataSharing.setModuleNameData$.subscribe((res) => {
          console.log(res?.name);
        
        });
    this.getAllData();
  }
  getAllData() {
    this.isLoading = true;
    this.apiService.getReferralBonusConfig().subscribe({
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
      .updateReferralBonusConfig(event?.item, event?.item?.id)
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
      points: event?.["points"],
      expiryDays: event?.["expiryDays"],
    };
    this.isLoading = true;
    this.apiService.referralBonusPost(body).subscribe({
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


