import { Component, Input } from '@angular/core';
import { BodyComposition } from 'app/dashboard/body-composition/model';
import { MetricSystem } from 'app/shared/models';

@Component({
  selector: 'app-body-composition-measurements',
  templateUrl: './body-composition-measurements.component.html',
  styleUrls: ['./body-composition-measurements.component.scss']
})
export class BodyCompositionMeasurementsComponent {
  @Input() private bodyComposition: BodyComposition;
  @Input() private metricSystem: MetricSystem;

  public getChestMeasurement(): string {
    return this.bodyComposition ? `${this.bodyComposition.measurements.chest}${this.metricSystem.length}` : '';
  }

  public getHeightMeasurement(): string {
    return this.bodyComposition ? `${this.bodyComposition.measurements.height}${this.metricSystem.length}` : '';
  }

  public getHipsMeasurement(): string {
    return this.bodyComposition ? `${this.bodyComposition.measurements.hips}${this.metricSystem.length}` : '';
  }

  public getIliacMeasurement(): string {
    return this.bodyComposition ? `${this.bodyComposition.measurements.iliac}${this.metricSystem.length}` : '';
  }

  public getRestingHeartRate(): string {
    return this.bodyComposition ? `${this.bodyComposition.heartRate.resting}bpm` : '';
  }

  public getWaistMeasurement(): string {
    return this.bodyComposition ? `${this.bodyComposition.measurements.waist}${this.metricSystem.length}` : '';
  }

  public getWeightMeasurement(): string {
    return this.bodyComposition ? `${this.bodyComposition.measurements.weight}${this.metricSystem.mass}` : '';
  }

}
