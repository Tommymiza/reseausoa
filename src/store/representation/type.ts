import { OprItem } from "../opr/type";
import { RepresentationProdItem } from "../representationProd/type";

export type RepresentationItem = {
  id: number;
  date: string;
  duree: number | null;
  theme: string;
  problematique: string | null;
  positionnement: string | null;
  resultat: string | null;
  suite_a_donner: string | null;
  id_opr: number;
  OPR?: OprItem | null;
  RepresentationProd?: RepresentationProdItem[] | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type RepresentationStore = {
  representation: RepresentationItem | null;
  representationList: RepresentationItem[];
  loading: boolean;
  createRepresentation: (
    representation: Partial<RepresentationItem>
  ) => Promise<RepresentationItem>;
  updateRepresentation: ({
    id,
    representation,
  }: {
    id: number;
    representation: Partial<RepresentationItem>;
  }) => Promise<RepresentationItem>;
  deleteRepresentation: (id: number) => Promise<RepresentationItem>;
  getRepresentation: ({
    id,
    args,
  }: {
    id: number;
    args?: any;
  }) => Promise<RepresentationItem>;
  getRepresentations: (args?: any) => Promise<RepresentationItem[]>;
  editRepresentation: (id: number) => Promise<any>;
  clearList: () => void;
  cancelEdit: () => void;
};
