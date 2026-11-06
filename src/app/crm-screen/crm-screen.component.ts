import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { LoaderComponent } from "../loader/loader.component";
import { Router } from '@angular/router';
import { PermissionService } from '../permission.service';
import { searchReq,SearchResult } from './models';
import { CrmServiceService } from './crm-service.service';
interface SearchOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-crm-screen',
  standalone: true,
  imports: [CommonModule, LoaderComponent, FormsModule],
  templateUrl: './crm-screen.component.html',
  styleUrl: './crm-screen.component.css'
})
export class CrmScreenComponent {
searchText: any;
selectedUserType!:  'CUSTOMER' | 'AGENT' | 'MERCHANT'  | 'MASTER_AGENT' | 'CORPORATE' ;

  constructor(private router: Router, public permissionService: PermissionService, private crmService: CrmServiceService  ) {
    this.permissionService.hideSidebar = true; // Ensure sidebar is visible when entering CRM screen
  }

  keySearchElement: boolean = false; // This can be toggled based on your requirements
  searchResult: SearchResult[] = []; // This will hold the search results
  activeTab: 'Search_Engine' | 'Search_Result' = 'Search_Engine'; // Default active tab
  isLoading: boolean = false;
  searchOptions: SearchOption[] = [];
  searchEmail: string | null = null;
  searchPhone: string | null = null;
  searchWallet: string | null = null;
  searchName: string | null = null;
  searchIdProof: string | null = null;
  pageNumber: number = 0; // Current page number for pagination
  ngOnInit() {
    this.crmService.getAllDormantUsers(0).subscribe({  
      next: (response) => {
        console.log('Dormant Users Response:', response);
  } });
 
}
  
  onSelectUserType(event: any) {
    
  }
  onSelectSearchKey(event: any) {
    //this.selectedKey = event.target.value;
  }
  onKeyPressWalletOrPhone(event: KeyboardEvent): void {   
      if (!/[0-9]/.test(event.key)) {
        event.preventDefault();      
    }
  }
  onKeyPressName(event: KeyboardEvent): void {    
      if (!/[a-zA-Z ]/.test(event.key)) {
        event.preventDefault();      
    }
  }
  searchCustomer(form : NgForm) {
    this.isLoading = true;
    console.log(form.value);
    let searchReq : searchReq ={
      email: form.value.email || null,
      phone: form.value.phone || null,
      wallet: form.value.wallet || null,
      name: form.value.name || null,
      idProof: form.value.idProof || null,
      userType: this.selectedUserType,
      page: this.pageNumber,
    }
    this.crmService.searchUsers(searchReq).subscribe({  
      next: (response) => {
        console.log('Search Response:', response);
        this.searchResult = response.data;
        this.crmService.setSearchResult(this.searchResult);
        this.isLoading = false;
  }
});
    this.activeTab = 'Search_Result'; 
  }
  viewCustomer(userType: string, userId: number, userSlected: any) {
    this.isLoading = true;
    this.permissionService.hideSidebar = true; // Hide sidebar when viewing customer details
    this.crmService.viewUser(userId).subscribe({
      next: (response: any ) => {
        if(response?.responseCode == 200){
        console.log('View Customer Details:', response);
        this.crmService.setUserDetails(response.data);
        this.router.navigate(['/crm-customer-details', userType, userId]);
        this.isLoading = false;
      }
    
    else{
     this.isLoading = false;
      alert("Try Again")
    }
  }
    });
  }
  onNavigate(route: string) {
    // Implement navigation logic here
    this.router.navigate([route]);
  }
}
