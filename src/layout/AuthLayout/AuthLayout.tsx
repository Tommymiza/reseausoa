"use client";
import authStore from "@/store/auth";
import { useEffect } from "react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { auth, getMe } = authStore();
  useEffect(() => {
    async function getConnectedUser() {
      try {
        await getMe();
      } catch (error) {
        if (window.location.pathname !== "/login")
          window.location.href = "/login";
      }
    }
    getConnectedUser();
  }, []);
  return auth && children;
}
