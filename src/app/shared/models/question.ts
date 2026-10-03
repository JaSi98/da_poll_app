import { Answer } from './answer';

export interface Question {
  id: string;
  text: string;
  isMultipleChoice: boolean;
  answers: Answer[];
}
