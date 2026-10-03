import { Category } from '../models/category';
import { DropdownOption } from '../models/dropdown-option';

/** Converts categories into dropdown options with the id as value and the name as label. */
export function toCategoryOptions(categories: Category[]): DropdownOption[] {
  return categories.map((category) => ({ value: category.id, label: category.name }));
}
