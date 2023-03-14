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
    const expectedRoles: string[] = route.data['expectedRoles'];
    
    const userRole = this.authenticationService.getUserRole();
    
    if (!this.authenticationService.isAuthenticated() || !expectedRoles.includes(userRole)) {
      this.router.navigate(['/login']);
      return false
    }
    return true;
  }

}
