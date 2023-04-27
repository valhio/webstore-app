import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, switchMap, tap } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.scss']
})
export class ProductReviewComponent {

  @Input() productReviews: any[] = [];
  @Input() productId: string | undefined;
  @Output() newProductReview = new EventEmitter<any[]>();

  constructor() { }

  onNewProductReviewSubmitted(productReviews: any[]): void {
    this.productReviews = productReviews;
    this.newProductReview.emit(productReviews);
  }

}
