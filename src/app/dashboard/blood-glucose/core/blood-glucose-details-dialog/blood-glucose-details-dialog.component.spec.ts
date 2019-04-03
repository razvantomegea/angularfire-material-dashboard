import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodGlucoseDetailsDialogComponent } from './blood-glucose-details-dialog.component';

describe('BloodGlucoseDetailsDialogComponent', () => {
  let component: BloodGlucoseDetailsDialogComponent;
  let fixture: ComponentFixture<BloodGlucoseDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloodGlucoseDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodGlucoseDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
