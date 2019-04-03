import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { Ng2TelInputModule } from 'ng2-tel-input';
import {
  AccountSettingsComponent,
  EmailEditDialogComponent,
  PhoneEditDialogComponent,
  ProfileEditDialogComponent,
  PreferencesComponent,
  UserProfileSettingsComponent
} from './core';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';

@NgModule({
  imports: [
    Ng2TelInputModule, SettingsRoutingModule, SharedModule
  ],
  declarations: [
    AccountSettingsComponent,
    EmailEditDialogComponent,
    PhoneEditDialogComponent,
    ProfileEditDialogComponent,
    PreferencesComponent,
    SettingsComponent,
    UserProfileSettingsComponent
  ],
  entryComponents: [
    EmailEditDialogComponent,
    PhoneEditDialogComponent,
    ProfileEditDialogComponent
  ]
})
export class SettingsModule {
}
