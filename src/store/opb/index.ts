import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { OpbStore } from "./type";

const opbStore = create<OpbStore>((set) => ({
  opb: null,
  loading: false,
  opbList: [],
  createOpb: async (opb) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/opb`, opb);
      toast.success("Opb created successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateOpb: async ({ id, opb }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(`/opb/${id}`, opb);
      set({ opb: null });
      toast.success("Opb updated successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deleteOpb: async (id) => {
    try {
      const response = await axios.delete(`/opb/${id}`);
      toast.success("Opb deleted successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    }
  },
  getOpb: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/opb/${id}`, { params });
      set({ opb: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  getOpbs: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      console.log(params);
      const response = await axios.get(`/opb`, { params });
      set({ opbList: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  editOpb: async (id) => {
    try {
      const response = await axios.get(`/opb/${id}`);
      set({ opb: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  cancelEdit: () => set({ opb: null }),
}));

export default opbStore;
