import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AddRoleRestControllerRequest,
  Branch,
  BranchControllerServiceService,
  ComponentControllerService,
  Department,
  DepartmentControllerServiceService,
  EditRoleRestControllerRequest,
  RoleControllerService,
  RoleManagementControllerService,
  SubComponentControllerService,
} from '../openapi';
import { NgFor, NgIf } from '@angular/common';
import { componentPrivilage, PrevilageComponent, UserPrivilages } from '../user-privilages';
import { roleService } from '../../../role.service';

@Component({
  selector: 'app-edit-role',
  standalone : true,
  imports : [ReactiveFormsModule,NgIf,NgFor],
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.css'],
})
export class EditRoleComponent {
  public components: any
  public success: boolean = false;
  public failure: boolean = false;
  req: any;
  branchId!: number;
  mainComponents: any[] = [];
  @Output() roleCreated = new EventEmitter<boolean>();
  roleId: any;
  privilages: any;
  uiComponentPrivileges: any;
  uiComponents: any;
  editForm!: FormGroup;
  branches: Branch[] = [];
  departments: Department[] = [];
  privilageChcek!: any[];
  latestArray: any[] = []; 
  request: any;
  roleName: string = '';
  roleDesc: string = '';
  constructor(
    private fb: FormBuilder, 
    private branchService: BranchControllerServiceService, 
    private roleService: RoleManagementControllerService, 
    private subcomponentService: SubComponentControllerService, 
    private departmentService: DepartmentControllerServiceService, 
    private componentService: ComponentControllerService,
    private roleManagementService:RoleControllerService,
    private roleService1: roleService,
    private router: Router,
    private route:ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.loadBranches();
    this.loadComponents();
    this.route.paramMap.subscribe((params) => {
      this.roleId = params.get('roleId');
      if (this.roleId) {
        this.getRoleById();
      }
    });
    // this.editForm = this.fb.group({
    //   roleName: [this.roleName, Validators.required],
    //   roleDesc: [this.roleName, Validators.required],
    //   branch: ['', Validators.required],
    //   department: ['', Validators.required]
    // });
    this.initForm();
  }

  initForm() {
    this.editForm = this.fb.group({
      roleName: ['', Validators.required],
      roleDesc: ['', Validators.required],
      // add other controls as needed
    });

    this.updateFormValues();
  }

  updateFormValues() {
    if (this.editForm.controls['roleName'].value != "") {
      this.roleName = this.editForm.controls['roleName'].value;
    }
    if (this.editForm.controls['roleDesc'].value != "") {
      this.roleDesc = this.editForm.controls['roleDesc'].value;
    }
  }

  getRoleById() {
    this.roleService.getRole(this.roleId).subscribe(data => {
      this.privilages = data?.data;
      this.uiComponentPrivileges = this.privilages.uiComponentPrivileges;
      this.editForm.patchValue({
        roleName: this.privilages.roleName,
        roleDesc: this.privilages.roleDesc,
      });
      this.uiComponents = this.privilages?.uiComponentPrivileges;
  
      // Clear existing components
      this.components = {};
  
      this.uiComponentPrivileges.forEach((val: any) => {
        let componentId = val.component.id;
        let subComponentId = val.subComponent.id;
        let existingPrivilege = {
          subComponentId: subComponentId,
          componentId: componentId,
          subComponentName: val.subComponent.subComponentName,
          active: val.active,
          update: val.updatePrivelege,
          create: val.createPrivelege,
          authorize: val.authorizePrivelege,
          delete: val.deletePrivelege,
          read: val.readPrivelege,
          privilegeId: val.id // Set privilege ID from the response
        };
  
        if (!this.components[componentId]) {
          this.components[componentId] = [];
        }
  
        let subComponent = this.components[componentId].find((sc:any) => sc.subComponentId === subComponentId);
        if (subComponent) {
          subComponent.active = existingPrivilege.active;
          subComponent.update = existingPrivilege.update;
          subComponent.create = existingPrivilege.create;
          subComponent.authorize = existingPrivilege.authorize;
          subComponent.delete = existingPrivilege.delete;
          subComponent.read = existingPrivilege.read;
          subComponent.privilegeId = existingPrivilege.privilegeId;
        } else {
          this.components[componentId].push(existingPrivilege);
        }
      });
  
      // Ensure all subcomponents have a privilege ID set
      for (let componentId in this.components) {
        this.components[componentId] = this.components[componentId].map((subComponent:any) => {
          if (!subComponent.privilegeId) {
            return { ...subComponent, privilegeId: null };
          }
          return subComponent;
        });
      }
    });
  }
  
  

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
        this.components[mainSelectedId] = subComponents.map((val: any) => {
          let existingSubComponent = this.components[mainSelectedId]?.find((sc:any) => sc.subComponentId === val.id);
  
          return {
            subComponentId: val.id,
            componentId: val.componentId,
            subComponentName: val.subComponentName,
            active: existingSubComponent ? existingSubComponent.active : false,
            update: existingSubComponent ? existingSubComponent.update : false,
            create: existingSubComponent ? existingSubComponent.create : false,
            authorize: existingSubComponent ? existingSubComponent.authorize : false,
            delete: existingSubComponent ? existingSubComponent.delete : false,
            read: existingSubComponent ? existingSubComponent.read : false,
            privilegeId: existingSubComponent ? existingSubComponent.privilegeId : null // Set privilege ID
          };
        });
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

  

