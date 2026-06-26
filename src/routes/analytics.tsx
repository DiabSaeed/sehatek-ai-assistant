import { createFileRoute } from "@tanstack/react-router";
import { PowerBICombinedSurface } from "@/components/sehatek-surfaces";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics Dashboard — Sehatek" }] }),
  component: () => <PowerBICombinedSurface initialTab="interactive" />,
});
