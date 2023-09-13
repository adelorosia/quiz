export interface IQuestions {
  id: number;
  type:string
  question: string;
  choices: string;
  score: number;
}

export interface IExtraInfo {
  time: number;
  totalQuestion: number;
}

export interface ISelectedAnswers{
  id:number
  userAnswer:string[]
}
