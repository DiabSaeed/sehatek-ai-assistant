import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Toaster, toast } from "sonner";
import {
  Activity,
  Bot,
  Database,
  FileText,
  Loader2,
  Send,
  Sparkles,
  Stethoscope,
  Upload,
  UploadCloud,
  User,
  X,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sehatek Knowledge System" },
      { name: "description", content: "Enterprise Medical RAG assistant — upload, process, and query clinical documents." },
      { property: "og:title", content: "Sehatek Knowledge System" },
      { property: "og:description", content: "Enterprise Medical RAG assistant for clinical knowledge retrieval." },
    ],
  }),
  component: SehatekApp,
});

const API_BASE = "http://localhost:5000";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
};

function SehatekApp() {
  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedAt, setProcessedAt] = useState<string | null>(null);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ----- File handlers -----
  function pickFile(file: File | null) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Only PDF files are supported");
      return;
    }
    setSelectedFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    pickFile(file ?? null);
  }

  async function handleUpload() {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", selectedFile);
      const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      toast.success(`Uploaded ${selectedFile.name}`);
      setUploadedFiles((prev) => [...prev, selectedFile.name]);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleProcess() {
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/process`, { method: "POST" });
      if (!res.ok) throw new Error(`Processing failed (${res.status})`);
      toast.success("Documents processed and indexed");
      setProcessedAt(new Date().toLocaleTimeString());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Processing failed");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleSend() {
    const query = input.trim();
    if (!query || isGenerating) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: query };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsGenerating(true);
    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = (await res.json()) as { answer: string; sources?: string[] };
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.answer ?? "_No answer returned._",
          sources: data.sources ?? [],
        },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      toast.error(msg);
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", content: `⚠️ ${msg}` },
      ]);
    } finally {
      setIsGenerating(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Toaster position="top-right" richColors />

      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-sidebar-border bg-sidebar p-5">
        <div className="flex items-center gap-2.5 mb-8">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-[var(--shadow-elevated)]"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-semibold text-[15px] leading-tight">Sehatek</h1>
            <p className="text-[11px] text-muted-foreground">Knowledge System</p>
          </div>
        </div>

        <nav className="space-y-1 text-sm">
          <NavItem icon={<Activity className="h-4 w-4" />} label="Dashboard" active />
          <NavItem icon={<FileText className="h-4 w-4" />} label="Documents" badge={uploadedFiles.length} />
          <NavItem icon={<Bot className="h-4 w-4" />} label="AI Assistant" />
          <NavItem icon={<Database className="h-4 w-4" />} label="Vector Index" />
        </nav>

        <div className="mt-auto rounded-xl border border-border bg-primary-soft p-4">
          <div className="flex items-center gap-2 text-primary mb-1.5">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-semibold">Powered by RAG</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            LlamaParse + Qdrant pipeline for clinical document retrieval.
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-border bg-card/60 backdrop-blur px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Medical Knowledge Workspace</h2>
            <p className="text-xs text-muted-foreground">
              Ingest clinical PDFs and query them with grounded answers.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft text-accent px-2.5 py-1 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              API: localhost:5000
            </span>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6 p-6 overflow-hidden">
          {/* Document Management */}
          <section className="flex flex-col gap-5 overflow-y-auto pr-1">
            <Card>
              <CardHeader
                icon={<UploadCloud className="h-4 w-4" />}
                title="Document Management"
                subtitle="Upload clinical PDFs to the ingestion queue"
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`mt-4 cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                  isDragging
                    ? "border-primary bg-primary-soft"
                    : "border-border hover:border-primary/50 hover:bg-primary-soft/40"
                }`}
              >
                <div className="mx-auto h-11 w-11 rounded-full bg-primary-soft text-primary flex items-center justify-center mb-3">
                  <Upload className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium">Drop a PDF here, or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">Max 1 file per upload · PDF only</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                />
              </div>

              {selectedFile && (
                <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm truncate">{selectedFile.name}</span>
                    <span className="text-[11px] text-muted-foreground shrink-0">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-1 rounded hover:bg-background text-muted-foreground hover:text-foreground"
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium px-4 py-2.5 shadow-[var(--shadow-soft)] hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" /> Upload Document
                  </>
                )}
              </button>
            </Card>

            <Card>
              <CardHeader
                icon={<Database className="h-4 w-4" />}
                title="Ingestion Pipeline"
                subtitle="Parse, embed, and index uploaded PDFs"
              />

              <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                <div className="flex justify-between mb-1">
                  <span>Uploaded files</span>
                  <span className="font-medium text-foreground">{uploadedFiles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last processed</span>
                  <span className="font-medium text-foreground">{processedAt ?? "—"}</span>
                </div>
              </div>

              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium px-4 py-2.5 text-white shadow-[var(--shadow-elevated)] hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed transition"
                style={{ background: "var(--gradient-primary)" }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Extracting medical tables and generating embeddings…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Process Documents
                  </>
                )}
              </button>

              {uploadedFiles.length > 0 && (
                <ul className="mt-4 space-y-1.5 max-h-44 overflow-y-auto">
                  {uploadedFiles.map((name, i) => (
                    <li
                      key={`${name}-${i}`}
                      className="flex items-center gap-2 text-xs rounded-md border border-border bg-card px-2.5 py-1.5"
                    >
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      <span className="truncate">{name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </section>

          {/* Chat */}
          <section className="flex flex-col rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] overflow-hidden min-h-0">
            <div className="px-5 py-4 border-b border-border flex items-center gap-3">
              <div
                className="h-9 w-9 rounded-lg flex items-center justify-center text-white"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Bot className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">AI Medical Assistant</h3>
                <p className="text-[11px] text-muted-foreground">
                  Grounded answers from your indexed clinical knowledge base
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
              {messages.length === 0 && (
                <EmptyState onPick={(q) => setInput(q)} />
              )}

              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}

              {isGenerating && (
                <div className="flex items-start gap-3">
                  <Avatar role="assistant" />
                  <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 text-sm text-muted-foreground inline-flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    Consulting knowledge base…
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="border-t border-border bg-card px-4 py-3">
              <div className="flex items-end gap-2 rounded-xl border border-border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring/40 transition">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={1}
                  placeholder="Ask a medical question about the indexed documents…"
                  className="flex-1 resize-none bg-transparent outline-none text-sm py-1.5 max-h-40"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isGenerating}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 transition shrink-0"
                  aria-label="Send"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-[10.5px] text-muted-foreground mt-2 px-1">
                Responses are generated from your uploaded documents. Verify clinical decisions with a licensed professional.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
}) {
  return (
    <button
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition ${
        active
          ? "bg-primary-soft text-primary font-medium"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="text-[10px] bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 font-semibold">
          {badge}
        </span>
      )}
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      {children}
    </div>
  );
}

function CardHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function Avatar({ role }: { role: "user" | "assistant" }) {
  if (role === "user") {
    return (
      <div className="h-8 w-8 rounded-lg bg-muted text-foreground flex items-center justify-center shrink-0">
        <User className="h-4 w-4" />
      </div>
    );
  }
  return (
    <div
      className="h-8 w-8 rounded-lg flex items-center justify-center text-white shrink-0"
      style={{ background: "var(--gradient-primary)" }}
    >
      <Bot className="h-4 w-4" />
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <Avatar role={message.role} />
      <div className={`flex flex-col gap-2 max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
        {isUser ? (
          <div className="rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm whitespace-pre-wrap">
            {message.content}
          </div>
        ) : (
          <div className="rounded-2xl rounded-tl-sm bg-muted/60 border border-border px-4 py-3 text-foreground">
            <div className="md-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
            {message.sources && message.sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-1.5">
                  Sources
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {message.sources.map((s, i) => (
                    <span
                      key={`${s}-${i}`}
                      className="inline-flex items-center gap-1 text-[11px] rounded-md bg-accent-soft text-accent px-2 py-0.5 font-medium"
                    >
                      <FileText className="h-3 w-3" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  const suggestions = [
    "Summarize the dosage guidelines from the uploaded protocols.",
    "What are the contraindications mentioned across the documents?",
    "List the diagnostic criteria in a table.",
  ];
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6 py-10">
      <div
        className="h-14 w-14 rounded-2xl flex items-center justify-center text-white mb-4 shadow-[var(--shadow-elevated)]"
        style={{ background: "var(--gradient-primary)" }}
      >
        <Stethoscope className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold">Ask the Medical Knowledge Base</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-md">
        Upload PDFs, run the ingestion pipeline, then ask grounded clinical questions.
        Responses support markdown tables and citations.
      </p>
      <div className="mt-5 grid gap-2 w-full max-w-md">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="text-left text-sm rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary-soft/50 px-3 py-2 transition"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
