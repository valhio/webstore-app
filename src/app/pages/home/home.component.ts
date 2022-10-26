import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { debounce, elementAt, Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { StoreService } from '../../services/store.service';

const ROWS_HEIGHT: { [id: number]: number } = { 1: 300, 3: 550, 4: 420 };
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  columnsCount = 1;
  rowHeight = ROWS_HEIGHT[this.columnsCount];
  currentCategory: string | undefined;
  sort = 'name-asc';
  size = 12;
  page = '1';
  products: Product[] =[];
  productsSubscription: Subscription | undefined;
  width = 0;
  autoScrollSizeIncrement = 4;
  showSpinner: boolean = false;

  // Infinite scroll
  infiniteScrollThrottle = 0;
  infiniteScrollDistance = 0;

  testData: Product[] = [
    {
      id: 1,
      title: 'Black & White Marble',
      price: 65.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
         | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-1.jpg',
      category: 'Quartz Stone Wrist Rests',
      quantity: 1,
    },
    {
      id: 2,
      title: 'Black & Orangle Marble',
      price: 60.0,
      description:
        'The Resin wrist rest, which is made of a combination of epoxy resin and has a baking finish surface. It is normal that there may be small bubbles in the resin. So handicrafts are not flawless products.',
      image: '/assets/images/wrist-rests/wrist-rest-2.jpg',
      category: 'Marble Wrist Rests',
      quantity: 1,
    },
    {
      id: 3,
      title: 'White Granite',
      price: 70.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-3.jpg',
      category: 'Stone Wrist Rests',
      quantity: 1,
    },
    {
      id: 4,
      title: 'Blue Granite',
      price: 70.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-4.jpg',
      category: 'Stone Wrist Rests',
      quantity: 1,
    },
    {
      id: 5,
      title: 'White & Light Gray Marble',
      price: 65.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-5.jpg',
      category: 'Marble Wrist Rests',
      quantity: 1,
    },
    {
      id: 6,
      title: 'Black & White Quartz',
      price: 60.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-6.jpg',
      category: 'Quartz Wrist Rests',
      quantity: 1,
    },
    {
      id: 7,
      title: 'Black & White Quartz V2',
      price: 60.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-7.jpg',
      category: 'Quartz Wrist Rests',
      quantity: 1,
    },
    {
      id: 8,
      title: 'Coral-Blue Resin',
      price: 60.0,
      description: `Material: Resin | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-8.jpg',
      category: 'Resin Wrist Rests',
      quantity: 1,
    },
    {
      id: 9,
      title: 'White-Pearl Resin',
      price: 60.0,
      description: `Material: Resin | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-9.jpg',
      category: 'Resin Wrist Rests',
      quantity: 1,
    },
    {
      id: 10,
      title: 'Coral-Green Marble',
      price: 60.0,
      description: `Material: Resin | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-10.jpg',
      category: 'Resin Wrist Rests',
      quantity: 1,
    },
    {
      id: 11,
      title: 'V2 Black & White Marble',
      price: 65.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
         | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-1.jpg',
      category: 'Quartz Stone Wrist Rests',
      quantity: 1,
    },
    {
      id: 12,
      title: 'V2 Black & Orangle Marble',
      price: 60.0,
      description:
        'The Resin wrist rest, which is made of a combination of epoxy resin and has a baking finish surface. It is normal that there may be small bubbles in the resin. So handicrafts are not flawless products.',
      image: '/assets/images/wrist-rests/wrist-rest-2.jpg',
      category: 'Marble Wrist Rests',
      quantity: 1,
    },
    {
      id: 13,
      title: 'V2 White Granite',
      price: 70.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-3.jpg',
      category: 'Stone Wrist Rests',
      quantity: 1,
    },
    {
      id: 14,
      title: 'V2 Blue Granite',
      price: 70.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-4.jpg',
      category: 'Stone Wrist Rests',
      quantity: 1,
    },
    {
      id: 15,
      title: 'V2 White & Light Gray Marble',
      price: 65.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-5.jpg',
      category: 'Marble Wrist Rests',
      quantity: 1,
    },
    {
      id: 16,
      title: 'V2 Black & White Quartz',
      price: 60.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-6.jpg',
      category: 'Quartz Wrist Rests',
      quantity: 1,
    },
  ];

  constructor(
    private cartService: CartService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.onResize();
  }

  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription?.unsubscribe();
    }
  }

  getProducts(): void {
    this.productsSubscription = this.storeService
      .getAllProducts(
        this.size.toString(),
        this.sort,
        this.page,
        this.currentCategory
      )
      .subscribe((_products) => {
        // this.products = _products;

        // Mocked data START
        if (this.sort === 'name-asc') {
          this.testData.sort((a, b) => (a.title > b.title ? 1 : -1));
        } else if (this.sort === 'name-desc') {
          this.testData.sort((a, b) => (a.title < b.title ? 1 : -1));
        } else if (this.sort === 'price-asc') {
          this.testData.sort((a, b) =>
            a.price.toString() > b.price.toString() ? 1 : -1
          );
        } else if (this.sort === 'price-desc') {
          this.testData.sort((a, b) =>
            a.price.toString() < b.price.toString() ? 1 : -1
          );
        }
        this.products = this.testData.slice(
          0,
          this.width <= 640 ? 6 : this.size
        );
        // Mocked data END
      });
  }

  onColumnsCountChange(columns: number): void {
    this.columnsCount = columns;
    this.rowHeight = ROWS_HEIGHT[this.columnsCount];
  }

  onShowCategoryChange(category: string): void {
    this.currentCategory = category;
    this.getProducts();
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      id: product.id,
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
    });
  }

  onItemsCountChange(itemsCount: number): void {
    this.size = itemsCount;
    this.getProducts();
  }

  onSortChange(sort: string): void {
    this.sort = sort;
    this.getProducts();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.width = window.innerWidth;
    switch (true) {
      case this.width < 670:
        this.columnsCount = 1;
        break;
      case this.width >= 60 && this.width < 768:
        this.columnsCount = 2;
        break;
      case this.width >= 768 && this.width < 992:
        this.columnsCount = 3;
        break;
      case this.width >= 992 && this.width < 1200:
        this.columnsCount = 4;
        break;
      default:
        this.columnsCount = 4;
    }
  }

  onScrollDown() {
    this.loadMore();
  }

  loadMore() {
    if (this.testData.length > this.products!.length) {
      this.showSpinner = true;
      setTimeout(() => {
        let countOfItemsToDisplay = this.columnsCount == 1 ? 3 : this.columnsCount;
        this.products?.push(
          ...this.testData.slice(
            this.products.length,
            this.products.length + countOfItemsToDisplay > this.testData.length
              ? this.testData.length
              : this.products.length + countOfItemsToDisplay
          )
        );
        this.showSpinner = false;
      }, 500);
    }
  }
}
