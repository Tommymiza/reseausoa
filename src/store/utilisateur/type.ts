import { OprItem } from "../opr/type";
import { PermissionItem, TypePermission } from "../permission/type";

export type UtilisateurItem = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  password: string;
  role: "ADMIN" | "USER";
  opr_id: number | null;
  Opr: OprItem | null;
  Permissions: {
    Permission: PermissionItem;
    type: TypePermission;
  }[];
};

export type UtilisateurStore = {
  utilisateur: UtilisateurItem | null;
  utilisateurList: UtilisateurItem[];
  loading: boolean;
  createUtilisateur: (
    utilisateur: Partial<UtilisateurItem>
  ) => Promise<UtilisateurItem>;
  updateUtilisateur: ({
    id,
    utilisateur,
  }: {
    id: number;
    utilisateur: Partial<UtilisateurItem>;
  }) => Promise<UtilisateurItem>;
  deleteUtilisateur: (id: number) => Promise<UtilisateurItem>;
  getUtilisateur: ({
    id,
    args,
  }: {
    id: number;
    args?: any;
  }) => Promise<UtilisateurItem>;
  getUtilisateurs: (args?: any) => Promise<UtilisateurItem[]>;
  editUtilisateur: (id: number) => Promise<any>;
  clearList: () => void;
  cancelEdit: () => void;
};
