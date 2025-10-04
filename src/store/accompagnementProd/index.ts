import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { AccompagnementProdStore } from "./type";

const accompagnementProdStore = create<AccompagnementProdStore>((set) => ({
  accompagnementProd: null,
  loading: false,
  accompagnementProdList: [],
  createAccompagnementProd: async (accompagnementProd) => {
    try {
      set({ loading: true });
      const response = await axios.post(
        `/accompagnementProd`,
        accompagnementProd
      );
      toast.success("AccompagnementProd created successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateAccompagnementProd: async ({ id, accompagnementProd }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(
        `/accompagnementProd/${id}`,
        accompagnementProd
      );
      set({ accompagnementProd: null });
      toast.success("AccompagnementProd updated successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deleteAccompagnementProd: async (id) => {
    try {
      const response = await axios.delete(`/accompagnementProd/${id}`);
      toast.success("AccompagnementProd deleted successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    }
  },
  getAccompagnementProd: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/accompagnementProd/${id}`, { params });
      set({ accompagnementProd: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  getAccompagnementProds: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/accompagnementProd`, { params });
      set({ accompagnementProdList: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  editAccompagnementProd: async (id) => {
    try {
      const response = await axios.get(`/accompagnementProd/${id}`);
      set({ accompagnementProd: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  clearList: () => set({ accompagnementProdList: [] }),
  cancelEdit: () => set({ accompagnementProd: null }),
}));

export default accompagnementProdStore;
