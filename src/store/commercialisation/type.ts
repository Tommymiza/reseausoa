import type { OprItem } from "../opr/type";

export type CommercialisationItem = {
  id: number;
  date: string;
  id_opr: number;
  partenaire: string;
  OPR?: OprItem | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type CommercialisationStore = {
  commercialisation: CommercialisationItem | null;
  commercialisationList: CommercialisationItem[];
  loading: boolean;
  createCommercialisation: (
    commercialisation: Partial<CommercialisationItem>
  ) => Promise<CommercialisationItem>;
  updateCommercialisation: ({
    id,
    commercialisation,
  }: {
    id: number;
    commercialisation: Partial<CommercialisationItem>;
  }) => Promise<CommercialisationItem>;
  deleteCommercialisation: (id: number) => Promise<CommercialisationItem>;
  getCommercialisation: ({
    id,
    args,
  }: {
    id: number;
    args?: any;
  }) => Promise<CommercialisationItem>;
  getCommercialisations: (args?: any) => Promise<CommercialisationItem[]>;
  editCommercialisation: (id: number) => Promise<any>;
  clearList: () => void;
  cancelEdit: () => void;
};
