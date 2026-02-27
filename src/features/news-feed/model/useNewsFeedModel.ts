import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useLazyGetNewsPageQuery } from '../api/newsApi';
import { newsFeedActions } from './newsFeedSlice';
import {
  selectFilteredNews,
  selectNewsCategory,
  selectNewsError,
  selectNewsIsLoading,
  selectNewsPage,
  selectNewsSearch,
} from './selectors';

export const useNewsFeedModel = () => {
  const dispatch = useAppDispatch();
  const [trigger] = useLazyGetNewsPageQuery();

  const articles = useAppSelector(selectFilteredNews);
  const page = useAppSelector(selectNewsPage);
  const isLoading = useAppSelector(selectNewsIsLoading);
  const error = useAppSelector(selectNewsError);
  const search = useAppSelector(selectNewsSearch);
  const category = useAppSelector(selectNewsCategory);

  const load = useCallback(
    async (reset = false) => {
      if (isLoading) {
        return;
      }

      try {
        dispatch(newsFeedActions.startLoading());

        const nextPage = reset ? 0 : page;
        const next = await trigger(nextPage).unwrap();

        dispatch(
          newsFeedActions.applyPage({
            articles: next,
            page: nextPage,
            reset,
          })
        );
      } catch (err) {
        dispatch(
          newsFeedActions.setError(
            err instanceof Error ? err.message : 'Неизвестная ошибка'
          )
        );
      } finally {
        dispatch(newsFeedActions.finishLoading());
      }
    },
    [dispatch, isLoading, page, trigger]
  );

  const setSearch = useCallback(
    (value: string) => {
      dispatch(newsFeedActions.setSearch(value));
    },
    [dispatch]
  );

  const setCategory = useCallback(
    (value: string) => {
      dispatch(newsFeedActions.setCategory(value));
    },
    [dispatch]
  );

  return {
    articles,
    isLoading,
    error,
    search,
    setSearch,
    category,
    setCategory,
    load,
  };
};
