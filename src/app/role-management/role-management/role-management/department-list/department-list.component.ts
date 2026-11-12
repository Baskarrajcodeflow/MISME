import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { DepartmentComponent } from '../department/department.component';
import { Department, DepartmentControllerServiceService } from '../openapi';
import { LoaderComponent } from '../../../../loader/loader.component';
import { roleService } from '../../../role.service';
import { showToast } from '../../../../core/toast/toast';

@Component({
  standalone: true,
  selector: 'department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css'],
  imports:[FormsModule, NgIf, NgFor, DepartmentComponent,LoaderComponent]
})
export class DepartmentListComponent implements OnInit {
  
    @Input() branchId!: number;
    @Input() branchName ! : string;
    @Input() departments ! : Department[];
    isEnableTable:boolean = true;
    editMode: { [key: number]: boolean } = {};
  userPrivileges: any;
  userPrevilages1: any;
  rolePrivilege: any;
  isLoading: boolean = false;

  
    constructor(private departmentService: DepartmentControllerServiceService,private roleService: roleService) {}
  
    ngOnInit(): void {
      this.loadDepartments();
      const privilegesData = sessionStorage.getItem('privileges');
      if (privilegesData) {
        this.userPrivileges = JSON.parse(privilegesData);
        this.userPrevilages1 = this.userPrivileges[0];  
        for (let item of this.userPrevilages1?.uiComponentPrivileges) {
          if (item?.component?.componentName == "Role Management") {
            if (item.subComponent?.subComponentName == "Department")
              this.rolePrivilege = item;
          }
        }
      }
    }
  
    loadDepartments(): void {
      this.isLoading = true;
      // if (this.branchId) {
        this.roleService.getDepartmentByBranch(1).subscribe({
          next :(departments: any) => {
          this.departments = departments;
          this.isLoading = false;
          // .filter(d:ANY => d.id !== null); // Filter out any departments without an ID
          // this.departments.forEach(dept => {
          //   this.editMode[dept.id as number] = false; // Safely cast to number, assuming IDs are filtered
          // });
        },
        error: () => {
          this.isLoading = false;
          showToast("Something went wrong");
        }
      })
      // }
    }
  
    addDepartment(): void {
      this.isEnableTable = false
      // const newDepartment = { id: null, name, branchId: this.branchId, roleId: 0 }; // Assuming a role ID, adjust as needed
      // this.departmentService.addDepartment(newDepartment as Department).subscribe(() => {
      //   this.loadDepartments();
      // });
    }
  
    updateDepartment(department: Department): void {
      // if (department.id !== null) { // Ensure ID is not null before calling the service
      //   this.departmentService.updateDepartment(department).subscribe(() => {
      //     this.editMode[department.id as number] = false; // Safely cast to number
      //     this.loadDepartments();
      //   });
      // } else {
      //   console.error('Cannot update a department without an ID.');
      // }
    }
  
    toggleEditMode(id: number | null): void {
      if (id !== null) {
        this.editMode[id] = !this.editMode[id];
      }
    }

    departmentCreated(isCreated: boolean){
      if (isCreated) {
        this.isEnableTable = true;
        this.loadDepartments();  // Refresh roles list after creation
      }
    }
  
    removeDepartment(id: number | null): void {
      // if (id !== null) {
      //   this.departmentService.deleteDepartment(id).subscribe(() => {
      //     this.loadDepartments();
      //   });
      // } else {
      //   console.error('Cannot delete a department without an ID.');
      // }
    }
  }