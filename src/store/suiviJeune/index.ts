import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { SuiviJeuneStore } from "./type";

const suiviJeuneStore = create<SuiviJeuneStore>((set) => ({
  suiviJeune: null,
  loading: false,
  suiviJeuneList: [],
  createSuiviJeune: async (suiviJeune) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/suiviJeune`, suiviJeune);
      toast.success("Suivi jeune créé avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Erreur lors de la création");
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateSuiviJeune: async ({ id, suiviJeune }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(`/suiviJeune/${id}`, suiviJeune);
      set({ suiviJeune: null });
      toast.success("Suivi jeune mis à jour avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Erreur lors de la mise à jour");
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deleteSuiviJeune: async (id) => {
    try {
      const response = await axios.delete(`/suiviJeune/${id}`);
      toast.success("Suivi jeune supprimé avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Erreur lors de la suppression");
      throw error;
    }
  },
  getSuiviJeune: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/suiviJeune/${id}`, { params });
      set({ suiviJeune: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  getSuiviJeunes: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/suiviJeune`, { params });
      set({ suiviJeuneList: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  editSuiviJeune: async (id) => {
    try {
      const response = await axios.get(`/suiviJeune/${id}`);
      set({ suiviJeune: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  clearList: () => set({ suiviJeuneList: [] }),
  cancelEdit: () => set({ suiviJeune: null }),
}));

export default suiviJeuneStore;
