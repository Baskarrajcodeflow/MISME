import { Component, OnInit } from '@angular/core';
import { CreateRoleComponent } from '../create-role/create-role.component';
import { NgFor, NgIf } from '@angular/common';
import { RoleManagementControllerService } from '../openapi';
import { Router } from '@angular/router';
import { LoaderComponent } from '../../../../loader/loader.component';
import { roleService } from '../../../role.service';
import { showToast } from '../../../../core/toast/toast';

@Component({
  selector: 'app-roles-landing',
  standalone: true,
  imports: [CreateRoleComponent, NgIf, NgFor, LoaderComponent],
  templateUrl: './roles-landing.component.html',
  styleUrl: './roles-landing.component.css'
})
export class RolesLandingComponent implements OnInit {

  roles!: any;
  isEnableTable:boolean = true;
  roleId: any;
  userPrivileges: any;
  userPrevilages1: any;
  rolePrivilege: any;
  isLoading: boolean = false;

  constructor(private roleService:RoleManagementControllerService,private roleService1:roleService,private router:Router){}

  ngOnInit(): void {
    this.getRole();
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "Role Management") {
          if (item.subComponent?.subComponentName == "Role")
            this.rolePrivilege = item;
        }
      }
    }
  }

  getRole(){
  this.isLoading = true;
   this.roleService1.getRoles(0,1000).subscribe({
    next : (role:any)  => {
      if(role){
        this.isLoading = false;
        this.roles = role.data;
      }
    },
    error: () => {
      this.isLoading = false;
      showToast("Something went wrong");
    }
   })
  }

  onAddRole(){
    this.isEnableTable = false;
  }

  onRoleCreated(isCreated: boolean) {
    if (isCreated) {
      this.isEnableTable = true;
      this.getRole();  // Refresh roles list after creation
    }
  }
  onClickEdit(id: any) {
    this.roleId = id;
    this.isEnableTable = true;
    this.router.navigate(['editRole', this.roleId]);
  }
  
}
