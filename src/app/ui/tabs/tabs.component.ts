import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { TabsService } from './tabs.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [TabComponent, CommonModule, NgFor, NgIf],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;
  selectedTab: TabComponent | null = null;

  ngAfterContentInit() {
    this.selectedTab = this.tabs.first;
  }

  selectTab(tab: TabComponent) {
    this.selectedTab = tab;
  }
  }