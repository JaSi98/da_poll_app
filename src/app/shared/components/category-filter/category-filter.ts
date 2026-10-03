import { Component, OnInit, computed, inject, model } from '@angular/core';

import { DropdownOption, DropdownValue } from '../../models/dropdown-option';
import { CategoryService } from '../../services/category-service';
import { toCategoryOptions } from '../../utils/category-utils';
import { Dropdown } from '../dropdown/dropdown';

const ALL_SURVEYS_OPTION: DropdownOption = { value: null, label: 'All Surveys' };

@Component({
  selector: 'app-category-filter',
  imports: [Dropdown],
  styleUrl: './category-filter.scss',
  templateUrl: './category-filter.html',
})
export class CategoryFilter implements OnInit {
  private readonly categoryService = inject(CategoryService);

  readonly selectedCategoryId = model<number | null>(null);

  protected readonly categoryOptions = computed<DropdownOption[]>(() => [
    ALL_SURVEYS_OPTION,
    ...toCategoryOptions(this.categoryService.categories()),
  ]);

  /** Loads the categories as soon as the filter is shown. */
  ngOnInit(): void {
    this.categoryService.loadCategories().catch((error: unknown) => console.error(error));
  }

  /** Stores the chosen category; "All Surveys" resets the filter to null. */
  protected selectCategory(value: DropdownValue): void {
    this.selectedCategoryId.set(typeof value === 'number' ? value : null);
  }
}
