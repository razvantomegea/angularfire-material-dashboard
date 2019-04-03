import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { FIREBASE_CONFIG } from './config';

@NgModule({
  imports: [
    AngularFireAuthModule,
    AngularFireModule.initializeApp(
      FIREBASE_CONFIG
    ),
    AngularFireStorageModule,
    AngularFirestoreModule
  ], declarations: []
})
export class FirebaseModule {
}
