import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabsService {
  private activeTabIndex = new BehaviorSubject<number>(0);
  activeTabIndex$ = this.activeTabIndex.asObservable();

  setActiveTab(index: number) {
    this.activeTabIndex.next(index);
  }
}
