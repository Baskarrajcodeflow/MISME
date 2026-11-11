import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrevilageComponent, UserPrivilages } from '../user-privilages';
import { AddRoleRestControllerRequest, Branch, BranchControllerServiceService, ComponentControllerService, Department, DepartmentControllerServiceService, RoleManagementControllerService, SubComponentControllerService } from '../openapi';
import { Router } from '@angular/router';
import { LoaderComponent } from '../../../../loader/loader.component';
import { roleService } from '../../../role.service';
import { showToast } from '../../../../core/toast/toast';

@Component({
  selector: 'app-create-role',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf, FormsModule, LoaderComponent,CommonModule],
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.css'
})
export class CreateRoleComponent {
  public components: { [key: number]: PrevilageComponent[] } = {};
  public success: boolean = false;
  public failure: boolean = false;
  req!: AddRoleRestControllerRequest;
  branchId!: number;
  mainComponents: any[] = [];
  @Output() roleCreated = new EventEmitter<boolean>();
  maker: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private branchService: BranchControllerServiceService, 
    private roleService: RoleManagementControllerService, 
    private subcomponentService: SubComponentControllerService, 
    private departmentService: DepartmentControllerServiceService, 
    private componentService: ComponentControllerService,
    private roleService1: roleService,
    private router: Router
  ) {
    this.addRoleForm = this.fb.group({
      roleName: ['', Validators.required],
      roleDesc: ['', Validators.required],
      branch: ['', Validators.required],
      department: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBranches();
    this.loadComponents();
  }

  addRoleForm: FormGroup;
  branches: Branch[] = [];
  departments: Department[] = [];

  loadBranches(): void {
    this.roleService1.getBranch().subscribe({
      next: (branches: any) => {
        this.branches = branches;
      }
    });
  }

  loadSubComponents(mainSelectedId: any): void {
    this.roleService1.getSubComponentByComponent(mainSelectedId).subscribe({
      next: (subComponents: any) => {
        this.components[mainSelectedId] = subComponents.map((val: any) => ({
          subComponentId: val.id,
          subComponentName: val.subComponentName,
          componentId: val.componentId,
          active: false,
          update: false,
          create: false,
          authorize: false,
          delete: false,
          read: false
        }));
      }
    });
  }

  loadComponents(): void {
    this.roleService1.getComponent().subscribe({
      next: (mainComponent: any) => {
        this.mainComponents = mainComponent;
      }
    });
  }

  loadDepartments(branchId: number): void {
    this.roleService1.getDepartmentByBranch(branchId).subscribe({
      next: (departments: any) => {
        this.departments = departments;
      }
    });
  }

  onSelectBranch($event: any): void {
    this.branchId = $event.target.value;
    this.loadDepartments(this.branchId);
  }

  onCheckAll(mainComponent: any, event: any): void {
    const isChecked = event.target.checked;
    mainComponent.isChecked = isChecked;

    if (isChecked) {
      this.loadSubComponents(mainComponent.id);
    } else {
      delete this.components[mainComponent.id];
    }
  }

  public onCheckingAllCheckbox($event: any, c: UserPrivilages): void {
    const isChecked = $event?.target?.checked;
    c.active = isChecked;
    c.authorize = isChecked;
    c.read = isChecked;
    c.delete = isChecked;
    c.update = isChecked;
    c.create = isChecked;
  }

  // submit(): void {
  //   let cpSet: any = [];

  //   Object.keys(this.components).forEach(key => {
  //     this.components[Number(key)].forEach((data: PrevilageComponent) => {
  //       let privilege = {
  //         componentId: data.componentId,
  //         subComponentId: data.subComponentId,
  //         subComponentName: data.subComponentName,
  //         create: data.create,
  //         update: data.update,
  //         authorize: data.authorize,
  //         read: data.read,
  //         delete: data.delete,
  //         active: data.active
  //       };
  //       cpSet.push(privilege);
  //     });
  //   });

  //   this.req = {
  //     roleName: this.addRoleForm.value.roleName,
  //     roleDesc: this.addRoleForm.value.roleDesc,
  //     departmentId: this.addRoleForm.value.department ? Number(this.addRoleForm.value.department) : undefined,
  //     componentPriveleges: cpSet
  //   };

  //   this.roleService.addRole(this.req).subscribe((data: any) => {
  //     if (data?.responseCode == 200) {
  //       alert("Role created successfully");
  //       this.roleCreated.emit(true);
  //       this.resetForm();
  //       this.success = true;
  //       this.failure = false;
  //     } else {
  //       alert("Something Went Wrong");
  //       this.success = false;
  //       this.failure = true;
  //     }
  //   }, (error) => {
  //     this.success = false;
  //     this.failure = true;
  //   });
  // }

  submit(): void {
    let cpSet: any = [];
  
    Object.keys(this.components).forEach(key => {
      this.components[Number(key)].forEach((data: PrevilageComponent) => {
        if (data.create || data.update || data.authorize || data.read || data.delete || data.active) {
          let privilege = {
            componentId: data.componentId,
            subComponentId: data.subComponentId,
            subComponentName: data.subComponentName,
            create: data.create,
            update: data.update,
            authorize: data.authorize,
            read: data.read,
            delete: data.delete,
            active: data.active
          };
          cpSet.push(privilege);
        }
      });
    });
  
    this.req = {
      roleName: this.addRoleForm.value.roleName,
      roleDesc: this.addRoleForm.value.roleDesc,
      departmentId: this.addRoleForm.value.department ? Number(this.addRoleForm.value.department) : undefined,
      componentPriveleges: cpSet
    };
    this.isLoading = true;
    this.roleService1.addRole(this.req).subscribe((data: any) => {
      if (data?.responseCode == 200) {
        this.isLoading = false;
        showToast("Role created successfully");
        this.roleCreated.emit(true);
        this.resetForm();
        this.success = true;
        this.failure = false;
      } else {
        showToast("Something Went Wrong");
        this.success = false;
        this.failure = true;
      }
    }, (error) => {
      showToast("Something Went Wrong");
      this.isLoading = false;
      this.success = false;
      this.failure = true;
    });
  }
  
  resetForm(): void {
    this.addRoleForm.reset();
    this.mainComponents.forEach(component => component.isChecked = false);
    this.components = {};
  }

  public onCheckingCreate($event: any, c: UserPrivilages): void {
    if(c.read !=true){
      c.create = $event?.target?.checked || false;
      if(c.delete == true){
        this.maker = true;
      }
      else{
        this.maker = false;
      }
    }
    else{
      alert
    }
   
  }

  public onCheckingUpdate($event: any, c: UserPrivilages): void {
    c.update = $event?.target?.checked || false;
  }

  public onCheckingDelete($event: any, c: UserPrivilages): void {
    c.delete = $event?.target?.checked || false;
  }

  public onCheckingView($event: any, c: UserPrivilages): void {
    const isChecked = $event?.target?.checked;
    c.read = isChecked;
    c.active = isChecked;
  }

  public onCheckingAuthorize($event: any, c: UserPrivilages): void {
    c.authorize = $event?.target?.checked || false;
  }

  public onCheckingActive($event: any, c: UserPrivilages): void {
    const isChecked = $event?.target?.checked;
    c.active = isChecked;
    c.read = isChecked;
  }

  public onCheckingAll($event: any, c: UserPrivilages): void {
    const isChecked = $event?.target?.checked;
    c.active = isChecked;
    c.authorize = isChecked;
    c.read = isChecked;
    c.delete = isChecked;
    c.update = isChecked;
    c.create = isChecked;
  }
}
