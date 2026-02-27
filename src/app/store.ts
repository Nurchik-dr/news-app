import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../shared/api/baseApi';
import { authReducer } from '../features/auth/model/authSlice';
import { favoritesReducer } from '../features/favorites/model/favoritesSlice';
import { uiReducer } from '../features/ui/model/uiSlice';
import { newsFeedReducer } from '../features/news-feed/model/newsFeedSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
    ui: uiReducer,
    newsFeed: newsFeedReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
