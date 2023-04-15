import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ManagementService } from './management.service';

import { StoreService } from './store.service';
import { ApiResponse } from '../interface/api-response';
import { User } from '../models/user';

fdescribe('StoreService', () => {
  let service: StoreService;
  let httpMock: HttpTestingController;

  const product1 = { id: '1', name: 'testname', price: 1.99 };
  const product2 = { id: '2', name: 'testname2', price: 2.99 };
  const products = [product1, product2];

  const STORE_BASE_URL = 'http://localhost:8080/api/v1';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        ManagementService,
      ]
    });
    service = TestBed.inject(StoreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get products', () => {
    service.fetchApiData().subscribe((res: ApiResponse<any>) => {
      expect(res.data.length).toBe(products.length);
      expect(res.data).toEqual(products);
      expect(res.data[0].id).toBe(product1.id);
      expect(res.data[1].id).toBe(product2.id);
    });

    const req = httpMock.expectOne(STORE_BASE_URL + '/products?keyword=&page=0&size=10&sort=asc');
    expect(req.request.method).toBe('GET');
    expect(req.request.url).toBe(STORE_BASE_URL + '/products?keyword=&page=0&size=10&sort=asc');
    req.flush({ data: products } as ApiResponse<any>);
  });

  it('should get products with params', () => {
    service.fetchApiData('keyword', 1, 12, 'name-asc').subscribe((res: ApiResponse<any>) => {
      expect(res.data.length).toBe(products.length);
      expect(res.data).toEqual(products);
      expect(res.data[0].id).toBe(product1.id);
      expect(res.data[1].id).toBe(product2.id);
    });

    const req = httpMock.expectOne(STORE_BASE_URL + '/products?keyword=keyword&page=1&size=12&sort=name-asc');
    expect(req.request.method).toBe('GET');
    expect(req.request.url).toBe(STORE_BASE_URL + '/products?keyword=keyword&page=1&size=12&sort=name-asc');
    req.flush({ data: products } as ApiResponse<any>);
  });

  it('should find product by id', () => {
    service.findProductById(1).subscribe((res: ApiResponse<any>) => {
      expect(res.data).toEqual(product1);
      expect(res.data.id).toBe(product1.id);
    });

    const req = httpMock.expectOne(STORE_BASE_URL + '/products/1');
    expect(req.request.method).toBe('GET');
    expect(req.request.url).toBe(STORE_BASE_URL + '/products/1');
    req.flush({ data: product1 } as ApiResponse<any>);
  });

  it('should place order', () => {
    const order = { id: 1, name: 'testname', total: 1.99 };
    service.placeOrder(order).subscribe((res: ApiResponse<any>) => {
      expect(res.data).toEqual(order);
      expect(res.data.id).toBe(order.id);
    });

    const req = httpMock.expectOne(STORE_BASE_URL + '/orders/new');
    expect(req.request.method).toBe('POST');
    expect(req.request.url).toBe(STORE_BASE_URL + '/orders/new');
    req.flush({ data: order } as ApiResponse<any>);
  });

  it('should get orders for user', () => {
    const user = { id: "1", name: 'testname', email: 'test@test.com' };
    const order1 = { id: 1, name: 'testname', total: 1.99 };
    const order2 = { id: 2, name: 'testname2', total: 2.99 };
    const orders = [order1, order2];

    service.getOrdersForUser(user.id).subscribe((res) => {
      expect(res.length).toBe(orders.length);
      expect(res).toEqual(orders);
      expect(res[0].id).toBe(order1.id);
      expect(res[1].id).toBe(order2.id);
    });

    const req = httpMock.expectOne(STORE_BASE_URL + '/orders/user/' + user.id);
    expect(req.request.method).toBe('GET');
    expect(req.request.url).toBe(STORE_BASE_URL + '/orders/user/' + user.id);
    req.flush(orders);
  });

  it('should get order by order id', () => {
    const order = { id: "1", name: 'testname', total: 1.99 };

    service.getOrderByOrderId(order.id).subscribe((res) => {
      expect(res).toEqual(order);
      expect(res.id).toBe(order.id);
    });

    const req = httpMock.expectOne(STORE_BASE_URL + '/orders/' + order.id);
    expect(req.request.method).toBe('GET');
    expect(req.request.url).toBe(STORE_BASE_URL + '/orders/' + order.id);
    req.flush(order);
  });

  it('should get product by product id', () => {
    service.getProductByProductId(product1.id).subscribe((res) => {
      expect(res).toEqual(product1);
      expect(res.id).toBe(product1.id);
    });

    const req = httpMock.expectOne(STORE_BASE_URL + '/products/' + product1.id);
    expect(req.request.method).toBe('GET');
    expect(req.request.url).toBe(STORE_BASE_URL + '/products/' + product1.id);
    req.flush(product1);
  });

  it('should update order status', () => {
    const order = { id: "1", name: 'testname', total: 1.99, status: 'RECEIVED' };
    const expectedOrder = { id: "1", name: 'testname', total: 1.99, status: 'SHIPPED' };

    service.updateOrderStatus(order.id, expectedOrder.status).subscribe((res) => {
      expect(res).toEqual(expectedOrder);
      expect(res.status).toBe(expectedOrder.status);
    });

    const req = httpMock.expectOne(STORE_BASE_URL + '/orders/' + order.id + '/status/' + expectedOrder.status);
    expect(req.request.method).toBe('PUT');
    expect(req.request.url).toBe(STORE_BASE_URL + '/orders/' + order.id + '/status/' + expectedOrder.status);
    req.flush(expectedOrder);
  });

  it('should update order item status', () => {
    const order = { id: "1", name: 'testname', total: 1.99, status: 'RECEIVED' };
    const orderItem = { id: '1', name: 'testname', total: 1.99, status: 'RECEIVED' };
    const expectedOrderItem = { id: '1', name: 'testname', total: 1.99, status: 'SHIPPED' };

    service.updateOrderItemStatus(order.id, orderItem.id, expectedOrderItem.status).subscribe((res) => {
      expect(res).toEqual(expectedOrderItem);
      expect(res.status).toBe(expectedOrderItem.status);
    });

    const req = httpMock.expectOne(STORE_BASE_URL + '/orders/' + order.id + '/orderItem/' + orderItem.id + '/status/' + expectedOrderItem.status);
    expect(req.request.method).toBe('PUT');
    expect(req.request.url).toBe(STORE_BASE_URL + '/orders/' + order.id + '/orderItem/' + orderItem.id + '/status/' + expectedOrderItem.status);
    req.flush(expectedOrderItem);
  });

  it('should fetch user by userId', () => {
    let user = {
      userId: '1',
    } as User;

    service.getUserByUserId(user.userId).subscribe((res) => {
      expect(res).toEqual(user);
      expect(res.userId).toBe(user.userId);
    });

    const req = httpMock.expectOne(STORE_BASE_URL + '/user/1');
    expect(req.request.method).toBe('GET');
    expect(req.request.url).toBe(STORE_BASE_URL + '/user/1');
    req.flush(user);
  });

  describe('updateUserFirstName', () => {
    it('should send a PUT request with the correct URL and body', () => {
      const userId = '1';
      const firstName = 'Foo';

      service.updateUserFirstName(userId, firstName).subscribe(
        (res) => {
          expect(res).toEqual(firstName);
        },
      );

      const req = httpMock.expectOne(`${ STORE_BASE_URL }/user/${ userId }/first-name`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toBe(firstName);
    });
  });

  describe('updateUserLastName', () => {
    it('should send a PUT request with the correct URL and body', () => {
      const userId = '1';
      const lastName = 'Foo';

      service.updateUserLastName(userId, lastName).subscribe();

      const req = httpMock.expectOne(`${ STORE_BASE_URL }/user/${ userId }/last-name`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toBe(lastName);
    });
  });

  describe('updateUserEmail', () => {
    it('should send a PUT request with the correct URL and params', () => {
      const email = "foo@bar"
      const newEmail = "bar@foo"

      service.updateUserEmail(email, newEmail).subscribe();

      const req = httpMock.expectOne(`${ STORE_BASE_URL }/user/update-email?email=${ email }&newEmail=${ newEmail }`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.params.get('email')).toBe(email);
      expect(req.request.params.get('newEmail')).toBe(newEmail);
    });
  });

  describe('updateUserPhone', () => {
    it('should send a PUT request with the correct URL and body', () => {
      const userId = '1';
      const phone = '1234567890';

      service.updateUserPhoneNumber(userId, phone).subscribe();

      const req = httpMock.expectOne(`${ STORE_BASE_URL }/user/${ userId }/phone-number`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toBe(phone);
    });
  });

  describe('updateUserAddress', () => {
    it('should send a PUT request with the correct URL and body', () => {
      const userId = '1';
      const address = '123 Foo St';

      service.updateUserAddress(userId, address).subscribe();

      const req = httpMock.expectOne(`${ STORE_BASE_URL }/user/${ userId }/address`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toBe(address);
    });
  });
  
});
