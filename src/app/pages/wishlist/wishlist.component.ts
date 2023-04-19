import {Component} from '@angular/core';
import {StoreService} from '../../services/store.service';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {CartService} from '../../services/cart.service';
import {CartItem} from '../../models/cart.model';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent {

  wishlist$ = this.storeService.getWishlistedProducts(this.authService.getUserUserId());

  constructor(private storeService: StoreService, private authService: AuthenticationService, private cartService: CartService) {
  }

  onAddToCart(product: any) {
    let cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl,
      category: product.category,
      quantity: 1
    } as CartItem;
    this.cartService.addToCart(cartItem);
  }

}
