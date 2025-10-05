import type { GVECCycleItem } from "../gvecCycle/type";

export type GVECRealisationItem = {
  id: number;
  numero: number;
  date: string;
  total_famangina: number;
  nb_novangina: number;
  total_caisse_sociale: number;
  total_remboursement: number;
  total_interet: number;
  nb_remboursant: number;
  total_credit: number;
  nb_octroye: number;
  total_caisse_epargne: number;
  id_gvec_cycle: number;
  gvec_cycle?: GVECCycleItem | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type GVECRealisationStore = {
  gvecRealisation: GVECRealisationItem | null;
  gvecRealisationList: GVECRealisationItem[];
  loading: boolean;
  createGVECRealisation: (
    gvecRealisation: Partial<GVECRealisationItem>
  ) => Promise<GVECRealisationItem>;
  updateGVECRealisation: ({
    id,
    gvecRealisation,
  }: {
    id: number;
    gvecRealisation: Partial<GVECRealisationItem>;
  }) => Promise<GVECRealisationItem>;
  deleteGVECRealisation: (id: number) => Promise<GVECRealisationItem>;
  getGVECRealisation: ({
    id,
    args,
  }: {
    id: number;
    args?: any;
  }) => Promise<GVECRealisationItem>;
  getGVECRealisations: (args?: any) => Promise<GVECRealisationItem[]>;
  editGVECRealisation: (id: number) => Promise<any>;
  clearList: () => void;
  cancelEdit: () => void;
};
