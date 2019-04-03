import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from 'app/core/services';
import { UserInfo } from 'app/core/models';
import { authCredentialsMock, userInfoMock } from '../test/mocks';
import { angularFireAuthStub, userServiceStub } from '../test/stubs/index.spec';
import { AuthService } from './auth.service';

fdescribe('[Service]: Auth', () => {
  let authService: AuthService,
    afAuth: AngularFireAuth,
    registerSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userServiceStub },
        { provide: AngularFireAuth, useValue: angularFireAuthStub }
      ]
    });
    afAuth = TestBed.get(AngularFireAuth);
    authService = TestBed.get(AuthService);
    registerSpy = spyOn(authService, 'register').and.callThrough();
  });

  fit('is created;', () => {
    expect(authService).toBeTruthy();
  });

  fdescribe('[Method]: register', () => {
    let userInfo: UserInfo;

    beforeEach(async () => {
      userInfo = await authService.register(authCredentialsMock);
    });

    fit('is called with correct data;', () => {
      expect(registerSpy).toHaveBeenCalled();
      expect(registerSpy).toHaveBeenCalledWith(authCredentialsMock);
    });

    fit('returns correct data;', () => {
      expect(userInfo).toBeDefined();
      expect(userInfo).toEqual(userInfoMock);
    });
  });
});

// TODO: Test auth services
