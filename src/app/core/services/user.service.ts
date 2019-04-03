import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { DataService } from 'app/shared/mixins';
import { exhaustMap, map, Observable, of, take } from 'app/shared/utils/rxjs-exports';
import { User } from 'firebase/app';
import { UserBio, UserInfo } from '../../shared/models';

@Injectable()
export class UserService extends DataService<UserInfo> {
  constructor(protected afAuth: AngularFireAuth, protected afs: AngularFirestore) {
    super(afAuth, afs, 'users', true);
  }

  public static mapUserInfo(userInfo: UserInfo): UserInfo {
    return userInfo ? new UserInfo(
      userInfo.displayName,
      userInfo.email,
      userInfo.emailVerified,
      userInfo.metadata,
      userInfo.phoneNumber,
      userInfo.photoURL,
      userInfo.providerData,
      userInfo.providerId,
      userInfo.uid,
      userInfo.userAdditional,
      userInfo.bio ? new UserBio(
        userInfo.bio.dateOfBirth,
        userInfo.bio.gender,
        userInfo.bio.goal,
        userInfo.bio.level,
        userInfo.bio.summary,
        userInfo.bio.motherHood
      ) : null
    ) : null;
  }

  public deleteUserInfo(): Promise<void> {
    return this.deleteData();
  }

  public getUserChanges(): Observable<UserInfo> {
    return this.afAuth.authState.pipe(exhaustMap((user: User) => {
      if (user) {

        if (!this.currentDataDoc$) {
          this.currentDataDoc$ = this.dataCollection$.doc<UserInfo>(user.uid);
        }

        return this.currentDataDoc$.valueChanges().pipe(map((userInfo: UserInfo) => UserService.mapUserInfo(
          userInfo)));
      } else {
        return of(null);
      }
    }));
  }

  public getUserInfo(): Promise<UserInfo> {
    return this.getUserChanges().pipe(take(1)).toPromise();
  }

  public async saveUserInfo(user: UserInfo): Promise<UserInfo> {
    await this.afAuth.auth.currentUser.updateProfile({
      displayName: user.displayName, photoURL: user.photoURL
    });
    await this.afAuth.auth.currentUser.updateEmail(user.email);
    await this.saveData(user);

    return user;
  }
}
