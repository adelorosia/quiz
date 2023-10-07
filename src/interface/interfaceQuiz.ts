export interface IQuestions {
  _id: string;
  type: string;
  question: string;
  choices: string;
  correct_answers: string;
  score: number;
}

export interface IUsers{
  _id:number;
  fullName:string;
  email:string;
  correctAnswers:string;
  IncorrectAnswers:string;
  totalScore:string
}

export interface IExtraInfo {
  time: number;
  totalQuestion: number;
}

export interface ISelectedAnswers {
  id: string;
  userAnswer: string[];
}

