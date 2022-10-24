import { Inject, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
// import {AngularFirestore} from '@angular/fire/firestore'
import { environment } from '../../environments/environment';
import { AngularFireFunctions as Functions } from '@angular/fire/compat/functions';

declare var Stripe: (arg0: string) => any;

@Injectable({
  providedIn: 'root',
})
export class CartService implements OnInit {
  cart = new BehaviorSubject<Cart>({ items: [] });
  stripeStatus: string;

  constructor(
    private _snackBar: MatSnackBar,
    private afFun: Functions,
    // @Inject(Functions) private afFun: Functions,
    ) {
      // If statement needs to stay, otherwise the header breaks
      if (localStorage.getItem('cart')) {
        this.cart.next(JSON.parse(localStorage.getItem('cart') || '{}'));
      }
      // afFun.useEmulator('localhost', 5001);
      this.stripeStatus='';
    }
    
  ngOnInit(): void {}

  addToCart(item: CartItem): void {
    const cart = this.cart.getValue();
    const index = cart.items.findIndex((i) => i.id === item.id);

    if (index) {
      cart.items.push(item);
    } else {
      cart.items[index].quantity += 1;
    }

    this.cart.next(cart);
    this.syncItems();
    this._snackBar.open(`${item.name} added to cart.`, 'Close', {
      duration: 3000,
    });
  }

  getTotal(items: CartItem[]): number {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  clearCart(): void {
    this.cart.next({ items: [] });
    this.syncItems();
  }

  removeFromCart(item: CartItem) {
    const filtered = this.cart.getValue().items.filter((i) => i.id !== item.id);
    this.cart.next({ items: filtered });
    this.syncItems();
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
      this.syncItems();
      this._snackBar.open(`${item.name} quantity decremented.`, 'Close', {
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


    // let stripe = await loadStripe(
    //   'pk_test_51LuaOkB6gdK47cnCd6CKPCxYdW6DDHpDGEgdxymUIircc0PkOQmVF55FFXvjmJgVPG6bXgqv9OZaJJ3ZRrsh48Ts00xHAHqNYv'
    // );    
    // const checkout = httpsCallable(this.functions, 'createStripeCheckoutSession');
    // console.log(this.cart.getValue());
    
    // const res: any = await checkout({ items: 'asd' });
    // console.log('res- '+res);
    
    // stripe?.redirectToCheckout({ sessionId: res.data.id });
  }

  placeOrder(): void {
    this._snackBar.open('Order placed successfully.', 'Close', {
      duration: 3000,
    });
    this.clearCart();
    localStorage.removeItem('cart');
  }

  syncItems(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart.getValue()));
  }
}
