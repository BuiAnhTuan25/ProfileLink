import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivate,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_service/auth-service/authentication.service';
@Injectable({
  providedIn: 'root',
})
export class AdminActive implements CanActivate {
  constructor(public authService: AuthenticationService, public router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (JSON.parse(localStorage.getItem('auth-user')!).role !== 'ADMIN') {
      window.alert('You do not have permission to access this page');
      this.router.navigate(['/login']);
    }
    return true;
  }
}