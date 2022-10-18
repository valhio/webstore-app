import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() fullWidthMode = false;
  @Output() addToCart = new EventEmitter<Product>();
  
  product: Product | undefined={
    id: 1,
    name: 'Product 1',
    price: 100,
    description: 'Product 1 description',
    image: 'https://via.placeholder.com/150',
    category: 'category 1',
    quantity: 1
  };

  constructor() { }

  ngOnInit(): void {
  }

  onAddToCart() {
    this.addToCart.emit(this.product);
  }

}
