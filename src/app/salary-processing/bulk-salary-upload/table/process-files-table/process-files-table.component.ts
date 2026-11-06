import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ApiServiceService } from '../../../../product/api-service/api-service.service';

@Component({
  selector: 'app-process-files-table',
  standalone: true,
  imports: [CommonModule,MatIconModule,MatTooltip],
  templateUrl: './process-files-table.component.html',
  styleUrl: './process-files-table.component.css'
})
export class ProcessFilesTableComponent {
  bulkSalaryData:any

  constructor(private apiService:ApiServiceService){}
  ngOnInit(): void {
   this.apiService.getAllUploadedFiles().subscribe({
    next:(res:any)=>{
    if(res?.responseCode == 200){
      this.bulkSalaryData = res?.data
    }else{
      alert(res?.error)
    }
    },error:()=>{
      alert('Error While Fetching Data')
    }
   })
    
  }
}
