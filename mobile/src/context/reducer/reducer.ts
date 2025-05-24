import { AppState } from "../state/state";


export enum ActionTypes {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    GET_USER = 'GET_USER',
    SKIP_PREFERENCES = 'SKIP_PREFERENCES',
}

interface Action {
    type: ActionTypes;
    payload?: any;
}

export const reducer = (state: AppState, action: Action) => {
    switch (action.type) {
        case ActionTypes.LOGIN:
            return {
                ...state,
                auth: {
                    ...state.auth,
                    token: action.payload.token,
                    isAuthenticated: true,
                    user: action.payload.user
                }
            }
        case ActionTypes.LOGOUT:
            return {
                ...state,
                auth: {
                    ...state.auth,
                    token: '',
                    isAuthenticated: false,
                    user: null
                }
            }  
        case ActionTypes.GET_USER: 
        return {
            ...state,
            auth: {
                ...state.auth,
                user: action.payload.user,
            },
            
        }

        case ActionTypes.SKIP_PREFERENCES:
  return {
    ...state,
    auth: {
      ...state.auth,
      hasSkippedPreferences: true,
    }
  };
        default:
            return state;
    }
}