import { BodyComposition, BodyFat, BodyMeasurements, HeartRate, LeanMuscle } from 'app/dashboard/body-composition/model';
import { BodyCompositionActionsUnion, BodyCompositionActionTypes } from '../actions/body-composition.actions';

export interface BodyCompositionState {
  bodyComposition: BodyComposition;
  isPending: number;
  isWatchingBodyComposition: boolean;
  isWatchingTrends: boolean;
  trends: BodyComposition[];
}

export const initialState: BodyCompositionState = {
  bodyComposition: new BodyComposition(),
  isPending: 0,
  isWatchingBodyComposition: false,
  isWatchingTrends: false,
  trends: []
};

export function reducer(state = initialState, action: BodyCompositionActionsUnion): BodyCompositionState {
  switch (action.type) {

    case BodyCompositionActionTypes.GetBodyCompositionChanges:
      return {
        ...state,
        isPending: state.isWatchingBodyComposition ? state.isPending : state.isPending + 1,
        isWatchingBodyComposition: true
      };

    case BodyCompositionActionTypes.GetBodyCompositionTrends:
      return {
        ...state,
        isPending: state.isWatchingTrends ? state.isPending : state.isPending + 1,
        isWatchingTrends: true
      };

    case BodyCompositionActionTypes.SaveBodyComposition:
      return {
        ...state,
        isPending: state.isPending + 1
      };

    case BodyCompositionActionTypes.GetBodyCompositionChangesFailure:
    case BodyCompositionActionTypes.GetBodyCompositionTrendsFailure:
    case BodyCompositionActionTypes.SaveBodyCompositionFailure:
      return {
        ...state,
        isPending: state.isPending - 1
      };

    case BodyCompositionActionTypes.GetBodyCompositionTrendsSuccess:
      return {
        ...state,
        isPending: state.isPending - 1,
        trends: [...action.payload]
      };

    case BodyCompositionActionTypes.SaveBodyCompositionSuccess:
      return {
        ...state,
        isPending: state.isPending - 1,
        bodyComposition: <BodyComposition>action.payload
      };

    default:
      return state;
  }
}

export const getBodyComposition = (state: BodyCompositionState) => {
  if (state) {
    const bodyComposition: BodyComposition = state.bodyComposition || new BodyComposition();
    const bodyFat: BodyFat = bodyComposition.bodyFat ? new BodyFat(bodyComposition.bodyFat.mass, bodyComposition.bodyFat.percentage)
      : new BodyFat();
    const heartRate: HeartRate = bodyComposition.heartRate ? new HeartRate(
      bodyComposition.heartRate.maximum,
      bodyComposition.heartRate.resting,
      bodyComposition.heartRate.trainingMaximum,
      bodyComposition.heartRate.trainingMinimum
    ) : new HeartRate();
    const leanMuscle: LeanMuscle = bodyComposition.leanMuscle ? new LeanMuscle(
      bodyComposition.leanMuscle.mass,
      bodyComposition.leanMuscle.percentage
    ) : new LeanMuscle();
    const measurements: BodyMeasurements = bodyComposition.measurements ? new BodyMeasurements(
      bodyComposition.measurements.chest,
      bodyComposition.measurements.height,
      bodyComposition.measurements.hips,
      bodyComposition.measurements.iliac,
      bodyComposition.measurements.waist,
      bodyComposition.measurements.weight,
      bodyComposition.measurements.notes
    ) : new BodyMeasurements();

    return new BodyComposition(bodyFat, heartRate, leanMuscle, measurements, bodyComposition.restingMetabolicRate);
  }

  return initialState.bodyComposition;
};
export const getBodyCompositionTrends = (state: BodyCompositionState) => state ? state.trends : [];
export const getIsPending = (state: BodyCompositionState) => state ? state.isPending : 0;
