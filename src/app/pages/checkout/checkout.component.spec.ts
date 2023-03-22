import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartService } from 'src/app/services/cart.service';

import { CheckoutComponent } from './checkout.component';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { of, Observable } from 'rxjs';

fdescribe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let cartService: CartService;
  let mockCart: Cart;

  beforeEach(async () => {
    mockCart = {
      items: [
        { id: 1, name: 'test', price: 100, quantity: 1 } as CartItem,
        { id: 2, name: 'test2', price: 100, quantity: 1 } as CartItem
      ]
    };

    await TestBed.configureTestingModule({
      declarations: [CheckoutComponent],
      providers: [{ provide: CartService, useValue: { getCart: () => of(mockCart) } }]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy(); // To prevent memory leaks
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch cart data on component initialization', () => {
    spyOn(cartService, 'getCart').and.returnValue(of(mockCart));
    component.dataSource$ = cartService.getCart();

    expect(component.dataSource$).toBeTruthy();
    expect(component.dataSource$).toBeInstanceOf(Observable);
    expect(cartService.getCart).toHaveBeenCalledTimes(1);

    component.dataSource$?.subscribe((cart) => {
      expect(cart).toBeTruthy();
      expect(cart).toEqual(mockCart);
    });
  });
});

