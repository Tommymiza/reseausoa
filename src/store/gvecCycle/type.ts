import type { GVECItem } from "../gvec/type";

export type GVECCycleItem = {
  id: number;
  numero: number;
  date_debut: string;
  date_fin: string;
  montant_part: number;
  montant_cotisation: number;
  id_gvec: number;
  gvec?: GVECItem | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type GVECCycleStore = {
  gvecCycle: GVECCycleItem | null;
  gvecCycleList: GVECCycleItem[];
  loading: boolean;
  createGVECCycle: (
    gvecCycle: Partial<GVECCycleItem>
  ) => Promise<GVECCycleItem>;
  updateGVECCycle: ({
    id,
    gvecCycle,
  }: {
    id: number;
    gvecCycle: Partial<GVECCycleItem>;
  }) => Promise<GVECCycleItem>;
  deleteGVECCycle: (id: number) => Promise<GVECCycleItem>;
  getGVECCycle: ({
    id,
    args,
  }: {
    id: number;
    args?: any;
  }) => Promise<GVECCycleItem>;
  getGVECCycles: (args?: any) => Promise<GVECCycleItem[]>;
  editGVECCycle: (id: number) => Promise<any>;
  clearList: () => void;
  cancelEdit: () => void;
};
