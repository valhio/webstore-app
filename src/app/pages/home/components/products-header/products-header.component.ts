import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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

  sort = 'name-asc';
  displaySort = 'Име (А-Я)';
  itemsShowCount = 12;

  constructor() {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(): void {}

  onSortUpdate(sort: string): void {
    this.sort = sort;
    switch (sort) {
      case 'name-asc':
        this.displaySort = 'Име (А-Я)';
        break;
      case 'name-desc':
        this.displaySort = 'Име (Я-А)';
        break;
      case 'price-asc':
        this.displaySort = 'Цена (Ниска към Висока)';
        break;
      case 'price-desc':
        this.displaySort = 'Цена (Висока към Ниска)';
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
