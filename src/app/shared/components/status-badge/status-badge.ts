import { Component, computed, input } from '@angular/core';

export type SurveyStatus = 'draft' | 'published';

const STATUS_LABELS: Record<SurveyStatus, string> = {
  draft: 'Draft',
  published: 'Published',
};

@Component({
  selector: 'app-status-badge',
  styleUrl: './status-badge.scss',
  templateUrl: './status-badge.html',
})
export class StatusBadge {
  readonly status = input.required<SurveyStatus>();

  protected readonly label = computed<string>(() => STATUS_LABELS[this.status()]);
}
