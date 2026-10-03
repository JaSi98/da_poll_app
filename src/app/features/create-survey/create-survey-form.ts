import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { NewQuestion, NewSurvey } from '../../shared/models/new-survey';

export const MIN_ANSWER_COUNT = 2;

export interface QuestionForm {
  text: FormControl<string>;
  isMultipleChoice: FormControl<boolean>;
  answers: FormArray<FormControl<string>>;
}

export type QuestionFormGroup = FormGroup<QuestionForm>;

export interface SurveyForm {
  title: FormControl<string>;
  endDate: FormControl<string>;
  categoryId: FormControl<number | null>;
  description: FormControl<string>;
  questions: FormArray<QuestionFormGroup>;
}

export type SurveyFormGroup = FormGroup<SurveyForm>;

/** Rejects empty text and text that consists only of whitespace. */
export function requiredText(control: AbstractControl<string | null>): ValidationErrors | null {
  const hasText = (control.value ?? '').trim().length > 0;
  return hasText ? null : { required: true };
}

/** Creates a required, empty answer field. */
export function createAnswerControl(): FormControl<string> {
  return new FormControl('', { nonNullable: true, validators: requiredText });
}

/** Creates a question with an empty text and the minimum number of answers. */
export function createQuestionFormGroup(): QuestionFormGroup {
  const answers = Array.from({ length: MIN_ANSWER_COUNT }, () => createAnswerControl());
  return new FormGroup<QuestionForm>({
    text: new FormControl('', { nonNullable: true, validators: requiredText }),
    isMultipleChoice: new FormControl(false, { nonNullable: true }),
    answers: new FormArray(answers),
  });
}

/** Creates an empty survey form with one question. */
export function createSurveyFormGroup(): SurveyFormGroup {
  return new FormGroup<SurveyForm>({
    title: new FormControl('', { nonNullable: true, validators: requiredText }),
    endDate: new FormControl('', { nonNullable: true }),
    categoryId: new FormControl<number | null>(null, Validators.required),
    description: new FormControl('', { nonNullable: true }),
    questions: new FormArray([createQuestionFormGroup()]),
  });
}

/** Converts the valid survey form into the data that is saved; empty optional fields become null. */
export function toNewSurvey(surveyForm: SurveyFormGroup): NewSurvey {
  const value = surveyForm.getRawValue();
  return {
    title: value.title.trim(),
    description: value.description.trim() || null,
    endDate: value.endDate || null,
    categoryId: value.categoryId as number,
    questions: value.questions.map(toNewQuestion),
  };
}

/** Converts one question of the form into the data that is saved. */
function toNewQuestion(question: NewQuestion): NewQuestion {
  return {
    text: question.text.trim(),
    isMultipleChoice: question.isMultipleChoice,
    answers: question.answers.map((answer) => answer.trim()),
  };
}
