import { BloodLipids } from '../../model';
import { BloodLipidsActionsUnion, BloodLipidsActionTypes } from '../actions/blood-lipids.actions';

export interface BloodLipidsState {
  bloodLipids: BloodLipids;
  isPending: number;
  isWatchingBloodLipids: boolean;
  isWatchingTrends: boolean;
  trends: BloodLipids[];
}

export const initialState: BloodLipidsState = {
  isPending: 0,
  isWatchingBloodLipids: false,
  isWatchingTrends: false,
  bloodLipids: new BloodLipids(),
  trends: []
};

export function reducer(state = initialState, action: BloodLipidsActionsUnion): BloodLipidsState {
  switch (action.type) {

    case BloodLipidsActionTypes.GetBloodLipidsChanges:
      return {
        ...state,
        isPending: state.isWatchingBloodLipids ? state.isPending : state.isPending + 1,
        isWatchingBloodLipids: true
      };

    case BloodLipidsActionTypes.GetBloodLipidsTrends:
    case BloodLipidsActionTypes.QueryTrends:
      return {
        ...state,
        isPending: state.isWatchingTrends ? state.isPending : state.isPending + 1,
        isWatchingTrends: true
      };

    case BloodLipidsActionTypes.SaveBloodLipids:
      return {
        ...state,
        isPending: state.isPending + 1
      };

    case BloodLipidsActionTypes.GetBloodLipidsChangesFailure:
    case BloodLipidsActionTypes.GetBloodLipidsTrendsFailure:
    case BloodLipidsActionTypes.SaveBloodLipidsFailure:
      return {
        ...state,
        isPending: 0
      };

    case BloodLipidsActionTypes.GetBloodLipidsTrendsSuccess:
      return {
        ...state,
        trends: [...action.payload],
        isPending: state.isPending - 1
      };

    case BloodLipidsActionTypes.SaveBloodLipidsSuccess:
      return {
        ...state,
        bloodLipids: action.payload,
        isPending: state.isPending - 1
      };


    default:
      return state;
  }
}


export const getIsPending = (state: BloodLipidsState) => state ? state.isPending : 0;
export const getBloodLipids = (state: BloodLipidsState) => state ? state.bloodLipids : new BloodLipids();
export const getBloodLipidsTrends = (state: BloodLipidsState) => state ? state.trends : [];
