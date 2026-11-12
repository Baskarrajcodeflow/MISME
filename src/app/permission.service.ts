import { Injectable, computed, signal } from '@angular/core';
import { ModuleMeta } from './interface/interface-list';
import { LoginComponent } from './landing/login/login.component';
import { Route } from '@angular/router';
import { DataSharingService } from './product/dataSharing/data-sharing.service';
import { UserPrivilages } from './role-management/role-management/role-management/user-privilages';
import { PLATFORM, PLATFORM_LOGIN } from '../environments/platform';
import type { Platform } from '../environments/platform.model';
import { isOnPlatform } from './core/platform/platform-filter';
import { PARTNER_SCREEN } from './user-management/organization/organization-screen';

@Injectable({
  providedIn: 'root',

})
export class PermissionService {

  uiComponentPrivileges: any[] = [

  ];
  res: any;
  userPrevilages: UserPrivilages[] = [];
  public hideSidebar: boolean = false;

  constructor(private data: DataSharingService) {
    this.data.setOperator$.subscribe((res) => {
      this.res = res;
      if (res) {
        this.uiComponentPrivileges.push(res);
        sessionStorage.setItem("privileges", JSON.stringify(this.uiComponentPrivileges))
      }

    });

    this.data.emptyArray$.subscribe((res: any) => {
      if (res === true) {
        this.uiComponentPrivileges = []
      }
    })

  }

  getUserPrevilages() {
    if (sessionStorage.getItem('privileges')) {
      // this.setSidebarItems();
    }
    return this.userPrevilages;
  }



  modules: ModuleMeta[] = [

    {
      // Manufacturer landing screen (PLATFORM_LOGIN.homePath). One link, so shown as a direct link
      name: 'Dashboard',
      location: './Dashboard',
      icon: 'assets/icons/dashboard.png',
      platforms: ['manufacturer-app'],
      components: [
        { name: "dashboard", displayLink: "Dashboard" },
      ]
    },
    {
      // A manufacturer's suppliers, distributors and merchants (see manufacturerRoutes()).
      // One link, so the sidebar shows the module itself as the link (see singleLink on ModuleMeta)
      name: 'Partner Onboarding',
      location: './PartnerOnboarding',
      icon: 'assets/icons/verify.png',
      platforms: ['manufacturer-app'],
      components: [
        { name: "partners", displayLink: "Partners" },
      ]
    },
    {
      name: 'User Management',
      location: './UserManagement',
      icon: 'assets/icons/key.png',
      // Hidden on the manufacturer platform for now. To show it there again, remove this `platforms` line
      platforms: ['backoffice'],
      components: [
        { name: "BOLanding", location: "user-modal/user-modal.component", displayLink: "Back Office User" },
        { name: "resetPassword", location: "user-modal/user-modal.component", displayLink: "Reset Password" },
        { name: "CustomerLanding", location: "user-modal/user-modal.component", displayLink: "Customer" },
        // A manufacturer registers organizations through Partner Onboarding instead
        { name: "organization", location: "user-modal/user-modal.component", displayLink: "Organization", platforms: ['backoffice'] },
      ]
    },
    {
      name: "Role Management",
      location: "./RoleManagement",
      icon: "assets/icons/key.png",
      // Not shown on the manufacturer platform
      platforms: ['backoffice'],
      components: [
        {
          name: "ComponentList",
          location: "cashback/cashback.component",
          displayLink: "Component",
        },
        {
          name: "SubComponentList",
          location: "cashback/cashback.component",
          displayLink: "Sub Component",
        },
        {
          name: "Branch",
          location: "cashback/cashback.component",
          displayLink: "Branch",
        },
        {
          name: "Department",
          location: "cashback/cashback.component",
          displayLink: "Department",
        },
        {
          name: "Role",
          location: "cashback/cashback.component",
          displayLink: "Role",
        },
        // { name: "Permission", location: "cashback/cashback.component", displayLink: "Permission" },
      ],
    },
    // {
    //   name: "Supplier Management",
    //   location: "./SupplierManagement",
    //   icon: "assets/icons/key.png",
    //   components: [
    //     {
    //       name: "SupplierMaster",
    //       location: "cashback/cashback.component",
    //       displayLink: "Supplier Master",
    //     },
    //     {
    //       name: "TopupCreditPurchase",
    //       location: "cashback/cashback.component",
    //       displayLink: "Topup Credit Purchase",
    //     },
    // {
    //   name: "Branch",
    //   location: "cashback/cashback.component",
    //   displayLink: "Branch",
    // },
    // {
    //   name: "Department",
    //   location: "cashback/cashback.component",
    //   displayLink: "Department",
    // },
    // {
    //   name: "Role",
    //   location: "cashback/cashback.component",
    //   displayLink: "Role",
    // },
    // { name: "Permission", location: "cashback/cashback.component", displayLink: "Permission" },
    //   ],
    // },

  
  ];

