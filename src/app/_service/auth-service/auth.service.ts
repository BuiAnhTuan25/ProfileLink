import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
const AUTH_API = 'http://localhost:8080/test';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient,private router:Router) {}
  login(user: any): Observable<any> {
    return this.http.post(
      AUTH_API + '/login',
      {
        username: user.username,
        password: user.password,
      }
    );
  }
  register(user: any): Observable<any> {
    return this.http.post(
      AUTH_API + '/register',
      {
        username: user.username,
        email: user.email,
        password: user.password,
      }
    );
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
}
