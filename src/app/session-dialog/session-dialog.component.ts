import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-session-dialog',
  standalone: true,
  imports: [],
  templateUrl: './session-dialog.component.html',
  styleUrl: './session-dialog.component.css'
})
export class SessionDialogComponent {
  countdown = 400;
  private intervalId: any;

constructor(private dialogRef:MatDialogRef<SessionDialogComponent>){}

ngOnInit() {
  // Start countdown
  this.intervalId = setInterval(() => {
    this.countdown--;
    if (this.countdown <= 0) {
      clearInterval(this.intervalId);
      this.dialogRef.close(false); // Auto close with 'false' if no response
    }
  }, 1000);
}

  loggedIn(event:any){
    clearInterval(this.intervalId);
  this.dialogRef.close(event)
  }
}
