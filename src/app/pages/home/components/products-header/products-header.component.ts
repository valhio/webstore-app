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

  sort = 'Ascending';
  itemsShowCount= 12;

  constructor() { }

  ngOnInit(): void {
  }

  onSortUpdate(sort: string):void {
    this.sort = sort;
    this.sortChange.emit(sort === 'Ascending' ? 'asc' : 'desc');
  }

  onItemsShowCountUpdate(itemsShowCount: number):void {
    this.itemsCountChange.emit(itemsShowCount);
    this.itemsShowCount = itemsShowCount;
  }

  onColumnsUpdate(columns: number):void {
    this.columnsCountChange.emit(columns);
  }
}
