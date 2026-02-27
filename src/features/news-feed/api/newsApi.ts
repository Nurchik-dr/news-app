import { baseApi } from '../../../shared/api/baseApi';
import type { NewsArticle, NewsResponse } from '../../../entities/news/types';

const PAGE_SIZE = 20;
const QUERY = 'technology';

const categoryPool = ['Общие', 'Технологии', 'Бизнес', 'Наука'];

const getCategory = (index: number) => categoryPool[index % categoryPool.length];

const safeText = (value?: string | null, fallback = 'Описание недоступно.') => {
  if (!value) {
    return fallback;
  }

  return value.replace(/<[^>]+>/g, '').trim() || fallback;
};

const toArticle = (
  item: NewsResponse['hits'][number],
  index: number
): NewsArticle => ({
  id: item.objectID,
  title: safeText(item.title ?? item.story_title, 'Без названия'),
  description: safeText(item.story_text ?? item.comment_text),
  author: item.author || 'Автор неизвестен',
  publishedAt: item.created_at,
  imageUrl: `https://picsum.photos/seed/${item.objectID}/120/120`,
  url: item.url ?? item.story_url ?? 'https://news.ycombinator.com/',
  category: getCategory(index),
});

export const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNewsPage: builder.query<NewsArticle[], number>({
      query: (page) => {
        const params = new URLSearchParams({
          query: QUERY,
          page: String(page),
          hitsPerPage: String(PAGE_SIZE),
        });

        return `search_by_date?${params.toString()}`;
      },
      transformResponse: (response: NewsResponse, _meta, page) =>
        response.hits.map((item, index) => toArticle(item, page * PAGE_SIZE + index)),
      providesTags: (_result, _error, page) => [
        { type: 'News', id: `PAGE-${page}` },
        { type: 'News', id: 'LIST' },
      ],
    }),
  }),
});

export const { useLazyGetNewsPageQuery } = newsApi;
