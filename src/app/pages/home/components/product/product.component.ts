import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { StoreService } from 'src/app/services/store.service';
import { CartService } from '../../../../services/cart.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BehaviorSubject, catchError, Observable, of, shareReplay, Subscription, switchMap, tap } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {

  readonly DEFAULT_FEATURES = "A resin wrist rest is a type of ergonomic accessory for computer users that provides support and comfort to the wrists while typing or using a mouse. Resin wrist rests are made from a durable and smooth material that can be molded into various shapes and sizes to fit different keyboard and mouse configurations. The main features of a resin wrist rest include its ergonomic design, which helps to prevent repetitive strain injuries and carpal tunnel syndrome by promoting a neutral wrist position. Resin wrist rests are also non-slip, ensuring that they stay in place during use, and they are easy to clean and maintain. Additionally, resin wrist rests can be customized with various colors and designs to match a user's aesthetic preferences."
  readonly DEFAULT_CARE = "Caring for a resin wrist rest is relatively simple and straightforward. First and foremost, it is essential to keep the wrist rest clean by wiping it down regularly with a soft cloth or towel. Avoid using harsh chemicals or abrasive cleaners, as these can damage the surface of the resin. For more stubborn stains or dirt buildup, a mild soap solution can be used. When not in use, it is best to store the wrist rest in a clean and dry location, away from direct sunlight or heat sources. Avoid exposing the wrist rest to extreme temperatures, as this can cause warping or discoloration."
  readonly DEFAULT_FEATURES_LIST = ["Ergonomic design: Resin wrist rests are designed to promote a neutral wrist position and reduce the risk of repetitive strain injuries and carpal tunnel syndrome.", "Durable material: Resin is a durable material that can withstand daily use and retain its shape over time.", "Non-slip surface: Resin wrist rests typically have a non-slip surface that keeps them in place on a desk or workstation.", "Easy to clean: Resin is easy to clean and maintain, making it a practical choice for a wrist rest.", "Supportive: Resin wrist rests provide support and comfort to the wrists, reducing strain and fatigue.", "Hygienic: Resin is a non-porous material, making it resistant to bacteria and germs, which can be important for hygiene in shared work environments."]
  readonly DEFAULT_SPECS_LIST = ["Material: Resin", "Color: Black", "Size: 65%", "Dimensions: 320 x 80 x 20 mm", "Weight: ~ 0.5 kg", "Includes: Wrist rest only"]


  productId: string = this.route.snapshot.params['id'];
  subscriptions: Subscription[] = [];
  imageOnDisplayUrl?: string = undefined; // Holds the url of the image that is currently being displayed in the image carousel
  panelOpenState = false; // Used to toggle the expansion panel that displays the product description
  isReviewFormVisible = false; // Used to toggle the review form

  isProductWishlisted$: Observable<any> = this.storeService.getProductWishlistStatus(this.productId, this.authService.getUserUserId()).pipe(
    shareReplay(1), // shareReplay(1) is used to cache the value of the observable so that it is not re-evaluated every time the component is re-rendered
    catchError((err) => of(false)) // catchError is used to handle errors that may occur when the observable is evaluated
  )

  productSubject = new BehaviorSubject<any>({} as any);
  product$: Observable<any> = this.productSubject.asObservable();

  reviewForm = new FormGroup({
    rating: new FormControl(0, Validators.required),
    title: new FormControl('', Validators.required),
    review: new FormControl('', Validators.required),
  })

  constructor(private route: ActivatedRoute, private router: Router, private storeService: StoreService, private cartService: CartService, private authService: AuthenticationService) {
    this.product$ = this.storeService.getProductByProductId(this.productId).pipe(
      tap((product) => {
        this.productSubject.next(product);
        this.imageOnDisplayUrl = product.imageUrl;
      })
    )
  }

  displayImage(imageUrl: string) {
    this.imageOnDisplayUrl = imageUrl;
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl,
      category: product.category,
      quantity: 1,
    });
  }

  onAddToWishlist(product: Product): void {
    if (!this.authService.isAuthenticated()) this.router.navigate(['/login'])
    this.isProductWishlisted$ = this.storeService.addToWishlist(product.id, this.authService.getUserUserId()).pipe(
      shareReplay(1)
    )
  }

  onRemoveFromWishlist(product: Product): void {
    this.isProductWishlisted$ = this.storeService.removeFromWishlist(product.id, this.authService.getUserUserId()).pipe(
      shareReplay(1)
    )
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
        this.storeService.addProductReview(this.productId, this.authService.getUserUserId(), this.reviewForm.value['rating']!, this.reviewForm.value['title']!, this.reviewForm.value['review']!)
          .pipe(
            tap((productReview) => {
              this.reviewForm.reset();
              this.selectRatingStars(0)
              this.productSubject.value.productReviews = [productReview, ...this.productSubject.value.productReviews];
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

  getPercentageOfNStarReviews(n: number): number {
    if (this.productSubject.value.productReviews.length == 0) return 0; // If there are no reviews, return 0 to avoid NaN because of division by 0
    let result = 0;
    switch (n) {
      case 5:
        result = (this.getAllFiveStarReviews().length / this.productSubject.value.productReviews.length) * 100;
        break;
      case 4:
        result = (this.getAllFourStarReviews().length / this.productSubject.value.productReviews.length) * 100;
        break;
      case 3:
        result = (this.getAllThreeStarReviews().length / this.productSubject.value.productReviews.length) * 100;
        break;
      case 2:
        result = (this.getAllTwoStarReviews().length / this.productSubject.value.productReviews.length) * 100;
        break;
      case 1:
        result = (this.getAllOneStarReviews().length / this.productSubject.value.productReviews.length) * 100;
        break;
      default:
        break;
    }
    return Math.round(result * 100) / 100; // Rounds the result to 2 decimal places (e.g. 33.33333333333333 -> 33.33
  }

  getAllFiveStarReviews(): any[] {
    return this.productSubject.value.productReviews.filter((productReview: any) => productReview.rating == 5);
  }

  getAllFourStarReviews(): any[] {
    return this.productSubject.value.productReviews.filter((productReview: any) => productReview.rating == 4);
  }

  getAllThreeStarReviews(): any[] {
    return this.productSubject.value.productReviews.filter((productReview: any) => productReview.rating == 3);
  }

  getAllTwoStarReviews(): any[] {
    return this.productSubject.value.productReviews.filter((productReview: any) => productReview.rating == 2);
  }

  getAllOneStarReviews(): any[] {
    return this.productSubject.value.productReviews.filter((productReview: any) => productReview.rating == 1);
  }

  getAverageRating(): number {
    let totalRating = 0;

    if (this.productSubject.value.productReviews.length == 0) return 0; // Returns 0 if there are no reviews (to avoid division by 0

    this.productSubject.value.productReviews.forEach((productReview: any) => {
      totalRating += productReview.rating;
    })
    const res = totalRating / this.productSubject.value.productReviews.length;
    return Math.round(res) || 0; // Rounds the result to integer (e.g. 3.33333333333333 -> 3)
  }

  toggleReviewForm(): void {
    if (!this.authService.isAuthenticated()) this.router.navigate(['/login']);
    this.isReviewFormVisible = !this.isReviewFormVisible;
  }

  onLikeReview(reviewId: number): void {
    const isLiked$ = this.storeService.hasUserLikedReview(reviewId); // Check if the user has liked the review
    const likeAction$ = isLiked$.pipe(
      switchMap(hasUserLikedReview => {
        // If the user has liked the review, unlike it, otherwise like it
        const likeAction = hasUserLikedReview ? this.storeService.unlikeReview(reviewId) : this.storeService.likeReview(reviewId);
        return likeAction.pipe( // Return the review likes observable
          switchMap(() => this.storeService.getReviewLikes(reviewId))
        );
      })
    );
    this.subscriptions.push(
      likeAction$.subscribe(reviewLikes => {
        const productReview = this.productSubject.value.productReviews.find((pr: any) => pr.id === reviewId);
        if (productReview) {
          productReview.likes = reviewLikes;
        }
      })
    );
  }

}

