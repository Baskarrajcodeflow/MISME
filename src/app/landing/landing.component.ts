import { Component, inject } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import { UserDomains, contextSwitch } from '../interface/interface-list';
/* import { CustomerComponent } from '../dashboard/customer/customer.component';
 */import { AuthService } from '../core/services/auth/auth.service';
// import { AuthService } from '../auth.service';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    NgSwitch, NgSwitchCase,
    LoginComponent,
    SignupComponent,
/*     CustomerComponent
 */  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  constructor( private auth : AuthService){}
    
  // }
  userDomains = Object.values(UserDomains)
  userDomain:string= ""
  currentUser = inject(AuthService).currentUser
  credentials = {
    username: '',
    password: ''
  };
  switchTo(s: string) {
    this.state = s
  }
  c = contextSwitch
  state: string = this.c.login

  /* login(){
    this.authService.login(this, this.userDomain);

  } */


}
