import type { LocalisationItem } from "@/store/localisation/type";
import type { OpbItem } from "@/store/opb/type";

export type ProducteurItem = {
  id: number;
  nom: string;
  prenom: string | null;
  sexe: "homme" | "femme";
  annee_naissance: number | null;
  cin: string | null;
  date_cin: string | null;
  lieu_cin: string | null;
  niveau_instruction: string | null;
  tel1: string | null;
  tel2: string | null;
  date_naissance: string;
  marie: boolean;
  nom_conjoint: string | null;
  nb_enfant_a_charge_m: number | null;
  nb_enfant_a_charge_f: number | null;
  nom_chef_famille: string | null;
  actif: boolean;
  date_entree_opb: string | null;
  id_localisation: number | null;
  id_opb: number | null;
  Localisation?: LocalisationItem | null;
  OPB?: OpbItem | null;
  created_at?: string | null;
  updated_at?: string | null;
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
