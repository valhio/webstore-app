import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

// The Interceptor intercepts all HTTP requests and adds the JWT token to the Authorization header.(Needs to be added to the providers array in app.module.ts)
// This is done so that the server can verify the user's identity.
// The JWT token is stored in the local storage of the browser.
// The token is added to the Authorization header only if the user is logged in.
// The token is removed from the Authorization header if the user logs out.
// The token is added to the Authorization header only if the request is sent to the API URL.
// The token is removed from the Authorization header if the request is sent to a different URL.
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }

  intercept(
    request: HttpRequest<any>,
    httpHandler: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.startsWith(`${ this.authenticationService._host }/api/v1/user/login`))
      return httpHandler.handle(request);
    if (request.url.startsWith(`${ this.authenticationService._host }/api/v1/user/register`))
      return httpHandler.handle(request);
    if (request.url.startsWith(`${ this.authenticationService._host }/api/v1/user/reset-password`))
      return httpHandler.handle(request);
    if (request.url.startsWith(`${ this.authenticationService._host }/api/v1/orders/new`))
      return httpHandler.handle(request);

      // The token is added to the Authorization header only if the user is logged in and the request is sent to the API URL.
    if (this.authenticationService.isUserLoggedIn() && request.url.startsWith(this.authenticationService._host)) {
      const token: string = this.authenticationService.getTokenValue()
      if (token.length > 0) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${ token }`,
          },
        });
      } else {
        request = request.clone({
          setHeaders: {
            Authorization: '',
          },
        });
      }
    }

    return httpHandler.handle(request);
  }
}

