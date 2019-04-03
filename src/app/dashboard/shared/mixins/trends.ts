import { MatDialog } from '@angular/material';
import * as moment from 'moment';

import { TrendsFilterDialogComponent, TrendsFilterDialogData } from 'app/dashboard/shared';
import { ComponentDestroyed } from 'app/shared/mixins';
import { LineChartColor, LineChartEntry } from 'app/shared/models';
import { take } from 'app/shared/utils/rxjs-exports';

export class Trends extends ComponentDestroyed {
  public readonly chartColors: LineChartColor[];
  public readonly chartLegend = true;
  public readonly chartOptions: any = {
    responsive: true
  };
  public readonly chartType = 'line';
  public chartData: LineChartEntry[];
  public chartLabels: string[];

  constructor(protected trendsDate: string, protected trendsInterval: number, protected trendSeries: string, private matDialog: MatDialog) {
    super();
    this.chartColors = [
      {
        backgroundColor: 'rgb(105, 115, 145, .2)',
        borderColor: '#697391', // $dark-color-light
        pointBackgroundColor: '#697391',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#697391'
      }
    ];
  }

  protected async filterTrends(series: string[]): Promise<TrendsFilterDialogData> {
    const trendsData: TrendsFilterDialogData = await this.matDialog.open(TrendsFilterDialogComponent, {
      data: <TrendsFilterDialogData>{
        endDate: this.trendsDate,
        days: this.trendsInterval,
        selectedSeries: this.trendSeries,
        series
      },
      disableClose: true
    }).afterClosed().pipe(take(1)).toPromise();

    if (trendsData) {
      this.trendsDate = moment(trendsData.endDate).format('YYYY-MM-DD');
      this.trendsInterval = trendsData.days;
      this.trendSeries = trendsData.selectedSeries;
    }

    return trendsData;
  }

  protected setupTrendsData(data: any[], labels: string[]): void {
    this.chartData = [
      {
        data,
        label: this.trendSeries
      }
    ];

   setTimeout(() => {
      this.chartLabels = labels;
    });
  }
}
