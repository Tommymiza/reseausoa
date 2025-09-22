import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { OprStore } from "./type";

const oprStore = create<OprStore>((set) => ({
  opr: null,
  loading: false,
  oprList: [],
  createOpr: async (opr) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/opr`, opr);
      toast.success("Opr created successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateOpr: async ({ id, opr }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(`/opr/${id}`, opr);
      set({ opr: null });
      toast.success("Opr updated successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deleteOpr: async (id) => {
    try {
      const response = await axios.delete(`/opr/${id}`);
      toast.success("Opr deleted successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    }
  },
  getOpr: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/opr/${id}`, { params });
      set({ opr: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  getOprs: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/opr`, { params });
      set({ oprList: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  editOpr: async (id) => {
    try {
      const response = await axios.get(`/opr/${id}`);
      set({ opr: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  cancelEdit: () => set({ opr: null }),
}));

export default oprStore;
