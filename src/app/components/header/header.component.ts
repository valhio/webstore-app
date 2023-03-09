import { Component, Input, OnInit } from '@angular/core';
import { Cart } from 'src/app/models/cart.model';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private _cart: Cart = { items: [] };

  @Input()
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart) {
    this._cart = cart;
  }

  constructor(private cartService: CartService, private authenticationService: AuthenticationService) { }

  getTotal(items: CartItem[]): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  getItemsQuantity(): number {
    return this.cart.items
      .map((item) => item.quantity)
      .reduce((acc, curent) => acc + curent, 0);
  }

  onCheckout(): void {
    this.cartService.checkout();
  }

  onLogout(): void {    
    this.authenticationService.logout()
  }

  isAuthenticated(): boolean {
    return this.authenticationService.isAuthenticated();
  }
}
