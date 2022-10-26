import { Component, OnInit } from '@angular/core';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-checkout-body',
  templateUrl: './checkout-body.component.html',
  styleUrls: ['./checkout-body.component.scss']
})
export class CheckoutBodyComponent implements OnInit {
  isCardPaymentSelected: boolean = false;
  isPayPalSelected: boolean = false;
  cart: Cart = { items: [] };
  dataSource: CartItem[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });
  }

  getTotal(items: CartItem[]): number {
    return this.cartService.getTotal(items);
  }

  onCheckout(): void {
    this.cartService.checkout();
  }

  onPlaceOrder(): void {
    this.cartService.placeOrder();
  }

}
