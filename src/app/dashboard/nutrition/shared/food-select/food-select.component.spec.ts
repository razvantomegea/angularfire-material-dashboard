import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodSelectComponent } from './food-select.component';

describe('FoodSelectComponent', () => {
  let component: FoodSelectComponent;
  let fixture: ComponentFixture<FoodSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
