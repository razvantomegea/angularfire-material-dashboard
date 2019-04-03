import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from './core/services';

@Injectable({
  providedIn: 'root'
})
export class AppErrorHandler implements ErrorHandler {
  private loadingService: LoadingBarService;
  private notificationService: NotificationService;
  private spinnerService: NgxSpinnerService;

  constructor(private injector: Injector) {
  }

  public handleError(err: any): void {
    if (!this.loadingService) {
      this.loadingService = this.injector.get(LoadingBarService);
    }

    if (!this.notificationService) {
      this.notificationService = this.injector.get(NotificationService);
    }

    if (!this.spinnerService) {
      this.spinnerService = this.injector.get(NgxSpinnerService);
    }

    let errorMessage: string;
    if (err.hasOwnProperty('rejection')) {
      errorMessage = err.rejection.message;
    } else if (err.hasOwnProperty('message')) {
      errorMessage = err.message;
    } else {
      errorMessage = err.toString();
    }

    this.loadingService.complete();
    this.spinnerService.hide();
    this.notificationService.showError(errorMessage);
    console.error(err);
  }
}
