import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ComponentControllerService, SubComponentControllerService, UISubComponent } from '../openapi';
import { LoaderComponent } from '../../../../loader/loader.component';
import { RoleService } from '../services/role.service';
import { roleService } from '../../../role.service';

@Component({
  selector: 'app-add-sub-component',
  standalone: true,
  imports: [FormsModule,NgIf,NgFor, LoaderComponent],
  templateUrl: './add-sub-component.component.html',
  styleUrl: './add-sub-component.component.css'
})
export class AddSubComponentComponent {

  subComponentName!: string ;
  components :any;
  componentId!: number;
  subComponentReq!: UISubComponent;
  isLoading: boolean = false;
  selectedComponent:any;
  @Output() subComponentCreated = new EventEmitter<boolean>();

  constructor(
    private roleService: roleService,private componentService: ComponentControllerService, private subcomponentService: SubComponentControllerService) { }

  ngOnInit(): void {
    this.getComponent();
  }


  onChangeComponet($event:any){
   this.componentId = $event.target.value;
  }

  getComponent(){
    this.roleService.getComponent().subscribe({
      next : (component:any)=>{
        this.components = component;
      }
    })
  }

  onSubmit(){
    this.subComponentReq = {
      componentId : this.componentId,
      subComponentName: this.subComponentName,
      active : true
   }
   this.isLoading = true;
    this.roleService.addSubComponent(this.subComponentReq).subscribe({
        next: (subcomponent:any) => {
          if(subcomponent){
            this.isLoading = false
            alert("created successfully");
            this.subComponentCreated.emit(true);
            this.subComponentName = '';
          }
        },
        error: () => {
          this.isLoading = false;
          alert("Something went wrong");
        }
      })
  }
}