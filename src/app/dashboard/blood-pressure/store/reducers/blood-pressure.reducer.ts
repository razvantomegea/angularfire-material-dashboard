import { BloodPressure } from '../../model';
import { BloodPressureActionsUnion, BloodPressureActionTypes } from '../actions/blood-pressure.actions';

export interface BloodPressureState {
  bloodPressure: BloodPressure;
  isPending: number;
  isWatchingBloodPressure: boolean;
  isWatchingTrends: boolean;
  trends: BloodPressure[];
}

export const initialState: BloodPressureState = {
  isPending: 0,
  isWatchingBloodPressure: false,
  isWatchingTrends: false,
  bloodPressure: new BloodPressure(),
  trends: []
};

export function reducer(state = initialState, action: BloodPressureActionsUnion): BloodPressureState {
  switch (action.type) {

    case BloodPressureActionTypes.GetBloodPressureChanges:
      return {
        ...state,
        isPending: state.isWatchingBloodPressure ? state.isPending : state.isPending + 1,
        isWatchingBloodPressure: true
      };

    case BloodPressureActionTypes.GetBloodPressureTrends:
    case BloodPressureActionTypes.QueryTrends:
      return {
        ...state,
        isPending: state.isWatchingTrends ? state.isPending : state.isPending + 1,
        isWatchingTrends: true
      };

    case BloodPressureActionTypes.SaveBloodPressure:
      return {
        ...state,
        isPending: state.isPending + 1
      };

    case BloodPressureActionTypes.GetBloodPressureChangesFailure:
    case BloodPressureActionTypes.GetBloodPressureTrendsFailure:
    case BloodPressureActionTypes.SaveBloodPressureFailure:
      return {
        ...state,
        isPending: 0
      };

    case BloodPressureActionTypes.GetBloodPressureTrendsSuccess:
      return {
        ...state,
        trends: [...action.payload],
        isPending: state.isPending - 1
      };

    case BloodPressureActionTypes.SaveBloodPressureSuccess:
      return {
        ...state,
        bloodPressure: action.payload,
        isPending: state.isPending - 1
      };


    default:
      return state;
  }
}


export const getIsPending = (state: BloodPressureState) => state ? state.isPending : 0;
export const getBloodPressure = (state: BloodPressureState) => state ? state.bloodPressure : new BloodPressure();
export const getBloodPressureTrends = (state: BloodPressureState) => state ? state.trends : [];
