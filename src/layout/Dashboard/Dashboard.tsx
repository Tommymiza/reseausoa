"use client";
import useParameters from "@/hooks/useParameters";
import { Container, Stack } from "@mui/material";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("../Navbar/Navbar"), {
  ssr: false,
});
export default function Dashboard({ children }: { children: React.ReactNode }) {
  useParameters();
  return (
    <Stack>
      <Navbar />
      <Container maxWidth={false}>{children}</Container>
    </Stack>
  );
}
