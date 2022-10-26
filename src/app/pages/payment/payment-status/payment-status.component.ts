import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.scss']
})
export class PaymentStatusComponent implements OnInit {

  stripeStatus: string;

  constructor(private activatedRoute: ActivatedRoute, private cartService: CartService) {
    // this.stripeStatus='';
    this.stripeStatus = this.getStripeStatus();
    if(this.stripeStatus === 'success') {
      this.cartService.clearCart()
    }
   }

  ngOnInit(): void {
  }

  getStripeStatus(): string {
    let action = this.activatedRoute.snapshot.queryParamMap.get('action');
    if(action && (action === 'success' || action === 'failure' || action === 'canceled')) {
      return action;
    }
    return '';
  }

}
