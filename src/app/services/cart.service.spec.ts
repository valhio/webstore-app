import { TestBed } from '@angular/core/testing';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CartItem } from '../models/cart.model';

import { CartService } from './cart.service';
import { StoreService } from './store.service';
import { ApiResponse } from '../interface/api-response';

describe('CartService', () => {
  let service: CartService;
  let mockSnackBar: MatSnackBar;
  let mockAfFun: AngularFireFunctions;
  let mockRouter: Router;
  let mockStoreService: StoreService;

  beforeEach(() => {
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockAfFun = jasmine.createSpyObj('AngularFireFunctions', ['httpsCallable']);
    // mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({

      providers: [
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: AngularFireFunctions, useValue: mockAfFun },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }, // Can replace useValue object with the commented out mockRouter object above 
        { provide: StoreService, useValue: { findProductById: () => of({}), placeOrder: () => { }, subscribe: () => { } } }
      ]

    });
    service = TestBed.inject(CartService);
    mockStoreService = TestBed.inject(StoreService);
    mockRouter = TestBed.inject(Router);

    var localStorage = window.localStorage;
    spyOn(localStorage, 'getItem').and.callFake(function (key) {
      return JSON.stringify({ items: [] });
    });

    spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
      return JSON.stringify({ items: [] });
    });
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('ngOnDestroy()', () => {
    it('should unsubscribe from all subscriptions', () => {
      // Create some mock subscriptions
      const sub1 = of('sub1').subscribe();
      const sub2 = of('sub2').subscribe();
      const spySub1 = spyOn(sub1, 'unsubscribe');
      const spySub2 = spyOn(sub2, 'unsubscribe');
      service['subscriptions'] = [sub1, sub2];

      // Call ngOnDestroy
      service.ngOnDestroy();

      // Expect all subscriptions to have been unsubscribed
      expect(spySub1).toHaveBeenCalledTimes(1);
      expect(spySub2).toHaveBeenCalledTimes(1);
    });
  });

  describe('addToCart()', () => {
    const item: CartItem = { id: 1, name: 'item1', price: 1, quantity: 1, description: 'item1', imageUrl: 'item1', category: 'item1' };

    it('should add a new item to the cart', () => {
      const expectedCart = { items: [item] };

      service.addToCart(item);

      expect(service.cart.getValue()).toEqual(expectedCart);
      expect(service.cart.getValue().items).toContain(item);
    });

    it('should increment the quantity of an existing item in the cart', () => {
      const expectedCart = { items: [item] };
      service.cart.next(expectedCart);

      service.addToCart(item);

      expect(service.cart.getValue()).toEqual(expectedCart);
      expect(service.cart.getValue().items).toContain(item);
      expect(service.cart.getValue().items[0].quantity).toEqual(2);
    });

    it('should update the cart in local storage', () => {
      spyOn(service, 'syncLocalStorageCart').and.callThrough();

      service.addToCart(item);

      expect(service['syncLocalStorageCart']).toHaveBeenCalledTimes(1)
    });
  });

  describe('removeFromCart()', () => {
    const item: CartItem = { id: 1, name: 'item1', price: 1, quantity: 1, description: 'item1', imageUrl: 'item1', category: 'item1' };

    it('should remove an item from the cart', () => {
      const expectedCart = { items: [] };
      service.cart.next({ items: [item] });

      service.removeFromCart(item);

      expect(service.cart.getValue()).toEqual(expectedCart);
    });

    it('should update the cart in local storage', () => {
      spyOn(service, 'syncLocalStorageCart').and.callThrough();

      service.removeFromCart(item);

      expect(service['syncLocalStorageCart']).toHaveBeenCalledTimes(1)
    });
  });

  describe('updateQuantity()', () => {
    const mockItem: CartItem = { id: 1, name: 'item1', price: 1, quantity: 1, description: 'item1', imageUrl: 'item1', category: 'item1' };

    it('should decrement the quantity of the passed product', () => {
      let item = { ...mockItem, quantity: 2 };
      const expectedItem = { ...mockItem, quantity: 1 };
      const expectedCart = { items: [expectedItem] };
      service.cart.next({ items: [item] });

      service.removeQuantity(item);

      expect(service.cart.getValue()).toEqual(expectedCart);
      expect(service.cart.getValue().items[0].quantity).toEqual(1);
    });

    it('should remove the product from the cart if the quantity is 0 after decrementing', () => {
      const expectedCart = { items: [] };
      let item = Object.create(mockItem)
      service.cart.next({ items: [item] });

      service.removeQuantity(item);

      expect(service.cart.getValue()).toEqual(expectedCart);
    });
  });

  describe('getTotal()', () => {
    it('should return the total price of all items in the cart', () => {
      const mockItem1: CartItem = { id: 1, name: 'item1', price: 1, quantity: 1, description: 'item1', imageUrl: 'item1', category: 'item1' };
      const mockItem2: CartItem = { id: 2, name: 'item2', price: 2, quantity: 2, description: 'item2', imageUrl: 'item2', category: 'item2' };
      service.cart.next({ items: [mockItem1, mockItem2] });

      const total = service.getTotal(service.cart.getValue().items);

      expect(total).toEqual((mockItem1.price * mockItem1.quantity) + (mockItem2.price * mockItem2.quantity));
    });
  });

  describe('clearCart()', () => {
    it('should clear the cart', () => {
      const expectedCart = { items: [] };
      service.cart.next({ items: [{ id: 1, name: 'item1', price: 1, quantity: 1, description: 'item1', imageUrl: 'item1', category: 'item1' }] });

      service.clearCart();

      expect(service.cart.getValue()).toEqual(expectedCart);
    });

    it('should update the cart in local storage', () => {
      spyOn(service, 'syncLocalStorageCart').and.callThrough();

      service.clearCart();

      expect(service['syncLocalStorageCart']).toHaveBeenCalledTimes(1)
    });
  });

  describe('placeOrder()', () => {
    it('should place order successfully, navigate to payment status page with success action, clear the cart and clear localStorage', () => {
      const order = {};
      spyOn(mockStoreService, 'placeOrder').and.returnValue(of({ data: 'foo' } as ApiResponse<any>));
      spyOn(service, 'clearCart').and.callThrough();
      spyOn(localStorage, 'removeItem').and.callThrough();

      service.placeOrder(order);

      expect(mockStoreService.placeOrder).toHaveBeenCalledWith(order);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/payment/status'], {
        queryParams: { action: 'success' },
      });
      expect(service.clearCart).toHaveBeenCalled();
      expect(localStorage.removeItem).toHaveBeenCalledWith('cart');
    });

    it('should throw error when placing order, navigate to payment status page with cancel action, clear the cart and clear localStorage', () => {
      const order = {};
      spyOn(mockStoreService, 'placeOrder').and.callFake(() => {
        return throwError(() => new Error('test'))
      });

      service.placeOrder(order);

      expect(mockStoreService.placeOrder).toHaveBeenCalledWith(order);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/payment/status'], {
        queryParams: { action: 'cancel' },
      });
      spyOn(service, 'clearCart').and.callThrough();
      spyOn(localStorage, 'removeItem').and.callThrough();
    });
  });

  describe('syncLocalStorageCart()', () => {
    it('should update the cart in local storage', () => {
      const item = { id: 1, name: 'item1', price: 1, quantity: 1, description: 'item1', imageUrl: 'item1', category: 'item1' };
      const expectedCart = { items: [item] };
      service.cart.next({ items: [item] });

      service.syncLocalStorageCart();

      expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify(expectedCart));
    });
  });

});