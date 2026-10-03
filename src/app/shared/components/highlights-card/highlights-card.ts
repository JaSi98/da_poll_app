import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Survey } from '../../models/survey';
import { getDaysLeft } from '../../utils/date-utils';
import { DeadlineBadge } from '../deadline-badge/deadline-badge';

const SURVEY_ROUTE = '/surveys';

@Component({
  selector: 'app-highlights-card',
  imports: [RouterLink, DeadlineBadge],
  templateUrl: './highlights-card.html',
})
export class HighlightsCard {
  readonly survey = input.required<Survey>();

  protected readonly isHovered = signal<boolean>(false);
  protected readonly surveyLink = computed<string>(() => `${SURVEY_ROUTE}/${this.survey().id}`);
  protected readonly daysLeft = computed<number | null>(() => this.getRemainingDays());

  /** Stores whether the pointer is over the card to highlight the badge. */
  protected setHovered(isHovered: boolean): void {
    this.isHovered.set(isHovered);
  }

  /** Returns the remaining days, or null if the survey has no end date. */
  private getRemainingDays(): number | null {
    const endDate = this.survey().endDate;
    return endDate ? getDaysLeft(endDate) : null;
  }
}
