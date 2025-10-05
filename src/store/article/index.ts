import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { ArticleStore } from "./type";

const articleStore = create<ArticleStore>((set) => ({
  article: null,
  loading: false,
  articleList: [],
  createArticle: async (article) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/article`, article);
      toast.success("Article créé avec succès");
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
  updateArticle: async ({ id, article }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(`/article/${id}`, article);
      set({ article: null });
      toast.success("Article mis à jour avec succès");
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
  deleteArticle: async (id) => {
    try {
      const response = await axios.delete(`/article/${id}`);
      toast.success("Article supprimé avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? "Erreur lors de la suppression"
      );
      throw error;
    }
  },
  getArticle: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/article/${id}`, { params });
      set({ article: response.data });
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
  getArticles: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/article`, { params });
      set({ articleList: response.data });
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
  editArticle: async (id: number) => {
    const response = await axios.get(`/article/${id}`);
    set({ article: response.data });
    return response.data;
  },
  clearList: () => {
    set({ articleList: [] });
  },
  cancelEdit: () => {
    set({ article: null });
  },
}));

export default articleStore;
