import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutBodyComponent } from './checkout-body.component';

describe('CheckoutBodyComponent', () => {
  let component: CheckoutBodyComponent;
  let fixture: ComponentFixture<CheckoutBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutBodyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
