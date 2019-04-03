import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { DialogFormValidation } from 'app/shared/mixins';
import { FormErrorMessage, FormValidationErrors } from 'app/shared/models';

export interface TrendsFilterDialogData {
  days: number;
  endDate: string;
  selectedSeries: string;
  series: string[];
}

@Component({
  selector: 'app-trends-filter-dialog',
  templateUrl: './trends-filter-dialog.component.html',
  styleUrls: ['./trends-filter-dialog.component.scss']
})
export class TrendsFilterDialogComponent extends DialogFormValidation {
  public readonly days: number[] = [7, 14, 28];
  public maxDate: moment.Moment = moment();
  public minDate: moment.Moment = moment().subtract(1, 'years');
  public trendsFilterForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: TrendsFilterDialogData,
    protected dialogRef: MatDialogRef<TrendsFilterDialogComponent>,
    protected router: Router
  ) {
    super(dialogRef, router);
    this.setupForm();
  }

  protected onSubmit(): void {
    super.onSubmit();

    if (this.trendsFilterForm.valid) {
      this.dialogRef.close(this.trendsFilterForm.value);
    }
  }

  private setupForm(): void {
    this.trendsFilterForm = new FormGroup({
      endDate: new FormControl(this.data.endDate, [Validators.required]),
      days: new FormControl(this.data.days, [Validators.required]),
      selectedSeries: new FormControl(this.data.selectedSeries, [Validators.required])
    });

    this.setupFormValidation(this.trendsFilterForm, new FormValidationErrors([
      new FormErrorMessage('endDate', 'required', 'End date is required'),
      new FormErrorMessage('days', 'required', 'Days are required'),
      new FormErrorMessage('selectedSeries', 'required', 'Series is required')
    ]));
  }

}
