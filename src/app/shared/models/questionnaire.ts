export interface QuestionnaireOption {
  label: string;
  name: string;
  value?: any;
}

export interface QuestionnaireQuestion {
  name: string;
  options: QuestionnaireOption[];
}

export interface QuestionnaireSection {
  name: string;
  questions: QuestionnaireQuestion[];
}

export interface Questionnaire {
  name: string;
  sections: QuestionnaireSection[];
}
