import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './landing/login/login.component';
import { LandingComponent } from './landing/landing.component';
import { SignupComponent } from './landing/signup/signup.component';
import { SupplierComponent } from './supplierManagement/supplier/supplier.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { PermissionService } from './permission.service';
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    LandingComponent,
    RouterOutlet,
    CommonModule,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LoginComponent,
    SignupComponent,
    MatMenuModule
  ]
})
export class AppComponent {
  title = 'MiPay-app';
  loggedIn = false
  authService = inject(AuthService)
  constructor(public permissionService : PermissionService) {

  }
  ngOnInit() {
  }
}
