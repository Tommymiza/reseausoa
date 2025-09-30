"use client";
import ListOpr from "@/components/membre/List";
import { Suspense } from "react";

export default function OprPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ListOpr />
    </Suspense>
  );
}