  submit() {
   
    // Get form values
    this.roleName = this.editForm.controls['roleName'].value;
    this.roleDesc = this.editForm.controls['roleDesc'].value;
  
    // Prepare component privileges
    let cpSet: { componentId: number; subComponentId: number; privilegeId:number; create: boolean; read: boolean; update: boolean; delete: boolean; authorize: boolean; active: boolean; }[] = [];
  
    // Log latestArray to verify its content
    console.log(this.latestArray, "final");
  
    this.latestArray.forEach((data: any) => {
      // Create a new privilege object based on latestArray data
      let dfs = {
        componentId: data.componentId,
        subComponentId: data.subComponentId,
        privilegeId : data.privilegeId,
        create: data.create ,
        read: data.read ,
        update: data.update,
        delete: data.delete,
        authorize: data.authorize,
        active: data.active,
      };
      cpSet.push(dfs);
    });
  
    // Prepare request object
    this.request = {
      roleId: this.roleId,
      roleName: this.roleName,
      roleDesc: this.roleDesc,
      componentPriveleges: cpSet
    };
  
    // Log request object to verify its structure
    console.log(this.request, "request");
  
    // Call the service to submit the data
    this.roleService.editRole(this.request).subscribe((data: any) => {
      if (data?.responseCode == 200) {
        this.success = true;
        this.failure = false;
        alert("Role edit Successful")
        this.router.navigateByUrl("/Role");
      } else {
        this.success = false;
        this.failure = true;
      }
    }, (error) => {
      alert("Something went wrong")
      this.success = false;
      this.failure = true;
    });
  }
  

  resetForm(): void {
    this.editForm.reset();
    this.mainComponents.forEach(component => component.isChecked = false);
    this.components = {};
  }
  public onCheckingCreate($event: any, c: any) {
    if ($event?.target?.checked == true) {
      console.log($event?.target?.checked, "$event?.target?.checked");
      c.create = true;
      c.active = true;
    }
    else {
      c.create = false;
    }
    // this.latestArray = this.latestArray.filter((item:any)=> item.subComponentId !== c.subComponentId);
    this.latestArray.push(c)
    console.log(this.latestArray, "this.latestArray");
  }

  public onCheckingAllCheckbox($event: any, c: any): void {
    if ($event?.target?.checked == true) {
      c.active = true;
      c.authorize = true;
      c.read = true;
      c.delete = true;
      c.update = true;
      c.create = true;
    }
    else {
      c.active = false;
      c.authorize = false;
      c.read = false;
      c.delete = false;
      c.update = false;
      c.create = false;
    }
    this.latestArray = this.latestArray.filter(item => item.subComponentId !== c.subComponentId);
    this.latestArray.push(c)
    console.log(this.latestArray, "this.latestArray");
  }


  public onCheckingUpdate($event: any, c: any) {
    if ($event?.target?.checked == true) {
      c.update = true;
      c.active = true;
    }
    else {
      c.update = false;
    }
    this.latestArray = this.latestArray.filter((item:any)=> item.subComponentId !== c.subComponentId);
    this.latestArray.push(c)
    console.log(this.latestArray, "this.latestArray");
  }

  public onCheckingDelete($event: any, c: any) {
    if ($event?.target?.checked == true) {
      console.log($event?.target?.checked, "$event?.target?.checked");
      c.delete = true;
      c.active = true;
    }
    else {
      c.delete = false;
    }
    this.latestArray = this.latestArray.filter((item:any)=> item.subComponentId !== c.subComponentId);
    this.latestArray.push(c)
    console.log(this.latestArray, "this.latestArray");
  }

  public onCheckingView($event: any, c: any) {
    if ($event?.target?.checked == true) {
      console.log($event?.target?.checked, "$event?.target?.checked");
      c.read = true;
      c.active = true;
    }
    else {
      c.read = false;
    }
    this.latestArray = this.latestArray.filter((item:any)=> item.subComponentId !== c.subComponentId);
    this.latestArray.push(c)
    console.log(this.latestArray, "this.latestArray");
  }
  
  public onCheckingAuthorize($event: any, c: any) {
    if ($event?.target?.checked == true) {
      console.log($event?.target?.checked, "$event?.target?.checked");
      c.authorize = true;
      c.active = true;
    }
    else {
      c.authorize = false;
    }
    this.latestArray = this.latestArray.filter((item:any)=> item.subComponentId !== c.subComponentId);
    this.latestArray.push(c)
    console.log(this.latestArray, "this.latestArray");
  }

  public onCheckingActive($event: any, c: any) {
    if ($event?.target?.checked == true) {
      console.log($event?.target?.checked, "$event?.target?.checked");
      c.active = true;
      c.read = true;
    }
    else {
      c.active = false;
      c.read = false;
    }
    this.latestArray = this.latestArray.filter((item:any)=> item.subComponentId !== c.subComponentId);
    this.latestArray.push(c)
    console.log(this.latestArray, "this.latestArray");
  }

  public onCheckingAll($event: any, c: any) {
    if ($event?.target?.checked == true) {
      c.active = true;
      c.authorize = true;
      c.read = true;
      c.delete = true;
      c.update = true;
      c.create = true;
    }
    else {
      c.active = false;
      c.authorize = false;
      c.read = false;
      c.delete = false;
      c.update = false;
      c.create = false;
    }
    this.latestArray = this.latestArray.filter(item => item.subComponentId !== c.subComponentId);
    this.latestArray.push(c)
    console.log(this.latestArray, "this.latestArray");
  }

}
