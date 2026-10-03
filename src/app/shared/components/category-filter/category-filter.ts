import { Component, OnInit, computed, inject, model } from '@angular/core';

import { DropdownOption, DropdownValue } from '../../models/dropdown-option';
import { CategoryService } from '../../services/category-service';
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
    ...this.categoryService.categories().map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ]);
  protected readonly selectedCategoryName = computed<string | null>(() =>
    this.findSelectedCategoryName(),
  );

  /** Loads the categories as soon as the filter is shown. */
  ngOnInit(): void {
    this.categoryService.loadCategories().catch((error: unknown) => console.error(error));
  }

  /** Stores the chosen category; "All Surveys" resets the filter to null. */
  protected selectCategory(value: DropdownValue): void {
    this.selectedCategoryId.set(typeof value === 'number' ? value : null);
  }

  /** Returns the name of the selected category, or null when all surveys are shown. */
  private findSelectedCategoryName(): string | null {
    const selectedId = this.selectedCategoryId();
    const selectedCategory = this.categoryService
      .categories()
      .find((category) => category.id === selectedId);
    return selectedCategory?.name ?? null;
  }
}
