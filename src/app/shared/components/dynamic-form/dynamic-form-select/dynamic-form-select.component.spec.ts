import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormSelectComponent } from './dynamic-form-select.component';

describe('DynamicFormSelectComponent', () => {
  let component: DynamicFormSelectComponent;
  let fixture: ComponentFixture<DynamicFormSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
