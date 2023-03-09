import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // const expectedRole = route.data.expectedRole? route.data.expectedRole : 'GUEST';
    const expectedRole = route.data['expectedRole'];
    const userRole = this.authenticationService.getUserRole();

    if (!this.authenticationService.isAuthenticated() || userRole !== expectedRole) {
      this.router.navigate(['/login']);
      return false
    }
    return true;
  }

}
