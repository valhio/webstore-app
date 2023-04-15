import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

import { AuthenticationService } from './authentication.service';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { LoginUser } from '../models/loginUser';
import { HttpResponse } from '@angular/common/http';
import { RegisterUser } from '../models/registerUser';
import { Router } from '@angular/router';

fdescribe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;
  let router: Router;
  let jwtHelper: JwtHelperService;

  const mockUser = new User({ id: 1, userId:'123', email: 'testemail', password: 'testpassword', role: 'testrole', authorities: ['testauthority1', 'testauthority2'] });
  const mockToken = 'mockToken';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        JwtHelperService,
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        AuthenticationService
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    jwtHelper = TestBed.inject(JwtHelperService);
    service = TestBed.inject(AuthenticationService);

    service['jwtHelper'] = jwtHelper; // This is a hack to get around the fact that the jwtHelper is not being injected properly.
    service['userSubject'].next(new User({}));
    service['tokenSubject'].next('');
  });


  // After each test, assert that there are no more pending requests.
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setUser()', () => {
    it('should set the userSubject', () => {
      service.setUser(mockUser);
      expect(service['userSubject'].value).toEqual(mockUser);
      expect(service['userSubject'].value.email).toEqual(mockUser.email);
    });

    it('should return the userSubject as an observable', () => {
      service.setUser(mockUser);
      service.getUser().subscribe((user) => {
        expect(service.getUser()).toEqual(jasmine.any(Observable));
        expect(service['userSubject'].getValue()).toEqual(jasmine.any(User));
        expect(user).toEqual(user);
        expect(user.email).toEqual(user.email);
      });
    });
  });

  describe('setToken()', () => {
    it('should set the tokenSubject', () => {
      service.setToken(mockToken);
      expect(service['tokenSubject'].value).toEqual(mockToken);
    });

    it('should return the tokenSubject as an observable', () => {
      service.setToken(mockToken);
      service.getToken().subscribe((token) => {
        expect(service.getUser()).toEqual(jasmine.any(Observable));
        expect(token).toEqual(mockToken);
      });
    });
  });

  describe('getTokenValue()', () => {
    it('should return the tokenSubject value', () => {
      service.setToken(mockToken);
      const token = service.getTokenValue();
      expect(token).toEqual(mockToken)
    })

    it('should return empty string if tokenSubject is empty', () => {
      const token = service.getTokenValue();
      expect(token).toEqual('');
    });
  });

  describe('login()', () => {
    it('should make a POST request and return an Observable of the HttpResponse<User>', () => {
      spyOn(localStorage, 'setItem');
      const user = new LoginUser(mockUser);

      service.login(user).subscribe((res) => {
        expect(res).toEqual(jasmine.any(HttpResponse));
        expect(res.body).toEqual(jasmine.any(User));
        expect(res.body).toEqual(mockUser);
        expect(res.body?.email).toEqual(mockUser.email);
        expect(service['tokenSubject'].value).toEqual(mockToken);
        expect(service['userSubject'].getValue()).toEqual(jasmine.any(User));
        expect(service['userSubject'].getValue()).toEqual(mockUser);
      })

      const req = httpMock.expectOne(`${ service['_host'] }/api/v1/user/login`); // This will match the url and method of the request 
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(user);
      req.flush(mockUser, { headers: { 'jwt-token': mockToken } });

      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
    });
  });

  describe('register()', () => {
    it('should make a POST request and return an Observable of the HttpResponse<User>', () => {
      const user = new RegisterUser(mockUser);

      service.register(user).subscribe((res) => {
        expect(res).toEqual(jasmine.any(HttpResponse));
        expect(res.body).toEqual(jasmine.any(User));
        expect(res.body).toEqual(mockUser);
        expect(res.body?.email).toEqual(user.email);
      });

      const req = httpMock.expectOne(`${ service['_host'] }/api/v1/user/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(user);
      req.flush(mockUser, { headers: { 'jwt-token': mockToken } });
    });
  });

  describe('logout', () => {
    it('should set the userSubject and tokenSubject to empty values and clear the localStorage', () => {
      spyOn(localStorage, 'removeItem');

      service.logout()
      expect(service['userSubject'].value).toEqual(new User({}));
      expect(service['tokenSubject'].value).toEqual('');
      expect(localStorage.removeItem).toHaveBeenCalledTimes(2);
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  })

  describe('getUserRole()', () => {
    it('should return the role of the user', () => {
      spyOn(jwtHelper, 'decodeToken').and.returnValue(mockUser);

      const role = service.getUserRole();
      expect(role).toEqual(mockUser.role);
    });

    it('should return an empty string if the user is not logged in', () => {
      service['tokenSubject'].next('');
      spyOn(jwtHelper, 'decodeToken').and.returnValue(service['tokenSubject'].value);

      const role = service.getUserRole();
      expect(role).toEqual('');
    });
  });

  describe('getUserAuthorities()', () => {
    it('should return the authorities of the user', () => {
      spyOn(jwtHelper, 'decodeToken').and.returnValue(mockUser);

      const authorities = service.getUserAuthorities();
      expect(authorities).toEqual(mockUser.authorities);
    });

    it('should return an empty string if the user is not logged in', () => {
      service['tokenSubject'].next('');
      spyOn(jwtHelper, 'decodeToken').and.returnValue(service['tokenSubject'].value);

      const authorities = service.getUserAuthorities();
      expect(authorities).toEqual([]);
    });
  });

  describe('isAuthenticated', () => {

    it('should return false if the tokenSubject is empty', () => {
      spyOn(jwtHelper, 'decodeToken').and.returnValue('');

      expect(service.isAuthenticated()).toEqual(false);
      expect(jwtHelper.decodeToken).toHaveBeenCalledTimes(1);
    });

    it('should return false if the token is expired', () => {
      spyOn(jwtHelper, 'decodeToken').and.returnValue(mockUser);
      spyOn(service, 'isTokenExpired').and.returnValue(true);

      expect(service.isAuthenticated()).toEqual(false);
      expect(jwtHelper.decodeToken).toHaveBeenCalledTimes(1);
      expect(service.isTokenExpired).toHaveBeenCalledTimes(1);
    });

    it('should return false if the userSubject email does not match the token email', () => {
      spyOn(jwtHelper, 'decodeToken').and.returnValue(mockUser);
      service['userSubject'].next(new User({ email: 'different' }));

      expect(service.isAuthenticated()).toEqual(false);
      expect(jwtHelper.decodeToken).toHaveBeenCalledTimes(1);
      expect(service['userSubject'].value.email).not.toEqual(mockUser.email);
    });

    it('should return false if the userSubject role does not match the token role', () => {
      spyOn(jwtHelper, 'decodeToken').and.returnValue(mockUser);
      service['userSubject'].next(new User({ role: 'different' }));

      expect(service.isAuthenticated()).toEqual(false);
      expect(jwtHelper.decodeToken).toHaveBeenCalledTimes(1);
      expect(service['userSubject'].value.role).not.toEqual(mockUser.role);
    });

    it('should return true if the user is authenticated', () => {
      spyOn(jwtHelper, 'decodeToken').and.returnValue(mockUser);
      spyOn(service, 'isTokenExpired').and.returnValue(false);
      service['userSubject'].next(mockUser);

      expect(service.isAuthenticated()).toEqual(true);
      expect(service['userSubject'].value.email).toEqual(mockUser.email);
      expect(service['userSubject'].value.role).toEqual(mockUser.role);
      expect(jwtHelper.decodeToken).toHaveBeenCalledTimes(1);
      expect(service.isTokenExpired).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserUserId', () => {
    it('should return the user ID from the decoded token', () => {
      spyOn(jwtHelper, 'decodeToken').and.returnValue(mockUser);
      // const jwtHelper = TestBed.inject(JwtHelperService);
      const result = service.getUserUserId();
      expect(result).toEqual(mockUser.userId);
    });

    it('should return an empty string if the decoded token does not have a user ID', () => {
      spyOn(jwtHelper, 'decodeToken').and.returnValue({});
      const result = service.getUserUserId();
      expect(result).toEqual('');
    });
  });

  describe('getUserEmail', () => {
    it('should return the email from the decoded token', () => {
      spyOn(jwtHelper, 'decodeToken').and.returnValue(mockUser);
      const result = service.getUserEmail();
      expect(result).toEqual(mockUser.email);
    });

    it('should return an empty string if the decoded token does not have an email', () => {
      spyOn(jwtHelper, 'decodeToken').and.returnValue({});
      const result = service.getUserEmail();
      expect(result).toEqual('');
    });
  });
});
