export type OpbItem = {
  id: number;
  nom: string;
  id_opr: number;
};

export type OpbStore = {
  opb: OpbItem | null;
  opbList: OpbItem[];
  loading: boolean;
  createOpb: (opb: Partial<OpbItem>) => Promise<OpbItem>;
  updateOpb: ({
    id,
    opb,
  }: {
    id: number;
    opb: Partial<OpbItem>;
  }) => Promise<OpbItem>;
  deleteOpb: (id: number) => Promise<OpbItem>;
  getOpb: ({ id, args }: { id: number; args?: any }) => Promise<OpbItem>;
  getOpbs: (args?: any) => Promise<OpbItem[]>;
  editOpb: (id: number) => Promise<any>;
  cancelEdit: () => void;
};
