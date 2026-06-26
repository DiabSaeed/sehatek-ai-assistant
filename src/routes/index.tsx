import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bot, Check, Database, FileText, MessageSquare, Plus, Sparkles, Stethoscope, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { getProjectCounts, useChatMessages, useProjects, useUploadedFiles } from "@/lib/sehatek-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Sehatek Knowledge System" },
      { name: "description", content: "Overview of your medical RAG workspace: projects, documents, and assistant." },
      { property: "og:title", content: "Dashboard — Sehatek" },
      { property: "og:description", content: "Overview of your medical RAG workspace." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [files] = useUploadedFiles();
  const [messages] = useChatMessages();
  const { projects, currentId, current, setCurrent, create, remove } = useProjects();
  const navigate = useNavigate();
  const [newName, setNewName] = useState("");

  function handleOpen(id: string) {
    setCurrent(id);
    navigate({ to: "/chat" });
  }

  function handleCreate() {
    const p = create(newName);
    setNewName("");
    navigate({ to: "/chat" });
    return p;
  }

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
          {current && (
            <div className="mt-4 inline-flex items-center gap-2 text-xs rounded-full bg-card/80 border border-border px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span className="font-medium">Active project:</span>
              <span className="text-primary font-semibold">{current.name}</span>
              <span className="text-muted-foreground font-mono">· {current.id.slice(0, 8)}</span>
            </div>
          )}
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
        <StatCard icon={<FileText className="h-5 w-5" />} label="Documents in this project" value={files.length} />
        <StatCard icon={<Database className="h-5 w-5" />} label="Indexed knowledge" value={files.length > 0 ? "Ready" : "Empty"} />
        <StatCard icon={<MessageSquare className="h-5 w-5" />} label="Messages in this project" value={messages.length} />
      </section>

      {/* Projects panel */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">Your Projects</h2>
              <p className="text-xs text-muted-foreground">
                Each project has its own <code className="font-mono">project_id</code> used in API calls (e.g. <code className="font-mono">/generate/&#123;project_id&#125;</code>).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
              placeholder="New project name…"
              className="h-9 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40 w-56"
            />
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-sm font-medium text-white shadow-[var(--shadow-soft)] hover:opacity-95 transition"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Plus className="h-4 w-4" /> New project
            </button>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No projects yet — create one to get started.
          </div>
        ) : (
          <ul className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            {[...projects].sort((a, b) => b.lastActiveAt - a.lastActiveAt).map((p) => {
              const counts = getProjectCounts(p.id);
              const isActive = p.id === currentId;
              return (
                <li
                  key={p.id}
                  className={`group rounded-2xl border bg-background/60 p-4 transition shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] ${
                    isActive ? "border-primary/60 ring-1 ring-primary/30" : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{p.name}</h3>
                        {isActive && (
                          <span className="inline-flex items-center gap-1 text-[10px] rounded-full bg-accent-soft text-accent-foreground px-1.5 py-0.5 border border-border">
                            <Check className="h-3 w-3" /> Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground font-mono truncate">{p.id}</p>
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><FileText className="h-3 w-3" /> {counts.files} docs</span>
                        <span className="inline-flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {counts.messages} msgs</span>
                        <span>· {new Date(p.lastActiveAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => handleOpen(p.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium px-3 py-2 hover:opacity-90 transition"
                    >
                      <Bot className="h-3.5 w-3.5" /> Open chat
                    </button>
                    {!isActive && (
                      <button
                        onClick={() => setCurrent(p.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card text-xs font-medium px-3 py-2 hover:bg-primary-soft hover:text-primary transition"
                      >
                        Set active
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm(`Delete project "${p.name}"? This removes its files and chat history.`)) remove(p.id);
                      }}
                      className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 transition"
                      aria-label="Delete project"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
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
