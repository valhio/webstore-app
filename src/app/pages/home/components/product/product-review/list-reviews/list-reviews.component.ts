import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import Review from 'src/app/models/review.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-list-reviews',
  templateUrl: './list-reviews.component.html',
  styleUrls: ['./list-reviews.component.scss']
})
export class ListReviewsComponent {

  @Input() productReviews: any[] = [];

  subscriptions: Subscription[] = [];

  commentForm = new FormGroup({
    comment: new FormControl('', Validators.required),
  })

  constructor(private authService: AuthenticationService, private storeService: StoreService, private router: Router) { }

  toggleCommentForm(productReview: any): void {
    if (!this.authService.isAuthenticated()) this.router.navigate(['/login']);
    this.commentForm.reset();
    productReview.isCommentFormVisible = !productReview.isCommentFormVisible;
  }

  toggleCommentsForReview(productReview: any): void {
    productReview.areCommentsVisible = !productReview.areCommentsVisible;
  }

  onLikeReview(review: Review) {
    this.subscriptions.push(
      this.storeService.likeReview(review.id).subscribe((reviewLikes) => {
        reviewLikes ? review.likes = reviewLikes : review.likes = [];
      })
    )
  }

  hasUserLikedReview(review: any) {
    return review.likes && review.likes.find((like: any) => like.userId == this.authService.getUserUserId()) != undefined;
  }

  submitComment(productReviewId: string): void {
    if (this.commentForm.valid) {
      this.subscriptions.push(
        this.storeService.addCommentToReview(productReviewId, this.commentForm.value['comment']!).subscribe((comment) => {
          this.commentForm.reset();

          // Find the review to which the comment was added and add the comment to the review's comments array, so that the comment is displayed in the UI
          this.productReviews.forEach((productReview: any) => {
            if (productReview.id == productReviewId) {
              productReview.comments.push(comment);
            }
          })
        })
      )
    }
  }
}
