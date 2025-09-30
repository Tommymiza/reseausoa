"use client";
import ListUser from "@/components/utilisateur/List";
import { Suspense } from "react";

export default function OprPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ListUser />
    </Suspense>
  );
}
