import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodPressureDetailsDialogComponent } from './blood-pressure-details-dialog.component';

describe('BloodPressureDetailsDialogComponent', () => {
  let component: BloodPressureDetailsDialogComponent;
  let fixture: ComponentFixture<BloodPressureDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloodPressureDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodPressureDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
