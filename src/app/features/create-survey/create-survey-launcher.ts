import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CreateSurveyLauncher {
  readonly isDialogOpen = signal<boolean>(false);
  readonly publishedSurveyId = signal<number | null>(null);

  /** Opens the dialog for creating a new survey. */
  open(): void {
    this.isDialogOpen.set(true);
  }

  /** Shows the confirmation for the survey that was just published. */
  handlePublished(surveyId: number): void {
    this.publishedSurveyId.set(surveyId);
  }
}
