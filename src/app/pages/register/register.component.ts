import {Component, OnDestroy, OnInit} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginUser } from 'src/app/models/loginUser';
import { RegisterUser } from 'src/app/models/registerUser';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import Validation from 'src/app/utils/validation';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  public isLoading = false;
  submitted = false;
  private _subscriptions: Subscription[] = [];

  form: FormGroup = new FormGroup({
    fullname: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    acceptedTerms: new FormControl(false),
  });

  constructor(private authenticationService: AuthenticationService, private router: Router, private formBuilder: FormBuilder, private _snackBar: MatSnackBar, private snackbarService: SnackbarService) {
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    if (this.authenticationService.isAuthenticated()) {
      this.router.navigateByUrl('/');
    } else {
      this.router.navigateByUrl('/register');
    }

    this.form = this.formBuilder.group(
      {
        firstName: ['fName', Validators.required],
        lastName: ['lName', Validators.required],
        email: ['a@a.com', [Validators.required, Validators.email]],
        password: ['asdasd', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
        confirmPassword: ['asdasd', Validators.required],
        acceptedTerms: [true, Validators.requiredTrue],
      },
      {validators: [Validation.match('password', 'confirmPassword')],}
    );
  }

  onRegister(user: RegisterUser): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this._subscriptions.push(
      this.authenticationService.register(user).subscribe(
        {
          next: response => {
            console.log(response);
            
            // this.loginComponent.onLogin(user);
            new LoginComponent(this.authenticationService, this.router, this.snackbarService).onLogin(new LoginUser(user));
            // this.authenticationService.saveToken(response.headers.get(HeaderType.JWT_TOKEN) || '');
            // this.authenticationService.saveUser(response.body!); // ! : non-null assertion operator
            // this.notificationService.showNotification(NotificationType.SUCCESS, 'You have been registered successfully!');
            // this.snackbarService.openSnackBar('You have been registered successfully!', 5000, 'fill', 'success');
            // this.router.navigateByUrl('/user/management');
            // this.isLoading = false;
          },
          error: error => {
            // this.notificationService.notify(NotificationType.ERROR, error.error.message || 'An error occurred while registering, please try again later!');
            this.snackbarService.openSnackBar('An error occured while registering, please try again later!', 5000, 'fill', 'error');

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
