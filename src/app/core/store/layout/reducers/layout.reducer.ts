import { StorageService, THEME, THEME_LIGHT } from 'app/core/services';
import { AppActions, AppActionTypes } from 'app/core/store/app.actions';
import { LayoutActionsUnion, LayoutActionTypes } from '../actions/app.actions';

export interface LayoutState {
  isLoading: number;
  theme: string;
}

export const initialState: LayoutState = {
  isLoading: 0,
  theme: StorageService.get(THEME) || THEME_LIGHT
};

export function reducer(state = initialState, action: LayoutActionsUnion | AppActions): LayoutState {
  switch (action.type) {

    case LayoutActionTypes.ChangeTheme:
      return {
        ...state,
        theme: action.payload
      };

    case AppActionTypes.LogError:
      return {
        ...state,
        isLoading: state.isLoading - 1
      };

    case LayoutActionTypes.ToggleLoading:
      return {
        ...state,
        isLoading: action.payload ? state.isLoading + 1 : state.isLoading - 1
      };

    default:
      return state;
  }
}

export const getHasOverlay = (state: LayoutState) => state.isLoading;
export const getTheme = (state: LayoutState) => state.theme;
