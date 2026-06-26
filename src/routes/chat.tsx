import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Toaster, toast } from "sonner";
import { Bot, FileText, Loader2, Send, Stethoscope, User } from "lucide-react";
import { apiUrl, useChatMessages, useProjects, type ChatMessage } from "@/lib/sehatek-store";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Assistant — Sehatek Knowledge System" },
      { name: "description", content: "Chat with a medical AI assistant grounded in your indexed clinical documents." },
      { property: "og:title", content: "AI Assistant — Sehatek" },
      { property: "og:description", content: "Grounded medical Q&A with source citations." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const { current } = useProjects();
  const [messages, setMessages] = useChatMessages();
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isGenerating]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  async function handleSend() {
    const query = input.trim();
    if (!query || isGenerating) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: query };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsGenerating(true);
    try {
      const res = await fetch(apiUrl("generate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = (await res.json()) as { answer: string; sources?: string[] };
      setMessages((m) => [...m, {
        id: crypto.randomUUID(), role: "assistant",
        content: data.answer ?? "_No answer returned._",
        sources: data.sources ?? [],
      }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      toast.error(msg);
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: `⚠️ ${msg}` }]);
    } finally {
      setIsGenerating(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  return (
    <div className="space-y-4">
      <Toaster position="top-right" richColors theme="system" />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI Medical Assistant</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Grounded answers from your indexed clinical knowledge base.
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-primary-soft transition"
          >
            Clear conversation
          </button>
        )}
      </div>

      <section className="rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] overflow-hidden flex flex-col"
               style={{ height: "calc(100vh - 16rem)" }}>
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5">
          {messages.length === 0 && <EmptyState onPick={(q) => setInput(q)} />}
          {messages.map((m) => <MessageBubble key={m.id} message={m} />)}
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

        <div className="border-t border-border bg-card px-3 sm:px-4 py-3">
          <div className="flex items-end gap-2 rounded-2xl border border-border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring/40 transition">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              rows={1}
              placeholder="Ask a medical question about the indexed documents…"
              className="flex-1 resize-none bg-transparent outline-none text-sm py-1.5 max-h-40"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
              className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 transition shrink-0"
              aria-label="Send"
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-[10.5px] text-muted-foreground mt-2 px-1">
            Responses are generated from your uploaded documents. Verify clinical decisions with a licensed professional.
          </p>
        </div>
      </section>
    </div>
  );
}

function Avatar({ role }: { role: "user" | "assistant" }) {
  if (role === "user") {
    return (
      <div className="h-8 w-8 rounded-xl bg-muted text-foreground flex items-center justify-center shrink-0">
        <User className="h-4 w-4" />
      </div>
    );
  }
  return (
    <div
      className="h-8 w-8 rounded-xl flex items-center justify-center text-white shrink-0"
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
          <div className="rounded-2xl rounded-tl-sm bg-muted/60 border border-border px-4 py-3">
            <div className="md-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
            {message.sources && message.sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-1.5">Sources</p>
                <div className="flex flex-wrap gap-1.5">
                  {message.sources.map((s, i) => (
                    <span key={`${s}-${i}`} className="inline-flex items-center gap-1 text-[11px] rounded-md bg-accent-soft text-accent-foreground px-2 py-0.5 font-medium border border-border">
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
        Responses support markdown tables and include source citations from your indexed PDFs.
      </p>
      <div className="mt-5 grid gap-2 w-full max-w-md">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="text-left text-sm rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-primary-soft/50 px-3 py-2 transition"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
