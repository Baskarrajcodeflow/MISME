import { MockRoute } from './mock-route';

/**
 * Manufacture mocks: every backend call the shared User Management and Role Management screens
 * make after sign-in, answered with JSON in the same format as the back office API.
 * Files are in src/assets/mock-api/manufacture/.
 *
 * Read calls return sample data. Write calls (create, edit, delete, authorize, ...) return the
 * success response the screen expects; nothing is saved, so lists don't change after a write.
 * Login-screen calls (login OTP, forgot password, change password) are not here: they always use
 * the real backend.
 */
export const MANUFACTURE_MOCKS: readonly MockRoute[] = [
  // ---- Sidebar and header: role and privileges of the signed-in user (called right after login)
  { method: 'GET', path: '/um/api/bo/getRoleById', file: 'manufacture/um/role-by-id.json' },

  // ---- User Management > Back Office User (BOLanding)
  { method: 'GET', path: '/um/api/bo/getAll', file: 'manufacture/um/bo-users.json' },
  { method: 'POST', path: '/um/api/bo/createBOUser', file: 'manufacture/um/bo-user-saved.json' },
  { method: 'PUT', path: '/um/api/bo/editBOUser', file: 'manufacture/um/bo-user-saved.json' },
  { method: 'GET', path: '/um/api/bo/deactivateAcc', file: 'manufacture/um/bo-user-saved.json' },
  { method: 'GET', path: '/um/api/bo/deleteAcc', file: 'manufacture/um/bo-user-saved.json' },
  { method: 'POST', path: '/um/api/bo/activate', file: 'manufacture/um/success.json' },
  { method: 'POST', path: '/um/api/bo/initiatePwdLockoutRevoke', file: 'manufacture/um/success.json' },
  { method: 'POST', path: '/um/api/bo/authorizePwdLockoutRevoke', file: 'manufacture/um/success.json' },
  // Branch / department / role pickers in the add and edit user forms
  { method: 'GET', path: '/rmsbo/api/role/rolemanagement/getRolesByDepartment', file: 'manufacture/rmsbo/roles-by-department.json' },

  // ---- User Management > Reset Password (resetPassword)
  { method: 'POST', path: '/um/api/otp/generate', file: 'manufacture/um/otp-sent.json' },
  { method: 'POST', path: '/um/api/pwd/forgotPasswordSetByBo/v2', file: 'manufacture/um/password-reset.json' },

  // ---- Header > Reset Password (kyc/reset-password): signed-in user's own password
  { method: 'POST', path: '/um/api/pwd/update', file: 'manufacture/um/password-updated.json' },

  // ---- User Management > Customer (CustomerLanding) and its dialogs
  { method: 'GET', path: '/um/api/bo/getCustomers', file: 'manufacture/um/customers.json' },
  { method: 'POST', path: '/um/api/bo/searchUsers', file: 'manufacture/um/customers.json' },
  { method: 'POST', path: '/um/api/bo/registerCustomer', file: 'manufacture/um/customer-saved.json' },
  { method: 'PUT', path: '/um/api/bo/editCustomer', file: 'manufacture/um/customer-saved.json' },
  { method: 'GET', path: '/um/api/bo/getAllChangeProductRequest', file: 'manufacture/um/change-product-requests.json' },
  { method: 'GET', path: '/pm/masterproduct/get-all-by-customer', file: 'manufacture/pm/products.json' },
  { method: 'POST', path: '/um/api/bo/getSuspendLog', file: 'manufacture/um/suspend-log.json' },
  { method: 'POST', path: '/um/api/bo/changeProductReq', file: 'manufacture/um/success.json' },
  { method: 'POST', path: '/um/api/bo/changeProduct', file: 'manufacture/um/success.json' },
  { method: 'POST', path: '/um/api/bo/changeProductReject', file: 'manufacture/um/success.json' },
  { method: 'POST', path: '/um/api/bo/activatePending', file: 'manufacture/um/success.json' },
  { method: 'POST', path: '/um/api/bo/rejectActivate', file: 'manufacture/um/success.json' },
  { method: 'POST', path: '/um/api/bo/deactivate', file: 'manufacture/um/success.json' },
  { method: 'POST', path: '/um/api/bo/unlock', file: 'manufacture/um/success.json' },
  { method: 'POST', path: '/um/api/bo/suspendUser', file: 'manufacture/um/success.json' },
  { method: 'POST', path: '/um/api/bo/authorizeSuspendUser', file: 'manufacture/um/success.json' },
  { method: 'POST', path: '/um/api/bo/unSuspendUser', file: 'manufacture/um/success.json' },
  { method: 'POST', path: '/um/api/bo/authorizeUnSuspendUser', file: 'manufacture/um/success.json' },
  { method: 'POST', path: '/um/api/bo/rejectUnSuspendUser', file: 'manufacture/um/success.json' },
  { method: 'POST', path: '/um/api/pwd/passwordRetryRevoke', file: 'manufacture/um/success.json' },

  // ---- Customer KYC registration (userManagement/customer-kyc)
  { method: 'GET', path: '/kyc/locations/countries', file: 'manufacture/kyc/countries.json' },
  { method: 'GET', path: '/kyc/locations/provinces', file: 'manufacture/kyc/provinces.json' },
  { method: 'GET', path: '/kyc/locations/provinces/:provinceId/districts', file: 'manufacture/kyc/districts.json' },
  { method: 'GET', path: '/um/api/app/emailCheck', file: 'manufacture/um/email-check.json' },
  { method: 'GET', path: '/um/api/app/phoneCheck', file: 'manufacture/um/phone-check.json' },
  { method: 'POST', path: '/um/api/otp/verify', file: 'manufacture/um/otp-verified.json' },
  { method: 'POST', path: '/um/api/customer/mobile/signUp', file: 'manufacture/um/customer-signup.json' },

  // ---- Partner Onboarding (partners, registerPartner): same endpoints as the back
  //      office organization screens; entityType is SUPPLIER / DISTRIBUTOR / MERCHANT
  { method: 'GET', path: '/kyc/merchant/list', file: 'manufacture/kyc/organizations.json' },
  { method: 'POST', path: '/kyc/merchant/create', file: 'manufacture/kyc/organization-created.json' },

  // ---- Role Management > Branch, Department
  { method: 'GET', path: '/rmsbo/api/bo/branch', file: 'manufacture/rmsbo/branches.json' },
  { method: 'GET', path: '/rmsbo/api/bo/branchmanagement/getBranch', file: 'manufacture/rmsbo/branches.json' },
  { method: 'POST', path: '/rmsbo/api/bo/branchmanagement/createBranch', file: 'manufacture/rmsbo/branch-created.json' },
  { method: 'GET', path: '/rmsbo/api/bo/departmentmanagement/getDepartmentByBranch', file: 'manufacture/rmsbo/departments-branch-{branchId}.json' },
  { method: 'POST', path: '/rmsbo/api/bo/departmentmanagement/createDepartment', file: 'manufacture/rmsbo/department-created.json' },

  // ---- Role Management > Component, Sub Component
  { method: 'GET', path: '/rmsbo/api/bo/component/getComponent', file: 'manufacture/rmsbo/components.json' },
  { method: 'POST', path: '/rmsbo/api/bo/component/addComponent', file: 'manufacture/rmsbo/component-created.json' },
  { method: 'GET', path: '/rmsbo/api/role/subcomponent/getSubComponentByComponent', file: 'manufacture/rmsbo/sub-components-component-{componentId}.json' },
  { method: 'POST', path: '/rmsbo/api/role/subcomponent/addSubComponent', file: 'manufacture/rmsbo/sub-component-created.json' },

  // ---- Role Management > Role (Role, Create-role, editRole/:roleId)
  { method: 'GET', path: '/rmsbo/api/role/rolemanagement/getRoles', file: 'manufacture/rmsbo/roles.json' },
  { method: 'GET', path: '/rmsbo/api/role/rolemanagement/getRole/:roleId', file: 'manufacture/rmsbo/role-{roleId}.json' },
  { method: 'POST', path: '/rmsbo/api/role/rolemanagement/addRole', file: 'manufacture/rmsbo/role-saved.json' },
  { method: 'POST', path: '/rmsbo/api/role/rolemanagement/editRole', file: 'manufacture/rmsbo/role-saved.json' },
];
