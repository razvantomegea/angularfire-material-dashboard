import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyCompositionCalculationsComponent } from './body-composition-calculations.component';

describe('BodyCompositionCalculationsComponent', () => {
  let component: BodyCompositionCalculationsComponent;
  let fixture: ComponentFixture<BodyCompositionCalculationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodyCompositionCalculationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyCompositionCalculationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
