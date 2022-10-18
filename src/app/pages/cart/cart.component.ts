import { Component, OnInit } from '@angular/core';
import { Cart } from 'src/app/models/cart.model';
import { CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cart: Cart = {
    items: [
      {
        id: 1,
        product: 'https://picsum.photos/150',
        name: 'name1',
        price: 150,
        quantity: 1,
      },
      {
        id: 2,
        product: 'https://picsum.photos/150',
        name: 'name2',
        price: 150,
        quantity: 2,
      },
    ],
  };

  dataSource: CartItem[] = [];
  displayedColumns: string[] = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'actions',
  ];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // this.dataSource = Json.parse(localStorage.getItem('cart'));
    // this.dataSource = this.cart.items;
    this.cartService.cart.subscribe((cart) => {
      this.cart = cart;
      // this.dataSource= localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')!) : [];
      this.dataSource = this.cart.items;
    });
  }

  getTotal(items: CartItem[]): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {    
    this.cartService.onClearCart();
  }

  onRemoveFromCart(item:CartItem): void {    
    this.cartService.removeFromCart(item);
  }

  onAddQuantity(item:CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveQuantity(item:CartItem): void {
    this.cartService.removeQuantity(item);
  }
}
