import { UtilisateurItem } from "../utilisateur/type";

export type AuthStore = {
  auth: UtilisateurItem | null;
  loading: boolean;
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<any>;
  register: (user: Partial<UtilisateurItem>) => Promise<UtilisateurItem>;
  logout: () => Promise<any>;
  updatePassword: (data: {
    password: string;
    c_password: string;
  }) => Promise<any>;
  getMe: () => Promise<any>;
};
