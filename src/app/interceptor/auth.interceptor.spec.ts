import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';
import { AuthenticationService } from '../services/authentication.service';
import { AppModule } from '../app.module';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';


fdescribe('AuthInterceptor', () => {
  let authService: AuthenticationService;
  let httpMock: HttpTestingController;
  let interceptor: AuthInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthInterceptor, AuthenticationService],
    });

    authService = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
    interceptor = TestBed.inject(AuthInterceptor);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header with token if user is logged in and request URL matches API URL', () => {
    const token = 'test-token';
    const mockUrl = `${ authService._host }/api/test`;
    spyOn(authService, 'isUserLoggedIn').and.returnValue(true);
    spyOn(authService, 'getTokenValue').and.returnValue(token);

    const req = new HttpRequest('GET', mockUrl);
    const next: HttpHandler = {
      handle: (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        expect(req).toBeTruthy()
        expect(req.headers.has('Authorization')).toEqual(true);
        expect(req.headers.get('Authorization')).toEqual(`Bearer ${ token }`);
        expect(req.url).toEqual(mockUrl);
        expect(req.method).toEqual('GET');
        return new Observable<HttpEvent<any>>();
      },
    };

    interceptor.intercept(req, next);
  });

  it('should not add Authorization header if user is not logged in', () => {
    const mockUrl = `${ authService._host }/api/test`;
    spyOn(authService, 'isUserLoggedIn').and.returnValue(false);

    const req = new HttpRequest('GET', mockUrl);
    const next: HttpHandler = {
      handle: (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        expect(req).toBeTruthy()
        expect(req.headers.has('Authorization')).toEqual(false);
        expect(req.url).toEqual(mockUrl);
        expect(req.method).toEqual('GET');
        return new Observable<HttpEvent<any>>();
      }
    };

    interceptor.intercept(req, next);
  });

  it('should not add Authorization header if request URL does not match API URL', () => {
    const otherUrl = 'https://some-other-url.com/api/test';
    spyOn(authService, 'isUserLoggedIn').and.returnValue(true);

    const req = new HttpRequest('GET', otherUrl);
    const next: HttpHandler = {
      handle: (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        expect(req).toBeTruthy()
        expect(req.headers.has('Authorization')).toEqual(false);
        expect(req.url).toEqual(otherUrl);
        expect(req.method).toEqual('GET');
        return new Observable<HttpEvent<any>>();
      }
    };

    interceptor.intercept(req, next);
  });

  it('should not add Authorization header if user is logged in and request URL matches API URL but token is empty', () => {
    const mockToken = "";
    const mockUrl = `${ authService._host }/api/test`;
    spyOn(authService, 'isUserLoggedIn').and.returnValue(true);
    spyOn(authService, 'getTokenValue').and.returnValue(mockToken);

    const req = new HttpRequest('GET', mockUrl);
    const next: HttpHandler = {
      handle: (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
        expect(req).toBeTruthy()
        expect(req.headers.has('Authorization')).toEqual(false);
        expect(req.url).toEqual(mockUrl);
        expect(req.method).toEqual('GET');
        return new Observable<HttpEvent<any>>();
      }
    };

    interceptor.intercept(req, next);
  });

});
