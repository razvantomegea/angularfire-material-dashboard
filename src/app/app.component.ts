import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { Observable, Subscription, takeUntil } from 'app/shared/utils/rxjs-exports';
import { RoutingStateService } from './core/services';
import { State } from './core/store/app.reducers';
import * as fromLayout from './core/store/layout/reducers';
import { ComponentDestroyed } from './shared/mixins';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends ComponentDestroyed implements OnInit, OnDestroy {
  public themeClass: string;

  private readonly theme$: Observable<string> = this.store.pipe(select(fromLayout.getTheme), takeUntil(this.isDestroyed$));
  private themeSubscription: Subscription;

  constructor(
    private overlayContainer: OverlayContainer,
    private routingStateService: RoutingStateService,
    private store: Store<State>
  ) {
    super();
  }

  public ngOnDestroy(): void {
    this.routingStateService.closeRouting();
  }

  public ngOnInit(): void {
    this.routingStateService.loadRouting();
    this.themeSubscription = this.theme$.subscribe((theme: string) => {
      this.themeClass = theme;
      const overlayContainerClasses = this.overlayContainer.getContainerElement()
        .classList;
      const themeClassesToRemove = Array.from(overlayContainerClasses).filter(
        (item: string) => item.includes('-theme')
      );
      if (themeClassesToRemove.length) {
        overlayContainerClasses.remove(...themeClassesToRemove);
      }
      overlayContainerClasses.add(theme);
    });
  }
}
