import { Component, computed, input, model } from '@angular/core';

import { Answer } from '../../models/answer';
import { getOptionLetter } from '../../utils/option-letter-utils';
import { Checkbox, CheckboxType } from '../checkbox/checkbox';

@Component({
  selector: 'app-answer-option',
  imports: [Checkbox],
  styleUrl: './answer-option.scss',
  templateUrl: './answer-option.html',
})
export class AnswerOption {
  readonly answer = input.required<Answer>();
  readonly index = input.required<number>();
  readonly groupName = input.required<string>();
  readonly isMultipleChoice = input<boolean>(false);
  readonly isDisabled = input<boolean>(false);
  readonly checked = model<boolean>(false);

  protected readonly optionLetter = computed<string>(() => getOptionLetter(this.index()));
  protected readonly inputType = computed<CheckboxType>(() =>
    this.isMultipleChoice() ? 'checkbox' : 'radio',
  );
}
