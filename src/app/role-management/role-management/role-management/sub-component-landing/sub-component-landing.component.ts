import { Component } from '@angular/core';
import { ComponentControllerService, SubComponentControllerService, UISubComponent } from '../openapi';
import { AddSubComponentComponent } from '../add-sub-component/add-sub-component.component';
import { NgFor, NgIf } from '@angular/common';
import { LoaderComponent } from '../../../../loader/loader.component';
import { roleService } from '../../../role.service';

@Component({
  selector: 'app-sub-component-landing',
  standalone: true,
  imports: [AddSubComponentComponent, NgFor, NgIf, LoaderComponent],
  templateUrl: './sub-component-landing.component.html',
  styleUrl: './sub-component-landing.component.css'
})
export class SubComponentLandingComponent {

  subComponentName!: string ;
  components :any;
  componentId!: number;
  subComponentReq!: UISubComponent;
  isDisableTable:boolean = true;
  isEnableList:boolean = false;
  subComponent: any;
  userPrivileges: any;
  userPrevilages1: any;
  rolePrivilege: any;
  isLoading: boolean = false;

  constructor(
    private roleService: roleService,
    private componentService: ComponentControllerService, private subcomponentService: SubComponentControllerService) { }

  ngOnInit(): void {
    this.getComponent();
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      console.log(this.userPrivileges[0], "this.userPrevilages");
      console.log(this.userPrevilages1, "this.userPrevilages1");

      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "Role Management") {
          if (item.subComponent?.subComponentName == "Sub Component")
            this.rolePrivilege = item;
        }
      }
    }
  }


  onChangeComponet($event:any){
   this.componentId = $event.target.value;
   this.getSubComponentByComponent(this.componentId);
   this.isEnableList = true;
  }

  getComponent(){
    this.isLoading = true;
    this.roleService.getComponent().subscribe({
      next : (component:any)=>{
        if(component){
          this.isLoading = false;
        this.components = component;
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something went wrong");
      }
    })
  }

  getSubComponentByComponent(componentId:number){
    this.isLoading = true;
    this.roleService.getSubComponentByComponent(componentId).subscribe({
      next : (subComponent:any)=>{
        if(subComponent){
          this.isLoading = false;
        this.subComponent = subComponent;
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something went wrong");
      }
    })
  }

  subComponentCreated(isCreated: boolean){
    if (isCreated) {
      this.isDisableTable = true;
      // this.loadBranches();  
    }
  }


  onAddSubComponent(){
    this.isDisableTable = false;

  }
}
