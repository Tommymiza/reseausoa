import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { SpeculationStore } from "./type";

const speculationStore = create<SpeculationStore>((set) => ({
  speculation: null,
  speculationList: [],
  loading: false,
  createSpeculation: async (speculation) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/speculation`, speculation);
      toast.success("Spéculation créée avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Erreur lors de la création");
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateSpeculation: async ({ id, speculation }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(`/speculation/${id}`, speculation);
      set({ speculation: null });
      toast.success("Spéculation mise à jour avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Erreur lors de la mise à jour");
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deleteSpeculation: async (id) => {
    try {
      const response = await axios.delete(`/speculation/${id}`);
      toast.success("Spéculation supprimée avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? "Erreur lors de la suppression");
      throw error;
    }
  },
  getSpeculation: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/speculation/${id}`, { params });
      set({ speculation: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  getSpeculations: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/speculation`, { params });
      set({ speculationList: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  editSpeculation: async (id) => {
    try {
      const response = await axios.get(`/speculation/${id}`);
      set({ speculation: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  clearList: () => set({ speculationList: [] }),
  cancelEdit: () => set({ speculation: null }),
}));

export default speculationStore;
