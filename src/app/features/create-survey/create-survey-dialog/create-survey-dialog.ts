import {
  Component,
  ElementRef,
  afterRenderEffect,
  inject,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';

import { Button } from '../../../shared/components/button/button';
import { CategorySelect } from '../../../shared/components/category-select/category-select';
import { IconButton } from '../../../shared/components/icon-button/icon-button';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { TextField } from '../../../shared/components/text-field/text-field';
import { SurveyService } from '../../../shared/services/survey-service';
import { CreateQuestion } from '../create-question/create-question';
import {
  QuestionFormGroup,
  createQuestionFormGroup,
  createSurveyFormGroup,
  toNewSurvey,
} from '../create-survey-form';

type ClearableField = 'title' | 'endDate' | 'description';

@Component({
  selector: 'app-create-survey-dialog',
  imports: [
    ReactiveFormsModule,
    Button,
    CategorySelect,
    CreateQuestion,
    IconButton,
    StatusBadge,
    TextField,
  ],
  styleUrl: './create-survey-dialog.scss',
  templateUrl: './create-survey-dialog.html',
})
export class CreateSurveyDialog {
  private readonly surveyService = inject(SurveyService);
  private readonly dialogElement = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  readonly isOpen = model<boolean>(false);
  readonly published = output<number>();

  protected readonly surveyForm = createSurveyFormGroup();
  protected readonly isPublishing = signal<boolean>(false);
  protected readonly hasPublishError = signal<boolean>(false);

  constructor() {
    afterRenderEffect(() => this.syncDialog(this.isOpen()));
  }

  /** Returns the question forms of the survey. */
  protected get questions(): FormArray<QuestionFormGroup> {
    return this.surveyForm.controls.questions;
  }

  /** Empties the field next to the clicked trash icon. */
  protected clearField(field: ClearableField): void {
    this.surveyForm.controls[field].setValue('');
  }

  /** Appends a new empty question. */
  protected addQuestion(): void {
    this.questions.push(createQuestionFormGroup());
  }

  /** Deletes the question at the given position. */
  protected removeQuestion(questionIndex: number): void {
    this.questions.removeAt(questionIndex);
  }

  /** Closes the dialog without saving; the entries are discarded. */
  protected cancel(): void {
    this.isOpen.set(false);
  }

  /** Runs after every way of closing (Cancel, Esc, publish) and starts the next survey fresh. */
  protected handleClose(): void {
    this.isOpen.set(false);
    this.resetForm();
  }

  /** Validates the form and saves the survey if every required field is filled. */
  protected async publish(): Promise<void> {
    this.surveyForm.markAllAsTouched();
    if (this.surveyForm.invalid || this.isPublishing()) {
      return;
    }
    await this.saveSurvey();
  }

  /** Saves the survey, reports its id to the parent and closes the dialog. */
  private async saveSurvey(): Promise<void> {
    this.isPublishing.set(true);
    this.hasPublishError.set(false);
    try {
      const surveyId = await this.surveyService.createSurvey(toNewSurvey(this.surveyForm));
      this.published.emit(surveyId);
      this.isOpen.set(false);
    } catch (error: unknown) {
      console.error(error);
      this.hasPublishError.set(true);
    } finally {
      this.isPublishing.set(false);
    }
  }

  /** Opens the native dialog as a modal or closes it, depending on isOpen. */
  private syncDialog(isOpen: boolean): void {
    const dialog = this.dialogElement().nativeElement;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    }
    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }

  /** Restores the empty form with exactly one question. */
  private resetForm(): void {
    this.surveyForm.reset();
    this.questions.clear();
    this.questions.push(createQuestionFormGroup());
    this.hasPublishError.set(false);
  }
}
