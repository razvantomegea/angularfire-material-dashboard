import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormTimepickerComponent } from './dynamic-form-timepicker.component';

describe('DynamicFormTimepickerComponent', () => {
  let component: DynamicFormTimepickerComponent;
  let fixture: ComponentFixture<DynamicFormTimepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormTimepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormTimepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
