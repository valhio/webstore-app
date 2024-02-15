import {HttpClient, HttpResponse,} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {environment} from 'src/environments/environment';
import {LoginUser} from '../models/loginUser';
import {RegisterUser} from '../models/registerUser';
import {User} from '../models/user';
import {JwtHelperService} from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public _host: string = environment.apiUrl;
  private userSubject: BehaviorSubject<User>;
  private tokenSubject: BehaviorSubject<string>;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject<User>(new User({}));
    this.tokenSubject = new BehaviorSubject<string>('');
    this.tokenSubject.next(localStorage.getItem('token') || '');
    this.userSubject.next(JSON.parse(localStorage.getItem('user') || '{}'));
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
    return this.tokenSubject.value || '';
  }

  login(user: LoginUser): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${ this._host }/api/v1/user/login`, user, { observe: 'response' })// observe: 'response' : to get the http response instead of just the body
      .pipe(
        tap((res: HttpResponse<User>) => {
          this.setToken(res.headers.get('jwt-token') || '');
          this.setUser(res.body || new User({}));
          localStorage.setItem('user', JSON.stringify(this.userSubject.value));
          localStorage.setItem('token', this.tokenSubject.value);
        }
        ));
  }

  register(user: RegisterUser): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${ this._host }/api/v1/user/register`, user, { observe: 'response' });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setUser(new User({}));
    this.setToken('');
    this.router.navigate(['/login']);
  }

  getUserRole(): string {
    return this.jwtHelper.decodeToken(this.tokenSubject.value)?.role || '';
  }

  getUserAuthorities(): string[] {
    return this.jwtHelper.decodeToken(this.tokenSubject.value)?.authorities || [];
  }

  getUserUserId(): string {
    return this.jwtHelper.decodeToken(this.tokenSubject.value)?.id || '';
  }

  getUserEmail(): string {
    return this.jwtHelper.decodeToken(this.tokenSubject.value)?.email || '';
  }

  isAuthenticated(): boolean {
    const decodedToken = this.jwtHelper.decodeToken(this.tokenSubject.value);

    /*
    If the token exists,
    is not expired,
    the username in the token is the same as the username in the user object,
    the role in the token is the same as the role in the user object,
    and the email in the token is the same as the email in the user object,
    then the user is authenticated.
    */
    if (decodedToken
      && !this.isTokenExpired()
      && this.userSubject.value.email === decodedToken.email
      && this.userSubject.value.role === decodedToken.role
    ) {
      return true;
    }

    return false;
  }

  isTokenExpired(): boolean {
    return this.jwtHelper.isTokenExpired(this.tokenSubject.value);
  }
}
