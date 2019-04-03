import { Activity, Movement, Session } from '../../model';
import { MovementActionsUnion, MovementActionTypes } from '../actions/movement.actions';

export interface MovementState {
  activities: Activity[];
  activitiesWithOffset: boolean;
  favoriteSessions: Session[];
  isDirty: boolean;
  isPending: number;
  isWatchingActivities: boolean;
  isWatchingMovement: boolean;
  isWatchingSessions: boolean;
  isWatchingTrends: boolean;
  movement: Movement;
  selectedSession: Session;
  trends: Movement[];
}

export const initialState: MovementState = {
  activities: [],
  activitiesWithOffset: false,
  favoriteSessions: [],
  isDirty: false,
  isPending: 0,
  isWatchingActivities: false,
  isWatchingMovement: false,
  isWatchingSessions: false,
  isWatchingTrends: false,
  movement: new Movement(),
  selectedSession: null,
  trends: []
};

export function reducer(state = initialState, action: MovementActionsUnion): MovementState {
  switch (action.type) {

    case MovementActionTypes.GetMovementChanges:
      return {
        ...state,
        isPending: state.isWatchingMovement ? state.isPending : state.isPending + 1,
        isWatchingMovement: true
      };

    case MovementActionTypes.GetActivitiesChanges:
    case MovementActionTypes.QueryActivities:
      return {
        ...state,
        activitiesWithOffset: !!action.payload.offset,
        isPending: state.isWatchingActivities ? state.isPending : state.isPending + 1,
        isWatchingActivities: true
      };

    case MovementActionTypes.DeleteFavoriteSession:
    case MovementActionTypes.SaveFavoriteSession:
      return {
        ...state,
        isPending: state.isPending + 1,
        selectedSession: action.payload
      };

    case MovementActionTypes.GetMovementTrends:
    case MovementActionTypes.QueryTrends:
      return {
        ...state,
        isPending: state.isWatchingTrends ? state.isPending : state.isPending + 1,
        isWatchingTrends: true
      };

    case MovementActionTypes.GetFavoriteSessionsChanges:
    case MovementActionTypes.QueryFavoriteSessions:
      return {
        ...state,
        isPending: state.isWatchingSessions ? state.isPending : state.isPending + 1,
        isWatchingSessions: true
      };

    case MovementActionTypes.SaveMovement:
      return {
        ...state,
        isPending: state.isPending + 1
      };

    case MovementActionTypes.DeleteFavoriteSessionFailure:
    case MovementActionTypes.GetMovementChangesFailure:
    case MovementActionTypes.GetMovementTrendsFailure:
    case MovementActionTypes.GetFavoriteSessionsChangesFailure:
    case MovementActionTypes.SaveMovementFailure:
    case MovementActionTypes.SaveFavoriteSessionFailure:
    case MovementActionTypes.GetActivitiesChangesFailure:
      return {
        ...state,
        isPending: 0
      };

    case MovementActionTypes.DeleteFavoriteSessionSuccess:
      const { isPending, selectedSession } = state;
      selectedSession.name = '';

      return {
        ...state,
        isPending: isPending - 1,
        selectedSession
      };


    case MovementActionTypes.SaveFavoriteSessionSuccess:
      return {
        ...state,
        isPending: state.isPending - 1
      };

    case MovementActionTypes.GetMovementTrendsSuccess:
      return {
        ...state,
        trends: [...action.payload],
        isPending: state.isPending - 1
      };

    case MovementActionTypes.GetActivitiesChangesSuccess:
      return {
        ...state,
        activities:  [...(state.activitiesWithOffset ? state.activities : []), ...action.payload],
        activitiesWithOffset: false,
        isPending: state.isPending - 1
      };

    case MovementActionTypes.GetFavoriteSessionsChangesSuccess:
      return {
        ...state,
        favoriteSessions: [...action.payload],
        isPending: state.isPending - 1
      };

    case MovementActionTypes.SaveMovementSuccess:
      return {
        ...state,
        movement: action.payload,
        isDirty: false,
        isPending: state.isPending - 1,
        selectedSession: new Session()
      };

    case MovementActionTypes.DeleteSession:
      const meal: Session = action.payload;
      const currSessions: Session[] = (state.movement || new Movement()).sessions;
      const mealIndex: number = currSessions.findIndex((m: Session) => m.timestamp === meal.timestamp);

      return {
        ...state,
        movement: { ...state.movement, sessions: [...currSessions.slice(0, mealIndex), ...currSessions.slice(mealIndex + 1)] },
        isDirty: true
      };

    case MovementActionTypes.SaveSession:
      const newSession: Session = action.payload;
      const sessions: Session[] = (state.movement || new Movement()).sessions;
      const existingSessionIndex: number = sessions.findIndex((m: Session) => m.timestamp === newSession.timestamp);

      return {
        ...state,
        movement: {
          ...(state.movement || new Movement()),
          sessions: existingSessionIndex !== -1 ? [
            ...sessions.slice(0, existingSessionIndex),
            newSession,
            ...sessions.slice(existingSessionIndex + 1)
          ] : [
            ...sessions,
            newSession
          ]
        },
        isDirty: true
      };

    case MovementActionTypes.SelectSessionSuccess:
      return {
        ...state,
        selectedSession: action.payload
      };

    default:
      return state;
  }
}

export const getActivities = (state: MovementState) => state ? state.activities : [];
export const getFavoriteSessions = (state: MovementState) => state ? state.favoriteSessions : [];
export const getIsDirty = (state: MovementState) => state ? state.isDirty : false;
export const getIsPending = (state: MovementState) => state ? state.isPending : 0;
export const getMovement = (state: MovementState) => state ? state.movement : new Movement();
export const getMovementTrends = (state: MovementState) => state ? state.trends : [];
export const getSelectedSession = (state: MovementState) => state ? state.selectedSession : new Session();
