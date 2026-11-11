import { ActivatedRoute } from '@angular/router';

export interface EntityTypeOption {
  value: string;
  label: string;
}

/**
 * Texts, Entity Type options and links for the organization list (OrganizationViewComponent)
 * and registration form (RegisterOrganizationComponent). Both components serve more than one
 * kind of organization: a route chooses one with `data: { organizationScreen: ... }`.
 */
export interface OrganizationScreen {
  listTitle: string;
  listSubtitle: string;
  idColumnLabel: string;
  registerLabel: string;
  emptyTitle: string;
  emptyText: string;
  formTitle: string;
  formSubtitle: string;
  /** Options of the form's Entity Type dropdown. The chosen value is sent as businessProfile.entityType. */
  entityTypes: EntityTypeOption[];
  /** Entity Type preselected on a new form; '' makes the user choose. */
  defaultEntityType: string;
  /** Opened after a successful registration and on Cancel. */
  listPath: string;
  /** Opened by the Register buttons on the list. */
  registerPath: string;
}

/** Back office merchants: the original texts and legal-structure entity types. */
export const MERCHANT_SCREEN: OrganizationScreen = {
  listTitle: 'Merchants',
  listSubtitle: 'Manage registered merchants.',
  idColumnLabel: 'Merchant ID',
  registerLabel: 'Register Merchant',
  emptyTitle: 'No merchants found',
  emptyText: 'Get started by registering your first merchant to process payments.',
  formTitle: 'Merchant Onboarding',
  formSubtitle: 'Complete your business profile to activate your merchant account.',
  entityTypes: [
    { value: 'SOLE_PROPRIETORSHIP', label: 'SOLE PROPRIETORSHIP' },
    { value: 'PARTNERSHIP', label: 'PARTNERSHIP' },
    { value: 'PRIVATE_LIMITED', label: 'PRIVATE LIMITED' },
    { value: 'LLC', label: 'LLC' },
    { value: 'PUBLIC_CORPORATION', label: 'PUBLIC CORPORATION' },
    { value: 'TRUST', label: 'TRUST' },
    { value: 'NGO', label: 'NGO' },
  ],
  defaultEntityType: 'SOLE_PROPRIETORSHIP',
  listPath: '/organizationView',
  registerPath: '/registerOrganization',
};

/**
 * Manufacture partners: a signed-in manufacturer registers its suppliers, distributors and
 * merchants with the same form; only the Entity Type options differ. The backend should link each
 * partner to the manufacturer from the signed-in user's token.
 */
export const PARTNER_SCREEN: OrganizationScreen = {
  listTitle: 'Partners',
  listSubtitle: 'Suppliers, distributors and merchants registered under your business.',
  idColumnLabel: 'Partner ID',
  registerLabel: 'Register Partner',
  emptyTitle: 'No partners found',
  emptyText: 'Register your first supplier, distributor or merchant.',
  formTitle: 'Partner Onboarding',
  formSubtitle: 'Register a supplier, distributor or merchant under your business.',
  entityTypes: [
    { value: 'SUPPLIER', label: 'SUPPLIER' },
    { value: 'DISTRIBUTOR', label: 'DISTRIBUTOR' },
    { value: 'MERCHANT', label: 'MERCHANT' },
  ],
  defaultEntityType: '',
  listPath: '/partners',
  registerPath: '/registerPartner',
};

/** The screen chosen by the current route, or the back office merchant screen when none is set. */
export function organizationScreenFor(route: ActivatedRoute): OrganizationScreen {
  return route.snapshot.data['organizationScreen'] ?? MERCHANT_SCREEN;
}
