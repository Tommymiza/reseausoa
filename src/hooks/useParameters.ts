"use client";
import categoryThemeStore from "@/store/categoryTheme";
import localisationStore from "@/store/localisation";
import { useEffect } from "react";

export default function useParameters() {
  const { getLocalisations } = localisationStore();
  const { getCategoryThemes } = categoryThemeStore();

  useEffect(() => {
    getLocalisations();
    getCategoryThemes({
      orderBy: {
        nom: "asc",
      },
    });
  }, []);
}
