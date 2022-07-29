import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
const AUTH_API = 'http://localhost:8080';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient, private router: Router) {}
  login(user: any): Observable<any> {
    return this.http.post(AUTH_API + '/test/login', user);
  }
  register(user: any): Observable<any> {
    return this.http.post(AUTH_API + '/test/register', user);
  }
  getToken() {
    return localStorage.getItem('auth-token');
  }
  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('auth-token');
    return authToken !== null ? true : false;
  }
  doLogout() {
    let removeToken = localStorage.removeItem('auth-token');
    if (removeToken == null) {
      this.router.navigate(['/login']);
    }
  }

  sendEmailChangePassword(mail: string): Observable<any> {
    let param = new HttpParams();
    param = param.append('mail', mail);
    return this.http.get(AUTH_API + '/update_password_token', {
      params: param,
    });
  }

  changePassword(code: string, newPass: string): Observable<any> {
    let param = new HttpParams();
    param = param.append('code', code);
    param = param.append('password', newPass);
    return this.http.post(AUTH_API + '/test/update_password_token', null, {
      params: param,
    });
  }

  sendEmailForgotPassword(mail: string): Observable<any> {
    let param = new HttpParams();
    param = param.append('mail', mail);
    return this.http.get(AUTH_API + '/test/forgot_password', {
      params: param,
    });
  }
}
