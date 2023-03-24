import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart.service';

import { CheckoutBodyComponent } from './checkout-body.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Cart, CartItem } from 'src/app/models/cart.model';

describe('CheckoutBodyComponent', () => {
  let component: CheckoutBodyComponent;
  let fixture: ComponentFixture<CheckoutBodyComponent>;
  let cartService: jasmine.SpyObj<CartService>;
  let authenticationService: AuthenticationService;
  let snackBar: MatSnackBar;
  let mockCart: Cart;
  const mockCartTotal = 300;

  beforeEach(async () => {
    mockCart = {
      items: [
        { id: 1, name: 'test', price: 100, quantity: 1 } as CartItem,
        { id: 2, name: 'test2', price: 100, quantity: 2 } as CartItem
      ]
    };

    TestBed.configureTestingModule({
      declarations: [CheckoutBodyComponent],
      providers: [
        { provide: CartService, useValue: jasmine.createSpyObj('CartService', ['getCart', 'getTotal', 'checkout', 'placeOrder']) },
        { provide: AuthenticationService, useValue: { getUser: () => { userId: "1" } } },
        { provide: MatSnackBar, useValue: snackBar },
        FormBuilder,
      ],
    });

    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    authenticationService = TestBed.inject(AuthenticationService);
    snackBar = TestBed.inject(MatSnackBar);

    cartService.getCart.and.returnValue(of(mockCart));
    cartService.getTotal.and.returnValue(mockCartTotal);
    cartService.placeOrder.and.callThrough()

    fixture = TestBed.createComponent(CheckoutBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch cart data on component initialization', () => {
    expect(component.cart$).toBeTruthy();
    expect(component.cart$).toBeInstanceOf(Observable);
    expect(cartService.getCart).toHaveBeenCalledTimes(1);

    component.cart$?.subscribe((cart) => {
      expect(cart).toBeTruthy();
      expect(cart).toEqual(mockCart);
      expect(cart.items.length).toBe(2);
      expect(cart.items[0].id).toBe(mockCart.items[0].id);
    });
  });

  it('should get the cart and update the form when initialized', () => {
    const expectedTotalAmount = mockCartTotal + component.deliveryFee;

    component.cart$.subscribe((cart) => { // This is needed so that the cart$ observable is subscribed to and the form is updated
      expect(cart).toBeTruthy();
      expect(cart).toEqual(mockCart);
      expect(cart.items.length).toBe(2);
      expect(cart.items[0].id).toBe(mockCart.items[0].id);
    });

    expect(cartService.getCart).toHaveBeenCalled();
    expect(component.orderForm.get('productsTotal')?.value).toEqual(mockCartTotal);
    expect(component.orderForm.get('totalAmount')?.value).toEqual(expectedTotalAmount);
    expect(component.orderForm.get('orderItems')?.value[0].productId).toEqual(mockCart.items[0].id);
  });

  it('should unsubscribe from all subscriptions when destroyed', () => {
    // Create some mock subscriptions
    const sub1 = of('sub1').subscribe();
    const sub2 = of('sub2').subscribe();
    const spySub1 = spyOn(sub1, 'unsubscribe');
    const spySub2 = spyOn(sub2, 'unsubscribe');
    component['subscriptions'] = [sub1, sub2];

    // Call ngOnDestroy
    component.ngOnDestroy();

    // Expect all subscriptions to have been unsubscribed
    expect(spySub1).toHaveBeenCalledTimes(1);
    expect(spySub2).toHaveBeenCalledTimes(1);
  });

  it('should get the total amount of the products', () => {
    expect(component.getTotal(mockCart.items)).toEqual(mockCartTotal);
  });

  it('should call cartService checkout method when form is submitted', () => {
    component.onCheckout();

    expect(cartService.checkout).toHaveBeenCalledTimes(1);
  });

  it('should place the order when form is submitted', () => {
    spyOn(authenticationService, 'getUser').and.returnValue(of({ userId: "1" }) as any);
    
    let mockOrder = {
      userId: "1",
      firstName: "test",
      lastName: "test",
      email: "test@test",
      address: "test",
      city: "test",
      zipCode: "test",
      country: "test",
      phone: "test",
      paymentMethod: "test",
      totalAmount: mockCartTotal + component.deliveryFee,
      notes: "test",
      deliveryFee: component.deliveryFee,
      discount: 0,
      productsTotal: mockCartTotal,
      orderItems: [
        { id: 1, productId: 1, quantity: 1 },
        { id: 2, productId: 2, quantity: 2 }
      ],
    }

    component.orderForm.setValue(mockOrder);
    component.onPlaceOrder();

    expect(authenticationService.getUser).toHaveBeenCalledTimes(1);
    expect(cartService.placeOrder).toHaveBeenCalledTimes(1);
    expect(cartService.placeOrder).toHaveBeenCalledWith(mockOrder);
    expect(component.orderForm.valid).toBeTrue();
    expect(component.orderForm.get('userId')?.value).toEqual(mockOrder.userId);
  });

});
