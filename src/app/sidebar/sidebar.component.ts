import { Component, Input, OnInit, computed, inject } from '@angular/core';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth/auth.service';
import { PermissionService } from '../permission.service';
import { HttpClient } from '@angular/common/http';
import { SidebarItemComponent } from './sidebar-item/sidebar-item.component';
import { ModuleMeta } from '../interface/interface-list';
import { DataSharingService } from '../product/dataSharing/data-sharing.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [NgFor,  NgIf, SidebarItemComponent, CommonModule],
  templateUrl: './sidebar.component.html',
  animations: [
    trigger('slideInOut', [
      state('void', style({ transform: 'translateX(-100%)', opacity: 0 })),
      transition(':enter', [animate('300ms ease-out')]),
      transition(':leave', [animate('300ms ease-in')]),
    ])
  ]
})
export class SidebarComponent implements OnInit {
  permittedModules: ModuleMeta[] = [];
  isSidebarVisible = true;

  constructor( private http: HttpClient, private router: Router, public auth: AuthService,
    public permissionService: PermissionService,
    private data:DataSharingService
  ) {}
  ngOnInit(): void {
    // setTimeout(() => {
    this.data.setOperator$.subscribe((res)=>{
      if (res) {
        this.permittedModules = this.permissionService.getPermittedModules();
        console.log(this.permittedModules, "getPermittedModules");
      }
    })
    this.data.emptyArray$.subscribe((res:any)=>{
      if(res === true){
        this.permittedModules = []
      }
    })
    // }, 8000);
  }
  currentUser = inject(AuthService).currentUser
  // permittedModules = inject(PermissionService).permittedModels
  // filteredModuleNames = computed(()=>this.permittedModules().map(m=>m.name))
  openModule :string=""
  openModules: string[] = [];
  subComponents : any[] = [];
  private jsonUrl = 'assets/data-responses/response.json';


  toggleAccordion(moduleName: string): void {
    if (this.openModules.includes(moduleName)) {
      this.openModules = this.openModules.filter(name => name !== moduleName);
      // this.permittedModules().map( module =>{
      //   if(module.components?.length == 0){
      //     this.router.navigate(['/UserManagement']);
      //   }
      // })
      
      
    } else {
      this.openModules.push(moduleName);
      }
    
  }

  isAccordionOpen(moduleName: string): boolean {
   /*  if(moduleName == 'paymentAndMoneyTransfer'){
      this.getSubComponents(moduleName);
    } */
    return this.openModules.includes(moduleName);
  }


 toggleSidebar(){
   this.isSidebarVisible = !this.isSidebarVisible;

 }

  getSubComponents(moduleName: string) : void {
    if(moduleName == 'paymentAndMoneyTransfer'){
     this.http.get<any>(this.jsonUrl).subscribe( data => {
      this.subComponents = data.paymentMoneyTransfer_subComponents;
      console.log("Sub Components", this.subComponents);
      })
 

    }
   
  
  }

  gotoSubComponent(id : string){
  }

}

