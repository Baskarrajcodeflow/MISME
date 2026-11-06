import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-session-inactive-dialog',
  standalone: true,
  imports: [],
  templateUrl: './session-inactive-dialog.component.html',
  styleUrl: './session-inactive-dialog.component.css'
})
export class SessionInactiveDialogComponent {


countdown = 180;
private intervalId: any;

constructor(private dialogRef:MatDialogRef<SessionInactiveDialogComponent>){}

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
