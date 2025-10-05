import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { GVECStore } from "./type";

const gvecStore = create<GVECStore>((set) => ({
  gvec: null,
  loading: false,
  gvecList: [],
  createGVEC: async (gvec) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/gvec`, gvec);
      toast.success("GVEC créé avec succès");
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
  updateGVEC: async ({ id, gvec }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(`/gvec/${id}`, gvec);
      set({ gvec: null });
      toast.success("GVEC mis à jour avec succès");
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
  deleteGVEC: async (id) => {
    try {
      const response = await axios.delete(`/gvec/${id}`);
      toast.success("GVEC supprimé avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? "Erreur lors de la suppression"
      );
      throw error;
    }
  },
  getGVEC: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/gvec/${id}`, { params });
      set({ gvec: response.data });
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
  getGVECs: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/gvec`, { params });
      set({ gvecList: response.data });
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
  editGVEC: async (id: number) => {
    const response = await axios.get(`/gvec/${id}`);
    set({ gvec: response.data });
    return response.data;
  },
  clearList: () => {
    set({ gvecList: [] });
  },
  cancelEdit: () => {
    set({ gvec: null });
  },
}));

export default gvecStore;
