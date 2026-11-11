// Manufacture platform. Swapped in for platform.ts by the manufacture-* configurations in angular.json.
// Import types from platform.model, never from './platform' (in this build that path points back to this file).
import { UserType } from '../app/interface/interface-list';
import { Platform, PlatformApi, PlatformBrand, PlatformLogin } from './platform.model';

export const PLATFORM: Platform = 'manufacture-app';

export const PLATFORM_BRAND: PlatformBrand = {
  appName: 'MiSME Manufacture',
  // Add the manufacture logo under src/assets and set its path here to show it in the header:
  // logo: 'assets/images/manufacture-logo.png',
};

// Placeholder text: replace with the real manufacture portal copy.
export const PLATFORM_LOGIN: PlatformLogin = {
  path: 'web/manufacture/login',
  // Land on the manufacture dashboard after login (see manufactureRoutes() in permission.service.ts).
  homePath: 'dashboard',
  // Must match the userType the backend expects for manufacture users.
  userType: UserType.manufacture,
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

// The manufacture backend isn't built yet: after sign-in, User and Role Management screens get
// mock responses (same format as the back office API) from src/assets/mock-api/manufacture/.
// Set useMocks to false once the real manufacture endpoints exist.
export const PLATFORM_API: PlatformApi = {
  useMocks: true,
};
