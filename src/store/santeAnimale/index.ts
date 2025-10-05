import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { SanteAnimaleStore } from "./type";

const santeAnimaleStore = create<SanteAnimaleStore>((set) => ({
  santeAnimale: null,
  loading: false,
  santeAnimaleList: [],
  createSanteAnimale: async (santeAnimale) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/sante-animale`, santeAnimale);
      toast.success("Santé animale créée avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateSanteAnimale: async ({ id, santeAnimale }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(`/sante-animale/${id}`, santeAnimale);
      set({ santeAnimale: null });
      toast.success("Santé animale mise à jour avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deleteSanteAnimale: async (id) => {
    try {
      const response = await axios.delete(`/sante-animale/${id}`);
      toast.success("Santé animale supprimée avec succès");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    }
  },
  getSanteAnimale: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/sante-animale/${id}`, { params });
      set({ santeAnimale: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  getSanteAnimales: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/sante-animale`, { params });
      set({ santeAnimaleList: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  editSanteAnimale: async (id) => {
    try {
      const response = await axios.get(`/sante-animale/${id}`);
      set({ santeAnimale: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  clearList: () => set({ santeAnimaleList: [] }),
  cancelEdit: () => set({ santeAnimale: null }),
}));

export default santeAnimaleStore;
