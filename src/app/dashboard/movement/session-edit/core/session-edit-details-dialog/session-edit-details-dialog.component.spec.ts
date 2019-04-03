import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionEditDetailsDialogComponent } from './session-edit-details-dialog.component';

describe('SessionEditDetailsDialogComponent', () => {
  let component: SessionEditDetailsDialogComponent;
  let fixture: ComponentFixture<SessionEditDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionEditDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionEditDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
