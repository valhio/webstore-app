import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginUser } from 'src/app/models/loginUser';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit, OnDestroy {
  public isLoading = false;
  private _subscriptions: Subscription[] = [];

  constructor(private authenticationService: AuthenticationService, private router: Router, private snackbarService: SnackbarService) {
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    if (this.authenticationService.isAuthenticated()) {
      this.router.navigateByUrl('/');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  onLogin(user: LoginUser): void {
    console.log('user:',user);
    

    this.isLoading = true;
    this._subscriptions.push(
      this.authenticationService.login(user).subscribe(
        {
          next: response => {            
            this.snackbarService.openSnackBar('You have been logged in successfully!', 5000, 'fill', 'success');
            this.router.navigateByUrl('/');
            this.isLoading = false;
          },
          error: error => {
            this.snackbarService.openSnackBar('An error occurred while logging in, please try again later!', 5000, 'fill', 'error');
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          }
        },
      )
    )
  }
}
