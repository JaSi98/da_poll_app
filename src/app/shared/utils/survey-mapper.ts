import { Answer } from '../models/answer';
import { AnswerRow, QuestionRow, SurveyDetailRow, SurveyRow } from '../models/database-rows';
import { Question } from '../models/question';
import { Survey, SurveyDetail } from '../models/survey';
import { toEndOfDay } from './date-utils';

/** Converts a survey row from the database into the app model. */
export function toSurvey(row: SurveyRow): Survey {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    endDate: row.end_date ? toEndOfDay(row.end_date) : null,
    categoryId: row.category_id,
    categoryName: row.categories?.name ?? '',
  };
}

/** Converts a survey row with questions and answers into the detail model, in their saved order. */
export function toSurveyDetail(row: SurveyDetailRow): SurveyDetail {
  return { ...toSurvey(row), questions: sortByPosition(row.questions).map(toQuestion) };
}

/** Converts a question row with its answers into the app model. */
function toQuestion(row: QuestionRow): Question {
  return {
    id: row.id,
    text: row.text,
    isMultipleChoice: row.is_multiple_choice,
    answers: sortByPosition(row.answers).map(toAnswer),
  };
}

/** Converts an answer row into the app model. */
function toAnswer(row: AnswerRow): Answer {
  return { id: row.id, text: row.text, votes: row.votes };
}

/** Returns the rows sorted by their saved position. */
function sortByPosition<T extends { position: number }>(rows: T[]): T[] {
  return [...rows].sort((first, second) => first.position - second.position);
}
