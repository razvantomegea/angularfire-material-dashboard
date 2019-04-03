import { Injectable } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, RouterEvent } from '@angular/router';

import { filter, map, mergeMap, Observable } from 'app/shared/utils/rxjs-exports';

@Injectable()
export class TitleService {

  public static getRouteTitle(activatedRoute: ActivatedRoute): Observable<string> {
    let route = activatedRoute;

    while (route.firstChild) {
      route = route.firstChild;
    }

    return route.data.pipe(map((data: { title: string }) => data.title));
  }

  public static getRouteTitleFromEvents(
    routerEvents: Observable<Event>,
    activatedRoute: ActivatedRoute
  ): Observable<string> {
    return routerEvents.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd),
      map(() => {
        let route = activatedRoute;

        while (route.firstChild) {
          route = route.firstChild;
        }

        return route;
      }),
      filter((route: ActivatedRoute) => route.outlet === 'primary'),
      mergeMap((route: ActivatedRoute) => route.data),
      map((data: { title: string }) => data.title)
    );
  }
}
