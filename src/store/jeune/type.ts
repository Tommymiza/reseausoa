import type { ProducteurItem } from "../producteur/type";
import type { SpeculationItem } from "../speculation/type";
import type { SuiviJeuneItem } from "../suiviJeune/type";

export type JeuneItem = {
  id: number;
  date: string;
  accompagnement_op: string | null;
  accompagnement_parrain: string | null;
  id_producteur: number;
  id_parrain: number | null;
  Producteur?: ProducteurItem | null;
  Parrain?: ProducteurItem | null;
  titre_projet?: string | null;
  montant_apport?: number | null;
  montant_subvention?: number | null;
  id_speculation?: number | null;
  Speculation?: SpeculationItem | null;
  SuiviJeune?: SuiviJeuneItem[] | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type JeuneStore = {
  jeune: JeuneItem | null;
  jeuneList: JeuneItem[];
  loading: boolean;
  createJeune: (jeune: Partial<JeuneItem>) => Promise<JeuneItem>;
  updateJeune: ({
    id,
    jeune,
  }: {
    id: number;
    jeune: Partial<JeuneItem>;
  }) => Promise<JeuneItem>;
  deleteJeune: (id: number) => Promise<JeuneItem>;
  getJeune: ({ id, args }: { id: number; args?: any }) => Promise<JeuneItem>;
  getJeunes: (args?: any) => Promise<JeuneItem[]>;
  editJeune: (id: number) => Promise<any>;
  clearList: () => void;
  cancelEdit: () => void;
};
