import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MealEditDetailsDialogComponent } from './meal-edit-details-dialog.component';

describe('MealEditDetailsDialogComponent', () => {
  let component: MealEditDetailsDialogComponent;
  let fixture: ComponentFixture<MealEditDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MealEditDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MealEditDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
