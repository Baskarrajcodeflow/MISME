import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "./core/services/auth/auth.service";
import { PLATFORM_LOGIN } from "../environments/platform";

@Injectable({
  providedIn: "root",
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(["/" + PLATFORM_LOGIN.path]);
      return false;
    }
  }
}



