import { Component, OnInit } from '@angular/core';
import { map, switchMap, Observable } from 'rxjs';
import { AuthenticationService } from '../../../../services/authentication.service';
import { StoreService } from '../../../../services/store.service';
import { ApiResponse } from '../../../../interface/api-response';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  user$ = this.authenticationService.getUser();
  orders$= this.user$.pipe(switchMap(user => this.storeService.getOrdersForUser(user.userId)));

  constructor(private authenticationService: AuthenticationService, private storeService: StoreService) { }

  ngOnInit(): void { }


}
