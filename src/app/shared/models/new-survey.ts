export interface NewQuestion {
  text: string;
  isMultipleChoice: boolean;
  answers: string[];
}

export interface NewSurvey {
  title: string;
  description: string | null;
  endDate: string | null;
  categoryId: number;
  questions: NewQuestion[];
}
