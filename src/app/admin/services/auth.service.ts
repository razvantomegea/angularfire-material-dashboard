import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { Credentials } from 'app/admin/model/credentials';
import { UserService, UtilsService } from 'app/core/services';
import { HEALTHY_HABITS_LEVELS } from 'app/dashboard/healthy-habits/healthy-habits.component';
import { DynamicFormFieldTypes, DynamicFormInputConfig } from 'app/shared/components/dynamic-form';
import {
  INVALID_EMAIL, INVALID_PHONE_NUMBER,
  INVALID_USERNAME, LONG_CODE,
  PASSWORD_NO_MATCH, REQUIRED_CODE,
  REQUIRED_EMAIL,
  REQUIRED_PASSWORD,
  REQUIRED_PASSWORD_CONFIRMATION, REQUIRED_PHONE_NUMBER,
  REQUIRED_USERNAME, SHORT_CODE,
  SHORT_PASSWORD,
  UserBio,
  UserInfo
} from 'app/shared/models';

import { auth, FirebaseError, User } from 'firebase/app';
import { AuthInfo, PhoneCredentials } from '../model';

/**
 * Maps all possible linking events for all providers
 * @const
 */
export const AUTH_INFO_CODES = Object.freeze({
  EMAIL_PASSWORD_LINK: 'Email password link',
  FACEBOOK_LINK: 'Facebook link',
  GITHUB_LINK: 'Github link',
  GOOGLE_LINK: 'Google link',
  PASSWORD_RESET: 'Password reset',
  PHONE_IN_USE: 'Phone number in use',
  PHONE_LINK: 'Phone number link',
  TWITTER_LINK: 'Twitter link'
});

/**
 * Maps all possible Firebase error codes
 * @const
 */
export const ERROR_CODES = Object.freeze({
  EMAIL_EXISTS: 'auth/account-exists-with-different-credential',
  CREDENTIAL_IN_USE: 'auth/credential-already-in-use'
});

/**
 * Maps all provider IDs
 * @const
 */
export const PROVIDER_IDS = Object.freeze({
  FACEBOOK: auth.FacebookAuthProvider.PROVIDER_ID,
  GITHUB: auth.GithubAuthProvider.PROVIDER_ID,
  GOOGLE: auth.GoogleAuthProvider.PROVIDER_ID,
  PASSWORD: auth.EmailAuthProvider.PROVIDER_ID,
  PHONE: auth.PhoneAuthProvider.PROVIDER_ID,
  TWITTER: auth.TwitterAuthProvider.PROVIDER_ID
});

export const EMAIL_FORM_CONFIG: DynamicFormInputConfig = {
  type: DynamicFormFieldTypes.Input,
  appearance: 'outline',
  label: 'Email',
  prefix: 'email',
  formControlName: 'email',
  inputType: 'email',
  state: {
    required: true
  },
  validations: [
    {
      name: REQUIRED_EMAIL.errorValidation,
      message: REQUIRED_EMAIL.errorMessage
    },
    {
      name: INVALID_EMAIL.errorValidation,
      message: INVALID_EMAIL.errorMessage
    }
  ]
};

export const USERNAME_FORM_CONFIG: DynamicFormInputConfig = {
  type: DynamicFormFieldTypes.Input,
  appearance: 'outline',
  label: 'Username',
  inputType: 'text',
  prefix: 'face',
  state: {
    required: true
  },
  formControlName: 'username',
  validations: [
    {
      name: REQUIRED_USERNAME.errorValidation,
      message: REQUIRED_USERNAME.errorMessage
    },
    {
      name: INVALID_USERNAME.errorValidation,
      message: INVALID_USERNAME.errorMessage,
      expression: /[A-Za-z]+(\s[A-Za-z]+)?$/
    }
  ]
};

