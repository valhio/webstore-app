import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart = new BehaviorSubject<Cart>({ items: [] });

  constructor(private _snackBar: MatSnackBar) {}

  addToCart(item: CartItem): void {
    const cart = this.cart.getValue();
    const index = cart.items.findIndex((i) => i.id === item.id);

    if (index) {
      cart.items.push(item);
    } else {
      cart.items[index].quantity += 1;
    }

    this.cart.next(cart);
    this._snackBar.open(`${item.name} added to cart.`, 'Close', {
      duration: 3000,
    });
  }

  getTotal(items: CartItem[]): number {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  onClearCart(): void {
    console.log('asd');

    this.cart.next({ items: [] });
  }

  removeFromCart(item: CartItem) {
    const filtered = this.cart.getValue().items.filter((i) => i.id !== item.id);
    this.cart.next({ items: filtered });

    this._snackBar.open(`${item.name} removed from cart.`, 'Close', {
      duration: 3000,
    });
  }

  removeQuantity(item: CartItem) {
    const cart = this.cart.getValue();
    const index = cart.items.findIndex((i) => i.id === item.id);

    if (index !== -1) {
      cart.items[index].quantity -= 1;
    }

    if (cart.items[index].quantity > 0) {
      this.cart.next(cart);
      this._snackBar.open(`${item.name} quantity decremented.`, 'Close', {
        duration: 3000,
      });
    } else {
      this.removeFromCart(item);
    }
  }
}
