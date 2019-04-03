import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as readingTime from 'reading-time';

import { LearnSubject, LearnSubjects } from '../model';
import { LearnService } from '../services';

@Component({
  selector: 'app-learn-details',
  templateUrl: './learn-details.component.html',
  styleUrls: ['./learn-details.component.scss']
})
export class LearnDetailsComponent implements OnInit {
  public mdSrc: string;
  public minutesToRead = 0;
  public subject: LearnSubject;
  private subjectId: LearnSubjects;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
  }

  public ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.subjectId = params.subject;
      this.subject = LearnService.getSubject(this.subjectId);
      this.mdSrc = `src/assets/articles/${this.subject.url}.md`;
      this.minutesToRead = Math.ceil(readingTime(this.subject.text).minutes);
    });
  }

  public onMdLoad(res: string): void {
    this.minutesToRead = Math.ceil(readingTime(res).minutes);
  }

}
