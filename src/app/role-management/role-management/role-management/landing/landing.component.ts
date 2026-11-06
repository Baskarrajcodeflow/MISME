import { Component } from '@angular/core';
import { MipayAuthorityListComponent } from '../mipay-authority-list/mipay-authority-list.component';
import { BranchListComponent } from '../branch-list/branch-list.component';
import { MlsModuleComponent } from '../mls-module/mls-module.component';
import { MipayAuthorityComponent } from '../mipay-authority/mipay-authority.component';
import { TabsComponent } from '../../ui/tabs/tabs.component';
import { TabComponent } from '../../ui/tab/tab.component';
import { DepartmentListComponent } from '../department-list/department-list.component';

@Component({
  selector: 'role-landing',
  standalone: true,
  imports: [
    TabsComponent,
    TabComponent,
    BranchListComponent,
    MlsModuleComponent,
    DepartmentListComponent,
    MipayAuthorityComponent
   ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class RoleLandingComponent {

}
