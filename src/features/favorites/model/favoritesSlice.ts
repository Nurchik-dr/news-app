import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { NewsArticle } from '../../../entities/news/types';

type FavoritesState = {
  items: Record<string, NewsArticle>;
  hydrated: boolean;
};

const initialState: FavoritesState = {
  items: {},
  hydrated: false,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites(state, action: PayloadAction<Record<string, NewsArticle>>) {
      state.items = action.payload;
    },
    setHydrated(state, action: PayloadAction<boolean>) {
      state.hydrated = action.payload;
    },
    toggleFavorite(state, action: PayloadAction<NewsArticle>) {
      const article = action.payload;
      const exists = Boolean(state.items[article.id]);

      if (exists) {
        delete state.items[article.id];
        return;
      }

      state.items[article.id] = article;
    },
  },
});

export const favoritesActions = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
