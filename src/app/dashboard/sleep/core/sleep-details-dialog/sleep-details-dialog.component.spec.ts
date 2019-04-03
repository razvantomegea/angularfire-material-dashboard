import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SleepDetailsDialogComponent } from './sleep-details-dialog.component';

describe('SleepDetailsDialogComponent', () => {
  let component: SleepDetailsDialogComponent;
  let fixture: ComponentFixture<SleepDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SleepDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SleepDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
