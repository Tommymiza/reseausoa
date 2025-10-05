import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { VenteSpeculationStore } from "./type";

const venteSpeculationStore = create<VenteSpeculationStore>((set) => ({
  venteSpeculation: null,
  loading: false,
  venteSpeculationList: [],
  createVenteSpeculation: async (venteSpeculation) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/venteSpeculation`, venteSpeculation);
      toast.success("Vente de spéculation créée avec succès");
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
  updateVenteSpeculation: async ({ id, venteSpeculation }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(
        `/venteSpeculation/${id}`,
        venteSpeculation
      );
      set({ venteSpeculation: null });
      toast.success("Vente de spéculation mise à jour avec succès");
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
  deleteVenteSpeculation: async (id) => {
    try {
      const response = await axios.delete(`/venteSpeculation/${id}`);
      toast.success("Vente de spéculation supprimée avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? "Erreur lors de la suppression"
      );
      throw error;
    }
  },
  getVenteSpeculation: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/venteSpeculation/${id}`, { params });
      set({ venteSpeculation: response.data });
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
  getVenteSpeculations: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/venteSpeculation`, { params });
      set({ venteSpeculationList: response.data });
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
  editVenteSpeculation: async (id: number) => {
    const response = await axios.get(`/venteSpeculation/${id}`);
    set({ venteSpeculation: response.data });
    return response.data;
  },
  clearList: () => {
    set({ venteSpeculationList: [] });
  },
  cancelEdit: () => {
    set({ venteSpeculation: null });
  },
}));

export default venteSpeculationStore;
