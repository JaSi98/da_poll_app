import { DatePipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Button } from '../../../shared/components/button/button';
import { QuestionComponent } from '../../../shared/components/question/question';
import { QuestionResults } from '../../../shared/components/question-results/question-results';
import { SiteHeader } from '../../../shared/components/site-header/site-header';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { SurveyDetail } from '../../../shared/models/survey';
import { SurveyService } from '../../../shared/services/survey-service';
import { VotedSurveyStorage } from '../../../shared/services/voted-survey-storage';
import { isSurveyActive, withUpdatedVotes } from '../../../shared/utils/survey-utils';

const APP_NAME = 'Poll App';

type AnswerSelection = Record<number, number[]>;

@Component({
  selector: 'app-survey-detail-page',
  imports: [DatePipe, Button, QuestionComponent, QuestionResults, SiteHeader, StatusBadge],
  styleUrl: './survey-detail-page.scss',
  templateUrl: './survey-detail-page.html',
})
export class SurveyDetailPage {
  private readonly surveyService = inject(SurveyService);
  private readonly votedSurveyStorage = inject(VotedSurveyStorage);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly title = inject(Title);

  readonly id = input.required<string>();

  protected readonly survey = signal<SurveyDetail | null>(null);
  protected readonly hasLoadError = signal<boolean>(false);
  protected readonly hasVoted = signal<boolean>(false);
  protected readonly isSubmitting = signal<boolean>(false);
  protected readonly hasSubmitError = signal<boolean>(false);
  protected readonly hasMissingAnswers = signal<boolean>(false);
  protected readonly selection = signal<AnswerSelection>({});

  protected readonly isClosed = computed<boolean>(() => this.isSurveyClosed());
  protected readonly isVotingLocked = computed<boolean>(
    () => this.isClosed() || this.hasVoted() || this.isSubmitting(),
  );
  protected readonly hasResults = computed<boolean>(() => this.countAllVotes() > 0);
  protected readonly submitLabel = computed<string>(() => this.getSubmitLabel());

  constructor() {
    effect(() => {
      const surveyId = Number(this.id());
      untracked(() => this.loadSurvey(surveyId));
    });
    const stopWatchingVotes = this.surveyService.watchVotes((answerId, votes) =>
      this.applyVotes(answerId, votes),
    );
    this.destroyRef.onDestroy(stopWatchingVotes);
  }

  /** Returns the answers currently chosen for the given question. */
  protected getSelectedAnswerIds(questionId: number): number[] {
    return this.selection()[questionId] ?? [];
  }

  /** Stores the answers chosen for one question. */
  protected updateSelection(questionId: number, answerIds: number[]): void {
    this.selection.update((selection) => ({ ...selection, [questionId]: answerIds }));
    this.hasMissingAnswers.set(false);
  }

  /** Sends the votes if every question is answered, otherwise shows a hint. */
  protected async completeSurvey(): Promise<void> {
    if (this.isVotingLocked()) {
      return;
    }
    if (!this.isEveryQuestionAnswered()) {
      this.hasMissingAnswers.set(true);
      return;
    }
    await this.submitVotes();
  }

  /** Leaves the survey and returns to the overview. */
  protected closeSurvey(): void {
    this.router.navigate(['/']).catch((error: unknown) => console.error(error));
  }

  /** Loads the survey, shows its title in the browser tab and checks for an earlier vote. */
  private async loadSurvey(surveyId: number): Promise<void> {
    this.resetState();
    try {
      const survey = await this.surveyService.loadSurvey(surveyId);
      this.survey.set(survey);
      this.title.setTitle(`${survey.title} – ${APP_NAME}`);
      this.hasVoted.set(this.votedSurveyStorage.hasVoted(surveyId));
    } catch (error: unknown) {
      console.error(error);
      this.hasLoadError.set(true);
    }
  }

  /** Clears everything that belongs to a previously shown survey. */
  private resetState(): void {
    this.survey.set(null);
    this.hasLoadError.set(false);
    this.hasSubmitError.set(false);
    this.hasMissingAnswers.set(false);
    this.selection.set({});
  }

  /** Saves the chosen answers and locks the survey for this browser. */
  private async submitVotes(): Promise<void> {
    this.isSubmitting.set(true);
    this.hasSubmitError.set(false);
    try {
      await this.surveyService.submitVotes(Object.values(this.selection()).flat());
      this.votedSurveyStorage.markAsVoted(Number(this.id()));
      this.hasVoted.set(true);
    } catch (error: unknown) {
      console.error(error);
      this.hasSubmitError.set(true);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  /** Takes over a live vote change; changes of other surveys are ignored by the update. */
  private applyVotes(answerId: number, votes: number): void {
    this.survey.update((survey) => (survey ? withUpdatedVotes(survey, answerId, votes) : survey));
  }

  /** Returns whether at least one answer is chosen for every question. */
  private isEveryQuestionAnswered(): boolean {
    const questions = this.survey()?.questions ?? [];
    return questions.every((question) => this.getSelectedAnswerIds(question.id).length > 0);
  }

  /** Returns whether the loaded survey has already ended. */
  private isSurveyClosed(): boolean {
    const survey = this.survey();
    return survey !== null && !isSurveyActive(survey);
  }

  /** Returns the number of votes over all questions of the survey. */
  private countAllVotes(): number {
    const answers = this.survey()?.questions.flatMap((question) => question.answers) ?? [];
    return answers.reduce((total, answer) => total + answer.votes, 0);
  }

  /** Returns the button text for the current voting state. */
  private getSubmitLabel(): string {
    if (this.isClosed()) {
      return 'Survey ended';
    }
    return this.hasVoted() ? 'Thanks for voting' : 'Complete survey';
  }
}
