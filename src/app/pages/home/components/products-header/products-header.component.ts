import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StoreService } from '../../../../services/store.service';

@Component({
  selector: 'app-products-header',
  templateUrl: './products-header.component.html',
  styleUrls: ['./products-header.component.scss'],
})
export class ProductsHeaderComponent implements OnInit {
  @Output() columnsCountChange = new EventEmitter<number>();
  @Output() itemsCountChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<string>();
  @Input() innerWidth: number;

  sort = 'id-asc';
  displaySort = 'Featured';
  itemsShowCount = 12;

  constructor(private storeService: StoreService) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(): void {    
    this.sort = this.storeService.getSortBy() + '-' + this.storeService.getSortDirection();
    this.onSortUpdate(this.sort);
  }

  onSortUpdate(sort: string): void {    
    this.sort = sort;
    switch (sort) {
      case 'id-asc':
        this.displaySort = 'Featured';
        break;
      case 'name-asc':
        this.displaySort = 'Name (A-Z)';
        break;
      case 'name-desc':
        this.displaySort = 'Name (Z-A)';
        break;
      case 'price-asc':
        this.displaySort = 'Price (Low to High)';
        break;
      case 'price-desc':
        this.displaySort = 'Price (High to Low)';
        break;
    }
    this.sortChange.emit(sort);
  }

  onItemsShowCountUpdate(itemsShowCount: number): void {
    this.itemsCountChange.emit(itemsShowCount);
    this.itemsShowCount = itemsShowCount;
  }

  onColumnsUpdate(columns: number): void {
    this.columnsCountChange.emit(columns);
  }
}
