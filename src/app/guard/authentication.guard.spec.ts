import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { RouterTestingModule } from '@angular/router/testing';


import { AuthenticationGuard } from './authentication.guard';
import { AppModule } from '../app.module';

describe('AuthenticationGuard', () => {
  let guard: AuthenticationGuard;
  let authenticationService: AuthenticationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
      providers: [
        { provide: AuthenticationService },
      ]
    });
    guard = TestBed.inject(AuthenticationGuard);
    authenticationService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if user is logged in', () => {
    spyOn(authenticationService, 'isUserLoggedIn').and.returnValue(true);
    expect(guard.canActivate()).toBe(true);
    expect(authenticationService.isUserLoggedIn).toHaveBeenCalled();
  })

  it('should not allow access if user is not logged in', () => {
    spyOn(authenticationService, 'isUserLoggedIn').and.returnValue(false);
    spyOn(router, 'navigate');
    expect(guard.canActivate()).toBe(false);
    expect(authenticationService.isUserLoggedIn).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

});
