import { Injectable } from '@angular/core';
import { Subject, Subscription, fromEvent, merge, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root' 
})
export class InactivityService {
  private inactivityTime = environment.inactivetimout
  private inactivitySubject = new Subject<void>();
  private activitySubscription!: Subscription;
  constructor() {
    this.startTracking();
  }

  get inactivityAlert() {
    return this.inactivitySubject.asObservable();
  }

  get inactivityAlertUnsubscribe(){
    return this.inactivitySubject.unsubscribe();
  }

   startTracking() {
    const activityEvents = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'click')
    );

    this.activitySubscription = activityEvents
      .pipe(
        tap(() => console.log('User is active, resetting timer...')),
        switchMap(() => timer(this.inactivityTime))
      )
      .subscribe(() => {
        // console.log('User is inactive!');
        this.inactivitySubject.next();
      });
  }

  stopTracking() {
    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
      // console.log('Stopped tracking inactivity.');
    }
  }
}