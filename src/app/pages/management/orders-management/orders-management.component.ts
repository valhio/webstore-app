import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { ManagementService } from '../../../services/management.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceDialogComponent } from '../../home/components/orders/invoice-dialog/invoice-dialog.component';

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
    } );
  }

}
