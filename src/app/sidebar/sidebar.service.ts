import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  // Observable that keeps track of the currently active item ID
  private activeItem = new BehaviorSubject<string | null>(null);

  constructor() {}

  // Method to get the active item as an observable
  getActiveItem() {
    return this.activeItem.asObservable();
  }

  // Method to set active item
  setActiveItem(itemId: string) {
    this.activeItem.next(itemId);
  }

  // Method to close all items
  closeAllItems() {
    this.activeItem.next(null);
  }
}
