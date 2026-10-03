import { Component, input } from '@angular/core';

import { SiteHeader } from '../../../shared/components/site-header/site-header';

@Component({
  selector: 'app-survey-detail-page',
  imports: [SiteHeader],
  styleUrl: './survey-detail-page.scss',
  templateUrl: './survey-detail-page.html',
})
export class SurveyDetailPage {
  readonly id = input.required<string>();
}
