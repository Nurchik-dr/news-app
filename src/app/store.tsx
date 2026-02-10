import React, { createContext, useContext, useMemo, useReducer } from 'react';
import type { NewsArticle } from '../entities/news/types';

type AppState = {
  isAuthenticated: boolean;
  favorites: Record<string, NewsArticle>;
  notification: string | null;
};

type AppAction =
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'TOGGLE_FAVORITE'; payload: NewsArticle }
  | { type: 'SHOW_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATION' };

const initialState: AppState = {
  isAuthenticated: false,
  favorites: {},
  notification: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, favorites: {} };
    case 'TOGGLE_FAVORITE': {
      const exists = Boolean(state.favorites[action.payload.id]);
      if (exists) {
        const next = { ...state.favorites };
        delete next[action.payload.id];
        return { ...state, favorites: next };
      }

      return {
        ...state,
        favorites: {
          ...state.favorites,
          [action.payload.id]: action.payload,
        },
      };
    }
    case 'SHOW_NOTIFICATION':
      return { ...state, notification: action.payload };
    case 'CLEAR_NOTIFICATION':
      return { ...state, notification: null };
    default:
      return state;
  }
};

const AppStoreContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
};

export const useAppStore = () => {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used inside AppStoreProvider');
  }
  return context;
};
