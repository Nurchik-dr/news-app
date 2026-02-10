import { useCallback, useMemo, useState } from 'react';
import { fetchNewsPage } from './api';
import type { NewsArticle } from './types';

export const useNewsFeed = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const load = useCallback(
    async (reset = false) => {
      if (isLoading) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const nextPage = reset ? 0 : page;
        const next = await fetchNewsPage(nextPage);
        setArticles((current) => (reset ? next : [...current, ...next]));
        setPage(nextPage + 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, page],
  );

  const filtered = useMemo(() => {
    return articles.filter((article) => {
      const bySearch = article.title.toLowerCase().includes(search.toLowerCase());
      const byCategory = category === 'All' || article.category === category;
      return bySearch && byCategory;
    });
  }, [articles, category, search]);

  return {
    articles: filtered,
    isLoading,
    error,
    search,
    setSearch,
    category,
    setCategory,
    load,
  };
};
