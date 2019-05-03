import { AuthService } from './auth.service';

import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authService.getIsAuthenticated();
    // if user has not logged in
    // navigate to the login page
    if (!isAuth) {
      this.router.navigate(['/login']);
    }
    return isAuth;
  }
}
