"use client";
import theme from "@/lib/theme";
import { ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ConfirmProvider } from "material-ui-confirm";
import React from "react";
import { Toaster } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <Toaster position="top-right" richColors />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ConfirmProvider>{children}</ConfirmProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
