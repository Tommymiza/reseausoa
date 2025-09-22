export type ProducteurItem = {
  id: number;
  nom: string;
  actif: boolean;
  sexe: "homme" | "femme";
  date_naissance: string;
};

export type ProducteurStore = {
  producteur: ProducteurItem | null;
  producteurList: ProducteurItem[];
  loading: boolean;
  createProducteur: (
    producteur: Partial<ProducteurItem>
  ) => Promise<ProducteurItem>;
  updateProducteur: ({
    id,
    producteur,
  }: {
    id: number;
    producteur: Partial<ProducteurItem>;
  }) => Promise<ProducteurItem>;
  deleteProducteur: (id: number) => Promise<ProducteurItem>;
  getProducteur: ({
    id,
    args,
  }: {
    id: number;
    args?: any;
  }) => Promise<ProducteurItem>;
  getProducteurs: (args?: any) => Promise<ProducteurItem[]>;
  editProducteur: (id: number) => Promise<any>;
  clearList: () => void;
  cancelEdit: () => void;
};
