import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NewsArticle } from '../entities/news/types';

export type ThemeMode = 'dark' | 'soft';

type AppState = {
  isAuthenticated: boolean;
  favorites: Record<string, NewsArticle>;
  notification: string | null;
  theme: ThemeMode;
};

type AppAction =
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'TOGGLE_FAVORITE'; payload: NewsArticle }
  | { type: 'SET_FAVORITES'; payload: Record<string, NewsArticle> }
  | { type: 'SHOW_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATION' }
  | { type: 'TOGGLE_THEME' };

const STORAGE_KEY = 'favorites';

const initialState: AppState = {
  isAuthenticated: false,
  favorites: {},
  notification: null,
  theme: 'dark',
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true };

    case 'LOGOUT':
      AsyncStorage.removeItem(STORAGE_KEY);
      return { ...state, isAuthenticated: false,}; // favorites: {} 
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };

    case 'TOGGLE_FAVORITE': {
      const exists = Boolean(state.favorites[action.payload.id]);
      const next = { ...state.favorites };

      if (exists) {
        delete next[action.payload.id];
      } else {
        next[action.payload.id] = action.payload;
      }

      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));

      return { ...state, favorites: next };
    }

    case 'SHOW_NOTIFICATION':
      return { ...state, notification: action.payload };

    case 'CLEAR_NOTIFICATION':
      return { ...state, notification: null };

    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'dark' ? 'soft' : 'dark',
      };

    default:
      return state;
  }
};

const AppStoreContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  hydrated: boolean;
} | null>(null);

export const AppStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);

      if (saved) {
        dispatch({
          type: 'SET_FAVORITES',
          payload: JSON.parse(saved),
        });
      }

      setHydrated(true);
    })();
  }, []);

  const value = useMemo(
    () => ({ state, dispatch, hydrated }),
    [state, hydrated]
  );

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppStoreContext);

  if (!context) {
    throw new Error('useAppStore must be used inside AppStoreProvider');
  }

  return context;
};
