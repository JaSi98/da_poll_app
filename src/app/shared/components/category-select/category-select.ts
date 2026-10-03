import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';

import { DropdownOption, DropdownValue } from '../../models/dropdown-option';
import { CategoryService } from '../../services/category-service';
import { toCategoryOptions } from '../../utils/category-utils';
import { Dropdown } from '../dropdown/dropdown';

let nextCategorySelectId = 0;

@Component({
  selector: 'app-category-select',
  imports: [Dropdown],
  styleUrl: './category-select.scss',
  templateUrl: './category-select.html',
  host: { '(focusout)': 'markAsTouched()' },
})
export class CategorySelect implements ControlValueAccessor, OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly ngControl = inject(NgControl, { self: true, optional: true });
  private readonly destroyRef = inject(DestroyRef);
  private onChange: (categoryId: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  protected readonly errorId = `category-select-error-${nextCategorySelectId++}`;
  protected readonly selectedCategoryId = signal<number | null>(null);
  protected readonly isDisabled = signal<boolean>(false);
  protected readonly hasError = signal<boolean>(false);
  protected readonly categoryOptions = computed<DropdownOption[]>(() =>
    toCategoryOptions(this.categoryService.categories()),
  );

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  /** Loads the categories and watches the form control for error changes. */
  ngOnInit(): void {
    this.categoryService.loadCategories().catch((error: unknown) => console.error(error));
    const control = this.ngControl?.control;
    if (!control) {
      return;
    }
    control.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateErrorState(control));
  }

  /** Writes a category id from the form model into the dropdown. */
  writeValue(categoryId: number | null): void {
    this.selectedCategoryId.set(categoryId);
  }

  /** Registers the callback that reports value changes to the form. */
  registerOnChange(onChange: (categoryId: number | null) => void): void {
    this.onChange = onChange;
  }

  /** Registers the callback that reports the touched state to the form. */
  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  /** Enables or disables the dropdown when the form control does. */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  /** Stores the chosen category and reports it to the form. */
  protected selectCategory(value: DropdownValue): void {
    const categoryId = typeof value === 'number' ? value : null;
    this.selectedCategoryId.set(categoryId);
    this.onChange(categoryId);
  }

  /** Reports to the form that the user has left the dropdown. */
  protected markAsTouched(): void {
    this.onTouched();
  }

  /** Shows the error only after the user has interacted with an invalid dropdown. */
  private updateErrorState(control: AbstractControl): void {
    this.hasError.set(control.invalid && control.touched);
  }
}
