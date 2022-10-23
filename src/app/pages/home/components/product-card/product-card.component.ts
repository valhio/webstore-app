import { Component, Input, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() columnsCountMode = 1;
  @Output() addToCart = new EventEmitter<Product>();
  @Input() product: Product | undefined;
  public innerWidth: any;


  constructor() { }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
  }

  onAddToCart() {
    this.addToCart.emit(this.product);
  }
  
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.innerWidth = window.innerWidth;
  }

}
