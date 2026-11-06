import { Component } from '@angular/core';
import { ViewDetailsBulkSalaryComponent } from '../view-details-bulk-salary/view-details-bulk-salary.component';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { ApiServiceService } from '../../../../product/api-service/api-service.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../../loader/loader.component';

@Component({
  selector: 'app-rejected-reversal',
  standalone: true,
  imports: [CommonModule,LoaderComponent],
  templateUrl: './rejected-reversal.component.html',
  styleUrl: './rejected-reversal.component.css'
})
export class RejectedReversalComponent {
isLoading: boolean = false;
  reversalData: any;
  constructor(private apiService: ApiServiceService,
            private dialog:MatDialog
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getPendingSalaryReversalRequests();
  }

  getPendingSalaryReversalRequests() {
    this.isLoading = true;
    this.apiService.pendingSelectiveReversal(0).pipe(
            finalize(() => {
              this.isLoading = false; 
            })
          ).subscribe({
      next: (res: any) => {
        if (res?.responseCode == 200) {
          this.reversalData = res?.data;
          this.isLoading = false;
        } else {
          alert(res?.error);
          this.isLoading = false;
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Error While Fetching Data");
      },
    });
  }
    nextpage(item:any,flag:any){
      console.log(item);
      
      let dialogRef = this.dialog
      .open(ViewDetailsBulkSalaryComponent, {
        width: '900px',
        height: '500px',
        data:{item,flag},
        panelClass: 'custom-dialog-container',
        disableClose:true
      })
      .afterClosed()
      .subscribe((res) => {
        console.log(res);
      if(res == undefined){
       
      }  
      
      });
    }

}
