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
  productsDisplayed: Product[] = [];
  mockData : Product[] = [];
  productsSubscription: Subscription | undefined;
  width = 0;
  autoScrollSizeIncrement = 4;
  showSpinner: boolean = false;

  // Infinite scroll
  infiniteScrollThrottle = 0;
  infiniteScrollDistance = 0;

  

  constructor(
    private cartService: CartService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.onResize();
    this.getProducts();
  }

  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription?.unsubscribe();
    }
  }

  getProducts(): void {
    // this.productsSubscription = this.storeService
    //   .getAllProducts(
    //     this.size.toString(),
    //     this.sort,
    //     this.page,
    //     this.currentCategory
    //   )
    //   .subscribe((_products) => {
    //     this.productsDisplayed = _products;
    //   });

    this.productsSubscription = this.storeService
      .getMockData()
      .subscribe((_products) => {
        this.mockData = _products;
        if (this.sort === 'name-asc') {
          _products.sort((a, b) => (a.name > b.name ? 1 : -1));
        } else if (this.sort === 'name-desc') {
          _products.sort((a, b) => (a.name < b.name ? 1 : -1));
        } else if (this.sort === 'price-asc') {
          _products.sort((a, b) =>
            a.price.toString() > b.price.toString() ? 1 : -1
          );
        } else if (this.sort === 'price-desc') {
          _products.sort((a, b) =>
            a.price.toString() < b.price.toString() ? 1 : -1
          );
        }
        this.productsDisplayed = _products.slice(0, this.width <= 640 ? 6 : this.size);
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
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category,
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
    if (this.mockData.length > this.productsDisplayed!.length) {
      this.showSpinner = true;
      setTimeout(() => {
        let countOfItemsToDisplay =
          this.columnsCount == 1
            ? 3
            : this.productsDisplayed.length % this.columnsCount == 0
            ? this.columnsCount
            : this.columnsCount -
              (this.productsDisplayed.length % this.columnsCount) +
              this.columnsCount;

        this.productsDisplayed?.push(
          ...this.mockData.slice(
            this.productsDisplayed.length,
            this.productsDisplayed.length + countOfItemsToDisplay > this.mockData.length
              ? this.mockData.length
              : this.productsDisplayed.length + countOfItemsToDisplay
          )
        );
        this.showSpinner = false;
      }, 500);
    }
  }
}
