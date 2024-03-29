import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
import { AngularFireFunctions as Functions } from '@angular/fire/compat/functions';
import { Router } from '@angular/router';
import { StoreService } from './store.service';

declare var Stripe: (arg0: string) => any;

@Injectable({
  providedIn: 'root',
})
export class CartService implements OnDestroy {
  cart = new BehaviorSubject<Cart>({ items: [] });
  storeService: StoreService;
  private subscriptions: Subscription[] = [];

  constructor(
    private _snackBar: MatSnackBar,
    private afFun: Functions,
    private router: Router,
    storeService: StoreService
  ) {
    this.storeService = storeService;
    let cart = localStorage.getItem('cart');
    if (cart) {
      // This is a security measure to prevent users from adding invalid items to the cart
      JSON.parse(cart).items.forEach((item: CartItem) => {
        this.subscriptions.push(
          storeService.findProductById(item.id).subscribe((res) => {
            let newCart = this.cart.getValue();
            res.quantity = item.quantity; // Set the quantity of the cart product to the quantity of the localStorage's product quantity
            newCart.items.push(res); // Push the item to the cart
            this.cart.next(newCart)
          })
        );
      });
    }
    // afFun.useEmulator('localhost', 5001); // Funciton deployment emulator
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getCart(): Observable<Cart> {
    return this.cart.asObservable();
  }

  addToCart(item: CartItem): void {
    const cart = this.cart.getValue();
    const index = cart.items.findIndex((i) => i.id == item.id);

    if (index !== -1) {
      cart.items[index].quantity += 1;
    } else {
      cart.items.push(item);
    }

    this.cart.next(cart);
    this.syncLocalStorageCart();
    this._snackBar.open(`${ item.name } added to cart.`, 'Close', {
      duration: 3000,
      panelClass: ['custom-snack-bar'],
    });
  }

  getTotal(items: CartItem[]): number {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  clearCart(): void {
    localStorage.removeItem('cart');
    this.cart.next({ items: [] });
    this.syncLocalStorageCart();
  }

  removeFromCart(item: CartItem) {
    const filtered = this.cart.getValue().items.filter((i) => i.id !== item.id);
    this.cart.next({ items: filtered });
    this.syncLocalStorageCart();
    this._snackBar.open(`${ item.name } removed from cart.`, 'Close', {
      duration: 3000,
      panelClass: ['custom-snack-bar'],
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
      this.syncLocalStorageCart();
      this._snackBar.open(`${ item.name } x1 removed from cart.`, 'Close', {
        duration: 3000,
        panelClass: ['custom-snack-bar'],
      });
    } else {
      this.removeFromCart(item);
    }
  }

  async checkout() {
    var stripe = Stripe(environment.stripePublicKey);
    this.subscriptions.push(
      this.afFun
        .httpsCallable('stripeCheckoutSession')({
          items: this.cart.getValue().items,
        })
        .subscribe((res: any) => {
          stripe.redirectToCheckout({ sessionId: res });
        })
    )
  }

  placeOrder(order: any): void {
    this.subscriptions.push(
      this.storeService.placeOrder(order).subscribe(
        {
          next: (res) => {
            this._snackBar.open('Order placed successfully.', 'Close', {
              duration: 3000,
              panelClass: ['custom-snack-bar'],
            });
            this.router.navigate(['/payment/status'], {
              queryParams: { action: 'success' },
            });
            this.clearCart();
            localStorage.removeItem('cart');
          },
          error: (err) => {
            this._snackBar.open('Failed to place order.', 'Close', {
              duration: 3000,
              panelClass: ['custom-snack-bar'],
            });
            this.router.navigate(['/payment/status'], {
              queryParams: { action: 'cancel' },
            });
          }
        }
      )
    );
  }

  syncLocalStorageCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart.getValue()));
  }
}
