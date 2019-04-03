import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneEditDialogComponent } from './phone-edit-dialog.component';

describe('PhoneEditDialogComponent', () => {
  let component: PhoneEditDialogComponent;
  let fixture: ComponentFixture<PhoneEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
