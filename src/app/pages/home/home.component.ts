import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  columnsCount = 1;
  currentCategory: string | undefined;

  constructor() {}

  ngOnInit(): void {}

  onColumnsCountChange(columns: number): void {
    this.columnsCount = columns;
  }

  onShowCategoryChange(category: string): void {
    this.currentCategory = category;
  }
}
