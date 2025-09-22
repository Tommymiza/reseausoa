export type OpbItem = {
  id: number;
  nom: string;
  code?: string;
  lieu_siege: string;
  recepisse?: string;
  date_recepisse?: string;
  date_creation: string;
  date_entree_opr?: string;
  objet_opb?: string;
  recu_opr?: string;
  montant_opr?: number;
  id_opr: number;
  id_localisation: number;
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
