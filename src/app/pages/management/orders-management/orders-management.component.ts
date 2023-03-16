import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { ManagementService } from '../../../services/management.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceDialogComponent } from '../../home/components/orders/invoice-dialog/invoice-dialog.component';
import { OrderStatus } from '../../../enum/order-status.enum';
import { OrderItemStatus } from '../../../enum/order-item-status.enum ';

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
    this.dialog.open(InvoiceDialogComponent, {
      data: order,
      maxHeight: '90vh',
    });
  }

  getOrderStatus(status: "PENDING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELED" | "REFUNDED" | "RETURNED"): string {
    return OrderStatus[status];
  }

  getOrderItemStatus(status: "PENDING" | "IN_STOCK" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELED" | "REFUNDED" | "RETURNED"): string {
    return OrderItemStatus[status];
  }

}
