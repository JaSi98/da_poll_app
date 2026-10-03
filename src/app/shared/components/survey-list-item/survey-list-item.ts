import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Survey } from '../../models/survey';
import { getDaysLeft } from '../../utils/date-utils';
import { DeadlineBadge } from '../deadline-badge/deadline-badge';

const SURVEY_ROUTE = '/surveys';

@Component({
  selector: 'app-survey-list-item',
  imports: [RouterLink, DeadlineBadge],
  styleUrl: './survey-list-item.scss',
  templateUrl: './survey-list-item.html',
})
export class SurveyListItem {
  readonly survey = input.required<Survey>();

  protected readonly surveyLink = computed<string>(() => `${SURVEY_ROUTE}/${this.survey().id}`);
  protected readonly daysLeft = computed<number | null>(() => this.getRemainingDays());

  /** Returns the remaining days, or null if the survey has no end date. */
  private getRemainingDays(): number | null {
    const endDate = this.survey().endDate;
    return endDate ? getDaysLeft(endDate) : null;
  }
}
