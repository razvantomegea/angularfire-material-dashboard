import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MealEditComponent } from './meal-edit.component';

describe('MealEditComponent', () => {
  let component: MealEditComponent;
  let fixture: ComponentFixture<MealEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MealEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MealEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
