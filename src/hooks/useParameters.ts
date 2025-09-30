"use client";
import localisationStore from "@/store/localisation";
import { useEffect } from "react";

export default function useParameters() {
  const { getLocalisations } = localisationStore();

  useEffect(() => {
    getLocalisations();
  }, []);
}
