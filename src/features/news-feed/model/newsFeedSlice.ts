import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { NewsArticle } from '../../../entities/news/types';

type ApplyPagePayload = {
  articles: NewsArticle[];
  page: number;
  reset: boolean;
};

type NewsFeedState = {
  items: NewsArticle[];
  page: number;
  isLoading: boolean;
  error: string | null;
  search: string;
  category: string;
};

const initialState: NewsFeedState = {
  items: [],
  page: 0,
  isLoading: false,
  error: null,
  search: '',
  category: 'Все',
};

const newsFeedSlice = createSlice({
  name: 'newsFeed',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
    },
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    finishLoading(state) {
      state.isLoading = false;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    applyPage(state, action: PayloadAction<ApplyPagePayload>) {
      const { articles, page, reset } = action.payload;

      state.items = reset ? articles : [...state.items, ...articles];
      state.page = page + 1;
    },
  },
});

export const newsFeedActions = newsFeedSlice.actions;
export const newsFeedReducer = newsFeedSlice.reducer;
