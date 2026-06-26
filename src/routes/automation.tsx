import { createFileRoute } from "@tanstack/react-router";
import { AutomationPipelines } from "@/components/sehatek-surfaces";

export const Route = createFileRoute("/automation")({
  head: () => ({ meta: [{ title: "Automation Core — Sehatek" }] }),
  component: AutomationPipelines,
});
