import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { StoreService } from '../../services/store.service';

const ROWS_HEIGHT: { [id: number]: number } = { 1: 250, 3: 335, 4: 350 };
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  columnsCount = 1;
  rowHeight = ROWS_HEIGHT[this.columnsCount];
  currentCategory: string | undefined;
  sort = 'asc';
  size = '12';
  page = '1';
  products: Product[] | undefined;
  productsSubscription: Subscription | undefined;

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
      description:
      `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-4.jpg',
      category: 'Stone Wrist Rests',
      quantity: 1,
    },
    {
      id: 5,
      title: 'White & Light Gray Marble',
      price: 65.0,
      description:
      `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-5.jpg',
      category: 'Marble Wrist Rests',
      quantity: 1,
    },
    {
      id: 6,
      title: 'Black & White Quartz',
      price: 60.0,
      description:
      `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-6.jpg',
      category: 'Quartz Wrist Rests',
      quantity: 1,
    },
    {
      id: 7,
      title: 'Black & White Quartz',
      price: 60.0,
      description:
      `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-7.jpg',
      category: 'Quartz Wrist Rests',
      quantity: 1,
    },
    {
      id: 8,
      title: 'Coral-Blue Resin',
      price: 60.0,
      description:
      `Material: Resin | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-8.jpg',
      category: 'Resin Wrist Rests',
      quantity: 1,
    },
    {
      id: 9,
      title: 'White-Pearl Resin',
      price: 60.0,
      description:
      `Material: Resin | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-9.jpg',
      category: 'Resin Wrist Rests',
      quantity: 1,
    },
    {
      id: 10,
      title: 'Coral-Green Marble',
      price: 60.0,
      description:
      `Material: Resin | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-10.jpg',
      category: 'Resin Wrist Rests',
      quantity: 1,
    },
    {
      id: 11,
      title: 'Black & White Marble',
      price: 65.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
         | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-1.jpg',
      category: 'Quartz Stone Wrist Rests',
      quantity: 1,
    },
    {
      id: 12,
      title: 'Black & Orangle Marble',
      price: 60.0,
      description:
        'The Resin wrist rest, which is made of a combination of epoxy resin and has a baking finish surface. It is normal that there may be small bubbles in the resin. So handicrafts are not flawless products.',
      image: '/assets/images/wrist-rests/wrist-rest-2.jpg',
      category: 'Marble Wrist Rests',
      quantity: 1,
    },
    {
      id: 13,
      title: 'White Granite',
      price: 70.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-3.jpg',
      category: 'Stone Wrist Rests',
      quantity: 1,
    },
    {
      id: 14,
      title: 'Blue Granite',
      price: 70.0,
      description:
      `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-4.jpg',
      category: 'Stone Wrist Rests',
      quantity: 1,
    },
    {
      id: 15,
      title: 'White & Light Gray Marble',
      price: 65.0,
      description:
      `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-5.jpg',
      category: 'Marble Wrist Rests',
      quantity: 1,
    },
    {
      id: 16,
      title: 'Black & White Quartz',
      price: 60.0,
      description:
      `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
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
  }

  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription?.unsubscribe();
    }
  }

  getProducts(): void {
    this.productsSubscription = this.storeService
      .getAllProducts(this.size, this.sort, this.page, this.currentCategory)
      .subscribe((_products) => {
        // this.products = _products;
        this.products = this.testData;
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
    this.size = itemsCount.toString();
    this.getProducts();
  }

  onSortChange(sort: string): void {
    this.sort = sort;
    this.getProducts();
  }
}
