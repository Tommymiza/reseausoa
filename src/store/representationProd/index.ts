import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { RepresentationProdStore } from "./type";

const representationProdStore = create<RepresentationProdStore>((set) => ({
  representationProd: null,
  loading: false,
  representationProdList: [],
  createRepresentationProd: async (representationProd) => {
    try {
      set({ loading: true });
      const response = await axios.post(
        `/representation-prod`,
        representationProd
      );
      toast.success("Lien producteur-représentation créé avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateRepresentationProd: async ({ id, representationProd }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(
        `/representation-prod/${id}`,
        representationProd
      );
      set({ representationProd: null });
      toast.success("Lien producteur-représentation mis à jour avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deleteRepresentationProd: async (id) => {
    try {
      const response = await axios.delete(`/representation-prod/${id}`);
      toast.success("Lien producteur-représentation supprimé avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    }
  },
  getRepresentationProd: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/representation-prod/${id}`, {
        params,
      });
      set({ representationProd: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  getRepresentationProds: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/representation-prod`, { params });
      set({ representationProdList: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  editRepresentationProd: async (id) => {
    try {
      const response = await axios.get(`/representation-prod/${id}`);
      set({ representationProd: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  clearList: () => set({ representationProdList: [] }),
  cancelEdit: () => set({ representationProd: null }),
}));

export default representationProdStore;