export const PASSWORD_FORM_CONFIG: DynamicFormInputConfig = {
  type: DynamicFormFieldTypes.Input,
  appearance: 'outline',
  label: 'Password',
  prefix: 'lock',
  state: {
    required: true
  },
  inputType: 'password',
  formControlName: 'password',
  validations: [
    {
      name: REQUIRED_PASSWORD.errorValidation,
      message: REQUIRED_PASSWORD.errorMessage
    },
    {
      name: SHORT_PASSWORD.errorValidation,
      message: SHORT_PASSWORD.errorMessage,
      expression: 8
    }
  ]
};

export const PASSWORD_CONFIRM_FORM_CONFIG: DynamicFormInputConfig = {
  type: DynamicFormFieldTypes.Input,
  appearance: 'outline',
  label: 'Confirm password',
  prefix: 'lock_open',
  state: {
    required: true
  },
  inputType: 'password',
  formControlName: 'passwordConfirm',
  validations: [
    {
      name: REQUIRED_PASSWORD_CONFIRMATION.errorValidation,
      message: REQUIRED_PASSWORD_CONFIRMATION.errorMessage
    },
    {
      name: PASSWORD_NO_MATCH.errorValidation,
      message: PASSWORD_NO_MATCH.errorMessage
    }
  ]
};

export const PHONE_FORM_CONFIG: DynamicFormInputConfig = {
  type: DynamicFormFieldTypes.Input,
  label: 'Phone number',
  placeholder: '+15417543010',
  appearance: 'outline',
  state: {
    required: true
  },
  inputType: 'tel',
  formControlName: 'phoneNumber',
  validations: [
    {
      name: REQUIRED_PHONE_NUMBER.errorValidation,
      message: REQUIRED_PHONE_NUMBER.errorMessage
    },
    {
      name: INVALID_PHONE_NUMBER.errorValidation,
      message: INVALID_PHONE_NUMBER.errorMessage
    }
  ]
};

