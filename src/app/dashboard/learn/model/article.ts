import { LearnSubjects } from 'app/dashboard/learn/model/learn-subjects.enum';

export interface Article {
  objectives: string[];
  references: ArticleReference[];
  subject: LearnSubjects;
  text: string;
  title: string;
}

export interface ArticleReference {
  description: string;
  url: string;
}
