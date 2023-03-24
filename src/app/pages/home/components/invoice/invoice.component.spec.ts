import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceComponent } from './invoice.component';
import { StoreService } from '../../../../services/store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('InvoiceComponent', () => {
  let component: InvoiceComponent;
  let fixture: ComponentFixture<InvoiceComponent>;
  let storeService: StoreService;
  let mockActivatedRoute = {
    snapshot: {
      params: {
        id: '123',
      },
      paramMap: {
        get(): string {
          return '123';
        },
      },
    },
  }

  const mockOrder = {
    id: 1,
    items: [
      { id: 1, name: 'test', price: 100, quantity: 1 },
      { id: 2, name: 'test2', price: 100, quantity: 1 }
    ]
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [InvoiceComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: StoreService, useValue: { getOrderByOrderId: () => of(mockOrder) } },
      ]
    })
      .compileComponents();


    storeService = TestBed.inject(StoreService);
    fixture = TestBed.createComponent(InvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get order id from route params', () => {
    expect(component.orderId).toEqual('123');
  });

  it('should fetch order data on component initialization', () => {
    spyOn(storeService, 'getOrderByOrderId').and.returnValue(of(mockOrder));
    component.order$ = storeService.getOrderByOrderId('123');

    expect(component.order$).toBeTruthy();
    expect(component.order$).toBeInstanceOf(Observable);

    component.order$?.subscribe((order) => {
      expect(order).toBeTruthy();
      expect(order).toEqual(mockOrder);
    });
  });
});
