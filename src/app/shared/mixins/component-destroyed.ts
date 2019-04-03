import { OnDestroy } from '@angular/core';

import { Subject } from 'app/shared/utils/rxjs-exports';

export class ComponentDestroyed implements OnDestroy {
  protected isDestroyed$: Subject<void> = new Subject();

  public ngOnDestroy(): void {
    this.isDestroyed$.next();
    this.isDestroyed$.complete();
  }
}
