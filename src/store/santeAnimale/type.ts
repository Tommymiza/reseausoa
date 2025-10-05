import { OprItem } from "../opr/type";
import { ProducteurItem } from "../producteur/type";

export type TypeSanteAnimale =
  | "Vaccination"
  | "Soin"
  | "Déparasitage"
  | "Vitamine";

export type SanteAnimaleItem = {
  id: number;
  date: string;
  type: TypeSanteAnimale;
  type_animale: string;
  medicament_utilise: string | null;
  origine_medicament: string | null;
  lot: string | null;
  nb_animaux: number;
  dose_utilisee: string | null;
  pu_dose: number;
  id_producteur: number;
  id_opr: number;
  id_veternaire: number | null;
  autre: string | null;
  Producteur?: ProducteurItem | null;
  OPR?: OprItem | null;
  Veterinaire?: ProducteurItem | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type SanteAnimaleStore = {
  santeAnimale: SanteAnimaleItem | null;
  santeAnimaleList: SanteAnimaleItem[];
  loading: boolean;
  createSanteAnimale: (
    santeAnimale: Partial<SanteAnimaleItem>
  ) => Promise<SanteAnimaleItem>;
  updateSanteAnimale: ({
    id,
    santeAnimale,
  }: {
    id: number;
    santeAnimale: Partial<SanteAnimaleItem>;
  }) => Promise<SanteAnimaleItem>;
  deleteSanteAnimale: (id: number) => Promise<SanteAnimaleItem>;
  getSanteAnimale: ({
    id,
    args,
  }: {
    id: number;
    args?: any;
  }) => Promise<SanteAnimaleItem>;
  getSanteAnimales: (args?: any) => Promise<SanteAnimaleItem[]>;
  editSanteAnimale: (id: number) => Promise<any>;
  clearList: () => void;
  cancelEdit: () => void;
};
