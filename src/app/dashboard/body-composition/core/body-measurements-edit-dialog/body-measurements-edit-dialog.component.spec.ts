import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyMeasurementsEditDialogComponent } from './body-measurements-edit-dialog.component';

describe('BodyMeasurementsEditDialogComponent', () => {
  let component: BodyMeasurementsEditDialogComponent;
  let fixture: ComponentFixture<BodyMeasurementsEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodyMeasurementsEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyMeasurementsEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
