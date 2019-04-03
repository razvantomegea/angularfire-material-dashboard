import { BloodKetones } from '../../model';
import { BloodKetonesActionsUnion, BloodKetonesActionTypes } from '../actions/blood-ketones.actions';

export interface BloodKetonesState {
  bloodKetones: BloodKetones;
  isPending: number;
  isWatchingBloodKetones: boolean;
  isWatchingTrends: boolean;
  trends: BloodKetones[];
}

export const initialState: BloodKetonesState = {
  isPending: 0,
  isWatchingBloodKetones: false,
  isWatchingTrends: false,
  bloodKetones: new BloodKetones(),
  trends: []
};

export function reducer(state = initialState, action: BloodKetonesActionsUnion): BloodKetonesState {
  switch (action.type) {

    case BloodKetonesActionTypes.GetBloodKetonesChanges:
      return {
        ...state,
        isPending: state.isWatchingBloodKetones ? state.isPending : state.isPending + 1,
        isWatchingBloodKetones: true
      };

    case BloodKetonesActionTypes.GetBloodKetonesTrends:
    case BloodKetonesActionTypes.QueryTrends:
      return {
        ...state,
        isPending: state.isWatchingTrends ? state.isPending : state.isPending + 1,
        isWatchingTrends: true
      };

    case BloodKetonesActionTypes.SaveBloodKetones:
      return {
        ...state,
        isPending: state.isPending + 1
      };

    case BloodKetonesActionTypes.GetBloodKetonesChangesFailure:
    case BloodKetonesActionTypes.GetBloodKetonesTrendsFailure:
    case BloodKetonesActionTypes.SaveBloodKetonesFailure:
      return {
        ...state,
        isPending: 0
      };

    case BloodKetonesActionTypes.GetBloodKetonesTrendsSuccess:
      return {
        ...state,
        trends: [...action.payload],
        isPending: state.isPending - 1
      };

    case BloodKetonesActionTypes.SaveBloodKetonesSuccess:
      return {
        ...state,
        bloodKetones: action.payload,
        isPending: state.isPending - 1
      };


    default:
      return state;
  }
}


export const getIsPending = (state: BloodKetonesState) => state ? state.isPending : 0;
export const getBloodKetones = (state: BloodKetonesState) => state ? state.bloodKetones : new BloodKetones();
export const getBloodKetonesTrends = (state: BloodKetonesState) => state ? state.trends : [];
