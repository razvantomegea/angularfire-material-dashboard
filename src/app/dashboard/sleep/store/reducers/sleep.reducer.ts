import { Sleep } from '../../model';
import { SleepActionsUnion, SleepActionTypes } from '../actions/sleep.actions';

export interface SleepState {
  isPending: number;
  isWatchingSleep: boolean;
  isWatchingTrends: boolean;
  sleep: Sleep;
  trends: Sleep[];
}

export const initialState: SleepState = {
  isPending: 0,
  isWatchingSleep: false,
  isWatchingTrends: false,
  sleep: new Sleep(),
  trends: []
};

export function reducer(state = initialState, action: SleepActionsUnion): SleepState {
  switch (action.type) {

    case SleepActionTypes.GetSleepChanges:
      return {
        ...state,
        isPending: state.isWatchingSleep ? state.isPending : state.isPending + 1,
        isWatchingSleep: true
      };

    case SleepActionTypes.GetSleepTrends:
    case SleepActionTypes.QueryTrends:
      return {
        ...state,
        isPending: state.isWatchingTrends ? state.isPending : state.isPending + 1,
        isWatchingTrends: true
      };

    case SleepActionTypes.SaveSleep:
      return {
        ...state,
        isPending: state.isPending + 1
      };

    case SleepActionTypes.GetSleepChangesFailure:
    case SleepActionTypes.GetSleepTrendsFailure:
    case SleepActionTypes.SaveSleepFailure:
      return {
        ...state,
        isPending: 0
      };

    case SleepActionTypes.GetSleepTrendsSuccess:
      return {
        ...state,
        trends: [...action.payload],
        isPending: state.isPending - 1
      };

    case SleepActionTypes.SaveSleepSuccess:
      return {
        ...state,
        sleep: action.payload,
        isPending: state.isPending - 1
      };


    default:
      return state;
  }
}


export const getIsPending = (state: SleepState) => state ? state.isPending : 0;
export const getSleep = (state: SleepState) => state ? state.sleep : new Sleep();
export const getSleepTrends = (state: SleepState) => state ? state.trends : [];
