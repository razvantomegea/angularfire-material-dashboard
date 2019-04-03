import { Component, Input } from '@angular/core';
import { BodyComposition } from 'app/dashboard/body-composition/model';
import { MetricSystem } from 'app/shared/models';

@Component({
  selector: 'app-body-composition-calculations',
  templateUrl: './body-composition-calculations.component.html',
  styleUrls: ['./body-composition-calculations.component.scss']
})
export class BodyCompositionCalculationsComponent {
  @Input() private bodyComposition: BodyComposition;
  @Input() private metricSystem: MetricSystem;

  public getBodyFatPercentage(): string {
    return this.bodyComposition ? `${Math.round(this.bodyComposition.bodyFat.percentage)}%` : '';
  }

  public getLeanMuscleMass(): string {
    return this.bodyComposition ? `${Math.round(this.bodyComposition.leanMuscle.mass)}${this.metricSystem.mass}` : '';
  }

  public getMaximumHeartRate(): string {
    return this.bodyComposition ? `${this.bodyComposition.heartRate.maximum}bpm` : '';
  }

  public getRestingMetabolicRate(): string {
    return this.bodyComposition ? `${Math.round(this.bodyComposition.restingMetabolicRate)}kcal` : '';
  }

  public getTrainingHeartRate(): string {
    return this.bodyComposition ? `${this.bodyComposition.heartRate.getTrainingHeartRate()}` : '';
  }

}
