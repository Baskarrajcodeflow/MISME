import { Component } from '@angular/core';
import { FileStatus } from '../file-status.model';
import { SalaryFileStatus } from '../salary-file-status.enum';
import { FileStatusService } from './file-status.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-file-status',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule, FormsModule,CommonModule
  ],
  templateUrl: './file-status.component.html',
  styleUrl: './file-status.component.css'
})
export class FileStatusComponent {
  isFileNameSearchActive: boolean = false;
  fileNameSearchText: string = '';
  filteredFileStatuses: FileStatus[] = [];
getReadableState(t10: SalaryFileStatus) {
  return t10;
}
  states = Object.values(SalaryFileStatus);
  selectedState: SalaryFileStatus = SalaryFileStatus.UPLOADED;
  fileStatuses: FileStatus[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private fileStatusService: FileStatusService) {}

  ngOnInit(): void {
    this.fetchFileStatuses();
  }

  onStateChange(): void {
    this.fetchFileStatuses();
  }

  fetchFileStatuses(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.fileStatusService.getFileStatusesByState(this.selectedState).subscribe(
      (data) => {
        this.fileStatuses = data;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'An error occurred while fetching data.';
        this.isLoading = false;
        console.error(error);
      }
    );
  }
    // Activate Search
  activateFileNameSearch(): void {
    this.isFileNameSearchActive = true;
  }

  // Deactivate Search and Reset Filter
  deactivateFileNameSearch(): void {
    this.isFileNameSearchActive = false;
    this.fileNameSearchText = '';
    this.filteredFileStatuses = [...this.fileStatuses];
  }

  // Apply Filter Based on Search Text
  applyFileNameFilter(): void {
    if (this.fileNameSearchText.trim() !== '') {
      const searchText = this.fileNameSearchText.trim().toLowerCase();
      this.filteredFileStatuses = this.fileStatuses.filter((fs) =>
        fs.fileName.toLowerCase().includes(searchText)
      );
    } else {
      // If search text is empty, reset the filter
      this.filteredFileStatuses = [...this.fileStatuses];
    }
  }

  getReadableState1(state: SalaryFileStatus): string {
    return state
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
