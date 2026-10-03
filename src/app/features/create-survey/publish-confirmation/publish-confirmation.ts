import { Component, computed, effect, inject, model } from '@angular/core';
import { Router } from '@angular/router';

const AUTO_HIDE_DELAY_MS = 5000;
const SURVEY_ROUTE = '/surveys';

@Component({
  selector: 'app-publish-confirmation',
  styleUrl: './publish-confirmation.scss',
  templateUrl: './publish-confirmation.html',
})
export class PublishConfirmation {
  private readonly router = inject(Router);

  readonly surveyId = model<number | null>(null);

  protected readonly isVisible = computed<boolean>(() => this.surveyId() !== null);

  constructor() {
    effect((onCleanup) => {
      if (this.surveyId() === null) {
        return;
      }
      const timerId = setTimeout(() => this.hide(), AUTO_HIDE_DELAY_MS);
      onCleanup(() => clearTimeout(timerId));
    });
  }

  /** Hides the confirmation and opens the survey that was just published. */
  protected openSurvey(): void {
    const surveyId = this.surveyId();
    this.hide();
    this.router.navigate([SURVEY_ROUTE, surveyId]);
  }

  /** Removes the confirmation from the screen. */
  private hide(): void {
    this.surveyId.set(null);
  }
}
