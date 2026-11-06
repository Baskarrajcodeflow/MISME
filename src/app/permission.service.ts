import { Injectable, computed, signal } from '@angular/core';
import { ModuleMeta } from './interface/interface-list';
import { LoginComponent } from './landing/login/login.component';
import { SubProductComponent } from './product/sub-product/sub-product.component';
import { Route } from '@angular/router';
import { DataSharingService } from './product/dataSharing/data-sharing.service';
import { UserPrivilages } from './role-management/role-management/role-management/user-privilages';
import { AuthGuardService } from './auth-guard.service';

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
      name: 'User Management',
      location: './UserManagement',
      icon: 'assets/icons/key.png',
      components: [
        { name: "BOLanding", location: "user-modal/user-modal.component", displayLink: "Back Office User" },
        { name: "resetPassword", location: "user-modal/user-modal.component", displayLink: "Reset Password" },
        { name: "CustomerLanding", location: "user-modal/user-modal.component", displayLink: "Customer" },
        { name: "organization", location: "user-modal/user-modal.component", displayLink: "Organization" },
      ]
    },
    {
      name: "Role Management",
      location: "./RoleManagement",
      icon: "assets/icons/key.png",
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

    // Iterate through each module
    this.modules.forEach((module) => {
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
        });
      }
      // }
    });
    return permittedModules;
  }

  computeRoutes(): Route[] {
    const routes: Route[] = [
      {
        path: '',
        component: LoginComponent,
        pathMatch: 'full'
      },

      {
        path: 'web/backOffice/login',
        component: LoginComponent,
        pathMatch: 'full', data: { loginType: 'admin' }
      },

      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: 'kyc',
        loadChildren: () => import('./kyc/kyc.routes').then(m => m.KYC_ROUTES)
      },
      {
        path: 'kyc/kyc-edit-requests',
        loadComponent: () => import('./kyc/kyc/kyc-edit-requests/kyc-edit-requests.component').then(c => c.KycEditRequestsComponent)
      },
      // {
      //   path: 'transaction-and-gl',
      //   loadChildren: () => import('./transaction-and-gl/transaction-and-gl.routes').then(m => m.TRANSACTION_AND_GL_ROUTES)
      // },
      //new added due to issue
      {
        path: 'transaction-and-gl/create-transaction-and-gl',
        loadComponent: () => import('./transaction-and-gl/create-transaction-and-gl/create-transaction-and-gl.component').then(c => c.CreateTransactionAndGlComponent)
      },
      {
        path: 'transaction-and-gl/list-transaction-and-gl',
        loadComponent: () => import('./transaction-and-gl/list-transaction-and-gl/list-transaction-and-gl.component').then(c => c.ListTransactionAndGlComponent)
      },
      {
        path: 'transaction-and-gl/refund-transaction',
        loadComponent: () => import('./transaction-and-gl/refund-transaction/refund-transaction.component').then(c => c.RefundTransactionComponent)
      },
      {
        path: 'transaction-and-gl/status-check',
        loadComponent: () => import('./transaction-and-gl/status-check/status-check.component').then(c => c.StatusCheckComponent)
      },
      {
        path: 'transaction-and-gl/process-refund',
        loadComponent: () => import('./transaction-and-gl/process-refund/process-refund.component').then(c => c.ProcessRefundComponent)
      },

      {
        path: 'transaction-and-gl/chart-of-acc-basic-page',
        loadComponent: () => import('./transaction-and-gl/chart-of-acc-basic-page/chart-of-acc-basic-page.component').then(c => c.ChartOfAccBasicPageComponent)
      },
      {
        path: 'transaction-and-gl/balance-sheet',
        loadComponent: () => import('./transaction-and-gl/balance-sheet/balance-sheet.component').then(c => c.BalanceSheetComponent)
      },
      {
        path: 'transaction-and-gl/profit-and-loss',
        loadComponent: () => import('./transaction-and-gl//profit-and-loss//profit-and-loss.component').then(c => c.ProfitAndLossComponent)
      },
      {
        path: 'transaction-and-gl/transaction-monitoring',
        loadComponent: () => import('./transaction-and-gl/transaction-monitoring/transaction-monitoring.component').then(c => c.TransactionMonitoringComponent)
      },
      //new added due to issue
      {
        path: 'userManagement/customer-kyc',
        loadComponent: () => import('./user-management/user-management/user-management/bo/customer/customer-view/customer-view.component').then(c => c.CustomerViewComponent)
      },
      {
        path: 'corporate/corporate-registartion',
        loadComponent: () => import('./corporate/corporate-registartion/corporate-registartion.component').then(c => c.CorporateRegistartionComponent)
      },
      {
        path: 'corporate/corporate-list',
        loadComponent: () => import('./corporate/corporate-list/corporate-list.component').then(c => c.CorporateListComponent)
      },
      //new
      // {
      //   path: 'dcms/project-management/list-project',
      //   loadComponent: () => import('./dcms/project-management/list-project/list-project.component').then(c => c.ListProjectComponent)
      // },
      // {
      //   path: 'dcms/subproject-management/list-subproject',
      //   loadComponent: () => import('./dcms/subproject-management/list-subproject/list-subproject.component').then(c => c.ListSubprojectComponent)
      // },
      // {
      //   path: 'dcms/project-management/create-project',
      //   loadComponent: () => import('./dcms/project-management/create-project/create-project.component').then(c => c.CreateProjectComponent)
      // },
      // {
      //   path: 'dcms/subproject-management/create-subproject',
      //   loadComponent: () => import('./dcms/subproject-management/create-subproject/create-subproject.component').then(c => c.CreateSubprojectComponent)
      // },
      {
        path: 'dcms/funding-party-management/create-funding-party',
        loadComponent: () => import('./dcms/funding-party-management/create-funding-party/create-funding-party.component').then(c => c.CreateFundingPartyComponent)
      },
      {
        path: 'dcms/funding-party-management/list-funding-party',
        loadComponent: () => import('./dcms/funding-party-management/list-funding-party/list-funding-party.component').then(c => c.ListFundingPartyComponent)
      },
      {
        path: 'dcms/generate-token',
        loadComponent: () => import('./dcms/generate-token/generate-token.component').then(c => c.GenerateTokenComponent)
      },
      {
        path: 'dcms/beneficiary-management',
        loadComponent: () => import('./dcms/beneficiary-management/beneficiary-management.component').then(c => c.BeneficiaryManagementComponent)
      },
      {
        path: 'remittance/RemittancePayDetails',
        loadComponent: () => import('./remittance/remittance-pay-details/remittance-pay-details.component').then(c => c.RemittancePayDetailsComponent)
      },
      {
        path: 'dcms/report-management/general-status-report',
        loadComponent: () => import('./dcms/report-management/general-status-report/general-status-report.component').then(c => c.GeneralStatusReportComponent)
      },
      {
        path: 'dcms/report-management/project-report',
        loadComponent: () => import('./dcms/report-management/project-report/project-report.component').then(c => c.ProjectReportComponent)
      },
      //new
      {
        path: 'corporate/list-master-agent',
        loadComponent: () => import('./corporate/list-master-agent/list-master-agent.component').then(c => c.ListMasterAgentComponent)
      },
      {
        path: 'corporate/create-master-agent',
        loadComponent: () => import('./corporate/create-master-agent/create-master-agent.component').then(c => c.CreateMasterAgentComponent)
      },
      {
        path: 'corporate/list-direct-agent',
        loadComponent: () => import('./corporate/list-direct-agent/list-direct-agent.component').then(c => c.ListDirectAgentComponent)
      },
      {
        path: 'corporate/merchant-edit',
        loadComponent: () => import('./corporate/merchant-edit/merchant-edit.component').then(c => c.MerchantEditComponent)
      },
      {
        path: 'corporate/agent-edit',
        loadComponent: () => import('./corporate/agent-edit/agent-edit.component').then(c => c.AgentEditComponent)
      },
      {
        path: 'corporate/create-direct-agent',
        loadComponent: () => import('./corporate/create-direct-agent/create-direct-agent.component').then(c => c.CreateDirectAgentComponent)
      },
      {
        path: 'corporate/create-merchant-onboarding',
        loadComponent: () => import('./corporate/create-merchant-onboarding/create-merchant-onboarding.component').then(c => c.CreateMerchantOnboardingComponent)
      },
      {
        path: 'corporate/list-merchant-onboarded',
        loadComponent: () => import('./corporate/list-merchant-onboarded/list-merchant-onboarded.component').then(c => c.ListMerchantOnboardedComponent)
      },
      {
        path: 'corporate/create-agent',
        loadComponent: () => import('./corporate/create-agent/create-agent.component').then(c => c.CreateAgentComponent)
      },
      //new

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
      {
        path: 'listOfSubProducts',
        loadComponent: () => import('./product/sub-product/sub-product.component').then(c => c.SubProductComponent)
      },
      {
        path: 'editListOfSubProducts',
        loadComponent: () => import('./product/sub-product/edit-subproduct-table/edit-subproduct-table.component').then(c => c.EditSubproductTableComponent)
      },
      { path: 'account-maintanance', loadComponent: () => import('./transactions-ngl/transaction-gl/transaction-gl.component').then(c => c.TransactionGlComponent) },

      { path: 'ProductmasterComponent', loadComponent: () => import('./product/productmaster/productmaster.component').then(c => c.ProductmasterComponent) },
      { path: 'createProduct', loadComponent: () => import('./product/product/create-master-product/create-master-product.component').then(c => c.CreateMasterProductComponent) },
      { path: 'editMasterProduct', loadComponent: () => import('./product/product/edit-master-product/edit-master-product.component').then(c => c.EditMasterProductComponent) },
      { path: 'ServiceComponent', loadComponent: () => import('./product-configurations/service/service.component').then(c => c.ServiceComponent) },
      { path: 'SubProductComponent', loadComponent: () => import('./product/sub-product/list-subproduct-table/list-subproduct-table.component').then(c => c.ListSubproductTableComponent) },
      { path: 'TransactionLimitComponent', loadComponent: () => import('./product-configurations/transaction-limit/transaction-limit.component').then(c => c.TransactionLimitComponent) },
      { path: 'ServiceComponent', loadComponent: () => import('./product-configurations/service/service.component').then(c => c.ServiceComponent) },
      { path: 'SubProductComponent', loadComponent: () => import('./product/sub-product/list-subproduct-table/list-subproduct-table.component').then(c => c.ListSubproductTableComponent) },
      { path: 'TransactionLimitComponent', loadComponent: () => import('./product-configurations/transaction-limit/transaction-limit.component').then(c => c.TransactionLimitComponent) },
      { path: 'ChargesAndCommissionComponent', loadComponent: () => import('./product/charges-and-commision/charges-and-commision.component').then(c => c.ChargesAndCommisionComponent) },
      { path: 'ProductComponent', loadComponent: () => import('./product/product/product.component').then(c => c.ProductComponent) },
      { path: 'TaxComponent', loadComponent: () => import('./product-configurations/tax/tax.component').then(c => c.TaxComponent) },
      { path: 'FeesAndCommissionComponent', loadComponent: () => import('./product-configurations/fees-and-commission/fees-and-commission.component').then(c => c.FeesAndCommissionComponent) },
      { path: 'LoyaltyComponent', loadComponent: () => import('./product-configurations/loyalty/loyalty.component').then(c => c.LoyaltyComponent) },
      { path: 'FeesAndCommissionSlabComponent', loadComponent: () => import('./product-configurations/fees-and-commission-slab/fees-and-commission-slab.component').then(c => c.FeesAndCommissionSlabComponent) },
      { path: 'CommissionStructure', loadComponent: () => import('./product/commission-structure/commission-structure.component').then(c => c.CommissionStructureComponent) },
      { path: 'AmountLimitComponent', loadComponent: () => import('./product-configurations/amount-limit/amount-limit.component').then(c => c.AmountLimitComponent) },
      { path: 'CashbackComponent', loadComponent: () => import('./product/cashback/cashback.component').then(c => c.CashbackComponent) },
      { path: 'AgencyFeesAndCommission', loadComponent: () => import('./agency-fees-and-commission/list-afc-details/list-afc-details.component').then(c => c.ListAFCDetailsComponent) },
      {
        path: 'AFCComponent',
        loadComponent: () => import('./agency-fees-and-commission/agency-fees-and-commission.component').then(c => c.AgencyFeesAndCommissionComponent)
      },
      { path: 'BOLanding', loadComponent: () => import('./user-management/user-management/user-management/bo/bo.component').then(c => c.BOComponent) },
      { path: 'resetPassword', loadComponent: () => import('./user-management/user-management/user-management/reset-password/reset-password.component').then(c => c.ResetPasswordComponent) },
      { path: 'AgentLanding', loadComponent: () => import('./user-management/user-management/user-management/bo/agents/agents.component').then(c => c.AgentsComponent) },
      { path: 'CustomerLanding', loadComponent: () => import('./user-management/user-management/user-management/bo/customer/customer.component').then(c => c.CustomerComponent) },
      { path: 'organization', loadComponent: () => import('./user-management/user-management/organization-view/organization-view.component').then(c => c.OrganizationViewComponent) },
      { path: 'registerOrganization', loadComponent: () => import('./user-management/organization/register-organization/register-organization.component').then(c => c.RegisterOrganizationComponent) },
      { path: 'SubAgentLanding', loadComponent: () => import('./user-management/user-management/user-management/bo/agents/sub-agent/sub-agent.component').then(c => c.SubAgentComponent) },
      { path: 'MerchantLanding', loadComponent: () => import('./user-management/user-management/user-management/bo/agents/merchant/merchant.component').then(c => c.MerchantComponent) },
      { path: 'SubMerchantLanding', loadComponent: () => import('./user-management/user-management/user-management/bo/agents/agents.component').then(c => c.AgentsComponent) },
      { path: 'CorporateManagement', loadComponent: () => import('./user-management/user-management/user-management/corporate/corporate.component').then(c => c.CorporateComponent) },
      { path: 'CorporateFormComponent', loadComponent: () => import('./user-management/user-management/user-management/corporate-form/corporate-form.component').then(c => c.CorporateFormComponent) },
      { path: 'WalletManagement', loadComponent: () => import('./wallet-management/wallet-management/wallet-list/wallet-list.component').then(c => c.WalletListComponent) },
      { path: 'Systemwallets', loadComponent: () => import('./wallet-management/systemwallet/systemwallet.component').then(c => c.SystemwalletComponent) },
      { path: 'pushPullMoney', loadComponent: () => import('./wallet-management/push-pull-money/push-pull-money.component').then(c => c.PushPullMoneyComponent) },
      { path: 'viewcorporate', loadComponent: () => import('./user-management/user-management/user-management/corporate-user/view-copoarte-user/view-copoarte-user.component').then(c => c.ViewCopoarteUserComponent) },
      { path: 'registerCorporateUser', loadComponent: () => import('./user-management/user-management/user-management/corporate-user/register-copoarte-user/register-copoarte-user.component').then(c => c.RegisterCopoarteUserComponent) },


      { path: 'CreateSupplier', loadComponent: () => import('./supplier-management-module/supplier-master/create/create.component').then(c => c.CreateComponent) },
      { path: 'EditSupplier/:id', loadComponent: () => import('./supplier-management-module/supplier-master/create/create.component').then(c => c.CreateComponent) },
      { path: 'CreateTopup', loadComponent: () => import('./supplier-management-module/topup-credit-purchase/create/create.component').then(c => c.CreateComponent) },
      { path: 'SupplierList', loadComponent: () => import('./supplier-management-module/supplier-master/supplier-list/supplier-list.component').then(c => c.SupplierListComponent) },
      { path: 'SDNupload', loadComponent: () => import('./sdn-management/aml-upload-sdn/aml-upload-sdn.component').then(c => c.AmlUploadSdnComponent) },
      { path: 'SDNSearch', loadComponent: () => import('./sdn-management/aml-sdn-search/aml-sdn-search.component').then(c => c.AmlSdnSearchComponent) },
      { path: 'create-risk-parameter', loadComponent: () => import('./sdn-management/create-risk-parameter/create-risk-parameter.component').then(c => c.CreateRiskParameterComponent) },
      { path: 'list-risk-parameter', loadComponent: () => import('./sdn-management/list-risk-parameter/list-risk-parameter.component').then(c => c.ListRiskParameterComponent) },

      { path: 'create-risk-tier', loadComponent: () => import('./sdn-management/create-risk-tier/create-risk-tier.component').then(c => c.CreateRiskTierComponent) },
      { path: 'list-risk-tier', loadComponent: () => import('./sdn-management/list-risk-tier/list-risk-tier.component').then(c => c.ListRiskTierComponent) },


      { path: 'bulkUpload', loadComponent: () => import('./bulk-upload-module/bulk-upload-module.component').then(c => c.BulkUploadModuleComponent) },
      { path: 'bulkCustomerUpload', loadComponent: () => import('./bulk-upload-module/customer-onboarding/bulk-customer-onboarding/bulk-customer-onboarding.component').then(c => c.BulkCustomerOnboardingComponent) },

      { path: 'ConfigRewards', loadComponent: () => import('./loyalty-management/reward-config/reward-config/reward-config.component').then(c => c.RewardConfigComponent) },
      { path: 'ListRewards', loadComponent: () => import('./loyalty-management/reward-config/list-rewards/list-rewards.component').then(c => c.ListRewardsComponent) },


      { path: 'BalanceSheet', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'BatchReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'BreshnaReconcilitationReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'TransactionSummaryReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'AgentLiquidityReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'AgentSummaryReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'CashInReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'CashOutReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'EMoneyTransferReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'LCTR', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'RefundReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'SalesTrendReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'StockBatchReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'ProfitabilityReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'ProfitabilityReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'CorporateCustomerReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'CustomerSummaryReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'SalesVolumeByChannel', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'SalesVolumeByAgents', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'ProfitAndLossReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'BankReconcilitationReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'BatchReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'BankReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'AgentReconcilationReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'StatementOfCashFlow', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'AccStatementReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'ReversalReoport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'StockAccStatementReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'AirtimeReconciliationReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'BeginningBalanceReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'BillPaymentReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'MonthlyBalanceReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'FinancialConsolidatedReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'DirectBankingCashFlowReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'ActiveServiceReconcileReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'AubBalance', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'GBBalance', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'AwccReconcileReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'MyMoneyStatement', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'AggregateVolAndValTransaction', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'IncomeProductReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'IncomeReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'TopupInventoryReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'VoiceDtaBundleActivationReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'FloatAccMovement', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'ActiveBasedReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'InActiveBasedReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'SuspendAccountReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'LockAccountReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'LowBalDataReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'LowBalanceList', loadComponent: () => import('./report-management/low-balance-list/low-balance-list.component').then(c => c.LowBalanceListComponent) },
      { path: 'LctrView', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'KYCReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'MerchantToAgentReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'WalletToWalletReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'FailedTransactionReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'PullTransactionReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'PushTransactionReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'AggregateBalanceReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'AuthorizedAgentQuartelyReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'AccountHoldersWithHistoryOfFinancialCrime', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'DetailedTransactionProvinceWise', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'WrongAttemptUsersReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'LargeDepositMoreAFNFollowedByRapidWithdrawals', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'MultipleWithdrawalsAfterLargeDepositReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'RejectedAccounts', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'AuthorizedMerchantReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'ActiveUserWithMinimumOneTrxnMonthlyReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'TransactionsUnusualTiming', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'AllLoyaltyReports', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'RejectedTransactions', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'ActiveUserByProvinceBasedReportByProvince', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'ActiveUserReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },

      { path: 'AccountOpenAndActiveWithNoDepositReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'AccountsOpenedWithMinimalInformationReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'CashTransactionsExceedingAFNReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'IncreaseInCustomerTransactionsReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'FrequentSmallDepositTransactions', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'MultipleSmallWithdrawalsReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'OverTheLimitTransactionReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'ChangesInCustomerContactInformationReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'AuthorizedPartnerQuarterlyReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'BalanceMovementReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'BalanceBreakupReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'BankAccountLinkageReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'CustomerRiskClassificationReportPeriodically', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'SuspiciousTransactionsReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'RegisteredReportBasedOnProfileAndProvince', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'AccountOpenedByIndividualWithHistoryOfFinancialCrimeReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'AuditTrailsReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'SystemAccessControlsReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'SystemDormentAccountsReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'InternationalandNationalRemittanceTransactionReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'DataIntegrityandSecurity', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'OperationalReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'ComplianceReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'AdhocReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'AutomatedAlertsandNotificationsReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'AccessToTransactionDataReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'TransactionSentToOrReceivedFromPoliticalExposedPersonReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },

      { path: 'BankTransactionReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'SuspenseAccountTransactionReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'TopUpDetailsTransactionReportByChannel', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'ApprovedKycReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'MostActiveUsersReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'UserwithMinimumSingleMonthlyTransactionReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'TransactionReportOnChannelUsage', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'BulkReversalReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'AllAccountActivityReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'ActiveUserBasedOnProvince', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'RegisteredReportsBasedOnProfileAndProvince', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      //dcms reports
      { path: 'TokenPaymentReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'TokenTransactionReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'TokenUnredeemedReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'TokenWithdrawalReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'FloatVsWalletReconciliation', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'EMoneyTransactionReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },

      { path: 'salaryprocess', loadComponent: () => import('./salary-processing/bulk-salary-upload/salary-dashboard/salary-dashboard.component').then(c => c.SalaryDashboardComponent) },
      { path: 'salaryProcessSelectiveReversal', loadComponent: () => import('./salary-processing/bulk-salary-upload/bulksalary-selective-reversal/bulksalary-selective-reversal.component').then(c => c.BulksalarySelectiveReversalComponent) },
      { path: 'salaryFinalApprovalProcess', loadComponent: () => import('./salary-processing/bulk-salary-upload/final-salary-approval/final-salary-approval.component').then(c => c.FinalSalaryApprovalComponent) },
      { path: 'bulkTopupprocess', loadComponent: () => import('./bulktopup-management/bulktopup-management.component').then(c => c.BulktopupManagementComponent) },
      // { path: 'EditSupplier', loadComponent: () => import('./supplier-management/supplier-master/edit/edit.component').then(c => c.EditComponent) },
      // { path: 'TopupCreditPurchase', loadComponent: () => import('./supplier-management/top-up-credit-purchase/create-topup/create-topup.component').then(c => c.CreateTopupComponent) },
      { path: 'banners', loadComponent: () => import('./banners/banners.component').then(c => c.BannersComponent) },
      { path: 'findCustomer', loadComponent: () => import('../app/crm-screen/crm-screen.component').then(c => c.CrmScreenComponent) },
      { path: 'caseManagement', loadComponent: () => import('../app/crm-screen/case-management/case-management/case-management.component').then(c => c.CaseManagementComponent) },
      { path: 'manualNotification', loadComponent: () => import('../app/crm-screen/manual-notification/manual-notification.component').then(c => c.ManualNotificationComponent) },
      { path: 'crm-customer-details/:userType/:userId', loadComponent: () => import('./crm-screen/customer-Details/customer-details/customer-details.component').then(c => c.CustomerDetailsComponent), canActivate: [AuthGuardService] },
      { path: 'journalEntry', loadComponent: () => import('./finance-control/finance-control/finance-control.component').then(c => c.FinanceControlComponent) },
      { path: 'paymentJournalVoucher', loadComponent: () => import('./finance-control/payment-journal-voucher/payment-journal-voucher.component').then(c => c.PaymentJournalVoucherComponent) },
      { path: 'createJournalEntry', loadComponent: () => import('./finance-control/create-journal-entries/create-journal-entries.component').then(c => c.CreateJournalEntriesComponent) },
      { path: 'createPaymentJournalVoucher', loadComponent: () => import('./finance-control/create-payment-journal-voucher/create-payment-journal-voucher.component').then(c => c.CreatePaymentJournalVoucherComponent) },
      { path: 'monthEndFinance', loadComponent: () => import('./finance-control/monthend-finance-operations/monthend-finance-operations.component').then(c => c.MonthendFinanceOperationsComponent) },
      { path: 'yearEndFinance', loadComponent: () => import('./finance-control/yearend-finance-operations/yearend-finance-operations.component').then(c => c.YearendFinanceOperationsComponent) },
      { path: 'financialPeriod', loadComponent: () => import('./finance-control/financial-period-setup/financial-period-setup.component').then(c => c.FinancialPeriodSetupComponent) },
      { path: 'lockUnlock', loadComponent: () => import('./finance-control/financial-period-lock-unlock/financial-period-lock-unlock.component').then(c => c.FinancialPeriodLockUnlockComponent) },
      { path: 'closedAccounts', loadComponent: () => import('./closed-accounts-screens/list-closed-accounts/list-closed-accounts.component').then(c => c.ListClosedAccountsComponent) },
      { path: 'accountClosing', loadComponent: () => import('./closed-accounts-screens/account-closing-authorization/account-closing-authorization.component').then(c => c.AccountClosingAuthorizationComponent) },
      { path: 'points-to-money', loadComponent: () => import('./loyalty-management/ponintstomoney/ponintstomoney.component').then(c => c.PonintstomoneyComponent) },
      { path: 'referral-configuration', loadComponent: () => import('./loyalty-management/referral-config/referral-config.component').then(c => c.ReferralConfigComponent) },
      { path: 'referral-bonus-configuration', loadComponent: () => import('./loyalty-management/referral-bonus-congig/referral-bonus-congig.component').then(c => c.ReferralBonusCongigComponent) },
      { path: 'bulkLockUsers', loadComponent: () => import('./closed-accounts-screens/bulk-lock-users/bulk-lock-users.component').then(c => c.BulkLockUsersComponent) },
      { path: 'bulkRegistration', loadComponent: () => import('./closed-accounts-screens/bulk-registration/bulk-registration.component').then(c => c.BulkRegistrationComponent) },
      { path: 'userLoginAuditTrail', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'customerProfileAuditTrail', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'walletTransactionAuditTrail', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'transactionStatusChangeAudit', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'rolePermissionAudit', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'limitChangeAudit', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'kycAuditReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'amlScreeningAudit', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'adminConfigurationAudit', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'apiAuditReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'failedTransactionAudit', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'reversalAuditReport', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },
      { path: 'TransactionWithAtomaPay', loadComponent: () => import('./report-management/view-report-section/view-report-section.component').then(c => c.ViewReportSectionComponent) },

    ];
    //Account Closure
    return routes

  }

}