// Default platform (back office). Other builds swap this file via fileReplacements in angular.json.
import { UserType } from '../app/interface/interface-list';
import { Platform, PlatformApi, PlatformBrand, PlatformLogin } from './platform.model';

export const PLATFORM: Platform = 'backoffice';

export const PLATFORM_BRAND: PlatformBrand = {
  appName: 'MiSME',
};

export const PLATFORM_LOGIN: PlatformLogin = {
  path: 'web/backOffice/login',
  // Dashboard was removed from routing, so land on the User Management user list after login.
  homePath: 'BOLanding',
  userType: UserType.backoffice,
  tagline: 'Namibia SME Digital Business Ecosystem',
  headline: ['Payments, merchant tools, credit', 'and trade in one place.'],
  description: "Namibia's SME digital business ecosystem, with KYC onboarding and role-based access behind every screen.",
  features: [
    'Card, QR and payment-link collections',
    'Digital Khata credit ledger',
    'B2B trade and invoicing',
    'KYC onboarding with role-based access',
  ],
  footer: '© AfriqPay · Secured by AfriqPay Identity',
};

export const PLATFORM_API: PlatformApi = {
  useMocks: false,
};
