import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { ManagementService } from '../../../services/management.service';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { OrderStatus } from '../../../enum/order-status.enum';
import { OrderItemStatus } from '../../../enum/order-item-status.enum ';
import { InvoiceComponent } from '../../home/components/invoice/invoice.component';

@Component({
  selector: 'app-orders-management',
  templateUrl: './orders-management.component.html',
  styleUrls: ['./orders-management.component.scss']
})
export class OrdersManagementComponent implements OnInit {

  orders$: Observable<any[]> = this.managementService.getOrders();

  constructor(private managementService: ManagementService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openInvoice(order: any) {
    let dialogRef = this.dialog.open(InvoiceComponent, {
      maxHeight: '90vh',
    });
    dialogRef.componentInstance.order$ = of(order);
  }

  getOrderStatus(status: "PENDING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELED" | "REFUNDED" | "RETURNED"): string {
    return OrderStatus[status];
  }

  getOrderItemStatus(status: "PENDING" | "IN_STOCK" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELED" | "REFUNDED" | "RETURNED"): string {
    return OrderItemStatus[status];
  }

}
