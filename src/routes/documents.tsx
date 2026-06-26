import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { Database, FileText, Loader2, Sparkles, Upload, UploadCloud, X } from "lucide-react";
import { apiUrl, useProjects, useUploadedFiles } from "@/lib/sehatek-store";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents — Sehatek Knowledge System" },
      { name: "description", content: "Upload clinical PDFs and run the ingestion pipeline to index them in the vector store." },
      { property: "og:title", content: "Documents — Sehatek" },
      { property: "og:description", content: "Upload and process clinical PDFs for the RAG knowledge base." },
    ],
  }),
  component: DocumentsPage,
});

function DocumentsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedAt, setProcessedAt] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useUploadedFiles();
  const { current } = useProjects();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    pickFile(e.dataTransfer.files?.[0] ?? null);
  }

  async function handleUpload() {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", selectedFile);
      const res = await fetch(apiUrl("upload"), { method: "POST", body: fd });
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
      const res = await fetch(apiUrl("process"), { method: "POST" });
      if (!res.ok) throw new Error(`Processing failed (${res.status})`);
      toast.success("Documents processed and indexed");
      setProcessedAt(new Date().toLocaleTimeString());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Processing failed");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" richColors theme="system" />

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Document Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload clinical PDFs, then run the ingestion pipeline to embed and index them.
        </p>
        {current && (
          <div className="mt-2 inline-flex items-center gap-2 text-[11px] rounded-full bg-primary-soft text-primary px-2.5 py-1 font-medium border border-border">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {current.name}
            <span className="text-muted-foreground font-normal">· {current.id.slice(0, 8)}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload card */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <CardHeader icon={<UploadCloud className="h-4 w-4" />} title="Upload PDF" subtitle="Add a clinical document to the queue" />

          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-5 cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
              isDragging ? "border-primary bg-primary-soft" : "border-border hover:border-primary/50 hover:bg-primary-soft/40"
            }`}
          >
            <div className="mx-auto h-12 w-12 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mb-3">
              <Upload className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium">Drop a PDF here, or click to browse</p>
            <p className="text-xs text-muted-foreground mt-1">PDF only · up to 50 MB</p>
            <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" className="hidden"
                   onChange={(e) => pickFile(e.target.files?.[0] ?? null)} />
          </div>

          {selectedFile && (
            <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm truncate">{selectedFile.name}</span>
                <span className="text-[11px] text-muted-foreground shrink-0">{(selectedFile.size / 1024).toFixed(1)} KB</span>
              </div>
              <button onClick={() => setSelectedFile(null)} className="p-1 rounded hover:bg-background text-muted-foreground hover:text-foreground" aria-label="Remove file">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium px-4 py-2.5 shadow-[var(--shadow-soft)] hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isUploading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>) : (<><Upload className="h-4 w-4" /> Upload Document</>)}
          </button>
        </section>

        {/* Process card */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <CardHeader icon={<Database className="h-4 w-4" />} title="Ingestion Pipeline" subtitle="Parse, embed, and index uploaded PDFs" />

          <div className="mt-5 rounded-xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground space-y-2">
            <Row label="Uploaded files" value={uploadedFiles.length} />
            <Row label="Last processed" value={processedAt ?? "—"} />
            <Row label="Vector store" value="Qdrant" />
          </div>

          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium px-4 py-2.5 text-white shadow-[var(--shadow-elevated)] hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed transition"
            style={{ background: "var(--gradient-primary)" }}
          >
            {isProcessing ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Extracting medical tables and generating embeddings…</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Process Documents</>
            )}
          </button>
        </section>
      </div>

      {/* File list */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
        <CardHeader icon={<FileText className="h-4 w-4" />} title="Uploaded files" subtitle={`${uploadedFiles.length} document${uploadedFiles.length === 1 ? "" : "s"} in queue`} />
        {uploadedFiles.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No documents yet. Upload a PDF to get started.
          </div>
        ) : (
          <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {uploadedFiles.map((name, i) => (
              <li key={`${name}-${i}`} className="flex items-center gap-2 text-sm rounded-xl border border-border bg-background/60 px-3 py-2">
                <FileText className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">{name}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function CardHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
