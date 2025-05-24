import React, { createContext, ReactNode, useCallback, useEffect, useReducer } from 'react';
import Keychain from 'react-native-keychain';
import api from '../api/api';
import { ActionTypes, reducer } from './reducer/reducer';
import { AppState, initialState } from './state/state';

export const AppContext = createContext<AppState>(initialState);

interface AppStateProviderProps {
  children: ReactNode;
}

const TOKEN_STORAGE_KEY = 'com.reactexample.token';
const USER_STORAGE_KEY = 'com.reactexample.user';

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function loadAuth() {
      try {
        const tokenCreds = await Keychain.getGenericPassword({ service: TOKEN_STORAGE_KEY });
        const userCreds = await Keychain.getGenericPassword({ service: USER_STORAGE_KEY });

        if (tokenCreds && userCreds) {
          const token = tokenCreds.password;
          const user = JSON.parse(userCreds.password);
          dispatch({ type: ActionTypes.LOGIN, payload: { token, user } });
        } else {
          dispatch({ type: ActionTypes.LOGOUT });
        }
      } catch (error) {
        console.error('Erro ao carregar credenciais:', error);
        dispatch({ type: ActionTypes.LOGOUT });
      }
    }

    loadAuth();
  }, []);

  async function storageAuthData(token: string, user: any) {
    await Keychain.setGenericPassword('token', token, { service: TOKEN_STORAGE_KEY });
    await Keychain.setGenericPassword('user', JSON.stringify(user), { service: USER_STORAGE_KEY });
  }

  async function removeAuthData() {
    await Keychain.resetGenericPassword({ service: TOKEN_STORAGE_KEY });
    await Keychain.resetGenericPassword({ service: USER_STORAGE_KEY });
  }

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/sign-in', { email, password });
      const data = response.data;

      const user = {
        id: data.id,
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        avatar: data.avatar,
        xp: data.xp,
        level: data.level,
        achievements: data.achievements,
      };

      await storageAuthData(data.token, user);
      dispatch({ type: ActionTypes.LOGIN, payload: { token: data.token, user } });
    } catch (error: any) {
      console.error('Erro no login:', error.message);
      throw error;
    }
  }, []);

  const skipPreferences = useCallback(() => {
    dispatch({ type: ActionTypes.SKIP_PREFERENCES });
  }, []);

  const logout = useCallback(async () => {
    try {
      await removeAuthData();
      dispatch({ type: ActionTypes.LOGOUT });
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  }, []);

  const getUser = useCallback(async () => {
    try {
      const response = await api.get('/user');
      const userData = response.data;

      dispatch({ type: ActionTypes.GET_USER, payload: { user: userData } });
    } catch (error: any) {
      console.error('Erro ao buscar dados do usuário:', error.message);
      throw error;
    }
  }, []);


  return (
    <AppContext.Provider value={{ auth: { ...state.auth, login, logout,  hasSkippedPreferences: state.auth.hasSkippedPreferences,skipPreferences }, getUser}}>
      {children}
    </AppContext.Provider>
  );
}