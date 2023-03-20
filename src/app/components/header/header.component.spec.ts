import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AppModule } from 'src/app/app.module';
import { CartItem } from 'src/app/models/cart.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart.service';

import { HeaderComponent } from './header.component';

fdescribe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let cartService: CartService
  let authenticationService: AuthenticationService;

  let cartItem = { id: 1, name: 'Product', price: 50, quantity: 2 } as CartItem;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [AppModule],
      providers: [
        { provide: CartService, useValue: { getTotal: () => 0, clearCart: () => { }, checkout: () => { } } },
        { provide: AuthenticationService, useValue: { logout: () => { }, isAuthenticated: () => false } },
      ]
    })
      .compileComponents();

    cartService = TestBed.inject(CartService);
    authenticationService = TestBed.inject(AuthenticationService);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call cartService.getTotal', () => {
    spyOn(cartService, 'getTotal').and.returnValue(100);
    expect(component.getTotal([cartItem])).toBe(100);
    expect(cartService.getTotal).toHaveBeenCalledWith([cartItem]);
  });

  it('should clear cart', () => {
    spyOn(cartService, 'clearCart');
    component.onClearCart();
    expect(cartService.clearCart).toHaveBeenCalled();
  });

  it('should get items quantity', () => {
    component.cart = { items: [cartItem] };
    expect(component.getItemsQuantity()).toBe(2);
  });

  it('should checkout', () => {
    spyOn(cartService, 'checkout');
    component.onCheckout();
    expect(cartService.checkout).toHaveBeenCalled();
  });

  it('should logout', () => {
    spyOn(authenticationService, 'logout');
    component.onLogout();
    expect(authenticationService.logout).toHaveBeenCalled();
  });

  it('should check if user is authenticated', () => {
    spyOn(authenticationService, 'isAuthenticated').and.returnValue(true);
    expect(component.isAuthenticated()).toBe(true);
    expect(authenticationService.isAuthenticated).toHaveBeenCalled();
  });

});
