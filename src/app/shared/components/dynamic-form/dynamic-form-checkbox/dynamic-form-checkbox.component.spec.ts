import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormCheckboxComponent } from './dynamic-form-checkbox.component';

describe('DynamicFormCheckboxComponent', () => {
  let component: DynamicFormCheckboxComponent;
  let fixture: ComponentFixture<DynamicFormCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
