export interface AnswerRow {
  id: number;
  position: number;
  text: string;
  votes: number;
}

export interface QuestionRow {
  id: number;
  position: number;
  text: string;
  is_multiple_choice: boolean;
  answers: AnswerRow[];
}

export interface SurveyRow {
  id: number;
  title: string;
  description: string | null;
  end_date: string | null;
  category_id: number;
  categories: { name: string } | null;
}

export interface SurveyDetailRow extends SurveyRow {
  questions: QuestionRow[];
}
