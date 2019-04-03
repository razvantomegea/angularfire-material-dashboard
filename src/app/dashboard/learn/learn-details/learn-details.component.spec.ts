import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnDetailsComponent } from './learn-details.component';

describe('LearnDetailsComponent', () => {
  let component: LearnDetailsComponent;
  let fixture: ComponentFixture<LearnDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
