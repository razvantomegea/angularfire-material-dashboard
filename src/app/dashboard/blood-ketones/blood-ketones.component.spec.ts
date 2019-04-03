import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodKetonesComponent } from './blood-ketones.component';

describe('BloodKetonesComponent', () => {
  let component: BloodKetonesComponent;
  let fixture: ComponentFixture<BloodKetonesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloodKetonesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodKetonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
