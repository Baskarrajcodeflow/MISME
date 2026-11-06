import { Component, Input, input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModuleMeta } from '../../interface/interface-list';
import { SidebarService } from '../sidebar.service';
import { EMPTY, Subscription } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DataSharingService } from '../../product/dataSharing/data-sharing.service';
@Component({
  selector: 'app-sidebar-item',
  standalone: true,
  imports: [NgFor, NgIf,RouterLink,CommonModule],
  templateUrl: './sidebar-item.component.html',
  styleUrl: './sidebar-item.component.css',
  
})
export class SidebarItemComponent implements OnInit, OnDestroy {
  @Input() module!: ModuleMeta;
  isOpen = false;

  private subscription: Subscription = EMPTY.subscribe();;
   
  @ViewChild('dropdownMenu') dropdownMenu: any;

  constructor(private sidebarService: SidebarService,private dataSharing:DataSharingService) {}

  ngOnInit() {
    this.subscription = this.sidebarService.getActiveItem().subscribe(activeId => {
      this.isOpen = (activeId === this.module.name);
    });
  }

  toggleItem() {
    if (this.isOpen) {
      this.sidebarService.closeAllItems();
    } else {
      this.sidebarService.setActiveItem(this.module.name);
    }
  }

  isAccordionOpen(){
    return this.isOpen
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getRouteLink() {
    // console.log(this.module);
    this.dataSharing.setModuleNameData(this.module);
  }

  getComponentName(name:any){
    this.dataSharing.setComponentNameData(name)
  }
   toggleDropdown() {
    

    setTimeout(() => {
      if (this.isOpen) {
        // Find the sidebar container (parent with overflow-auto)
        const sidebar = this.dropdownMenu?.nativeElement.closest('.overflow-auto');
        if (sidebar) {
          sidebar.scrollTop += 80; // scroll down 80px smoothly
        }
      }
    }, 0);
  }
}