import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { JeuneStore } from "./type";

const jeuneStore = create<JeuneStore>((set) => ({
  jeune: null,
  loading: false,
  jeuneList: [],
  createJeune: async (jeune) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/jeune`, jeune);
      toast.success("Jeune créé avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Erreur lors de la création");
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateJeune: async ({ id, jeune }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(`/jeune/${id}`, jeune);
      set({ jeune: null });
      toast.success("Jeune mis à jour avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Erreur lors de la mise à jour");
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deleteJeune: async (id) => {
    try {
      const response = await axios.delete(`/jeune/${id}`);
      toast.success("Jeune supprimé avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Erreur lors de la suppression");
      throw error;
    }
  },
  getJeune: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/jeune/${id}`, { params });
      set({ jeune: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  getJeunes: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/jeune`, { params });
      set({ jeuneList: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  editJeune: async (id) => {
    try {
      const response = await axios.get(`/jeune/${id}`);
      set({ jeune: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  clearList: () => set({ jeuneList: [] }),
  cancelEdit: () => set({ jeune: null }),
}));

export default jeuneStore;
