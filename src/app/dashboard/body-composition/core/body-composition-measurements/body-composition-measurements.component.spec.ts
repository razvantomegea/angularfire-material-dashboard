import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyCompositionMeasurementsComponent } from './body-composition-measurements.component';

describe('BodyCompositionMeasurementsComponent', () => {
  let component: BodyCompositionMeasurementsComponent;
  let fixture: ComponentFixture<BodyCompositionMeasurementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodyCompositionMeasurementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyCompositionMeasurementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
