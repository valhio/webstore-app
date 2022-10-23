import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-products-header',
  templateUrl: './products-header.component.html',
  styleUrls: ['./products-header.component.scss']
})
export class ProductsHeaderComponent implements OnInit {

  @Output() columnsCountChange = new EventEmitter<number>();
  @Output() itemsCountChange = new EventEmitter<number>();
  @Output() sortChange= new EventEmitter<string>();

  sort = 'name-asc';
  displaySort = 'Name (A-Z)';
  itemsShowCount= 12;

  constructor() { }

  ngOnInit(): void {
  }

  onSortUpdate(sort: string):void {
    this.sort = sort;
    switch (sort) {
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

  onItemsShowCountUpdate(itemsShowCount: number):void {
    this.itemsCountChange.emit(itemsShowCount);
    this.itemsShowCount = itemsShowCount;
  }

  onColumnsUpdate(columns: number):void {
    this.columnsCountChange.emit(columns);
  }
}
