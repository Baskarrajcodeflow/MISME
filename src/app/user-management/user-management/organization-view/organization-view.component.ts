import { Component, inject } from '@angular/core';
import { CustomerApiService } from '../user-management/bo/customer/ApiService/api.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { organizationScreenFor } from '../../organization/organization-screen';

@Component({
  selector: 'app-organization-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organization-view.component.html',
  styleUrl: './organization-view.component.css'
})
export class OrganizationViewComponent {
  organizationDetails:any;
  // Merchants (back office) or Partners (manufacture), chosen by the route's data
  private readonly route = inject(ActivatedRoute);
  readonly screen = organizationScreenFor(this.route);
  // Entity type to show, from the ?type= query parameter (set by the manufacture dashboard's cards).
  // '' shows every type.
  typeFilter = '';
  constructor(
    private apiService:CustomerApiService,
        private router: Router,
  ){
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.typeFilter = params.get('type') ?? '';
    });
  }

  /** The loaded organizations, narrowed to typeFilter when one is set. */
  get visibleOrganizations(): any[] {
    const all: any[] = this.organizationDetails ?? [];
    return this.typeFilter ? all.filter((item) => item.entityType === this.typeFilter) : all;
  }

  /** The filter's label as shown in the Entity Type dropdown. */
  get typeFilterLabel(): string {
    return this.screen.entityTypes.find((type) => type.value === this.typeFilter)?.label ?? this.typeFilter;
  }

  clearTypeFilter(){
    this.router.navigateByUrl(this.screen.listPath);
  }

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
    this.router.navigateByUrl(this.screen.registerPath);
  }
}
