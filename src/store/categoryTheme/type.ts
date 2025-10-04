export type CategoryThemeItem = {
  id: number;
  nom: string;
};

export type CategoryThemeStore = {
  categoryTheme: CategoryThemeItem | null;
  categoryThemeList: CategoryThemeItem[];
  loading: boolean;
  createCategoryTheme: (
    categoryTheme: Partial<CategoryThemeItem>
  ) => Promise<CategoryThemeItem>;
  updateCategoryTheme: ({
    id,
    categoryTheme,
  }: {
    id: number;
    categoryTheme: Partial<CategoryThemeItem>;
  }) => Promise<CategoryThemeItem>;
  deleteCategoryTheme: (id: number) => Promise<CategoryThemeItem>;
  getCategoryTheme: ({
    id,
    args,
  }: {
    id: number;
    args?: any;
  }) => Promise<CategoryThemeItem>;
  getCategoryThemes: (args?: any) => Promise<CategoryThemeItem[]>;
  editCategoryTheme: (id: number) => Promise<any>;
  clearList: () => void;
  cancelEdit: () => void;
};
