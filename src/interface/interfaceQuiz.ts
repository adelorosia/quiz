export interface IQuestions {
  id: number;
  type: string;
  question: string;
  choices: string;
  correct_answers: string;
  score: number;
}

export interface IExtraInfo {
  time: number;
  totalQuestion: number;
}

export interface ISelectedAnswers {
  id: number;
  userAnswer: string[];
}

