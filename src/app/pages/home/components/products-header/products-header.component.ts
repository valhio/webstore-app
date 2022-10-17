import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-products-header',
  templateUrl: './products-header.component.html',
  styleUrls: ['./products-header.component.scss']
})
export class ProductsHeaderComponent implements OnInit {

  @Output() columnsCountChange = new EventEmitter<number>();
  sort = 'Ascending';
  itemsShowCount= 12;

  constructor() { }

  ngOnInit(): void {
  }

  onSortUpdate(sort: string):void {
    this.sort = sort;
  }

  onItemsShowCountUpdate(itemsShowCount: number):void {
    this.itemsShowCount = itemsShowCount;
  }

  onColumnsUpdate(columns: number):void {
    this.columnsCountChange.emit(columns);
  }

}
