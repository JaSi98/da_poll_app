import { Answer } from './answer';

export interface Question {
  id: number;
  text: string;
  isMultipleChoice: boolean;
  answers: Answer[];
}
