# One codebase, two platforms

This repo builds two separate web apps from the same Angular code:

| Platform | Who uses it | Platform id in code |
|---|---|---|
| **Back office** | Internal staff: users, roles, merchants | `'backoffice'` |
| **Manufacturer** | A manufacturer onboarding its suppliers, distributors and merchants | `'manufacturer-app'` |

The platform is chosen **when the app is built**, not while it runs. A back office build has no
routes to the manufacturer screens and the other way round. There is no switch in the UI and no
check of the URL or the signed-in user.

This guide explains how that works, and then walks through one screen that both platforms share:
the organization form.

## Contents

1. [Running and building each platform](#1-running-and-building-each-platform)
2. [How a build picks its platform](#2-how-a-build-picks-its-platform)
3. [What differs per platform, and where it lives](#3-what-differs-per-platform-and-where-it-lives)
4. [Routes and sidebar menus](#4-routes-and-sidebar-menus)
5. [Reusing one screen: the organization form](#5-reusing-one-screen-the-organization-form)
6. [Recipes](#6-recipes)
7. [Rules to keep](#7-rules-to-keep)
8. [Known gaps](#8-known-gaps)

## 1. Running and building each platform

| Task | Back office | Manufacturer |
|---|---|---|
| Run locally | `npm start` | `npm run start:manufacturer` |
| Production build | `npm run build` | `npm run build:manufacturer` |
| Angular configuration (dev / prod) | `development` / `production` | `manufacturer-dev` / `manufacturer-prod` |

Both production builds write to `dist/frontend`, so the second build replaces the first. To keep
both, give one of them its own folder:

```bash
npx ng build --configuration manufacturer-prod --output-path dist/manufacturer
```

The app is served under `/web/` (`baseHref` in `angular.json`).

## 2. How a build picks its platform

Application code always imports the platform settings from the same path:

```ts
import { PLATFORM, PLATFORM_BRAND, PLATFORM_LOGIN, PLATFORM_API } from '../environments/platform';
```

`src/environments/platform.ts` holds the back office settings. The manufacturer configurations in
`angular.json` tell the build to use another file in its place:

```json
"fileReplacements": [
  { "replace": "src/environments/platform.ts", "with": "src/environments/platform.manufacturer.ts" }
]
```

So the same import gives different values depending on the build:

```
                         import ... from 'environments/platform'
                                         |
        development / production         |        manufacturer-dev / manufacturer-prod
                    |                                              |
        environments/platform.ts                 environments/platform.manufacturer.ts
        PLATFORM = 'backoffice'                  PLATFORM = 'manufacturer-app'
```

This is the same mechanism Angular already uses for `environment.ts` and `environment.prod.ts`.
The two are independent: `environment*.ts` answers "which backend, dev or prod?" and
`platform*.ts` answers "which product?".

Each build still ships the other platform's lazy-loaded screen files and the mock JSON under
`assets/`, because the build copies and compiles everything the code refers to. They are never
loaded: no route in that build leads to them. Do not rely on the build to hide anything secret.

## 3. What differs per platform, and where it lives

| What | Where | Notes |
|---|---|---|
| Platform id, app name, logo | `PLATFORM`, `PLATFORM_BRAND` in `src/environments/platform*.ts` | Read by the login page, header and sidebar |
| Login page text, login URL, landing page after sign-in, user type sent to the backend | `PLATFORM_LOGIN` in the same files | One shared `LoginComponent` shows these |
| Use mock API responses or the real backend | `PLATFORM_API.useMocks` in the same files | See below |
| Colours | `src/styles.css` (defaults) and `src/themes/manufacturer.css` | See below |
| Browser tab title | `src/index.html` and `src/index.manufacturer.html` | Chosen by `"index"` in `angular.json` |
| Routes | `src/app/permission.service.ts` | Section 4 |
| Sidebar menus | `modules` in `src/app/permission.service.ts` | Section 4 |

The shape of the platform settings is defined once, in `src/environments/platform.model.ts`
(`Platform`, `PlatformBrand`, `PlatformLogin`, `PlatformApi`). Every platform file must fill in
all of it, so a missing setting is a build error and not a blank on screen.

### Colours

Shared components never hard-code a brand colour. They use CSS variables:

```css
background: var(--brand-primary);
```

`src/styles.css` defines the back office values. The manufacturer configurations add
`src/themes/manufacturer.css` after it, which redefines the same variables:

```css
:root {
  --brand-primary: #0f766e;
  --brand-primary-soft: #e6f4f1;
  /* ... */
}
```

The variables are `--brand-gradient`, `--brand-primary`, `--brand-primary-soft`,
`--brand-primary-hover`, `--brand-accent` and `--brand-accent-hover`.

### Mock API (manufacturer only, for now)

The manufacturer backend is not built yet. With `useMocks: true`, the interceptor in
`src/app/core/mock-api/mock-api.interceptor.ts` answers backend calls with JSON files:

- The list of mocked endpoints is `src/app/core/mock-api/manufacturer.mocks.ts`.
- The JSON files are in `src/assets/mock-api/manufacturer/`.
- Mocks apply only **after sign-in**. The login screen always calls the real backend.
- A call with no mock goes to the real backend and logs a `[mock-api]` warning in the console.
- Write calls (create, edit, delete) return a success response but save nothing, so lists do not
  change afterwards.

When a real endpoint is ready, delete its line from `manufacturer.mocks.ts`. When all of them are
ready, set `useMocks: false`.

## 4. Routes and sidebar menus

### Routes

`PermissionService.computeRoutes()` builds the route list for the current build:

```ts
computeRoutes(): Route[] {
  const platformRoutes: Record<Platform, () => Route[]> = {
    'backoffice': () => this.backofficeRoutes(),
    'manufacturer-app': () => this.manufacturerRoutes(),
  };
  return [...this.sharedRoutes(), ...platformRoutes[PLATFORM]()];
}
```

| Method | Contains |
|---|---|
| `sharedRoutes()` | Login, User Management, Role Management, organization list and form |
| `manufacturerRoutes()` | `dashboard`, `partners`, `registerPartner` |
| `backofficeRoutes()` | Nothing yet |

A route that is not in the list does not exist in that build, even if someone types its URL.

### Sidebar menus

Menus are the `modules` list in the same file. A module or a single link can be limited to some
platforms with `platforms`. Leave it out and the item is shared.

```ts
{
  name: 'Partner Onboarding',
  icon: 'assets/icons/verify.png',
  platforms: ['manufacturer-app'],          // this module: manufacturer only
  components: [
    { name: 'partners', displayLink: 'Partners' },
  ]
},
```

Two conditions must both hold for a link to appear:

1. It belongs to this platform (`isOnPlatform()` in `src/app/core/platform/platform-filter.ts`).
2. The signed-in user's role allows it. The role returned by the backend must contain an active
   sub-component whose name is **exactly** the link's `displayLink`.

`name` of a link is its route path, so `{ name: 'partners' }` opens `/partners`.

A module that is defined with one link is shown as a direct link, without a dropdown.

## 5. Reusing one screen: the organization form

The back office registers **merchants**. A manufacturer registers its **partners** (suppliers,
distributors, merchants). Both need the same data: business profile, operational details,
address, owner and bank account. So both use the same two components:

| Component | Back office route | Manufacturer route |
|---|---|---|
| `OrganizationViewComponent` (the list) | `/organization` | `/partners` |
| `RegisterOrganizationComponent` (the form) | `/registerOrganization` | `/registerPartner` |

There is no copy of the form and no `if (platform === ...)` inside it. Three small pieces make
this work.

### Piece 1: a settings object for everything that differs

`src/app/user-management/organization/organization-screen.ts` defines `OrganizationScreen`: the
titles, labels, Entity Type options and the two paths the screens navigate to. There is one
object per use of the screens.

```ts
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
```

`MERCHANT_SCREEN` in the same file is the back office version, with the legal-structure entity
types (sole proprietorship, partnership, LLC, ...).

### Piece 2: the route says which settings to use

The manufacturer routes load the same components and pass the settings as route `data`:

```ts
{
  path: 'registerPartner',
  loadComponent: () => import('./user-management/organization/register-organization/register-organization.component')
    .then(c => c.RegisterOrganizationComponent),
  data: { organizationScreen: PARTNER_SCREEN }
},
```

The back office routes pass nothing, which means `MERCHANT_SCREEN`.

### Piece 3: the component reads the settings and nothing else

```ts
// register-organization.component.ts
readonly screen = organizationScreenFor(inject(ActivatedRoute));
```

`organizationScreenFor()` returns the route's `organizationScreen`, or `MERCHANT_SCREEN` when the
route sets none. From there the component and its template only use `screen`:

```html
<h1>{{ screen.formTitle }}</h1>

<select formControlName="entityType">
  @for (type of screen.entityTypes; track type.value) {
    <option [value]="type.value">{{ type.label }}</option>
  }
</select>
```

```ts
entityType: [this.screen.defaultEntityType, Validators.required],   // preselected value
// ...
this.router.navigateByUrl(this.screen.listPath);                     // after save, and on Cancel
```

### What is shared and what is not

| Shared by both platforms | Different per screen (`OrganizationScreen`) |
|---|---|
| Every form field and its validation | Page titles and subtitles |
| Layout and styling | Button and column labels, empty-list text |
| The API calls (`createOrganization`, `getOrganizationDetails`) | Entity Type options and the preselected one |
| The payload sent to the backend | Where the screen goes after save / Cancel / Register |

The chosen Entity Type is sent as `businessProfile.entityType`. That value is how a supplier, a
distributor and a merchant are told apart. The backend is expected to link each partner to the
manufacturer from the signed-in user's token; the form sends no manufacturer id.

### The same settings reused a third time

The manufacturer dashboard (`src/app/manufacturer/dashboard/`) reads `PARTNER_SCREEN.listPath`
and `registerPath` for its links. Each count card opens the partner list with a filter:

```
/partners?type=SUPPLIER
```

`OrganizationViewComponent` reads the `type` query parameter and shows only that entity type.
The filter works on any route that uses the list.

## 6. Recipes

### Add a screen to one platform

1. Create the component (standalone).
2. Add its route to `manufacturerRoutes()` or `backofficeRoutes()` in `permission.service.ts`.
3. Add a sidebar link in `modules` with `platforms: ['<platform id>']`.
4. Make sure the role in the backend has a sub-component named like the link's `displayLink`.
5. Manufacturer only, while mocks are on: add the screen's endpoints to `manufacturer.mocks.ts`
   and their JSON files to `src/assets/mock-api/manufacturer/`.

### Add a screen to both platforms

Same steps, but put the route in `sharedRoutes()` and leave `platforms` off the sidebar link.

### Reuse the organization form for another kind of organization

Example: the back office should register agents.

1. Add `AGENT_SCREEN` to `organization-screen.ts` with its texts, entity types and paths.
2. Add two routes that load `OrganizationViewComponent` and `RegisterOrganizationComponent` with
   `data: { organizationScreen: AGENT_SCREEN }`.
3. Add the sidebar link.

No change to the components is needed. If the new kind needs something the settings do not
cover, such as an extra field, add a property to `OrganizationScreen` and read it in the
component. Do not check the platform inside the component.

### Make another screen reusable the same way

1. List what must differ between the uses (texts, options, paths).
2. Put those in an interface and one constant per use, next to the component.
3. Pass the constant in the route's `data` and give a default for routes that pass none.
4. Replace the hard-coded values in the component and template with the settings.

### Add a third platform

1. Add its id to `Platform` in `src/environments/platform.model.ts`. The build now fails in every
   place that must handle the new platform, which is the list of things to do.
2. Create `src/environments/platform.<name>.ts` (copy `platform.manufacturer.ts`).
3. Add `<name>-dev` and `<name>-prod` configurations to `angular.json` under both `build` and
   `serve` (copy the manufacturer ones), and npm scripts to `package.json`.
4. Add its route method to `computeRoutes()`.
5. Optional: `src/themes/<name>.css`, `src/index.<name>.html`, mock routes.

## 7. Rules to keep

- **Import settings from `environments/platform`**, never from `platform.manufacturer` directly.
  A direct import ignores the build's choice.
- **Import types from `environments/platform.model`.** That file is never replaced, so it is safe
  to import from anywhere, including the platform files themselves.
- **Keep platform differences in settings, routes and the `platforms` tag.** Avoid
  `if (PLATFORM === ...)` inside components and templates; pass the difference in as data, as
  the organization form does.
- **Use the `--brand-*` variables for brand colours** in shared components.
- **A screen is on a platform only if its route is.** Hiding the sidebar link alone does not
  remove the screen.

## 8. Known gaps

- **Manufacturer backend:** not built. Everything after sign-in on the manufacturer platform runs
  on mock data.
- **Login user type:** the login OTP and login calls in `login.component.ts` send `'BO'` on both
  platforms. Only the forgot-password flow uses `PLATFORM_LOGIN.userType` (`'MANUFACTURER'` on
  the manufacturer platform).
- **Deployment:** the `Dockerfile` builds the `production` configuration, which is the back
  office. There is no deployment step for the manufacturer build yet.
- **Dashboard counts:** the manufacturer dashboard counts partners from the first page of the
  list endpoint. With more partners than one page, the backend should return the counts.
