import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { UserService } from 'app/core/services';
import { State } from 'app/core/store/app.reducers';
import { SaveUserInfoSuccess } from 'app/core/store/user/actions/user.actions';
import { getUser } from 'app/core/store/user/reducers';
import { UserInfo } from 'app/shared/models';
import { map, take } from 'app/shared/utils/rxjs-exports';
import { AuthRedirect } from '../store/actions/admin.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private store: Store<State>, private userService: UserService) {
  }

  public async canActivate(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Promise<boolean> {
    const isLoggedIn = await this.store.pipe(select(getUser), take(1), map((user: UserInfo) => !!user)).toPromise();

    if (!isLoggedIn) {
      const userInfo = await this.userService.getUserInfo();

      if (!userInfo) {
        this.store.dispatch(new AuthRedirect(routerState.url));
        this.router.navigate(['admin']);
        return false;
      } else {
        this.store.dispatch(new SaveUserInfoSuccess(userInfo));
        return true;
      }
    }

    return isLoggedIn;
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivate(route, state);
  }
}
