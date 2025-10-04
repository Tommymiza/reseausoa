export const SPECULATION_TYPES = [
  'Agriculture',
  'Elevage',
  'Artisanal',
] as const;

export type SpeculationType = (typeof SPECULATION_TYPES)[number];

export type SpeculationItem = {
  id: number;
  nom: string;
  type: SpeculationType;
  created_at?: string | null;
  updated_at?: string | null;
};

export type SpeculationStore = {
  speculation: SpeculationItem | null;
  speculationList: SpeculationItem[];
  loading: boolean;
  createSpeculation: (
    speculation: Partial<SpeculationItem>,
  ) => Promise<SpeculationItem>;
  updateSpeculation: ({
    id,
    speculation,
  }: {
    id: number;
    speculation: Partial<SpeculationItem>;
  }) => Promise<SpeculationItem>;
  deleteSpeculation: (id: number) => Promise<SpeculationItem>;
  getSpeculation: ({
    id,
    args,
  }: {
    id: number;
    args?: any;
  }) => Promise<SpeculationItem>;
  getSpeculations: (args?: any) => Promise<SpeculationItem[]>;
  editSpeculation: (id: number) => Promise<SpeculationItem>;
  clearList: () => void;
  cancelEdit: () => void;
};
