import { AuthLayout } from "@/layout/AuthLayout/AuthLayout";
import Dashboard from "@/layout/Dashboard/Dashboard";
import React from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthLayout>
      <Dashboard>{children}</Dashboard>
    </AuthLayout>
  );
}
