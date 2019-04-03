import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '../../../shared/shared.module';

import { AuthFormComponent } from './auth-form.component';

describe('[Component] AuthForm', () => {
  let component: AuthFormComponent,
    fixture: ComponentFixture<AuthFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [AuthFormComponent]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AuthFormComponent);
      component = fixture.componentInstance;
    });
  }));

  it('is created;', () => {
    expect(component).toBeDefined();
  });
});
