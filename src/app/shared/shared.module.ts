import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFacebook, faGithub, faGoogle, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faChartBar, faFrown } from '@fortawesome/free-regular-svg-icons';
import {
  faBatteryEmpty,
  faBatteryQuarter,
  faBatteryThreeQuarters,
  faCouch,
  faDatabase,
  faHeartbeat,
  faLongArrowAltUp,
  faRulerHorizontal,
  faRulerVertical,
  faSignOutAlt,
  faTransgender,
  faWeight
} from '@fortawesome/free-solid-svg-icons';
import { DeferLoadModule } from '@trademe/ng-defer-load';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { ParticlesModule } from 'angular-particle';
import { intersectionObserverPreset, LazyLoadImageModule } from 'ng-lazyload-image';
import { ChartsModule } from 'ng2-charts';
import { Ng2TelInputModule } from 'ng2-tel-input';
// import { NativeScriptFormsModule } from 'nativescript-angular/forms';
// import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import {
  LoadingDialogComponent,
  NotificationDialogComponent,
  NotificationSnackbarComponent,
  PromptDialogComponent,
  SearchBoxComponent
} from './components';
import {
  DynamicFormCheckboxComponent,
  DynamicFormComponent,
  DynamicFormDatepickerComponent,
  DynamicFormDialogComponent,
  DynamicFormFieldDirective,
  DynamicFormGroupComponent,
  DynamicFormInputComponent,
  DynamicFormSelectComponent,
  DynamicFormSelectionListComponent,
  DynamicFormTextareaComponent,
  DynamicFormTimepickerComponent
} from './components/dynamic-form';
import { MaterialModule } from './material/material.module';

// Add an icon to the library for convenient access in other core
library.add(
  faBatteryEmpty,
  faBatteryQuarter,
  faBatteryThreeQuarters,
  faChartBar,
  faCouch,
  faDatabase,
  faFacebook,
  faFrown,
  faGithub,
  faGoogle,
  faHeartbeat,
  faLongArrowAltUp,
  faRulerHorizontal,
  faRulerVertical,
  faSignOutAlt,
  faTransgender,
  faTwitter,
  faWeight
);

@NgModule({
  imports: [
    ChartsModule, CommonModule, DeferLoadModule, FormsModule, LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset
    }), MaterialModule, Ng2TelInputModule, ReactiveFormsModule
    // NativeScriptFormsModule,
    // NativeScriptHttpClientModule
  ], exports: [
    // NativeScriptFormsModule,
    // NativeScriptHttpClientModule,
    AmazingTimePickerModule,
    ChartsModule,
    CommonModule,
    DeferLoadModule,
    DynamicFormComponent,
    DynamicFormDialogComponent,
    FontAwesomeModule,
    FormsModule,
    LazyLoadImageModule,
    MaterialModule,
    ParticlesModule,
    ReactiveFormsModule,
    SearchBoxComponent
  ], declarations: [
    DynamicFormCheckboxComponent,
    DynamicFormComponent,
    DynamicFormDatepickerComponent,
    DynamicFormDialogComponent,
    DynamicFormFieldDirective,
    DynamicFormGroupComponent,
    DynamicFormInputComponent,
    DynamicFormSelectComponent,
    DynamicFormSelectionListComponent,
    DynamicFormTextareaComponent,
    DynamicFormTimepickerComponent,
    LoadingDialogComponent,
    NotificationDialogComponent,
    NotificationSnackbarComponent,
    PromptDialogComponent,
    SearchBoxComponent
  ], entryComponents: [
    DynamicFormCheckboxComponent,
    DynamicFormDatepickerComponent,
    DynamicFormGroupComponent,
    DynamicFormInputComponent,
    DynamicFormSelectComponent,
    DynamicFormSelectionListComponent,
    DynamicFormTextareaComponent,
    DynamicFormTimepickerComponent,
    LoadingDialogComponent,
    NotificationDialogComponent,
    NotificationSnackbarComponent,
    PromptDialogComponent
  ]
})
export class SharedModule {
}
