import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionEditDetailsComponent } from './session-edit-details.component';

describe('SessionEditDetailsComponent', () => {
  let component: SessionEditDetailsComponent;
  let fixture: ComponentFixture<SessionEditDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionEditDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionEditDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
