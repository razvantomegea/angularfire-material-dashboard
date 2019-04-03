import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormDatepickerComponent } from './dynamic-form-datepicker.component';

describe('DynamicFormDatepickerComponent', () => {
  let component: DynamicFormDatepickerComponent;
  let fixture: ComponentFixture<DynamicFormDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormDatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
