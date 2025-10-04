import type { JeuneItem } from "../jeune/type";

export type SuiviJeuneItem = {
  id: number;
  date: string;
  id_jeune: number;
  deroulement: string;
  type_accompagnateur?: string | null;
  Jeune?: JeuneItem | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type SuiviJeuneStore = {
  suiviJeune: SuiviJeuneItem | null;
  suiviJeuneList: SuiviJeuneItem[];
  loading: boolean;
  createSuiviJeune: (
    suiviJeune: Partial<SuiviJeuneItem>
  ) => Promise<SuiviJeuneItem>;
  updateSuiviJeune: ({
    id,
    suiviJeune,
  }: {
    id: number;
    suiviJeune: Partial<SuiviJeuneItem>;
  }) => Promise<SuiviJeuneItem>;
  deleteSuiviJeune: (id: number) => Promise<SuiviJeuneItem>;
  getSuiviJeune: ({
    id,
    args,
  }: {
    id: number;
    args?: any;
  }) => Promise<SuiviJeuneItem>;
  getSuiviJeunes: (args?: any) => Promise<SuiviJeuneItem[]>;
  editSuiviJeune: (id: number) => Promise<any>;
  clearList: () => void;
  cancelEdit: () => void;
};
