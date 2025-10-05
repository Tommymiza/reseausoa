import type { LocalisationItem } from "../localisation/type";

export type GVECItem = {
  id: number;
  nom: string;
  date: string;
  id_localisation: number;
  Localisation?: LocalisationItem | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type GVECStore = {
  gvec: GVECItem | null;
  gvecList: GVECItem[];
  loading: boolean;
  createGVEC: (gvec: Partial<GVECItem>) => Promise<GVECItem>;
  updateGVEC: ({
    id,
    gvec,
  }: {
    id: number;
    gvec: Partial<GVECItem>;
  }) => Promise<GVECItem>;
  deleteGVEC: (id: number) => Promise<GVECItem>;
  getGVEC: ({ id, args }: { id: number; args?: any }) => Promise<GVECItem>;
  getGVECs: (args?: any) => Promise<GVECItem[]>;
  editGVEC: (id: number) => Promise<any>;
  clearList: () => void;
  cancelEdit: () => void;
};
