import { Component, Input, input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Component as SidebarLink, ModuleMeta } from '../../interface/interface-list';
import { SidebarService } from '../sidebar.service';
import { EMPTY, Subscription, filter } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
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

  constructor(private sidebarService: SidebarService,private dataSharing:DataSharingService, private router: Router) {}

  /** The module's only link, when the module has no sub menu: the module itself is then the link. */
  get directLink(): SidebarLink | undefined {
    return this.module.singleLink ? this.module.components[0] : undefined;
  }

  /** True while the direct link's screen is open, so the module is highlighted. */
  isDirectLinkActive = false;
  /** `name` of the sub-link whose screen is open, or null when none of this module's screens is open. */
  activeLinkName: string | null = null;

  /** CSS mask that draws the module's icon image in the row's text colour (the icon PNGs are black line drawings). */
  iconMask = '';

  ngOnInit() {
    this.iconMask = `url("${this.module.icon}") center / contain no-repeat`;

    this.subscription = this.sidebarService.getActiveItem().subscribe(activeId => {
      this.isOpen = (activeId === this.module.name);
    });

    // Highlight the module of the open screen, and open its sub-links (e.g. after a page reload)
    this.updateActiveState();
    this.subscription.add(
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => this.updateActiveState())
    );
  }

  private updateActiveState() {
    const isOpenScreen = (link: SidebarLink) => this.router.isActive('/' + link.name, {
      paths: 'subset', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored',
    });
    const direct = this.directLink;
    this.isDirectLinkActive = !!direct && isOpenScreen(direct);
    this.activeLinkName = direct ? null : this.module.components.find(isOpenScreen)?.name ?? null;
    if (this.activeLinkName) {
      this.isOpen = true;
    }
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
        // Find the sidebar's scrolling menu list (the <nav> in sidebar.component.html)
        const sidebar = this.dropdownMenu?.nativeElement.closest('nav');
        if (sidebar) {
          sidebar.scrollTop += 80; // scroll down 80px smoothly
        }
      }
    }, 0);
  }
}