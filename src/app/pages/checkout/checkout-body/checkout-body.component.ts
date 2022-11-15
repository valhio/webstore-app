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
export class CheckoutBodyComponent implements OnInit {
  payment = PaymentMethods;

  orderForm: FormGroup;
  cart: Cart = { items: [] };
  dataSource: CartItem[] = [];
  deliveryFee: number = 7;

  constructor(
    private cartService: CartService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.orderForm = this.fb.group({
      user: this.fb.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required]],
        phone: ['', [Validators.required]],
      }),
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postCode: ['', [Validators.required]],
      notes: [''],
      products: [''],
      paymentMethod: [this.payment.CASH],
      amount: [0, [Validators.required]],
      deliveryFee: [this.deliveryFee, [Validators.required]],
      total: [
        this.getTotal(this.dataSource) + this.deliveryFee,
        [Validators.required],
      ],
    });
  }

  ngOnInit(): void {
    this.cartService.cart.subscribe({
      next: (cart) => {
        this.cart = cart;
        this.dataSource = cart.items;
        let productsTotal = this.getTotal(this.dataSource);
        this.orderForm.patchValue({
          amount: productsTotal,
          total: productsTotal + this.deliveryFee,
          products: this.dataSource.map((e) => {
            return {
              id: e.id,
            };
          }),
        });
      },
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

  notImplementedYet() {
    this._snackBar.open('Not implemented yet', 'Close', {
      duration: 3000,
    });
  }

  addChildForm(name: string, group: FormGroup) {
    this.orderForm.addControl(name, group);
  }
}
