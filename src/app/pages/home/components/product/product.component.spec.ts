import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComponent } from './product.component';
import { of } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';
import { CartService } from 'src/app/services/cart.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { HttpClientTestingModule } from '@angular/common/http/testing';

fdescribe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let storeService: StoreService;
  let cartService: CartService;
  let authService: AuthenticationService;
  let mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
  let mockAfFun = jasmine.createSpyObj('AngularFireFunctions', ['httpsCallable']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductComponent],
      providers: [
        { provide: StoreService },
        { provide: CartService },
        { provide: AuthenticationService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: AngularFireFunctions, useValue: mockAfFun }
      ],
      imports: [
        RouterTestingModule, HttpClientTestingModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    storeService = TestBed.inject(StoreService);
    cartService = TestBed.inject(CartService);
    authService = TestBed.inject(AuthenticationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
