import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersComponent } from './orders.component';
import { AuthenticationService } from '../../../../services/authentication.service';
import { StoreService } from '../../../../services/store.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { User } from 'src/app/models/user';

fdescribe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let authService: AuthenticationService;
  let storeService: StoreService;
  const mockUser = { userId: "1" } as User;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      declarations: [OrdersComponent],
      providers: [
        { provide: AuthenticationService, useValue: { getUser: () => of(mockUser) } },
        { provide: StoreService, useValue: { getOrdersForUser: () => of() } }
      ]
    })
      .compileComponents();

    authService = TestBed.inject(AuthenticationService);
    storeService = TestBed.inject(StoreService);
    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user data on component initialization', () => {
    spyOn(authService, 'getUser').and.callThrough()

    component.user$ = authService.getUser();

    expect(authService.getUser).toHaveBeenCalled();
    component.user$.subscribe(user => {
      expect(user).toBeTruthy();
      expect(user).toEqual(mockUser);
    });
  });
});
