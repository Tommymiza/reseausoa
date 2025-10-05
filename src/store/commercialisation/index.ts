import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { CommercialisationStore } from "./type";

const commercialisationStore = create<CommercialisationStore>((set) => ({
  commercialisation: null,
  loading: false,
  commercialisationList: [],
  createCommercialisation: async (commercialisation) => {
    try {
      set({ loading: true });
      const response = await axios.post(
        `/commercialisation`,
        commercialisation
      );
      toast.success("Commercialisation créée avec succès");
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
  updateCommercialisation: async ({ id, commercialisation }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(
        `/commercialisation/${id}`,
        commercialisation
      );
      set({ commercialisation: null });
      toast.success("Commercialisation mise à jour avec succès");
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
  deleteCommercialisation: async (id) => {
    try {
      const response = await axios.delete(`/commercialisation/${id}`);
      toast.success("Commercialisation supprimée avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? "Erreur lors de la suppression"
      );
      throw error;
    }
  },
  getCommercialisation: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/commercialisation/${id}`, { params });
      set({ commercialisation: response.data });
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
  getCommercialisations: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/commercialisation`, { params });
      set({ commercialisationList: response.data });
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
  editCommercialisation: async (id: number) => {
    const response = await axios.get(`/commercialisation/${id}`);
    set({ commercialisation: response.data });
    return response.data;
  },
  clearList: () => {
    set({ commercialisationList: [] });
  },
  cancelEdit: () => {
    set({ commercialisation: null });
  },
}));

export default commercialisationStore;
