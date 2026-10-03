import { Component, computed, input, model } from '@angular/core';

import { Question } from '../../models/question';
import { AnswerComponent } from '../answer/answer';
import { Checkbox } from '../checkbox/checkbox';

@Component({
  selector: 'app-question',
  imports: [AnswerComponent, Checkbox],
  styleUrl: './question.scss',
  templateUrl: './question.html',
})
export class QuestionComponent {
  readonly question = input.required<Question>();
  readonly index = input.required<number>();
  readonly isDisabled = input<boolean>(false);
  readonly selectedAnswerIds = model<string[]>([]);

  protected readonly questionNumber = computed<number>(() => this.index() + 1);

  /** Returns whether the answer with the given id is currently selected. */
  protected isAnswerSelected(answerId: string): boolean {
    return this.selectedAnswerIds().includes(answerId);
  }

  /** Updates the selection after an answer was checked or unchecked. */
  protected updateSelection(answerId: string, isChecked: boolean): void {
    if (this.question().isMultipleChoice) {
      this.toggleAnswer(answerId, isChecked);
      return;
    }
    if (isChecked) {
      this.selectedAnswerIds.set([answerId]);
    }
  }

  /** Adds or removes an answer in a multiple choice selection. */
  private toggleAnswer(answerId: string, isChecked: boolean): void {
    const otherAnswerIds = this.selectedAnswerIds().filter((id) => id !== answerId);
    this.selectedAnswerIds.set(isChecked ? [...otherAnswerIds, answerId] : otherAnswerIds);
  }
}
