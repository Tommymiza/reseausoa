"use client";

import ListJeune from "@/components/jeune/List";
import ListSuiviJeune from "@/components/suiviJeune/List";
import { JeuneItem } from "@/store/jeune/type";
import { Stack } from "@mui/material";
import { useState } from "react";

export default function JeunePage() {
  const [selected, setSelected] = useState<JeuneItem | null>(null);
  return (
    <Stack direction="row" gap={2} alignItems="flex-start">
      <ListJeune setSelected={setSelected} selected={selected} />
      {selected && <ListSuiviJeune jeuneId={selected.id} key={selected.id} />}
    </Stack>
  );
}
