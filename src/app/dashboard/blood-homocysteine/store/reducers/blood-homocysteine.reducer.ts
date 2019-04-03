import { BloodHomocysteine } from '../../model';
import { BloodHomocysteineActionsUnion, BloodHomocysteineActionTypes } from '../actions/blood-homocysteine.actions';

export interface BloodHomocysteineState {
  bloodHomocysteine: BloodHomocysteine;
  isPending: number;
  isWatchingBloodHomocysteine: boolean;
  isWatchingTrends: boolean;
  trends: BloodHomocysteine[];
}

export const initialState: BloodHomocysteineState = {
  isPending: 0,
  isWatchingBloodHomocysteine: false,
  isWatchingTrends: false,
  bloodHomocysteine: new BloodHomocysteine(),
  trends: []
};

export function reducer(state = initialState, action: BloodHomocysteineActionsUnion): BloodHomocysteineState {
  switch (action.type) {

    case BloodHomocysteineActionTypes.GetBloodHomocysteineChanges:
      return {
        ...state,
        isPending: state.isWatchingBloodHomocysteine ? state.isPending : state.isPending + 1,
        isWatchingBloodHomocysteine: true
      };

    case BloodHomocysteineActionTypes.GetBloodHomocysteineTrends:
    case BloodHomocysteineActionTypes.QueryTrends:
      return {
        ...state,
        isPending: state.isWatchingTrends ? state.isPending : state.isPending + 1,
        isWatchingTrends: true
      };

    case BloodHomocysteineActionTypes.SaveBloodHomocysteine:
      return {
        ...state,
        isPending: state.isPending + 1
      };

    case BloodHomocysteineActionTypes.GetBloodHomocysteineChangesFailure:
    case BloodHomocysteineActionTypes.GetBloodHomocysteineTrendsFailure:
    case BloodHomocysteineActionTypes.SaveBloodHomocysteineFailure:
      return {
        ...state,
        isPending: 0
      };

    case BloodHomocysteineActionTypes.GetBloodHomocysteineTrendsSuccess:
      return {
        ...state,
        trends: [...action.payload],
        isPending: state.isPending - 1
      };

    case BloodHomocysteineActionTypes.SaveBloodHomocysteineSuccess:
      return {
        ...state,
        bloodHomocysteine: action.payload,
        isPending: state.isPending - 1
      };


    default:
      return state;
  }
}


export const getIsPending = (state: BloodHomocysteineState) => state ? state.isPending : 0;
export const getBloodHomocysteine = (state: BloodHomocysteineState) => state ? state.bloodHomocysteine : new BloodHomocysteine();
export const getBloodHomocysteineTrends = (state: BloodHomocysteineState) => state ? state.trends : [];
