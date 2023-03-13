import { Component, OnInit } from '@angular/core';
import { map, switchMap, Observable } from 'rxjs';
import { AuthenticationService } from '../../../../services/authentication.service';
import { StoreService } from '../../../../services/store.service';
import { ApiResponse } from '../../../../interface/api-response';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceDialogComponent } from './invoice-dialog/invoice-dialog.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  user$ = this.authenticationService.getUser();
  orders$= this.user$.pipe(switchMap(user => this.storeService.getOrdersForUser(user.userId)));

  constructor(private authenticationService: AuthenticationService, private storeService: StoreService, private dialog: MatDialog) { }

  ngOnInit(): void { }

  openInvoice(order: any) {
    this.dialog.open(InvoiceDialogComponent, {
      data: order,
      maxHeight: '90vh',
    } );
  }

}
