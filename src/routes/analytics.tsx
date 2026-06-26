import { createFileRoute } from "@tanstack/react-router";
import { PowerBICombinedSurface, SehatekGlobalStyles, SehatekSubHeader } from "@/components/sehatek-surfaces";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics Dashboard — Sehatek" }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <div className="flex flex-col h-full">
      <SehatekGlobalStyles />
      <SehatekSubHeader activeLabel="Analytics Dashboard" />
      <div className="flex-1 overflow-hidden">
        <PowerBICombinedSurface initialTab="interactive" />
      </div>
    </div>
  );
}
