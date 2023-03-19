import { HttpClient, HttpHeaders, HttpResponse, } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginUser } from '../models/loginUser';
import { RegisterUser } from '../models/registerUser';
import { User } from '../models/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class AuthenticationService implements OnDestroy {
  public _host: string = environment.apiUrl;
  private _isAuthenticated: boolean = false;
  private userSubject: BehaviorSubject<User>;
  private tokenSubject: BehaviorSubject<string>;
  private jwtHelper = new JwtHelperService();
  private subscriptions: Subscription[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject<User>(new User({}));
    this.tokenSubject = new BehaviorSubject<string>('');
    this.tokenSubject.next(localStorage.getItem('token') || '');
    this.userSubject.next(JSON.parse(localStorage.getItem('user') || '{}'));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setUser(user: User) {
    this.userSubject.next(user);
  }

  getUser(): Observable<User> {
    return this.userSubject.asObservable();
  }

  setToken(token: string) {
    this.tokenSubject.next(token);
  }

  getToken(): Observable<string> {
    return this.tokenSubject.asObservable();
  }

  getTokenValue(): string {
    return this.tokenSubject.value;
  }

  login(user: LoginUser): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${ this._host }/api/v1/user/login`, user, { observe: 'response' })// observe: 'response' : to get the http response instead of just the body
      .pipe(
        tap((res: HttpResponse<User>) => {
          this.setToken(res.headers.get('jwt-token') || '');
          this.setUser(res.body || new User({}));
          localStorage.setItem('user', JSON.stringify(this.userSubject.value));
          localStorage.setItem('token', this.tokenSubject.value);
          this._isAuthenticated = true;
        }
        ));
  }

  register(user: RegisterUser): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${ this._host }/api/v1/user/register`, user, { observe: 'response' });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(new User({}));
    this.tokenSubject.next('');
    // this.router.navigate(['/login'])

    // this.subscriptions.push(
    //   this.http.post<any>(`${ this._host }/api/v1/user/api/logout`, {})
    //     .subscribe(
    //       {
    //         next: () => {
    //           localStorage.removeItem('token');
    //           localStorage.removeItem('user');
    //           this.userSubject.next(new User({}));
    //           this.tokenSubject.next('');
    //         },
    //         error: (err) => console.log(err),
    //         complete: () => this.router.navigate(['/login'])
    //       }
    //     )
    // )
  }

  updateUserInLocalStorage(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  updateTokenInLocalStorage(token: string) {
    localStorage.setItem('token', token);
  }

  getUserRole(): string {
    return this.jwtHelper.decodeToken(this.tokenSubject.value).role;
  }

  getAuthorities(): string[] {
    return this.jwtHelper.decodeToken(this.tokenSubject.value).authorities;
  }

  getLoggedInUsername(): string {
    return this.jwtHelper.decodeToken(this.tokenSubject.value).sub;
  }

  isAuthenticated(): boolean {
    // return this._isAuthenticated;
    return this.isUserLoggedIn();
  }

  isUserLoggedIn(): boolean {
    const decodedToken = this.jwtHelper.decodeToken(this.tokenSubject.value);
    /*If the token is not expired, 
    the username in the token is the same as the username in the user object, 
    the role in the token is the same as the role in the user object, 
    and the email in the token is the same as the email in the user object, 
    then the user is authenticated. 
    */
    if (!this.jwtHelper.isTokenExpired(this.tokenSubject.value)
      && this.userSubject.value.email === decodedToken.email
      && this.userSubject.value.role === decodedToken.role
      && this.userSubject.value.email === decodedToken.email
    ) {
      this._isAuthenticated = true;
      return this._isAuthenticated;
    }

    this.logout();
    this._isAuthenticated = false;
    return this._isAuthenticated;
  }
}
