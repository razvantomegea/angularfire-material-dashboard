import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { FirebaseModule } from './firebase/firebase.module';
import {
  FirebaseStorageService,
  NotificationService,
  RoutingStateService,
  StorageService,
  TitleService,
  UserService,
  UtilsService
} from './services';
import { StoreModule } from './store/store.module';

@NgModule({
  imports: [
    FirebaseModule, SharedModule, StoreModule
  ],
  providers: [FirebaseStorageService, NotificationService, RoutingStateService , StorageService, TitleService, UserService, UtilsService]
})
export class CoreModule {
}