export const CONFIRM_CODE_FORM_CONFIG: DynamicFormInputConfig = {
  type: DynamicFormFieldTypes.Input,
  label: 'Confirm code',
  placeholder: '123456',
  appearance: 'outline',
  state: {
    required: true
  },
  inputType: 'number',
  formControlName: 'confirmCode',
  validations: [
    {
      name: REQUIRED_CODE.errorValidation,
      message: REQUIRED_CODE.errorMessage
    },
    {
      name: SHORT_CODE.errorValidation,
      message: SHORT_CODE.errorMessage,
      expression: 6
    },
    {
      name: LONG_CODE.errorValidation,
      message: LONG_CODE.errorMessage,
      expression: 6
    }
  ]
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private pendingCredential: auth.AuthCredential;
  private userInfo: UserInfo;

  constructor(private afAuth: AngularFireAuth, private userService: UserService) {
  }

  public async authWithFacebook(): Promise<UserInfo> {
    const facebookScopes: string[] = ['public_profile', 'email'];
    const facebookProvider: auth.FacebookAuthProvider = new auth.FacebookAuthProvider();
    facebookScopes.forEach((scope: string) => {
      facebookProvider.addScope(scope);
    });
    const authCredential: auth.UserCredential = await this.afAuth.auth.signInWithPopup(
      facebookProvider);

    return this.linkAndRetrieveUser(authCredential);
  }

  public async authWithGithub(): Promise<UserInfo> {
    const githubScopes: string[] = ['repo', 'user'];
    const githubProvider: auth.GithubAuthProvider = new auth.GithubAuthProvider();
    githubScopes.forEach((scope: string) => {
      githubProvider.addScope(scope);
    });
    const authCredential: auth.UserCredential = await this.afAuth.auth.signInWithPopup(
      githubProvider);

    return this.linkAndRetrieveUser(authCredential);
  }

  public async authWithGoogle(): Promise<UserInfo> {
    const googleScopes: string[] = [
      'https://www.googleapis.com/auth/fitness.activity.read',
      'https://www.googleapis.com/auth/fitness.activity.write',
      'https://www.googleapis.com/auth/fitness.blood_glucose.read',
      'https://www.googleapis.com/auth/fitness.blood_glucose.write',
      'https://www.googleapis.com/auth/fitness.blood_pressure.read',
      'https://www.googleapis.com/auth/fitness.blood_pressure.write',
      'https://www.googleapis.com/auth/fitness.body.read',
      'https://www.googleapis.com/auth/fitness.body.write',
      'https://www.googleapis.com/auth/fitness.body_temperature.read',
      'https://www.googleapis.com/auth/fitness.body_temperature.write',
      'https://www.googleapis.com/auth/fitness.location.read',
      'https://www.googleapis.com/auth/fitness.location.write',
      'https://www.googleapis.com/auth/fitness.nutrition.read',
      'https://www.googleapis.com/auth/fitness.nutrition.write',
      'https://www.googleapis.com/auth/fitness.oxygen_saturation.read',
      'https://www.googleapis.com/auth/fitness.oxygen_saturation.write',
      'https://www.googleapis.com/auth/fitness.reproductive_health.read',
      'https://www.googleapis.com/auth/fitness.reproductive_health.write'
    ];
    const googleProvider: auth.GoogleAuthProvider = new auth.GoogleAuthProvider();
    googleScopes.forEach((scope: string) => {
      googleProvider.addScope(scope);
    });
    const authCredential: auth.UserCredential = await this.afAuth.auth.signInWithPopup(
      googleProvider);

    return this.linkAndRetrieveUser(authCredential);
  }

  public async authWithTwitter(): Promise<UserInfo> {
    const twitterProvider: auth.TwitterAuthProvider = new auth.TwitterAuthProvider();
    const authCredential: auth.UserCredential = await this.afAuth.auth.signInWithPopup(
      twitterProvider);

    return this.linkAndRetrieveUser(authCredential);
  }

  public async confirmPhone(credentials: PhoneCredentials): Promise<auth.ConfirmationResult> {
    if (this.afAuth.auth.currentUser.phoneNumber) {
      return this.afAuth.auth.signInWithPhoneNumber(credentials.phoneNumber, credentials.verifier);
    }

    return this.afAuth.auth.currentUser.linkWithPhoneNumber(credentials.phoneNumber, credentials.verifier);
  }

  public async deleteAccount(): Promise<void> {
    await this.afAuth.auth.currentUser.delete();
    delete this.userInfo;
    delete this.pendingCredential;

    return;
  }

  public getProviderData(email: string): Promise<string[]> {
    return this.afAuth.auth.fetchSignInMethodsForEmail(email);
  }

  public async handleAuthError(err: FirebaseError): Promise<AuthInfo | UserInfo | FirebaseError> {
    if (err.code === ERROR_CODES.EMAIL_EXISTS) {
      return this.handleEmailExistsError(err);
    } else if (err.code === ERROR_CODES.CREDENTIAL_IN_USE) {
      return this.handleCredentialInUseError(err);
    }

    return err;
  }

  public async linkPhone(credentials: PhoneCredentials): Promise<UserInfo> {
    const phoneCredential: auth.AuthCredential = auth.PhoneAuthProvider.credential(
      credentials.verificationId,
      credentials.code
    );

    if (!this.afAuth.auth.currentUser.phoneNumber) {
      await this.afAuth.auth.currentUser.updatePhoneNumber(phoneCredential);
    }

    const authCredential: auth.UserCredential = await this.afAuth.auth.signInAndRetrieveDataWithCredential(
      phoneCredential);

    return this.linkAndRetrieveUser(authCredential);
  }

  public async linkProvider(providerId: string): Promise<UserInfo> {
    let authCredential: auth.UserCredential;

    switch (providerId) {
      case PROVIDER_IDS.PASSWORD:
        authCredential = await this.linkEmailProvider();
        break;

      case PROVIDER_IDS.FACEBOOK:
        authCredential = await this.linkFacebookProvider();
        break;

      case PROVIDER_IDS.GITHUB:
        authCredential = await this.linkGithubProvider();
        break;

      case PROVIDER_IDS.GOOGLE:
        authCredential = await this.linkGoogleProvider();
        break;

      case PROVIDER_IDS.TWITTER:
        authCredential = await this.linkTwitterProvider();
        break;
    }

    return this.linkAndRetrieveUser(authCredential);
  }

  public async login(credentials: Credentials): Promise<UserInfo> {
    const authCredential: auth.UserCredential = await this.afAuth.auth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    );

    return this.linkAndRetrieveUser(authCredential);
  }

  public logout(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  public passwordReset(credentials: Credentials): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(credentials.email);
  }

  public async phoneNumberReset(credentials: PhoneCredentials): Promise<UserInfo> {
    const phoneCredential: auth.AuthCredential = auth.PhoneAuthProvider.credential(
      credentials.verificationId,
      credentials.code
    );
    await this.afAuth.auth.currentUser.updatePhoneNumber(phoneCredential);
    this.userInfo.phoneNumber = credentials.phoneNumber;

    return this.userInfo;
  }

  public async register(credentials: Credentials): Promise<UserInfo> {
    const authCredential: auth.UserCredential = await this.afAuth.auth.createUserWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
    await authCredential.user.updateProfile({
      displayName: credentials.name, photoURL: ''
    });

    return this.linkAndRetrieveUser(authCredential);
  }

  public async unlinkProvider(providerId: string): Promise<UserInfo> {
    const res: User = await this.afAuth.auth.currentUser.unlink(providerId);

    if (res) {
      await this.afAuth.auth.currentUser.reload();

      return this.setUserInfo();
    }
  }

  private handleCredentialInUseError(err: FirebaseError): AuthInfo {
    const phoneNumber: string = err['phoneNumber'];
    const pendingCredential = err['credential'];

    if (pendingCredential.providerId === PROVIDER_IDS.PHONE) {
      return new AuthInfo(
        AUTH_INFO_CODES.PHONE_IN_USE,
        `There is already an account associated with ${phoneNumber}.
            Please use a different valid phone number or log in into that account.`,
        { phoneNumber }
      );
    }
  }

  private async handleEmailExistsError(err: FirebaseError): Promise<AuthInfo> {
    this.pendingCredential = err['credential'];
    const email: string = err['email'];
    const authMethods: string[] = await this.getProviderData(email);

    switch (authMethods[0]) {
      case PROVIDER_IDS.PASSWORD:
        return new AuthInfo(
          AUTH_INFO_CODES.EMAIL_PASSWORD_LINK,
          `There is already an account associated with email ${email}.
            Please login using your email and password and the provider ${this.pendingCredential.providerId}
            will be linked to your existing account.`,
          { email }
        );

      case PROVIDER_IDS.FACEBOOK:
        return new AuthInfo(
          AUTH_INFO_CODES.FACEBOOK_LINK,
          `There is already a Facebook account associated with email ${email}.
          ${this.pendingCredential.providerId} will be linked to your existing account.`,
          { email }
        );

      case PROVIDER_IDS.GITHUB:
        return new AuthInfo(
          AUTH_INFO_CODES.GITHUB_LINK,
          `There is already a Github account associated with email ${email}.
            ${this.pendingCredential.providerId} will be linked to your existing account.`
        );

      case PROVIDER_IDS.GOOGLE:
        return new AuthInfo(
          AUTH_INFO_CODES.GOOGLE_LINK,
          `There is already a Google account associated with email ${email}.
            ${this.pendingCredential.providerId} will be linked to your existing account.`
        );

      case PROVIDER_IDS.TWITTER:
        return new AuthInfo(
          AUTH_INFO_CODES.TWITTER_LINK,
          `There is already a Twitter account associated with email ${email}.
            ${this.pendingCredential.providerId} will be linked to your existing account.`
        );

      default:
        return new AuthInfo(
          AUTH_INFO_CODES.EMAIL_PASSWORD_LINK,
          `Please login using your email ${email} and password.`,
          { email }
        );
    }
  }

  private async linkAndRetrieveUser(authCredential: auth.UserCredential): Promise<UserInfo> {
    let additionalUserInfo: auth.AdditionalUserInfo;

    if (authCredential && this.pendingCredential) {
      const credential: auth.AuthCredential = this.pendingCredential;
      delete this.pendingCredential;
      const userCredential: auth.UserCredential = await this.afAuth.auth.currentUser.linkAndRetrieveDataWithCredential(
        credential);
      additionalUserInfo = userCredential.additionalUserInfo;
    } else {
      additionalUserInfo = Object.assign({}, authCredential.additionalUserInfo);
    }

    return this.setUserInfo(additionalUserInfo);
  }

  private linkEmailProvider(): Promise<auth.UserCredential> {
    const emailProvider: auth.EmailAuthProvider = new auth.EmailAuthProvider();
    return this.afAuth.auth.currentUser.linkWithPopup(emailProvider);
  }

  private linkFacebookProvider(): Promise<auth.UserCredential> {
    const facebookProvider: auth.FacebookAuthProvider = new auth.FacebookAuthProvider();
    return this.afAuth.auth.currentUser.linkWithPopup(facebookProvider);
  }

  private linkGithubProvider(): Promise<auth.UserCredential> {
    const githubProvider: auth.GithubAuthProvider = new auth.GithubAuthProvider();
    return this.afAuth.auth.currentUser.linkWithPopup(githubProvider);
  }

  private linkGoogleProvider(): Promise<auth.UserCredential> {
    const googleProvider: auth.GoogleAuthProvider = new auth.GoogleAuthProvider();
    return this.afAuth.auth.currentUser.linkWithPopup(googleProvider);
  }

  private linkTwitterProvider(): Promise<auth.UserCredential> {
    const twitterProvider: auth.TwitterAuthProvider = new auth.TwitterAuthProvider();
    return this.afAuth.auth.currentUser.linkWithPopup(twitterProvider);
  }

  private async setUserInfo(additionalUserInfo?: auth.AdditionalUserInfo): Promise<UserInfo> {
    const userInfo: UserInfo = await this.userService.getUserInfo();

    if (!userInfo) {
      const currentUser: User = this.afAuth.auth.currentUser;
      const userAge: number = parseInt(UtilsService.getValueByKey(currentUser, 'age'), 10) || 18;
      const userGender: string = UtilsService.getValueByKey(currentUser, 'gender') || '';
      const userSummary: string = UtilsService.getValueByKey(currentUser, 'description') ||
        UtilsService.getValueByKey(currentUser, 'bio') ||
        UtilsService.getValueByKey(currentUser, 'summary') || '';
      this.userInfo = new UserInfo(
        currentUser.displayName,
        currentUser.email,
        currentUser.emailVerified,
        currentUser.metadata,
        currentUser.phoneNumber,
        currentUser.photoURL,
        currentUser.providerData,
        currentUser.providerId,
        currentUser.uid,
        additionalUserInfo,
        new UserBio(
          userAge,
          userGender,
          'Be healthy, fit, and happy for life!',
          HEALTHY_HABITS_LEVELS[0],
          userSummary
        )
      );
    } else {
      this.userInfo = userInfo;
      this.userInfo = new UserInfo(
        userInfo.displayName,
        userInfo.email,
        userInfo.emailVerified,
        userInfo.metadata,
        userInfo.phoneNumber,
        userInfo.photoURL,
        userInfo.providerData,
        userInfo.providerId,
        userInfo.uid,
        { ...userInfo.userAdditional, ...additionalUserInfo },
        new UserBio(
          userInfo.bio.dateOfBirth,
          userInfo.bio.gender,
          userInfo.bio.goal,
          userInfo.bio.level,
          userInfo.bio.summary,
          userInfo.bio.motherHood,
          userInfo.bio.constitution
          // userInfo.bio.metabolicType,
          // userInfo.bio.geneticType
        )
      );
    }

    return this.userInfo;
  }
}
