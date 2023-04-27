import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-leave-review',
  templateUrl: './leave-review.component.html',
  styleUrls: ['./leave-review.component.scss']
})
export class LeaveReviewComponent {

  @Input() productReviews: any[] = [];
  @Input() productId: string | undefined;

  @Output() newProductReview = new EventEmitter<any[]>();

  isReviewFormVisible: boolean = false;
  subscriptions: Subscription[] = [];

  constructor(private authService: AuthenticationService, private storeService: StoreService, private router: Router) { }

  reviewForm = new FormGroup({
    rating: new FormControl(0, Validators.required),
    title: new FormControl('', Validators.required),
    review: new FormControl('', Validators.required),
  })

  getPercentageOfNStarReviews(n: number): number {
    if (this.productReviews.length == 0) return 0; // If there are no reviews, return 0 to avoid NaN because of division by 0
    let result = 0;
    switch (n) {
      case 5:
        result = (this.getAllFiveStarReviews().length / this.productReviews.length) * 100;
        break;
      case 4:
        result = (this.getAllFourStarReviews().length / this.productReviews.length) * 100;
        break;
      case 3:
        result = (this.getAllThreeStarReviews().length / this.productReviews.length) * 100;
        break;
      case 2:
        result = (this.getAllTwoStarReviews().length / this.productReviews.length) * 100;
        break;
      case 1:
        result = (this.getAllOneStarReviews().length / this.productReviews.length) * 100;
        break;
      default:
        break;
    }
    return Math.round(result * 100) / 100; // Rounds the result to 2 decimal places (e.g. 33.33333333333333 -> 33.33
  }

  getAllFiveStarReviews(): any[] {
    return this.productReviews.filter((productReview: any) => productReview.rating == 5);
  }

  getAllFourStarReviews(): any[] {
    return this.productReviews.filter((productReview: any) => productReview.rating == 4);
  }

  getAllThreeStarReviews(): any[] {
    return this.productReviews.filter((productReview: any) => productReview.rating == 3);
  }

  getAllTwoStarReviews(): any[] {
    return this.productReviews.filter((productReview: any) => productReview.rating == 2);
  }

  getAllOneStarReviews(): any[] {
    return this.productReviews.filter((productReview: any) => productReview.rating == 1);
  }

  toggleReviewForm(): void {
    if (!this.authService.isAuthenticated()) this.router.navigate(['/login']);
    this.isReviewFormVisible = !this.isReviewFormVisible;
  }

  onStarsHover(stars: number, $event: any): void {
    for (let index = 0; index < stars; index++) {
      $event.target.parentElement.childNodes[index].classList.add("star-hover");
    }
  }

  onStarsLeave(stars: number, $event: any): void {
    for (let index = 0; index < stars; index++) {
      $event.target.parentElement.childNodes[index].classList.remove("star-hover");
    }
  }

  onRatingSelect(rating: number): void {
    this.reviewForm.patchValue({
      rating: rating
    })
    this.selectRatingStars(rating)
  }

  submitReview(): void {
    if (this.reviewForm.get('rating')?.value == 0) this.reviewForm.get('rating')?.setErrors({ required: true }); // If the user has not selected a rating (rating equals 0), set the rating form control to invalid

    if (this.reviewForm.valid) {
      this.subscriptions.push(
        this.storeService.addProductReview(this.productId!, this.authService.getUserUserId(), this.reviewForm.value['rating']!, this.reviewForm.value['title']!, this.reviewForm.value['review']!)
          .pipe(
            tap((productReview) => {
              this.reviewForm.reset();
              this.selectRatingStars(0)
              this.productReviews = [productReview, ...this.productReviews];
              this.newProductReview.emit(this.productReviews);
            })
          ).subscribe()
      )
    }
  }


  selectRatingStars(rating: number): void {
    let ratingStars = document.getElementById("rating-stars");
    let childCount = ratingStars?.childNodes?.length;

    for (let i = 0; i < childCount!; i++) {
      if (i < rating) {
        ratingStars?.children[i]?.classList.add("star-selected");
      } else {
        ratingStars?.children[i]?.classList.remove("star-selected");
      }
    }
  }
}
