import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Action, ThunkAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { NewsArticle } from '../../../entities/news/types';
import { FAVORITES_STORAGE_KEY } from './constants';
import { favoritesActions } from './favoritesSlice';
import { selectFavoritesMap } from './selectors';

type AppThunk = ThunkAction<void | Promise<void>, RootState, unknown, Action>;

const isNewsRecord = (value: unknown): value is Record<string, NewsArticle> => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return Object.values(value).every((item) => {
    return (
      item &&
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      typeof item.description === 'string' &&
      typeof item.author === 'string' &&
      typeof item.publishedAt === 'string' &&
      typeof item.imageUrl === 'string' &&
      typeof item.url === 'string' &&
      typeof item.category === 'string'
    );
  });
};

export const hydrateFavorites = (): AppThunk => async (dispatch) => {
  try {
    const saved = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved) as unknown;

      if (isNewsRecord(parsed)) {
        dispatch(favoritesActions.setFavorites(parsed));
      }
    }
  } finally {
    dispatch(favoritesActions.setHydrated(true));
  }
};

export const toggleFavoriteAndPersist =
  (article: NewsArticle): AppThunk =>
  async (dispatch, getState) => {
    dispatch(favoritesActions.toggleFavorite(article));
    const favorites = selectFavoritesMap(getState());
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  };

export const clearFavoritesStorage = (): AppThunk => async () => {
  await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
};
