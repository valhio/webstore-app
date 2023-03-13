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
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';

enum PaymentMethods {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  CASH = 'cash',
}

@Component({
  selector: 'app-checkout-body',
  templateUrl: './checkout-body.component.html',
  styleUrls: ['./checkout-body.component.scss'],
})
export class CheckoutBodyComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  payment = PaymentMethods;
  orderForm: FormGroup;
  cart: Cart = { items: [] };
  dataSource: CartItem[] = [];
  deliveryFee: number = 7;

  constructor(
    private cartService: CartService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService
  ) {
    this.orderForm = this.fb.group({
      userId: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      notes: [''],
      orderItems: [''],
      paymentMethod: [this.payment.CASH],
      productsTotal: [0, [Validators.required]],
      deliveryFee: [this.deliveryFee, [Validators.required]],
      totalAmount: [
        this.getTotal(this.dataSource) + this.deliveryFee,
        [Validators.required],
      ],
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.cartService.cart.subscribe({
        next: (cart) => {
          this.cart = cart;
          this.dataSource = cart.items;
          let productsTotal = this.getTotal(this.dataSource);
          this.orderForm.patchValue({
            productsTotal: productsTotal,
            totalAmount: productsTotal + this.deliveryFee,
            orderItems: this.dataSource.map(item => {
              return {
                productId: item.id,
                quantity: item.quantity,
                pricePerItem: item.price,
              }
            }),
          });
        },
      })
    );
  }

  getTotal(items: CartItem[]): number {
    return this.cartService.getTotal(items);
  }

  onCheckout(): void {
    this.cartService.checkout();
  }

  onPlaceOrder(): void {
    this.subscriptions.push(
      this.authenticationService.getUser().subscribe({
        next: (user) => {
          this.orderForm.patchValue({
            userId: user.userId || null,
            discount: 0
          });
          this.cartService.placeOrder(this.orderForm.value);
        },
        error: (err) => {
          console.log(err.message);
        }
      })
    );
  }

  notImplementedYet() {
    this._snackBar.open('Not implemented yet', 'Close', {
      duration: 3000,
    });
  }

  addChildForm(name: string, group: FormGroup) {
    this.orderForm.addControl(name, group);
  }
}
