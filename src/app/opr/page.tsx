"use client";
import ListOpr from "@/components/opr/List";
import { Suspense } from "react";

export default function OprPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ListOpr />
    </Suspense>
  );
}
