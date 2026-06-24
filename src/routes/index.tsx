import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, Database, FileText, Sparkles, Stethoscope, Upload } from "lucide-react";
import { useChatMessages, useUploadedFiles } from "@/lib/sehatek-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Sehatek Knowledge System" },
      { name: "description", content: "Overview of your medical RAG workspace: documents, ingestion status, and assistant." },
      { property: "og:title", content: "Dashboard — Sehatek" },
      { property: "og:description", content: "Overview of your medical RAG workspace." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [files] = useUploadedFiles();
  const [messages] = useChatMessages();

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section
        className="rounded-3xl border border-border p-8 sm:p-10 shadow-[var(--shadow-elevated)] relative overflow-hidden"
        style={{ background: "var(--gradient-soft)" }}
      >
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-40 blur-3xl"
             style={{ background: "var(--gradient-primary)" }} />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-card/70 border border-border px-3 py-1 text-[11px] font-medium text-primary mb-4">
            <Sparkles className="h-3 w-3" /> Powered by LlamaParse + Qdrant
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Your medical knowledge,<br />
            <span className="text-primary">grounded and retrievable.</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl">
            Upload clinical PDFs, run the ingestion pipeline, and chat with an AI that cites
            its sources from your indexed library.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/documents"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-elevated)] hover:opacity-95 transition"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Upload className="h-4 w-4" /> Manage Documents
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border border-border bg-card hover:bg-primary-soft hover:text-primary transition"
            >
              <Bot className="h-4 w-4" /> Open Assistant
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<FileText className="h-5 w-5" />} label="Uploaded documents" value={files.length} />
        <StatCard icon={<Database className="h-5 w-5" />} label="Indexed knowledge" value={files.length > 0 ? "Ready" : "Empty"} />
        <StatCard icon={<Bot className="h-5 w-5" />} label="Conversation messages" value={messages.length} />
      </section>

      {/* Quick links */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FeatureCard
          icon={<FileText className="h-5 w-5" />}
          title="Document Management"
          description="Drag-and-drop PDFs, trigger the LlamaParse + Qdrant ingestion pipeline."
          to="/documents"
          cta="Go to Documents"
        />
        <FeatureCard
          icon={<Bot className="h-5 w-5" />}
          title="AI Medical Assistant"
          description="Ask grounded clinical questions and receive markdown answers with sources."
          to="/chat"
          cta="Open Assistant"
        />
      </section>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] flex items-center gap-4">
      <div className="h-11 w-11 rounded-xl bg-primary-soft text-primary flex items-center justify-center">{icon}</div>
      <div>
        <div className="text-2xl font-semibold leading-none">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon, title, description, to, cta,
}: {
  icon: React.ReactNode; title: string; description: string;
  to: "/documents" | "/chat"; cta: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] hover:border-primary/40 transition"
    >
      <div className="flex items-start gap-4">
        <div
          className="h-12 w-12 rounded-xl flex items-center justify-center text-white shrink-0"
          style={{ background: "var(--gradient-primary)" }}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          <span className="inline-block mt-3 text-sm font-medium text-primary group-hover:translate-x-0.5 transition-transform">
            {cta} →
          </span>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 text-[11px] text-muted-foreground">
        <Stethoscope className="h-3.5 w-3.5" />
        Clinical-grade workflow
      </div>
    </Link>
  );
}
