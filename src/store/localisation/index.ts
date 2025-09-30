import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { LocalisationStore } from "./type";

const localisationStore = create<LocalisationStore>((set) => ({
  localisation: null,
  loading: false,
  localisationList: [],
  createLocalisation: async (localisation) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/localisation`, localisation);
      toast.success("Localisation created successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateLocalisation: async ({ id, localisation }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(`/localisation/${id}`, localisation);
      set({ localisation: null });
      toast.success("Localisation updated successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deleteLocalisation: async (id) => {
    try {
      const response = await axios.delete(`/localisation/${id}`);
      toast.success("Localisation deleted successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    }
  },
  getLocalisation: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/localisation/${id}`, { params });
      set({ localisation: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  getLocalisations: async (
    args = {
      include: {
        fokontany: {
          include: {
            commune: {
              include: {
                district: {
                  include: { region: true },
                },
              },
            },
          },
        },
      },
    }
  ) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/localisation`, { params });
      set({ localisationList: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  editLocalisation: async (id) => {
    try {
      const response = await axios.get(`/localisation/${id}`);
      set({ localisation: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  cancelEdit: () => set({ localisation: null }),
}));

export default localisationStore;
