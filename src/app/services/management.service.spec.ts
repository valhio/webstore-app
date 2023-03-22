import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ManagementService } from './management.service';

describe('ManagementService', () => {
  let service: ManagementService;
  let httpMock: HttpTestingController;

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
    service = TestBed.inject(ManagementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // What this does is verify that there are no outstanding requests.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get orders', () => {
    const order1 = { id: 1, name: 'testname', total: 1.99 };
    const order2 = { id: 2, name: 'testname2', total: 2.99 };
    const orders = [order1, order2];
    service.getOrders().subscribe((orders) => {
      expect(orders.length).toBe(orders.length);
      expect(orders).toEqual(orders);
      expect(orders[0].id).toBe(order1.id);
      expect(orders[1].id).toBe(order2.id);
    });

    const req = httpMock.expectOne(STORE_BASE_URL + '/orders/management');
    expect(req.request.method).toBe('GET');
    expect(req.request.url).toBe(STORE_BASE_URL + '/orders/management');
    req.flush(orders);
  });
});
