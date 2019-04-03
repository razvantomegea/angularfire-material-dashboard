import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';

import * as fromAdmin from 'app/admin/store/reducers';
import { UserInfo } from 'app/shared/models';
import { environment } from 'env/environment';
import * as fromBodyComposition from './body-composition/reducers';
import * as fromLayout from './layout/reducers';
import * as fromRouter from './router/reducers';
import * as fromUser from './user/reducers';

export interface State {
  admin: fromAdmin.AdminState;
  bodyComposition: fromBodyComposition.BodyCompositionState;
  layout: fromLayout.LayoutState;
  router: RouterReducerState<fromRouter.RouterStateUrl>;
  user: UserInfo;
}

export const reducers: ActionReducerMap<State> = {
  admin: fromAdmin.reducer,
  bodyComposition: fromBodyComposition.reducer,
  layout: fromLayout.reducer,
  router: routerReducer,
  user: fromUser.reducer
};

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = !environment.production ? [logger] : [];
