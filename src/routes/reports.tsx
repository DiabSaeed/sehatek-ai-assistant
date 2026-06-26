import { createFileRoute } from "@tanstack/react-router";
import { PowerBICombinedSurface } from "@/components/sehatek-surfaces";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Report Builder — Sehatek" }] }),
  component: () => <PowerBICombinedSurface initialTab="paginated" />,
});
