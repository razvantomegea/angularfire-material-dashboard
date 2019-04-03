import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitySelectComponent } from './activity-select.component';

describe('ActivitySelectComponent', () => {
  let component: ActivitySelectComponent;
  let fixture: ComponentFixture<ActivitySelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitySelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
