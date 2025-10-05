"use client";
import ListRepresentation from "@/components/representation/List";
import ListRepresentationProd from "@/components/representationProd/List";
import { RepresentationItem } from "@/store/representation/type";
import { Stack } from "@mui/material";
import { useState } from "react";

export default function Representation() {
  const [selected, setSelected] = useState<RepresentationItem | null>(null);
  return (
    <Stack direction={"row"} gap={2} alignItems="flex-start">
      <ListRepresentation setSelected={setSelected} selected={selected} />
      {selected && (
        <ListRepresentationProd
          representationId={selected.id}
          key={selected.id}
        />
      )}
    </Stack>
  );
}
