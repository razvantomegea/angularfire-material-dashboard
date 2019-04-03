import { RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector } from '@ngrx/store';
import { RouterStateUrl } from './router.reducer';

export const getRouterState = createFeatureSelector<RouterReducerState<RouterStateUrl>>('router');

export * from './router.reducer';
