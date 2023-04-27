import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-rating',
  templateUrl: './product-rating.component.html',
  styleUrls: ['./product-rating.component.scss']
})
export class ProductRatingComponent {

  @Input() productReviews: any[] = [];
  @Input() starsColor: string = 'text-yellow-400';

  constructor() { }

  getAverageRating(): number {
    // if (this.pro.length == 0) return 0; // Returns 0 if there are no reviews (to avoid division by 0
    if (this.productReviews.length == 0) return 0;

    let totalRating = 0;

    this.productReviews.forEach((productReview: any) => {
      totalRating += productReview.rating;
    })
    const res = totalRating / this.productReviews.length;
    return Math.round(res) || 0; // Rounds the result to integer (e.g. 3.33333333333333 -> 3)
  }

}
