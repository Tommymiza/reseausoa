import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { AccompagnementStore } from "./type";

const accompagnementStore = create<AccompagnementStore>((set) => ({
  accompagnement: null,
  loading: false,
  accompagnementList: [],
  createAccompagnement: async (accompagnement) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/accompagnement`, accompagnement);
      toast.success("Accompagnement created successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateAccompagnement: async ({ id, accompagnement }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(
        `/accompagnement/${id}`,
        accompagnement
      );
      set({ accompagnement: null });
      toast.success("Accompagnement updated successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deleteAccompagnement: async (id) => {
    try {
      const response = await axios.delete(`/accompagnement/${id}`);
      toast.success("Accompagnement deleted successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    }
  },
  getAccompagnement: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/accompagnement/${id}`, { params });
      set({ accompagnement: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  getAccompagnements: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/accompagnement`, { params });
      set({ accompagnementList: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  editAccompagnement: async (id) => {
    try {
      const response = await axios.get(`/accompagnement/${id}`);
      set({ accompagnement: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  clearList: () => set({ accompagnementList: [] }),
  cancelEdit: () => set({ accompagnement: null }),
}));

export default accompagnementStore;
