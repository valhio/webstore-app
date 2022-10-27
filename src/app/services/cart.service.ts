import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
import { AngularFireFunctions as Functions } from '@angular/fire/compat/functions';
import { ActivatedRoute, Router } from '@angular/router';

declare var Stripe: (arg0: string) => any;

@Injectable({
  providedIn: 'root',
})
export class CartService implements OnInit {
  cart = new BehaviorSubject<Cart>({ items: [] });

  constructor(
    private _snackBar: MatSnackBar,
    private afFun: Functions,
    private activatedRoute: ActivatedRoute,
    private router: Router
    ) {
      // If statement needs to stay, otherwise the header breaks
      if (localStorage.getItem('cart')) {
        this.cart.next(JSON.parse(localStorage.getItem('cart') || '{}'));
      }
      // afFun.useEmulator('localhost', 5001);
    }
    
  ngOnInit(): void {}

  addToCart(item: CartItem): void {     
    const cart = this.cart.getValue();
    const index = cart.items.findIndex((i) => i.id == item.id);
    
    if (index!==-1) {
      cart.items[index].quantity += 1;
    } else {            
      cart.items.push(item);
    }

    this.cart.next(cart);
    this.syncItems();
    this._snackBar.open(`${item.title} added to cart.`, 'Close', {
      duration: 3000,
    });
    
  }

  getTotal(items: CartItem[]): number {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  clearCart(): void {
    localStorage.removeItem('cart');
    this.cart.next({ items: [] });
    this.syncItems();
  }

  removeFromCart(item: CartItem) {
    const filtered = this.cart.getValue().items.filter((i) => i.id !== item.id);
    this.cart.next({ items: filtered });
    this.syncItems();
    this._snackBar.open(`${item.title} removed from cart.`, 'Close', {
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
      this.syncItems();
      this._snackBar.open(`${item.title} quantity decremented.`, 'Close', {
        duration: 3000,
      });
    } else {
      this.removeFromCart(item);
    }
  }

  async checkout() {
    var stripe = Stripe(environment.stripePublicKey);
    this.afFun.httpsCallable('stripeCheckoutSession')({items: this.cart.getValue().items}).subscribe((res: any) => {      
      stripe.redirectToCheckout({sessionId: res});
    });
  }

  placeOrder(): void {
    this._snackBar.open('Order placed successfully.', 'Close', {
      duration: 3000,
    });
    this.router.navigate(['/payment/status'],{queryParams: {action: 'success'}});
    this.clearCart();
    localStorage.removeItem('cart');
  }

  syncItems(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart.getValue()));
  }
}
