import { createFileRoute } from "@tanstack/react-router";
import { AutomationPipelines, SehatekGlobalStyles, SehatekSubHeader } from "@/components/sehatek-surfaces";

export const Route = createFileRoute("/automation")({
  head: () => ({ meta: [{ title: "Automation Core — Sehatek" }] }),
  component: AutomationPage,
});

function AutomationPage() {
  return (
    <div className="flex flex-col h-full">
      <SehatekGlobalStyles />
      <SehatekSubHeader activeLabel="Automation Core" />
      <div className="flex-1 overflow-hidden">
        <AutomationPipelines />
      </div>
    </div>
  );
}
