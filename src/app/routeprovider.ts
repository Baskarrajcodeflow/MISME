import { Injectable, Signal } from '@angular/core';
import { Route } from '@angular/router';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root'
})
export class RouteProvider {
  constructor(private perm: PermissionService) {}
  getRoutes(): Route[] {
    // Fetch route configuration data from a server
    return this.perm.computeRoutes()
  }
}
