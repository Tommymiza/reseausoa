import type { AchatItem } from "../achat/type";
import type { ArticleItem } from "../article/type";

export type AchatArticleItem = {
  id: number;
  quantite: number;
  id_article: number;
  id_achat: number;
  Article?: ArticleItem | null;
  Achat?: AchatItem | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AchatArticleStore = {
  achatArticle: AchatArticleItem | null;
  achatArticleList: AchatArticleItem[];
  loading: boolean;
  createAchatArticle: (
    achatArticle: Partial<AchatArticleItem>
  ) => Promise<AchatArticleItem>;
  updateAchatArticle: ({
    id,
    achatArticle,
  }: {
    id: number;
    achatArticle: Partial<AchatArticleItem>;
  }) => Promise<AchatArticleItem>;
  deleteAchatArticle: (id: number) => Promise<AchatArticleItem>;
  getAchatArticle: ({
    id,
    args,
  }: {
    id: number;
    args?: any;
  }) => Promise<AchatArticleItem>;
  getAchatArticles: (args?: any) => Promise<AchatArticleItem[]>;
  editAchatArticle: (id: number) => Promise<any>;
  clearList: () => void;
  cancelEdit: () => void;
};
