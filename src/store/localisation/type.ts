export type LocalisationItem = {
  id: number;
  nom: string;
};

export type LocalisationStore = {
  localisation: LocalisationItem | null;
  localisationList: LocalisationItem[];
  loading: boolean;
  createLocalisation: (
    localisation: Partial<LocalisationItem>
  ) => Promise<LocalisationItem>;
  updateLocalisation: ({
    id,
    localisation,
  }: {
    id: number;
    localisation: Partial<LocalisationItem>;
  }) => Promise<LocalisationItem>;
  deleteLocalisation: (id: number) => Promise<LocalisationItem>;
  getLocalisation: ({
    id,
    args,
  }: {
    id: number;
    args?: any;
  }) => Promise<LocalisationItem>;
  getLocalisations: (args?: any) => Promise<LocalisationItem[]>;
  editLocalisation: (id: number) => Promise<any>;
  cancelEdit: () => void;
};
