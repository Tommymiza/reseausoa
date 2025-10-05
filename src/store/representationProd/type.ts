import { ProducteurItem } from "../producteur/type";
import { RepresentationItem } from "../representation/type";

export type RepresentationProdItem = {
  id: number;
  id_producteur: number;
  id_representation: number;
  Producteur?: ProducteurItem | null;
  Representation?: RepresentationItem | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type RepresentationProdStore = {
  representationProd: RepresentationProdItem | null;
  representationProdList: RepresentationProdItem[];
  loading: boolean;
  createRepresentationProd: (
    representationProd: Partial<RepresentationProdItem>
  ) => Promise<RepresentationProdItem>;
  updateRepresentationProd: ({
    id,
    representationProd,
  }: {
    id: number;
    representationProd: Partial<RepresentationProdItem>;
  }) => Promise<RepresentationProdItem>;
  deleteRepresentationProd: (id: number) => Promise<RepresentationProdItem>;
  getRepresentationProd: ({
    id,
    args,
  }: {
    id: number;
    args?: any;
  }) => Promise<RepresentationProdItem>;
  getRepresentationProds: (args?: any) => Promise<RepresentationProdItem[]>;
  editRepresentationProd: (id: number) => Promise<any>;
  clearList: () => void;
  cancelEdit: () => void;
};
