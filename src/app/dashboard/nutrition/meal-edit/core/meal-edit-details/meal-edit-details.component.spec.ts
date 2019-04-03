import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MealEditDetailsComponent } from './meal-edit-details.component';

describe('MealEditDetailsComponent', () => {
  let component: MealEditDetailsComponent;
  let fixture: ComponentFixture<MealEditDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MealEditDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MealEditDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
