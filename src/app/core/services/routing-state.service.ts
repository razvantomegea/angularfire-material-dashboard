import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { filter, Subscription } from 'app/shared/utils/rxjs-exports';

@Injectable()
export class RoutingStateService {
  private history: string[] = [];
  private routerEventsSubscription: Subscription;

  constructor(private router: Router) {
  }

  public closeRouting(): void {
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }

  public getHistory(): string[] {
    return this.history;
  }

  public getPreviousUrl(): string {
    return this.history[this.history.length - 2] || '/index';
  }

  public loadRouting(): void {
    if (!this.routerEventsSubscription) {
      this.routerEventsSubscription = this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
          this.history = [...this.history, urlAfterRedirects];
        });
    }
  }
}
