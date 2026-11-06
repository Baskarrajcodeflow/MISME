import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-scheduler',
  standalone: true,
  imports: [FormsModule,
    DragDropModule,
    NgIf,NgFor,
    CommonModule,],
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.css'
})
export class SchedulerComponent {
  selectedDate: string = '';
  selectedTime: string = '';

  @Output() onScheduled = new EventEmitter<{ date: string, time: string }>();
  @Output() onUploadNewFile = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();
  @Output() onActivate = new EventEmitter<void>();

  schedule() {
    if (this.selectedDate && this.selectedTime) {
      this.onScheduled.emit({ date: this.selectedDate, time: this.selectedTime });
    }
  }

  uploadNewFile() {
    this.onUploadNewFile.emit();
  }

  close() {
    this.onClose.emit();
  }

  activate() {
    this.onActivate.emit();
  }
}
