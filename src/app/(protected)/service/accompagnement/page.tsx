"use client";
import ListAccompagnement from "@/components/accompagnement/List";
import ListAccompagnementProd from "@/components/accompagnementProd/List";
import { AccompagnementItem } from "@/store/accompagnement/type";
import { Stack } from "@mui/material";
import { useState } from "react";

export default function Accompagnement() {
  const [selected, setSelected] = useState<AccompagnementItem | null>(null);
  return (
    <Stack direction={"row"} gap={2} alignItems="flex-start">
      <ListAccompagnement setSelected={setSelected} selected={selected} />
      {selected && !selected.activite_de_masse && (
        <ListAccompagnementProd
          accompagnementId={selected.id}
          key={selected.id}
        />
      )}
    </Stack>
  );
}
