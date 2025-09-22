"use client";
import theme from "@/lib/theme";
import { Container, Stack, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import dynamic from "next/dynamic";
import { Toaster } from "sonner";

const Navbar = dynamic(() => import("../Navbar/Navbar"), {
  ssr: false,
});
export default function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <Stack>
        <Toaster position="top-right" richColors />
        <Navbar />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Container maxWidth={false}>{children}</Container>
        </LocalizationProvider>
      </Stack>
    </ThemeProvider>
  );
}
