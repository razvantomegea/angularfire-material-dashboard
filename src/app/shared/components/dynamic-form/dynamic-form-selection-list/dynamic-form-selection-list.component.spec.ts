import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormSelectionListComponent } from './dynamic-form-selection-list.component';

describe('DynamicFormSelectionListComponent', () => {
  let component: DynamicFormSelectionListComponent;
  let fixture: ComponentFixture<DynamicFormSelectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormSelectionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormSelectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
