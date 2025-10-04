import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { CategoryThemeStore } from "./type";

const categoryThemeStore = create<CategoryThemeStore>((set) => ({
  categoryTheme: null,
  loading: false,
  categoryThemeList: [],
  createCategoryTheme: async (categoryTheme) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/categoryTheme`, categoryTheme);
      toast.success("CategoryTheme created successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateCategoryTheme: async ({ id, categoryTheme }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(`/categoryTheme/${id}`, categoryTheme);
      set({ categoryTheme: null });
      toast.success("CategoryTheme updated successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deleteCategoryTheme: async (id) => {
    try {
      const response = await axios.delete(`/categoryTheme/${id}`);
      toast.success("CategoryTheme deleted successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    }
  },
  getCategoryTheme: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/categoryTheme/${id}`, { params });
      set({ categoryTheme: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  getCategoryThemes: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/categoryTheme`, { params });
      set({ categoryThemeList: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  editCategoryTheme: async (id) => {
    try {
      const response = await axios.get(`/categoryTheme/${id}`);
      set({ categoryTheme: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  clearList: () => set({ categoryThemeList: [] }),
  cancelEdit: () => set({ categoryTheme: null }),
}));

export default categoryThemeStore;
