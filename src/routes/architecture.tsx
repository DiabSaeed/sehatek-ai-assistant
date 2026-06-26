import { createFileRoute } from "@tanstack/react-router";
import { WelcomeSurface } from "@/components/sehatek-surfaces";

export const Route = createFileRoute("/architecture")({
  head: () => ({ meta: [{ title: "Project Architecture Hub — Sehatek" }] }),
  component: WelcomeSurface,
});
