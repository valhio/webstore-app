import { Component, OnInit } from '@angular/core';
import { map, switchMap, Observable, of } from 'rxjs';
import { AuthenticationService } from '../../../../services/authentication.service';
import { StoreService } from '../../../../services/store.service';
import { ApiResponse } from '../../../../interface/api-response';
import { MatDialog } from '@angular/material/dialog';
import { OrderStatus } from 'src/app/enum/order-status.enum';
import { OrderItemStatus } from 'src/app/enum/order-item-status.enum ';
import { InvoiceComponent } from '../invoice/invoice.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {

  user$ = this.authenticationService.getUser();
  orders$ = this.user$.pipe(switchMap(user => this.storeService.getOrdersForUser(user.id)));

  constructor(private authenticationService: AuthenticationService, private storeService: StoreService, private dialog: MatDialog) { }

  openInvoice(order: any) {
    let dialogRef = this.dialog.open(InvoiceComponent, {
      maxHeight: '90vh',
    });
    dialogRef.componentInstance.order$ = of(order);
  }

  getOrderStatus(status: string, date: string) {
    const lastUpdatedOn = new Date(date).toLocaleDateString('bg-BG');
    let response = null;
    switch (status) {
      case 'ORDER_PLACED':
        response = 'Order placed';
        break
      case 'PENDING':
        response = 'Preparing to ship';
        break
      case 'OUT_FOR_DELIVERY':
        response = 'Shipped';
        break
      case 'DELIVERED':
        response = 'Delivered';
        break
      case 'CANCELED':
        response = 'Canceled';
        break
      case 'REFUNDED':
        response = 'Refunded';
        break
      case 'RETURNED':
        response = 'Returned';
        break
      default:
        response = 'Order placed';
        break
    }
    return response + ' on ' + lastUpdatedOn;
  }

  getOrderStatusIndex(status: 'ORDER_PLACED' | 'PENDING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELED' | 'REFUNDED' | 'RETURNED'): number {
    return Object.keys(OrderStatus).indexOf(status);
  }

  isMoreThanOrEqualTo(index: number, number: number) {
    return index >= number;
  }

  getOrderStatusEnum(status: 'ORDER_PLACED' | 'PENDING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELED' | 'REFUNDED' | 'RETURNED'): string {
    return OrderStatus[status];
  }

  getOrderItemStatus(status: string, date: string) {
    const lastUpdatedOn = new Date(date).toLocaleDateString('bg-BG');
    let response = null;
    switch (status) {
      case 'ORDER_PLACED':
        response = 'Order placed';
        break
      case 'PENDING':
        response = 'Checking product availability';
        break
      case 'IN_STOCK':
        response = 'Preparing to ship';
        break
      case 'OUT_FOR_DELIVERY':
        response = 'Out for delivery';
        break
      case 'DELIVERED':
        response = 'Delivered';
        break
      case 'CANCELED':
        response = 'Canceled';
        break
      case 'REFUNDED':
        response = 'Refunded';
        break
      case 'RETURNED':
        response = 'Returned';
        break
      default:
        response = 'Checking product status';
        break
    }
    return response + ' on ' + lastUpdatedOn;
  }

}
