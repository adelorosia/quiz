export interface IQuestions {
  _id: string;
  type: string;
  question: string;
  choices: string;
  correct_answers: string;
  score: number;
}

export interface IUsers {
  _id: string;
  _userSpzialId: string;
  fullName: string;
  email: string;
  correctAnswers: number;
  IncorrectAnswers: number;
  totalScore: number;
}

export interface IExtraInfo {
  time: number;
  totalQuestion: number;
}

export interface ISelectedAnswers {
  id: string;
  userAnswer: string[];
}
