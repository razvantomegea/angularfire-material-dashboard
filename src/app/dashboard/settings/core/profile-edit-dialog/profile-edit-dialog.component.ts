import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatStepper } from '@angular/material';
import { Router } from '@angular/router';

import { FirebaseStorageService, NotificationService, StorageService, USER_PROFILE_DETAILS, UserService } from 'app/core/services';
import { HEALTHY_HABITS_LEVELS } from 'app/dashboard/healthy-habits/healthy-habits.component';
import { HealthyHabitsLevel } from 'app/dashboard/healthy-habits/model';
import {
  DynamicFormConfig,
  DynamicFormDatepickerConfig,
  DynamicFormFieldTypes,
  DynamicFormGroupConfig,
  DynamicFormInputConfig,
  DynamicFormSelectConfig,
  DynamicFormTextareaConfig
} from 'app/shared/components/dynamic-form';
import { CUSTOM_DATE_FORMAT } from 'app/shared/material/material.module';
import { DialogClosed } from 'app/shared/mixins';
import { INVALID_USERNAME, MetricSystem, REQUIRED_USERNAME, Upload, UserBio, UserInfo } from 'app/shared/models';
import { cloneDeep, get, set } from 'app/shared/utils/lodash-exports';
import { FirebaseError } from 'firebase/app';
import * as moment from 'moment';

interface ProfileDialogData {
  metricSystem: MetricSystem;
  profile: UserInfo;
}

interface FormValue {
  goal: string;
  group1: {
    dateOfBirth: string | moment.Moment;
    gender: string;
  };
  level: string;
  motherHood: string;
  summary: string;
  username: string;
}

