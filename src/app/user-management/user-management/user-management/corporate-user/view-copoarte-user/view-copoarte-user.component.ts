import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from '../../../../../product/api-service/api-service.service';
import { LoaderComponent } from '../../../../../loader/loader.component';

@Component({
  selector: 'app-view-copoarte-user',
  standalone: true,
  imports: [CommonModule,LoaderComponent],
  templateUrl: './view-copoarte-user.component.html',
  styleUrl: './view-copoarte-user.component.css'
})
export class ViewCopoarteUserComponent {
  value: any;
  corpsData: any;
  isLoading:boolean = false
  userPrivileges: any;
  userPrevilages1: any;
  privilege: any;
  constructor(private router:Router,private apiService:ApiServiceService){}
  onClickRegister() {
    this.router.navigateByUrl("/registerCorporateUser")
  }
  corporateUsers:any
  ngOnInit(): void {
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "User Management") {
          if (item.subComponent?.subComponentName == "Corporate User Registration")
            this.privilege = item;
        }
      }
    }
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.apiService.getAuthorizedCorporate().subscribe({
      next:(res)=>{
        console.log(res);
        if(res){
          this.corpsData = res
        }else{
          alert(res?.error)
        }
      },error:()=>{
        alert('Something Went Wrong!!!')
      }
    })

  }

  select(event:any){
    this.isLoading = true
    console.log(event?.target?.value);
    this.value = event?.target?.value
    this.apiService.getCorpUsers(this.value).subscribe({
      next:(res)=>{
        if(res?.responseCode == 200){
    this.isLoading = false
          this.corporateUsers = res?.data
        }else{
    this.isLoading = false
          alert(res?.error)
        }
        console.log(res);
        
      },error:()=>{
    this.isLoading = false
        alert('Something Went Wrong!!!')
      }
    })
   }
}
