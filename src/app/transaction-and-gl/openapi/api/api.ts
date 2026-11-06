export * from './headAccountController.service';
import { HeadAccountControllerService } from './headAccountController.service';
export * from './leafAccountController.service';
import { LeafAccountControllerService } from './leafAccountController.service';
export * from './subAccountController.service';
import { SubAccountControllerService } from './subAccountController.service';
export const APIS = [HeadAccountControllerService, LeafAccountControllerService, SubAccountControllerService];
