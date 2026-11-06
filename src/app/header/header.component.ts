import { Component, Input } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { AuthService } from "../core/services/auth/auth.service";
import { MatIcon, MatIconModule } from "@angular/material/icon";
// import { AuthService } from '../auth.service';
import { MatMenuModule } from "@angular/material/menu";
import { Router } from "@angular/router";
import { MatDividerModule } from '@angular/material/divider';
import { PermissionService } from "../permission.service";
@Component({
  selector: "app-header",
  standalone: true,
  imports: [TranslateModule, MatIcon, MatIconModule, MatMenuModule,MatDividerModule],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  userPrivileges: any;
  roleName: any;
  userName: any;
  constructor(public auth: AuthService,private router:Router, public permissionService : PermissionService) {}
  ngOnInit() {
    const privilegesData = sessionStorage.getItem("privileges");
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userName = sessionStorage.getItem('loginUserName')
      this.roleName = this.userPrivileges[0]?.roleName; 
      console.log(this.roleName, "Role Name");
      console.log(this.userName, "userName ");
    }
  }
  resetPassword() {
    this.router.navigateByUrl("kyc/reset-password")
  }
  
}
