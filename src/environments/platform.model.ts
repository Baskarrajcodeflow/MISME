// Shared types for the platform files. This file is never swapped by angular.json,
// so every platform.*.ts file can import from it safely.

import { UserType } from "../app/interface/interface-list";

/** Platforms built from this repo. Each one has a platform.<name>.ts file swapped in by angular.json. */
export type Platform = 'backoffice' | 'manufacture-app';

/** Per-platform branding read by the UI. Colours live in CSS: styles.css (defaults) and src/themes/. */
export interface PlatformBrand {
  /** Product name shown on the login page. */
  appName: string;
  /** Header logo path, relative to the app root (e.g. 'assets/images/logo.png'). Omit to show no logo. */
  logo?: string;
}

/** Per-platform login: what the shared LoginComponent sends to the backend and shows on screen. */
export interface PlatformLogin {
  /** Route of the login page, without a leading slash. The auth guard redirects here. */
  path: string;
  /** Route opened after a successful login, without a leading slash. Must exist on this platform. */
  homePath: string;
  /** userType sent to the backend for login OTP, forgot-password OTP and password reset. */
  userType: UserType;
  /** Small line under the app name, top-left of the login page. */
  tagline: string;
  /** Headline on the left panel; each item is shown on its own line. */
  headline: string[];
  /** Paragraph under the headline. */
  description: string;
  /** Feature tiles in the grid on the left panel. */
  features: string[];
  /** Small text at the bottom of the left panel. */
  footer: string;
}
