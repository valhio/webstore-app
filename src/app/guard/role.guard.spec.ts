import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

import { RoleGuard } from './role.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let authenticationService: AuthenticationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      providers: [
        { provide: AuthenticationService },
      ]
    });

    guard = TestBed.inject(RoleGuard);
    authenticationService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if user is logged in and has the expected Role', () => {
    const expectedRoles = ['ADMIN'];
    const userRole = 'ADMIN';
    const mockRouteSnapshot = { data: { expectedRoles } } as any;
    const mockRouterStateSnapshot = {} as RouterStateSnapshot;

    spyOn(authenticationService, 'isAuthenticated').and.returnValue(true);
    spyOn(authenticationService, 'getUserRole').and.returnValue(userRole);
    spyOn(router,'navigate');
    expect(guard.canActivate(mockRouteSnapshot as ActivatedRouteSnapshot, mockRouterStateSnapshot)).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should not allow access if user is not logged in', () => {
    const expectedRoles = ['ADMIN'];
    const userRole = '';
    const mockRouteSnapshot = { data: { expectedRoles } } as any;
    const mockRouterStateSnapshot = {} as RouterStateSnapshot;

    spyOn(authenticationService, 'isAuthenticated').and.returnValue(false);
    spyOn(authenticationService, 'getUserRole').and.returnValue(userRole);
    spyOn(router,'navigate');

    expect(guard.canActivate(mockRouteSnapshot as ActivatedRouteSnapshot, mockRouterStateSnapshot)).toBe(false);
    expect(router.navigate).toHaveBeenCalledOnceWith(['/login']);
  });

  it('should not allow access if user is logged in but does not have the expected Role', () => {
    const expectedRoles = ['ADMIN'];
    const userRole = 'USER';
    const mockRouteSnapshot = { data: { expectedRoles } } as any;
    const mockRouterStateSnapshot = {} as RouterStateSnapshot;

    spyOn(authenticationService, 'isAuthenticated').and.returnValue(true);
    spyOn(authenticationService, 'getUserRole').and.returnValue(userRole);
    spyOn(router,'navigate');

    expect(guard.canActivate(mockRouteSnapshot as ActivatedRouteSnapshot, mockRouterStateSnapshot)).toBe(false);
    expect(router.navigate).toHaveBeenCalledOnceWith(['/login']);
  });
});
