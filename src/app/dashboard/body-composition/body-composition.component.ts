import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { NotificationService, UtilsService } from 'app/core/services';
import { State } from 'app/core/store/app.reducers';
import { GetBodyCompositionChanges, SaveBodyComposition } from 'app/core/store/body-composition/actions/body-composition.actions';
import * as fromBodyComposition from 'app/core/store/body-composition/reducers';
import * as fromUser from 'app/core/store/user/reducers';
import { BodyMeasurementsEditDialogComponent, BodyMeasurementsEditDialogData } from 'app/dashboard/body-composition/core';
import { ComponentDestroyed } from 'app/shared/mixins';
import { MetricSystem, UserInfo } from 'app/shared/models';
import { Observable, take, takeUntil } from 'app/shared/utils/rxjs-exports';
import { BodyComposition, BodyMeasurements } from './model';
import { BodyCompositionService } from './services';

@Component({
  selector: 'app-body-composition',
  templateUrl: './body-composition.component.html',
  styleUrls: ['./body-composition.component.scss']
})
export class BodyCompositionComponent extends ComponentDestroyed implements OnInit {
  public bodyComposition: BodyComposition;
  public isPending = true;
  public isSaving = false;
  public metricSystem: MetricSystem;
  public noData = false;
  private readonly bodyComposition$: Observable<BodyComposition> = this.store.pipe(
    select(fromBodyComposition.getBodyComposition),
    takeUntil(this.isDestroyed$)
  );
  private readonly isPending$: Observable<number> = this.store.pipe(
    select(fromBodyComposition.getIsPending),
    takeUntil(this.isDestroyed$)
  );
  private readonly userInfo$: Observable<UserInfo> = this.store.pipe(select(fromUser.getUser), takeUntil(this.isDestroyed$));
  private userInfo: UserInfo;

  constructor(
    private bodyCompositionService: BodyCompositionService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private router: Router,
    private store: Store<State>
  ) {
    super();
    this.metricSystem = UtilsService.setupMetricSystem();
  }

  // TODO: Show trends
  public ngOnInit(): void {
    this.isPending$.subscribe((isPending: number) => {
      this.isPending = isPending > 0;

      if (this.isPending === false && !this.bodyComposition) {
        this.noData = true;
      }
    });

    this.bodyComposition$.subscribe((bodyComposition: BodyComposition) => {
      if (bodyComposition) {
        if (this.bodyComposition && this.isSaving) {
          this.notificationService.showSuccess('Body composition successfully updated!');
          this.isSaving = false;
        }

        this.bodyComposition = bodyComposition;
        this.noData = false;
      }
    });
    this.userInfo$.subscribe((userInfo: UserInfo) => {
      if (userInfo) {
        this.userInfo = userInfo;
      }
    });
    this.store.dispatch(new GetBodyCompositionChanges());
  }

  public onBodyMeasurementsUpdate(): void {
    this.dialog.open(BodyMeasurementsEditDialogComponent, {
      closeOnNavigation: true, data: {
        heartRate: this.bodyComposition.heartRate.resting,
        metricSystem: this.metricSystem,
        measurements: this.bodyComposition.measurements
      }, disableClose: true,  maxWidth: '600px'
    })
      .afterClosed()
      .pipe(take(1))
      .toPromise()
      .then((data: BodyMeasurementsEditDialogData) => {
        if (data && data.isDirty) {
          this.bodyComposition.heartRate.resting = parseInt(data.heartRate, 10);
          this.bodyComposition.measurements = new BodyMeasurements(
            parseInt(data.chest, 10),
            parseInt(data.height, 10),
            parseInt(data.hips, 10),
            parseInt(data.iliac, 10),
            parseInt(data.waist, 10),
            parseInt(data.weight, 10),
            data.notes
          );
          this.bodyComposition = this.bodyCompositionService.calculateBodyComposition(
            this.userInfo.bio.getAge(),
            this.userInfo.bio.gender,
            this.bodyComposition.heartRate.resting,
            this.bodyComposition.measurements
          );
          this.isSaving = true;
          this.store.dispatch(new SaveBodyComposition(this.bodyComposition));
        }
      });
  }
}
