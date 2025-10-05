import type { GVECCycleItem } from "../gvecCycle/type";
import type { ProducteurItem } from "../producteur/type";

export type GVECFinCycleItem = {
  id: number;
  id_producteur: number;
  fonction: string;
  nb_part: number;
  montant_part: number;
  montant_interet: number;
  montant_total: number;
  id_gvec_cycle: number;
  Producteur?: ProducteurItem | null;
  gvec_cycle?: GVECCycleItem | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type GVECFinCycleStore = {
  gvecFinCycle: GVECFinCycleItem | null;
  gvecFinCycleList: GVECFinCycleItem[];
  loading: boolean;
  createGVECFinCycle: (
    gvecFinCycle: Partial<GVECFinCycleItem>
  ) => Promise<GVECFinCycleItem>;
  updateGVECFinCycle: ({
    id,
    gvecFinCycle,
  }: {
    id: number;
    gvecFinCycle: Partial<GVECFinCycleItem>;
  }) => Promise<GVECFinCycleItem>;
  deleteGVECFinCycle: (id: number) => Promise<GVECFinCycleItem>;
  getGVECFinCycle: ({
    id,
    args,
  }: {
    id: number;
    args?: any;
  }) => Promise<GVECFinCycleItem>;
  getGVECFinCycles: (args?: any) => Promise<GVECFinCycleItem[]>;
  editGVECFinCycle: (id: number) => Promise<any>;
  clearList: () => void;
  cancelEdit: () => void;
};
