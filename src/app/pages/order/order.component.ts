import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { OrderItemStatus } from '../../enum/order-item-status.enum ';
import { PaymentMethod } from 'src/app/enum/payment-method.enum';
import { OrderStatus } from 'src/app/enum/order-status.enum';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  public paymentMethod: typeof PaymentMethod = PaymentMethod;
  public orderItemStatus: typeof OrderItemStatus = OrderItemStatus;
  orderId: string = this.route.snapshot.params['id'];
  order$ = this.storeService.getOrderByOrderId(this.orderId);

  constructor(private route: ActivatedRoute, private storeService: StoreService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params['id']);
    });

    this.route.paramMap.subscribe(params => {
      console.log(params.get('id'));
    });

    console.log(this.route.snapshot.params['id']);
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
        response = 'Item in stock';
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

  getOrderItemStatusIndex(status: 'PENDING' | 'IN_STOCK' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELED' | 'REFUNDED' | 'RETURNED'): number {
    return Object.keys(OrderItemStatus).indexOf(status);
  }

  isMoreThanOrEqualTo(index: number, number: number) {
    return index >= number;
  }

  getOrderItemStatusEnum(status: 'PENDING' | 'IN_STOCK' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELED' | 'REFUNDED' | 'RETURNED'): string {
    return OrderItemStatus[status];
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

  getOrderStatusEnum(status: 'ORDER_PLACED' | 'PENDING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELED' | 'REFUNDED' | 'RETURNED'): string {
    return OrderStatus[status];
  }
}
