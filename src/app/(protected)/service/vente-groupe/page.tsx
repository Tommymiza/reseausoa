"use client";
import ListCommercialisation from "@/components/commercialisation/List";
import ListVenteSpeculation from "@/components/venteSpeculation/List";
import { CommercialisationItem } from "@/store/commercialisation/type";
import { Stack } from "@mui/material";
import { useState } from "react";

export default function VenteGroupe() {
  const [selected, setSelected] = useState<CommercialisationItem | null>(null);
  return (
    <Stack direction="row" gap={2} alignItems="flex-start">
      <ListCommercialisation setSelected={setSelected} selected={selected} />
      {selected && (
        <ListVenteSpeculation
          selectedCommercialisation={selected.id}
          key={selected.id}
        />
      )}
    </Stack>
  );
}
