import { AuthService } from './auth.service';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  // intercept to all types of request
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // get the token
    const authToken = this.authService.getToken();
    // add token to our header which named authorization
    const authRequest = req.clone({
      // the field name "authorization" should match
      // what we have in the backend, in check-auth.js
      // the "Bearer" thing is by convention
      headers: req.headers.set('Authorization', "Bearer " + authToken)
    });
    // return the processed request
    // to allow it to continue the journey
    console.log("injector");
    return next.handle(authRequest);
  }
}
