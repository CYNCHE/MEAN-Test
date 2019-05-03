import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // holds our token information
  private token: string;
  // indicator to other component whether we have logged in or not
  private authStatusListener = new Subject<boolean>();
  // variable to conveniently show whether the user has logged in
  private isAuthenticated: boolean = false;
  // timer to record login duration
  private tokenTimer: any;
  constructor(private http: HttpClient, private router: Router) { }


  getToken() {
    return this.token;
  }

  // prevent emitting values from other components
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData = { email: email, password: password };
    this.http.post<{ token: string, expiresIn: number }>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          // set up for saveAuthData
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate);
          this.router.navigate(['/']);
        }
      });
  }

  // save data(token info and time) to local memory
  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  // clear token info form local storage
  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  // get token and expiration info from local storage
  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) return;
    else return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }


  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) return;
    const now = new Date();
    const duration = authInformation.expirationDate.getTime() - now.getTime();


    if (duration > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      // setAuthTimer works in miliseconds
      this.setAuthTimer(duration / 1000);
      this.authStatusListener.next(true);
    }
  }


  // helper fcn to set authentication timer
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }





  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    // reset the timer when logout
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }
}
