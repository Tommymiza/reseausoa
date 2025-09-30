import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { PermissionStore } from "./type";

const permissionStore = create<PermissionStore>((set) => ({
  permission: null,
  loading: false,
  permissionList: [],
  createPermission: async (permission) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/permission`, permission);
      toast.success("Permission created successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updatePermission: async ({ id, permission }) => {
    try {
      set({ loading: true });
      const response = await axios.patch(`/permission/${id}`, permission);
      set({ permission: null });
      toast.success("Permission updated successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deletePermission: async (id) => {
    try {
      const response = await axios.delete(`/permission/${id}`);
      toast.success("Permission deleted successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    }
  },
  getPermission: async ({ id, args = {} }) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/permission/${id}`, { params });
      set({ permission: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  getPermissions: async (args = {}) => {
    try {
      set({ loading: true });
      const params = {
        args: JSON.stringify(args),
      };
      const response = await axios.get(`/permission`, { params });
      set({ permissionList: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  editPermission: async (id) => {
    try {
      const response = await axios.get(`/permission/${id}`);
      set({ permission: response.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateUserPermissions: async (allPermissions) => {
    try {
      set({ loading: true });
      const response = await axios.post(`/permission/user`, allPermissions);
      toast.success("Permissions updated successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.message);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  clearList: () => set({ permissionList: [] }),
  cancelEdit: () => set({ permission: null }),
}));

export default permissionStore;
