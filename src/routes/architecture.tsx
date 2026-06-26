import { createFileRoute } from "@tanstack/react-router";
import { SehatekGlobalStyles, SehatekSubHeader, WelcomeSurface } from "@/components/sehatek-surfaces";

export const Route = createFileRoute("/architecture")({
  head: () => ({ meta: [{ title: "Project Architecture Hub — Sehatek" }] }),
  component: ArchitecturePage,
});

function ArchitecturePage() {
  return (
    <div className="flex flex-col h-full">
      <SehatekGlobalStyles />
      <SehatekSubHeader activeLabel="Home" />
      <div className="flex-1 overflow-hidden">
        <WelcomeSurface />
      </div>
    </div>
  );
}
