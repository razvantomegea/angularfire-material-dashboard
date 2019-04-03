import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodGlucoseComponent } from './blood-glucose.component';

describe('BloodGlucoseComponent', () => {
  let component: BloodGlucoseComponent;
  let fixture: ComponentFixture<BloodGlucoseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloodGlucoseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodGlucoseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
