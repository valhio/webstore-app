import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  Pipe,
} from '@angular/core';
import { BehaviorSubject, debounce, elementAt, Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { StoreService } from '../../services/store.service';
import { Page } from '../../interface/page';
import { ApiResponse } from '../../interface/api-response';

const ROWS_HEIGHT: { [id: number]: number } = { 1: 300, 3: 550, 4: 420 };
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  columnsCount = 1;
  rowHeight = ROWS_HEIGHT[this.columnsCount];
  currentCategory: string | undefined;
  sort = 'name-asc';
  size = 12;
  page = 0;
  productsData: Product[] = [];
  displayedProducts: Product[] = [];
  width = 0;
  showSpinner: boolean = false;

  responseSubject = new BehaviorSubject<ApiResponse<any>>(null!); // null is the initial value
  totalElementsSubject = new BehaviorSubject<number>(0);
  totalElements$ = this.totalElementsSubject.asObservable();

  // Infinite scroll
  infiniteScrollThrottle = 0;
  infiniteScrollDistance = 0;

  constructor(
    private cartService: CartService,
    private storeService: StoreService
  ) { }

  ngOnInit(): void {
    this.onResize();
    this.getProducts();
  }

  getProducts(): void {
    this.storeService
      .fetchApiData(
        '',
        this.page,
        this.size,
        this.sort
        // this.currentCategory
      )
      .subscribe((_products: any) => {
        if (_products.data.products.content.length > 0) {
          this.responseSubject.next(_products);
          this.totalElementsSubject.next(_products.data.products.totalElements);

          this.productsData.push(..._products.data.products.content);
          this.displayedProducts.length == 0
            ? this.initLoadProducts()
            : this.loadMore();
        }
      });
  }

  initLoadProducts() {
    this.displayedProducts.push(
      ...this.productsData.slice(0, this.width <= 640 ? 6 : this.size)
    );
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
      imageUrl: product.imageUrl,
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
    if (this.productsData.length > this.displayedProducts!.length) {
      this.showSpinner = true;
      setTimeout(() => {
        let countOfItemsToDisplay =
          this.columnsCount == 1
            ? 3
            : this.displayedProducts.length % this.columnsCount == 0
              ? this.columnsCount
              : this.columnsCount -
              (this.displayedProducts.length % this.columnsCount) +
              this.columnsCount;

        this.displayedProducts?.push(
          ...this.productsData.slice(
            this.displayedProducts.length,
            this.displayedProducts.length + countOfItemsToDisplay >
              this.productsData.length
              ? this.productsData.length
              : this.displayedProducts.length + countOfItemsToDisplay
          )
        );
        this.showSpinner = false;
      }, 500);
    } else {
      if (+this.page + 1 < this.responseSubject.value.data.products.totalPages) {
        ++this.page;
        this.getProducts();
      }
    }
  }
}
