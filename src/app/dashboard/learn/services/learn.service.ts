import { Injectable } from '@angular/core';

import { LearnSubject, LearnSubjects } from '../model';

const SUBJECTS: LearnSubject[] = [
  {
    image: 'https://firebasestorage.googleapis.com/v0/b/angularfire-material-dashboard.appspot.com/o/learn%2Fhanan-edwards-1399891-unsplash.jpg?alt=media&token=92917153-76f4-488f-a0a1-98e63d93cdcc',
    imageCredit: 'Hanan Edwards',
    objectives: ['How does the environment impact our health?'],
    references: [
      {
        description: '',
        url: ''
      }
    ],
    summary: 'How does the environment impact our health?',
    url: LearnSubjects.environment,
    text: '',
    title: 'Environment'
  },
  {
    image: 'https://firebasestorage.googleapis.com/v0/b/angularfire-material-dashboard.appspot.com/o/learn%2Fjohn-fornander-1350723-unsplash.jpg?alt=media&token=3435a50a-4ec6-4144-a9ce-55d3289d0031',
    imageCredit: 'John Fornander',
    objectives: ['What is the secret to lifetime fitness?'],
    references: [
      {
        description: '',
        url: ''
      }
    ],
    summary: 'What is the secret to lifetime fitness?',
    url: LearnSubjects.fitness,
    text: '',
    title: 'Fitness'
  },
  {
    image: 'https://firebasestorage.googleapis.com/v0/b/angularfire-material-dashboard.appspot.com/o/learn%2F07BRODY-superJumbo.jpg?alt=media&token=faec2ce1-714e-4eea-bfaf-ca2855723b0c',
    imageCredit: 'Paul Rogers',
    objectives: ['What is the microbiome and how does it influence our health?'],
    references: [
      {
        description: '',
        url: ''
      }
    ],
    summary: 'What is the microbiome and how does it influence our health?',
    url: LearnSubjects.microbiome,
    text: '',
    title: 'Microbiome'
  },
  {
    image: 'https://firebasestorage.googleapis.com/v0/b/angularfire-material-dashboard.appspot.com/o/learn%2Freinaldo-kevin-552322-unsplash.jpg?alt=media&token=e3ad5909-db9f-4c28-b326-7bf01ec5c01a',
    imageCredit: 'Reinaldo Kevin',
    objectives: ['Understanding the definition of nutrition', 'How are nutrients classified'],
    references: [
      {
        description: 'Eric Widmaier, Hershel Raff, Kevin Strang, "Vander\'s Human Physiology: The Mechanisms' +
          ' of Body Function, 13th Edition"',
        url: 'https://www.amazon.com/Vanders-Human-Physiology-Mechanisms-Function/dp/0073378305'
      }, {
        description: 'Janice J. Thomson, Melinda Manore, Linda Vaughan, "The Science of Nutrition, Second Edition"',
        url: 'https://www.amazon.com/Science-Nutrition-2nd-Janice-Thompson/dp/032164316X'
      }, {
        description: 'Wikibooks, "Human Physiology", Nutrition',
        url: 'https://en.wikibooks.org/wiki/Human_Physiology/Nutrition'
      }, {
        description: 'Jennifer J. Otten, Jennifer Pitzi Hellwig, Linda D. Meyers, Editors, "Dietary Reference Intakes: The Essential Guide' +
          ' to Nutrient Requirements"',
        url: 'https://www.nap.edu/catalog/11537/dietary-reference-intakes-the-essential-guide-to-nutrient-requirements'
      }, {
        description: 'William Davis, "Wheat Belly: Lose the Wheat, Lose the Weight, and Find Your Path Back to Health"',
        url: 'https://www.amazon.com/Wheat-Belly-Lose-Weight-Health-ebook/dp/B00571F26Y/ref=tmm_kin_swatch_0?_encoding=UTF8&qid=&sr='
      }, {
        description: 'David Perlmutter, "Grain Brain: The Surprising Truth about Wheat, Carbs, and Sugar - Your Brain\'s Silent Killers"',
        url: 'https://www.amazon.com/Grain-Brain-Surprising-Brains-Killers-ebook/dp/B00H4EPCGW/ref=tmm_kin_swatch_0?_encoding=UTF8&qid=&sr='
      }, {
        description: 'Catherine Saxelby, Food watch, "48 shades of hidden sugars!"',
        url: 'https://foodwatch.com.au/blog/carbs-sugars-and-fibres/item/48-shades-of-hidden-sugars.html'
      }, {
        description: 'Dr. Joseph Mercola, "The Cholesterol Myth Has Been Busted — Yet Again"',
        url: 'https://articles.mercola.com/sites/articles/archive/2017/05/03/cholesterol-myth-busted.aspx'
      }
    ],
    summary: 'What is the science of nutrition and why is it important?',
    url: LearnSubjects.nutrition,
    text: '',
    title: 'Nutrition'
  },
  {
    image: 'https://firebasestorage.googleapis.com/v0/b/angularfire-material-dashboard.appspot.com/o/learn%2Fmi-pham-223464-unsplash.jpg?alt=media&token=07a25a2d-07b2-4b56-a691-d70c5bd6ea7d',
    imageCredit: 'Mi Pham',
    objectives: ['How to heal, recover, and be full of energy 24/7?'],
    references: [
      {
        description: '',
        url: ''
      }
    ],
    summary: 'How to heal, recover, and be full of energy 24/7?',
    url: LearnSubjects.vitality,
    text: '',
    title: 'Vitality'
  }
];

@Injectable({
  providedIn: 'root'
})
export class LearnService {

  constructor() {
  }

  public static getSubject(url: string): LearnSubject {
    return SUBJECTS.find((s: LearnSubject) => s.url === url);
  }

  public static getSubjects(): LearnSubject[] {
    return SUBJECTS;
  }
}
