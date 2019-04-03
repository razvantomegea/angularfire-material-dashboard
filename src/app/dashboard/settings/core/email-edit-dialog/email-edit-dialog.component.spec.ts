import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailEditDialogComponent } from './email-edit-dialog.component';

describe('EmailEditDialogComponent', () => {
  let component: EmailEditDialogComponent;
  let fixture: ComponentFixture<EmailEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
