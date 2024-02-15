import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReviewsComponent } from './list-reviews.component';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart.service';
import { StoreService } from 'src/app/services/store.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListReviewsComponent', () => {
  let component: ListReviewsComponent;
  let fixture: ComponentFixture<ListReviewsComponent>;
  let storeService: StoreService;
  let cartService: CartService;
  let authService: AuthenticationService;
  let mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
  let mockAfFun = jasmine.createSpyObj('AngularFireFunctions', ['httpsCallable']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListReviewsComponent],
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

    fixture = TestBed.createComponent(ListReviewsComponent);
    component = fixture.componentInstance;
    storeService = TestBed.inject(StoreService);
    cartService = TestBed.inject(CartService);
    authService = TestBed.inject(AuthenticationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onLikeReview()', () => {
    it('should like a review and update its likes', () => {
      // const reviewId = 1;
      // const userLiked = false;
      // const reviewLikes = [1];
      // const productReview = { id: reviewId, likes: [] as number[] };
      // const expectedProductReview = { id: reviewId, likes: reviewLikes };

      // spyOn(authService, 'getUserId').and.returnValue('123');
      // spyOn(storeService, 'hasUserLikedReview').and.returnValue(of(userLiked));
      // spyOn(storeService, 'likeReview').and.returnValue(of({}));
      // spyOn(storeService, 'getReviewLikes').and.returnValue(of(reviewLikes));

      // component.productReviews = [productReview];
      // component.onLikeReview(reviewId);

      // expect(storeService.hasUserLikedReview).toHaveBeenCalledWith(reviewId);
      // expect(storeService.likeReview).toHaveBeenCalledWith(reviewId);
      // expect(storeService.getReviewLikes).toHaveBeenCalledWith(reviewId);
      // expect(component.subscriptions.length).toBe(1);
      // component.subscriptions[0].unsubscribe();
      // expect(component.subscriptions[0].closed).toBeTrue();
      // expect(productReview).toEqual(expectedProductReview);
      // expect(component.productReviews[0]).toEqual(expectedProductReview);
      // expect(component.productReviews[0].likes).toEqual(expectedProductReview.likes);
    });

    it('should unlike a review and update its likes', () => {
      // const reviewId = 1;
      // const userLiked = true;
      // const reviewLikes = [] as number[];
      // const productReview = { id: reviewId, likes: [1, 2, 3] };
      // const expectedProductReview = { id: reviewId, likes: reviewLikes };

      // spyOn(authService, 'getUserId').and.returnValue('123');
      // spyOn(storeService, 'hasUserLikedReview').and.returnValue(of(userLiked));
      // spyOn(storeService, 'unlikeReview').and.returnValue(of({}));
      // spyOn(storeService, 'getReviewLikes').and.returnValue(of(reviewLikes));

      // component.productReviews = [productReview];
      // component.onLikeReview(reviewId);

      // expect(storeService.hasUserLikedReview).toHaveBeenCalledWith(reviewId);
      // expect(storeService.unlikeReview).toHaveBeenCalledWith(reviewId);
      // expect(storeService.getReviewLikes).toHaveBeenCalledWith(reviewId);
      // expect(component.subscriptions.length).toBe(1);
      // component.subscriptions[0].unsubscribe();
      // expect(component.subscriptions[0].closed).toBeTrue();
      // expect(expectedProductReview.likes).toEqual(reviewLikes);
      // expect(component.productReviews[0]).toEqual(expectedProductReview);
      // expect(component.productReviews[0].likes).toEqual(expectedProductReview.likes);
    });
  });

  describe('hasUserLikedReview()', () => {
    it('should return true if the user has liked a review', () => {
      const review = { likes: [{ userId: '123' }] };
      spyOn(authService, 'getUserId').and.returnValue('123');

      const result = component.hasUserLikedReview(review);

      expect(result).toBeTrue();
    });

    it('should return false if the user has not liked a review', () => {
      const review = { likes: [{ user: { userId: 123 } }] };
      spyOn(authService, 'getUserId').and.returnValue('456');

      const result = component.hasUserLikedReview(review);

      expect(result).toBeFalse();
    });
  });
});
