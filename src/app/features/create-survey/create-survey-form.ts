import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

export const MIN_ANSWER_COUNT = 2;

export interface QuestionForm {
  text: FormControl<string>;
  isMultipleChoice: FormControl<boolean>;
  answers: FormArray<FormControl<string>>;
}

export type QuestionFormGroup = FormGroup<QuestionForm>;

/** Creates a required, empty answer field. */
export function createAnswerControl(): FormControl<string> {
  return new FormControl('', { nonNullable: true, validators: Validators.required });
}

/** Creates a question with an empty text and the minimum number of answers. */
export function createQuestionFormGroup(): QuestionFormGroup {
  const answers = Array.from({ length: MIN_ANSWER_COUNT }, () => createAnswerControl());
  return new FormGroup<QuestionForm>({
    text: new FormControl('', { nonNullable: true, validators: Validators.required }),
    isMultipleChoice: new FormControl(false, { nonNullable: true }),
    answers: new FormArray(answers),
  });
}
