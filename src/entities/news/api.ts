import type { NewsArticle, NewsResponse } from './types';

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

const toArticle = (item: NewsResponse['hits'][number], index: number): NewsArticle => ({
  id: item.objectID,
  title: safeText(item.title ?? item.story_title, 'Без названия'),
  description: safeText(item.story_text ?? item.comment_text),
  author: item.author || 'Автор неизвестен',
  publishedAt: item.created_at,
  imageUrl: `https://picsum.photos/seed/${item.objectID}/120/120`,
  url: item.url ?? item.story_url ?? 'https://news.ycombinator.com/',
  category: getCategory(index),
});

export const fetchNewsPage = async (page: number): Promise<NewsArticle[]> => {
  const params = new URLSearchParams({
    query: QUERY,
    page: String(page),
    hitsPerPage: String(PAGE_SIZE),
  });

  const response = await fetch(
    `https://hn.algolia.com/api/v1/search_by_date?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error('Не удалось загрузить новости. Попробуйте снова.');
  }

  const data = (await response.json()) as NewsResponse;

  return data.hits.map((item, index) =>
    toArticle(item, page * PAGE_SIZE + index)
  );
};
