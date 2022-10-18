import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { Cart } from '../../models/cart.model';

const ROWS_HEIGHT: { [id: number]: number } = { 1: 250, 3: 335, 4: 350 };
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  columnsCount = 1;
  rowHeight = ROWS_HEIGHT[this.columnsCount];
  currentCategory: string | undefined;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {}

  onColumnsCountChange(columns: number): void {
    this.columnsCount = columns;
    this.rowHeight = ROWS_HEIGHT[this.columnsCount];
  }

  onShowCategoryChange(category: string): void {
    this.currentCategory = category;
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      id: product.id,
      product: product.image,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }
}
