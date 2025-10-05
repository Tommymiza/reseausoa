import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { GVECRealisationStore } from "./type";

const gvecRealisationStore = create<GVECRealisationStore>((set) => ({
  gvecRealisation: null,
  loading: false,
  gvecRealisationList: [],
  createGVECRealisation: async (gvecRealisation) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/gvecRealisation`, gvecRealisation);
      toast.success("Réalisation GVEC créée avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? "Erreur lors de la création"
      );
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateGVECRealisation: async ({ id, gvecRealisation }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(
        `/gvecRealisation/${id}`,
        gvecRealisation
      );
      set({ gvecRealisation: null });
      toast.success("Réalisation GVEC mise à jour avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? "Erreur lors de la mise à jour"
      );
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deleteGVECRealisation: async (id) => {
    try {
      const response = await axios.delete(`/gvecRealisation/${id}`);
      toast.success("Réalisation GVEC supprimée avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? "Erreur lors de la suppression"
      );
      throw error;
    }
  },
  getGVECRealisation: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/gvecRealisation/${id}`, { params });
      set({ gvecRealisation: response.data });
      return response.data;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? "Erreur lors de la récupération"
      );
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  getGVECRealisations: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/gvecRealisation`, { params });
      set({ gvecRealisationList: response.data });
      return response.data;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? "Erreur lors de la récupération"
      );
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  editGVECRealisation: async (id: number) => {
    const response = await axios.get(`/gvecRealisation/${id}`);
    set({ gvecRealisation: response.data });
    return response.data;
  },
  clearList: () => {
    set({ gvecRealisationList: [] });
  },
  cancelEdit: () => {
    set({ gvecRealisation: null });
  },
}));

export default gvecRealisationStore;
