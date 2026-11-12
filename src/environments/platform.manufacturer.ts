// Manufacturer platform. Swapped in for platform.ts by the manufacturer-* configurations in angular.json.
// Import types from platform.model, never from './platform' (in this build that path points back to this file).
import { UserType } from '../app/interface/interface-list';
import { Platform, PlatformApi, PlatformBrand, PlatformLogin } from './platform.model';

export const PLATFORM: Platform = 'manufacturer-app';

export const PLATFORM_BRAND: PlatformBrand = {
  appName: 'MiSME Manufacturer',
  // Add the manufacturer logo under src/assets and set its path here to show it in the header:
  // logo: 'assets/images/manufacturer-logo.png',
};

// Placeholder text: replace with the real manufacturer portal copy.
export const PLATFORM_LOGIN: PlatformLogin = {
  path: 'web/manufacturer/login',
  // Land on the manufacturer dashboard after login (see manufacturerRoutes() in permission.service.ts).
  homePath: 'dashboard',
  // Must match the userType the backend expects for manufacturer users.
  userType: UserType.manufacturer,
  tagline: 'Manufacturer Portal',
  headline: ['Production, stock and orders', 'in one place.'],
  description: 'Run your manufacturing business on the MiSME ecosystem, with role-based access behind every screen.',
  features: [
    'Production planning',
    'Inventory and stock',
    'Purchase and sales orders',
    'Role-based access for your team',
  ],
  footer: '© AfriqPay · Secured by AfriqPay Identity',
};

// The manufacturer backend isn't built yet: after sign-in, User and Role Management screens get
// mock responses (same format as the back office API) from src/assets/mock-api/manufacturer/.
// Set useMocks to false once the real manufacturer endpoints exist.
export const PLATFORM_API: PlatformApi = {
  useMocks: true,
};