@Component({
  selector: 'app-profile-edit-dialog',
  templateUrl: './profile-edit-dialog.component.html',
  styleUrls: ['./profile-edit-dialog.component.scss']
})
export class ProfileEditDialogComponent extends DialogClosed {
  public readonly profile: UserInfo;
  public avatarUrl: string;
  @ViewChild('fileInput') public fileInput: ElementRef;
  public formConfigs: DynamicFormConfig[];
  public initialFormData: FormValue;
  public isUploading = false;
  public levels: HealthyHabitsLevel[] = [...HEALTHY_HABITS_LEVELS];
  public profileForm: FormGroup = new FormGroup({});
  @ViewChild('stepper') public stepper: MatStepper;
  private isDirty = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: ProfileDialogData,
    protected dialogRef: MatDialogRef<ProfileEditDialogComponent>,
    private firebaseStorageService: FirebaseStorageService,
    private notificationService: NotificationService,
    protected router: Router,
    private userService: UserService
  ) {
    super(dialogRef, router);
    this.profile = StorageService.get(USER_PROFILE_DETAILS) || <UserInfo>cloneDeep(this.data.profile);
    this.avatarUrl = this.profile.photoURL;
    this.setupForm();
  }

  public onChangeAvatar(): void {
    this.fileInput.nativeElement.click();
  }

  public onFileInputChange(event: any): void {
    this.uploadImage(new Upload(<File>(<FileList>event.target.files).item(0)));
  }

  public onFormCreated(form: FormGroup): void {
    this.profileForm = form;
  }

  public onFormValueChanges(changes: FormValue): void {
    if (this.profileForm.valid) {
      this.profile.displayName = changes.username;
      this.profile.bio = new UserBio(
        (<moment.Moment>changes.group1.dateOfBirth).format(CUSTOM_DATE_FORMAT.display.dateInput),
        changes.group1.gender,
        changes.goal,
        this.levels.find((l: HealthyHabitsLevel) => l.levelName === changes.level),
        changes.summary,
        changes.motherHood
      );
      this.isDirty = true;
      StorageService.save(USER_PROFILE_DETAILS, this.profile);
    }
  }

  public onSubmit(): void {
    if (this.profileForm.valid) {
      this.profile.photoURL = this.avatarUrl;
      StorageService.delete(USER_PROFILE_DETAILS);
      this.dialogRef.close({ profile: this.profile, isDirty: this.isDirty });
    }
  }

  private setupForm(): void {
    this.formConfigs = <DynamicFormConfig[]>[
      <DynamicFormGroupConfig>{
        configs: <DynamicFormInputConfig[]>[
          <DynamicFormDatepickerConfig>{
            appearance: 'outline',
            formControlName: 'dateOfBirth',
            fxFlex: { default: '100%' },
            label: 'Date of birth',
            placeholder: 'YYYY-MM-DD',
            maxDate: moment(),
            minDate: moment().subtract(150, 'years'),
            state: {
              required: true
            },
            validations: [
              {
                message: 'Date of birth is required',
                name: 'required'
              }
            ],
            type: DynamicFormFieldTypes.Datepicker
          },
          <DynamicFormSelectConfig> {
            appearance: 'outline',
            formControlName: 'gender',
            fxFlex: { default: '100%' },
            label: 'Gender',
            options: [
              {
                label: 'Male',
                value: 'male'
              }, {
                label: 'Female',
                value: 'female'
              }
            ],
            state: {
              required: true
            },
            validations: [
              {
                message: 'Gender is required',
                name: 'required'
              }
            ],
            type: DynamicFormFieldTypes.Select
          }
        ],
        formControlName: 'group1',
        fxLayout: { default: 'row', xs: 'column' },
        fxLayoutAlign: { default: 'space-between center' },
        fxLayoutGap: { default: '10px', xs: '0px' },
        fxFlex: { default: '100%' },
        type: DynamicFormFieldTypes.FormGroup
      },
      <DynamicFormSelectConfig> {
        appearance: 'outline',
        conditionalShow: this.showMotherhoodControl.bind(this),
        formControlName: 'motherHood',
        fxFlex: { default: '100%' },
        label: 'Motherhood',
        options: [
          {
            label: 'None',
            value: 'none'
          }, {
            label: 'Pregnant',
            value: 'pregnant'
          }, {
            label: 'Lactating',
            value: 'lactating'
          }
        ],
        type: DynamicFormFieldTypes.Select
      },
      {
        appearance: 'outline',
        formControlName: 'username',
        fxFlex: { default: '100%' },
        label: 'Username',
        state: {
          required: true
        },
        validations: [
          {
            message: REQUIRED_USERNAME.errorMessage,
            name: REQUIRED_USERNAME.errorValidation
          },
          {
            message: INVALID_USERNAME.errorMessage,
            name: INVALID_USERNAME.errorValidation,
            expression: /[a-zA-Z\s]/
          }
        ],
        type: DynamicFormFieldTypes.Input
      },
      <DynamicFormTextareaConfig>{
        appearance: 'outline',
        autosize: true,
        autosizeMaxRows: 15,
        autosizeMinRows: 2,
        formControlName: 'summary',
        fxFlex: { default: '100%' },
        label: 'Summary',
        maxLength: 500,
        placeholder: 'Who are you?',
        validations: [
          {
            message: 'Summary should contain less than 500 characters',
            name: 'maxlength'
          }
        ],
        type: DynamicFormFieldTypes.Textarea
      },
      <DynamicFormTextareaConfig>{
        appearance: 'outline',
        autosize: true,
        autosizeMaxRows: 15,
        autosizeMinRows: 2,
        formControlName: 'goal',
        fxFlex: { default: '100%' },
        label: 'Goal',
        maxLength: 500,
        placeholder: 'What is the reason you want to be healthy and fit? (Think of something strong)',
        validations: [
          {
            message: 'Goal is required',
            name: 'required'
          },
          {
            message: 'Goal should contain less than 500 characters',
            name: 'maxlength'
          }
        ],
        type: DynamicFormFieldTypes.Textarea
      },
      <DynamicFormSelectConfig> {
        appearance: 'outline',
        formControlName: 'level',
        fxFlex: { default: '100%' },
        label: 'Level',
        options: this.levels.map((l: HealthyHabitsLevel) => l.levelName),
        state: {
          required: true
        },
        validations: [
          {
            message: 'Level is required',
            name: 'required'
          }
        ],
        type: DynamicFormFieldTypes.Select
      }
    ];
    const { bio, displayName } = this.profile;
    const { dateOfBirth, goal, gender, motherHood, level, summary } = bio;
    this.initialFormData = <any> {
      goal,
      group1: { dateOfBirth: moment(dateOfBirth), gender },
      level: level.levelName,
      motherHood: motherHood || '',
      summary,
      username: displayName
    };
  }

  private showMotherhoodControl(): boolean {
    return this.profile.bio.gender === 'female';
  }

  private uploadImage(image: Upload): void {
    this.isUploading = true;
    this.profileForm.disable();
    this.firebaseStorageService.uploadImage(this.profile.uid, `images`, image)
      .then((imgURL: string) => {
        this.avatarUrl = imgURL;
        this.isUploading = false;
        this.profileForm.enable();
        this.notificationService.showSuccess('Photo successfully uploaded');
        this.isDirty = true;
      })
      .catch((err: FirebaseError) => {
        this.isUploading = false;
        this.profileForm.enable();
        this.notificationService.showError(err.message);
      });
  }
}
