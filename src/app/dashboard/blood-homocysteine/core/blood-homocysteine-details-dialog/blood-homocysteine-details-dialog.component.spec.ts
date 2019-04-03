import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodHomocysteineDetailsDialogComponent } from './blood-homocysteine-details-dialog.component';

describe('BloodHomocysteineDetailsDialogComponent', () => {
  let component: BloodHomocysteineDetailsDialogComponent;
  let fixture: ComponentFixture<BloodHomocysteineDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloodHomocysteineDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodHomocysteineDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
