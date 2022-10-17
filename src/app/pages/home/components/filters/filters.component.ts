import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  @Output() showCategory = new EventEmitter<string>();

  categories: string[] = ["keyboards", "earphones", "accessories"];

  constructor() { }

  ngOnInit(): void {
  }

  onCategoryChange(category: string): void {
    this.showCategory.emit(category);
  }
}
