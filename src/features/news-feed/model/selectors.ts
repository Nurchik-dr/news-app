import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';

export const selectNewsFeedState = (state: RootState) => state.newsFeed;

export const selectNewsItems = (state: RootState) => state.newsFeed.items;
export const selectNewsPage = (state: RootState) => state.newsFeed.page;
export const selectNewsIsLoading = (state: RootState) => state.newsFeed.isLoading;
export const selectNewsError = (state: RootState) => state.newsFeed.error;
export const selectNewsSearch = (state: RootState) => state.newsFeed.search;
export const selectNewsCategory = (state: RootState) => state.newsFeed.category;

export const selectFilteredNews = createSelector(
  [selectNewsItems, selectNewsSearch, selectNewsCategory],
  (articles, search, category) => {
    const normalizedSearch = search.toLowerCase();

    return articles.filter((article) => {
      const bySearch = article.title.toLowerCase().includes(normalizedSearch);
      const byCategory = category === 'Все' || article.category === category;

      return bySearch && byCategory;
    });
  }
);
