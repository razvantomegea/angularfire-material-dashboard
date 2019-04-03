import { BloodGlucose } from '../../model';
import { BloodGlucoseActionsUnion, BloodGlucoseActionTypes } from '../actions/blood-glucose.actions';

export interface BloodGlucoseState {
  bloodGlucose: BloodGlucose;
  isPending: number;
  isWatchingBloodGlucose: boolean;
  isWatchingTrends: boolean;
  trends: BloodGlucose[];
}

export const initialState: BloodGlucoseState = {
  isPending: 0,
  isWatchingBloodGlucose: false,
  isWatchingTrends: false,
  bloodGlucose: new BloodGlucose(),
  trends: []
};

export function reducer(state = initialState, action: BloodGlucoseActionsUnion): BloodGlucoseState {
  switch (action.type) {

    case BloodGlucoseActionTypes.GetBloodGlucoseChanges:
      return {
        ...state,
        isPending: state.isWatchingBloodGlucose ? state.isPending : state.isPending + 1,
        isWatchingBloodGlucose: true
      };

    case BloodGlucoseActionTypes.GetBloodGlucoseTrends:
    case BloodGlucoseActionTypes.QueryTrends:
      return {
        ...state,
        isPending: state.isWatchingTrends ? state.isPending : state.isPending + 1,
        isWatchingTrends: true
      };

    case BloodGlucoseActionTypes.SaveBloodGlucose:
      return {
        ...state,
        isPending: state.isPending + 1
      };

    case BloodGlucoseActionTypes.GetBloodGlucoseChangesFailure:
    case BloodGlucoseActionTypes.GetBloodGlucoseTrendsFailure:
    case BloodGlucoseActionTypes.SaveBloodGlucoseFailure:
      return {
        ...state,
        isPending: 0
      };

    case BloodGlucoseActionTypes.GetBloodGlucoseTrendsSuccess:
      return {
        ...state,
        trends: [...action.payload],
        isPending: state.isPending - 1
      };

    case BloodGlucoseActionTypes.SaveBloodGlucoseSuccess:
      return {
        ...state,
        bloodGlucose: action.payload,
        isPending: state.isPending - 1
      };


    default:
      return state;
  }
}


export const getIsPending = (state: BloodGlucoseState) => state ? state.isPending : 0;
export const getBloodGlucose = (state: BloodGlucoseState) => state ? state.bloodGlucose : new BloodGlucose();
export const getBloodGlucoseTrends = (state: BloodGlucoseState) => state ? state.trends : [];
