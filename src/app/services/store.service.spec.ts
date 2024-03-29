import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ManagementService } from './management.service';

import { StoreService } from './store.service';
import { ApiResponse } from '../interface/api-response';
import { User } from '../models/user';
import { Page } from '../interface/page';
import { Product } from '../models/product.model';

describe('StoreService', () => {
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

  afterEach(() => {
    sessionStorage.clear();
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

    service.getOrderById(order.id).subscribe((res) => {
      expect(res).toEqual(order);
      expect(res.id).toBe(order.id);
    });

    const req = httpMock.expectOne(STORE_BASE_URL + '/orders/id/' + order.id);
    expect(req.request.method).toBe('GET');
    expect(req.request.url).toBe(STORE_BASE_URL + '/orders/id/' + order.id);
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
      id: '1',
    } as User;

    service.getUserByUserId(user.id).subscribe((res) => {
      expect(res).toEqual(user);
      expect(res.id).toBe(user.id);
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

  describe('getInvoiceByInvoiceNumber', () => {
    it('should send a GET request with the correct URL and params', () => {
      const invoiceNumber = '1234567890';

      service.getInvoiceByInvoiceNumber(invoiceNumber).subscribe();

      const req = httpMock.expectOne(`${ STORE_BASE_URL }/invoice/${ invoiceNumber }`);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('addToWishlist', () => {
    it('should send a POST request with the correct URL and body', () => {
      const userId = '1';
      const productId = 123;

      service.addToWishlist(productId, userId).subscribe();

      const req = httpMock.expectOne(`${ STORE_BASE_URL }/wishlist/add/${ productId }/${ userId }`);
      expect(req.request.method).toBe('POST');
    });
  })

  it('should get product wishlist status', () => {
    const productId = '123';
    const userId = '456';

    service.getProductWishlistStatus(productId, userId).subscribe(response => {
      expect(response).toBeTruthy();
      expect(response.status).toBe(200);
      expect(response.productId).toBe(productId);
      expect(response.userId).toBe(userId);
    });

    const req = httpMock.expectOne(`${ STORE_BASE_URL }/wishlist/status/${ productId }/${ userId }`);
    expect(req.request.method).toBe('GET');

    req.flush({
      status: 200,
      productId: productId,
      userId: userId
    });
  });

  it('removeFromWishlist', () => {
    const productId = 123;
    const userId = '456';

    service.removeFromWishlist(productId, userId).subscribe(response => {
      expect(response).toBeTruthy();
      expect(response.status).toBe(200);
      expect(response.productId).toBe(productId);
      expect(response.userId).toBe(userId);
    });

    const req = httpMock.expectOne(`${ STORE_BASE_URL }/wishlist/remove/${ productId }/${ userId }`);
    expect(req.request.method).toBe('DELETE');

    req.flush({
      status: 200,
      productId: productId,
      userId: userId
    });
  });

  it('getWishlistedProducts', () => {
    const userId = '456';

    service.getWishlistedProducts(userId).subscribe(response => {
      expect(response).toBeTruthy();
      expect(response.status).toBe(200);
      expect(response.userId).toBe(userId);
      expect(response.products.length).toBe(2);
      expect(response.products[0].productId).toBe(123);
      expect(response.products[1].productId).toBe(456);
    });

    const req = httpMock.expectOne(`${ STORE_BASE_URL }/wishlist/all/${ userId }`);
    expect(req.request.method).toBe('GET');

    req.flush({
      status: 200,
      userId: userId,
      products: [
        {
          productId: 123,
        },
        {
          productId: 456,
        }
      ]
    });
  });

  it('getProductReviewsForProduct() should get', () => {
    const productId = '123';

    service.getProductReviewsForProduct(productId).subscribe(response => {
      expect(response).toBeTruthy();
      expect(response.status).toBe(200);
      expect(response.productId).toBe(productId);
      expect(response.reviews.length).toBe(2);
      expect(response.reviews[0].productId).toBe(123);
      expect(response.reviews[1].productId).toBe(456);
    });

    const req = httpMock.expectOne(`${ STORE_BASE_URL }/product-review/all?productId=${ productId }`);
    expect(req.request.method).toBe('GET');

    req.flush({
      status: 200,
      productId: productId,
      reviews: [
        {
          productId: 123,
        },
        {
          productId: 456,
        }
      ]
    });
  });

  it('addProductReview() should add with POST', () => {
    const productId = '123';
    const userId = '456';
    const rating = 5;
    const title = 'Test Review';
    const reviewText = 'This is a test review.';

    service.addProductReview(productId, userId, rating, title, reviewText).subscribe(response => {
      expect(response).toBeTruthy();
      expect(response.status).toBe(200);
      expect(response.productId).toBe(productId);
      expect(response.userId).toBe(userId);
      expect(response.rating).toBe(rating);
      expect(response.title).toBe(title);
      expect(response.reviewText).toBe(reviewText);
    });

    const req = httpMock.expectOne(`${ STORE_BASE_URL }/product-review/add`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ productId, userId, rating, title, reviewText });

    req.flush({
      status: 200,
      productId: productId,
      userId: userId,
      rating: rating,
      title: title,
      reviewText: reviewText
    });
  });

  describe('likeReview()', () => {
    it('should send a POST request with the correct URL', () => {
      const reviewId = '123';
      const userId = '456';

      service.likeReview(reviewId).subscribe(response => {
        expect(response).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.reviewId).toBe(reviewId);
        expect(response.userId).toBe(userId);
      });

      const req = httpMock.expectOne(`${ STORE_BASE_URL }/product-review/${ reviewId }/like`);
      expect(req.request.method).toBe('POST');
      req.flush({
        status: 200,
        reviewId: reviewId,
        userId: userId
      });
    });
  })

  it('should set and get sort by value from session storage', () => {
    const sortValue = 'name';
    service.setSortBy(sortValue);
    expect(service.getSortBy()).toEqual(sortValue);
  });

  it('should set and get sort direction value from session storage', () => {
    const sortDirection = 'desc';
    service.setSortDirection(sortDirection);
    expect(service.getSortDirection()).toEqual(sortDirection);
  });

  it('should return default sort by value when session storage is empty', () => {
    expect(service.getSortBy()).toEqual('id');
  });

  it('should return default sort direction value when session storage is empty', () => {
    expect(service.getSortDirection()).toEqual('asc');
  });

  // describe('unlikeReview()', () => {
  //   it('should send a DELETE request with the correct URL', () => {
  //     const reviewId = 123;
  //     const userId = '456';

  //     service.unlikeReview(reviewId).subscribe(response => {
  //       expect(response).toBeTruthy();
  //       expect(response.status).toBe(200);
  //       expect(response.reviewId).toBe(reviewId);
  //       expect(response.userId).toBe(userId);
  //     });

  //     const req = httpMock.expectOne(`${ STORE_BASE_URL }/review-like/review/${ reviewId }/vote/remove`);
  //     expect(req.request.method).toBe('DELETE');
  //     req.flush({
  //       status: 200,
  //       reviewId: reviewId,
  //       userId: userId
  //     });
  //   });
  // });

  // describe('hasUserLikedReview()', () => {
  //   it('should send a GET request with the correct URL', () => {
  //     const reviewId = 123;

  //     service.hasUserLikedReview(reviewId).subscribe(response => {
  //       expect(response).toBeTruthy();
  //       expect(response.status).toBe(200);
  //       expect(response.reviewId).toBe(reviewId);
  //       expect(response.hasUserLiked).toBe(true);
  //     });

  //     const req = httpMock.expectOne(`${ STORE_BASE_URL }/review-like/review/${ reviewId }/vote/has-liked`);
  //     expect(req.request.method).toBe('GET');
  //     req.flush({
  //       status: 200,
  //       reviewId: reviewId,
  //       hasUserLiked: true
  //     });
  //   });
  // });

  // describe('getReviewLikes()', () => {
  //   it('should send a GET request with the correct URL', () => {
  //     const reviewId = 123;

  //     service.getReviewLikes(reviewId).subscribe(response => {
  //       expect(response).toBeTruthy();
  //       expect(response.status).toBe(200);
  //       expect(response.reviewId).toBe(reviewId);
  //       expect(response.likes).toBe(5);
  //     });

  //     const req = httpMock.expectOne(`${ STORE_BASE_URL }/review-like/review/${ reviewId }/all`);
  //     expect(req.request.method).toBe('GET');
  //     req.flush({
  //       status: 200,
  //       reviewId: reviewId,
  //       likes: 5
  //     });
  //   });
  // });
});




// Some more tests for the StoreService
describe('StoreService', () => {
  let service: StoreService;
  let httpMock: HttpTestingController;

  const STORE_BASE_URL = 'http://localhost:8080/api/v1';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StoreService],
    });
    service = TestBed.inject(StoreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch API data with default parameters', () => {
    const keyword = '';
    const page = 0;
    const size = 10;
    const sort = 'asc';
    const expectedUrl = `${STORE_BASE_URL}/products?keyword=${keyword}&page=${page}&size=${size}&sort=${sort}`;
    const expectedResponse: ApiResponse<Page<Product[]>> = {
      data: {
        content: [],
        totalPages: 0,
        totalElements: 0,
        number: 0,
        size: 10,
        pageable: {
          sort: {
            empty: false,
            sorted: false,
            unsorted: false
          },
          offset: 0,
          pageNumber: 0,
          pageSize: 0,
          paged: false,
          unpaged: false
        },
        last: false,
        sort: {
          empty: false,
          sorted: false,
          unsorted: false
        },
        numberOfElements: 0,
        first: false,
        empty: false
      },
      timeStamp: '',
      statusCode: 0,
      status: '',
      message: ''
    };

    service.fetchApiData().subscribe((res) => {
      expect(res).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  it('should fetch API data with custom parameters', () => {
    const keyword = 'test';
    const page = 1;
    const size = 12;
    const sort = 'name-asc';
    const expectedUrl = `${STORE_BASE_URL}/products?keyword=${keyword}&page=${page}&size=${size}&sort=${sort}`;
    const expectedResponse: ApiResponse<Page<Product[]>> = {
      data: {
        content: [],
        totalPages: 0,
        totalElements: 0,
        number: 0,
        size: 10,
        pageable: {
          sort: {
            empty: false,
            sorted: false,
            unsorted: false
          },
          offset: 0,
          pageNumber: 0,
          pageSize: 0,
          paged: false,
          unpaged: false
        },
        last: false,
        sort: {
          empty: false,
          sorted: false,
          unsorted: false
        },
        numberOfElements: 0,
        first: false,
        empty: false
      },
      timeStamp: '',
      statusCode: 0,
      status: '',
      message: ''
    };

    service.fetchApiData(keyword, page, size, sort).subscribe((res) => {
      expect(res).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  it('should find product by id', () => {
    const productId = 1;
    const expectedUrl = `${STORE_BASE_URL}/products/${productId}`;
    const expectedResponse = { id: 1, name: 'Test Product', price: 9.99 };

    service.findProductById(productId).subscribe((res) => {
      expect(res).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  it('should place order', () => {
    const order = { id: 1, name: 'Test Order', total: 9.99 };
    const expectedUrl = `${STORE_BASE_URL}/orders/new`;
    const expectedResponse: ApiResponse<any> = {
      data: order,
      timeStamp: '',
      statusCode: 0,
      status: '',
      message: ''
    };

    service.placeOrder(order).subscribe((res) => {
      expect(res).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    req.flush(expectedResponse);
  });

  it('should get orders for user', () => {
    const userId = '1';
    const expectedUrl = `${STORE_BASE_URL}/orders/user/${userId}`;
    const expectedResponse = [{ id: 1, name: 'Test Order', total: 9.99 }];

    service.getOrdersForUser(userId).subscribe((res) => {
      expect(res).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  it('should get order by order id', () => {
    const orderId = '1';
    const expectedUrl = `${STORE_BASE_URL}/orders/id/${orderId}`;
    const expectedResponse = { id: 1, name: 'Test Order', total: 9.99 };

    service.getOrderById(orderId).subscribe((res) => {
      expect(res).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  it('should get product by product id', () => {
    const productId = '1';
    const expectedUrl = `${STORE_BASE_URL}/products/${productId}`;
    const expectedResponse = { id: 1, name: 'Test Product', price: 9.99 };

    service.getProductByProductId(productId).subscribe((res) => {
      expect(res).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  it('should update order status', () => {
    const orderId = '1';
    const status = 'SHIPPED';
    const expectedUrl = `${STORE_BASE_URL}/orders/${orderId}/status/${status}`;
    const expectedResponse = { id: 1, name: 'Test Order', total: 9.99, status: 'SHIPPED' };

    service.updateOrderStatus(orderId, status).subscribe((res) => {
      expect(res).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(expectedResponse);
  });

  it('should update order item status', () => {
    const orderNumber = '1';
    const orderItemId = '1';
    const status = 'SHIPPED';
    const expectedUrl = `${STORE_BASE_URL}/orders/${orderNumber}/orderItem/${orderItemId}/status/${status}`;
    const expectedResponse = { id: '1', name: 'Test Order Item', total: 9.99, status: 'SHIPPED' };

    service.updateOrderItemStatus(orderNumber, orderItemId, status).subscribe((res) => {
      expect(res).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(expectedResponse);
  });

  it('should get user by user id', () => {
    const userId = '1';
    const expectedUrl = `${STORE_BASE_URL}/user/${userId}`;
    const expectedResponse = { id: '1', name: 'Test User' };

    service.getUserByUserId(userId).subscribe((res) => {
      expect(res).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  it('should update user first name', () => {
    const userId = '1';
    const firstName = 'John';
    const expectedUrl = `${STORE_BASE_URL}/user/${userId}/first-name`;

    service.updateUserFirstName(userId, firstName).subscribe((res) => {
      expect(res).toEqual(firstName);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toBe(firstName);
    req.flush(firstName);
  });

  it('should update user last name', () => {
    const userId = '1';
    const lastName = 'Doe';
    const expectedUrl = `${STORE_BASE_URL}/user/${userId}/last-name`;

    service.updateUserLastName(userId, lastName).subscribe();

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toBe(lastName);
    req.flush(null);
  });

  it('should update user email', () => {
    const email = 'test@example.com';
    const newEmail = 'newtest@example.com';
    const expectedUrl = `${STORE_BASE_URL}/user/update-email?email=${email}&newEmail=${newEmail}`;

    service.updateUserEmail(email, newEmail).subscribe();

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(null);
  });

  it('should update user phone number', () => {
    const userId = '1';
    const phone = '1234567890';
    const expectedUrl = `${STORE_BASE_URL}/user/${userId}/phone-number`;

    service.updateUserPhoneNumber(userId, phone).subscribe();

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toBe(phone);
    req.flush(null);
  });

  it('should update user address', () => {
    const userId = '1';
    const address = '123 Foo St';
    const expectedUrl = `${STORE_BASE_URL}/user/${userId}/address`;

    service.updateUserAddress(userId, address).subscribe();

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toBe(address);
    req.flush(null);
  });
});