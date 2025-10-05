import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { AchatArticleStore } from "./type";

const achatArticleStore = create<AchatArticleStore>((set) => ({
  achatArticle: null,
  loading: false,
  achatArticleList: [],
  createAchatArticle: async (achatArticle) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/achatArticle`, achatArticle);
      toast.success("Article d'achat créé avec succès");
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
  updateAchatArticle: async ({ id, achatArticle }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(`/achatArticle/${id}`, achatArticle);
      set({ achatArticle: null });
      toast.success("Article d'achat mis à jour avec succès");
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
  deleteAchatArticle: async (id) => {
    try {
      const response = await axios.delete(`/achatArticle/${id}`);
      toast.success("Article d'achat supprimé avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? "Erreur lors de la suppression"
      );
      throw error;
    }
  },
  getAchatArticle: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/achatArticle/${id}`, { params });
      set({ achatArticle: response.data });
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
  getAchatArticles: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/achatArticle`, { params });
      set({ achatArticleList: response.data });
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
  editAchatArticle: async (id: number) => {
    const response = await axios.get(`/achatArticle/${id}`);
    set({ achatArticle: response.data });
    return response.data;
  },
  clearList: () => {
    set({ achatArticleList: [] });
  },
  cancelEdit: () => {
    set({ achatArticle: null });
  },
}));

export default achatArticleStore;
