import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { GVECFinCycleStore } from "./type";

const gvecFinCycleStore = create<GVECFinCycleStore>((set) => ({
  gvecFinCycle: null,
  loading: false,
  gvecFinCycleList: [],
  createGVECFinCycle: async (gvecFinCycle) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/gvecFinCycle`, gvecFinCycle);
      toast.success("Fin de cycle GVEC créée avec succès");
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
  updateGVECFinCycle: async ({ id, gvecFinCycle }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(`/gvecFinCycle/${id}`, gvecFinCycle);
      set({ gvecFinCycle: null });
      toast.success("Fin de cycle GVEC mise à jour avec succès");
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
  deleteGVECFinCycle: async (id) => {
    try {
      const response = await axios.delete(`/gvecFinCycle/${id}`);
      toast.success("Fin de cycle GVEC supprimée avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? "Erreur lors de la suppression"
      );
      throw error;
    }
  },
  getGVECFinCycle: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/gvecFinCycle/${id}`, { params });
      set({ gvecFinCycle: response.data });
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
  getGVECFinCycles: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/gvecFinCycle`, { params });
      set({ gvecFinCycleList: response.data });
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
  editGVECFinCycle: async (id: number) => {
    const response = await axios.get(`/gvecFinCycle/${id}`);
    set({ gvecFinCycle: response.data });
    return response.data;
  },
  clearList: () => {
    set({ gvecFinCycleList: [] });
  },
  cancelEdit: () => {
    set({ gvecFinCycle: null });
  },
}));

export default gvecFinCycleStore;
