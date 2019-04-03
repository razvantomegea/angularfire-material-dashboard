import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionDetailsComponent } from './nutrition-details.component';

describe('NutritionDetailsComponent', () => {
  let component: NutritionDetailsComponent;
  let fixture: ComponentFixture<NutritionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NutritionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NutritionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
