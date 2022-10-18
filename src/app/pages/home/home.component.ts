import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { Cart } from '../../models/cart.model';
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
        this.products = _products;
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
