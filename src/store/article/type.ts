export type ArticleItem = {
  id: number;
  nom: string;
  created_at?: string | null;
  updated_at?: string | null;
};

export type ArticleStore = {
  article: ArticleItem | null;
  articleList: ArticleItem[];
  loading: boolean;
  createArticle: (article: Partial<ArticleItem>) => Promise<ArticleItem>;
  updateArticle: ({
    id,
    article,
  }: {
    id: number;
    article: Partial<ArticleItem>;
  }) => Promise<ArticleItem>;
  deleteArticle: (id: number) => Promise<ArticleItem>;
  getArticle: ({
    id,
    args,
  }: {
    id: number;
    args?: any;
  }) => Promise<ArticleItem>;
  getArticles: (args?: any) => Promise<ArticleItem[]>;
  editArticle: (id: number) => Promise<any>;
  clearList: () => void;
  cancelEdit: () => void;
};
