export * from './otpController.service';
import { OtpControllerService } from './otpController.service';
export * from './passwordController.service';
import { PasswordControllerService } from './passwordController.service';
export * from './userManagement.service';
import { UserManagementService } from './userManagement.service';
export * from './utilsController.service';
import { UtilsControllerService } from './utilsController.service';
export const APIS = [OtpControllerService, PasswordControllerService, UserManagementService, UtilsControllerService];
