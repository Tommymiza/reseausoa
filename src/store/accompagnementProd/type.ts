import { AccompagnementItem } from "../accompagnement/type";
import { ProducteurItem } from "../producteur/type";

export type AccompagnementProdItem = {
  id: number;
  id_producteur: number;
  id_type_accompagnement: number;
  Producteur?: ProducteurItem | null;
  AccompagnementOpr?: AccompagnementItem | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AccompagnementProdStore = {
  accompagnementProd: AccompagnementProdItem | null;
  accompagnementProdList: AccompagnementProdItem[];
  loading: boolean;
  createAccompagnementProd: (
    accompagnementProd: Partial<AccompagnementProdItem>
  ) => Promise<AccompagnementProdItem>;
  updateAccompagnementProd: ({
    id,
    accompagnementProd,
  }: {
    id: number;
    accompagnementProd: Partial<AccompagnementProdItem>;
  }) => Promise<AccompagnementProdItem>;
  deleteAccompagnementProd: (id: number) => Promise<AccompagnementProdItem>;
  getAccompagnementProd: ({
    id,
    args,
  }: {
    id: number;
    args?: any;
  }) => Promise<AccompagnementProdItem>;
  getAccompagnementProds: (args?: any) => Promise<AccompagnementProdItem[]>;
  editAccompagnementProd: (id: number) => Promise<any>;
  clearList: () => void;
  cancelEdit: () => void;
};
