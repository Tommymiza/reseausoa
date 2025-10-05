"use client";
import ListAchat from "@/components/achat/List";
import ListAchatArticle from "@/components/achatArticle/List";
import { AchatItem } from "@/store/achat/type";
import { Stack } from "@mui/material";
import { useState } from "react";

export default function AchatGroupe() {
  const [selected, setSelected] = useState<AchatItem | null>(null);
  return (
    <Stack direction="row" gap={2} alignItems="flex-start">
      <ListAchat setSelected={setSelected} selected={selected} />
      {selected && (
        <ListAchatArticle selectedAchat={selected.id} key={selected.id} />
      )}
    </Stack>
  );
}
