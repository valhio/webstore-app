import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { StoreService } from 'src/app/services/store.service';
import { CartService } from '../../../../services/cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  productId: string = this.route.snapshot.params['id'];
  product$ = this.storeService.getProductByProductId(this.productId);
  imageOnDisplayUrl?: string = undefined;

  constructor(private route: ActivatedRoute, private storeService: StoreService, private cartService: CartService) { }

  ngOnInit(): void {
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

}
