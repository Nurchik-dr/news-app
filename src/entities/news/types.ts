export type NewsArticle = {
  id: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  url: string;
  category: string;
};

export type NewsResponse = {
  page: number;
  hitsPerPage: number;
  hits: Array<{
    objectID: string;
    title: string | null;
    story_title: string | null;
    story_text: string | null;
    comment_text: string | null;
    author: string;
    created_at: string;
    url: string | null;
    story_url: string | null;}>;};