import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodLipidsComponent } from './blood-lipids.component';

describe('BloodLipidsComponent', () => {
  let component: BloodLipidsComponent;
  let fixture: ComponentFixture<BloodLipidsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloodLipidsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodLipidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
