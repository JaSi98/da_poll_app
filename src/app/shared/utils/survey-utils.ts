import { SurveyDetail, Survey } from '../models/survey';
import { getDaysLeft } from './date-utils';

export const ENDING_SOON_DAYS = 3;

/** Returns whether voting is still possible; surveys without end date never end. */
export function isSurveyActive(survey: Survey, now: Date = new Date()): boolean {
  return survey.endDate === null || survey.endDate.getTime() > now.getTime();
}

/** Returns whether an active survey ends within the next ENDING_SOON_DAYS days. */
export function isEndingSoon(survey: Survey, now: Date = new Date()): boolean {
  if (survey.endDate === null || !isSurveyActive(survey, now)) {
    return false;
  }
  return getDaysLeft(survey.endDate, now) <= ENDING_SOON_DAYS;
}

/** Sorts surveys by end date, earliest first; surveys without end date come last. */
export function sortByEndDate(surveys: Survey[]): Survey[] {
  return [...surveys].sort((first, second) => getEndTime(first) - getEndTime(second));
}

/** Returns a copy of the survey in which the given answer has the new number of votes. */
export function withUpdatedVotes(
  survey: SurveyDetail,
  answerId: number,
  votes: number,
): SurveyDetail {
  const questions = survey.questions.map((question) => ({
    ...question,
    answers: question.answers.map((answer) =>
      answer.id === answerId ? { ...answer, votes } : answer,
    ),
  }));
  return { ...survey, questions };
}

/** Returns the end time for sorting; a missing end date counts as infinitely far away. */
function getEndTime(survey: Survey): number {
  return survey.endDate?.getTime() ?? Number.POSITIVE_INFINITY;
}
