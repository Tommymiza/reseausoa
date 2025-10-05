import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { AchatStore } from "./type";

const achatStore = create<AchatStore>((set) => ({
  achat: null,
  loading: false,
  achatList: [],
  createAchat: async (achat) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/achat`, achat);
      toast.success("Achat créé avec succès");
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
  updateAchat: async ({ id, achat }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(`/achat/${id}`, achat);
      set({ achat: null });
      toast.success("Achat mis à jour avec succès");
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
  deleteAchat: async (id) => {
    try {
      const response = await axios.delete(`/achat/${id}`);
      toast.success("Achat supprimé avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? "Erreur lors de la suppression"
      );
      throw error;
    }
  },
  getAchat: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/achat/${id}`, { params });
      set({ achat: response.data });
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
  getAchats: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/achat`, { params });
      set({ achatList: response.data });
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
  editAchat: async (id: number) => {
    const response = await axios.get(`/achat/${id}`);
    set({ achat: response.data });
    return response.data;
  },
  clearList: () => {
    set({ achatList: [] });
  },
  cancelEdit: () => {
    set({ achat: null });
  },
}));

export default achatStore;
