import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartService } from 'src/app/services/cart.service';

import { CartComponent } from './cart.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

fdescribe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: CartService;
  let http: HttpClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CartComponent],
      providers: [ {
        provide: CartService,
        useValue: { cart: { subscribe: () => { } }, getTotal: () => { }, clearCart: () => { }, removeFromCart: () => { }, addToCart: () => { }, removeQuantity: () => { } }
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpClient);
    cartService = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should subscribe to cartService.cart', () => {
      spyOn(cartService.cart, 'subscribe');
      component.ngOnInit();
      expect(cartService.cart.subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTotal()', () => {
    it('should call cartService.getTotal()', () => {
      spyOn(cartService, 'getTotal');
      component.getTotal([]);
      expect(cartService.getTotal).toHaveBeenCalledTimes(1);
    });
  });

  describe('onClearCart()', () => {
    it('should call cartService.clearCart()', () => {
      spyOn(cartService, 'clearCart');
      component.onClearCart();
      expect(cartService.clearCart).toHaveBeenCalledTimes(1);
    });
  });

  describe('onRemoveFromCart()', () => {
    it('should call cartService.removeFromCart()', () => {
      spyOn(cartService, 'removeFromCart');
      component.onRemoveFromCart({} as any);
      expect(cartService.removeFromCart).toHaveBeenCalledTimes(1);
    });
  });

  describe('onAddQuantity()', () => {
    it('should call cartService.addToCart()', () => {
      spyOn(cartService, 'addToCart');
      component.onAddQuantity({} as any);
      expect(cartService.addToCart).toHaveBeenCalledTimes(1);
    });
  });

  describe('onRemoveQuantity()', () => {
    it('should call cartService.removeQuantity()', () => {
      spyOn(cartService, 'removeQuantity');
      component.onRemoveQuantity({} as any);
      expect(cartService.removeQuantity).toHaveBeenCalledTimes(1);
    });
  });

});
