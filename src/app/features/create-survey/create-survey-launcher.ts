import { Injectable, inject, signal } from '@angular/core';

import { SurveyService } from '../../shared/services/survey-service';

@Injectable({ providedIn: 'root' })
export class CreateSurveyLauncher {
  private readonly surveyService = inject(SurveyService);

  readonly isDialogOpen = signal<boolean>(false);
  readonly publishedSurveyId = signal<number | null>(null);

  /** Opens the dialog for creating a new survey. */
  open(): void {
    this.isDialogOpen.set(true);
  }

  /** Shows the confirmation and reloads the lists so the new survey appears. */
  handlePublished(surveyId: number): void {
    this.publishedSurveyId.set(surveyId);
    this.surveyService.loadSurveys().catch((error: unknown) => console.error(error));
  }
}
