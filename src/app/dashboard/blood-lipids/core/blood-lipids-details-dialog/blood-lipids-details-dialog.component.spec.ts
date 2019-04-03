import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodLipidsDetailsDialogComponent } from './blood-lipids-details-dialog.component';

describe('BloodLipidsDetailsDialogComponent', () => {
  let component: BloodLipidsDetailsDialogComponent;
  let fixture: ComponentFixture<BloodLipidsDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloodLipidsDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodLipidsDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
