import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { UtilisateurStore } from "./type";

const utilisateurStore = create<UtilisateurStore>((set) => ({
  utilisateur: null,
  loading: false,
  utilisateurList: [],
  createUtilisateur: async (utilisateur) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/user`, utilisateur);
      toast.success("Utilisateur created successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateUtilisateur: async ({ id, utilisateur }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(`/user/${id}`, utilisateur);
      set({ utilisateur: null });
      toast.success("Utilisateur updated successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deleteUtilisateur: async (id) => {
    try {
      const response = await axios.delete(`/user/${id}`);
      toast.success("Utilisateur deleted successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    }
  },
  getUtilisateur: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/user/${id}`, { params });
      set({ utilisateur: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  getUtilisateurs: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/user`, { params });
      set({ utilisateurList: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  editUtilisateur: async (id) => {
    try {
      const response = await axios.get(`/user/${id}`);
      set({ utilisateur: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  clearList: () => set({ utilisateurList: [] }),
  cancelEdit: () => set({ utilisateur: null }),
}));

export default utilisateurStore;
