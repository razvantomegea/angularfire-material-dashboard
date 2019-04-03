import { UserInfo } from 'app/core/models';
import { userInfoMock } from '../mocks';

export const fakeGetUserInfoHandler = (): Promise<UserInfo> => Promise.resolve(userInfoMock);

export interface UserServiceStub {
  getUserInfo: () => Promise<UserInfo>;
}

export const userServiceStub: UserServiceStub = {
  getUserInfo: jasmine.createSpy('getUserInfo').and.callFake(fakeGetUserInfoHandler)
};

