// upload.service.ts
import { EventEmitter, Injectable, signal, WritableSignal } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { map, takeWhile, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  // Signal to track upload progress
  private uploadProgress: WritableSignal<number> = signal(-1);
  
  // Subscription to manage the upload interval
  private uploadSubscription: Subscription | null = null;

  constructor() {}

  /**
   * Initiates the upload process and updates the uploadProgress signal.
   * @param file The file to be uploaded.
   * @param format The format of the file.
   */
  upload(file: File, format: string): void {
    // Reset progress
    this.uploadProgress.set(0);

    // Mock upload implementation. Replace with actual HTTP upload logic.
    this.uploadSubscription = interval(500)
      .pipe(
        map(() => {
          const increment = Math.floor(Math.random() * 20);
          const newProgress = this.uploadProgress() + increment;
          return newProgress > 100 ? 100 : newProgress;
        }),
        takeWhile((val) => val < 100),
        finalize(() => {
          this.uploadProgress.set(100);
        })
      )
      .subscribe({
        next: (progress) => {
          this.uploadProgress.set(progress);
        },
        complete: () => {
          this.uploadProgress.set(100);
          this.uploadSubscription?.unsubscribe();
          this.uploadSubscription = null;
        },
      });
  }

  /**
   * Returns a read-only signal for the upload progress.
   */
  getProgress(): import('@angular/core').Signal<number> {
    return this.uploadProgress.asReadonly();
  }

  /**
   * Cancels the ongoing upload and resets progress.
   */
  cancelUpload(): void {
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
      this.uploadSubscription = null;
      this.uploadProgress.set(-1);
    }
  }
}
