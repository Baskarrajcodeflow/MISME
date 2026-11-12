import { MockRoute } from './mock-route';

/**
 * Manufacturer mocks: every backend call the shared User Management and Role Management screens
 * make after sign-in, answered with JSON in the same format as the back office API.
 * Files are in src/assets/mock-api/manufacturer/.
 *
 * Read calls return sample data. Write calls (create, edit, delete, authorize, ...) return the
 * success response the screen expects; nothing is saved, so lists don't change after a write.
 * Login-screen calls (login OTP, forgot password, change password) are not here: they always use
 * the real backend.
 */
export const MANUFACTURER_MOCKS: readonly MockRoute[] = [
  // ---- Sidebar and header: role and privileges of the signed-in user (called right after login)
  { method: 'GET', path: '/um/api/bo/getRoleById', file: 'manufacturer/um/role-by-id.json' },

  // ---- User Management > Back Office User (BOLanding)
  { method: 'GET', path: '/um/api/bo/getAll', file: 'manufacturer/um/bo-users.json' },
  { method: 'POST', path: '/um/api/bo/createBOUser', file: 'manufacturer/um/bo-user-saved.json' },
  { method: 'PUT', path: '/um/api/bo/editBOUser', file: 'manufacturer/um/bo-user-saved.json' },
  { method: 'GET', path: '/um/api/bo/deactivateAcc', file: 'manufacturer/um/bo-user-saved.json' },
  { method: 'GET', path: '/um/api/bo/deleteAcc', file: 'manufacturer/um/bo-user-saved.json' },
  { method: 'POST', path: '/um/api/bo/activate', file: 'manufacturer/um/success.json' },
  { method: 'POST', path: '/um/api/bo/initiatePwdLockoutRevoke', file: 'manufacturer/um/success.json' },
  { method: 'POST', path: '/um/api/bo/authorizePwdLockoutRevoke', file: 'manufacturer/um/success.json' },
  // Branch / department / role pickers in the add and edit user forms
  { method: 'GET', path: '/rmsbo/api/role/rolemanagement/getRolesByDepartment', file: 'manufacturer/rmsbo/roles-by-department.json' },

  // ---- User Management > Reset Password (resetPassword)
  { method: 'POST', path: '/um/api/otp/generate', file: 'manufacturer/um/otp-sent.json' },
  { method: 'POST', path: '/um/api/pwd/forgotPasswordSetByBo/v2', file: 'manufacturer/um/password-reset.json' },

  // ---- Header > Reset Password (kyc/reset-password): signed-in user's own password
  { method: 'POST', path: '/um/api/pwd/update', file: 'manufacturer/um/password-updated.json' },

  // ---- User Management > Customer (CustomerLanding) and its dialogs
  { method: 'GET', path: '/um/api/bo/getCustomers', file: 'manufacturer/um/customers.json' },
  { method: 'POST', path: '/um/api/bo/searchUsers', file: 'manufacturer/um/customers.json' },
  { method: 'POST', path: '/um/api/bo/registerCustomer', file: 'manufacturer/um/customer-saved.json' },
  { method: 'PUT', path: '/um/api/bo/editCustomer', file: 'manufacturer/um/customer-saved.json' },
  { method: 'GET', path: '/um/api/bo/getAllChangeProductRequest', file: 'manufacturer/um/change-product-requests.json' },
  { method: 'GET', path: '/pm/masterproduct/get-all-by-customer', file: 'manufacturer/pm/products.json' },
  { method: 'POST', path: '/um/api/bo/getSuspendLog', file: 'manufacturer/um/suspend-log.json' },
  { method: 'POST', path: '/um/api/bo/changeProductReq', file: 'manufacturer/um/success.json' },
  { method: 'POST', path: '/um/api/bo/changeProduct', file: 'manufacturer/um/success.json' },
  { method: 'POST', path: '/um/api/bo/changeProductReject', file: 'manufacturer/um/success.json' },
  { method: 'POST', path: '/um/api/bo/activatePending', file: 'manufacturer/um/success.json' },
  { method: 'POST', path: '/um/api/bo/rejectActivate', file: 'manufacturer/um/success.json' },
  { method: 'POST', path: '/um/api/bo/deactivate', file: 'manufacturer/um/success.json' },
  { method: 'POST', path: '/um/api/bo/unlock', file: 'manufacturer/um/success.json' },
  { method: 'POST', path: '/um/api/bo/suspendUser', file: 'manufacturer/um/success.json' },
  { method: 'POST', path: '/um/api/bo/authorizeSuspendUser', file: 'manufacturer/um/success.json' },
  { method: 'POST', path: '/um/api/bo/unSuspendUser', file: 'manufacturer/um/success.json' },
  { method: 'POST', path: '/um/api/bo/authorizeUnSuspendUser', file: 'manufacturer/um/success.json' },
  { method: 'POST', path: '/um/api/bo/rejectUnSuspendUser', file: 'manufacturer/um/success.json' },
  { method: 'POST', path: '/um/api/pwd/passwordRetryRevoke', file: 'manufacturer/um/success.json' },

  // ---- Customer KYC registration (userManagement/customer-kyc)
  { method: 'GET', path: '/kyc/locations/countries', file: 'manufacturer/kyc/countries.json' },
  { method: 'GET', path: '/kyc/locations/provinces', file: 'manufacturer/kyc/provinces.json' },
  { method: 'GET', path: '/kyc/locations/provinces/:provinceId/districts', file: 'manufacturer/kyc/districts.json' },
  { method: 'GET', path: '/um/api/app/emailCheck', file: 'manufacturer/um/email-check.json' },
  { method: 'GET', path: '/um/api/app/phoneCheck', file: 'manufacturer/um/phone-check.json' },
  { method: 'POST', path: '/um/api/otp/verify', file: 'manufacturer/um/otp-verified.json' },
  { method: 'POST', path: '/um/api/customer/mobile/signUp', file: 'manufacturer/um/customer-signup.json' },

  // ---- Partner Onboarding (partners, registerPartner): same endpoints as the back
  //      office organization screens; entityType is SUPPLIER / DISTRIBUTOR / MERCHANT
  { method: 'GET', path: '/kyc/merchant/list', file: 'manufacturer/kyc/organizations.json' },
  { method: 'POST', path: '/kyc/merchant/create', file: 'manufacturer/kyc/organization-created.json' },

  // ---- Role Management > Branch, Department
  { method: 'GET', path: '/rmsbo/api/bo/branch', file: 'manufacturer/rmsbo/branches.json' },
  { method: 'GET', path: '/rmsbo/api/bo/branchmanagement/getBranch', file: 'manufacturer/rmsbo/branches.json' },
  { method: 'POST', path: '/rmsbo/api/bo/branchmanagement/createBranch', file: 'manufacturer/rmsbo/branch-created.json' },
  { method: 'GET', path: '/rmsbo/api/bo/departmentmanagement/getDepartmentByBranch', file: 'manufacturer/rmsbo/departments-branch-{branchId}.json' },
  { method: 'POST', path: '/rmsbo/api/bo/departmentmanagement/createDepartment', file: 'manufacturer/rmsbo/department-created.json' },

  // ---- Role Management > Component, Sub Component
  { method: 'GET', path: '/rmsbo/api/bo/component/getComponent', file: 'manufacturer/rmsbo/components.json' },
  { method: 'POST', path: '/rmsbo/api/bo/component/addComponent', file: 'manufacturer/rmsbo/component-created.json' },
  { method: 'GET', path: '/rmsbo/api/role/subcomponent/getSubComponentByComponent', file: 'manufacturer/rmsbo/sub-components-component-{componentId}.json' },
  { method: 'POST', path: '/rmsbo/api/role/subcomponent/addSubComponent', file: 'manufacturer/rmsbo/sub-component-created.json' },

  // ---- Role Management > Role (Role, Create-role, editRole/:roleId)
  { method: 'GET', path: '/rmsbo/api/role/rolemanagement/getRoles', file: 'manufacturer/rmsbo/roles.json' },
  { method: 'GET', path: '/rmsbo/api/role/rolemanagement/getRole/:roleId', file: 'manufacturer/rmsbo/role-{roleId}.json' },
  { method: 'POST', path: '/rmsbo/api/role/rolemanagement/addRole', file: 'manufacturer/rmsbo/role-saved.json' },
  { method: 'POST', path: '/rmsbo/api/role/rolemanagement/editRole', file: 'manufacturer/rmsbo/role-saved.json' },
];
