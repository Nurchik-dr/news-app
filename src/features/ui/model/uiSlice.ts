import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'dark' | 'soft';

type UiState = {
  notification: string | null;
  theme: ThemeMode;
};

const initialState: UiState = {
  notification: null,
  theme: 'dark',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showNotification(state, action: PayloadAction<string>) {
      state.notification = action.payload;
    },
    clearNotification(state) {
      state.notification = null;
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'soft' : 'dark';
    },
  },
});

export const uiActions = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
