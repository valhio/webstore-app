import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { SnackbarService } from '../services/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  canActivate(
    route?: ActivatedRouteSnapshot,
    state?: RouterStateSnapshot): boolean{
    return this.isUserAuthenticated();
  }

  constructor(private authenticationService: AuthenticationService, private router: Router, private notificationService: SnackbarService ) { }

  isUserAuthenticated() {
    if (this.authenticationService.isAuthenticated()) return true;
    this.router.navigate(['/login']);
    this.notificationService.openSnackBar('You need to login to access this page!', 5000, 'fill', 'error')
    return false;
  }
  
}
