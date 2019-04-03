import { MatDialogRef } from '@angular/material';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';

import { filter, takeUntil } from 'app/shared/utils/rxjs-exports';
import { ComponentDestroyed } from './component-destroyed';

export class DialogClosed extends ComponentDestroyed {
  constructor(protected dialogRef: MatDialogRef<any>, protected router: Router) {
    super();
    router.events.pipe(
      takeUntil(this.isDestroyed$),
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe(() => {
      dialogRef.close();
    });
  }

}
