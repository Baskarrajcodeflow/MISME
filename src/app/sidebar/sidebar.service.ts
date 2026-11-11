import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  // Observable that keeps track of the currently active item ID
  private activeItem = new BehaviorSubject<string | null>(null);

  // Below the lg breakpoint the sidebar is a slide-in drawer, opened by the header's menu button:
  // true while it is open. From lg up the sidebar is always visible and this is ignored.
  readonly mobileOpen = signal(false);

  constructor() {}

  toggleMobile() {
    this.mobileOpen.update((open) => !open);
  }

  closeMobile() {
    this.mobileOpen.set(false);
  }

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
