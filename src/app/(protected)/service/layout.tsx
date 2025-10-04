"use client";
import SelectTool from "@/components/header-tool/SelectTool";
import React, { Suspense } from "react";

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <SelectTool />
        {children}
      </div>
    </Suspense>
  );
}
