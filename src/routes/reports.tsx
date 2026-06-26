import { createFileRoute } from "@tanstack/react-router";
import { PowerBICombinedSurface, SehatekGlobalStyles, SehatekSubHeader } from "@/components/sehatek-surfaces";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Report Builder — Sehatek" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <div className="flex flex-col h-full">
      <SehatekGlobalStyles />
      <SehatekSubHeader activeLabel="Report Builder" />
      <div className="flex-1 overflow-hidden">
        <PowerBICombinedSurface initialTab="paginated" />
      </div>
    </div>
  );
}
