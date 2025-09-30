import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { AuthStore } from "./type";

const authStore = create<AuthStore>((set) => ({
  auth: null,
  loading: false,
  login: async (data) => {
    try {
      const response = await axios.post(`/auth/login`, data);
      const token = response.data.token;
      localStorage.setItem("auth", token);
      toast.success("Utilisateur connécté!");
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    }
  },
  getMe: async () => {
    try {
      const token = localStorage.getItem("auth");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get(`/auth/me`);
      console.log(response.data);
      const user = response.data;
      set({ auth: user });
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  register: async (data) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/register`, data);
      toast.success("Veuillez verifier votre email.");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updatePassword: async (data) => {
    try {
      await axios.post(`/auth/reset`, data);
      toast.success("Mot de passe changé avec succès!");
    } catch (error) {
      throw error;
    }
  },
  logout: async () => {
    try {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("auth");
      set({ auth: null });
      window.location.href = "/";
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    }
  },
}));

export default authStore;
