import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendsFilterDialogComponent } from './trends-filter-dialog.component';

describe('TrendsFilterDialogComponent', () => {
  let component: TrendsFilterDialogComponent;
  let fixture: ComponentFixture<TrendsFilterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendsFilterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendsFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
