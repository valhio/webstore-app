import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { Subscription, map, tap } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { PaymentMethod } from '../../../enum/payment-method.enum';
import { log } from 'console';

@Component({
  selector: 'app-checkout-body',
  templateUrl: './checkout-body.component.html',
  styleUrls: ['./checkout-body.component.scss'],
})
export class CheckoutBodyComponent implements OnDestroy {

  private subscriptions: Subscription[] = [];
  public paymentMethod: typeof PaymentMethod = PaymentMethod;
  orderForm: FormGroup;
  deliveryFee: number = 7;
  PaymentMethod: any;

  cart$ = this.cartService.getCart().pipe(
    tap((cart) => {
      const total = this.getTotal(cart.items);
      this.orderForm.patchValue({
        productsTotal: total,
        totalAmount: total + this.deliveryFee,
        orderItems: cart.items.map((item) => ({
          productId: item.id, productName: item.name, quantity: item.quantity, pricePerItem: item.price,
        })),
      });
    }),
  )


  constructor(
    private cartService: CartService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService
  ) {
    this.orderForm = this.fb.group({
      userId: [null],
      firstName: ['Valentin', [Validators.required]],
      lastName: ['Gerasimov', [Validators.required]],
      email: ['booyaa323@gmail.com', [Validators.required]],
      phone: ['0876994321', [Validators.required]],
      address: ['jk. Druzhba 1, blok 48, vhod A', [Validators.required]],
      city: ['Sofia', [Validators.required]],
      country: ['Bulgaria'],
      zipCode: ['1000', [Validators.required]],
      notes: [''],
      orderItems: [''],
      paymentMethod: [PaymentMethod.CASH_PAYMENT],
      productsTotal: [0, [Validators.required]],
      deliveryFee: [this.deliveryFee, [Validators.required]],
      totalAmount: [[Validators.required]],
      discount: [0, [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getTotal(items: CartItem[]): number {
    return this.cartService.getTotal(items);
  }

  onCheckout(): void { // This is for card payment
    this.cartService.checkout();
  }

  onPlaceOrder(): void { // This is for cash payment
    this.subscriptions.push(
      this.authenticationService.getUser().subscribe({
        next: (user) => {
          this.orderForm.patchValue({
            userId: user.userId || null,
            totalAmount: this.orderForm.get('productsTotal')?.value + this.deliveryFee,
          });
          this.cartService.placeOrder(this.orderForm.value);
        },
        error: (err) => {
          console.log(err.message);
        }
      })
    );
  }

  notImplementedYet() { // This is for paypal payment
    this._snackBar.open('Not implemented yet', 'Close', {
      duration: 3000,
    });
  }
}
