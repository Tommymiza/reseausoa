import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { ProducteurStore } from "./type";

const producteurStore = create<ProducteurStore>((set) => ({
  producteur: null,
  loading: false,
  producteurList: [],
  createProducteur: async (producteur) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/producteur`, producteur);
      toast.success("Producteur created successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateProducteur: async ({ id, producteur }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(`/producteur/${id}`, producteur);
      set({ producteur: null });
      toast.success("Producteur updated successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deleteProducteur: async (id) => {
    try {
      const response = await axios.delete(`/producteur/${id}`);
      toast.success("Producteur deleted successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    }
  },
  getProducteur: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/producteur/${id}`, { params });
      set({ producteur: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  getProducteurs: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      console.log(params);
      const response = await axios.get(`/producteur`, { params });
      set({ producteurList: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  editProducteur: async (id) => {
    try {
      const response = await axios.get(`/producteur/${id}`);
      set({ producteur: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  clearList: () => set({ producteurList: [] }),
  cancelEdit: () => set({ producteur: null }),
}));

export default producteurStore;
