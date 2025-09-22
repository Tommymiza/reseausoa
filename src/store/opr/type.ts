export type OprItem = {
  id: number;
  nom: string;
  code?: string;
  lieu_siege?: string;
  recepisse?: string;
  date_recepisse?: string;
  date_creation?: string;
  id_localisation?: number;
};

export type OprStore = {
  opr: OprItem | null;
  oprList: OprItem[];
  loading: boolean;
  createOpr: (opr: Partial<OprItem>) => Promise<OprItem>;
  updateOpr: ({
    id,
    opr,
  }: {
    id: number;
    opr: Partial<OprItem>;
  }) => Promise<OprItem>;
  deleteOpr: (id: number) => Promise<OprItem>;
  getOpr: ({ id, args }: { id: number; args?: any }) => Promise<OprItem>;
  getOprs: (args?: any) => Promise<OprItem[]>;
  editOpr: (id: number) => Promise<any>;
  cancelEdit: () => void;
};
