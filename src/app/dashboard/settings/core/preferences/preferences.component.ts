import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material';

import { MetricSystem } from 'app/shared/models';
import {
  METRIC_SYSTEM_STANDARD,
  METRIC_SYSTEM_STANDARD_NAME,
  METRIC_SYSTEM_US,
  THEME_DARK,
  THEME_LIGHT
} from 'app/core/services';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent {
  @Input() private theme: string;
  @Input() public metricSystem: MetricSystem;

  @Output() private readonly metricSystemChange: EventEmitter<MetricSystem> = new EventEmitter();
  @Output() private readonly themeChange: EventEmitter<string> = new EventEmitter();

  public isLightTheme(): boolean {
    return this.theme === THEME_LIGHT;
  }

  public isMetricSystemStandard(): boolean {
    return this.metricSystem.name === METRIC_SYSTEM_STANDARD_NAME;
  }

  public onChangeMetricSystem(event: MatSlideToggleChange): void {
    this.metricSystemChange.emit(event.checked ? METRIC_SYSTEM_STANDARD : METRIC_SYSTEM_US);
  }

  public onChangeTheme(event: MatSlideToggleChange): void {
    if (event.checked) {
      this.themeChange.emit(THEME_LIGHT);
    } else {
      this.themeChange.emit(THEME_DARK);
    }
  }

}
