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
  }

  getSortDisplay(): string {
    const sortArr = this.sort.split('-');
    const sortField = sortArr[0];
    const sortDirection = sortArr[1];
    let displaySort = '';
    switch (sortField) {
      case 'id':
        displaySort = 'Featured';
        break;
      case 'price':
        displaySort = 'Price';
        break;
      case 'name':
        displaySort = 'Name';
        break;
    }
    displaySort += ' ' + (sortDirection === 'asc' ? 'Ascending' : 'Descending');
    return displaySort;
  }

  onSortUpdate(sort: string): void {
    this.sort = sort;
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
