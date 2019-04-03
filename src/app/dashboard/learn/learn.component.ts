import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearnSubject } from 'app/dashboard/learn/model';
import { LearnService } from 'app/dashboard/learn/services';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss']
})
export class LearnComponent implements OnInit {
  public subjects: LearnSubject[] = [];

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
  }

  public ngOnInit(): void {
    this.subjects = LearnService.getSubjects();
  }

  public onLearn(subject: string): void {
    this.router.navigate([subject], {
      relativeTo: this.activatedRoute
    });
  }

}
