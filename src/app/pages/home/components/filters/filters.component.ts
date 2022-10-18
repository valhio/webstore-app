import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { StoreService } from '../../../../services/store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Output() showCategory = new EventEmitter<string>();
  categories: string[] | undefined;
  categoriesSubscription: Subscription | undefined;

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  ngOnDestroy(): void {
    if (this.categoriesSubscription) {
      this.categoriesSubscription?.unsubscribe();
    }
  }

  getCategories(): void {
    this.categoriesSubscription = this.storeService
      .getAllCategories()
      .subscribe((_categories) => {
        this.categories = _categories;
      });
  }

  onCategoryChange(category: string): void {
    this.showCategory.emit(category);
  }
}
