import { UserBio, UserInfo } from 'app/shared/models';
import { auth } from 'firebase/app';
import { HEALTHY_HABITS_LEVELS } from '../../../dashboard/healthy-habits/healthy-habits.component';

export const userInfoMock: UserInfo = new UserInfo(
  'Razvan Tomegea',
  'razvan.tomegea@gmail.com',
  true,
  null,
  '+40746466320',
  '',
  [],
  'password',
  'abcd1234',
  <auth.AdditionalUserInfo>{},
  new UserBio(
    '1994/07/31',
    'male',
    '',
    HEALTHY_HABITS_LEVELS[2],
    ''
  )
);
