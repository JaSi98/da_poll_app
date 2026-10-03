import { Injectable, inject, signal } from '@angular/core';

import { Category } from '../models/category';
import { SupabaseService } from './supabase-service';

const CATEGORY_TABLE = 'categories';
const CATEGORY_COLUMNS = 'id, name';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly supabase = inject(SupabaseService);
  private readonly categoryList = signal<Category[]>([]);

  readonly categories = this.categoryList.asReadonly();

  /** Loads all categories from the database, ordered by id. */
  async loadCategories(): Promise<void> {
    const { data, error } = await this.supabase.client
      .from(CATEGORY_TABLE)
      .select(CATEGORY_COLUMNS)
      .order('id')
      .returns<Category[]>();
    if (error) {
      throw new Error(`Loading categories failed: ${error.message}`);
    }
    this.categoryList.set(data ?? []);
  }
}
