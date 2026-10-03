import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { Button } from '../../../shared/components/button/button';
import { CategoryFilter } from '../../../shared/components/category-filter/category-filter';
import { HighlightsCard } from '../../../shared/components/highlights-card/highlights-card';
import { SiteHeader } from '../../../shared/components/site-header/site-header';
import { SurveyListItem } from '../../../shared/components/survey-list-item/survey-list-item';
import { Survey } from '../../../shared/models/survey';
import { SurveyService } from '../../../shared/services/survey-service';
import {
  ENDING_SOON_DAYS,
  isEndingSoon,
  isSurveyActive,
  sortByEndDate,
} from '../../../shared/utils/survey-utils';
import { CreateSurveyLauncher } from '../../create-survey/create-survey-launcher';
import { HeroVisual } from '../hero-visual/hero-visual';

export type SurveyTab = 'active' | 'past';

@Component({
  selector: 'app-home-page',
  imports: [Button, CategoryFilter, HeroVisual, HighlightsCard, SiteHeader, SurveyListItem],
  styleUrl: './home-page.scss',
  templateUrl: './home-page.html',
})
export class HomePage implements OnInit {
  private readonly surveyService = inject(SurveyService);
  private readonly launcher = inject(CreateSurveyLauncher);
  private readonly categoryIdsByTab = signal<Record<SurveyTab, number | null>>({
    active: null,
    past: null,
  });

  protected readonly endingSoonDays = ENDING_SOON_DAYS;
  protected readonly activeTab = signal<SurveyTab>('active');
  protected readonly isLoading = signal<boolean>(true);
  protected readonly hasLoadError = signal<boolean>(false);
  protected readonly selectedCategoryId = computed<number | null>(
    () => this.categoryIdsByTab()[this.activeTab()],
  );
  protected readonly endingSoonSurveys = computed<Survey[]>(() =>
    sortByEndDate(this.surveyService.surveys().filter((survey) => isEndingSoon(survey))),
  );
  protected readonly visibleSurveys = computed<Survey[]>(() => this.findVisibleSurveys());

  /** Loads all surveys when the page opens. */
  ngOnInit(): void {
    this.loadSurveys();
  }

  /** Opens the dialog for creating a new survey. */
  protected openCreateDialog(): void {
    this.launcher.open();
  }

  /** Switches between running and ended surveys. */
  protected selectTab(tab: SurveyTab): void {
    this.activeTab.set(tab);
  }

  /** Stores the category filter separately for each tab, so both lists stay independent. */
  protected selectCategory(categoryId: number | null): void {
    this.categoryIdsByTab.update((categoryIds) => ({
      ...categoryIds,
      [this.activeTab()]: categoryId,
    }));
  }

  /** Loads the surveys and remembers whether it failed. */
  private async loadSurveys(): Promise<void> {
    try {
      await this.surveyService.loadSurveys();
    } catch (error: unknown) {
      console.error(error);
      this.hasLoadError.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }

  /** Returns the surveys of the current tab and category; running ones by nearest end, past ones newest first. */
  private findVisibleSurveys(): Survey[] {
    const isActiveTab = this.activeTab() === 'active';
    const categoryId = this.selectedCategoryId();
    const surveys = this.surveyService
      .surveys()
      .filter((survey) => isSurveyActive(survey) === isActiveTab)
      .filter((survey) => categoryId === null || survey.categoryId === categoryId);
    const sortedSurveys = sortByEndDate(surveys);
    return isActiveTab ? sortedSurveys : sortedSurveys.reverse();
  }
}
