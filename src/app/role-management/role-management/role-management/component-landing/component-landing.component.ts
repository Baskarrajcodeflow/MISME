import { Component, OnInit } from '@angular/core';
import { ComponentControllerService } from '../openapi';
import { AddComponentComponent } from '../add-component/add-component.component';
import { NgFor, NgIf } from '@angular/common';
import { LoaderComponent } from '../../../../loader/loader.component';

@Component({
  selector: 'app-component-landing',
  standalone: true,
  imports: [AddComponentComponent,NgFor,NgIf, LoaderComponent],
  templateUrl: './component-landing.component.html',
  styleUrl: './component-landing.component.css'
})
export class ComponentLandingComponent implements OnInit {

  isDisableTable:boolean = true;
  components: any;
  userPrivileges: any;
  userPrevilages1: any;
  rolePrivilege: any;
  isLoading: boolean = false;

  constructor(private componenetService:ComponentControllerService){}

  ngOnInit(): void {
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      console.log(this.userPrivileges[0], "this.userPrevilages");
      console.log(this.userPrevilages1, "this.userPrevilages1");

      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "Role Management") {
          if (item.subComponent?.subComponentName == "Component")
            this.rolePrivilege = item;
        }
      }
    }
    this.getComponents();

  }

  getComponents(){
    this.isLoading = true;
   this.componenetService.getComponent().subscribe({
    next : (components:any)  => {
      if(components){
        this.isLoading = false;
        this.components = components;
      }
    },
    error: () => {
      this.isLoading = false;
      alert("Something went wrong");
    }
   })
  }

  componentCreated(isCreated: boolean){
    if (isCreated) {
      this.isDisableTable = true;
      this.getComponents(); 
    }
  }

  onAddRole(){
    this.isDisableTable = false;
  }

}
