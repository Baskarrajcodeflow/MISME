export * from './userManagement.service';
import { UserManagementService } from './userManagement.service';
export * from './utilsController.service';
import { UtilsControllerService } from './utilsController.service';
export const APIS = [UserManagementService, UtilsControllerService];
