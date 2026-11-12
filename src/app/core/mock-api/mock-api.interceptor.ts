import { HttpBackend, HttpClient, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PLATFORM, PLATFORM_API } from '../../../environments/platform';
import type { Platform } from '../../../environments/platform.model';
import { AuthService } from '../services/auth/auth.service';
import { MANUFACTURER_MOCKS } from './manufacturer.mocks';
import { findMock, MockRoute } from './mock-route';

/** Mocked endpoints per platform. Only used when the platform's PLATFORM_API.useMocks is true. */
const MOCKS_BY_PLATFORM: Partial<Record<Platform, readonly MockRoute[]>> = {
  'manufacturer-app': MANUFACTURER_MOCKS,
};

/**
 * Answers backend calls from JSON files (src/assets/mock-api/) for platforms whose backend isn't
 * built yet. Must run before authInterceptor, which encrypts the URL path once a user is signed in.
 *
 * - Only backend calls (environment.apiUrl) are considered; assets and other requests pass through.
 * - Only after sign-in: the login screen (login OTP, forgot password, ...) uses the real backend.
 * - Endpoints without a mock go to the real backend, with a console warning.
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const routes = MOCKS_BY_PLATFORM[PLATFORM];
  if (!PLATFORM_API.useMocks || !routes || !req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }
  if (inject(AuthService).currentUser() === '') {
    return next(req);
  }

  const match = findMock(routes, req.method, req.url);
  if (!match) {
    console.warn(`[mock-api] No mock for ${req.method} ${req.url}; sending it to the real backend.`);
    return next(req);
  }

  // HttpBackend skips all interceptors, so the asset request isn't encrypted or mocked again.
  const http = new HttpClient(inject(HttpBackend));
  return http.get(match.fileUrl).pipe(
    map((body) => {
      console.info(`[mock-api] ${req.method} ${match.route.path} -> ${match.fileUrl}`);
      return new HttpResponse({ status: 200, statusText: 'OK', url: req.url, body });
    })
  );
};