  permittedModels = signal<ModuleMeta[]>(this.modules)

  getPermittedModules(): ModuleMeta[] {
    // Initialize an array to store modules with permitted components
    const permittedModules: ModuleMeta[] = [];

    // Iterate through each module that belongs to this platform (see `platforms` on ModuleMeta)
    this.modules.filter((module) => isOnPlatform(module.platforms)).forEach((module) => {
      // Find matching privileges for the current module
      const matchingPrivileges = this.uiComponentPrivileges.filter(
        (privilege: any) => {
          // Check if component name matches module name and has matching subComponent
          return privilege.uiComponentPrivileges.some(
            (uiComponentPrivilege: any) => {
              return (
                uiComponentPrivilege.component.componentName === module.name ||
                module.components.some((component) => {
                  return (
                    uiComponentPrivilege.subComponent.subComponentName ===
                      component.displayLink ? uiComponentPrivilege.subComponent.subComponentName ===
                    component.displayLink : null
                  );
                })
              );
            }
          );
        }
      );

      // If matching privileges are found, filter components
      // if (matchingPrivileges.length > 0) {
      const permittedComponents = module.components.filter((component) => {

        // Skip links tagged for other platforms
        if (!isOnPlatform(component.platforms)) {
          return false;
        }

        // Check if any matching privilege contains this component's displayLink
        return matchingPrivileges.some((privilege: any) => {
          return privilege.uiComponentPrivileges.some(
            (uiComponentPrivilege: any) => {
              // console.log(
              //   uiComponentPrivilege.subComponent.subComponentName,
              //   component.displayLink
              // );
              return (
                uiComponentPrivilege.subComponent.subComponentName ===
                component.displayLink && uiComponentPrivilege.subComponent.active === true
              );
            }
          );
        });
      });
      // Add module with permitted components to the result array
      /* const modifiedPermittedComponents = module.components.filter((component) => {
        this.uiComponentPrivileges.filter(
          (privilege: any) => {
        return privilege.uiComponentPrivileges.some(
          (uiComponentPrivilege: any) => {
            return(uiComponentPrivilege.component.componentName === component.name)
          })})
      })
      console.log(modifiedPermittedComponents, "modifiedPermittedComponents");
      console.log(permittedComponents, "permittedComponents"); */
      if (permittedComponents.length > 0) {
        permittedModules.push({
          ...module,
          components: permittedComponents,
          // Counted on the module's definition, not on the role's permitted links, so a module
          // with several links never turns into a single link for a role that can see only one
          singleLink: module.components.filter((component) => isOnPlatform(component.platforms)).length === 1,
        });
      }
      // }
    });
    return permittedModules;
  }

  /**
   * Routes for this build: the shared routes plus the current platform's own routes.
   * Record<Platform, ...> makes the build fail if a new platform is added without a route list.
   */
  computeRoutes(): Route[] {
    const platformRoutes: Record<Platform, () => Route[]> = {
      'backoffice': () => this.backofficeRoutes(),
      'manufacturer-app': () => this.manufacturerRoutes(),
    };
    return [...this.sharedRoutes(), ...platformRoutes[PLATFORM]()];
  }

