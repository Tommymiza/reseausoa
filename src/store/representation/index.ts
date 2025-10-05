import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { RepresentationStore } from "./type";

const representationStore = create<RepresentationStore>((set) => ({
  representation: null,
  loading: false,
  representationList: [],
  createRepresentation: async (representation) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/representation`, representation);
      toast.success("Représentation créée avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateRepresentation: async ({ id, representation }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(
        `/representation/${id}`,
        representation
      );
      set({ representation: null });
      toast.success("Représentation mise à jour avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deleteRepresentation: async (id) => {
    try {
      const response = await axios.delete(`/representation/${id}`);
      toast.success("Représentation supprimée avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    }
  },
  getRepresentation: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/representation/${id}`, { params });
      set({ representation: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  getRepresentations: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/representation`, { params });
      set({ representationList: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  editRepresentation: async (id) => {
    try {
      const response = await axios.get(`/representation/${id}`);
      set({ representation: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  clearList: () => set({ representationList: [] }),
  cancelEdit: () => set({ representation: null }),
}));

export default representationStore;
