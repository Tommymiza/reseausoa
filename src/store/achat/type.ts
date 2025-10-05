import type { OprItem } from "../opr/type";

export type AchatItem = {
  id: number;
  date: string;
  id_opr: number;
  partenaire: string;
  OPR?: OprItem | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AchatStore = {
  achat: AchatItem | null;
  achatList: AchatItem[];
  loading: boolean;
  createAchat: (achat: Partial<AchatItem>) => Promise<AchatItem>;
  updateAchat: ({
    id,
    achat,
  }: {
    id: number;
    achat: Partial<AchatItem>;
  }) => Promise<AchatItem>;
  deleteAchat: (id: number) => Promise<AchatItem>;
  getAchat: ({ id, args }: { id: number; args?: any }) => Promise<AchatItem>;
  getAchats: (args?: any) => Promise<AchatItem[]>;
  editAchat: (id: number) => Promise<any>;
  clearList: () => void;
  cancelEdit: () => void;
};
