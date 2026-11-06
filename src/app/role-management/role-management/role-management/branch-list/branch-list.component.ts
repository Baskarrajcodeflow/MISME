import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RoleManagementModule } from "../role-management.module";
import { DepartmentListComponent } from '../department-list/department-list.component';
import { BranchComponent } from '../branch/branch.component';
import { Branch, BranchControllerService } from '../openapi';
import { roleService } from '../../../role.service';


@Component({
    selector: 'branch-list',
    standalone: true,
    templateUrl: './branch-list.component.html',
    styleUrls: ['./branch-list.component.css'] // Corrected from 'styleUrl' to 'styleUrls'
    ,
    imports: [NgFor, NgIf, RoleManagementModule,DepartmentListComponent,BranchComponent]
})
export class BranchListComponent implements OnInit {
  branches: Branch[] = [];
  expandedBranchId: number | null = null; // Add this to track expanded branch
  isEnableTable: boolean = true;
  userPrivileges: any;
  userPrevilages1: any;
  rolePrivilege: any;

  constructor(private branchService: BranchControllerService,private roleService: roleService) { }

  ngOnInit(): void {
    this.loadBranches();
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      console.log(this.userPrivileges[0], "this.userPrevilages");
      console.log(this.userPrevilages1, "this.userPrevilages1");

      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "Role Management") {
          if (item.subComponent?.subComponentName == "Branch")
            this.rolePrivilege = item;
        }
      }
    }
    console.log( this.rolePrivilege," this.rolePrivilege");
  }

  loadBranches(): void {
    this.roleService.getAllBranches().subscribe({
      next: (data) => this.branches = data
      // error: (err) => console.error('Failed to load branches', err)
    });
  }

  toggleExpansion(branchId: number| null): void {
    console.log("Clicked on", branchId  )
    this.expandedBranchId = this.expandedBranchId === branchId ? null : branchId;
    console.log(this.expandedBranchId)
  }


  addBranch(): void {
    this.isEnableTable = false;
    // this.branchService.addBranch({ id: null, name, departments: [] }).subscribe({
    //   next: () => this.loadBranches(),
    //   error: (err) => console.error('Failed to add branch', err)
    // });
  }
  branchCreated(isCreated: boolean){
    if (isCreated) {
      this.isEnableTable = true;
      this.loadBranches();  
    }
  }

  deleteBranch(branch: Branch): void {
    // if (branch.id === null) {
    //   console.error('Attempted to delete a branch without an ID.');
    //   return;
    // }
    // this.branchService.deleteBranch(branch.id).subscribe({
    //   next: () => this.loadBranches(),
    //   error: (err) => console.error('Failed to delete branch', err)
    // });
  }

  editBranch(branch: Branch): void {
    // Navigate to the edit component, passing the branch ID
  }
  
}
