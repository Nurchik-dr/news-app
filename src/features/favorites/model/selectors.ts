import type { RootState } from '../../../app/store';

export const selectFavoritesMap = (state: RootState) => state.favorites.items;
export const selectFavoritesHydrated = (state: RootState) =>
  state.favorites.hydrated;
