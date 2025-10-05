import type { CommercialisationItem } from "../commercialisation/type";
import type { SpeculationItem } from "../speculation/type";

export type VenteSpeculationItem = {
  id: number;
  quantite: number;
  id_speculation: number;
  id_commercialisation: number;
  Speculation?: SpeculationItem | null;
  Commercialisation?: CommercialisationItem | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type VenteSpeculationStore = {
  venteSpeculation: VenteSpeculationItem | null;
  venteSpeculationList: VenteSpeculationItem[];
  loading: boolean;
  createVenteSpeculation: (
    venteSpeculation: Partial<VenteSpeculationItem>
  ) => Promise<VenteSpeculationItem>;
  updateVenteSpeculation: ({
    id,
    venteSpeculation,
  }: {
    id: number;
    venteSpeculation: Partial<VenteSpeculationItem>;
  }) => Promise<VenteSpeculationItem>;
  deleteVenteSpeculation: (id: number) => Promise<VenteSpeculationItem>;
  getVenteSpeculation: ({
    id,
    args,
  }: {
    id: number;
    args?: any;
  }) => Promise<VenteSpeculationItem>;
  getVenteSpeculations: (args?: any) => Promise<VenteSpeculationItem[]>;
  editVenteSpeculation: (id: number) => Promise<any>;
  clearList: () => void;
  cancelEdit: () => void;
};
