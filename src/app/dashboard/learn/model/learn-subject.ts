import { ArticleReference } from 'app/dashboard/learn/model/article';

export interface LearnSubject {
  image: string;
  imageCredit: string;
  objectives: string[];
  references: ArticleReference[];
  summary: string;
  text: string;
  title: string;
  url: string;
}
