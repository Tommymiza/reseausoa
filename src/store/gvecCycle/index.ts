import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { GVECCycleStore } from "./type";

const gvecCycleStore = create<GVECCycleStore>((set) => ({
  gvecCycle: null,
  loading: false,
  gvecCycleList: [],
  createGVECCycle: async (gvecCycle) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/gvecCycle`, gvecCycle);
      toast.success("Cycle GVEC créé avec succès");
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
  updateGVECCycle: async ({ id, gvecCycle }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(`/gvecCycle/${id}`, gvecCycle);
      set({ gvecCycle: null });
      toast.success("Cycle GVEC mis à jour avec succès");
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
  deleteGVECCycle: async (id) => {
    try {
      const response = await axios.delete(`/gvecCycle/${id}`);
      toast.success("Cycle GVEC supprimé avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? "Erreur lors de la suppression"
      );
      throw error;
    }
  },
  getGVECCycle: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/gvecCycle/${id}`, { params });
      set({ gvecCycle: response.data });
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
  getGVECCycles: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/gvecCycle`, { params });
      set({ gvecCycleList: response.data });
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
  editGVECCycle: async (id: number) => {
    const response = await axios.get(`/gvecCycle/${id}`);
    set({ gvecCycle: response.data });
    return response.data;
  },
  clearList: () => {
    set({ gvecCycleList: [] });
  },
  cancelEdit: () => {
    set({ gvecCycle: null });
  },
}));

export default gvecCycleStore;
