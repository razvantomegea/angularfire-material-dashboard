import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodKetonesDetailsDialogComponent } from './blood-ketones-details-dialog.component';

describe('BloodKetonesDetailsDialogComponent', () => {
  let component: BloodKetonesDetailsDialogComponent;
  let fixture: ComponentFixture<BloodKetonesDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloodKetonesDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodKetonesDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
