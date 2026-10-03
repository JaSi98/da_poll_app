import { Component, computed, input, output } from '@angular/core';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';

import { Button } from '../../../shared/components/button/button';
import { Checkbox } from '../../../shared/components/checkbox/checkbox';
import { IconButton } from '../../../shared/components/icon-button/icon-button';
import { TextField } from '../../../shared/components/text-field/text-field';
import { getOptionLetter } from '../../../shared/utils/option-letter-utils';
import { MIN_ANSWER_COUNT, QuestionFormGroup, createAnswerControl } from '../create-survey-form';

@Component({
  selector: 'app-create-question',
  imports: [ReactiveFormsModule, Button, Checkbox, IconButton, TextField],
  styleUrl: './create-question.scss',
  templateUrl: './create-question.html',
})
export class CreateQuestion {
  readonly questionForm = input.required<QuestionFormGroup>();
  readonly index = input.required<number>();
  readonly canRemove = input<boolean>(true);

  readonly remove = output<void>();

  protected readonly questionNumber = computed<number>(() => this.index() + 1);

  /** Returns the answer fields of this question. */
  protected get answers(): FormArray<FormControl<string>> {
    return this.questionForm().controls.answers;
  }

  /** Returns whether an answer may be deleted without going below the minimum. */
  protected get canRemoveAnswer(): boolean {
    return this.answers.length > MIN_ANSWER_COUNT;
  }

  /** Returns the option letter for the answer at the given position. */
  protected getLetter(answerIndex: number): string {
    return getOptionLetter(answerIndex);
  }

  /** Appends a new empty answer field. */
  protected addAnswer(): void {
    this.answers.push(createAnswerControl());
  }

  /** Deletes the answer at the given position if the minimum is not reached yet. */
  protected removeAnswer(answerIndex: number): void {
    if (this.canRemoveAnswer) {
      this.answers.removeAt(answerIndex);
    }
  }

  /** Stores whether voters may choose more than one answer. */
  protected setMultipleChoice(isMultipleChoice: boolean): void {
    this.questionForm().controls.isMultipleChoice.setValue(isMultipleChoice);
  }

  /** Asks the survey form to delete this question. */
  protected requestRemove(): void {
    this.remove.emit();
  }
}
