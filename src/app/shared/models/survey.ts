import { Question } from './question';

export interface Survey {
  id: number;
  title: string;
  description: string | null;
  endDate: Date | null;
  categoryId: number;
  categoryName: string;
}

export interface SurveyDetail extends Survey {
  questions: Question[];
}
