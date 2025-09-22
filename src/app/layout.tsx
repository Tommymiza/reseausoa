import Dashboard from "@/layout/Dashboard/Dashboard";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Réseau soa",
  description: "Organisation paysanne",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <Dashboard>{children}</Dashboard>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
