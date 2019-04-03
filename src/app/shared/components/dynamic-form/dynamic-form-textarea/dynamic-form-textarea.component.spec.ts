import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormTextareaComponent } from './dynamic-form-textarea.component';

describe('DynamicFormTextareaComponent', () => {
  let component: DynamicFormTextareaComponent;
  let fixture: ComponentFixture<DynamicFormTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormTextareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
