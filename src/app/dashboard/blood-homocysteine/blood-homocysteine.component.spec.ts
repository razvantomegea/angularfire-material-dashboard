import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodHomocysteineComponent } from './blood-homocysteine.component';

describe('BloodHomocysteineComponent', () => {
  let component: BloodHomocysteineComponent;
  let fixture: ComponentFixture<BloodHomocysteineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloodHomocysteineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodHomocysteineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
