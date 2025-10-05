"use client";
import ListSanteAnimale from "@/components/santeAnimale/List";
import { Stack } from "@mui/material";

export default function SanteAnimale() {
  return (
    <Stack direction={"row"} gap={2} alignItems="flex-start">
      <ListSanteAnimale />
    </Stack>
  );
}
