export interface QuestionsList {
  name?: string;
  author?: string;
  link?:{
    [key: string]: URL;
  }
  questions: Question[];
}

export interface Question {
  id: number;
  question: string;
  answer: string | string[];
  answers: {
    [key: string]: string;
  };
  tag?: string[];
}