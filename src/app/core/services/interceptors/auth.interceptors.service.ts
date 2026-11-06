import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorsService  implements HttpInterceptor{

  constructor( private authService : AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   // Get the auth token from the service
   const authToken = this.authService.getToken();

   // Clone the request and add the authorization header
   const authReq = req.clone({
     setHeaders: {
       Authorization: `Bearer ${authToken}`
     }
   });

   // Pass the cloned request instead of the original request to the next handle
   return next.handle(authReq);
  }
}
