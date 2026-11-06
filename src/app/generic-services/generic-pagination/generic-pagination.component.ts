import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generic-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-pagination.component.html',
  styleUrl: './generic-pagination.component.css'
})
export class GenericPaginationComponent {
  @Input() currentNo:any
  @Input() showNext: boolean = true; // Default to the first page
  @Output() customEvent = new EventEmitter<string>();
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log('DataChnage');
   
    // this.calculatePagination()
   /*  this.calculatePagination() */
    
  }
  currentPage: number = 1;
  totalPages: number = 0; // Total number of pages
  pageSize: number = 20; // Number of records per page
 
  goToPage(page: number): void {
    if (page >= 1) {
      this.currentPage = page;
      this.customEvent.emit(this.currentPage.toString());
    }
  }
  paginatedData: any;

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.currentNo.slice(startIndex, endIndex);
    console.log(this.paginatedData);
    this.customEvent.emit(this.paginatedData)
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.currentNo.length / this.pageSize);
    this.updatePagination(); // Update the displayed data for the first page
  }
}