  /**
   * Routes every platform has: login, User Management and Role Management only.
   * Platform-specific screens go in manufacturerRoutes() / backofficeRoutes().
   */
  private sharedRoutes(): Route[] {
    return [
      {
        path: '',
        component: LoginComponent,
        pathMatch: 'full'
      },

      {
        // Per-platform login route (web/backOffice/login, web/manufacturer/login, ...)
        path: PLATFORM_LOGIN.path,
        component: LoginComponent,
        pathMatch: 'full', data: { loginType: 'admin' }
      },

      // Header "Reset Password" menu item: the logged-in user's own password change.
      // Same component as the back office KYC child route, listed here so the header works on every platform.
      {
        path: 'kyc/reset-password',
        loadComponent: () => import('./kyc/kyc/reset-password/reset-password.component').then(c => c.ResetPasswordComponent)
      },

      // User Management (sidebar module) and the screens it links to
      { path: 'BOLanding', loadComponent: () => import('./user-management/user-management/user-management/bo/bo.component').then(c => c.BOComponent) },
      { path: 'resetPassword', loadComponent: () => import('./user-management/user-management/user-management/reset-password/reset-password.component').then(c => c.ResetPasswordComponent) },
      { path: 'CustomerLanding', loadComponent: () => import('./user-management/user-management/user-management/bo/customer/customer.component').then(c => c.CustomerComponent) },
      {
        path: 'userManagement/customer-kyc',
        loadComponent: () => import('./user-management/user-management/user-management/bo/customer/customer-view/customer-view.component').then(c => c.CustomerViewComponent)
      },
      { path: 'organization', loadComponent: () => import('./user-management/user-management/organization-view/organization-view.component').then(c => c.OrganizationViewComponent) },
      { path: 'registerOrganization', loadComponent: () => import('./user-management/organization/register-organization/register-organization.component').then(c => c.RegisterOrganizationComponent) },

      // Role Management (sidebar module) and the screens it links to
      { path: "Branch", loadComponent: () => import('./role-management/role-management/role-management/branch-list/branch-list.component').then(c => c.BranchListComponent) },
      { path: "Department", loadComponent: () => import('./role-management/role-management/role-management/department-list/department-list.component').then(c => c.DepartmentListComponent) },
      { path: "Role", loadComponent: () => import('./role-management/role-management/role-management/roles-landing/roles-landing.component').then(c => c.RolesLandingComponent) },
      {
        path: "Create-role",
        loadComponent: () =>
          import(
            "./role-management/role-management/role-management/create-role/create-role.component"
          ).then((c) => c.CreateRoleComponent),
      },
      {
        path: "ComponentList",
        loadComponent: () =>
          import(
            "./role-management/role-management/role-management/component-landing/component-landing.component"
          ).then((c) => c.ComponentLandingComponent),
      },
      {
        path: "SubComponentList",
        loadComponent: () =>
          import(
            "./role-management/role-management/role-management/sub-component-landing/sub-component-landing.component"
          ).then((c) => c.SubComponentLandingComponent),
      },
      {
        path: "editRole/:roleId",
        loadComponent: () =>
          import(
            "./role-management/role-management/role-management/edit-role/edit-role.component"
          ).then((c) => c.EditRoleComponent),
      },
    ];
  }

  /** Manufacturer-only screens. Add new manufacturer routes here. */
  private manufacturerRoutes(): Route[] {
    return [
      // Landing screen after sign-in: partner counts, with links to the partner list and form
      {
        path: 'dashboard',
        loadComponent: () => import('./manufacturer/dashboard/manufacturer-dashboard.component').then(c => c.ManufacturerDashboardComponent)
      },

      // Partner Onboarding: the back office organization list and form, with Supplier /
      // Distributor / Merchant as the entity types (PARTNER_SCREEN)
      {
        path: 'partners',
        loadComponent: () => import('./user-management/user-management/organization-view/organization-view.component').then(c => c.OrganizationViewComponent),
        data: { organizationScreen: PARTNER_SCREEN }
      },
      {
        path: 'registerPartner',
        loadComponent: () => import('./user-management/organization/register-organization/register-organization.component').then(c => c.RegisterOrganizationComponent),
        data: { organizationScreen: PARTNER_SCREEN }
      },
    ];
  }

  /**
   * Back office-only screens. Add new back office routes here.
   * The previous back office screens (KYC, GL, DCMS, corporate, reports, ...) were removed from routing
   * and their components were then deleted; the components and the original route list are in git history.
   */
  private backofficeRoutes(): Route[] {
    return [];
  }

}