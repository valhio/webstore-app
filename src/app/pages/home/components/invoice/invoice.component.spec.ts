import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceComponent } from './invoice.component';
import { StoreService } from '../../../../services/store.service';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { log } from 'console';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('InvoiceComponent', () => {
  let component: InvoiceComponent;
  let fixture: ComponentFixture<InvoiceComponent>;
  let activatedRoute: ActivatedRoute;
  let storeService: StoreService;
  let router: Router;

  const mockOrder = {
    id: 1,
    items: [
      { id: 1, name: 'test', price: 100, quantity: 1 },
      { id: 2, name: 'test2', price: 100, quantity: 1 }
    ]
  }

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ InvoiceComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: { orderNumber: '123' } } } },
        { provide: StoreService},
        { provide: Router, useValue: routerSpy}
      ],
      imports: [ RouterTestingModule, HttpClientTestingModule ]
    })
    .compileComponents();

    activatedRoute = TestBed.inject(ActivatedRoute);
    storeService = TestBed.inject(StoreService) as jasmine.SpyObj<StoreService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(InvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get order number from route params', () => {
    expect(component.orderNumber).toEqual('123');
  });

  it('should fetch order data on component initialization', () => {
    spyOn(storeService, 'getOrderByOrderNumber').and.returnValue(of(mockOrder));
    // component.order$ = storeService.getOrderByOrderNumber('123');

    expect(component.order$).toBeTruthy();
    expect(component.order$).toBeInstanceOf(Observable);

    component.order$?.subscribe((order) => {
      expect(order).toBeTruthy();
      expect(order).toEqual(mockOrder);
    });
  });
});
