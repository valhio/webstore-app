import { Component, OnInit } from '@angular/core';
import { log } from 'console';
import { BehaviorSubject, map, tap } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {

  user$ = this.storeService.getUserByUserId(this.authService.getUserId());
  
  firstNameEditMode = false;
  lastNameEditMode = false;
  emailEditMode = false;
  phoneNumberEditMode = false;
  addressEditMode = false;

  constructor(private authService: AuthenticationService, private storeService: StoreService) { }

  onUpdateFirstName(firstName: string) {
    this.user$ = this.storeService.updateUserFirstName(this.authService.getUserId(), firstName);
  }

  onUpdateLastName(lastName: string) {
    this.user$ = this.storeService.updateUserLastName(this.authService.getUserId(), lastName);
  }

  onUpdateEmail(email: string) {
    this.user$ = this.storeService.updateUserEmail(this.authService.getUserEmail(), email).pipe(
      tap(res => {
        if (res) {
          setTimeout(() => {
            this.authService.logout();
          }, 1000);
        }
      })
    )
  }

  onUpdatePhoneNumber(phone: string) {
    this.user$ = this.storeService.updateUserPhoneNumber(this.authService.getUserId(), phone);
  }

  onUpdateAddress(address: string) {
    this.user$ = this.storeService.updateUserAddress(this.authService.getUserId(), address);
  }
}
