import { AccompagnementProdItem } from "../accompagnementProd/type";
import { OprItem } from "../opr/type";

export type CategoryThemeAccompagnementItem = {
  id: number;
  nom: string;
};

export type AccompagnementItem = {
  id: number;
  date: string;
  duree: number | null;
  theme: string;
  existant: string | null;
  problematique: string | null;
  solution: string | null;
  remarque: string | null;
  activite_de_masse: boolean;
  nb_hommes: number | null;
  nb_femmes: number | null;
  nb_jeunes: number | null;
  type:
    | "ACCOMPAGNEMENT_SUIVI"
    | "VISITE_ECHANGE"
    | "FORMATION"
    | "ANIMATION_SENSIBILISATION";
  id_category_theme: number;
  id_opr: number;
  OPR?: OprItem | null;
  CategoryThemeAccompagnement?: CategoryThemeAccompagnementItem | null;
  AccompagnementProd?: AccompagnementProdItem[] | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AccompagnementStore = {
  accompagnement: AccompagnementItem | null;
  accompagnementList: AccompagnementItem[];
  loading: boolean;
  createAccompagnement: (
    accompagnement: Partial<AccompagnementItem>
  ) => Promise<AccompagnementItem>;
  updateAccompagnement: ({
    id,
    accompagnement,
  }: {
    id: number;
    accompagnement: Partial<AccompagnementItem>;
  }) => Promise<AccompagnementItem>;
  deleteAccompagnement: (id: number) => Promise<AccompagnementItem>;
  getAccompagnement: ({
    id,
    args,
  }: {
    id: number;
    args?: any;
  }) => Promise<AccompagnementItem>;
  getAccompagnements: (args?: any) => Promise<AccompagnementItem[]>;
  editAccompagnement: (id: number) => Promise<any>;
  clearList: () => void;
  cancelEdit: () => void;
};
