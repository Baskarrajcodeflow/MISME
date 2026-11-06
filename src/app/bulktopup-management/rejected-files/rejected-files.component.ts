import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiServiceService } from '../../product/api-service/api-service.service';
import { ViewTopupDetailsComponent } from '../view-topup-details/view-topup-details.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-rejected-files',
  standalone: true,
  imports: [LoaderComponent,CommonModule,MatIconModule,MatTooltip],
  templateUrl: './rejected-files.component.html',
  styleUrl: './rejected-files.component.css'
})
export class RejectedFilesComponent {
isLoading: boolean = false;
  loginId: any;
bulkTopupData: any;

  constructor(private apiService: ApiServiceService, private dialog:MatDialog) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loginId = sessionStorage.getItem('loginUserId')
    this.getAllTopupUploadedData()
  }

  getAllTopupUploadedData() {
    this.isLoading = true;
    this.apiService.getAllTopupUploadedData(this.loginId,'BULK_TOPUP').subscribe({
      next: (res: any) => {
        if (res?.responseCode == 200) {
          this.isLoading = false;
          this.bulkTopupData = res?.data
        } else {
          this.isLoading = false;
          alert(res?.error);
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Error While Fetching Data");
      },
    });
  }

  openDialog(item:any){
      let dialogRef = this.dialog
      .open(ViewTopupDetailsComponent, {
        width: '750px',
        height: '500px',
        data:{message:item,flag:1},
        panelClass: 'custom-dialog-container',
        disableClose:true
      })
      .afterClosed()
      .subscribe((res:any) => {
        console.log(res);
        this.getAllTopupUploadedData()
      if(res == undefined){
      }  
      
      });
    }
}

