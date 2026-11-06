import { Component } from '@angular/core';
import { CustomerApiService } from '../user-management/bo/customer/ApiService/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organization-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organization-view.component.html',
  styleUrl: './organization-view.component.css'
})
export class OrganizationViewComponent {
  organizationDetails:any;
  constructor(
    private apiService:CustomerApiService,
        private router: Router,
  ){}

  ngOnInit(){
    this.getOrganizationDetails();
  }

  getOrganizationDetails(){

    this.apiService.getOrganizationDetails().subscribe({
      next:(res)=>{
        console.log(res)
        if(res?.responseCode == 200){
          this.organizationDetails = res?.data?.content
        }
      }
    })
  }

  registerMerchant(){
    this.router.navigateByUrl('/registerOrganization');
  }
}
