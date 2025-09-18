export type OprItem = {
  id: number;
  nom: string;
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
