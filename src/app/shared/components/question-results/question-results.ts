import { Component, computed, input } from '@angular/core';

import { Question } from '../../models/question';
import { getOptionLetter } from '../../utils/option-letter-utils';
import { ResultBar } from '../result-bar/result-bar';

@Component({
  selector: 'app-question-results',
  imports: [ResultBar],
  styleUrl: './question-results.scss',
  templateUrl: './question-results.html',
})
export class QuestionResults {
  readonly question = input.required<Question>();
  readonly index = input.required<number>();

  protected readonly questionNumber = computed<number>(() => this.index() + 1);
  protected readonly totalVotes = computed<number>(() => this.sumVotes());

  /** Returns the option letter for the answer at the given position. */
  protected getLetter(answerIndex: number): string {
    return getOptionLetter(answerIndex);
  }

  /** Returns the sum of all votes given for this question. */
  private sumVotes(): number {
    return this.question().answers.reduce((total, answer) => total + answer.votes, 0);
  }
}
